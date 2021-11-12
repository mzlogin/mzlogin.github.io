---
layout: wiki
title: 进程
cate1: Basis
cate2:
description: 进程
keywords: Basis
---

## 用户空间与内核空间

> 现代操作系统上，物理内存不再对程序可见，也就是说，程序指令以及其访问数据都处在虚拟地址空间，机器通过一个叫做 MMU 的机构将其映射为真实的物理内存页面。

而进程的空间实际上被分为了两个部分，一部分供进程使用，称为用户空间，一部分供内核使用，称为内核空间。用户空间是进程间隔离的，内核空间是共享的。

> 具体到 4GB 内存的 32 位 Windows 系统上，低 2GB 是用户空间，高 2GB 是内核空间，也就是说每个进程看到的高 2GB 空间的内容是一样的。而 Linux 系统将高 1GB 空间映射为内核空间，对应低 1GB 的物理内存。（有 3GB/1GB，2GB/2GB，4GB/4GB 等模式，以上参数实际上可调。）

> 程序运行在用户态时为了要访问内核的资源，必须经过内核提供的接口，通过系统调用（Linux 下就是 int 0x80）中断，中断号由 eax 传入，参数由 ebx ecx edx 压栈等方式传入，发生了中断则现场保护，控制权交给内核，由内核根据中断号调用相应函数，结束后清栈，pc 指向原保存的返回地址，回到用户态。

## 参考

* [Kernel Space Definition](http://www.linfo.org/kernel_space.html)
* [用户空间/内核空间](http://bbs.csdn.net/topics/330137042)
* [Windows/Linux内核地址空间管理的异同](http://blog.csdn.net/dog250/article/details/16356141)
