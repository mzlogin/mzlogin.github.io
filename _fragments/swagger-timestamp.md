---
layout: fragment
title: 禁止 Swagger 文档里的 Timestamp 类型展开
tags: [java]
description: Swagger 文档里的 Timestamp 类型默认展开为 10 个字段，容易引导前端误解，如何禁止展开？
keywords: Java, Swagger, Timestamp
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

Swagger 文档里的 Model 如果有 Timestamp 类型的字段，默认会展示成这样：

![](/images/fragments/swagger-timestamp-default.png)

这样展开的话，前端同学容易误解，以为这个字段是一个对象，而不是一个时间戳。如何禁止展开呢？

可以在 Swagger 的配置里，在构建 Docket 对象的时候，加上 `.directModelSubstitute(Timestamp.class, Date.class)`，来指定文档里将 Timestamp 类型替换为 Date 类型。

比如：

```java
@Bean
public Docket api() {
    Docket docket = new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo()).select()
        .apis(RequestHandlerSelectors.basePackage(this.basePackage))
        .paths(PathSelectors.any())
        .build()
        .enable(this.enable)
        .directModelSubstitute(Timestamp.class, Date.class)
        .securitySchemes(securitySchemes())
        .securityContexts(securityContexts())
        .useDefaultResponseMessages(false);
    log.info("[Swagger] inject swagger Docket to spring: {}", docket);
    return docket;
}
```

修改后的效果：

![](/images/fragments/swagger-timestamp-substituted.png)
