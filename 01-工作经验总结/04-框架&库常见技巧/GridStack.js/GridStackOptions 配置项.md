
### `GridStackOptions` 配置项

`GridStackOptions` 用于配置 GridStack 网格的行为和外观，以下是每个选项的说明：

#### 1. **acceptWidgets**
- **类型**：`boolean | string | (element: Element) => boolean`
- **默认值**：`false`
- **描述**：是否接受从其他网格或外部拖拽的组件。可以是：
  - `true`（使用 `.grid-stack-item` 类名过滤）。
  - `false`（不接受拖拽）。
  - 字符串（指定类名）。
  - 函数（返回布尔值，基于某些条件判断是否接受拖拽）。

#### 2. **alwaysShowResizeHandle**
- **类型**：`true | false | 'mobile'`
- **默认值**：`false`
- **描述**：是否总是显示调整大小的手柄。可选值：
  - `true`：始终显示调整大小手柄。
  - `false`：仅在鼠标悬停时显示。
  - `'mobile'`：在移动设备上总是显示。

#### 3. **animate**
- **类型**：`boolean`
- **默认值**：`true`
- **描述**：是否启用动画效果，默认启用。

#### 4. **auto**
- **类型**：`boolean`
- **默认值**：`true`
- **描述**：是否初始化现有的网格项。设置为 `false` 时，不会初始化已有的网格项。

#### 5. **cellHeight**
- **类型**：`number | string`
- **默认值**：`'auto'`
- **描述**：网格单元格的高度。可以是：
  - 整数（像素值）。
  - 字符串（例如：`'100px'`, `'10em'`）。
  - `'auto'`：根据网格宽度和列数动态计算高度。
  
#### 6. **cellHeightThrottle**
- **类型**：`number`
- **默认值**：`100`
- **描述**：当 `cellHeight` 为 `'auto'` 时，用于控制调整高度时的节流延迟（单位：毫秒）。值为 `0` 时会立即响应。

#### 7. **cellHeightUnit**
- **类型**：`string`
- **默认值**：`'px'`
- **描述**：`cellHeight` 单元格的单位（如 `px`, `rem`, `em` 等）。当 `cellHeight` 为字符串时使用。

#### 8. **children**
- **类型**：`GridStackWidget[]`
- **描述**：当调用 `load()` 或 `addGrid()` 时，传入的子项列表，用于动态添加子网格项。

#### 9. **column**
- **类型**：`number | 'auto'`
- **默认值**：`12`
- **描述**：网格的列数，默认值为 12。如果是嵌套网格，建议使用 `'auto'`，以便自动适应父容器的列数。

#### 10. **columnOpts**
- **类型**：`Responsive`
- **描述**：响应式布局的列数配置，根据窗口宽度自动调整列数。

#### 11. **class**
- **类型**：`string`
- **描述**：为 GridStack 实例添加额外的 CSS 类，以便区分不同的网格实例。

#### 12. **disableDrag**
- **类型**：`boolean`
- **默认值**：`false`
- **描述**：是否禁用拖拽功能，默认启用拖拽。

#### 13. **disableResize**
- **类型**：`boolean`
- **默认值**：`false`
- **描述**：是否禁用调整大小功能，默认启用调整大小。

#### 14. **draggable**
- **类型**：`DDDragOpt`
- **描述**：自定义拖拽选项，允许覆盖默认的拖拽行为。

#### 15. **float**
- **类型**：`boolean`
- **默认值**：`false`
- **描述**：是否启用浮动的网格项。启用后，网格项可以在网格外部自由拖拽。

#### 16. **handle**
- **类型**：`string`
- **默认值**：`'.grid-stack-item-content'`
- **描述**：拖拽的句柄，指定哪个元素可以作为拖拽的目标。

#### 17. **handleClass**
- **类型**：`string`
- **描述**：拖拽句柄的类名。若设置此项，`handle` 选项会被忽略。

#### 18. **itemClass**
- **类型**：`string`
- **默认值**：`'grid-stack-item'`
- **描述**：网格项的类名。

#### 19. **layout**
- **类型**：`ColumnOptions`
- **默认值**：`'list'`
- **描述**：子网格的布局方式，当网格被调整大小时，决定其排列方式。

#### 20. **lazyLoad**
- **类型**：`boolean`
- **默认值**：`false`
- **描述**：是否启用懒加载，仅在网格项可见时加载它们。

#### 21. **margin**
- **类型**：`number | string`
- **默认值**：`10`
- **描述**：网格项之间的间距。可以是整数（px）或带有单位的字符串（例如：`'2em'`, `'20px'`）。也可以是一个带空格分隔的四个值（例如：`'5px 10px 0 20px'`）。

#### 22. **marginUnit**
- **类型**：`string`
- **默认值**：`'px'`
- **描述**：间距的单位，默认为 `'px'`。

#### 23. **maxRow**
- **类型**：`number`
- **默认值**：`0`
- **描述**：网格的最大行数。设置为 `0` 表示没有限制。

#### 24. **minRow**
- **类型**：`number`
- **默认值**：`0`
- **描述**：网格的最小行数，默认值为 `0`。

#### 25. **nonce**
- **类型**：`string`
- **描述**：如果使用基于非ces的内容安全策略（CSP），可以在此处传入 `nonce`，GridStack 会将它添加到生成的 `<style>` 元素中。

#### 26. **placeholderClass**
- **类型**：`string`
- **默认值**：`'grid-stack-placeholder'`
- **描述**：占位符的类名。

#### 27. **placeholderText**
- **类型**：`string`
- **默认值**：`''`
- **描述**：占位符的默认内容。

#### 28. **resizable**
- **类型**：`DDResizeOpt`
- **描述**：自定义调整大小的选项，允许覆盖默认的调整大小行为。

#### 29. **removable**
- **类型**：`boolean | string`
- **默认值**：`false`
- **描述**：是否允许通过拖拽将网格项删除。可以是布尔值，或者一个选择器字符串，表示拖放到指定区域时会移除该项。

#### 30. **removableOptions**
- **类型**：`DDRemoveOpt`
- **描述**：自定义可删除选项。

#### 31. **row**
- **类型**：`number`
- **默认值**：`0`
- **描述**：设置网格的行数，`0` 表示不限制行数。

#### 32. **rtl**
- **类型**：`boolean | 'auto'`
- **默认值**：`'auto'`
- **描述**：是否启用右到左（RTL）布局。可选值：`true`（启用 RTL），`false`（禁用 RTL），`'auto'`（自动判断）。

#### 33. **sizeToContent**
- **类型**：`boolean`
- **默认值**：`false`
- **描述**：是否根据内容的大小来设置每个网格项的高度，避免出现垂直滚动条。

#### 34. **staticGrid**
- **类型**：`boolean`
- **默认值**：`false`
- **描述**：是否将网格设置为静态，禁用移动和调整大小功能。

#### 35. **styleInHead**
- **类型**：`boolean`
- **默认值**：`false`
- **描述**：是否将样式元素添加到 `<head>` 中，默认为 `false`，会添加到元素的父节点。

#### 36. **subGridOpts**
- **类型**：`GridStackOptions`
- **描述**：用于自动创建的子网格的选项

配置。

#### 37. **subGridDynamic**
- **类型**：`boolean`
- **默认值**：`false`
- **描述**：是否允许动态创建子网格。启用此选项后，子网格将根据需要在网格项上创建。

---

### 总结
`GridStackOptions` 提供了非常丰富的配置项，能够控制网格的布局、样式、交互行为以及是否启用某些功能。开发者可以根据具体需求选择性地启用或禁用某些功能，灵活地定制网格布局。


```
/**
 * Defines the options for a Grid
 */
export interface GridStackOptions {
    /**
     * accept widgets dragged from other grids or from outside (default: `false`). Can be:
     * `true` (uses `'.grid-stack-item'` class filter) or `false`,
     * string for explicit class name,
     * function returning a boolean. See [example](http://gridstack.github.io/gridstack.js/demo/two.html)
     */
    acceptWidgets?: boolean | string | ((element: Element) => boolean);
    /** possible values (default: `mobile`) - does not apply to non-resizable widgets
      * `false` the resizing handles are only shown while hovering over a widget
      * `true` the resizing handles are always shown
      * 'mobile' if running on a mobile device, default to `true` (since there is no hovering per say), else `false`.
      See [example](http://gridstack.github.io/gridstack.js/demo/mobile.html) */
    alwaysShowResizeHandle?: true | false | 'mobile';
    /** turns animation on (default?: true) */
    animate?: boolean;
    /** if false gridstack will not initialize existing items (default?: true) */
    auto?: boolean;
    /**
     * one cell height (default?: 'auto'). Can be:
     *  an integer (px)
     *  a string (ex: '100px', '10em', '10rem'). Note: % doesn't work right - see demo/cell-height.html
     *  0, in which case the library will not generate styles for rows. Everything must be defined in your own CSS files.
     *  'auto' - height will be calculated for square cells (width / column) and updated live as you resize the window - also see `cellHeightThrottle`
     *  'initial' - similar to 'auto' (start at square cells) but stay that size during window resizing.
     */
    cellHeight?: numberOrString;
    /** throttle time delay (in ms) used when cellHeight='auto' to improve performance vs usability (default?: 100).
     * A value of 0 will make it instant at a cost of re-creating the CSS file at ever window resize event!
     * */
    cellHeightThrottle?: number;
    /** (internal) unit for cellHeight (default? 'px') which is set when a string cellHeight with a unit is passed (ex: '10rem') */
    cellHeightUnit?: string;
    /** list of children item to create when calling load() or addGrid() */
    children?: GridStackWidget[];
    /** number of columns (default?: 12). Note: IF you change this, CSS also have to change. See https://github.com/gridstack/gridstack.js#change-grid-columns.
     * Note: for nested grids, it is recommended to use 'auto' which will always match the container grid-item current width (in column) to keep inside and outside
     * items always to same. flag is not supported for regular non-nested grids.
     */
    column?: number | 'auto';
    /** responsive column layout for width:column behavior */
    columnOpts?: Responsive;
    /** additional class on top of '.grid-stack' (which is required for our CSS) to differentiate this instance.
    Note: only used by addGrid(), else your element should have the needed class */
    class?: string;
    /** disallows dragging of widgets (default?: false) */
    disableDrag?: boolean;
    /** disallows resizing of widgets (default?: false). */
    disableResize?: boolean;
    /** allows to override UI draggable options. (default?: { handle?: '.grid-stack-item-content', appendTo?: 'body' }) */
    draggable?: DDDragOpt;
    /** let user drag nested grid items out of a parent or not (default true - not supported yet) */
    /** the type of engine to create (so you can subclass) default to GridStackEngine */
    engineClass?: typeof GridStackEngine;
    /** enable floating widgets (default?: false) See example (http://gridstack.github.io/gridstack.js/demo/float.html) */
    float?: boolean;
    /** draggable handle selector (default?: '.grid-stack-item-content') */
    handle?: string;
    /** draggable handle class (e.g. 'grid-stack-item-content'). If set 'handle' is ignored (default?: null) */
    handleClass?: string;
    /** additional widget class (default?: 'grid-stack-item') */
    itemClass?: string;
    /** re-layout mode when we're a subgrid and we are being resized. default to 'list' */
    layout?: ColumnOptions;
    /** true when widgets are only created when they scroll into view (visible) */
    lazyLoad?: boolean;
    /**
     * gap between grid item and content (default?: 10). This will set all 4 sides and support the CSS formats below
     *  an integer (px)
     *  a string with possible units (ex: '2em', '20px', '2rem')
     *  string with space separated values (ex: '5px 10px 0 20px' for all 4 sides, or '5em 10em' for top/bottom and left/right pairs like CSS).
     * Note: all sides must have same units (last one wins, default px)
     */
    margin?: numberOrString;
    /** OLD way to optionally set each side - use margin: '5px 10px 0 20px' instead. Used internally to store each side. */
    marginTop?: numberOrString;
    marginRight?: numberOrString;
    marginBottom?: numberOrString;
    marginLeft?: numberOrString;
    /** (internal) unit for margin (default? 'px') set when `margin` is set as string with unit (ex: 2rem') */
    marginUnit?: string;
    /** maximum rows amount. Default? is 0 which means no maximum rows */
    maxRow?: number;
    /** minimum rows amount. Default is `0`. You can also do this with `min-height` CSS attribute
     * on the grid div in pixels, which will round to the closest row.
     */
    minRow?: number;
    /** If you are using a nonce-based Content Security Policy, pass your nonce here and
     * GridStack will add it to the <style> elements it creates. */
    nonce?: string;
    /** class for placeholder (default?: 'grid-stack-placeholder') */
    placeholderClass?: string;
    /** placeholder default content (default?: '') */
    placeholderText?: string;
    /** allows to override UI resizable options. (default?: { handles: 'se' }) */
    resizable?: DDResizeOpt;
    /**
     * if true widgets could be removed by dragging outside of the grid. It could also be a selector string (ex: ".trash"),
     * in this case widgets will be removed by dropping them there (default?: false)
     * See example (http://gridstack.github.io/gridstack.js/demo/two.html)
     */
    removable?: boolean | string;
    /** allows to override UI removable options. (default?: { accept: '.grid-stack-item' }) */
    removableOptions?: DDRemoveOpt;
    /** fix grid number of rows. This is a shortcut of writing `minRow:N, maxRow:N`. (default `0` no constrain) */
    row?: number;
    /**
     * if true turns grid to RTL. Possible values are true, false, 'auto' (default?: 'auto')
     * See [example](http://gridstack.github.io/gridstack.js/demo/right-to-left(rtl).html)
     */
    rtl?: boolean | 'auto';
    /** set to true if all grid items (by default, but item can also override) height should be based on content size instead of WidgetItem.h to avoid v-scrollbars.
     Note: this is still row based, not pixels, so it will use ceil(getBoundingClientRect().height / getCellHeight()) */
    sizeToContent?: boolean;
    /**
     * makes grid static (default?: false). If `true` widgets are not movable/resizable.
     * You don't even need draggable/resizable. A CSS class
     * 'grid-stack-static' is also added to the element.
     */
    staticGrid?: boolean;
    /** if `true` will add style element to `<head>` otherwise will add it to element's parent node (default `false`). */
    styleInHead?: boolean;
    /** list of differences in options for automatically created sub-grids under us (inside our grid-items) */
    subGridOpts?: GridStackOptions;
    /** enable/disable the creation of sub-grids on the fly by dragging items completely
     * over others (nest) vs partially (push). Forces `DDDragOpt.pause=true` to accomplish that. */
    subGridDynamic?: boolean;
}
```