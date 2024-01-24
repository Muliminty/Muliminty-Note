---
link: https://blog.csdn.net/Sweet__Cat/article/details/86143510
title: Git 克隆错误RPC failed; curl 56 Recv failure: Connection was reset.’ 及克隆速度慢问题解决
description: 问题描述在网络情况不稳定下克隆项目时，可能会出现下图中的错误。问题原因： http缓存不够或者网络不稳定等。解决方法打开cmd，修改git配置（加大httpBuffer） 即可。git config --global http.postBuffer 524288000...
keywords: Git 克隆错误RPC failed; curl 56 Recv failure: Connection was reset.’ 及克隆速度慢问题解决
author: Sweet__cat Csdn认证博客专家 Csdn认证企业博客 码龄6年 暂无认证
date: 2023-04-02T14:40:58.000Z
publisher: null
stats: paragraph=5 sentences=3, words=11
---
### 问题描述

在网络情况不稳定下克隆项目时，可能会出现下图中的错误。
**问题原因： http缓存不够或者网络不稳定等。**
![](https://img-blog.csdnimg.cn/20190109122258622.png)

### <a name="_5">;</a> 解决方法

打开cmd，修改git配置（加大httpBuffer） 即可。

```
git config --global http.postBuffer 524288000
```
