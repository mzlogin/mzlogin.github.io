---
layout: wiki
title: TabLayout
cate1: Android
cate2: View
description: TabLayout
keywords: Android
---

## 用法

### 设置字体大小

layout/xxx.xml

```xml
<android.support.design.widget.TabLayout
    ...
    app:tabTextAppearance="@style/MineTabLayout"
    ...
/>
```

values/styles.xml

```xml
<style name="MineTabLayout" parent="TextAppearance.Design.Tab">
    <item name="android:textSize">@dimen/font_tab</item>
</style>
```
