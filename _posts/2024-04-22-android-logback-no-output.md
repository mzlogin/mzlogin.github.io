---
layout: post
title: Android｜记一个导致 logback 无法输出日志的问题
categories: [Android]
description: 在给一个 Android 项目添加 logback 日志框架时，遇到一个导致无法正常输出日志的问题，这里记录一下。
keywords: Android, logback
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

之前写过[《Android｜集成 slf4j + logback 作为日志框架》](https://mp.weixin.qq.com/s/kMRkQ6j-ipet85si-rbfyw)，最近在给手上的另外一个 Android 项目添加 logback 日志框架时，遇到一个导致无法输出日志到文件的问题，也耽误了不少时间，这里记录一下。

## 现象

代码里通过 `@Slf4j` 注解注入 logger，正常 `log.info(xxx)`，但是程序启动后，发现没有生成日志文件。

## 排查

### 检查配置文件

有前一个项目的成功经验，我直接复制了之前项目的配置文件，只是将日志存储文件夹修改为了 `${DATA_DIR}/log`，其中 `DATA_DIR` 变量是指代 `Context.getFilesDir()`，它也不存在权限申请之类的问题。测试了将它写死成一个绝对路径，也没有日志文件生成。

基本排除配置文件的问题。

### 打开 logback 的 debug 模式

将 logback.xml 文件的根元素 `<configuration>` 添加 `debug="true"` 属性，重启程序，查看 logcat 输出，发现如下异常：

```shell
11:34:06,785 |-ERROR in ch.qos.logback.core.rolling.RollingFileAppender[local_file] - Failed to create parent directories for [/log/app.log]
11:34:06,786 |-ERROR in ch.qos.logback.core.rolling.RollingFileAppender[local_file] - openFile(/log/student.log,true) failed java.io.FileNotFoundException: /log/app.log: open failed: ENOENT (No such file or directory)
	at java.io.FileNotFoundException: /log/student.log: open failed: ENOENT (No such file or directory)
        ...
	at 	at org.slf4j.LoggerFactory.getLogger(LoggerFactory.java:416)
	at 	at org.mazhuang.OnlineApplication.<clinit>(OnlineApplication.java:21)
```

初始化日志文件路径失败，但是输出的日志文件路径是 `/log/app.log`，而不是我配置的 `${DATA_DIR}/log/app.log`，这里有问题。

可以看出是 logback 没有正确解析 `${DATA_DIR}` 变量，导致日志文件路径错误。但是为什么会这样呢？并没有什么头绪，难道是 logback 的 bug？

### 检查 logback-android 的 wiki

在想了好久仍然没有头绪之后，浏览 logback-android 的 wiki，发现在介绍 `DATA_DIR` 等变量的地方，有这么一段以前没留意的描述：

> Note these special properties are initialized when the first logger is instantiated (i.e., via LoggerFactory.getLogger()), but that must be done when the application context is available (e.g., in the onCreate method of your Application class or at any point thereafter). Otherwise, the special properties will resolve to empty strings.

这段话大意是，`DATA_DIR` 等这些变量，是在第一次调用 `LoggerFactory.getLogger()` 时初始化的，但是必须在 application context 可用之后（例如在 Application 类的 `onCreate` 方法中或之后的任何时候）。否则，这些变量将解析为空字符串。

结合上面异常堆栈里的信息，可以判断是因为在 Application 类的类初始化（`clinit`）过程中调用了 `LoggerFactory.getLogger()`，此时 application context 还不可用，导致 logback 无法正确解析 `${DATA_DIR}` 变量。

### 进一步探究

而为什么 Application 类的类初始化过程中会调用 `LoggerFactory.getLogger()` 呢？检查代码，发现是在自定义 Application 类及其基类中使用了 `@Slf4j` 注解，这个注解会生成一个静态的 logger，而这个 logger 的初始化会调用 `LoggerFactory.getLogger()`——太早了。

参见 `@Slf4j` 注解源文件里的注释：

```
Causes lombok to generate a logger field.
Complete documentation is found at the project lombok features page for lombok log annotations .
Example:
  @Slf4j
  public class LogExample {
  }
  
will generate:
  public class LogExample {
      private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(LogExample.class);
  }
```

## 解决

去掉自定义 Application 类及其基类上的 `@Slf4j` 注解，如果需要在 Application 类里打印日志，改为在 `onCreate` 方法中手动初始化 logger。

又一次印证了认真阅读文档的重要性。:cry:

## 参考

- <https://github.com/tony19/logback-android/wiki#special-properties-for-xml-config>

