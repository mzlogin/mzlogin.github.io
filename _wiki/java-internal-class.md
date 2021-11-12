---
layout: wiki
title: 内部类
cate1: Java
cate2:
description: 内部类
keywords: Android
---

内部类的优点是：内部类可以访问外部类的私有成员变量，而不需要 new 外部类的对象。

内部类又分为：静态内部类、成员内部类、局部内部类和匿名内部类。

静态内部类：只可以访问外部类的静态成员变量和静态成员方法。

成员内部类：可以访问它的外部类的所有成员变量和方法，不管是静态的还是非静态的都可以。

局部内部类：像局部变量一样，不能被 public、private、protected 和 static 修饰，只能访问方法中定义为 final 类型的变量。

匿名内部类：匿名内部类就是没有名字的局部内部类，不使用关键字 class、extends 和 implements，没有构造方法。匿名内部类隐匿地继承了一个父类或者实现一个接口。匿名内部类使用得比较多，通常是作为一个方法参数。

## 参考

* <http://www.cnblogs.com/nerxious/archive/2013/01/24/2875649.html#3228810>
