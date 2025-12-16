# 03. Route Handlers 开发指南 (标准 API)

在 App Router 中，API 路由被称为 **Route Handlers**。它们定义在 `route.ts` 文件中，可以放在 `app` 目录下的任何位置（通常习惯放在 `app/api/` 下）。

它相当于 Next.js 内置了一个轻量级的后端框架（类似 Express/Koa，但更符合 Web 标准）。

---

## 1. 基础语法

### 文件约定
在 `app` 目录下的文件夹中创建 `route.ts`，该文件夹路径就是 API 路径。

例如：`app/api/users/route.ts` 对应 URL `GET /api/users`。

### 支持的方法
你需要导出以 **HTTP 方法** 命名的异步函数：`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`。

```ts
// app/api/hello/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Hello World' })
}

export async function POST(request: Request) {
  const data = await request.json()
  return NextResponse.json({ received: data })
}
```

---

## 2. 获取请求数据 (Request)

Route Handlers 使用标准的 Web [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) API。

### 1. 获取 URL 参数 (Query Params)

```ts
// GET /api/search?q=nextjs&page=1
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') // 'nextjs'
  const page = searchParams.get('page') // '1'
  
  return NextResponse.json({ query, page })
}
```

### 2. 获取动态路由参数 (Dynamic Params)

假设文件路径是 `app/api/products/[id]/route.ts`。

```ts
// GET /api/products/123
// 第二个参数 context 包含 params
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id // '123'
  return NextResponse.json({ productId: id })
}
```

### 3. 获取 Body (POST/PUT)

```ts
export async function POST(request: Request) {
  // 解析 JSON
  const json = await request.json()
  
  // 或者解析 FormData (上传文件时常用)
  // const formData = await request.formData()
  
  return NextResponse.json({ success: true })
}
```

### 4. 获取 Headers 和 Cookies

```ts
import { headers, cookies } from 'next/headers'

export async function GET(request: Request) {
  // 方法 A: 使用 Web API
  const token1 = request.headers.get('Authorization')
  
  // 方法 B: 使用 Next.js 辅助函数 (推荐，更方便)
  const headersList = headers()
  const token2 = headersList.get('Authorization')
  
  const cookieStore = cookies()
  const theme = cookieStore.get('theme')

  return NextResponse.json({ token: token2, theme })
}
```

---

## 3. 响应控制 (Response)

使用 `NextResponse` 来构建响应，它扩展了标准的 `Response` API。

### 1. 返回 JSON
```ts
return NextResponse.json({ data: 'ok' }, { status: 200 })
```

### 2. 重定向
```ts
return NextResponse.redirect(new URL('/new-url', request.url))
```

### 3. 设置 Cookie
```ts
const response = NextResponse.json({ message: 'Logged in' })
response.cookies.set('token', 'xyz-123', { httpOnly: true })
return response
```

### 4. CORS (跨域处理)
如果你开发的 API 要给第三方网站调用，需要手动设置 CORS 头。

```ts
export async function GET(request: Request) {
  return NextResponse.json(
    { data: 'Public API' },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  )
}

// 处理预检请求
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

---

## 4. 关键决策：Route Handlers vs Server Actions

这是面试和架构设计中的高频问题。

| 场景 | 推荐方案 | 原因 |
| :--- | :--- | :--- |
| **表单提交 (Form Submit)** | ✅ **Server Actions** | 自动处理 Loading 状态，无需手动 fetch，渐进增强，类型安全。 |
| **按钮操作 (如点赞)** | ✅ **Server Actions** | 代码简洁，直接调用函数，无需定义 API 路径。 |
| **Webhooks 回调** | ✅ **Route Handlers** | 这是必须要给第三方服务提供一个固定 URL (如 `/api/stripe-webhook`)。 |
| **对外公共 API** | ✅ **Route Handlers** | 需要 RESTful 规范，供非 Next.js 客户端调用。 |
| **二进制文件生成** | ✅ **Route Handlers** | 如动态生成二维码、PDF、Excel 下载。 |

---

## 5. 企业级实战：Webhook 处理示例

处理 Webhook 时，通常需要校验签名（Verify Signature）以确保安全性。由于 Next.js 默认解析 Body，有时我们需要原始的 Raw Body 来验签。

```ts
// app/api/webhook/stripe/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import stripe from '@/lib/stripe' // 假设的 stripe 实例

export async function POST(request: Request) {
  // 1. 获取请求体文本 (验签需要原始文本，不能用 request.json())
  const body = await request.text() 
  
  // 2. 获取签名头
  const signature = headers().get('Stripe-Signature') as string

  let event

  try {
    // 3. 验证签名
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  // 4. 处理业务逻辑
  if (event.type === 'checkout.session.completed') {
    // 更新数据库订单状态...
    console.log('Payment successful!')
  }

  return NextResponse.json({ received: true })
}
```

## 6. 缓存行为 (Caching)

**默认情况下，GET 请求会被缓存！**

如果你的 API 依赖于动态数据（如 `request.cookies`, `request.headers`），Next.js 会自动切换为动态模式（Dynamic）。

但如果是单纯的数据库查询，可能会被缓存。

**强制动态模式 (Force Dynamic):**
如果你的 API 总是返回旧数据，可以在文件顶部添加这行配置：

```ts
// route.ts
export const dynamic = 'force-dynamic' // 默认为 'auto'

export async function GET(request: Request) {
  // ...
}
```

或者使用 `revalidate` 配置 ISR：

```ts
// 每 60 秒缓存一次
export const revalidate = 60
```
