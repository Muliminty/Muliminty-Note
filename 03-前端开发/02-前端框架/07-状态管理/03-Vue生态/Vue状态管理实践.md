---
title: "Vue 状态管理实践"
date: "2026-04-23"
lastModified: "2026-04-23"
tags: ["状态管理", "Vue", "实践"]
moc: "[[!MOC-状态管理]]"
description: "总结 Vue 项目中局部状态、共享状态与全局状态的组织建议。"
publish: true
aliases: ["Vue 状态管理实践"]
toc: true
---

# Vue 状态管理实践

## 建议顺序

- 先局部
- 再抽组合函数
- 最后再考虑 `Pinia` 或 `Vuex`

## 关键原则

- 共享范围决定状态位置
- 更新频率影响建模方式
