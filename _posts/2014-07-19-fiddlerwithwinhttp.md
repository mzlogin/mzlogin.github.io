---
layout: post
title: 定制Fiddler之让它能抓获WinHTTP请求
categories: Fiddler
---

发现使用Fiddler进行抓包时有一部分请求总是没抓到，查看了一下源代码，发现使用WinINET这套API发送的请求都能正常抓到，而使用WinHTTP这套API发送的请求都没有抓到，遂搜索了一下，果然前人们早已给出答案，解决方案原文可以参看Fiddler作者Eric Lawrence大神的一篇博客[Using Fiddler with WinHTTP](http://blogs.telerik.com/fiddler/posts/13-04-29/using-fiddler-with-winhttp)，博客里表示Fiddler对各种HTTP(s) stacks都是能支持的，只是默认启动时只是接管了WinINET代理设置。

Eric的那篇博客里已经列出了相关的方法和代码，本文只是对其略做改进，让同一段代码可以适配不同的Windows版本。

我们需要让Fiddler抓取WinHTTP的包时，要做的就是让WinHTTP的代理设置改为与WinINET一致，然后在Fiddler关闭时将其还原即可。这些通过Windows自带命令就可以做到：  
* 在XP下：  
`proxycfg -u`  
* 在Win7下：  
`netsh winhttp import proxy ie`  
*注：在Win7 64位系统下需要将System32目录和SysWOW64目录下的netsh命令各执行一次,下方将给出的脚本已覆盖这种情况。*  

但是如果使用频繁，每次都还要去手动敲命令行还是挺痛苦的，作为能偷懒的地方绝不多放过的少年，一劳永逸的方法当然是让它随Fiddler的启动与关闭自动执行这些命令，这可以通过修改CustomRules.js实现（如果想对Fiddler的扩展机制进行深入了解可以去参阅Fiddler官网的文档）。  
操作方法：  
**打开Fiddler -- 点击菜单Rules -- 点击Customize Rules...**   
然后就打开了CustomRules.js文件，寻找到`OnAttach`与`OnDetach`函数，可以将Fiddler启动后与关闭前需要定制的一些自动动作分别填写在它们里头，那我们为实现让Fiddler能抓取WinHTTP发送的请求的目的而修改后的代码如下，添加了`UpdateWinHTTPSettings`函数，在`OnAttach`和`OnDetach`里添加了对它们的调用。

```js
    static function OnAttach() {
        UpdateWinHTTPSettings();
    }
    static function OnDetach() {
        UpdateWinHTTPSettings();
    }
        
    //public static ToolsAction("Update WinHTTPSettings")   // 这个不需要加到菜单项，加了没用……不是开关
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

我使用的完整最新的CustomRules.js文件我上传到了一个Gist里，详见：<https://gist.github.com/mzlogin/3c5f9781c5bedff3fcfb>，如果想直接使用可以复制脚本内容后放置到“我的文档/Fiddler 2/Scripts/CustomRules.js”，也可以在此目录下使用git抓取我的最新定制js文件。
