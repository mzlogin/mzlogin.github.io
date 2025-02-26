---
layout: post
title: iOS｜解决 setBrightness 调节屏幕亮度不生效的问题
categories: [iOS]
description: iOS App 中调用 setBrightness 方法不生效，最终在 GitHub Copilot 的「协助」下解决了这个问题。
keywords: iOS, setBrightness, GitHub Copilot
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

在包含视频播放功能的 App 中，一种常见的交互是在播放器界面的左侧上下滑动调节屏幕亮度，右侧上下滑动调节音量。我们的 iOS App 里也是这样设计的，但最近在测试过程中，发现亮度调节不生效了。

## 摸索之路

代码里面调节亮度的实现是这样的：

```objc
- (void)setBrightnessUp {
    if ([UIScreen mainScreen].brightness >=1) {
        return;
    }
    [UIScreen mainScreen].brightness += 0.01;
    // ...
}

- (void)setBrightnessDown {
    if ([UIScreen mainScreen].brightness <=0) {
        return;
    }
    [UIScreen mainScreen].brightness -= 0.01;
    // ...
}
```

这个实现在较早之前是没有问题的，那我首先想到比较可能是因为系统的更新，对这个 API 做了变更。于是先查阅了 [UIKit/UIScreen/brightness 的官方文档][1]，里面只提到了 brightness 属性只在 main screen 上被支持，取值范围是 [0.0, 1.0]，以及亮度调节后，直到锁屏后才会失效——即使用户在锁屏之前已经关闭了 App。并没有看到什么值得特别留意的。

然后继续看代码里的 UIScreen.mainScreen，这个属性被标记为：

```objc
API_DEPRECATED("Use a UIScreen instance found through context instead: i.e, view.window.windowScene.screen", ios(2.0, API_TO_BE_DEPRECATED), visionos(1.0, API_TO_BE_DEPRECATED))
```

但当前在我使用的 SDK 18.2 版本中，这个属性应仍可正常使用。

在 Google 和 StackOverflow 找了一圈，大家讨论亮度调节不生效主要集中以下方面：

- [后台调用不生效；][2]
- [模拟器上调节不生效；][3]
- [viewDidLoad and viewWillAppear 中调用不生效；][4]
- 如何优雅地在 App 退出后恢复原有亮度；

也没有找到什么能匹配我的场景的解决方案。

加了一些日志，在调节亮度前后分别打印了 brightness 的值，发现它在调用 setBrightness 方法后并没有发生变化，也没有报错和告警，看起来就像是这个方法根本没有被调用一样。

也做了一些其它尝试，比如把调整亮度的代码显式调度到主线程、使用 `view.window.windowScene.screen` 替代 `UIScreen.mainScreen` 等，但都没有效果。

无奈之下，我问了 GitHub Copilot 一嘴，它的回答是这样的：

![](/images/posts/ios/copilot-ios-setbrightness-not-work.png)

我按它的建议检查了权限，确认了不存在权限问题。

有点绝望之际，看到它提供的代码里调整亮度的粒度是 0.1，而我的代码里是 0.01，**于是我尝试将粒度改为 0.1，然后奇迹发生了，亮度调节生效了**。

这就有点匪夷所思了……于是我又尝试了其它的粒度值，结果如下：

- 0.01，不生效；
- 0.02，不生效；
- 0.03 及以上，生效，但是从输出可以看到，**实际调整后的亮度值都是 0.05 的倍数，即 0.05、0.1、0.15、0.2……**，而不是 0.03、0.06、0.09、0.12……

我找到安装了以前老版本 App 的一个老平板（iOS 10.3.3），在上面测试了一下，发现在这个版本上，0.01 的调节粒度是可以生效的。

**也就是说，在 iOS (10.3.3, 18.2) 之间靠近后者的某个版本上，[UIScreen mainScreen].brightness 的调节粒度发生了变化，由 0.01 变为了 0.05。**

至此破案了，顺便吐槽一下，官方文档里对此毫无提及，实在是……略坑。

## 参考

- [https://developer.apple.com/documentation/uikit/uiscreen/brightness?language=objc][1]
- [https://stackoverflow.com/questions/54229300/not-able-to-set-brightness-when-app-enter-in-background-can-any-one-have-any-id][2]
- [https://stackoverflow.com/questions/12362885/ios-uiscreen-setbrightness-doesnt-work][3]
- [https://stackoverflow.com/questions/61765014/why-cannot-i-set-uiscreen-main-brightness][4]

[1]: https://developer.apple.com/documentation/uikit/uiscreen/brightness?language=objc
[2]: https://stackoverflow.com/questions/54229300/not-able-to-set-brightness-when-app-enter-in-background-can-any-one-have-any-id
[3]: https://stackoverflow.com/questions/12362885/ios-uiscreen-setbrightness-doesnt-work
[4]: https://stackoverflow.com/questions/61765014/why-cannot-i-set-uiscreen-main-brightness