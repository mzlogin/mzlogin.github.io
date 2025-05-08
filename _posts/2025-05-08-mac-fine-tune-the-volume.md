---
layout: post
title: Mac mini 外接三方键盘如何微调音量
categories: [Mac]
description: Mac mini 外接三方键盘如何微调音量
keywords: Mac, Mac mini, 键盘, 音量
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

用 Mac mini 外接第三方键盘时，音量调节可能会让人感到痛苦。比如，<kbd>Fn + F11</kbd> 和 <kbd>Fn + F12</kbd> 这对音量调节快捷键可能没法用，而基于它们的微调组合键（<kbd>Fn + Option + Shift + F11</kbd> 和 <kbd>Fn + Option + Shift + F12</kbd>）更是想都别想。

我的工作键盘是 IKBC C87，虽然有个 Fn 键，但它和 Mac 键盘的 Fn 完全不是一回事。键盘自带的音量调节组合键只能一格一格地调节，听歌时还好，但在 Coding 时，这“一格”的音量有时就显得过于喧闹，让人无法沉浸式思考。微调音量成了刚需。

最终，[Karabiner-Elements][1] 拯救了我。

## 设置方法

只需将右 <kbd>Ctrl</kbd> 键映射为 <kbd>Fn</kbd> 键，就能像用苹果妙控键盘一样，正常使用各种基于 Fn 的快捷键，包括音量微调。

![](/images/posts/mac/mac-karabiner-elements.png)

## 关于 Karabiner-Elements

[Karabiner-Elements][1] 是一款强大的键盘映射工具，功能远不止映射单键这么简单。它还能：

- 创建自定义快捷键组合；
- 设计复杂的键盘规则；
- 根据不同应用程序或环境动态调整键盘映射。

此外，官网还提供了丰富的规则库，按需导入即可：<https://ke-complex-modifications.pqrs.org/>。

---

现在，我终于可以在 Coding 时享受“刚刚好”的背景音乐，而不用被“一格音量”的霸道支配。

希望能帮到和我一样有此困扰的你。

[1]: https://karabiner-elements.pqrs.org/