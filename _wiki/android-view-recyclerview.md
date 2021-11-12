---
layout: wiki
title: RecyclerView
cate1: Android
cate2: View
description: RecyclerView
keywords: Android
---

## 常见问题解决

### 设置 OnItemClickListener

```java
class MyAdapter extends android.support.v7.widget.RecyclerView.Adapter<MyAdapter.ViewHolder> {

    private OnItemClickListener mItemClickListener;

    interface OnItemClickListener {
        void onItemClick(int position);
    }

    MyAdapter(OnItemClickListener itemClickListener) {
        mItemClickListener = itemClickListener;
    }

    // ...

    static class ViewHolder extends RecyclerView.ViewHolder {
        ViewHolder(View v, final OnItemClickListener listener) {
            super(v);
            v.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    listener.onItemClick(getLayoutPosition());
                }
            });
        }
    }
}
```

```java
RecyclerView.Adapter mAdapter = new MyAdapter(new MyAdapter.OnItemClickListener() {
    @Override
    public void onItemClick(int position) {
        // ...
    }
});
mRecyclerView.setAdapter(mAdapter);
```

### 解决 ScrollView 嵌套 RecyclerView 的显示及滑动问题

一种方法是使用 NestedScrollView，还有其它方法，

参见 <https://segmentfault.com/a/1190000011553735>
