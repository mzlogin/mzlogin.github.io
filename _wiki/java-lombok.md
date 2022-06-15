---
layout: wiki
title: Lombok
cate1: Java
cate2:
description: Lombok 的一些笔记
keywords: Lombok
type:
link:
---

## Lombok 配合 Hibernate 注解实体类

主要是利用 `@Getter` 注解的 `onMethod` 属性，官方注释：

```java
/**
 * Any annotations listed here are put on the generated method.
 * The syntax for this feature depends on JDK version (nothing we can do about that; it's to work around javac bugs).<br>
 * up to JDK7:<br>
 *  {@code @Getter(onMethod=@__({@AnnotationsGoHere}))}<br>
 * from JDK8:<br>
 *  {@code @Getter(onMethod_={@AnnotationsGohere})} // note the underscore after {@code onMethod}.
 *  
 * @return List of annotations to apply to the generated getter method.
 */
```

示例：

```java
@Data
@Entity
@Table(name = "t_user")
public class User {

    @Getter(onMethod_ = {
        @Id,
        @GeneratedValue(strategy = GenerationType.IDENTITY),
        @Column(name = "id", unique = true, nullable = false)
    })
    private Long id;

    @Getter(onMethod_ = {
        @Column(name = "gmt_create")
    })
    private Timestamp gmtCreate;

    @Getter(onMethod_ = {
        @Column(name = "gmt_modified")
    })
    private Timestamp gmtModified;

    @Getter(onMethod_ = {
        @Column(name = "name")
    })
    private String name;

    @Getter(onMethod_ = {
        @Column(name = "status")
    })
    private Integer status;
}
```
