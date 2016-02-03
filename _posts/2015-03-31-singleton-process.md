---
layout: post
title: Windows 实现单实例进程的两种方法
categories: Windows
description: Windows 实现单实例进程的两种方法：共享静态数据和 Mutex。
keywords: Windows, Process
---

**方法一：共享静态数据。**

此方法参见《Windows 核心编程》第 5 版 17.1.2 章节《在同一个可执行文件或 DLL 的多个实例间共享静态数据》。

实现原理：

创建一个自己命名的段，将其属性改为 READ\|WRITE\|SHARED，其中 SHARED 属性表示该段的内容为多个实例所共享（实际上关闭了写时复制机制），将变量放在该段内若值被改变，多个实例间都会受到改变的影响。

注意点：

* 最好使用 volatile 修饰变量。
* 对变量的增减推荐使用原子操作函数 InterlockedExchangedAdd。
* g\_lInstances 的值在第一个实例运行时总为 0，其它实例中取到的值以先于它运行的实例中改变后的值为准。

示例代码：

```cpp
#include <Windows.h>

#pragma data_seg("Shared")
volatile long g_lInstances = 0;
#pragma data_seg()

#pragma comment(linker, "/Section:Shared,RWS")

int main(int argc, char *argv[])
{
    if (g_lInstances != 0)
    {
        return -1;
    }

    InterlockedExchangeAdd(&g_lInstances, 1);

    // do something here
    // ...

    InterlockedExchangeAdd(&g_lInstances, -1);

    return 0;
}
```

**方法二：使用 Mutex。**

理论上能用于进程间同步的内核对象比如事件和互斥量等都能用于实现此功能，此处使用互斥量 Mutex 举例。

实现原理：

使用操作系统范围内可见的命名内核对象，不同实例间检测同一个内核对象的状态来判断是否为当前唯一实例。

注意点：

* 内核对象要使用全局命名，比如此处使用 Global 开头。

示例代码：

```cpp
#include <Windows.h>

int main(int argc, char *argv[])
{
    HANDLE hMutex = NULL;

    do
    {
        hMutex = CreateMutex(NULL, FALSE, "Global\\73E21C80-1960-472F-BF0B-3EE7CC7AF17E");

        DWORD dwError = GetLastError();

        if (ERROR_ALREADY_EXISTS == dwError || ERROR_ACCESS_DENIED == dwError)
        {
            break;
        }

        // do something here
        // ...

    } while (false);

    if (NULL != hMutex)
    {
        CloseHandle(hMutex);
    }

    return 0;
}
```
