---
layout: wiki
title: Visual Studio Code
cate1: Tools
cate2: Editor
description: Visual Studio Code 的快捷键与使用技巧
keywords: Visual Studio Code
---

## 快捷键

C --> Ctrl

S --> Shift

M --> Alt

Cmd --> Command

| 功能              | Windows | Mac OS X |
|:------------------|:--------|:---------|
| 打开文件          | C-o     |          |
| 打开文件夹        | C-k C-o |          |
| 关闭文件夹        | C-k f   |          |
| 命令面板          | C-S-p   |          |
| 资源管理器        | C-S-e   |          |
| 搜索              | C-S-f   |          |
| Git               | C-S-g   |          |
| 调试              | C-S-d   |          |
| 插件              | C-S-x   |          |
| Markdown 侧边预览 | C-k v   |          |
| Markdown 预览     | C-S-v   |          |

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
