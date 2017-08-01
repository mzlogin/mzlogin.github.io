---
layout: post
title: VBA 在 Excel 中的常用操作
categories: Excel
description: 使用 VBA 操作 Excel 表格的一些常用用法的笔记。
keywords: VBA, Excel
---

## 文件操作

### 创建一个 EXCEL 工作簿对象

```vbnet
Dim wd As Excel.Application
Dim wb As Workbook

Set wd = CreateObject("excel.application")
wd.Visible = True
Set wb = wd.Workbooks.Open(ThisWorkbook.Path & "/test.xls")

' ...

wb.Close
wd.Quit
```

### 打开/保存/关闭工作簿

```vbnet
Dim wb As Workbook

wb = Workbooks.Open(ThisWorkbook.Path & "/test.xls")

' ...

wb.Save
wb.Close
```

### 拷贝文件

```vbnet
oldfile = ThisWorkBook.Path & "/old.xlsx"
newfile = ThisWorkBook.Path & "/new.xlsx"
FileCopy oldfile, newfile
```

### 删除文件夹下的所有文件

```vbnet
base = ThisWorkBook.Path & "/文件夹/"
pattern = base & "*.*"
file = Dir(pattern, vbReadOnly)
While str <> ""
    Kill base & file
    file = Dir
Wend
```

### 创建文件夹

```vbnet
MkDir(directory)
```

## 格式操作

### 设置边框与自动筛选

```vbnet
Set Rng = MyWorkSheet.UsedRange
With Rng
    .Borders.LineStyle = xlContinuous
    .Borders.Weight = xlThin
    .AutoFilter
End With
```

### 获取或者设置单元格背景色

```vbnet
MyWorkSheet.Cells(i, j).Interior.ColorIndex
```

### 让某表格选中的单元格变成指定颜色

在 thisworkbook 中添加如下代码段：

```vbnet
Private Sub Workbook_SheetSelectionChange(ByVal Sh As Object, ByVal Target As Range)
    If ActiveSheet.Name = "yoursheet" Then
        ActiveSheet.UsedRange.Interior.ColorIndex = 0
        Target.Interior.ColorIndex = 6
    End If
End Sub
```

### 隐藏行

```vbnet
MyWorkSheet.Rows(i).Hidden = True
```

## 选择

### 引用单元格 / 区域

```vbnet
Range("A1") '表示 A1 单元格
Range("A2:D1") '表示 A2 到 D1 区域
Range("A2:D1")(3) '表示该区域里的第三个单元格
Range("D" & i) 'i 为变量
Range("D3:F4,G10") '引用多个区域
Range("2:2") '引用第二行
Range("2:12") '引用第二行到第十二行
Range("D:A") '引用第 A 到 D 列
Rows(2) '引用第二行
Rows("2:4") '引用第二到四行
Columns("B")
Columns("B:D")
Range(Clee1, Cell2) '左上与右下
Range(Range1, Range2) '取最大范围
```

### 选中单元格 / 区域

```vbnet
Range("1:1").Select '选中第一行
```

### 获取当前选中区域

```vbnet
MyWorkSheet.Application.Selection
```

## 语言基础

### String to Integer、Double

```vbnet
CInt(MyWorkSheet.Cells(1,7))

CDbl(MyWorkSheet.Cells(1,7))
```

### 字符串分割/获取数组长度

```vbnet
Dim arr() As String
arr() = Split(ws.Cells(a, b).Value, "-")
alen = UBound(arr) - LBound(arr) + 1
```

## 参考

[VBA Converting Data Types](http://software-solutions-online.com/converting-data-types/)
