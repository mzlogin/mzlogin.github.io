---
layout: wiki
title: Git
categories: Git
description: Git 常用操作记录。
keywords: Git, 版本控制
---

|功能|命令|
|:---|:---|
|添加文件/更改到暂存区|git add filename|
|添加所有文件/更改到暂存区|git add .|
|提交|git commit -m msg|
|从远程仓库拉取最新代码|git pull origin master|
|推送到远程仓库|git push origin master|
|查看配置信息|git config --list|
|查看文件列表|git ls-files|
|比较工作区和暂存区|git diff|
|比较暂存区和版本库|git diff --cached|
|比较工作区和版本库|git diff HEAD|
|从暂存区移除文件|git reset HEAD filename|
|查看本地远程仓库配置|git remote -v|
|回滚|git reset --hard 提交SHA|
|强制推送到远程仓库|git push -f origin master|
|修改上次 commit|git commit --amend|

###Q&A

1. 如何解决gitk中文乱码，git ls-files 中文文件名乱码问题？

    在~/.gitconfig中添加如下内容

    ```
    [core]
        quotepath = false
    [gui]
        encoding = utf-8
    [i18n]
        commitencoding = utf-8 
    [svn]
        pathnameencoding = utf-8 
    ```

    参考 <http://zengrong.net/post/1249.htm>

2. 如何处理本地有更改需要从服务器合入新代码的情况？

    ```
    git stash
    git pull
    git stash pop
    ```
