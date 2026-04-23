---
title: "REST-GraphQL-Streaming"
date: "2026-04-23"
lastModified: "2026-04-23"
tags: ["前端开发", "高级应用", "数据交互"]
moc: "[[!MOC-网络与传输]]"
description: "对比 REST、GraphQL 和 Streaming 方案在前端数据交互中的特点。"
publish: true
aliases: ["REST GraphQL Streaming"]
toc: true
---

# REST-GraphQL-Streaming

## 1. 常见方案

- `REST`
- `GraphQL`
- `SSE`
- `WebSocket`

## 2. 选择思路

- 读多写少与聚合查询可考虑 `GraphQL`
- 实时推送更适合 `SSE / WebSocket`
