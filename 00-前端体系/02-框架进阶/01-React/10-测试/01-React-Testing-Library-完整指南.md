# React Testing Library 完整指南

> 使用 React Testing Library 进行 React 组件测试的完整指南

---

## 目录

1. [快速开始](#快速开始)
2. [核心原则](#核心原则)
3. [基础测试](#基础测试)
4. [用户交互测试](#用户交互测试)
5. [异步操作测试](#异步操作测试)
6. [Hooks 测试](#hooks-测试)
7. [Context 测试](#context-测试)
8. [路由测试](#路由测试)
9. [Mock 和 Stub](#mock-和-stub)
10. [最佳实践](#最佳实践)

---

## 快速开始

### 安装

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### 基础配置

```javascript
// setupTests.js
import '@testing-library/jest-dom'
```

---

## 核心原则

### 测试用户行为，而非实现细节

**❌ 不好的测试：**
```javascript
// 测试实现细节
expect(component.state.count).toBe(1)
```

**✅ 好的测试：**
```javascript
// 测试用户看到的内容
expect(screen.getByText('Count: 1')).toBeInTheDocument()
```

### 查询优先级

1. **getByRole** - 最推荐，语义化查询
2. **getByLabelText** - 表单元素
3. **getByPlaceholderText** - 输入框
4. **getByText** - 文本内容
5. **getByDisplayValue** - 表单值
6. **getByAltText** - 图片
7. **getByTitle** - title 属性
8. **getByTestId** - 最后选择

---

## 基础测试

### 组件渲染测试

```javascript
import { render, screen } from '@testing-library/react'
import Button from './Button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  const button = screen.getByRole('button', { name: /click me/i })
  expect(button).toBeInTheDocument()
})
```

### 条件渲染测试

```javascript
function Greeting({ isLoggedIn }) {
  return isLoggedIn ? <p>Welcome back!</p> : <p>Please log in</p>
}

test('shows welcome message when logged in', () => {
  render(<Greeting isLoggedIn={true} />)
  expect(screen.getByText('Welcome back!')).toBeInTheDocument()
  expect(screen.queryByText('Please log in')).not.toBeInTheDocument()
})

test('shows login message when not logged in', () => {
  render(<Greeting isLoggedIn={false} />)
  expect(screen.getByText('Please log in')).toBeInTheDocument()
  expect(screen.queryByText('Welcome back!')).not.toBeInTheDocument()
})
```

---

## 用户交互测试

### 使用 user-event

```javascript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from './Counter'

test('increments counter on button click', async () => {
  const user = userEvent.setup()
  render(<Counter />)
  
  const button = screen.getByRole('button', { name: /increment/i })
  await user.click(button)
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

### 表单输入测试

```javascript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'

test('submits form with user input', async () => {
  const user = userEvent.setup()
  const handleSubmit = jest.fn()
  
  render(<LoginForm onSubmit={handleSubmit} />)
  
  const emailInput = screen.getByLabelText(/email/i)
  const passwordInput = screen.getByLabelText(/password/i)
  const submitButton = screen.getByRole('button', { name: /submit/i })
  
  await user.type(emailInput, 'user@example.com')
  await user.type(passwordInput, 'password123')
  await user.click(submitButton)
  
  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'user@example.com',
    password: 'password123',
  })
})
```

---

## 异步操作测试

### 等待元素出现

```javascript
import { render, screen, waitFor } from '@testing-library/react'
import { fetchUser } from './api'
import UserProfile from './UserProfile'

test('displays user data after loading', async () => {
  render(<UserProfile userId="123" />)
  
  // 等待加载完成
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
  
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
})
```

### 使用 findBy 查询

```javascript
test('displays user data', async () => {
  render(<UserProfile userId="123" />)
  
  // findBy 自动等待
  const userName = await screen.findByText('John Doe')
  expect(userName).toBeInTheDocument()
})
```

### Mock API 调用

```javascript
import { render, screen, waitFor } from '@testing-library/react'
import { fetchUser } from './api'
import UserProfile from './UserProfile'

jest.mock('./api')

test('displays user data', async () => {
  fetchUser.mockResolvedValue({ name: 'John Doe', email: 'john@example.com' })
  
  render(<UserProfile userId="123" />)
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
  
  expect(fetchUser).toHaveBeenCalledWith('123')
})
```

---

## Hooks 测试

### 使用 renderHook

```javascript
import { renderHook, act } from '@testing-library/react'
import { useState } from 'react'

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  return { count, increment, decrement }
}

test('increments counter', () => {
  const { result } = renderHook(() => useCounter(0))
  
  expect(result.current.count).toBe(0)
  
  act(() => {
    result.current.increment()
  })
  
  expect(result.current.count).toBe(1)
})
```

### 测试 useEffect

```javascript
import { renderHook } from '@testing-library/react'
import { useEffect, useState } from 'react'

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
  }, [title])
}

test('updates document title', () => {
  renderHook(() => useDocumentTitle('New Title'))
  expect(document.title).toBe('New Title')
})
```

---

## Context 测试

### 测试 Context Provider

```javascript
import { render, screen } from '@testing-library/react'
import { createContext, useContext } from 'react'

const ThemeContext = createContext()

function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value="dark">
      {children}
    </ThemeContext.Provider>
  )
}

function ThemedButton() {
  const theme = useContext(ThemeContext)
  return <button>Theme: {theme}</button>
}

test('uses theme from context', () => {
  render(
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  )
  
  expect(screen.getByText('Theme: dark')).toBeInTheDocument()
})
```

---

## 路由测试

### 测试 React Router

```javascript
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/about">About</Link>
    </div>
  )
}

test('renders home page', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
  
  expect(screen.getByText('Home')).toBeInTheDocument()
})
```

---

## Mock 和 Stub

### Mock 函数

```javascript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>
}

test('calls onClick when clicked', async () => {
  const handleClick = jest.fn()
  const user = userEvent.setup()
  
  render(<Button onClick={handleClick}>Click me</Button>)
  
  await user.click(screen.getByRole('button'))
  
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### Mock 模块

```javascript
// api.js
export const fetchData = async () => {
  const response = await fetch('/api/data')
  return response.json()
}

// Component.test.js
import { fetchData } from './api'

jest.mock('./api')

test('displays data', async () => {
  fetchData.mockResolvedValue({ name: 'Test' })
  
  render(<Component />)
  
  await waitFor(() => {
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

---

## 最佳实践

### 1. 使用语义化查询

```javascript
// ✅ 好
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')

// ❌ 不好
screen.getByTestId('submit-button')
screen.getByClassName('email-input')
```

### 2. 测试用户行为

```javascript
// ✅ 测试用户看到和交互的内容
test('user can submit form', async () => {
  // ...
})

// ❌ 不要测试实现细节
test('component state updates', () => {
  // ...
})
```

### 3. 使用 data-testid 作为最后选择

```javascript
// 只有在没有其他查询方式时才使用
<div data-testid="complex-component">
  {/* 复杂组件 */}
</div>

screen.getByTestId('complex-component')
```

### 4. 清理测试

```javascript
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
```

### 5. 测试可访问性

```javascript
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('has no accessibility violations', async () => {
  const { container } = render(<Component />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

## 总结

React Testing Library 的核心思想：

1. ✅ **测试用户行为**：关注用户看到和交互的内容
2. ✅ **语义化查询**：使用 `getByRole`、`getByLabelText` 等
3. ✅ **异步处理**：使用 `waitFor` 和 `findBy` 处理异步操作
4. ✅ **用户事件**：使用 `user-event` 模拟真实用户交互
5. ✅ **可访问性**：测试可访问性，提升应用质量

---

*最后更新：2025-12-12*
