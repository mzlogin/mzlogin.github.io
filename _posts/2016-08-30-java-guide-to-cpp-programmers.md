---
layout: post
title: C++ 程序员的 Java 指南
categories: Java
description: 一个 C++ 程序员自己总结的 Java 学习中应该注意的点。
keywords: C++, Java
---

这是一个 C++ 程序员自己总结的 Java 学习中应该注意的点。

## 缘起

因工作原因从 Windows 客户端开发转为 Android 客户端开发，所以主要的开发语言也由 C++ 变为了 Java，在学习 Java 的过程中，即享受到 Java 的自带程序库的丰富带来的便捷，也遇到一些与 C++ 里的习惯不符需要注意的地方。

初学时的计划是看完一本 Java 教材，过程中整理 C++ 程序员学习 Java 需要注意的点，然后对照写一篇《C++ 程序员的 Java 指南》，但最后懒癌犯了，只整理了一部分不同点，要形成一份「指南」还有很长的路要走，暂且把这个坑挖在这里，如果哪天心血来潮就填上。

一个知乎问答下有我的答案，与本篇文章内容同步：[习惯写C++的人突然转去写Java，会有什么样的坑？](https://www.zhihu.com/question/49770330/answer/118395115?from=profile_answer_card)

## 注意点

* char 是两个字节（字符及字符串默认都是 utf-16）。

* 浮点数默认是 double，所以要写成 float f = (float)5.0 或 5.0f，不然会报错。

* 整数除整数可能导致除零异常，而浮点数不会。

* break 和 continue 能够使用 flag 来跳出和继续指定循环。

* boolean 值只能是 true 和 false，不能从整形等其它值转换而来。用于字符串连接的时候会自动转换成「true」和「false」。

* if 里只能接受 boolean 值，所以 C++ 里的好习惯 if (5 == var) 在 Java 里不再必要，少写了一个 = 的时候 IDE 和编译器都会提示你。

* new Person(); 必须有 ()，否则编译不过。

* 数组的声明方式推荐 int[] nArray = new int[4]; 或者 int[] nArray = {1,2,3};，第一种称为动态初始化，第二种称为静态初始化。动态初始化时，系统按如下规则分配初始值：整形为 0，浮点型为 0.0，字符型为'\u0000'，布尔型为 false，引用类型为 null。

* 当系统加载类或创建该类的实例时，系统自动为成员变量分配内存空间，并在分配内存空间后，自动为成员变量指定初始值。

* 局部变量定义后，必须经过显式初始化后才能使用，系统不会为局部变量执行初始化。

* 访问控制符有 private、default、protected、public。private 只能在同一个类中访问，default 能在同一个类、同一个包中访问，protected 能在同一个类、同一个包、子类中访问，public 能在全局范围内访问。

* 在构造器中可以使用 this(params) 来调用本类的其它构造器，使用 super(params) 来调用父类构造器，只能书写在本构造器第一行，所以它们不能同时出现。

* 使用 super 调用父类中的实例方法，使用父类类名调用父类中的类方法。

* 如果父类方法具有 private 访问权限，则该方法对其子类是隐藏的，因此其子类无法访问和重写该方法。

* java 中有 instanceof 运算符，c++ 中对应的 RTTI 方式是（typeid）？instanceof 运算符的前一个操作数通常是一个引用类型的变量，后一个操作数通常是一个类（也可以是接口，可以把接口理解成一种特殊的类），它用于判断前面的对象是否是后面的类，或者其子类、实现类的实例。如果是，则返回 true，否则返回 false。判断是否是同一个类的实例时应使用 obj1.getClass()==obj2.getClass()。

* 初始化块和声明属性时指定初始值，这些按源程序中排列顺序执行。

* java 中只有值传递。

* 对 private 方法，即使它使用 final 修饰，在子类中也可以定义一个相同的，因为这是子类定义了一个新方法，并非重写。

* final 和 abstract 永远不能同时使用；static 和 abstrace 不能同时修饰某个方法；private 和 abstrace 不能同时修饰某个方法。

* java 中的 abstract 方法不能有方法体，c++ 中的 pure virtual 函数可以有实现。

* interface 的方法只能是 public abstract 的，属性只能是 public static final 的，使用 private 等修饰编译会报错。

* 从内部类里引用外部类的属性或者方法时，可以用命 OuterClass.this.。

* 非静态内部类里不能有静态成员。

* 内部类可以使用 static 修饰，外部类不行。

* 从外部类外创建内部非静态类的语法：OuterClass.InnerClass varName = OuterInstance.new InnerConstructor();
  从外部类外创建内部静态类的语法：OuterClass.InnerClass varName = new OuterClass.InnerConstructor();

* 内部类不可能被外部类的子类中重写，因为命名空间不同。

* 纠误一处：《疯狂 Java 讲义》P214 讲道「如果匿名内部类需要访问外部类的局部变量，则必须使用 final 修饰符来修饰外部类的局部变量，否则系统将报错。经验证，只要这个局部变量在后续不改变其值，即使它不以 final 修饰，但实际表现是有效的 final 时，在 Java 8 环境下编译后会自动为它加上 final，不报错。

* switch 表达式可以使用整形或者枚举类实例（从 Java 7 开始，可以使用 String 对象了，参考：[Strings in switch Statements](http://docs.oracle.com/javase/7/docs/technotes/guides/language/strings-switch.html)）。

* Set 判断两个对象是否相同不是使用 == 运算符，而是根据 equals 方法。

* HashSet 判断两个元素相等的标准是两个对象通过 equals 方法比较相等，并且两个对象的 hashCode() 方法返回值也相等。

* foreach 循环仅适用于实现了 Iterable 接口的 Java array 和 Collection 类。

* 遍历任何 Collection（例如 Map、Set 或 List）时要删除元素只能使用 Iterator 的 remove 方法。

* 包名不能使用关键字，比如 switch 和 return 等，参见 [7.4.1. Named Packages](http://docs.oracle.com/javase/specs/jls/se8/html/jls-7.html#jls-7.4.1) 和 [3.8. Identifiers](http://docs.oracle.com/javase/specs/jls/se8/html/jls-3.html#jls-Identifier)。
