# Hooks 调用顺序的重要性

> 参考：[Why Do React Hooks Rely on Call Order?](https://overreacted.io/why-do-hooks-rely-on-call-order/) - Dan Abramov

## 核心问题

### 为什么 Hooks 依赖调用顺序？

当你学习 Hooks 时，第一个（也可能是最大的）震惊是：**Hooks 依赖于重新渲染之间持久的调用索引**。

这意味着：
- 每次渲染时，Hooks 必须**以相同的顺序**调用
- 不能在条件语句、循环或嵌套函数中调用 Hooks
- React 通过**调用索引**来识别每个 Hook

---

##  工作原理

### 调用索引识别

```jsx
function Form() {
  const [name, setName] = useState('Mary');              // State variable 1
  const [surname, setSurname] = useState('Poppins');     // State variable 2
  const [width, setWidth] = useState(window.innerWidth); // State variable 3

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  // ...
}
```

在这个例子中：
- React 将 `name` 视为"第一个状态变量"
- `surname` 视为"第二个状态变量"
- `width` 视为"第三个状态变量"

它们的**调用索引**在重新渲染之间给它们一个稳定的身份。

---

##  为什么其他方案不行？

### 缺陷 1：无法提取自定义 Hook

许多替代方案不允许自定义 Hooks。例如，一个替代方案禁止在组件中多次调用 `useState()`，要求将所有状态保存在一个对象中：

```jsx
//  这种方案的问题
function Form() {
  const [state, setState] = useState({
    name: 'Mary',
    surname: 'Poppins',
    width: window.innerWidth,
  });
  // ...
}
```

**问题**：无法提取自定义 Hook，因为状态结构是硬编码的。

---

### 缺陷 2：命名冲突

如果使用命名参数：

```jsx
//  这种方案的问题
const [name, setName] = useState('name', 'Mary');
const [surname, setSurname] = useState('surname', 'Poppins');
```

**问题**：
- 命名冲突（两个 Hook 使用相同的名称）
- 无法在自定义 Hook 中动态命名
- 名称只是用于调试，不是实际标识符

---

### 缺陷 3：无法条件调用

如果允许条件调用 Hooks：

```jsx
//  这种方案的问题
function Form() {
  if (condition) {
    const [name, setName] = useState('Mary');
  }
  const [surname, setSurname] = useState('Poppins');
  // ...
}
```

**问题**：
- 调用顺序在不同渲染之间会改变
- React 无法正确识别哪个状态对应哪个 Hook
- 导致状态混乱和 bug

---

##  Hooks 设计的优势

### 1. 支持自定义 Hooks

```jsx
//  可以提取自定义 Hook
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
  
  return width;
}

function Form() {
  const name = useState('Mary')[0];
  const surname = useState('Poppins')[0];
  const width = useWindowWidth(); // 自定义 Hook
  // ...
}
```

### 2. 支持多次调用

```jsx
//  可以多次调用同一个 Hook
function Form() {
  const [name, setName] = useState('Mary');
  const [surname, setSurname] = useState('Poppins');
  const [age, setAge] = useState(25);
  // ...
}
```

### 3. 支持条件逻辑（通过 Hook 内部）

```jsx
//  条件逻辑在 Hook 内部，而不是调用 Hook
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  });
  
  return width;
}
```

---

##  Hooks 规则

### 规则 1：只在顶层调用 Hooks

不要在循环、条件或嵌套函数中调用 Hooks。

```jsx
//  错误
function Form() {
  if (condition) {
    useState('Mary'); // 违反规则
  }
}

//  正确
function Form() {
  const [name, setName] = useState('Mary');
  // ...
}
```

### 规则 2：只在 React 函数中调用 Hooks

- 在 React 函数组件中调用
- 在自定义 Hooks 中调用

```jsx
//  正确
function MyComponent() {
  const [count, setCount] = useState(0);
  // ...
}

//  正确
function useCustomHook() {
  const [value, setValue] = useState(0);
  return value;
}

//  错误
function regularFunction() {
  const [count, setCount] = useState(0); // 违反规则
}
```

---

##  设计原理

### 为什么这样设计？

1. **简单性**：调用顺序是最简单的识别方式
2. **灵活性**：支持自定义 Hooks 和多次调用
3. **可组合性**：可以轻松组合多个 Hooks
4. **性能**：不需要额外的命名或标识符开销

### 心智模型

将 Hooks 想象成：
- **函数式混入（Functional Mixins）**：可以创建和组合自己的抽象
- **数组索引**：React 通过调用索引来跟踪每个 Hook

---

##  最佳实践

### 1. 使用 ESLint 插件

```bash
npm install eslint-plugin-react-hooks --save-dev
```

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### 2. 提取自定义 Hooks

```jsx
//  提取逻辑到自定义 Hook
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}
```

### 3. 保持调用顺序一致

```jsx
//  总是以相同顺序调用
function MyComponent({ condition }) {
  const [name, setName] = useState('Mary');
  const [surname, setSurname] = useState('Poppins');
  
  // 条件逻辑在 Hook 内部，而不是调用 Hook
  const width = useWindowWidth();
  
  // ...
}
```

---

## 参考资源

- [原文：Why Do React Hooks Rely on Call Order?](https://overreacted.io/why-do-hooks-rely-on-call-order/)
- [React Hooks 规则](https://reactjs.org/docs/hooks-rules.html)
- [React Hooks FAQ](https://reactjs.org/docs/hooks-faq.html)
- [Hooks 不是魔法，只是数组](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)

---

**关键要点**：Hooks 依赖调用顺序是为了支持自定义 Hooks、多次调用和灵活组合。虽然这需要遵循一些规则，但它提供了强大的抽象能力。

