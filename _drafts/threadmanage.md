---
layout: post
title: Windows 下的线程管理浅谈
categories: Windows
description: Windows 下优雅的线程管理技术探讨。
keywords: 线程
---

想要写这样一篇关于如何优雅地进行 Windows 下的线程管理的文章很久了，迟迟没有动工。其一当然是因为懒；其二，是我确实至今仍未找到一个能够真正「优雅」并且完美地让所有线程及时安全退出的方式。

这让我开始思考是不是应该调整努力的方向，向着「绝对的 / 完美的优雅」探索，但是能接受「相对的 / 有缺陷的优雅」。

当我想创建一个线程去帮我异步干一些活的时候，在程序猿生涯初期，也许我会这么做：

```
CreateThread(NULL, 0, ThreadFunc, pParam, 0, NULL);
```

后来读到了《Windows 核心编程》里关于线程的相关章节，知道了链接 CRT 的 C/C++ 程序应该使用`_beginthreadex`而非`CreateThread`来创建线程，于是代码变成了这样：

```
_beginthreadex(NULL, 0, ThreadFunc, 0, NULL);
```

再后来一点，留意到了 MSDN 上对`CreateThread`函数讲解的这么两句话：

> When a thread terminates, the thread object attains a signaled state, satisfying any threads that were waiting on the object.
>
> The thread object remains in the system until the thread has terminated and all handles to it have been closed through a call to CloseHandle.

所以在不需要的时候，还是忙不迭地把线程句柄关掉吧！不然线程对象会一直逗留在进程里不回收。于是代码又变成了这样：

```
HANDLE hThread = (HANDLE)_beginthreadex(NULL, 0, ThreadFunc, 0, NULL);

...

CloseHandle(hThread);
```

但是其实回头看一下，到这个地步为止，线程都是处于不受管控的状态，就像大家口中的「野指针」一样，是「野线程」。
