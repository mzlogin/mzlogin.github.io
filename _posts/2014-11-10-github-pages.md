标题
要创建标题，请在标题文本前添加一至六个 # 符号。 你使用的 # 数量将决定层次结构级别和标题的大小。

# A first-level heading
## A second-level heading
### A third-level heading
呈现的 GitHub Markdown 的屏幕截图，其中显示了示例 h1、h2 和 h3 标头，这些标头按类型大小和视觉权重降序，以指示降序排列的层次结构级别。

使用两个或多个标题时，GitHub 会自动生成一个目录，可以通过单击文件标题中的  来访问该目录。 每个标题都列在目录中，可以单击某个标题导航到所选部分。

GitHub Docs 开放源代码存储库中自述文件的屏幕截图，其中显示了公开的目录的下拉菜单。 目录图标以深橙色框出。

文本样式
可以在评论字段和 .md 文件中以粗体、斜体、删除线、下标或上标文本表示强调。

Style	语法	键盘快捷键	示例	输出
加粗	** ** 或 __ __	Command+B (Mac) 或 Ctrl+B (Windows/Linux)	**This is bold text**	这是粗体文本
斜体	* * 或 _ _     	Command+I (Mac) 或 Ctrl+I (Windows/Linux)	_This text is italicized_	这是斜体文本
删除线	~~ ~~	无	~~This was mistaken text~~	这是错误文本
粗体和嵌入的斜体	** ** 和 _ _	无	**This text is _extremely_ important**	此文本非常重要
全部粗体和斜体	*** ***	无	***All this text is important***	所有这些文本都很重要
下标	<sub> </sub>	无	This is a <sub>subscript</sub> text	这是下标文本
上标	<sup> </sup>	无	This is a <sup>superscript</sup> text	这是上标文本
引用文本
可以使用 > 来引用文本。

Text that is not a quote

> Text that is a quote
引用文本缩进，具有不同的类型颜色。

呈现的 GitHub Markdown 的屏幕截图，其中显示了示例引用文本。 引号文本左侧缩进一条垂直线，其文本为深灰色而不是黑色。

注意：查看对话时，可以通过突出显示文本，然后键入 R 来自动引用评论中的文本。可以通过依次单击  和“引用回复”来引用整条评论。 有关键盘快捷方式的详细信息，请参阅“键盘快捷方式”。

引用代码
使用单反引号可标注句子中的代码或命令。 反引号中的文本不会被格式化。 你也可以按 Command+E (Mac) 或 Ctrl+E (Windows/Linux) 键盘快捷方式将代码块的反引号插入到 Markdown 一行中。

Use `git status` to list all new or modified files that haven't yet been committed.
呈现的 GitHub Markdown 的屏幕截图，其中显示了被反引号包围的字符的外观。 “git status”一词显示在固定宽度的字样中，以浅灰色突出显示。

要将代码或文本格式化为各自的不同块，请使用三反引号。

Some basic Git commands are:
```
git status
git add
git commit
```
呈现的 GitHub Markdown 的屏幕截图，其中显示了代码块。 “git status”、“git add”和“git commit”等词显示在固定宽度的字样中，以浅灰色突出显示。

有关详细信息，请参阅“创建和突显代码块”。

如果经常编辑代码片段和表，则可能受益于在 GitHub 上启用对所有注释字段采用固定宽度字体。 有关详细信息，请参阅“关于在 GitHub 上编写和设置格式”。

支持的颜色模型
在问题、拉取请求和讨论中，可以使用反引号在句子中标注颜色。 反引号内支持的颜色模型将显示颜色的可视化效果。

The background color is `#ffffff` for light mode and `#000000` for dark mode.
呈现的 GitHub Markdown 的屏幕截图，其中显示了反引号内的十六进制值如何创建有颜色的小圆圈。 #ffffff 显示一个白色圆圈，#000000 显示一个黑色圆圈。

下面是当前支持的颜色模型。

Color	语法	示例	输出
HEX	`#RRGGBB`	`#0969DA`	呈现的 GitHub Markdown 的屏幕截图，其中显示了十六进制值 (#0969DA) 如何以蓝色圆圈显示。
RGB	`rgb(R,G,B)`	`rgb(9, 105, 218)`	呈现的 GitHub Markdown 的屏幕截图，其中显示了 RGB (9, 105, 218) 如何以蓝色圆圈显示。
HSL	`hsl(H,S,L)`	`hsl(212, 92%, 45%)`	呈现的 GitHub Markdown 的屏幕截图，其中显示了 HSL 值 (212, 92%, 45%) 如何以蓝色圆圈显示。
注意：

支持的颜色模型在反引号内不能有任何前导或尾随空格。
颜色的可视化效果仅在问题、拉取请求和讨论中受支持。
链接
通过将链接文本用方括号 [ ] 括起来，然后将 URL 用括号 ( ) 括起来，可创建内联链接。 还可以使用键盘快捷方式 Command+K 创建链接。 选择文本后，可以粘贴剪贴板中的 URL 以自动从所选内容创建链接。

还可以通过突出显示文本并使用键盘快捷方式 Command+V 创建 Markdown 超链接。 如果要将文本替换为链接，请使用键盘快捷方式 Command+Shift+V。

This site was built using [GitHub Pages](https://pages.github.com/).

呈现的 GitHub Markdown 的屏幕截图，其中显示了括号中的文本“GitHub Pages”如何作为蓝色超链接出现。

注意：当评论中写入了有效 URL 时，GitHub 会自动创建链接。 有关详细信息，请参阅“自动链接引用和 URL”。

章节链接
你可以直接链接到渲染文件中的某个部分，方法是将鼠标悬停在该部分标题上以显示 。

存储库的自述文件的屏幕截图。 在部分标题的左侧，链接图标以深橙色标出。

relative links (相对链接)
您可以在渲染的文件中定义相对链接和图像路径，以帮助读者导航到仓库中的其他文件。

相对链接是相对于当前文件的链接。 例如，如果在仓库根目录下有一个自述文件，而在 docs/CONTRIBUTING.md 中有另一个文件，则自述文件中的 CONTRIBUTING.md 的相关链接如下所示 ：

[Contribution guidelines for this project](docs/CONTRIBUTING.md)
GitHub 将根据您当前使用的分支自动转换相对链接或图像路径，从而使链接或路径始终有效。 链接的路径将相对于当前文件。 以 / 开头的链接将相对于存储库根目录。 可使用所有相对链接操作数，例如 ./ 和 ../。

相对链接更便于用户克隆仓库。 绝对链接可能无法用于仓库的克隆 - 建议使用相对链接引用仓库中的其他文件。

图像
通过添加 ! 并 将 alt 文本用 [ ] 括起来，可显示图像。 替换文字是等效于图像中信息的短文本。 然后将图像的链接用括号 () 括起来。

![Screenshot of a comment on a GitHub issue showing an image, added in the Markdown, of an Octocat smiling and raising a tentacle.](https://myoctocat.com/assets/images/base-octocat.svg)

GitHub 问题评论的屏幕截图，其中显示了添加在 Markdown 中的 Octocat 微笑并举起触手的图像。

GitHub 支持将图像嵌入到议题、拉取请求、讨论、评论和 .md 文件中。 您可以从仓库显示图像、添加在线图像链接或上传图像。 有关详细信息，请参阅“上传资产”。

注意：想要显示存储库中的图像时，请使用相对链接而不是绝对链接。

下面是一些使用相对链接显示图像的示例。

上下文	相对链接
在同一分支的 .md 文件中	/assets/images/electrocat.png
在另一个分支的 .md 文件中	/../main/assets/images/electrocat.png
在仓库的议题、拉取请求和评论中	../blob/main/assets/images/electrocat.png?raw=true
在另一个存储库的 .md 文件中	/../../../../github/docs/blob/main/assets/images/electrocat.png
在另一个仓库的议题、拉取请求和评论中	../../../github/docs/blob/main/assets/images/electrocat.png?raw=true
注意：上表中的最后两个相对链接只有在查看者至少对包含这些图像的专用存储库具有读取访问权限时，才可用于专用存储库中的图像。

有关详细信息，请参阅“相对链接”。

指定图像显示的主题
你可以通过结合使用 HTML <picture> 元素和 prefers-color-scheme 媒体功能来指定在 Markdown 中显示图像的主题。 我们区分浅色和深色模式，因此有两个选项可用。 可以使用这些选项来显示针对深色或浅色背景进行了优化的图像。 这对于透明的 PNG 图像特别有用。

例如，以下代码显示浅色主题的太阳图像和深色主题的月亮：

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/25423296/163456776-7f95b81a-f1ed-45f7-b7ab-8fa810d529fa.png">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/25423296/163456779-a8556205-d0a5-45e2-ac17-42d089e3c3f8.png">
  <img alt="Shows an illustrated sun in light mode and a moon with stars in dark mode." src="https://user-images.githubusercontent.com/25423296/163456779-a8556205-d0a5-45e2-ac17-42d089e3c3f8.png">
</picture>
通过使用附加到 URL（#gh-dark-mode-only 或 #gh-light-mode-only）的片段来基于主题指定图像的旧方法已被弃用并将被删除，以支持上述新方法。

列表
可通过在一行或多行文本前面加上 -、* 或 + 来创建一个无序列表。

- George Washington
* John Adams
+ Thomas Jefferson
呈现的 GitHub Markdown 的屏幕截图，其中显示了前三位美国总统姓名的项目符号列表。

要对列表排序，请在每行前面添加一个编号。

1. James Madison
1. James Monroe
1. John Quincy Adams
呈现的 GitHub Markdown 的屏幕截图，其中显示了第四位、第五位和第六位美国总统姓名的编号列表。

嵌套列表
通过在一个列表项下面缩进一个或多个其他列表项，可创建嵌套列表。

若要使用 GitHub 上的 Web 编辑器或使用等宽字体的文本编辑器（例如 Visual Studio Code）创建嵌套列表，可以直观地对齐列表。 在嵌套列表项的前面键入空格字符，直至列表标记字符（- 或 *）位于其上方条目中第一个文本字符的正下方。

1. First list item
   - First nested list item
     - Second nested list item
注意：在基于 Web 的编辑器中，可以先突出显示所需的行，然后分别使用 Tab 或 Shift+Tab 来缩进或取消缩进一行或多行文本。

Visual Studio Code 中的 Markdown 的屏幕截图，其中显示了缩进项目符号如何与其上方文本行的第一个字母垂直对齐。

呈现的 GitHub Markdown 的屏幕截图，其中显示了一个编号项，后跟一个向右嵌套一级的项目符号项，另一个项目符号项嵌套在更右侧。

要在 GitHub 上的评论编辑器中创建嵌套列表（不使用等宽字体），您可以查看嵌套列表正上方的列表项，并计算该条目内容前面的字符数量。 然后在嵌套列表项的前面键入该数量的空格字符。

在本例中，可以通过将嵌套列表项缩进至少五个空格来在列表项 100. First list item 下添加一个嵌套列表项，因为在 First list item 前面有五个字符 (100 .)。

100. First list item
     - First nested list item
呈现的 GitHub Markdown 的屏幕截图，其中列表项以数字 100 开头，后跟一个向右嵌套一级的项目符号项。

您可以使用相同的方法创建多层级嵌套列表。 例如，由于在第一个嵌套列表项中，嵌套列表项内容 First nested list item 之前有七个字符 (␣␣␣␣␣-␣)，因此需要将第二个嵌套列表项至少缩进两个以上的字符（最少九个空格）。

100. First list item
       - First nested list item
         - Second nested list item
呈现的 GitHub Markdown 的屏幕截图，其中列表项以数字 100 开头，后跟一个向右嵌套一级的项目符号项，另一个项目符号项嵌套在更右侧。

有关更多示例，请参阅 GitHub 式 Markdown 规范。

任务列表
若要创建任务列表，请在列表项前加连字符和空格，后接 [ ]。 要将任务标记为完成，请使用 [x]。

- [x] #739
- [ ] https://github.com/octo-org/octo-repo/issues/740
- [ ] Add delight to the experience when all tasks are complete :tada:
显示 Markdown 的呈现版本的屏幕截图。 对问题的引用呈现为问题标题。

如果任务列表项说明以括号开头，则需要使用 \ 进行转义：

- [ ] \(Optional) Open a followup issue

有关详细信息，请参阅“关于任务列表”。

提及人员和团队
可以在 GitHub 上提及人员或团队，方法是键入 @ 加上其用户名或团队名称。 这将触发通知并提请他们注意对话。 如果您在编辑的评论中提及某人的用户名或团队名称，该用户也会收到通知。 有关通知的详细信息，请参阅“关于通知”。

注意：仅当该人员具有对存储库的读取访问权限，该存储库为组织所拥有，且此人是组织成员时，才会收到有关提及的通知。

@github/support What do you think about these updates?

呈现的 GitHub Markdown 的屏幕截图，其中显示了团队提及“@github/support”的方式呈现为粗体、可单击的文本。

当您提及父团队时，其子团队的成员也会收到通知，这简化了与多个人员团队的沟通。 有关详细信息，请参阅“关于团队”。

键入 @ 符号将显示项目中的人员或团队列表。 列表会在您键入时进行过滤，因此一旦找到所需人员或团队的名称，您可以使用箭头键选择它，然后按 Tab 或 Enter 键以填写名称。 对于团队，输入 @organization/team-name，该团队的所有成员都将订阅对话。

自动填写结果仅限于仓库协作者和该线程上的任何其他参与者。

引用议题和拉取请求
可以通过键入 # 在存储库中调出建议的议题和拉取请求的列表。 键入议题或拉取请求的编号或标题以过滤列表，然后按 Tab 或 Enter 键以填写选中的结果。

有关详细信息，请参阅“自动链接引用和 URL”。

引用外部资源
如果自定义自动链接引用配置用于仓库，则对外部资源（如 JIRA 议题或 Zendesk 事件单）的引用将转换为缩短的链接。 要了解在您的仓库中哪些自动链接可用，请联系拥有仓库管理员权限的人。 有关详细信息，请参阅“配置自动链接以引用外部资源”。

上传资产
您可以通过拖放、从文件浏览器中选择或粘贴来上传图像等资产。 可以将资产上传到议题、拉取请求、评论和存储库中的 .md 文件。

使用表情符号
你可以通过键入 :EMOJICODE:（冒号后跟表情符号的名称）将表情符号添加到写作中。

@octocat :+1: This PR looks great - it's ready to merge! :shipit:

呈现的 GitHub Markdown 的屏幕截图，其中显示了 +1 的表情符号代码以及 shipit 如何直观呈现表情符号。

键入 : 将显示建议的表情符号列表。 列表将在你键入时进行筛选，因此一旦找到所需表情符号，请按 Tab 或 Enter 键以填写突出显示的结果 。

有关可用表情符号和代码的完整列表，请参阅 Emoji-Cheat-Sheet。

段落
通过在文本行之间留一个空白行，可创建新段落。

脚注
您可以使用此括号语法为您的内容添加脚注：

Here is a simple footnote[^1].

A footnote can also have multiple lines[^2].

[^1]: My reference.
[^2]: To add line breaks within a footnote, prefix new lines with 2 spaces.
  This is a second line.
脚注将呈现如下：

呈现的 Markdown 的屏幕截图，其中显示了用于指示脚注的上标数字，以及笔记中的可选换行符。

注意：Markdown 中脚注的位置不会影响该脚注的呈现位置。 您可以在引用脚注后立即写脚注，脚注仍将呈现在 Markdown 的底部。

Wiki 不支持脚注。

警报
注意：beta 测试期间使用的语法现已弃用，将被删除。 可以使用本节中所述的语法。

警报是用于强调关键信息的 Markdown 的扩展。 在 GitHub 上，它们以独特的颜色和图标显示，以指示内容的重要性。

建议将警报的使用限制为每篇文章一到两个，以避免读取器重载。 应避免使用连续注释。

有三种类型的警报可用。

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.
下面是呈现的警报。

呈现的 Markdown 的屏幕截图，显示了警报如何以带有图标的彩色框呈现。

隐藏有评论的内容
您可以通过在 HTML 评论中加入内容来指示 GitHub 隐藏渲染的 Markdown 中的内容。

<!-- This content will not appear in the rendered Markdown -->
忽略 Markdown 格式
通过在 Markdown 字符前面输入 \，可指示 GitHub 忽略 Markdown 格式（或对其进行转义）。

Let's rename \*our-new-project\* to \*our-old-project\*.

呈现的 GitHub Markdown 的屏幕截图，其中显示了反斜杠如何阻止将星号转换为斜体。 文本显示“让我们将 our-new-project 重命名为 our-old-project”。

有关反斜杠的详细信息，请参阅 Daring Fireball 的“Markdown 语法”。

注意：在问题或拉取请求的标题中不会忽略 Markdown 格式。

禁用 Markdown 渲染
查看 Markdown 文件时，可单击文件顶部的  以禁用 Markdown 呈现并改为查看文件的源。

GitHub 存储库中的 Markdown 文件的屏幕截图，其中显示了用于与文件交互的选项。 显示源 blob 的按钮用深橙色框出。

禁用 Markdown 呈现使你能够使用源视图功能，例如行链接，这在查看呈现的 Markdown 文件时不可用。
