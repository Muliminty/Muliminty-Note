### `usePersistedTab` 自定义 Hook 技术文档

`usePersistedTab` 是一个用于缓存和恢复 React 组件中 Tabs 状态的自定义 Hook。它可以帮助开发者在切换路由后保持用户选择的 Tab 状态，避免在返回页面时重置到默认的 Tab。

#### 1. 使用场景

1. **多 Tab 页面**：在单页应用（SPA）中，通常会有多个带 Tabs 的页面，如用户设置、管理控制台等，用户切换路由并返回时，希望保持上次选择的 Tab。
2. **表单或配置页面**：当用户在表单或配置页面的多个 Tabs 之间切换时，页面状态应保持一致。
3. **数据管理页面**：在显示不同数据视图的页面（如报表或数据管理界面）中，希望在用户浏览或操作后返回到之前的 Tab。

#### 2. 实现原理

`usePersistedTab` 利用 `sessionStorage` 来持久化存储 Tab 的状态。每当用户切换 Tab 时，当前的 Tab 状态会保存到 `sessionStorage`。当组件重新加载或用户返回页面时，`usePersistedTab` 会从 `sessionStorage` 恢复之前的状态。

- **`sessionStorage`**：一种浏览器的存储机制，允许在浏览器会话期间存储数据。数据仅在当前标签页或窗口有效，关闭浏览器或标签页后数据被清除。使用 `sessionStorage` 可以保证用户在不同的页面中保持独立的状态，不会互相干扰。

#### 3. 使用介绍

##### 3.1 安装与引入

在你的项目中创建一个 `usePersistedTab.js` 文件并粘贴以下代码：

```javascript
import { useState, useEffect, useMemo } from 'react';

const usePersistedTab = (storageKey, defaultKey = '1') => {
  // 从 sessionStorage 中获取缓存的 tab key
  const initialKey = useMemo(() => {
    return sessionStorage.getItem(storageKey) || defaultKey;
  }, [storageKey, defaultKey]);

  const [activeTabKey, setActiveTabKey] = useState(initialKey);

  useEffect(() => {
    // 在 activeTabKey 变化时缓存到 sessionStorage
    sessionStorage.setItem(storageKey, activeTabKey);
  }, [storageKey, activeTabKey]);

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  return [activeTabKey, onTabChange];
};

export default usePersistedTab;
```

##### 3.2 使用步骤

1. **引入 Hook**：在需要缓存 Tabs 状态的组件中引入 `usePersistedTab`。
2. **调用 Hook**：传入唯一的 `storageKey`，用来标识此组件的 Tabs 状态；还可以传入一个可选的 `defaultKey` 作为默认的 Tab key。
3. **绑定 Tabs**：将 `activeKey` 和 `onChange` 事件绑定到 Tabs 组件。

##### 3.3 示例代码

```javascript
import React from 'react';
import { Tabs } from 'antd';
import usePersistedTab from './usePersistedTab';

const MyTabsComponent = () => {
  // 使用自定义 Hook，并传入唯一的 storageKey
  const [activeTabKey, onTabChange] = usePersistedTab('myComponentTabKey', '1');

  return (
    <Tabs
      activeKey={activeTabKey}
      onChange={onTabChange}
    >
      <Tabs.TabPane tab="Tab 1" key="1">
        Content of Tab 1
      </Tabs.TabPane>
      <Tabs.TabPane tab="Tab 2" key="2">
        Content of Tab 2
      </Tabs.TabPane>
      <Tabs.TabPane tab="Tab 3" key="3">
        Content of Tab 3
      </Tabs.TabPane>
    </Tabs>
  );
};

export default MyTabsComponent;
```

#### 4. 参数说明

- **`storageKey`**: 用于 `sessionStorage` 的唯一键值，用于标识和区分不同组件的状态（**必填**）。
- **`defaultKey`**: 默认的 Tab key，当没有缓存状态时使用该值（可选，默认为 `'1'`）。

#### 5. 优势

- **提高用户体验**：通过保持 Tab 状态，用户可以在不同页面之间来回切换，而不丢失上下文。
- **通用性和复用性**：通过封装成 Hook，可以在不同的组件中轻松使用，提高代码的可维护性和一致性。
- **简单易用**：只需引入并调用 Hook，不需要复杂的代码或额外的依赖。

#### 6. 兼容性

- **浏览器支持**：现代浏览器均支持 `sessionStorage`，包括 Chrome、Firefox、Safari 和 Edge 等。

#### 7. 注意事项

- **`sessionStorage` 限制**：`sessionStorage` 的数据仅在当前会话窗口内有效，关闭浏览器或页面后会清空。如果需要跨浏览器或更持久的状态存储，可以考虑使用 `localStorage` 。
- **`storageKey` 唯一性**：确保为每个组件使用唯一的 `storageKey`，以防止不同组件之间的状态冲突。

#### 8. 总结

`usePersistedTab` 是一个灵活而通用的解决方案，适用于需要在页面之间切换时保持 Tab 状态的 React 项目。通过这个 Hook，可以提升用户体验，减少开发复杂度，同时保持代码的简洁和可读性。