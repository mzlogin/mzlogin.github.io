---
layout: wiki
title: JSON
cate1: Android
cate2:
description: JSON
keywords: Android
---

## gson

## FastJson

### 循环引用的问题

如果往一个 List 里多次添加了同一对象，在 `JSON.toJSONString` 时默认会被转换成这样：

```json
[
    {
        "k1": "v1",
        "k2": []
    },
    {"$ref": "$.paras[0]"},
    {"$ref": "$.paras[0]"},
    {"$ref": "$.paras[0]"},
    {"$ref": "$.paras[0]"},
    {"$ref": "$.paras[0]"},
    {"$ref": "$.paras[0]"},
    {"$ref": "$.paras[0]"},
    {"$ref": "$.paras[0]"},
    {"$ref": "$.paras[0]"},
    {"$ref": "$.paras[0]"},
    {"$ref": "$.paras[0]"},
    {"$ref": "$.paras[0]"}
]
```

我这里因为是误操作才往 List 里多次添加的，所以解决误操作就好了。

至于确实是真实意图的情况（可能一般前端才有？），可以参考 <http://blog.csdn.net/Singleton1900/article/details/50435247> 解决。

### boolean 的序列化字段命名

```java
public class Test {
    private boolean isTest;

    public boolean isTest() {
        return isTest;
    }

    public void setTest(boolean isTest) {
        this.isTest = isTest;
    }
}
```

这个类的对象在使用 `JSON.toJSONString` 方法时，`isTest` 字段名被改为了 `test`。

有几种方法可以解决：

1. 将字段名改为 test（符合 Java Bean）

2. 为字段名加上注解，标示它序列化的名字为 `isTest`

3. 使用 Gson

FastJson 项目里相关的讨论 Issue 如下：

<https://github.com/alibaba/fastjson/issues/278>
