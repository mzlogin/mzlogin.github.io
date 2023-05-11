---
layout: post
title: AI 自动补全的这句日志能正常打印吗？
categories: [java]
description: 一句 GitHub Copilot 自动生成的代码让我产生了疑惑，于是探索了一番。
keywords: java, GitHub Copilot
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

最近用上了 GitHub Copilot，它的能力不时让我惊叹，于是越来越多地面向 tab 编程，机械键盘的损耗都小了许多:-p

这天，它给我自动生成了一句像这样的日志打印代码：

```java
try {
    // ...
} catch (Exception e) {
    log.error("Xxx 操作出错，订单号 {}，操作人 {}", orderNumber, operatorName, e);
}
```

我盯着这行熟悉又陌生的代码——没错平时我自己也会这么写，但此时竟然产生了一丝不确定，它真的能按期望的效果，先打印出这句话，然后完整打印异常堆栈吗？

既然有疑惑，那就刨根问底一下。

## 为什么疑惑？

问了自己这个问题之后，我回想了一下，可能是因为以前遇到过这个：

![](/images/posts/java/less-arguments-than-placeholders.png)

如果最后一个参数不是 Throwable 类型，那 IDEA 会给出警告：

```
More arguments provided (3) than placeholders specified (2)
```

那为什么最后多出来的那个参数是 Throwable，IDE 就认为正常了呢？这就是本文要探索的问题。

## 消除疑惑

遇事不决，<kbd>command + click</kbd> 一下。可以看到方法的定义是这样的：

```java
public void error(String format, Object... arguments);
```

可惜想看具体实现的时候发现实现类太多，索性写一个测试用例 debug 跟一下，一路 <kbd>F7</kbd> 进去（这里用的日志框架是 log4j2）：

```
org.apache.logging.slf4j.Log4jLogger#error(java.lang.String, java.lang.Object...)
org.apache.logging.log4j.spi.AbstractLogger#logIfEnabled(java.lang.String, org.apache.logging.log4j.Level, org.apache.logging.log4j.Marker, java.lang.String, java.lang.Object...)
org.apache.logging.log4j.spi.AbstractLogger#logMessage(java.lang.String, org.apache.logging.log4j.Level, org.apache.logging.log4j.Marker, java.lang.String, java.lang.Object...)
org.apache.logging.log4j.message.ParameterizedMessageFactory#newMessage(java.lang.String, java.lang.Object...)
org.apache.logging.log4j.message.ParameterizedMessage#ParameterizedMessage(java.lang.String, java.lang.Object...)
org.apache.logging.log4j.message.ParameterizedMessage#init
```

秘密就在这里了：

```java
// org.apache.logging.log4j.message.ParameterizedMessage

private void init(final String messagePattern) {
    this.messagePattern = messagePattern;
    final int len = Math.max(1, messagePattern == null ? 0 : messagePattern.length() >> 1); // divide by 2
    this.indices = new int[len]; // LOG4J2-1542 ensure non-zero array length
    // 计算占位符个数
    final int placeholders = ParameterFormatter.countArgumentPlaceholders2(messagePattern, indices);
    initThrowable(argArray, placeholders);
    this.usedCount = Math.min(placeholders, argArray == null ? 0 : argArray.length);
}

private void initThrowable(final Object[] params, final int usedParams) {
    if (params != null) {
        final int argCount = params.length;
        // 如果占位符个数比参数个数少，且最后一个参数是 throwable 类型，
        // 则将最后一个参数赋值给 Message 的成员
        if (usedParams < argCount && this.throwable == null && params[argCount - 1] instanceof Throwable) {
            this.throwable = (Throwable) params[argCount - 1];
        }
    }
}
```

然后在调用堆栈回溯几步有：

```java
// org.apache.logging.log4j.spi.AbstractLogger

protected void logMessage(final String fqcn, final Level level, final Marker marker, final String message,
        final Object... params) {
    final Message msg = messageFactory.newMessage(message, params);
    logMessageSafely(fqcn, level, marker, msg, msg.getThrowable());
}
```

至此基本上清晰了。

## 结论

经过分析及实际运行验证：

- AI 生成的代码可以按期望效果打印；
- 如果有比占位符多的非 Throwable 类型参数，会被忽略掉。
