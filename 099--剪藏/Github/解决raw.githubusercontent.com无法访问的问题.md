---
link: https://blog.csdn.net/weixin_44293949/article/details/121863559
title: 解决raw.githubusercontent.com无法访问的问题
description: 在这个博主的基础上再添加一点，自己的记录原本显示报错：ConnectionError: Couldn’t reach https://raw.githubusercontent.com/huggingfac无法访问然后照着博主的放在https://www.ipaddress.com这个网站中的查询框中输入：raw.githubusercontent.com回车就能有下图中的网页，在里面找到相应的的ipv4地址：这四个地址随便选一个即可：在C盘目录中搜索hosts，用记事本打开，在里面添加一行类似
keywords: github raw无法访问
author: 哇咔君I Csdn认证博客专家 Csdn认证企业博客 码龄4年 暂无认证
date: 2021-12-10T11:42:39.000Z
publisher: null
stats: paragraph=6 sentences=15, words=19
---
在[这个博主](https://blog.csdn.net/u012782078/article/details/106109620?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2~default~CTRLIST~default-2.no_search_link&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2~default~CTRLIST~default-2.no_search_link)的基础上再添加一点，自己的记录

原本显示报错：ConnectionError: Couldn't reach https://raw.githubusercontent.com/huggingfac
无法访问

然后照着博主的放在[https://www.ipaddress.com](https://www.ipaddress.com)这个网站中的查询框中输入：raw.githubusercontent.com
回车就能有下图中的网页，在里面找到相应的的ipv4地址：
这四个地址随便选一个即可：![](https://img-blog.csdnimg.cn/e28d7e5f661c45078f7f7bd1889a7a6c.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5ZOH5ZKU5ZCbaQ==,size_20,color_FFFFFF,t_70,g_se,x_16)
在C盘目录中搜索hosts，用记事本打开，在里面添加一行类似这样的（ipv4地址换成自己查到的就行）：

```python
185.199.108.133 raw.githubusercontent.com
```

![](https://img-blog.csdnimg.cn/3cb4d95c4d2b42fd843ba57db34c4f85.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5ZOH5ZKU5ZCbaQ==,size_20,color_FFFFFF,t_70,g_se,x_16)

保存，关掉，再跑程序，就可以了，如果还不可以，试着重启一下
![](https://img-blog.csdnimg.cn/cc98f9dcfbd54e828b031f0371aa0cb0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5ZOH5ZKU5ZCbaQ==,size_20,color_FFFFFF,t_70,g_se,x_16)
完。
