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

## 窗口

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

## 程序

| 功能                | 快捷键     |
|:--------------------|:-----------|
| 打开 emoji 表情窗口 | C-Cmd-空格 |
| 打开 Spotlight      | C-空格     |
| 切换输入法          | Cmd-空格   |
| 打开 Alfred         | M-空格     |
| 打开 Finder 并查找  | C-M-空格   |
| 打开 Launchpad      | 四指合拢   |

## 搜索

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

## 复制文件路径

* 在 Finder 下

  先按键 Cmd-i，然后从弹出的窗口里复制。

* 在 Terminal 下

  ```
  pwd|pbcopy
  ```

## Safari

| 功能         | 快捷键           |
|:-------------|:-----------------|
| 定位到地址栏 | Cmd-L            |
| 切换标签     | Cmd-S-Left/Right |
| 收藏页面     | Cmd-D            |

## 保存 Safari 里正在播放的视频

```sh
$ su
# cd /private/var/folders
# ls
nk zz
# cd nk
# ls
zy3770994vqg83xvmbc9pd0m0000gn
# cd zy3770994vqg83xvmbc9pd0m0000gn/T
# open .
```

然后复制里面叫 FlashTmp.xxx 的文件，改名为 FlashTmp.flv。（操作过程中保持视频在播放状态）

## Terminal

| 功能             | 快捷键  |
|:-----------------|:--------|
| 新建标签         | Cmd-T   |
| 上/下个标签      | Cmd-{/} |
| 删除光标前的输入 | C-U     |

## WireShark

使用 WireShark 1.99 开发版，可以不依赖于 X11，界面基于 Qt，更加美观，符合 Mac 界面风格。

## 截图

| 功能               | 快捷键         |
|:-------------------|:---------------|
| 全屏截图保存到桌面 | Cmd-S-3        |
| 全屏截图并复制     | Cmd-C-S-3      |
| 选区截图保存到桌面 | Cmd-S-4        |
| 选区截图并复制     | Cmd-C-S-4      |
| 窗口截图保存到桌面 | Cmd-S-4 空格   |
| 窗口截图并复制     | Cmd-C-S-4 空格 |
| QQ 截图            | Cmd-S-A        |

### 去除窗口截图时的阴影

```sh
defaults write com.apple.screencapture disable-shadow -bool TRUE
Killall SystemUIServer
```

如果要保留窗口截图时的阴影，则将 TRUE 改为 FALSE。

### 调整选区大小

使用选区模式选中一个区域并松开鼠标前，

* 按住<kbd>空格</kbd>并移动鼠标，可以保持区域大小不变，并移动区域；
* 按住<kbd>Shift</kbd>并移动鼠标，就可以保持区域的其它三个边不变，移动一个边的位置；
* 按住<kbd>Alt</kbd>并移动鼠标，就可以对称的调整区域大小。

### 截图标注

使用预览工具可以完成截图标注。

### 延时截图

使用系统自带的 Grab 工具，运行后选择菜单的 Capture - Timed Screen。

## iBooks 里的电子书保存路径

`/Users/<username>/Library/Containers/com.apple.BKAgentService/Data/Documents/iBooks/Books`

## 安装 mpv 没有图形界面

使用 `brew options mpv` 可以看到有个 `--with-bundle` 是安装时创建 .app 文件。

```sh
brew install mpv --with-bundle
brew linkapps mpv
```

## 参考

* [你可能不知道的 Mac 技巧 - 截图，Gif 制作及 App 推荐](https://zhuanlan.zhihu.com/p/25154768)
