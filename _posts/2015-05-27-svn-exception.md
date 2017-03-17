---
layout: post
title: TortoiseSVN 从 GitHub 更新时发生异常
categories: SVN
description: TortoiseSVN 从 GitHub 更新时发生异常，附解决方案。
keywords: TortoiseSVN, github
---

### 问题描述

使用 TortoiseSVN 从 GitHub 仓库 Update 时，弹出错误提示对话框：

```
---------------------------
Subversion Exception!
---------------------------
Subversion encountered a serious problem.
Please take the time to report this on the Subversion mailing list
with as much information as possible about what
you were trying to do.
But please first search the mailing list archives for the error message
to avoid reporting the same problem repeatedly.
You can find the mailing list archives at
http://subversion.apache.org/mailing-lists.html

Subversion reported the following
(you can copy the content of this dialog
to the clipboard using Ctrl-C):

In file
 'D:\Development\SVN\Releases\TortoiseSVN-1.8.11\ext\subversion\subversion\libsvn_wc\update_editor.c'
 line 1550: assertion failed (action == svn_wc_conflict_action_delete)
---------------------------
确定   
---------------------------
```

推测发生原因可能是 GitHub 认为本地的目录结构与服务器冲突，因为能看到本地之前 Checkout 出来的一个文件夹显示未纳入版本控制，但是实际上服务器上这个文件夹一直存在在。

查到在一个 [邮件列表](http://mail-archives.apache.org/mod_mbox/subversion-users/201503.mbox/%3C076701d05e91$234ef3b0$69ecdb10$@qqmail.nl%3E) 里说这是由 GitHub 的实现有点问题导致，但是，也如其它地方能查到的信息一样，并没有给出解决方案。

经过各种尝试，包括

1. Clean up

   Clean up 本身能成功，但是再 Update 依然报错。
   
2. 在一个新的文件夹 Checkout

   没有问题。

3. 删除可疑文件和文件夹，重新 Update。

   依然报错。
   
无奈之下试了一下命令行，找到了解决办法。

### 解决方案

其实很简单，就是使用命令行

```
svn cleanup
svn update
```

就可以了，再使用 GUI 的 Update 就不会报错了。

为啥就好了仍然原因不明。

### 最新情况

后来又出现了一次这样的情况，在命令行 `svn update` 也不好使了，提示

```
svn: E155010: The node 'a/folder/path/' was not found.
```

忍无可忍，切回使用 git。
