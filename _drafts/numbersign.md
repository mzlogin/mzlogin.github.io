---
layout: post
title: C++中的#，##，和"
categories: cplusplus
---

想要灵活应用宏，离不开`#`和`##`。

###"
在学习`#`和`##`之前，先来看一个关于`"`的例子：

```c++
#include <stdio.h>
#include <string.h>

int main()
{
    const char* p1 = "Hello," "World!";     // 一个空格
    const char* p2 = "Hello,"    "World!";  // 多个空格
    const char* p3 = "Hello,""World!";      // 没有空格
    const char* p4 = "Hello,World!";        // 一个整串
    const char* p5 = "Nihao,""Shijie!";  // 一个不同的串

    printf("p1 = %s, strlen(p1) = %d\n", p1, strlen(p1));
    printf("p2 = %s, strlen(p2) = %d\n", p2, strlen(p2));
    printf("p3 = %s, strlen(p3) = %d\n", p3, strlen(p3));
    printf("p4 = %s, strlen(p4) = %d\n", p4, strlen(p4));
    printf("p5 = %s, strlen(p5) = %d\n", p5, strlen(p5));

    return 0;
}
```

输出为：

```
p1 = Hello,World!, strlen(p1) = 12
p2 = Hello,World!, strlen(p2) = 12
p3 = Hello,World!, strlen(p3) = 12
p4 = Hello,World!, strlen(p4) = 12
p5 = Nihao,Shijie!, strlen(p5) = 13
```

查看PE文件的常量字符串段，发现经过编译器优化后只存在一个`Hello,World!`串。  
![img](/images/posts/cplusplus/staticstring_helloworld.png)

即p1，p2，p3，p4这四种写法是等价的，这一点作为之后解释`#`用法的前提。
