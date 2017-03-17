---
layout: post
title: Java 对象释放与 finalize 方法
categories: Java
description: 关于 Java 对象释放的疑惑解答，以及 finalize 方法的相关知识。
keywords: java, finalize, release
---

本文谈论的知识很浅显，只是我发现自己掌握的相关知识并不扎实，对细节并不清楚，遂将疑惑解开，并记录于此。

按惯例先上结论，对如下知识点已经清楚的选手可以省下看本文的时间了。

## 结论

1. 对象的 `finalize` 方法不一定会被调用，即使是进程退出前。

2. 发生 GC 时一个对象的内存是否释放取决于是否存在该对象的引用，如果该对象包含对象成员，那对象成员也遵循本条。

3. 对象里包含的对象成员按声明顺序进行释放。

## 证明

假设有以下类定义：

```java
class A {
    public A() {
        System.out.println("A()");
    }

    protected void finalize() {
        System.out.println("~A()");
    }

    B b;
}

class B {
    public B() {
        System.out.println("B()");
    }

    protected void finalize() {
        System.out.println("~B()");
    }
}
```

### 结论 1 证明

在 `main` 方法中有如下代码：

```java
A a = new A();
B b = new B();
a.b = b;
a = null;
```

输出是什么呢？

```
A()
B()
```

与我想象中的有些不一样，我以为至少在进程退出前 A 类对象和 B 类对象都会被释放掉的。

我们明确一下 `finalize` 方法的调用时机，引用官方 API 文档的解释：

> Called by the garbage collector on an object when garbage collection determines that there are no more references to the object. A subclass overrides the finalize method to dispose of system resources or to perform other cleanup.

也就是说，`finalize` 是在 JVM 执行 GC 的时候才会执行的，而很显然，在这个例子里 `main` 方法退出时并没有执行 GC，而 GC 是否执行以及其执行的时机并不是我们可以精确控制的，此即证明了**结论 1**。

### 结论 2 证明

虽然我们不能精确控制 GC 的时机，但我们可以给 JVM 建议，比如我们在最后加个 `System.gc()` 建议 JVM 进行 GC。

```java
A a = new A();
B b = new B();
a.b = b;
a = null;
System.gc();
```

现在输出变成了

```
A()
B()
~A()
```

可见 JVM 听从了我们的建议，执行了 GC，由于此时 A 类对象已经没有引用了，所以它被释放，而该对象的 B 类对象成员由于被局部变量 b 引用，此时不会释放。

而一个在 GC 时对象成员也会被释放的 A 类对象调用是怎么样的呢？

```java
A a = new A();
a.b = new B();
a = null;
System.gc();
```

此时输出为

```
A()
B()
~B()
~A()
```

如上两段代码执行结果的对比证明了**结论 2**。

另外需要说明的是，Runtime 类里有一个 `runFinalizersOnExit` 方法，可以让程序在退出时执行所有对象的未被自动调用 `finalize` 方法，**即使该对象仍被引用**。但是从官方文档可以看出，该方法已经废弃，不建议使用，引用官方 API 文档如下：

> **Deprecated.** *This method is inherently unsafe. It may result in finalizers being called on live objects while other threads are concurrently manipulating those objects, resulting in erratic behavior or deadlock.*
>
> Enable or disable finalization on exit; doing so specifies that the finalizers of all objects that have finalizers that have not yet been automatically invoked are to be run before the Java runtime exits. By default, finalization on exit is disabled.

而同样是 Runtime 类里的 `runFinalization` 方法则在调用后并没有看到明显的效果，即如果不发生 GC，那即使调用了 `runFinalization` 方法，已经待回收的对象的 `finalize` 方法依然没有被调用。

### 结论 3 证明

我们修改一下几个类的定义：

```java
class A {
    public A() {
        System.out.println("A()");
    }

    protected void finalize() {
        System.out.println("~A()");
    }

    B b;    // line a
    C c;    // line b
}

class B {
    public B() {
        System.out.println("B()");
    }

    protected void finalize() {
        System.out.println("~B()");
    }
}

class C {
    public C() {
        System.out.println("C()");
    }

    protected void finalize() {
        System.out.println("~C()");
    }
}
```

现在在 `main` 方法里有如下调用：

```java
A a = new A();
a.b = new B();
a.c = new C();
a = null;
System.gc();
```

输出是

```
A()
B()
C()
~B()
~C()
~A()
```

而如果我们互换一下 A 类声明带注释的 line a 与 line b 的位置，即变成

```java
C c;    // line b
B b;    // line a
```

输出变成

```
A()
B()
C()
~C()
~B()
~A()
```

此即证明了**结论 3**。
