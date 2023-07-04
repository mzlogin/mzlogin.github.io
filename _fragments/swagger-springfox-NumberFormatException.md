---
layout: fragment
title: Swagger Springfox NumberFormatException
tags: [java]
description: Swagger Springfox NumberFormatException
keywords: Java, Swagger, Springfox, NumberFormatException
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

## 现象

应用依赖 Springfox 2.9.1 + Swagger 1.5.20，启动后，访问swagger-ui.html，报错如下：

```
Illegal DefaultValue null for parameter type integer
java.lang.NumberFormatException: For input string: ""
```

## 原因

原因是 `@ApiModelProperty` 注解的 `example` 属性值默认为 `""`，而 `io.swagger.models.parameters.AbstractSerializableParameter#getExample` 方法在将其转换为被注解字段对应类型时，1.5.20 版本只判断了 `example == null`，而没有判断是否为 `example.isEmpty()`，然后就可能尝试调用 `Long.valueOf(example)`，导致转换失败。关键源码：

```java
@JsonProperty("x-example")
public Object getExample() {
    if (example == null) {
    if (example == null || example.isEmpty()) {
        return null;
    }
    try {
        if (BaseIntegerProperty.TYPE.equals(type)) {
            return Long.valueOf(example);
        } else if (DecimalProperty.TYPE.equals(type)) {
            return Double.valueOf(example);
        } else if (BooleanProperty.TYPE.equals(type)) {
            if ("true".equalsIgnoreCase(example) || "false".equalsIgnoreCase(defaultValue)) {
                return Boolean.valueOf(example);
            }
        }
    } catch (NumberFormatException e) {
        LOGGER.warn(String.format("Illegal DefaultValue %s for parameter type %s", defaultValue, type), e);
    }
    return example;
}
```

官方的修正见：<https://github.com/swagger-api/swagger-core/pull/2865/files>

## 解决方法

参考 Springfox 项目的一个讨论：[@ApiModelProperty throwing NumberFormatException if example value is not set][2]，将 swagger-annotations 和 swagger-models 包版本升级到 1.5.21，即可解决。

```xml
<dependency>
	<groupId>io.springfox</groupId>
	<artifactId>springfox-swagger2</artifactId>
	<version>2.9.2</version>
	<exclusions>
		<exclusion>
			<groupId>io.swagger</groupId>
			<artifactId>swagger-annotations</artifactId>
		</exclusion>
		<exclusion>
			<groupId>io.swagger</groupId>
			<artifactId>swagger-models</artifactId>
		</exclusion>
	</exclusions>
</dependency>
<dependency>
	<groupId>io.springfox</groupId>
	<artifactId>springfox-swagger-ui</artifactId>
	<version>2.9.2</version>
</dependency>
<dependency>
	<groupId>io.swagger</groupId>
	<artifactId>swagger-annotations</artifactId>
	<version>1.5.21</version>
</dependency>
<dependency>
	<groupId>io.swagger</groupId>
	<artifactId>swagger-models</artifactId>
	<version>1.5.21</version>
</dependency>
```

## 参考

- [Swagger2异常:Illegal DefaultValue null for parameter type integer(2.9.2版本)](https://www.jianshu.com/p/f64ea1743c60)
- [@ApiModelProperty throwing NumberFormatException if example value is not set][2]

[2]: https://github.com/springfox/springfox/issues/2265
