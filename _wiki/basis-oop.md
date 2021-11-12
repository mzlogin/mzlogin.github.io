---
layout: wiki
title: 面向对象
cate1: Basis
cate2: 面向对象
description: 面向对象
keywords: Basis
---

## 六大原则

即常说的 SOLID+。

### 单一职责原则

Single Responsibility Principle (SRP)

一个类只做一件事，应该有且仅有一个原因引起类的变更。

### 开闭原则

Open-Close Principle (OCP)

类和模块应该对拓展开放，对修改关闭。

### 里氏代换原则

Liskov Substitution Principle (LSP)

所有引用基类的地方必须能透明地使用其子类对象。

### 接口隔离原则

Interface Segregation Principle (ISP)

一个类对另一个类的依赖应该建立在最小的接口上，不应该依赖和知道它不需要的接口。

### 依赖倒置原则

Dependency Inversion Principle (DIP)

高层模块不应依赖低层模块，两者都应该依赖抽象，抽象不应依赖细节，细节依赖抽象。

### 迪米特法则

Law of Demeter (LOD)

Only talk to your immediate friends.

也称最小知识原则（Least Knowledge Principle），一个类应该对自己需要耦合或调用的类知道的最少，依赖尽可能少的接口，每个接口又仅包含需要的方法。
