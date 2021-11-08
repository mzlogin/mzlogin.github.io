---
layout: wiki
title: Windows Terminal
cate1: Tools
cate2:
description: 打造好用的 Windows Terminal
keywords: Windows Terminal
---

Windows Terminal 是微软打造的一款新的控制台终端，目前还在 Preview 版本，但经过一些配置已经可以用得不错。

## 自定义主题

可以到 <https://github.com/mbadolato/iTerm2-Color-Schemes> 的 windowsterminal 下寻找合适的主题。

## 自定义配置文件位置

我想将配置文件放到 HOME 目录下，然后通过 git 管理，通过以下办法可以做到：

首先剪切 ~/AppData/Local/Packages/Microsoft.WindowsTerminal_8wekyb3d8bbwe/RoamingState/profiles.json 文件到 ~/Windows-terminal-profiles.json，然后管理员权限打开 PowerShell，执行

```
New-Item -ItemType SymbolicLink -Path ~/AppData/Local/Packages/Microsoft.WindowsTerminal_8wekyb3d8bbwe/RoamingState/profiles.json -Target ~/windows-terminal-profiles.json
```

我的 Windows Terminal 文件见 <https://github.com/mzlogin/config-files/blob/master/windows-terminal-profiles.json>

## 通过 git 管理 PowerShell 配置

管理员权限打开 PowerShell，执行

```
New-Item -ItemType SymbolicLink -Path ~/Documents/WindowsPowerShell/Microsoft.PowerShell_profile.ps1 -Target ~/powershell.ps1
```

如果是使用 PowerShell 7 Preview，执行

```
New-Item -ItemType SymbolicLink -Path <我的文档>/PowerShell/Microsoft.PowerShell_profile.ps1 -Target <个人目录>/powershell.ps1
```

上面两个目录需要使用绝对路径，不然会报错。

我的 PowerShell 配置见 <https://github.com/mzlogin/config-files/blob/master/powershell.ps1>

## 自定义快捷键

比如在 json 配置文件的 globals -- keybindings 里添加如下内容，可以将 Windows Terminal 的复制粘贴映射为 ctrl+c 和 ctrl+v（这里真的要吐槽下，为什么不给默认映射上呢？）：

*Updated 2020-04-26： 下面这些不用再手动映射了，新版本里都给了默认映射。*

```json
{ "command": "copy", "keys": ["ctrl+c"] },
{ "command": "paste", "keys": ["ctrl+v"] }
```

split pane 和 move focus within panes：

```json
{ "command" : "splitHorizontal", "keys": [ "alt+-" ] },
{ "command" : "splitVertical", "keys": [ "alt+\\" ] },
{ "command" : "closePane", "keys": [ "alt+w" ] },
{ "command" : "moveFocusLeft", "keys": [ "alt+left" ] },
{ "command" : "moveFocusRight", "keys": [ "alt+right" ] },
{ "command" : "moveFocusUp", "keys": [ "alt+up" ] },
{ "command" : "moveFocusDown", "keys": [ "alt+down" ] }
```

参考：<https://github.com/microsoft/terminal/blob/master/doc/user-docs/UsingJsonSettings.md>
