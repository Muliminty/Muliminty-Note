# React 性能优化详细实践

> React 应用性能优化的完整指南和实践技巧

---

## 目录

1. [性能分析工具](#性能分析工具)
2. [渲染优化](#渲染优化)
3. [代码分割](#代码分割)
4. [列表优化](#列表优化)
5. [内存优化](#内存优化)
6. [网络优化](#网络优化)
7. [实际案例](#实际案例)

---

## 性能分析工具

### React DevTools Profiler

```javascript
// 使用 Profiler 组件测量性能
import { Profiler } from 'react'

function onRenderCallback(id, phase, actualDuration) {
  console.log('Component:', id)
  console.log('Phase:', phase) // mount 或 update
  console.log('Duration:', actualDuration, 'ms')
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <YourComponent />
    </Profiler>
  )
}
```

### Performance API

```javascript
// 测量组件渲染时间
function measureRender(componentName, renderFn) {
  performance.mark(`${componentName}-start`)
  renderFn()
  performance.mark(`${componentName}-end`)
  performance.measure(
    componentName,
    `${componentName}-start`,
    `${componentName}-end`
  )
  
  const measure = performance.getEntriesByName(componentName)[0]
  console.log(`${componentName} took ${measure.duration}ms`)
}
```

---

## 渲染优化

### 1. React.memo 的正确使用

```javascript
// ✅ 正确：当 props 变化频繁时使用
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* 复杂渲染 */}</div>
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.data.id === nextProps.data.id
})

// ❌ 错误：简单组件不需要 memo
const SimpleComponent = React.memo(({ text }) => {
  return <div>{text}</div> // 不需要 memo
})
```

### 2. useMemo 和 useCallback

```javascript
// ✅ 正确：复杂计算使用 useMemo
function Component({ items }) {
  const expensiveValue = useMemo(() => {
    return items.reduce((acc, item) => {
      // 复杂计算
      return acc + item.value * item.weight
    }, 0)
  }, [items])
  
  return <div>{expensiveValue}</div>
}

// ✅ 正确：传递给子组件的函数使用 useCallback
function Parent({ items }) {
  const handleClick = useCallback((id) => {
    // 处理点击
  }, [])
  
  return <Child onClick={handleClick} />
}

// ❌ 错误：简单计算不需要 useMemo
const simpleValue = useMemo(() => items.length, [items]) // 不需要
```

### 3. 避免在渲染中创建对象

```javascript
// ❌ 错误：每次渲染都创建新对象
function Component({ style }) {
  return <div style={{ color: 'red', ...style }} />
}

// ✅ 正确：使用 useMemo
function Component({ style }) {
  const mergedStyle = useMemo(() => ({
    color: 'red',
    ...style
  }), [style])
  
  return <div style={mergedStyle} />
}
```

### 4. 状态提升和状态下沉

```javascript
// ❌ 错误：状态提升过高
function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <Header count={count} />
      <Main count={count} />
      <Footer count={count} />
    </div>
  )
}

// ✅ 正确：状态下沉到需要的地方
function App() {
  return (
    <div>
      <Header />
      <Counter /> {/* 状态在 Counter 内部 */}
      <Footer />
    </div>
  )
}
```

---

## 代码分割

### 路由级别的代码分割

```javascript
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  )
}
```

### 组件级别的代码分割

```javascript
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  const [showHeavy, setShowHeavy] = useState(false)
  
  return (
    <div>
      <button onClick={() => setShowHeavy(true)}>Load Heavy</button>
      {showHeavy && (
        <Suspense fallback={<div>Loading...</div>}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  )
}
```

### 预加载

```javascript
// 预加载组件
const preloadComponent = (importFn) => {
  const componentPromise = importFn()
  return componentPromise
}

// 鼠标悬停时预加载
function Link({ to, children }) {
  const handleMouseEnter = () => {
    if (to === '/dashboard') {
      preloadComponent(() => import('./pages/Dashboard'))
    }
  }
  
  return (
    <a href={to} onMouseEnter={handleMouseEnter}>
      {children}
    </a>
  )
}
```

---

## 列表优化

### 虚拟化列表

```javascript
import { FixedSizeList } from 'react-window'

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  )
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}
```

### 列表渲染优化

```javascript
// ✅ 正确：使用稳定的 key
function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  )
}

// ❌ 错误：使用索引作为 key（当列表会变化时）
function List({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <ListItem key={index} item={item} />
      ))}
    </ul>
  )
}
```

---

## 内存优化

### 清理副作用

```javascript
function Component() {
  useEffect(() => {
    const timer = setInterval(() => {
      // 定时任务
    }, 1000)
    
    // ✅ 清理定时器
    return () => clearInterval(timer)
  }, [])
  
  useEffect(() => {
    const controller = new AbortController()
    
    fetch('/api/data', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        // 处理数据
      })
    
    // ✅ 清理请求
    return () => controller.abort()
  }, [])
}
```

### 避免内存泄漏

```javascript
// ❌ 错误：闭包陷阱
function Component() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1) // 闭包陷阱，count 始终是初始值
    }, 1000)
    
    return () => clearInterval(timer)
  }, []) // 缺少 count 依赖
  
  return <div>{count}</div>
}

// ✅ 正确：使用函数式更新
function Component() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1) // 函数式更新
    }, 1000)
    
    return () => clearInterval(timer)
  }, []) // 不需要 count 依赖
  
  return <div>{count}</div>
}
```

---

## 网络优化

### 数据获取优化

```javascript
// 使用 React Query 进行数据缓存和优化
import { useQuery } from '@tanstack/react-query'

function UserProfile({ userId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000, // 5 分钟内数据新鲜
    cacheTime: 10 * 60 * 1000, // 缓存 10 分钟
  })
  
  if (isLoading) return <Loading />
  return <div>{data.name}</div>
}
```

### 图片优化

```javascript
// 懒加载图片
function LazyImage({ src, alt }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef()
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsLoaded(true)
        observer.disconnect()
      }
    })
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : undefined}
      alt={alt}
      loading="lazy"
    />
  )
}
```

---

## 实际案例

### 案例 1：大型表单优化

```javascript
// 问题：表单字段多，每次输入都重新渲染整个表单
// 解决：拆分组件，使用 React.memo

const FormField = React.memo(({ label, value, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <input value={value} onChange={onChange} />
    </div>
  )
})

function LargeForm() {
  const [formData, setFormData] = useState({})
  
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])
  
  return (
    <form>
      {Object.entries(formData).map(([key, value]) => (
        <FormField
          key={key}
          label={key}
          value={value}
          onChange={(e) => updateField(key, e.target.value)}
        />
      ))}
    </form>
  )
}
```

### 案例 2：实时搜索优化

```javascript
// 问题：每次输入都触发搜索请求
// 解决：防抖 + 缓存

import { useMemo } from 'react'
import { useDebouncedValue } from './hooks/useDebouncedValue'

function SearchComponent() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 300)
  
  const { data } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => search(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  })
  
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {data && <SearchResults results={data} />}
    </div>
  )
}
```

---

## 性能优化检查清单

- [ ] 使用 React DevTools Profiler 分析性能瓶颈
- [ ] 避免不必要的重新渲染（React.memo、useMemo、useCallback）
- [ ] 实现路由级别的代码分割
- [ ] 大型列表使用虚拟化
- [ ] 清理所有副作用（useEffect cleanup）
- [ ] 使用稳定的 key 值
- [ ] 优化图片加载（懒加载、格式优化）
- [ ] 使用数据缓存（React Query、SWR）
- [ ] 避免在渲染中创建对象和函数
- [ ] 合理使用状态提升和下沉

---

## 总结

React 性能优化的核心原则：

1. ✅ **测量优先**：使用工具找出性能瓶颈
2. ✅ **避免过度优化**：只在必要时优化
3. ✅ **代码分割**：按需加载减少初始包大小
4. ✅ **渲染优化**：减少不必要的重新渲染
5. ✅ **内存管理**：清理副作用，避免内存泄漏

---

*最后更新：2025-12-12*
