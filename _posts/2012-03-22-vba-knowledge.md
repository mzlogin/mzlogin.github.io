---
layout: post
title: VBA在Excel中的常用操作
categories: Excel
---

####创建一个EXCEL工作簿对象:  

```vbnet
Set wd = CreateObject("excel.application")  
Set MyWorkBook = wd.Workbooks.Open(".XXXX.xls")  
```

用完后wd.Quit

####设置边框与自动筛选:  

```vbnet
Set Rng = MyWorkSheet.UsedRange  
With Rng  
    .Borders.LineStyle = xlContinuous  
    .Borders.Weight = xlThin  
    .AutoFilter  
End With  
```

####获取或者设置单元格背景色:  

```vbnet
MyWorkSheet.Cells(i, j).Interior.ColorIndex  
```
 
####保存/关闭工作簿:

```vbnet
MyWorkBook.Save  
MyWorkBook.Close  
```

####让某表格选中的单元格变成指定颜色:
在thisworkbook中添加如下代码段：

```vbnet
Private Sub Workbook_SheetSelectionChange(ByVal Sh As Object, ByVal Target As Range)
    If ActiveSheet.Name = "yoursheet" Then
        ActiveSheet.UsedRange.Interior.ColorIndex = 0
        Target.Interior.ColorIndex = 6
    End If
End Sub
```
