---
layout: post
title: "可执行文件名中包含install或setup"
---

**问题描述：**    
在Windows Vista+系统下，若EXE文件名中包含有'install'、'setup'等字样，可能出现如下问题：  
1. 每次软件运行完退出后会弹出"程序兼容性助手"(Program Compatibility Assistant, 简称PCA)，提示软件未正确安装。  
2. 在Vista+的操作系统下任务栏右键该程序缺少"将此程序锁定到任务栏"和软件名同名项。  
  
**分析：**      
Windows会自动进行启发式的安装包嗅探，估计其中的一条规则就是如果软件名中含有install或setup就会认为运行的软件是一个软件包。    
  
**解决方案：**      
*问题1：*    
满足如下两项之一：  
一、在注册表项HKEY_CURRENT_USER\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Compatibility Assistant\Persisted下有以可执行文件全路径为名，值为REG_DWORD类型的1的项。   
二、为可执行文件添加类似如下的Manifest文件，指定程序支持Win7与Vista。  
    
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?> 
      <assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0"> 
        <compatibility xmlns="urn:schemas-microsoft-com:compatibility.v1"> 
          <application> 
            <!--The ID below indicates application support for Windows Vista --> 
              <supportedOS Id="{e2011457-1546-43c5-a5fe-008deee3d3f0}"/> 
            <!--The ID below indicates application support for Windows 7 --> 
              <supportedOS Id="{35138b9a-5d96-4fbd-8e2d-a2440225f93a}"/> 
          </application> 
        </compatibility>
      </assembly>  
    
*问题2：*    
目前没有找到什么好方法，靠谱的就是将软件改名吧！去掉install，去掉setup，世界从此清净了。    
  
**结论：**    
将软件改名吧！如果你也同意将精力放在纠结上面这些事情还不如去干点更有用的事件的观点的话。
