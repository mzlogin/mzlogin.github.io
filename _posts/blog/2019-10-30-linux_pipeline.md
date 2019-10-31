---
layout: post
title: 记一次python2和python3的混合使用（linux管道——取巧方法）
categories: Blogs
description: 记一次python2和python3的混合使用（linux管道——取巧方法）
keywords: linux,管道,python2和python3
---
最近实验室在用树莓派打造智慧实验室，我这边有个任务是爬取气象台的实时天气，跟实验室树莓派采集的室内天气整合做告警（实验室常年盛夏30度以上。。。）。但是在完成任务中遇到了一个挺有意思的困难，解决方法挺巧妙的在这里记录下。

## 问题简述

我们的树莓派是在淘宝购买的，卖家给了一些传感器的示例代码，但都是python2写的。我们实验室内部代码却都是python3完成的，所以我的采集天气组件也不例外由python3完成。

组件很简单，想法是每隔一定时间爬取一次最新的实时预报天气，和最新采集的实验室内天气一起发送给kafka。

但这时问题就来了，图省事卖家给的python2的树莓带代码直接可以读到天气，但是没法和我的python3代码放一起使用。这该如何一起发送给kafka，最后用了一个非常取巧的方法解决的。

## 解决方法

解决的途径用的是linux内的管道。

首先树莓派每隔指定时间（10秒）读取一次实验室内的实时温度，之后将温度打印到控制台。

Python3写的爬天气脚本则会一直等待控制台输入，当获取到输入时，将输入和温度一起发送给kafka。用

将python2和python3用linux管道连接：

``` shell
python2 28_humiture1.py | python3 weather.py > log.log 2>&1 &
```

树莓派的采集温度输出就是print，但一定要注意python输出时要刷新缓冲区！！！！否则他会攒着等到缓冲区满在输出。

输出代码：

``` python
while True:
    result = read_dht11_dat()
    if result:
        humidity, temperature = result
        print "%s" % (temperature)
        sys.stdout.flush()
    time.sleep(10)
```

python3的读取输入代码：

``` python
while True:
    line = sys.stdin.readline()
    line = line[:-1]
    if line.isdigit():
        fun_timer(line)
    else:
        print("输入格式有误：%s"%(line))
```

这样每次读到输入的时候自然就会去结合发送，比之前想到的用文件（将每次爬的数字放到文件里，有可能出现读写冲突问题）要方便多了！

## Linux管道

其实之前用的最多的也就是grep，如：

``` shell
ps -ef|grep java
```

其实就是将所有的进程输入到grep中去搜索。

有两点比较清晰的解释了管道：

1. 管道命令只处理前一个命令正确输出，不处理错误输出

2. 管道命令右边命令，必须能够接收标准输入流命令才行。

附一张图：

![运行成功](/images/posts/blog/WX20191031-112721.png)
