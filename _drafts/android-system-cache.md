---
layout: post
title: 「Android 垃圾清理」之系统缓存
categories: Android
description: 深入理解 Android 的进程、Task、Activity 等之间的关系。
keywords: Android, Cache, Cleaner, System Cache
---

本文记录的是我对 Android 的「系统缓存」的探索与理解。

## 系统缓存的定义

如下是我捏造的非官方定义：

**系统缓存：** Android APP 在运行过程中保存在手机内置和外置存储上的缓存文件总和。

## 系统缓存的组成

先说结论：

「系统缓存」由 /data/data/packagename/cache 文件夹和 /sdcard/Android/data/packagename/cache 文件夹组成。

如下是原理分析，不感兴趣的可以直接跳到下一节。

我们先来看一个熟悉的界面：

![](/images/posts/android/installed-app-details.png)

这是手机的「设置」——「应用」里的已安装应用的详情页，这里面会显示缓存的大小，而且提供了清理缓存的功能，这就是我们做「系统缓存」清理想做的事情。

这里显示的大小是如何计算出来的，它实际上的文件组成是怎么样的呢？可以从 Android 系统自带的 Settings APP 的源码中找到答案。

Settings APP 的源码在 Android 源码树的 /packages/apps/Settings 目录里，在它下面的 src/com/android/settings/applications 目录能找到 InstalledAppDetails.java 文件，从名字上看它应该就是对应我们上图中的「应用详情页」，它是一个 Fragment，在它的 `onResume` 中调用了 `refreshUi`，它里面调用的 `refreshSizeInfo` 方法中可以看到如下代码：

```java
long cacheSize = mAppEntry.cacheSize + mAppEntry.externalCacheSize;
if (mLastCacheSize != cacheSize) {
    mLastCacheSize = cacheSize;
    mCacheSize.setText(getSizeStr(cacheSize));
}
```

很显然这里的 `cacheSize` 就是对应上图里的缓存大小，从这几行代码的字面意义里可以看出缓存是由「内部缓存」加「外部缓存」组成，甚至可以初步推测出本节的结论，当然我是一个严谨的人，继续深究一下其中的原理。

在` refreshUi` 里能找到给 `mAppEntry` 赋值的地方：

```java
mAppEntry = mState.getEntry(packageName);
```

在 `ApplicationsStat.getEntry` 方法里，

```java
ApplicationInfo info = mApplications.get(i);
if (packageName.equals(info.packageName)) {
    entry = getEntryLocked(info);
    break;
}
```

找到给 `mApplications` 添加数据的地方，在 `addPackage` 方法里：

```java
ApplicationInfo info = mPm.getApplicationInfo(pkgName,
        PackageManager.GET_UNINSTALLED_PACKAGES |
        PackageManager.GET_DISABLED_COMPONENTS);
mApplications.add(info);
if (!mBackgroundHandler.hasMessages(BackgroundHandler.MSG_LOAD_ENTRIES)) {
    mBackgroundHandler.sendEmptyMessage(BackgroundHandler.MSG_LOAD_ENTRIES);
}
```

它在 `mApplications.add(info);` 后顺便发了个消息，经过 `MSG_LOAD_ENTRIES` 到 `MSG_LOAD_ICONS` 到 `MSG_LOAD_SIZES` 的消息链，在 `mBackgroundHander` 的 `handleMessage` 方法的 `case MSG_LOAD_SIZES` 节里，我们看到了一个从名字上就看出来很重要的关键方法调用：

```java
mPm.getPackageSizeInfo(mCurComputingSizePkg, mStatsObserver);
```

`mPm` 是 `PackageManager` 类型的，这是一个抽象类型，它的最终实现为 `/frameworks/base/services/java/com/android/server/pm/PackageManagerService.java`，我们可以看到 `PackageManagerService` 类里的 `getPackageSizeInfo` 方法里，发送 `INIT_COPY` 消息后（注意 `msg.obj` 的类型为 `MeasureParams`），

```java
case INIT_COPY: {
    HandlerParams params = (HandlerParams) msg.obj;
    int idx = mPendingInstalls.size();
    if (!mBound) {
        if (!connectToService()) {
            params.serviceError();
            return;
        } else {
            mPendingInstalls.add(idx, params);
        }
    } else {
        mPendingInstalls.add(idx, params);
        if (idx == 0) {
            mHandler.sendEmptyMessage(MCS_BOUND);
        }
    }
    break;
```

`mBound` 默认值为 false，所以会进 `connectToService` 方法，里面会触发 `DefaultContainerConnection.onServiceConnected` 回调，发送了 `MCS_BOUND` 的消息，通过 `params.startCopy()` 来到 `MeasureParams` 的 `handleStartCopy` 方法里，可以直接看到 `externalCacheSize` 的计算方法：

 ```java
void handleStartCopy() throws RemoteException {
    synchronized (mInstallLock) {
        mSuccess = getPackageSizeInfoLI(mStats.packageName, mStats);
    }

    // ... some code here

    if (mounted) {
        final File externalCacheDir = Environment
                .getExternalStorageAppCacheDirectory(mStats.packageName);
        final long externalCacheSize = mContainerService
                .calculateDirectorySize(externalCacheDir.getPath());
        mStats.externalCacheSize = externalCacheSize;

        // ... some code here
    }
}
```

这里面的 `Environment.getExternalStorageAppCacheDirectory` 返回的就是 /sdcard/Android/data/packagename/cache。

而 Internal 的 `cacheSize` 部分在 `getPackageSizeInfoLI` 方法里调用 /frameworks/base/services/java/com/android/server/pm/Installer.java 的 `getSizeInfo` 方法，最终是通过给 /dev/socket/installd 发送 `getsize packagename apkpath` 获取的输出中解析出来。

```java
public int getSizeInfo(String pkgName, String apkPath, String fwdLockApkPath,
        String asecPath, PackageStats pStats) {
    StringBuilder builder = new StringBuilder("getsize");
    builder.append(' ');
    builder.append(pkgName);
    builder.append(' ');
    builder.append(apkPath);
    builder.append(' ');
    builder.append(fwdLockApkPath != null ? fwdLockApkPath : "!");
    builder.append(' ');
    builder.append(asecPath != null ? asecPath : "!");

    String s = transaction(builder.toString());
    String res[] = s.split(" ");

    if ((res == null) || (res.length != 5)) {
        return -1;
    }
    try {
        pStats.codeSize = Long.parseLong(res[1]);
        pStats.dataSize = Long.parseLong(res[2]);
        pStats.cacheSize = Long.parseLong(res[3]);
        pStats.externalCodeSize = Long.parseLong(res[4]);
        return Integer.parseInt(res[0]);
    } catch (NumberFormatException e) {
        return -1;
    }
}
```

/dev/socket/installd 的源码在 /frameworks/base/cmds/installd，`getsize` 命令最后在 /frameworks/base/cmds/installd/commands.c 的 `get_size` 函数中处理，

```c
/* most stuff in the pkgdir is data, except for the "cache"
 * directory and below, which is cache, and the "lib" directory
 * and below, which is code...
 */
while ((de = readdir(d))) {
    const char *name = de->d_name;

    if (de->d_type == DT_DIR) {
        int subfd;
            /* always skip "." and ".." */
        if (name[0] == '.') {
            if (name[1] == 0) continue;
            if ((name[1] == '.') && (name[2] == 0)) continue;
        }
        subfd = openat(dfd, name, O_RDONLY | O_DIRECTORY);
        if (subfd >= 0) {
            int64_t size = calculate_dir_size(subfd);
            if (!strcmp(name,"lib")) {
                codesize += size;
            } else if(!strcmp(name,"cache")) {
                cachesize += size;
            } else {
                datasize += size;
            }
        }
    } else {
        if (fstatat(dfd, name, &s, AT_SYMLINK_NOFOLLOW) == 0) {
            datasize += stat_size(&s);
        }
    }
}
```
