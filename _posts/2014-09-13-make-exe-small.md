---
layout: post
title: 如何让你的EXE/DLL足够小
categories: Windows
---

为了节省大量用户下载占用的带宽，又不便使用P2P技术，需要做一个尽量小的独立EXE，这里是对如何让一个简单的EXE体积尽量小的部分方法与每一步的实际效果。

###初始DEMO
用VC++生成一个最简单的Win32 Console Application，调用少量简单的CRT函数，因为要独立EXE，所以使用/MT，示例代码部分如下，然后Release编译看看体积。

```c++
#include "stdafx.h"
#include <string.h>

int _tmain(int argc, _TCHAR* argv[])
{
	const char* pStr = "hello, world";
	char szArray[64] = {0};
	strcpy(szArray, pStr);

	return 0;
}
```

**现在大小是40960字节。**

###打开最小体积优化开关
Project - Property - C/C++ - Optimization 将 Optimization改为Minimize Size (/O1)，重新编译。

**现在大小是40960字节。**

可能是示例程序过于简单，所以此开关并没有产生实际的影响，但是在其它有需求的情况下是可以考虑使用它的，在复杂程序中开优化减小体积还是比较明显的，当然也要提防优化带来的问题。

###不生成调试信息
Project - Property - Linker - Debugging 关闭Generate Debug Info开关。

**现在大小是40960字节。**

我们可以看到程序大小也未产生变化。这个开关对Release文件体积影响较小，在文件较大时也只能压缩几KB的大小，而且要承担没有PDB后期调试困难的结果，不太建议使用。

###去掉CRT依赖
这至少需要处理如下几点：

1. 自己指定程序入口点
Project - Property - Linker - Anvanced在Entry Point那里填写你的新入口点函数，比如我写的是`NewEntry`，然后将main函数改成这个名字，比如`void NewEntry()`。
2. 自己实现用到的CRT函数
上面的程序里用到了`strcpy`，那么我们就自己来实现它，当然你用跟它相同的名字和声明实现一个函数是通不过编译的，VC会报错`error C2169: 'strcpy' : intrinsic function, cannot be defined`，要解决这个问题需要关掉一个开关：  
Project - Property - C/C++ - Optimization将Enable Intrinsic Functions设为No。

这样修改后的代码如下：

```c++
#include "stdafx.h"
//#include <string.h>

extern "C" char * __cdecl strcpy(char * dst, const char * src)
{
	char * cp = dst;

	while( *cp++ = *src++ )
		;               /* Copy src over dst */

	return( dst );
}

void NewEntry()
{
	const char* pStr = "hello, world";
	char szArray[64] = {0};
	strcpy(szArray, pStr);
}
```

**现在大小是3584字节。**

这是效果最明显，也是实现起来相对最难的一步，需要我们尽量调用Windows API而不是CRT函数去做一些事情，如果实在需要CRT函数的功能，那就自己写一份吧。这些在代码量大的情况下可能会是一个比较繁琐的过程。

###加壳压缩
使用比如UPX，ASPack等加壳工具对可执行程序进行压缩。

但是实际发现，在EXE文件特别小时，比如像上面已经精简到3584字节后，再使用ASPack工具压缩会反而令EXE文件更大。
