下面是关于 `ProTable` 的 `search` 配置的详细文档，详细说明了各个配置项的作用。

# ProTable 搜索配置详解

`ProTable` 是 Ant Design 中一个功能强大的表格组件，包含了许多实用的配置项来简化开发过程。在 `ProTable` 中，搜索表单的配置可以通过 `search` 属性进行定制。以下是详细的配置项及其说明：

## 基本配置项

### 1. `collapsed`
- **类型**: `boolean`
- **说明**: 控制搜索表单是否折叠。默认情况下，搜索表单是折叠的。当设置为 `false` 时，搜索表单会展开。

### 2. `labelWidth`
- **类型**: `number | 'auto'`
- **说明**: 设置搜索表单项的标签宽度。默认值为 `'auto'`，标签宽度会根据内容自动调整。

### 3. `onCollapse`
- **类型**: `function`
- **说明**: 当搜索表单折叠状态改变时的回调函数。

### 4. `defaultCollapsed`
- **类型**: `boolean`
- **说明**: 设置搜索表单是否默认折叠。默认值为 `true`，即默认折叠。

### 5. `span`
- **类型**: `number`
- **说明**: 设置搜索表单项在栅格系统中的占位格数。默认为 8。

### 6. `collapseRender`
- **类型**: `function`
- **说明**: 自定义折叠按钮的渲染。

### 7. `resetText`
- **类型**: `string`
- **说明**: 设置重置按钮的文本。默认值为 `'重置'`。

### 8. `searchText`
- **类型**: `string`
- **说明**: 设置搜索按钮的文本。默认值为 `'搜索'`。

### 9. `filterType`
- **类型**: `string`
- **说明**: 设置搜索表单的类型。可以是 `'query'` 或 `'light'`，分别对应查询表单和轻量表单。

### 10. `showHiddenNum`
- **类型**: `boolean`
- **说明**: 当搜索表单折叠时，是否显示隐藏的表单项数量。默认值为 `false`。

### 11. `layout`
- **类型**: `string`
- **说明**: 设置搜索表单的布局。可以是 `'horizontal'`、`'vertical'` 或 `'inline'`。

### 12. `defaultColsNumber`
- **类型**: `number`
- **说明**: 设置搜索表单默认显示的列数。默认值为 2。

### 13. `spanSearchLayout`
- **类型**: `number`
- **说明**: 设置搜索表单项在栅格系统中的占位格数。默认为 12。

### 14. `optionRender`
- **类型**: `function`
- **说明**: 自定义操作栏的渲染。可以用来自定义搜索、重置、折叠/展开按钮。

## 示例代码

以下示例展示了如何配置 `ProTable` 的搜索表单，包括上述所有配置项：

```javascript
import React, { useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';

const getSearchConfig = (collapsed, setCollapsed) => ({
  collapsed, // 控制搜索表单是否折叠
  labelWidth: 'auto', // 设置搜索表单项标签的宽度
  onCollapse: setCollapsed, // 当搜索表单折叠状态改变时的回调函数
  defaultCollapsed: true, // 设置搜索表单是否默认折叠
  span: 8, // 设置搜索表单项在栅格系统中的占位格数
  collapseRender: (collapsed) => (collapsed ? '展开' : '收起'), // 自定义折叠按钮的渲染
  resetText: '重置', // 设置重置按钮的文本
  searchText: '搜索', // 设置搜索按钮的文本
  filterType: 'query', // 设置搜索表单的类型 ('query' 表单)
  showHiddenNum: true, // 当搜索表单折叠时，是否显示隐藏的表单项数量
  layout: 'horizontal', // 设置搜索表单的布局 ('horizontal' 布局)
  defaultColsNumber: 2, // 设置搜索表单默认显示的列数
  spanSearchLayout: 12, // 设置搜索表单项在栅格系统中的占位格数
  optionRender: ({ collapse, reset, submit }) => (
    <>
      <Button type="primary" onClick={submit}>搜索</Button> {/* 自定义搜索按钮 */}
      <Button onClick={reset}>重置</Button> {/* 自定义重置按钮 */}
      <a onClick={() => setCollapsed(!collapse)}>{collapse ? '展开' : '收起'}</a> {/* 自定义折叠/展开按钮 */}
    </>
  ), // 自定义操作栏的渲染
});


const MyTable = () => {
  const [collapsed, setCollapsed] = useState(true);

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      colSize: 1, // 控制表单项宽度
    },
    {
      title: '工号',
      dataIndex: 'employeeId',
      colSize: 2, // 控制表单项宽度
    },
    {
      title: '部门',
      dataIndex: 'department',
      colSize: 1, // 控制表单项宽度
    },
  ];

  return (
    <ProTable
      columns={columns}
      request={async (params) => {
        // 模拟数据请求
        return { data: [], success: true };
      }}
      rowKey="id"
      search={getSearchConfig(collapsed, setCollapsed)}
    />
  );
};

export default MyTable;
```

在上述示例中，`colSize` 属性用于控制每个表单项在搜索表单中的宽度。你可以根据需要调整 `colSize` 的值来控制表单项的宽度。
