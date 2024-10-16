---
layout: post
title: Java｜在 IDEA 里自动生成 MyBatis 模板代码
categories: [Java]
description: 除了使用 MyBatis Generator，还可以在 IDEA 里自定义代码生成器，实现自动生成 MyBatis 模板代码。
keywords: 后端, Java, MyBatis, IDEA, 代码生成器
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

## 背景

基于 MyBatis 开发的项目，新增数据库表以后，总是需要编写对应的 Entity、Mapper 和 Service 等等 Class 的代码，这些都是重复的工作，我们可以想一些办法来自动生成这些代码。

## 方案

一种可选的方案是使用 MyBatis Generator，官方支持，常见需求一般也都能满足。但是它的配置文件比较繁琐，如果有一些项目相关的个性化需求，不一定很好处理。

这里介绍另外一种我觉得更为简便灵活的方法。

近几年版本的 IDEA 里已经自带了 Database Tools and SQL 插件，可以连接数据库进行常用的操作，并且，它还自带了数据库表对应 POJO 类的代码生成器：在 Database 面板里配置好数据源以后，右键表名，依次选择 Scripted Extensions、Generate POJOs.groovy，选择生成路径后，即可生成对应的 Entity 类。

![](/images/posts/java/generate-pojos.png)

既然能够生成 Entity，那么我们可以基于它进行修改，让它一次性生成我们需要的 Entity、Mapper 和 Service。

## 需求

基于项目情况，我们对生成的代码有如下要求：

1. Entity 需要继承指定基类，数据库表的公共字段放在基类里；
2. Mapper、Service 和 ServiceImpl 分别需要实现指定的类继承关系；
3. Entity、Mapper 和 Service 需要自动放在对应的子包下。

以 t_promotion_channel 表为例，指定该表和对应的代码目录之后，生成的目录结构如下：

```
.
├── entity
│   └── PromotionChannel.java
├── mapper
│   └── PromotionChannelMapper.java
└── service
    ├── PromotionChannelService.java
    └── impl
        └── PromotionChannelServiceImpl.java
```

需要生成的代码如下：

*entity/PromotionChannel.java*

```java
package com.test.data.promotion.entity;

import com.test.common.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import javax.persistence.Table;

/**
 * @author mazhuang
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Table(name = "t_promotion_channel")
public class PromotionChannel extends BaseEntity {

    private static final long serialVersionUID = 5495175453870776988L;
    /**
     * 用户ID
     */
    private Long fkUserId;

    /**
     * 渠道名称
     */
    private String channelName;

}
```

*mapper/PromotionChannelMapper.java*

```java
package com.test.data.promotion.mapper;

import com.test.common.base.BaseMapper;
import com.test.data.promotion.entity.PromotionChannel;

/**
 * @author mazhuang
 */
public interface PromotionChannelMapper extends BaseMapper<PromotionChannel> {

}
```

*service/PromotionChannelService.java*

```java
package com.test.data.promotion.service;

import com.test.common.base.BaseService;
import com.test.data.promotion.entity.PromotionChannel;

/**
 * @author mazhuang
 */
public interface PromotionChannelService extends BaseService<PromotionChannel> {

}
```

*service/impl/PromotionChannelServiceImpl.java*

```java
package com.test.data.promotion.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.test.common.base.BaseServiceImpl;
import com.test.data.promotion.entity.PromotionChannel;
import com.test.data.promotion.mapper.PromotionChannelMapper;
import com.test.data.promotion.service.PromotionChannelService;

/**
 * @author mazhuang
 */
@Slf4j
@Service
public class PromotionChannelServiceImpl extends BaseServiceImpl<PromotionChannelMapper, PromotionChannel> implements PromotionChannelService {

}
```

## 实现

右键一个数据库表，依次选择 Scripted Extensions、Go to Scripts Directory，进入生成的脚本目录，找到 Generate POJOs.groovy，复制一份，重命名为 Generate MyBatis Code.groovy，然后修改内容如下：

```groovy
import com.intellij.database.model.DasTable
import com.intellij.database.util.Case
import com.intellij.database.util.DasUtil

/*
 * Available context bindings:
 *   SELECTION   Iterable<DasObject>
 *   PROJECT     project
 *   FILES       files helper
 */

typeMapping = [
        (~/(?i)int/)                      : "Long",
        (~/(?i)float|double|decimal|real/): "BigDecimal",
        (~/(?i)datetime|timestamp/)       : "java.util.Date",
        (~/(?i)date/)                     : "java.sql.Date",
        (~/(?i)time/)                     : "java.sql.Time",
        (~/(?i)/)                         : "String"
]

FILES.chooseDirectoryAndSave("Choose directory", "Choose where to store generated files") { dir ->
    SELECTION.filter { it instanceof DasTable }.each { generate(it, dir) }
}

def generate(table, dir) {
    def className = javaName(table.getName().replaceFirst('t_', ''), true)
    def fields = calcFields(table)

    dirPath = dir.getAbsolutePath()
    packageName = calcPackageName(dirPath)

    // Generate POJO
    new File(dirPath + File.separator + "entity", className + ".java").withPrintWriter("utf-8") { out -> generateEntity(out, table.getName(), className, fields, packageName) }

    // Generate Mapper
    new File(dirPath + File.separator + "mapper", className + "Mapper.java").withPrintWriter("utf-8") { out -> generateMapper(out, className, packageName) }

    // Generate Service
    new File(dirPath + File.separator + "service", className + "Service.java").withPrintWriter("utf-8") { out -> generateService(out, className, packageName) }

    // Generate ServiceImpl
    new File(dirPath + File.separator + "service" + File.separator + "impl", className + "ServiceImpl.java").withPrintWriter("utf-8") { out -> generateServiceImpl(out, className, packageName) }
}

static def generateEntity(out, tableName, className, fields, packageName) {
    out.println "package $packageName" + ".entity;"
    out.println ""
    out.println "import com.test.common.base.BaseEntity;"
    out.println "import lombok.Data;"
    out.println "import lombok.EqualsAndHashCode;"
    out.println "import javax.persistence.Table;"
    out.println ""
    out.println "/**\n * @author mazhuang\n */"
    out.println "@EqualsAndHashCode(callSuper = true)"
    out.println "@Data"
    out.println "@Table(name = \"$tableName\")"
    out.println "public class $className extends BaseEntity {"
    out.println ""

    def baseEntityFields = ['pkid', 'addedBy', 'addedTime', 'lastModifiedBy', 'lastModifiedTime', 'valid']
    fields.each() {
        if (baseEntityFields.contains(it.name)) {
            return
        }
        if (it.annos != "") out.println "  ${it.annos}"
        if (it.comment != null) out.println "    /**\n     * ${it.comment}\n     */"
        out.println "    private ${it.type} ${it.name};\n"
    }

    out.println "}"
}

static def generateMapper(out, className, packageName) {
    out.println "package $packageName" + ".mapper;"
    out.println ""

    out.println "import com.test.common.base.BaseMapper;"
    out.println "import $packageName" + ".entity.$className;"
    out.println ""

    out.println "/**\n * @author mazhuang\n */"
    out.println "public interface $className" + "Mapper extends BaseMapper<$className> {"
    out.println ""
    out.println "}"
}

static def generateService(out, className, packageName) {
    out.println "package $packageName" + ".service;"
    out.println ""

    out.println "import com.test.common.base.BaseService;"
    out.println "import $packageName" + ".entity.$className;"
    out.println ""

    out.println "/**\n * @author mazhuang\n */"
    out.println "public interface $className" + "Service extends BaseService<$className> {"
    out.println ""
    out.println "}"
}

static def generateServiceImpl(out, className, packageName) {
    out.println "package $packageName" + ".service.impl;"
    out.println ""

    out.println "import lombok.extern.slf4j.Slf4j;"
    out.println "import org.springframework.stereotype.Service;"
    out.println "import com.test.common.base.BaseServiceImpl;"
    out.println "import $packageName" + ".entity.$className;"
    out.println "import $packageName" + ".mapper.$className" + "Mapper;"
    out.println "import $packageName" + ".service.$className" + "Service;"
    out.println ""

    out.println "/**\n * @author mazhuang\n */"
    out.println "@Slf4j"
    out.println "@Service"
    out.println "public class $className" + "ServiceImpl extends BaseServiceImpl<$className" + "Mapper, $className> implements $className" + "Service {"
    out.println ""
    out.println "}"
}

def calcFields(table) {
    DasUtil.getColumns(table).reduce([]) {
        fields, col ->
            def spec = Case.LOWER.apply(col.getDataType().getSpecification())
            def typeStr = typeMapping.find { p, t -> p.matcher(spec).find() }.value
            fields += [[
                               name   : javaName(col.getName(), false),
                               type   : typeStr,
                               comment: col.getComment(), // 注释
                               default: col.getDefault(), // 默认值
                               annos  : ""]]

    }
}

static def calcPackageName(dirPath) {
    def startPos = dirPath.indexOf('com')
    return dirPath.substring(startPos).replaceAll(File.separator, ".")
}

def javaName(str, capitalize) {
    def s = com.intellij.psi.codeStyle.NameUtil.splitNameIntoWords(str)
            .collect { Case.LOWER.apply(it).capitalize() }
            .join("")
            .replaceAll(/[^\p{javaJavaIdentifierPart}[_]]/, "_")
    capitalize || s.length() == 1 ? s : Case.LOWER.apply(s[0]) + s[1..-1]
}
```

大功告成，现在右键一个数据库表，依次选择 Scripted Extensions、Generate MyBatis Code.groovy，在弹出的目录选择框里选择想要放置代码的目录，即可生成期望的模板代码了。

后续如果有一些个性化的代码生成需求，可以根据实际情况修改、新增脚本来完成。

## 其它

本文代码生成器脚本已上传至 GitHub，仓库地址：<https://github.com/mzlogin/code-generator>，以后如果有更新，或者新的代码生成脚本，也会放在这个仓库里。