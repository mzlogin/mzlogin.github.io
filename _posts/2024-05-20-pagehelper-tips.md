---
layout: post
title: Java｜PageHelper 怎么自作主张帮我分页？
categories: [Java]
description: 我没有指定这个查询要分页，但是 PageHelper 自作主张帮我分页了，这是怎么回事？
keywords: Java, PageHelper
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

开局上来，我们先看看问题场景的示例代码：

```java
public Page<Xxx> queryXxxList(XxxPageReq req) {

    // some code here

    // 查询一，得到一个结果集，作为查询二的条件
    List<Long> fkIdList = xxxMapper.queryFkIdList(req);
    req.setFkIdList(idList);

    PageHelper.startPage(req.getPageNum(), req.getPageSize());

    // 查询二
    List<Xxx> data = xxxMapper.queryXxxList(req);

    // some code here

}
```

**预期** 的逻辑是：查询一不分页，得到一个结果集，作为查询二的条件，查询二分页。

**实际** 的现象是：查询一被自动添加了 limit，最多只能查询到 10 条数据（示例 req 里的 pageSize 传的 10），导致查询二的查询条件不正确。

## 分析

初遇到这个问题时，一脸黑人问号，冷静下来后，分析了以下几种可能性，但都一一排除了。

- 调用当前方法的线程里，已经有其它地方先调用了 PageHelper.startPage()，导致当前方法里的查询一也被分页了；
- 调用当前方法的线程，上一次调度时设置的分页参数没有被清理；
- 无厘头的猜想：当前方法是不是在一个大的事务里，而 PageHelper 有什么特殊处理，导致一个事务里的查询都会被分页？

最后通过在 PageInterceptor 里下断点发现了问题所在：

```java
@Override
public Object intercept(Invocation invocation) throws Throwable {
    // some code here 

    //调用方法判断是否需要进行分页，如果不需要，直接返回结果
    if (!dialect.skip(ms, parameter, rowBounds)) {
        // 自动 count 和 分页查询处理
    } else {
        // 跳过 count 和 分页查询处理
    }
    // some code here
}
```

单步跟进 `dialect.skip` 方法，关键逻辑在 `PageParams.getPage` 方法里面：

```java
public Page getPage(Object parameterObject, RowBounds rowBounds) {
    Page page = PageHelper.getLocalPage();
    if (page == null) {
        if (rowBounds != RowBounds.DEFAULT) {
            if (offsetAsPageNum) {
                page = new Page(rowBounds.getOffset(), rowBounds.getLimit(), rowBoundsWithCount);
            } else {
                page = new Page(new int[]{rowBounds.getOffset(), rowBounds.getLimit()}, rowBoundsWithCount);
                //offsetAsPageNum=false的时候，由于PageNum问题，不能使用reasonable，这里会强制为false
                page.setReasonable(false);
            }
        } else if(supportMethodsArguments){
            // 注意这里，我们的查询一进了这个分支
            try {
                page = PageObjectUtil.getPageFromObject(parameterObject, false);
            } catch (Exception e) {
                return null;
            }
        }
        if(page == null){
            return null;
        }
        PageHelper.setLocalPage(page);
    }
    // some code here
}
```

可以看到，除了显式地提前调用 PageHelper.startPage、传递 rowBounds 参数进行分页外，还有一个 `else if(supportMethodsArguments)` 的分支，会从传递给查询的参数里尝试读取 `pageNum` 和 `pageSize` 字段的值作为分页参数。

随后我查阅了 PageHelper 的官方文档，果然找到了相关的说明：

> supportMethodsArguments：支持通过 Mapper 接口参数来传递分页参数，默认值 false，分页插件会从查询方法的参数值中，自动根据上面 params 配置的字段中取值，查找到合适的值时就会自动分页。 使用方法可以参考测试代码中的 com.github.pagehelper.test.basic 包下的 ArgumentsMapTest 和 ArgumentsObjTest。

<https://github.com/pagehelper/Mybatis-PageHelper/blob/master/wikis/zh/HowToUse.md>

那么，为什么我们项目里的 `supportMethodsArguments` 会为 true 呢？在代码里没有搜索到，最终在 Apollo 配置中心找到了 `pagehelper.supportMethodsArguments = true`。

**破案了。**

## 解决

找到问题就好解决了。因为将 `pagehelper.supportMethodsArguments = true` 这个配置去掉影响太大不可控，所以此处只是将查询一的参数去掉分页字段即可。

修改后：

```java
public Page<Xxx> queryXxxList(XxxPageReq req) {

    // some code here

    // 查询一，得到一个结果集，作为查询二的条件
    // XxxNoPageReq 与 XxxPageReq 里的字段一样，除了没有 pageSize 和 pageNum
    XxxNoPageReq noPageReq = new XxxNoPageReq();
    BeanUtils.copyProperties(req, noPageReq);
    List<Long> fkIdList = xxxMapper.queryFkIdList(noPageReq);

    // some code here

}
```

## 小结

修完老代码里的这个问题，我无奈地笑了。真是前人挖坑，后人被坑啊……

开个玩笑。

这严格来说，其实并不能算一个问题，包括解决它需要走的那些弯路，都只能归咎于对 PageHelper 的用法，以及项目的配置，了解不完全。

码途漫漫，上下求索。