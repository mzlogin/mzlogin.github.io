---
layout: post
title: Java｜SpringBoot 项目开发时，让 FreeMarker 文件编辑后自动更新
categories: [Java]
description: FreeMarker 文件编辑后，如果每次都需要重启才能看到效果，那效率会非常低下。通过一些配置可以让它们自动更新。
keywords: Java, FreeMarker, IDEA, SpringBoot
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

正在维护的一个 SpringBoot 项目是前后端一体的，页面使用 FreeMarker 编写。在开发过程中，ftl 文件编辑后，每次都需要重启应用才能看到效果，效率非常低下。这里记录通过哪些配置后，可以让它们免重启自动更新。

1. 在应用的 pom.xml 文件里，做如下修改：

    ```xml
    <dependencies>
        <!-- 添加以下依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <optional>true</optional>
            <scope>runtime</scope>
        </dependency>
    </dependencies>

    <build>
        <finalName>${artifactId}</finalName>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <!-- 添加以下这一行 -->
                    <fork>true</fork>
                </configuration>
            </plugin>
        </plugins>
    </build>
    ```

2. 在 application-dev.properties 文件里添加如下内容：

    ```
    # freemarker hot reload
    spring.freemarker.cache=false
    spring.freemarker.settings.template_update_delay=0
    ```

    禁用 FreeMarker 缓存，有更改后即时更新。

3. 修改 IDEA 配置，开启自动编译：

    ![](/images/posts/java/idea-build-project-automatically.png)

4. 编译应用运行时的 Run/Debug Configurations：

    ![](/images/posts/java/idea-run-debug-configurations.png)

    将 On 'Update' action: Update classes and resources 和 On frame deactivation: Update classes and resources 配置打开。

关于 spring-boot-devtools 的相关用途与说明，可以参考 Spring 官方文档：<https://docs.spring.io/spring-boot/docs/2.7.18/reference/html/using.html#using.devtools>，可以看到，如果想要在开发过程中修改 Java 代码后免于手动重启，也可以借助于 spring-boot-devtools 的相关配置。

参考链接：

- <https://docs.spring.io/spring-boot/docs/2.7.18/reference/html/using.html#using.devtools>
- <https://blog.csdn.net/silentwolfyh/article/details/85048745>
- <https://www.cnblogs.com/ios9/p/14410299.html>