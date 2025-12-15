# React Router 完整指南

> React Router 是 React 应用中最流行的路由解决方案，提供了声明式的路由配置和导航功能。

---

## 目录

1. [快速开始](#快速开始)
2. [核心概念](#核心概念)
3. [基础路由配置](#基础路由配置)
4. [路由导航](#路由导航)
5. [嵌套路由](#嵌套路由)
6. [路由守卫与权限控制](#路由守卫与权限控制)
7. [代码分割与懒加载](#代码分割与懒加载)
8. [高级特性](#高级特性)
9. [最佳实践](#最佳实践)

---

## 快速开始

### 安装

```bash
# React Router v6（推荐）
npm install react-router-dom

# 或使用 yarn
yarn add react-router-dom
```

### 最简单的示例

```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 核心概念

### Router 类型

#### BrowserRouter（推荐）

使用 HTML5 History API，URL 格式：`http://example.com/about`

```jsx
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      {/* 应用内容 */}
    </BrowserRouter>
  )
}
```

**优点：**
- 干净的 URL（无 `#`）
- 支持浏览器前进/后退
- SEO 友好

**缺点：**
- 需要服务器配置支持（所有路由回退到 `index.html`）

#### HashRouter

使用 URL hash，URL 格式：`http://example.com/#/about`

```jsx
import { HashRouter } from 'react-router-dom'

function App() {
  return (
    <HashRouter>
      {/* 应用内容 */}
    </HashRouter>
  )
}
```

**优点：**
- 不需要服务器配置
- 兼容性好

**缺点：**
- URL 中有 `#`，不够美观
- SEO 不友好

#### MemoryRouter

路由信息存储在内存中，不改变 URL

```jsx
import { MemoryRouter } from 'react-router-dom'

// 常用于测试或非浏览器环境
<MemoryRouter>
  <App />
</MemoryRouter>
```

---

## 基础路由配置

### Routes 和 Route

```jsx
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} /> {/* 404 页面 */}
    </Routes>
  )
}
```

### 路径匹配规则

```jsx
<Routes>
  {/* 精确匹配 */}
  <Route path="/" element={<Home />} />
  
  {/* 动态参数 */}
  <Route path="/user/:id" element={<User />} />
  
  {/* 可选参数 */}
  <Route path="/posts/:id?" element={<Posts />} />
  
  {/* 通配符 */}
  <Route path="/files/*" element={<Files />} />
  
  {/* 404 页面 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### 获取路由参数

```jsx
import { useParams } from 'react-router-dom'

function User() {
  const { id } = useParams()
  return <div>用户 ID: {id}</div>
}
```

### 查询参数（Query Parameters）

```jsx
import { useSearchParams } from 'react-router-dom'

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q')
  
  return (
    <div>
      <input 
        value={query || ''} 
        onChange={(e) => setSearchParams({ q: e.target.value })}
      />
    </div>
  )
}
```

---

## 路由导航

### Link 组件

```jsx
import { Link } from 'react-router-dom'

<Link to="/about">关于我们</Link>
<Link to="/user/123">用户详情</Link>
```

### NavLink 组件（带激活状态）

```jsx
import { NavLink } from 'react-router-dom'

<NavLink 
  to="/about"
  className={({ isActive }) => isActive ? 'active' : ''}
>
  关于我们
</NavLink>
```

### useNavigate Hook（编程式导航）

```jsx
import { useNavigate } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate('/about')
    // 或使用相对路径
    navigate('../about')
    // 或带状态
    navigate('/about', { state: { from: 'home' } })
    // 或替换历史记录
    navigate('/about', { replace: true })
  }
  
  return <button onClick={handleClick}>跳转</button>
}
```

### 获取导航状态

```jsx
import { useLocation, useNavigate } from 'react-router-dom'

function MyComponent() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // 获取传递的状态
  const state = location.state
  
  // 获取当前路径
  const pathname = location.pathname
  
  // 获取查询参数
  const search = location.search
  
  return <div>当前路径: {pathname}</div>
}
```

---

## 嵌套路由

### 使用 Outlet

```jsx
// App.jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="contact" element={<Contact />} />
  </Route>
</Routes>

// Layout.jsx
import { Outlet, Link } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/contact">联系</Link>
      </nav>
      <Outlet /> {/* 子路由渲染位置 */}
    </div>
  )
}
```

### 多层嵌套

```jsx
<Routes>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route index element={<DashboardHome />} />
    <Route path="users" element={<Users />}>
      <Route index element={<UserList />} />
      <Route path=":id" element={<UserDetail />} />
    </Route>
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>
```

---

## 路由守卫与权限控制

### 保护路由组件

```jsx
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth() // 你的认证逻辑
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// 使用
<Routes>
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } 
  />
</Routes>
```

### 基于角色的路由

```jsx
function RoleBasedRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  
  return children
}

// 使用
<Route 
  path="/admin" 
  element={
    <RoleBasedRoute allowedRoles={['admin']}>
      <AdminPanel />
    </RoleBasedRoute>
  } 
/>
```

### 重定向

```jsx
import { Navigate } from 'react-router-dom'

<Routes>
  <Route path="/" element={<Navigate to="/home" replace />} />
  <Route path="/old-path" element={<Navigate to="/new-path" replace />} />
</Routes>
```

---

## 代码分割与懒加载

### React.lazy 和 Suspense

```jsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

// 懒加载组件
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  )
}
```

### 路由级别的代码分割

```jsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))

function App() {
  return (
    <Routes>
      <Route 
        path="/dashboard" 
        element={
          <Suspense fallback={<DashboardSkeleton />}>
            <Dashboard />
          </Suspense>
        } 
      />
    </Routes>
  )
}
```

---

## 高级特性

### useRoutes Hook（配置式路由）

```jsx
import { useRoutes } from 'react-router-dom'

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
]

function App() {
  const element = useRoutes(routes)
  return element
}
```

### useMatch Hook（路径匹配）

```jsx
import { useMatch } from 'react-router-dom'

function MyComponent() {
  const match = useMatch('/user/:id')
  
  if (match) {
    return <div>用户 ID: {match.params.id}</div>
  }
  
  return null
}
```

### useResolvedPath（解析路径）

```jsx
import { useResolvedPath } from 'react-router-dom'

function MyComponent() {
  const resolved = useResolvedPath('../about')
  // resolved.pathname, resolved.search, resolved.hash
}
```

### 路由状态管理

```jsx
import { useLocation, useNavigate } from 'react-router-dom'

function useRouteState() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const updateQuery = (key, value) => {
    const params = new URLSearchParams(location.search)
    params.set(key, value)
    navigate({ search: params.toString() }, { replace: true })
  }
  
  return { location, updateQuery }
}
```

---

## 最佳实践

### 1. 路由配置集中管理

```jsx
// routes.js
export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { 
        path: 'dashboard', 
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
        children: [
          { index: true, element: <DashboardHome /> },
          { path: 'settings', element: <Settings /> },
        ]
      },
    ],
  },
]
```

### 2. 路由常量管理

```jsx
// routes.constants.js
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
} as const
```

### 3. 类型安全（TypeScript）

```typescript
// routes.types.ts
export type RouteParams = {
  '/user/:id': { id: string }
  '/post/:id': { id: string }
}

// 类型安全的路由导航
function navigateToUser(id: string) {
  navigate(`/user/${id}`)
}
```

### 4. 路由懒加载最佳实践

```jsx
// 使用命名导出
const Dashboard = lazy(() => 
  import('./pages/Dashboard').then(module => ({ 
    default: module.Dashboard 
  }))
)

// 预加载
const preloadRoute = (route: string) => {
  const component = lazy(() => import(`./pages/${route}`))
  // 预加载逻辑
}
```

### 5. 错误边界与路由

```jsx
import { ErrorBoundary } from 'react-error-boundary'

<Routes>
  <Route 
    path="/dashboard" 
    element={
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Dashboard />
      </ErrorBoundary>
    } 
  />
</Routes>
```

---

## 常见问题

### Q: 如何实现路由动画？

**A:** 使用 `framer-motion` 或 `react-transition-group`：

```jsx
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

function App() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Routes location={location}>
          {/* 路由配置 */}
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
```

### Q: 如何处理 404 页面？

**A:** 使用通配符路由：

```jsx
<Routes>
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Q: 如何实现路由持久化？

**A:** 使用 `localStorage` 保存路由状态：

```jsx
function useRoutePersistence() {
  const location = useLocation()
  const navigate = useNavigate()
  
  useEffect(() => {
    localStorage.setItem('lastRoute', location.pathname)
  }, [location])
  
  useEffect(() => {
    const lastRoute = localStorage.getItem('lastRoute')
    if (lastRoute) {
      navigate(lastRoute, { replace: true })
    }
  }, [])
}
```

---

## 总结

React Router 提供了强大的路由功能：

1. ✅ **声明式路由**：使用 JSX 配置路由
2. ✅ **嵌套路由**：支持多层嵌套结构
3. ✅ **代码分割**：配合 `React.lazy` 实现懒加载
4. ✅ **权限控制**：灵活的路由守卫机制
5. ✅ **类型安全**：支持 TypeScript
6. ✅ **性能优化**：路由级别的代码分割

---

*最后更新：2025-12-12*
