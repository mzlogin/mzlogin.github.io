---
layout: wiki
title: Fragment
cate1: Android
cate2: Components
description: Fragment
keywords: Android
---

## 生命周期

![fragment lifecycle](/images/wiki/fragment-lifecycle.png)

* 在 Fragment 从 BackStack 恢复时，Fragment 对象本身没有销毁，但它里面的 View 销毁重建了。

    保存并恢复 View 的数据的最佳实践是让每个 View 都自己实现了 onSaveInstanceState/onRestoreInstanceState。
    
    对于 ListView，其实在销毁重建 View 时调用 onCreateView 时，保存的 Fragment 实例里的 mAdapter 并没有销毁，所以可以直接使用里面保存的数据，不用再 new 一个。

    参考：[The Real Best Practices to Save/Restore Activity's and Fragment's state.](https://inthecheesefactory.com/blog/fragment-state-saving-best-practices/en)

## 对应 Activity 状态的 Callbacks

![activity state and fragment callbacks](/images/wiki/activity-state-and-fragment-callbacks.png)

## 遇到的问题

### 点击穿透

比如一个 Fragment 作为 DrawerLayout 里的 Drawer，点击这个 Fragment 没有控件的部分时，如果被覆盖的 Fragment 或者 Activity 上对应位置有按钮，点击事件会分发到这些按钮上去。

解决办法：

给 Fragment 的根 View 添加 clickable 属性，有两种实现方法，推荐第二种。

1. 给所有需要解决此问题的 Fragment 的 Layout 文件的根结点添加 `android:clickable="true"`。

2. 所有 Fragment 继承自一个基类 BaseFragment，覆盖 BaseFragment 的 `onViewCreated` 方法（该方法会在 `onCreateView` 返回之后被调用），在该方法里用代码设置根 View 的 clickable 属性。

    ```java
    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // 解决点击穿透的问题
        view.setClickable(true);
        ......
    }
    ```

### replace 切换后恢复状态

使用 replace 方式切换 Fragment 后，又切换回来，此时 onCreateView 又会被调用到，如果重新 inflate layout，那界面状态会丢失，比如 Fragment 里有 WebView，那它的滚动位置等会丢失掉。

一种解决办法是在 onCreateView 里将 root view 保存下来，下次 onCreateView 被调用到时，判断 root 是否为空，为空就重新 inflate，不为空就直接复用：

```java
public class MyFragment extends Fragment {

    private View mRoot;

    @Nullable
        @Override
        public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
            if (mRoot != null) {
                return mRoot;
            } else {
                // 重新 inflate layout，设置 View 和 data 等
                // ...
            }
        }
}
```
