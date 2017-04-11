---
layout: post
title: spring webflow教程-环境搭建
categories: SPRING-WEBFLOW
description: Spring Web Flow 是 Spring 的一个子项目，其最主要的目的是解决跨越多个请求的、用户与服务器之间的、有状态交互问题。最新版本为 2.x。
keywords: 教程, 环境, SPRING-WEBFLOW
---

Spring Web Flow 是 Spring 的一个子项目，其最主要的目的是解决跨越多个请求的、用户与服务器之间的、有状态交互问题。最新版本为 2.x。

## spring mvc环境搭建
* 首先通过IDEA创建一个maven web工程，工程名为yusute-webflow，在pom.xml引入如下依赖：

```java
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>4.3.7.RELEASE</version>
</dependency>
<dependency>
    <groupId>jstl</groupId>
    <artifactId>jstl</artifactId>
    <version>1.2</version>
</dependency>
```

* 配置web.xml文件，配置内容如下:

```java
<servlet>
<servlet-name>yusute-webflow-servlet</servlet-name>
<servlet-class>
    org.springframework.web.servlet.DispatcherServlet
</servlet-class>
<init-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>
        classpath:spring/spring-application-web.xml
    </param-value>
</init-param>
<load-on-startup>1</load-on-startup>
</servlet>

<servlet-mapping>
    <servlet-name>yusute-webflow-servlet</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
```    

* 创建SPRING主配置文件spring-application-web.xml，内容如下:

```java
<mvc:annotation-driven/>
<context:component-scan base-package="com.yusute.webflow"/>
<bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/views/" />
        <property name="suffix" value=".jsp" />
</bean>
<import resource="spring-webflow.xml"/>
```
到此为止我们的spring mvc基本配置完成

## spring webflow配置
* 我们需要在pom.xml中引入spring webflow需要的依赖，内容如下：

```java
<dependency>
    <groupId>org.springframework.webflow</groupId>
    <artifactId>spring-webflow</artifactId>
    <version>2.4.4.RELEASE</version>
</dependency>
```

* 创建spring-webflow.xml配置文件，内容如下：

```java
<flow:flow-executor id="flowExecutor" flow-registry="flowRegistry"/>

<flow:flow-registry id="flowRegistry"
                    base-path="/WEB-INF/flows">
    <flow:flow-location-pattern value="/**/*-flow.xml" />
</flow:flow-registry>

<bean class="org.springframework.webflow.mvc.servlet.FlowHandlerMapping">
    <property name="flowRegistry" ref="flowRegistry" />
</bean>

<bean class="org.springframework.webflow.mvc.servlet.FlowHandlerAdapter">
    <property name="flowExecutor" ref="flowExecutor" />
</bean>    
```

* flow定义文件

在webapp下的WEB-INF下面创建一个flows文件夹，我们在这下面再创建一个test文件夹模块，在这个模块里面我们定义一个test1-flow.xml文件，内容如下：

```java
<view-state id="test1">
</view-state>
```

* 定义交互页面

接下来我们要在flows文件夹下面，创建我们的交互页面test1.jsp，内容如下：

```java
<html>
<head>
    <title>this is a test page</title>
</head>
<body>
hello, welcome to spring webflow!
</body>
</html>
```

ok，到目前位置，spring webflow的环境我们以及搭建完成，我们通过tomcat启动一下我们的项目，测试下环境是否ok。在我们的浏览器地址输入：http://localhost:8080/test，会看到如下内容：说明我们的spring webflow环境搭建完成。<br>
![](http://wx3.sinaimg.cn/mw690/0067VWWuly1fdue0eyzuij30jt09kt8o.jpg)

最后，分享一下项目地址：[yusute-webflow][1]

[1]:https://github.com/yusute/yusute-webflow  "yusute-webflow"
