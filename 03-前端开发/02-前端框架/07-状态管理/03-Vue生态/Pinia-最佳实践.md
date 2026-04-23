---
title: "Pinia 最佳实践"
date: "2026-04-23"
lastModified: "2026-04-23"
tags: ["状态管理", "Vue", "Pinia"]
moc: "[[!MOC-状态管理]]"
description: "整理 Pinia 中 store 拆分、组合和维护边界的建议。"
publish: true
aliases: ["Pinia 实践"]
toc: true
---

# Pinia 最佳实践

- 以业务能力为单位拆 store
- 避免单个 store 承担所有页面状态
- 区分持久化状态与临时 UI 状态
