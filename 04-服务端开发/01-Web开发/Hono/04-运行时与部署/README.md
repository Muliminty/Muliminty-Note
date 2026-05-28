---
title: "Hono · 运行时与部署 目录说明"
date: "2026-05-28"
lastModified: "2026-05-28"
tags: ["Hono", "运行时", "部署", "目录说明"]
publish: false
toc: true
---

# Hono · 运行时与部署

本目录承载 Hono 在**不同 JavaScript 运行时**下的适配差异，以及对应的部署方案。

## 目录角色

- 解释「同一套代码如何跑在不同运行时」的差异点
- 每篇正文聚焦**一个运行时或部署目标**
- 不重复讲核心机制（属于 [../03-核心机制/](../03-核心机制/)）

## 规划文件

```
04-运行时与部署/
├── README.md                            ← 你在这里
├── 01-运行时适配总览.md                 ← Web 标准 vs 各运行时差异
├── 02-Cloudflare Workers 部署.md        ← wrangler、Bindings、KV/D1/R2
├── 03-Node.js 适配与部署.md             ← @hono/node-server、PM2、Docker
├── 04-Deno 与 Deno Deploy.md            ← Deno 原生支持
├── 05-Bun 运行时与部署.md               ← Bun.serve 与性能基线
├── 06-Vercel Edge Functions.md          ← Edge Runtime 限制与最佳实践
├── 07-AWS Lambda 与 API Gateway.md      ← Lambda Adapter
└── 08-冷启动与 Bundle 优化.md           ← tree-shaking、hono/tiny 预设
```

## 维护说明

- 新增「运行时适配」类内容 → 使用**实战应用类模板**
- 跨运行时通用最佳实践 → 写入 [../05-高阶实战/](../05-高阶实战/)
- 部署踩坑 → 写入 [../07-常见问题与排错/](../07-常见问题与排错/)
