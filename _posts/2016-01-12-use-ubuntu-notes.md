---
layout: post
title: Ubuntu 使用笔记
categories: Linux
description: 使用 Ubuntu 遇到一些问题，笔记在此备忘。
keywords: Linux, Ubuntu
---

使用 Ubuntu 过程中遇到的问题及解决方案。

## 使用 git pull 遇到问题

提示

```
Agent admitted failure to sign using the key.
Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

解决方法：

```sh
ssh-add ~/.ssh/id_rsa
```

## 图形界面编辑配置文件

安装 dconf-editor。

## 配置 Exchange

为 ThunderBird 安装插件 ExQuilla，有时被墙。

http://mesquilla.net/exquilla-currentrelease-tb-linux.xpi

## 安装和配置 JDK

在 Terminal 运行：

```sh
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java8-installer

sudo vim /etc/profile

export JAVA_HOME=/usr/lib/jvm/java-8-oracle
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib
export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH
```

## 配置 adt

安装兼容 32 位 adb 运行的环境

```sh
sudo apt-get install lib32z1 lib32ncurses5 lib32bz2-1.0 lib32stdc++6
```

添加路径到 $PATH 环境变量，修改 /etc/profile 或 ~/.profile 等皆可。

```
export ANDROID_SDK_HOME=/home/mzlogin/android/sdk
export PATH=$ANDROID_SDK_HOME/platform-tools:$ANDROID_SDK_HOME/tools:$PATH
```

## 安装 SVN 图形前端 RabbitVCS

在 Terminal 运行：

```sh
sudo add-apt-repository ppa:rabbitvcs/ppa
sudo apt-get update
sudo apt-get install rabbitvcs-nautilus3 rabbitvcs-thunar rabbitvcs-gedit rabbitvcs-cli
```

## 创建 eclipse 快捷方式

/usr/share/applications 里新建 Eclipse.desktop，填如下内容：

```
[Desktop Entry]
Name=Eclipse
Comment=Launch Eclipse
Exec=/home/mzlogin/android/eclipse/eclipse
Icon=/home/mzlogin/android/eclipse/icon.xpm
StartupNotify=true
Terminal=false
Type=Application
```

## 安装 XMind

到 XMind 官网下载安装包，然后 ：

```sh
sudo dpkg --ignore-depends=lame,libwebkitgtk-1.0-0 -i xmind-linux-3.5.0.201410310637_amd64.deb
```

## 切换输入法

添加一个英文，一个五笔，将切换到上一个源和下一个源的快捷键分别设为左和右 Shift，这样就可以使用左右 Shift 在中英之间来回切换了。

安装 im-switch 会导致语言支持被移除，恢复用 `sudo apt-get install language-selector-gnome`。

## 消除启动 gVim 在 terminal 中的警告

安装 vim-gnome 后运行 gVim 会提示：

```
GLib-GObject-WARNING **: Attempt to add property GnomeProgram::sm-connect after class was initialised
```

改为安装 vim-gtk 就好了。

## 解决 ibus 五笔候选词水平显示和个数的问题

修改 /usr/share/ibus-table/tables/wubi-jidian86.db 的 ime 表里的 orientation（水平 0 垂直 1）和 select\_keys（有几个选择键就有几个项，从下面代码可知用 `,` 分隔）。

/usr/share/ibus-tables/engine/tabsqlitedb.py 中

```python
def get_page_size (self):
    return len(self.get_select_keys().split(','))
```

## 将 Caps Lock 映射为 Ctrl

1. 安装 Gnome Tweak Tool

   ```sh
   sudo apt-get install gnome-tweak-tool
   ```

2. 打开 tweak-tool，找到「打字」－「大写锁定键行为」，选择「将 CapsLock 作为额外的 Ctrl」

参考 <http://askubuntu.com/questions/462021/how-do-i-turn-caps-lock-into-an-extra-control-key>

## 将个人文件夹下文件夹名改为英文

~ 目录下的「桌面」和「文档」等文件夹是中文，在 Terminal 下输入很不方便，将其改为英文的方法：

1. 打开 ~/.config/user-dirs.dirs，将其中的中文改掉：

   ```
   XDG_DESKTOP_DIR="$HOME/desktop"
   XDG_DOWNLOAD_DIR="$HOME/downloads"
   XDG_TEMPLATES_DIR="$HOME/templates"
   XDG_PUBLICSHARE_DIR="$HOME/public"
   XDG_DOCUMENTS_DIR="$HOME/documents"
   XDG_MUSIC_DIR="$HOME/music"
   XDG_PICTURES_DIR="$HOME/pictures"
   XDG_VIDEOS_DIR="$HOME/videos"
   ```

2. 在文件管理器中将 HOME 目录下的中文文件夹名改成与上面的配置对应。

## 输入「」与『』

极点五笔中文输入状态下，按 [] 即输入「」，按 {} 即输入『』。

## VirtualBox 里 Ubuntu 分辨率无法调整

Ubuntu 14.04 LTS 在 VirtualBox 中刚安装完时，分辨率只有 640\*480 一种选项，无法调整。

解决方法：

1. 打开 xdiagnose

   ![](/images/posts/linux/xdiagnose.png)

2. 勾选 Debug 下的所有选项

   ![](/images/posts/linux/xdiagnose-2.png)

3. 重启

4. 安装增强功能

   ![](/images/posts/linux/install-additions.png)

   然后：

   ```
   cd /media/<username>/VBOXADDITIONS_X.X.XX_XXXXX
   sudo ./VBoxLinuxAdditions.run
   ```

   （注意把 username 替换成自己的，VBOXADDITIONS 后面的 X 换成具体版本号）

## 与 Win7 共享 SSH key

如下步骤适用于在 Ubuntu 上使用从 Win7 拷贝的 SSH key，反之应该也一样能用。

创建 ~/.ssh 目录，确认其权限为 0700，将 Windows %userprofile%/.ssh 下的 id\_rsa 和 id\_rsa.pub 文件拷贝到 ~/.ssh 目录下，权限分别改为 0600 和 0644。

```sh
mzlogin@ubuntu:~$ ll ~/.ssh
total 20
drwx------  2 mzlogin mzlogin 4096 Jun 22 01:03 ./
drwxr-xr-x 20 mzlogin mzlogin 4096 Jun 22 01:02 ../
-rw-------  1 mzlogin mzlogin 1679 Jun 21 05:17 id_rsa
-rw-r--r--  1 mzlogin mzlogin  399 Jun 21 05:17 id_rsa.pub
```

然后

```sh
ssh-add ~/.ssh/id_rsa
```
