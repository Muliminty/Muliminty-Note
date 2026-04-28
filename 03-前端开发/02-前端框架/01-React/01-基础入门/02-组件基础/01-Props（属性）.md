---
title: "Props（属性）"
date: "2026-04-28"
lastModified: "2026-04-28"
tags: ["React", "Props", "组件", "前端框架"]
moc: "[[!MOC-React]]"
description: "说明 Props 在 React 中的角色、单向数据流、只读约束与常见传递方式。"
publish: true
aliases: ["Props", "属性传递"]
toc: true
---

# Props（属性）

## 1. 一句话概括主题

Props 是父组件传给子组件的输入参数，用来驱动子组件渲染。

## 2. 核心特点

- 只读，不应在子组件内直接修改
- 体现 React 的单向数据流
- 可传递基础值、对象、函数和 JSX

## 3. 常见场景

- 传递文本、状态、配置项
- 通过回调函数向上通知父组件
- 用 `children` 组合组件结构

## 4. 相关主题

- [组件（Components）](./02-组件（Components）.md)
- [State（状态）](../03-状态管理/01-State（状态）.md)
- [组件组合](./03-组件组合.md)
