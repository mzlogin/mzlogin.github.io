---
layout: post
title: Windows 实用技巧汇总
categories: Windows
description: 平时使用 Windows 时总结的一些实用的小技巧。
keywords: Windows, Skill
---

### Win7 不按 Shift，右键显示 "在此处打开命令窗口(W)"

<img src="/images/posts/windowsskill/rclick.png" alt="Windows Skills" />

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

###Win7 搜索文件内容

控制面板--索引选项--高级--文件类型--找到你想要搜索内容的文件后缀名，点中它，然后选中下面的“为属性和文件内容添加索引”。
