---
link: https://juejin.cn/post/7064351631072526350
title: 轻松拿下 TS 泛型
description: 前言 泛型，是 TS 最难理解的部分，拿下了泛型，TS 就没什么难的了。 这是本文的知识图谱： 你掌握了吗？没掌握就一起来查漏补缺吧。学习本文之前，先要有 TS 基础，如果觉得阅读吃力，可以先学习这篇
keywords: 前端,TypeScript
author: 首页 首页 沸点 课程 直播 活动 竞赛 商城 App 插件 搜索历史 清空 创作者中心 写文章 发沸点 写笔记 写代码 草稿箱 创作灵感 查看更多 会员 登录
date: 2022-02-14T00:13:45.000Z
publisher: 稀土掘金
stats: paragraph=152 sentences=46, words=553
---
「这是我参与2022首次更文挑战的第18天，活动详情查看：[2022首次更文挑战](https://juejin.cn/post/7052884569032392740 "https://juejin.cn/post/7052884569032392740")」。

## 前言

泛型，是 TS 最难理解的部分，拿下了泛型，TS 就没什么难的了。

这是本文的知识图谱：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ee9a28c9e804336a3773de1b9ce6261~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

你掌握了吗？没掌握就一起来查漏补缺吧。

学习本文之前，先要有 TS 基础，如果觉得阅读吃力，可以先学习这篇文章，[通俗易懂的 TS 基础知识总结](https://juejin.cn/post/7063970883227877390 "https://juejin.cn/post/7063970883227877390")

## 为什么需要泛型？

如果你看过 TS 文档，一定看过这样两段话：

> 软件工程中，我们不仅要创建一致的定义良好的 API，同时也要考虑可重用性。 组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时为你提供了十分灵活的功能。
**在像 C# 和 Java 这样的语言中，可以使用泛型来创建可重用的组件，一个组件可以支持多种类型的数据。 这样用户就可以以自己的数据类型来使用组件。**

简直说的就不是人话，你确定初学者看得懂？

我觉得初学者应该要先明白为什么需要泛型这个东西，它解决了什么问题？而不是看这种拗口的定义。

我们还是先来看这样一个例子，体会一下泛型解决的问题吧。

定义一个 print 函数，这个函数的功能是把传入的参数打印出来，再返回这个参数，传入参数的类型是 string，函数返回类型为 string。

```typescript
function print(arg:string):string {
    console.log(arg)
    return arg
}
```

现在需求变了，我还需要打印 number 类型，怎么办？

可以使用联合类型来改造：

```typescript
function print(arg:string | number):string | number {
    console.log(arg)
    return arg
}
```

现在需求又变了，我还需要打印 string 数组、number 数组，甚至任何类型，怎么办？

有个笨方法，支持多少类型就写多少联合类型。

或者把参数类型改成 any。

```typescript
function print(arg:any):any {
    console.log(arg)
    return arg
}
```

且不说写 any 类型不好，毕竟在 TS 中尽量不要写 any。

而且这也不是我们想要的结果，只能说传入的值是 any 类型，输出的值是 any 类型，传入和返回 **并不是统一的**。

这么写甚至还会出现bug

```typescript
const res:string = print(123)
```

定义 string 类型来接收 print 函数的返回值，返回的是个 number 类型，TS 并不会报错提示我们。

这个时候，泛型就出现了，它可以轻松解决 **输入输出要一致**的问题。

> 注意：泛型不是为了解决这一个问题设计出来的，泛型还解决了很多其他问题，这里是通过这个例子来引出泛型。

## 泛型基本使用

### 处理函数参数

我们使用泛型来解决上文的问题。

泛型的语法是 `<>` 里写类型参数，一般可以用 `T` 来表示。

```typescript
function print<T>(arg:T):T {
    console.log(arg)
    return arg
}
```

这样，我们就做到了输入和输出的类型统一，且可以输入输出任何类型。

如果类型不统一，就会报错：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4411b32b4414c8585892199cd8cd9f8~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

泛型中的 T 就像一个占位符、或者说一个变量，在使用的时候可以把定义的类型 **像参数一样传入**，它可以 **原封不动地输出**。

> 泛型的写法对前端工程师来说是有些古怪，比如 `<>` `T` ，但记住就好，只要一看到 `<>`，就知道这是泛型。

我们在使用的时候可以有两种方式指定类型。

* 定义要使用的类型
* TS 类型推断，自动推导出类型

```typescript
print<string>('hello')  // 定义 T 为 string

print('hello')  // TS 类型推断，自动推导类型为 string
```

我们知道，type 和 [[../../../300--前端相关/01--前端基础/TypeScript/Ts知识碎片/TypeScript interface 接口|interface]] 都可以定义函数类型，也用泛型来写一下，type 这么写：

```typescript
type Print = <T>(arg: T) => T
const printFn:Print = function print(arg) {
    console.log(arg)
    return arg
}
```

interface 这么写：

```typescript
interface Iprint<T> {
    (arg: T): T
}

function print<T>(arg:T) {
    console.log(arg)
    return arg
}

const myPrint: Iprint<number> = print
```

### 默认参数

如果要给泛型加默认参数，可以这么写：

```typescript
interface Iprint<T = number> {
    (arg: T): T
}

function print<T>(arg:T) {
    console.log(arg)
    return arg
}

const myPrint: Iprint = print
```

这样默认就是 number 类型了，怎么样，是不是感觉 `T` 就如同函数参数一样呢？

### 处理多个函数参数

现在有这么一个函数，传入一个只有两项的元组，交换元组的第 0 项和第 1 项，返回这个元组。

```typescript
function swap(tuple) {
    return [tuple[1], tuple[0]]
}
```

这么写，我们就丧失了类型，用泛型来改造一下。

我们用 T 代表第 0 项的类型，用 U 代表第 1 项的类型。

```typescript
function swap<T, U>(tuple: [T, U]): [U, T]{
    return [tuple[1], tuple[0]]
}
```

这样就可以实现了元组第 0 项和第 1 项类型的控制。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a9a08e24f1a481e81fa89d3e8220dcc~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

传入的参数里，第 0 项为 string 类型，第 1 项为 number 类型。

在交换函数的返回值里，第 0 项为 number 类型，第 1 项为 string 类型。

第 0 项上全是 number 的方法。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1766430bbdc42bbb53687354af65795~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

第 1 项上全是 string 的方法。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34d4c780556344999bdc460f04bf11d7~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

### 函数副作用操作

泛型不仅可以很方便地约束函数的参数类型，还可以用在函数执行副作用操作的时候。

比如我们有一个通用的异步请求方法，想根据不同的 url 请求返回不同类型的数据。

```typescript
function request(url:string) {
    return fetch(url).then(res => res.json())
}
```

调一个获取用户信息的接口：

```typescript
request('user/info').then(res =>{
    console.log(res)
})
```

这时候的返回结果 res 就是一个 any 类型，非常讨厌。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f611ca6aa43547a9adf9dea388b9579a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

我们希望调用 API 都 **清晰的知道返回类型是什么数据结构**，就可以这么做：

```typescript
interface UserInfo {
    name: string
    age: number
}

function request<T>(url:string): Promise<T> {
    return fetch(url).then(res => res.json())
}

request<UserInfo>('user/info').then(res =>{
    console.log(res)
})
```

这样就能很舒服地拿到接口返回的数据类型，开发效率大大提高：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d85a3ad4567f4bc4bdca004853755192~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

## 约束泛型

假设现在有这么一个函数，打印传入参数的长度，我们这么写：

```typescript
function printLength<T>(arg: T): T {
    console.log(arg.length)
    return arg
}
```

因为不确定 T 是否有 length 属性，会报错：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/836e0afdd34b42f2aec13628168dfd23~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

那么现在我想约束这个泛型，一定要有 length 属性，怎么办？

可以和 interface 结合，来约束类型。

```typescript
interface ILength {
    length: number
}

function printLength<T extends ILength>(arg: T): T {
    console.log(arg.length)
    return arg
}
```

这其中的关键就是 `<t extends ilength></t>`，让这个泛型继承接口 `ILength`，这样就能约束泛型。

我们定义的变量一定要有 length 属性，比如下面的 str、arr 和 obj，才可以通过 TS 编译。

```ts
const str = printLength('lin')
const arr = printLength([1,2,3])
const obj = printLength({ length: 10 })
```

这个例子也再次印证了 interface 的 `duck typing`。

只要你有 length 属性，都符合约束，那就不管你是 str，arr 还是obj，都没问题。

当然，我们定义一个不包含 length 属性的变量，比如数字，就会报错：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a8261afe4e7429a804c980d3c1eede7~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

## 泛型的一些应用

使用泛型，可以在定义函数、接口或类的时候，不预先指定具体类型，而是在使用的时候再指定类型。

### 泛型约束类

定义一个栈，有入栈和出栈两个方法，如果想入栈和出栈的元素类型统一，就可以这么写：

```typescript
class Stack<T> {
    private data: T[] = []
    push(item:T) {
        return this.data.push(item)
    }
    pop():T | undefined {
        return this.data.pop()
    }
}
```

在定义实例的时候写类型，比如，入栈和出栈都要是 number 类型，就这么写：

```typescript
const s1 = new Stack<number>()
```

这样，入栈一个字符串就会报错：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6bf0b6eba6a40a486b1a74d490dd63a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

这是非常灵活的，如果需求变了，入栈和出栈都要是 string 类型，在定义实例的时候改一下就好了：

```typescript
const s1 = new Stack<string>()
```

这样，入栈一个数字就会报错：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8f15fa43b864d47800da8a24c85bd5d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

特别注意的是， **泛型无法约束类的静态成员**。

给 pop 方法定义 `static` 关键字，就报错了

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8843a0a665f34484b4b13fab67bcc0a7~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

### 泛型约束接口

使用泛型，也可以对 interface 进行改造，让 interface 更灵活。

```typescript
interface IKeyValue<T, U> {
    key: T
    value: U
}

const k1:IKeyValue<number, string> = { key: 18, value: 'lin'}
const k2:IKeyValue<string, number> = { key: 'lin', value: 18}
```

### 泛型定义数组

定义一个数组，我们之前是这么写的：

```typescript
const arr: number[] = [1,2,3]
```

现在这么写也可以：

```typescript
const arr: Array<number> = [1,2,3]
```

数组项写错类型，报错

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b226f0366594f9bac2d807bfd35f46c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

## 实战，泛型约束后端接口参数类型

我们来看一个泛型非常有助于项目开发的用法，约束后端接口参数类型。

```typescript
import axios from 'axios'

interface API {
    '/book/detail': {
        id: number,
    },
    '/book/comment': {
        id: number
        comment: string
    }
    ...
}


function request<T extends keyof API>(url: T, obj: API[T]) {
    return axios.post(url, obj)
}

request('/book/comment', {
    id: 1,
    comment: '非常棒！'
})
```

这样在调用接口的时候就会有提醒，比如：

路径写错了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5975636be58c4226aaa057dff1b42350~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

参数类型传错了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75ae2936855341e58f4385d81f5c17c9~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

参数传少了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b276689a7804162a924661e169aa67a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

开发效率大大提高啊！可以早点和后端联调完，摸鱼去了。

## 小结

`泛型`（Generics），从字面上理解，泛型就是一般的，广泛的。

泛型是指在定义函数、接口或类的时候，不预先指定具体类型，而是在使用的时候再指定类型。

泛型中的 `T` 就像一个占位符、或者说一个变量，在使用的时候可以把定义的类型 **像参数一样传入**，它可以 **原封不动地输出**。

泛型 **在成员之间提供有意义的约束**，这些成员可以是：函数参数、函数返回值、类的实例成员、类的方法等。

用一张图来总结一下泛型的好处：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc01a49496f848e29c2fa8883ebcf5ec~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image?)

如果我的文章对你有帮助，你的赞👍就是对我的最大支持

**传送门：**

[「1.9W字总结」一份通俗易懂的 TS 教程，入门 + 实战！](https://juejin.cn/post/7068081327857205261 "https://juejin.cn/post/7068081327857205261")

[TS 中 interface 和 type 究竟有什么区别？](https://juejin.cn/post/7063521133340917773 "https://juejin.cn/post/7063521133340917773")
