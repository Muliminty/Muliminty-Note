---
title: "Hono · 生态与扩展 目录说明"
date: "2026-05-28"
lastModified: "2026-05-28"
tags: ["Hono", "生态", "中间件", "目录说明"]
publish: false
toc: true
---

# Hono · 生态与扩展

本目录承载 Hono 周边的**官方中间件、第三方插件与生态集成**说明。

## 目录角色

- 介绍生态库的**定位、能力边界与选型对比**
- 不取代实战教程（深度集成方案写入 [../05-高阶实战/](../05-高阶实战/)）
- 每篇正文聚焦**一个库或一组同类库**

## 规划文件

```
06-生态与扩展/
├── README.md                              ← 你在这里
├── 01-官方中间件速查.md                   ← cors、logger、jwt、cache、compress
├── 02-Helper 模块速查.md                  ← cookie、html、streaming、testing
├── 03-第三方中间件生态.md                 ← honojs/middleware 仓库导览
├── 04-与 OpenAPI / Swagger 集成.md        ← @hono/zod-openapi、scalar
├── 05-与 ORM 集成（Drizzle/Prisma）.md   ← 多运行时 ORM 选型
└── 06-与前端框架协作.md                   ← Vite、React、Vue、Astro 集成
```

## 维护说明

- 仅做**生态介绍** → 使用概念理解类模板
- 涉及**完整集成方案** → 写入 [../05-高阶实战/](../05-高阶实战/)
- 涉及**版本兼容/踩坑** → 写入 [../07-常见问题与排错/](../07-常见问题与排错/)
