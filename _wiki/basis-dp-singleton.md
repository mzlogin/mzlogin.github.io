---
layout: wiki
title: 单例模式
cate1: Basis
cate2: 设计模式
description: 单例模式
keywords: Basis
---

## 解决的问题

1. 限制唯一实例

2. 提供一种易于全局访问实例的方式

## 与静态类的比较

1. 什么时候使用静态类更好

    比如 java.lang.Math 类这种工具类，不维护任何状态，仅提供全局的方法访问，这个时候用静态类更好，因为方法调用都是编译期绑定。

    不建议使用静态类维护状态信息，特别是在并发环境下容易出现 race condition。

2. 静态类和单例之间的区别

    * 静态类有更好的性能，因为方法调用都是编译期绑定。
    * 如果需要维护状态，使用单例更合适。
    * 如果对象很大，单例可以懒加载。

3. 单例的优势

    更加面向对象。可以通过继承基类和实现接口，享受继承和多态的便利。

如果只是需要一系列静态方法的集合时，使用静态类，其它情况下使用单例。

## 参考

* [Difference between Singleton Pattern vs Static Class in Java](http://javarevisited.blogspot.com/2013/03/difference-between-singleton-pattern-vs-static-class-java.html)
