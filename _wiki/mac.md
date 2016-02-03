---
layout: wiki
title: Mac OS X
categories: Mac
description: 使用 Mac OS X 的一些快捷键和遇到的问题。
keywords: Mac
---

快捷键约定：

C --> Ctrl

S --> Shift

M --> Alt/Option

Cmd --> Command

[Mac 键盘快捷键官方参考](https://support.apple.com/zh-cn/HT201236)

### 窗口

| 功能                   | 快捷键  |
|:-----------------------|:--------|
| 显示桌面               | F11     |
| 切换窗口全屏状态       | C-Cmd-F |
| 隐藏当前程序的所有窗口 | Cmd-H   |
| 最小化窗口             | Cmd-M   |
| 关闭窗口               | Cmd-W   |
| 关闭当前程序           | Cmd-Q   |
| 新建标签               | Cmd-T   |
| 新建窗口               | Cmd-N   |

### 程序

| 功能                | 快捷键     |
|:--------------------|:-----------|
| 打开 emoji 表情窗口 | C-Cmd-空格 |
| 打开 Spotlight      | C-空格     |
| 切换输入法          | Cmd-空格   |
| 打开 Alfred         | M-空格     |
| 打开 Finder 并查找  | C-M-空格   |
| 打开 Launchpad      | 四指合拢   |

### 搜索

* 使用 `find` 命令，例如：

  ```
  find ~ -iname aapt
  ```

* 使用 `mdfind` 命令，例如：

  全局搜索

  ```
  mdfind -name aapt
  ```

  或搜索指定文件夹

  ```
  mdfind -onlyin ~/Library aapt
  ```

* 使用 `locate` 命令，例如：

  ```
  locate aapt
  ```

### 复制文件路径

* 在 Finder 下

  先按键 Cmd-i，然后从弹出的窗口里复制。

* 在 Terminal 下

  ```
  pwd|pbcopy
  ```

### Safari

| 功能         | 快捷键           |
|:-------------|:-----------------|
| 定位到地址栏 | Cmd-L            |
| 切换标签     | Cmd-S-Left/Right |
| 收藏页面     | Cmd-D            |

### Terminal

| 功能             | 快捷键  |
|:-----------------|:--------|
| 新建标签         | Cmd-T   |
| 上/下个标签      | Cmd-{/} |
| 删除光标前的输入 | C-U     |

### WireShark

使用 WireShark 1.99 开发版，可以不依赖于 X11，界面基于 Qt，更加美观，符合 Mac 界面风格。
