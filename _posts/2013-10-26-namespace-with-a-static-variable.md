---
layout: post
title: 有 static 变量的 namespace 被多个 cpp 包含
categories: CPlusPlus
description: 如果一个头文件里定义的 namespace 里有 static 变量，而这个头文件被多个 cpp 文件包含，会导致什么问题呢？
keywords: C++
---

**有如下三个文件**
*header.h*

```cpp
#pragma once
namespace NS1
{
	static int var = 10;
}
void print_var();
```

*src.cpp*

```cpp
#include <stdio.h>
#include "header.h"

void print_var()
{
	printf("%d\n", NS1::var);
}
```

*main.cpp*

```cpp
#include <stdio.h>
#include "header.h"

int main()
{
	printf("%d\n", NS1::var);
	NS1::var = 0;
	print_var();
	return 0;
}
```

这三个文件是尝试的基础。

**Situation A:**
将 header.h 里的 var 的 static 去掉，发现编译通过，但是链接时提示：
`main.obj : error LNK2005: "int NS1::var" (?var@NS1@@3HA) 已经在 src.obj 中定义，fatal error LNK1169: 找到一个或多个多重定义的符号。`


**Situation B:**
还原 static，编译通过，运行生成的 EXE，输出：`10 10` 与预期的`10 0`不符。

根据 static 对变量的作用域的影响，推断应该是预编译过程中 NS1::var 分别被引入了 src.cpp 和 main.cpp，而在两个源文件中的 NS1::var 非同一个变量，而且其作用域分别为各自所在的 cpp 文件。

**求证：**
将两个 cpp 文件中的 printf 语句都改为

```cpp
printf("%d address is : 0x%X\n", NS1::var, &NS1::var);
```
输出为：

```
10 address is : 0x3C8004
10 address is : 0x3C8000
```
可见两个源文件中的 var 非同一个。
