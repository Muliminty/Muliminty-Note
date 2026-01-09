# 自定义 Hooks

> 自定义 Hooks 的创建、使用和最佳实践

---

## 📚 目录

- [usePersistedTab - 选项卡状态持久化](./usePersistedTab-选项卡状态持久化.md) — 管理选项卡状态并持久化到 sessionStorage

---

## 学习目标

- 理解自定义 Hooks 的设计原则
- 掌握如何创建可复用的自定义 Hooks
- 了解自定义 Hooks 的最佳实践

---

## 自定义 Hooks 设计原则

### 1. 单一职责

每个自定义 Hook 应该只负责一个特定的功能。

### 2. 可复用性

自定义 Hook 应该可以在多个组件中复用。

### 3. 命名规范

自定义 Hook 应该以 `use` 开头，遵循 React Hooks 命名规范。

### 4. 返回值的约定

- 返回单个值：直接返回
- 返回多个值：返回数组或对象
- 返回函数：提供操作函数

---

## 相关链接

### 前置知识

- [基础 Hooks](../01-基础Hooks/README.md) — useState、useEffect、useContext 等
- [进阶 Hooks](../02-进阶Hooks/README.md) — useMemo、useCallback、useRef 等

### 进阶学习

- [Context + 自定义 Hook 最佳模式](../01-基础Hooks/05-Context-与自定义Hook-最佳模式.md) — Context 与自定义 Hook 结合使用
- [Hooks 原理深入](../04-原理深入/README.md) — Hooks 实现原理

---

**最后更新**：2025-01-XX

#React #Hooks #自定义Hooks
