---
layout: post
title: 获取运行过程中改名的文件的路径
categories: Windows
---

###需求
一个EXE在运行过程中（被）改名了，需要准确地获取它的文件名。

###尝试
原本以为这是一个非常简单的CASE，直接用GetModuleFileName不就行了吗？结果还真不如我所想。无论程序运行过程中被改名成什么样子，GetModuleFileName返回的都是EXE开始运行时的名字。然后又依次尝试了GetProcessImageFileName，也是如此。直到最后找到了QueryFullProcessImageName。

###示例代码

```C++
#include <Windows.h>
#include <Psapi.h>
#include <stdio.h>

#pragma comment(lib, "Psapi.lib")

void OutputSelfpath()
{
	char szFile[MAX_PATH] = {0};
	GetModuleFileName(NULL, szFile, MAX_PATH);
	printf("GetModuleFileName:\n\r%s\n\n", szFile);

	memset(szFile, 0, MAX_PATH);

	HANDLE hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, GetCurrentProcessId());
	if (!hProcess)
	{
		printf("OpenProcess failed!\n");
	}
	else
	{
		DWORD dwRet = GetProcessImageFileName(hProcess, szFile, MAX_PATH);
		if (dwRet)
		{
			printf("GetProcessImageFileName:\n\r%s\n\n", szFile);
		}
		else
		{
			printf("GetProcessImageFileName failed!\n");
		}

		DWORD dwSize = MAX_PATH;
		if (QueryFullProcessImageName(hProcess, 0, szFile, &dwSize))
		{
			printf("QueryFullProcessImageName:\n\r%s\n\n", szFile);
		}
		else
		{
			printf("QueryFullProcessImageName failed\n", szFile);
		}
	}
}

int main()
{
	const char* pszFile = "ConsoleTest.exe";
	const char* pszNewFile = "ConsoleTest_bak.exe";
	remove(pszNewFile);

	OutputSelfpath();
	
	int nRet = rename(pszFile, pszNewFile);

	if (0 != nRet)
	{
		printf("rename file failed!\n");
	}
	else
	{
		OutputSelfpath();
	}

	system("pause");
	return 0;
}
```

###运行结果
![QueryFullProcessImageName](/images/posts/windows/queryfullprocessimagename.png)
