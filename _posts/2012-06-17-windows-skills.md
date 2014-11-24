---
layout: post
title: Windows实用技巧汇总
categories: Windows
---

###Win7不按Shift,右键显示"在此处打开命令窗口(W)"  
<img src="/images/posts/windowsskill/rclick.png" alt="Windows Skills" />
图上的这条右键命令一般在Win7下是需要Shift + 右键在弹出菜单里才能看到的，怎么省掉这个Shift，直接就能出来呢？  

先说方法：

将如下代码保存为.reg文件然后执行可以方便地完成如上三点操作。

```
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\shell\cmd]
"Extended"=-

[HKEY_CLASSES_ROOT\Drive\shell\cmd]
"Extended"=-

[HKEY_CLASSES_ROOT\LibraryFolder\shell]
@="none"

[HKEY_CLASSES_ROOT\LibraryFolder\shell\cmd]
@="@shell32.dll,-8506"
"NoWorkingDirectory"=""
"Extended"=-

[HKEY_CLASSES_ROOT\LibraryFolder\shell\cmd\command]
@="cmd.exe /s /k pushd \"%V\""
```

再说原理：

1. 普通文件夹右键  
将注册表HKEY_CLASSES_ROOT\Directory\Background\shell\cmd下的键Extended改名或者删除  

2. 磁盘分区右键  
将注册表HKEY_CLASSES_ROOT\Drive\shell\cmd下的键Extended改名或者删除  

3. 库文件夹右键  
在注册表HKEY_CLASSES_ROOT\LibraryFolder下建立和Directory或Drive中相同的键值


###Win7搜索文件内容  
控制面板--索引选项--高级--文件类型--找到你想要搜索内容的文件后缀名，点中它，然后选中下面的“为属性和文件内容添加索引”。
