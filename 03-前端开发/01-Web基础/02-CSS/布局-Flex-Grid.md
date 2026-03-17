# CSS 布局：Flexbox 与 Grid

> 现代 CSS 布局方案，**Flexbox** 适合一维布局，**Grid** 适合二维布局。

---

## 📋 目录

- [一、CSS Grid 栅格布局](#一css-grid-栅格布局)
  - [1.1 Grid 基础概念](#11-grid-基础概念)
  - [1.2 容器属性：定义网格结构](#12-容器属性定义网格结构)
  - [1.3 子项属性：指定位置和大小](#13-子项属性指定位置和大小) ⭐ **核心**
  - [1.4 命名网格线](#14-命名网格线)
  - [1.5 命名区域（Grid Areas）](#15-命名区域grid-areas)
  - [1.6 实战案例](#16-实战案例)
- [二、Flexbox 布局](#二flexbox-布局)
  - [2.1 Flex 基础概念](#21-flex-基础概念)
  - [2.2 容器属性](#22-容器属性)
  - [2.3 子项属性](#23-子项属性)
  - [2.4 实战案例](#24-实战案例)
- [三、Grid vs Flexbox 选择指南](#三grid-vs-flexbox-选择指南)

---

## 一、CSS Grid 栅格布局

### 1.1 Grid 基础概念

**Grid（网格）** 是 CSS 的**二维布局系统**，可以同时控制**行和列**。

```css
.container {
  display: grid;
}
```

**核心概念**：
- **网格容器（Grid Container）**：设置 `display: grid` 的元素
- **网格项（Grid Item）**：容器的直接子元素
- **网格线（Grid Line）**：分隔网格的线（行线和列线）
- **网格轨道（Grid Track）**：两条网格线之间的空间（行或列）
- **网格单元格（Grid Cell）**：最小的网格单位
- **网格区域（Grid Area）**：一个或多个网格单元格组成的矩形区域

**可视化示例**：

```
┌─────┬─────┬─────┐  ← 网格线（第1行线）
│  1  │  2  │  3  │  ← 网格行（第1行）
├─────┼─────┼─────┤  ← 网格线（第2行线）
│  4  │  5  │  6  │  ← 网格行（第2行）
├─────┼─────┼─────┤  ← 网格线（第3行线）
│  7  │  8  │  9  │  ← 网格行（第3行）
└─────┴─────┴─────┘  ← 网格线（第4行线）
 ↑     ↑     ↑     ↑
 1列   2列   3列   4列
 线    线    线    线
```

---

### 1.2 容器属性：定义网格结构

#### `grid-template-columns`：定义列

```css
.container {
  display: grid;
  
  /* 方式1：固定宽度 */
  grid-template-columns: 200px 200px 200px;
  
  /* 方式2：使用 fr 单位（比例分配） */
  grid-template-columns: 1fr 2fr 1fr;  /* 1:2:1 的比例 */
  
  /* 方式3：混合使用 */
  grid-template-columns: 200px 1fr 100px;
  
  /* 方式4：重复函数 */
  grid-template-columns: repeat(3, 1fr);  /* 3列，每列 1fr */
  grid-template-columns: repeat(4, 100px);  /* 4列，每列 100px */
  
  /* 方式5：自动填充 */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  /* 自动填充，每列最小200px，最大1fr */
}
```

#### `grid-template-rows`：定义行

```css
.container {
  display: grid;
  
  /* 固定高度 */
  grid-template-rows: 100px 200px 100px;
  
  /* 使用 fr */
  grid-template-rows: 1fr 2fr 1fr;
  
  /* 重复 */
  grid-template-rows: repeat(3, 1fr);
  
  /* 自动行高（默认） */
  grid-template-rows: auto;
}
```

#### `gap`：网格间距

```css
.container {
  display: grid;
  gap: 20px;  /* 行和列都是 20px */
  
  /* 分别设置 */
  row-gap: 20px;    /* 行间距 */
  column-gap: 30px; /* 列间距 */
  
  /* 旧写法（兼容性） */
  grid-gap: 20px;
  grid-row-gap: 20px;
  grid-column-gap: 30px;
}
```

#### 完整示例

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3列 */
  grid-template-rows: repeat(3, 100px);   /* 3行，每行100px */
  gap: 20px;
}
```

---

### 1.3 子项属性：指定位置和大小 ⭐ **核心**

这是**最核心的部分**：如何指定任意 div 在第几行第几列占几个份。

#### 方法1：使用 `grid-column` 和 `grid-row`（推荐）

**语法**：
```css
.item {
  grid-column: <start-line> / <end-line>;
  grid-row: <start-line> / <end-line>;
}
```

**示例**：

```html
<div class="container">
  <div class="item1">1</div>
  <div class="item2">2</div>
  <div class="item3">3</div>
  <div class="item4">4</div>
  <div class="item5">5</div>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);  /* 4列 */
  grid-template-rows: repeat(3, 100px);   /* 3行 */
  gap: 10px;
}

/* 第1个 div：第1行，第1列，占1列 */
.item1 {
  grid-column: 1 / 2;  /* 从第1列线到第2列线 */
  grid-row: 1 / 2;     /* 从第1行线到第2行线 */
}

/* 第2个 div：第1行，第2列，占2列 */
.item2 {
  grid-column: 2 / 4;  /* 从第2列线到第4列线（占2列） */
  grid-row: 1 / 2;     /* 第1行 */
}

/* 第3个 div：第2行，第1列，占2行 */
.item3 {
  grid-column: 1 / 2;  /* 第1列 */
  grid-row: 2 / 4;     /* 从第2行线到第4行线（占2行） */
}

/* 第4个 div：第2行，第2-4列，占1行2列 */
.item4 {
  grid-column: 2 / 4;  /* 从第2列线到第4列线（占2列） */
  grid-row: 2 / 3;     /* 第2行 */
}

/* 第5个 div：第3行，第2-4列 */
.item5 {
  grid-column: 2 / 4;  /* 占2列 */
  grid-row: 3 / 4;     /* 第3行 */
}
```

**可视化**：

```
┌─────┬─────────────┐
│  1  │      2      │  ← 第1行
├─────┼─────┬───────┤
│  3  │  4  │       │  ← 第2行
│     ├─────┴───────┤
│     │      5      │  ← 第3行
└─────┴─────────────┘
```

#### 方法2：使用 `span` 关键字（更直观）

**语法**：
```css
.item {
  grid-column: <start-line> / span <columns>;
  grid-row: <start-line> / span <rows>;
}
```

**示例**：

```css
/* 第1个 div：第1行第1列，占1列 */
.item1 {
  grid-column: 1 / span 1;  /* 从第1列开始，占1列 */
  grid-row: 1 / span 1;     /* 从第1行开始，占1行 */
}

/* 第2个 div：第1行第2列，占2列 */
.item2 {
  grid-column: 2 / span 2;   /* 从第2列开始，占2列 */
  grid-row: 1 / span 1;      /* 占1行 */
}

/* 第3个 div：第2行第1列，占2行 */
.item3 {
  grid-column: 1 / span 1;   /* 占1列 */
  grid-row: 2 / span 2;      /* 从第2行开始，占2行 */
}

/* 第4个 div：第2行第2列，占2列1行 */
.item4 {
  grid-column: 2 / span 2;   /* 占2列 */
  grid-row: 2 / span 1;      /* 占1行 */
}

/* 第5个 div：第3行第2列，占2列 */
.item5 {
  grid-column: 2 / span 2;   /* 占2列 */
  grid-row: 3 / span 1;     /* 占1行 */
}
```

#### 方法3：使用简写属性

**`grid-column-start` / `grid-column-end`**：

```css
.item {
  grid-column-start: 1;    /* 从第1列线开始 */
  grid-column-end: 3;      /* 到第3列线结束（占2列） */
  
  grid-row-start: 2;       /* 从第2行线开始 */
  grid-row-end: 4;         /* 到第4行线结束（占2行） */
}
```

**等价于**：
```css
.item {
  grid-column: 1 / 3;
  grid-row: 2 / 4;
}
```

#### 方法4：使用 `grid-area`（最简洁）

**语法**：
```css
.item {
  grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
}
```

**示例**：

```css
/* 第1个 div：第1行第1列，占1行1列 */
.item1 {
  grid-area: 1 / 1 / 2 / 2;
  /* 行开始 / 列开始 / 行结束 / 列结束 */
}

/* 第2个 div：第1行第2列，占1行2列 */
.item2 {
  grid-area: 1 / 2 / 2 / 4;
}

/* 第3个 div：第2行第1列，占2行1列 */
.item3 {
  grid-area: 2 / 1 / 4 / 2;
}

/* 第4个 div：第2行第2列，占1行2列 */
.item4 {
  grid-area: 2 / 2 / 3 / 4;
}

/* 第5个 div：第3行第2列，占1行2列 */
.item5 {
  grid-area: 3 / 2 / 4 / 4;
}
```

**记忆技巧**：
- `grid-area: 行开始 / 列开始 / 行结束 / 列结束`
- 可以理解为：`grid-area: top / left / bottom / right`

---

### 1.4 命名网格线

给网格线起名字，让代码更易读。

```css
.container {
  display: grid;
  grid-template-columns: [start] 1fr [middle] 1fr [end];
  grid-template-rows: [header-start] 100px [header-end content-start] 1fr [content-end];
}

.item {
  grid-column: start / end;           /* 使用命名线 */
  grid-row: header-start / content-end;
}
```

**多行命名**：

```css
.container {
  display: grid;
  grid-template-columns: 
    [sidebar-start] 200px 
    [sidebar-end main-start] 1fr 
    [main-end];
  grid-template-rows: 
    [header-start] 80px 
    [header-end content-start] 1fr 
    [content-end footer-start] 60px 
    [footer-end];
}

.sidebar {
  grid-column: sidebar-start / sidebar-end;
  grid-row: header-end / footer-start;
}

.main {
  grid-column: main-start / main-end;
  grid-row: content-start / content-end;
}
```

---

### 1.5 命名区域（Grid Areas）

使用**命名区域**是最直观的方式，特别适合复杂布局。

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 80px 1fr 60px;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
}

.header {
  grid-area: header;  /* 自动占据 header 区域 */
}

.sidebar {
  grid-area: sidebar;
}

.main {
  grid-area: main;
}

.aside {
  grid-area: aside;
}

.footer {
  grid-area: footer;
}
```

**布局效果**：

```
┌─────────────────────────┐
│        header           │
├──────┬─────────┬────────┤
│sidebar│  main  │ aside  │
├──────┴─────────┴────────┤
│        footer           │
└─────────────────────────┘
```

**留空区域**：

```css
.container {
  grid-template-areas:
    "header header header"
    "sidebar main ."      /* . 表示空白区域 */
    "footer footer footer";
}
```

---

### 1.6 实战案例

#### 案例1：经典网站布局

```html
<div class="layout">
  <header>Header</header>
  <aside>Sidebar</aside>
  <main>Main Content</main>
  <footer>Footer</footer>
</div>
```

```css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 80px 1fr 60px;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  gap: 20px;
  min-height: 100vh;
}

header { grid-area: header; }
aside { grid-area: sidebar; }
main { grid-area: main; }
footer { grid-area: footer; }
```

#### 案例2：卡片网格（响应式）

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* 某个卡片占据2列 */
.card-featured {
  grid-column: span 2;  /* 占据2列 */
}
```

#### 案例3：复杂布局（指定任意位置）

```html
<div class="complex-grid">
  <div class="item-a">A</div>
  <div class="item-b">B</div>
  <div class="item-c">C</div>
  <div class="item-d">D</div>
  <div class="item-e">E</div>
</div>
```

```css
.complex-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 100px);
  gap: 10px;
}

/* A: 第1行第1列，占1列 */
.item-a {
  grid-area: 1 / 1 / 2 / 2;
}

/* B: 第1行第2-4列，占3列 */
.item-b {
  grid-area: 1 / 2 / 2 / 5;  /* 或 grid-column: 2 / 5; */
}

/* C: 第2-3行第1列，占2行 */
.item-c {
  grid-area: 2 / 1 / 4 / 2;  /* 或 grid-row: 2 / 4; */
}

/* D: 第2行第2-3列，占2列 */
.item-d {
  grid-area: 2 / 2 / 3 / 4;
}

/* E: 第2行第4列，第3行第2-4列（跨行跨列） */
.item-e {
  grid-column: 2 / 5;  /* 第2-4列 */
  grid-row: 2 / 4;     /* 第2-3行 */
}
```

**布局效果**：

```
┌─────┬─────────────────┐
│  A  │        B        │  ← 第1行
├─────┼─────┬─────┬─────┤
│  C  │  D  │     │  E  │  ← 第2行
│     ├─────┴─────┴─────┤
│     │        E        │  ← 第3行
└─────┴─────────────────┘
```

#### 案例4：使用 span 的简洁写法

```css
.complex-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(4, 80px);
  gap: 10px;
}

/* 第1个：第1行第1列，占2列1行 */
.item-1 {
  grid-column: 1 / span 2;
  grid-row: 1 / span 1;
}

/* 第2个：第1行第3列，占4列1行 */
.item-2 {
  grid-column: 3 / span 4;
  grid-row: 1 / span 1;
}

/* 第3个：第2行第1列，占1列3行 */
.item-3 {
  grid-column: 1 / span 1;
  grid-row: 2 / span 3;
}

/* 第4个：第2行第2-4列，占3列1行 */
.item-4 {
  grid-column: 2 / span 3;
  grid-row: 2 / span 1;
}

/* 第5个：第2行第5-6列，占2列2行 */
.item-5 {
  grid-column: 5 / span 2;
  grid-row: 2 / span 2;
}

/* 第6个：第3行第2-4列，占3列1行 */
.item-6 {
  grid-column: 2 / span 3;
  grid-row: 3 / span 1;
}

/* 第7个：第4行第2-6列，占5列1行 */
.item-7 {
  grid-column: 2 / span 5;
  grid-row: 4 / span 1;
}
```

---

## 二、Flexbox 布局

### 2.1 Flex 基础概念

**Flexbox（弹性盒子）** 是 CSS 的**一维布局系统**，适合**行或列**的布局。

```css
.container {
  display: flex;  /* 或 inline-flex */
}
```

**核心概念**：
- **Flex 容器（Flex Container）**：设置 `display: flex` 的元素
- **Flex 项目（Flex Item）**：容器的直接子元素
- **主轴（Main Axis）**：Flex 项目的排列方向
- **交叉轴（Cross Axis）**：垂直于主轴的方向

---

### 2.2 容器属性

#### `flex-direction`：主轴方向

```css
.container {
  flex-direction: row;        /* 默认：水平，从左到右 */
  flex-direction: row-reverse; /* 水平，从右到左 */
  flex-direction: column;     /* 垂直，从上到下 */
  flex-direction: column-reverse; /* 垂直，从下到上 */
}
```

#### `justify-content`：主轴对齐

```css
.container {
  justify-content: flex-start;    /* 默认：左对齐 */
  justify-content: flex-end;      /* 右对齐 */
  justify-content: center;        /* 居中 */
  justify-content: space-between; /* 两端对齐 */
  justify-content: space-around;  /* 环绕分布 */
  justify-content: space-evenly;  /* 均匀分布 */
}
```

#### `align-items`：交叉轴对齐

```css
.container {
  align-items: stretch;     /* 默认：拉伸 */
  align-items: flex-start;  /* 顶部对齐 */
  align-items: flex-end;    /* 底部对齐 */
  align-items: center;      /* 居中 */
  align-items: baseline;    /* 基线对齐 */
}
```

#### `flex-wrap`：换行

```css
.container {
  flex-wrap: nowrap;  /* 默认：不换行 */
  flex-wrap: wrap;    /* 换行 */
  flex-wrap: wrap-reverse; /* 反向换行 */
}
```

#### `gap`：间距

```css
.container {
  gap: 20px;        /* 统一间距 */
  row-gap: 10px;    /* 行间距 */
  column-gap: 20px; /* 列间距 */
}
```

---

### 2.3 子项属性

#### `flex`：弹性比例

```css
.item {
  flex: 1;           /* 等分剩余空间 */
  flex: 2;           /* 占据2倍空间 */
  flex: 0 1 auto;    /* 不放大，可缩小，默认大小 */
  flex: 1 1 200px;   /* 放大1倍，缩小1倍，基础200px */
}
```

**简写**：
- `flex: <grow> <shrink> <basis>`
- `flex-grow`：放大比例
- `flex-shrink`：缩小比例
- `flex-basis`：基础大小

#### `align-self`：单独对齐

```css
.item {
  align-self: auto;      /* 继承父容器 */
  align-self: flex-start;
  align-self: flex-end;
  align-self: center;
}
```

#### `order`：排序

```css
.item {
  order: 0;  /* 默认 */
  order: 1;  /* 排在后面 */
  order: -1; /* 排在前面 */
}
```

---

### 2.4 实战案例

#### 案例1：水平居中

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

#### 案例2：导航栏

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  flex: 0 0 auto;
}

.nav-links {
  display: flex;
  gap: 20px;
}
```

#### 案例3：卡片列表

```css
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 300px;  /* 最小300px，可放大可缩小 */
  max-width: 400px;
}
```

---

## 三、Grid vs Flexbox 选择指南

### 何时使用 Grid？

✅ **二维布局**（需要同时控制行和列）
- 复杂网站布局（header, sidebar, main, footer）
- 卡片网格
- 表单布局
- 需要精确控制元素位置

### 何时使用 Flexbox？

✅ **一维布局**（只需要控制行或列）
- 导航栏
- 按钮组
- 居中内容
- 等分布局
- 对齐和分布

### 组合使用

**Grid 作为外层布局，Flexbox 作为内层布局**：

```css
/* 外层：Grid 控制整体结构 */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}

/* 内层：Flexbox 控制内容排列 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
```

---

## 📚 快速参考

### Grid 核心属性速查

**容器**：
- `display: grid`
- `grid-template-columns`
- `grid-template-rows`
- `gap`

**子项**：
- `grid-column: <start> / <end>` 或 `grid-column: <start> / span <n>`
- `grid-row: <start> / <end>` 或 `grid-row: <start> / span <n>`
- `grid-area: <row-start> / <col-start> / <row-end> / <col-end>`

### Flexbox 核心属性速查

**容器**：
- `display: flex`
- `flex-direction`
- `justify-content`
- `align-items`
- `flex-wrap`
- `gap`

**子项**：
- `flex: <grow> <shrink> <basis>`
- `align-self`
- `order`

---

## 🎯 总结

1. **Grid 适合二维布局**，可以精确控制任意元素的位置和大小
2. **指定位置的核心方法**：
   - `grid-column: 2 / 4`（从第2列线到第4列线，占2列）
   - `grid-column: 2 / span 2`（从第2列开始，占2列）
   - `grid-area: 1 / 2 / 3 / 4`（行开始/列开始/行结束/列结束）
3. **Flexbox 适合一维布局**，简单快速
4. **两者可以组合使用**，Grid 做外层，Flexbox 做内层

---

#css #布局 #Grid #Flexbox #前端基础
