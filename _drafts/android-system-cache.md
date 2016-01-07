---
layout: post
title: 「Android 垃圾清理」之系统缓存
categories: Android
description: 深入理解 Android 的进程、Task、Activity 等之间的关系。
keywords: Android, Cache, Cleaner, System Cache
---

本文记录的是我对 Android 的「系统缓存」及其扫描和清理方法的探索与理解。

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

Settings APP 的源码在 Android 源码树的 packages/apps/Settings 目录里，在它里面能找到 InstalledAppDetails.java 文件，从名字上看它应该就是对应我们上图中的「应用详情页」，它是一个 Fragment，在它的 `onResume` 方法中调用了 `refreshUi` 方法，它里面又调用了 `refreshSizeInfo` 方法：

```java
private void refreshSizeInfo() {
    if (mAppEntry.size == ApplicationsState.SIZE_INVALID
            || mAppEntry.size == ApplicationsState.SIZE_UNKNOWN) {
        ......
    } else {
        ......
        long cacheSize = mAppEntry.cacheSize + mAppEntry.externalCacheSize;
        if (mLastCacheSize != cacheSize) {
            mLastCacheSize = cacheSize;
            mCacheSize.setText(getSizeStr(cacheSize));
        }
        ......
    }
}
```

这个方法定义在文件 packages/apps/Settings/src/com/android/settings/applications/InstalledAppDetails.java 中。

很显然这里的 `cacheSize` 就是对应上图里的缓存大小，从这几行代码的字面意义里可以看出缓存是由「内部缓存」加「外部缓存」组成，甚至可以初步推测出本节的结论，当然我是一个严谨的人，继续深究一下其中的原理。

找到给 `mAppEntry` 赋值的地方：

```java
private boolean refreshUi() {
    ......
    mAppEntry = mState.getEntry(packageName);
    ......
}
```

这个方法定义在文件 packages/apps/Settings/src/com/android/settings/applications/InstalledAppDetails.java 中。

继续看 `getEntry` 里做了什么：

```java
AppEntry getEntry(String packageName) {
    ......
            for (int i=0; i<mApplications.size(); i++) {
                ApplicationInfo info = mApplications.get(i);
                if (packageName.equals(info.packageName)) {
                    entry = getEntryLocked(info);
                    break;
                }
            }
    .......
}
```

这个方法定义在文件 packages/apps/Settings/src/com/android/settings/applications/ApplicationsState.java 中。

找到给 `mApplications` 添加数据的地方：

```java
void addPackage(String pkgName) {
    try {
        synchronized (mEntriesMap) {
            ......
            ApplicationInfo info = mPm.getApplicationInfo(pkgName,
                    PackageManager.GET_UNINSTALLED_PACKAGES |
                    PackageManager.GET_DISABLED_COMPONENTS);
            mApplications.add(info);
            if (!mBackgroundHandler.hasMessages(BackgroundHandler.MSG_LOAD_ENTRIES)) {
                mBackgroundHandler.sendEmptyMessage(BackgroundHandler.MSG_LOAD_ENTRIES);
            }
            ......
        }
    } catch (NameNotFoundException e) {
    }
}
```

这个方法定义在文件 packages/apps/Settings/src/com/android/settings/applications/ApplicationsState.java 中。

它在 `mApplications.add(info);` 后顺便发了个消息，经过 `MSG_LOAD_ENTRIES` 到 `MSG_LOAD_ICONS` 到 `MSG_LOAD_SIZES` 的消息链，我们看到一个从名字上就看出来很重要的关键方法调用 `getPackageSizeInfo`：

```java
class BackgroundHandler extends Handler {
    ......
    @Override
    public void handleMessage(Message msg) {
        ......
        switch (msg.what) {
            ......
            case MSG_LOAD_ENTRIES: {
                ......
                if (numDone >= 6) {
                    ......
                } else {
                    sendEmptyMessage(MSG_LOAD_ICONS);
                }
            } break;
            case MSG_LOAD_ICONS: {
                ......
                if (numDone >= 2) {
                    ......
                } else {
                    sendEmptyMessage(MSG_LOAD_SIZES);
                }
            } break;
            case MSG_LOAD_SIZES: {
                synchronized (mEntriesMap) {
                    ......
                                mPm.getPackageSizeInfo(mCurComputingSizePkg, mStatsObserver);
                    ......
                }
            } break;
        }
    }
    ......
}
```

这个类定义在文件 packages/apps/Settings/src/com/android/settings/applications/ApplicationsState.java 中。

`mPm` 是 `PackageManager` 类型的，这是一个抽象类型，它的实现类为 `ApplicationPackageManager`，`ApplicationPackageManager.getPackageSizeInfo` 里调用了 `IPackageManager.getPackageSizeInfo`，`IPackageManager` 的实例在 `ContexImpl.getPackageManager` 方法里通过 `ActivityThread.getPackageManager()` 构造，它的方法调用最终是反映到通过 Binder 机制返回的 `PackageManagerService` 实例上，我们找到 `getPackageSizeInfo` 的最终实现：

```java
public class PackageManagerService extends IPackageManager.Stub {
    ......
    public void getPackageSizeInfo(final String packageName,
            final IPackageStatsObserver observer) {
        ......
        Message msg = mHandler.obtainMessage(INIT_COPY);
        msg.obj = new MeasureParams(stats, observer);
        mHandler.sendMessage(msg);
    }
    ......
}
```

这个方法定义在文件 frameworks/base/services/java/com/android/server/pm/PackageManagerService.java 中。

这里我们注意 `msg.obj` 的类型为 `MeasureParams`，`INIT_COPY` 消息对应的处理：

```java
class PackageHandler extends Handler {
    private boolean mBound = false;
    ......
    public void handleMessage(Message msg) {
        ......
            doHandleMessage(msg);
        ......
    }

    void doHandleMessage(Message msg) {
        switch (msg.what) {
            case INIT_COPY: {
                ......
                if (!mBound) {
                    if (!connectToService()) {
                        ......
                    } else {
                        ......
                    }
                } else {
                    ......
                }
                break;
            }
            case MCS_BOUND: {
                ......
                        if (params.startCopy()) {
                            ......
                        }
                ......
                break;
            }
            ......
        }
    }
    ......
}
```

这个类定义在文件 frameworks/base/services/java/com/android/server/pm/PackageManagerService.java 中。

`mBound` 默认值为 false，所以会进 `connectToService` 方法，里面会触发 `DefaultContainerConnection.onServiceConnected` 回调，发送了 `MCS_BOUND` 的消息，通过 `params.startCopy()` 来到 `MeasureParams` 的 `handleStartCopy` 方法里，可以直接看到 `externalCacheSize` 的计算方法：

```java
void handleStartCopy() throws RemoteException {
    synchronized (mInstallLock) {
        mSuccess = getPackageSizeInfoLI(mStats.packageName, mStats);
    }

    ......

    if (mounted) {
        final File externalCacheDir = Environment
                .getExternalStorageAppCacheDirectory(mStats.packageName);
        final long externalCacheSize = mContainerService
                .calculateDirectorySize(externalCacheDir.getPath());
        mStats.externalCacheSize = externalCacheSize;

        ......
    }
}
```

这个方法定义在文件 frameworks/base/services/java/com/android/server/pm/PackageManagerService.java 中。

这里面的 `Environment.getExternalStorageAppCacheDirectory` 返回的就是 /sdcard/Android/data/packagename/cache。

而 Internal 的 `cacheSize` 部分在 `getPackageSizeInfoLI` 方法里，

```java
private boolean getPackageSizeInfoLI(String packageName, PackageStats pStats) {
    ......
        int res = mInstaller.getSizeInfo(packageName, p.mPath, publicSrcDir,
                asecPath, pStats);
    ......
}
```

这个方法定义在文件 frameworks/base/services/java/com/android/server/pm/PackageManagerService.java 中。

```java
class Installer {
    ......
    private boolean connect() {
            ......
            LocalSocketAddress address = new LocalSocketAddress("installd",
                    LocalSocketAddress.Namespace.RESERVED);

            mSocket.connect(address);
            ......
    }
    ......
    private synchronized String transaction(String cmd) {
        if (!connect()) {
            ......
        }

        if (!writeCommand(cmd)) {
            ......
        }
        if (readReply()) {
            ......
            return s;
        } else {
            ......
        }
    }
    public int getSizeInfo(String pkgName, String apkPath, String fwdLockApkPath,
            String asecPath, PackageStats pStats) {
        StringBuilder builder = new StringBuilder("getsize");
        builder.append(' ');
        builder.append(pkgName);
        builder.append(' ');
        builder.append(apkPath);
        ......

        String s = transaction(builder.toString());
        String res[] = s.split(" ");

        ......
        try {
            ......
            pStats.cacheSize = Long.parseLong(res[3]);
            ......
        } catch (NumberFormatException e) {
            return -1;
        }
    }
    ......
}
```

这个方法定义在文件 frameworks/base/services/java/com/android/server/pm/Installer.java 中。

`getSizeInfo` 方法最终是通过给 /dev/socket/installd 发送 `getsize packagename apkpath ...` 获取的输出中解析出来。

/dev/socket/installd 的源码在 frameworks/base/cmds/installd，`getsize` 命令最后在 `get_size` 函数中处理，

```c
int get_size(const char *pkgname, const char *apkpath,
             const char *fwdlock_apkpath, const char *asecpath,
             int64_t *_codesize, int64_t *_datasize, int64_t *_cachesize,
             int64_t* _asecsize)
{
    ......
    while ((de = readdir(d))) {
        const char *name = de->d_name;

        if (de->d_type == DT_DIR) {
            ......
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
            ......
        }
    }
    ......
}
```

这个函数定义在文件 frameworks/base/cmds/installd/commands.c 中。
