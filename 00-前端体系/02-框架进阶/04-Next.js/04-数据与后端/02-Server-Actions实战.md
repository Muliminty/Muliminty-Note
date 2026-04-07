# 02. Server Actions 实战：告别 API Routes

在 Next.js 14 之前，提交表单的流程通常是：
1. 创建一个 API Route (`pages/api/submit.ts`)。
2. 编写前端组件，使用 `useState` 管理 loading 状态。
3. `onSubmit` 中调用 `fetch('/api/submit')`。
4. 处理响应，手动刷新数据。

**Server Actions** 让这一切变成了历史。你可以直接在组件里调用一个 **运行在服务器端** 的函数。

---

## 1. 什么是 Server Action？

Server Action 是一个 **异步函数**，标记了 `'use server'`。它可以直接在 Server Component 中定义，也可以在单独的文件中定义供 Client Component 调用。

它类似于 **远程过程调用 (RPC)**，Next.js 自动帮你处理了 HTTP 请求的封装。

## 2. 基础用法：简单的表单提交

不需要 `useState`，不需要 `axios`。

```tsx
// app/page.tsx (Server Component)
import { revalidatePath } from 'next/cache'

// 1. 定义 Action (必须是 async)
async function createTodo(formData: FormData) {
  'use server' // ✨ 魔法指令：这个函数只在服务器运行

  const title = formData.get('title')
  
  // 直接操作数据库！
  await db.todo.create({ data: { title } })
  
  // ✨ 关键：告诉 Next.js 数据变了，重新生成当前页面的 HTML
  revalidatePath('/')
}

export default function Page() {
  return (
    <form action={createTodo}>
      <input name="title" type="text" className="border p-2" />
      <button type="submit">Add</button>
    </form>
  )
}
```

**发生了什么？**
1. 这是一个标准的 HTML Form，即使浏览器禁用了 JS 也能工作（渐进增强）。
2. 点击提交后，Next.js 自动发起一个 POST 请求。
3. 服务器执行 `createTodo`，写入数据库。
4. `revalidatePath` 触发，Next.js 重新渲染页面（包含最新的 Todo 列表），并把新 HTML 返回给浏览器。
5. 浏览器更新视图。

**全程没有写一行客户端 JS 代码！**

---

## 3. 进阶用法：状态反馈与错误处理 (useFormState)

在 Client Component 中使用 Server Actions，我们需要反馈（例如：保存成功提示、字段验证错误）。

这时需要配合 `useFormState` Hook (React DOM 库提供)。

**Step 1: 定义 Action (actions.ts)**
建议把 Action 放在单独文件，这样 Client 和 Server 组件都能用。

```ts
// app/actions.ts
'use server'

import { z } from 'zod' // 推荐用 zod 做验证

const schema = z.object({
  email: z.string().email({ message: '邮箱格式不正确' }),
})

export async function subscribe(prevState: any, formData: FormData) {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  const validated = schema.safeParse({
    email: formData.get('email'),
  })

  if (!validated.success) {
    return {
      message: '验证失败',
      errors: validated.error.flatten().fieldErrors,
    }
  }

  // 存入数据库...
  return { message: '订阅成功！' }
}
```

**Step 2: 组件调用 (SubscribeForm.tsx)**

```tsx
// app/SubscribeForm.tsx
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { subscribe } from './actions'

// 一个小组件，用来显示 Loading 状态
function SubmitButton() {
  const { pending } = useFormStatus() // ✨ 自动感知父级 form 的提交状态
  return (
    <button disabled={pending} type="submit" className="bg-blue-500 text-white p-2">
      {pending ? '提交中...' : '订阅'}
    </button>
  )
}

export default function SubscribeForm() {
  // state 包含 action 返回的值 (message, errors)
  const [state, formAction] = useFormState(subscribe, { message: '' })

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <input name="email" className="border p-2" placeholder="输入邮箱" />
        {/* 显示错误信息 */}
        {state.errors?.email && <p className="text-red-500">{state.errors.email[0]}</p>}
      </div>
      
      <SubmitButton />
      
      {/* 显示全局消息 */}
      <p>{state.message}</p>
    </form>
  )
}
```

---

## 4. 为什么企业级项目要用 Server Actions？

1.  **类型安全**：前后端共用 TS 类型，参数变了直接报错。
2.  **代码复用**：同一个 `createTodo` 函数，既可以给 `<form>` 用，也可以在 API Route 里调用，甚至在 CLI 脚本里调用。
3.  **安全性**：Server Actions 本质是 POST 请求，Next.js 自动生成了 CSRF Token 放在闭包里，天然防御 CSRF 攻击。
4.  **无瀑布流**：Action 执行完后，可以一次性返回更新后的 UI 数据，不需要客户端再次 Fetch。

## 5. 总结

- **简单的增删改查**：直接用 Server Component + `<form action={fn}>`。
- **需要交互反馈**：用 Client Component + `useFormState`。
- **别忘了 revalidate**：修改数据后，一定要调用 `revalidatePath` 或 `revalidateTag` 来刷新缓存。
