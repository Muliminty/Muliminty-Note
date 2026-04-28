---
title: "列表渲染 Key 的使用"
date: "2026-04-28"
lastModified: "2026-04-28"
tags: ["React", "Key", "列表渲染", "前端框架"]
moc: "[[!MOC-React]]"
description: "解释 React 列表渲染中 key 的作用、选取原则与常见误区。"
publish: true
aliases: ["列表渲染-Key的使用", "React Key"]
toc: true
---

# 列表渲染 Key 的使用

## 1. 一句话概括主题

`key` 是 React 用来识别“哪一项是谁”的稳定标识，它直接影响列表更新时的复用和状态保持。

## 2. 选取原则

- 优先使用数据库主键、业务 ID、唯一 slug
- 确保同一列表层级内唯一
- 保证在多次渲染之间尽量稳定

## 3. 不推荐的做法

- 直接用数组索引作为长期 `key`
- 使用随机数、时间戳作为 `key`
- 同一层列表重复使用相同 `key`

## 4. 相关主题

- [列表渲染](./03-列表渲染.md)
- [JSX 语法](./01-JSX-语法.md)
