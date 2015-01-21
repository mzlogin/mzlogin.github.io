---
layout: wiki
title: Emacs
categories: Emacs
description: Emacs快捷键汇总及日常使用记录。
keywords: Emacs, 快捷键
---

约定：`C-`前缀表示Ctrl，`M-`前缀表示Alt，`S-`前缀表示Shift，上档字符比如`@`的实际按键应为`Shift+2`。

###Index

* [移动](#移动)
* [编辑](#编辑)
* [缓冲区](#缓冲区)
* [窗口](#窗口)
* [文件](#文件)
* [代码](#代码)
* [命令](#命令)

###移动

上 C-p

下 C-n

左 C-b

右 C-f

前一个词首 M-b

后一个词尾 M-f

跳到某一行 M-gg

下翻页 C-v

上翻页 M-v

跳到文首 M-<

跳到文尾 M->

###编辑

选取块 C-@

切换只读/编辑模式 C-x C-q

交换当前字符与前一字符 C-t

交换当前单词与后一单词 M-t

交换当前行与上一行 C-x C-t

###缓冲区

查看所有打开的缓冲区 C-x C-b

切换缓冲区 C-x b

###窗口

关闭其它窗口 C-x 1

关闭当前窗口 C-x 0

###文件

打开文件 C-x C-f

保存文件 C-x C-s

保存所有打开的文件 C-x s

###代码

注释选中块 C-x r t

反注释选中块 C-x r k

###命令

输入命令 M-x

运行SHELL shell

运行ESHELL eshell

列出elpa上可用包 list-packages

安装插件 package-install

选择某个模式（举例） outline-minor-mode

输入外部命令 M-@
