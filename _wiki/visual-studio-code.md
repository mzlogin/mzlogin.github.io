---
layout: wiki
title: Visual Studio Code
cate1: Tools
cate2: Editor
description: Visual Studio Code 的快捷键与使用技巧
keywords: Visual Studio Code
---

## 快捷键

<https://code.visualstudio.com/docs/reference/default-keybindings>

C --> Ctrl

S --> Shift

M --> Alt

Cmd --> Command

### 基础编辑

|功能|Mac OS X|
|:--|:--|
|在下方插入行|Cmd-Enter|
|在上方插入行|Cmd-S-Enter|
|行下移|Option-Down|
|行上移|Option-Up|
|行注释|Cmd-/|
|块注释|Option-S-a|
|文件格式化|Option-S-f|
|选中内容格式化|Cmd-k f|
|跳到定义|F12|
|查看定义|Option-F12|
|查看引用|S-F12|
|跳到实现|Cmd-F12|
|Quick Fix|Cmd-.|
|参数提示|Cmd-S-Space|

### 导航

|功能|Mac OS X|
|:--|:--|
|搜索 Symbols| Cmd-t|
|搜索文件|Cmd-p|
|命令面板|Cmd-S-p|
|后退|C--|
|前进|C-S--|

### 文件管理

|功能|Mac OS X|
|:--|:--|
| 打开文件|Cmd-o|

### 显示

|功能|Mac OS X|
|:--|:--|
|开关侧边栏|Cmd-b|
|资源管理器|Cmd-S-e|
|搜索|Cmd-S-f|
|运行和调试|Cmd-S-d|
|面板|Cmd-j|
|Output面板|Cmd-S-u|
|Markdown 侧边预览|Cmd-k v|
|Terminal|C-`|

## 使用 VSCode 作为 mergetool

编辑 ~/.gitconfig 文件，添加如下内容：

```
[merge]
    tool = vscode
[mergetool "vscode"]
    cmd = code --wait $MERGED
```

需要的时候执行 git mergetool 就会调起了。

参考：<https://blog.kulman.sk/using-vscode-as-git-merge-tool/>

## 使用 VSCode 作为 git commit message 编辑器

```
git config --global core.editor "code -w"
```

## VSCodeVim 支持按键重复

在 macOS，默认情况 VSCodeVim 模式下是不支持按键重复的，比如你在 Normal 模式下长按 `L`，结果光标只向右移动了一次，而没有像你预期的那样一直移动。

启用按键重复的方法在插件的 REAME 有说明，链接：<https://github.com/VSCodeVim/Vim#mac>

方法：

按需执行下面的某一行命令并重启 VSCode。

```sh
$ defaults write com.microsoft.VSCode ApplePressAndHoldEnabled -bool false         # For VS Code
$ defaults write com.microsoft.VSCodeInsiders ApplePressAndHoldEnabled -bool false # For VS Code Insider
$ defaults write com.visualstudio.code.oss ApplePressAndHoldEnabled -bool false    # For VS Codium
$ defaults delete -g ApplePressAndHoldEnabled                                      # If necessary, reset global default
```

如果有需要，调整「系统偏好设置」—「键盘」里的「按键重复」和「重复前延迟」。

## 在命令行使用 code 命令启动 VSCode

默认并不支持，但可以使用以下方式开启：

<kbd>command</kbd>+<kbd>shift</kbd>+<kbd>p</kbd> 打开命令面板，输入 `shell`，选择 `Shell Command: Install 'code' command in PATH`。

- `code .` 打开当前目录；
- `code -n .` 在窗口打开当前目录；
- `code -r .` 复用现有窗口打开当前目录；
- `code -g <file:line:column>` 打开指定文件并跳转到指定行列；

`code -h` 查看更多命令。

## 查看 Java 项目依赖的 jar 包的源码

跟进 .class 文件后，右键，选择 Attach Source，选择 jar 包对应的源码文件。
