# Model 插件

> `@umijs/plugin-model` 是 Umi 内置的一种轻量级、基于 Hooks 的数据流方案。它旨在解决组件间状态共享的问题，同时避免 Redux 等方案中繁琐的 Boilerplate 代码。

---

## 📋 目录
- [核心理念](#核心理念)
- [快速开始](#快速开始)
- [使用 Model](#使用-model)
- [性能优化：选择器](#性能优化选择器)
- [全局与局部 Model](#全局与局部-model)
- [最佳实践](#最佳实践)

---

## 核心理念

Umi Model 插件的核心理念是：**“一个文件就是一个 Hook”**。
- **无感集成**：只要在特定目录下定义文件，就会自动注册为 Model。
- **简单易用**：完全使用 React Hooks 的语法，不需要学习 Action、Reducer、Saga 等概念。
- **类型安全**：深度集成 TypeScript，提供完美的类型推导。

---

## 快速开始

### 1. 定义 Model
在 `src/models` 目录下创建文件。例如 `src/models/useAuthModel.ts`：

```typescript
import { useState, useCallback } from 'react';

export default function useAuthModel() {
  const [user, setUser] = useState<string | null>(null);

  const login = useCallback((name: string) => {
    setUser(name);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return {
    user,
    login,
    logout,
  };
}
```

> **注意**：文件名（不带后缀）即为 Model 的 ID。上例中的 Model ID 为 `useAuthModel`。

---

## 使用 Model

在组件中通过 `useModel` 钩子获取状态。

```tsx
import { useModel } from 'umi';

const LoginPage = () => {
  const { user, login, logout } = useModel('useAuthModel');

  return (
    <div>
      {user ? (
        <>
          <p>当前用户：{user}</p>
          <button onClick={logout}>退出登录</button>
        </>
      ) : (
        <button onClick={() => login('Admin')}>点击登录</button>
      )}
    </div>
  );
};
```

---

## 性能优化：选择器

`useModel` 默认会订阅 Model 的所有变更。如果 Model 状态非常大，而组件只依赖其中一小部分，可以使用 **Selector** 来减少不必要的重渲染。

```tsx
// 只有当 user 发生变化时，该组件才会重渲染
const { user } = useModel('useAuthModel', (model) => ({
  user: model.user,
}));
```

---

## 全局与局部 Model

- **全局 Model**：放置在 `src/models` 目录下的所有文件。它们在整个应用生命周期内是单例的，状态全局共享。
- **局部 Model**：通常结合 `useModel` 的局部化能力或在页面目录下定义。但在 Umi 约定中，`src/models` 是最常用的全局状态存储地。

---

## 实战案例：使用 Model 管理 Modal 状态

在复杂页面中，通常会有多个弹窗（Modal）。使用 Model 可以优雅地管理这些弹窗的显示状态。

### 1. 定义 Modal 管理 Model
`src/models/useModalModel.ts`:

```typescript
import { useState, useCallback } from 'react';

export default function useModalModel() {
  const [visible, setVisible] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const open = useCallback((id?: number) => {
    setVisible(true);
    if (id) setCurrentId(id);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setCurrentId(null);
  }, []);

  return {
    visible,
    currentId,
    open,
    close,
  };
}
```

### 2. 组件中使用

```tsx
import { useModel } from 'umi';
import { Modal, Button } from 'antd';

const ListPage = () => {
  const { visible, open, close, currentId } = useModel('useModalModel');

  return (
    <div>
      <Button onClick={() => open(1)}>打开弹窗 1</Button>
      <Modal 
        title={`当前编辑 ID: ${currentId}`} 
        open={visible} 
        onCancel={close}
      >
        弹窗内容...
      </Modal>
    </div>
  );
};
```

---

## 最佳实践

1. **命名规范**：建议以 `useXXXModel.ts` 命名，体现其 Hook 的本质。
2. **逻辑拆分**：不要把所有全局状态塞进一个大的 Model，按业务领域拆分。
3. **配合 useRequest**：在 Model 中使用 Umi 的 `useRequest` 处理异步数据获取，将加载状态和数据存储在 Model 中。
4. **状态下沉**：如果状态只在两个相邻子组件间共享，优先考虑 Props 传递或 React Context，避免滥用全局 Model。

---

## 🔗 相关链接
- [Umi 官方文档 - 数据流](https://umijs.org/docs/max/data-flow)
- [Request 插件](./03-Request插件.md)

---

**最后更新**：2026-01-14
**维护规范**：遵循 [.cursorrules](../../../.cursorrules)

#Umi #Model插件 #数据流 #ReactHooks #状态管理
