# `grid-column` 和 `grid-row` 属性详解

在现代布局中，**CSS Grid** 是一个强大的工具，可以用来构建复杂且灵活的页面结构。今天，我们来重点聊聊 **`grid-column`** 和 **`grid-row`**，它们是控制网格布局中子元素位置和大小的核心属性。

通过阅读本文，你将了解它们的用法、语法，以及如何借助它们实现灵活的布局。让我们从基础开始吧！

---

## 一、什么是 `grid-column` 和 `grid-row`？

在 CSS Grid 布局中，网格容器会被划分为若干“行”和“列”，每条“线”都被编号。  
- **`grid-column`** 控制元素在 **列方向** 的起点和终点。  
- **`grid-row`** 控制元素在 **行方向** 的起点和终点。

它们的作用就是告诉浏览器：**网格项应该从哪里开始、到哪里结束。**

---

## 二、`grid-column` 和 `grid-row` 的语法

两者的语法是一样的，通俗点说就是指定“从哪条线开始，到哪条线结束”。

```css
grid-column: <start-line> / <end-line>;
grid-row: <start-line> / <end-line>;
```

- **`<start-line>`**：元素从哪条网格线开始。
- **`<end-line>`**：元素到哪条网格线结束。

例子：  
```css
.grid-item {
  grid-column: 2 / 4; /* 从第2条列线开始，到第4条列线结束 */
  grid-row: 1 / 3;    /* 从第1条行线开始，到第3条行线结束 */
}
```

这表示元素在网格中跨越 **2列** 和 **2行**。

---

## 三、基础案例讲解

### 1. 网格容器的设置

在使用 `grid-column` 和 `grid-row` 前，先需要定义一个 **网格容器**。

```css
.grid-container {
  display: grid; 
  grid-template-columns: repeat(4, 100px); /* 定义4列，每列宽100px */
  grid-template-rows: repeat(3, 100px);   /* 定义3行，每行高100px */
  gap: 10px;                             /* 网格项之间的间距 */
}
```

### 2. 控制子元素的跨度

```css
.grid-item {
  grid-column: 2 / 4; /* 横跨第2列到第4列 */
  grid-row: 1 / 3;    /* 占据第1行到第3行 */
}
```

效果如下：  
- 网格项从第2列开始，直到第4列结束，占据了 **2列宽度**。
- 同时，它从第1行开始，直到第3行结束，占据了 **2行高度**。

---

## 四、`span` 的使用

有时候，我们并不关心元素的具体起止位置，只需要它占用一定数量的列或行，这时可以用 **`span`** 关键字。

### 例子：让网格项跨越 2 列和 3 行
```css
.grid-item {
  grid-column: span 2; /* 横跨2列 */
  grid-row: span 3;    /* 横跨3行 */
}
```

这里的 **`span`** 告诉浏览器从当前起点开始，横跨指定数量的列或行。

---

## 五、`grid-column` 和 `grid-row` 的简写

### 单独使用
如果你只想指定开始或结束位置，可以分别用：
- **`grid-column-start`** 和 **`grid-column-end`**
- **`grid-row-start`** 和 **`grid-row-end`**

```css
.grid-item {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 4;
}
```

### 简写形式
使用 `grid-column` 和 `grid-row` 可以简化书写：

```css
.grid-item {
  grid-column: 1 / 3; /* 从第1列开始，到第3列结束 */
  grid-row: 2 / 4;    /* 从第2行开始，到第4行结束 */
}
```

---

## 六、实践案例

### 案例1：构建简单的网格布局

```html
<div class="grid-container">
  <div class="grid-item item1">Item 1</div>
  <div class="grid-item item2">Item 2</div>
  <div class="grid-item item3">Item 3</div>
</div>
```

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 100px); /* 三列，每列宽100px */
  grid-template-rows: repeat(2, 100px);   /* 两行，每行高100px */
  gap: 10px;
}

.item1 {
  grid-column: 1 / 3; /* 横跨第1列到第3列 */
}

.item2 {
  grid-column: 3 / 4; /* 占据第3列 */
  grid-row: 1 / 3;    /* 跨越两行 */
}

.item3 {
  grid-column: span 3; /* 横跨三列 */
}
```

---

## 七、常见问题解答

### 1. 什么是“网格线”？

- **网格线**是网格容器中列和行的分隔线，**从1开始编号**。
- 如果你有 4 列，则有 5 条网格线（包括两侧边界）。

### 2. 网格线编号规则？

- 左到右、上到下编号。
- 负数可以从右到左或从下到上编号，例如 `-1` 表示最后一条线。

### 3. `auto` 值的作用？

如果不指定结束位置，默认是 `auto`，表示元素自动占用一个网格单元。

---

## 八、总结

- **`grid-column`** 和 **`grid-row`** 是 CSS Grid 布局中用于控制网格项位置和跨度的核心属性。
- 通过 **起始线编号** 或 **`span`** 跨度控制网格项的大小和位置。
- 学会结合 **`grid-template-columns`** 和 **`grid-template-rows`** 使用，能实现更复杂的布局。

掌握这些属性后，你可以轻松构建灵活的网格布局，快去试试吧！