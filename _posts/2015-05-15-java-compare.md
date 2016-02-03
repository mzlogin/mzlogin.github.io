---
layout: post
title: Java 中的比较运算符
categories: Java
description: Java 中的比较运算符里有没有什么陷阱呢？
keywords: Java, Compare
---

小菜鸟才学习 Java 没多久，这天要写一个存储长整形的列表，于是这样写：

```java
List<long> listData = new ArrayList<long>();
```

这时 Android Studio 不高兴了，在 long 下面打上红色波浪线，然后提示小菜鸟：

```
Type argument cannot be of primitive type
```

赶紧进 List 的定义看了一下，发现类型参数必须是引用类型，不能用原始数值类型。

于是就改为：

```java
List<Long> listData = new ArrayList<Long>();
```

这时 Android Studio 不说什么了，于是小菜鸟很开心地继续往下写，往 listData 里添加了一些 long 类型的值，并且给它们排了序，如果发现它们中有相邻并且不相等的元素后执行一些操作：

```java
int size = listData.size();
for (int i = 1; i < size; i++) {
    if (listData.get(i - 1) != listData.get(i)) {
        // do something
    }
}
```

这时 Android Studio 貌似又不高兴了，在 `!=` 上加上黄底色，指上去一看显示：

```
Number objects are compared using '!=', not 'equals()'
```

小菜鸟不高兴了，我比较两个 long 类型都非得用方法，不能用操作符了吗？（他脑子里的定势一直以为 List 的类型参数还是 long 呢），Java 就是比 C++ 矫情。想想 IDE 这里只是警告，并不是错误，所以也不加理会继续完成他的代码去了。

但是到后来怎么运行结果都不太对，明明给 List 里添加的元素里有相等的，有些情况下应该不进入 if 才对，可是却每次比较完都进了 if。百思不得其解之后想起了 Android Studio 的警告，然后把 `!=` 改成 `!list.get(i -1).equals(listData.get(i))`，立马就好了。

小菜鸟惭愧极了，基础不牢靠啊，赶紧翻出自己的 Java 入门书对应的章节看了一下，看完才恍然大悟，原来 Java 里的比较运算符里还有这么多小细节呢……不是把 C++ 里的经验直接照搬过来就行了的。

### Java 比较运算符里的一些细节

* `>`、`>=`、`<` 和 `<=` 只支持两边操作数都是数值类型。
* `==` 和 `!=` 两边的操作数可以都是数值类型，也可以都是引用类型，但必须是同一个类的实例。
* 当 `obj1` 和 `obj2` 引用同一个对象时，则 `obj1 == obj2`，否则 `obj1 != obj2`。
* 每种数值类型都有对应的包装类，比如 long 的包装类 Long。包装类的实例可以与数值型的值比较，是直接取出包装类实例所包装的数值来比较的。
* 涉及自动装箱后情况复杂了一些，比如

  ```java
  Integer ina = 18;
  Integer inb = 18;

  Integer inc = 188;
  Integer ind = 188;
  ```

  这时 `ina == inb` 成立，而 `inc == ind` 不成立。

  原因是在 java.lang.Integer 类里，对 -128~127 之间的整数自动装箱成 Integer 实例，并且缓存了起来，所以对此范围内的整数自动装箱时，实际上都指向了缓存里的对象，所以会出现上面的情况。

  与此类似的是 String 类型也会对诸如 `String stra = "Hello";` 这样的直接赋值创建的实例进行缓存。

### 最佳实践

* 引用类型实例之间，除非想要知道是否是引用同一个对象，否则它们之间的比较，总是使用 `equals()` 方法。

### 参考

《疯狂 Java 讲义》——李刚著 第 3.7.5 节 比较运算符。
