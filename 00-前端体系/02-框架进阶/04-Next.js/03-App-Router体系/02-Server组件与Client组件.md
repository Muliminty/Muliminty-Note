# 02. Server Component 与 Client Component 深度解析

这是 Next.js App Router 中**最重要、最容易混淆**的概念。

在 App Router 中，**所有的组件默认都是服务端组件 (Server Components)**。这意味着它们在服务器上渲染，生成的 HTML 被发送到客户端，**没有任何 JavaScript 代码**被发送到浏览器（除非你显式声明）。

---

## 1. 核心区别

| 特性 | **Server Component (默认)** | **Client Component** |
| :--- | :--- | :--- |
| **渲染位置** | 服务器 (构建时或请求时) | 客户端 (浏览器) + 服务器 (首次 SSR) |
| **数据获取** | ✅ 直接访问数据库/文件系统 | ❌ 只能通过 API / Server Actions |
| **JS 打包体积** | ✅ **0 KB** (代码不发给浏览器) | ❌ 代码会打包进 JS Bundle |
| **交互性** | ❌ 无法使用 `onClick`, `onChange` | ✅ 可以使用事件监听 |
| **React Hooks** | ❌ 无法使用 `useState`, `useEffect` | ✅ 可以使用所有 Hooks |
| **声明方式** | 默认就是，无需声明 | 文件顶部添加 `'use client'` |

---

## 2. 什么时候用 "use client"？

记住一个原则：**默认用 Server，交互用 Client**。

### ✅ 必须用 Server Component 的场景
- **获取数据**：直接连数据库，或者调内部微服务。
- **访问后端资源**：读取 `fs` 文件系统，校验 API 密钥。
- **为了性能**：大型依赖包（如 Markdown 解析器、日期处理库），如果在服务端运行，用户就不用下载这些几百 KB 的 JS 了。

### ✅ 必须用 Client Component 的场景
- **交互**：`onClick`, `onChange`, `onSubmit`。
- **状态**：`useState`, `useReducer`。
- **生命周期**：`useEffect`, `useLayoutEffect`。
- **浏览器 API**：`window`, `document`, `localStorage`, `geolocation`。
- **自定义 Hooks**：如果 Hook 内部用了 state/effect。

---

## 3. 混合使用的模式 (企业级最佳实践)

在企业级项目中，我们追求 **"叶子节点客户端化"** (Leaf Client Components)。

### ❌ 错误示范：为了交互，把整个页面变成 Client
如果你在 `page.tsx` 顶部写了 `'use client'`，那你整个页面、包括它的所有子组件，都变成了客户端组件。这就失去了 Next.js 的性能优势。

```tsx
// app/page.tsx
'use client' // 😱 性能杀手！

import Header from './Header'
import BigDataList from './BigDataList' // 哪怕这个列表只是展示，也被迫变成了客户端组件

export default function Page() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <Header />
      <button onClick={() => setCount(count + 1)}>+</button>
      <BigDataList />
    </div>
  )
}
```

### ✅ 正确示范：通过组件拆分，隔离交互逻辑

只把需要交互的那一小部分拆出来，标记为 `'use client'`。

```tsx
// 1. 拆分交互组件: app/Counter.tsx
'use client' // ✅ 只有这个小组件是客户端的

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>+</button>
}
```

```tsx
// 2. 页面保持服务端: app/page.tsx
// 默认是 Server Component

import Header from './Header'
import BigDataList from './BigDataList' // ✅ 依然是 Server Component，代码不发给浏览器
import Counter from './Counter'

export default function Page() {
  return (
    <div>
      <Header />
      <Counter /> {/* 就像乐高积木一样嵌入 */}
      <BigDataList />
    </div>
  )
}
```

---

## 4. 边界与陷阱 (必看)

### 陷阱 1：Server Component 不能导入 Client Component 吗？
**错！** Server Component **可以** 导入并渲染 Client Component (这是最常见的用法)。

### 陷阱 2：Client Component 能导入 Server Component 吗？
**不可以！**
一旦你进入了 Client Component (`'use client'`) 的领域，你引入的所有组件都会被视为 Client Component（即使它们没写 `'use client'`）。

**但是！** 你可以通过 `children` props 将 Server Component 传递给 Client Component。

**🧩 模式：作为 Props 传递 (The "Slot" Pattern)**

```tsx
// ClientWrapper.tsx
'use client'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <button onClick={() => setShow(!show)}>Toggle</button>
      {show && children} {/* 这里渲染的 children 依然可以是 Server Component */}
    </div>
  )
}
```

```tsx
// page.tsx (Server Component)
import ClientWrapper from './ClientWrapper'
import heavyServerComponent from './Heavy'

export default function Page() {
  return (
    <ClientWrapper>
      <HeavyServerComponent /> {/* ✅ 它可以保持 Server Component 的身份！ */}
    </ClientWrapper>
  )
}
```

## 5. 总结

1.  **Server First**: 除非不得已，不要写 `'use client'`。
2.  **Move Down**: 如果需要交互，把交互逻辑下沉到组件树的叶子节点，保持父组件（Page, Layout）是 Server 的。
3.  **Slot Pattern**: 如果 Client 组件需要包含 Server 组件，用 `children` 传递，不要直接 import。
