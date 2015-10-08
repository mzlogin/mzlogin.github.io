---
layout: post
title: Firefox 和内嵌 Gecko 程序的 Plugins
categories: Gecko
description: 对使用 Gecko 的程序的插件注册与搜索机制的探索。
keywords: Gecko, Mozilla, Plugin
---

昨日在 JumuFENG 同学建的 firefox 交流群 (81424441) 里与群友们说起插件相关的一些东西，自己在本地测试了一下，然后推论出一些粗浅认识总结如下：（欢迎有兴趣和正在进行 mozilla 相关的一些开发的朋友加群交流）

一般来讲，对于 firefox 和其它内嵌 Gecko 内核的应用程序来讲，其插件的注册和搜索的机制应该与如下内容有关（windows 下）:

(1) 程序会优先考虑可执行文件同级的 plugins 目录下的 DLL 等类型文件，判断文件的命名是否符合插件特征且通过某种机制确定其是否为插件。命名规范：如 flash 插件的 dll 名为 NPSWF32.DLL，改成 asdfjljlk.dll 则无法识别，NPSWF311112.dll 这种则可以识别，NPSWFjkljdlfkj32.dll 这种可以识别，N1PSWF32.dll 无法识别。

(2) 注册表里 HKEY_LOCAL_MACHINE\SOFTWARE\MozillaPlugins 下注册着插件信息

<img src="/images/posts/gecko/plugin_reg.gif" width="80%" alt="Gecko plugin info in regedit" />

根据注册表项的 path 项的键值去搜索对应 DLL，如果找不到，则在 firefox 的”附加组件”或者 about:plugins 里不会显示，即使该 DLL 放在系统环境变量的 path 包含的路径下。（(1) 里面的 plugins 目录的情况除外）

(3)%appdata%\Mozilla\Firefox\Profiles\wgnbwzjm.default 文件夹里头的 pluginreg.dat 文件里有具体配置项，插件是否启用和其它插件相关信息将从这里读取并在”附加组件”和 about:plugins 里显示给用户。

<img src="/images/posts/gecko/plugin_dat.gif" width="80%" alt="Gecko plugin info in dat file" />

光标处的 4 表示不启用，若为 1 或者 5 则为启用。若为 13，则为找不到。此文件删除后再运行 firefox 时会自动再生成 （根据 plugins 和注册表里）。此设置对安装的 firefox 等这种在应用程序里启用 profile 的程序有效（我自己写的内嵌 Gecko 的程序因为没有启用 profile，所以并无此文件，只能根据 plugins 和注册表来查找和显示插件）。剪切走此文件，则在 firefox 中已经禁用过的插件也被启用。

Plugins 文件夹的优先级更高。如果在 plugins 与注册表指示的路径下都能找到某插件 DLL，那么 pluginreg.dat 文件里的路径被修改为 plugins 文件夹下 DLL 路径。

其它相关小知识点：

(1) DLL 插件都实现了导出这 3 个函数。

<img src="/images/posts/gecko/plugin_dll.gif" width="80%" alt="Gecko plugin dll export info" />

(2) 若插件注册表项删除，pluginreg.dat 文件删除，plugins 下有 DLL，则仍可显示正确 MIME 类型，描述等信息。推测是 firefox 等程序在初始化时维护的有一个数据库，里头根据 DLL 属性描述里的”原文件名”存储有一一对应的有这些信息。

在 windows xp 下查看这些 DLL 的属性，发现有 MIMEType，FileOpenName，FileExtents 与下面在 about:plugins 里看到的 MIME 类型，描述，后缀三项一一对应，应该就是直接从插件 DLL 的属性里读取的。

<img src="/images/posts/gecko/plugin_properties.gif" width="80%" alt="Gecko plugin dll properties" />

<img src="/images/posts/gecko/plugin_properties2.gif" width="80%" alt="Gecko plugin dll properties2" />

一点粗浅认识，纯属自行测试后的一些推论，如有谬误尽请指正。
