---
layout: post
title: iOS｜一个与 NSDateFormatter 有关的小 Bug
categories: [iOS]
description: iOS APP 的一个小 Bug，与 NSDateFormatter 有关。
keywords: iOS, NSDateFormatter, 24小时制
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

我们的 iOS APP 有一个小 Bug，场景简化后是这样：

接口返回一个时间字符串，APP 里比较它与当前时间，如果当前时间晚于它，就显示一个按钮，否则不显示。

本来是一个很简单的逻辑，但是，有一部分用户反馈，按钮该显示的时候却没有显示。

## 分析

结合用户反馈的信息，经过多次尝试后，才发现这个行为竟然与用户手机的时间制式有关——如果用户手机设置里的 *24小时制* 开关没有打开，那么这个 Bug 就会出现。

相关的逻辑是这样写的：

```objc
NSDate *remoteDate = [NSDate dateFromStr:remoteDateString];
if (remoteDate) {
    // 比较 remoteDate 和 本地当前时间，控制按钮显隐
}
```

这个 `dateFromStr:` 是一个 category 方法，实现是这样的：

```objc 
+ (NSDate*)dateFromStr:(NSString *)dateStr {
    NSDateFormatter * dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    return [dateFormatter dateFromString:dateStr];
}
```

经过调试，发现 `remoteDate` 在 *24小时制* 开关关闭时，返回的是 `nil`，而在打开时，返回的是正确的时间。

苹果[官方文档][1]里，`NSDateFormatter` 的 `dateFromString:` 方法是这样描述的：

> Returns a date representation of a given string interpreted using the receiver’s current settings.
>
> **Return Value**
> A date representation of string. If dateFromString: can’t parse the string, returns nil.

同时还给出了 [Working With Fixed Format Date Representations][2] 的参考链接，里面有说明：

> When working with fixed format dates, such as RFC 3339, you set the dateFormat property to specify a format string. For most fixed formats, you should also set the locale property to a POSIX locale ("en_US_POSIX"), and set the timeZone property to UTC.

这个页面里还给出了一个 QA 链接 [Technical Q&A QA1480 “NSDateFormatter and Internet Dates”][3]，里面有这样的描述：

> On iOS, the user can override the default AM/PM versus 24-hour time setting (via Settings > General > Date & Time > 24-Hour Time), which causes NSDateFormatter to rewrite the format string you set, which can cause your time parsing to fail.
> ...
> On the other hand, if you're working with fixed-format dates, you should first set the locale of the date formatter to something appropriate for your fixed format.

里面提到了用户可以通过设置 *24小时制* 来影响 `NSDateFormatter` 的行为，还提到了当尝试把固定格式的日期字符串转换成日期对象时，应该设置 `locale`。

至此破案了，这个 Bug 就是由于没有设置 `NSDateFormatter` 的 `locale` 属性导致的。

## 解决

修改后的代码是这样的，仅加了一行 `locale` 设置：

```objc
+ (NSDate*)dateFromStr:(NSString *)dateStr {
    NSDateFormatter * dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    [dateFormatter setLocale:[[NSLocale alloc] initWithLocaleIdentifier:@"zh_CN"]];
    return [dateFormatter dateFromString:dateStr];
}
```

经过测试功能正常了，不管用户手机的 *24小时制* 开关是否打开，都能正常解析服务端返回的时间字符串了。

## 参考

- [https://developer.apple.com/documentation/foundation/nsdateformatter/1409994-datefromstring][1]
- [https://developer.apple.com/documentation/foundation/nsdateformatter#2528261][2]
- [https://developer.apple.com/library/archive/qa/qa1480/_index.html][3]

[1]: https://developer.apple.com/documentation/foundation/nsdateformatter/1409994-datefromstring
[2]: https://developer.apple.com/documentation/foundation/nsdateformatter#2528261
[3]: https://developer.apple.com/library/archive/qa/qa1480/_index.html
