---
layout: post
title: HashMap中为什么不同地址的String当key时是相同的
categories: JAVA基础
description: HashMap中为什么不同地址的String当key时是相同的
keywords: JAVA,HashMap
---
之前有看过 hashMap 的源码，hashMap 中存储时会对  key 取 hashCode 在存储。

*设计 hashCode() 时最重要的因素就是对同一个对象调用 hashCode() 都应该产生相同的值。*

但在 HashMap 中，不同地址但值相同的 String 对象 hashCode 也想等吗？

特地查了一下 String 取 hashCode 的源码：

``` java
/**
     * Returns a hash code for this string. The hash code for a
     * {@code String} object is computed as
     * <blockquote><pre>
     * s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
     * </pre></blockquote>
     * using {@code int} arithmetic, where {@code s[i]} is the
     * <i>i</i>th character of the string, {@code n} is the length of
     * the string, and {@code ^} indicates exponentiation.
     * (The hash value of the empty string is zero.)
     *
     * @return  a hash code value for this object.
     */
    public int hashCode() {
        int h = hash;
        if (h == 0 && value.length > 0) {
            char val[] = value;

            for (int i = 0; i < value.length; i++) {
                h = 31 * h + val[i];
            }
            hash = h;
        }
        return h;
    }
```

可以看到在 hash 确定的情况下，最终的 hashCode 的值是根据 String 中每个字符所确定的。故值相等的 String，hashCode 的值也想等。
