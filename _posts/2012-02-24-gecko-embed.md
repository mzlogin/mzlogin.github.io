---
layout: post
title: 将 Mozilla 源码里的 winEmbed 工程移植到 VC
categories: Gecko
description: Mozilla 源码里有一个简单的内嵌 Gecko 的示例工程 winEmbed，但是无法直接在 VC 中使用，这是将它移植到 VC 中的方法。
keywords: winEmbed, Mozilla
---

最近在学习怎么将 Gecko 嵌入到自己的应用程序中，下载了一份比较早一点的源码在对照官方文档痛苦地推进——网上相关资料确实相当缺乏，难道大家都各种 webkit 去了？我的计划是先弄清怎么用，让程序跑起来，然后再根据官方文档结构说明去定制，削减掉不需要的部分，折腾这个移植就花了我不少时间，果断觉得应该跟大家分享之。废话不说,直接上过程。

### 下载xulrunner源码并编译。

我这里用的 1.9.2rc1 版本，对应 firefox 3.6.X。

源码下载地址：<ftp://ftp.mozilla.org/pub/mozilla.org/xulrunner/releases/1.9.2rc1/source/>

编译环境 mozilla-build 下载地址：<http://ftp.mozilla.org/pub/mozilla.org/mozilla/libraries/win32/MozillaBuildSetup-1.3.exe>

在解压的源码根目录内新建一个 `.mozconfig` 文件，我使用的内容是（其中有用的就是组建目标是 xulrunner，启动 tests 以生成示例程序）：
 
```makefile
mk_add_options MOZ_CO_PROJECT=xulrunner
mk_add_options MOZ_OBJDIR=@TOPSRCDIR@/obj-xulrunner
ac_add_options --enable-application=xulrunner
#Uncomment the following line if you don't want to build JavaXPCOM:
ac_add_options --disable-javaxpcom
ac_add_options --disable-optimize
ac_add_options --enable-debug
ac_add_options --disable-vista-sdk-requirements
ac_add_options --with-windows-version=600
ac_add_options --enable-tests
```

运行 mozilla-build 1.3 中的 start-msvc9.bat（因为我使用的是 Visual Studio 2008），切换到源码根目录下，运行 `./configure`，然后 `make`。等待几个小时（我的是用了四个小时左右）就 OK 了。

### 注册GRE（Gecko运行时环境）。

在经过上面第一步的编译后，会在源码根目录下生成名为 dist 的文件夹。`源码根/dist/bin/` 目录下现在有 xulrunner.exe 等程序，在 cmd 下运行 `xulrunner.exe --register-global` 注册 GRE。这时候实际上就可以跑 `源码根/embedding/tests/winEmbed/winEmbed.exe` 程序了，但是我们的目的是在 VC 下自己的工程里嵌入 Gecko，所以需要尝试将这个示例工程 winEmbed 移植到 VC 中。

### 重点来了，将winEmbed移植到VC中。

（1）新建工程 `MozillaDemo`，将 winEmbed 文件夹下的 resource.h、SMALL.ICO、WebBrowserChrome.cpp、WebBrowserChrome.h、WindowCreator.cpp、WindowCreator.h、winEmbed.cpp、winEmbed.h、winEmbed.ICO、winEmbed.rc 引入工程。编译之，你会发现 N 多错误……

（2）在 VC++ 目录中，include 里加入 `源码根/dist/include`，Library 里加入 `源码根/dist/lib`，bin 里加入 `源码根/dist/bin`。

（3）修改一些编译选项。如在预编译选项里添加 XPCOM\_GLUE，XP\_WIN，\_CRT\_SECURE\_NO\_WARNINGS。将 Project->Propeties->Configuration Properties->C/C++->Language 下的 Treat wchar\_t as Built-in Type 设为 No (/Zc:wchar\_t-)，在引入库里添加 xpcomglue.lib。总之让编译命令行看起来像下面这样（具体为何后面解释）：

从项目属性的 C/C++ 里看到的编译命令行：
 
```
/O2 /Oi /GL /D "WIN32" /D "NDEBUG" /D "_WINDOWS" /D "XPCOM_GLUE" /D "XP_WIN" /D "_CRT_SECURE_NO_WARNINGS" /D "_MBCS" /FD /EHsc /MD /Gy /Zc:wchar_t- /Fo"Release\\" /Fd"Release\vc90.pdb" /W3 /nologo /c /Zi /TP /errorReport:prompt 
```

从项目属性的 Linker 里看到的链接命令行：

```
/OUT:"E:\MZ_Test_Code\MozillaDemo\Release\MozillaDemo.exe" /INCREMENTAL:NO /NOLOGO /MANIFEST /MANIFESTFILE:"Release\MozillaDemo.exe.intermediate.manifest" /MANIFESTUAC:"level='asInvoker' uiAccess='false'" /DEBUG /PDB:"e:\MZ_Test_Code\MozillaDemo\Release\MozillaDemo.pdb" /OPT:REF /OPT:ICF /LTCG /DYNAMICBASE /NXCOMPAT /MACHINE:X86 /ERRORREPORT:PROMPT xpcomglue.lib  kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib
```

（4）在 winEmbed.cpp 文件里添加一句

```cpp
#pragma comment(lib, "D:/1.9.2rc1/xulrunner-1.9.2rc1.source/mozilla-1.9.2/profile/dirserviceprovider/standalone/profdirserviceprovidersa_s.lib")
```

大功告成，编译成功 0 warning, 0 error。此时的程序也可以在别的机子上运行，但是需要将 xulrunner.exe 及其依赖文件拷到别的机子上并注册 GRE。

程序运行示意图：

<img src="/images/posts/gecko/gecko_embed.gif" width="80%" alt="gecko embed program run demo" />

在自己编译的 xulrunner 环境下跑会产生下面两类错误，先忽略之让程序跑起来。（用官方提供的 xulrunner-sdk 里的程序来注册 GRE 并运行程序无报错）

<img src="/images/posts/gecko/gecko_embed_err1.gif" width="80%" alt="gecko embed program run error 1" />

<img src="/images/posts/gecko/gecko_embed_err2.gif" width="80%" alt="gecko embed program run error 2" />
 
至于为什么要做（3）和（4），且听我慢慢道来。

1. 为什么要添加预编译选项 XPCOM_GLUE

   在原版的 winEmbed 目录下，有 makefile 文件，里面有DEFINES += -DXPCOM_GLUE这么一句。

2. 为什么要添加预编译选项 XP_WIN

   在 winEmbed/makefile 文件里，有 include $(DEPTH)/config/autoconf.mk 这么一句，而在这个 autoconf.mk 里可以看到一大串的预编译选项，我试了多番才得出这个非加不可的结论……（试！！！冏！）

3. 为什么要添加引入库 xpcomglue.lib，为什么要有（4）步骤

   在 winEmbed/makefile 文件里，有

   ```
   LIBS = \
   $(DEPTH)/profile/dirserviceprovider/standalone/$(LIB_PREFIX)profdirserviceprovidersa_s.$(LIB_SUFFIX) \
   $(XPCOM_STANDALONE_GLUE_LDOPTS) \
   $(NULL)
   ```

   这么一段，很显然提示我们引入库 profdirserviceprovidersa_s，然后在 autoconf.mk 文件里可以看到 XPCOM_STANDALONE_GLUE_LDOPTS = $(LIBXUL_DIST)/lib/$(LIB_PREFIX)xpcomglue.$(LIB_SUFFIX) 这么一个定义，所以也需要引入库 xpcomglue。

4. 为什么要将 Project->Propeties->Configuration Properties->C/C++->Language 下的 Treat wchar_t as Built-in Type 设为 No (/Zc:wchar_t-)

   很简单，因为编译报错提示呗……

   不执行这些操作将产生的错误：

   不将 Project->Propeties->Configuration Properties->C/C++->Language 下的 Treat wchar_t as Built-in Type 设为 No (/Zc:wchar_t-) 将报错

   ```
   WebBrowserChrome.obj : error LNK2001: unresolved external symbol "public: wchar_t const * __thiscall nsAString::BeginReading(void)const " (?BeginReading@nsAString@@QBEPB_WXZ)
   ```

   拿掉预编译选项 `XP_WIN` 会产生错误

   ```
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol "public: void __thiscall nsCOMPtr_base::assign_from_helper(class nsCOMPtr_helper const &,struct nsID const &)" (?assign_from_helper@nsCOMPtr_base@@QAEXABVnsCOMPtr_helper@@ABUnsID@@@Z)
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol "public: void __thiscall nsCOMPtr_base::assign_from_qi(class nsQueryInterface,struct nsID const &)" (?assign_from_qi@nsCOMPtr_base@@QAEXVnsQueryInterface@@ABUnsID@@@Z)
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol "public: void __thiscall nsCOMPtr_base::assign_with_AddRef(class nsISupports *)" (?assign_with_AddRef@nsCOMPtr_base@@QAEXPAVnsISupports@@@Z)
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol "public: virtual unsigned int __thiscall nsCreateInstanceByContractID::operator()(struct nsID const &,void * *)const " (??RnsCreateInstanceByContractID@@UBEIABUnsID@@PAPAX@Z)
   1>WindowCreator.obj : error LNK2001: unresolved external symbol "unsigned int __cdecl NS_TableDrivenQI(void *,struct QITableEntry const *,struct nsID const &,void * *)" (?NS_TableDrivenQI@@YAIPAXPBUQITableEntry@@ABUnsID@@PAPAX@Z)
   1>winEmbed.obj : error LNK2001: unresolved external symbol "public: void __thiscall nsCOMPtr_base::assign_from_gs_contractid_with_error(class nsGetServiceByContractIDWithError const &,struct nsID const &)" (?assign_from_gs_contractid_with_error@nsCOMPtr_base@@QAEXABVnsGetServiceByContractIDWithError@@ABUnsID@@@Z)
   1>winEmbed.obj : error LNK2001: unresolved external symbol "public: void __thiscall nsCOMPtr_base::assign_from_gs_contractid(class nsGetServiceByContractID,struct nsID const &)" (?assign_from_gs_contractid@nsCOMPtr_base@@QAEXVnsGetServiceByContractID@@ABUnsID@@@Z)
   1>winEmbed.obj : error LNK2001: unresolved external symbol "public: virtual unsigned int __thiscall nsGetInterface::operator()(struct nsID const &,void * *)const " (??RnsGetInterface@@UBEIABUnsID@@PAPAX@Z)
   ```

   拿掉预编译选项 `XPCOM_GLUE` 会产生错误

   ```
   1>.\winEmbed.cpp(48) : error C2146: syntax error : missing ';' before identifier 'XRE_InitEmbedding'
   1>.\winEmbed.cpp(48) : error C4430: missing type specifier - int assumed. Note: C++ does not support default-int
   1>.\winEmbed.cpp(48) : error C4430: missing type specifier - int assumed. Note: C++ does not support default-int
   1>.\winEmbed.cpp(48) : error C2365: 'XRE_InitEmbedding' : redefinition; previous definition was 'function'
   1>        D:\1.9.2rc1\xulrunner-1.9.2rc1.source\mozilla-1.9.2\dist\include\nsXULAppAPI.h(355) : see declaration of 'XRE_InitEmbedding'
   1>.\winEmbed.cpp(49) : error C2146: syntax error : missing ';' before identifier 'XRE_TermEmbedding'
   1>.\winEmbed.cpp(49) : error C4430: missing type specifier - int assumed. Note: C++ does not support default-int
   1>.\winEmbed.cpp(49) : error C4430: missing type specifier - int assumed. Note: C++ does not support default-int
   1>.\winEmbed.cpp(49) : error C2365: 'XRE_TermEmbedding' : redefinition; previous definition was 'function'
   1>        D:\1.9.2rc1\xulrunner-1.9.2rc1.source\mozilla-1.9.2\dist\include\nsXULAppAPI.h(390) : see declaration of 'XRE_TermEmbedding'
   1>.\winEmbed.cpp(191) : error C3861: 'XPCOMGlueStartup': identifier not found
   1>.\winEmbed.cpp(209) : error C2659: '=' : function as left operand
   1>.\winEmbed.cpp(209) : error C2146: syntax error : missing ';' before identifier 'GetProcAddress'
   1>.\winEmbed.cpp(210) : warning C4551: function call missing argument list
   1>.\winEmbed.cpp(216) : error C2659: '=' : function as left operand
   1>.\winEmbed.cpp(216) : error C2146: syntax error : missing ';' before identifier 'GetProcAddress'
   ```

   拿掉引入库 `xpcomglue.lib` 会产生错误 

   ```
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol _NS_StringContainerFinish
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol _NS_StringContainerFinish
   1>profdirserviceprovidersa_s.lib(nsProfileLock.obj) : error LNK2001: unresolved external symbol _NS_StringContainerFinish
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol _NS_CStringCopy
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol "public: unsigned short const * __thiscall nsAString::BeginReading(void)const " (?BeginReading@nsAString@@QBEPBGXZ)
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol "public: unsigned short const * __thiscall nsAString::BeginReading(void)const " (?BeginReading@nsAString@@QBEPBGXZ)
   1>profdirserviceprovidersa_s.lib(nsProfileLock.obj) : error LNK2001: unresolved external symbol "public: unsigned short const * __thiscall nsAString::BeginReading(void)const " (?BeginReading@nsAString@@QBEPBGXZ)
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol _NS_StringContainerInit
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol _NS_StringContainerInit
   1>profdirserviceprovidersa_s.lib(nsProfileLock.obj) : error LNK2001: unresolved external symbol _NS_StringContainerInit
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol _NS_CStringSetDataRange
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol _NS_CStringToUTF16
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol _NS_CStringSetData
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol "public: void __fastcall nsCOMPtr_base::assign_from_helper(class nsCOMPtr_helper const &,struct nsID const &)" (?assign_from_helper@nsCOMPtr_base@@QAIXABVnsCOMPtr_helper@@ABUnsID@@@Z)
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol "public: void __fastcall nsCOMPtr_base::assign_from_qi(class nsQueryInterface,struct nsID const &)" (?assign_from_qi@nsCOMPtr_base@@QAIXVnsQueryInterface@@ABUnsID@@@Z)
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol "public: void __fastcall nsCOMPtr_base::assign_with_AddRef(class nsISupports *)" (?assign_with_AddRef@nsCOMPtr_base@@QAIXPAVnsISupports@@@Z)
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol "public: __thiscall nsCOMPtr_base::~nsCOMPtr_base(void)" (??1nsCOMPtr_base@@QAE@XZ)
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol _NS_CStringContainerInit
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol _NS_CStringContainerInit
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol _NS_CStringContainerFinish
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol _NS_CStringContainerFinish
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol "public: virtual unsigned int __fastcall nsCreateInstanceByContractID::operator()(struct nsID const &,void * *)const " (??RnsCreateInstanceByContractID@@UBIIABUnsID@@PAPAX@Z)
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol _NS_CStringGetData
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol "protected: void __thiscall nsSupportsWeakReference::ClearWeakReferences(void)" (?ClearWeakReferences@nsSupportsWeakReference@@IAEXXZ)
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol "public: virtual unsigned int __stdcall nsSupportsWeakReference::GetWeakReference(class nsIWeakReference * *)" (?GetWeakReference@nsSupportsWeakReference@@UAGIPAPAVnsIWeakReference@@@Z)
   1>WebBrowserChrome.obj : error LNK2001: unresolved external symbol "class nsIWeakReference * __cdecl NS_GetWeakReference(class nsISupports *,unsigned int *)" (?NS_GetWeakReference@@YAPAVnsIWeakReference@@PAVnsISupports@@PAI@Z)
   1>WindowCreator.obj : error LNK2001: unresolved external symbol "unsigned int __fastcall NS_TableDrivenQI(void *,struct QITableEntry const *,struct nsID const &,void * *)" (?NS_TableDrivenQI@@YIIPAXPBUQITableEntry@@ABUnsID@@PAPAX@Z)
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol "unsigned int __fastcall NS_TableDrivenQI(void *,struct QITableEntry const *,struct nsID const &,void * *)" (?NS_TableDrivenQI@@YIIPAXPBUQITableEntry@@ABUnsID@@PAPAX@Z)
   1>winEmbed.obj : error LNK2001: unresolved external symbol "public: char const * __thiscall nsACString::BeginReading(void)const " (?BeginReading@nsACString@@QBEPBDXZ)
   1>winEmbed.obj : error LNK2001: unresolved external symbol _GRE_GetGREPathWithProperties
   1>winEmbed.obj : error LNK2001: unresolved external symbol _NS_NewNativeLocalFile
   1>winEmbed.obj : error LNK2001: unresolved external symbol "public: void __fastcall nsCOMPtr_base::assign_from_gs_contractid_with_error(class nsGetServiceByContractIDWithError const &,struct nsID const &)" (?assign_from_gs_contractid_with_error@nsCOMPtr_base@@QAIXABVnsGetServiceByContractIDWithError@@ABUnsID@@@Z)
   1>winEmbed.obj : error LNK2001: unresolved external symbol "public: void __fastcall nsCOMPtr_base::assign_from_gs_contractid(class nsGetServiceByContractID,struct nsID const &)" (?assign_from_gs_contractid@nsCOMPtr_base@@QAIXVnsGetServiceByContractID@@ABUnsID@@@Z)
   1>winEmbed.obj : error LNK2001: unresolved external symbol _NS_CStringContainerInit2
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol _NS_CStringContainerInit2
   1>winEmbed.obj : error LNK2001: unresolved external symbol _XPCOMGlueStartup
   1>winEmbed.obj : error LNK2001: unresolved external symbol "public: virtual unsigned int __fastcall nsGetInterface::operator()(struct nsID const &,void * *)const " (??RnsGetInterface@@UBIIABUnsID@@PAPAX@Z)
   1>winEmbed.obj : error LNK2001: unresolved external symbol _NS_StringContainerInit2
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol _NS_StringContainerInit2
   1>profdirserviceprovidersa_s.lib(nsProfileLock.obj) : error LNK2001: unresolved external symbol _NS_StringContainerInit2
   1>winEmbed.obj : error LNK2001: unresolved external symbol _NS_UTF16ToCString
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol _NS_DebugBreak
   1>profdirserviceprovidersa_s.lib(nsProfileLock.obj) : error LNK2001: unresolved external symbol _NS_DebugBreak
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol _NS_LogAddRef
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol _NS_LogRelease
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol _NS_StringGetData
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol _NS_LogCOMPtrRelease
   1>profdirserviceprovidersa_s.lib(nsProfileLock.obj) : error LNK2001: unresolved external symbol _NS_LogCOMPtrRelease
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol _NS_LogCOMPtrAddRef
   1>profdirserviceprovidersa_s.lib(nsProfileLock.obj) : error LNK2001: unresolved external symbol _NS_LogCOMPtrAddRef
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol "public: unsigned int __fastcall nsGetServiceByContractIDWithError::operator()(struct nsID const &,void * *)const " (??RnsGetServiceByContractIDWithError@@QBIIABUnsID@@PAPAX@Z)
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol "public: unsigned int __fastcall nsQueryInterface::operator()(struct nsID const &,void * *)const " (??RnsQueryInterface@@QBIIABUnsID@@PAPAX@Z)
   1>profdirserviceprovidersa_s.lib(nsProfileLock.obj) : error LNK2001: unresolved external symbol "public: unsigned int __fastcall nsQueryInterface::operator()(struct nsID const &,void * *)const " (??RnsQueryInterface@@QBIIABUnsID@@PAPAX@Z)
   1>profdirserviceprovidersa_s.lib(nsProfileDirServiceProvider.obj) : error LNK2001: unresolved external symbol "public: unsigned int __fastcall nsGetServiceByContractID::operator()(struct nsID const &,void * *)const " (??RnsGetServiceByContractID@@QBIIABUnsID@@PAPAX@Z)
   ```

   添加预编译选项 _CRT_SECURE_NO_WARNINGS 用来消除警告

   ```
   1>e:\mz_test_code\mozillademo\mozillademo\webbrowserchrome.cpp(375) : warning C4996: '_snprintf': This function or variable may be unsafe. Consider using _snprintf_s instead. To disable deprecation, use _CRT_SECURE_NO_WARNINGS. See online help for details.
   1>        d:\program files\microsoft visual studio 9.0\vc\include\stdio.h(358) : see declaration of '_snprintf'
   1>WindowCreator.cpp
   1>winEmbed.cpp
   1>e:\mz_test_code\mozillademo\mozillademo\winembed.cpp(163) : warning C4996: 'strncpy': This function or variable may be unsafe. Consider using strncpy_s instead. To disable deprecation, use _CRT_SECURE_NO_WARNINGS. See online help for details.
   1>        d:\program files\microsoft visual studio 9.0\vc\include\string.h(157) : see declaration of 'strncpy'
   1>e:\mz_test_code\mozillademo\mozillademo\winembed.cpp(198) : warning C4996: '_snprintf': This function or variable may be unsafe. Consider using _snprintf_s instead. To disable deprecation, use _CRT_SECURE_NO_WARNINGS. See online help for details.
   1>        d:\program files\microsoft visual studio 9.0\vc\include\stdio.h(358) : see declaration of '_snprintf'
   1>e:\mz_test_code\mozillademo\mozillademo\winembed.cpp(1086) : warning C4996: 'strncpy': This function or variable may be unsafe. Consider using strncpy_s instead. To disable deprecation, use _CRT_SECURE_NO_WARNINGS. See online help for details.
   1>        d:\program files\microsoft visual studio 9.0\vc\include\string.h(157) : see declaration of 'strncpy'
   ```

   winEmbed.cpp文件里添加#pragma comment(lib, "D:/1.9.2rc1/xulrunner-1.9.2rc1.source/mozilla-1.9.2/profile/dirserviceprovider/standalone/profdirserviceprovidersa_s.lib")

   否则将产生错误

   ```
   1>winEmbed.obj : error LNK2019: unresolved external symbol "unsigned int __cdecl NS_NewProfileDirServiceProvider(int,class nsProfileDirServiceProvider * *)" (?NS_NewProfileDirServiceProvider@@YAIHPAPAVnsProfileDirServiceProvider@@@Z) referenced in function "unsigned int __cdecl StartupProfile(void)" (<a href="mailto:?StartupProfile@@YAIXZ">?StartupProfile@@YAIXZ</a>)
   ```
