## 前置介绍

TypeScript支持与JavaScript几乎相同的数据类型，另外也提供了枚举等JavaScript不具备的类型，方便开发者使用。对于和JavaScript相同的类型就不做太多介绍需要的可以翻看官方文档，这里只对一些语法上的差异以及TypeScript独有的类型进行备注

[基础类型 · TypeScript中文网 · TypeScript——JavaScript的超集](https://www.tslang.cn/docs/handbook/basic-types.html)

## 与JavaScript相同的部分

首先介绍一下在Ts是怎么进行变量的声明，下面是各个基础数据类型的声明

```TypeScript
let decLiteral: number = 6;// 数值
let name: string = "bob";// 字符串
let isDone: boolean = false;// 布尔值
let list: number[] = [1, 2, 3];// 数组1
let list: Array<number> = [1, 2, 3];// 数组2
let u: undefined = undefined;
let n: null = null;
let obj: object = {x: 1};// 对象
let big: bigint = 100n;// bigint
let sym: symbol = Symbol("me");// symbol
```

相信你一眼就能看出上面的规律并总结出语法规律吧

```TypeScript
let 变量名:变量类型 = 值
```

**另外比较特殊的是数组类型**

在Ts中数组的每一项元素类型都需要是一致的。说要需要在定义数组的时候确认该数组的元素。

有两种方式可以定义数组。 第一种，可以在元素类型后面接上 `[]`，表示由此类型元素组成的一个数组，也就是上面的数组1。

第二种方式是使用数组泛型，`Array<元素类型>`：也就是上面的数组2。

## 与JavaScript不同的部分

### 元组 Tuple

[[Ts知识碎片/TypeScript 元组|元组]]类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为 `string`和`number`类型的元组。

