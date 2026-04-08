# usePersistedTab - 选项卡状态持久化

> 自定义 Hook，用于管理选项卡状态并持久化到 sessionStorage。支持多级存储结构，可以管理多个选项卡组的状态。

---

## 📋 目录

- [功能概述](#功能概述)
- [API 说明](#api-说明)
- [使用示例](#使用示例)
- [实现原理](#实现原理)
- [注意事项](#注意事项)
- [扩展场景](#扩展场景)

---

## 功能概述

`usePersistedTab` 是一个自定义 React Hook，用于：

- **状态管理**：管理当前活动的选项卡 key
- **持久化存储**：将选项卡状态保存到 sessionStorage
- **多级存储**：支持在一级对象下管理多个选项卡组的状态
- **自动恢复**：页面刷新后自动恢复上次选择的选项卡

### 核心特性

- ✅ 自动持久化到 sessionStorage
- ✅ 支持多级存储结构（parentKey + storageKey）
- ✅ 提供清空数据的方法
- ✅ TypeScript 友好（可扩展类型定义）

---

## API 说明

### usePersistedTab

```typescript
const [activeTabKey, onTabChange, clearTabKeys] = usePersistedTab(
  storageKey: string,
  defaultKey?: string,
  parentKey?: string
);
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `storageKey` | `string` | ✅ | - | 用于存储选项卡状态的 key，在同一 parentKey 下唯一 |
| `defaultKey` | `string` | ❌ | `'1'` | 默认选项卡的 key，若 sessionStorage 中没有对应的状态则使用此值 |
| `parentKey` | `string` | ❌ | `'PersistedTab'` | 存储数据的一级对象的 key，用于组织多个选项卡组 |

#### 返回值

返回一个数组，包含三个元素：

1. **`activeTabKey`** (`string`) - 当前活动的选项卡 key
2. **`onTabChange`** (`(key: string) => void`) - 选项卡变化处理函数
3. **`clearTabKeys`** (`(key?: string) => void`) - 清空数据的函数

---

## 使用示例

### 基础用法

```jsx
import usePersistedTab from './hooks/usePersistedTab';

function TabComponent() {
  const [activeTabKey, onTabChange] = usePersistedTab('userTabs');

  return (
    <Tabs activeKey={activeTabKey} onChange={onTabChange}>
      <Tabs.TabPane key="1" tab="基本信息">内容 1</Tabs.TabPane>
      <Tabs.TabPane key="2" tab="详细信息">内容 2</Tabs.TabPane>
      <Tabs.TabPane key="3" tab="其他信息">内容 3</Tabs.TabPane>
    </Tabs>
  );
}
```

### 自定义默认值和存储 key

```jsx
function TabComponent() {
  // 使用自定义默认值和存储 key
  const [activeTabKey, onTabChange] = usePersistedTab(
    'settingsTabs',
    'general', // 默认选中 'general' 选项卡
    'AppSettings' // 存储在 'AppSettings' 一级对象下
  );

  return (
    <Tabs activeKey={activeTabKey} onChange={onTabChange}>
      <Tabs.TabPane key="general" tab="常规设置">常规设置内容</Tabs.TabPane>
      <Tabs.TabPane key="advanced" tab="高级设置">高级设置内容</Tabs.TabPane>
    </Tabs>
  );
}
```

### 多组选项卡管理

```jsx
function MultiTabComponent() {
  // 第一组选项卡
  const [userTab, onUserTabChange] = usePersistedTab(
    'userTabs',
    '1',
    'UserManagement' // 存储在 'UserManagement' 下
  );

  // 第二组选项卡
  const [settingsTab, onSettingsTabChange] = usePersistedTab(
    'settingsTabs',
    'general',
    'AppSettings' // 存储在 'AppSettings' 下
  );

  return (
    <div>
      <Tabs activeKey={userTab} onChange={onUserTabChange}>
        {/* 用户管理选项卡 */}
      </Tabs>
      <Tabs activeKey={settingsTab} onChange={onSettingsTabChange}>
        {/* 设置选项卡 */}
      </Tabs>
    </div>
  );
}
```

### 清空存储数据

```jsx
function TabComponent() {
  const [activeTabKey, onTabChange, clearTabKeys] = usePersistedTab(
    'userTabs',
    '1',
    'UserManagement'
  );

  const handleReset = () => {
    // 清空当前选项卡组的数据
    clearTabKeys(); // 默认清空 parentKey 下的所有数据
    // 或清空指定的 key
    // clearTabKeys('UserManagement');
  };

  return (
    <div>
      <Tabs activeKey={activeTabKey} onChange={onTabChange}>
        {/* 选项卡内容 */}
      </Tabs>
      <Button onClick={handleReset}>重置选项卡</Button>
    </div>
  );
}
```

---

## 实现原理

### 存储结构

数据在 sessionStorage 中的存储结构如下：

```json
{
  "PersistedTab": {
    "userTabs": "2",
    "settingsTabs": "general"
  }
}
```

### 核心实现

```javascript
import { useState, useEffect, useMemo } from 'react';

/**
 * 从 sessionStorage 中获取指定一级对象下的存储数据。
 */
const getPersistedTabs = (parentKey) => {
  const storedTabs = sessionStorage.getItem(parentKey);
  return storedTabs ? JSON.parse(storedTabs) : {};
};

/**
 * 清空 sessionStorage 中指定一级对象的数据。
 */
const clearPersistedTabs = (parentKey) => {
  sessionStorage.removeItem(parentKey);
};

const usePersistedTab = (storageKey, defaultKey = '1', parentKey = 'PersistedTab') => {
  // 获取或初始化指定一级对象下的 tab 数据
  const initialTabs = useMemo(() => getPersistedTabs(parentKey), [parentKey]);

  // 从指定一级对象中获取指定 key 的初始值
  const initialKey = initialTabs[storageKey] || defaultKey;

  const [activeTabKey, setActiveTabKey] = useState(initialKey);

  useEffect(() => {
    // 更新指定一级对象并存储到 sessionStorage
    const tabs = getPersistedTabs(parentKey);
    tabs[storageKey] = activeTabKey;
    sessionStorage.setItem(parentKey, JSON.stringify(tabs));
  }, [storageKey, activeTabKey, parentKey]);

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  const clearTabKeys = (key = parentKey) => {
    clearPersistedTabs(key);
  };

  return [activeTabKey, onTabChange, clearTabKeys];
};

export default usePersistedTab;
```

### 关键点说明

1. **初始化**：使用 `useMemo` 从 sessionStorage 读取初始值，避免每次渲染都读取
2. **持久化**：使用 `useEffect` 监听 `activeTabKey` 变化，自动保存到 sessionStorage
3. **多级存储**：通过 `parentKey` 和 `storageKey` 实现多级存储结构
4. **默认值处理**：如果 sessionStorage 中没有数据，使用传入的 `defaultKey`

---

## 注意事项

### 1. sessionStorage 限制

- **作用域**：sessionStorage 的作用域是当前标签页，不同标签页之间不共享
- **生命周期**：关闭标签页后数据会被清除
- **存储大小**：通常限制为 5-10MB（不同浏览器可能不同）

### 2. 数据格式

- 存储的数据必须是可 JSON 序列化的
- 如果存储的数据格式不正确，可能导致解析错误

### 3. 性能考虑

- `useMemo` 确保只在 `parentKey` 变化时重新读取数据
- `useEffect` 确保只在 `activeTabKey` 变化时写入 sessionStorage

### 4. 错误处理

当前实现没有错误处理，如果 sessionStorage 不可用或数据格式错误，可能会导致问题。建议添加错误处理：

```javascript
const getPersistedTabs = (parentKey) => {
  try {
    const storedTabs = sessionStorage.getItem(parentKey);
    return storedTabs ? JSON.parse(storedTabs) : {};
  } catch (error) {
    console.error('Failed to parse stored tabs:', error);
    return {};
  }
};
```

---

## 扩展场景

### TypeScript 类型定义

```typescript
type TabKey = string;

interface UsePersistedTabReturn {
  0: TabKey;
  1: (key: TabKey) => void;
  2: (key?: string) => void;
}

const usePersistedTab = (
  storageKey: string,
  defaultKey: TabKey = '1',
  parentKey: string = 'PersistedTab'
): UsePersistedTabReturn => {
  // ... 实现
};
```

### 支持 localStorage

如果需要持久化到 localStorage（跨标签页共享），可以修改存储方法：

```javascript
const getPersistedTabs = (parentKey, useLocalStorage = false) => {
  const storage = useLocalStorage ? localStorage : sessionStorage;
  const storedTabs = storage.getItem(parentKey);
  return storedTabs ? JSON.parse(storedTabs) : {};
};
```

### 支持过期时间

可以扩展支持数据过期：

```javascript
const usePersistedTab = (
  storageKey,
  defaultKey = '1',
  parentKey = 'PersistedTab',
  expireTime = null // 过期时间（毫秒）
) => {
  // 检查是否过期
  // 如果过期，清除数据并使用默认值
};
```

---

## 🔗 相关链接

### 前置知识

- [useState Hook](../01-基础Hooks/README.md) — React 基础 Hooks
- [useEffect Hook](../01-基础Hooks/01-useEffect-完整指南.md) — 副作用处理
- [useMemo Hook](../../README.md) — 性能优化 Hooks

### 进阶学习

- [自定义 Hooks 最佳实践](./README.md) — 自定义 Hooks 设计原则
- [Context + 自定义 Hook 最佳模式](../01-基础Hooks/05-Context-与自定义Hook-最佳模式.md) — Context 与自定义 Hook 结合使用

### 外部资源

- [React Hooks 官方文档](https://react.dev/reference/react)
- [sessionStorage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage)

---

**最后更新**：2025-01-XX

#React #Hooks #自定义Hooks #状态持久化 #sessionStorage
