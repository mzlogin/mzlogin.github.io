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

这是触发了 Windows Vista+ 系统的「安装程序检测」。

如下是我对 MSDN 里相关段落的翻译和理解。

**安装程序检测**

安装程序被用于发布软件，它们大多需要对系统目录和注册表进行写入，这些受保护的系统位置通常只有管理员用户才可写。Windows Vista 会对安装程序进行启发式检测，并帮助它们请求管理员凭证或者批准以取得受保护的系统位置的访问权限。Windows Vista 也会对更新和卸载程序进行启发式检测。

「安装程序检测」会发生在如下三个条件满足时：

* 32 位可执行程序。
* 程序没有在内嵌 Manifest 文件里显式指定 requestedExecutionLevel。
* 在 UAC 启用的情况下，它的父进程是以普通用户权限运行。

在一个 32 位进程创建前，会检测如下属性来确定它是否是一个安装包：

* 文件名包含「install」、「setup」和「update」等关键词。
* 在版本资源信息的 Vendor、Company Name、Product Name、File Description、Original Filename、Internal Name 和 Export Name 字段里的关键词。
* 内嵌在可执行程序里的 Manifest 文件里的关键词。
* 可执行程序的特定 StringTable 条目里的关键词。
* 可执行程序里链接的资源文件数据的关键属性。
* 可执行文件里的针对性字节序列。

> 上面所说的关键词和字节序列是从各种安装包技术的共同特性里推论出来的。

参考：

* [New UAC Technologies for Windows Vista](https://msdn.microsoft.com/EN-US/library/bb756960(v=VS.10,d=hv.2).aspx)
* [Application Manifest](https://msdn.microsoft.com/en-us/library/windows/desktop/dd371711(v=vs.85).aspx)
* [Application Compatibility: UAC: Standard User Changes](https://msdn.microsoft.com/zh-cn/enus/library/bb963893.aspx)

微软的一个 PPT 讲了「安装包检测」和它可能误判以及解决的办法，给出的方案是内嵌或者外置一个名为「你的程序.exe.manifest」的 Manifest 文件：

* [Installer Detection - Microsoft](https://www.google.com.hk/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&ved=0CCUQFjABahUKEwiPmdW8rYjJAhVHG5QKHQwjBzY&url=%68%74%74%70%3a%2f%2f%64%6f%77%6e%6c%6f%61%64%2e%6d%69%63%72%6f%73%6f%66%74%2e%63%6f%6d%2f%64%6f%77%6e%6c%6f%61%64%2f%38%2f%43%2f%44%2f%38%43%44%30%31%35%42%42%2d%30%38%31%42%2d%34%39%43%35%2d%41%35%30%36%2d%39%43%39%42%35%37%30%42%38%44%44%32%2f%49%6e%73%74%61%6c%6c%65%72%44%65%74%65%63%74%69%6f%6e%2e%70%70%74%78&usg=AFQjCNHXcaCOv_FFndx0mxn7eovywzKQMg)

虽然 Windows 代替这个它认为的「安装包」做决定弹出了 UAC 提权申请，但是可能因为如下原因，它还是弹出了「程序兼容性助手」询问用户该程序是否「安装」成功：

* Windows Vista+ 程序认为没有 Manifest 文件的 32 位程序是「古老」的。
* 该程序被认为是安装包，但是并没有主动要求管理员权限，它的有些操作可能会因为权限不够而失败。

### 解决方案

**问题 1：**

满足如下两项之一：

一、在注册表项 `HKEY_CURRENT_USER\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Compatibility Assistant\Persisted` 下有以可执行文件全路径为名，值为 REG_DWORD 类型的 1 的项。

二、为可执行文件添加类似如下的 Manifest 文件，指定程序兼容 Win7 与 Vista。

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

目前没有找到什么好方法，靠谱的就是将程序改名吧！去掉 install，去掉 update，去掉 setup，世界从此清净了。

### 结论

将程序改名吧！如果你也同意将精力放在纠结上面这些事情还不如去干点更有用的事件的观点的话。
