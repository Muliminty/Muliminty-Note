---
title: "Context API 在 RN 中的应用"
date: "2026-04-23"
lastModified: "2026-04-23"
tags: ["React Native", "Context API", "状态管理"]
moc: "[[!MOC-React-Native]]"
description: "说明在 React Native 中使用 Context API 管理共享状态的常见方式。"
publish: true
aliases: ["React Native Context API"]
toc: true
---

# Context API 在 RN 中的应用

## 1. 适合场景

- 主题
- 登录态
- 轻量全局配置

## 2. 注意点

- 不要让单个 Context 承担过多职责
- 避免大范围无差别重渲染
