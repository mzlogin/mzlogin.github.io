---
layout: post
title: (转载Backup)快速上手──在 Linux 上游玩 osu!stable
categories: [osu]
description: 适合新人、了解一些 Wine 以及 osu!stable 人士的指北，内容简单明了，操作基于 Arch
keywords: keyword1, keyword2
---

文章作者: B1ackSand

文章链接: [https://blacksand.top/2021/12/03/快速上手──如何在Linux上游玩osu!stable/](https://blacksand.top/2021/12/03/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B%E2%94%80%E2%94%80%E5%A6%82%E4%BD%95%E5%9C%A8Linux%E4%B8%8A%E6%B8%B8%E7%8E%A9osu!stable/)

版权声明: 此文章版权归 B1ackSand 所有，如有转载，请注明来自原作者

------------------

适合新人、了解一些 Wine 以及 osu!stable 人士的指北，内容简单明了，操作基于 Arch：[即本文](https://blacksand.top/2021/12/03/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B%E2%94%80%E2%94%80%E5%A6%82%E4%BD%95%E5%9C%A8Linux%E4%B8%8A%E6%B8%B8%E7%8E%A9osu!stable/)

~~适合想详细了解所有步骤的指北，内容详尽繁多，有疑难解答：[Blog](https://blacksand.top/2021/10/02/Linux%E4%B8%8B%E4%BD%BF%E7%94%A8Lutris%E5%AE%89%E8%A3%85%E5%B9%B6%E6%B8%B8%E7%8E%A9%E4%BD%8E%E5%BB%B6%E8%BF%9F%E9%9F%B3%E9%A2%91osu!%20%E7%9B%B8%E5%85%B3%E6%8C%87%E5%8C%97/#gonX%E7%9A%84%E9%9F%B3%E9%A2%91%E5%BB%B6%E8%BF%9F%E8%B0%83%E6%95%B4%E6%96%B9%E6%A1%88) 或 [BiliBili 专栏版](https://www.bilibili.com/read/cv11906796?from=search&spm_id_from=333.337.0.0) ~~(过时)

如果仅仅想要玩 osu! ，没有刷 PP 的想法 ，为什么不直接使用原生且延迟极低的 [osu!Lazer](https://github.com/ppy/osu) 呢？

# 前言
我相信大多数人已经在用自己心目中最舒适的发行版，但如果你还没有想好用什么发行版，请 马上投入 Arch 神教的怀抱 查询资料了解下各发行版的特点，选择一个适合自己的发行版。但我仍建议使用基于 Arch 的发行版，因为所用补丁的是基于 Arch 进行打包。

本文所有操作均基于 Arch 发行版进行！

按道理来讲，本指南适用于 Ubuntu、Debian 系、openSUSE、Fedora 或 Arch 系等，本文会使用 Lutris 作为 Wine 的容器管理，因为实在太方便，当然也会提供脚本的方式运行。

-----------------

# 视频流程
3 月刚好换了新电脑，就顺便录了视频。

BiliBili: [BV1kY411T7wU](https://www.bilibili.com/video/BV1kY411T7wU)

# 安装 Lutris 和 wine-osu
首先务必参阅 [Lutris 官方 docs 文档](https://github.com/lutris/docs/blob/master/WineDependencies.md)，其中包含有各个发行版的 Wine 相关依赖安装命令，安装 Wine 的所有依赖项以确保工作正常。

以 Arch 为例，在 Arch 下安装需要启用 [<code>Multilib</code> 存储库](https://wiki.archlinux.org/title/Official_repositories#multilib)，开启存储库后，你应当已经安装以下软件包和依赖：

```CODE
# 其中 lutris 和 winetricks 请自行寻找相关发行版安装文档
sudo pacman -S lib32-gnutls lib32-libxcomposite lutris winetricks
# 如果你使用的是Nvidia显示卡（A卡请自行寻找资料）
sudo pacman -S lib32-nvidia-utils
```
<code>wine-osu</code> 是一个带有 osu! 相关修正补丁的 Wine 构建，它修正了许多 osu! 的游戏崩溃、错误等问题，此安装包出自 ThePooN，gonX 在此基础上做了大量工作。

下载地址：

[Google Drive gonX 镜像](https://drive.google.com/drive/folders/17MVlyXixv7uS3JW4B-H8oS4qgLn7eBw5)，强烈建议通过正常渠道下载 gonX 的 Wine 构建，这算是对作者的一种感谢。

[个人的蓝奏云 密码: 1234](https://blacksand.lanzouw.com/b0b3zo18d)，由于格式限制，从蓝奏盘下载下来的文件需要为文件扩展名添加.zst，否则压缩文件将无法正常读取。

下载完成后，如果是 Arch 系，安装命令为：

```CODE
sudo pacman -U ~/Download/wine-osu-7.0-2-x86_64.pkg.tar.zst
```

非 Arch 系建议将压缩文件中 <code>/opt</code> 文件下的内容解压到 Lutris 的 Wine 构建文件夹中，方便 Lutris 选择自定义 Wine 构建。

Lutris (Arch) 默认的 Wine 构建存放位置为：~/.local/share/lutris/runners/wine/

-------------

# 从 pulseaudio 迁移到 pipewire

## 迁移

* PipeWire 是一个新的低级多媒体框架。它旨在以最小的延迟提供音频和视频的捕获和回放，并支持基于 PulseAudio、JACK、ALSA 和 GStreamer 的应用程序。

~~pulseaudio 都十几年了求求你们换了吧，~~pipewire 资源占用低得多，音频延迟还低。

##### (补充<sup>by zip</sup>：Ubuntu系的在22.10版本之后默认应该都是pipewire了)
</br>

据我所知：

Fedora 默认预装 pipewire。

Debian/Ubuntu 请参阅该[网址](https://wiki.debian.org/PipeWire)。

Arch 系：

```CODE
# 移除所有pulseaudio服务
systemctl --user disable --now pulseaudio.socket pulseaudio.service

# pipewire将会卸载掉pulseaudio，取而代之的是pipewire的pulse兼容实现
sudo pacman -S pipewire pipewire-pulse pipewire-alsa pipewire-media-session

# 安装完成后，启动pipewire服务
systemctl --user enable --now pipewire.service pipewire.socket pipewire-media-session.service pipewire-pulse.service pipewire-pulse.socket
安装完成后，你可能需要执行一次重启。
```

进一步降低延迟（可选）
pipewire 本身的音频延迟已经能满足大部分人的需求，但是仍然可以选择继续降低小许音频延迟。

在终端运行命令：

```CODE
# 复制pipewire配置文件
mkdir -p ~/.config/pipewire
cp -rv /usr/share/pipewire/* ~/.config/pipewire/

# 修改配置文件
cd ~/.config/pipewire
vim pipewire-pulse.conf
vim pipewire.conf
```

在编辑页面中，根据我的示例，取消注释这些条目并编辑 / 前的数值，其中 1.33ms = 64/48000=0.00133333~ 而算得：

```CONF
# pipewire-pulse.conf
{   name = libpipewire-module-protocol-pulse
            ...
            pulse.min.req = 64/48000              # 1.33ms
            pulse.default.req = 64/48000          # 1.33ms
            pulse.min.frag = 64/48000             # 1.33ms
            pulse.min.quantum = 64/48000          # 1.33ms
            ...

stream.properties = {
    ...
    node.latency = 64/48000
    ...
```

```CONF
# pipewire.conf
context.properties = {
    ...
    default.clock.rate        = 48000
    default.clock.quantum     = 64
    default.clock.min-quantum = 64
    ...
```

完成配置保存后，重启 pipewire 服务，测试音频是否正常：

```CODE
systemctl --user restart pipewire pipewire-pulse
```

一般来说，32 或 64 这两个数值在大多数电脑中能够稳定播放音频，如出现音频撕裂或无声等症状，请根据自身情况进行增大至多到默认值 256，例如 128/48000，192/48000。

---------------

# 安装 osu!
## 初始化 WinePrefix
以 WINEPREFIX 虚拟盘地址为 ~/.wineosu 举例：

```BASH
# 均在同一个终端执行
export WINEARCH=win32
export PATH=/opt/wine-osu/bin:$PATH
export WINEPREFIX=$HOME/.wineosu

# 安装运行组件 无需安装mono和gecko
winetricks -f cjkfonts gdiplus dotnet40

# 安装完成后，将默认系统设置为win2003或winxp，否则无法运行
winecfg -v win2003
```

winetricks 有可能会因为众所周知的网络原因下载安装包失败，此时可使用全局代理扶梯手动下载。例如将 dotnet40 安装包放入 <code>~/.cache/winetricks/dotnet40</code> 下，此文件夹下为 winetricks 的安装包缓存地址。

## osu! 安装以及配置
### 安装
安装 osu! 仍需要全局代理扶梯，否则有可能在安装时候发生进度条倒退现象，此处不建议使用离线版客户端，可能会导致 osu! 无法启动。

亦可尝试使用 <code>CloudflareSpeedTest</code>，可参考艾雨露视频在 Windows 下的操作，学习修改 Linux 下的 host 文件，能达到一样的效果。

```BASH
# 在终端执行
export PATH=/opt/wine-osu/bin:$PATH
export WINEPREFIX=$HOME/.wineosu

cd ~/.wineosu
mkdir osu
cd osu
wget 'https://m1.ppy.sh/r/osu!install.exe'
wine 'osu!install.exe'
```

此时，你的 osu! 安装程序应当运行成功，随后会自动启动 osu!，其中在 osu! 设置中务必将帧率设置在无限制或者 Optimal，否则有较大输入延迟。

将通用偏移（全局 offset）设置为 -40 到 - 15（如果使用兼容模式音频，则设置为 -25 到 - 10）以解决 Wine 奇怪的延迟问题。（若无不适则可以不设置，但此处我建议设置）

### 中文
如果你当前的 Linux 发行版为全新安装，osu! 将可能面临中日文字符为口口口口口的现象，这会影响到惯用中日文的玩家。

如果当前你为 WL dual boot（即 windows 和 Linux 双系统）：

```SHELL
# 将windows下的字体复制到Linux下并刷新字体缓存
cd /etc/fonts
sudo mkdir WindowsFonts
sudo cp /mnt/mountc/Windows/Fonts /etc/fonts/WindowsFonts
sudo fc-cache -f
```
如果当前仅安装了 Linux 系统，以 Arch 为例：

```SHELL
# 安装ttf-win10包
sudo pacman -S ttf-win10
```

如是其他发行版请自行想办法获取到 Windows 的字体打包，按照上方的双系统字体操作即可。

###Lutris 配置

Lutris 第一次打开根据地区不同，可能需要代理才能打开。如不适应或无法启动 Lutris，请使用文章后面部分的脚本法。

<ol>

<li>打开 Lutris 后，点击左上角的 <code>+</code> 号。</li>

<li>在 Game Info 标签页中，Name 填入 <code>osu!</code>，Runner 选择 <code>Wine</code>。</li>

<li>在 Game Options 标签页中，Executable 选择 osu! 启动程序，例 <code>/home/blacksand/.wineosu/osu/osu!.exe</code>；Wine Prefix 填入刚才创建的 Wine 虚拟盘，例 <code>/home/blacksand/.wineosu</code>；Prefix architecture 选择 <code>32-bit</code>。</li>

<li>在 Runner Options 标签页中，Wine version 选择你安装了的 <code>wine-osu</code>；该包在 Arch 系默认安装于 <code>/opt/wine-osu/bin/wine</code>。（重要的是选中 wine 这个文件），将有关 DXVK、VKD3D 等按钮关闭，这会影响到 osu! 的正常启动。</li>
<a href="https://img.blacksand.top/images/2022/03/28/Screenshot_20220328_193301.png" data-fancybox="group" data-caption="" class="fancybox"><img src="https://img.blacksand.top/images/2022/03/28/Screenshot_20220328_193301.png"></a>

<li>在 System Opinions 标签页中，确保 “Disable desktop effects” 为开启；在最下面的 Enviroment Variavles，点击 Add，key 值栏填入 <code>vblack_mode</code> ，value 值栏填入 <code>0</code>；（关闭垂直同步）

确保 “Reduce Pulseaudio latency” 为关闭，否则将会破坏掉 Wine 音频驱动补丁的延迟修正。</li>

<li>（可选）根据进一步降低延迟部分，可能需要配置 <code>STAGING_AUDIO_PERIOD</code>：若在 pipewire-pulse.conf 配置文件中，将数值配置为 <code>64/48000</code>，则此时在 System Opinions 下面的 Enviroment Variavles，点击 Add，key 值栏填入 <code>STAGING_AUDIO_PERIOD</code> ，value 值栏填入 <code>13333或更高一些</code>。(即计算 <code>64/48000</code> 得到的数字右移 7 位小数点得到)</li>

</ol>

至此安装配置到此完成，通过 Lutris 可创建桌面或菜单栏快捷方式，打开后测试打图是否有问题，按理来说应当很接近 Windows 下的手感，字体等问题也一样解决。

-----------

# 疑难解答
## 通过脚本运行 osu!
适用于无法使用 Lutris 的朋友，或钟情于脚本运行者。

```CODE
# 转到osu!根目录
cd ~/.wineosu/osu

# 创建一个名为start.sh的shell文件
touch start.sh

# 给予运行权限
chmod +x start.sh

# 编辑该文件
vim start.sh
```

文件内容应当是这样，例：

```BASH
#!/bin/sh
export WINEARCH=win32
export PATH=/opt/wine-osu/bin:$PATH
export WINEPREFIX=$HOME/.wineosu

export vblank_mode=0

#export STAGING_AUDIO_PERIOD=13333

cd ~/.wineosu/osu
wine 'osu!.exe' "$@"
```

编辑保存后，尝试在当前目录打开终端运行<code>./start.sh</code>，看看是否有音频延迟或字体问题。export 中的一些项目和 Lutris 配置中相同，一样能够修改 <code>STAGING_AUDIO_PERIOD</code>，仅需取消注释，更改等号后的 value 即可。

## 我该如何在 Linux 下使用我的数位板进行游玩？

在 Linux 下个人推荐使用 <code>OpenTabletDriver</code> 进行数位板连接。这是一个开源、跨平台、可用户自定义的数位板驱动，类似于 Windows 下的 TabletDriver（但 TD 已经不更新了），比 TD 功能更强，支持更新的数位板，众多开发者对 Debian 系和 ArchLinux 的安装进行了简化。安装向导：

```CODE
#安装向导
https://opentabletdriver.net/Wiki/Install/Linux

#常见问题解决方法（包括使用数位板时多个光标同时出现的问题）
https://opentabletdriver.net/Wiki/FAQ/Linux
```

## 更多的疑难解答

[点击此处跳转 (outdate)](https://blacksand.top/2021/10/02/Linux%E4%B8%8B%E4%BD%BF%E7%94%A8Lutris%E5%AE%89%E8%A3%85%E5%B9%B6%E6%B8%B8%E7%8E%A9%E4%BD%8E%E5%BB%B6%E8%BF%9F%E9%9F%B3%E9%A2%91osu!%20%E7%9B%B8%E5%85%B3%E6%8C%87%E5%8C%97/#%E7%96%91%E9%9A%BE%E8%A7%A3%E7%AD%94)

# 另请参阅

<ul>
<li><p><a target="_blank" rel="noopener" href="https://blog.thepoon.fr/osuLinuxAudioLatency">Low-latency osu! on Linux – ThePooN Blog</a>  #有关音频延迟的原因和补丁的实现</p>
</li>
<li><p><a target="_blank" rel="noopener" href="https://dwz.mk/NFrYrq">Linux lutris low latency osu! [GUIDE] – reddit</a></p>
</li>
<li><p><a target="_blank" rel="noopener" href="https://osu.ppy.sh/community/forums/topics/367783">Ultimate guide to low-latency osu! on Linux (rev.12) – osu! forum</a></p>
</li>
<li><p><a target="_blank" rel="noopener" href="https://wiki.archlinux.org/title/User:Katoumegumi">User:Katoumegumi - Arch Wiki</a></p>
</li>
<li><p><a target="_blank" rel="noopener" href="https://discord.gg/ThePooN">ThePooN’s discord</a></p>
</li>
</ul>

文章作者: B1ackSand

文章链接: [https://blacksand.top/2021/12/03/快速上手──如何在Linux上游玩osu!stable/](https://blacksand.top/2021/12/03/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B%E2%94%80%E2%94%80%E5%A6%82%E4%BD%95%E5%9C%A8Linux%E4%B8%8A%E6%B8%B8%E7%8E%A9osu!stable/)

版权声明: 此文章版权归 B1ackSand 所有，如有转载，请注明来自原作者