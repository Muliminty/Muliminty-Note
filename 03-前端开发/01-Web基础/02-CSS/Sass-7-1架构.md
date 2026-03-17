# Sass 7-1 架构（7-1 Pattern）

> Sass **7-1 架构（7-1 Pattern）**是一种**组织 Sass/SCSS 文件结构的最佳实践**，主要用于**中大型前端项目**，目的是让样式**更清晰、可维护、可扩展**。

---

## 📋 目录

- [一、7-1 架构的整体结构](#一7-1-架构的整体结构)
- [二、7 个文件夹分别干嘛的？](#二7-个文件夹分别干嘛的)
- [三、main.scss 怎么写？](#三mainscss-怎么写)
- [四、7-1 架构的优点](#四7-1-架构的优点)
- [五、什么时候该用 7-1？](#五什么时候该用-7-1)
- [六、实战案例](#六实战案例)
- [七、最佳实践与注意事项](#七最佳实践与注意事项)

---

## 一、7-1 架构的整体结构

名字里的 **7-1** 含义是：

> **7 个文件夹 + 1 个主入口文件**

典型目录结构如下（以 SCSS 为例）：

```txt
styles/
│
├── abstracts/   // 工具层
├── base/        // 基础样式
├── components/  // 组件
├── layout/      // 布局
├── pages/       // 页面级样式
├── themes/      // 主题
├── vendors/     // 第三方样式
│
└── main.scss    // 唯一入口文件
```

`main.scss` 只负责 **@use / @import** 其他文件，不写具体样式。

---

## 二、7 个文件夹分别干嘛的？

### 1️⃣ abstracts（抽象层 / 工具层）

**不输出 CSS，只提供能力**

```txt
abstracts/
├── _variables.scss   // 变量
├── _mixins.scss      // mixin
├── _functions.scss   // 函数
├── _placeholders.scss // 占位符选择器
```

**特点**：

* ❌ 不直接生成 CSS
* ✅ 给其他文件用

**示例**：

```scss
// abstracts/_variables.scss
$primary-color: #1677ff;
$secondary-color: #52c41a;
$font-size-base: 14px;
$spacing-unit: 8px;

// 颜色系统
$colors: (
  'primary': #1677ff,
  'success': #52c41a,
  'warning': #faad14,
  'error': #ff4d4f,
);

// 断点
$breakpoints: (
  'xs': 0,
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
);
```

```scss
// abstracts/_mixins.scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}

@mixin text-ellipsis($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

```scss
// abstracts/_functions.scss
@function spacing($multiplier) {
  @return $spacing-unit * $multiplier;
}

@function color($name) {
  @return map-get($colors, $name);
}
```

```scss
// abstracts/_placeholders.scss
%button-base {
  padding: spacing(1) spacing(2);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}
```

---

### 2️⃣ base（基础样式）

**项目的"地基"**

```txt
base/
├── _reset.scss
├── _normalize.scss
├── _typography.scss
├── _base.scss
```

**包括**：

* reset / normalize
* body、html、a、h1-h6 等标签样式
* 全局字体、行高

**示例**：

```scss
// base/_reset.scss
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}
```

```scss
// base/_typography.scss
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: $font-size-base;
  line-height: 1.5;
  color: #333;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: spacing(1);
}

h1 { font-size: 32px; }
h2 { font-size: 24px; }
h3 { font-size: 20px; }
```

```scss
// base/_base.scss
a {
  color: $primary-color;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

img {
  max-width: 100%;
  height: auto;
}
```

---

### 3️⃣ components（组件）

**可复用的小组件**

```txt
components/
├── _button.scss
├── _modal.scss
├── _card.scss
├── _form.scss
├── _input.scss
```

**特点**：

* 粒度小
* 可复用
* 不依赖具体页面

👉 非常适合 React / Vue 组件样式

**示例**：

```scss
// components/_button.scss
@use '../abstracts' as *;

.btn {
  @extend %button-base;
  
  &--primary {
    background-color: color('primary');
    color: white;
    
    &:hover {
      background-color: darken(color('primary'), 10%);
    }
  }
  
  &--secondary {
    background-color: color('success');
    color: white;
  }
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

```scss
// components/_card.scss
@use '../abstracts' as *;

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: spacing(2);
  
  &__header {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: spacing(1);
  }
  
  &__body {
    color: #666;
  }
}
```

---

### 4️⃣ layout（布局）

**页面结构相关**

```txt
layout/
├── _header.scss
├── _footer.scss
├── _sidebar.scss
├── _grid.scss
├── _container.scss
```

**关注点**：

* header / footer
* 栅格系统
* 页面骨架

**示例**：

```scss
// layout/_header.scss
@use '../abstracts' as *;

.header {
  height: 64px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  @include flex-center;
  
  &__logo {
    font-size: 20px;
    font-weight: bold;
  }
  
  &__nav {
    margin-left: auto;
  }
}
```

```scss
// layout/_grid.scss
@use '../abstracts' as *;

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 spacing(2);
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -spacing(1);
}

.col {
  padding: 0 spacing(1);
  
  @for $i from 1 through 12 {
    &--#{$i} {
      width: percentage($i / 12);
    }
  }
}
```

---

### 5️⃣ pages（页面级样式）

**只给某一个页面用**

```txt
pages/
├── _home.scss
├── _login.scss
├── _dashboard.scss
├── _profile.scss
```

**特点**：

* 强业务
* 不可复用
* 覆盖组件样式

**示例**：

```scss
// pages/_home.scss
@use '../abstracts' as *;
@use '../components/card' as *;
@use '../layout/header' as *;

.home {
  &__hero {
    height: 500px;
    background: linear-gradient(135deg, color('primary'), color('success'));
    @include flex-center;
    color: white;
  }
  
  &__feature-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: spacing(2);
    margin-top: spacing(4);
    
    @include respond-to('md') {
      grid-template-columns: 1fr;
    }
  }
}
```

---

### 6️⃣ themes（主题）

**换肤 / 多主题**

```txt
themes/
├── _light.scss
├── _dark.scss
├── _variables.scss
```

**一般做法**：

* 覆盖变量
* 或用 CSS 变量 + Sass 辅助

**示例**：

```scss
// themes/_light.scss
@use '../abstracts/variables' as *;

:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #e8e8e8;
}
```

```scss
// themes/_dark.scss
@use '../abstracts/variables' as *;

:root {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --border-color: #333333;
}

[data-theme='dark'] {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

---

### 7️⃣ vendors（第三方库）

**外部依赖**

```txt
vendors/
├── _bootstrap.scss
├── _antd.scss
├── _normalize.scss
```

**用途**：

* 覆盖第三方样式
* 避免和自己代码混在一起

**示例**：

```scss
// vendors/_bootstrap.scss
// 只导入需要的 Bootstrap 组件
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins';
@import '~bootstrap/scss/grid';
```

```scss
// vendors/_antd.scss
// 覆盖 Ant Design 默认样式
.ant-btn {
  border-radius: 4px;
}
```

---

## 三、main.scss 怎么写？

`main.scss` 是**唯一编译入口**，按照依赖顺序导入：

```scss
// main.scss

// ============================================
// 1. 工具层（必须最先导入）
// ============================================
@use 'abstracts/variables';
@use 'abstracts/mixins';
@use 'abstracts/functions';
@use 'abstracts/placeholders';

// ============================================
// 2. 第三方库（在基础样式之前）
// ============================================
@use 'vendors/normalize';
@use 'vendors/bootstrap';

// ============================================
// 3. 基础样式（地基）
// ============================================
@use 'base/reset';
@use 'base/typography';
@use 'base/base';

// ============================================
// 4. 布局（页面骨架）
// ============================================
@use 'layout/container';
@use 'layout/header';
@use 'layout/footer';
@use 'layout/grid';

// ============================================
// 5. 组件（可复用组件）
// ============================================
@use 'components/button';
@use 'components/card';
@use 'components/modal';
@use 'components/form';

// ============================================
// 6. 页面级样式（业务相关）
// ============================================
@use 'pages/home';
@use 'pages/login';
@use 'pages/dashboard';

// ============================================
// 7. 主题（最后覆盖）
// ============================================
@use 'themes/light';
// @use 'themes/dark'; // 按需启用
```

> **注意**：新版 Sass **推荐 `@use` / `@forward`，不再推荐 `@import`**

### @use vs @import

**@use（推荐）**：
- ✅ 模块化，避免命名冲突
- ✅ 只加载一次
- ✅ 支持命名空间

```scss
@use 'abstracts/variables' as vars;

.button {
  color: vars.$primary-color;
}
```

**@import（已废弃）**：
- ❌ 全局作用域，容易冲突
- ❌ 可能重复加载
- ⚠️ Sass 官方计划移除

---

## 四、7-1 架构的优点

✅ **适合大型项目**：结构清晰，易于维护  
✅ **职责清晰**：找样式不痛苦，每个文件职责单一  
✅ **团队协作**：冲突少，多人协作更顺畅  
✅ **组件化友好**：与 React/Vue 组件化思想一致  
✅ **可扩展性强**：新增功能只需在对应目录添加文件  
✅ **易于重构**：模块化设计，重构成本低

---

## 五、什么时候该用 7-1？

| 项目类型           | 是否推荐   | 说明                    |
| -------------- | ------ | --------------------- |
| 小 demo / 练习项目    | ❌ 太重   | 过度设计，增加复杂度            |
| 中后台管理系统         | ✅ 强烈推荐 | 组件多、页面多，非常适合          |
| 电商网站            | ✅ 强烈推荐 | 页面复杂，需要清晰的样式组织        |
| React / Vue 工程   | ✅ 很适合  | 与组件化思想契合              |
| 多主题系统           | ✅ 必须   | themes 目录天然支持          |
| 企业级应用           | ✅ 强烈推荐 | 长期维护，结构清晰很重要         |
| 个人博客 / 简单网站     | ⚠️ 可选   | 如果未来可能扩展，可以提前规划      |

---

## 六、实战案例

### 案例 1：React + Sass 7-1 架构项目

**项目结构**：

```txt
my-react-app/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.module.scss  # 组件样式
│   │   └── Card/
│   │       ├── Card.tsx
│   │       └── Card.module.scss
│   └── styles/                      # 全局样式（7-1 架构）
│       ├── abstracts/
│       │   ├── _variables.scss
│       │   ├── _mixins.scss
│       │   └── _functions.scss
│       ├── base/
│       │   ├── _reset.scss
│       │   └── _typography.scss
│       ├── components/
│       │   ├── _button.scss
│       │   └── _card.scss
│       ├── layout/
│       │   ├── _header.scss
│       │   └── _container.scss
│       ├── pages/
│       │   └── _home.scss
│       ├── vendors/
│       │   └── _normalize.scss
│       └── main.scss
├── package.json
└── vite.config.ts
```

**main.scss**：

```scss
// src/styles/main.scss
@use 'abstracts/variables' as *;
@use 'abstracts/mixins' as *;
@use 'base/reset';
@use 'base/typography';
@use 'layout/container';
@use 'components/button';
```

**在 React 中使用**：

```tsx
// src/main.tsx
import './styles/main.scss';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
```

**组件样式（CSS Modules）**：

```scss
// src/components/Button/Button.module.scss
@use '../../styles/abstracts' as *;

.button {
  @extend %button-base;
  padding: spacing(1) spacing(2);
  
  &--primary {
    background-color: color('primary');
  }
}
```

```tsx
// src/components/Button/Button.tsx
import styles from './Button.module.scss';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children }: ButtonProps) => {
  return (
    <button className={`${styles.button} ${styles[`button--${variant}`]}`}>
      {children}
    </button>
  );
};
```

---

### 案例 2：Vue 3 + Sass 7-1 架构项目

**项目结构**：

```txt
my-vue-app/
├── src/
│   ├── components/
│   │   └── BaseButton.vue
│   └── styles/
│       ├── abstracts/
│       ├── base/
│       ├── components/
│       ├── layout/
│       ├── pages/
│       ├── vendors/
│       └── main.scss
└── vite.config.ts
```

**vite.config.ts 配置**：

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/abstracts/variables" as *;`
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
```

**Vue 组件中使用**：

```vue
<!-- src/components/BaseButton.vue -->
<template>
  <button :class="['base-button', `base-button--${variant}`]">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary';
}>();
</script>

<style lang="scss" scoped>
@use '@/styles/abstracts' as *;

.base-button {
  @extend %button-base;
  padding: spacing(1) spacing(2);
  
  &--primary {
    background-color: color('primary');
    color: white;
  }
  
  &--secondary {
    background-color: color('success');
    color: white;
  }
}
</style>
```

---

### 案例 3：Next.js + Sass 7-1 架构

**项目结构**：

```txt
my-next-app/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── styles/
│   ├── abstracts/
│   ├── base/
│   ├── components/
│   ├── layout/
│   ├── pages/
│   ├── vendors/
│   └── main.scss
└── next.config.js
```

**next.config.js**：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./styles'],
    prependData: `@use "abstracts/variables" as *;`
  }
};

module.exports = nextConfig;
```

**app/layout.tsx**：

```tsx
import '../styles/main.scss';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
```

---

### 案例 4：多主题切换实现

**themes/_variables.scss**：

```scss
// themes/_variables.scss
$themes: (
  'light': (
    'bg-color': #ffffff,
    'text-color': #333333,
    'primary-color': #1677ff,
  ),
  'dark': (
    'bg-color': #1a1a1a,
    'text-color': #ffffff,
    'primary-color': #4a9eff,
  ),
);

@function theme($theme-name, $color-name) {
  @return map-get(map-get($themes, $theme-name), $color-name);
}
```

**themes/_light.scss**：

```scss
// themes/_light.scss
@use 'variables' as *;

[data-theme='light'] {
  background-color: theme('light', 'bg-color');
  color: theme('light', 'text-color');
  
  .button {
    background-color: theme('light', 'primary-color');
  }
}
```

**themes/_dark.scss**：

```scss
// themes/_dark.scss
@use 'variables' as *;

[data-theme='dark'] {
  background-color: theme('dark', 'bg-color');
  color: theme('dark', 'text-color');
  
  .button {
    background-color: theme('dark', 'primary-color');
  }
}
```

**JavaScript 切换主题**：

```typescript
// utils/theme.ts
export const setTheme = (theme: 'light' | 'dark') => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

export const getTheme = (): 'light' | 'dark' => {
  return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
};

// 初始化
setTheme(getTheme());
```

---

### 案例 5：响应式设计实践

**abstracts/_mixins.scss**（响应式 Mixin）：

```scss
// abstracts/_mixins.scss
$breakpoints: (
  'xs': 0,
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
  'xxl': 1600px,
);

@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  } @else {
    @warn "Unknown breakpoint: #{$breakpoint}";
  }
}

@mixin respond-below($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (max-width: map-get($breakpoints, $breakpoint) - 1px) {
      @content;
    }
  }
}

@mixin respond-between($min, $max) {
  @media (min-width: map-get($breakpoints, $min)) and (max-width: map-get($breakpoints, $max) - 1px) {
    @content;
  }
}
```

**使用示例**：

```scss
// components/_card.scss
@use '../abstracts' as *;

.card {
  padding: spacing(2);
  
  @include respond-to('md') {
    padding: spacing(3);
  }
  
  @include respond-to('lg') {
    padding: spacing(4);
  }
  
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: spacing(2);
    
    @include respond-to('md') {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @include respond-to('lg') {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
```

---

## 七、最佳实践与注意事项

### 1. 文件命名规范

✅ **推荐**：
- 使用下划线前缀：`_variables.scss`（表示部分文件，不会单独编译）
- 使用 kebab-case：`_button-group.scss`

❌ **避免**：
- 驼峰命名：`buttonGroup.scss`
- 无下划线前缀：`variables.scss`（会被单独编译）

### 2. @use 命名空间

**方式 1：使用命名空间（推荐）**

```scss
@use 'abstracts/variables' as vars;
@use 'abstracts/mixins' as mixins;

.button {
  color: vars.$primary-color;
  @include mixins.flex-center;
}
```

**方式 2：使用 `as *`（谨慎使用）**

```scss
@use 'abstracts/variables' as *;
@use 'abstracts/mixins' as *;

.button {
  color: $primary-color;  // 直接使用，可能冲突
  @include flex-center;
}
```

### 3. @forward 的使用

当需要重新导出模块时使用 `@forward`：

```scss
// abstracts/_index.scss
@forward 'variables';
@forward 'mixins';
@forward 'functions';

// 其他文件可以这样导入
@use 'abstracts' as *;
```

### 4. 避免循环依赖

❌ **错误示例**：

```scss
// abstracts/_variables.scss
@use 'mixins';

// abstracts/_mixins.scss
@use 'variables';  // 循环依赖！
```

✅ **正确做法**：

```scss
// abstracts/_variables.scss
$primary-color: #1677ff;

// abstracts/_mixins.scss
@use 'variables' as *;

@mixin button($color: $primary-color) {
  background-color: $color;
}
```

### 5. 性能优化

- **按需导入**：只导入需要的文件
- **避免深层嵌套**：选择器嵌套不超过 3 层
- **使用 @extend 谨慎**：可能导致 CSS 体积增大

### 6. 与构建工具集成

**Webpack**：

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['src/styles']
              }
            }
          }
        ]
      }
    ]
  }
};
```

**Vite**：

```typescript
// vite.config.ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/abstracts/variables" as *;`,
        includePaths: ['src/styles']
      }
    }
  }
});
```

---

## 📚 相关资源

- [Sass 官方文档](https://sass-lang.com/documentation)
- [Sass @use 规则](https://sass-lang.com/documentation/at-rules/use)
- [Sass @forward 规则](https://sass-lang.com/documentation/at-rules/forward)

---

## 📝 总结

Sass 7-1 架构是组织大型项目样式的最佳实践：

1. **7 个文件夹**：abstracts、base、components、layout、pages、themes、vendors
2. **1 个入口文件**：main.scss 统一管理导入
3. **使用 @use**：模块化，避免命名冲突
4. **职责清晰**：每个文件夹有明确的用途
5. **易于维护**：结构清晰，团队协作顺畅

适合中大型项目，特别是 React/Vue 组件化项目和多主题系统。

---

#Sass #SCSS #7-1架构 #样式组织 #前端工程化 #CSS预处理器
