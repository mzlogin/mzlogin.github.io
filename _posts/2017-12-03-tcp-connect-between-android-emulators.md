---
layout: post
title: 解决两个 Android 模拟器之间无法网络通信的问题
categories: Android
description: 如何配置，让同一台 PC 上的两个 Android 模拟器之间能够使用 TCP 通信？
keywords: Android, Emulator, TCP
---

本文解决的是一个小众场景的问题：

出差在外，需要调试局域网内的两台 Android 设备之间通过 TCP 通信的情况，可手边又不是随时有多台可用的设备，于是想在笔记本上同时跑两台 Android 模拟器来构造调试环境，但是发现它俩的 IP 地址竟然都是 10.0.2.15，场面一度十分尴尬……

![](/images/posts/android/ip-address.png)

谷狗之后，众多相关的博客和问答贴将我引向了官方文档页面：

[Interconnecting emulator instances][1]

原来官方指南上解释过相关的知识，现将我关心和以前迷惑的部分翻译摘录如下，如果希望对此有个更全面的了解，还是推荐完整阅读 Android 官方文档里有关 Emulator 的章节 <https://developer.android.com/studio/run/emulator.html>

首先讲一点预备知识，再说解决方案。

## 模拟器的网络地址空间

每个模拟器都运行在一个虚拟路由/防火墙服务后面，这个服务将模拟器和宿主机器的网络接口、配置以及 Internet 隔离开来。对模拟器而言，宿主机器和其它模拟器对它是不可见的，它只知道自己是通过以太网连接到路由/防火墙。

每个模拟器的虚拟路由管理 10.0.2/24 的网络地址空间，所有地址都是 10.0.2.xx 格式。地址预分配的情况如下：

| 网络地址                                   | 描述                                                    |
|--------------------------------------------|---------------------------------------------------------|
| 10.0.2.1                                   | 路由/网络地址                                           |
| 10.0.2.2                                   | 宿主机器的 loopback interface，相当于电脑上的 127.0.0.1 |
| 10.0.2.3                                   | 首选 DNS Server                                         |
| 10.0.2.4 <br /> 10.0.2.5 <br /> 10.0.2.6 | 可选的第二、第三、第四 DNS Server                       |
| 10.0.2.15                                  | 模拟器的网络地址                                        |
| 127.0.0.1                                  | 模拟器的 loopback interface                             |

需要注意的是所有模拟器的网络地址分配都是一样的，这样一来，如果有两个模拟器同时运行在一台电脑上，它们都会有各自的路由，并且给两个模拟器分配的 IP 都是 10.0.2.15。它们被路由隔离，相互不可见。

另外一点就是模拟器上的 127.0.0.1 是指它自己，所以如果想访问宿主机器上运行的服务，要使用 10.0.2.2。

## 实现两台模拟器之间的通信

现在来解决标题和文首提到的问题，主要用到了网络重定向。

假设开发环境是：

* PC 是指运行模拟器的宿主电脑

* emulator-5554 是模拟器 1，将在 TCP 通信中作为 server 端

* emulator-5556 是模拟器 2，将在 TCP 通信中作为 client 端

配置步骤：

1. 在 emulator-5554 上运行 server，侦听 10.0.2.15:58080

2. 在 PC 上运行 `cat ~/.emulator_console_auth_token`，得到一个 token

3. 在 PC 上运行

    ```sh
    telnet localhost 5554
    auth <token>
    redir add tcp:51212:58080
    ```

    `<token>` 是指第 2 步中得到的 token。

    51212 是 PC 端口，58080 是 5554 模拟器的端口。

4. 在 emulator-5556 上运行 client 程序，连接 10.0.2.2:51212

至此，两台模拟器之间已经可以通过 TCP 愉快地通信了。

它们之间的网络连接和通信示意图如下：

![](/images/posts/android/emulators-communication.png)

**注：** 

* 以上步骤中用到的端口号都是可以根据你的需求替换的

* Windows 下 telnet 命令默认没有启用，具体启用方法请搜狗一下

## 模拟器的网络限制

1. 模拟器上运行的 Apps 可以连接到宿主电脑上的网络，但这是通过模拟器间接实现，不是直接连到宿主电脑的网卡。模拟器可以看作是宿主电脑上运行的一个普通程序。

2. 因为模拟器的特殊网络配置，可能无法支持一些网络协议，比如 ping 命令使用的 ICMP 协议。目前，模拟器不支持 IGMP 和 multicast。

    *试验了一下，模拟器的 shell 里 `ping www.sogou.com` 一直卡在那，在手机的 shell 里就可以。*

## 额外的发现

在阅读 Android 官方文档里关于模拟器的章节时，意外地发现有一节 [Sending a voice call or SMS to another emulator instance][2]

就是说模拟器可以给另外的模拟器打电话和发短信，电话号码就是端口号，比如 emulator-5554 模拟器，电话号码就是 5554，这个号码也可以从模拟器的窗口标题栏上找到，比如 `Android Emulator - Nexus_5X_API_19:5554`，里面那个 5554 就是。

## 后话

天下博文，大部分都逃不出官方文档与公开源码的范畴（比如本文就是），而且都是选定文档里讲的某一小部分来进行讲解演绎，这在作为扩展视野、快速上手、快速解决问题等用途时还是比较实用的，但如果想系统、全面地学习，官方文档一般是更好的选择。

[1]: https://developer.android.com/studio/run/emulator-networking.html#connecting
[2]: https://developer.android.com/studio/run/emulator-networking.html#calling
