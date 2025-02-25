---
layout: post
title: iOS｜一名 iOS 开发新手的前两次 App 审核经历
categories: [iOS]
description: 一名 iOS 开发新手的前两次 App 审核经历
keywords: iOS, App 审核
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

说来惭愧，独立支撑公司的软件系统已经一年有余，多数的精力都在开发和迭代 Web 服务与 Android 端，对于 iOS App 则是一直没有更新，遇到相关的 bug 反馈也是能拖就拖——毕竟，大多数情况下找个 workaround 还是不难的。

回过头想想，可能潜意识里一直有点犯怵，觉得 iOS 开发是自己的薄弱环节，所以总想着等有时间，再多学一点相关的东西，准备得更充分、更有自信能处理好了，再去更新。可一直这样下去也不是办法，所以春节前结合一些业务需求，我决定逼自己一把，尽快把 iOS App 更新一下。

相关开发知识掌握有限——不是问题，突击阅读了一波相关文档，然后在这个 AI 大行其道的时代，作为尊贵的 GitHub Copilot Pro 用户，在插件的辅助下光速添加了一个新的小功能，修复了一些 bug 后，我向 App Store Connect 提交了我的第一次版本审核，本以为需要经过漫长的等待，结果……

![](/images/posts/ios/app-review-1.png)

事情出乎意料地顺利，几个小时就通过了，这玩意也有新手保护期？

满怀得意我心欢喜，于是一鼓作气把囤积已久的几个 feature 给做了，然后兴冲冲地提交了第二次版本审核，结果……

几个小时后第一次被驳回，原因是：

```
Guideline 3.1.1 - Business - Payments - In-App Purchase

We found in our review that your app or its metadata provides access to mechanisms other than in-app purchase for purchases or subscriptions to be used in the app, which does not comply with the App Review Guidelines. Specifically:


- Your app's binary includes the following call-to-action and/or URL that directs users to external mechanisms for purchases or subscriptions to be used in the app:


User have to contact customer service to puchase credits.
```

看截图我查到了这是几年前参考一个大厂 App 实现的效果，在用户余额不足时，弹出一个提示框，上面有两个按钮，一个点击后展示了客服的联系方式，一个是「取消」，点击后跳转到充值页面。

我以为这里面的问题点主要是没有明确的「去充值」入口，导致审核人员以为用户无法直接充值，必须联系客服，于是我添加了一个「去充值」的按钮，将「取消」按钮的动作改为隐藏提示框，然后再次提交审核，结果几个小时后又被驳回了，原因仍然是：

```
- Your app's "xxx" page includes the following call-to-action and/or URL that directs users to external mechanisms for purchases or subscriptions to be used in the app
```

不过发过来的消息里还有这样一段：

```
Bug Fix Submissions

The issues we've identified below are eligible to be resolved on your next update. If this submission includes bug fixes and you'd like to have it approved at this time, reply to this message and let us know. You do not need to resubmit your app for us to proceed.


Alternatively, if you'd like to resolve these issues now, please review the details, make the appropriate changes, and resubmit.
```

其实，这时候我只要回复个消息，说我这次提交包含了一些 bug 修复，希望能通过审核，下次我再修复这个问题，就妥了……

但我当时脑子里不知道咋想的，可能是觉得小问题，这次解决掉算了，然后就又改了一版，将那个跳转到客服联系方式的按钮去掉，又提交了一版，这时候我以为这把稳了，就收工等消息了。

回家正刷着沙雕视频呢，弹出来消息，又被拒了，这回是什么原因呢……

```
Guideline 2.1 - Performance - App Completeness
Issue Description


The app exhibited one or more bugs that would negatively impact App Store users.


Bug description: unable to load "xxx"
```

我人都懵了，这个功能已经在线上跑了几年了，最近也没改过，怀疑可能是审核员当时遇上了什么网络波动之类的，导致没加载出来。

