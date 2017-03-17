---
layout: post
title: 用 VBA 将多个 Excel 文件里的数据汇总到一个 Excel 表
categories: Excel
description: 使用 VBA 将多个 Excel 文件里的数据汇总到一个 Excel 里。
keywords: VBA, Excel
---

## 需求

给出一个空汇总表，和若干单独的 Excel 文件，每个文件里头有一个表格里存有一个人的信息，要将这些文件里的信息全部对应地导入到汇总表里。

以前写的，也不给实际例子了，直接上代码，逻辑不复杂，看看就明白。记在这里备以后查。

## 代码

```vb
Sub ExportMyFile()
    Dim myPath, myFileName
    Dim myCurOpenWB As Workbook 'work工作簿
    Dim myCurOpenWS As Worksheet 'work工作表
    Dim myTotalWS As Worksheet '汇总工作表
    
    Dim myFolderName As String
    myFolderName = "六堰"
    
    Set myTotalWS = ThisWorkbook.Sheets("附件4")    '汇总到表名为附件4的表格里
    
    myPath = ThisWorkbook.Path & "/" & myFolderName & "/*.xls"
    myFileName = Dir(myPath)   '''''''''''''''''''''''''''''''''''
    'Dim iCounter As Integer
    'iCounter = 0
    
    '遍历指定目录下的文件并操作
    Do '''''''''''''''''''''''''''''''''''''
        Debug.Print myFileName
        
        Dim searchStr As String '通用搜索字符串
        Dim resStr As String '通用结果字符串
        Dim iCount As Integer '通用计数器
        
        myFileName = ThisWorkbook.Path & "/" & myFolderName & "/" & myFileName
        
        '打开指定目录里的一个*.xls文件
        'Debug.Print myFileName
        Set myCurOpenWB = Workbooks.Open(myFileName)
        Set myCurOpenWS = myCurOpenWB.Sheets("附件1")   '打开文件的sheet附件1里是分条数据
        
        '插入内容行
        Dim iC As Integer
        For iC = 0 To 3
            '插入内容行
            myTotalWS.Rows(6).Insert
            myTotalWS.Rows(6).RowHeight = 14.25
            myTotalWS.Range("B6:Q6").NumberFormat = "@"   '将它们的数字格式设置成文本
        Next
        
        '##################################复制数据过程######################################
        '序号 =Row()-5
        myTotalWS.Range("A6").Formula = "=INT(Row()/4)"
        
        '姓名   C4
        myTotalWS.Range("B6").Value = myCurOpenWS.Range("C4").Value

        '性别   F4
        myTotalWS.Range("C6").Value = myCurOpenWS.Range("F4").Value
        
        '出生年月   C6
        myTotalWS.Range("D6").Value = myCurOpenWS.Range("C6").Value
        
        '身份证 D8
        myTotalWS.Range("E6").Value = myCurOpenWS.Range("D8").Value
        
        '进厂劳动时间   B21-B25
        myTotalWS.Range("F6").Value = myCurOpenWS.Range("B21").Value
        myTotalWS.Range("F7").Value = myCurOpenWS.Range("B22").Value
        myTotalWS.Range("F8").Value = myCurOpenWS.Range("B23").Value
        myTotalWS.Range("F9").Value = myCurOpenWS.Range("B24").Value
        
        '离岗时间   B21-B25
        
        '劳动年限   I26
        myTotalWS.Range("H6").Value = myCurOpenWS.Range("I26").Value
        
        '原用工单位 D21-D25
        'myTotalWS.Range("I6").Value = myFolderName
        myTotalWS.Range("I6").Value = myCurOpenWS.Range("D21").Value
        myTotalWS.Range("I7").Value = myCurOpenWS.Range("D22").Value
        myTotalWS.Range("I8").Value = myCurOpenWS.Range("D23").Value
        myTotalWS.Range("I9").Value = myCurOpenWS.Range("D24").Value
        
        '用工类别   D26
        myTotalWS.Range("J6").Value = "家属工"
        
        '已享受保障 B28-B30
        searchStr = myCurOpenWS.Range("B28").Value
        resStr = ""
        iCount = 0
        If InStr(searchStr, "√") <> 0 Then
            resStr = resStr & "城市最低生活保障"
            iCount = iCount + 1
        End If
        searchStr = myCurOpenWS.Range("B29").Value
        If InStr(searchStr, "√") <> 0 Then
            If iCount <> 0 Then
                resStr = resStr & "、"
            End If
            resStr = resStr & "遗属生活困难补助"
            iCount = iCount + 1
        End If
        searchStr = myCurOpenWS.Range("B30").Value
        If InStr(searchStr, "√") <> 0 Then
            If iCount <> 0 Then
                resStr = resStr & "、"
            End If
            resStr = resStr & "供养亲属抚恤费"
        End If
        myTotalWS.Range("K6").Value = resStr
        
        '已参加社保 B32-B34
        searchStr = myCurOpenWS.Range("B32").Value
        resStr = ""
        iCount = 0
        If InStr(searchStr, "√") <> 0 Then
            resStr = resStr & "企业职工养老保险"
            iCount = iCount + 1
        End If
        searchStr = myCurOpenWS.Range("B33").Value
        If InStr(searchStr, "√") <> 0 Then
            If iCount <> 0 Then
                resStr = resStr & "、"
            End If
            resStr = resStr & "灵活就业人员养老保险"
            iCount = iCount + 1
        End If
        searchStr = myCurOpenWS.Range("B34").Value
        If InStr(searchStr, "√") <> 0 Then
            If iCount <> 0 Then
                resStr = resStr & "、"
            End If
            resStr = resStr & "城镇居民医疗保险"
        End If
        myTotalWS.Range("L6").Value = resStr
        
        '配偶姓名   C10
        myTotalWS.Range("M6").Value = myCurOpenWS.Range("C10").Value
        
        '配偶现所在单位
        myTotalWS.Range("N6").Value = "重型车厂"
        
        '配偶人员类别   C12
        'myTotalWS.Range("O6").Value = myCurOpenWS.Range("C12").Value
        searchStr = myCurOpenWS.Range("C12").Value
        If InStr(searchStr, "√去世") <> 0 Then
            myTotalWS.Range("O6").Value = "去世"
        ElseIf InStr(searchStr, "√离休") <> 0 Then
            myTotalWS.Range("O6").Value = "离休"
        ElseIf InStr(searchStr, "√退休") <> 0 Then
            myTotalWS.Range("O6").Value = "退休"
        ElseIf InStr(searchStr, "√退养") <> 0 Then
            myTotalWS.Range("O6").Value = "退养"
        Else
            myTotalWS.Range("O6").Value = "在职"
        End If
        

        '备注
        myTotalWS.Range("P6").Value = myFolderName
        
        '联系电话
        myTotalWS.Range("Q6").Value = myCurOpenWS.Range("H18").Value

        '################################复制数据过程结束#############################
        
        '关闭打开的文件
        myCurOpenWB.Close
                
        myFileName = Dir   ''''''''''''''''''''''''''''''
    '    iCounter = iCounter + 1
    Loop Until myFileName = "" '''''''''''''''''''''''''''''
    
End Sub
```
