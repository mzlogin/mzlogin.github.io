---
layout: post
title: Windows 实用技巧汇总
categories: Windows
description: 平时使用 Windows 时总结的一些实用的小技巧。
keywords: Windows, Skill
---

**目录**

* TOC
{:toc}

### Win7 不按 Shift，右键显示 "在此处打开命令窗口 (W)"

<img src="/images/posts/windows/rclick.png" alt="Windows Skills" />

图上的这条右键命令一般在 Win7 下是需要 Shift + 右键在弹出菜单里才能看到的，怎么省掉这个 Shift，直接就能出来呢？

先说方法：

将如下代码保存为 .reg 文件然后执行即可。

```
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\shell\cmd]
"Extended"=-

[HKEY_CLASSES_ROOT\Drive\shell\cmd]
"Extended"=-

[HKEY_CLASSES_ROOT\LibraryFolder\background\shell]
@="none"

[HKEY_CLASSES_ROOT\LibraryFolder\background\shell\cmd]
@="@shell32.dll,-8506"
"NoWorkingDirectory"=""
"Extended"=-

[HKEY_CLASSES_ROOT\LibraryFolder\background\shell\cmd\command]
@="cmd.exe /s /k pushd \"%V\""
```

再说原理：

1. 普通文件夹右键

   将注册表 HKEY_CLASSES_ROOT\Directory\Background\shell\cmd 下的键 Extended 改名或者删除

2. 磁盘分区右键

   将注册表 HKEY_CLASSES_ROOT\Drive\shell\cmd 下的键 Extended 改名或者删除

3. 库文件夹右键

   在注册表 HKEY_CLASSES_ROOT\LibraryFolder\background 下建立和第一条的 Directory\Background 中相同的键值

### Win7 搜索文件内容

控制面板 -- 索引选项 -- 高级 -- 文件类型 -- 找到你想要搜索内容的文件后缀名，点中它，然后选中下面的「为属性和文件内容添加索引」。

### 将 Caps Lock 映射为 Ctrl

**注：**经验证此方法也适用于 Win10，但是完成后需要**重启**。

因为个人习惯输入大写字母时使用「Shift + 字母」的方式，所以 Caps Lock 键并没有什么用，而且经常使用 Vim，偶尔使用 Emacs，都需要频繁地按 Ctrl 键，在 Mac OS X 下已经将 Caps Lock 键映射为 Ctrl，为了统一体验和按键方便，也需要在 Windows 下做一个映射。

先说方法：

将如下代码保存为 .reg 文件然后执行即可。

```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout]
"Scancode Map"=hex:00,00,00,00,00,00,00,00,02,00,00,00,1d,00,3a,00,00,00,00,00
```

再说原理：

Scancode Map 这个键值的讲解实例参见 [Keyboard and mouse class drivers (Windows Drivers)](https://msdn.microsoft.com/en-us/library/windows/hardware/jj128267(v=vs.85).aspx#code-snippet-1)，我们这里填写的值

```
00000000 00000000 02000000 1d003a00 00000000
```

可以对应理解如下：

| 值         | 说明                                     |
|------------|------------------------------------------|
| 0x00000000 | Header: 版本。全部设置为 0。             |
| 0x00000000 | Header: 标志。全部设置为 0。             |
| 0x00000002 | 2 条映射条目（包括结尾的 null 条目）。   |
| 0x003a001d | Caps Lock --> Left Ctrl (0x3a --> 0x1d). |
| 0x00000000 | 终止符，即 null 条目。                   |

### 将任务栏库图标变成打开计算机

1. 右键任务栏库图标，右键弹出菜单里的“Windows 资源管理器”，单击“属性”。

   ![](/images/posts/windows/library-to-computer-step-1.jpg)

2. 在弹出对话框里将“目标”一栏的 `%windir%\explorer.exe` 改为 `%windir%\explorer.exe ,`，即加上一个空格一个逗号。

   ![](/images/posts/windows/library-to-computer-step-2.png)

参考：[如何将Win7/Win8任务栏库图标变为打开计算机](http://jingyan.baidu.com/article/046a7b3ee71d61f9c27fa91a.html)
