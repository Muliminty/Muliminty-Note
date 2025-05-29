# CSS 知识地图 (MOC - Map of Content)

本文档是CSS知识体系的导航地图，整理了CSS的核心概念、布局技术、工程化方法等内容，帮助你系统地学习和掌握CSS。

## 一、CSS 基础概念

### 1. 文档流与盒子模型
- [文档流、盒子模型与BFC](./文档流、盒子模型与BFC.md) - 理解前端布局的基础概念
- [CSS 盒子模型详解](./CSS%20盒子模型详解.md) - 深入了解盒子模型的结构和计算方式

### 2. 选择器与优先级
- 基础选择器（元素、类、ID、通配符）
- 组合选择器（后代、子元素、相邻兄弟、通用兄弟）
- 伪类与伪元素
- 选择器优先级计算（特异性）

### 3. 样式属性
- 文本与字体属性（font-family, font-size, line-height等）
- 颜色与背景（color, background相关属性）
- 边框与轮廓（border, outline）
- 尺寸与盒模型相关（width, height, padding, margin）

## 二、CSS 布局技术

### 1. 传统布局方式
- 标准文档流布局
- 浮动布局（float）
- 定位布局（position）
- 弹性盒布局（Flexbox）

### 2. Grid 布局
- [深入浅出 CSS Grid 布局一篇通俗易懂的入门教程](./grid/深入浅出%20CSS%20Grid%20布局一篇通俗易懂的入门教程.md) - Grid布局基础入门
- [grid-template-columns 和 grid-template-rows 属性详解](./grid/grid-template-columns%20和%20grid-template-rows%20属性详解.md) - 定义网格的行列结构
- [grid-column 和 grid-row 属性详解](./grid/grid-column%20和%20grid-row%20属性详解.md) - 控制网格项的位置和跨度
- [place-items center 属性详解](./grid/place-items%20center%20属性详解.md) - 网格内容对齐方式

### 3. 响应式设计
- 媒体查询（Media Queries）
- 视口单位（vw, vh, vmin, vmax）
- 响应式图片处理
- 移动优先策略

## 三、CSS 工程化与预处理器

### 1. SASS/SCSS
- [SCSS 使用技巧详细文档](./CSS工程化-sass/SCSS%20使用技巧详细文档.md) - SCSS的变量、混入、嵌套等特性
- [语法：map](./CSS工程化-sass/语法：map.md) - SCSS中map数据结构的使用

### 2. CSS 架构方法论
- [ITCSS 开发规范文档](./CSS工程化-sass/ITCSS%20开发规范文档.md) - 倒三角形CSS组织方法
- BEM命名规范
- OOCSS（面向对象的CSS）
- SMACSS（可扩展和模块化的CSS）

## 四、CSS 高级特性

### 1. 变换与动画
- 2D/3D变换（transform）
- 过渡效果（transition）
- 关键帧动画（@keyframes与animation）

### 2. 自定义属性与计算
- CSS变量（自定义属性）
- calc()函数
- 自定义属性继承与作用域

### 3. 现代布局技术
- 多列布局（column-*属性）
- 网格模板区域（grid-template-areas）
- 子网格（subgrid）

## 五、CSS 性能与优化

### 1. 选择器优化
- 选择器性能考量
- 避免过度特异性
- 减少选择器嵌套

### 2. 渲染性能
- 重排（reflow）与重绘（repaint）
- 硬件加速（will-change, transform）
- 关键渲染路径优化

### 3. 文件优化
- CSS压缩与合并
- 关键CSS内联
- 按需加载
- CSS代码分割

## 六、CSS 实用技巧

### 1. 常见布局实现
- 水平垂直居中的多种方法
- 等高列布局
- 粘性页脚
- 圣杯布局与双飞翼布局

### 2. 视觉效果
- 渐变效果（linear-gradient, radial-gradient）
- 阴影效果（box-shadow, text-shadow）
- 滤镜效果（filter）
- 混合模式（mix-blend-mode, background-blend-mode）

## 七、CSS 未来趋势

### 1. CSS Houdini
- Paint API
- Layout API
- Animation API

### 2. 新特性与提案
- 容器查询（Container Queries）
- 嵌套规则（Nesting）
- 颜色函数（color-mix, color-contrast）
- 逻辑属性（logical properties）

---

本知识地图将持续更新，欢迎补充和完善！