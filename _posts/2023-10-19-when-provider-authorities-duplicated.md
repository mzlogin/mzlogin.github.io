---
layout: post
title: Android｜FileProvider 的 authorities 重名会怎么样？
categories: [Android]
description: Android 的 FileProvider 的 authorities 重名会怎么样？
keywords: Android, FileProvider, authorities
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

先说结论：如果有两个或多个 FileProvider 的 authorities 重名，那么只有合并后的 AndroidManifest.xml 文件里，排在最前面的那个配置会生效。

## 场景

应用里有个自升级的功能，下载完 apk 后，通过 FileProvider 提供 Uri 进行安装。我修改了文件下载路径后，功能失效了，报错如下：

```
java.lang.IllegalArgumentException: Failed to find configured root that contains /data/user/0/org.mazhuang.test/cache/download/xxx.apk
    at android.support.v4.content.FileProvider$SimplePathStrategy.getUriForFile(FileProvider.java:738)
    at android.support.v4.content.FileProvider.getUriForFile(FileProvider.java:417)
```

对应的 provider 的声明是：

```xml
<provider
    android:name="android.support.v4.content.FileProvider"
    android:authorities="${applicationId}.provider"
    android:exported="false"
    android:grantUriPermissions="true">
    <meta-data
        android:name="android.support.FILE_PROVIDER_PATHS"
        android:resource="@xml/provider_paths" />
</provider>
```

provider_paths 内容：

```xml
<?xml version="1.0" encoding="utf-8"?>
<paths >
    <cache-path name="internal_cache_download" path="download/" />
</paths>
```

## 分析

对照 FileProvider 官方文档：https://developer.android.com/reference/android/support/v4/content/FileProvider.html ，我再三确认了配置本身没有问题。

然后在报错堆栈的 `android.support.v4.content.FileProvider$SimplePathStrategy.getUriForFile` 方法处下断点调试：

```java
@Override
public Uri getUriForFile(File file) {
    // some code here
    // Find the most-specific root path
    Map.Entry<String, File> mostSpecific = null;
    for (Map.Entry<String, File> root : mRoots.entrySet()) {
        final String rootPath = root.getValue().getPath();
        if (path.startsWith(rootPath) && (mostSpecific == null
                || rootPath.length() > mostSpecific.getValue().getPath().length())) {
            mostSpecific = root;
        }
    }

    if (mostSpecific == null) {
        throw new IllegalArgumentException(
                "Failed to find configured root that contains " + path);
    }
    // some code here
}
```

发现 SimplePathStrategy 的 mRoots 里确实没有我配置的路径。而 SimplePathStrategy 唯一的构造方法的参数是 authority，该实例的 authority 确实是 `${applicationId}.provider` 无误……那么，合理猜测，是有同名的 FileProvider，这里用到的是另一个 FileProvider 的 mRoots。

为了验证该猜测，我从两方面做确认：

1. 查看合并后的 AndroidManifest.xml 文件，是否有其它 FileProvider 的 authorities 也是 `${applicationId}.provider`？

2. 阅读 Android Frameworks 里的相关源码，确认解析 provider 配置、取 FileProvider 实例的逻辑。

### 查看合并后的 AndroidManifest.xml

现在 Android Studio 已经提供了非常方便的查看合并后的 AndroidManifest.xml 的功能，打开 app 项目的 AndroidMenifest.xml 文件，在编辑器底部有个 Merged Manifest 选项卡，点击即可查看。

![merged-manifest](/images/posts/android/merged-manifest.png)

可以看到，确实有两个 FileProvider 的 authorities 都是 `${applicationId}.provider`，另一个是从一个第三方库里来的，并且，它排在前面。

### 源码确认

首先是在 Android Studio 里进行，找到调用 SimplePathStrategy 构造方法的地方，是在 `android.support.v4.content.FileProvider#parsePathStrategy`：

```java
/**
 * Parse and return {@link PathStrategy} for given authority as defined in
 * {@link #META_DATA_FILE_PROVIDER_PATHS} {@code <meta-data>}.
 *
 * @see #getPathStrategy(Context, String)
 */
private static PathStrategy parsePathStrategy(Context context, String authority)
        throws IOException, XmlPullParserException {
    final SimplePathStrategy strat = new SimplePathStrategy(authority);

    final ProviderInfo info = context.getPackageManager()
            .resolveContentProvider(authority, PackageManager.GET_META_DATA);
    // some code here
}
```

这里的 `context.getPackageManager().resolveContentProvider` 的实现，一路通过以下路径找到：

```java
// android.app.ContextImpl#getPackageManager
// -->
// android.app.ActivityThread#getPackageManager
public static IPackageManager getPackageManager() {
    if (sPackageManager != null) {
        return sPackageManager;
    }
    IBinder b = ServiceManager.getService("package");
    sPackageManager = IPackageManager.Stub.asInterface(b);
    return sPackageManager;
}
```

到这里动用一点历史经验，可知实际实现类是 PackageManagerService，来看看 `PackageManagerService#resolveContentProvider` 的实现：

```java
@Override
public ProviderInfo resolveContentProvider(String name, int flags, int userId) {
    if (!sUserManager.exists(userId)) return null;
    flags = updateFlagsForComponent(flags, userId, name);
    final String instantAppPkgName = getInstantAppPackageName(Binder.getCallingUid());
    // reader
    synchronized (mPackages) {
        final PackageParser.Provider provider = mProvidersByAuthority.get(name);
        // some code here
    }
    // some code here
}
```

在 PackageManagerService 里继续查找写入 `mProvidersByAuthority` 的地方，在 `PackageManagerService#commitPackageSettings`：

```java
/**
 * Adds a scanned package to the system. When this method is finished, the package will
 * be available for query, resolution, etc...
 */
private void commitPackageSettings(PackageParser.Package pkg, PackageSetting pkgSetting,
        UserHandle user, int scanFlags, boolean chatty) throws PackageManagerException {
    // some code here
    synchronized (mPackages) {
        // some code here
        for (i=0; i<N; i++) {
            PackageParser.Provider p = pkg.providers.get(i);
            p.info.processName = fixProcessName(pkg.applicationInfo.processName,
                    p.info.processName);
            mProviders.addProvider(p);
            p.syncable = p.info.isSyncable;
            if (p.info.authority != null) {
                String names[] = p.info.authority.split(";");
                p.info.authority = null;
                for (int j = 0; j < names.length; j++) {
                    // some code here
                    // 【我们要找的地方】
                    if (!mProvidersByAuthority.containsKey(names[j])) {
                        mProvidersByAuthority.put(names[j], p);
                        if (p.info.authority == null) {
                            p.info.authority = names[j];
                        } else {
                            p.info.authority = p.info.authority + ";" + names[j];
                        }
                        // some code here
```

从上面这段中我们可以得到两个知识点：

1. 如果已经有同名的 authority，那么后面的 Provider 配置会被忽略掉；

2. authority 可以配置多个，用分号分隔。（这一点在官方文档之类的都没有找到说明，也许官方觉得配置项的名称 `autorities` 就说明了一切？实测可正常使用。）

接下来还有一点需要确认的，就是 `pkg.providers` 是否是按 AndroidManifexs.xml 里的顺序排列的。

根据上面代码里的线索，可以留意到 `PackageParser` 类，按如下顺序递进：

```java
// android.content.pm.PackageParser#parseBaseApk(java.io.File, android.content.res.AssetManager, int)
private Package parseBaseApk(File apkFile, AssetManager assets, int flags)
        throws PackageParserException {
        // some code here
        // 下面这行里的 ANDROID_MANIFEST_FILENAME = AndroidManifest.xml
        parser = assets.openXmlResourceParser(cookie, ANDROID_MANIFEST_FILENAME);

        final String[] outError = new String[1];
        final Package pkg = parseBaseApk(apkPath, res, parser, flags, outError);
        // some code here
}

// --> 
// android.content.pm.PackageParser#parseBaseApk(java.lang.String, android.content.res.Resources, android.content.res.XmlResourceParser, int, java.lang.String[])
// -->
// android.content.pm.PackageParser#parseBaseApkCommon
// -->
// android.content.pm.PackageParser#parseBaseApplication
// -->
private boolean parseBaseApplication(Package owner, Resources res,
        XmlResourceParser parser, int flags, String[] outError)
    // some code here
    while ((type = parser.next()) != XmlPullParser.END_DOCUMENT
            && (type != XmlPullParser.END_TAG || parser.getDepth() > innerDepth)) {
        if (type == XmlPullParser.END_TAG || type == XmlPullParser.TEXT) {
            continue;
        }

        String tagName = parser.getName();
        if (tagName.equals("activity")) {
            // some code here
        } else if (tagName.equals("provider")) {
            Provider p = parseProvider(owner, res, parser, flags, outError);
            if (p == null) {
                mParseError = PackageManager.INSTALL_PARSE_FAILED_MANIFEST_MALFORMED;
                return false;
            }

            owner.providers.add(p);
        // some code here
```

至此，我们已经可以确定 `pkg.providers` 是按 AndroidManifest.xml 里的顺序解析出来的了。

## 解决方案

既然已经知道了问题的原因，那么解决方案也就呼之欲出了：

- 修改自己的 FileProvider 的 authorities，不会和其它库的 authorities 重名即可。

## 小结

> 源码面前，了无秘密。——侯捷

如果遇到疑难问题，而恰好又有源码可查，那么就不要犹豫，直接去看源码吧！花一些时间和耐心，最终会找到你想要的。