---
layout: post
title: Java｜List.subList 踩坑小记
categories: [Java]
description: List.subList 容易误用，这里记录一下正确的用法。
keywords: Java, ArrayList, subList
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

很久以前在使用 Java 的 List.subList 方法时踩过一个坑，当时记了一条待办，要写一写这事，今天完成它。

我们先来看一段代码：

```java
// 初始化 list 为 { 1, 2, 3, 4, 5 }
List<Integer> list = new ArrayList<>();
for (int i = 1; i <= 5; i++) {
    list.add(i);
}

// 取前 3 个元素作为 subList，操作 subList
List<Integer> subList = list.subList(0, 3);
subList.add(6);

System.out.println(list.size());
```

输出是 `5` 还是 `6`？

没踩过坑的我，会回答是 `5`，理由是：往一个 List 里加元素，关其它 List 什么事？

而掉过坑的我，口中直呼 666。

好了不绕弯子，我们直接看下 List.subList 方法的注释文档：

```java
/**
 * Returns a view of the portion of this list between the specified
 * <tt>fromIndex</tt>, inclusive, and <tt>toIndex</tt>, exclusive.  (If
 * <tt>fromIndex</tt> and <tt>toIndex</tt> are equal, the returned list is
 * empty.)  The returned list is backed by this list, so non-structural
 * changes in the returned list are reflected in this list, and vice-versa.
 * The returned list supports all of the optional list operations supported
 * by this list.<p>
 *
 * This method eliminates the need for explicit range operations (of
 * the sort that commonly exist for arrays).  Any operation that expects
 * a list can be used as a range operation by passing a subList view
 * instead of a whole list.  For example, the following idiom
 * removes a range of elements from a list:
 * <pre>{@code
 *      list.subList(from, to).clear();
 * }</pre>
 * Similar idioms may be constructed for <tt>indexOf</tt> and
 * <tt>lastIndexOf</tt>, and all of the algorithms in the
 * <tt>Collections</tt> class can be applied to a subList.<p>
 *
 * The semantics of the list returned by this method become undefined if
 * the backing list (i.e., this list) is <i>structurally modified</i> in
 * any way other than via the returned list.  (Structural modifications are
 * those that change the size of this list, or otherwise perturb it in such
 * a fashion that iterations in progress may yield incorrect results.)
 *
 * @param fromIndex low endpoint (inclusive) of the subList
 * @param toIndex high endpoint (exclusive) of the subList
 * @return a view of the specified range within this list
 * @throws IndexOutOfBoundsException for an illegal endpoint index value
 *         (<tt>fromIndex &lt; 0 || toIndex &gt; size ||
 *         fromIndex &gt; toIndex</tt>)
 */
List<E> subList(int fromIndex, int toIndex);
```

这里面有几个要点：

1. subList 返回的是原 List 的一个 **视图**，而不是一个新的 List，所以对 subList 的操作会反映到原 List 上，反之亦然；

2. 如果原 List 在 subList 操作期间发生了结构修改，那么 subList 的行为就是未定义的（实际表现为抛异常）。

第一点好理解，看到「视图」这个词相信大家就都能理解了。我们甚至可以结合 ArrayList 里的 SubList 子类源码进一步看下：

```java
private class SubList extends AbstractList<E> implements RandomAccess {
    private final AbstractList<E> parent;
    // ...

    SubList(AbstractList<E> parent,
            int offset, int fromIndex, int toIndex) {
        this.parent = parent;
        // ...
        this.modCount = ArrayList.this.modCount;
    }

    public E set(int index, E e) {
        // ...
        checkForComodification();
        // ...
        ArrayList.this.elementData[offset + index] = e;
        // ...
    }

    public E get(int index) {
        // ...
        checkForComodification();
        return ArrayList.this.elementData(offset + index);
    }

    public void add(int index, E e) {
        // ...
        checkForComodification();
        parent.add(parentOffset + index, e);
        this.modCount = parent.modCount;
        // ...
    }

    public E remove(int index) {
        // ...
        checkForComodification();
        E result = parent.remove(parentOffset + index);
        this.modCount = parent.modCount;
        // ...
    }

    private void checkForComodification() {
        if (ArrayList.this.modCount != this.modCount)
            throw new ConcurrentModificationException();
    }

    // ...
}
```

可以看到几乎所有的读写操作都是映射到 ArrayList.this、或者 parent（即原 List）上的，包括 `size`、`add`、`remove`、`set`、`get`、`removeRange`、`addAll` 等等。

第二点，我们在文首的示例代码里加上两句代码看现象：

```java
list.add(0, 0);
System.out.println(subList);
```

`System.out.println` 会抛出异常 `java.util.ConcurrentModificationException`。

我们还可以试下，在声明 subList 后，如果对原 List 进行元素增删操作，然后再读写 subList，基本都会抛出此异常。

因为 subList 里的所有读写操作里都调用了 `checkForComodification()`，这个方法里检验了 subList 和 List 的 `modCount` 字段值是否相等，如果不相等则抛出异常。

`modCount` 字段定义在 AbstractList 中，记录所属 List 发生 **结构修改** 的次数。**结构修改** 包括修改 List 大小（如 add、remove 等）、或者会使正在进行的迭代器操作出错的修改（如 sort、replaceAll 等）。

好了小结一下，这其实不算是坑，只是 **不应该仅凭印象和猜测，就开始使用一个方法，至少花一分钟认真读完它的官方注释文档**。
