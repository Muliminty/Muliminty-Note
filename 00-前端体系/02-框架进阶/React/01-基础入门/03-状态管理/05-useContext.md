# useContext

> `useContext` 是 React Hook，用于在函数组件中读取和订阅 Context 的值。

---

## 基本语法

### JavaScript

```jsx
import { useContext } from 'react';

const value = useContext(SomeContext);
```

### TypeScript

```tsx
import { useContext } from 'react';

const value = useContext(SomeContext);
// TypeScript 会自动推断 value 的类型
```

---

## API 签名

```typescript
function useContext<T>(context: React.Context<T>): T;
```

**参数**：
- `context`：通过 `createContext()` 创建的 Context 对象
- 类型：`React.Context<T>`，其中 `T` 是 Context 值的类型

**返回值**：
- 当前组件树中最近的 `Context.Provider` 的 `value` 值
- 如果没有 `Provider`，返回 `createContext()` 时传入的默认值
- 类型：`T`（Context 值的类型）

---

## 基本用法

### 示例 1：读取简单值

```jsx
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Component />
    </ThemeContext.Provider>
  );
}

function Component() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Content</div>;
}
```

### 示例 2：读取对象值

```jsx
const UserContext = createContext({ name: 'Guest' });

function App() {
  return (
    <UserContext.Provider value={{ name: 'John' }}>
      <Component />
    </UserContext.Provider>
  );
}

function Component() {
  const user = useContext(UserContext);
  return <div>Hello, {user.name}</div>;
}
```

### 示例 3：解构对象值

```jsx
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

function Component() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div className={theme}>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

---

## 值查找机制

### 向上查找最近的 Provider

```jsx
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Level1 />
    </ThemeContext.Provider>
  );
}

function Level1() {
  return (
    <ThemeContext.Provider value="light">
      <Level2 />
    </ThemeContext.Provider>
  );
}

function Level2() {
  // 使用最近的 Provider 的值：'light'
  const theme = useContext(ThemeContext);
  return <div>{theme}</div>;
}
```

### 没有 Provider 时使用默认值

```jsx
const ThemeContext = createContext('light');

// 没有 Provider
function App() {
  return <Component />;
}

function Component() {
  // 使用默认值：'light'
  const theme = useContext(ThemeContext);
  return <div className={theme}>Content</div>;
}
```

---

## 更新机制

### 自动重新渲染

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
  // 当 count 改变时，组件会自动重新渲染
  const count = useContext(CountContext);
  return <div>Count: {count}</div>;
}
```

**重要**：当 Provider 的 `value` 改变时，所有使用 `useContext` 的组件都会重新渲染。

---

## 多个 Context 使用

### 使用多个 useContext

```jsx
function Component() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  const language = useContext(LanguageContext);
  
  return (
    <div className={theme}>
      <p>Hello, {user.name}</p>
      <p>Language: {language}</p>
    </div>
  );
}
```

### 封装成自定义 Hook

```jsx
function useApp() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  const language = useContext(LanguageContext);
  
  return { theme, user, language };
}

function Component() {
  const { theme, user, language } = useApp();
  return <div className={theme}>Content</div>;
}
```

---

## 错误处理

### 检查 Context 是否存在

```jsx
// 方式 1：使用默认值
function Component() {
  const theme = useContext(ThemeContext) || 'light';
  return <div className={theme}>Content</div>;
}

// 方式 2：抛出错误（推荐）
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

function Component() {
  const theme = useTheme();
  return <div className={theme}>Content</div>;
}
```

---

## TypeScript 使用

### 类型推断

```tsx
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function Component() {
  const context = useContext(ThemeContext);
  
  // TypeScript 知道 context 可能是 undefined
  if (!context) {
    throw new Error('Component must be used within ThemeProvider');
  }
  
  // TypeScript 知道 context 是 ThemeContextType
  const { theme, toggleTheme } = context;
  return <div className={theme}>Content</div>;
}
```

### 自定义 Hook 类型

```tsx
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

function Component() {
  // TypeScript 自动推断类型
  const { theme, toggleTheme } = useTheme();
  return <div className={theme}>Content</div>;
}
```

---

## 完整示例

### 示例 1：主题切换

```jsx
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

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

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

function App() {
  return (
    <ThemeProvider>
      <Component />
    </ThemeProvider>
  );
}

function Component() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={theme}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

---

## 常见错误

### 错误 1：在 Provider 外部使用

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

### 错误 2：忘记处理 undefined

```jsx
// ❌ 错误：可能返回 undefined
function Component() {
  const theme = useContext(ThemeContext); // 可能是 undefined
  return <div className={theme}>Content</div>; // 错误
}

// ✅ 正确：处理 undefined
function Component() {
  const theme = useContext(ThemeContext) || 'light';
  return <div className={theme}>Content</div>;
}
```

---

## 最佳实践

1. **创建自定义 Hook**：封装 `useContext` 调用，提供错误处理
2. **处理 undefined**：检查 Context 是否存在
3. **使用 TypeScript**：提供类型安全
4. **避免过度使用**：只在需要跨组件传递数据时使用

---

## 参考资源

- [React 官方文档 - useContext](https://react.dev/reference/react/useContext)

---

#react #useeffect #hooks #基础概念
