---
layout: post
title: Windows 界面相关小知识点
categories: Windows
description: Win32 编程中与界面相关的一些小的知识点总结。
keywords: Windows, UI
---

1. 禁止 Win7 下窗口被拖到顶部时自动飘到左上角

   去掉窗口的 WS\_THICKFRAME 风格

1. 将最小化或者不是在最前面的窗口激活到前面

   SwitchToThisWindow

1. 禁止双击标题栏最大化窗口

   屏蔽 WM\_NCLBUTTONDBLCLK 消息

1. 禁止 XP 下右键任务栏的「最大化」菜单项

   去掉窗口的 WS\_MAXIMIZEBOX 风格

1. 在任务管理器下「应用程序」标签栏不显示程序，但是在「进程」里显示进程

   一个可能的原因是窗口标题为空

1. 在 XP 任务栏右键无菜单，在 Win7 任务栏右键只有一个关闭项

   给窗口添加 WS\_SYSMENU 风格

1. 程序的系统托盘图标右键菜单不消失

   在`menu.TrackPopupMenu`前调用`SetForegroundWindow(m_hWnd)`

1. 子窗口显示 / 不显示任务栏图标

   通过`SetWindowLong`修改窗口的扩展风格，WS\_EX\_APPWINDOW 是显示，WS\_EX\_TOOLWINDOW 是不显示。
