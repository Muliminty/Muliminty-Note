---
title: "Recoil"
date: "2026-04-23"
lastModified: "2026-04-23"
tags: ["状态管理", "React", "Recoil"]
moc: "[[!MOC-状态管理]]"
description: "说明 Recoil 的原子化状态模型与派生状态思路。"
publish: true
aliases: ["Recoil 状态管理"]
toc: true
---

# Recoil

`Recoil` 以原子状态和选择器为核心，强调细粒度依赖更新。

## 适合场景

- 组件树较深
- 需要细粒度订阅和派生值
