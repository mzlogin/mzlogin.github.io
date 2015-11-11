---
layout: post
title: 可执行文件名中包含 install 或 setup
categories: Windows
description: EXE 文件名称中含有 install、update 或者 setup 会导致一些问题，现象和解决方法。
keywords: EXE, Windows
---

### 问题描述

在 Windows Vista+ 系统下，若 EXE 文件名中包含有「install」、「update」或「setup」等字样，可能出现如下问题：

1. 每次软件运行完退出后会弹出「程序兼容性助手」（Program Compatibility Assistant, 简称 PCA），提示软件未正确安装。

    ![](/images/posts/windows/pca.png)

2. 在 Vista+ 的操作系统下任务栏右键该程序缺少「将此程序锁定到任务栏」和软件名同名项。

    | 程序名    | 运行时任务栏右键                     |
    |-----------|--------------------------------------|
    | a.exe     | ![](/images/posts/windows/a.png)     |
    | setup.exe | ![](/images/posts/windows/setup.png) |


3. 你的程序没打算要求管理员权限的，但是运行的时候却弹 UAC 了。

    完全相关的两个 EXE 文件，名字不一样：

    ![](/images/posts/windows/name.png)

### 问题分析

Windows 会自动进行启发式的安装包嗅探，估计其中的一条规则就是如果软件名中含有 install 或 setup 就会认为运行的软件是一个安装包。

参考：

* [New UAC Technologies for Windows Vista](https://msdn.microsoft.com/EN-US/library/bb756960(v=VS.10,d=hv.2).aspx)
* [Application Manifest](https://msdn.microsoft.com/en-us/library/windows/desktop/dd371711(v=vs.85).aspx)

### 解决方案

**问题 1：**

满足如下两项之一：

一、在注册表项 HKEY_CURRENT_USER\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Compatibility Assistant\Persisted 下有以可执行文件全路径为名，值为 REG_DWORD 类型的 1 的项。

二、为可执行文件添加类似如下的 Manifest 文件，指定程序支持 Win7 与 Vista。

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
    <compatibility xmlns="urn:schemas-microsoft-com:compatibility.v1">
      <application>
        <!--The ID below indicates application support for Windows Vista -->
          <supportedOS Id="{e2011457-1546-43c5-a5fe-008deee3d3f0}"/>
        <!--The ID below indicates application support for Windows 7 -->
          <supportedOS Id="{35138b9a-5d96-4fbd-8e2d-a2440225f93a}"/>
      </application>
    </compatibility>
  </assembly>
```

**问题 2 和 3：**

目前没有找到什么好方法，靠谱的就是将程序改名吧！去掉 install，去掉 setup，世界从此清净了。

**结论：**

将程序改名吧！如果你也同意将精力放在纠结上面这些事情还不如去干点更有用的事件的观点的话。
