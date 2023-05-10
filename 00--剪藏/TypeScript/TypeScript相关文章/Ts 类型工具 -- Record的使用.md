---
link: https://juejin.cn/post/7112047649150205983
title: TS 类型工具 : Record的使用
description: 持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第16天，点击查看活动详情 TS 给我们提供了一系列的高级类型，简化了我们在类型定义时的工作，其中 Record 又被广泛的使用，这
keywords: TypeScript
author: 首页 首页 沸点 课程 直播 活动 竞赛 商城 App 插件 搜索历史 清空 创作者中心 写文章 发沸点 写笔记 写代码 草稿箱 创作灵感 查看更多 会员 登录
date: 2022-06-22T12:57:28.000Z
publisher: 稀土掘金
stats: paragraph=30 sentences=3, words=192
---
# 正文

TS 给我们提供了一系列的高级类型，简化了我们在类型定义时的工作，其中 Record 又被广泛的使用，这篇文章介绍了 Record 是如何定义的，以及如何理解 Record 的源码，同时给出了 Record 的常见的使用场景。

## 释义

> `Record<K,T>`
> 
Constructs an object type whose property keys are Keys and whose property values are Type. This utility can be used to map the properties of a type to another type." —
构造一个对象类型， `Keys` 表示对象的属性键 、 `Type` 表示对象的属性值，用于将一种类型属性映射到另一种类型

理解为：将 K 的每一个值都定义为 T 类型

## 源码

```ts
/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

源码也比较简单，即将K中的每个属性([P in K]),都转为T类型。常用的格式如下：

```ts
type proxyKType = Record
```

会将K中的所有属性值都转换为T类型，并将返回的新类型返回给proxyKType，K可以是联合类型、对象、枚举等

## 示例1

一条数据的状态值有：

* 已创建 created
* 已提交 submited
* 已删除 removed

```ts
type state = "created" | "submitted" | "removed"
```

现在需要创建一个状态值映射对象, 这个兑现的成员是每一个状态值，成员的值是 `String`类型。

如果我们手动描述类型的需要这么写：

```ts
interface StatesInterface {
  created:string
  submitted:string
  removed:string
}

export const states:StatesInterface = {
  created:'01',
  submitted:'02',
  removed:'03'
}
```

使用 `Record`后可以省去我们对 `StatesInterface`接口的定义：

```ts
export const states:Record<state,string> = {
  created:'01',
  submitted:'02',
  removed:'03'
}
```

## 示例2

比如现在要定义一个叫食物原料的对象，对象的值由我们规定的几种食物原料组成，我们可以定义原料类型，原料类型可以是巧克力，可可，蘑菇等，并且他们都是string类型，然后使用 Record 对他们进行包装。如下：

```ts
type Ingredient = "chocolate" | "peanuts" | "cocoa" | "marshmallow" | "cherry";

export const ingredients: Record<Ingredient, string> = {
  chocolate: "Chocolate",
  cocoa: "Cocoa Powder",
  cherry: "Cherry",
  marshmallow: "Marshmallow",
  peanuts: "Peanut Butter",
};
```

当然也可以自己在第一个参数后追加额外的值，如：

```ts
type Ingredient = "chocolate" | "peanuts" | "cocoa" | "marshmallow" | "cherry";

export const ingredients: Record<Ingredient | "apple", string> = {
  chocolate: "Chocolate",
  cocoa: "Cocoa Powder",
  cherry: "Cherry",
  marshmallow: "Marshmallow",
  peanuts: "Peanut Butter",
  apple: "Apple"
};
```

额外添加了一种原料叫 Apple

## 使用场景

通过了解 Record 的源码以及相关例子的实现，可以总结出以下常见的Record使用场景：

* 当我们想限制对象的属性时
* 转换现有类型的属性并将其值转换为其它类型时（结合keyof使用）

Record是一个有用和简要的工具类型，可以让你的代码更健壮，在编译时更容易捕获错误，并且使IDE更加容易的标记错误。
