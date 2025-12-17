# 03. 错误处理与 Loading 状态

Next.js App Router 引入了一套基于文件系统的 UI 状态管理机制。你不再需要手动写 `if (loading) return <Spinner />`。

## 1. Loading UI (流式渲染)

在 `page.tsx` 同级目录下创建一个 `loading.tsx`。

```text
app/dashboard/
├── page.tsx
└── loading.tsx  <-- 自动生效
```

### 工作原理
Next.js 会自动用 `<Suspense>` 包裹你的页面。
当 `page.tsx` 还在服务器端请求数据时，浏览器会先立即显示 `loading.tsx` 的内容（通常是骨架屏 Skeleton）。

**优势**：
- **即时响应**：用户点击链接立刻有反应，不会觉得自己没点到。
- **流式传输 (Streaming)**：一旦数据准备好，Next.js 会把真实内容通过 HTTP Stream 推送到浏览器，替换掉 Loading 界面。

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
    </div>
  )
}
```

---

## 2. Error Handling (错误边界)

在 `page.tsx` 同级目录下创建一个 `error.tsx`。

```text
app/dashboard/
├── page.tsx
└── error.tsx    <-- 自动生效
```

### 工作原理
Next.js 会自动用 React Error Boundary 包裹你的页面。如果 `page.tsx` (或者它的子组件) 抛出了异常，`error.tsx` 会替代页面显示，而**不会导致整个网站崩溃**。

### 客户端组件要求
⚠️ `error.tsx` **必须** 是 Client Component (`'use client'`)。

```tsx
// app/dashboard/error.tsx
'use client' // 必须！

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="p-4 border border-red-500 bg-red-50 rounded">
      <h2 className="text-red-700">出错了！</h2>
      <p className="text-sm text-red-500">{error.message}</p>
      
      {/* 尝试恢复：重新渲染页面组件 */}
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        重试
      </button>
    </div>
  )
}
```

---

## 3. Not Found (404 处理)

### 全局 404
在 `app/not-found.tsx` 定义全局 404 页面。

### 主动触发 404
在页面或组件中，如果数据不存在，可以主动调用 `notFound()` 函数。

```tsx
// app/blog/[id]/page.tsx
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'

export default async function Post({ params }: { params: { id: string } }) {
  const post = await db.post.findUnique({ where: { id: params.id } })

  if (!post) {
    notFound() // ✨ 这会立即停止渲染，并显示离这最近的 not-found.tsx
  }

  return <h1>{post.title}</h1>
}
```

---

## 4. 总结：文件系统层级

这些特殊文件是可以嵌套的。

`app/dashboard/settings/error.tsx` 只会捕获 `/dashboard/settings` 页面内的错误。如果它没处理，错误会冒泡到 `app/dashboard/error.tsx`，最后到 `app/error.tsx`。

这种**颗粒化的错误控制**能保证：即使侧边栏的小组件崩了，用户依然可以用主界面的功能。
