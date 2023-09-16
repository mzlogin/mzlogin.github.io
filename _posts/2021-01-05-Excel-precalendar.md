---
layout: post
title: Excel中万年历的制作
categories: Excel
description: 在Excel中制作万年历
keywords: excel, perpetual calendar
---

今天有位新疆的朋友问我万年历的制作方法，在公众号中一句话两句话很难描述清楚，这样，我就写这篇文章，希望能帮助到他。

首先打开EXCEL表格，我们分别列出周一到周日，而且利用我们Windows右下角的日期和时间，也很容易查询出2021/1/1日是周几，也填列其中

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/d69591e7-1a78-4c24-a9c2-1142bc5f0bf9)

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/eeb4f644-a34b-4b3d-b3db-87064ad681a0)

我们点选1月1日这个单元格，鼠标在右下角出现+号时，往前面拖拽到周一，推出周一是2020/12/28，我们后边所有的信息填充都要依靠2020/12/28这个单元格，我们会在这里填列一个公式：

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/f793b387-c8f1-46b1-a06a-4d50abc16ce0)

在A5这个单元格我们需要填列一个公式：=A3-weekday(A3,2)+1,点按回车后，会发现这里依然显示的是2020/12/28,但实际上它已经转换成为了一个公式。把后边数字删除掉，



设周末的颜色：设置新建规则（使用公式设定要设置格式的单元格，选定将颜色设置为红色）

![image](https://github.com/weakchen007/aiwv.github.io/assets/58799395/7c57263f-f5f9-429c-bb04-f891d7470d9c)





