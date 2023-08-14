---
layout: fragment
title: Python基本语法
tags: [python]
description: Python基本语法
keywords: Python, Python grammar
---

## Python基本语法

Python 是一门易于学习的编程语言，以下是 Python 的基本语法：

### 1、打印输出：

使用 print() 函数可以将文本或变量的值打印到屏幕上。例如：
print("Hello, World!")

### 2、变量：

在 Python 中，可以使用变量来存储值。变量名可以是任何有效的标识符，例如：
message = "Hello, World!"
print(message)

### 3、数据类型：

Python 中有许多内置的数据类型，例如整数、浮点数、布尔值、字符串等等。可以使用 type() 函数来检查变量的数据类型。例如：
a = 123
b = 3.14
c = True
d = "Hello, World!"

print(type(a))
print(type(b))
print(type(c))
print(type(d))

### 4、运算符：

Python 中有许多运算符，包括算术运算符、比较运算符、逻辑运算符等等。例如：
a = 10
b = 3

print(a + b)  # 加法
print(a - b)  # 减法
print(a * b)  # 乘法
print(a / b)  # 除法
print(a % b)  # 取余
print(a ** b)  # 幂运算

print(a > b)  # 大于
print(a < b)  # 小于
print(a == b)  # 等于
print(a != b)  # 不等于

print(a and b)  # 逻辑与
print(a or b)  # 逻辑或
print(not a)  # 逻辑非

### 5、条件语句：

可以使用 if、elif 和 else 语句来进行条件判断。例如：
age = 18

if age < 18:
    print("未成年人")
elif age >= 18 and age < 60:
    print("成年人")
else:
    print("老年人")

### 6、循环语句：

可以使用 for 和 while 循环来对一段代码重复执行。例如：
for i in range(10):
    print(i)

i = 0
while i < 10:
    print(i)
    i += 1

这些是 Python 的基本语法，可以通过阅读教程、书籍或在线课程来深入学习。
