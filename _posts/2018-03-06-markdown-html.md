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
  
  ```6 <font color=red> 实现字体颜色为红色</font>```
  
  ```7 <span style="background-color: orange">实现背景填充为橙色</span>```
  
  ```8 <font color=#FF69B4> 字体颜色值也可以用十六进制表示</font>```
  
  ```9 <span style="background-color: #D3D3D3"> 背景颜色值也可以用十六进制表示</span>```
  
  ```10 <font face="黑体" size=4 color=red>实现字体效果：黑体、4号、红色</font>```
  
  ```11 <span style="background-color: #D3D3D3"><font size=4 color=#DC143C>默认字体，4号，使用十六进制表示颜色值</font></span>```

<font face="黑体">实现字体为黑体</font>

<small> 比默认字体小一号 </small>

这里显示的是浏览器默认字体大小

实现字体大小改变

<big> 比默认字体大一号 </big>

<font color=红色> 实现字体颜色为红色 </font>

<span style="background-color: orange"> 实现背景填充为橙色 </span>

<font color=#FF69B4> 字体颜色值也可以用十六进制表示 </font>

<span style="background-color: #D3D3D3"> 背景颜色值也可以用十六进制表示 </span>

<font face="黑体" size=4 color=red> 实现字体效果：黑体、4号、红色 </font>

<span style="background-color: #D3D3D3"><font size=4 color=#DC143C> 默认字体，4号，使用十六进制表示颜色值 </font> </span>

    注意：其中，字号size的值可取 1 ~ 7，浏览器的默认值为 3。

3、 实现上标、下标

Markdown 支持上标和下标：上标使用 ```^xxx^ ```表示，下标使用 ```~xxx~ ```表示，如 ```X~1~^2^ ```则显示为 X<sub>1</sub><sup>2</sup> 。另外，也可以用 HTML 中的```<sup>xxx</sup>```实现上标、```<sub>xxx</sub>```实现下标。

    H<sub>2</sub>O、注册商标<sup>&reg;</sup>、(x<sub>1</sub>+x<sub>2</sub>)<sup>2</sup> = x<sub>1</sub><sup>2</sup>+x<sub>2</sub><sup>2</sup>+2x<sub>1</sub>x<sub>2</sub>

实现的效果如下所示：

H<sub>2</sub>O、注册商标<sup>&reg;</sup>、(x<sub>1</sub>+x<sub>2</sub>)<sup>2</sup> = x<sub>1</sub><sup>2</sup>+x<sub>2</sub><sup>2</sup>+2x<sub>1</sub>x<sub>2</sub>

4、实现下划线、上划线

可以使用```<u>```标签为文本添加下划线。

    如果文本不是超链接，就不要<u>对其使用下划线</u>。

显示效果如下：

如果文本不是超链接，就不要 <u> 对其使用下划线 </u> 。

可以使用```<span style="text-decoration: overline;"></span>```为文本添加上划线。

    <span style="text-decoration: overline;">RESET</span>是复位信号，输入低电平有效。

显示效果如下：

<span style="text-decoration: overline;">RESET</span>是复位信号，输入低电平有效。

5、关于图片处理的技巧
     
      Markdown 格式生成的图片默认居左对齐，大小受图片实际大小限制
      ![](https://bitnotes.oss-cn-shanghai.aliyuncs.com/assets/20200715225103.png)

![](https://bitnotes.oss-cn-shanghai.aliyuncs.com/assets/20200715225103.png)

     可以用 HTML 中 <img> 标签的 "width" 及 "height" 属性来固定图片的大小
     <img width=256 height=256 src="https://bitnotes.oss-cn-shanghai.aliyuncs.com/assets/20200715225103.png" />

<img width=256 height=256 src="https://bitnotes.oss-cn-shanghai.aliyuncs.com/assets/20200715225103.png" />


