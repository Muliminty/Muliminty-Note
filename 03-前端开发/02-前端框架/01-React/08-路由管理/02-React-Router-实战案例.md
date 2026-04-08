# React Router 实战案例

> 实际项目中的 React Router 使用场景和解决方案

---

## 目录

1. [认证流程路由](#认证流程路由)
2. [多级导航菜单](#多级导航菜单)
3. [面包屑导航](#面包屑导航)
4. [路由权限管理](#路由权限管理)
5. [路由动画过渡](#路由动画过渡)
6. [路由状态持久化](#路由状态持久化)

---

## 认证流程路由

### 完整的认证路由配置

```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// 公共路由
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

// 保护路由
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// 路由配置
function App() {
  return (
    <Routes>
      {/* 公共路由 */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      {/* 保护路由 */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* 默认重定向 */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
```

---

## 多级导航菜单

### 动态生成导航菜单

```jsx
import { useRoutes, useLocation, Link } from 'react-router-dom'

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'dashboard', element: <Dashboard />, title: '仪表盘' },
      { 
        path: 'users', 
        element: <Users />, 
        title: '用户管理',
        children: [
          { path: 'list', element: <UserList />, title: '用户列表' },
          { path: 'roles', element: <UserRoles />, title: '角色管理' },
        ]
      },
    ],
  },
]

function Navigation() {
  const location = useLocation()
  const currentPath = location.pathname
  
  const renderMenu = (items) => {
    return items.map(item => (
      <div key={item.path}>
        <Link 
          to={item.path}
          className={currentPath === item.path ? 'active' : ''}
        >
          {item.title}
        </Link>
        {item.children && renderMenu(item.children)}
      </div>
    ))
  }
  
  return <nav>{renderMenu(routes[0].children)}</nav>
}
```

---

## 面包屑导航

### 动态面包屑组件

```jsx
import { useLocation, Link, matchRoutes } from 'react-router-dom'

const routes = [
  { path: '/', title: '首页' },
  { path: '/dashboard', title: '仪表盘' },
  { path: '/users', title: '用户管理' },
  { path: '/users/:id', title: '用户详情' },
]

function Breadcrumb() {
  const location = useLocation()
  const matches = matchRoutes(routes, location)
  
  return (
    <nav>
      {matches?.map((match, index) => {
        const isLast = index === matches.length - 1
        const route = routes.find(r => r.path === match.route.path)
        
        return (
          <span key={match.pathname}>
            {isLast ? (
              <span>{route?.title}</span>
            ) : (
              <Link to={match.pathname}>{route?.title}</Link>
            )}
            {!isLast && <span> / </span>}
          </span>
        )
      })}
    </nav>
  )
}
```

---

## 路由权限管理

### 基于角色的路由控制

```jsx
import { Navigate, useRoutes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  
  return children
}

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'admin',
        element: (
          <RoleBasedRoute allowedRoles={['admin', 'superadmin']}>
            <AdminPanel />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'editor',
        element: (
          <RoleBasedRoute allowedRoles={['admin', 'editor']}>
            <EditorPanel />
          </RoleBasedRoute>
        ),
      },
    ],
  },
]

function App() {
  const element = useRoutes(routes)
  return element
}
```

---

## 路由动画过渡

### 使用 Framer Motion

```jsx
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, Routes, Route } from 'react-router-dom'

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
}

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Home />
            </motion.div>
          } 
        />
        <Route 
          path="/about" 
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <About />
            </motion.div>
          } 
        />
      </Routes>
    </AnimatePresence>
  )
}
```

---

## 路由状态持久化

### 保存和恢复路由状态

```jsx
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function useRoutePersistence() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // 保存路由状态
  useEffect(() => {
    const routeData = {
      pathname: location.pathname,
      search: location.search,
      state: location.state,
      timestamp: Date.now(),
    }
    
    localStorage.setItem('lastRoute', JSON.stringify(routeData))
  }, [location])
  
  // 恢复路由状态
  useEffect(() => {
    const savedRoute = localStorage.getItem('lastRoute')
    if (savedRoute) {
      const routeData = JSON.parse(savedRoute)
      const isExpired = Date.now() - routeData.timestamp > 24 * 60 * 60 * 1000 // 24小时
      
      if (!isExpired) {
        navigate(routeData.pathname + routeData.search, {
          state: routeData.state,
          replace: true,
        })
      }
    }
  }, [])
}

// 使用
function App() {
  useRoutePersistence()
  return <Routes>{/* 路由配置 */}</Routes>
}
```

---

*最后更新：2025-12-12*
