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

PowerShell 6 默认配置文件 `~/Documents/WindowsPowerShell/Microsoft.PowerShell_profile.ps1`。

PowerShell 7 默认配置文件 `<我的文档>/PowerShell/Microsoft.PowerShell_profile.ps1`

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

## gpull=git pull origin <current branch>
function Git-Pull-Current-Branch {
    $currentBranch = git symbolic-ref --short -q HEAD
    git pull origin $currentBranch
}

Set-Alias gpull Git-Pull-Current-Branch

## gpush=git push origin <current branch>
function Git-Push-Current-Branch {
    $currentBranch = git symbolic-ref --short -q HEAD
    git push origin $currentBranch
}

Set-Alias gpush Git-Push-Current-Branch

## g1=add、commit、push 一条龙
function Git-Commit-And-Push {
    git add .
    git commit -m $args[0]
    Git-Push-Current-Branch
}

Set-Alias g1 Git-Commit-And-Push
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

## 常用命令

### 查看 PATH 环境变量

```
type env:path
```

或者将它们每个一行显示：

```
(type env:path) -split ';'
```

还可以过滤：

```
(type env:path) -split ';' | sls bin
```

## 参考

- [用 PowerShell 快速查看 PATH 环境变量](http://blog.vichamp.com/2014/08/05/quick-examine-path-env-variable-with-powershell/)
