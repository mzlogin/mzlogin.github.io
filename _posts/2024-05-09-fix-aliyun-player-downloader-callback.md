---
layout: post
title: Android｜修复阿里云播放器下载不回调的问题
categories: [Android]
description: 修复阿里云播放器下载回调问题。
keywords: Android, 阿里云播放器
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

最近在升级 Android 项目里的阿里云播放器 SDK 版本，其中很多相关逻辑是基于阿里云提供的 Demo 来更新的。修改完自测时，发现下载器的回调接口偶现不回调的问题。本文简要记录解决过程。

## 问题描述

首先来看有问题的代码，Demo 里下载相关的有这么一段：

```java
// AliyunDownloadManager.java

public void prepareDownload(final VidAuth vidAuth) {
    // some code here
    final AliMediaDownloader downloader = AliDownloaderFactory.create(mContext);
    downloader.setOnPrepareListener(new AliMediaDownloader.OnPreparedListener() {
            @Override
            public void onPrepared(MediaInfo mediaInfo) {
                // some code here
            }
    });
    setErrorListener(downloader, null);
    // some code here
}

private void setErrorListener(final AliMediaDownloader jniDownloader, final AliyunDownloadMediaInfo aliyunDownloadMediaInfo) {
    // some code here
    jniDownloader.setOnErrorListener(new AliMediaDownloader.OnErrorListener() {
        @Override
        public void onError(ErrorInfo errorInfo) {
            // some code here
        }
    });
}
```

调用这个方法后，正常情况下 onPrepared 和 onError 必被调用到其一，但现实是偶尔会出现两个都没被回调的情况。

那种感觉就像，你约好了朋友一起吃饭，结果他突然失联了，打电话不接，发消息不回，然后你就一个人在那里等着。这种事情在生活里不能忍，在代码里能忍？

## 排查和修改

通过一番艰苦的排查，久久没有思路，只好闷闷不乐地下班回家了。晚上洗澡的时候，突然想到，会不会是 downloader 被 GC 了？赶紧拿小本本记下思路，第二天一早翻出这块代码一看，果然如此。

downloader 是在方法内部创建的局部变量，方法执行完毕后，downloader 就会被释放，如果此时发生 GC，就会回收它对应的对象。到了回调时机，发现 **downloader 对应的对象已经被回收了，回调也就无从谈起了**。

那要打破这个局面，就需要将 downloader 的引用保持住，在必要的回调发生以后再释放。比如我们可以想到，这段代码所在类是一个单例，那么在它里面声明一个 List，将 downloader 放进去，等回调结束后再移除。这样就能保证 downloader 在回调发生时还没有被回收。

修改后的代码类似这样：

```java
// AliyunDownloadManager.java
private List<AliMediaDownloader> mJniDownloadLists = new ArrayList<>();

public void prepareDownload(final VidAuth vidAuth) {
    // some code here
    final AliMediaDownloader downloader = AliDownloaderFactory.create(mContext);
    downloader.setOnPrepareListener(new AliMediaDownloader.OnPreparedListener() {
            @Override
            public void onPrepared(MediaInfo mediaInfo) {
                // some code here
                // 增加了这一行
                mJniDownloadLists.remove(downloader);
            }
    });
    setErrorListener(downloader, null);
    // some code here
    // 增加了这一行
    mJniDownloadLists.add(downloader);
}

private void setErrorListener(final AliMediaDownloader jniDownloader, final AliyunDownloadMediaInfo aliyunDownloadMediaInfo) {
    // some code here
    jniDownloader.setOnErrorListener(new AliMediaDownloader.OnErrorListener() {
        @Override
        public void onError(ErrorInfo errorInfo) {
            // some code here
            // 增加了这一行
            mJniDownloadLists.remove(jniDownloader);
        }
    });
}
```

在尝试做以上修改时，发现了一个 **彩蛋**：

阿里云的官方 Demo 里，其实已经声明了 mJniDownloadLists，且有注释 `保存Downloader防止循环创建时,导致内存不足被回收,无法回调的问题`，并且在其它类型的 prepareDownload 里也做了类似的处理，但不知道为什么在 VidAuth 类型参数的 prepareDownload 里没有，可能是漏掉了。

## 小结

在 Android / Java 项目里，类似的场景应该并不少见。虽然 GC 带来了很多便利，但在实际编码时，我们也需要注意对象的生命周期管理，该存活的存活，该释放的释放，避免因为 GC 导致的问题。