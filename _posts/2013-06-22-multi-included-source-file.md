---
layout: post
title: 文件被多个中间文件输出目录相同的工程包含
categories: CPlusPlus
description: 当一个文件被多个工程包含，并且这几个工程的中间文件输出目录相同时会出现问题。
keywords: C++
---

### case

两个工程 Proj1 和 Proj2，同时包含 demo.cpp，其中 Proj1 在工程配置里预定义宏 MACRO\_PROJ1，Proj2 在工程配置里预定义宏 MACRO\_PROJ2，两个工程的中间文件输出目录为同一个，文件 demo.cpp 内容如下：

```cpp
#include <stdio.h>

int main()
{
#ifdef MACRO_PROJ1
    printf("output by proj1");
#elif defined MACRO_PROJ2
    printf("output by proj2");
#endif
    return 0;
}
```

然后编译两工程生成 Proj1.exe 和 Proj2.exe，期望的结果是 Proj1.exe 输出`output by proj1`，Proj2 输出`output by proj2`，但是……意外发生了：

*会发现一定的概率下，两个 exe 输出的内容相同，至于是`output by proj1`还是`output by proj2`则比较随机。*

### analysis

在出问题的情况下，既然 Proj1.exe 和 Proj2.exe 输出一致，那么可以推测生成两个 exe 的源中间文件 demo.obj 是一样的，明明在两个工程里根据宏定义，预编译过后的源代码是不一样的，怎么会出现生成的 obj 文件一样的情况呢？联想到编译器的「懒惰」特性，推测出发生问题的情况如下：

假设首先编译 Proj1，那么预编译过后，源文件里生效的应该是`printf("output by proj1");`这一行，生成 demo.obj，然后链接生成 Proj1.exe；然后在编译 Proj2 时，编译器会先对比 demo.cpp 和 demo.obj 的时间戳，发现 demo.obj 的修改时间比较新，那么就不用重新编译，就将之前生成的 demo.obj 直接用于链接生成了 Proj2.exe。

### confirmation

更改 Proj1 与 Proj2 两个工程的中间文件输出目录为两个不同的目录，问题不再发生。
*Done!*
