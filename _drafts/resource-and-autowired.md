---
layout: post
title: 注解 @Resource 与 @Autowired 的异同点
categories: Java
description: 详解 @Resource 与 @Autowired 两种注解的异同点
keywords: Java, Spring, Resource, Autowired
---

@Resource 和 @Autowired 是在 Java 开发中经常用到的两个注解，我知道它们都可以完成依赖注入的工作，但对它们之间的异同点，却一直没有确切的了解，今天来通过一些静态对比与代码测试一探究竟。

本文相关的测试代码上传到了 <https://github.com/mzlogin/spring-practices> 的 inject-test 文件夹里。

## 分析

### 静态对比

查看 Resource 与 Autowired 的源码，摘取其中关键点：

```java
package javax.annotation;

@Target({TYPE, FIELD, METHOD})
@Retention(RUNTIME)
public @interface Resource {
    String name() default "";
    String lookup() default "";
    Class<?> type() default java.lang.Object.class;
    AuthenticationType authenticationType() default AuthenticationType.CONTAINER;
    boolean shareable() default true;
    String mappedName() default "";
    String description() default "";
}
```

```java
package org.springframework.beans.factory.annotation;

@Target({ElementType.CONSTRUCTOR, ElementType.METHOD, ElementType.PARAMETER, ElementType.FIELD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Autowired {
    boolean required() default true;
}
```

| #        | @Resource                                                                              | @Autowired                                                     |
|----------|----------------------------------------------------------------------------------------|----------------------------------------------------------------|
| 所属包   | rt.jar（JDK）                                                                          | spring-beans-5.3.21.jar（Spring）                              |
| 适用范围 | TYPE<br>FIELD<br>METHOD                                                                | CONSTRUCTOR<br>METHOD<br>PARAMETER<br>FIELD<br>ANNOTATION_TYPE |
| 支持属性 | name<br>lookup<br>type<br>authenticationType<br>shareable<br>mappedName<br>description | required                                                       |

结合两个注解上的注释，可以得出以下几点：

1. @Resource 是 JDK 提供的，而 @Autowired 是 Spring 提供的；
2. @Resource 和 @Autowired 都可以作用于 FIELD 和 METHOD，只有 @Resource 可以作用于 TYPE，只有 @Autowired 可以作用于 CONSTRUCTOR、PARAMETER 和 ANNOTATION_TYPE；
3. @Resource 可以通过 name、type 等来指定依赖资源特征，而 @Autowired 能指定依赖是否 required；

### 代码测试

测试场景交待：

测试项目 inject-test 是一个 SpringBoot 项目，里面有以下类结构：

![](/images/posts/java/inject-class-structure.png)

目前是通过尝试往 CallerServiceImpl 里注入一个 CalleeService 成员来做验证。

#### Case 1: Resource + 不指定 name 和 type + 不匹配 Bean name 的变量名

```java
@Resource
private CalleeService calleeService;
```

运行结果：**异常**。

```
Caused by: org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean of type 'org.mazhuang.injecttest.service.CalleeService' available: expected single matching bean but found 2: callee1ServiceImpl,callee2ServiceImpl
```

*此时将 Callee1ServiceImpl 或 Callee2ServiceImpl 注释掉其中一个之后，程序运行正常。*

#### Case 2: Resource + 不指定 name 和 type + 匹配 Bean name 的变量名

```java
@Resource
private CalleeService callee1ServiceImpl;

@PostConstruct
public void test() {
    System.out.println(callee1ServiceImpl.getClass().getName());
}
```

运行结果：**正常**。

按变量名匹配的 Bean 进行注入。

```
org.mazhuang.injecttest.service.impl.Callee1ServiceImpl
```

#### Case 3: Resource + 指定 name + 不匹配 Bean name 的变量名

```java
@Resource(name = "callee2ServiceImpl")
private CalleeService calleeService;
```

运行结果：**正常**。

#### Case 4: Resource + 指定 name + 匹配 Bean name 的变量名

```java
@Resource(name = "callee2ServiceImpl")
private CalleeService callee1ServiceImpl;

@PostConstruct
public void test() {
    System.out.println(callee1ServiceImpl.getClass().getName());
}
```

运行结果：**正常**。

按 name 指定的 Bean 进行注入，变量名被忽略。

```
org.mazhuang.injecttest.service.impl.Callee2ServiceImpl
```

#### Case 5: Resource + 指定 type + 不匹配 Bean name 的变量名

```java
@Resource(type = Callee1ServiceImpl.class)
private CalleeService calleeService;
```

运行结果：**正常**。

#### Case 6: Resource + 指定 type + 匹配该 type Bean name 的变量名

```java
@Resource(type = Callee1ServiceImpl.class)
private CalleeService callee1ServiceImpl;
```

运行结果：**正常**。

#### Case 7: Resource + 指定 type + 匹配其它 type Bean name 的变量名

```java
@Resource(type = Callee1ServiceImpl.class)
private CalleeService callee2ServiceImpl;
```

运行结果：**异常**。

在指定 type 的情况下，依然会优先根据变量名称去寻找 Bean，如果找不到 Bean，则根据 type 指定的类型去找；如果根据变量名找到的 Bean 的类型与 type 指定的不匹配，会抛出异常。

```
Caused by: org.springframework.beans.factory.BeanNotOfRequiredTypeException: Bean named 'callee2ServiceImpl' is expected to be of type 'org.mazhuang.injecttest.service.impl.Callee1ServiceImpl' but was actually of type 'org.mazhuang.injecttest.service.impl.Callee2ServiceImpl'
```

#### Case 8: Resource + 指定正确 name + 指定 name 对应 type + 不匹配 Bean name 的变量名

```java
@Resource(name = "callee1ServiceImpl", type = Callee1ServiceImpl.class)
private CalleeService calleeService;
```

运行结果：**正常**。

#### Case 9: Resource + 指定正确 name + 指定 name 对应 type + 匹配 Bean name 的变量名

```java
@Resource(name = "callee1ServiceImpl", type = Callee1ServiceImpl.class)
private CalleeService callee2ServiceImpl;
```

运行结果：**正常**。

**指定 name 后，变量名对注入不再产生影响。**

#### Case 10: Resource + 指定正确 name + 指定 name 不对应 type

```java
@Resource(name = "callee1ServiceImpl", type = Callee2ServiceImpl.class)
private CalleeService calleeService;
```

运行结果：**异常**。

```
Caused by: org.springframework.beans.factory.BeanNotOfRequiredTypeException: Bean named 'callee1ServiceImpl' is expected to be of type 'org.mazhuang.injecttest.service.impl.Callee2ServiceImpl' but was actually of type 'org.mazhuang.injecttest.service.impl.Callee1ServiceImpl'
```

#### Case 11: Resource + 指定不正确 name + 指定 type

```java
@Resource(name = "callee3ServiceImpl", type = Callee2ServiceImpl.class)
private CalleeService calleeService;
```

运行结果：**异常**。

```
Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'callerServiceImpl': Injection of resource dependencies failed; nested exception is org.springframework.beans.factory.NoSuchBeanDefinitionException: No bean named 'callee3ServiceImpl' available
```

#### Case 12: Resource + 注掉 CalleeService 的所有实现

```java
@Resource
private CalleeService calleeService;
```

运行结果：**异常**。

```java
Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'callerServiceImpl': Injection of resource dependencies failed; nested exception is org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type 'org.mazhuang.injecttest.service.CalleeService' available: expected at least 1 bean which qualifies as autowire candidate. Dependency annotations: {@javax.annotation.Resource(shareable=true, lookup=, name=, description=, authenticationType=CONTAINER, type=class java.lang.Object, mappedName=)}
```

#### Case 13: Autowired + 匹配 Bean name 的变量名

```java
@Autowired
private CalleeService callee1ServiceImpl;
```

运行结果：**正常**。

#### Case 14: Autowired + 不匹配 Bean name 的变量名

```java
@Autowired
private CalleeService calleeService;
```

运行结果：**异常**。

此时将 Callee1ServiceImpl 和 Callee2ServiceImpl 注释掉其中一个就运行正常了。说明 Autowired 是优先按变量名寻找 Bean（没有 Qulifier 的前提下），如果找不到再按类型搜索。

```
Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'callerServiceImpl': Unsatisfied dependency expressed through field 'calleeService'; nested exception is org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean of type 'org.mazhuang.injecttest.service.CalleeService' available: expected single matching bean but found 2: callee1ServiceImpl,callee2ServiceImpl
```

#### Case 15: Autowired + 匹配 Bean name 的变量名 + Qualifier 匹配同一个 Bean name 的变量名

```java
@Autowired
@Qualifier("callee1ServiceImpl")
private CalleeService callee1ServiceImpl;
```

运行结果：**正常**。

#### Case 16: Autowired + 匹配 Bean name 的变量名 + Qualifier 匹配另一个 Bean name 的变量名

```java
@Autowired
@Qualifier("callee1ServiceImpl")
private CalleeService callee2ServiceImpl;

@PostConstruct
public void test() {
    System.out.println(callee2ServiceImpl.getClass().getName());
}
```

运行结果：**正常**。

```
org.mazhuang.injecttest.service.impl.Callee1ServiceImpl
```

通过 Qualifier 限定 Bean name 之后，变量名不再影响注入。

#### Case 17: Autowired + 注掉 CalleeService 的所有实现

```java
@Autowired
private CalleeService calleeService;
```

运行结果：**异常**。

```
Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'callerServiceImpl': Unsatisfied dependency expressed through field 'calleeService'; nested exception is org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type 'org.mazhuang.injecttest.service.CalleeService' available: expected at least 1 bean which qualifies as autowire candidate. Dependency annotations: {@org.springframework.beans.factory.annotation.Autowired(required=true)}
```

#### Case 18: Autowired + 注掉 CalleeService 的所有实现 + required = false

```java
@Autowired(required = false)
private CalleeService calleeService;
```

运行结果：**正常**。

## 小结

## 参考

- <https://blog.csdn.net/balsamspear/article/details/87936936>
