---
layout: post
title: Windows操作系统激活2方法
categories: [Windows]
description: Windows操作系统的激活的两种方法
keywords: windows，scripts，激活脚本
---
## 微软激活脚本

Windows 和 Office 激活程序，采用 HWID / KMS38 / 在线 KMS 激活方法，注重开源代码和减少杀毒软件检测。

### 方法1：利用PowerShell激活（推荐）

在 Windows 8/10/11 系统中，右键单击 Windows开始 菜单，选择 PowerShell 或终端（非 CMD）。

复制粘贴下面的代码，然后按回车键

> irm https://massgrave.dev/get | iex

你将看到激活选项，并按照屏幕上的指示说明进行操作即可。

### 方法2：传统方法

解压我提供的文档，并且找到 All-In-One-Version 文件夹

运行文件 > named MAS_AIO.cmd

你将看到激活选项，然后按照屏幕上的说明进行操作。

