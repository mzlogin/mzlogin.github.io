---
layout: post
title: Windows实用技巧汇总
categories: Windows
---

###Win7不按Shift,右键显示"在此处打开命令窗口(W)"  
<img src="/images/posts/windowsskill/rclick.png" alt="Windows Skills" />
图上的这条右键命令一般在Win7下是需要Shift + 右键在弹出菜单里才能看到的，怎么省掉这个Shift，直接就能出来呢？  
一、普通文件夹右键：  
将注册表HKEY_CLASSES_ROOT\Directory\Background\shell\cmd下的键Extended改名或者删除  
二、磁盘分区右键：  
将注册表HKEY_CLASSES_ROOT\Drive\shell\cmd下的键Extended改名或者删除  

###Win7搜索文件内容  
控制面板--索引选项--高级--文件类型--找到你想要搜索内容的文件后缀名，点中它，然后选中下面的“为属性和文件内容添加索引”。
