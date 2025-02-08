# 技术文档：`usePersistedTab` 钩子

### 使用场景

`usePersistedTab` 钩子用于管理选项卡（Tab）的状态，并将状态持久化到 `sessionStorage` 中。适用于以下场景：

- **保存用户的选项卡状态**：在多标签页应用中，确保用户在刷新页面后能恢复到上次的标签页。
- **恢复用户的选择**：在需要根据用户的选择展示不同内容的应用中，确保用户在重新访问时能够恢复到上次的选择。
- **状态同步**：在用户切换页面或路由时，保持选项卡状态一致。

### 实现原理

1. **获取或初始化数据**：从 `sessionStorage` 中获取指定 `parentKey` 下的存储数据。如果不存在，则初始化为空对象。
2. **保存选项卡状态**：在 `activeTabKey` 变化时，将选项卡状态保存到 `sessionStorage` 中。
3. **清空数据**：提供功能以清空指定的存储目录下的数据。

### 使用介绍

- **初始化钩子**：在组件中调用 `usePersistedTab` 钩子，传入选项卡的 `storageKey`、默认的 `defaultKey` 和存储的 `parentKey`。
- **返回值**：钩子返回当前的活动选项卡 key、选项卡变化处理函数和清空数据的函数。
- **使用方法**：将钩子返回的函数与状态绑定到组件中，管理选项卡的切换和持久化。

### 代码

```javascript
import { useState, useEffect, useMemo } from 'react';

/**
 * 从 sessionStorage 中获取指定一级对象下的存储数据。
 * 
 * @param {string} parentKey - 存储数据的一级对象的 key。
 * @returns {object} - 存储的数据对象。如果没有数据，则返回空对象。
 */
const getPersistedTabs = (parentKey) => {
  const storedTabs = sessionStorage.getItem(parentKey);
  return storedTabs ? JSON.parse(storedTabs) : {};
};

/**
 * 清空 sessionStorage 中指定一级对象的数据。
 * 
 * @param {string} parentKey - 要清空数据的一级对象的 key。
 */
const clearPersistedTabs = (parentKey) => {
  sessionStorage.removeItem(parentKey);
};

/**
 * 自定义钩子，用于管理选项卡状态并持久化到 sessionStorage。
 * 
 * @param {string} storageKey - 用于存储选项卡状态的 key。
 * @param {string} [defaultKey='1'] - 默认选项卡的 key，若 sessionStorage 中没有对应的状态则使用此值。
 * @param {string} [parentKey='PersistedTab'] - 存储数据的一级对象的 key，默认为 'PersistedTab'。
 * @returns {[string, Function, Function]} - 返回当前活动的选项卡 key、选项卡变化处理函数和清空数据的函数。
 */
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

  /**
   * 更新活动选项卡的 key。
   * 
   * @param {string} key - 新的选项卡 key。
   */
  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  /**
   * 清空指定的一级对象下的 tab 数据。
   * 如果不传 key，则默认为清空传入的一级目录。
   * 
   * @param {string} [key=parentKey] - 要清空的一级对象的 key。
   */
  const clearTabKeys = (key = parentKey) => {
    clearPersistedTabs(key);
  };

  return [activeTabKey, onTabChange, clearTabKeys];
};

export default usePersistedTab;
```

### 使用示例

下面是一个示例，展示如何在组件中使用 `usePersistedTab` 钩子来管理选项卡的状态并持久化：

```jsx
import React from 'react';
import { Tabs } from 'antd'; // 使用 Ant Design 的 Tabs 组件
import usePersistedTab from './usePersistedTab';

const MyComponent = () => {
  // 使用钩子管理选项卡状态
  const [activeTabKey, onTabChange, clearAllTabKeys] = usePersistedTab('myTabKey');

  // 处理选项卡变化
  const handleTabChange = (key) => {
    onTabChange(key);
  };

  // 清空所有选项卡数据
  const handleClearAll = () => {
    clearAllTabKeys();
  };

  return (
    <div>
      <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
        <Tabs.TabPane tab="Tab 1" key="tab1">
          Content of Tab 1
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tab 2" key="tab2">
          Content of Tab 2
        </Tabs.TabPane>
      </Tabs>
      <button onClick={handleClearAll}>Clear All Tabs</button>
    </div>
  );
};

export default MyComponent;
```

### 总结

`usePersistedTab` 是一个用于管理和持久化选项卡状态的自定义钩子，它能够有效地保存和恢复用户的选项卡选择，并支持清空指定的存储目录下的数据。通过合理地使用 `sessionStorage` 和 React 的钩子功能，可以使用户体验更加流畅和一致。