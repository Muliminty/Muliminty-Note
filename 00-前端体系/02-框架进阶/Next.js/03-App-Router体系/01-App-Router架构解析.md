# 01. App Router 架构解析

Next.js 13.4 正式引入了 **App Router**，这是对原有 Pages Router 的一次颠覆性重构。

## 1. 为什么要有 App Router？

旧的路由系统（Pages Router）存在一些痛点：
1. **布局嵌套难**：想给 `/dashboard` 和 `/dashboard/settings` 用同一个侧边栏，但 `/login` 不用，配置起来很麻烦。
2. **数据获取冗余**：布局组件很难直接获取数据。
3. **性能瓶颈**：整个页面所有的 JS 都会被发送到浏览器（Hydration 负担重）。

App Router 引入了 **文件系统路由** + **React Server Components (RSC)** 来解决这些问题。

## 2. 目录即路由 (FileSystem Routing)

在 `src/app` 目录下，文件夹的名字决定了 URL 的路径。

### 基础规则

| 文件夹结构 | URL 路径 | 说明 |
| :--- | :--- | :--- |
| `app/page.tsx` | `/` | 首页 |
| `app/about/page.tsx` | `/about` | 关于页 |
| `app/blog/list/page.tsx` | `/blog/list` | 博客列表页 |

> ⚠️ **注意**：只有包含 `page.tsx` 的文件夹不仅可以被访问。如果一个文件夹里没有 `page.tsx`，它就只是一个普通的文件夹（可以放组件、工具函数等），不会生成路由。

### 特殊文件约定

Next.js 规定了一些特殊文件，放在路由文件夹里会有神奇的效果：

- `page.tsx`: **页面 UI** (必须有)。
- `layout.tsx`: **布局 UI** (共享 UI，如导航栏、页脚)。
- `loading.tsx`: **加载 UI** (数据加载时显示的骨架屏)。
- `error.tsx`: **错误 UI** (页面报错时显示的降级界面)。
- `not-found.tsx`: **404 UI** (路径不存在时显示)。

---

## 3. 嵌套布局 (Nested Layouts) - App Router 的杀手锏

这是 App Router 最爽的功能。

假设我们要实现如下结构：
- **全站**：都有顶部导航栏 (Navbar)。
- **后台 (`/dashboard`)**：除了 Navbar，左侧还有一个侧边栏 (Sidebar)。

**目录结构设计**：

```text
src/app/
├── layout.tsx      (1. 根布局：包含 Navbar)
├── page.tsx        (首页)
├── dashboard/
│   ├── layout.tsx  (2. 后台布局：包含 Sidebar)
│   ├── page.tsx    (后台主页)
│   └── settings/
│       └── page.tsx (设置页)
```

**代码实现逻辑**：

**1. 根布局 (`src/app/layout.tsx`)**
```tsx
// 所有的页面都会被在这个布局里渲染
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar /> {/* 全站都有导航栏 */}
        {children} {/* 这里插入子页面的内容 */}
      </body>
    </html>
  )
}
```

**2. 后台布局 (`src/app/dashboard/layout.tsx`)**
```tsx
// 只有 /dashboard 开头的路径会应用这个布局
// 这里的 children 是指 /dashboard 下的具体页面
export default function DashboardLayout({ children }) {
  return (
    <section className="flex">
      <Sidebar /> {/* 只有后台有侧边栏 */}
      <main>{children}</main>
    </section>
  )
}
```

**渲染结果**：
当你访问 `/dashboard/settings` 时，Next.js 会像俄罗斯套娃一样组装页面：

```jsx
<RootLayout>
  <Navbar />
  <DashboardLayout>
    <Sidebar />
    <SettingsPage /> {/* 具体的页面内容 */}
  </DashboardLayout>
</RootLayout>
```

这种架构让**状态保持**变得非常简单。当你从 `/dashboard` 切换到 `/dashboard/settings` 时，`RootLayout` 和 `DashboardLayout` 不会重新渲染，只有最里面的 `Page` 变了。这意味着：**侧边栏的滚动位置、折叠状态都不会丢失！**

## 4. 动态路由 (Dynamic Routes)

如果你的博客有 100 篇文章，不可能建 100 个文件夹。你需要动态路由。

**语法**：用方括号 `[]` 包裹文件夹名。

**结构**：`src/app/blog/[id]/page.tsx`

**代码示例**：

```tsx
// src/app/blog/[id]/page.tsx

// params 是 Next.js 自动传入的参数
// 注意：这是一个异步组件 (async)，可以直接获取数据
export default async function BlogDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  
  return (
    <div>
      <h1>文章 ID: {id}</h1>
      <p>这里应该根据 ID 去数据库查文章内容...</p>
    </div>
  )
}
```

访问 `/blog/123`，页面上就会显示 "文章 ID: 123"。

---

## 5. 总结

App Router 的核心思想：
1. **文件夹即路由**。
2. **`page.tsx` 是终点，`layout.tsx` 是容器**。
3. **布局是可以嵌套的**，这极大地优化了代码复用和用户体验。
4. **`[]` 实现动态路由**，轻松处理海量页面。

在下一节中，我们将探讨 App Router 中另一个颠覆性的概念：**Server Component (服务端组件) 与 Client Component (客户端组件)**。
