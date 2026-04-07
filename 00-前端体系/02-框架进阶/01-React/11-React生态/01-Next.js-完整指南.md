# Next.js 完整指南

> Next.js 是 React 的全栈框架，提供 SSR、SSG、API 路由等功能

---

## 目录

1. [快速开始](#快速开始)
2. [核心概念](#核心概念)
3. [路由系统](#路由系统)
4. [数据获取](#数据获取)
5. [渲染策略](#渲染策略)
6. [API 路由](#api-路由)
7. [优化特性](#优化特性)
8. [部署](#部署)

---

## 快速开始

### 创建项目

```bash
# 使用 create-next-app
npx create-next-app@latest my-app

# 使用 TypeScript
npx create-next-app@latest my-app --typescript

# 使用 Tailwind CSS
npx create-next-app@latest my-app --tailwind
```

### 项目结构

```
my-app/
├── app/              # App Router (Next.js 13+)
│   ├── layout.tsx
│   ├── page.tsx
│   └── about/
│       └── page.tsx
├── pages/            # Pages Router (传统方式)
│   ├── _app.tsx
│   ├── index.tsx
│   └── about.tsx
├── public/           # 静态资源
├── components/       # React 组件
└── next.config.js   # Next.js 配置
```

---

## 核心概念

### App Router vs Pages Router

#### App Router (Next.js 13+)

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// app/page.tsx
export default function Home() {
  return <h1>Home Page</h1>
}
```

#### Pages Router (传统方式)

```tsx
// pages/_app.tsx
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}

// pages/index.tsx
export default function Home() {
  return <h1>Home Page</h1>
}
```

---

## 路由系统

### App Router 路由

#### 文件系统路由

```
app/
├── page.tsx          # / (首页)
├── about/
│   └── page.tsx      # /about
├── blog/
│   ├── page.tsx      # /blog
│   └── [slug]/
│       └── page.tsx  # /blog/:slug
└── dashboard/
    ├── layout.tsx    # 布局
    ├── page.tsx      # /dashboard
    └── settings/
        └── page.tsx  # /dashboard/settings
```

#### 动态路由

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <div>Post: {params.slug}</div>
}

// app/shop/[...slug]/page.tsx (捕获所有路由)
export default function Shop({ params }: { params: { slug: string[] } }) {
  return <div>Shop: {params.slug.join('/')}</div>
}
```

#### 路由组

```tsx
// app/(marketing)/about/page.tsx
// app/(marketing)/contact/page.tsx
// 括号中的路由组不会影响 URL 路径
```

### Pages Router 路由

```tsx
// pages/index.tsx → /
// pages/about.tsx → /about
// pages/blog/[slug].tsx → /blog/:slug
// pages/shop/[...slug].tsx → /shop/*
```

---

## 数据获取

### Server Components (App Router)

```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### getServerSideProps (Pages Router)

```tsx
// pages/posts.tsx
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  
  return {
    props: {
      posts,
    },
  }
}

export default function Posts({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### getStaticProps (SSG)

```tsx
// pages/posts.tsx
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  
  return {
    props: {
      posts,
    },
    revalidate: 60, // ISR: 每 60 秒重新生成
  }
}
```

---

## 渲染策略

### 1. 静态生成 (SSG)

```tsx
// 构建时生成静态页面
export async function getStaticProps() {
  return {
    props: { data: 'static' },
  }
}
```

### 2. 服务端渲染 (SSR)

```tsx
// 每次请求时在服务端渲染
export async function getServerSideProps() {
  return {
    props: { data: 'server' },
  }
}
```

### 3. 增量静态再生 (ISR)

```tsx
// 静态生成 + 定时重新生成
export async function getStaticProps() {
  return {
    props: { data: 'isr' },
    revalidate: 60, // 60 秒后重新生成
  }
}
```

### 4. 客户端渲染 (CSR)

```tsx
'use client'
import { useEffect, useState } from 'react'

export default function ClientComponent() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])
  
  return <div>{data}</div>
}
```

---

## API 路由

### App Router API 路由

```tsx
// app/api/users/route.ts
export async function GET(request: Request) {
  const users = await getUsers()
  return Response.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  const user = await createUser(body)
  return Response.json(user)
}
```

### Pages Router API 路由

```tsx
// pages/api/users.ts
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ users: [] })
  } else if (req.method === 'POST') {
    res.status(201).json({ user: {} })
  }
}
```

---

## 优化特性

### 图片优化

```tsx
import Image from 'next/image'

export default function MyImage() {
  return (
    <Image
      src="/image.jpg"
      alt="Description"
      width={500}
      height={300}
      priority // 优先加载
      placeholder="blur" // 模糊占位符
    />
  )
}
```

### 字体优化

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

### 脚本优化

```tsx
import Script from 'next/script'

export default function MyPage() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        strategy="afterInteractive" // 页面交互后加载
      />
    </>
  )
}
```

---

## 部署

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 其他平台

```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

---

## 最佳实践

### 1. 使用 Server Components 默认

```tsx
// ✅ 默认使用 Server Component
export default function Page() {
  return <div>Server Component</div>
}

// 只在需要时使用 Client Component
'use client'
export default function InteractiveComponent() {
  const [state, setState] = useState()
  return <div>Client Component</div>
}
```

### 2. 数据获取在服务端

```tsx
// ✅ 在 Server Component 中获取数据
async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

### 3. 使用 TypeScript

```tsx
// 类型安全的路由参数
export default function Page({ 
  params 
}: { 
  params: { slug: string } 
}) {
  return <div>{params.slug}</div>
}
```

---

## 总结

Next.js 的核心特性：

1. ✅ **全栈框架**：前端 + API 路由
2. ✅ **多种渲染策略**：SSG、SSR、ISR、CSR
3. ✅ **文件系统路由**：基于文件结构的路由
4. ✅ **自动优化**：图片、字体、脚本优化
5. ✅ **TypeScript 支持**：完整的类型支持

---

*最后更新：2025-12-12*
