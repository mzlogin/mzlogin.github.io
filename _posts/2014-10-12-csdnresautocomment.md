---
layout: post
title: CSDN已下载资源自动批量评论脚本
categories: python
---

###背景
CSDN账号过一段时间就会累积几十个下载过但是未评论打分的资源，虽然现在上传了一些资源供别人下载后基本不愁积分，但是为了可持续发展，还是把评论一下就能顺手拿了的这种积分不客气地收入囊中吧！不过手动一个一个去评论真的很蛋疼……特别是CSDN还搞了个两个评论间隔不能小于60秒的限制，评论几十个就得至少花个几十分钟折腾，所以想想这种耗时、无脑的活还是交给程序来完成吧。

对于这类模拟HTTP请求然后可能频繁用到页面解析和正则表达式之类的活，用C++写还是有点蛋疼的，用我那半生不熟的Python练练手正合适。

遂在github上建了个仓库开工，地址在这里：<https://github.com/mzlogin/CsdnResourceAutoComment>。

###分析
使用Fiddler把*登录-到待评论页面-评论*的完整流程抓了一下，整理程序逻辑大致如下：

*注：如下HTTP请求均使用同一个SESSION。*

1. 手动输入CSDN的用户名和密码。

2. 用`GET`方法从https://passport.csdn.net/account/login页面获取`lt`、`execution`和`_eventId`等参数。

3. 将第1步中的用户名和密码，还有第2步中得到的参数`POST`给https://passport.csdn.net/account/login，从Response中判断是否登录成功——我采用的依据是status\_code为200且Reponse内容中有`lastLoginIP`。

4. 用`GET`方法从http://download.csdn.net/my/downloads页面获取已下载资源总页数。从最后一个`pageliststy`的`href`中得到。

5. 根据第4步中得到的总页数，根据每个页面num拼得url为http://download.csdn.net/my/downloads/num，使用`GET`方法访问之拿到该页面中所有待评论资源ID。从所有`class="btn-comment"的`a`标签的`href`中得到。

6. 对第5步中得到的所有待评论资源ID依次进行间隔至少60S的打分评论，随机打出1到5星，对应一句英文短句评论。出乎我意料的是评论这一步竟然也是用`GET`就可以做，http://download.csdn.net/index.php/comment/post_comment后面带上`sourceid`、`content`（评论内容）、`rating`（打分）和`t`（时间戳）参数就可以。评论成功会返回`({"succ":1})`，失败会返回“两次评论需要间隔60秒”、“您已经发表过评论”等之类的`msg`。

最终运行截图如下：
![CSDN自动批量打分评论](/images/posts/python/csdncommenter.png)

确认这种方式能有效拿到CSDN的分数：
![CSDN自动评论得分](/images/posts/python/csdnscore.png)

###总结
用Python干这种类型的活还是很有优势的，requests和BeautifulSoup简直神器啊！

###源码
没有找到从Github Pages引用Github仓库里的源码的方法，所以把py文件放到一个gist里了，引用如下：

<%gist mzlogin/fcbfcdd630ee9a767b83 %}
