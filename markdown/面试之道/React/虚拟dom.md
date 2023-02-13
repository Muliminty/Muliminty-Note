# 虚拟dom

## 什么是虚拟dom

reactNode

```js
const VitrualDom = {
  type: 'span',
  props: {
    className: 'span'
  },
  children: [{
    type: 'span',
    props: {},
    children: 'hello echo'
  }]
}

```

虚拟DOM其实只是一个包含了标签类型type，属性props以及它包含子元素children的对象。

## 虚拟DOM的优缺点是什么

**优势**

+ 简单：手动操作真实dom来实现页面的交互效果，既繁琐有容易出错，项目大了之后维护起来也不容易
+ 性能：虚拟dom能够将都将多次真实dom更新合并成一次，可以减少重绘和重排
+ 跨平台：react通过虚拟dom，实现的跨平台的能力，一套代码多端执行。

**缺点**

+ 在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化
+ 首次渲染大量DOM时，由于多了一层虚拟DOM的计算，速度比正常稍慢

> 参考链接 :
>>[稀土掘金  -- [react] 什么是虚拟dom？虚拟dom比操作原生dom要快吗？虚拟dom是如何转变成真实dom并渲染到页面的? --  行星飞行](https://juejin.cn/post/7120141908730445854)。
