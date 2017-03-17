---
layout: post
title: 青蛙跳台阶的问题——Fibonacci
categories: Algorithm
description: 使用 Fibonacci 来解决青蛙跳台阶的问题。
keywords: 算法，Fibonacci
---

这几天正在复习算法，今天在看一篇文章时偶然看到这个题目，想了一下居然没什么思路……（抱歉，实在太菜。)，文章中提示了一个关键词：Fibonacci 数列。然后我又小百度了一下，找了一个具体分析实例，结合两处，这才理清了思路。（汗啊……基础全忘光了，这以后咋办啊……深感担忧……)

### 问题描述

一只青蛙一次可以跳上 1 级台阶，也可以跳上 2 级台阶，请问这只青蛙跳上 n 级的台阶总共有多少种跳法？

### 问题分析

设青蛙跳上 n 级台阶的跳法为 f(n) 种。

设 Fibonacci 数列的第 x 项值为 fibo(x)。

1. 当 n=1 时，f(n)=1=fibo(2)
2. 当 n=2 时，f(n)=2=fibo(3)
3. 当 n>2 时，分析可知，在跳上第 n 级台阶前一步，必然是在第 (n-1) 或 (n-2) 级台阶，故有 f(n) = f(n-1) + f(n-2); 依此类推……

则有：

<del>f(n)</del>  
<del>= f(n-1) + f(n-2)</del>  
<del>= 2f(n-2) + f(n-3)</del>  
<del>= 3f(n-3) + 2f(n-4)</del>  
<del>= 5 f(n-4) + 3f(n-5)</del>  
<del>= 8f(n-5) + 5f(n-6)</del>  
<del>= ...</del>  
<del>= fibo(x+1)f(n-x)+fibo(x)f(n-(x+1))</del>  
<del>=...</del>  
<del>= fibo(n-1)f(n-(n-2)) + fibo(n-2)f(n-(n-1))</del>  
<del>= fibo(n-1)f(2) + fibo(n-2)f(1)</del>  

f(n) 的规律符合 Fibonacci 数列的规律，它与 Fibonacci 的区别是 Fibonacci 的前两个元素是 1，1，而 f(n) 的规律是 1，2，即可知有 `f(n)=fibo(n+1)`。

### 简单的 C++ 实现

```cpp
#include <iostream>
using namespace std;

// 非递归写法
int fibo(int n)  // 获取 Fibonacci 数列的第 N 项值
{
    if(n == 1 || n == 2)
        return 1;
    else
    {
        int a = 1;
        int b = 1;
        int tmp;
        for(int i = 3; i <= n; ++ i)
        {
            tmp = a;
            a = b;
            b += tmp;
        }
        return b;
    }
}

//// 递归写法
//int fibo(int n)
//{
//    if(n == 1 || n == 2)
//        return 1;
//    else
//        return fibo(n-1) + fibo(n-2);
//}

int main()
{
    cout << "请输入楼梯的级数：";

    int n;
    cin >> n;

    int sum;

    //if(1==n)
    //    sum = 1;
    //else if (2==n)
    //    sum = 2;
    //else
    //{
    //    sum = 2 * fibo(n-1) + fibo(n-2);
    //}
    sum = fibo(n+1);

    cout << "共有 " << sum << " 种跳法。" << endl;

    return 0;
}
```
