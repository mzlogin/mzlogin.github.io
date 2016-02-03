---
layout: post
title: Vimscript 中的坑
categories: Vim
description: Vimscript 的语法有些地方还是挺奇葩的，把一些容易写错的点记录下来备忘。
keywords: Vim, Vimscript
---

本文内容为学习 [「笨方法学 Vimscript」](http://learnvimscriptthehardway.onefloweroneworld.com) 过程中，觉得 Vimscript 语法中与所掌握的其它语言的定义有明显区别，需要特别记忆的内容。

1. 使用 `==` 进行字符串比较是否忽略大小写与用户的设置相关。

   比如

   ```vim
   "foo" == "FOO"
   ```

   在 `&ignorecase` 为 1 时，结果为 True；

   在 `&ignorecase` 为 0 时，结果为 False。

   **最佳实践**：总是使用 `==?` 与 `==#` 来指定忽略还是不忽略大小写。

2. 当字符串转换为整形时，以数字开头的字符串会转换为整数，非数字开头的将转换为 0。

   比如 `10.10` 将被转换成 10。

3. 没有作用域限制的函数名必须以大写字母开头。

4. 传给函数的参数需要带作用域前缀才能使用。

   ```vim
   function FunA(name)
       echom 'Your name is ' . a:name
   endfunction
   ```

5. `+` 不能用来连接字符串，它们将被转换为整形然后相加。

   比如 `"1flower" + "1world"` 的结果为 2。

   所以有连接字符串需求使用连接符 `.` 吧！另外注意

   ```vim
   10.1 . "hello"
   ```

   会报错 `using Float as a String`，有这种需求的话建议写成

   ```vim
   "" . 10.1 . "hello"
   ```

6. 列表和字符串的切片操作代表的下标区间是 `[m, n]`，而不是像 Python 那样是 `[m, n)`。

   比如

   ```vim
   ['a', 'b', 'c', 'd'][0:2]
   ```

   在 Python 里结果将为 `['a', 'b']`；

   而在 Vimscript 里结果将为 `['a', 'b', 'c']`。

7. 如果一个 Vimscript 变量要引用一个函数，即它的类型为 Funcref，它就要以大写字母开头；引用函数的列表的命名不受此限制。

   ```vim
   "let myFunc = function("len")
   let MyFunc = function("len")
   ```

   如果像注释掉的那行那么写会报错

   ```
   E704: Funcref variable name must start with a capital: myFunc
   ```
