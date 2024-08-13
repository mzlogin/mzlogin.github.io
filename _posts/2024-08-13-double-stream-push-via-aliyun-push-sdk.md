---
layout: post
title: Android｜使用阿里云推流 SDK 实现双路推流不同画面
categories: [Android]
description: 阿里云推流 SDK 原生并不支持多路推流，但可以自己想办法实现。
keywords: Android, 推流, 阿里云, 双路推流, 不同画面
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

本文记录了一种使用没有原生支持多路推流的阿里云推流 Android SDK，实现同时推送两路不同画面的流的方法。

## 需求

项目上有一个用于直播的 APP，可以在 Android 平板上录屏进行推流直播，然后通过阿里云的直播转 VOD 方式形成录播视频。屏幕上的内容分为 A、B 两个区域，如图所示：

![](/images/posts/android/aliyun-push-sdk-double-stream-requirements.drawio.png)

原本是只推送 A 区域的画面，也就是用户观看直播和录播时，都只能看到 A 区域。

现在要求变成用户观看直播时，可以看到 A 区域的内容；而观看录播时，可以同时看到 A 区域和 B 区域的内容。

## 思路

大致思考后，有两种思路：

一种是推流时，推送 A 区域 加 B 区域的画面，然后在观看直播时，将画面进行截取展示，在录播时则直接展示完整画面；

另一种是推流时，分别推送两路流，一路只推送 A 区域，另一路则推送 A 区域 加 B 区域，观看直播时拉第一路流，观看录播时展示第二路流转的 VOD 视频。

基于项目的现状——推流只有一个 Android 端，而播放则需要适配 Web PC、Web Mobile、Android 和 iOS，所以选择了第二种方案，这样只需对推流端进行改造，然后服务端接口进行简单调整即可。

## 方案

一个残酷的现实是，阿里云推流 Android SDK 并没有原生支持多路推流的功能，官方文档有提到：

> AlivcLivePusher目前不支持多实例

经过尝试，发现在一个进程里创建两个 AlivcLivePusher 实例，确实无法同时正常使用。

那只能自己想点黑科技了……

最终的实现方案：

![](/images/posts/android/aliyun-push-sdk-double-stream-solution.drawio.png)

简单来讲，就是在推流时，启动位于另一个进程的 Service，初始化另一个 AlivcLivePusher，进行第二路推流。

每当有新的视频帧时，写入 MemoryFile，然后通过 AIDL 调用将 ParcelFileDescriptor 传递给 Service，Service 读取 MemoryFile，进行处理后推给第二路流。

音频帧同理。

## 小结

经过一些调试和优化，最终实现了需求里想要的双路推流不同画面的效果。

这种方式虽然有点绕，但是在没有原生支持的情况下，也算是一种可用的方案了。

如果没有项目和业务的历史包袱，可以优先考虑使用原生支持多路推流的 SDK，比如大牛直播等，这样可能会更加方便和稳定。