# Next.js 全栈架构师体系 (App Router 版)

> 🎯 **目标**：从零基础到能够独立设计并开发高性能、可扩展的企业级全栈应用。
> 
> **核心原则**：
> 1.  **Server-First**：默认服务端组件，最大限度减少客户端 JS。
> 2.  **Type-Safe**：全链路 TypeScript 类型安全。
> 3.  **Performance**：极致的 Core Web Vitals 性能指标。

本体系基于 **Next.js 14/15 (App Router)**。

## 📚 知识体系导航

### 第一阶段：基石与核心 (已生成)
> 掌握框架的基本运作原理，通过“渲染模式”理解 Next.js 的本质。
- [x] 01-基础入门
    - 01-Nextjs简介与环境搭建
    - 02-项目配置详解 (`next.config.js`, TypeScript, ESLint)
    - **03-环境变量管理** (`.env` 与 `NEXT_PUBLIC_` 的安全边界) (✨ 补充)
- [x] 02-核心机制
    - 01-渲染模式详解(SSR-SSG-ISR)
    - 02-Edge Runtime vs Node.js Runtime (选修)

### 第二阶段：App Router 架构体系 (企业级核心)
> App Router 不仅仅是路由，更是一种全新的组件架构思维。
- [x] [01-App-Router架构解析](03-App-Router体系/01-App-Router架构解析.md) (路由、布局基础)
- [x] [02-Server组件与Client组件深度解析](03-App-Router体系/02-Server组件与Client组件.md) (必读)
- [x] [03-错误处理与Loading状态](03-App-Router体系/03-错误处理与Loading状态.md) (Streaming, Error Boundary)
- [ ] 04-高级路由模式
    - 平行路由 (Parallel Routes) `@folder`：实现复杂的仪表盘布局。
    - 拦截路由 (Intercepting Routes) `(..)`：实现 Instagram 式的弹窗路由。
    - **国际化 (i18n)**：基于 Middleware 的路由重写策略。 (✨ 补充)

### 第三阶段：数据流与后端 (全栈能力)
> 抛弃传统的 `useEffect` 取数，拥抱 Server Actions，但也要掌握标准 API。
- [ ] **01-新一代数据获取模式**
    - `fetch` 的自动去重与缓存 (`Request Memoization`)。
    - 串行获取 vs 并行获取 (`Promise.all`) 的瀑布流问题。
- [x] [02-Server Actions 实战](04-数据与后端/02-Server-Actions实战.md)
- [x] [03-Route Handlers 开发指南](04-数据与后端/03-Route-Handlers开发指南.md) (标准 API, Webhooks)
- [x] [04-缓存机制深度解析](04-数据与后端/04-缓存机制深度解析.md) (Request Memoization, Data Cache)
- [ ] **05-数据库集成** (✨ 补充)
    - Serverless 环境下的连接池问题 (Connection Pooling)。
    - Prisma / Drizzle ORM 的最佳实践 (单例模式)。

### 第四阶段：工程化与最佳实践 (企业级规范)
> 只有代码跑通是不够的，我们需要可维护性。
- [x] [01-企业级目录结构设计](05-工程化与最佳实践/01-企业级目录结构设计.md)
- [ ] 02-认证与授权 (Auth.js v5 / Clerk)
    - Middleware 路由守卫。
    - Session 管理与 Token 刷新。
- [ ] **03-测试策略 (Testing)** (✨ 补充)
    - 单元测试 (Vitest + React Testing Library)。
    - 端到端测试 (Playwright)。
- [ ] 04-状态管理
    - URL 是最好的状态管理器 (`searchParams`)。
    - Zustand 在 Next.js 中的正确用法 (避免 SSR 水合不一致)。

### 第五阶段：性能、SEO 与 部署
- [x] [01-SEO 与 Metadata 配置指南](06-性能SEO与部署/01-SEO与Metadata配置.md) (Metadata API, Sitemap, OpenGraph)
- [ ] 02-性能优化 (Image 组件, Font 优化, Script 策略, Bundle Analyzer)
- [ ] **03-监控与日志** (✨ 补充)
    - Sentry 错误追踪集成。
    - OpenTelemetry 链路追踪。
- [ ] 04-部署实战 (Vercel 部署, Docker 容器化部署)

---

## 🛠 企业级开发心法

1.  **减少客户端 JS**：能用 Server Component 解决的，绝不引入 `useState` 和 `useEffect`。
2.  **利用 URL**：把搜索、分页、筛选状态放在 URL 参数里，而不是 React State 里（为了分享和刷新不丢失）。
3.  **流式渲染 (Streaming)**：利用 `<Suspense>` 让用户先看到骨架屏，而不是白屏等待接口。
4.  **防御性编程**：不要信任客户端传来的任何数据，Server Actions 必须用 Zod 校验。
