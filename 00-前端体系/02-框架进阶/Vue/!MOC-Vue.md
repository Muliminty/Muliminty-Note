# Vue（Vue）MOC

> Vue 是一个渐进式 JavaScript 框架，用于构建用户界面。
> 
> **学习路径**：学习 Vue 前需要掌握 [JavaScript 基础](../../01-基础入门/JavaScript/!MOC-javascript.md)。Vue 通常配合 [状态管理](../状态管理/!MOC-状态管理.md)（Vuex/Pinia）使用，推荐学习 [TypeScript](../TypeScript/!MOC-TypeScript.md) 增强类型安全。

---

## 📚 核心主题

- [响应式原理（Proxy/依赖收集）](./响应式原理.md) — Vue 响应式系统原理（基于 [JavaScript Proxy](../../01-基础入门/JavaScript/!MOC-javascript.md)）
- [Vue 组件通信](./组件通信.md) — 组件间通信方案（可配合 [Pinia](../状态管理/03-Vue生态/Pinia.md) 使用）
- [Vue 性能优化](./性能优化.md) — Vue 性能优化技巧（详见 [性能优化 MOC](../../04-质量保障/性能/!MOC-性能.md)）

---

## 🎯 核心概念

### 基础概念
- 模板语法
- 指令系统
- 计算属性和侦听器
- 组件基础

### 组件系统
- 组件通信（Props、Events、Provide/Inject）
- 插槽（Slots）
- 动态组件
- 异步组件

### Composition API
- setup 函数
- 响应式 API
- 生命周期 Hooks
- 依赖注入

### 性能优化
- 虚拟 DOM（深入学习：[性能优化 MOC](../../04-质量保障/性能/!MOC-性能.md)）
- 组件懒加载（详见 [代码分割](../../03-工程化实践/工程化/模块化与分包.md)）
- 列表渲染优化
- 计算属性缓存

---

## 📝 学习建议

1. **前置知识**：必须掌握 [JavaScript 基础](../../01-基础入门/JavaScript/!MOC-javascript.md)，推荐学习 [TypeScript](../TypeScript/!MOC-TypeScript.md)
2. **学习顺序**：JavaScript → Vue → [状态管理](../状态管理/!MOC-状态管理.md)（Pinia/Vuex）→ [工程化工具](../../03-工程化实践/工具链与构建/!MOC-工具链与构建.md)
3. **配套学习**：
   - [状态管理](../状态管理/!MOC-状态管理.md)：Pinia（Vue 3 推荐）或 Vuex
   - [测试](../../04-质量保障/测试/!MOC-测试.md)：Vue 组件测试
   - [性能优化](../../04-质量保障/性能/!MOC-性能.md)：Vue 性能优化技巧
4. **对比学习**：可以对比学习 [React](../React/!MOC-React.md) 和 [Angular](../Angular/!MOC-Angular.md)，理解不同框架的设计理念

---

## 📖 学习资源

- [Vue 官方文档](https://cn.vuejs.org/)
- [Vue 3 文档](https://cn.vuejs.org/guide/introduction.html)

---

#vue #前端框架 #响应式

