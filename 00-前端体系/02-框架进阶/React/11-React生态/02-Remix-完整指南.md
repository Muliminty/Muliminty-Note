# Remix 完整指南

> Remix 是一个全栈 Web 框架，专注于 Web 标准和用户体验

---

## 目录

1. [快速开始](#快速开始)
2. [核心概念](#核心概念)
3. [路由系统](#路由系统)
4. [数据加载](#数据加载)
5. [表单处理](#表单处理)
6. [错误处理](#错误处理)
7. [与 Next.js 对比](#与-nextjs-对比)

---

## 快速开始

### 创建项目

```bash
npx create-remix@latest my-app
```

### 项目结构

```
my-app/
├── app/
│   ├── routes/       # 路由文件
│   ├── components/   # 组件
│   └── root.tsx      # 根组件
├── public/          # 静态资源
└── remix.config.js  # Remix 配置
```

---

## 核心概念

### 基于 Web 标准

Remix 基于 Web 标准（Fetch API、FormData 等），不引入新的抽象。

### 嵌套路由

```tsx
// app/routes/posts.tsx
export default function Posts() {
  return (
    <div>
      <h1>Posts</h1>
      <Outlet /> {/* 子路由渲染位置 */}
    </div>
  )
}

// app/routes/posts.$slug.tsx
export default function Post() {
  return <div>Post Detail</div>
}
```

---

## 路由系统

### 文件系统路由

```
app/routes/
├── _index.tsx           # / (首页)
├── about.tsx            # /about
├── posts.tsx            # /posts
├── posts.$slug.tsx      # /posts/:slug
└── posts._index.tsx     # /posts (索引路由)
```

### 路由参数

```tsx
// app/routes/posts.$slug.tsx
import { useParams } from '@remix-run/react'

export default function Post() {
  const { slug } = useParams()
  return <div>Post: {slug}</div>
}
```

---

## 数据加载

### Loader 函数

```tsx
// app/routes/posts.tsx
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export async function loader() {
  const posts = await getPosts()
  return json({ posts })
}

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>()
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### 并行数据加载

```tsx
// Remix 自动并行加载所有 loader
export async function loader() {
  const [posts, users] = await Promise.all([
    getPosts(),
    getUsers(),
  ])
  return json({ posts, users })
}
```

---

## 表单处理

### Action 函数

```tsx
// app/routes/posts.new.tsx
import { redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'

export async function action({ request }) {
  const formData = await request.formData()
  const title = formData.get('title')
  
  await createPost({ title })
  return redirect('/posts')
}

export default function NewPost() {
  return (
    <Form method="post">
      <input name="title" />
      <button type="submit">Create</button>
    </Form>
  )
}
```

### 乐观更新

```tsx
import { useFetcher } from '@remix-run/react'

function LikeButton({ postId }) {
  const fetcher = useFetcher()
  
  return (
    <fetcher.Form method="post" action={`/posts/${postId}/like`}>
      <button type="submit">
        {fetcher.state === 'submitting' ? 'Liking...' : 'Like'}
      </button>
    </fetcher.Form>
  )
}
```

---

## 错误处理

### Error Boundary

```tsx
// app/routes/posts.tsx
export function ErrorBoundary({ error }) {
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  )
}
```

---

## 与 Next.js 对比

| 特性 | Remix | Next.js |
|------|-------|---------|
| 路由 | 嵌套路由 | 文件系统路由 |
| 数据加载 | Loader | getServerSideProps/getStaticProps |
| 表单处理 | Action | API 路由 |
| 渲染策略 | SSR + 客户端导航 | SSG/SSR/ISR/CSR |
| 哲学 | Web 标准 | React 生态 |

---

## 总结

Remix 的特点：

1. ✅ **Web 标准**：基于 Fetch API、FormData 等
2. ✅ **嵌套路由**：强大的路由嵌套能力
3. ✅ **数据加载**：Loader 函数自动并行加载
4. ✅ **表单处理**：Action 函数处理表单提交
5. ✅ **渐进增强**：即使 JavaScript 禁用也能工作

---

*最后更新：2025-12-12*
