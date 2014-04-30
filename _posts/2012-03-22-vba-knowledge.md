---
layout: post
title: VBA在Excel中的常用操作
categories: VBA
---

####创建一个EXCEL工作簿对象:  

```vba
Set wd = CreateObject("excel.application")  
Set MyWorkBook = wd.Workbooks.Open(".XXXX.xls")  
```

用完后wd.Quit

####设置边框与自动筛选:  

```vba
Set Rng = MyWorkSheet.UsedRange  
With Rng  
    .Borders.LineStyle = xlContinuous  
    .Borders.Weight = xlThin  
    .AutoFilter  
End With  
```

####获取或者设置单元格背景色:  

```vba
MyWorkSheet.Cells(i, j).Interior.ColorIndex  
```
 
####保存/关闭工作簿:

```vba
MyWorkBook.Save  
MyWorkBook.Close  
```
