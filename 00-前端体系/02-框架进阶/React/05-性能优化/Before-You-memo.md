# Before You memo()

> 参考：[Before You memo()](https://overreacted.io/before-you-memo/) - Dan Abramov

## 核心思想

**在使用 `memo()` 之前，先尝试这两种更自然的渲染优化技术：**

1. **将状态向下移动（Move State Down）** - 就像把东西放在离需要它的地方更近的位置
2. **将内容向上提升（Lift Content Up）** - 就像把不相关的东西移到外面

这些技术是**补充性的**，不会替代 `memo` 或 `useMemo`，但通常应该先尝试它们。

**为什么？** 因为它们是更自然、更简单的优化方式，不需要额外的记忆化开销！

---

## 问题场景

### 一个（人为的）慢组件：性能问题的典型例子

让我们看一个典型的性能问题：

```jsx
import { useState } from 'react';

export default function App() {
  let [color, setColor] = useState('red');
  return (
    <div>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p style={{ color }}>Hello, world!</p>
      <ExpensiveTree />  {/*  这个组件很慢！ */}
    </div>
  );
}

function ExpensiveTree() {
  let now = performance.now();
  while (performance.now() - now < 100) {
    // 人工延迟 -- 100ms 内什么都不做
    // 就像这个组件需要 100ms 才能渲染完成
  }
  return <p>I am a very slow component tree.</p>;
}
```

** 问题**：每当 `App` 中的 `color` 改变时，我们会重新渲染 `<ExpensiveTree />`，即使它不关心 `color` 的值。

** 就像**：你只是换了一件衣服，但整个房子都要重新装修一遍！这显然不合理。

** 你的第一反应可能是**：
> "那我用 `memo()` 包装 `ExpensiveTree` 不就行了？"

** 但等等！** 在添加 `memo()` 之前，让我们先看看有没有更简单的方法。

---

##  解决方案 1：将状态向下移动（最简单的方法）

###  分析：找出真正关心状态的部分

如果仔细观察渲染代码，你会注意到只有返回树的一部分真正关心当前的 `color`：

```jsx
export default function App() {
  let [color, setColor] = useState('red');
  return (
    <div>
      <input value={color} onChange={(e) => setColor(e.target.value)} />  {/*  关心 color */}
      <p style={{ color }}>Hello, world!</p>  {/*  关心 color */}
      <ExpensiveTree /> {/*  不关心 color - 它只是被"连累"了！ */}
    </div>
  );
}
```

** 关键观察**：
- `input` 和 `p` 关心 `color`
- `ExpensiveTree` 不关心 `color`
- 但 `color` 在 `App` 中，所以 `App` 重新渲染时，所有子组件都会重新渲染

** 就像**：你把所有东西都放在一个大房间里，只要房间里的任何东西变了，整个房间都要重新整理一遍。

###  解决：把状态移到需要它的地方

将关心 `color` 的部分提取到 `Form` 组件中，并将状态**向下移动**到它里面：

```jsx
export default function App() {
  return (
    <>
      <Form />  {/* color 状态在这里 */}
      <ExpensiveTree />  {/* 不关心 color，所以不会被"连累" */}
    </>
  );
}

function Form() {
  let [color, setColor] = useState('red');  //  状态移到这里了！
  return (
    <>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p style={{ color }}>Hello, world!</p>
    </>
  );
}
```

** 结果**：现在如果 `color` 改变，只有 `Form` 重新渲染。`ExpensiveTree` 不会被"连累"！

** 就像**：你把东西分开放了，一个房间的东西变了，不会影响另一个房间。

** 这个方法的优势**：
- 不需要 `memo()`
- 不需要额外的记忆化开销
- 代码更清晰（状态离使用它的地方更近）
- 性能更好（只重新渲染需要的部分）

---

##  解决方案 2：将内容向上提升（当状态必须在上面时）

###  场景：状态必须在昂贵树上方

如果状态需要在昂贵树**上方**使用，上面的解决方案就不起作用了。例如，我们将 `color` 放在父级 `<div>` 上：

```jsx
export default function App() {
  let [color, setColor] = useState('red');
  return (
    <div style={{ color }}>  {/*  color 必须在 div 上 */}
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p>Hello, world!</p>
      <ExpensiveTree />  {/* 被"困"在 div 里面了 */}
    </div>
  );
}
```

** 问题**：现在 `color` 必须在 `div` 上（比如用于设置整个区域的文字颜色），所以不能简单地"向下移动"状态。

** 你可能会想**：
> "那只能用 `memo()` 了？"

** 等等！** 还有办法！

###  解决：使用 children prop（React 的"魔法"）

将昂贵树**向上提升**，使用 `children` prop 传递：

```jsx
export default function App() {
  return (
    <ColorPicker>
      <p>Hello, world!</p>
      <ExpensiveTree />  {/*  现在在外面了！ */}
    </ColorPicker>
  );
}

function ColorPicker({ children }) {
  let [color, setColor] = useState('red');
  return (
    <div style={{ color }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      {children}  {/*  使用 children prop */}
    </div>
  );
}
```

** 结果**：当 `ColorPicker` 中的 `color` 改变时：
- `ColorPicker` 重新渲染（因为它有 `color` 状态）
- 它接收相同的 `children` prop（React 不会重新渲染它）
- 所以 `ExpensiveTree` 不会重新渲染！

** 工作原理**：
- `children` 是在 `App` 中创建的（在 `ColorPicker` 外部）
- 当 `ColorPicker` 重新渲染时，`children` prop 没有改变（还是同一个 React 元素）
- React 看到 `children` 没变，就跳过重新渲染 `ExpensiveTree`

** 就像**：你把东西放在一个盒子里，盒子换了，但里面的东西没换，所以不需要重新整理里面的东西。

---

##  工作原理：React 的"智能优化"

###  为什么这样有效？React 的"记忆"机制

当组件重新渲染时，React 也会重新渲染它的所有子组件。但 React 也遵循一个优化：**如果子组件树与上次完全相同，React 会跳过重新渲染它**。

** 执行流程**：

```jsx
// 第一次渲染
<ColorPicker>
  <ExpensiveTree /> {/* React 创建这个树，记住它的"身份" */}
</ColorPicker>

// 第二次渲染（color 改变）
<ColorPicker>
  <ExpensiveTree /> {/* React 看到相同的树（相同的引用），跳过重新渲染 */}
</ColorPicker>
```

** 关键理解**：
- React 比较的是**引用**，不是内容
- 如果 `children` 是同一个 React 元素（同一个引用），React 就知道不需要重新渲染
- 即使 `ExpensiveTree` 函数被调用，React 知道它不需要改变 DOM，因为 props 没有改变

** 就像**：
- 你给朋友看一张照片，朋友说："哦，这张照片我看过了，不用再看一遍了"
- React 也是这样："哦，这个 children 和上次一样，不用重新渲染了"

** 这就是为什么 `children` prop 这么强大**：
- 它让组件可以"包裹"其他组件，而不需要知道它们是什么
- 它让 React 可以优化，因为 `children` 的引用是稳定的

---

##  性能优化检查清单：按顺序检查

在考虑使用 `memo()` 之前，先按顺序检查这些（就像看病时的检查流程）：

### 1.  **验证你运行的是生产构建**

** 常见错误**：在开发模式下测试性能，然后发现很慢，就开始优化。

** 真相**：开发构建故意更慢，在某些极端情况下甚至慢一个数量级（10 倍！）

** 检查方法**：
```bash
# 生产构建
npm run build

# 或者
npm run build && npm run start
```

** 就像**：你在测试一辆车的性能，但用的是训练轮，当然慢了！

---

### 2.  **验证你没有将状态放在树中不必要的高位置**

** 常见错误**：把所有状态都放在最顶层的组件，或者放在 Redux store 里。

** 例子**：
-  把输入框的状态放在 Redux store 里
-  把输入框的状态放在输入框组件里

** 原则**：状态应该放在**离使用它的地方最近**的位置。

** 就像**：你把所有东西都放在仓库里，每次用都要去仓库拿，当然慢了！

---

### 3.  **运行 React DevTools Profiler 查看什么被重新渲染**

** 工具**：React DevTools 的 Profiler 标签页。

** 使用步骤**：
1. 打开 React DevTools
2. 点击 Profiler 标签
3. 点击"录制"按钮
4. 执行一些操作（比如输入文字）
5. 停止录制
6. 查看哪些组件被重新渲染了

** 好处**：
- 可以看到哪些组件渲染了
- 可以看到渲染花了多长时间
- 可以找到性能瓶颈

** 就像**：用 X 光看身体，找出哪里有问题。

---

### 4.  **尝试将状态向下移动**

** 方法**：将状态移到只关心它的组件中。

** 检查**：
- 这个状态只有这个组件用吗？
- 如果是，把它移到这个组件里
- 如果不是，看看能不能拆分组件

** 就像**：把东西放在离使用它的地方更近的位置。

---

### 5.  **尝试将内容向上提升**

** 方法**：使用 `children` prop 将昂贵的组件移到状态管理之外。

** 检查**：
- 这个组件需要状态吗？
- 如果不需要，可以用 `children` prop 把它移到外面

** 就像**：把不相关的东西移到外面，避免被"连累"。

---

##  最佳实践：什么时候用什么方法

###  何时使用 memo()（最后的选择）

** 使用 `memo()` 的情况**：
- 组件接收的 props 经常变化，但组件本身很少需要重新渲染
  - 就像你收到很多邮件，但大部分都是垃圾邮件，你不需要每封都看
- 组件渲染成本很高（例如，复杂的计算或大量 DOM 操作）
  - 就像你有一个很重的箱子，每次搬都要花很多力气
- **已经尝试了状态向下移动和内容向上提升**
  - 就像你已经试了简单的方法，但还是不够

** 使用 `memo()` 的例子**：

```jsx
const ExpensiveChart = React.memo(function ExpensiveChart({ data }) {
  // 复杂的图表渲染逻辑
  // 需要很长时间才能渲染
  return <ComplexChart data={data} />;
});
```

---

###  何时不需要 memo()（大多数情况）

** 不需要 `memo()` 的情况**：
- 组件经常因为 props 变化而需要重新渲染
  - 就像你收到的邮件都是重要的，每封都要看
- 组件渲染成本很低
  - 就像你有一个很轻的箱子，搬起来不费劲
- **还没有尝试更简单的优化方法**
  - 就像你还没试简单的方法，就直接用复杂的方法

** 不需要 `memo()` 的例子**：

```jsx
//  不需要 memo() - 组件很简单
function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}

//  不需要 memo() - props 经常变
function Counter({ count }) {
  return <div>Count: {count}</div>;
}
```

---

##  总结：优化策略的优先级

** 优化策略的优先级**（从简单到复杂）：

1. ** 将状态向下移动**（最简单，最自然）
2. ** 将内容向上提升**（使用 children prop）
3. ** 使用 `memo()`**（需要额外的记忆化开销）
4. ** 使用 `useMemo()` 和 `useCallback()`**（更细粒度的优化）

** 原则**：
- 先试简单的方法
- 只有在简单方法不够时才用复杂的方法
- 不要为了优化而优化

** 就像**：
- 先试试走路（简单）
- 如果不够快，再试试自行车（中等）
- 如果还不够快，再试试汽车（复杂）

---

## 参考资源

- [原文：Before You memo()](https://overreacted.io/before-you-memo/) - Dan Abramov
- [React.memo 文档](https://react.dev/reference/react/memo) - 官方文档
- [React 性能优化](https://react.dev/learn/render-and-commit) - 官方性能优化指南

---

##  关键要点

** 核心思想**：
- 在添加 `memo()` 之前，先尝试将状态向下移动或将内容向上提升
- 这些技术通常更简单、更自然，并且不需要额外的记忆化开销
- 就像先试试简单的方法，再考虑复杂的方法

** 记住**：
- 简单的方法往往是最好的方法
- 不要过度优化
- 先让代码工作，再考虑性能

** 现在，去写更高效的 React 代码吧！**

