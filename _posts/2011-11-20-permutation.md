---
layout: post
title: 简单的全排列算法实现 
categories: Algorithm
description: 一种使用递归思路实现的简易全排列算法。
keywords: 算法, 全排列, 递归
---

### 问题描述

实现一个简单的全排列算法，以整形数组{1,2,3,4,5}为例，假设元素无重复。
 
### 问题分析

如果用多层循环来实现，那么……有多少个元素将需要有多少层循环，这样作为实现一个算法的角度来看显然是不可取的。

以 a[] = {1,2,3,4,5}为例，它的全排列是

```
1　{2,3,4,5}的全排列
2  {1,3,4,5}的全排列
3  {1,2,4,5}的全排列
4  {1,2,3,5}的全排列
5  {1,2,3,4}的全排列
```

由子数组的全排列得到母数组的全排列结果，可以考虑用递归实现，具体可以设计为将 a 依次变换为

```
12345
21345
31245
41235
51234
```

然后分别求它们后四个元素的全排列，依此类推。
 
### 简单的 C++ 实现

```cpp
#include <iostream>
using namespace std;

static int n = 0;

void swapint(int *p, int *q)
{
    int tmp = *p;
    *p = *q;
    *q = tmp;
}

void fullarray(int a[], 
        int iLen,   // 数组长度
        int iStart) // 开始下标
{
    if (iLen == iStart)
    {
        for (int i = 0; i < iLen; ++i)
        {
            cout << a[i] << " ";
        }
        cout << "\n";
        n++;
    }
    else
    {
        for(int j = iStart; j < iLen; ++j)
        {
            swapint(&a[iStart], &a[j]);
            fullarray(a, iLen, iStart + 1);
            swapint(&a[iStart], &a[j]);
        }
    }
}

int main()
{
    int a[] = {1,2,3,4,5};
    fullarray(a, sizeof(a)/sizeof(int), 0);
    cout << "总共" << n << "种" << endl;

    return 0;
}
```
 
参考：<http://www.cnblogs.com/nokiaguy/archive/2008/05/11/1191914.html>
