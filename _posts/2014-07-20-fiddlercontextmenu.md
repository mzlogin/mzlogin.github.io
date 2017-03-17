---
layout: post
title: 定制 Fiddler 之将请求发往另一服务器
categories: Fiddler
description: 利用 Fiddler 和 Composer 功能将某个特定的 SESSION 手动发往另一个服务器。
keywords: Fiddler
---

### 需求

对 Fiddler 抓取的某个特定 SESSION 能在必要时手动操作发往另一个服务器。

### 设想

在 SESSION 上点击右键弹出的菜单中添加一项，让它对应的响应事件来完成此操作。而联想到 Fiddler 的 Composer 功能能够将某条 SESSION 按自己的需要修改后重新发出，那利用 Composer 来做应该是比较容易实现且便捷的方式。

### 实现

对 Fiddler 的扩展比较方便的是使用 FiddlerScript，修改 CustomRules.js 来做。比如希望在 hostname 为`www.mazhuang.org`的 SESSION 上右键后利用自己添加的菜单项将此 SESSION 的 hostname 修改为`mazhuang.org`后重新发送请求，最终在 CustomRules.js 文件中添加了如下代码即可。

添加方法：

**启动 Fiddler > 选择菜单 Rules > 选择菜单项 Customize Rules... > 将如下代码粘贴在`OnDetach`函数后面 > 保存**

*注：发现将下面的函数放在`OnDetach`函数前自己添加的菜单项就不是第一项，而放在`OnDetach`后就是第一项了，这个很奇怪，未想到合理原因。*

```js
public static ContextAction("发送到 mazhuang.org")
function DoSend2RootDomain(oSessions: Fiddler.Session[]){
    var oS: Session = FiddlerApplication.UI.GetFirstSelectedSession();
    if (null == oS) return;
    if (oS.HostnameIs("www.mazhuang.org"))
    {
        oS.hostname = "mazhuang.org";
        FiddlerApplication.DoComposeByCloning(oS);
    }
    else
    {
        MessageBox.Show("不是发往 www.mazhuang.org 的请求");
    }
}
```

然后就能看到效果了，在 hostname 为`www.mazhuang.org`的 SESSION 上右键，点击刚刚我们自己添加的「发送到 mazhuang.org」菜单项，会发现 Fiddler 界面右边的 Composer 标签已打开，然后 hostname 已经替换为`mazhuang.org`，这时再手动点击 Execute 按钮即可将更改 hostname 后的请求重新发出。

### 缺陷

当前做法有如下缺陷，尚未想到好办法解决：

1. 会破坏原 SESSION，即将原 SESSION 的 hostname 也替换为了`mazhuang.org`。
2. 一次操作需要点选右键菜单项后再点击一次 Composer 窗口中的 Execute 按钮才能完成，比较理想的状况是点选右键菜单后即完成替换 hostname 且重新发出请求。

### 附注

我使用的完整最新的 CustomRules.js 文件我上传到了一个 Gist 里，详见：<https://gist.github.com/mzlogin/3c5f9781c5bedff3fcfb>，如果想直接使用可以复制脚本内容后放置到「我的文档 /Fiddler 2/Scripts/CustomRules.js」，也可以在此目录下使用 git 抓取我的最新定制 js 文件。
