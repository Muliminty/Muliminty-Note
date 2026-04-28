---
title: "State（状态）"
date: "2026-04-28"
lastModified: "2026-04-28"
tags: ["React", "State", "状态管理", "前端框架"]
moc: "[[!MOC-React]]"
description: "说明 React 中 State 的角色、更新方式、派生状态与状态提升的基本原则。"
publish: true
aliases: ["State", "React 状态"]
toc: true
---

# State（状态）

## 1. 一句话概括主题

State 是组件内部会变化的数据，状态变化后 React 会重新渲染组件。

## 2. 核心认知

- State 用来驱动交互
- 更新 State 应通过状态更新函数完成
- State 更新是异步调度的，不应假设立即生效

## 3. 常见实践

- 多个组件共享状态时考虑状态提升
- 能从 Props 或现有 State 推导出的值，尽量不要重复存储
- 状态拆分要围绕“是否一起变化”来判断

## 4. 相关主题

- [Props（属性）](../02-组件基础/01-Props（属性）.md)
- [条件渲染](../01-语法基础/02-条件渲染.md)
- [useContext](./05-useContext.md)
