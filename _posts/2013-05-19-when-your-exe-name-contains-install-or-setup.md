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

   完全相同的两个 EXE 文件，名字不一样：

   ![](/images/posts/windows/name.png)

### 问题分析

简而言之，上述现象发生的原因是 Windows Vista+ 系统的「安装程序检测」机制认为文件名中包含「install」、「update」或「setup」等字样，且没有在 Manifest 文件中显式指定 requestedExecutionLevel 的 32 位可执行程序是安装包，会主动为安装包弹出 UAC 提权申请，而「程序兼容性助手」会监控安装包的执行情况，如果它没有在「添加或删除程序」中创建一个条目，那「程序兼容性助手」会认为该安装包没有成功完成，在安装包结束后即弹出「程序兼容性助手」提示用户该程序可能安装不正确。

MSDN 关于「程序兼容性助手」的相关问答：

> 1. What is the detection logic, and how does PCA know that the setup failed due to version problems?
> 
>     PCA does not specifically look for the setup's failing due to version problems. The logic used by PCA is to detect if a setup did not complete successfully. It monitors a program detected as setup by Windows Vista and Windows Server 2008 and checks whether the program registers an entry in Add or Remove Programs (ARP). If no entries are created in ARP, PCA concludes that the installer did not complete successfully. It will then wait for the install program to terminate before displaying the UI. If it is an uninstaller, the detection looks for whether an entry was deleted from ARP.
> 
> 2. How does PCA get information about the setup programs?
> 
>     PCA relies on the User Account Control (UAC) feature in Windows Vista and Windows Server 2008 to know whether a program is a setup program. UAC includes detection for setup programs and will make sure the detected setup programs will be run as Administrator, which includes getting administrative credentials or confirmation from the user before launching the program.

原文链接：[Application Compatibility: Program Compatibility Assistant (PCA)](https://msdn.microsoft.com/zh-cn/bb756937)

MSDN 关于「安装程序检测」的相关介绍：

> Installer Detection only applies to:
> 
> * 32 bit executables
> * Applications without a requestedExecutionLevel
> * Interactive processes running as a Standard User with UAC enabled
> 
> Before a 32 bit process is created, the following attributes are checked to determine whether it is an installer:
> 
> * Filename includes keywords like "install," "setup," "update," etc.
> * Keywords in the following Versioning Resource fields: Vendor, Company Name, Product Name, File Description, Original Filename, Internal Name, and Export Name
> * Keywords in the side-by-side application manifest embedded in the executable
> * Keywords in specific StringTable entries linked in the executable
> * Key attributes in the resource file data linked in the executable
> * Targeted sequences of bytes within the executable

原文链接：[New UAC Technologies for Windows Vista](https://msdn.microsoft.com/EN-US/library/bb756960(v=VS.10,d=hv.2).aspx)

另外，微软的一个 PPT 介绍了「安装程序检测」和它可能产生的误判，以及解决的办法，给出的方案是内嵌 Manifest 或者外置一个名为「MyApp.exe.manifest」的文件：

* [Installer Detection - Microsoft](https://www.google.com.hk/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&ved=0CCUQFjABahUKEwiPmdW8rYjJAhVHG5QKHQwjBzY&url=%68%74%74%70%3a%2f%2f%64%6f%77%6e%6c%6f%61%64%2e%6d%69%63%72%6f%73%6f%66%74%2e%63%6f%6d%2f%64%6f%77%6e%6c%6f%61%64%2f%38%2f%43%2f%44%2f%38%43%44%30%31%35%42%42%2d%30%38%31%42%2d%34%39%43%35%2d%41%35%30%36%2d%39%43%39%42%35%37%30%42%38%44%44%32%2f%49%6e%73%74%61%6c%6c%65%72%44%65%74%65%63%74%69%6f%6e%2e%70%70%74%78&usg=AFQjCNHXcaCOv_FFndx0mxn7eovywzKQMg)

参考：

* [Application Manifest](https://msdn.microsoft.com/en-us/library/windows/desktop/dd371711(v=vs.85).aspx)
* [Application Compatibility: UAC: Standard User Changes](https://msdn.microsoft.com/zh-cn/enus/library/bb963893.aspx)


### 解决方案

**问题 1：**

如下三项任选其一：

一、给程序改个名字，不要包含「install」、「update」和「setup」字样。

二、为可执行文件添加类似如下的 Manifest 文件，指定程序兼容 Win7 与 Vista（或更高版本的当前系统）。

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
三、程序运行时在注册表项 `HKEY_CURRENT_USER\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Compatibility Assistant\Persisted` 下写入以可执行文件全路径为名，值为 REG_DWORD 类型的 1 的项。


**问题 2 和 3：**

这是 Windows Vista+ 系统对「安装包」的「特殊待遇」，如果你正在做安装包，那你应该不在乎这些；如果你正在做的不是「安装包」，那么将程序改名吧！去掉 install，去掉 update，去掉 setup，世界从此清净了。

### 结论

1. 如果你正在做的是安装包，那么遵循 Windows Vista+ 系统对安装包的一致规范，主动要求以管理员权限执行，并在安装任务成功完成后在「添加或删除程序」里添加新的条目。
2. 如果不是在做安装包，那么将程序改名能避免 Windows Vista+ 系统的误判导致的问题。
