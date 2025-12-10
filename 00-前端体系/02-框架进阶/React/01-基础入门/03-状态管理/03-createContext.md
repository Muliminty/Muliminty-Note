# createContext

> `createContext` 是 React 提供的 API，用于创建一个 Context 对象，用于在组件树中传递数据。

---

## 基本语法

### JavaScript

```jsx
import { createContext } from 'react';

const MyContext = createContext(defaultValue);
```

### TypeScript

```tsx
import { createContext } from 'react';

const MyContext = createContext<Type | undefined>(undefined);
```

---

## API 签名

```typescript
function createContext<T>(defaultValue: T): React.Context<T>;
```

**参数**：
- `defaultValue`：当组件没有匹配到 Provider 时使用的默认值
- 类型：`T`（可以是任何类型）

**返回值**：
- `React.Context<T>`：一个 Context 对象，包含 `Provider` 和 `Consumer` 属性

---

## 使用方式

### 方式 1：带默认值

```jsx
// 创建带默认值的 Context
const ThemeContext = createContext('light');

// 如果没有 Provider，使用默认值 'light'
function Component() {
  const theme = useContext(ThemeContext); // 'light'
  return <div className={theme}>Content</div>;
}
```

### 方式 2：不带默认值（推荐）

```jsx
// 创建不带默认值的 Context
const ThemeContext = createContext(undefined);

// 如果没有 Provider，返回 undefined
function Component() {
  const theme = useContext(ThemeContext); // undefined
  // 需要检查 undefined
  return <div className={theme || 'light'}>Content</div>;
}
```

### 方式 3：TypeScript 类型定义

```tsx
// 定义类型
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// 创建带类型的 Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
```

---

## 创建示例

### 示例 1：简单值

```jsx
const CountContext = createContext(0);
const ThemeContext = createContext('light');
const UserContext = createContext(null);
```

### 示例 2：对象值

```jsx
const UserContext = createContext({
  name: '',
  email: '',
  role: 'user'
});
```

### 示例 3：函数值

```jsx
const ApiContext = createContext({
  fetch: () => Promise.resolve({}),
  post: () => Promise.resolve({})
});
```

### 示例 4：TypeScript 完整示例

```tsx
interface AppContextType {
  user: { id: number; name: string } | null;
  theme: 'light' | 'dark';
  setUser: (user: { id: number; name: string } | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
```

---

## Context 对象属性

创建后的 Context 对象包含两个属性：

### Provider

```jsx
const ThemeContext = createContext('light');

// Provider 用于提供 Context 值
<ThemeContext.Provider value="dark">
  <Components />
</ThemeContext.Provider>
```

### Consumer

```jsx
// Consumer 用于在类组件中消费 Context（不常用）
<ThemeContext.Consumer>
  {theme => <div className={theme}>Content</div>}
</ThemeContext.Consumer>
```

---

## 默认值的作用

### 何时使用默认值

```jsx
// 有默认值：组件可以在没有 Provider 时使用默认值
const ThemeContext = createContext('light');

function Component() {
  // 即使没有 Provider，也能获取到 'light'
  const theme = useContext(ThemeContext);
  return <div className={theme}>Content</div>;
}
```

### 何时不使用默认值

```jsx
// 无默认值：强制要求使用 Provider（推荐）
const ThemeContext = createContext(undefined);

function Component() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('Component must be used within ThemeProvider');
  }
  return <div className={context.theme}>Content</div>;
}
```

---

## 最佳实践

### 1. 推荐使用 undefined 作为默认值

```jsx
// ✅ 推荐：便于错误检查
const ThemeContext = createContext(undefined);

// ❌ 不推荐：可能隐藏错误
const ThemeContext = createContext('light');
```

### 2. 在 TypeScript 中定义类型

```tsx
// ✅ 推荐：类型安全
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
```

### 3. 导出 Context 对象

```jsx
// contexts/ThemeContext.jsx
export const ThemeContext = createContext(undefined);
```

---

## 注意事项

1. **Context 对象是唯一的**：每个 `createContext` 调用都会创建一个新的 Context 对象
2. **默认值只在没有 Provider 时使用**：如果存在 Provider，即使 value 是 `undefined`，也不会使用默认值
3. **Context 值可以是任何类型**：字符串、数字、对象、函数等
4. **TypeScript 类型推断**：使用 TypeScript 时，类型会从 `defaultValue` 推断

---

## 参考资源

- [React 官方文档 - createContext](https://react.dev/reference/react/createContext)

---

#react #createContext #context #基础概念
