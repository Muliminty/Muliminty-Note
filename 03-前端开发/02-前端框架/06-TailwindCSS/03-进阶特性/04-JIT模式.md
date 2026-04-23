---
title: "JIT 模式"
date: "2026-04-23"
lastModified: "2026-04-23"
tags: ["Tailwind CSS", "前端框架", "构建机制"]
moc: "[[!MOC-TailwindCSS]]"
description: "说明 Tailwind CSS JIT 模式的工作方式与常见收益。"
publish: true
aliases: ["Tailwind CSS JIT 模式"]
toc: true
---

# JIT 模式

## 1. 这是什么

`JIT` 会按扫描到的类名即时生成样式，而不是预先输出整套庞大 CSS。

## 2. 主要收益

- 构建结果更精简
- 开发反馈更快
- 动态组合类名的支持更灵活
