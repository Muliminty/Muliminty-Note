# `grid-template-columns` 和 `grid-template-rows` 属性详解

CSS Grid 是一种强大的布局方式，而 **`grid-template-columns`** 和 **`grid-template-rows`** 是其核心属性，用于定义网格的列和行结构。通过它们，我们可以轻松构建灵活、规范的布局。

本文将深入探讨它们的用法、语法，并通过丰富的案例，让你彻底掌握这两个属性。

---

## 一、什么是 `grid-template-columns` 和 `grid-template-rows`？

### **功能**
- **`grid-template-columns`**：定义网格的 **列数** 和 **每列的宽度**。
- **`grid-template-rows`**：定义网格的 **行数** 和 **每行的高度**。

通过指定这两个属性，可以划分网格容器，并确定每个网格单元的大小。

---

## 二、语法解析

### 基础语法：
```css
grid-template-columns: <track-size> ... ;
grid-template-rows: <track-size> ... ;
```

- **`<track-size>`**：每个轨道的大小，可以是具体的像素值、百分比、`fr` 单位、`auto`，甚至是 `minmax()` 函数。
- 你可以用空格分隔多个值，表示每个轨道的大小。

例子：
```css
grid-template-columns: 100px 200px 300px; /* 第一列宽100px，第二列宽200px，第三列宽300px */
grid-template-rows: 50px auto 100px;      /* 第一行高50px，第二行高度自动，第三行高100px */
```

---

## 三、详细用法解析

### 1. **指定固定大小**

如果列或行的大小是固定的，可以直接写值：
```css
grid-template-columns: 100px 200px; /* 第一列100px宽，第二列200px宽 */
grid-template-rows: 50px 100px;     /* 第一行50px高，第二行100px高 */
```

案例：
```html
<div class="grid-container">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: 100px 200px;
    grid-template-rows: 50px 100px;
    gap: 10px;
  }
</style>
```

布局效果：  
- 容器被划分为 2 列、2 行。
- 第一列宽100px，第二列宽200px。
- 第一行高50px，第二行高100px。

---

### 2. **使用 `auto` 关键字**

`auto` 表示让浏览器自动决定轨道大小，通常由内容决定：
```css
grid-template-columns: auto auto; /* 每列宽度由内容撑开 */
grid-template-rows: auto;        /* 每行高度由内容撑开 */
```

---

### 3. **使用百分比**

百分比基于网格容器的大小：
```css
grid-template-columns: 50% 50%; /* 两列分别占容器宽度的50% */
grid-template-rows: 30% 70%;   /* 两行分别占容器高度的30%和70% */
```

---

### 4. **使用 `fr` 单位**

`fr` 是 **fractional unit（分数单位）**，表示剩余空间的分配比例：
```css
grid-template-columns: 1fr 2fr; /* 第一列占1份，第二列占2份 */
grid-template-rows: 1fr 1fr;    /* 每行平均分配空间 */
```

案例：
```html
<div class="grid-container">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 1fr;
    height: 200px; /* 总高度200px */
  }
</style>
```

布局效果：  
- 容器分为两列。
- 第一列占1/3宽度，第二列占2/3宽度。

---

### 5. **使用 `repeat()` 函数**

`repeat()` 用于重复某种模式：
```css
grid-template-columns: repeat(3, 100px); /* 重复3次，每列宽100px */
grid-template-rows: repeat(2, 50px);     /* 重复2次，每行高50px */
```

案例：
```html
<div class="grid-container">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
</div>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(3, 100px); /* 三列 */
    grid-template-rows: repeat(2, 100px);   /* 两行 */
    gap: 10px;
  }
</style>
```

布局效果：  
- 容器分为3列、2行。
- 每列宽100px，每行高100px。

---

### 6. **使用 `minmax()` 函数**

`minmax()` 定义轨道的最小值和最大值：
```css
grid-template-columns: minmax(100px, 200px) 1fr;
```

- 第一列宽度在 100px 到 200px 之间，根据空间调整。
- 第二列占剩余空间。

---

### 7. **使用 `auto-fit` 和 `auto-fill`**

**动态创建网格轨道**，适合响应式布局：
```css
grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
```

- **`auto-fit`**：将空的网格单元折叠起来，容器内部紧密排列。
- **`auto-fill`**：即使没有内容，也会继续填充网格轨道。

案例：
```html
<div class="grid-container">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 10px;
  }
</style>
```

布局效果：  
- 当容器宽度足够时，动态增加或减少列数。

---

### 8. **混合使用**

可以同时使用多种单位：
```css
grid-template-columns: 100px 1fr auto;
grid-template-rows: 50px minmax(100px, auto) 1fr;
```

- 第一列宽100px，第二列占剩余空间，第三列根据内容调整。
- 第一行高50px，第二行在 100px 到内容高度之间变化，第三行占剩余空间。

---

## 四、常见问题解答

### 1. 什么是网格轨道？
- **网格轨道**是由列和行划分的网格单元。
- 轨道的数量由 `grid-template-columns` 和 `grid-template-rows` 决定。

### 2. 如何实现自适应网格？
使用 `fr` 单位或 `auto-fit`/`auto-fill` 结合 `minmax()`。

### 3. 网格线编号如何影响布局？
- 网格线从 1 开始编号。
- 通过 `grid-column` 和 `grid-row` 可以控制元素跨越哪些轨道。

---

## 五、总结

- **`grid-template-columns`** 和 **`grid-template-rows`** 是 CSS Grid 布局中定义列和行的重要属性。
- 借助像 `fr`、`repeat()`、`minmax()`、`auto-fit` 等灵活的语法，可以轻松实现复杂的布局。
- 理解它们的用法和组合，可以让你的页面布局更加高效和响应式。

通过多练习这些案例，你将能够熟练运用 Grid 构建精美的页面！