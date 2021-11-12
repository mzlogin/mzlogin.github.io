---
layout: wiki
title: ListView
cate1: Android
cate2: View
description: ListView
keywords: Android
---

## 优化 ListView 使用的方法

1. 利用好 convertView 来重用 View。

2. 使用 ViewHolder，减少 findViewById。

3. 利用好 View Type，不创建过多类型，更利于 View 复用。

4. 让 ItemView 的层次结构简单，善用自定义 View。

5. 尽量使 Adapter 的 hasStableIds() 返回 true，这样在 notifyDataSetChanged() 的时候，如果 id 不变，ListView 将不会重新绘制这个 View，达到优化的目的。

6. 每个 Item 不要太高，不要超屏幕的高度。

7. getView() 中尽量少做事，不要有耗时的操作，比如滑动时不要加载图片，停止了再加载（Glide 库可以实现这种）。

8. 有些场景可以使用 RecyclerView 来代替，ListView 每次更新数据都要 notifyDataSetChanged()，RecyclerView 的性能和可定制性上都有很大改善。

9. 不要在 getView 里创建 View 的 OnClickListener，position 和数据可以通过 View 的 tag 带上。

10. setText() 时先比较内容是否变化，比较内容比重绘控件节省资源。

## 如何防止异步加载图片闪烁错位的问题

将 uri 设置到 ImageView 的 tag 里，图片下载/准备好之后比较 uri 是否还是 ImageView 的 tag 保存的相同，不相同就不加载。

## CheckBox 选中状态错位的问题

因为 View 复用引起。将每个 entity 对应的选中状态保存，在 getView 的时候都检查和设置 checkBox 的状态。可以在 entity 中保存状态，也可以额外使用一个 SparseArray 来存储。

*PS：其实这都不能算是个问题，设计良好的程序当然会考虑到这个情况，但网上对此的讨论却非常多，sigh。*

## ListView 与 RecyclerView 比较

* RecyclerView 引入 LayoutManager，布局更灵活。

* RecyclerView 强制作用 ViewHolder，不用自己 setTag() 了。

* RecyclerView 没有 EmptyView、HeaderView 和 FooterView，需要自己实现。

* RecyclerView 支持局部刷新，ListView 得自己实现。

* RecyclerView 提供了 ItemAnimator。

* RecyclerView 提供的是 addOnItemTouchLister，而 ListView 直接提供了 click、long click 和 select 的处理。

* RecyclerView 支持嵌套滚动机制。

## 添加 HeaderView

在 API 17 及以前，addHeaderView 需要在 setAdapter 之前设置，分析见 <http://blog.csdn.net/mtt1987/article/details/38535249>。

## 数据更新后自动滚动到底部

```xml
android:stackFromBottom="true"
android:transcriptMode="alwaysScroll"
```

or

```java
listView.setTranscriptMode(ListView.TRANSCRIPT_MODE_ALWAYS_SCROLL);
```

## 参考

* [优化 listview 有哪些方法？ - 知乎](https://www.zhihu.com/question/19703384)
* [RecyclerView 和 ListView 使用对比分析](http://www.jianshu.com/p/f592f3715ae2)
* [Listview Scroll to the end of the list after updating the list](https://stackoverflow.com/questions/3606530/listview-scroll-to-the-end-of-the-list-after-updating-the-list)
