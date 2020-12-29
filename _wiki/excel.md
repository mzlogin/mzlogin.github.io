---
layout: wiki
title: Excel
categories: Office
description: Excel 使用技巧
keywords: Excel, Office
---

## 小技巧

### 查找重复项

1. 选中查找区域；
2. 开始-样式-条件格式-突出显示单元格规则-重复值，在弹出的对话框中设置重复值格式；
3. 此时如果重复值，已经被标记为指定的格式。

### 在汇总行上方插入行后自动求和

比如有以下表格：

![](/images/wiki/excel-gather.png)

当前 B5 单元格的公式为 `=SUM(B2:B4)`，但是在汇总行上面插入一行新的记录后，汇总数据不会自动更新。

这时候可以使用以下两个公式，实现在汇总行上面插入新的行后，汇总数据自动求和：

```
=SUM(INDIRECT("B2:B"&ROW()-1))
=SUM(OFFSET(B1,,,ROW()-1,))
```

参考：<http://www.icanzc.com/excel/3689.html>
