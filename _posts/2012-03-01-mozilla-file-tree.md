---
layout: post
title: Moziila 文件结构概览（译）
categories: Gecko
description: 对 Mozilla 官方文档中的文件结构概览的翻译。
keywords: Mozilla
---

```
/**
 * 文件名：Moziila 文件结构概览
 * 来  源：https://developer.mozilla.org/en/Source_code_directories_overview
 * 翻  译：mzlogin#qq.com
 * 日  期：2012 年 2 月 22 日
 *
 */
```
源码目录概览

这个文档是一份为开发人员提供的 Mozilla 源码目录结构树的指南。它提供源码的鸟瞰以方便开发人员理解 Mozilla 里有什么，到哪里去找想要的东西。它对一个刚刚学习 Mozilla 源码的开发人员来讲是一份不错的文档。

这份文档包含 SeaMonkey，Firefox 和 Toolkit 的相关材料。

这是一份根据 Mozilla 的源码树按月更新的文档。

在 Mozilla Source Code Directory Structure 和 more detailed overview of how the parts of Gecko fit together 可以看到相似的内容。

简介：公有子目录

一套通用名称方案贯穿整个 Mozilla 源码树。最顶层的是产品名称（如 seamonkey）。在第二层是模块的名称（如 seamonkey 的 editor 目录）。第三层一般就由通用命名方案接管了。许多第三层目录包含 base，public，和 idl 目录。虽然不是必须的，但这些同名的目录一般是用作相同的用途。如果将文件按子模块分组，它们通常会被放进第三层目录并且命一个唯一的名字（如 seamonkey 的 editor 目录中的 txmgr ）。在第三层目录下面，可能会有第四层的 base，public 和 idl 目录。因此，这个方案是递归的；它适用于子模块，子模块的子模块，依此类推。

base 包含模块的基本（核心）功能。base 包含所有不能被分类成子模块的源码。

build 包含所有用作组建特定模块的 makefile。

doc 包含与模块相关联的所有文档。

idl 包含 XPIDL（跨平台接口定义语言）接口文件。这些接口能极容易地广泛应用于 JS 脚本和 C 代码。XPIDL 文件拥有它们自己的迷你语言和处理工具。

public 包含将被导出到 dist/include 目录的源码。它们并非全部都需要公开，有一些只是在特定模块作特定用途。越多的代码被写成或者转换成 XPIDL 接口，public 目录的价值就越小。

src 包含大部分源码。

tests 包含运用此模块的 C，HTML 或 XUL 示例代码。

tools 包含自动生成某些源码的脚本和组建这个模块的专用工具。

有几个目录是平台相关的，包含特定平台的源码。

windows 包含 Windows 95，Windows 98 和 Windows NT 4.0 的专用源码。

mac 包含 MacOS 的专用源码（包括 PowerPC 和 68000 版本）。

gtk 包含运行在 Unix 的 X-Windows 的 GTK（又名 GIMP 工具包）的专用源码。

motif 包含运行在 Unix 的 X-Windows 的 Motif 工具包的专用源码。

os2 包含 OS/2 专用源码。

rhapsody 包含使用 Yellow Box（Cocoa）的 Mac OS X Server（Which is based on NeXTStep which is based on X-Windows on Unix）的专用源码。

beos 包含 BeOS 的专用源码。

qt 包含 QT 工具包（可以运行在 X-Windows On Unix，Windows 95，Windows 98 和 Windows NT 4.0 的 C 库）的专用源码。

photon 包含 Photon（一个使用在 QNX Software Systems Ltd. 的几个实时操作系统上的微内核窗口系统）的专用源码。

SeaMonkey

SeaMonkey 是火狐浏览器套件的开发版名称。

accessible 包含为 Linux 提供对 Microsoft Active Accessibility 和 Sun's ATK accessibility API 的支持的源码。

browser 包含 Firefox 的一些源码。这将会包含如下。

build 包含 Mozilla build team 用于组建和管理 Mozilla 基础代码的脚本（通常是 Perl ）和程序。这些程序协调 makefiles 的运行以及 dist 目录的创建。

calendar 包含各种各样的 Mozilla 日历程序和扩展。

caps 包含决定基于加密和证书（如 Verisign）的内容的性能的 C 接口和代码。

chrome 包含 chrome registry 工具包。

config 包含 Mozilla 开发人员用于操纵基础代码和执行 makefiles 里的特定行为的脚本和程序。这些程序是代码层的而不是组建层的（那些在 build 目录里）。

content 是从 layout 中分裂出来的，包含那些与 DOM 相关的对象。

db 包含用于 mdb/Mork database（一种低级，通用且跨平台的文件库）的 C 代码。它用于存储邮箱数据，新闻数据和全局历史数据。它现在还不能支持 XPCOM。这些代码起源于 Mozilla 传统基础代码。

dbm 包含用于管理，读写哈希表的 C 代码。它用于 URL 编辑框（存储在传统 Mozilla 的 netscape.hst 中）的自动补全特性和缓存页面索引（存储在传统 Mozilla 的 fat.db 中）。这部分代码起源于加州大学伯克利分校。

directory 包含 LDAP（轻量级目录访问协议）SDK。

docshell 包含载入并展示单个网页（例如 scroll）的 C 接口和代码。[#seamonkey-embedding embedding] 代码包装这些代码实现更高层次浏览器功能如向前，后退和历史。

dom 包含实现和跟踪 Javascript 里的 DOM（文档对象模型）对象的 C 接口和代码。它们组成 C 根据 Javascript 脚本创建，销毁和操纵内建及用户定义的对象的子体系结构。例如，如果 Javascript 脚本添加一个自定义的属性给文档（如 document.goofy = 1），代码将创建 "goofy" 结点，将它放到 "document" 结点并根据最近的 Javascript 命令来操纵它。

editor 包含实现可以编辑纯文本和 HTML 的可嵌入编辑器组件的 C 接口，C 代码和 XUL。它被用于 HTML 编辑器（如在传统 Mozilla 中的编排器），纯文本及 HTML 组成的邮件，以及贯穿整个产品的文本字段和文本区域。这个编辑器被设计得像「带编辑特性的浏览器窗口」并且额外附带编辑文本和管理 undo/redo。

embedding 包含实现泛型高级浏览器功能（如向前，后退，历史）的 C 接口和代码。[#seamonkey-webshell webshell] 代码依据特定平台与支持的方式（如 ActiveX）包装这些接口。

extensions 包含与浏览有关的各种插件的 C 接口，C 代码，XUL 和 Javascript 代码。包括：cookies，IRC，wallet，DOM Inspector，P3P， schema validation，spellchecker，transformiix，typeaheadfind，Javascript debugger，XForms 等等。

gfx 包含平台相关的绘图与成像的 C 接口与代码。可以用于画 rectangles，lines，images 等等。本质上来讲，它是一个平台相关的设备上下文集。它不操作小部件或者特定绘制例程；它只是提供绘图的最原始操作。

intl 包含本地化支持的 C 接口和代码。包含支持各种字符集，各种格式（如不同地方的日期和时间格式）和其它本地化功能的代码。

ipc 包含？（空白）

jpeg 包含读写 JPEG 图像的 C 代码。这些代码起源于对 the Independent JPEG Group 的 JPEG 规范的引用实现。

js 包含将 Javascript 脚本语汇单元化，解析，解释和执行的 C 代码。这些代码起源于 Mozilla Classic。

l10n 包含本地化组建的代码。

layout 包含实现布局引擎的 C 接口和代码。布局引擎决定如何划分窗口资源给一块块的内容。它依据 CSS1 和 CSS2（级联样式表），对齐风格和内容调整和对齐一块块的内容。它并不实际渲染内容；它只是将窗口的不同块分配给各种内容元素。它被称作「软熔」这些内容。这些代码也被称作 "NGLayout" 和 "Gecko"。

lib 包含对 Mac 编程的开发人员参考的 C 代码。它不再使用。它展示了如何将 Mozilla 浏览器嵌入到 Mac 应用程序中去，就像一些示例文件——handling code from Apple。

mailnews 包含邮件和消息组件（如 Messenger in Mozilla Classic）的 C 代码。它包含管理邮件，读取新闻组消息，导入其它邮件格式，组成新的消息等功能的所有代码。

modules 包含组建到 Mozilla 中的各种不同浏览器关联特性的 C 代码。它包括处理各种图像格式（如 PNG，GIF），允许插入 Java 虚拟机（called OJI,for "Open Java Interface"），支持插件并且读取各种压缩格式（如 JAR，ZIP，ZLIB）的代码。这些代码来源于 Mozilla 和各种公司以及独立个人。

netwerk 包含低层次访问网络（使用 sockets 和文件以及内存缓存）和高层次访问（使用各种协议如 http，ftp，gopher 和 castanet）。这部分也被称作 "netlib" 和 "Necko"。

nsprpub 包含跨平台 C 运行时库的代码。这个 C 运行时库包含基本非可视的 C 函数，有分配和释放内存的，获取时间和日期，读和写文件，处理线程的跨平台的字符串比较。这部分也被称作 "nspr" 和 "Netscape Portable Runtime"。这些代码来源于 Mozilla Classic。

other-licenses 包含没有归于 MPL 的代码，包括 branding，libical 和 stubs for 7zip。

parser 包含 HTML 解析器和 XML 解析器（expat.）。

plugin 包含 Mac 上的 MRJ plugin 的代码。

profile 包含创建新用户数据，管理已经存在的用户数据，从 Mozilla Classic 迁移数据和为流行的 ISPs（如 Earthlink 和 Concentric Networks）使用默认数据的代码。

rdf 包含访问各种数据并且根据 RDF 组织它们之间的关系的 C 接口和代码。RDF 是一个开放的标准即「Resource Description Framework」。这些代码从本地文件系统，数据库，Internet 或者其它使用类 URL 语法的资源读写数据。

security 包含安全模块包括 NSS 和 PSM。

storage 包含 sqlite3 的一个实现。

suite 将包含特定于 Mozilla suite 的文件。

sun-java 包含使 Mozilla 能与 Sun JVM 交流的 C 代码。但是它并不包括虚拟机本身的代码。

themes 包含 Mozilla 的默认主题，modern 和 classic。

toolkit 包含 Firefox，Thunderbird 和其它独立应用程序使用的工具包的代码。This will be covered below。

tools 包含 Linux-only Leaky tool 的 C 代码。Leaky 能帮忙探测内存泄漏和 XPCOM 引用计数的问题。

uriloader 包含为某一 URL 包含的内容调用正确的查看器的 C 接口和代码。例如：如果代码决定内容是一个邮件消息，它会查找匹配的监听者（可能是 Netscape Messaenger）并将邮件消息传递给它用于显示。它是通用的，可以将内容传递给内部组件（如 Messenger），插件或者辅助程序。

view 包含不同类型视图（如滚动视图）的 C 接口和代码。一个视图包括除了标题栏，边框或者其它装饰（包含在框架中）以外的内容。这些代码服务于操纵它包含的个别的内容。例如：一个滚动视图将查找它的滚动条位置并且告诉它的内容根据滚动条 thumbs 绘制在什么哪里。

webshell 包含 C 接口，C 代码，Linux Shell 脚本和其它文件用于将 Mozilla 通过不同方式内嵌到各种不同平台的其它程序中（如 plug-in，ActiveX component，XPCOM classes）。

widget 包含 C 接口和代码用于平台依赖的控件（小部件），如 scroll bars，radio buttons 和 list boxes。

xpcom 包含低层次的 C 接口，C 代码，少量汇编代码和命令行工具用于实现 XPCOM 组件（which stands for "Cross Platform Component Object Model"）的基本机制。XPCOM 是一种允许 Mozilla 导出接口并且让它们自动化且有效于 Javascript 脚本，Microsoft COM 和规则的 Mozilla C 代码的机制。一些低层次的 XPCOM classes 和 interfaces 也在这里定义（如所有平台的事件循环）。XPCOM 能兼容并且与 Microsoft COM 很像（虽然 XPCOM 是跨平台的）。

xpfe 包含 C 接口，C 代码和 XUL 用于实现 "Cross Platform Front End"。本质上讲，这是 Mozilla 程序开始和管理其它组件完成任务的地方。这些代码中包括极少量平台相关的代码；它依赖于其它组件来提供平台相关的接口来提供平台特定的功能。

xpinstall 包含 C 接口和代码用于实现从 Mozilla Classic 的智能升级特性。XPInstall 提供下载文件，解压，并且安装它们的代码，这些与平台相关。

xulrunner 包含代码用于 XUL Runner。

FireFox

Firefox 被包含在 browser 目录内。

app 包含用于组建 firefox 可执行文件的代码。

base 包含 XUL 和 branding code。

components 包含 Firefox 指定组件如历史，书签，首选项，migration，sidebar..

config 包含 Firefox 的组建脚本。

extensions 包含用于进行某一扩展工作的代码。

installer 包含 Firefox installer 代码。

locales 包含为 Firefox 翻译的文件。

themes 包含 Firefox themes。

Toolkit

Toolkit 被用于单独的产品。

components 包含警告，自动补全，命令行接口，控制台，cookies，下载管理器，文件选择器，历史，密码管理，前置类型查找，查看源码，等等。

content 包含为 toolkit 指定的 XUL。

library 包含 libXUL work。

locales 包含翻译过的文件。

mozapps 包含共享的应用程序材料。

obsolete 包含过时的材料。

profile 包含属性管理器。

themes 包含与 toolkit 有关的主题。

xre 是 XUL 的运行时引擎。这个目录包含初始化 toolkit 的代码。

Original Document Information

•Author(s): Daniel Howard

•Other Contributors: Heikki Toivonen (11-Nov-1999), HervÃ© Renault (for the French translation) (16-Nov-1999)

•Last Updated Date: Michael Kaply 2-June-2005

•Copyright Information: Portions of this content are © 1998-2007 by individual mozilla.org contributors; content available under a Creative Commons license | Details.

•Further History: Document History.
