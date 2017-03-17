---
layout: post
title: C++ 中的#，##，和"
categories: CPlusPlus
description: 宏的常用用法。
keywords: 宏，C++
---

想要灵活应用宏，离不开`#`和`##`。

### "
在学习`#`和`##`之前，先来看一个关于`"`的例子：

```cpp
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

查看 PE 文件的常量字符串段，发现经过编译器优化后只存在一个`Hello,World!`串。

![img](/images/posts/cplusplus/staticstring_helloworld.png)

即 p1，p2，p3，p4 这四种写法是等价的，这一点作为之后解释`#`用法的前提。

### 字符串化操作 (#)
当用作字符串化操作时，`#`的主要作用是将宏参数不经扩展地转换成字符串常量。
**要点：**

-  宏定义参数的左右两边的空格会被忽略，参数的各个 Token 之间的多个空格会被转换成一个空格。
-  宏定义参数中含有需要特殊含义字符如`"`或`\`时，它们前面会自动被加上转义字符`\`。

还是通过 MSDN 上的例子来看看容易懂：

```cpp
#define F abc
#define B def
#define FB(arg) #arg
#define FB1(arg) FB(arg)

FB(F B)
FB1(F B)
```

初看到时推测这两行预编译出来后效果是一样的，但是看了使用 gcc -E 编译出来代码，这才理解了 MSDN 上对「不经扩展」有了更深刻的理解，实际的预编译后代码为：

```
"F B";
"abc def";
```

推测变换过程应该如下：

```
FB(F B) --> #F B -->"F B"
FB1(F B) --> FB1(abc def) --> FB(abc def) --> #abc def --> "abc def"
```

### 标记连接操作 (##)
将多个 Token 连接成一个 Token。
**要点：**

-  它不能是宏定义中的第一个或最后一个 Token。
-  前后的空格可有可无。

来理解一下 MSDN 上举的例子：

```cpp
#include <stdio.h>
#define paster( n ) printf_s( "token" #n " = %d", token##n )
int token9 = 9;

int main()
{
   paster(9);
}
```

`paster(9);`的预处理步骤应该如下：

-  `paster(9);`
-  `printf_s( "token" #9 " = %d", token##9 );`
-  `printf_s( "token" "9" " = %d", token9 );`
-  `printf_s( "token9 = %d", token9 );`

这样应该就很好理解了。

### 参考 MSDN

-  Stringizing Operator(#) : <http://msdn.microsoft.com/EN-US/library/7e3a913x(v=VS.110,d=hv.2).aspx>
-  Token-Pasting Operator(##) : <http://msdn.microsoft.com/EN-US/library/09dwwt6y(v=VS.110,d=hv.2).aspx>
