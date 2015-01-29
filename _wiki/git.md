---
layout: wiki
title: Git
categories: Git
description: Git常用操作记录。
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
