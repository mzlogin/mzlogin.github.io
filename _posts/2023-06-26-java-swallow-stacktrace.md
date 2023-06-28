---
layout: post
title: 解决 Java 打印日志吞异常堆栈的问题
categories: [Java]
description: 解决 Java 打印日志吞异常堆栈的问题
keywords: Java
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

前几天有同学找我查一个空指针问题，Java 打印日志时，异常堆栈信息被吞了，导致定位不到出问题的地方。

## 现象

捕获异常打印日志的代码类似这样：

```java
try {
    // ...
} catch (Exception e) {
    log.error("系统异常 customerCode:{},data:{}", customerCode, data, e);
    // ...
}
```

查到的日志是这样的：

```text
2023-06-26 11:11:11.111 ERROR 1 --- [pool-1-thread-1] c.mazhuang.service.impl.TestServiceImpl  : 系统异常 customerCode:123,data:{"name":"mazhuang","age":18}
java.lang.NullPointerException: null
```

异常堆栈丢了。

## 分析

在之前的一篇文章里已经验证过这种写法是可以正常打印异常和堆栈信息的：[AI 自动补全的这句日志能正常打印吗？](https://mazhuang.org/2023/05/10/can-this-log-print-work/)

再三确认代码写法没问题，纳闷之下只好搜索了一下关键词「Java异常堆栈丢失」，发现了这篇文章：[Java异常堆栈丢失的现象及解决方法][1]，这里面提到的问题与我们遇到的一样，而且给出了 Oracle 官方文档里的相关说明：

> [https://www.oracle.com/java/technologies/javase/release-notes-introduction.html][2]
>
> The compiler in the server VM now provides correct stack backtraces for all "cold" built-in exceptions. For performance purposes, when such an exception is thrown a few times, the method may be recompiled. After recompilation, the compiler may choose a faster tactic using preallocated exceptions that do not provide a stack trace. To disable completely the use of preallocated exceptions, use this new flag: -XX:-OmitStackTraceInFastThrow.

大致意思就是说，为了提高性能，JVM 会针对一些内建异常进行优化，在这些异常被某方法多次抛出时，JVM 可能会重编译该方法，这时候就可能会使用不提供堆栈信息的预分配异常。如果想要完全禁用预分配异常，可以使用 `-XX:-OmitStackTraceInFastThrow` 参数。

了解到这个信息后，翻了翻从服务上次发版以来的这条日志，果然最早的十几次打印是有异常堆栈的，后面就没有了。

## 解决方案

- 回溯历史日志，找到正常打印的堆栈信息，定位和解决问题；
- 也可以考虑在 JVM 参数里加上 `-XX:-OmitStackTraceInFastThrow` 参数，禁用优化；

## 本地复现

在本地写一个简单的程序复现一下：

```java
public class StackTraceInFastThrowDemo {
    public static void main(String[] args) {
        int count = 0;
        boolean flag = true;
        while (flag) {
            try {
                count++;
                npeTest(null);
            } catch (Exception e) {
                int stackTraceLength = e.getStackTrace().length;
                System.out.printf("count: %d, stacktrace length: %d%n", count, stackTraceLength);
                if (stackTraceLength == 0) {
                    flag = false;
                }
            }
        }
    }

    public static void npeTest(Integer i) {
        System.out.println(i.toString());
    }
}
```

不添加 `-XX:-OmitStackTraceInFastThrow` 作为 JVM 参数时，运行结果如下：

```text
...
count: 5783, stacktrace length: 2
count: 5784, stacktrace length: 2
count: 5785, stacktrace length: 0

Process finished with exit code 0
```

在我本机一般运行五六千次后，会出现异常堆栈丢失的情况。

添加 `-XX:-OmitStackTraceInFastThrow` 作为 JVM 参数时，运行结果如下：

```text
...
count: 3146938, stacktrace length: 2
count: 3146939, stacktrace length: 2
count: 3146940, stacktrace length: 
Process finished with exit code 137 (interrupted by signal 9: SIGKILL)
```

运行了几百万次也不会出现异常堆栈丢失的情况，手动终止程序。

完整源码见：<https://github.com/mzlogin/java-notes/blob/master/src/org/mazhuang/StackTraceInFastThrowDemo.java>

## 参考

- [https://www.cnblogs.com/junejs/p/12686906.html][1]
- [https://www.oracle.com/java/technologies/javase/release-notes-introduction.html][2]

[1]: https://www.cnblogs.com/junejs/p/12686906.html
[2]: https://www.oracle.com/java/technologies/javase/release-notes-introduction.html
