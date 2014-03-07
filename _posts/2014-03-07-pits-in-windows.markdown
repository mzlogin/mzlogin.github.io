---
layout: post
title: Windows API中的坑
categories: Windows
---

###ExpandEnvironmentStrings  
**风险：**  
进程会继承其父进程的环境变量，在展开如%APPDATA%等目录时，有可能父进程对此环境变量进行过修改，那么可能你获取的就不是你想要的当前SESSION的%APPDATA%了。  
**建议：**  
使用SHGetFolderPath系列函数来做这件事。
