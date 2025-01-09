---
layout: post
title: Mac mini 通过键盘连接蓝牙鼠标
categories: [Mac]
description: Mac mini 通过键盘连接蓝牙鼠标
keywords: Mac, Mac mini, 键盘, 蓝牙, 鼠标
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

前一阵发生过两次 Mac mini 与蓝牙鼠标断连的情况，都是通过借用别人的有线鼠标来重新连接的，终究不方便。

后来就想着，能不能通过键盘来连接蓝牙鼠标呢？摸索了一番，找到了方法，在此记录一下。

先上操作演示：

![](https://raw.githubusercontent.com/mzlogin/blog-assets/refs/heads/master/mac-match-bluetooth-mouse-by-keyboard.gif)

## 前置知识

看着上面的操作，是不是感觉 so easy？但实际上，我在操作过程中，一开始就遇到一个问题——焦点无法移动到设置面板右侧的按钮上。

这时我们要先了解一个关键的设置开关，以及它对应的快捷键：

![](/images/posts/mac/mac-settings-keyboard-navigator.png)

该开关默认关闭，切换开关的默认快捷键是 <kbd>Ctrl + F7</kbd>。

## 通过键盘连接蓝牙鼠标的方法

1. 通过键盘操作，打开系统设置：

   - 按下 <kbd>Cmd + 空格</kbd>，调出 Spotlight 搜索框；

   - 输入 *系统设置*，回车。

2. 通过键盘上下键，定位到 *蓝牙*；

3. 操作蓝牙鼠标，使其进入配对模式；（一般是长按鼠标底部的配对键）

4. 连续按下 <kbd>Tab</kbd> 键，定位到蓝牙鼠标对应设备的 *连接* 按钮；

    **注意：** 这里有可能发现，按 <kbd>Tab</kbd> 键焦点无法移动到设置面板右侧，这时就需用到我们前面提到的设置开关了，按下 <kbd>Ctrl + F7</kbd>，开启键盘导航功能，再按 <kbd>Tab</kbd> 键就可以移动焦点了。

5. 按下 <kbd>Space</kbd> 键，连接蓝牙鼠标。

大功告成！

## 其它思路

除上了述方法，我搜索的过程中还看到有一些其它思路，比如：

- <kbd>Cmd + Option + F5</kbd> 打开辅助功能里的一些开关，然后通过键盘模拟鼠标操作；
- 喊 Siri 帮你重启蓝牙；

可以按需尝试和使用。