---
layout: post
title: EXCEL常用操作
categories: Wiki
---

###查找
  1. FIND函数  
作用：  
用于在第二个文本串中定位第一个文本串，并返回第一个文本串的起始位置的值，该值从第二个文本串的第一个字符算起。  
  
语法：  
`FIND(find_text, within_text, [start_num])`  
  
示例：  
`=FIND("ha", B2)`  

###替换
  1. REPLACE函数  
作用：  
使用其它文本字符串并根据所指定的字符数替换某文本字符串中的部分文本。  
  
语法：  
`REPLACE(old_text, start_num, num_chars, new_text)`  
  
示例：  
`=REPLACE(B2, FIND("(", B2), FIND(")", B2) - FIND("(", B2) + 1, "")`  

  2. SUBSTITUTE函数  
作用：  
在文本字符串中用new_text替换old_text。如果需要在某一文本字符串中替换指定的文本，请使用函数SUBSTITUTE；如果需要在某一文本字符串中替换指定位置的任意文本，请使用函数REPLACE。  
  
语法：  
`SUBSTITUTE(text, old_text, new_text, [instance_num])`  
  
示例：  
`=SUBSTITUTE(B2, "helo", "hello")`  

###去掉单元格里的空格
