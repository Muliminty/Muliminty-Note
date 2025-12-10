# useContext 完整指南 - 深入理解 React Context API

> 参考：[React Context API](https://react.dev/reference/react/useContext) - React 官方文档  
> 本文档深入解析 `useContext` 的工作原理、使用场景和性能优化策略。

---

## 📚 目录

1. [Context API 概述](#context-api-概述)
2. [useContext 基本用法](#useeffect-基本用法)
3. [createContext 和 useContext 完整流程](#createcontext-和-useeffect-完整流程)
4. [创建和使用 Context](#创建和使用-context)
5. [Context 的工作原理](#context-的工作原理)
6. [Context 的性能问题](#context-的性能问题)
7. [性能优化策略](#性能优化策略)
8. [Context 组合模式](#context-组合模式)
9. [实际应用场景](#实际应用场景)
10. [useContext 与自定义 Hook 组合使用](#useeffect-与自定义-hook-组合使用)
11. [常见陷阱和解决方案](#常见陷阱和解决方案)
12. [最佳实践](#最佳实践)

---

## Context API 概述

### 什么是 Context

**Context** 提供了一种在组件树中传递数据的方法，无需通过 props 逐层传递（"prop drilling"）。

**适用场景**：
- 主题（theme）
- 用户认证信息
- 语言/国际化
- 全局配置

**不适用场景**：
- 需要频繁更新的数据（会导致性能问题）
- 应该通过 props 传递的局部数据

### Context vs Props

```jsx
// ❌ 不好的做法：Prop Drilling
function App() {
  const theme = 'dark';
  return <Header theme={theme} />;
}

function Header({ theme }) {
  return <Navigation theme={theme} />;
}

function Navigation({ theme }) {
  return <Button theme={theme} />;
}

// ✅ 好的做法：使用 Context
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Header />
    </ThemeContext.Provider>
  );
}

function Header() {
  return <Navigation />;
}

function Navigation() {
  return <Button />;
}

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}
```

---

## useContext 基本用法

### 基本语法

#### JavaScript 语法

```jsx
import { useContext } from 'react';

const value = useContext(SomeContext);
```

#### TypeScript 语法

```tsx
import { useContext } from 'react';

const value = useContext(SomeContext);
// TypeScript 会自动推断 value 的类型
```

**参数**：
- `SomeContext`：通过 `createContext()` 创建的 Context 对象
- 类型：`React.Context<T>`，其中 `T` 是 Context 值的类型

**返回值**：
- 当前组件树中最近的 `Context.Provider` 的 `value` 值
- 如果没有 `Provider`，返回 `createContext()` 时传入的默认值
- 类型：`T`（Context 值的类型）

### 完整 API 签名

```typescript
function useContext<T>(context: React.Context<T>): T;
```

### 简单示例

#### 示例 1：基础用法（JavaScript）

```jsx
import { createContext, useContext } from 'react';

// 1. 创建 Context（带默认值）
const ThemeContext = createContext('light');

// 2. 提供 Context 值
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 3. 消费 Context 值
function Toolbar() {
  return <ThemedButton />;
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Themed Button</button>;
}

// 运行结果：按钮显示 "Themed Button"，className 为 "dark"
```

#### 示例 2：TypeScript 完整示例

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// 定义类型
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// 创建 Context（明确类型）
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider 组件
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 自定义 Hook（带类型检查）
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// 使用
function App() {
  return (
    <ThemeProvider>
      <ThemedComponent />
    </ThemeProvider>
  );
}

function ThemedComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={theme}>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Toggle to {theme === 'light' ? 'dark' : 'light'}
      </button>
    </div>
  );
}
```

#### 示例 3：动态值更新

```jsx
import { createContext, useContext, useState } from 'react';

const CountContext = createContext(0);

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <CountContext.Provider value={count}>
      <div>
        <button onClick={() => setCount(count + 1)}>
          Increment: {count}
        </button>
        <CounterDisplay />
      </div>
    </CountContext.Provider>
  );
}

function CounterDisplay() {
  // 当 Provider 的 value 改变时，组件会自动重新渲染
  const count = useContext(CountContext);
  return <p>Count from context: {count}</p>;
}

// 运行结果：
// 点击按钮时，count 增加，CounterDisplay 会自动更新显示新的 count 值
```

#### 示例 4：多个 Context 组合

```jsx
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');
const UserContext = createContext({ name: 'Guest' });

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <UserContext.Provider value={{ name: 'John' }}>
        <Profile />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

function Profile() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  
  return (
    <div className={theme}>
      <h1>Profile</h1>
      <p>User: {user.name}</p>
      <p>Theme: {theme}</p>
    </div>
  );
}

// 运行结果：
// Profile 组件显示：
// User: John
// Theme: dark
```

---

## createContext 和 useContext 完整流程

### 流程概览

使用 Context 的完整流程包含以下步骤：

```
┌─────────────────────────────────────────────────────────┐
│  步骤 1: 创建 Context                                    │
│  const ThemeContext = createContext(defaultValue)      │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│  步骤 2: 创建 Provider 组件（可选，但推荐）              │
│  function ThemeProvider({ children }) {                  │
│    const value = useState(...)                          │
│    return <ThemeContext.Provider value={value}>...      │
│  }                                                      │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│  步骤 3: 在组件树顶层使用 Provider                      │
│  function App() {                                       │
│    return <ThemeProvider><Components /></ThemeProvider>│
│  }                                                      │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│  步骤 4: 在子组件中使用 useContext 获取值                │
│  function Component() {                                 │
│    const theme = useContext(ThemeContext)              │
│    return <div>{theme}</div>                           │
│  }                                                      │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│  步骤 5: （可选）创建自定义 Hook 封装                    │
│  function useTheme() {                                  │
│    const context = useContext(ThemeContext)            │
│    if (!context) throw new Error(...)                  │
│    return context                                       │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
```

### 组件树结构示意

```
App (根组件)
  └── ThemeProvider (Provider 组件)
      ├── Header
      │   └── useTheme() ← 可以访问 Context
      ├── Main
      │   └── Content
      │       └── useTheme() ← 可以访问 Context
      └── Footer
          └── useTheme() ← 可以访问 Context
```

**关键点**：
- Provider 包裹的所有子组件都可以访问 Context
- 子组件通过 `useContext` 向上查找最近的 Provider
- 如果没有 Provider，使用默认值

### 详细流程步骤

#### 步骤 1：创建 Context

**目的**：创建一个 Context 对象，用于在组件树中传递数据。

```jsx
import { createContext } from 'react';

// 语法
const MyContext = createContext(defaultValue);

// 示例 1：带默认值
const ThemeContext = createContext('light');

// 示例 2：不带默认值（推荐）
const UserContext = createContext(undefined);

// 示例 3：TypeScript
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
```

**关键点**：
- `defaultValue` 只在没有找到 Provider 时使用
- 推荐使用 `undefined` 作为默认值，便于错误检查
- Context 对象包含 `Provider` 和 `Consumer` 属性

#### 步骤 2：创建 Provider 组件（推荐）

**目的**：封装 Context 的逻辑，提供更好的 API 和错误处理。

```jsx
// 方式 1：简单 Provider（直接在组件中使用）
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Components />
    </ThemeContext.Provider>
  );
}

// 方式 2：封装 Provider 组件（推荐）
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  // 使用 useMemo 稳定 value 引用
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
```

**关键点**：
- Provider 接收 `value` prop，这是要传递给子组件的数据
- 当 `value` 改变时，所有消费该 Context 的组件都会重新渲染
- 使用 `useMemo` 可以避免不必要的重新渲染

#### 步骤 3：在组件树顶层使用 Provider

**目的**：将 Provider 放在组件树的合适位置，使其子组件可以访问 Context。

```jsx
// 示例 1：在 App 组件中使用
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}

// 示例 2：多个 Provider 嵌套
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          <Components />
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

// 示例 3：组合多个 Provider
function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <Components />
    </AppProviders>
  );
}
```

**关键点**：
- Provider 必须包裹需要访问 Context 的组件
- 多个 Provider 可以嵌套使用
- 内层 Provider 的值会覆盖外层 Provider 的值

#### 步骤 4：在子组件中使用 useContext

**目的**：在子组件中获取 Context 的值。

```jsx
// 方式 1：直接使用 useContext
function Component() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Content</div>;
}

// 方式 2：解构对象值
function Component() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div className={theme}>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

// 方式 3：处理默认值
function Component() {
  const theme = useContext(ThemeContext) || 'light';
  return <div className={theme}>Content</div>;
}
```

**关键点**：
- `useContext` 返回最近的 Provider 的 `value`
- 如果没有 Provider，返回 `createContext` 的默认值
- 当 Provider 的 `value` 改变时，组件会自动重新渲染

#### 步骤 5：创建自定义 Hook（推荐）

**目的**：封装 useContext 调用，提供更好的 API 和错误处理。

```jsx
// 创建自定义 Hook
function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context;
}

// 使用自定义 Hook
function Component() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={theme}>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

**关键点**：
- 自定义 Hook 提供更好的错误提示
- 可以添加额外的逻辑和计算
- 提供更语义化的 API

### 完整流程示例

#### 示例 1：主题切换完整流程

```jsx
// ========== 步骤 1：创建 Context ==========
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ThemeContext = createContext(undefined);

// ========== 步骤 2：创建 Provider 组件 ==========
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

// ========== 步骤 5：创建自定义 Hook ==========
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// ========== 步骤 3：在顶层使用 Provider ==========
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}

// ========== 步骤 4：在子组件中使用 ==========
function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className={theme}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}

function Main() {
  const { theme } = useTheme();
  return (
    <main className={theme}>
      <p>Main content with theme: {theme}</p>
    </main>
  );
}

function Footer() {
  const { theme } = useTheme();
  return (
    <footer className={theme}>
      <p>Footer content</p>
    </footer>
  );
}
```

#### 示例 2：用户认证完整流程

```jsx
// ========== 步骤 1：创建 Context ==========
const AuthContext = createContext(undefined);

// ========== 步骤 2：创建 Provider ==========
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 检查登录状态
    checkAuth().then(user => {
      setUser(user);
      setLoading(false);
    });
  }, []);
  
  const login = async (email, password) => {
    const user = await authenticate(email, password);
    setUser(user);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  }), [user, loading]);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ========== 步骤 5：创建自定义 Hook ==========
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// ========== 步骤 3：在顶层使用 Provider ==========
function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

// ========== 步骤 4：在子组件中使用 ==========
function Router() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <Loading />;
  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}

function LoginPage() {
  const { login } = useAuth();
  // ... 登录逻辑
}

function Dashboard() {
  const { user, logout } = useAuth();
  // ... 仪表板逻辑
}
```

### 流程中的关键概念

#### 1. Context 值查找机制

```jsx
// Context 值查找是从当前组件向上查找最近的 Provider
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Level1 />  {/* 可以访问 "dark" */}
    </ThemeContext.Provider>
  );
}

function Level1() {
  return (
    <ThemeContext.Provider value="light">
      <Level2 />  {/* 可以访问 "light"（最近的 Provider） */}
    </ThemeContext.Provider>
  );
}

function Level2() {
  const theme = useContext(ThemeContext); // "light"
  return <div>{theme}</div>;
}
```

#### 2. 更新机制

```jsx
function App() {
  const [count, setCount] = useState(0);
  
  return (
    <CountContext.Provider value={count}>
      <Component />
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </CountContext.Provider>
  );
}

function Component() {
  // 当 count 改变时，这个组件会自动重新渲染
  const count = useContext(CountContext);
  return <div>Count: {count}</div>;
}
```

#### 3. 默认值使用

```jsx
// 创建时设置默认值
const ThemeContext = createContext('light');

function Component() {
  // 如果没有 Provider，使用默认值 'light'
  const theme = useContext(ThemeContext);
  return <div className={theme}>Content</div>;
}

// 没有 Provider 的情况
function App() {
  return <Component />; // theme 为 'light'（默认值）
}
```

### 最佳实践流程

#### 推荐的文件结构

```
contexts/
  ├── ThemeContext.jsx      # Context 定义、Provider、Hook
  ├── AuthContext.jsx       # Context 定义、Provider、Hook
  └── index.js             # 导出所有 Context
```

#### 推荐的代码组织

```jsx
// contexts/ThemeContext.jsx
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// 1. 创建 Context
const ThemeContext = createContext(undefined);

// 2. 创建 Provider
export function ThemeProvider({ children }) {
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

// 3. 创建自定义 Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// 使用
// App.jsx
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Components />
    </ThemeProvider>
  );
}

// Component.jsx
import { useTheme } from './contexts/ThemeContext';

function Component() {
  const { theme, toggleTheme } = useTheme();
  return <div className={theme}>Content</div>;
}
```

### 数据流向图

```
┌─────────────────────────────────────────────────────────────┐
│  Provider 层（数据提供）                                    │
│                                                             │
│  ThemeProvider                                              │
│  ├─ state: { theme: 'dark', toggleTheme: fn }              │
│  └─ <ThemeContext.Provider value={state}>                  │
│      │                                                      │
│      │  value 传递                                          │
│      ↓                                                      │
└─────────────────────────────────────────────────────────────┘
                    │
                    │ Context 值向下传递
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  消费层（数据使用）                                          │
│                                                             │
│  Header Component                                           │
│  ├─ const { theme } = useTheme()                           │
│  └─ 使用 theme: 'dark'                                     │
│                                                             │
│  Main Component                                             │
│  ├─ const { theme } = useTheme()                           │
│  └─ 使用 theme: 'dark'                                     │
│                                                             │
│  Footer Component                                           │
│  ├─ const { theme } = useTheme()                           │
│  └─ 使用 theme: 'dark'                                     │
└─────────────────────────────────────────────────────────────┘
                    │
                    │ 用户操作（如点击按钮）
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  更新层（数据更新）                                          │
│                                                             │
│  Button onClick → toggleTheme()                            │
│  ↓                                                          │
│  setTheme('light')                                          │
│  ↓                                                          │
│  Provider value 更新                                        │
│  ↓                                                          │
│  所有消费组件自动重新渲染                                   │
└─────────────────────────────────────────────────────────────┘
```

### 完整生命周期示例

```jsx
// ========== 初始化阶段 ==========
// 1. 创建 Context
const ThemeContext = createContext(undefined);

// 2. 创建 Provider
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light'); // 初始值: 'light'
  
  const value = { theme, setTheme };
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ========== 渲染阶段 ==========
// 3. App 渲染，Provider 提供值
function App() {
  return (
    <ThemeProvider>
      <Component />
    </ThemeProvider>
  );
}

// 4. Component 渲染，获取 Context 值
function Component() {
  const { theme } = useContext(ThemeContext); // theme = 'light'
  return <div className={theme}>Content</div>; // 显示 'light'
}

// ========== 更新阶段 ==========
// 5. 用户点击按钮
function Component() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  const handleClick = () => {
    setTheme('dark'); // 更新 state
  };
  
  return (
    <div className={theme}>
      <button onClick={handleClick}>Toggle</button>
    </div>
  );
}

// 6. setTheme('dark') 触发重新渲染
//    → Provider 的 value 更新为 { theme: 'dark', setTheme }
//    → 所有使用 useContext(ThemeContext) 的组件重新渲染
//    → Component 显示 'dark'
```

### 流程检查清单

使用 Context 时，确保完成以下步骤：

- [ ] 使用 `createContext` 创建 Context
- [ ] 创建 Provider 组件（可选但推荐）
- [ ] 在组件树顶层使用 Provider
- [ ] 在子组件中使用 `useContext` 获取值
- [ ] 创建自定义 Hook 封装（推荐）
- [ ] 添加错误处理（检查 Context 是否存在）
- [ ] 使用 `useMemo` 稳定 value 引用（性能优化）
- [ ] 在 TypeScript 中定义类型（如果使用 TS）

### 常见流程错误

#### 错误 1：忘记创建 Context

```jsx
// ❌ 错误：直接使用未定义的 Context
function Component() {
  const theme = useContext(ThemeContext); // ThemeContext 未定义
}

// ✅ 正确：先创建 Context
const ThemeContext = createContext(undefined);
```

#### 错误 2：忘记使用 Provider

```jsx
// ❌ 错误：没有 Provider
function App() {
  return <Component />; // Component 无法获取 Context 值
}

// ✅ 正确：使用 Provider
function App() {
  return (
    <ThemeProvider>
      <Component />
    </ThemeProvider>
  );
}
```

#### 错误 3：在 Provider 外部使用

```jsx
// ❌ 错误：在 Provider 外部使用
function App() {
  return (
    <>
      <Component /> {/* 无法访问 Context */}
      <ThemeProvider>
        <Component /> {/* 可以访问 Context */}
      </ThemeProvider>
    </>
  );
}

// ✅ 正确：在 Provider 内部使用
function App() {
  return (
    <ThemeProvider>
      <Component /> {/* 可以访问 Context */}
    </ThemeProvider>
  );
}
```

---

## 创建和使用 Context

### 创建 Context

#### createContext 语法

```typescript
function createContext<T>(defaultValue: T): React.Context<T>;
```

#### 创建方式

```jsx
// 方式 1：带默认值（JavaScript）
const ThemeContext = createContext('light');

// 方式 2：不带默认值（推荐，更明确）
const ThemeContext = createContext(undefined);

// 方式 3：带类型（TypeScript）
interface Theme {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
  };
}

const ThemeContext = createContext<Theme | undefined>(undefined);
```

#### 完整创建示例

```jsx
// 示例 1：简单值
const CountContext = createContext(0);

// 示例 2：对象值
const UserContext = createContext({
  name: '',
  email: '',
  role: 'user'
});

// 示例 3：函数值
const ApiContext = createContext({
  fetch: () => Promise.resolve({}),
  post: () => Promise.resolve({})
});

// 示例 4：TypeScript 完整示例
interface AppContextType {
  user: { id: number; name: string } | null;
  theme: 'light' | 'dark';
  setUser: (user: { id: number; name: string } | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
```

### Provider 组件

#### Provider 语法

```jsx
<Context.Provider value={value}>
  {children}
</Context.Provider>
```

**Props**：
- `value`：要传递给消费组件的值（任何类型）
- `children`：子组件

#### Provider 示例

```jsx
// 示例 1：简单值
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// 示例 2：对象值
<ThemeContext.Provider value={{ theme: 'dark', toggleTheme: () => {} }}>
  <App />
</ThemeContext.Provider>

// 示例 3：动态值（使用 state）
function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <ThemedApp />
    </ThemeContext.Provider>
  );
}

// 示例 4：完整 Provider 组件
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
      <ThemedApp />
    </ThemeProvider>
  );
}
```

### 消费 Context

#### 方式 1：使用 useContext Hook（推荐）

```jsx
// 基础用法
function Component() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Content</div>;
}

// 解构对象值
function Component() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div className={theme}>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

// TypeScript 用法
function Component() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('Component must be used within ThemeProvider');
  }
  const { theme, toggleTheme } = context;
  return <div className={theme}>Content</div>;
}
```

#### 方式 2：使用 Consumer（类组件或需要多个 Context 时）

```jsx
// Consumer 语法
<Context.Consumer>
  {value => /* 使用 value 渲染 */}
</Context.Consumer>

// 示例 1：类组件中使用
class ThemedButton extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {theme => <button className={theme}>Button</button>}
      </ThemeContext.Consumer>
    );
  }
}

// 示例 2：多个 Consumer 嵌套
function Component() {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => (
            <div className={theme}>
              <p>Hello, {user.name}</p>
            </div>
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}

// 示例 3：Consumer 与函数组件结合
function ThemedComponent() {
  return (
    <ThemeContext.Consumer>
      {({ theme, toggleTheme }) => (
        <div className={theme}>
          <button onClick={toggleTheme}>Toggle Theme</button>
        </div>
      )}
    </ThemeContext.Consumer>
  );
}
```

#### 方式 3：自定义 Hook 封装（最佳实践）

```jsx
// 创建自定义 Hook
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// 使用
function Component() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={theme}>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

---

## Context 的工作原理

### Context 值查找机制

```jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Level1 />
    </ThemeContext.Provider>
  );
}

function Level1() {
  return <Level2 />;
}

function Level2() {
  return <Level3 />;
}

function Level3() {
  // 向上查找最近的 Provider，找到 App 中的 Provider
  const theme = useContext(ThemeContext); // "dark"
  return <div>{theme}</div>;
}
```

**查找规则**：
1. 从当前组件向上查找最近的 `Provider`
2. 如果找到，使用该 `Provider` 的 `value`
3. 如果没找到，使用 `createContext()` 的默认值

### 多个 Provider 嵌套

```jsx
const ThemeContext = createContext('light');
const UserContext = createContext(null);

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <UserContext.Provider value={{ name: 'John' }}>
        <Component />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

function Component() {
  // 使用最近的 Provider 的值
  const theme = useContext(ThemeContext); // "dark"
  const user = useContext(UserContext);    // { name: 'John' }
  return <div className={theme}>Hello {user.name}</div>;
}
```

### Context 更新机制

```jsx
function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  // 当 Provider 的 value 改变时，所有消费该 Context 的组件都会重新渲染
  const theme = useContext(ThemeContext);
  console.log('ThemedButton rendered with theme:', theme);
  return <button className={theme}>Button</button>;
}
```

**重要**：当 `Provider` 的 `value` 改变时，所有消费该 Context 的组件都会重新渲染，即使它们只使用了 Context 的一部分。

---

## Context 的性能问题

### 问题：不必要的重新渲染

```jsx
const AppContext = createContext();

function App() {
  const [user, setUser] = useState({ name: 'John' });
  const [theme, setTheme] = useState('light');
  const [count, setCount] = useState(0);
  
  // ⚠️ 问题：每次 count 改变，value 对象都是新的引用
  const value = {
    user,
    theme,
    count
  };
  
  return (
    <AppContext.Provider value={value}>
      <UserProfile />
      <ThemedButton />
      <Counter />
    </AppContext.Provider>
  );
}

function UserProfile() {
  // ⚠️ 即使只使用 user，theme 或 count 改变时也会重新渲染
  const { user } = useContext(AppContext);
  return <div>{user.name}</div>;
}
```

**问题分析**：
- `value` 对象每次渲染都是新的引用
- 即使 `user` 和 `theme` 没变，`count` 改变也会导致所有消费者重新渲染

### 性能问题示例

```jsx
function App() {
  const [state, setState] = useState({ a: 1, b: 2, c: 3 });
  
  return (
    <AppContext.Provider value={state}>
      <ComponentA />  {/* 只使用 state.a */}
      <ComponentB />  {/* 只使用 state.b */}
      <ComponentC />  {/* 只使用 state.c */}
    </AppContext.Provider>
  );
}

// 当 state.a 改变时，ComponentB 和 ComponentC 也会重新渲染（不必要）
```

---

## 性能优化策略

### 策略 1：拆分 Context

```jsx
// ❌ 不好：所有数据放在一个 Context
const AppContext = createContext();

// ✅ 好：按关注点拆分 Context
const UserContext = createContext();
const ThemeContext = createContext();
const CountContext = createContext();

function App() {
  const [user, setUser] = useState({ name: 'John' });
  const [theme, setTheme] = useState('light');
  const [count, setCount] = useState(0);
  
  return (
    <UserContext.Provider value={user}>
      <ThemeContext.Provider value={theme}>
        <CountContext.Provider value={count}>
          <UserProfile />
          <ThemedButton />
          <Counter />
        </CountContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

// 现在只有相关的组件会重新渲染
function UserProfile() {
  const user = useContext(UserContext); // 只有 user 改变时才重新渲染
  return <div>{user.name}</div>;
}
```

### 策略 2：使用 useMemo 稳定 value

```jsx
function App() {
  const [user, setUser] = useState({ name: 'John' });
  const [theme, setTheme] = useState('light');
  
  // ✅ 使用 useMemo 稳定 value 引用
  const value = useMemo(() => ({
    user,
    theme
  }), [user, theme]);
  
  return (
    <AppContext.Provider value={value}>
      <Components />
    </AppContext.Provider>
  );
}
```

### 策略 3：Context + useReducer

```jsx
// 使用 useReducer 管理复杂状态
const AppContext = createContext();

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    theme: 'light'
  });
  
  // value 对象稳定
  const value = useMemo(() => ({
    state,
    dispatch
  }), [state]);
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

### 策略 4：选择器模式（类似 Redux）

```jsx
// 创建带选择器的 Context
function createContextWithSelector(defaultValue) {
  const Context = createContext(defaultValue);
  
  const Provider = ({ value, children }) => {
    const valueRef = useRef(value);
    valueRef.current = value;
    
    return <Context.Provider value={valueRef}>{children}</Context.Provider>;
  };
  
  const useContextSelector = (selector) => {
    const valueRef = useContext(Context);
    const [selected, setSelected] = useState(() => selector(valueRef.current));
    
    useEffect(() => {
      const checkUpdate = () => {
        const newSelected = selector(valueRef.current);
        if (newSelected !== selected) {
          setSelected(newSelected);
        }
      };
      // 使用 requestAnimationFrame 检查更新
      const rafId = requestAnimationFrame(checkUpdate);
      return () => cancelAnimationFrame(rafId);
    }, [selector]);
    
    return selected;
  };
  
  return { Context, Provider, useContextSelector };
}

// 使用
const { Provider, useContextSelector } = createContextWithSelector();

function UserProfile() {
  // 只订阅 user，theme 改变不会导致重新渲染
  const user = useContextSelector(state => state.user);
  return <div>{user.name}</div>;
}
```

### 策略 5：使用 React.memo 优化子组件

```jsx
// 即使 Context 更新，如果 props 没变，组件不会重新渲染
const ThemedButton = React.memo(function ThemedButton({ onClick }) {
  const theme = useContext(ThemeContext);
  return <button className={theme} onClick={onClick}>Button</button>;
});
```

---

## Context 组合模式

### 多个 Context 组合

```jsx
// 创建多个 Context
const ThemeContext = createContext('light');
const UserContext = createContext(null);
const LanguageContext = createContext('en');

// 组合 Provider
function AppProviders({ children }) {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  
  return (
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={user}>
        <LanguageContext.Provider value={language}>
          {children}
        </LanguageContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// 使用
function App() {
  return (
    <AppProviders>
      <Components />
    </AppProviders>
  );
}
```

### 自定义 Hook 封装

```jsx
// 封装多个 Context 的使用
function useAppContext() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  const language = useContext(LanguageContext);
  
  return { theme, user, language };
}

// 使用
function Component() {
  const { theme, user, language } = useAppContext();
  return <div className={theme}>Hello {user.name}</div>;
}
```

---

## 实际应用场景

### 场景 1：主题切换

#### 完整可运行示例

```jsx
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// 创建 Context
const ThemeContext = createContext();

// Provider 组件
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  // 保存主题到 localStorage
  const setThemeAndSave = useCallback((newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);
  
  // 从 localStorage 恢复主题
  useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  });
  
  const value = useMemo(() => ({
    theme,
    toggleTheme,
    setTheme: setThemeAndSave
  }), [theme, toggleTheme, setThemeAndSave]);
  
  return (
    <ThemeContext.Provider value={value}>
      <div className={`app ${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// 自定义 Hook
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// 使用示例
function App() {
  return (
    <ThemeProvider>
      <Header />
      <MainContent />
      <Footer />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className={`header ${theme}`}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </header>
  );
}

function MainContent() {
  const { theme } = useTheme();
  return (
    <main className={`content ${theme}`}>
      <p>Current theme: {theme}</p>
      <p>This content adapts to the theme.</p>
    </main>
  );
}

function Footer() {
  const { theme } = useTheme();
  return (
    <footer className={`footer ${theme}`}>
      <p>Footer content</p>
    </footer>
  );
}

// CSS 示例
/*
.app.light {
  background-color: #fff;
  color: #000;
}

.app.dark {
  background-color: #1a1a1a;
  color: #fff;
}
*/
```

#### TypeScript 版本

```tsx
import { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) setTheme(saved);
  }, []);
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);
  
  const setThemeAndSave = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);
  
  const value = useMemo<ThemeContextType>(() => ({
    theme,
    toggleTheme,
    setTheme: setThemeAndSave
  }), [theme, toggleTheme, setThemeAndSave]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### 场景 2：用户认证

#### 完整可运行示例

```jsx
import { createContext, useContext, useState, useEffect, useMemo } from 'react';

// 模拟 API
const mockApi = {
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      return { id: 1, name: 'John Doe', email: 'john@example.com' };
    }
    return null;
  },
  login: async (email, password) => {
    // 模拟登录
    if (email && password) {
      const user = { id: 1, name: 'John Doe', email };
      localStorage.setItem('token', 'fake-token');
      return user;
    }
    throw new Error('Invalid credentials');
  },
  logout: () => {
    localStorage.removeItem('token');
  }
};

// 创建 Context
const AuthContext = createContext();

// Provider 组件
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await mockApi.checkAuth();
        setUser(user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const user = await mockApi.login(email, password);
      setUser(user);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    mockApi.logout();
    setUser(null);
  };
  
  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  }), [user, loading, error]);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义 Hook
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// 使用示例
function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

function Router() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}

function LoginPage() {
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      // 错误已在 useAuth 中处理
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user.name}!</p>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// 受保护的路由组件
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <LoginPage />;
  
  return children;
}

// 使用受保护的路由
function AppWithProtectedRoutes() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/public" component={PublicPage} />
        <ProtectedRoute path="/dashboard">
          <Dashboard />
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
}
```

#### TypeScript 版本

```tsx
import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ... 实现逻辑同上
  
  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  }), [user, loading, error]);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 场景 3：国际化（i18n）

```jsx
const I18nContext = createContext();

const translations = {
  en: { hello: 'Hello', goodbye: 'Goodbye' },
  zh: { hello: '你好', goodbye: '再见' }
};

function I18nProvider({ children }) {
  const [language, setLanguage] = useState('en');
  
  const t = useCallback((key) => {
    return translations[language]?.[key] || key;
  }, [language]);
  
  const value = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, t]);
  
  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

// 使用
function Component() {
  const { t, language, setLanguage } = useI18n();
  return (
    <div>
      <p>{t('hello')}</p>
      <button onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}>
        Switch Language
      </button>
    </div>
  );
}
```

### 场景 4：表单状态管理

```jsx
const FormContext = createContext();

function FormProvider({ children, initialValues, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const setError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);
  
  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit(values);
  }, [values, onSubmit]);
  
  const value = useMemo(() => ({
    values,
    errors,
    touched,
    setValue,
    setError,
    setFieldTouched,
    handleSubmit
  }), [values, errors, touched, setValue, setError, setFieldTouched, handleSubmit]);
  
  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
}

function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within FormProvider');
  }
  return context;
}

// 使用
function Form() {
  return (
    <FormProvider initialValues={{ name: '', email: '' }} onSubmit={console.log}>
      <FormField name="name" />
      <FormField name="email" />
      <SubmitButton />
    </FormProvider>
  );
}

function FormField({ name }) {
  const { values, errors, touched, setValue, setFieldTouched } = useForm();
  return (
    <div>
      <input
        value={values[name] || ''}
        onChange={(e) => setValue(name, e.target.value)}
        onBlur={() => setFieldTouched(name)}
      />
      {touched[name] && errors[name] && <span>{errors[name]}</span>}
    </div>
  );
}
```

---

## useContext 与自定义 Hook 组合使用

> 💡 **推荐阅读**：[Context + 自定义 Hook 最佳模式](./05-Context-与自定义Hook-最佳模式.md) - 标准、专业、可复用的写法，适合真实项目使用

### 为什么组合使用？

**useContext + 自定义 Hook** 的组合模式是 React 中非常强大的模式，它提供了：

1. **封装 Context 逻辑**：隐藏 Context 的实现细节
2. **提供更好的 API**：自定义 Hook 可以提供更语义化的接口
3. **类型安全**：在 TypeScript 中提供更好的类型推断
4. **错误处理**：统一处理 Context 未找到的情况
5. **扩展功能**：可以在 Hook 中添加额外的逻辑

### 最佳实践模式（推荐）⭐

**核心思想**：将状态逻辑完全分离到自定义 Hook 中，Provider 只负责传递。

```jsx
// 1. 创建 Context
export const ThemeContext = createContext();

// 2. 自定义 Hook 封装状态逻辑
export function useThemeController() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);
  return { theme, toggleTheme };
}

// 3. Provider：把自定义 Hook 的返回值传给 Context
export function ThemeProvider({ children }) {
  const controller = useThemeController();
  return (
    <ThemeContext.Provider value={controller}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. 再封一个自定义 Hook 用于消费 Context
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme 必须在 ThemeProvider 中使用');
  }
  return ctx;
}
```

**优势**：
- ✅ 逻辑全部在自定义 Hook 中，Provider 更纯粹
- ✅ Context 只负责分发数据，不负责逻辑
- ✅ 可扩展性极强：支持 reducer、API 请求、持久化等
- ✅ 组件消费时体验非常好：`useTheme()`

详见：[Context + 自定义 Hook 最佳模式](./05-Context-与自定义Hook-最佳模式.md)

### 基础组合模式

#### 完整可运行示例

```jsx
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// 1. 创建 Context
const ThemeContext = createContext(undefined);

// 2. 创建 Provider 组件
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

// 3. 创建自定义 Hook（封装 useContext）
function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

// 4. 使用
function App() {
  return (
    <ThemeProvider>
      <ThemedComponent />
      <AnotherComponent />
    </ThemeProvider>
  );
}

function ThemedComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={theme}>
      <h1>Themed Component</h1>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

function AnotherComponent() {
  const { theme } = useTheme();
  return (
    <div className={theme}>
      <p>Another component using theme: {theme}</p>
    </div>
  );
}

// 运行结果：
// - 初始显示 theme 为 'light'
// - 点击 "Toggle Theme" 按钮后，theme 切换为 'dark'
// - ThemedComponent 和 AnotherComponent 都会更新
```

#### TypeScript 版本

```tsx
import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

// 定义类型
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// 1. 创建 Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. 创建 Provider 组件
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

// 3. 创建自定义 Hook
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

// 4. 使用（类型安全）
function App() {
  return (
    <ThemeProvider>
      <ThemedComponent />
    </ThemeProvider>
  );
}

function ThemedComponent() {
  const { theme, toggleTheme } = useTheme(); // TypeScript 自动推断类型
  return (
    <div className={theme}>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

### 模式 1：基础封装模式

最简单的组合方式，只是封装 `useContext` 调用：

```jsx
const UserContext = createContext(undefined);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  // ... 其他逻辑
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// 自定义 Hook：基础封装
function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}

// 使用
function Component() {
  const { user, setUser } = useUser();
  // ...
}
```

### 模式 2：增强功能模式

在自定义 Hook 中添加额外的逻辑和功能：

```jsx
const AuthContext = createContext(undefined);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ... Provider 逻辑
  
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义 Hook：增强功能
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  const { user, setUser, loading } = context;
  
  // 添加计算属性
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  
  // 添加便捷方法
  const login = useCallback(async (credentials) => {
    const user = await authenticate(credentials);
    setUser(user);
  }, [setUser]);
  
  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);
  
  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout
  };
}

// 使用：更丰富的 API
function Component() {
  const { isAuthenticated, isAdmin, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }
  
  return (
    <div>
      {isAdmin && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 模式 3：选择器模式

使用选择器只订阅 Context 的一部分，减少不必要的重新渲染：

```jsx
const AppContext = createContext(undefined);

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  
  const value = useMemo(() => ({
    user, setUser,
    theme, setTheme,
    notifications, setNotifications
  }), [user, theme, notifications]);
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// 基础 Hook
function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

// 选择器 Hook：只订阅特定部分
function useUser() {
  const { user, setUser } = useAppContext();
  return { user, setUser };
}

function useTheme() {
  const { theme, setTheme } = useAppContext();
  return { theme, setTheme };
}

function useNotifications() {
  const { notifications, setNotifications } = useAppContext();
  return { notifications, setNotifications };
}

// 使用：组件只会在相关数据改变时重新渲染
function UserProfile() {
  const { user } = useUser(); // 只有 user 改变时才重新渲染
  return <div>{user?.name}</div>;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme(); // 只有 theme 改变时才重新渲染
  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
    {theme}
  </button>;
}
```

### 模式 4：组合多个 Context

将多个 Context 组合成一个统一的 Hook：

```jsx
const ThemeContext = createContext(undefined);
const UserContext = createContext(undefined);
const LanguageContext = createContext(undefined);

// 各自的 Provider
function ThemeProvider({ children }) { /* ... */ }
function UserProvider({ children }) { /* ... */ }
function LanguageProvider({ children }) { /* ... */ }

// 各自的 Hook
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}

function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}

// 组合 Hook：统一访问多个 Context
function useApp() {
  const theme = useTheme();
  const user = useUser();
  const language = useLanguage();
  
  return {
    theme,
    user,
    language
  };
}

// 使用
function Component() {
  const { theme, user, language } = useApp();
  return (
    <div className={theme}>
      <p>{user.name} - {language}</p>
    </div>
  );
}
```

### 模式 5：工厂模式

创建一个工厂函数来生成 Context + Provider + Hook：

```jsx
// 工厂函数：创建完整的 Context 体系
function createContextWithHook(name, defaultValue) {
  const Context = createContext(defaultValue);
  
  // Provider 组件
  function Provider({ children, value }) {
    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    );
  }
  
  // 自定义 Hook
  function useContextHook() {
    const context = useContext(Context);
    if (context === defaultValue && defaultValue === undefined) {
      throw new Error(`${name} must be used within ${name}Provider`);
    }
    return context;
  }
  
  return {
    Context,
    Provider,
    useContext: useContextHook
  };
}

// 使用工厂函数
const { Provider: ThemeProvider, useContext: useTheme } = 
  createContextWithHook('Theme', 'light');

const { Provider: UserProvider, useContext: useUser } = 
  createContextWithHook('User', null);

// 使用
function App() {
  return (
    <ThemeProvider value="dark">
      <UserProvider value={{ name: 'John' }}>
        <Component />
      </UserProvider>
    </ThemeProvider>
  );
}

function Component() {
  const theme = useTheme();
  const user = useUser();
  return <div className={theme}>{user.name}</div>;
}
```

### 模式 6：状态管理 Hook 组合

将 `useReducer` 或 `useState` 与 Context 组合：

```jsx
// 定义 reducer
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    default:
      return state;
  }
}

const AppContext = createContext(undefined);

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    theme: 'light',
    notifications: []
  });
  
  const value = useMemo(() => ({
    state,
    dispatch
  }), [state]);
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// 自定义 Hook：封装 dispatch 操作
function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  
  const { state, dispatch } = context;
  
  // 封装 action creators
  const setUser = useCallback((user) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, [dispatch]);
  
  const setTheme = useCallback((theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  }, [dispatch]);
  
  const addNotification = useCallback((notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  }, [dispatch]);
  
  return {
    ...state,
    setUser,
    setTheme,
    addNotification
  };
}

// 使用：更简洁的 API
function Component() {
  const { user, theme, setUser, setTheme } = useApp();
  
  return (
    <div className={theme}>
      <p>{user?.name}</p>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

### 模式 7：异步数据获取组合

将数据获取逻辑封装在自定义 Hook 中：

```jsx
const DataContext = createContext(undefined);

function DataProvider({ children, fetchFn }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn();
        
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      }
    }
    
    loadData();
    
    return () => {
      cancelled = true;
    };
  }, [fetchFn]);
  
  const value = useMemo(() => ({
    data,
    loading,
    error,
    refetch: () => {
      // 触发重新获取
      setLoading(true);
    }
  }), [data, loading, error]);
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

// 自定义 Hook：封装数据获取逻辑
function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

// 使用
function App() {
  return (
    <DataProvider fetchFn={() => fetch('/api/users').then(r => r.json())}>
      <UserList />
    </DataProvider>
  );
}

function UserList() {
  const { data, loading, error } = useData();
  
  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;
  
  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

### 模式 8：表单 Hook 组合

将表单逻辑与 Context 结合：

```jsx
const FormContext = createContext(undefined);

function FormProvider({ children, initialValues, validationSchema, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 验证函数
  const validate = useCallback((name, value) => {
    if (!validationSchema) return null;
    const fieldSchema = validationSchema[name];
    if (!fieldSchema) return null;
    
    try {
      fieldSchema.validateSync(value);
      return null;
    } catch (error) {
      return error.message;
    }
  }, [validationSchema]);
  
  // 设置字段值
  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // 如果字段已被触摸，立即验证
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validate]);
  
  // 触摸字段
  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validate]);
  
  // 提交表单
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // 验证所有字段
    const newErrors = {};
    Object.keys(values).forEach(name => {
      const error = validate(name, values[name]);
      if (error) newErrors[name] = error;
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validate, onSubmit]);
  
  const value = useMemo(() => ({
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    handleSubmit
  }), [values, errors, touched, isSubmitting, setValue, setFieldTouched, handleSubmit]);
  
  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
}

// 自定义 Hook：封装表单字段逻辑
function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within FormProvider');
  }
  return context;
}

// 字段 Hook：封装单个字段的逻辑
function useFormField(name) {
  const { values, errors, touched, setValue, setFieldTouched } = useForm();
  
  return {
    value: values[name] || '',
    error: errors[name],
    touched: touched[name],
    onChange: (e) => setValue(name, e.target.value),
    onBlur: () => setFieldTouched(name)
  };
}

// 使用
function MyForm() {
  return (
    <FormProvider
      initialValues={{ email: '', password: '' }}
      validationSchema={{
        email: yup.string().email().required(),
        password: yup.string().min(6).required()
      }}
      onSubmit={async (values) => {
        await login(values);
      }}
    >
      <Form />
    </FormProvider>
  );
}

function Form() {
  const { handleSubmit, isSubmitting } = useForm();
  const email = useFormField('email');
  const password = useFormField('password');
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        {...email}
        type="email"
        placeholder="Email"
      />
      {email.touched && email.error && <span>{email.error}</span>}
      
      <input
        {...password}
        type="password"
        placeholder="Password"
      />
      {password.touched && password.error && <span>{password.error}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### 最佳实践总结

1. **总是创建自定义 Hook**：即使只是简单封装 `useContext`，也创建自定义 Hook
2. **提供错误处理**：在 Hook 中检查 Context 是否存在
3. **使用 TypeScript**：为 Context 和 Hook 提供类型定义
4. **稳定引用**：使用 `useMemo` 稳定 Provider 的 value
5. **拆分关注点**：按功能拆分 Context，而不是把所有数据放在一个 Context
6. **提供语义化 API**：自定义 Hook 应该提供更语义化的接口
7. **组合而非继承**：通过组合多个 Hook 来构建复杂功能

---

## 常见陷阱和解决方案

### 陷阱 1：忘记使用 Provider

```jsx
// ❌ 问题：没有 Provider，使用默认值
const ThemeContext = createContext('light');

function Component() {
  const theme = useContext(ThemeContext); // 总是 'light'
  return <div>{theme}</div>;
}

// ✅ 解决：提供 Provider
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Component />
    </ThemeContext.Provider>
  );
}
```

### 陷阱 2：Provider value 引用不稳定

```jsx
// ❌ 问题：每次渲染创建新对象
function App() {
  return (
    <ThemeContext.Provider value={{ theme: 'dark' }}>
      <Component />
    </ThemeContext.Provider>
  );
}

// ✅ 解决：使用 useMemo 或 useState
function App() {
  const value = useMemo(() => ({ theme: 'dark' }), []);
  return (
    <ThemeContext.Provider value={value}>
      <Component />
    </ThemeContext.Provider>
  );
}
```

### 陷阱 3：在 Provider 外部使用 Context

```jsx
// ❌ 问题：在 Provider 外部使用
function App() {
  return (
    <>
      <Component /> {/* 在 Provider 外部 */}
      <ThemeContext.Provider value="dark">
        <Component />
      </ThemeContext.Provider>
    </>
  );
}

// ✅ 解决：确保在 Provider 内部
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Component />
    </ThemeContext.Provider>
  );
}
```

### 陷阱 4：Context 值改变但组件不更新

```jsx
// ❌ 问题：直接修改对象属性
function App() {
  const value = { theme: 'light' };
  
  return (
    <ThemeContext.Provider value={value}>
      <Component />
      <button onClick={() => value.theme = 'dark'}>
        Toggle
      </button>
    </ThemeContext.Provider>
  );
}

// ✅ 解决：使用状态管理
function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <Component />
      <button onClick={() => setTheme('dark')}>
        Toggle
      </button>
    </ThemeContext.Provider>
  );
}
```

### 陷阱 5：错误处理缺失

```jsx
// ❌ 问题：没有检查 Context 是否存在
function useTheme() {
  return useContext(ThemeContext); // 可能返回 undefined
}

// ✅ 解决：添加错误检查
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

---

## 最佳实践

### 1. 拆分 Context

```jsx
// ✅ 好：按关注点拆分
const UserContext = createContext();
const ThemeContext = createContext();
const LanguageContext = createContext();

// ❌ 不好：所有数据放在一个 Context
const AppContext = createContext({ user, theme, language });
```

### 2. 使用自定义 Hook 封装

```jsx
// ✅ 好：封装 Context 使用
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// ❌ 不好：直接使用 useContext
function Component() {
  const theme = useContext(ThemeContext); // 没有错误检查
  return <div>{theme}</div>;
}
```

### 3. 稳定 Provider value

```jsx
// ✅ 好：使用 useMemo
function Provider({ children }) {
  const [state, setState] = useState({});
  const value = useMemo(() => ({ state, setState }), [state]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
```

### 4. 提供默认值

```jsx
// ✅ 好：提供有意义的默认值
const ThemeContext = createContext('light');

// 或者明确标记为 undefined
const ThemeContext = createContext(undefined);
```

### 5. 类型安全（TypeScript）

```jsx
// ✅ 好：定义类型
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### 6. 避免过度使用 Context

```jsx
// ❌ 不好：用 Context 传递局部数据
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <CountContext.Provider value={count}>
      <Child />
    </CountContext.Provider>
  );
}

// ✅ 好：使用 props
function Parent() {
  const [count, setCount] = useState(0);
  return <Child count={count} />;
}
```

---

## 快速参考

### 常用语法模式

#### 1. 基础模式（三步走）

```jsx
// 步骤 1：创建 Context
const MyContext = createContext(defaultValue);

// 步骤 2：创建 Provider
function MyProvider({ children }) {
  const [value, setValue] = useState(initialValue);
  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
}

// 步骤 3：使用 Hook
function Component() {
  const value = useContext(MyContext);
  return <div>{value}</div>;
}
```

#### 2. 自定义 Hook 模式（推荐）

```jsx
// 创建 Context
const MyContext = createContext(undefined);

// Provider
function MyProvider({ children }) {
  const value = useState(initialValue);
  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
}

// 自定义 Hook
function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
}

// 使用
function Component() {
  const value = useMyContext();
  return <div>{value}</div>;
}
```

#### 3. TypeScript 模式

```tsx
// 定义类型
interface ContextType {
  value: string;
  setValue: (value: string) => void;
}

// 创建 Context
const MyContext = createContext<ContextType | undefined>(undefined);

// Provider
function MyProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<string>('');
  const contextValue = useMemo(() => ({ value, setValue }), [value]);
  
  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
}

// 自定义 Hook
function useMyContext(): ContextType {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
}
```

#### 4. 性能优化模式

```jsx
// 使用 useMemo 稳定 value
function Provider({ children }) {
  const [state, setState] = useState({});
  const value = useMemo(() => ({ state, setState }), [state]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

// 拆分 Context
const UserContext = createContext();
const ThemeContext = createContext();

// 分别提供
<UserContext.Provider value={user}>
  <ThemeContext.Provider value={theme}>
    {children}
  </ThemeContext.Provider>
</UserContext.Provider>
```

### 常用代码片段

#### 创建 Context 文件模板

```jsx
// contexts/ThemeContext.jsx
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
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

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

#### 使用模板

```jsx
// App.jsx
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemedApp } from './ThemedApp';

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

// ThemedApp.jsx
import { useTheme } from './contexts/ThemeContext';

function ThemedApp() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={theme}>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

### 常见问题速查

| 问题 | 解决方案 |
|------|---------|
| Context 值为 undefined | 确保组件在 Provider 内部 |
| 组件不更新 | 检查 value 是否稳定（使用 useMemo） |
| 性能问题 | 拆分 Context 或使用选择器模式 |
| TypeScript 类型错误 | 定义 ContextType 接口 |
| 忘记 Provider | 使用自定义 Hook 抛出错误 |

---

## 📖 参考资源

- [Context + 自定义 Hook 最佳模式](./05-Context-与自定义Hook-最佳模式.md) ⭐ **推荐**
- [Context API 完整体系](./04-Context-API-完整体系.md)
- [React 官方文档 - useContext](https://react.dev/reference/react/useContext)
- [React 官方文档 - Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React Context API 最佳实践](https://kentcdodds.com/blog/how-to-use-react-context-effectively)

---

#react #hooks #usecontext #context #前端基础
