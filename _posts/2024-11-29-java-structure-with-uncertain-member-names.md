---
layout: post
title: Java｜如何用一个统一结构接收成员名称不固定的数据
categories: [Java]
description: Java 如何用一个统一结构接收成员名称不固定的数据
keywords: Java, 反序列化, 数据结构
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

本文介绍了一种 Java 中如何用一个统一结构接收成员名称不固定的数据的方法。

## 背景

最近在做企业微信的内部应用开发，遇到了一个小问题：企业微信的不同接口，返回的数据的结构不完全一样。

比如，获取部门列表接口返回的数据结构是这样的：

```json
{
    "errcode": 0,
    "errmsg": "ok",
    "department": [
        {
            "id": 2,
            "name": "广州研发中心",
            "name_en": "RDGZ",
            "department_leader":["zhangsan","lisi"],
            "parentid": 1,
            "order": 10
        }
    ]
}
```

而获取部门成员接口返回的数据结构是这样的：

```json
{
    "errcode": 0,
    "errmsg": "ok",
    "userlist": [
        {
            "userid": "zhangsan",
            "name": "张三",
            "department": [1, 2],
            "open_userid": "xxxxxx"
        }
    ]
}
```

就是说，不同接口的返回框架是一样的，都是 errcode + errmsg + 数据部分，但数据部分的成员名称不一样，比如上面的 `department` 和 `userlist`。

我不知道为什么这样设计，从 Java 开发者的习惯来讲，如果由我来设计，我会尽量保持接口返回的数据结构的一致性，比如数据部分都用 `data` 来表示，这样在序列化、反序列化的时候可以用一个统一的泛型结构来进行。

当然这可能是企微内部的开发语言或习惯的差异，或者其它原因，这里也无法深究，只谈如何应对。

## 分析

遇到这个问题后，第一反应是用 JSON 结构来接收，然后不同接口的数据部分用不同的 key 来读取。可以实现，但总觉得不够优雅。

然后想到 GitHub 上应该有不少开源的企微开发的封装库，去看看它们的实现，说不定会有更好的方案，最终果然有收获。

主要看了两个库：

- https://github.com/binarywang/WxJava
- https://github.com/NotFound403/wecom-sdk

前者 WxJava 知名度更高，包含的东西也更多，包含微信、企微的各种开发包的封装。它这块的实现是用我们前面提到的方法，用 JSON 结构来接收，然后不同接口的数据用不同的 key 来读取。

后者 wecom-sdk 是企微的开发包。它这块的实现是用了一个统一的泛型结构来接收数据。

以下分别截取两个库的两个部门管理相关接口的封装代码：

**WxJava 版：**

*https://github.com/binarywang/WxJava/blob/develop/weixin-java-cp/src/main/java/me/chanjar/weixin/cp/api/impl/WxCpDepartmentServiceImpl.java*

```java
@Override
public List<WxCpDepart> list(Long id) throws WxErrorException {
    String url = this.mainService.getWxCpConfigStorage().getApiUrl(DEPARTMENT_LIST);
    if (id != null) {
      url += "?id=" + id;
    }

    String responseContent = this.mainService.get(url, null);
    JsonObject tmpJsonObject = GsonParser.parse(responseContent);
    return WxCpGsonBuilder.create()
      .fromJson(tmpJsonObject.get("department"),
        new TypeToken<List<WxCpDepart>>() {
        }.getType()
      );
  }

@Override
public List<WxCpDepart> simpleList(Long id) throws WxErrorException {
    String url = this.mainService.getWxCpConfigStorage().getApiUrl(DEPARTMENT_SIMPLE_LIST);
    if (id != null) {
      url += "?id=" + id;
    }

    String responseContent = this.mainService.get(url, null);
    JsonObject tmpJsonObject = GsonParser.parse(responseContent);
    return WxCpGsonBuilder.create()
      .fromJson(tmpJsonObject.get("department_id"),
        new TypeToken<List<WxCpDepart>>() {
        }.getType()
      );
  }
}
```

**wecom-sdk 版：**

*https://github.com/NotFound403/wecom-sdk/blob/release/wecom-sdk/src/main/java/cn/felord/api/DepartmentApi.java*

```java
@GET("department/list")
GenericResponse<List<DeptInfo>> deptList(@Query("id") long departmentId) throws WeComException;

@GET("department/simplelist")
GenericResponse<List<DeptSimpleInfo>> getSimpleList(@Query("id") long departmentId) throws WeComException;
```

抛开 wecom-sdk 版引入了 Retrofit2 库的支持导致的代码量锐减，在返回数据的反序列化上，我也更倾向于 wecom-sdk 版的实现。

## 实现

那接下来我们直接参照 wecom-sdk 里的实现方式，写一个泛型类，就可以用来接收企微的不同接口返回的数据了：

```java
@Data
public class WxWorkResponse<T> {

    @JsonProperty("errmsg")
    private String errMsg;

    @JsonProperty("errcode")
    private Integer errCode;

    @JsonAlias({
            "department",
            "userlist"
    })
    private T data;
}
```

这里面起到关键作用的是 Jackson 库里的 `@JsonAlias` 注解。它的官方文档是这样介绍的：

```
Annotation that can be used to define one or more alternative names for a property, accepted during deserialization as alternative to the official name. Alias information is also exposed during POJO introspection, but has no effect during serialization where primary name is always used.
Examples:
  public class Info {
    @JsonAlias({ "n", "Name" })
    public String name;
  }
  
NOTE: Order of alias declaration has no effect. All properties are assigned in the order they come from incoming JSON document. If same property is assigned more than once with different value, later will remain. For example, deserializing
   public class Person {
      @JsonAlias({ "name", "fullName" })
      public String name;
   }
   
from
   { "fullName": "Faster Jackson", "name": "Jackson" }
   
will have value "Jackson".
Also, can be used with enums where incoming JSON properties may not match the defined enum values. For instance, if you have an enum called Size with values SMALL, MEDIUM, and LARGE, you can use this annotation to define alternate values for each enum value. This way, the deserialization process can map the incoming JSON values to the correct enum values.
Sample implementation:
public enum Size {
       @JsonAlias({ "small", "s", "S" })
       SMALL,
  
       @JsonAlias({ "medium", "m", "M" })
       MEDIUM,
  
       @JsonAlias({ "large", "l", "L" })
       LARGE
   }
During deserialization, any of these JSON structures will be valid and correctly mapped to the MEDIUM enum value: {"size": "m"}, {"size": "medium"}, or {"size": "M"}.
```

回到我们的例子，除了 `department` 和 `userlist` 之外还用到其它的 key，可以继续在 `@JsonAlias` 注解里添加。

这样，对不同的接口的封装，我们反序列化后统一 `getData()` 就可以获取到数据部分了，使用时不用再去操心数据部分的 key 是什么。

## 小结

有人总问，阅读别人源码的意义是什么，这也许就可以作为一个小例子吧。