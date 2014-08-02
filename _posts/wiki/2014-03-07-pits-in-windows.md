---
layout: post
title: Windows API中的坑
categories: Windows
---

###Index
* [ExpandEnvironmentStrings](#ExpandEnvironmentStrings)  
* [GetModuleFileName](#GetModuleFileName)  
* [ShellExecuteEx](#ShellExecuteEx)  
* [UrlDownloadToFile](#UrlDownloadToFile)  

###ExpandEnvironmentStrings  
**风险：**  
进程会继承其父进程的环境变量，在展开如%APPDATA%等目录时，有可能父进程对此环境变量进行过修改，那么可能你获取的就不是你想要的当前SESSION的%APPDATA%了。  
**建议：**  
使用SHGetFolderPath系列函数来做这件事。

###GetModuleFileName
**风险：**  
在DLL中调用时，若传入的instance参数为NULL，那获取的将是加载DLL的进程的EXE的路径，若需要获取DLL的路径，传入的instance参数需为DLL的hModule。

###ShellExecuteEx
**风险：**  
调用API之后，若初始MASK设置不正确，SHELLEXECUTEINFO结构体里的hProcess可能为空。  
**建议：**
若确定要使用hProcess，则在调用ShellExecuteEx前确认SHELLEXECUTEINFO结构体的fMask成员设置为SEE_MASK_NOCLOSEPROCESS。而且MSDN上对hProcess成员的注释如下：  
> A handle to the newly started application. This member is set on return and is always NULL unless fMask is set to SEE_MASK_NOCLOSEPROCESS. Even if fMask is set to SEE_MASK_NOCLOSEPROCESS, hProcess will be NULL if no process was launched. For example, if a document to be launched is a URL and an instance of Internet Explorer is already running, it will display the document. No new process is launched, and hProcess will be NULL.  
> Note   ShellExecuteEx does not always return an hProcess, even if a process is launched as the result of the call. For example, an hProcess does not return when you use SEE_MASK_INVOKEIDLIST to invoke IContextMenu.  

###UrlDownloadToFile
**风险1：**  
使用UrlDownloadToFile下载文件，若文件内容经过gzip压缩，即返回header包括Content-Encoding: gzip，若调用线程没有初始化COM，那UrlDownloadToFile会失败，因为urlmon不能正确处理压缩后的数据包。  
**建议：**  
调用此函数前需确保该线程已经调用CoInitialize。   

**风险2：**  
使用UrlDownloadToFile下载文件前它会自动先在本地缓存中查找此文件，所以可能最终得到的不是Server上的最新内容。  
**建议：**  
可以为URL添加随机参数以防止缓存，也可以使用DeleteUrlCacheEntry清理缓存后再使用UrlDownloadToFile下载文件。
