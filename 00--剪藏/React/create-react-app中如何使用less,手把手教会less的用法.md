---
link: https://blog.csdn.net/yun_master/article/details/114767785
title: create-react-app中如何使用less,手把手教会less的用法
description: 前言我们在开发react项目中,一般都会使用脚手架来快速搭建一个项目的大体框架,其中react官方推荐的create-react-app是我在个人项目中最常用的脚手架之一,但是cra的脚手架内置只支持了sass,不支持less.那么对于习惯使用less的小伙伴只能通过我们自己的双手来完成这个任务了.下面以create-react-app中如何使用less为案例,简单介绍一下,less的使用方式.创建create-react-app项目Node内置npx,所以可以直接使用npx来创建项目npx cre
keywords: create-react-app less
author: 不知名前端 Csdn认证博客专家 Csdn认证企业博客 码龄4年 暂无认证
date: 2021-03-13T15:55:47.000Z
publisher: null
stats: paragraph=27 sentences=40, words=144
---
## 前言

我们在开发react项目中,一般都会使用脚手架来快速搭建一个项目的大体框架,其中react官方推荐的create-react-app是我在个人项目中最常用的脚手架之一,但是cra的脚手架内置只支持了sass,不支持less.那么对于习惯使用less的小伙伴只能通过我们自己的双手来完成这个任务了.下面以create-react-app中如何使用less为案例,简单介绍一下,less的使用方式.

## 创建create-react-app项目

Node内置npx,所以可以直接使用npx来创建项目

```
npx create-react-app my-app
```

当然如果你不喜欢这个姿势,那么需要全局安装一下create-react-app,然后再创建项目

```
npm create-react-app -g
create-react-app my-app
```

## 将webpack配置文件暴露出来

注意,这一步是不可逆的操作

```
npm run eject
```

## 安装less与less-loader

安装到本地环境就可以了,因为这个只需要在打包构建的时候用一下,生产环境是不用的

```
npm i less less-loader -D
```

安装好之后,准备工作基本就完成了

## 配置webpack

这个时候,我们需要去项目根目录去找config/webpack.config.js这个文件
![](https://img-blog.csdnimg.cn/20210313233011636.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l1bl9tYXN0ZXI=,size_16,color_FFFFFF,t_70)
然后找到这个位置,设置各种匹配规则的正则这个位置,你可以搜一下cssRegex,对就是这个位置
然后添加一行less文件的匹配规则
![](https://img-blog.csdnimg.cn/20210313233201861.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l1bl9tYXN0ZXI=,size_16,color_FFFFFF,t_70)

```
const lessRegex = \/.less$/i;
```

这一步做完,我们继续找到rule这个配置项,然后在rule这一项,很远很远的位置,可以看到sassModuleRegex(为了你们方便复制搜索,变量名都写在这里)
![](https://img-blog.csdnimg.cn/20210313233648307.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l1bl9tYXN0ZXI=,size_16,color_FFFFFF,t_70)
找到这个位置,在它的后面,添加一段这样的配置

```
{
	test: lessRegex,
		use: getStyleLoaders(
			{
				importLoaders: 3,
				sourceMap: isEnvProduction? shouldUseSourceMap: isEnvDevelopment,
                modules: {
                	getLocalIdent: getCSSModuleLocalIdent,
                },
            },
            'less-loader'
        ),
},
```

好这样就已经配置好了,每次修改webpack.config.js文件,都需要重启项目,使最新的配置生效.

## 验证结果

然后你就可以随便添加一个less文件,试验一下
![](https://img-blog.csdnimg.cn/20210313234217936.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l1bl9tYXN0ZXI=,size_16,color_FFFFFF,t_70)
在App.js里面引入style.less文件,创建一个div,类名如图所示,然后去less文件随便写段样式,保存看结果.

![](https://img-blog.csdnimg.cn/20210313234333570.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l1bl9tYXN0ZXI=,size_16,color_FFFFFF,t_70)
![](https://img-blog.csdnimg.cn/20210313234435896.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l1bl9tYXN0ZXI=,size_16,color_FFFFFF,t_70)
如果顺利的话,恭喜你已经学会如何使用less了.

但是如果像我一样,不顺利的话, 你会 oh! no! 发现报错了
![](https://img-blog.csdnimg.cn/20210313234607530.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l1bl9tYXN0ZXI=,size_16,color_FFFFFF,t_70)
这个是附加知识,像这种鬼报错,一般都是less-loader版本的问题,所以,换个低版本再装一遍,应该就ok了

```
npm i less-loader@7.3.0 -D
```

具体less-loader的版本信息,你可以去npm的网站去搜索less-loader,点击这里
![](https://img-blog.csdnimg.cn/20210313235206854.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l1bl9tYXN0ZXI=,size_16,color_FFFFFF,t_70)
你就能看到详细的版本信息了
![](https://img-blog.csdnimg.cn/20210313235131299.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l1bl9tYXN0ZXI=,size_16,color_FFFFFF,t_70)
刚才那个错误之前没有遇到过,好像只发生在了8.0.0版本.我自己也只试验了7.3.0与6.2.0两个版本,都没有问题.所以应该这中间的版本都没有这个问题.

所以这个是less-loader的用法.同时也是其他各种loader使用方法.大同小异,希望可以举一反三,一举拿下所有loader.对了如果对loader的test规则,以及可用方法存有疑惑,其实可以不用疑惑,你可以去npm搜索相对应的loader,在readme里面,都有详细的介绍
