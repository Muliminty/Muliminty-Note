---
title: "内容安全策略（CSP）"
date: "2026-04-21"
lastModified: "2026-04-21"
tags: ["前端开发", "质量保障", "前端安全", "CSP"]
moc: "[[!MOC-前端安全]]"
description: "介绍 CSP 的作用、核心指令与前端项目中的落地方式。"
publish: true
toc: true
---

# 内容安全策略（CSP）

## 1. 作用

CSP 用于限制页面可加载和执行的资源来源，降低 XSS 风险。

## 2. 常见指令

- `default-src`
- `script-src`
- `style-src`
- `img-src`

## 3. 相关链接

- [前端安全总入口](./!MOC-前端安全.md)
- [XSS/CSRF 原理与防护](./XSS-CSRF原理与防护.md)
