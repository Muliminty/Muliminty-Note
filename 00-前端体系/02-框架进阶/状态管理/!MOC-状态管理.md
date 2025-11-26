# 状态管理（State Management）MOC

> 本笔记作为前端状态管理知识体系的索引，涵盖 React、Vue 等框架的状态管理方案，以及通用状态管理模式。
> 
> **学习路径**：状态管理通常与前端框架配合使用。学习前需要掌握 [React](../React/!MOC-React.md) 或 [Vue](../Vue/!MOC-Vue.md) 基础。状态管理的性能优化可参考 [性能优化 MOC](../../04-质量保障/性能/!MOC-性能.md)。

---

## 📚 核心概念

学习状态管理的基础理论知识：

- [状态管理基础](./01-核心概念/状态管理基础.md) — 状态管理的概念、问题和解决方案（理解为什么需要状态管理）
- [单向数据流](./01-核心概念/单向数据流.md) — 数据流动的原理和模式（与 [React](../React/!MOC-React.md) 数据流一致）
- [状态管理选型指南](./01-核心概念/状态管理选型指南.md) — 如何选择合适的状态管理方案（根据框架选择）

---

## ⚛️ React 生态

> **前置要求**：学习 React 状态管理前，需要掌握 [React 基础](../React/!MOC-React.md)，了解组件、Props、State 等概念。

### Redux 系列

> 🗺️ **新手必看**：[Redux + Redux-Saga 完整学习路径](./02-React生态/!MOC-Redux学习路径.md) — 系统学习 Redux 和 Redux-Saga 的完整指南

- [Redux](./02-React生态/Redux.md) — Redux 基础概念、原理和最小闭环 Demo（配合 [React](../React/!MOC-React.md) 使用）
- [Redux Toolkit (RTK)](./02-React生态/Redux-Toolkit.md) — Redux 官方推荐工具集（推荐使用）
- [Redux-Saga](./02-React生态/Redux-Saga.md) — 基于 Generator 的副作用管理（需要掌握 [JavaScript Generator](../../01-基础入门/JavaScript/!MOC-javascript.md)）
- [Redux-Thunk](./02-React生态/Redux-Thunk.md) — 简单的异步处理方案

### 其他 React 状态管理

- [MobX](./02-React生态/MobX.md) — 响应式状态管理
- [Recoil](./02-React生态/Recoil.md) — Facebook 的原子化状态管理
- [Zustand](./02-React生态/Zustand.md) — 轻量级状态管理
- [XState](./02-React生态/XState.md) — 状态机管理
- [Jotai](./02-React生态/Jotai.md) — 原子化状态管理
- [Valtio](./02-React生态/Valtio.md) — 基于 Proxy 的状态管理

---

## 💚 Vue 生态

> **前置要求**：学习 Vue 状态管理前，需要掌握 [Vue 基础](../Vue/!MOC-Vue.md)，了解组件、Props、响应式等概念。

### Vuex 系列

- [Vuex](./03-Vue生态/Vuex.md) — Vuex 状态管理模式（Vue 2 推荐，配合 [Vue](../Vue/!MOC-Vue.md) 使用）
- [Vuex 最佳实践](./03-Vue生态/Vuex-最佳实践.md) — Vuex 项目实践指南

### Pinia 系列

- [Pinia](./03-Vue生态/Pinia.md) — Vue 3 官方推荐的状态管理库（Vue 3 推荐，配合 [Vue](../Vue/!MOC-Vue.md) 使用）
- [Pinia 最佳实践](./03-Vue生态/Pinia-最佳实践.md) — Pinia 项目实践指南

### 其他 Vue 状态管理

- [Composition API 状态管理](./03-Vue生态/Composition-API-状态管理.md) — 使用 Composition API 管理状态
- [Vue 状态管理实践](./03-Vue生态/Vue状态管理实践.md) — Vue 项目中的状态管理实践

---

## 🔄 通用方案

框架无关的状态管理方案和模式：

- [状态机模式](./04-通用方案/状态机模式.md) — 状态机的概念和应用
- [事件驱动状态管理](./04-通用方案/事件驱动状态管理.md) — 基于事件的状态管理模式
- [状态持久化策略](./04-通用方案/状态持久化策略.md) — 状态持久化的实现方案

---

## 🛠 实践与最佳实践

- [Redux 最佳实践](./05-实践与最佳实践/Redux-最佳实践.md) — Redux 项目中的最佳实践（配合 [React 最佳实践](../React/组件设计模式.md)）
- [Vuex/Pinia 最佳实践](./05-实践与最佳实践/Vuex-Pinia-最佳实践.md) — Vue 生态最佳实践（配合 [Vue 最佳实践](../Vue/组件通信.md)）
- [状态管理测试策略](./05-实践与最佳实践/状态管理测试策略.md) — 如何测试状态管理逻辑（详见 [测试 MOC](../../04-质量保障/测试/!MOC-测试.md)）
- [状态管理性能优化](./05-实践与最佳实践/状态管理性能优化.md) — 状态管理的性能优化技巧（详见 [性能优化 MOC](../../04-质量保障/性能/!MOC-性能.md)）
- [状态管理架构设计](./05-实践与最佳实践/状态管理架构设计.md) — 大型应用的状态管理架构（参考 [架构 MOC](../../05-高级应用/架构/!MOC-架构.md)）

---

## 📖 学习资源

### React 生态

- [Redux 官方文档](https://redux.js.org/)
- [Redux Toolkit 文档](https://redux-toolkit.js.org/)
- [Redux-Saga 官方文档](https://redux-saga.js.org/)
- [MobX 官方文档](https://mobx.js.org/)
- [Recoil 官方文档](https://recoiljs.org/)

### Vue 生态

- [Vuex 官方文档](https://vuex.vuejs.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)

---

## 📌 扩展说明

### 添加新的状态管理方案

1. **React 生态**：添加到 `02-React生态/` 目录
2. **Vue 生态**：添加到 `03-Vue生态/` 目录
3. **其他框架**：创建新目录，如 `06-Angular生态/`、`07-Svelte生态/` 等
4. **通用方案**：添加到 `04-通用方案/` 目录

### 目录命名规范

- 使用 `数字-分类` 的格式，便于排序
- 目录名使用中文，文件名使用中文或英文
- 文件命名：`框架名-功能.md` 或 `功能.md`

---

#状态管理 #redux #vuex #pinia #react #vue #前端框架
