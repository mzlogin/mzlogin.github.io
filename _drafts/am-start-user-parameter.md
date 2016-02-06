---
layout: post
title: am start 的 --user 参数详解
categories: Android
description: am start 命令有时并不会乖乖如我们所愿，这时候我们需要知对策并知其所以然。
keywords: am start, user, adb
---

我估计你之所以来看这篇文章，是因为遇到了如下异常：

```java
java.lang.SecurityException: Permission Denial: startActivity asks to run as user -2 but is calling from user 0; this requires android.permission.INTERACT_ACROSS_USERS_FULL
    at android.os.Parcel.readException(Parcel.java:1425)
    at android.os.Parcel.readException(Parcel.java:1379)
    at android.app.ActivityManagerProxy.startActivityAsUser(ActivityManagerNative.java:1921)
    at com.android.commands.am.Am.runStart(Am.java:494)
    at com.android.commands.am.Am.run(Am.java:109)
    at com.android.commands.am.Am.main(Am.java:82)
    at com.android.internal.os.RuntimeInit.nativeFinishInit(Native Method)
    at com.android.internal.os.RuntimeInit.main(RuntimeInit.java:235)
```

先就我所了解的知识说一下此异常发生的背景。

## 背景

### Android 系统里的多用户

Android 系统是基于 Linux 内核，而 Linux 内核中用于支持多用户机制的 uid 在 Android 中被用于标识 app-specific sandbox。[android.os.Process 类的 myUid() 方法][1] 的描述里的原话是：

> Returns the identifier of this process's uid. This is the kernel uid that the process is running under, which is the identity of its app-specific sandbox. It is different from myUserHandle() in that a uid identifies a specific app sandbox in a specific user.

所以注定 Android 如果要实现多用户不能直接使用 Linux 的 uid 机制了，需要另做一套机制。

在 Android API level 17 的 Features 列表里有一项是

> Multiple user accounts (tablets only)

所以在 API level 17 以上的 Android 系统里其实已经内置了多用户的支持，只不过暂时只对平板启用（据说是因为多用户手机专利早已被 Symbian 雇员注册，不知真假。）。在实现上是新引入了 [UserHandle][3] 的概念，封装了 user id，在 [android.os.Process 类的 myUserHandle() 方法][2] 的描述里的原话是：

> Returns this process's user handle. This is the user the process is running under. It is distinct from myUid() in that a particular user will have multiple distinct apps running under it each with their own uid.

### user id 与 uid

**结论**

1. user id = uid / 100000
2. 目前 Android 手机上所有 APP 的 user id 都为 0
3. root 权限与 uid 是否为 0 有关，与 user id 无关

**分析**

```java
/**
 * Representation of a user on the device.
 */
public final class UserHandle implements Parcelable {
    /**
     * @hide Range of uids allocated for a user.
     */
    public static final int PER_USER_RANGE = 100000;
    ......
    /**
     * @hide Enable multi-user related side effects. Set this to false if
     * there are problems with single user use-cases.
     */
    public static final boolean MU_ENABLED = true;
    ......
    /**
     * Returns the user id for a given uid.
     * @hide
     */
    public static final int getUserId(int uid) {
        if (MU_ENABLED) {
            return uid / PER_USER_RANGE;
        } else {
            return 0;
        }
    }
    ......
}
```

这个类定义在 frameworks/base/core/java/android/os/UserHandle.java 里。

上面这段代码能得出结论 1 里的公式。

```java
/**
 * Tools for managing OS processes.
 */
public class Process {
    ......
    /**
     * Defines the root UID.
     * @hide
     */
    public static final int ROOT_UID = 0;
    ......
    /**
     * Defines the start of a range of UIDs (and GIDs), going from this
     * number to {@link #LAST_APPLICATION_UID} that are reserved for assigning
     * to applications.
     */
    public static final int FIRST_APPLICATION_UID = 10000;

    /**
     * Last of application-specific UIDs starting at
     * {@link #FIRST_APPLICATION_UID}.
     */
    public static final int LAST_APPLICATION_UID = 19999;
    ......        
}
```

这个类定义在 frameworks/base/core/java/android/os/Process.java 里。

从 `FIRST_APPLICATION_UID` 与 `LAST_APPLICATION_UID` 的值，结合结论 1 里的公式来看，所有 APP 运行时获取自身的 user id 都为 0；而运行时 uid 为 `ROOT_UID` （即 0）的 APP 获取自身的 user id 也为 0，所以 user id 是否为 0 与是否获取 root 权限并无关联。

### 异常发生的场景

该异常发生在 API level 17 以上的机型里，在 APP 或者 APP 调用的 Native 进程里使用 am start 来启动 Activity 时。

在 Java 代码中直接 startActivity 并不会触发此异常。

好了，背景交待完毕，下面按惯例先上结论及解决方案，以便急于解决文章开始提到的异常而不想探究原理的同学可以省时地带着结论心满意足地离去。

## 结论及解决方案

在 API level 17 以上的 Android 设备里，通过 am start 命令来启动 Activity 时会校验调用 am 命令的进程的 user id 与 am 进程从 --user 参数获取到的 user id（默认值为 UserHandle.USER\_CURRENT，即 -2）是否相等， 如果想在 APP 或者 APP 调用的 Native 进程里使用 am start 来启动 Activity，那么需要给其传递能通过校验的 --user 参数，参数值可以直接硬编码为 0，也可以使用 `android.os.Process.myUserHandle().hashCode()` 的值。

如果不给 am start 添加正确的 --user 参数，那调用进程对应 uid 需要拥有 INTERACT\_ACROSS\_USERS\_FULL 权限，但是该权限的 protectionLevel 为 `signature|installer`，一般场景下是无法获取到的。

我做了一个 Demo APP，通过 `Runtime.getRuntime().exec("am start xxxxxxx");` 来启动拔号程序界面，有两个按钮分别模拟了传递与不传递 --user 参数的情况，有兴趣的同学可以看看现象，完整源码在 [AuthorityDemo][4]。

## 分析

接下来我们将借助于源码对 am start 的执行过程进行分析，一点一点吹散迷雾。

### am start 的执行过程

am 命令的源码在 frameworks/base/cmds/am 里，里面的 am 文件即为 am 命令主体：

```sh
#!/system/bin/sh
#
# Script to start "am" on the device, which has a very rudimentary
# shell.
#
base=/system
export CLASSPATH=$base/framework/am.jar
exec app_process $base/bin com.android.commands.am.Am "$@"
```

这段代码在 framworks/base/cmds/am/am 里。

am 命令是通过 app\_process 最终调用到 com.android.commands.am.Am 类的 main 方法，并将所有参数传递给 main 来执行后续流程的。app\_process 相关知识与 am start 执行逻辑无关，此处略去不表，放在本文最后一节附录中讲解。

### 为何 adb shell am start 不出此异常

### Java 代码里 startActivity 的执行过程

## 附录

### app\_process 的执行过程

[1]: http://developer.android.com/reference/android/os/Process.html#myUid()
[2]: http://developer.android.com/reference/android/os/Process.html#myUserHandle()
[3]: http://developer.android.com/reference/android/os/UserHandle.html
[4]: https://github.com/mzlogin/AndroidPractices/tree/master/android-studio/AuthorityDemo
