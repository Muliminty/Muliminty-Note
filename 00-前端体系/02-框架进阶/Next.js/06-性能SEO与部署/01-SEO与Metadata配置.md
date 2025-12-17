# 01. SEO 与 Metadata 配置指南

Next.js 的核心优势之一就是 SEO (搜索引擎优化)。在 App Router 中，管理 SEO 变得非常简单且类型安全。

你不再需要手动在 `<head>` 里写 `<meta>` 标签，而是使用 **Metadata API**。

---

## 1. 静态 Metadata (Static)

对于所有页面通用的标题、描述，可以在 `layout.tsx` 或 `page.tsx` 中导出 `metadata` 对象。

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | 我的网站',
    default: '我的网站首页', // 当子页面没有 title 时显示这个
  },
  description: '这是一个用 Next.js 构建的高性能网站',
  keywords: ['Next.js', 'React', 'SEO'],
  authors: [{ name: 'Muliminty' }],
  icons: {
    icon: '/favicon.ico',
  },
}
```

在子页面中：

```tsx
// app/about/page.tsx
export const metadata: Metadata = {
  title: '关于我们', // 最终显示：关于我们 | 我的网站
}
```

---

## 2. 动态 Metadata (Dynamic)

对于博客文章详情页，标题是根据文章内容动态生成的。你需要导出 `generateMetadata` 函数。

```tsx
// app/blog/[id]/page.tsx
import { Metadata } from 'next'

type Props = {
  params: { id: string }
}

// ✨ 这个函数会在页面渲染前执行
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 1. 获取数据 (Next.js 会自动对 fetch 进行去重，不用担心和页面组件重复请求)
  const product = await fetch(`https://api.example.com/products/${params.id}`).then((res) => res.json())

  return {
    title: product.name,
    description: product.summary,
    openGraph: {
      images: [product.coverImage], // 社交媒体分享图
    },
  }
}

export default function Page({ params }: Props) {
  // ... 页面渲染逻辑
}
```

---

## 3. Open Graph (社交媒体卡片)

当你的链接被分享到微信、Twitter、Slack 时，显示的预览卡片就是 Open Graph (OG) 协议。

Next.js 提供了极其强大的 `ImageResponse` API，可以**用代码画图**，自动生成动态封面图！

**步骤**：
1. 在目录下新建 `opengraph-image.tsx`。
2. 编写代码：

```tsx
// app/blog/[id]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export default async function Image({ params }: { params: { id: string } }) {
  const post = await fetchPost(params.id)
 
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        文章标题: {post.title}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

这样，每篇文章都有了独一无二的封面图，大大提高点击率。

---

## 4. Sitemap (站点地图)

你需要告诉 Google 你的网站有哪些页面。

新建 `app/sitemap.ts`：

```ts
import { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. 获取动态路由
  const posts = await getAllPosts()
  
  const postUrls = posts.map((post) => ({
    url: `https://acme.com/blog/${post.slug}`,
    lastModified: post.date,
  }))

  // 2. 合并静态路由
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
    },
    ...postUrls,
  ]
}
```

访问 `/sitemap.xml`，Next.js 会自动生成标准的 XML 文件。

---

## 5. Robots.txt

新建 `app/robots.ts`：

```ts
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

---

## 6. 总结

1.  **静态页面**：直接导出 `metadata` 对象。
2.  **动态页面**：使用 `generateMetadata` 异步函数。
3.  **社交分享**：使用 `opengraph-image.tsx` 动态生成图片。
4.  **收录优化**：必须配置 `sitemap.ts` 和 `robots.ts`。

做好这些，你的 Next.js 应用在 SEO 方面就已经击败了 90% 的网站。
