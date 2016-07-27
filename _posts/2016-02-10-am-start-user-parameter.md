---
layout: post
title: 从 am start 的 --user 参数说到 Android 多用户
categories: Android
description: am start 命令有时并不会乖乖如我们所愿，这时候我们需要知对策并知其所以然。
keywords: am start, user, adb, INTERACT_ACROSS_USERS_FULL
---

本文的讨论围绕一个 `java.lang.SecurityException` 展开，异常的关键词是权限 `android.permission.INTERACT_ACROSS_USERS_FULL`。

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

如果不给 am start 传递正确的 --user 参数，那调用进程对应 uid 需要拥有 INTERACT\_ACROSS\_USERS\_FULL 权限，但是该权限的 protectionLevel 为 `signature|installer`，一般场景下是无法获取到的。

我做了一个 Demo APP，通过 `Runtime.getRuntime().exec("am start xxxxxxx");` 来启动拔号程序界面，有两个按钮分别模拟了传递与不传递 --user 参数的情况，有兴趣的同学可以看看现象，完整源码在 [AuthorityDemo][4]。

运行截图如下：

![authority demo](/images/posts/android/authority-demo.png)

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

am start 的关键方法调用如下：

![am start call stack](/images/posts/android/am-start-call-stack.svg)

文章开始处的异常就是在 handleIncomingUser 方法里校验 user id 和权限失败之后抛出的。下面按方法调用层级详细分析一下，如下源码所在源文件可以在上图中找到：

#### Am.main

```java
public static void main(String[] args) {
    (new Am()).run(args);
}
```

就是一个简单的 new 和 run 方法调用，而 Am 类中并无 `run(String[])` 原型的方法，所以其实调用的是 Am 类的基类 BaseCommand 的 run 方法。

#### BaseCommand.run

```java
public void run(String[] args) {
    ......
    mArgs = args;
    ......

    try {
        onRun();
        ......
    }
    ......
}
```

BaseCommand 类的 onRun 方法是一个抽象方法，所以其实 run 方法只是保存了参数，然后调用了 Am 的 onRun 方法。

#### Am.onRun

```java
@Override
public void onRun() throws Exception {

    mAm = ActivityManagerNative.getDefault();
    ......

    String op = nextArgRequired();

    if (op.equals("start")) {
        runStart();
    }
    ......
}
```

onRun 方法主要是对 am 命令后第一个参数进行判断并进行相应的方法调用，我们可以看到 `am start` 是调用了 runStart 方法。

这里可以顺便留意到的是 mAm 对象，追踪 `ActivityManagerNative.getDefault()` 可以知道它最终通过 binder 机制对应 ActivityManagerService 对象。

#### Am.runStart

```java
public class Am extends BaseCommand {
    ......
    private boolean mWaitOption = false;
    ......
    private int mUserId;
    ......
    private Intent makeIntent(int defUser) throws URISyntaxException {
        ......
        mWaitOption = false;
        ......
        mUserId = defUser;
        ......
        while ((opt=nextOption()) != null) {
            if (opt.equals("-a")) {
                ......
            } else if (opt.equals("-W")) {
                mWaitOption = true;
                ......
            } else if (opt.equals("--user")) {
                mUserId = parseUserArg(nextArgRequired());
            }
            ......
    }

    private void runStart() throws Exception {
        Intent intent = makeIntent(UserHandle.USER_CURRENT);
        ......
        if (mWaitOption) {
            result = mAm.startActivityAndWait(null, null, intent, mimeType,
                        null, null, 0, mStartFlags, profilerInfo, null, mUserId);
            res = result.result;
        } else {
            res = mAm.startActivityAsUser(null, null, intent, mimeType,
                    null, null, 0, mStartFlags, profilerInfo, null, mUserId);
        }
        ......
        switch (res) {
            // 启动 Activity 的结果提示
        }
        if (mWaitOption && launched) {
            // 输出启动 Activity 的结果状态，起止时间等
        }
        ......
    }
    ......
}
```

由如上代码可知，一般通过 am start 启动 Activity 时若未传 -W 参数（我一般的做法），会调用 ActivityManagerService.startActivityAsUser 来启动 Activity。（ActivityManagerService.startActivityAndWait 其实与 ActivityManagerService.startActivityAsUser 类似，只是在启动 Activity 后多了一个等待过程，下面不再重复分析。）

而 mUserId 的值，若命令行中有 --user 参数，则被赋为该参数的值；若命令行中无 --user 参数，则默认为 `UserHandle.USER_CURRENT` 的值，在 frameworks/base/core/java/android/os/UserHandle.java 中可知此默认值为 -2。

-2 这个数字是不是有点似曾相似？没错，文首的异常信息里就有这个值。

#### ActivityManagerService.startActivityAsUser

```java
@Override
public final int startActivityAsUser(IApplicationThread caller, String callingPackage,
        Intent intent, String resolvedType, IBinder resultTo, String resultWho, int requestCode,
        int startFlags, ProfilerInfo profilerInfo, Bundle options, int userId) {
    enforceNotIsolatedCaller("startActivity");
    userId = handleIncomingUser(Binder.getCallingPid(), Binder.getCallingUid(), userId,
            false, ALLOW_FULL_ONLY, "startActivity", null);
    // TODO: Switch to user app stacks here.
    return mStackSupervisor.startActivityMayWait(caller, -1, callingPackage, intent,
            resolvedType, null, null, resultTo, resultWho, requestCode, startFlags,
            profilerInfo, null, null, options, false, userId, null, null);
}
```

`Binder.getCallingUid()` 是一个 native 方法，在 frameworks/base/core/java/android/os/Binder.java 中能找到，它其实就是返回了当前进程的 uid，而**该 uid 是从父进程继承的**。

```java
/**
 * Return the Linux uid assigned to the process that sent you the
 * current transaction that is being processed.  This uid can be used with
 * higher-level system services to determine its identity and check
 * permissions.  If the current thread is not currently executing an
 * incoming transaction, then its own uid is returned.
 */
public static final native int getCallingUid();
```

#### ActivityManagerService.handleIncomingUser

```java
int handleIncomingUser(int callingPid, int callingUid, int userId, boolean allowAll,
        int allowMode, String name, String callerPackage) {
    final int callingUserId = UserHandle.getUserId(callingUid);
    if (callingUserId == userId) {
        return userId;
    }
    ......
    if (callingUid != 0 && callingUid != Process.SYSTEM_UID) {
        final boolean allow;
        if (checkComponentPermission(INTERACT_ACROSS_USERS_FULL, callingPid,
                callingUid, -1, true) == PackageManager.PERMISSION_GRANTED) {
            // If the caller has this permission, they always pass go.  And collect $200.
            allow = true;
        } else if (allowMode == ALLOW_FULL_ONLY) {
            // We require full access, sucks to be you.
            allow = false;
        } else if (......) {
            ......
        }
        if (!allow) {
            if (userId == UserHandle.USER_CURRENT_OR_SELF) {
                // In this case, they would like to just execute as their
                // owner user instead of failing.
                targetUserId = callingUserId;
            } else {
                StringBuilder builder = new StringBuilder(128);
                builder.append("Permission Denial: ");
                builder.append(name);
                if (callerPackage != null) {
                    builder.append(" from ");
                    builder.append(callerPackage);
                }
                builder.append(" asks to run as user ");
                builder.append(userId);
                builder.append(" but is calling from user ");
                builder.append(UserHandle.getUserId(callingUid));
                builder.append("; this requires ");
                builder.append(INTERACT_ACROSS_USERS_FULL);
                if (allowMode != ALLOW_FULL_ONLY) {
                    builder.append(" or ");
                    builder.append(INTERACT_ACROSS_USERS);
                }
                String msg = builder.toString();
                Slog.w(TAG, msg);
                throw new SecurityException(msg);
            }
        }
    }
    ......
}
```

它先校验了当前进程的 user id 与参数里的 userId（即 --user 的值或默认的 -2）是否相等，如果相等则正常返回，执行后续的启动 Activity 动作；

如果不相等，普通应用程序的 callingUid 必为 0，则先进行权限校验，看当前 pid 和 uid 是否被赋予了 INTERACT\_ACROSS\_USERS\_FULL 权限，我们在前面的「结论及解决方案」一节中已经交待过，该权限的 protectionLevel 为 `signature|installer`，一般场景下是无法获取到的；

如果没有 INTERACT\_ACROSS\_USERS\_FULL 权限，allowMode 参数值又为 ALLOW\_FULL\_ONLY 则将抛出 SecurityException，从上一小节「ActivityManagerService.startActivityAsUser」中调用 handleIncomingUser 的参数可知 allowMode 参数就是 ALLOW\_FULL\_ONLY。

上方代码段里的 ``Permission Denial: ``、`` asks to run as user `` 和 `` but is calling from user `` 等字符串是不是很熟悉？这就是从文首开始困惑我们的异常抛出的地方。

至此，am start 的大概执行过程和异常发生的情景分析完成。

#### 实现功能，避免异常

从上方的分析可知，要避免异常最直接有效的方法就是让 handleIncomingUser 方法正常返回，既然声明 INTERACT\_ACROSS\_USERS\_FULL 权限的路不通，就只有传递 --user 参数了。

那么给这个参数传递什么值呢？

从上文的分析可知，该参数应该与 am 进程的 user id 相等，所以传递父进程的 user id 即可。（user id 由 uid 运算得来，而 uid 与父进程相同。）

由「背景」一节可知，所有 APP 进程的 user id 都为 0，所以该参数直接写 0 是可以的；如果不想硬编码，那么可以先用 Process 类的 `myUserHandle()` 方法获取进程的 user handle：

```java
/**
 * Returns this process's user handle.  This is the
 * user the process is running under.  It is distinct from
 * {@link #myUid()} in that a particular user will have multiple
 * distinct apps running under it each with their own uid.
 */
public static final UserHandle myUserHandle() {
    return new UserHandle(UserHandle.getUserId(myUid()));
}
```

这段代码定义在 frameworks/base/core/java/android/os/Process.java 中。

继续分析 UserHandle 类里的相关方法：

```java
public final class UserHandle implements Parcelable {
    ......
    /** @hide */
    public UserHandle(int h) {
        mHandle = h;
    }

    /**
     * Returns the userId stored in this UserHandle.
     * @hide
     */
    @SystemApi
    public int getIdentifier() {
        return mHandle;
    }
    ......
    @Override
    public int hashCode() {
        return mHandle;
    }
    ......
```

这段代码定义在 frameworks/base/core/java/android/os/UserHandle.java 中。

构造方法 `UserHandle(int h)` 里将 user id 保存在 mHandle 成员里，本来 UserHandle 类有一个 getIdentifier 方法可以返回 mHandle 的，但该方法被标为了 SystemApi 和 hide，无法正常调用，所以找了一个取巧的办法，使用也返回 mHandle 值的 hashCode 方法来达成目标。

所以 am start 的 --user 的参数可以直接写为 0，也可以使用 `android.os.Process.myUserHandle().hashCode()` 的值。

## 引申思考

启动 Activity 的方法并非只有在 APP 进程里使用 am start 一种，还有通过 adb 命令 adb shell am start 或在 APP 进程里使用 startActivity 等，它们为什么没有抛出此异常呢？继续探索。

### 为何 adb shell am start 不抛此异常

**原因：** shell 是拥有 INTERACT\_ACROSS\_USERS\_FULL 权限的，所以 am start 作为其子进程继承了 shell 的 uid 和对应权限，在如上流程中 ActivityManagerService.handleIncomingUser 里通过了权限检查，不会抛出文首的异常。

在 frameworks/base/packages/Shell/AndroidManifest.xml 里有如下声明：

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
        package="com.android.shell"
        coreApp="true"
        android:sharedUserId="android.uid.shell"
        >
    ......
    <uses-permission android:name="android.permission.INTERACT_ACROSS_USERS_FULL" />
    ......
</manifest>    
```

### Java 代码里 startActivity 的执行过程

![start activity call stack](/images/posts/android/start-activity-call-stack.svg)

其实与 am start 一样，都是执行到了 ActivityManagerService.startActivityAsUser，区别在于参数。

```java
@Override
public final int startActivity(IApplicationThread caller, String callingPackage,
        Intent intent, String resolvedType, IBinder resultTo, String resultWho, int requestCode,
        int startFlags, ProfilerInfo profilerInfo, Bundle options) {
    return startActivityAsUser(caller, callingPackage, intent, resolvedType, resultTo,
        resultWho, requestCode, startFlags, profilerInfo, options,
        UserHandle.getCallingUserId());
}
```

在 am start 流程中的，传给 startActivityAsUser 的最后一个参数是 --user 传入的或者默认的 -2，而 Java 代码里的 startActivity 流程中传给 startActivityAsUser 的是 `UserHandle.getCallingUserId()`，相当于到 handleIncomingUser 中是当前进程的 user id 与当前进程的 user id 比较（必相等），如果相等则通过校验，所以必能通过校验，不会抛出文首说的异常。

## 附录

### app\_process 简要执行过程

![app process](/images/posts/android/app-process.svg)

在第 2 步，AndroidRuntime::start 中调用了 `startVm` 启动虚拟机，最终在第 5 步 AppRuntime::onStarted 中调用通过参数传进来的类的 main 方法，并将类名后的参数传给它。

[1]: http://developer.android.com/reference/android/os/Process.html#myUid()
[2]: http://developer.android.com/reference/android/os/Process.html#myUserHandle()
[3]: http://developer.android.com/reference/android/os/UserHandle.html
[4]: https://github.com/mzlogin/AndroidPractices/tree/master/android-studio/AuthorityDemo
