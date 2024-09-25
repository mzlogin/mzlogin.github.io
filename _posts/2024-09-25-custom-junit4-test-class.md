---
layout: post
title: Java｜让 JUnit4 测试类自动注入 logger 和被测 Service
categories: [Java]
description: IDEA 自动生成的 JUnit4 测试类，可以通过自定义模板，自动注入 logger 和被测 Service。
keywords: Java, JUnit4, 测试类, logger, Service
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

本文介绍如何通过自定义 IDEA 的 JUnit4 Test Class 模板，实现生成测试类时自动注入 logger 和被测 Service。

## 背景

在 IntelliJ IDEA 中，通过快捷键可以快速生成 JUnit4 测试类，但是生成测试类以后，总是需要手动添加 logger 和被测 Service 的注入。虽然这是一个很小的「重复动作」，但程序员还是不能忍（*其实已经忍了很多年了*）。

## 需求

以给如下简单的 Service 生成测试类为例：

```java
package com.test.data.user.service;

import com.test.common.base.BaseService;
import com.test.data.user.entity.UserSource;

/**
 * @author mazhuang
 */
public interface UserSourceService extends BaseService<UserSource> {

    /**
     * 记录用户来源
     * @param userId -
     * @param threadId -
     */
    void recordUserSource(Long userId, Long threadId);
}
```

<kbd>command + n</kbd> 调出 Generate 菜单，然后选择 Test，配置测试类的名称、基类和包：

![](/images/posts/java/idea-generate-junit4-test-class.png)

默认生成的测试类如下：

```java
package com.test.data.user.service;

import static org.junit.Assert.*;

import com.test.BaseTests;
import org.junit.Test;

/**
 * @author mazhuang
 */
public class UserSourceServiceTest extends BaseTests {
    @Test
    public void recordUserSource() {
    }
}
```

然而在写测试用例的过程中，总是需要用到 logger 和 Service，所以期望中的测试类默认长这样：

```java
package com.test.data.user.service;

import static org.junit.Assert.*;

import com.test.BaseTests;
import org.junit.Test;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author mazhuang
 */
@Slf4j
public class UserSourceServiceTest extends BaseTests {

    @Autowired
    private UserSourceService userSourceService;

    @Test
    public void recordUserSource() {
    }
}
```

## 方案与实现

经过一番 search，发现 IDEA 的 Preference - Editor - File and Code Templates 的 Code 里有一个 JUnit4 Test Class，可以自定义生成 JUnit4 测试类的模板。

这个模板原始内容是这样的：

```velocity
import static org.junit.Assert.*;
#parse("File Header.java")
public class ${NAME} {
  ${BODY}
}
```

基于我们的需求，将其修改为以下内容即可：

```velocity
#set( $LastDotIndex = $CLASS_NAME.lastIndexOf(".") + 1 )
#set( $CamelCaseName = "$CLASS_NAME.substring($LastDotIndex)" )
#set( $CamelCaseName = "$CamelCaseName.substring(0, 1).toLowerCase()$CamelCaseName.substring(1)")

import static org.junit.Assert.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
#parse("File Header.java")
@Slf4j
public class ${NAME} {

    @Autowired
    private ${CLASS_NAME} ${CamelCaseName};
  ${BODY}
}
```

其中，`${CLASS_NAME}` 是被测试类的全限定名，`${CamelCaseName}` 是根据 `${CLASS_NAME}` 生成的被测试类的驼峰命名。

至此，经过一点微小的努力，我们实现了一个小小的自动化，工作效率又提高了一点点，程序员又开心了一点点。

## 小结

察觉到重复动作，并消除——也许可以称之为「偷懒」，这是程序员的日常小乐趣，也是 *人类进步的动力* 吧。

文中完整脚本已上传至 GitHub，仓库地址：<https://github.com/mzlogin/code-generator> ，以后如果有更新，或者新的代码生成脚本，也会放在这个仓库里。