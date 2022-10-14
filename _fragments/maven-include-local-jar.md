---
layout: fragment
title: Maven 项目引用本地 jar 包
tags: [Java, Maven]
description: Maven 项目引用本地 jar 包、并且将其打包进去的方法。
keywords: Maven, Java
---

我们现在 Java 项目一般都使用 Maven 进行依赖管理，二方包三方包都是从公司的私服远程拉取。最近做一个外采系统的二次开发，SDK 只提供离线 jar 包，这样我们就得想办法告诉 Maven 同时引入远程和本地的依赖，并且在打包时包含本地依赖。

1. 将 xxxSDK.jar 包拷贝进项目，比如 src/lib 里；

2. 在 pom.xml 文件里新增 dependency：

    ```xml
    <dependency>
        <groupId>com.xxx</groupId>
        <artifactId>xxx-sdk</artifactId>
        <scope>system</scope>
        <version>${xxxSDK.version}</version>
        <systemPath>${project.basedir}/src/lib/xxxSDK.jar</systemPath>
    </dependency>
    ```

    注意 scope 是 system，表明是基于文件系统，配合 systemPath 查找。

    groupId、artifactId、version 可以按实际情况瞎写。

3. 在 pom.xml 里添加 `<includeSystemScope>true</includeSystemScope>`指定打包的时候将引用的本地 jar 也打包进去，比如 SpringBoot 项目的：

    ```xml
    <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <!-- 加以下配置 -->
        <configuration>
            <includeSystemScope>true</includeSystemScope>
        </configuration>
    </plugin>
    ```

好了大功告成。

后续问题：

1. 打包后运行时，报错 `Correct the classpath of your application so that it contains a single, compatible version of`，这是由于包冲突，可以排除冲突包，只保留一个正确版本解决，如果无法排除（比如从本地 jar 包引入的），则可以调整 dependency 顺序，将正确版本放在最前面。

参考：[Maven项目引用本地jar包_xiaowu&amp;的博客-CSDN博客_maven引入本地jar](https://blog.csdn.net/huqiwuhuiju/article/details/122040316)
