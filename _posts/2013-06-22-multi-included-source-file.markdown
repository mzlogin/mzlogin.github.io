---
layout: post
title: "文件被多个中间文件输出目录相同的工程包含"
date: 2013-06-22 12:59
comments: true
categories: cplusplus
---
### case:  
　　两个工程Proj1和Proj2，同时包含demo.cpp，其中Proj1在工程配置里预定义宏MACRO\_PROJ1，Proj2在工程配置里预定义宏MACRO\_PROJ2，两个工程的中间文件输出目录为同一个，文件demo.cpp内容如下：  
``` c++ demo.cpp
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
　　然后编译两工程生成Proj1.exe和Proj2.exe，期望的结果是Proj1.exe输出`output by proj1`，Proj2输出`output by proj2`，但是……意外发生了：  

　　*会发现一定的概率下，两个exe输出的内容相同，至于是`output by proj1`还是`output by proj2`则比较随机。*  

### analysis:  
　　在出问题的情况下，既然Proj1.exe和Proj2.exe输出一致，那么可以推测生成两个exe的源中间文件demo.obj是一样的，明明在两个工程里根据宏定义，预编译过后的源代码是不一样的，怎么会出现生成的obj文件一样的情况呢？联想到编译器的“懒惰”特性，推测出发生问题的情况如下：    

　　假设首先编译Proj1，那么预编译过后，源文件里生效的应该是`printf("output by proj1");`这一行，生成demo.obj，然后链接生成Proj1.exe；然后在编译Proj2时，编译器会先对比demo.cpp和demo.obj的时间戳，发现demo.obj的修改时间比较新，那么就不用重新编译，就将之前生成的demo.obj直接用于链接生成了Proj2.exe。  

### confirmation:  
　　更改Proj1与Proj2两个工程的中间文件输出目录为两个不同的目录，问题不再发生。    
　　*Done!*
