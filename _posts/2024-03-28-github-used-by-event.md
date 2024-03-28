---
layout: post
title: 后续来了，GitHub 这样处理这件事
categories: [GitHub]
description: 之前我向 GitHub 举报了滥用 Used by 特性的事件，GitHub 一直没有给我回信，但实际他们已经悄悄地更新了。
keywords: GitHub
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

我在去年八月份给 GitHub 写信，举报了一个滥用「Used by」特性的事件，GitHub 一直没有给我回信。但是实际上，他们已经悄悄地更新了。

原始事件可以参考当时的记录：[发现一种增加在 GitHub 曝光量的方法，已举报][1]，简单来说就是有人在自己的项目里虚假声明自己依赖了大量知名项目，包括很多无法作为依赖包的项目，从而让自己的头像展示在这些知名项目的「Used by」栏目里。

最近留意了一下，发现我的一个 Star 数量较多的项目 [awesome-adb][3] 旁边已经不再展示「Used by」栏目了——本来就不应该展示。

翻阅了 GitHub 的 docs 更新记录，发现了这样一次 [提交][2]：

![](/images/posts/github/github-update-used-by-document.png)

从这段文档里可以看到，一个项目是否展示「Used by」栏目，原本是需要满足以下三个条件：

1. 项目的 dependency graph 是启用的；
2. 项目包含有发布在受支持的包管理系统里的 package；
3. package 在包管理系统上的资料里，源码链接指向该公开项目；

其实……原本这三个条件如果都认真执行的话，那些无法作为依赖包的项目是不会展示「Used by」栏目的，可事实是在我发信举报的那段时间，是会展示的，这就给滥用行为提供了空间。

而这次更新，GitHub 给「Used by」栏目展示又加上了一个条件：

- 超过 100 个项目依赖你项目的 package；

这样做的效果，至少能让那些滥用者的头像不会作为几分之一，显眼地出现在知名项目的「Used by」栏目里了，要么不出现，要么就与至少上百个人一起出现，也就是说，他们的滥用行为的曝光/收益会大打折扣了。

虽然跟我期待的处理不太一样，但好歹也算是有进步了。希望 GitHub 这次不只是加上了这个第四条，而是将前面三条也更认真地执行了，这样才能更好地避免滥用。

当然我还有个疑惑，为什么不给我回信？:thinking:

[1]: https://mp.weixin.qq.com/s/eVufTHDQI8MBMe2RFHmeUw
[2]: https://github.com/github/docs/commit/86f3098c850b3d9ea69dc7d2f251f7310fc7796a
[3]: https://github.com/mzlogin/awesome-adb