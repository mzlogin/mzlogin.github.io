---
layout: post
title: DIY｜Mac 搭建 ESP-IDF 开发环境及编译小智 AI
categories: [DIY]
description: 使用 Mac 烧录小智 AI
keywords: DIY, 小智AI, 烧录, Mac, MacBook, ESP32
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

前一阵子在百度 AI 开发者大会上，看到基于小智 AI DIY 玩具的演示，感觉有点意思，想着自己也来试试。

如果只是想烧录现成的固件，乐鑫官方除了提供了 Windows 版本的 [Flash 下载工具][1] 之外，还提供了基于网页版的 [ESP LAUNCHPAD][2]，按照说明在 Mac 上也可以使用。

而我想着后期做一些定制，所以还是需要在 Mac 上搭建 ESP-IDF 开发环境，自己编译和烧录固件。而这个在 [小智 AI 聊天机器人百科全书][3] 中没有详细提及，所以我就记录一下搭建过程，供有需要的朋友参考。

先上一个跑起来后的效果：

![](/images/posts/ai/xiaozhi-ai.jpg)

## 配置 macOS 平台工具链

这一步参考乐鑫官方的 [Linux 和 macOS 平台工具链的标准设置][4] 完成，我这里指定了使用 ESP-IDF v5.4.1 版本，编译目标是 ESP32-S3。

### 第一步：安装前置依赖

```sh
brew install cmake ninja dfu-util ccache python3
```

### 第二步：获取 ESP-IDF

```sh
mkdir ~/github
cd ~/github
git clone -b v5.4.1 --recursive https://github.com/espressif/esp-idf.git
```

ESP-IDF 将下载至 `~/github/esp-idf` 目录。

### 第三步：设置工具

```sh
cd ~/github/esp-idf
./install.sh esp32s3
```

### 第四步：设置环境变量

在 ~/.zshrc 中添加以下内容：

```sh
alias get_idf='. $HOME/github/esp-idf/export.sh'
```

然后 `source ~/.zshrc` 使其生效。

这样在需要用到 ESP-IDF 环境的时候，只需要在终端中执行 `get_idf` 即可。

在执行以上步骤时，如果遇到问题，可以到 [乐鑫官方文档][4] 里看看有没有解决方案。

## 下载和编译小智 AI 固件

```sh
cd ~/github
git clone -b v1.6.2 git@github.com:78/xiaozhi-esp32.git
cd xiaozhi-esp32
```

然后接入 ESP32-S3 开发板，执行以下命令：

```sh
get_idf
idf.py set-target esp32s3
idf.py build
idf.py flash monitor
```

一切顺利的话，会向 ESP32-S3 开发板烧录小智 AI 固件，并且进入监控模式。

至此，就初步能跑起来了。按照提示进行 WiFi 配置和小智 AI 平台的设备绑定，即可开始使用。

如果后续需要定制固件，可以基于 `~/github/xiaozhi-esp32` 目录进行修改和编译。若习惯使用 VSCode 进行开发，可以安装 [适用于 VSCode 的 ESP-IDF 扩展][5]，这样可以更方便地进行开发和调试。

## 参考链接

- [https://www.espressif.com.cn/zh-hans/support/download/other-tools][1]
- [https://espressif.github.io/esp-launchpad/][2]
- [https://ccnphfhqs21z.feishu.cn/wiki/F5krwD16viZoF0kKkvDcrZNYnhb][3]
- [https://docs.espressif.com/projects/esp-idf/zh_CN/v5.4.1/esp32s3/get-started/linux-macos-setup.html][4]
- [https://github.com/espressif/vscode-esp-idf-extension][5]

[1]: https://www.espressif.com.cn/zh-hans/support/download/other-tools
[2]: https://espressif.github.io/esp-launchpad/
[3]: https://ccnphfhqs21z.feishu.cn/wiki/F5krwD16viZoF0kKkvDcrZNYnhb
[4]: https://docs.espressif.com/projects/esp-idf/zh_CN/v5.4.1/esp32s3/get-started/linux-macos-setup.html
[5]: https://github.com/espressif/vscode-esp-idf-extension