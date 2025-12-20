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
> 掌握框架的基本运作原理，通过"渲染模式"理解 Next.js 的本质。
- [x] 01-基础入门
    - [x] [01-Nextjs简介与环境搭建](01-基础入门/01-Nextjs简介与环境搭建.md) - 环境搭建、项目结构、开发工具
    - [x] [02-项目配置详解](01-基础入门/02-项目配置详解.md) - `next.config.js`, TypeScript, ESLint 配置
    - [x] [03-环境变量管理](01-基础入门/03-环境变量管理.md) - `.env` 与 `NEXT_PUBLIC_` 的安全边界
    - [x] [04-第一个页面实战](01-基础入门/04-第一个页面实战.md) - 多页面案例、文件系统路由
    - [x] [05-路由系统基础](01-基础入门/05-路由系统基础.md) - 动态路由、查询参数、路由组
    - [x] [06-组件开发基础](01-基础入门/06-组件开发基础.md) - Server/Client 组件、组件实战
    - [x] [07-样式方案实战](01-基础入门/07-样式方案实战.md) - Tailwind CSS、CSS Modules
    - [x] [08-静态资源管理](01-基础入门/08-静态资源管理.md) - 图片优化、字体、public 目录
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
- [x] [05-数据库集成与ORM](04-数据与后端/05-数据库集成指南.md) (Connection Pooling, Prisma/Drizzle)

### 第四阶段：工程化与最佳实践 (企业级规范)
> 只有代码跑通是不够的，我们需要可维护性。
- [x] [01-企业级目录结构设计](05-工程化与最佳实践/01-企业级目录结构设计.md)
- [x] [02-中间件与路由守卫](05-工程化与最佳实践/02-中间件与路由守卫.md) (Middleware 核心, Headers 注入)
- [ ] 03-认证与授权 (Auth.js v5 / Clerk)
    - Session 管理与 Token 刷新。
    - 结合 Middleware 实现完整鉴权。
- [ ] **04-测试策略 (Testing)** (✨ 补充)
    - 单元测试 (Vitest + React Testing Library)。
    - 端到端测试 (Playwright)。
- [ ] 05-状态管理
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

---

## 🚀 项目实战指南

学习完整个体系后，你可以根据笔记独立开发以下类型的成熟项目：

### 推荐项目类型

#### 1. 全栈博客系统
**技术栈**：
- Next.js App Router
- Prisma + PostgreSQL
- Server Actions
- Markdown/MDX 支持
- 评论系统

**核心功能**：
- 文章 CRUD（创建、读取、更新、删除）
- 分类和标签系统
- 搜索功能
- RSS 订阅
- SEO 优化

**学习要点**：
- Server Components 数据获取
- 动态路由 (`/blog/[slug]`)
- 文件上传（封面图）
- 缓存策略（ISR）

#### 2. 电商平台
**技术栈**：
- Next.js App Router
- Stripe 支付集成
- Prisma + PostgreSQL
- Server Actions
- 图片优化

**核心功能**：
- 商品展示和搜索
- 购物车功能
- 用户认证
- 订单管理
- 支付集成

**学习要点**：
- 查询参数筛选 (`/products?category=electronics`)
- 客户端状态管理（购物车）
- 服务端表单处理（订单）
- 中间件路由守卫

#### 3. 任务管理应用（类似 Trello）
**技术栈**：
- Next.js App Router
- Prisma + PostgreSQL
- Server Actions
- 实时更新（可选：WebSocket）

**核心功能**：
- 看板管理
- 任务 CRUD
- 拖拽排序
- 团队协作
- 权限管理

**学习要点**：
- 嵌套布局 (`/dashboard/[boardId]`)
- 客户端交互（拖拽）
- 服务端数据验证
- 错误边界处理

#### 4. 社交媒体平台（简化版）
**技术栈**：
- Next.js App Router
- Prisma + PostgreSQL
- Server Actions
- 图片上传（Cloudinary）
- 实时通知

**核心功能**：
- 用户注册/登录
- 发帖和评论
- 关注系统
- 动态流
- 个人资料页

**学习要点**：
- 认证与授权
- 文件上传处理
- 无限滚动
- 流式渲染（Suspense）

### 项目开发流程

1. **需求分析**：明确功能需求和技术选型
2. **数据库设计**：使用 Prisma 设计数据模型
3. **路由规划**：根据功能设计文件系统路由
4. **组件拆分**：Server Component 获取数据，Client Component 处理交互
5. **API 设计**：使用 Server Actions 或 Route Handlers
6. **样式实现**：使用 Tailwind CSS 构建 UI
7. **性能优化**：图片优化、缓存策略、代码分割
8. **测试部署**：本地测试、Vercel 部署

### 学习路径建议

1. **基础阶段**（01-基础入门）：完成个人作品集网站
2. **进阶阶段**（02-核心机制 + 03-App-Router）：完成博客系统
3. **全栈阶段**（04-数据与后端）：完成电商平台
4. **企业级阶段**（05-工程化 + 06-性能SEO）：优化并部署项目

### 项目检查清单

完成项目后，确保：
- ✅ 所有页面都有合适的 Metadata（SEO）
- ✅ 图片使用 Next.js Image 组件优化
- ✅ 错误处理和 Loading 状态完善
- ✅ 响应式设计（移动端适配）
- ✅ 类型安全（TypeScript 无错误）
- ✅ 代码规范（ESLint 通过）
- ✅ 性能优化（Lighthouse 评分 > 90）
- ✅ 部署成功（Vercel 或其他平台）

---

## 📖 学习建议

1. **循序渐进**：按照章节顺序学习，不要跳跃
2. **动手实践**：每章都要完成相应的练习
3. **查阅文档**：遇到问题查阅 [Next.js 官方文档](https://nextjs.org/docs)
4. **项目驱动**：边学边做项目，理论结合实践
5. **社区交流**：加入 Next.js 社区，分享学习心得

祝你学习愉快！🎉
