---
layout: wiki
title: Vim
categories: Vim
description: 个人最常用的Vim常用操作。
keywords: Vim
---

###Index

* [移动](#移动)
* [复制](#复制)
* [粘贴](#粘贴)
* [剪切](#剪切)
* [替换](#替换)
* [常用](#常用)
* [vimdiff](#vimdiff)
* [Buffer](#buffer)
* [组合命令](#组合命令)
* [代码](#代码)

###移动

**以字（符）为单位**

上 k

下 j

左 h

右 l

**以单词为单位**

前一个单词尾 ge

后一个单词首 w

本单词首（若光标已在本单词首，则跳到前一个单词首） b

本单词尾（若光标已在本单词尾，则跳到后一个单词尾） e

**以屏幕为单位**

向下翻页 CTRL-f

向上翻页 CTRL-b

向下翻半页 CTRL-d

向上翻半页 CTRL-u

向上一行 CTRL-y

向下一行 CTRL-e

**行号**

跳到第num行 :num 或 numG

**文件**

跳到文件头 gg

跳到文件尾 G

###复制

复制光标所在单词 yiw

复制光标所在行 yy

###粘贴

在光标之后粘贴 p

在光标之前粘贴 P

###剪切

剪切选中区域 d

剪切光标所在行 dd

###替换

将全文中的str1替换为str1 :%s/str1/str2/g

将1到5行中的str1替换为str2 :1,5/str1/str2/g

###常用

删除空行 :g/^$/d

###vimdiff

移动到上一个不同处 [c

移动到下一个不同处 ]c

###Buffer

查看Buffer列表 :ls

转到Buffer列表中的下一个Buffer :bn

转到Buffer列表中的上一个Buffer :bp

转到Buffer列表中的num号Buffer :bnum

你之前待过的一个Buffer :b#

从Buffer列表中删除num号Buffer :bdnum

###组合命令

可以使用`|`来组合命令，比如`cmd1 | cmd2`。

###代码

格式化代码 gg=G

去除1-20行首的行号 :1,20s/^\\s\*[0-9]\*\\s\*//g

展开全部折叠 zR

展开当前层级折叠 zr

全部折叠 zM

当前层级折叠 zm

切换折叠/展开 za

递归折叠/展开当前大区块 zA

折叠当前区块 zc

递归折叠当前大区块 zC

展开当前区块 zo

递归展开当前大区块 zO

格式化json数据 :%!python -m json.tool
