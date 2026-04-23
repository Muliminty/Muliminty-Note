# Model 插件

> `@umijs/plugin-model` 是 Umi 内置的一种轻量级、基于 Hooks 的数据流方案。它旨在解决组件间状态共享的问题，同时避免 Redux 等方案中繁琐的 Boilerplate 代码。

---

## 📋 目录
- [核心理念](#核心理念)
- [开始使用：命名空间规则](#开始使用命名空间规则)
- [全局初始状态 @@initialState](#全局初始状态-initialstate)
- [使用 Model](#使用-model)
- [性能优化：选择器](#性能优化选择器)
- [页面内“小模块”与全局管理](#页面内小模块与全局管理)
- [最佳实践](#最佳实践)

---

## 核心理念

Umi Model 插件的核心理念是：**“一个文件就是一个 Hook”**。

### 1. 本质公式
> **Umi Model = 自定义 Hook + 全局共享 (单例模式)**

### 2. 直观比喻
- **普通自定义 Hook** 是一面 **“随身镜”**：每个组件调用时都会给自己生成一个独立的状态。
- **Umi Model** 是挂在店中央的一块 **“大屏幕”**：应用中任何地方看到的都是同一块屏幕。

---

## 开始使用：命名空间规则

所谓的 Model，就是一个默认导出的自定义 Hook。Umi 会根据文件路径自动生成 **命名空间（Namespace）**。

### 1. 命名空间生成表
| 路径 | 命名空间 | 说明 |
| :--- | :--- | :--- |
| `src/models/count.ts` | `count` | `src/models` 目录下**不支持**嵌套定义 |
| `src/pages/pageA/model.ts` | `pageA.model` | 页面级 model |
| `src/pages/pageB/models/product.ts` | `pageB.product` | 页面级 models 目录 |
| `src/pages/pageB/models/fruit/apple.ts` | `pageB.fruit.apple` | `pages` 目录下**支持**嵌套定义 |

### 2. 编写 Model 示例
```typescript
// src/models/userModel.ts
import { useState } from 'react';

export default () => {
  const [user, setUser] = useState({ username: 'umi' });
  return { user, setUser };
};
```

---

## 全局初始状态 @@initialState

`@@initialState` 是一种特殊的、内置的全局 Model。它在项目启动的最开始创建，通常用于存储当前用户、权限、全局配置等。

### 1. 初始化 (src/app.ts)
```typescript
// src/app.ts
export async function getInitialState() {
  const data = await fetchUserInfo();
  return data; // 这里的返回值就是 initialState
}
```

### 2. 消费状态
```tsx
const { initialState, loading, refresh, setInitialState } = useModel('@@initialState');
```

---

## 使用 Model

在组件中通过 `useModel(namespace)` 获取状态。

```tsx
import { useModel } from 'umi';

export default () => {
  const { user } = useModel('userModel');
  const { initialState } = useModel('@@initialState');
  return <div>{user.username}</div>;
};
```

---

## 性能优化：选择器

`useModel` 的第二个参数是可选的 **updater (Selector)**。当 Model 中只有部分参数变化时，使用它可以避免不必要的重渲染。

```tsx
// 只有当 count 变化时，该组件才会重新渲染
const { count } = useModel('counterModel', (model) => ({
  count: model.count,
}));
```

---

## 💡 核心进阶：页面内“小模块” Modal vs 全局 Modal

### 1. 场景决策指南

| 维度 | 页面/组件内“小模块” Modal | 全局/应用级 Model Modal |
| :--- | :--- | :--- |
| **存放位置** | 页面组件内部（使用 `useState`） | `src/models/` 目录 |
| **状态归属** | **私有状态**：只为当前页面服务 | **共享状态**：跨页面或全局组件（如导航栏） |
| **小白建议** | **90% 的业务弹窗**请选这个。 | **5% 的全局弹窗**（如登录、公告）选这个。 |

### 2. 代码实战与目录管理

#### A. 局部 Modal（推荐）
**目录结构：**
```text
src/pages/User/
  ├── index.tsx          # 状态定义在这里 (useState)
  └── components/
      └── EditModal.tsx  # 纯展示/接收 Props 的 Modal
```

#### B. 全局 Modal（跨组件联动）
**目录结构：**
```text
src/
  ├── models/
  │   └── useAuthModel.ts  # 定义全局控制逻辑
  ├── components/
  │   └── LoginModal.tsx   # 登录弹窗
  └── layouts/
      └── index.tsx        # 在这里挂载 LoginModal，实现全站调用
```

---

## 🚀 进阶：微前端通信 (@@qiankunStateFromMaster)

当作为微前端子应用运行时，Umi 内置了该 Model 用于接收主应用下发的数据。
```tsx
const masterState = useModel('@@qiankunStateFromMaster');
```

---

## 最佳实践

1. **命名规范**：建议以 `useXXXModel.ts` 命名，目录必选复数 `src/models`。
2. **状态下沉**：不要把所有状态都塞进全局，优先考虑组件内 `useState`。
3. **性能意识**：大 Model 务必使用 Selector 优化。
4. **配合 useRequest**：将异步数据请求结果存入 Model 是 Umi 开发的标准模式。

---

## 🔗 相关链接
- [Umi 官方文档 - 数据流](https://umijs.org/docs/max/data-flow)
- [Request 插件](./03-Request插件.md)

---

**最后更新**：2026-01-14
**维护规范**：遵循 [百科写作规范](../../../../99-系统/01-百科写作规范.md)

#Umi #Model插件 #数据流 #initialState #状态管理
