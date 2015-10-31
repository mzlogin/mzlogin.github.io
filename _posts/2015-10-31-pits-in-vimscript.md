---
layout: post
title: Vimscript 中的坑
categories: Vim
description: Vimscript 的语法有些地方还是挺奇葩的，把一些容易写错的点记录下来备忘。
keywords: Vim, Vimscript
---

本文内容为学习 [「笨方法学 Vimscript」](http://learnvimscriptthehardway.onefloweroneworld.com) 过程中，觉得 Vimscript 语法中与所掌握的其它语言的定义有明显区别，需要特别记忆的内容。

1. 使用 `==` 进行字符串比较是否忽略大小写与用户的设置相关。

    比如 `&ignorecase` 为 1 时，`if "foo" == "FOO"` 结果为 True；而 `&ignorecase` 为 0 时，`if "foo" == "FOO"` 则为 False。

    **最佳实践**：总是使用 `==?` 与 `==#` 来指定忽略还是不忽略大小写。

2. 当字符串转换为整形时，以数字开头的字符串会转换为整数，非数字开头的将转换为 0。

    如：`10.10` 将被转换成 10。

3. 没有作用域限制的函数名必须以大写字母开头。

4. 传给函数的参数需要带作用域前缀才能使用。

    ```viml
    function FunA(name)
        echom 'Your name is '.a:name
    endfunction
    ```

5. `+` 不能用来连接字符串，它们将被转换为整形然后相加。

    如 `"1flower" + "1world"` 的结果为 2。

    所以有连接字符串需求使用连接符 `.` 吧，另外注意 `10.1 . "hello"` 会报错 `using Float as a String`，有这种需求的话写成 `"" . 10.1 . "hello"` 吧。

未完待续。
