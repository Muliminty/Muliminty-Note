---
title: "Valtio"
date: "2026-04-23"
lastModified: "2026-04-23"
tags: ["状态管理", "React", "Valtio"]
moc: "[[!MOC-状态管理]]"
description: "说明 Valtio 基于 Proxy 的响应式状态模型。"
publish: true
aliases: ["Valtio 状态管理"]
toc: true
---

# Valtio

`Valtio` 依赖 `Proxy` 追踪状态变化，让状态读写方式更接近普通对象。

## 使用建议

- 适合追求直观数据模型的场景
- 需要注意响应式边界与调试方式
