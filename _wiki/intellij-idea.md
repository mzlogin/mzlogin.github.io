---
layout: wiki
title: IntelliJ IDEA
categories: Tools
description: 最好用的 Java IDE
keywords: IDEA, Java
---

快捷键基本与 [Android Studio](./android-studio/) 一致，这里重点记录解决遇到过的问题。

## Q&A

### 解决导入 Eclipse Maven 工程后无法读取 .xml 文件的问题

IDEA 与 Eclipse 配置文件目录的方式不同，可以将文件夹标记为 Sources、Resources 和 tests 等，而 src/main/java 默认被标记为 Sources，src/main/resources 才默认被标记为 Resources，编译时自动复制。

这样放在 src/main/java 目录下的文件与子文件夹均为 Sources，只将编译生成的 .class 文件复制到编译目录，在 Eclipse Maven 工程里放在 src/main/java 文件夹里的 xml、props 和 properties 文件就不会被拷贝到编译文件夹，导致执行时找不到这些文件，报类似下面这样的错误：

```
org.springframework.beans.factory.BeanDefinitionStoreException: IOException parsing XML document from class path resource [spring-demo.xml]; nested exception is java.io.FileNotFoundException: class path resource [spring-demo.xml] cannot be opened because it does not exist
	at org.springframework.beans.factory.xml.XmlBeanDefinitionReader.loadBeanDefinitions(XmlBeanDefinitionReader.java:343)
	at org.springframework.beans.factory.xml.XmlBeanDefinitionReader.loadBeanDefinitions(XmlBeanDefinitionReader.java:303)
	at org.springframework.beans.factory.support.AbstractBeanDefinitionReader.loadBeanDefinitions(AbstractBeanDefinitionReader.java:180)
	at org.springframework.beans.factory.support.AbstractBeanDefinitionReader.loadBeanDefinitions(AbstractBeanDefinitionReader.java:216)
	at org.springframework.beans.factory.support.AbstractBeanDefinitionReader.loadBeanDefinitions(AbstractBeanDefinitionReader.java:187)
	at org.springframework.beans.factory.support.AbstractBeanDefinitionReader.loadBeanDefinitions(AbstractBeanDefinitionReader.java:251)
	at org.springframework.context.support.AbstractXmlApplicationContext.loadBeanDefinitions(AbstractXmlApplicationContext.java:127)
	at org.springframework.context.support.AbstractXmlApplicationContext.loadBeanDefinitions(AbstractXmlApplicationContext.java:93)
	at org.springframework.context.support.AbstractRefreshableApplicationContext.refreshBeanFactory(AbstractRefreshableApplicationContext.java:129)
	at org.springframework.context.support.AbstractApplicationContext.obtainFreshBeanFactory(AbstractApplicationContext.java:540)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:454)
	at org.springframework.context.support.ClassPathXmlApplicationContext.<init>(ClassPathXmlApplicationContext.java:139)
	at org.springframework.context.support.ClassPathXmlApplicationContext.<init>(ClassPathXmlApplicationContext.java:83)
	at org.mazhuang.demo.protocol.db.DemoContext.init(DemoContext.java:22)
	at org.mazhuang.demo.protocol.DemoServer.start(DemoServer.java:40)
	at org.mazhuang.demo.DemoSrv.main(DemoSrv.java:17)
Caused by: java.io.FileNotFoundException: class path resource [spring-demo.xml] cannot be opened because it does not exist
	at org.springframework.core.io.ClassPathResource.getInputStream(ClassPathResource.java:158)
	at org.springframework.beans.factory.xml.XmlBeanDefinitionReader.loadBeanDefinitions(XmlBeanDefinitionReader.java:329)
	... 15 more
```

**解决方案：**

可以通过在 pom.xml 文件里添加 resources 配置来指定将哪些文件作为 resources 包含：

```xml
<build>
    <resources>
        <resource>
            <directory>${basedir}/src/main/java</directory>
            <includes>
                <include>**/*.props</include>
                <include>**/*.xml</include>
            </includes>
        </resource>
    </resources>
</build>
```

### 如何导出 jar 包

File -> Project Structure -> Artifacts -> Click green plus sign -> Jav -> From modules with dependencies

Build -> Build Artifacts

## 参考

* [解决IntelliJ IDEA无法读取配置*.properties文件的问题](http://www.cnblogs.com/zqr99/p/7642712.html)
* [How to build jars from IntelliJ properly?](https://stackoverflow.com/questions/1082580/how-to-build-jars-from-intellij-properly)

