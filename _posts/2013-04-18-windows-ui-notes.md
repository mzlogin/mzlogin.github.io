---
layout: post
title: Windows界面相关小知识点
categories: Windows
description: Win32编程中与界面相关的一些小的知识点总结。
keywords: Windows, UI
---

1. 禁止Win7下窗口被拖到顶部时自动飘到左上角

    去掉窗口的WS\_THICKFRAME风格

1. 将最小化或者不是在最前面的窗口激活到前面

    SwitchToThisWindow

1. 禁止双击标题栏最大化窗口

    屏蔽WM\_NCLBUTTONDBLCLK消息

1. 禁止XP下右键任务栏的“最大化”菜单项

    去掉窗口的WS\_MAXIMIZEBOX风格

1. 在任务管理器下”应用程序“标签栏不显示程序，但是在”进程“里显示进程

    一个可能的原因是窗口标题为空

1. 在XP任务栏右键无菜单，在Win7任务栏右键只有一个关闭项

    给窗口添加WS\_SYSMENU风格

1. 程序的系统托盘图标右键菜单不消失

    在`menu.TrackPopupMenu`前调用`SetForegroundWindow(m\_hWnd)`

1. 子窗口显示/不显示任务栏图标

    通过`SetWindowLong`修改窗口的扩展风格，WS\_EX\_APPWINDOW是显示，WS\_EX\_TOOLWINDOW是不显示。
