---
layout: wiki
title: 事件分发机制
cate1: Android
cate2:
description: 事件分发机制
keywords: Android
---

## MotionEvent 的传递规则

主要涉及到三个方法：

1. public boolean dispatchTouchEvent(MotionEvent ev)

    用来进行事件的分发。如果事件能够传递给当前 View，那么它一定会被调用，返回值表示是否消耗当前事件。

2. public boolean onInterceptTouchEvent(MotionEvent ev)

    判断是否拦截某个事件。如果当前 View 拦截了某个事件，那么在同一个事件序列当中，此方法不会被再次调用，返回值表示是否拦截当前事件。

3. public boolean onTouchEvent(MotionEvent ev)

    处理点击事件，返回值表示是否消耗当前事件，如果不消耗，则在同一个事件序列中，当前 View 无法再次接收到事件。

根据《Android 开发艺术探索》里的描述和我自己对源码的解读，可以用下面这样一段伪代码来表示事件分发机制：

```java
public boolean dispatchTouchEvent(MotionEvent ev) {
    boolean consume = false;
    if (onInterceptTouchEvent(ev)) {
        if (mOnTouchListener != null) {
            consume = mOnTouchListener.onTouch(this, ev);
        }

        if (!consume) {
            consume = onTouchEvent(ev); // may call OnClickListener.onClick
        }
    } else {
        for (View child: mChildren) {
            if (consume = child.dispatchTouchEvent(ev)) {
                break;
            }
        }
    }

    if (!consume) {
        consume = super.dispatchTouchEvent(ev);
    }

    return consume;
}
```

事件总是按 Activity -> Window -> View 由自顶向下分发，下层不消耗则交回上层，直到得到处理为止。

关于事件传递机制的一些结论：

1. 同一事件序列是指从手指接触屏幕那一刻起，到手指离开屏幕的那一刻结束，在这个过程中所产生的一系列事件，这个事件序列以 down 事件开始，中间含有数量不定的 move 事件，最终以 up 事件结束。

2. 正常情况下，一个事件序列只能被一个 View 拦截且消耗。这一条的原因可以参考 3，因为一旦一个元素拦截了此事件，那么同一个事件序列内的所有事件都会直接交给它处理，因此同一个事件序列中的事件不能分别由两个 View 同时处理，但是通过特殊手段可以做到，比如一个 View 将本该自己处理的事件通过 onTouchEvent 强行传递给其它 View 处理。

3. 某个 View 一旦决定拦截，那么这一事件序列都只能由它来处理（如果事件序列能够传递给它的话），并且它的 onInterceptTouchEvent 不会再被调用（系统直接把同一事件序列内的事件都交给它处理，不再通过 onInterceptTouchEvent 询问它是否要拦截）。

4. 某个 View 一旦开始处理事件，如果它不消耗 ACTION_DOWN 事件（onTouchEvent 返回了 false），那么同一事件序列中的其它事件都不会再交给它来处理，并且事件将重新交由它的父元素去处理，即父元素的 onTouchEvent 会被调用。

5. 如果 View 不消耗除 ACTION_DOWN 以外的其它事件，那么这个点击事件会消失，此时父元素的 onTouchEvent 并不会被调用，并且当前 View 可以持续收到后续的事件，最终这些消失的点击事件会传递给 Activity 处理。

6. ViewGroup 默认不拦截任何事件。Android 源码中 ViewGroup 的 onInterceptTouchEvent 方法默认返回 false。

7. View 没有 onInterceptTouchEvent 方法，一旦有点击事件传递给它，它的 onTouchEvent 方法就会被调用。

8. View 的 onTouchEvent 默认返回 true，除非它是不可点击的（clickable 和 longClickable 同时为 false）。View 的 longClickable 属性默认都为 false，clickable 要分情况，比如 Button 的 clickable 属性默认为 true，而 TextView 的默认为 false。

9. View 的 enable 属性不影响 onTouchEvent 的默认返回值。哪怕一个 View 是 disable 状态的，只要它的 clickable 或者 longClickable 有一个为 true，那么它的 onTouchEvent 就返回 true。

10. onClick 会发生的前提是当前 View 是可点击的，并且它收到了 down 和 up 事件。

11. 事件传递过程是由外向内的，即事件总是先到达父元素，然后再由父元素分发给子 View，通过 requestDisallowInterceptTouchEvent 方法可以在子元素中干预父元素的事件颁发过程，但是 ACTION_DOWN 事件除外。

## 参考

* 《Android 开发艺术探索》
