---
layout: post
title: 发布一款光谷社区第三方 Android App
categories: Android
description: 光谷社区第三方 Android App。
keywords: Android, 光谷社区
---

在过去的一个来月，我利用业余时间做了一款光谷社区的第三方 Android 客户端。

## 前言

光谷社区是我在决定离开帝都回武汉的过程中，及回武汉之后关注得较多的武汉本土社区，网站 <http://guanggoo.com> 自己的 description 是这样的：

> 光谷社区是源自光谷的高端社交网络，这里有关于创业、创意、IT、金融等最热话题的交流，也有招聘问答、活动交友等最新资讯的发布。

描述得还比较准确。我觉得身在光谷，或者心系光谷的童鞋们可以关注一下。

## 发布详情

目前支持特性：

1. 登录
2. 首页主题列表（三种视图）
3. 主题详情 / 评论列表
4. 节点列表 / 节点主题列表
5. 评论 / 艾特用户
6. 分享主题链接
7. 发表新主题
8. 查看用户信息

源码放在 GitHub 上：

<https://github.com/mzlogin/guanggoo-android>

部分界面截图：

![](https://mazhuang.org/guanggoo-android/screenshots/topic-list.png)

![](https://mazhuang.org/guanggoo-android/screenshots/topic-detail.png)

![](https://mazhuang.org/guanggoo-android/screenshots/nodes-list.png)

![](https://mazhuang.org/guanggoo-android/screenshots/drawer.png)

更多的功能开发、完善以及优化还在进行中，也希望看到的朋友们下载试用起来，多提建议多交流。

好吧，啰嗦了这么多，哪里能够下载得到呢？

**APK 下载链接**

（如果是在微信里看到这里，建议长按后复制链接到浏览器打开）

<https://mazhuang.org/guanggoo-android/guanggoo-lastest.apk>

百度网盘备用链接：

<https://pan.baidu.com/s/1pL0t1Zd>

**扫描或识别二维码下载**

（如果使用微信识别二维码不能开始下载，还是复制上方的链接到浏览器打开下载吧）

<div align="center"><img width="192px" height="192px" src="https://mazhuang.org/guanggoo-android/qrcode.png"/></div>

## 为什么会做这个

1. 社区目前只有 Web 页面，做了移动端适配，体验也还不错。不过作为一个打开频率较高的应用，我还是希望能用上 App；

2. 之前偶然在社区的几个帖子里也有一些用户问到是否有 App 可用，都没有了下文，可以满足一下这部分用户的需求；

3. 作为一个长期维护的业余项目，更深刻地体会 App 开发的整个生命周期，也将一些想学习的技术应用到实际项目中；

4. 借此机会认识一下光谷技术圈子里志趣相投的朋友。

## 前缘后续

上 GitHub 搜索 guanggoo 出来的结果很少，发现有一个 [cauil/react-native-guanggoo](https://github.com/cauil/react-native-guanggoo) 的项目适配了 iOS，独缺 Android 客户端，于是决定自己写一个。要不是那一阵刚好闹 Facebook 开源许可证风波，让人没有学习 React Native 的信心和欲望，也许我就学点 React Native 在这位仁兄的基础上开发了。

经过几周业余时间和十一长假期间的开发，目前完成度不算特别高，但常用的功能已经基本可用了，当然还有一些功能比如注册、帖子里的外部链接打开等，我是先抛给了系统浏览器。想着只埋头自己开发也比较枯燥，决定先放出一个版本来让网友们吐吐槽，提提意见，应该能做得更好。

PS: 本文非软文，也没有收取光谷社区任何好处，请光谷社区嘴炮管理员看到这里帮我开通个 VIP，我的社区 ID 是 mzlogin，:-P。

---

好了，最后照例安利一下我自己的微信公众号，近期专注 Java、Android 相关的技术分享，如果你感兴趣，可以关注一下接收最新动态。

<div align="center"><img width="192px" height="192px" src="https://mazhuang.org/assets/images/qrcode.jpg"/></div>
