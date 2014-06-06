---
layout: post
title: Windows界面相关小知识点
categories: Windows
---

Q：禁止Win7下窗口被拖到顶部时自动飘到左上角  
A：去掉窗口的WS_THICKFRAME风格

Q：将最小化或者不是在最前面的窗口激活到前面  
A：SwitchToThisWindow

Q：禁止双击标题栏最大化窗口  
A：屏蔽WM_NCLBUTTONDBLCLK消息

Q：禁止XP下右键任务栏的“最大化”菜单项  
A：去掉窗口的WS_MAXIMIZEBOX风格

Q：在任务管理器下”应用程序“标签栏不显示程序，但是在”进程“里显示进程  
A：一个可能的原因是窗口标题为空

Q：在XP任务栏右键无菜单，在Win7任务栏右键只有一个关闭项  
A：给窗口添加WS_SYSMENU风格

Q：程序的系统托盘图标右键菜单不消失
A：在`menu.TrackPopupMenu`前调用`SetForegroundWindow(m_hWnd)`
