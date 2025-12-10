# React 作为 UI 运行时

> 参考：[React as a UI Runtime](https://overreacted.io/react-as-a-ui-runtime/) - Dan Abramov

## 核心概念

### React 是什么？

大多数教程将 React 介绍为 UI 库。这是有道理的，因为 React **就是**一个 UI 库。

但本文从不同的角度讨论 React——更像是**编程运行时**。

---

##  主机树（Host Tree）

### 什么是主机树？

React 程序通常输出**一个可能随时间变化的树**。它可能是：
- DOM 树
- iOS 层次结构
- PDF 原语树
- JSON 对象

我们称它为"**主机树**"，因为它是 React 外部**主机环境**的一部分——如 DOM 或 iOS。主机树通常有自己的命令式 API。React 是它上面的一层。

### React 的作用

抽象地说，React 帮助你编写一个程序，可以**可预测地操作复杂的主机树**，以响应外部事件，如交互、网络响应、计时器等。

### React 的两个原则

React 基于两个原则：

1. **稳定性（Stability）**
   - 主机树相对稳定，大多数更新不会从根本上改变其整体结构
   - 如果应用每秒将所有交互元素重新排列成完全不同的组合，将难以使用

2. **规律性（Regularity）**
   - 主机树可以分解为外观和行为一致的 UI 模式（如按钮、列表、头像）
   - 而不是随机形状

**这些原则对大多数 UI 来说都是正确的。**

---

## 主机实例（Host Instances）

### 什么是主机实例？

主机树由节点组成。我们称它们为"**主机实例**"。

- 在 DOM 环境中，主机实例是常规 DOM 节点
- 在 iOS 中，主机实例可能是从 JavaScript 唯一标识原生视图的值

主机实例有自己的属性（如 `domNode.className` 或 `view.tintColor`）。它们也可能包含其他主机实例作为子节点。

### 操作主机实例

通常有 API 来操作主机实例。例如，DOM 提供 `appendChild`、`removeChild`、`setAttribute` 等 API。

在 React 应用中，你通常不调用这些 API。**这是 React 的工作**。

---

## 渲染器（Renderers）

### 什么是渲染器？

**渲染器**教 React 如何与特定的主机环境对话并管理其主机实例。

- React DOM
- React Native
- Ink（终端 UI）

你还可以[创建自己的 React 渲染器](https://github.com/facebook/react/tree/master/packages/react-reconciler)。

### 渲染器模式

React 渲染器可以以两种模式之一工作：

1. **"可变"模式（Mutating Mode）**
   - 大多数渲染器都使用这种模式
   - 这是 DOM 的工作方式：我们可以创建节点、设置其属性，然后稍后添加或删除子节点
   - 主机实例完全可变

2. **"持久"模式（Persistent Mode）**
   - 用于不提供 `appendChild()` 等方法的主机环境
   - 而是克隆父树并始终替换顶级子节点
   - 主机树级别的不可变性使多线程更容易
   - React Fabric 利用这一点

---

## React 元素（React Elements）

### 什么是 React 元素？

在主机环境中，主机实例（如 DOM 节点）是最小的构建块。在 React 中，最小的构建块是**React 元素**。

React 元素是一个普通的 JavaScript 对象。它可以**描述**一个主机实例。

```jsx
// JSX 是这些对象的语法糖
// <button className="blue" />
{
  type: 'button',
  props: { className: 'blue' }
}
```

React 元素是轻量级的，没有绑定主机实例。它只是你想要在屏幕上看到的内容的**描述**。

### React 元素树

像主机实例一样，React 元素可以形成树：

```jsx
// JSX 是这些对象的语法糖
// <dialog>
//   <button className="blue" />
//   <button className="red" />
// </dialog>
{
  type: 'dialog',
  props: {
    children: [
      { type: 'button', props: { className: 'blue' } },
      { type: 'button', props: { className: 'red' } }
    ]
  }
}
```

---

## 协调（Reconciliation）

### 什么是协调？

React 的核心工作是**协调**：找出如何将一个元素树转换为主机树。

### 协调过程

1. **渲染阶段**：React 遍历元素树，决定要创建、更新或删除哪些主机实例
2. **提交阶段**：React 将更改应用到主机树

### Diff 算法

React 使用**Diff 算法**来高效地找出两个元素树之间的差异：

- 如果元素类型相同，React 会更新主机实例
- 如果元素类型不同，React 会替换主机实例
- 如果元素有 key，React 使用 key 来匹配元素

---

##  组件（Components）

### 什么是组件？

组件是**返回元素树的函数**。

```jsx
function Button({ color, children }) {
  return {
    type: 'button',
    props: {
      className: 'Button-' + color,
      children: children
    }
  };
}
```

### 组件渲染

当 React 看到一个元素，其 `type` 是一个函数时：

1. React 调用该函数，传入 props
2. React 获取返回的元素树
3. React 递归地协调该树

---

##  状态（State）

### 什么是状态？

状态是组件"记住"某些信息的方式。

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### 状态更新

当调用 `setCount` 时：
1. React 标记组件需要重新渲染
2. React 调用组件函数，传入新的状态值
3. React 协调新的元素树与旧的主机树
4. React 更新主机树以匹配新的元素树

---

## 数据流

### 单向数据流

React 使用**单向数据流**：

1. 状态在组件中定义
2. 状态通过 props 向下传递
3. 事件向上冒泡，触发状态更新
4. 状态更新导致重新渲染

### 数据流示例

```jsx
function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <Counter count={count} onIncrement={() => setCount(count + 1)} />
    </div>
  );
}

function Counter({ count, onIncrement }) {
  return (
    <button onClick={onIncrement}>
      Count: {count}
    </button>
  );
}
```

---

##  关键要点

1. **React 是 UI 运行时**：它管理主机树，响应事件
2. **主机树是稳定的**：大多数更新不会改变整体结构
3. **React 元素是描述**：它们描述你想要看到的内容
4. **协调是核心**：React 找出如何高效地更新主机树
5. **组件是函数**：它们返回元素树
6. **状态触发重新渲染**：状态更新导致组件重新渲染

---

## 参考资源

- [原文：React as a UI Runtime](https://overreacted.io/react-as-a-ui-runtime/)
- [React 协调算法](https://react.dev/learn/preserving-and-resetting-state)
- [React 元素](https://react.dev/learn/writing-markup-with-jsx)

---

**关键要点**：React 是一个编程运行时，它管理主机树并响应事件。理解这个模型有助于更好地使用 React。

