---
layout: post
title: VBA 在 Excel 中的常用操作
categories: Excel
description: 使用 VBA 操作 Excel 表格的一些常用用法的笔记。
keywords: VBA, Excel
---

## 文件操作

### 引用打开的工作簿

使用索引号（从 1 开始）

```vbnet
Workbooks(1)
```

使用工作簿名称

```vbnet
Workbooks("1.xlsx")
```

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

关闭所有工作簿

```vbnet
Workbooks.close
```

另存为（自动打开新文件关闭源文件）

```vbnet
ThisWorkbook.SaveAs FileName:="D:\1.xls"
```

另存为（保留源文件不打开新文件）

```vbnet
ThisWorkbook.SaveCopyAs FileName:="D:\1.xls"
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
While file <> ""
    Kill base & file
    file = Dir
Wend
```

### 创建文件夹

```vbnet
MkDir(directory)
```

### 判断文件夹是否存在

以下为不存在即创建

```vbnet
If Dir(outputDir, 16) = Empty Then
    MkDir (outputDir)
End If
```

### 判断文件是否存在

方法 1：

```vbnet
Dim fileSystemObject As Object

Set fileSystemObject = CreateObject("Scripting.FileSystemObject")

If fileSystemObject.FileExists(<filepath>) = True Then
    MsgBox "文件存在"
End If
```

方法 2：

```vbnet
Dim file As String

file = Dir("E:\MyPictures\Pic\logo.gif")

If file <> "" Then
    MsgBox  "文件存在"
Endif
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

### 在单元格里回车 / 换行

设置单元格 Value 里使用 `Chr(10)` 和 `Chr(13)`，分别表示回车、换行。

### 隐藏行

```vbnet
MyWorkSheet.Rows(i).Hidden = True
```

### 单元格内容为纯文本

```vbnet
sheet.Cells(m, n).NumberFormatLocal = "@"
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

## 数据结构

### Dictionary

```vbnet
Dim dict
Set dict = CreateObject("Scripting.Dictionary")

' 新增，各种类型都可以，包括 Dictionary
dict.Add "hello", "world"

' 数量
dict.Count

' 删除
dict.Remove("hello")

' 判断是否存在
dict.exists("hello")

' 取值，需要先判断存在再取
dict.Item("hello")

' 修改、新增
dict.Item("hello") = "world"

' 循环
k = dict.Keys
v = dict.Items
For i = 0 to dict.count - 1
    key = k(i)
    value = v(i)
Next

' 清空
dict.RemoveAll
```

参考：[Excel vba map/dictionary](http://www.cnblogs.com/zhjh256/p/6428333.html)

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

### 判断单元格是否为空

判断单元格的 value 是否为 ""。

### 退出

主要使用 Exit 表达式。

```
Exit { Do | For | Function | Property | Select | Sub | Try | While }
```

参见 [Exit Statement (Visual Basic)](https://docs.microsoft.com/en-us/dotnet/visual-basic/language-reference/statements/exit-statement)

## 参考

* [VBA Converting Data Types](http://software-solutions-online.com/converting-data-types/)
* [excel vba判断文件是否存在](http://blog.sina.com.cn/s/blog_6d5dcf100101bkhz.html##1)
