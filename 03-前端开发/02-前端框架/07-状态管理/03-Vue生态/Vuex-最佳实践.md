---
title: "Vuex 最佳实践"
date: "2026-04-23"
lastModified: "2026-04-23"
tags: ["状态管理", "Vue", "Vuex"]
moc: "[[!MOC-状态管理]]"
description: "整理 Vuex 项目中的模块拆分、命名和维护建议。"
publish: true
aliases: ["Vuex 实践"]
toc: true
---

# Vuex 最佳实践

- 模块边界按业务域拆分
- 派生数据尽量通过 `getters` 管理
- 异步逻辑和纯状态变更职责分离
