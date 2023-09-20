---
layout: post
title:  Mocking Bird 中文普通话
categories: AI 
description: Mocking Bird中文普通话版安装
keywords: Mocking Bird, AI
---

# Mocking Bird 中文普通话

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/913eec56-8bdd-4f5d-957a-0c326830caf2)

## 1. Install Requirements

### （1）安装Python 3.10.11

https://www.python.org/downloads/release/python-31011/

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/e9793b80-a5b5-4e58-992d-de7ca8ef87bd)

一定要把 **Add python.exe to PATH** 打上勾

## （2）安装PyTorch

https://pytorch.org/get-started/locally/

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/4a4a5f99-a7a5-48a9-8777-eb007b73e531)

> pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

## （3）安装ffmpeg

https://ffmpeg.org/download.html#build-windows

复制文件路径 D:\Mocking bird\ffmpeg-git-full\bin， 然后打开我的电脑属性，高级电脑属性，然后点开环境变量，点新建环境变量

打开命令提示符，输入ffmpeg，若有正常输出信息，则说明安装成功

## （4）安装Mocking Bird

https://github.com/weakchen007/MockingBird007

下载code，压缩包，解压缩为MockingBird007-main文件夹，打开文件夹，找到文件requirements.txt，将其中==0.03删除掉，保存文件。

文件夹cmd，然后依次输入如下两条命令：

> pip install -r requirements.txt

> pip install webrtcvad-wheels

## （5）准备语言模型

> https://pan.baidu.com/s/1iONvRxmkI-t1nHqxKytY3g   4j5d

打开McokingBird007-main\data\ckpt，新建文件夹synthesizer，并将下载的模型文件拷入

## （6）启动webui

文件夹cmd，输入 > python web.py ,会显示IP地址及域名，依系统不同而不同，在这里只能输入.wav声音样本

如果想启动程序运行，则文件夹cmd输入 > python demo_toolbox.py，而在程序中则可以输入各种类型声音样本


**不管以上选择怎样的运行模式，都只能选择75k模型，其他模型都不能正常运行**



-----------------------








