---
layout: wiki
title: 从零开始学习修改Github Pages
categories: tools
description: 记录Jekyll修改
keywords: jekyll，github pages 
---

## 静态网站加功能真难

完全是我不会的js或者git安装。只能不断的fork。

### 显示tags标签代码，fork再看源码吧
><!-- Leo标签的完整引用代码 -->
>          <span class="meta-info">[
>                {% for tag in page.tags %}
>                {% capture tag_name %}{{ tag }}{% endcapture %}
>		<a href="/tag/#{{ tag_name }}" title="{{ tag[0] }}" >{{ tag_name }}</a>
>                {% endfor %}
>                ]</span>

## 超链接

> [普通链接带标题](https://www.justn.cn/ "普通链接带标题")
 
### Markdown的表格

| 功能                      | 命令                                  |
|:--------------------------|:--------------------------------------|
| 添加文件/更改到暂存区     | git add filename                      |
| 添加所有文件/更改到暂存区 | git add .                             |
| 提交                      | git commit -m msg                     |
| 从远程仓库拉取最新代码    | git pull origin master                |
| 推送到远程仓库            | git push origin master                |
| 查看配置信息              | git config --list                     |
| 查看文件列表              | git ls-files                          |
| 比较工作区和暂存区        | git diff                              |
| 比较暂存区和版本库        | git diff --cached                     |
| 比较工作区和版本库        | git diff HEAD                         |
| 从暂存区移除文件          | git reset HEAD filename               |
| 查看本地远程仓库配置      | git remote -v                         |
| 回滚                      | git reset --hard 提交SHA              |
| 强制推送到远程仓库        | git push -f origin master             |
| 修改上次 commit           | git commit --amend                    |
| 推送 tags 到远程仓库      | git push --tags                       |
| 推送单个 tag 到远程仓库   | git push origin [tagname]             |
| 删除远程分支              | git push origin --delete [branchName] |
| 远程空分支（等同于删除）  | git push origin :[branchName]         |
| 查看所有分支历史          | gitk --all                            |
| 按日期排序显示历史        | gitk --date-order                     |
