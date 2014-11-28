---
layout: post
title: C++程序员的Java指南(1)
categories: java
---

###java与c++的不同点

* char是两个字节（字符及字符串默认都是utf-16）。

* 浮点数默认是double，所以要写成float f = (float)5.0，不然会报错。

* 整数除整数会导致除零异常，而浮点数不会。

* break和continue能够使用flag来跳出和继续指定循环。

* boolean值只能是true和false，不能从整形等其它值转换而来。用于字符串连接的时候会自动转换成“true”和“false”。

* new Person(); 必须有()，否则编译不过。

* 数组的声明方式推荐int[] nArray = new int[4];或者int[] nArray = {1,2,3};，第一种称为动态初始化，第二种称为静态初始化。动态初始化时，系统按如下规则分配初始值：整形为0，浮点型为0.0，字符型为'\u0000'，布尔型为false，引用类型为null。

* 当系统加载类或创建该类的实例时，系统自动为成员变量分配内存空间，并在分配内存空间后，自动为成员变量指定初始值。

* 局部变量定义后，必须经过显式初始化后才能使用，系统不会为局部变量执行初始化。

* 访问控制符有private、default、protected、public。private只能在同一个类中访问，default能在同一个类、同一个包中访问，protected能在同一个类、同一个包、子类中访问，public能在全局范围内访问。

* 在构造器中可以使用this(params)来调用本类的其它构造器，使用super(params)来调用父类构造器，只能书写在本构造器第一行，所以它们不能同时出现。

* 使用super调用父类中的实例方法，使用父类类名调用父类中的类方法。

* 如果父类方法具有private访问权限，则该方法对其子类是隐藏的，因此其子类无法访问和重写该方法。

* java中有instanceof运算符，c++中对应的RTTI方式是（typeid）？instanceof运算符的前一个操作数通常是一个引用类型的变量，后一个操作数通常是一个类（也可以是接口，可以把接口理解成一种特殊的类），它用于判断前面的对象是否是后面的类，或者其子类、实现类的实例。如果是，则返回true，否则返回false。判断是否是同一个类的实例时应使用obj1.getClass()==obj2.getClass()。

* 初始化块和声明属性时指定初始值，这些按源程序中排列顺序执行。

* java中只有值传递。

* 对private方法，即使它使用final修饰，在子类中也可以定义一个相同的，因为这是子类定义了一个新方法，并非重写。

* final和abstract永远不能同时使用；static和abstrace不能同时修饰某个方法；private和abstrace不能同时修饰某个方法。

* java中的abstract方法不能有方法体，c++中的pure virtual函数可以有实现。

* interface的方法只能是public abstract的，属性只能是public static final的，使用private等修饰编译会报错。

* 从内部类里引用外部类的属性或者方法时，可以用命OuterClass.this.。

* 非静态内部类里不能有静态成员。

* 内部类可以使用static修饰，外部类不行。

* 从外部类外创建内部非静态类的语法：OuterClass.InnerClass varName = OuterInstance.new InnerConstructor();  
  从外部类外创建内部静态类的语法：OuterClass.InnerClass varName = new OuterClass.InnerConstructor();

* 内部类不可能被外部类的子类中重写，因为命名空间不同。

* 纠误一处：《疯狂Java讲义》P214讲道“如果匿名内部类需要访问外部类的局部变量，则必须使用final修饰符来修饰外部类的局部变量，否则系统将报错。经验证，在Java 8环境下不报错。

* switch表达式可以使用整形或者枚举类实例。
