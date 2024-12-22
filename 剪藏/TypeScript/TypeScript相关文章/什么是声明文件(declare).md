---
link: https://juejin.cn/post/6844903993727008776
title: TypeScript系列🔥尾声篇, 什么是声明文件(declare)? [🦕全局声明篇]
description: 年底比较忙🔥, 受个人时间限制, 暂把"声明"部分的内容分为"全局声明篇"和"模块声明篇", 👷还请多多包涵, 本次先说"全局". 声明文件就是给js代码补充类型标注. 这样在ts编译环境下就不会提示js文件"缺少类型". 看过vue3源码的同学一定知道这些是vue中的变量…
keywords: TypeScript,Vue.js
author: 首页 首页 沸点 课程 直播 活动 竞赛 商城 App 插件 搜索历史 清空 创作者中心 写文章 发沸点 写笔记 写代码 草稿箱 创作灵感 查看更多 会员 登录
date: 2019-11-13T09:16:36.000Z
publisher: 稀土掘金
stats: paragraph=67 sentences=56, words=276
---
## 往期目录

[第一课, 体验typescript](https://juejin.im/post/6844904008583217165 "https://juejin.im/post/6844904008583217165")

[第二课, 基础类型和入门高级类型](https://juejin.im/post/6844904008583233544 "https://juejin.im/post/6844904008583233544")

[第三课, 泛型](https://juejin.im/post/6844904008587411463 "https://juejin.im/post/6844904008587411463")

[第四课, 解读高级类型](https://juejin.im/post/6844903902563794952 "https://juejin.im/post/6844903902563794952")

[第五课, 命名空间(namespace)是什么](https://juejin.im/post/6844903921031479309 "https://juejin.im/post/6844903921031479309")

[特别篇, 在vue3🔥源码中学会typescript🦕 - "is"](https://juejin.im/post/6844903967877513230 "https://juejin.im/post/6844903967877513230")

[第六课, 什么是声明文件(declare)? 🦕 - 全局声明篇](https://juejin.im/post/6844903993727008776 "https://juejin.im/post/6844903993727008776")

[第七课, 通过vue3实例说说declare module语法怎么用🦕模块声明篇](https://juejin.cn/post/7008710181769084964 "https://juejin.cn/post/7008710181769084964")

[新开发vscode插件: ⚡any-type, 一键json到ts类型](https://juejin.cn/post/7055097715994132516 "https://juejin.cn/post/7055097715994132516")

## 全局声明篇

年底比较忙🔥, 受个人时间限制, 暂把"声明"部分的内容分为" **全局声明篇**"和" **模块声明篇**", 👷还请多多包涵, 本次先说" **全局**".

## 什么是声明文件?

**声明文件就是给js代码补充类型标注**. 这样在ts编译环境下就不会提示js文件"缺少类型".

声明变量使用关键字 `declare`来表示声明其后面的 **全局**变量的类型, 比如:

```typescript

declare var __DEV__: boolean
declare var __TEST__: boolean
declare var __BROWSER__: boolean
declare var __RUNTIME_COMPILE__: boolean
declare var __COMMIT__: string
declare var __VERSION__: string
复制代码
```

看过vue3源码的同学一定知道这些是vue中的变量, 上面代码表示 `__DEV__`等变量是全局, 并且标注了他们的类型. 这样无论在项目中的哪个ts文件中使用 `__DEV__`, 变量ts编译器都会知道他是 `boolean`类型.

## 声明文件在哪里?

首先声明文件的文件名是有规范要求的, 必须以 `.d.ts`结尾, 看了上面的代码你肯定想练习写下声明文件, 但是你可能想问了" **写完放在哪里**", 网上说声明文件放在项目里的 **任意路径/文件名**都可以被ts编译器识别, 但实际开发中发现, 为了规避一些奇怪的问题, **推荐放在根目录下**.

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a1e5435fc4b49d0992137558bbeb2ba~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image)

## 别人写好的声明文件( @types/xxx )

一般比较大牌的第三方js插件在npm上都有对应的声明文件, 比如jquery的声明文件就可以在npm上下载:

```shell
npm i @types/jquery
复制代码
```

`npm i @types/jquery`中的jquery可以换成任意js库的名字, 当然 **前提是有人写了对应的声明文件发布到了npm**.

**安装后**, 我们可以在 `node_modules/@types/jquery`中的看到声明文件, 这里我打开 `mise.d.ts`文件:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b830a2f95564185bc8a65cb1c526709~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image)

## 声明文件对纯js项目有什么帮助?

即便你只写js代码, 也可以安装声明文件, 因为如果你用的是 **vscode**, 那么他会自动分析js代码, 如果存在对应的声明文件, vscode会把声明文件的内容作为 **代码提示**.

`jquery`在安装了声明文件后

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7dcc9efd5ef8446385d00a8c85027b39~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image)

## 什么情况下要自己写声明文件?

如果"@types/"下找不到声明文件, 那么就需要我们自己手写了.

## 🔥如何写声明文件?

声明文件分2大类, 一类是全局声明, 一类是对模块的声明. 这节只说"全局".

### 全局声明

通过 `declare`我们可以标注js全局变量的类型.

#### 简单应用

```typescript

declare var n: number;
declare let s: string;
declare const o: object;
declare function f(s: string): number;
declare enum dir {
    top,
    right,
    bottom,
    left
}
复制代码
```

声明之后,我们就可以在任意文件中直接操作变量:

```typescript
n = 321
s = '文字'
let o1 = o;
f('123').toFixed();
dir.bottom.toFixed();

n = '312'
s = 123
复制代码
```

#### declare namespace

这个 `namespace`代表后面的全局变量是一个对象:

```typescript

declare namespace MyPlugin {
    var n:number;
    var s:string;
    var f:(s:string)=>number;
}
复制代码
```

```typescript
MyPlugin.s.substr(0,1);
MyPlugin.n.toFixed();
MyPlugin.f('文字').toFixed();

MyPlugin.s.toFixed();
MyPlugin.n.substr(0,1);
MyPlugin.f(123);
复制代码
```

#### 修改已存在的全局声明

其实我们安装完t **ypescript**, 会自动给我们安装一些系统变量的声明文件, 存在 `node_modules/typescript/lib`下.

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4a547d4b42e4e2d88161535e7df12dd~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image)

如果你要修改 **已存在**的全局变量的声明可以这么写, 下面用node下的 `global`举例,

```typescript
declare global {
    interface String {
        hump(input: string): string;
    }
}

export {}
复制代码
```

现在 `String`类型在vscode的语法提示下多了一个 `hump`的方法,不过我们只是声明, 并没有用js实现, 所以运行会报错, 所以不要忘了写js的实现部分哦.

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d53b37a1ea9427799d8de6dd64295dd~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image)

## 总结

年底真是比较忙, 但是之前答应了更新ts的内容, 所以只能一步步完成"声明"部分的内容, 还请见谅👷.

多写多练, 很快就上手, 放几个我用ts写的项目当做参考, 抛砖引玉, 加油!

**✋ 移动/pc端手势库, 支持: tap/press/pan/swipe/rotate/pinch**

[github.com/any86/any-t...](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fany86%2Fany-touch "https://github.com/any86/any-touch")

**🍭 把vue组件变成this.$xxx这样的命令**

[github.com/any86/vue-c...](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fany86%2Fvue-create-root "https://github.com/any86/vue-create-root")

## 微信群

感谢大家的阅读, 如有疑问可以加我微信, 我拉你进入 **微信群**(由于腾讯对微信群的100人限制, 超过100人后必须由群成员拉入)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad6c8f0de524493ea506868ef796da93~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image)
