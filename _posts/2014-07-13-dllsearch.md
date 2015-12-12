---
layout: post
title: 默认的 DLL 搜索路径优先级
categories: Windows
description: Windows 上 EXE 加载 DLL 时的搜索路径与顺序。
keywords: Dll, Windows
---

### 结论

在默认情况下，Windows 加载程序在用户磁盘上搜索 DLL 的搜索顺序：

1. 包含可执行文件的目录。
2. Windows 的系统目录，该目录可以通过 GetSystemDirectory 得到，一般为 System32 目录，若为 32 位程序跑在 64 位系统下，则为 SysWOW64 目录。
3. 16 位的系统目录，即 Windows 目录中的 System 目录。
4. Windows 目录，该目录可以通过 GetWindowsDirectory 得到。
5. 进程的当前目录。
6. PATH 环境变量中所列出的目录。

如果调用 LoadLibrary 时传入的是绝对路径，那么加载程序将只尝试从该绝对路径搜索 DLL。

### 附注

以上结论在「Windows 核心编程」中列出，书中指出：

> 注意，对应用程序当前目录的搜索位于 Windows 目录之后，这个改变始于 Windows XP SP2，其目的是防止加载程序在应用程序的当前目录中找到伪造的系统 DLL 并将它们载入，从而保证系统 DLL 始终都是从它们在 Windows 目录的正式位置载入的。

我对这个说法持保留意见，因为在我的验证中，在一个 Windows XP SP1 的环境中已经应用了此搜索顺序。

另外，有一些其它方法可以改变加载程序的搜索顺序，已知的有：

1. SetDllDirectory 函数。如果传入一个有效路径，那么它将被插入在默认顺序的 1 与 2 之间。
2. HKEY\_LOCAL\_MACHINES\SYSTEM\CurrentControlSet\Control\Session Manager 下的 SafeDllSearchMode 键值。
3. 调用 LoadLibraryEx 函数时使用 LOAD\_WITH\_ALTERED\_SEARCH\_PATH 等标志。

### 验证

证明代码片段：

```c
#include <Windows.h>
#include <stdio.h>

BOOL WINAPI DllMain(HINSTANCE hinstDLL, DWORD fdwReason, LPVOID lpvReserved)
{
    switch (fdwReason)
    {
    case DLL_PROCESS_ATTACH:
        {
            char szPath[MAX_PATH] = {0};
            GetModuleFileName(hinstDLL, szPath, MAX_PATH);
            printf("lib.dll is in %s\n", szPath);
        }
        break;

    case DLL_THREAD_ATTACH:
        break;

    case DLL_THREAD_DETACH:
        break;

    case DLL_PROCESS_DETACH:
        break;
    }

    return (TRUE);
}
```

用如下命令行生成 lib.dll 文件：

`gcc lib.c -shared -o lib.dll`

加载 lib.dll 的程序：

```c
#include <Windows.h>

int main()
{
    SetCurrentDirectory("D:\\test");
    HMODULE hDll = (HMODULE)LoadLibrary("lib.dll");
    if (hDll)
    {
        FreeLibrary(hDll);
    }

    return 0;
}
```

用如下命令行生成 test.exe 程序：

`gcc test.c -o test.exe`

测试方法：

1. 在结论中提及的所有路径中各放置一份 lib.dll 文件。
2. 运行 test.exe，可以看到控制台输出加载的 lib.dll 文件的路径。
3. 把本次 test.exe 加载到的 lib.dll 文件删掉。
4. 重复 2-3 步骤。
