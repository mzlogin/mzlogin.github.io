---
layout: wiki
title: Visual Studio Code
categories: Tools
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
