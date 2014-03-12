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

###GetModuleFileName
**风险：**  
在DLL中调用时，若传入的instance参数为NULL，那获取的将是加载DLL的进程的EXE的路径，若需要获取DLL的路径，传入的instance参数需为DLL的hModule。

###UrlDownloadToFile
**风险：**  
  1. 使用UrlDownloadToFile下载文件，若文件内容经过gzip压缩，即返回header包括Content-Encoding: gzip，若调用线程没有初始化COM，那UrlDownloadToFile会失败，因为urlmon不能正确处理压缩后的数据包。*所以调用此函数前需确保该线程已经调用CoInitialize。*  
  2. 使用UrlDownloadToFile下载文件前它会自动先在本地缓存中查找此文件，所以可能最终得到的不是Server上的最新内容。*可以为URL添加随机参数以防止缓存，也可以使用DeleteUrlCacheEntry清理缓存后再使用UrlDownloadToFile下载文件。*
