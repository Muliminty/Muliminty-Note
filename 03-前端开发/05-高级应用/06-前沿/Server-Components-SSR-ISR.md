---
title: "Server-Components-SSR-ISR"
date: "2026-04-23"
lastModified: "2026-04-23"
tags: ["前端开发", "高级应用", "前沿技术"]
moc: "[[!MOC-前沿技术]]"
description: "梳理 Server Components、SSR 与 ISR 在现代前端中的核心差异。"
publish: true
aliases: ["Server Components", "SSR ISR"]
toc: true
---

# Server-Components-SSR-ISR

## 1. 关注点

- 渲染发生在哪一侧
- 数据获取靠近哪里
- 首屏体验与缓存策略如何平衡

## 2. 基本区别

- `SSR`：请求时渲染
- `ISR`：增量再生成
- `Server Components`：组件级服务端执行能力
