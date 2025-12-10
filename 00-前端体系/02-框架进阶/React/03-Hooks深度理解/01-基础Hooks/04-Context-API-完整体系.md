# Context API 完整体系

> 本文档将 `createContext`、`Provider` 和 `useContext` 三个知识点串联起来，深入理解 Context API 的完整工作机制。

---

## 📚 目录

1. [三个知识点的关系](#三个知识点的关系)
2. [完整工作流程](#完整工作流程)
3. [实际应用场景](#实际应用场景)
4. [性能优化策略](#性能优化策略)
5. [最佳实践组合](#最佳实践组合)

---

## 三个知识点的关系

### 知识点概览

```
createContext  ←─── 创建 Context 对象
     │
     ├─── Provider  ←─── 提供 Context 值
     │
     └─── useContext ←─── 消费 Context 值
```

### 关系说明

1. **createContext**：创建 Context 对象的基础
   - 返回包含 `Provider` 和 `Consumer` 的对象
   - 定义 Context 的类型和默认值

2. **Provider**：提供 Context 值的组件
   - 是 `createContext` 返回对象的属性
   - 通过 `value` prop 传递数据给子组件

3. **useContext**：消费 Context 值的 Hook
   - 读取 `Provider` 提供的 `value`
   - 在函数组件中使用

### 三者协作流程

```jsx
// 步骤 1：createContext 创建 Context
const ThemeContext = createContext(undefined);

// 步骤 2：Provider 提供值
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Component />
    </ThemeContext.Provider>
  );
}

// 步骤 3：useContext 消费值
function Component() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Content</div>;
}
```

---

## 完整工作流程

### 流程步骤详解

#### 步骤 1：创建 Context（createContext）

```jsx
// 参考：[createContext 详解](../01-基础入门/03-createContext.md)
import { createContext } from 'react';

// 创建 Context 对象
const ThemeContext = createContext(undefined);
```

**关键点**：
- 创建 Context 对象，包含 `Provider` 和 `Consumer`
- 定义默认值（推荐使用 `undefined`）
- Context 对象是唯一的，每个 `createContext` 调用创建新对象

#### 步骤 2：提供 Context 值（Provider）

```jsx
// 参考：[Provider 详解](../01-基础入门/04-Provider.md)
import { useState, useMemo } from 'react';

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  // 使用 useMemo 稳定 value 引用
  const value = useMemo(() => ({
    theme,
    setTheme
  }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**关键点**：
- Provider 包裹需要访问 Context 的组件
- `value` 改变时，所有消费者重新渲染
- 使用 `useMemo` 稳定引用，避免不必要的渲染

#### 步骤 3：消费 Context 值（useContext）

```jsx
// 参考：[useContext 详解](../01-基础入门/05-useContext.md)
import { useContext } from 'react';

function Component() {
  // 向上查找最近的 Provider，获取其 value
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <div className={theme}>
      <button onClick={() => setTheme('dark')}>Toggle</button>
    </div>
  );
}
```

**关键点**：
- 从当前组件向上查找最近的 Provider
- 如果没有 Provider，使用默认值
- Provider 的 value 改变时自动重新渲染

### 完整流程图

```
┌─────────────────────────────────────────┐
│  1. createContext                       │
│  const ThemeContext = createContext()   │
│  ↓ 创建 Context 对象                     │
└─────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│  2. Provider                            │
│  <ThemeContext.Provider value={...}>   │
│  ↓ 提供 Context 值                       │
└─────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│  3. useContext                          │
│  const value = useContext(ThemeContext) │
│  ↓ 消费 Context 值                       │
└─────────────────────────────────────────┘
```

---

## 实际应用场景

### 场景 1：主题切换（完整实现）

```jsx
// ========== 步骤 1：createContext ==========
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ThemeContext = createContext(undefined);

// ========== 步骤 2：Provider ==========
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

// ========== 步骤 3：useContext（封装成 Hook）==========
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// ========== 使用 ==========
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className={theme}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}

function Main() {
  const { theme } = useTheme();
  return <main className={theme}>Main Content</main>;
}

function Footer() {
  const { theme } = useTheme();
  return <footer className={theme}>Footer</footer>;
}
```

### 场景 2：用户认证（完整实现）

```jsx
// ========== 步骤 1：createContext ==========
const AuthContext = createContext(undefined);

// ========== 步骤 2：Provider ==========
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
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

// ========== 步骤 3：useContext ==========
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// ========== 使用 ==========
function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

function Router() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loading />;
  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}
```

---

## 性能优化策略

### 策略 1：稳定 value 引用

```jsx
// ❌ 不好：每次渲染创建新对象
function Provider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <Context.Provider value={{ user, setUser }}>
      {children}
    </Context.Provider>
  );
}

// ✅ 好：使用 useMemo 稳定引用
function Provider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}
```

### 策略 2：拆分 Context

```jsx
// ❌ 不好：所有数据在一个 Context
const AppContext = createContext(undefined);

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  
  return (
    <AppContext.Provider value={{ user, theme }}>
      {children}
    </AppContext.Provider>
  );
}

// ✅ 好：按关注点拆分
const UserContext = createContext(undefined);
const ThemeContext = createContext(undefined);

function AppProvider({ children }) {
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

### 策略 3：使用 useReducer

```jsx
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
  
  // state 对象引用更稳定
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

---

## 最佳实践组合

> 💡 **推荐阅读**：[Context + 自定义 Hook 最佳模式](./05-Context-与自定义Hook-最佳模式.md) - 更标准、专业、可复用的写法

### 模式对比

#### 方式 1：基础模式（本示例）

```jsx
// contexts/ThemeContext.jsx
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// ========== 1. createContext ==========
const ThemeContext = createContext(undefined);

// ========== 2. Provider ==========
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

// ========== 3. useContext（封装成 Hook）==========
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

#### 方式 2：最佳模式（推荐）⭐

将状态逻辑完全分离到自定义 Hook 中，Provider 更纯粹：

```jsx
// ========== 1. ThemeContext.js ==========
export const ThemeContext = createContext();

// ========== 2. useThemeController.js ==========
export function useThemeController() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);
  return { theme, toggleTheme };
}

// ========== 3. ThemeProvider.jsx ==========
export function ThemeProvider({ children }) {
  const controller = useThemeController();
  return (
    <ThemeContext.Provider value={controller}>
      {children}
    </ThemeContext.Provider>
  );
}

// ========== 4. useTheme.js ==========
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

### 推荐的文件结构

```
contexts/
  ├── theme/
  │   ├── ThemeContext.js          # Context 定义
  │   ├── useThemeController.js    # 状态逻辑 Hook（最佳模式）
  │   ├── ThemeProvider.jsx        # Provider 组件
  │   ├── useTheme.js              # 消费 Hook
  │   └── index.js                 # 统一导出
  └── index.js
```

### 使用方式

```jsx
// App.jsx
import { ThemeProvider } from './contexts/ThemeContext';

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
  return (
    <div className={theme}>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

---

## 三个知识点的协作要点

### 1. createContext 的职责

- 创建 Context 对象
- 定义默认值
- 提供 Provider 和 Consumer

### 2. Provider 的职责

- 提供 Context 值
- 管理值的更新
- 控制重新渲染范围

### 3. useContext 的职责

- 读取 Context 值
- 订阅值的变化
- 触发组件重新渲染

### 协作流程总结

```
createContext  →  创建 Context 对象
     ↓
Provider      →  提供值给组件树
     ↓
useContext    →  在组件中读取值
     ↓
值更新        →  Provider value 改变
     ↓
重新渲染      →  所有 useContext 的组件更新
```

---

## 常见问题

### Q1：为什么需要三个步骤？

**A**：三个步骤各司其职：
- `createContext`：定义数据结构
- `Provider`：提供数据
- `useContext`：消费数据

这种分离使得代码更清晰、更易维护。

### Q2：可以跳过 Provider 吗？

**A**：可以，但会使用默认值。推荐总是使用 Provider，这样可以：
- 动态更新值
- 提供更好的错误处理
- 支持多个 Provider 嵌套

### Q3：为什么 useContext 需要 Context 对象？

**A**：Context 对象是连接 Provider 和消费者的桥梁。React 通过 Context 对象在组件树中查找对应的 Provider。

---

## 参考资源

- [createContext 详解](../../01-基础入门/03-状态管理/03-createContext.md)
- [Provider 详解](../../01-基础入门/03-状态管理/04-Provider.md)
- [useContext 详解](../../01-基础入门/03-状态管理/05-useContext.md)
- [useContext 完整指南（详细版）](./03-useContext-完整指南-详细版.md)
- [Context + 自定义 Hook 最佳模式](./05-Context-与自定义Hook-最佳模式.md) ⭐ **推荐**
- [React 官方文档 - Context](https://react.dev/learn/passing-data-deeply-with-context)

---

#react #context #createContext #provider #useeffect #深度理解
