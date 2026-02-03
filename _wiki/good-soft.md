---
layout: wiki
title: 善用佳软
cate1: Tools
cate2: 
description: 用正确的工具做对的事情
keywords: 软件, 推荐
---

好的软件总是给人一种相见恨晚的感觉。

## 软件列表

| 功能                                 | Windows                  | Mac OS X                  |
|--------------------------------------|--------------------------|---------------------------|
| 文本编辑                             | gVim                     | MacVim                    |
| 离线 API 文档                        | Zeal                     | Dash / devdocs.io         |
| UML                                  | Visio / draw.io          | draw.io                   |
| 流程图                               | Visio / draw.io          | draw.io / ProcessOn.com   |
| 文件查找                             | Everything               | Alfred                    |
| 文件内容查找                         | FileLocator              | Alfred                    |
| Android 开发                         | Android Studio           | Android Studio            |
| Android 虚拟机                       | Genymotion               | Genymotion                |
| Android 当无线鼠标、键盘、远程桌面等 | [WiFi Mouse][]           | [WiFi Mouse][]            |
| 源码阅读                             | Source Insight           | IDE/Vim                   |
| 笔记                                 | OneNote                  | OneNote                   |
| 终端                                 | Windows Terminal / Cmder | zsh                       |
| 视频播放器                           | QQ 影音                  | IINA                       |
| 下载                                 | 迅雷精简版               | 迅雷                      |
| 录制屏幕生成 GIF                     | LICEcap                  | LICEcap                   |
| 打开 CHM 文档                        |                          | ichm                      |
| 阅读 EPUB 电子书                     | Neat Reader              | iBook                     |
| 手机投屏                             |                          | 幕享 / AirServer / Macast |
| 将 Android 平板作为副屏              |                          | AirScreen|
| 多主机共享键盘鼠标 | Synergy | Synergy |

## 亮点

### Cmder

* alias

  在 Cmder 下可以很方便地像在类 Unix 系统下使用 alias 功能，比如：

  ```sh
  alias blog=cd /d d:\github\mzlogin.github.io
  ```

  然后就能愉快地使用 blog 命令在任意目录进入 blog 仓库的目录了。

### Genymotion

配置好后，那启动速度，嗖嗖地，秒 Android SDK 自带的八条街。

### mpv

不像 MPlayerX 和 Perian 那样无故卡死转码半天就是最大的亮点了。

[WiFi Mouse]: https://wifimouse.necta.us/

## 配置方法

### Synergy

商业化版本直接在官网购买下载：<https://symless.com/synergy>

个人使用也可以从 GitHub 上下载编译好的免费版本：<https://github.com/amankhoza/synergy-binaries>

配置方法参考：<https://blog.csdn.net/GeeLoong/article/details/125832349>

简要记录如下：

1. 在同一局域网的多台电脑上安装 Synergy；

2. 安装完成后需要输入 serial key，Windows 上可以通过修改注册表解决，将注册表目录 `计算机\HKEY_CURRENT_USER\Software\Synergy\Synergy` 下的 `edition` 选项由 3 改为 1 即可；

3. 选择一台电脑作为 Server（键鼠宿主机），其他电脑作为 Client；

4. 设置 Server 交互配置 - 设置服务端，然后有几个 Client 就从右上角拖几个屏幕到中间的 Server 屏幕周围，摆放好位置，双击每个 Client 屏幕，设置好名称（名称从 Client 界面上显示的屏幕名复制）；

5. 启动 Server，再启动 Client 即可。