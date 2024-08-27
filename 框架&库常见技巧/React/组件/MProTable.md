# MProTable 使用说明

`MProTable` 是一个基于 `ProTable` 的封装组件，集成了常用的功能配置，如自定义分页、搜索、滚动等。通过该组件，你可以更轻松地在项目中构建具有复杂功能的表格。

### 安装依赖

确保你的项目已经安装了以下依赖：

```bash
npm install @ant-design/pro-table antd react-i18next
```

### 使用示例

```jsx
import React from 'react';
import MProTable from './MProTable';

const MyComponent = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    // 其他列配置...
  ];

  const request = async (params, sort, filter) => {
    // 你的数据请求逻辑
    return {
      data: [], // 返回的数据
      success: true,
      total: 100, // 数据总数
    };
  };

  const handleCreate = () => {
    // 新建操作逻辑
  };

  return (
    <MProTable
      columns={columns}
      request={request}
      onCreate={handleCreate}
      paginationConfig={{ defaultPageSize: 20 }}
      searchConfig={{ labelWidth: 100 }}
    />
  );
};

export default MyComponent;
```

### 属性 (Props)

| 属性名                | 类型          | 必填  | 默认值                       | 描述  |
|----------------------|---------------|-------|-----------------------------|-------|
| `columns`            | `Array`       | 是    | 无                           | 表格列配置，参考 `ProTable` 的 columns 配置。|
| `onCreate`           | `func`        | 是    | 无                           | 点击新建按钮时触发的回调函数。|
| `request`            | `func`        | 是    | 无                           | 用于发起数据请求的函数，需返回包含 `data`、`success`、`total` 的对象。|
| `paginationConfig`   | `object`      | 否    | `{ size: 'default', defaultPageSize: 10, showSizeChanger: true }` | 分页配置，覆盖默认的分页设置。|
| `searchConfig`       | `object`      | 否    | `{ span: 8, labelWidth: 'auto', layout: 'horizontal' }` | 搜索表单配置，支持自定义搜索区域的布局和样式。|
| `tableClassName`     | `string`      | 否    | `'zk-pro-table-custom'`      | 表格的自定义样式类名。|
| `containerClassName` | `string`      | 否    | `'ComponentName'`            | 包裹组件的容器类名。|
| `scrollOffset`       | `number`      | 否    | `420`                        | 表格滚动时的偏移量，影响表格的显示高度。|
| `scrollEnabled`      | `bool`        | 否    | `true`                       | 是否启用表格的滚动效果。|
| `customScroll`       | `object`      | 否    | 无                           | 自定义滚动配置，覆盖默认的滚动设置。|
| `toolBarButtons`     | `arrayOf(node)` | 否  | `[]`                         | 自定义工具栏按钮的配置。|
| `proTableProps`      | `object`      | 否    | 无                           | 允许传入其他 `ProTable` 支持的属性。|

### 功能说明

1. **自定义分页配置**：通过 `paginationConfig` 属性，开发者可以灵活地调整表格的分页设置，如默认每页显示数量，是否显示分页选择器等。

2. **自定义搜索配置**：`searchConfig` 允许配置搜索表单的布局、标签宽度、折叠状态等。并且根据当前的语言环境，自动调整布局方向。

3. **响应式滚动区域**：通过 `scrollEnabled` 属性控制表格是否允许滚动，并且可以通过 `scrollOffset` 和 `customScroll` 来调整滚动区域的显示高度。

4. **工具栏按钮**：使用 `toolBarButtons` 属性可以在表格的工具栏中添加自定义的按钮。默认情况下，会提供一个“新建”按钮。

5. **国际化支持**：组件内置了对 `react-i18next` 的支持，自动根据语言环境调整文本内容和布局方向。

### 事件回调

- `onCreate`：点击工具栏中的“新建”按钮时触发的事件。可以在这里实现创建新记录的逻辑。

- `request`：用于数据请求的回调函数，接收分页、排序和筛选参数，返回数据列表。

### 高级配置

- **调整表格高度**：当浏览器窗口大小变化时，表格会自动调整高度以适应窗口。你可以通过 `scrollOffset` 来进一步调整高度。

- **自定义样式**：通过 `tableClassName` 和 `containerClassName` 属性，你可以为表格和组件容器添加自定义的样式类名，方便进行样式定制。

### 注意事项

- **`ProTable` 依赖项**：确保项目中已经安装了 `@ant-design/pro-table` 和 `antd`，以确保组件能够正常渲染和使用。

- **国际化配置**：组件内置了对 `react-i18next` 的支持，请确保项目中已经配置好 `i18n` 实例，并且配置了相关的国际化文案。


