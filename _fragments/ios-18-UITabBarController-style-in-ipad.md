---
layout: fragment
title: 让 UITabBarController 在 iOS 18 的 iPad 上显示在底部
tags: [ios]
description: 让 UITabBarController 在 iOS 18 的 iPad 上显示在底部
keywords: iOS, iPad, UITabBarController
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

最近在修改 iOS APP 时遇到一个问题，在装有 iOS 18 的 iPad 上，UITabBarController 的 TabBar 跑到了顶部，而不是我们期望的底部。

期望的效果：

![](/images/fragments/ios-tabbar-bottom.png)

实际效果：

![](/images/fragments/ios-tabbar-top.png)

解决办法：

```objc
// MainTabBarController.h
@interface MainTabBarController : UITabBarController

@end

// MainTabBarController.m
@implementation MainTabBarController

- (void)viewDidLoad {
    [super viewDidLoad];
    // some code here
    
    // 当是 iPad 且 iOS 18.0 以上时，底部导航条维持老风格
    if ([UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPad) {
        if (@available(iOS 18.0, *)) {
            self.traitOverrides.horizontalSizeClass = UIUserInterfaceSizeClassCompact;
        }
    }
}

// ...
@end
```

参考：<https://stackoverflow.com/questions/78631030/how-to-disable-the-new-uitabbarcontroller-view-style-in-ipados-18>