---
title: "Hono · 高阶实战 目录说明"
date: "2026-05-28"
lastModified: "2026-05-28"
tags: ["Hono", "高阶", "实战", "目录说明"]
publish: false
toc: true
---

# Hono · 高阶实战

本目录承载 Hono 的**进阶能力与工程化实践**：RPC、JSX/SSR、测试、性能调优、可观测性等。

## 目录角色

- 面向已经掌握核心机制的读者
- 每篇正文是一份**可复用的工程方案**，使用实战应用类模板
- 不重复入门内容（属于 [../02-快速上手/](../02-快速上手/)）

## 规划文件

```
05-高阶实战/
├── README.md                          ← 你在这里
├── 01-类型安全 RPC 客户端.md          ← hono/client + 类型推断链路
├── 02-JSX 与服务端渲染.md             ← hono/jsx、流式渲染
├── 03-WebSocket 与 SSE.md             ← 长连接与服务端事件
├── 04-鉴权方案（JWT/Session）.md      ← @hono/jwt、Cookie Session
├── 05-与 Zod / Drizzle 集成.md        ← 端到端类型链路
├── 06-单元测试与集成测试.md           ← app.request、vitest 模式
├── 07-性能调优与基准测试.md           ← RegExpRouter、tiny 预设
└── 08-可观测性（日志/Tracing）.md     ← logger、OpenTelemetry
```

## 维护说明

- 新增工程方案 → 使用**实战应用类模板**
- 涉及生态库集成 → 优先写在本目录；纯介绍性内容写入 [../06-生态与扩展/](../06-生态与扩展/)
- 调优过程中的踩坑 → 写入 [../07-常见问题与排错/](../07-常见问题与排错/)
