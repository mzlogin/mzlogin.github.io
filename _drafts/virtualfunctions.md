---
layout: post
title: 从对象内存结构理解虚函数表
categories: cplusplus
---

最近抽空浏览了一遍《COM原理与应用》，一本老书了，COM技术在我工作中运用得不多，但是接口设计规范和标准这一套东西还是能带给我一些有用的实践经验和启发的。在读到第二章《COM对象和接口》的时候，看到虚函数表的一些相关知识，这些之前倒是也都知道，但是从来没有试着自己描述过，所以老觉得理解得不够彻底，那么……就试着结合一些小的代码段描述一下看，权当笔记加深记忆。  

###类对象的内存结构
先来看看有与没有虚函数的类的对象的内存结构的不同之处：  

* 无虚函数的对象的内存结构   
无虚函数的对象的内存结构大致为：  
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
    CObj *pObj = new CObj(11,22);
    printf("sizeof CObj is %d\n", sizeof(*pObj));
    printf("pObj->m_nData1 is %d\n", (int)(*(int*)pObj));
    printf("pObj->m_nData2 is %d\n", (int)(*((int*)pObj + 1)));

    delete pObj;
    pObj = NULL;
    
    return 0;
}
```

输出为：

```
sizeof CObj is 8
pObj->m_nData1 is 11
pObj->m_nData2 is 22
```

* 有虚函数的对象的内存结构  
有虚函数的对象的内存结构大致为：  
![Object with virtual functions](/images/posts/cplusplus/objectwithvirtual.png)  
验证如下：  


###单继承的类对象的内存结构
* 子类无覆盖父类的虚函数  
* 子类有覆盖父类的虚函数  

###多继承的类对象的内存结构

