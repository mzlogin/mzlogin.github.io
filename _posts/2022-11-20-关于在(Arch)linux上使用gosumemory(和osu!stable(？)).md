---
layout: post
title: 关于在(Arch)linux上使用gosumemory(和osu!stable(?))
categories: [osu]
description: dotnet45
keywords: osu, gosumemory
---
注：这玩意不知道多久没更新了，不知道[StreamCompanion](https://github.com/Piotrekol/StreamCompanion)是否可用



### 1. (Archlinux)通过aur安装（包括osu!stable

直接安装gosumemory<sup>aur</sup>（顺带把osu<sup>aur</sup>一起给你安装了（（

然后终端运行一下命令安装.net 4.5（提示可能出错不用管直接安装）：
* WINEARCH=win32 WINEPREFIX=${HOME}/.local/share/wineprefixes/osu-stable winetricks dotnet45

安装完后直接在终端运行gosumemory即可

顺便建议安装下windows的字体包ttf-win10<sup>aur</sup>

### 2.其他

* mole
* ###### 暂时懒得写反正是装gosumemory又不是osu请自己研究（重点是用不了linux的文件只能用exe的（

----------

相关[issue](https://github.com/l3lackShark/gosumemory/issues/140#issuecomment-1179663744)

----------

##### (话说是不是就我一个用lutris完全没法直接安装osu（
#### 在linux上安装osu!stable的其他教程可以参考参考BlackSand的这篇「[快速上手──在 Linux 上游玩 osu!stable](https://blacksand.top/2021/12/03/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B%E2%94%80%E2%94%80%E5%A6%82%E4%BD%95%E5%9C%A8Linux%E4%B8%8A%E6%B8%B8%E7%8E%A9osu!stable/) 」手动安装教程