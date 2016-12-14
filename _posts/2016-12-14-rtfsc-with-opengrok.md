---
layout: post
title: 搭建大型源码阅读环境——使用 OpenGrok 
categories: Tools
description: RTFSC 是程序员打怪升级路上避不开的功课，那营造一个舒适的环境来提升上课的体验就很有必要了。
keywords: OpenGrok, RTFSC
---

RTFSC 是程序员打怪升级路上避不开的功课，那营造一个舒适的环境来提升上课的体验就很有必要了。

比如阅读 AOSP 这种大型源码，用什么姿势来阅读才能丝般顺滑，让 F\*\*king Source Code 也变得不那么可恶呢？

## 工具的选择

阅读源码的工具我尝试过以下几类：

1. IDE

   在看特定类型项目时这是我的首选。比如它原本就是一个 Visual Studio 工程，那当然用 Visual Studio 来打开阅读，看 Android App 或者 Library 源码当然用 Android Studio 体验更好。

2. 编辑器配合插件

   比如 Vim + Ctags + Cscope，再配合文件模糊查找插件 LeaderF 和神器 YouCompleteMe，在源码规模不大时很方便，打开也轻快，阅读一些小项目时我还是乐意使用它们。

3. 专门的源码阅读工具

   在针对特大型源码时，比如 AOSP 和 Chromium，使用上述两种方案可能会感觉乏力，这时候就需要祭出专门的源码阅读工具了。

   一类是商业软件，比如 Windows 下有著名的 Source Insight，跨平台的有 Understand，功能都很强大，都是不错的选择。当然它们都价格不菲。

   而我这里要讲的主角 OpenGrok 属于另一类，免费，开源，运行流畅，功能也毫不逊色。

如果你还在寻觅适合你自己的解决方案，大可以花一点时间将以上几种都尝试一遍，哪个称手用哪个，也可以像我一样，针对不同的项目使用不同的工具。想直观了解 OpenGrok 的同学可以直接先看看一些使用 OpenGrok 的在线源码查看网站，看看它能否满足你的需求，其中的一些列在 [OpenGrok installations](https://github.com/OpenGrok/OpenGrok/wiki/OpenGrok-installations)。

## OpenGrok 特性

译自官方 [Wiki](https://github.com/OpenGrok/OpenGrok/wiki/Features)。

OpenGrok 提供如下特性：

1. 快速搜索代码的引擎

   * 搜索全文、定义、符号、文件路径和修改历史

   * 搜索任意指定子目录（分层搜索）

   * 增量更新索引文件

   * 支持类似 Google 的查询语法，比如 `path:Makefile defs:target`

   * 搜索日期范围内修改的文件

   * 支持使用通配符搜索，如 `*` 表示多个字符，`?` 表示单个字符

   * 在搜索结果中展示匹配行

2. 一个 Web 只读版的版本历史查看界面

   * 文件的修改日志

   * 文件在两个版本间的 diff

   * 文件夹的历史记录

3. 带语法高亮的交叉引用显示，可以使用 CSS 自定义样式

4. 可以开发插件支持新的语言和版本控制系统

    已经支持的语言： [Supported Languages and Formats](https://github.com/OpenGrok/OpenGrok/wiki/Supported-Languages-and-Formats)
    
    已经支持的版本控制系统：[Supported Revision Control Systems](https://github.com/OpenGrok/OpenGrok/wiki/Supported-Revision-Control-Systems)

## 配置 OpenGrok

### 截屏

按惯例先上图吧，万一你一眼就发现不是你的菜呢（截图来自[官网](https://opengrok.github.io/OpenGrok/)）。

搜索功能和源码树：

![OpenGrok Search and Browse](/images/posts/tools/opengrok-scr1.png)

代码导航和版本历史记录：

![OpenGrok Navitation and History](/images/posts/tools/opengrok-scr2.png)

### 安装和配置

如下以 Windows 下为例，Mac OS X 与 Linux 下与此类似，很多步骤能使用 brew 或者 apt-get 会更方便。

1. 安装 [JDK](http://www.oracle.com/technetwork/java/)。

2. 下载 [Tomcat](http://tomcat.apache.org/)，解压到一个目录，如 D:\Programs\apache-tomcat-8.5.8。

3. 下载 [Universal Ctags](https://github.com/universal-ctags/ctags) for Windows，将 ctags.exe 文件所在目录添加到 PATH 环境变量。

4. 下载 [OpenGrok](https://github.com/OpenGrok/OpenGrok/releases) 的最新包，比如 opengrok-0.13-rc4.zip，解压到一个目录，如 D:\Programs\opengrok-0.13-rc4。

5. 配置 data root。

   data root 用于放置生成的索引文件和配置信息，比如我在 OpenGrok 目录下创建了一个 data 目录用作 data root，即 D:\Programs\opengrok-0.13-rc4\data。

6. 将 OpenGrok 的 lib 目录里的 source.war 解压到 D:\Programs\apache-tomcat-8.5.8\webapps\source，配置 WEB-INF\web.xml 文件的 CONFIGURATION 为上一步生成的 data 目录下的 configureation.xml，比如我的配置：

   ```xml
   <display-name>OpenGrok</display-name>
   <description>A wicked fast source browser</description>
   <context-param>
     <description>Full path to the configuration file where OpenGrok can read its configuration</description>
     <param-name>CONFIGURATION</param-name>
     <param-value>D:/Programs/opengrok-0.13-rc4/data/configuration.xml</param-value>
   </context-param>
   ```

7. 配置 source root。

   可以让 OpenGrok 认为 source root 下的每个子文件夹是一个项目，所以我们利用这个特性来配置和阅读多个项目源码就好了。

   我的做法是在 OpenGrok 下创建了一个子目录 D:\Programs\opengrok-0.13-rc4\projects，然后将需要阅读的源码使用符号链接的方式链接到这个目录里：

   ```sh
   cd /d D:\Programs\opengrok-0.13-rc4\projects
   mklink /J android D:\sources\android_5.1
   mklink /J openjdk7 D:\sources\openjdk7
   ```

   这样就有一个叫 android 的工程，它实际对应 D:\sources\android_5.1 下的源码，一个叫 openjdk7 的工程，它实际对应 D:\sources\openjdk7 下的源码。

8. 建立索引。

   使用 opengrok.jar 调用 ctags 来为源码建立索引。命令行：

   ```sh
   java -jar /path/to/opengrok.jar -P -S -v -s /path/to/source/root -d /path/to/data/root -W /path/to/configuration.xml
   ```

   `-P` 表示为 source root 目录下的每个一级子目录生成一个工程。

   `-S` 表示搜索并添加 "external" source repositories。

   `-v` 表示打印操作的进度信息。

   `-s` 表示指定 source root。

   `-d` 表示指定 data root。

   `-W` 表示指定将配置写到该文件。

   还有更多配置选项可以使用 `java -jar /path/to/opengrok.jar` 查看。

   比如我使用的完整命令行：

   ```sh
   java -jar D:\Programs\opengrok-0.13-rc4\lib\opengrok.jar -P -S -v -s D:\Programs\opengrok-0.13-rc4\projects -d D:\Programs\opengrok-0.13-rc4\data -W D:\Programs\opengrok-0.13-rc4\data\configuration.xml
   ```

   每次需要建立或更新索引的时候敲这么长一个命令当然很不爽，使用 doskey 或者 Cmder 里的 alias 命令将其 alias 为 opengrok-index 命令会省力不少，再不济把这命令存成个 bat 文件也行啊。

   为大型源码建立索引可能需要漫长的时间，这时候可以去干点别的事了。

9. 启动 Tomcat，愉快地 RTFSC。

   ```sh
   D:\Programs\apache-tomcat-8.5.8\bin\catalina.bat start
   ```

   用你最爱的浏览器打开 <http://localhost:8080/source/>，然后就能愉快地跟 OpenGrok 玩耍了。

   当新添加了项目，或者现有项目有源码更新时，再次执行上一步的命令，就能增量更新索引了。

### 配置多项目

我曾经为如何在 OpenGrok 里配置多项目苦恼了好久——一开始我是把 Android 源码的根目录当作 source root 的，可想而知 OpenGrok 把 Android 分成了好多个子项目，而这时我也没法再添加新的工程了。

后来才发现建一个专用的 source root，然后把各种项目源码根目录软链接过来，让 OpenGrok 为 source root 下的每个 symbol 一级子目录建立一个项目才是正确的使用方法。

Windows 下建立软链接的方法是使用 `mklink /J android D:\sources\android_5.1`，Mac OS X 和 Linux 下可以使用 `ln -s /path/to/source project_name`。

### 折腾狂魔

**在 Vim 里使用**

没错，还有人做了支持在 Vim 里使用 OpenGrok 的插件，如果你是 Vim 控+折腾狂魔，可以一试，这里仅给出插件地址：

* [asenac/vim-opengrok](https://github.com/asenac/vim-opengrok)
* [jdevera/vim-opengrok-search](https://github.com/jdevera/vim-opengrok-search)

反正像我这种智商是折腾不动了，就安心在浏览器里用了。

**在源码里做笔记**

配合 Chrome 插件 [Diigo](https://chrome.google.com/webstore/detail/diigo-web-collector-captu/pnhplgjpclknigjpccbcnmicgcieojbh)，还能给源码加标签，写注释等等。

参考：<https://www.zhihu.com/question/33505693/answer/132224974>

## 后话

古人教会了我们工欲善其事，必先利其器的智慧，但我们也不能沉迷和徘徊于各种利器之间，选择一样自己感觉最称手的工具，把它用熟练，少再在这上面花时间折腾，毕竟把有限的生命投入到无限的 RTFSC 才是正道不是么。
