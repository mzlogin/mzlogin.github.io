---
layout: wiki
title: Source Insight
cate1: Tools
cate2: 
description: Source Insight 工具的快捷键及使用日常。
keywords: Source Insight
---

### 快捷键

C --> Ctrl

S --> Shift

M --> Alt

| 功能         | 快捷键 |
|:-------------|:-------|
| 返回         | M-,    |
| 前进         | M-.    |
| 跳到定义     | C-=    |
| 查找引用     | C-/    |
| 搜索         | C-f    |
| 向下搜索     | F4     |
| 向上搜索     | F3     |
| 高亮当前单词 | S-F8   |

### Q&A

1. 新建工程后函数跳转等遇到 `symbol not found` 如何解决？

   打开菜单里的「Project」-「Synchronize Files」（快捷键 <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>），勾选 `Force all files to be re-parsed` 后点击 `OK`，等待 Source Insight 重新解析工程里的文件完成即可。

2. 如何在标题栏里显示文件全路径？

   打开菜单里的「Options」-「Preferences」-「Display」，取消勾选 `Trim long path names with ellipses`。
