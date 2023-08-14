---
layout: fragment
title: Python的函数定义和调用方法
tags: [python]
description: Python的函数定义和调用方法
keywords: python
---

## Python的函数定义和调用方法

Python 是一门函数式编程语言，支持定义和调用函数。以下是 Python 的函数定义和调用方法：

### 1、函数定义：

使用 def 关键字来定义函数，语法如下：
def function_name(param1, param2, ...):
    statement_1
    statement_2
    …
    return result
其中，function_name 是函数的名称，param1、param2 等是函数的参数，语句块中的语句是函数的主体，return 语句用于返回函数的结果。例如：
def add(a, b):
    result = a + b
    return result

### 2、函数调用：

使用函数名和参数列表来调用函数，语法如下：
result = function_name(arg1, arg2, ...)
其中，function_name 是函数的名称，arg1、arg2 等是函数的实参，result 是函数的返回值。例如：
c = add(3, 5)
print(c)  # 输出 8

### 3、默认参数：

可以在函数定义时设置参数的默认值，这样在调用函数时如果不传递该参数，则使用默认值。例如：
def greet(name, message="Hello"):
    print(message + ", " +name + "!")

greet("Alice")  # 输出 "Hello, Alice!"
greet("Bob", "Hi")  # 输出 "Hi, Bob!"

### 4、可变参数：

在函数定义时可以使用 *args 和 **kwargs 来接收可变数量的参数。其中，*args 表示接收任意数量的位置参数，**kwargs 表示接收任意数量的关键字参数。例如：
def sum(*args):
    result = 0
    for arg in args:
        result += arg
    return result
print(sum(1, 2, 3))  # 输出 6
print(sum(1, 2, 3, 4, 5))  # 输出 15

### 5、匿名函数：

可以使用 lambda 表达式来创建匿名函数，语法如下：
function_name = lambda param1, param2, ... : expression
其中，function_name 是函数的名称（可以省略），param1、param2 等是函数的参数，expression 是函数的表达式。例如：
double = lambda x : x * 2
print(double(5))  # 输出 10

这些是 Python 的函数定义和调用方法，可以通过练习来深入学习。
