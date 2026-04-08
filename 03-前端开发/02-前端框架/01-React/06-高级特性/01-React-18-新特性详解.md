# React 18 新特性详解

> React 18 引入的并发特性、Suspense、Server Components 等新功能详解

---

## 目录

1. [自动批处理（Automatic Batching）](#自动批处理automatic-batching)
2. [Suspense 增强](#suspense-增强)
3. [并发特性（Concurrent Features）](#并发特性concurrent-features)
4. [useTransition](#usetransition)
5. [useDeferredValue](#usedeferredvalue)
6. [React Server Components](#react-server-components)
7. [新的 Hooks](#新的-hooks)
8. [迁移指南](#迁移指南)

---

## 自动批处理（Automatic Batching）

### 什么是批处理

React 会将多个状态更新合并为一次重新渲染，提升性能。

### React 17 的批处理

```javascript
// React 17：只在事件处理器中批处理
function handleClick() {
  setCount(c => c + 1)
  setFlag(f => !f)
  // React 17：只重新渲染一次（在事件处理器中）
}

// React 17：Promise、setTimeout 等不批处理
setTimeout(() => {
  setCount(c => c + 1)
  setFlag(f => !f)
  // React 17：重新渲染两次
}, 1000)
```

### React 18 的自动批处理

```javascript
// React 18：所有更新都自动批处理
function handleClick() {
  setCount(c => c + 1)
  setFlag(f => !f)
  // React 18：只重新渲染一次
}

setTimeout(() => {
  setCount(c => c + 1)
  setFlag(f => !f)
  // React 18：只重新渲染一次（自动批处理）
}, 1000)

fetch('/api/data').then(() => {
  setCount(c => c + 1)
  setFlag(f => !f)
  // React 18：只重新渲染一次（自动批处理）
})
```

### 退出批处理

```javascript
import { flushSync } from 'react-dom'

// 强制立即更新，不批处理
flushSync(() => {
  setCount(c => c + 1)
})
flushSync(() => {
  setFlag(f => !f)
})
// 重新渲染两次
```

---

## Suspense 增强

### 服务端 Suspense

```javascript
// React 18 支持服务端 Suspense
import { Suspense } from 'react'
import { renderToPipeableStream } from 'react-dom/server'

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile />
    </Suspense>
  )
}

// 服务端渲染
const { pipe } = renderToPipeableStream(<App />)
```

### Suspense 边界

```javascript
function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <NavBar />
      <Suspense fallback={<ContentSkeleton />}>
        <Sidebar />
        <Suspense fallback={<PostSkeleton />}>
          <Post />
        </Suspense>
      </Suspense>
    </Suspense>
  )
}
```

### Suspense 与数据获取

```javascript
// 使用 Suspense 进行数据获取
import { Suspense } from 'react'
import { use } from 'react' // React 18.3+

function UserProfile({ userId }) {
  const user = use(fetchUser(userId)) // 使用 use Hook
  return <div>{user.name}</div>
}

function App() {
  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserProfile userId="123" />
    </Suspense>
  )
}
```

---

## 并发特性（Concurrent Features）

### 什么是并发渲染

并发渲染允许 React 中断渲染工作，处理更高优先级的更新。

### 时间切片（Time Slicing）

```javascript
// React 18 可以将渲染工作分成多个小块
// 在浏览器空闲时执行，不阻塞主线程
function App() {
  return (
    <div>
      <HighPriorityComponent />
      <LowPriorityComponent />
    </div>
  )
}
```

### 可中断渲染

```javascript
// React 18 可以在渲染过程中中断，处理紧急更新
function App() {
  const [urgent, setUrgent] = useState(false)
  
  return (
    <div>
      {urgent && <UrgentNotification />}
      <HeavyComponent />
    </div>
  )
}
```

---

## useTransition

### 基本用法

```javascript
import { useTransition } from 'react'

function App() {
  const [isPending, startTransition] = useTransition()
  const [tab, setTab] = useState('about')
  
  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab) // 非紧急更新
    })
  }
  
  return (
    <div>
      {isPending && <Spinner />}
      <TabButton onClick={() => selectTab('about')}>About</TabButton>
      <TabButton onClick={() => selectTab('posts')}>Posts</TabButton>
      {tab === 'about' && <About />}
      {tab === 'posts' && <Posts />}
    </div>
  )
}
```

### 区分紧急和非紧急更新

```javascript
function SearchResults({ query }) {
  const [isPending, startTransition] = useTransition()
  const [results, setResults] = useState([])
  
  useEffect(() => {
    const controller = new AbortController()
    
    // 紧急：显示输入框
    setQuery(query)
    
    // 非紧急：搜索结果显示
    startTransition(() => {
      fetchResults(query).then(data => {
        setResults(data)
      })
    })
    
    return () => controller.abort()
  }, [query])
  
  return (
    <div>
      {isPending && <div>Searching...</div>}
      <ResultsList results={results} />
    </div>
  )
}
```

---

## useDeferredValue

### 基本用法

```javascript
import { useDeferredValue } from 'react'

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query)
  
  // query 更新时立即显示输入框
  // deferredQuery 延迟更新，用于搜索结果
  const results = useMemo(() => {
    return search(deferredQuery)
  }, [deferredQuery])
  
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ResultsList results={results} />
    </div>
  )
}
```

### 与 useTransition 对比

```javascript
// useTransition：标记更新为非紧急
function App() {
  const [isPending, startTransition] = useTransition()
  
  const handleChange = (e) => {
    startTransition(() => {
      setQuery(e.target.value)
    })
  }
}

// useDeferredValue：延迟值更新
function App() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
}
```

---

## React Server Components

### 什么是 Server Components

Server Components 在服务端运行，不发送 JavaScript 到客户端。

### Server Component vs Client Component

```javascript
// Server Component（默认）
// 在服务端运行，可以直接访问数据库、文件系统等
async function ServerComponent() {
  const data = await fetch('https://api.example.com/data')
  return <div>{data.title}</div>
}

// Client Component（需要 'use client' 指令）
'use client'
function ClientComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### Server Components 优势

1. **零客户端 JavaScript**：减少包大小
2. **直接访问后端**：无需 API 层
3. **安全性**：敏感代码在服务端运行
4. **性能**：减少客户端计算

### 使用限制

```javascript
// ❌ Server Components 不能使用：
// - useState, useEffect 等 Hooks
// - 浏览器 API（window, document 等）
// - 事件处理器

// ✅ Server Components 可以：
// - 直接访问数据库
// - 读取文件系统
// - 使用服务端库
```

---

## 新的 Hooks

### useId

```javascript
import { useId } from 'react'

function Form() {
  const id = useId()
  
  return (
    <>
      <label htmlFor={id}>Name</label>
      <input id={id} type="text" />
    </>
  )
}
```

### useSyncExternalStore

```javascript
import { useSyncExternalStore } from 'react'

function useStore(store) {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot
  )
}
```

### useInsertionEffect

```javascript
import { useInsertionEffect } from 'react'

function useCSS(rule) {
  useInsertionEffect(() => {
    const style = document.createElement('style')
    style.textContent = rule
    document.head.appendChild(style)
    return () => style.remove()
  })
}
```

---

## 迁移指南

### 升级步骤

1. **安装 React 18**

```bash
npm install react react-dom
```

2. **更新渲染 API**

```javascript
// React 17
import { render } from 'react-dom'
render(<App />, document.getElementById('root'))

// React 18
import { createRoot } from 'react-dom/client'
const root = createRoot(document.getElementById('root'))
root.render(<App />)
```

3. **处理破坏性变更**

```javascript
// React 18 移除了某些 API
// - ReactDOM.render (使用 createRoot)
// - ReactDOM.hydrate (使用 hydrateRoot)
```

### 兼容性检查

- ✅ 大部分现有代码无需修改
- ✅ 自动批处理自动生效
- ⚠️ 某些第三方库可能需要更新
- ⚠️ 测试代码可能需要调整

---

## 总结

React 18 的主要改进：

1. ✅ **自动批处理**：所有更新自动批处理
2. ✅ **并发特性**：可中断渲染，提升响应性
3. ✅ **Suspense 增强**：支持服务端 Suspense
4. ✅ **Server Components**：服务端组件支持
5. ✅ **新 Hooks**：useId、useSyncExternalStore 等

---

*最后更新：2025-12-12*
