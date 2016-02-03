---
layout: post
title: C++ 语言基础
categories: Basis
description: 面试过程中得到遇到的一些 C++ 语言基础试题。
keywords: C++
---

面试中遇到的 C++ 语言基础试题。

1. new 与 malloc 的区别

   (1)new 是 C++ 操作符，malloc 是 C 库函数。

   (2)对于非内部数据结构的对象而言，malloc 无法满足动态对象的要求。对象在创建的同时要自动执行构造函数，对象在消亡之前要自动执行析构函数，由于 malloc 是库函数而不是运算符，不在编译器的控制权限之内，不能够把执行构造函数和析构函数的任务强加于 malloc/free。

   (3)new 可以认为是 malloc 加构造函数的执行。

   (4)new 出来的是对象，而 malloc 出来的是 `(void *)`

1. 如何禁用掉拷贝构造函数与赋值操作符?

   在类里声明但是不定义。禁用后可以防止”浅拷贝”。

   附：浅拷贝指当一个类里有指针成员指向 new 出来的数据时，当用一个对象来初始化另一个对象的时候，若将数据重新 new 一个，则为深拷贝，否则为浅拷贝。浅拷贝容易造成的问题是当一个对象析构后另一个对象访问该指针会出问题。

   调用拷贝构造函数的情况:(1)一个对象以值传递的方式传入函数体(2)一个对象以值传递的方式从函数返回(3)一个对象定义时需要通过另一个对象进行初始化。

1. 一个空类，编译器会默认为它加上什么东西?

   (1)默认构造函数

   (2)拷贝构造函数

   (3)析构函数

   (4)赋值运算符

1. C++ 中向函数传递参数的方式

   (1)值传递

   (2)指针传递

   (3)引用传递

1. 666 个苹果，10 个箱子，如何放能让客人买 1-666 个苹果都直接给若干箱子就行了。

   1,2,4,8,16,32,64,128,256,155.(用程序如何实现?)

1. 二叉树的结点定义和求叶子数

   结点{数据，左右孩子指针}

   求叶子数：递归解决。

   ```cpp
   template<typename T>
   class BinTreeNode
   {
   public:
       T m_data;
       BinTreeNode* m_pLeftChild;
       BinTreeNode* m_pRightChild;

       BinTreeNode(T data): m_data(data), m_pLeftChild(NULL), m_pRightChild(NULL) {}
       ~BinTreeNode() {}
   };

   template<typename T>
   int GetLeafCount(BinTreeNode<T>* pRoot)
   {
       if (NULL == pRoot)
       {
           return 0;
       }
       else if (NULL == pRoot->m_pLeftChild && NULL == pRoot->m_pRightChild)
       {
           return 1;
       }
       else
       {
           return GetLeafCount(pRoot->m_pLeftChild)+GetLeafCount(pRoot->m_pRightChild);
       }
   }
   ```

1. 什么时候调用拷贝构造函数？什么时候调用赋值运算符？

   如果在进行赋值操作时目标对象已经取得内存，则调用赋值运算符；如果赋值操作与目标对象的内存分配是一起进行的，则调用拷贝构造函数。见如下代码：

   ```cpp
   #include <iostream>
   using namespace std;

   class demo
   {
   public:
       demo() { cout << "default constructor" << endl; }
       demo(const demo& d) { cout << "copy constructor" << endl; }
       demo& operator=(const demo& d) { cout << "= operator" << endl; }
       ~demo() {}
   };

   int main()
   {
       demo A;
       demo B;
       B = A;
       demo C = A;

       return 0;
   }
   ```

   输出结果：

   ```
   default constructor
   default constructor
   = operator
   copy constructor
   ```
