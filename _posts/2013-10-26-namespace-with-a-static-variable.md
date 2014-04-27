---
layout: post
title: 有static变量的namespace被多个cpp包含
categories: cplusplus
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
将header.h里的var的static去掉，发现编译通过，但是链接时提示：  
`main.obj : error LNK2005: "int NS1::var" (?var@NS1@@3HA) 已经在 src.obj 中定义，fatal error LNK1169: 找到一个或多个多重定义的符号。`  
    
  
**Situation B:**  
还原static，编译通过，运行生成的EXE，输出：`10 10` 与预期的`10 0`不符。  
  
根据static对变量的作用域的影响，推断应该是预编译过程中NS1::var分别被引入了src.cpp和main.cpp，而在两个源文件中的NS1::var非同一个变量，而且其作用域分别为各自所在的cpp文件。  
  
**求证:**  
将两个cpp文件中的printf语句都改为
    
```cpp
printf("%d address is : 0x%X\n", NS1::var, &NS1::var);
```
输出为：  
    
```
10 address is : 0x3C8004
10 address is : 0x3C8000  
```
可见两个源文件中的var非同一个。
