---
layout: fragment
title: Mac 下让 Spotlight 显示英汉汉英互译
tags: [mac]
description: Mac 下让 Spotlight 显示中英互译
keywords: Mac, Spotlight, 翻译
---

Mac 下的 Spotlight（即「聚焦」）可以很方便地启动应用、搜索文件等，我常用的还有一个功能就是当作英汉汉英词典使用。

我期望的行为：

1. 在搜索框中输入中文，出现的提示列表里有一项是它的英文翻译；
2. 在搜索框中输入英文，出现的提示列表里有一项是它的中文翻译。

实际使用时发现行为 1 默认就是有的，但行为 2 没有。

需要简单的配置：

1. 在「系统偏好设置」的「聚焦」里确认「定义」是勾选上的；
2. 打开「词典.app」的偏好设置，将英汉汉英词典勾选并拖到第一位；
   ![](/images/fragments/mac-dict-order.png) 

如果不生效，可以重启下电脑。

效果图：

![](/images/fragments/mac-spotlight-c2e.png)

![](/images/fragments/mac-spotlight-e2c.png)

参考：[让spotlight 显示中英翻译 - 钜添](http://howboring.us/archives/mac-spotlight-chinese2english.html)
