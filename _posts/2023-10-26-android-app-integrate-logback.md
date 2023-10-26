---
layout: post
title: Android｜集成 slf4j + logback 作为日志框架
categories: [Android]
description: Android APP 集成 slf4j + logback 作为日志框架，并使用 Lombok 注解生成日志对象。
keywords: Android, logback, Lombok, slf4j
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

最近在做一个 Android APP 的日志改造时，想要满足如下需求：

1. 能够很方便地使用可变参数的方式输出日志；

2. 日志能够根据级别输出到控制台和文件；

3. 能够按照日期和文件大小进行日志文件的切割，滚动保存指定天数的日志，自动清理旧日志。

基于这个需求，我搜了一下「Android 日志框架」，大多网友推荐的是 logger、timber、xLog 等等，看着也不错。不过出于几年后端开发的经验和习惯，我进一步了解，发现熟悉的 log4j 和 logback 在 Android 上也有人做过适配，所以最终决定使用 slf4j + logback，以在前后端开发中取得一致的体验。

做过 Java 后端开发的同学，对于 slf4j + logback 的组合一般不陌生，而 Android 开发的同学则可能不一定听过它们。所以，本文将从零开始，记录如何在 Android APP 中集成 slf4j + logback 作为日志框架，并使用 Lombok 注解生成日志对象。

## 集成 slf4j + logback

logback-android 项目地址：<https://github.com/tony19/logback-android>

一、在项目/模块的 build.gradle 文件中添加依赖：

```groovy
dependencies {
  implementation 'org.slf4j:slf4j-api:2.0.7'
  implementation 'com.github.tony19:logback-android:3.0.0'
}
```

如果是单模块项目，可以直接在 app/build.gradle 文件中添加，如果是多模块项目，可以在一个公共模块的 build.gradle 文件中添加，记得将 slf4j-api 的 `implementation` 改为 `api` 才可被其它模块引用。

二、创建日志配置文件 `app/src/main/assets/logback.xml`：

```xml
<configuration debug="false"
    xmlns="https://tony19.github.io/logback-android/xml"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="https://tony19.github.io/logback-android/xml https://cdn.jsdelivr.net/gh/tony19/logback-android/logback.xsd"
>

    <property name="LOG_DIR" value="${EXT_DIR:-${DATA_DIR}}/test/log"/>
    
    <appender name="logcat" class="ch.qos.logback.classic.android.LogcatAppender">
        <tagEncoder>
            <pattern>%logger{12}</pattern>
        </tagEncoder>
        <encoder>
            <pattern>[%-20thread] %msg</pattern>
        </encoder>
    </appender>

    <appender name="local_file" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_DIR}/test.log</file>
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${LOG_DIR}/test.%d.log</fileNamePattern>
            <maxHistory>15</maxHistory>
        </rollingPolicy>
    </appender>

    <root level="DEBUG">
        <appender-ref ref="logcat" />
    </root>

    <root level="INFO">
        <appender-ref ref="local_file" />
    </root>
</configuration>
```

以上配置表示 DEBUG 及以上级别的日志输出到控制台，INFO 及以上级别的日志输出到文件，文件按照日期切割，最多保留 15 天的日志。

大家可以按需配置，比如还可以限定单个文件大小、自定义日志输出的格式等等。

在项目的 Wiki 里提到有一点是 Android 开发者比较关注的，就是日志有保存路径，既可以指定绝对路径，也可以用变量，比如：

- `${DATA_DIR}` 表示 `Context.getFilesDir()`；
- `${EXT_DIR}` 表示 `Context.getExternalFilesDir(null)`；
- `${EXT_DIR:-${DATA_DIR}}` 表示当 `EXT_DIR` 可用时使用 `EXT_DIR`，否则使用 `DATA_DIR`；
- `${PACKAGE_NAME}` 表示包名；
- `${VERSION_NAME}` 表示版本名；
- `${VERSION_CODE}` 表示版本号。

三、可以开始使用 slf4j 的 API 进行日志打印了：

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// 声明 logger
Logger log = LoggerFactory.getLogger(MainActivity.class);

// 打印日志
log.info("hello world");
log.info("number {}, boolean {}, string {}, object {}", 1, true, "string", new Object());
```

运行 APP，可以看到日志输出到 logcat 和对应位置的文件。

当对配置有疑问，需要调试时，可以将上面配置文件里的 `debug="false"` 改为 `debug="true"`，这样 logback 就会输出详细的信息，方便我们定位问题。

## 使用 Lombok 注解生成日志对象

在上一部分的第 3 步，在每一个需要使用 logger 的类里，都需要手动去声明 logger，如 `Logger log = LoggerFactory.getLogger(MainActivity.class);`，不算方便。

这里我们可以使用 Lombok 注解来简化这一步骤，自动生成 logger 对象。

Lombok 官方提供了 Android 平台的集成说明：<https://projectlombok.org/setup/android>

基于 Android Studio 环境，要做的其实就两步。

一、安装 Lombok 插件；

`Settings -> Plugins -> 搜索 Lombok -> 安装`

*注：Android Studio 版本 2020.3.1 - 2022.3.1，JetBrains 官方插件市场无法搜索到兼容版本的 Lombok 插件，可以参考 <https://gitee.com/sgpublic/lombok-plugin-repository> 解决。*

二、在需要使用的模块的 build.gradle 文件里添加如下内容：

```groovy
dependencies {
	compileOnly 'org.projectlombok:lombok:1.18.30'
	annotationProcessor 'org.projectlombok:lombok:1.18.30'
}
```

然后，就可以使用 `@Slf4j` 注解来自动生成 logger 对象了，现在的使用姿势简化成了这样：

```java
@Slf4j
public class Test {
    public void test() {
        log.info("hello world");
    }
}
```

## 小结

好了以上就是在 Android 里集成 slf4j + logback 的记录了，至此我「统一」了 Java 后端和 Android 客户端打印日志的用法，在避免多项目维护造成「精神分裂」的路上前进了一小步。

本文所列代码示例已上传至 GitHub，地址：<https://github.com/mzlogin/AndroidPractices/tree/master/android-studio/LogbackDemo>

以上步骤供有类似需求的同学参考，同时强烈建议以官方文档为主。如果有更好的方案，欢迎留言讨论交流。

## 相关链接

- <https://github.com/tony19/logback-android>
- <https://projectlombok.org/setup/android>
- <https://gitee.com/sgpublic/lombok-plugin-repository>
- <https://github.com/mzlogin/AndroidPractices/tree/master/android-studio/LogbackDemo>