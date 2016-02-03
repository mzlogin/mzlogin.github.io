---
layout: post
title: 定制 Fiddler 之抓获 WinHTTP 请求
categories: Fiddler
description: Fiddler 默认只接管 WinINET 代理设置，如何让它截获 WinHTTP 请求。
keywords: Fiddler, WinHTTP
---

### 背景

发现使用 Fiddler 进行抓包时有一部分请求总是没抓到，查看了一下源代码，发现使用 WinINET 这套 API 发送的请求都能正常抓到，而使用 WinHTTP 这套 API 发送的请求都没有抓到，遂搜索了一下，果然前人们早已给出答案，解决方案原文可以参看 Fiddler 作者 Eric Lawrence 大神的一篇博客 [Using Fiddler with WinHTTP](http://blogs.telerik.com/fiddler/posts/13-04-29/using-fiddler-with-winhttp)，博客里表示 Fiddler 对各种 HTTP(s) stacks 都是能支持的，只是默认启动时只是接管了 WinINET 代理设置。

Eric 的那篇博客里已经列出了相关的方法和代码，本文只是对其略做改进，让同一段代码可以适配不同的 Windows 版本。

### 分析

我们需要让 Fiddler 抓取 WinHTTP 的包时，要做的就是让 WinHTTP 的代理设置改为与 WinINET 一致，因为 WinINET 在 Fiddler 启动后使用 Fiddler 作为代理。这些通过 Windows 自带命令就可以做到：

* 在 XP 下：

  `proxycfg -u`

* 在 Win7 下（使用管理员权限的命令行）：

  `netsh winhttp import proxy ie`
  *注：在 Win7 64 位系统下需要将 System32 目录和 SysWOW64 目录下的 netsh 命令各执行一次，下方将给出的脚本已覆盖这种情况。*

但是如果使用频繁，每次都还要去手动敲命令行还是挺痛苦的，作为能偷懒的地方绝不多放过的少年，一劳永逸的方法当然是让它随 Fiddler 的启动与关闭自动执行这些命令（当然这就是 Eric 的博客里讲述的方法）。

### 实现

这可以通过修改 CustomRules.js 实现（如果想对 Fiddler 的扩展机制进行深入了解可以去参阅 Fiddler 官网的文档）。

操作方法：

**打开 Fiddler > 点击菜单 Rules > 点击 Customize Rules...**

然后就打开了 CustomRules.js 文件，寻找到`OnAttach`与`OnDetach`函数，可以将 Fiddler 启动后与关闭前需要定制的一些自动动作分别填写在它们里头，我们为实现让 Fiddler 能抓取 WinHTTP 发送的请求的目的而修改后的代码如下，添加了`UpdateWinHTTPSettings`函数，在`OnAttach`和`OnDetach`里添加了对它的调用，修改完后保存即可生效。

```js
static function OnAttach() {
    UpdateWinHTTPSettings();
}
static function OnDetach() {
    UpdateWinHTTPSettings();
}

static function UpdateWinHTTPSettings() {
    var oPSI: System.Diagnostics.ProcessStartInfo
        = new System.Diagnostics.ProcessStartInfo();
    var os : OperatingSystem = Environment.OSVersion;
    if (os.Version.Major >= 6) {
        oPSI.UseShellExecute = true;
        oPSI.FileName = "netsh.exe";
        oPSI.Verb = "runas";
        oPSI.Arguments = "winhttp import proxy ie";
        System.Diagnostics.Process.Start(oPSI);

        // Re-run 32bit version
        oPSI.FileName = oPSI.FileName =
            Environment.SystemDirectory.Replace("system32", "syswow64")
            + "\\netsh.exe";
        if (System.IO.File.Exists(oPSI.FileName)) {
            System.Diagnostics.Process.Start(oPSI);
        }
    }
    else {
        oPSI.UseShellExecute = true;
        oPSI.FileName = "proxycfg.exe";
        oPSI.Verb = "open";
        oPSI.Arguments = "-u";
        System.Diagnostics.Process.Start(oPSI);
    }
}
```

`UpdateWinHTTPSettings`函数里做的事情其实很简单，就是使用管理员权限执行文章前面说到的命令。

### 附注

我使用的完整最新的 CustomRules.js 文件我上传到了一个 Gist 里，详见：<https://gist.github.com/mzlogin/3c5f9781c5bedff3fcfb>，如果想直接使用可以复制脚本内容后放置到「我的文档 /Fiddler 2/Scripts/CustomRules.js」，也可以在此目录下使用 git 抓取我的最新定制 js 文件。
