### GridStack.js API 文档

GridStack.js 是一个高性能的拖拽和可调整大小的网格布局库，通常用于构建具有动态布局的仪表板和可视化工具。它提供了丰富的 API 来创建、管理和交互网格组件。以下是 GridStack.js 的详细 API 文档。

### 1. **初始化和销毁**

#### `GridStack.init(options, selector)`
初始化 GridStack 实例。

- **options**：初始化选项对象，包含以下常见属性：
  - `float`: 设置为 `true` 使小部件浮动（默认：`false`）。
  - `cellHeight`: 单元格高度（可以是数字或者 `'px'` 或 `'em'`）。
  - `minRow`: 最小行数，控制布局的行数（默认：`0`）。
  - `dir`: 网格布局的方向，支持 `ltr`（默认）和 `rtl`。
  - `disableOneColumnMode`: 设置为 `true` 防止在列数为 1 时激活一列布局。

- **selector**：选择器，表示要应用 GridStack 的 DOM 元素或元素的 CSS 类。

**返回**：返回一个 GridStack 实例，可以用于后续操作。

#### 示例：
```javascript
const grid = GridStack.init({ float: true, cellHeight: '100px' }, '.grid-stack');
```

#### `GridStack.destroy(deleteNodes)`
销毁 GridStack 实例。

- **deleteNodes**：布尔值，指定是否删除节点元素，默认为 `false`。

**返回**：无返回。

#### 示例：
```javascript
grid.destroy(true);
```

### 2. **小部件管理**

#### `grid.addWidget(node, x, y, width, height, autoPosition)`
向网格添加小部件。

- **node**：小部件的 DOM 元素或其 HTML 字符串。
- **x, y**：小部件的初始位置（列和行）。
- **width, height**：小部件的宽度和高度。
- **autoPosition**：布尔值，是否自动计算位置，默认为 `true`。

**返回**：返回添加的小部件 DOM 元素。

#### 示例：
```javascript
grid.addWidget('<div class="grid-stack-item"><div class="grid-stack-item-content">Item 1</div></div>', 0, 0, 4, 2);
```

#### `grid.removeWidget(element, removeDOM)`
从网格中移除小部件。

- **element**：小部件的 DOM 元素或小部件的 CSS 类。
- **removeDOM**：布尔值，是否从 DOM 中删除元素，默认为 `false`。

**返回**：无返回。

#### 示例：
```javascript
const widget = document.querySelector('.grid-stack-item');
grid.removeWidget(widget, true);
```

### 3. **事件**

GridStack.js 提供了一些有用的事件，可以在特定操作时执行回调函数。

#### `grid.on(event, callback)`
为网格绑定事件。

- **event**：事件名称，常见的事件有：
  - `added`: 当一个小部件被添加时触发。
  - `removed`: 当一个小部件被移除时触发。
  - `change`: 小部件位置或大小变化时触发。
  - `dragstart`: 拖拽开始时触发。
  - `dragstop`: 拖拽停止时触发。
  - `resizestart`: 调整大小开始时触发。
  - `resizestop`: 调整大小停止时触发。

- **callback**：事件回调函数。

#### 示例：
```javascript
grid.on('added', (event, widget) => {
  console.log('Widget added:', widget);
});

grid.on('dragstop', (event, element) => {
  console.log('Drag stopped:', element);
});
```

### 4. **布局和小部件的状态管理**

#### `grid.batchUpdate()`
启用批量更新模式，减少布局操作过程中的性能开销。

- **返回**：无返回。

#### 示例：
```javascript
grid.batchUpdate();
// 执行多个布局操作
grid.batchUpdate(false);
```

#### `grid.getGridItems()`
获取所有小部件的 DOM 元素。

**返回**：返回一个包含所有小部件元素的数组。

#### 示例：
```javascript
const items = grid.getGridItems();
items.forEach(item => {
  console.log(item);
});
```

#### `grid.getCellFromPixel(x, y)`
根据像素坐标获取网格单元的位置。

- **x, y**：像素坐标。

**返回**：返回一个包含行列的对象，如 `{ col: 1, row: 2 }`。

#### 示例：
```javascript
const position = grid.getCellFromPixel(200, 100);
console.log(position);  // { col: 2, row: 1 }
```

### 5. **拖拽和调整大小**

#### `grid.makeWidget(element)`
将某个元素转换为可以拖拽和调整大小的小部件。

- **element**：小部件的 DOM 元素。

**返回**：无返回。

#### 示例：
```javascript
grid.makeWidget(document.querySelector('.grid-stack-item'));
```

#### `grid.resizeWidget(element, width, height)`
调整小部件的大小。

- **element**：小部件的 DOM 元素。
- **width, height**：新的宽度和高度。

**返回**：无返回。

#### 示例：
```javascript
grid.resizeWidget(document.querySelector('.grid-stack-item'), 6, 4);
```

### 6. **获取和设置网格项的位置**

#### `grid.save(true)`
保存当前网格的布局，并返回小部件的位置信息。

- **true**：表示保存并返回数据。

**返回**：返回一个数组，包含每个小部件的布局信息。

#### 示例：
```javascript
const layout = grid.save(true);
console.log(layout);
```

#### `grid.load(data)`
加载指定的布局数据。

- **data**：之前保存的布局数据。

**返回**：无返回。

#### 示例：
```javascript
grid.load(layout);
```

### 7. **网格设置**

#### `grid.setStatic(true)`
设置网格为静态模式，禁止拖拽和调整大小。

- **true**：启用静态模式。
- **false**：禁用静态模式，恢复可拖拽和可调整大小。

**返回**：无返回。

#### 示例：
```javascript
grid.setStatic(true);
```

#### `grid.setOption(option, value)`
设置 GridStack 的选项。

- **option**：选项名称。
- **value**：选项值。

**返回**：无返回。

#### 示例：
```javascript
grid.setOption('cellHeight', 80);
```

### 8. **其他方法**

#### `grid.removeAll(deleteDOM)`
移除所有小部件。

- **deleteDOM**：布尔值，表示是否从 DOM 中删除元素。

**返回**：无返回。

#### 示例：
```javascript
grid.removeAll(true);
```

#### `grid.column()`
返回网格列数。

**返回**：返回列数。

#### 示例：
```javascript
const columns = grid.column();
console.log(columns);
```

### 总结

GridStack.js 提供了强大的 API 来支持灵活的网格布局管理。通过它，你可以创建动态的、可调整大小和拖动的小部件，轻松构建具有交互性的仪表板和界面。你可以通过各种方法和事件来操作和管理这些小部件，以满足不同的需求。