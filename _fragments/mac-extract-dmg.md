---
layout: fragment
title: 软路由Docker中搭建不用翻墙的ChatGPT
tags: ChatGPT
description: 软路由Docker中搭建不用翻墙的ChatGPT
keywords: chatgpt, docker
---

软路由Docker中搭建不用翻墙的ChatGPT

```
docker run \
       --name chatgpt-web \
       -p 3002:3002 \
       --env OPENAI_API_KEY=Your key \
       --restart always \
       -d chenzhaoyu94/chatgpt-web:latest
```

速度可以媲美官网OpenAI
