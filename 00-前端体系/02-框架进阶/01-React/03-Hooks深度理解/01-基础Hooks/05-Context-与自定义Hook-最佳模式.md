# Context + 自定义 Hook 最佳模式

> **标准、专业、可复用的写法** - 前端项目里最常用的模式，适合在真实项目中直接使用。

---

## 📚 目录

1. [模式概述](#模式概述)
2. [完整实现步骤](#完整实现步骤)
3. [模式优势](#模式优势)
4. [实际应用示例](#实际应用示例)
5. [TypeScript 版本](#typescript-版本)
6. [扩展场景](#扩展场景)

---

## 模式概述

### 核心思想

将 Context 与自定义 Hook 分离，实现**关注点分离**：

- **Context**：只负责创建和分发数据
- **自定义 Hook（Controller）**：封装所有状态逻辑
- **Provider**：纯粹的数据传递层
- **自定义 Hook（Consumer）**：封装消费逻辑和错误处理

### 架构图

```
┌─────────────────────────────────────────┐
│  1. createContext                      │
│     创建 Context 对象                    │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  2. useThemeController (自定义 Hook)    │
│     封装所有状态逻辑                      │
│     - useState                          │
│     - useCallback                       │
│     - useMemo                           │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  3. ThemeProvider                       │
│     把 controller 返回值传给 Context     │
│     - 非常"干净"，只负责传递             │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  4. useTheme (消费 Hook)                │
│     封装 useContext + 错误处理           │
│     - 提供更好的使用体验                  │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  5. 组件中使用                           │
│     const { theme, toggleTheme } =      │
│         useTheme()                      │
└─────────────────────────────────────────┘
```

---

## 完整实现步骤

### ✅ 步骤 1：创建 Context

```javascript
import { createContext } from 'react';

export const ThemeContext = createContext();
```

**要点**：
- 只创建 Context，不做其他事情
- 推荐不设置默认值（使用 `undefined`），便于错误检查

### ✅ 步骤 2：自定义 Hook 封装状态逻辑

**关键**：把任何复杂逻辑都放进自定义 Hook，这样 Context 的 Provider 就非常"干净"。

```javascript
import { useState, useCallback } from 'react';

export function useThemeController() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
}
```

**要点**：
- 所有状态管理逻辑都在这里
- 使用 `useCallback` 稳定函数引用
- 返回需要传递给 Context 的值

### ✅ 步骤 3：Provider - 把自定义 Hook 的返回值传给 Context

```javascript
import { ThemeContext } from './ThemeContext';
import { useThemeController } from './useThemeController';

export function ThemeProvider({ children }) {
  const controller = useThemeController();

  return (
    <ThemeContext.Provider value={controller}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**要点**：
- Provider 非常"干净"，只负责传递
- 直接使用 controller 的返回值，无需额外处理
- 逻辑全部在 `useThemeController` 中

### ✅ 步骤 4：再封一个自定义 Hook 用于消费 Context（推荐做法）

这样使用体验更好，不需要每次都 `useContext`：

```javascript
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export function useTheme() {
  const ctx = useContext(ThemeContext);
  
  if (!ctx) {
    throw new Error('useTheme 必须在 ThemeProvider 中使用');
  }
  
  return ctx;
}
```

**要点**：
- 封装 `useContext` 调用
- 提供清晰的错误提示
- 使用体验更好：`useTheme()` 比 `useContext(ThemeContext)` 更语义化

### ✅ 步骤 5：在组件中使用

```javascript
import { useTheme } from './useTheme';

function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <p>当前主题：{theme}</p>
      <button onClick={toggleTheme}>切换主题</button>
    </div>
  );
}
```

---

## 模式优势

### 🔥 这种写法的优势

1. **逻辑全部在自定义 Hook 中，Provider 更纯粹**
   - Provider 只负责传递数据，不包含任何业务逻辑
   - 代码更清晰，职责分明

2. **Context 只负责分发数据，不负责逻辑**
   - Context 是纯粹的数据通道
   - 逻辑和状态管理都在自定义 Hook 中

3. **组件消费时体验非常好：`useTheme()`**
   - 语义化命名，代码可读性强
   - 不需要直接使用 `useContext(ThemeContext)`

4. **可扩展性极强：支持 reducer、API 请求、持久化等**
   - 可以在 `useThemeController` 中添加任何复杂逻辑
   - 支持异步操作、副作用处理等

5. **错误处理统一**
   - 在消费 Hook 中统一处理 Context 未找到的情况
   - 提供清晰的错误提示

6. **易于测试**
   - Controller Hook 可以独立测试
   - Provider 逻辑简单，测试成本低

---

## 实际应用示例

### 示例 1：主题切换（完整代码）

```javascript
// ========== ThemeContext.js ==========
import { createContext } from 'react';

export const ThemeContext = createContext();

// ========== useThemeController.js ==========
import { useState, useCallback } from 'react';

export function useThemeController() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
}

// ========== ThemeProvider.js ==========
import { ThemeContext } from './ThemeContext';
import { useThemeController } from './useThemeController';

export function ThemeProvider({ children }) {
  const controller = useThemeController();

  return (
    <ThemeContext.Provider value={controller}>
      {children}
    </ThemeContext.Provider>
  );
}

// ========== useTheme.js ==========
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export function useTheme() {
  const ctx = useContext(ThemeContext);
  
  if (!ctx) {
    throw new Error('useTheme 必须在 ThemeProvider 中使用');
  }
  
  return ctx;
}

// ========== App.js ==========
import { ThemeProvider } from './ThemeProvider';
import { Home } from './Home';

function App() {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
}

// ========== Home.js ==========
import { useTheme } from './useTheme';

function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <p>当前主题：{theme}</p>
      <button onClick={toggleTheme}>切换主题</button>
    </div>
  );
}
```

### 示例 2：用户认证（带异步操作）

```javascript
// ========== AuthContext.js ==========
import { createContext } from 'react';

export const AuthContext = createContext();

// ========== useAuthController.js ==========
import { useState, useCallback, useEffect } from 'react';

export function useAuthController() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态
    checkAuth().then(user => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const user = await authenticate(email, password);
      setUser(user);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
}

// ========== AuthProvider.js ==========
import { AuthContext } from './AuthContext';
import { useAuthController } from './useAuthController';

export function AuthProvider({ children }) {
  const controller = useAuthController();

  return (
    <AuthContext.Provider value={controller}>
      {children}
    </AuthContext.Provider>
  );
}

// ========== useAuth.js ==========
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export function useAuth() {
  const ctx = useContext(AuthContext);
  
  if (!ctx) {
    throw new Error('useAuth 必须在 AuthProvider 中使用');
  }
  
  return ctx;
}

// ========== 使用 ==========
function LoginPage() {
  const { login, loading } = useAuth();
  // ...
}

function Dashboard() {
  const { user, logout } = useAuth();
  // ...
}
```

### 示例 3：带持久化的主题（localStorage）

```javascript
// ========== useThemeController.js ==========
import { useState, useCallback, useEffect } from 'react';

export function useThemeController() {
  const [theme, setTheme] = useState(() => {
    // 从 localStorage 恢复
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const newTheme = t === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);

  return { theme, toggleTheme };
}
```

---

## TypeScript 版本

### 完整 TypeScript 实现

```typescript
// ========== ThemeContext.ts ==========
import { createContext } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ========== useThemeController.ts ==========
import { useState, useCallback } from 'react';

export function useThemeController(): ThemeContextType {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
}

// ========== ThemeProvider.tsx ==========
import { ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';
import { useThemeController } from './useThemeController';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const controller = useThemeController();

  return (
    <ThemeContext.Provider value={controller}>
      {children}
    </ThemeContext.Provider>
  );
}

// ========== useTheme.ts ==========
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  
  if (!ctx) {
    throw new Error('useTheme 必须在 ThemeProvider 中使用');
  }
  
  return ctx;
}

// ========== 使用 ==========
function Home() {
  const { theme, toggleTheme } = useTheme(); // TypeScript 自动推断类型
  // ...
}
```

---

## 扩展场景

### 场景 1：使用 useReducer

```javascript
// ========== useThemeController.js ==========
import { useReducer, useCallback } from 'react';

function themeReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE':
      return state === 'light' ? 'dark' : 'light';
    case 'SET':
      return action.payload;
    default:
      return state;
  }
}

export function useThemeController() {
  const [theme, dispatch] = useReducer(themeReducer, 'light');

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE' });
  }, []);

  const setTheme = useCallback((newTheme) => {
    dispatch({ type: 'SET', payload: newTheme });
  }, []);

  return { theme, toggleTheme, setTheme };
}
```

### 场景 2：多个状态组合

```javascript
// ========== useAppController.js ==========
import { useState, useCallback } from 'react';

export function useAppController() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('zh');

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
  }, []);

  return {
    theme,
    toggleTheme,
    user,
    updateUser,
    language,
    changeLanguage
  };
}
```

### 场景 3：API 请求集成

```javascript
// ========== useDataController.js ==========
import { useState, useCallback, useEffect } from 'react';

export function useDataController() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetch('/api/data').then(r => r.json());
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
```

---

## 文件组织建议

### 推荐的文件结构

```
contexts/
  ├── theme/
  │   ├── ThemeContext.js          # Context 定义
  │   ├── useThemeController.js    # 状态逻辑 Hook
  │   ├── ThemeProvider.jsx        # Provider 组件
  │   ├── useTheme.js              # 消费 Hook
  │   └── index.js                 # 统一导出
  ├── auth/
  │   ├── AuthContext.js
  │   ├── useAuthController.js
  │   ├── AuthProvider.jsx
  │   ├── useAuth.js
  │   └── index.js
  └── index.js                      # 导出所有 Context
```

### 统一导出示例

```javascript
// contexts/theme/index.js
export { ThemeContext } from './ThemeContext';
export { useThemeController } from './useThemeController';
export { ThemeProvider } from './ThemeProvider';
export { useTheme } from './useTheme';

// 使用
import { ThemeProvider, useTheme } from './contexts/theme';
```

---

## 最佳实践总结

### ✅ 推荐做法

1. **分离关注点**
   - Context 只负责创建
   - Controller Hook 负责逻辑
   - Provider 只负责传递
   - Consumer Hook 负责消费和错误处理

2. **使用 useCallback 稳定函数引用**
   ```javascript
   const toggleTheme = useCallback(() => {
     setTheme(t => (t === 'light' ? 'dark' : 'light'));
   }, []);
   ```

3. **提供清晰的错误提示**
   ```javascript
   if (!ctx) {
     throw new Error('useTheme 必须在 ThemeProvider 中使用');
   }
   ```

4. **语义化命名**
   - Controller Hook: `useThemeController`
   - Consumer Hook: `useTheme`
   - Provider: `ThemeProvider`

### ❌ 避免的做法

1. **不要在 Provider 中写业务逻辑**
   ```javascript
   // ❌ 不好
   function ThemeProvider({ children }) {
     const [theme, setTheme] = useState('light');
     // 很多业务逻辑...
     return <ThemeContext.Provider value={...}>{children}</ThemeContext.Provider>;
   }
   
   // ✅ 好
   function ThemeProvider({ children }) {
     const controller = useThemeController();
     return <ThemeContext.Provider value={controller}>{children}</ThemeContext.Provider>;
   }
   ```

2. **不要直接使用 useContext**
   ```javascript
   // ❌ 不好
   function Component() {
     const theme = useContext(ThemeContext);
     // ...
   }
   
   // ✅ 好
   function Component() {
     const { theme } = useTheme();
     // ...
   }
   ```

---

## 相关文档

- [createContext 详解](../../01-基础入门/03-状态管理/03-createContext.md)
- [Provider 详解](../../01-基础入门/03-状态管理/04-Provider.md)
- [useContext 详解](../../01-基础入门/03-状态管理/05-useContext.md)
- [Context API 完整体系](./04-Context-API-完整体系.md)
- [useContext 完整指南（详细版）](./03-useContext-完整指南-详细版.md)

---

#react #context #hooks #最佳实践 #架构模式