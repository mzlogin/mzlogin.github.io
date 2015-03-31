---
layout: post
title: Windows实现单实例进程的两种方法
categories: Windows
description: Windows实现单实例进程的两种方法：共享静态数据和Mutex。
keywords: Windows, Process
---

**方法一：共享静态数据。**

此方法参见《Windows核心编程》第5版17.1.2章节《在同一个可执行文件或DLL的多个实例间共享静态数据》。

示例代码：

```C++
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

**方法二：使用Mutex。**

理论上能用于进程间同步的内核对象比如事件和互斥量等都能用于实现此功能，要注意内核对象的命名要使用全局命名比如Global开头，此处使用互斥量Mutex举例。

示例代码：

```C++
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
