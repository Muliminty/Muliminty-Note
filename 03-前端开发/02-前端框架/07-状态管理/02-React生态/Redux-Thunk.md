---
title: "Redux Thunk"
date: "2026-04-23"
lastModified: "2026-04-23"
tags: ["状态管理", "React", "Redux Thunk"]
moc: "[[!MOC-状态管理]]"
description: "说明 Redux Thunk 的异步处理方式与适用边界。"
publish: true
aliases: ["Thunk"]
toc: true
---

# Redux Thunk

`Redux Thunk` 用函数替代普通 action，让异步流程可以延迟分发真正的状态变更。

## 适用场景

- 中小型异步请求
- 逻辑不复杂的副作用处理
