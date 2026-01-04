# CSS 过渡动画支持属性

> CSS 的 `transition` 和 `animation` 属性可以应用于大多数 CSS 属性，但并非所有属性都能产生平滑的动画效果。本文档整理了支持过渡动画的 CSS 属性。

---

## 📚 基础概念

### 过渡（Transition）
允许属性值在一定时间平滑过渡，需要两个状态：起始状态和结束状态。

```css
.element {
  transition: property duration timing-function delay;
}

/* 示例 */
.box {
  background-color: #ff0000;
  transition: background-color 0.3s ease;
}

.box:hover {
  background-color: #0000ff;
}
```

### 动画（Animation）
使用 `@keyframes` 定义动画，可以创建更复杂的多阶段动画。

```css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.element {
  animation: name duration timing-function delay iteration-count direction fill-mode;
}
```

---

## 🎨 支持过渡动画的属性

### 1. 盒模型属性（Box Model）

#### 宽高与边距
```css
.element {
  transition:
    width 0.3s ease,
    height 0.3s ease,
    min-width 0.3s ease,
    max-width 0.3s ease,
    min-height 0.3s ease,
    max-height 0.3s ease,
    margin 0.3s ease,
    margin-top 0.3s ease,
    margin-right 0.3s ease,
    margin-bottom 0.3s ease,
    margin-left 0.3s ease,
    padding 0.3s ease,
    padding-top 0.3s ease,
    padding-right 0.3s ease,
    padding-bottom 0.3s ease,
    padding-left 0.3s ease;
}
```

#### 边框
```css
.element {
  transition:
    border-width 0.3s ease,
    border-color 0.3s ease,
    border-top-width 0.3s ease,
    border-right-width 0.3s ease,
    border-bottom-width 0.3s ease,
    border-left-width 0.3s ease,
    border-top-color 0.3s ease,
    border-right-color 0.3s ease,
    border-bottom-color 0.3s ease,
    border-left-color 0.3s ease,
    border-style 0.3s ease;  /* 部分浏览器支持 */
}
```

#### 圆角
```css
.element {
  transition:
    border-radius 0.3s ease,
    border-top-left-radius 0.3s ease,
    border-top-right-radius 0.3s ease,
    border-bottom-right-radius 0.3s ease,
    border-bottom-left-radius 0.3s ease;
}
```

#### 轮廓
```css
.element {
  transition:
    outline-width 0.3s ease,
    outline-color 0.3s ease,
    outline-offset 0.3s ease;
}
```

### 2. 定位与布局属性

#### 定位
```css
.element {
  transition:
    top 0.3s ease,
    right 0.3s ease,
    bottom 0.3s ease,
    left 0.3s ease;
}
```

#### Flexbox 属性
```css
.flex-item {
  transition:
    flex-grow 0.3s ease,
    flex-shrink 0.3s ease,
    flex-basis 0.3s ease,
    order 0.3s ease;
}

.flex-container {
  /* 容器属性支持有限 */
  transition: gap 0.3s ease;
}
```

#### Grid 属性
```css
.grid-item {
  transition:
    grid-column-start 0.3s ease,
    grid-column-end 0.3s ease,
    grid-row-start 0.3s ease,
    grid-row-end 0.3s ease;
}
```

### 3. 变换属性（Transform）

Transform 是性能最好的动画属性，因为可以触发 GPU 加速。

```css
.element {
  transition: transform 0.3s ease;
}

/* 可动画的变换值 */
.transform-element:hover {
  transform:
    translate(100px, 50px)     /* 平移 */
    scale(1.2)                  /* 缩放 */
    rotate(45deg)                /* 旋转 */
    skew(10deg, 5deg)           /* 倾斜 */
    perspective(500px);         /* 透视 */
}

/* 单独使用变换函数 */
.element:hover {
  transform: translateX(100px);  /* X 轴平移 */
  transform: translateY(50px);    /* Y 轴平移 */
  transform: scale(1.5);         /* 缩放 */
  transform: rotate(180deg);      /* 旋转 */
}
```

**3D 变换**：
```css
.element {
  transition: transform 0.5s ease;
  transform-style: preserve-3d;
}

.element:hover {
  transform:
    translate3d(100px, 50px, 20px)
    rotateX(45deg)
    rotateY(45deg)
    rotateZ(45deg)
    scale3d(1.2, 1.2, 1.2);
}
```

### 4. 颜色属性

#### 文本颜色
```css
.element {
  transition:
    color 0.3s ease,
    opacity 0.3s ease;
}
```

#### 背景颜色
```css
.element {
  transition:
    background-color 0.3s ease,
    background-image 0.3s ease;  /* 渐变可以过渡 */
}
```

#### 边框颜色
```css
.element {
  transition:
    border-color 0.3s ease,
    border-top-color 0.3s ease,
    border-right-color 0.3s ease,
    border-bottom-color 0.3s ease,
    border-left-color 0.3s ease;
}
```

#### 其他颜色属性
```css
.element {
  transition:
    outline-color 0.3s ease,
    column-rule-color 0.3s ease,
    text-decoration-color 0.3s ease;
}
```

### 5. 背景属性

```css
.element {
  transition:
    background-color 0.3s ease,
    background-position 0.3s ease,
    background-size 0.3s ease,
    background-image 0.3s ease;  /* 仅支持渐变 */
}
```

**示例**：
```css
.gradient-box {
  width: 200px;
  height: 200px;
  background: linear-gradient(90deg, #ff0000, #0000ff);
  transition: background-image 0.5s ease;
}

.gradient-box:hover {
  background: linear-gradient(90deg, #00ff00, #ffff00);
}
```

### 6. 字体与文本属性

```css
.element {
  transition:
    font-size 0.3s ease,
    font-weight 0.3s ease,
    line-height 0.3s ease,
    letter-spacing 0.3s ease,
    word-spacing 0.3s ease,
    text-indent 0.3s ease,
    text-shadow 0.3s ease;
}
```

**示例**：
```css
.text-element {
  font-size: 16px;
  transition: font-size 0.3s ease, letter-spacing 0.3s ease;
}

.text-element:hover {
  font-size: 20px;
  letter-spacing: 2px;
}
```

### 7. 阴影属性

```css
.element {
  transition:
    box-shadow 0.3s ease,
    text-shadow 0.3s ease,
    drop-shadow 0.3s ease;  /* filter 属性 */
}
```

**示例**：
```css
.card {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
```

### 8. 滤镜属性

```css
.element {
  transition: filter 0.3s ease;
}

.element:hover {
  filter:
    blur(5px)          /* 模糊 */
    brightness(1.2)     /* 亮度 */
    contrast(1.2)       /* 对比度 */
    grayscale(0.5)      /* 灰度 */
    sepia(0.5)         /* 褐色 */
    saturate(1.5)       /* 饱和度 */
    hue-rotate(90deg)   /* 色相旋转 */
    invert(0.2)        /* 反转 */
    drop-shadow(2px 2px 5px rgba(0,0,0,0.3));
}
```

### 9. Flexbox/Grid 属性

#### Flexbox
```css
.flex-item {
  transition:
    flex-grow 0.3s ease,
    flex-shrink 0.3s ease,
    flex-basis 0.3s ease,
    order 0.3s ease;
}

.flex-container {
  /* 容器属性支持有限 */
  transition: gap 0.3s ease;
}
```

#### Grid
```css
.grid-item {
  transition:
    grid-column-start 0.3s ease,
    grid-column-end 0.3s ease,
    grid-row-start 0.3s ease,
    grid-row-end 0.3s ease;
}
```

### 10. 其他属性

```css
.element {
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;      /* 部分支持 */
    z-index 0.3s ease;        /* 仅支持整数 */
    clip-path 0.3s ease;      /* 部分浏览器支持 */
    mask-position 0.3s ease;
    object-position 0.3s ease;
    vertical-align 0.3s ease;
}
```

---

## ❌ 不支持或不建议的属性

### 完全不支持过渡的属性

```css
/* 这些属性不支持过渡 */
.element {
  /* 布局属性 */
  display;           /* 不支持 */
  float;             /* 不支持 */
  clear;             /* 不支持 */
  position;          /* 不支持（但 top/left 等支持） */

  /* 表格属性 */
  border-collapse;    /* 不支持 */
  border-spacing;     /* 不支持 */
  caption-side;      /* 不支持 */
  empty-cells;       /* 不支持 */
  table-layout;      /* 不支持 */

  /* 列表属性 */
  list-style-type;   /* 不支持 */
  list-style-position; /* 不支持 */
  list-style-image;  /* 不支持 */

  /* 内容属性 */
  content;          /* 不支持 */
  quotes;           /* 不支持 */
  counter-increment; /* 不支持 */
  counter-reset;    /* 不支持 */
}
```

### 不建议使用的属性

```css
/* 性能较差的属性 */
.element {
  /* 这些属性会触发重排（reflow），性能较差 */
  width;
  height;
  margin;
  padding;
  border-width;
  top;
  left;

  /* 更好的替代方案：使用 transform */
  transform: translateX(...) scale(...);
}
```

---

## 🚀 性能优化建议

### 1. 优先使用 GPU 加速属性

```css
/* ✅ 推荐：使用 transform */
.element {
  transition: transform 0.3s ease;
}

/* ❌ 避免：使用 left/top */
.element {
  transition: left 0.3s ease, top 0.3s ease;
}
```

### 2. 减少重排和重绘

```css
/* ✅ 优化：只过渡必要的属性 */
.element {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* ❌ 不推荐：过渡多个会触发重排的属性 */
.element {
  transition: width 0.3s, height 0.3s, margin 0.3s;
}
```

### 3. 使用 will-change 提示浏览器

```css
.element {
  /* 告诉浏览器该元素将会变化 */
  will-change: transform, opacity;
}

.element:hover {
  transform: scale(1.1);
}

/* 注意：不要滥用 will-change */
```

### 4. 使用硬件加速

```css
.element {
  /* 触发 GPU 加速 */
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```

---

## 💡 实用示例

### 1. 按钮悬停效果

```css
.button {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease,
    box-shadow 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.button:active {
  transform: translateY(0);
}
```

### 2. 卡片展开效果

```css
.card {
  width: 300px;
  height: 200px;
  overflow: hidden;
  transition:
    height 0.3s ease,
    box-shadow 0.3s ease;
}

.card:hover {
  height: 300px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
```

### 3. 图片淡入淡出

```css
.image {
  opacity: 0;
  transition: opacity 0.5s ease-in;
}

.image.loaded {
  opacity: 1;
}
```

### 4. 渐变动画

```css
.gradient {
  background: linear-gradient(90deg, #ff0000, #0000ff);
  background-size: 200% 200%;
  transition: background-position 0.5s ease;
}

.gradient:hover {
  background-position: 100% 0;
}
```

### 5. 3D 翻转效果

```css
.card-3d {
  perspective: 1000px;
  width: 300px;
  height: 200px;
}

.card-3d-inner {
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-3d:hover .card-3d-inner {
  transform: rotateY(180deg);
}
```

---

## 📊 属性动画性能对比

| 属性类型 | 性能 | GPU 加速 | 说明 |
| :--- | :--- | :--- | :--- |
| **transform** | ⭐⭐⭐⭐⭐ | ✅ | 最推荐，性能最好 |
| **opacity** | ⭐⭐⭐⭐⭐ | ✅ | 性能很好，常用于淡入淡出 |
| **filter** | ⭐⭐⭐⭐ | ✅ | 较新浏览器支持良好 |
| **color** | ⭐⭐⭐ | ❌ | 性能一般，但可以使用 |
| **background-color** | ⭐⭐⭐ | ❌ | 性能一般 |
| **box-shadow** | ⭐⭐ | ❌ | 性能较差，会触发重绘 |
| **width/height** | ⭐ | ❌ | 性能差，触发重排 |
| **margin/padding** | ⭐ | ❌ | 性能差，触发重排 |
| **top/left** | ⭐ | ❌ | 性能差，触发重排 |

---

## 🎯 最佳实践

### 1. 使用简写属性

```css
/* ✅ 推荐：使用简写 */
.element {
  transition: all 0.3s ease;
}

/* ❌ 不推荐：分别设置每个属性 */
.element {
  transition-property: all;
  transition-duration: 0.3s;
  transition-timing-function: ease;
}
```

### 2. 只过渡必要的属性

```css
/* ✅ 推荐：只过渡需要的属性 */
.element {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* ⚠️ 谨慎：使用 all 可能导致性能问题 */
.element {
  transition: all 0.3s ease;
}
```

### 3. 使用适当的缓动函数

```css
/* 常用缓动函数 */
.element {
  transition: transform 0.3s ease;        /* 标准 */
  transition: transform 0.3s ease-in;    /* 缓入 */
  transition: transform 0.3s ease-out;    /* 缓出 */
  transition: transform 0.3s ease-in-out; /* 缓入缓出 */

  /* 自定义贝塞尔曲线 */
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); /* 弹性效果 */
}
```

### 4. 移动优先设计

```css
/* 移动设备减少动画 */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}

/* 或针对移动设备优化 */
@media (max-width: 768px) {
  .element {
    transition: none;
  }
}
```

---

## 🔗 相关资源

- [CSS Transitions MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Transitions)
- [CSS Animations MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations)
- [CSS Transforms MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)
- [caniuse.com - CSS Transitions](https://caniuse.com/#feat=css-transitions)

---

#CSS #过渡 #动画 #性能优化
