---
layout: post
title: 为基于xulrunner的内嵌Gecko程序启用Profile
categories: Gecko
---

Mozilla自带的Profile支持实际上是非常给力的，看看%appdata%/Mozilla/Firefox下的文件就能知道，这里存放着许多的信息，它们提供了很多东西，例如：  
1.  可以通过Profiles/…default/chrome下的userchrome.css文件来定制自己的firefox外观，比如用#appmenu-button { display:none !important;}这样一句就可以去掉firefox左上角难看的按钮菜单  
2.  安装的extensions，Addon放在这里  
3.  证书相关、组件列表、cookie、插件列表等等都可以在这里找到  
等等等等。  
  
合理利用这些文件和信息我们可以在自己内嵌Gecko的程序里方便地做一些事情而不用自己去操作和维护一些配置项和数据。  
  
在自己编译完xulrunner-1.9.2后尚能找到编译好的profdirserviceprovidersa_s.lib来用于WinEmbed工程的移植，最近编译了xulrunner-10.0.2后发现就没这么幸运了，没有生成这个东东。在头疼了一番后决定自己做一个工程来生成它。根据xulrunner源码mozilla-release/profile/dirserviceprovider下的几个makefile来做就可以了。  
  
直接讲过程吧。  
一、编译出需要的Lib文件  
新建一个Win32静态Lib空工程，将mozilla-release/profile/dirserviceprovider目录下的几个.h和.cpp文件都添加进工程，将path/to/xulrunner-10.0.2-sdk/include添加到工程的附加包含目录，为工程添加预处理器定义XP_WIN和XPCOM_GLUE这两项。如果一切顺利的话这时候你已经可以顺利地编译出这个lib文件了。在http://download.csdn.net/detail/mzlogin/4382847可以下载到我的Demo工程，如果想编译，需要将上面所讲的path/to/xulrunner-10.0.2-sdk/include修改成你本机上xulrunner sdk的相应路径。  
  
二、将Lib链接进自己内嵌Gecko的程序  
自写一个启用profile的函数，我这里直接使用WinEmbed例子里提供的StartupProfile函数： 

    nsresult StartupProfile()
    {
        nsCOMPtr<nsIFile> appDataDir;
        nsresult rv = NS_GetSpecialDirectory(NS_APP_APPLICATION_REGISTRY_DIR, getter_AddRefs(appDataDir));
        if (NS_FAILED(rv))
          return rv;

        appDataDir->AppendNative(nsCString("MozillaDemo"));
        nsCOMPtr<nsILocalFile> localAppDataDir(do_QueryInterface(appDataDir));

        nsCOMPtr<nsProfileDirServiceProvider> locProvider;
        NS_NewProfileDirServiceProvider(PR_TRUE, getter_AddRefs(locProvider));
        if (!locProvider)
          return NS_ERROR_FAILURE;
        
        rv = locProvider->Register();
        if (NS_FAILED(rv))
          return rv;
        
        return locProvider->SetProfileDir(localAppDataDir);
    }

其中的”MozillaDemo”即是你的profile文件夹的名字，可以根据你的喜好改动，在这里会是%appdata%/Mozilla/MozillaDemo  
 
在初始化Gecko运行环境的过程里调用完XRE_InitEmbedding2之后，添加  

    if (NS_FAILED(StartupProfile())) {
        result = 8;
    }
    else {

在此文件开始添加  

    #include "nsAppDirectoryServiceDefs.h"
    #include "nsDirectoryServiceDefs.h"
    #include "nsProfileDirServiceProvider.h"

在合适的地方添加  

    #pragma comment(lib, "编译出的lib")

顺利的话，就大功告成了，运行一个你的内嵌Gecko程序然后去%appdata%/Mozilla/MozillaDemo看看吧~有图有真相哦。  
<img src="/images/posts/gecko/geckouseprofile.png" width="80%" alt="Gecko Embed Program Use Profile"/>
