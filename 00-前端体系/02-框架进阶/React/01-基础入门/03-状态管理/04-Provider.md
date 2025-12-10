# Provider

> `Provider` 是 Context 对象的一个属性，用于在组件树中提供 Context 值，使子组件能够访问这些值。

---

## 基本语法

```jsx
<Context.Provider value={value}>
  {children}
</Context.Provider>
```

**Props**：
- `value`：要传递给消费组件的值（任何类型）
- `children`：子组件

---

## 工作原理

### 基本使用

```jsx
import { createContext } from 'react';

// 1. 创建 Context
const ThemeContext = createContext('light');

// 2. 使用 Provider 提供值
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Components />
    </ThemeContext.Provider>
  );
}
```

### Provider 的作用域

```jsx
// Provider 包裹的所有子组件都可以访问 Context
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Header />      {/* 可以访问 Context */}
      <Main />        {/* 可以访问 Context */}
      <Footer />      {/* 可以访问 Context */}
    </ThemeContext.Provider>
  );
}
```

---

## 使用方式

### 方式 1：直接使用 Provider

```jsx
function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <Components />
    </ThemeContext.Provider>
  );
}
```

### 方式 2：封装 Provider 组件（推荐）

```jsx
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 使用
function App() {
  return (
    <ThemeProvider>
      <Components />
    </ThemeProvider>
  );
}
```

> 💡 **最佳实践**：更推荐将状态逻辑分离到自定义 Hook 中，Provider 更纯粹。详见：[Context + 自定义 Hook 最佳模式](../../03-Hooks深度理解/01-基础Hooks/05-Context-与自定义Hook-最佳模式.md)

```jsx
// 最佳模式：状态逻辑在自定义 Hook 中
function useThemeController() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);
  return { theme, toggleTheme };
}

function ThemeProvider({ children }) {
  const controller = useThemeController();
  return (
    <ThemeContext.Provider value={controller}>
      {children}
    </ThemeContext.Provider>
  );
}
```

---

## value 属性

### value 可以是任何类型

```jsx
// 字符串
<ThemeContext.Provider value="dark">
  {children}
</ThemeContext.Provider>

// 数字
<CountContext.Provider value={42}>
  {children}
</CountContext.Provider>

// 对象
<UserContext.Provider value={{ name: 'John', age: 30 }}>
  {children}
</UserContext.Provider>

// 函数
<ApiContext.Provider value={{ fetch, post }}>
  {children}
</ApiContext.Provider>
```

### value 的动态更新

```jsx
function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <Components />
      <button onClick={() => setTheme('dark')}>
        Change Theme
      </button>
    </ThemeContext.Provider>
  );
}
```

---

## 多个 Provider 嵌套

### 嵌套使用

```jsx
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <UserContext.Provider value={{ name: 'John' }}>
        <LanguageContext.Provider value="zh">
          <Components />
        </LanguageContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}
```

### 内层 Provider 覆盖外层

```jsx
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Level1 />  {/* theme = 'dark' */}
    </ThemeContext.Provider>
  );
}

function Level1() {
  return (
    <ThemeContext.Provider value="light">
      <Level2 />  {/* theme = 'light'（覆盖外层） */}
    </ThemeContext.Provider>
  );
}
```

---

## 性能优化

### 使用 useMemo 稳定 value

```jsx
// ❌ 不好：每次渲染创建新对象
function App() {
  const [user, setUser] = useState({ name: 'John' });
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// ✅ 好：使用 useMemo 稳定引用
function App() {
  const [user, setUser] = useState({ name: 'John' });
  
  const value = useMemo(() => ({
    user,
    setUser
  }), [user]);
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
```

### 拆分多个 Provider

```jsx
// ❌ 不好：所有数据在一个 Provider
function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  
  return (
    <AppContext.Provider value={{ user, theme }}>
      {children}
    </AppContext.Provider>
  );
}

// ✅ 好：按关注点拆分
function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  
  return (
    <UserContext.Provider value={user}>
      <ThemeContext.Provider value={theme}>
        {children}
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}
```

---

## 更新机制

### value 改变时自动更新

```jsx
function App() {
  const [count, setCount] = useState(0);
  
  return (
    <CountContext.Provider value={count}>
      <Component />
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </CountContext.Provider>
  );
}

function Component() {
  // 当 count 改变时，这个组件会自动重新渲染
  const count = useContext(CountContext);
  return <div>Count: {count}</div>;
}
```

**重要**：当 Provider 的 `value` 改变时，所有消费该 Context 的组件都会重新渲染。

---

## 完整示例

### 示例 1：主题 Provider

```jsx
import { createContext, useState, useCallback, useMemo } from 'react';

const ThemeContext = createContext(undefined);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 使用
function App() {
  return (
    <ThemeProvider>
      <Components />
    </ThemeProvider>
  );
}
```

### 示例 2：TypeScript 版本

```tsx
import { createContext, useState, useCallback, useMemo, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  const value = useMemo<ThemeContextType>(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

---

## 常见错误

### 错误 1：value 引用不稳定

```jsx
// ❌ 错误：每次渲染创建新对象
function App() {
  return (
    <ThemeContext.Provider value={{ theme: 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ 正确：使用 useMemo 或 useState
function App() {
  const value = useMemo(() => ({ theme: 'dark' }), []);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 错误 2：直接修改对象属性

```jsx
// ❌ 错误：直接修改不会触发更新
function App() {
  const value = { theme: 'light' };
  return (
    <ThemeContext.Provider value={value}>
      <button onClick={() => value.theme = 'dark'}>
        Toggle
      </button>
    </ThemeContext.Provider>
  );
}

// ✅ 正确：使用状态管理
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme('dark')}>
        Toggle
      </button>
    </ThemeContext.Provider>
  );
}
```

---

## 最佳实践

1. **封装 Provider 组件**：将 Provider 封装成独立组件，便于复用
2. **使用 useMemo 稳定 value**：避免不必要的重新渲染
3. **拆分多个 Provider**：按关注点拆分，而不是把所有数据放在一个 Provider
4. **提供清晰的 API**：在 Provider 组件中提供语义化的方法

---

## 参考资源

- [Context + 自定义 Hook 最佳模式](../../03-Hooks深度理解/01-基础Hooks/05-Context-与自定义Hook-最佳模式.md) ⭐ **推荐**
- [Context API 完整体系](../../03-Hooks深度理解/01-基础Hooks/04-Context-API-完整体系.md)
- [React 官方文档 - Context.Provider](https://react.dev/reference/react/createContext#provider)

---

#react #provider #context #基础概念
