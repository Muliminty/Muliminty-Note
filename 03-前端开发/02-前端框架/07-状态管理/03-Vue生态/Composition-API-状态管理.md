---
title: "Composition API 状态管理"
date: "2026-04-23"
lastModified: "2026-04-23"
tags: ["状态管理", "Vue", "Composition API"]
moc: "[[!MOC-状态管理]]"
description: "说明如何仅基于 Composition API 管理局部或中等规模状态。"
publish: true
aliases: ["Composition API 状态管理"]
toc: true
---

# Composition API 状态管理

当状态范围较局部时，可以只用 `ref`、`reactive`、`computed` 和组合函数构建状态模型。

## 适合场景

- 页面级逻辑
- 中小型可复用状态模块
