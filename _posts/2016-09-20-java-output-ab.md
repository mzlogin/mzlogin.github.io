---
layout: post
title: 一道在知乎很火的 Java 题——如何输出 ab
categories: Java
description: 一道在知乎讨论得很火热的 Java 题，网友们的脑洞能给出一些什么样的答案呢？
keywords: Java
---

这是一个源自知乎的话题，原贴链接：[一道百度的面试题，有大神会嘛？](https://www.zhihu.com/question/50801791)

虽然我不是大神，但我也点进去看了一下，思考了一会之后有了一些思路，然后去看其它人的答案的时候果然全都已经被各路大神们先想到并贴出来了，所以我就不去凑热闹写重复答案了，整理一下网友们的智慧在这里自娱自乐好了。

## 题目

![java-output-ab](/images/posts/java/output-ab.jpg)

## 思路一

作为一个多年前也见过不少笔试题的少年，看到这个题目的第一想法是脑筋急转弯——注入一段逻辑直接改变原 if 结构。

### 解法一

填入内容 `true){System.out.print("a");}if(false`。

```java
public void print() {
    if (true) {
        System.out.print("a");
    }

    if (false) {
        System.out.print("a");
    } else {
        System.out.print("b");
    }
}
```

类似地也可以填入 `true){System.out.print("ab");return;}if(false` 等。

当初大学时单纯的少年可是很难想出这样的套路的，时间改变了我们啊。

## 思路二

如果正经遵从题目的原代码结构，那就得想办法构造一段代码，既能输出 `a`，又能返回 `false`。

### 解法二

我也想到能否使用 `System.out.print` 的返回值来做文章，但奈何并不记得它返回什么，首先让我们复习一下 `PrintStream` 的 `print`、`println` 和 `printf` 方法的区别：

| 方法    | 功能               | 返回值      |
|---------|--------------------|-------------|
| print   | 打印一个值或者对象 | void        |
| println | 打印并换行         | void        |
| printf  | 格式化打印         | PrintStream |

所以适用的是 `printf`，它的返回值是 `PrintStream` 类型的 `System.out`，判它是否为空即可。

填入内容 `System.out.printf("a") == null`。

```java
public void print() {
    if (System.out.printf("a") == null) {
        System.out.print("a");
    } else {
        System.out.print("b");
    }
}
```

经测试填入 `System.out.append("a") == null` 也是可以达到效果的。

### 解法三

仍然是思路二，但从匿名内部类来作文章。

实现代码：

```java
public void print() {
    if (new Object() {
        boolean print() {
            System.out.print("a");
            return false;
        }
    }.print()) {
        System.out.print("a");
    } else {
        System.out.print("b");
    }
}
```

这里利用的知识点是匿名内部类可以声明基类没有的新方法并且马上调用。

### 解法四

使用 Java 8 里的 lambda 来实现思路二。

```java
public void print() {
    if (((BooleanSupplier)(() -> {System.out.print("a");return false;})).getAsBoolean()) {
        System.out.print("a");
    } else {
        System.out.print("b");
    }
}
```

严格来讲这个不一定能算作正确答案，因为要增加 `import java.util.function.BooleanSupplier;`。

## 脑洞大开

讲完严肃的解法，来看看网友 [穷小子](https://www.zhihu.com/people/qiong-xiao-zi-158) 开脑洞的思路：

```java
public void print() {
//    if ( ) {
        System.out.print("a");
//    } else {
        System.out.print("b");
//    }
}
```

如果没有特意说明只能在括号里加东西，倒真是个妙计！

同样看得我一愣一愣的还有 [caiwei](https://www.zhihu.com/people/caiwei710) 同学的答案，他和朋友们发现题目里少写了个大括号（真的），于是我们看到他的朋友老方的解决方案：

![add-brace](/images/posts/java/add-brace.jpg)

真是防不胜防啊~不过我喜欢！:+1:

## 参考

* [RednaxelaFX 的回答](https://www.zhihu.com/question/50801791/answer/122781965)
* [仓鼠君 的回答](https://www.zhihu.com/question/50801791/answer/122773831)
* [放开那女孩 的回答](https://www.zhihu.com/question/50801791/answer/122769426)
* [穷小子 的回答](https://www.zhihu.com/question/50801791/answer/122863062)
* [caiwei 的回答](https://www.zhihu.com/question/50801791/answer/122795854)
