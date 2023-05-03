---
layout: fragment
title: Android Image 里的 pixelStride 和 rowStride
tags: [android]
description: 理解 pixelStride 和 rowStride
keywords: Android, ImageReader, pixelStride, rowStride
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

当我们从屏幕上拿到截图：

```java
Image image = imageReader.acquireNextImage();
ImagePlane[] planes = image.getPlanes();

int width = image.getWidth();
int height = image.getHeight();

if (planes.length > 0) {
    int pixelStride = planes[0].getPixelStride();
    int rowStride = planes[0].getRowStride();
}
```

rowStride：每行数据的跨度；

pixelStride：相邻像素样本之间的距离；

所以理论上应该有 `rowStride / pixelStride == width`？

但实际上并非一定成立，也有可能 `rowStride > pixelStride * width`，在 width 像素右侧可能填充的有若干空白像素。

这个表现与具体设备有关。

参考：<https://blog.csdn.net/weixin_42510962/article/details/114215062>
