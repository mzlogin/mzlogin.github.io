---
layout: post
title: 前端｜基于 Layui 实现动态搜索选择框
categories: [前端]
description: 基于 Layui 实现动态搜索选择框。
keywords: 前端, Layui
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

后端程序员的前端笔记，含金量，你懂的 :-P

## 需求

网页端实现动态搜索选择框，要求：

1. 下拉选项列表能根据用户输入内容动态刷新；
2. 最终提交的值必须是由选项列表中点选的；
3. 基于 Layui。

## 方案

一开始根据印象里常见的搜索选择框的样式，一直在探索如何基于 `<select>` 来实现。Layui 的搜索选择框并没有暴露监听输入内容的事件接口，在网上找到了两个思路，但实现得都不够完美。

一是参考 <https://www.cnblogs.com/zqifa/p/layui-select-input-1.html>，在 `<select>` 上覆盖一个 `<input>`，监听 `<input>` 的输入内容然后触发模糊搜索，进而触发更新 `<select>` 的选项列表。可以基本达成需要的效果，有一个问题是选择列表展示后，必须选择一项才能关闭选项列表，而期望是点击空白区域选项列表自动关闭。

二是参考 <https://gitee.com/layui/layui/issues/I6N5MZ>，监听经过 Layui 渲染 `<select>` 后生成的 `<input>` 元素的事件，进而触发选项列表的刷新。这个方案的思路是挺好的，但是同样有一些小问题，比如下拉选项的展示/隐藏、输入焦点、输入内容保持等，都需要自己一一去干预。

这时在 Layui 的仓库找到 [这个 Issue](https://gitee.com/layui/layui/issues/I71WRL)，贤心大大这样回应网友「能不能在选择框上加上可输入可下拉可搜索」的提问：

> select 组件的定位就是只能赋值选项列表中的值，包括搜索，也只是从选项中匹配。若要支持自定义输入的值，可以借助 input + dropdown 组件来自定义实现哦。

受此启发，我又思考了一下需求里的「搜索」：

- 我们的下拉选项列表完全由后端根据输入内容返回；
- Layui 的 select 搜索选择框的搜索，是根据输入内容匹配现有候选列表，纯前端行为；

看了下 Layui 文档后发现 dropdown 有专门的 reloadData 的 API，经尝试后最终选择了基于 Layui 的 dropdown 组件来实现。

## 实现

效果如下：

![](/images/posts/frontend/fe-search-select.gif)

示例代码如下：

- 其中 `mockData` 实现应按需替换成 ajax 请求，成功拿到数据之后再 `reloadData`；
- 表单提交时需要使用 id 作为参数值，可以在 click 的时候给 input 添加自定义属性如 `data-id`，在输入监听事件里删除该属性值。

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Demo</title>
  <link href="https://unpkg.com/layui@2.9.6/dist/css/layui.css" rel="stylesheet">
</head>
<body>
<div class="layui-inline layui-padding-5">
  <input name="" placeholder="请搜索或选择" class="layui-input" id="ID-dropdown-demo">
</div>
  
<script src="https://unpkg.com/layui@2.9.6/dist/layui.js"></script> 
<script>
layui.use(function(){
  var dropdown = layui.dropdown;
  var $ = layui.$;
  var inst = dropdown.render({
    elem: '#ID-dropdown-demo',
    data: [],
    click: function(obj){
      this.elem.val(obj.title);
      this.elem.attr('data-id', obj.id)
    }
  });

  $(inst.config.elem).on('input propertychange', function() {
    var elem = $(this);
    var value = elem.val().trim();
    elem.removeAttr('data-id');

    var dataNew = mockData(value);
    dropdown.reloadData(inst.config.id, {
      data: dataNew
    })
  });

  $(inst.config.elem).on('blur', function() {
    var elem = $(this);
    var dataId = elem.attr('data-id');
    if (!dataId) {
        elem.val('');
    }
  });
  
  function mockData(value) {
    return [
      {id: 1, title: value + '1'},
      {id: 2, title: value + '2'}
    ];
  }
});
</script>
 
</body>
</html>
```

## 小结

冷静地想清楚自己的需求和场景，有助于更快找到合适的组件和方案。