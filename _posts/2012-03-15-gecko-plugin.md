---
layout: post
title: 对firefox和内嵌Gecko程序的插件（plugins）的注册搜索方式的一点认识
categories: Gecko
---

昨日在JumuFENG同学建的firefox交流群(81424441)里与群友们说起插件相关的一些东西,自己在本地测试了一下,然后推论出一些粗浅认识总结如下: (欢迎有兴趣和正在进行mozilla相关的一些开发的朋友加群交流)  
一般来讲,对于firefox和其它内嵌Gecko内核的应用程序来讲,其插件的注册和搜索的机制应该与如下内容有关(windows下):  
 
(1)程序会优先考虑可执行文件同级的plugins目录下的DLL等类型文件,判断文件的命名是否符合插件特征且通过某种机制确定其是否为插件.命名规范:如flash插件的dll名为NPSWF32.DLL,改成asdfjljlk.dll则无法识别,NPSWF311112.dll这种则可以识别,NPSWFjkljdlfkj32.dll这种可以识别,N1PSWF32.dll无法识别.  
 
(2)注册表里HKEY_LOCAL_MACHINE\SOFTWARE\MozillaPlugins下注册着插件信息  
<img src="/images/posts/gecko/plugin_reg.gif" width="80%" alt="Gecko plugin info in regedit" />

根据注册表项的path项的键值去搜索对应DLL,如果找不到,则在firefox的”附加组件”或者about:plugins里不会显示,即使该DLL放在系统环境变量的path包含的路径下.((1)里面的plugins目录的情况除外)  
 
(3)%appdata%\Mozilla\Firefox\Profiles\wgnbwzjm.default文件夹里头的pluginreg.dat文件里有具体配置项,插件是否启用和其它插件相关信息将从这里读取并在”附加组件”和about:plugins里显示给用户.  
<img src="/images/posts/gecko/plugin_dat.gif" width="80%" alt="Gecko plugin info in dat file" />

光标处的4表示不启用,若为1或者5则为启用.若为13,则为找不到.此文件删除后再运行firefox时会自动再生成(根据plugins和注册表里).此设置对安装的firefox等这种在应用程序里启用profile的程序有效(我自己写的内嵌Gecko的程序因为没有启用profile,所以并无此文件,只能根据plugins和注册表来查找和显示插件).剪切走此文件,则在firefox中已经禁用过的插件也被启用.  
Plugins文件夹的优先级更高.如果在plugins与注册表指示的路径下都能找到某插件DLL,那么pluginreg.dat文件里的路径被修改为plugins文件夹下DLL路径.  
 
其它相关小知识点:  
(1) DLL插件都实现了导出这3个函数.  
<img src="/images/posts/gecko/plugin_dll.gif" width="80%" alt="Gecko plugin dll export info" />
 
(2)若插件注册表项删除, pluginreg.dat文件删除,plugins下有DLL,则仍可显示正确MIME类型,描述等信息.推测是firefox等程序在初始化时维护的有一个数据库,里头根据DLL属性描述里的”原文件名”存储有一一对应的有这些信息.  
在windows xp下查看这些DLL的属性，发现有MIMEType，FileOpenName，FileExtents与下面在about:plugins里看到的MIME类型，描述，后缀三项一一对应，应该就是直接从插件DLL的属性里读取的。  
<img src="/images/posts/gecko/plugin_properties.gif" width="80%" alt="Gecko plugin dll properties" />  
<img src="/images/posts/gecko/plugin_properties2.gif" width="80%" alt="Gecko plugin dll properties2" />
 
一点粗浅认识,纯属自行测试后的一些推论,如有谬误尽请指正.
