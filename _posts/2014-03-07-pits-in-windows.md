---
layout: post
title: Windows API 中的坑
categories: Windows
description: 在 Windows API 中有一些坑，一不小心就会引发一些不易察觉的 Bug。
keywords: API
---

### ExpandEnvironmentStrings

**风险：**

进程会继承其父进程的环境变量，在展开如 %APPDATA% 等目录时，有可能父进程对此环境变量进行过修改，那么可能你获取的就不是你想要的当前 SESSION 的 %APPDATA% 了。

**建议：**

使用 SHGetFolderPath 系列函数来做这件事。

### GetModuleFileName

**风险：**

在 DLL 中调用时，若传入的 instance 参数为 NULL，那获取的将是加载 DLL 的进程的 EXE 的路径，若需要获取 DLL 的路径，传入的 instance 参数需为 DLL 的 hModule。

### RegQueryValueEx

**风险：**

最后一个参数为 inout 参数，需要带入 Buffer 的 Bytes 数。不然可能出现 API 调用失败，返回 ERROR_MORE_DATA 等错误码。

**建议：**

调用 Windows API 时对参数的 in、out、inout 及要求的取值弄清楚。

PS：这个严格来讲不算是坑，是在 Windows API 中存在的一种现象，但是如果不小心也可能出现很难解释和调试的 BUG，记在此以备忘。

### ShellExecuteEx

**风险：**

调用 API 之后，若初始 MASK 设置不正确，SHELLEXECUTEINFO 结构体里的 hProcess 可能为空。

**建议：**

若确定要使用 hProcess，则在调用 ShellExecuteEx 前确认 SHELLEXECUTEINFO 结构体的 fMask 成员设置为 SEE_MASK_NOCLOSEPROCESS。而且 MSDN 上对 hProcess 成员的注释如下：

> A handle to the newly started application. This member is set on return and is always NULL unless fMask is set to SEE_MASK_NOCLOSEPROCESS. Even if fMask is set to SEE_MASK_NOCLOSEPROCESS, hProcess will be NULL if no process was launched. For example, if a document to be launched is a URL and an instance of Internet Explorer is already running, it will display the document. No new process is launched, and hProcess will be NULL.
> Note   ShellExecuteEx does not always return an hProcess, even if a process is launched as the result of the call. For example, an hProcess does not return when you use SEE_MASK_INVOKEIDLIST to invoke IContextMenu.

### UrlDownloadToFile

**风险 1：**

使用 UrlDownloadToFile 下载文件，若文件内容经过 gzip 压缩，即返回 header 包括 Content-Encoding: gzip，若调用线程没有初始化 COM，那 UrlDownloadToFile 会失败，因为 urlmon 不能正确处理压缩后的数据包。

**建议：**

调用此函数前需确保该线程已经调用 CoInitialize。

**风险 2：**

使用 UrlDownloadToFile 下载文件前它会自动先在本地缓存中查找此文件，所以可能最终得到的不是 Server 上的最新内容。

**建议：**

可以为 URL 添加随机参数以防止缓存，也可以使用 DeleteUrlCacheEntry 清理缓存后再使用 UrlDownloadToFile 下载文件。
