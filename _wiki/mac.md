---
layout: wiki
title: Mac OS X
cate1: Basis
cate2: OS
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

| 功能                   | 快捷键       |
|:-----------------------|:-------------|
| 显示桌面               | F11          |
| 上/下一个桌面/工作区   | C-Left/Right |
| 切换窗口全屏状态       | C-Cmd-F      |
| 隐藏当前程序的所有窗口 | Cmd-H        |
| 最小化窗口             | Cmd-M        |
| 关闭窗口               | Cmd-W        |
| 关闭当前程序           | Cmd-Q        |
| 新建标签               | Cmd-T        |
| 新建窗口               | Cmd-N        |
| 调度中心               | C-Up         |
| 当前应用的所有窗口     | C-Down       |

## 程序

| 功能                | 快捷键      |
|:--------------------|:------------|
| 打开 emoji 表情窗口 | C-Cmd- 空格 |
| 打开 Spotlight      | C- 空格     |
| 切换输入法          | Cmd- 空格   |
| 打开 Alfred         | M- 空格     |
| 打开 Finder 并查找  | C-M- 空格   |
| 打开 Launchpad      | 四指合拢    |

## 音量

| 功能     | 快捷键            |
|:---------|:------------------|
| 微调音量 | M-S-音量加/音量减 |

## 命令行

### 快捷键

| 功能                                               | 按键    |
|----------------------------------------------------|---------|
| 移动光标至行首                                     | C-a     |
| 移动光标至行尾                                     | C-e     |
| 清屏                                               | C-l     |
| 删除光标前的所有文字。如果光标位于行尾则删除整行。 | C-u     |
| 与退格键相同                                       | C-h     |
| 检索使用过的命令                                   | C-r     |
| 终止当前执行                                       | C-c     |
| 退出当前 shell                                     | C-d     |
| 将执行中的任何东西放入后台进程。fg 可以将其恢复。  | C-z     |
| 删除光标之前的单词                                 | C-w     |
| 删除光标后的所有文字                               | C-k     |
| 将光标前的两个文字进行互换                         | C-t     |
| 光标向前移动一个单词                               | C-f     |
| 光标向后移动一个单词                               | C-b     |
| 将光标前的两个单词进行互换                         | Esc + t |
| 自动补全文件或文件夹的名称                         | Tab     |

### 命令

| 按键 / 命令    | 描述                                       |
|----------------|--------------------------------------------|
| cd             | Home 目录                                  |
| cd [folder]    | 切换目录                                   |
| cd ~           | Home 目录，例如 'cd ~/folder/'             |
| cd /           | 根目录                                     |
| ls             | 文件列表                                   |
| ls -l          | 文件详细列表                               |
| ls -a          | 列出隐藏文件                               |
| ls -lh         | 文件详细列表中的文件大小以更友好的形式列出 |
| ls -R          | 递归显示文件夹中的内容                     |
| sudo [command] | 以超级用户身份执行命令                     |
| open [file]    | 打开文件 ( 相当于双击一个文件 )            |
| top            | 显示运行中的进程，按 q 终止                |
| nano [file]    | 打开编辑                                   |
| pico [file]    | 打开编辑                                   |
| q              | 退出                                       |
| clear          | 清屏                                       |

### 命令历史

| 按键/命令 | 描述                          |
|-----------|-------------------------------|
| history n | 列出最近执行过的 n 条命令     |
| ctrl-r    | 检索之前执行过的命令          |
| ![value]  | 执行最近以 'value' 开始的命令 |
| !!        | 执行最近执行过的命令          |

## 文件管理

| 按键/命令                | 描述                                   |
|--------------------------|----------------------------------------|
| Cmd-Shift-.              | 显示/恢复隐藏文件                      |
| touch [file]             | 创建一个新文件                         |
| pwd                      | 显示当前工作目录                       |
| ..                       | 上级目录, 例如.                        |
| 'ls -l ..'               | 上级目录的文件详细列表                 |
| 'cd ../../'              | 向上移动两个层级                       |
| .                        | 当前目录                               |
| cat                      | 连接                                   |
| rm [file]                | 移除文件, 例如 rm [file] [file]        |
| rm -i [file]             | 移除时出现确认提示                     |
| rm -r [dir]              | 移除文件及内容                         |
| rm -f [file]             | 强制移除                               |
| cp [file] [newfile]      | 复制文件                               |
| cp [file] [dir]          | 复制文件到指定目录                     |
| mv [file] [new filename] | 移动 / 重命名, 例如 mv -v [file] [dir] |

## 目录管理

| 按键/命令            | 描述                              |
|----------------------|-----------------------------------|
| mkdir [dir]          | 创建新目录                        |
| mkdir -p [dir]/[dir] | 创建子目录                        |
| rmdir [dir]          | 移除目录 ( 仅限目录下没有内容时 ) |
| rm -R [dir]          | 移除目录及内容                    |

## 管道 - 连接多个带有输出的命令

| 按键/命令 | 描述                             |
|-----------|----------------------------------|
| more      | 按当前窗口大小输出内容           |
| > [file]  | 输出至指定文件, 注意文件将会覆盖 |
| >> [file] | 在制定文件的末尾附加内容         |
| <         | 从文件中读取内容                 |

## 帮助

| 按键/命令        | 描述                   |
|------------------|------------------------|
| [command] -h     | 显示帮助信息           |
| [command] --help | 显示帮助信息           |
| [command] help   | 显示帮助信息           |
| reset            | 重置当前终端           |
| man [command]    | 显示指定命令的帮助信息 |
| whatis [command] | 显示指定命令的简述     |

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
| 上 / 下个标签      | Cmd-{/} |
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

## 屏幕取色

使用 Mac 自带的“数码测色计”。

## 问题解决

### No Xcode or CLT version detected

报错信息：

```
~/github/hs-airdrop$ npm install

> bcrypto@5.0.3 install /Users/username/github/hs-airdrop/node_modules/bcrypto
> node-gyp rebuild

No receipt for 'com.apple.pkg.CLTools_Executables' found at '/'.

No receipt for 'com.apple.pkg.DeveloperToolsCLILeo' found at '/'.

No receipt for 'com.apple.pkg.DeveloperToolsCLI' found at '/'.

gyp: No Xcode or CLT version detected!
gyp ERR! configure error
gyp ERR! stack Error: `gyp` failed with exit code: 1
gyp ERR! stack     at ChildProcess.onCpExit (/usr/local/lib/node_modules/npm/node_modules/node-gyp/lib/configure.js:351:16)
gyp ERR! stack     at ChildProcess.emit (events.js:210:5)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:272:12)
gyp ERR! System Darwin 19.3.0
gyp ERR! command "/usr/local/Cellar/node/12.12.0/bin/node" "/usr/local/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /Users/username/github/hs-airdrop/node_modules/bcrypto
gyp ERR! node -v v12.12.0
gyp ERR! node-gyp -v v5.0.5
gyp ERR! not ok
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! bcrypto@5.0.3 install: `node-gyp rebuild`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the bcrypto@5.0.3 install script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
```

解决方法：

```
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

### 通过扩展坞连接的键盘鼠标卡顿断电

我用 MacBook Pro 16 寸 2019 款，通过 biaze 五口扩展坞连接键盘、鼠标、显示器、网线，一直好好的，突然有一天键盘鼠标开始经常卡顿、断电。参考 <https://support.apple.com/zh-cn/HT201295>，重置 SMC 问题也没有解决。

尝试过插别的接口、换扩展坞、只接以上几种设备之一和之二等，都没解决。最后用了个别的鼠标试了下，好了。欲哭无泪。

## 参考

* [你可能不知道的 Mac 技巧 - 截图，Gif 制作及 App 推荐](https://zhuanlan.zhihu.com/p/25154768)
* [terminal-mac-cheatsheet](https://github.com/0nn0/terminal-mac-cheatsheet)
