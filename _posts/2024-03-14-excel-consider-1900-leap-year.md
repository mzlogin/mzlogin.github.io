---
layout: post
title: 科技奇趣｜为什么 Excel 认为 1900 年是闰年？
categories: [科技奇趣]
description: Excel 错误地认为 1900 年是闰年，这有什么历史渊源？
keywords: Python, Excel, 科技奇趣
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

我们先来看一下现象：

![](/images/posts/python/excel-1900-leap-year.gif)

实际上 **1900 年不是闰年**，没有 2 月 29 日，所以很明显 **这是 Excel 的一个 Bug**。

## 发现

我之所以会留意到这个，是因为最近在做一个绩效核对的小工具，需要用 Python 读取和处理销售交上来的 Excel。

销售交上来的东西总是稀奇古怪，比如有一列是要填日期，交上来的表格里，有的读出来是日期类型，有的读出来是字符串类型，这都还好说，日期类型直接用，字符串按格式解析成日期，就好了。但这天发现有个销售交上来的表格里，这一列读出来是数字类型。

比如 `2024-02-01`，读出来对应数字 `45323`。

怎么将这个数字转换成日期呢？

首先搜索了微软的官方文档，找到关于 [Date systems in Excel][1] 的说明：

> Excel supports two date systems, the 1900 date system and the 1904 date system. Each date system uses a unique starting date from which all other workbook dates are calculated. All versions of Excel for Windows calculate dates based on the 1900 date system. Excel 2008 for Mac and earlier Excel for Mac versions calculate dates based on the 1904 date system. Excel 2016 for Mac and Excel for Mac 2011 use the 1900 date system, which guarantees date compatibility with Excel for Windows.
> ...
> In the 1900 date system, dates are calculated by using January 1, 1900, as a starting point. When you enter a date, it is converted into a serial number that represents the number of days elapsed since January 1, 1900.

就是说，除了 Excel for Mac 的早期版本外，都是默认采用 1900 date system，以 `1900-01-01` 作为起点（第 1 天）。

于是根据这个信息写一个函数来将数字转换成日期，但是 **翻车了**……

```python
from datetime import datetime, timedelta

def int_to_date(s):
    date_zero = datetime(1900, 1, 1)
    delta = timedelta(days = s - 1)
    return date_zero + delta

print(int_to_date(45323))

# 输出 2024-02-02 00:00:00
```

Excel 表格里是 `2024-02-01`，读出来是 `45323`，咋按 `1900-01-01` 作为第一天，反算出来 `45323` 却是 `2024-02-02` 了呢？

## 探究

于是一番搜索，先是找到了 OpenOffice 论坛里的讨论 [Why the base date is 1899-12-30 instead of 1899-12-31?][2]，里面有如下信息：

> The earliest date Excel handles sensibly is 1900-01-01, which is "day 1" (not zero). This makes "Excel epoch" (day zero) 1899-12-31. However, Excel inherited an error from previous spreadsheet apps which assumed that 1900 was a leap year. The nonexistent 29th of February 1900 is counted in Excel time spans, just like it used to be in Lotus 123 and (IIRC) SuperCalc, and probably in most other relevant spreadsheet apps.

有意思了……于是继续在维基百科的 [Microsoft Excel][3] 词条上找到了佐证信息：

> Excel的时间系统中，会认为1900年2月29日是有效日期，也就是1900年为闰年，但实际上并不是。这是源于模仿早期竞品Lotus 1-2-3上的缺陷而引入的特性，由于Lotus 1-2-3的时间纪元以1900年起始，之后的时间为差值累加，导致其时间体系一开始就认为1900年是闰年，而Excel为了兼容Lotus 1-2-3的文件格式，也保留了这个缺陷作为特性而不进行修复，即使至今最新版本已不需要兼容Lotus 1-2-3。

里面还给出了微软官方的相关解释链接：[Excel incorrectly assumes that the year 1900 is a leap year][4]，并且讲述了 Excel 的发展历史，挺有趣的，可以一读。

至此，就破案了。

## 数字到日期的换算

我们上面提供的数字到日期的换算的方案，做个小修正就能使用了：

```python
from datetime import datetime, timedelta

def int_to_date(s):
    date_zero = datetime(1899, 12, 30)
    delta = timedelta(days = s)
    return date_zero + delta

print(int_to_date(45323))

# 输出 2024-02-01 00:00:00
```

当然这个程序并不完美，比如计算 60 以内的数字，算出来的就与 Excel 上显示的日期不一致，但 who cares……毕竟 Excel 上有 `1900-02-29` 这种你永远不会用到的日期 :laughing:

## 参考链接

- [https://support.microsoft.com/en-us/office/date-systems-in-excel-e7fe7167-48a9-4b96-bb53-5612a800b487][1]
- [https://forum.openoffice.org/en/forum/viewtopic.php?t=108820][2]
- [https://zh.wikipedia.org/wiki/Microsoft_Excel][3]
- [https://learn.microsoft.com/en-US/office/troubleshoot/excel/wrongly-assumes-1900-is-leap-year][4]

[1]: https://support.microsoft.com/en-us/office/date-systems-in-excel-e7fe7167-48a9-4b96-bb53-5612a800b487
[2]: https://forum.openoffice.org/en/forum/viewtopic.php?t=108820
[3]: https://zh.wikipedia.org/wiki/Microsoft_Excel
[4]: https://learn.microsoft.com/en-US/office/troubleshoot/excel/wrongly-assumes-1900-is-leap-year