---
layout: post
title: 给 zsh 自定义命令添加参数自动补全
categories: Shell
description: 给 zsh 自定义命令添加参数自动补全
keywords: zsh, 自动补全
---

有时我会自定义一些 zsh 命令，以便提升某些高频操作的效率。本文记录我给一个自定义命令添加参数自动补全的方法。

## 场景

我自定义了一个 zsh 命令 `gmt`，执行 `gmt <b2>`，可以将当前所在的 git 分支 merge 到 `<b2>` 这个分支。

它具体完成以下工作：

1. 切换到 git 分支 `<b2>`；
2. 将 `<b2>` 分支更新到最新；
3. 询问是否合并，输入 `y` 则进行分支合并。

也就是用一条命令完成一个 `git checkout b2`、`git pull origin b2`、`git merge b1` 这样的组合操作。

用了一段时间，可以省一些事，美中不足的就是有时候分支名称比较长，只能手动输入，没有自动补全。

## 期望效果

1. 输入 `gmt `，然后按 <kbd>tab</kbd>，自动提示本地的所有 git 分支名称；
2. 输入 `gmt fe`，然后按 <kbd>tab</kbd>，自动补全以 `fe` 开头的 git 分支名称；

## 实现方法

在 zsh 配置文件中添加如下代码：

```sh
compdef _git_merge_to_comp git_merge_to

_git_merge_to_comp()
{
    local -a git_branches
    git_branches=("${(@f)$(git branch --format='%(refname:short)')}")
    _describe 'command' git_branches
}
```

*注：`git_merge_to` 是一个自定义的函数，`gmt` 是这个函数的 alias。*

这段代码的意思就是使用 `_git_merge_to_comp` 这个函数来给 `git_merge_to` 命令做自动补全，自动补全的候选列表是当前项目的所有本地 git 分支名称。

其中：

`compdef`、`_describe` 等的用法，可以参考 zsh 的官方文档 [Completion System][]。

`git_branches=("${(@f)$(git branch --format='%(refname:short)')}")` 的意思是，将 `git branch --format='%(refname:short)'` 命令的输出按行分割后形成一个字符串数组，赋值给 `git_branches` 变量，这部分可以参考 [How to properly collect an array of lines in zsh][]。

我的 zsh 配置都上传到了 <https://github.com/mzlogin/config-files>，有需要可以参考下。

## 效果演示

![](/images/posts/shell/zsh-gmt-completion.gif)

## 参考

- [Completion System][]
- [How to properly collect an array of lines in zsh][]

[Completion System]: https://zsh.sourceforge.io/Doc/Release/Completion-System.html
[How to properly collect an array of lines in zsh]: https://unix.stackexchange.com/questions/29724/how-to-properly-collect-an-array-of-lines-in-zsh
