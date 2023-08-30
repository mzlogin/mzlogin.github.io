---
layout: post
title: Markdown 内嵌 HTML 语法
categories: Markdown
description: Markdown 内嵌 HTML 语法
keywords: markdown，html
---
# Markdown 内嵌 HTML 语法

    Markdown是一种可以使用普通文本编辑器编写的标记语言，通过简单的标记语法，它可以使普通文本内容具有一定的格式，具体请参考 Markdown 语法说明 。在Markdown中可以内嵌HTML语法，本文总结了一些常用的HTML标记用于扩展Markdown语法。

## 1、缩进与换行

* 在 Markdown 中，可以用 两个空格+回车 来进行换行，另外 ``` <br /> ```也可以表示换行（注意：换行是指段落内的强迫换行，不同于分段，段落的前后要有一个以上的空行）；

* 在 Markdown 中，可以用 HTML 中的特殊字符（见下文） ``` &ensp; ```、 ``` &emsp; ```来实现缩进的效果，其中 ``` &ensp; ```表示半角空格， ``` &emsp; ```表示全角空格。

输入如下所示：

 ```&ensp;&ensp;&ensp;&ensp;```;半角空格 ```&ensp; ```表示； ```<br />&emsp;&emsp;```全角空格用 ```&emsp;```表示。

 实现效果如下所示：

&ensp;&ensp;半角空格用```&ensp;```表示；

&emsp;&emsp;全角空格用```&emsp;```表示。

## 2、字体、字号、颜色、背景

  ```1 <font face="黑体">实现字体为黑体</font>```
  
  ```2 <small>比默认字体小一号</small>```
 
  ```3 这里显示的是浏览器默认字体大小```
  
  ```4 <font size=4>实现字体大小改变</font>```
  
  ```5 <big>比默认字体大一号</big>```
  
  ```6 <font color=red>实现字体颜色为红色</font>```
  
  ```7 <span style="background-color: orange">实现背景填充为橙色</span>```
  
  ```8 <font color=#FF69B4>字体颜色值也可以用十六进制表示</font>```
  
  ```9 <span style="background-color: #D3D3D3">背景颜色值也可以用十六进制表示</span>```
  
  ```10 <font face="黑体" size=4 color=red>实现字体效果：黑体、4号、红色</font>```
  
  ```11 <span style="background-color: #D3D3D3"><font size=4 color=#DC143C>默认字体，4号，使用十六进制表示颜色值</font></span>```

实现字体为黑体

<small>比默认字体小一号</small>

这里显示的是浏览器默认字体大小

实现字体大小改变
比默认字体大一号
实现字体颜色为红色
实现背景填充为橙色
字体颜色值也可以用十六进制表示
背景颜色值也可以用十六进制表示
实现字体效果：黑体、4号、红色
默认字体，4号，使用十六进制表示颜色值

