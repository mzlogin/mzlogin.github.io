---
layout: post
title: 对象内存结构及虚函数表分析
categories: CPlusPlus
description: C++ 对象结构模型与虚函数表的实例解析。
keywords: C++
---

最近抽空浏览了一遍《COM 原理与应用》，一本老书了，COM 技术在我工作中运用得不多，但是接口设计规范和标准这一套东西还是能带给我一些有用的实践经验和启发的。在读到第二章《COM 对象和接口》的时候，看到虚函数表的一些相关知识，这些之前倒是也都知道，但是从来没有试着自己描述过，所以老觉得理解得不够彻底，那么……就试着结合一些小的代码段描述一下看，权当笔记加深记忆。

*以下代码及运行结果基于 Win7_64 + GCC 4.7.2 环境，其它环境下可能程序运行结果等有出入，但是原理相通。*

**目录**

* TOC
{:toc}

### 无继承类对象的内存结构

先来看看有与没有虚函数的类的对象的内存结构的不同之处：

**无虚函数的对象**

内存结构：

![Object with no virtual function](/images/posts/cplusplus/objectwithnovirtual.png)

验证如下：

```c++
#include <stdio.h>

class CObj
{
public:
    CObj(int nData1, int nData2) : m_nData1(nData1), m_nData2(nData2) {}
    ~CObj() {}

    void Func() { printf("CObj::Func()\n"); }

private:
    int m_nData1;
    int m_nData2;
};

int main()
{
    CObj obj(11 ,22);

    return 0;
}
```

来看看 obj 的实际内存分布：

![Object with no virtual function](/images/posts/cplusplus/objectwithnovirtual_mem.png)

小结：

* 数据成员按声明顺序排列

**有虚函数的对象**

内存结构：

![Object with virtual functions](/images/posts/cplusplus/objectwithvirtual.png)

验证如下：

```cpp
#include <stdio.h>

class CObj
{
public:
    CObj(int nData1, int nData2) : m_nData1(nData1), m_nData2(nData2) {}
    ~CObj() {}

    virtual void FuncA() { printf("CObj::FuncA()\n"); }
    virtual void FuncB() { printf("CObj::FuncB()\n"); }

private:
    int m_nData1;
    int m_nData2;
};

int main()
{
    CObj obj1(10,20);
    CObj obj2(11,22);

    return 0;
}
```

来看看 obj1 和 obj2 的实际内存结构：

![Object with virtual functions](/images/posts/cplusplus/objectwithvirtual_mem.png)

小结：

* 虚函数指针在虚表内按声明顺序排列

### 单继承的类对象的内存结构

子类覆盖父类虚函数之后虚函数表的变化可以通过对比明显的得出，这即是多态的实现机制。

**子类无覆盖父类的虚函数**

内存结构：

![derive no override](/images/posts/cplusplus/derivenooverride.png)

验证如下：

```cpp
#include <stdio.h>

class CBase
{
public:
    CBase() { m_nData1 = 10; }
    virtual void FuncA() { printf("CBase::FuncA\n"); }

private:
    int m_nData1;
};

class CDerive : public CBase
{
public:
    CDerive() { m_nData2 = 20; }
    virtual void FuncB() { printf("CDerive::FuncB\n"); }

private:
    int m_nData2;
};

int main()
{
    CDerive *pDerive = new CDerive;

    return 0;
}
```

来看看 pDerive 的实际内存结构：

![derive no override](/images/posts/cplusplus/derivenooverride_mem.png)

小结：

* 父类成员在子类成员之前
* 父类虚函数在子类虚函数之前

**子类有覆盖父类的虚函数**

内存结构：

![derive override](/images/posts/cplusplus/deriveoverride.png)

验证如下：

```cpp
#include <stdio.h>

class CBase
{
public:
    CBase() { m_nData1 = 10; }
    virtual void FuncA() { printf("CBase::FuncA\n"); }

private:
    int m_nData1;
};

class CDerive : public CBase
{
public:
    CDerive() { m_nData2 = 20; }
    virtual void FuncA() { printf("CDerive::FuncA\n"); }    // add this line
    virtual void FuncB() { printf("CDerive::FuncB\n"); }

private:
    int m_nData2;
};

int main()
{
    CDerive *pDerive = new CDerive;

    return 0;
}
```

来看看 pDerive 的实际内存结构：

![derive override](/images/posts/cplusplus/deriveoverride_mem.png)

### 普通多继承的类对象的内存结构

内存结构：

![multi derive](/images/posts/cplusplus/multiderive.png)

验证如下：

```cpp
#include <stdio.h>

class CBase1
{
public:
    CBase1() { m_nData1 = 10; }
    virtual void FuncA() { printf("CBase1::FuncA\n"); }

private:
    int m_nData1;
};

class CBase2
{
public:
    CBase2() { m_nData2 = 20; }
    virtual void FuncB() { printf("CBase2::FuncB\n"); }

private:
    int m_nData2;
};

class CDerive : public CBase1, public CBase2
{
public:
    CDerive() { m_nData3 = 30; }
    virtual void FuncA() { printf("CDerive::FuncA\n"); }
    virtual void FuncB() { printf("CDerive::FuncB\n"); }
    virtual void FuncC() { printf("CDerive::FuncC\n"); }

private:
    int m_nData3;
};

int main()
{
    CDerive *pDerive = new CDerive;
    CBase1 *pBase1 = pDerive;
    CBase2 *pBase2 = pDerive;

    return 0;
}
```

来看看 pDerive、pBase1 和 pBase2 在实际内存中的情况：

![multi derive](/images/posts/cplusplus/multiderive_mem.png)

小结：

* 多个父类的成员在内存中按继承时声明的顺序排列
* 子类数据成员放在最后一个父类的数据成员之后
* 子类虚函数列表在第一个虚表中
* 第一张虚表中存放了所有的虚函数指针，其它虚表存放了某个父类的（可能是被覆盖后的）虚函数指针

### 单虚继承的类对象的内存结构

内存结构：

![virtual derive](/images/posts/cplusplus/virtualderive.png)

验证如下：

```cpp
#include <stdio.h>

class CBase
{
public:
    CBase() { m_nData1 = 10; }
    virtual void FuncA() { printf("CBase::FuncA\n"); }

private:
    int m_nData1;
};

class CDerive : public virtual CBase
{
public:
    CDerive() { m_nData2 = 20; }
    virtual void FuncA() { printf("CDerive::FuncA\n"); }
    virtual void FuncB() { printf("CDerive::FuncB\n"); }

private:
    int m_nData2;
};

int main()
{
    CDerive *pDerive = new CDerive;
    CBase *pBase = pDerive;

    return 0;
}
```

来看看 pDerive、pBase 在实际内存中的情况：

![virtual derive](/images/posts/cplusplus/virtualderive_mem.png)

小结：

* 父类数据成员会放在第二张虚表指针之后
* 第一张虚表里存放了所有的虚函数指针

### 钻石结构的类对象的内存结构

内存结构：

![diamond derive](/images/posts/cplusplus/diamond.png)

验证如下：

```cpp
#include <stdio.h>

class CBase
{
public:
    CBase() { m_nData = 1; }
    virtual void Func() { printf("CBase::Func\n"); }

private:
    int m_nData;
};

class CBase1 : virtual public CBase
{
public:
    CBase1() { m_nData1 = 10; }
    virtual void FuncA() { printf("CBase1::FuncA\n"); }

private:
    int m_nData1;
};

class CBase2 : virtual public CBase
{
public:
    CBase2() { m_nData2 = 20; }
    virtual void FuncB() { printf("CBase2::FuncB\n"); }

private:
    int m_nData2;
};

class CDerive : public CBase1, public CBase2
{
public:
    CDerive() { m_nData3 = 30; }
    virtual void FuncA() { printf("CDerive::FuncA\n"); }
    virtual void FuncB() { printf("CDerive::FuncB\n"); }
    virtual void FuncC() { printf("CDerive::FuncC\n"); }

private:
    int m_nData3;
};

int main()
{
    CDerive *pDerive = new CDerive;
    CBase *pBase = pDerive;
    CBase1 *pBase1 = pDerive;
    CBase2 *pBase2 = pDerive;

    return 0;
}
```

来看看 pDerive、pBase、pBase1 和 pBase2 在实际内存中的情况：

![diamond derive](/images/posts/cplusplus/diamond_mem.png)

小结：

* 第一张虚表里没有存放根父类的虚函数指针
