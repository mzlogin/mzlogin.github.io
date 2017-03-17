---
layout: post
title: 定制 Fiddler 之按设备过滤请求
categories: Fiddler
description: 当有多台设备时如何方便地从满屏纷飞的 Session 中筛选出你关心的内容？
keywords: Fiddler, Filter, Device
---

### 需求

在开发/测试过程中有多台设备（PC/手机/模拟器）通过 Fiddler 代理上网时，如何方便地从满屏纷飞的 Session 中筛选出自己关心的那台设备的请求？

### 设想

通过 FiddlerScript 扩展，在 Session 的右键弹出菜单中添加一项，作为「查看所有设备请求」和「查看单个设备请求」的切换开关。

*设计操作流程：*

1. 找到自己关心的设备发出的某一条请求，在它的右键弹出菜单里有我们添加的菜单项「开/关过滤单设备请求」。

2. 点击该菜单项后：
   * 若当前状态为「查看所有设备请求」，则切换为「查看单个设备请求」状态，该设备为此条请求的发送者，并清除当前已显示的所有不关心的设备的请求。
   * 若当前状态为「查看单个设备请求」，则切换为「查看所有设备请求」状态。

### 实现

*实现思路：*

* 通过修改 CustomRules.js，在右键弹出菜单上添加一个菜单项来切换请求筛选状态。

* 每一条请求都带有 ClientIP，它在没有网络切换之类的情况发生时能较好地唯一标识一台设备。

* 筛选规则是将非来自该 ClientIP 的请求隐藏掉。

*实现步骤：*

1. 打开 CustomRules.js。

   启动Fiddler，依次选择菜单 Rules > Customize Rules...

2. 在 `OnBeforeRequest` 前添加如下代码：

   ```js
   // 是否过滤单设备请求标志
   public static var gs_FilterDevice: boolean = false;
   // 显示请求的设备的 ClientIP
   public static var gs_FilterClientIP: String = null;

   static function IsUnMatchClientIP(oS:Session):Boolean {
       return (oS.m_clientIP != gs_FilterClientIP);
   }

   public static ContextAction("开/关过滤单设备请求")
   function ToggleDeviceFilter(oSessions: Fiddler.Session[]){
       if (gs_FilterDevice) {
           gs_FilterDevice = false;
           return;
       }
       var oS: Session = FiddlerApplication.UI.GetFirstSelectedSession();
       if (null == oS) return;
       if (!gs_FilterDevice) {
           gs_FilterDevice = true;
       }
       gs_FilterClientIP = oS.clientIP;

       // 删除当前已显示的非所关心设备的请求
       FiddlerApplication.UI.actSelectSessionsMatchingCriteria(IsUnMatchClientIP);
       FiddlerApplication.UI.actRemoveSelectedSessions();
   }
   ```

3. 在 `OnBeforeRequest` 函数里添加如下代码，用于在「查看单个设备请求」状态时将不关心的设备产生的新请求隐藏：

   ```js
   if (gs_FilterDevice && oSession.m_clientIP != gs_FilterClientIP) {
       oSession["ui-hide"] = "true";
   }
   ```

*最终效果如下图：*

* 筛选前

  ![](/images/posts/fiddler/fiddler-filter-by-device-before.png)

* 筛选后

  ![](/images/posts/fiddler/fiddler-filter-by-device-after.png)

### 缺陷

当前做法有如下缺陷，尚未想到好办法解决：  

* 菜单项并不能标明当前的状态，不知道筛选是开是关，这可以通过查看当前 Session 列表里是否有多种设备的请求来判断。

* 当设备有网络切换时，比如重启了路由或者离开又回到某 Wifi，ClientIP 可能发生了变化，需要关闭筛选后在设备以新的 ClientIP 产生的请求上右键再次开启筛选。

### 附注

我使用的完整最新的 CustomRules.js 文件我上传到了一个 Gist 里，详见：<https://gist.github.com/mzlogin/3c5f9781c5bedff3fcfb>，如果想直接使用可以复制脚本内容后放置到「我的文档/Fiddler 2/Scripts/CustomRules.js」，也可以在此目录下使用 git 抓取我的最新定制 js 文件。
