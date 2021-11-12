---
layout: wiki
title: LinearLayout
cate1: Android
cate2: View
description: LinearLayout
keywords: Android
---

## 实现方法

### 元素间分隔线

```xml
<LinearLayout
    ...
    android:showDividers="none|beginning|end|middle"
    android:divider="@drawable/divider"
    android:dividerPadding="16dp"
    >
</LinearLayout>
```

* `showDividers` 控制是否显示分割线
* `divider` 分割线 drawable
* `dividerPadding` 分割线 padding，若是横线，则 padding 左右，若是竖线，则 padding 上下
