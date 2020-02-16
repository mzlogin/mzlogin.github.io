---
layout: post
title: Java堆外内存的回收机制
categories: Java
description: Java堆外内存的回收机制
keywords: JAVA
---
在使用堆内内存（on-heap memory）的时候，完全遵守JVM虚拟机的内存管理机制，采用垃圾回收器（GC）统一进行内存管理，GC会在某些特定的时间点进行一次彻底回收，也就是Full GC，GC会对所有分配的堆内内存进行扫描。堆外内存就是把内存对象分配在Java虚拟机的堆以外的内存，这些内存直接受操作系统管理（而不是虚拟机），这样做的结果就是能够在一定程度上减少垃圾回收对应用程序造成的影响。参考博文：[JVM堆外内存详解](https://blog.csdn.net/Searchin_R/article/details/84570021)

## 堆外内存的申请和释放

JDK的ByteBuffer类提供了一个接口allocateDirect（int capacity）进行堆外内存的申请。

底层通过unsafe.allocateMemory(size)实现，Netty、Mina等框架提供的接口也是基于ByteBuffer封装的。

可以发现，unsafe.allocateMemory(size)的最底层是通过malloc方法申请的，但是这块内存需要进行手动释放，JVM并不会进行回收，幸好Unsafe提供了另一个接口freeMemory可以对申请的堆外内存进行释放。

从DirectByteBuffer()的构造方法代码我们可以知道，在Cleaner 内部中通过一个列表，维护了针对每一个 directBuffer 的一个回收堆外内存的线程对象(Runnable)，而回收操作就是发生在 Cleaner 的 clean() 方法中。

上文说到，**“unsafe.allocateMemory(size)的最底层是通过malloc方法申请的，但是这块内存需要进行手动释放，JVM并不会进行回收，幸好Unsafe提供了另一个接口freeMemory可以对申请的堆外内存进行释放**。”。那岂不是每一次申请堆外内存的时候，**都需要在代码中显式释放吗？**

![no](/images/posts/java/no.PNG)

很明显，并不是这样的，这种情况的出现对于Java这门语言来说显然不够合理。那既然JVM不会管理这些堆外内存，它们又是怎么回收的呢？ 

这里就要祭出大杀器了：**DirectByteBuffer**。

JDK中使用DirectByteBuffer对象来表示堆外内存，每个DirectByteBuffer对象在初始化时，都会创建一个对应的Cleaner对象，这个Cleaner对象会在合适的时候执行unsafe.freeMemory(address)，从而回收这块堆外内存。

当初始化一块堆外内存时，对象的引用关系如下：

![directByteBuffer1](/images/posts/java/directByteBuffer1.png)

其中**first**是**Cleaner**类的静态变量，**Cleaner**对象在初始化时会被添加到**Clener链表**中，和**first**形成引用关系，**ReferenceQueue**是用来保存**需要回收的Cleaner对象**。

如果该DirectByteBuffer对象在一次GC中被回收了，即

![directByteBuffer2](/images/posts/java/directByteBuffer2.png)

此时，只有**Cleaner对象**唯一保存了堆外内存的数据（开始地址、大小和容量），在**下一次FGC时**，把该**Cleaner对象放入到ReferenceQueue中，并触发clean方法**。

Cleaner对象的clean方法主要有两个作用：
1. 把自身从Cleaner链表删除，从而在下次GC时能够被回收
2. 释放堆外内存

源码如下：

``` java
public void run() {
    if (address == 0) {
        // Paranoia
        return;
    }
    unsafe.freeMemory(address);
    address = 0;
    Bits.unreserveMemory(size, capacity);
}
```

看到这里，可能有人会想，如果JVM一直没有执行FGC的话，无效的Cleaner对象就无法放入到ReferenceQueue中，从而堆外内存也一直得不到释放，无效内存就会很大，那怎么办？ 

这个倒不用担心，那些大神们当然早就考虑到这一种情况了。

其实，在初始化DirectByteBuffer对象时，会自动去判断，如果堆外内存的环境很友好，那么就申请堆外内存；**如果当前堆外内存的条件很苛刻时（即有很多无效内存没有得到释放），这时候就会主动调用System.gc()强制执行FGC**，从而释放那些无效内存。

为了避免这种悲剧的发生，也可以通过-XX:MaxDirectMemorySize来指定最大的堆外内存大小，当使用达到了阈值的时候将调用System.gc来做一次full gc，以此来回收掉没有被使用的堆外内存。

当然，源程序毕竟不是万能的，做项目的时候经常有千奇百怪的情况出现。

比如很多线上环境的JVM参数有-XX:+DisableExplicitGC，导致了System.gc()等于一个空函数，根本不会触发FGC，因此在使用堆外内存时，要格外小心，防止内存一直得不到释放，造成线上故障。这一点在使用Netty框架时需要格外注意。

总而言之，不论是什么东西，都不是绝对安全的。对于各类代码，我们都得多加留心。

## System.gc的作用有哪些

使用了System.gc的作用是什么？
1. 做一次full gc
2. 执行后会暂停整个进程。
3. System.gc我们可以禁掉，使用-XX:+DisableExplicitGC，其实一般在cms gc下我们通过-XX:+ExplicitGCInvokesConcurrent也可以做稍微高效一点的gc，也就是并行gc。
4. 最常见的场景是RMI/NIO下的堆外内存分配等

注：
如果我们使用了堆外内存，并且用了DisableExplicitGC设置为true，那么就是禁止使用System.gc，这样堆外内存将无从触发极有可能造成内存溢出错误（这种情况在四中有提及），在这种情况下可以考虑使用ExplicitGCInvokesConcurrent参数。

说起Full gc我们最先想到的就是stop thd world，这里要先提到VMThread，在jvm里有这么一个线程不断轮询它的队列，这个队列里主要是存一些VM_operation的动作，比如最常见的就是内存分配失败要求做GC操作的请求等，在对gc这些操作执行的时候会先将其他业务线程都进入到安全点，也就是这些线程从此不再执行任何字节码指令，只有当出了安全点的时候才让他们继续执行原来的指令，因此这其实就是我们说的stop the world(STW)，整个进程相当于静止了。

## 总结

使用堆外内存的优点：
1. 可以扩展至**更大的内存空间**。比如超过1TB甚至比主存还大的空间;
2. **减少了垃圾回收**（因为垃圾回收会暂停其他的工作。）;
3. 可以在进程间共享，**减少JVM间的对象复制**，使得JVM的分割部署更容易实现（堆内在flush到远程时，会先复制到直接内存（非堆内存），然后在发送；而堆外内存相当于省略掉了这个工作。）;
4. 它的持久化存储可以支持快速重启，同时还能够在测试环境中重现生产数据
5. 站在系统设计的角度来看，使用堆外内存可以为你的设计提供更多可能。最重要的提升并不在于性能，而是决定性的

NIO申请直接内存总结：
我们用NIO类申请的内存其实是由jvm进行回收的，并不像unsave那样要我们自己对内存进行管理。这时候系统是不断回收直接内存的，由NIO申请的直接内存是需要System.gc()来进行内存回收的。系统会帮助我们回收直接内存的。不过为了提高gc的利用率，我们可能会在代码中加入-XX:+DisableExplicit禁止代码中显示调用gc(System.gc)。采取并行gc，就是由jvm来自动管理内存回收，而jvm主要是管理堆内内存，也就是当对堆内对象回收的时候，才有可能回收直接内存，这种不对称性很有可能产生直接内存内存泄漏。需要注意的是当我们没有指向堆外内存的引用的时候，也会把直接内存回收。

采用直接内存的优点：
1. 对于频繁的io操作，我们需要不断把内存中的对象复制到直接内存。然后由操作系统直接写入磁盘或者读出磁盘。这时候用到直接内存就减少了堆的内外内存来回复制的操作。
2. 我们在运行程序的过程中可能需要新建大量对象，对于一些声明周期比较短的对象，可以采用对象池的方式。但是对于一些生命周期较长的对象来说，不需要频繁调用gc，为了节省gc的开销，直接内存是必备之选。
3. 扩大程序运行的内存，由于jvm申请的内存有限，这时候可以通过堆外内存来扩大内存。

