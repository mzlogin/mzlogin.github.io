---
layout: post
title: Android｜WebView 禁止长按，限制非白名单域名的跳转层级
categories: [Android]
description: Android WebView 禁止长按，限制非白名单域名的跳转层级
keywords: Android, WebView
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

最近 Android APP 项目接到少量用户反馈，说在隐私协议的界面上，有两种方式可以跳到百度搜索页面：

1. 长按选择部分文字，然后在弹出的菜单中选择「搜索」，系统会打开浏览器进入百度搜索页面；
2. 点击隐私协议里的三方 SDK 的隐私协议链接，然后经过一系列的点击和跳转，最终可以在 APP 内进入百度搜索页面。

他们希望：1. 所有操作保持在 APP 内；2. 避免能在 APP 内通过百度搜索跳转到任意网站。

本文简要记录一下解决思路和代码实现。

## 现状分析

WebView 里的长按选择文字，禁用掉对功能无影响。

APP 里除了隐私协议，还有一些其它的 WebView 页面，比如帮助中心等，这些页面是需要能自由跳转超链接的。

隐私协议里的三方 SDK 的隐私协议链接，也是要能点击跳转的，不过可以限制只能跳转一级，在进入三方 SDK 的隐私协议页面后，不让再跳转到其它页面。

## 解决思路

1. 禁用掉 WebView 的长按选择文字功能；
2. 允许白名单域名的页面任意加载；非白名单域名的页面都是通过白名单域名的页面跳转过去的，打开后点击里面的超链接不再响应。

## 代码实现

```java
private final List<String> domainWhiteList = Arrays.asList("mazhuang.org");

// some code here

// 屏蔽长按弹出的菜单
mWebView.setOnLongClickListener(v -> true);

mWebView.setWebViewClient(new WebViewClient() {
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        // 非白名单域名网址，只允许加载一级，不允许进一步点里面的链接
        if (view.canGoBack() && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            if (Objects.nonNull(request) && request.isForMainFrame()) {
                Uri uri = request.getUrl();
                if (Objects.nonNull(uri) && !TextUtils.isEmpty(uri.getHost())) {
                    String host = uri.getHost();
                    boolean ifWhiteDomain = false;
                    for (String domain : domainWhiteList) {
                        if (host != null && (host.endsWith(domain) || hosts.endsWith("." + domain))) {
                            ifWhiteDomain = true;
                            break;
                        }
                    }
                    if (!ifWhiteDomain) {
                        log.info("非白名单域名网址拦截：{}", uri);
                        return true;
                    }
                }
            }
        }

        return super.shouldOverrideUrlLoading(view, request);
    }
    // some other methods
});
```

经测试达到了想要的效果。