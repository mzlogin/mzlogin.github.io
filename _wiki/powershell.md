---
layout: wiki
title: PowerShell
categories: Windows
description: 使用 PowerShell 打造 Windows 下的顺手终端。
keywords: Windows, PowerShell
---

使用 PowerShell 打造 Windows 下的顺手终端。

## 与 Cmder 配合使用

搭配 Cmder 一起服用，才最好。

## 配置文件位置

默认配置文件 `~/Documents/WindowsPowerShell/Microsoft.PowerShell_profile.ps1`。

Cmder 的 PowerShell 配置文件 `<cmd_install_path>/config/user-profile.ps1`。

## alias

### 快速进入某目录

例：通过 `src` 命令快速进入 `d:\sources\` 目录。

```powershell
function Enter-Sources {
    cd d:\sources\
}

Set-Alias src Enter-Sources
```

### 快速打开当前文件夹

例：通过 `e.` 命令快速在资源管理器打开当前文件夹。

```powershell
function Open-Current-Directory {
    explorer .
}

Set-Alias e. Open-Current-Directory
```

### git 相关命令

```powershell
## gs=git status
function Git-Status {
    git status
}

Set-Alias gs Git-Status

## ga=git add .
function Git-Add-All {
    git add .
}

Set-Alias ga Git-Add-All

## gg=gitk
function Git-Gui {
    gitk
}

Set-Alias gg Git-Gui
```

### objdump

```powershell
function Obj-Dump {
    D:\Android\sdk\ndk-bundle\toolchains\x86_64-4.9\prebuilt\windows-x86_64\bin\x86_64-linux-android-objdump.exe $args
}

Set-Alias objdump Obj-Dump
```

## 快捷键映射

从 Linux/macOS 的 bash 甚至 Windows 的 cmd 下切换过来后，发现 ctrl-u、ctrl-k 等快捷键不可用了，各种不顺手，PSReadLine 拯救你。

```powershell
# ctrl-k, ctrl-u, ctrl-a, ctrl-e, ctrl-b, ctrl-f, etc
Import-Module PSReadLine
Set-PSReadLineOption -EditMode Emacs
```
