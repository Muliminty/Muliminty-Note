# PostCSS

> PostCSS 是一个用 JavaScript 工具和插件转换 CSS 代码的工具，可以理解为 CSS 的 Babel。

---

## 📋 学习目标

- ✅ 理解 PostCSS 的核心概念
- ✅ 掌握 PostCSS 的配置方法
- ✅ 能够使用常用插件
- ✅ 理解与构建工具的集成
- ✅ 掌握 CSS 优化技巧

---

## 什么是 PostCSS

PostCSS 是一个 CSS 后处理器，主要特点：

- **插件系统**：丰富的插件生态
- **CSS 转换**：自动添加前缀、转换新特性
- **模块化**：按需使用插件
- **高性能**：基于插件的高性能处理

---

## 核心概念

### 工作流程

```
CSS 代码 → PostCSS 解析 → 插件处理 → 输出 CSS
```

### 与预处理器区别

- **预处理器**：Sass、Less（扩展 CSS 语法）
- **后处理器**：PostCSS（处理已生成的 CSS）

---

## 快速开始

### 安装

```bash
npm install -D postcss postcss-cli
```

### 基础配置

**postcss.config.js**

```javascript
module.exports = {
  plugins: [
    require('autoprefixer'),
  ],
}
```

### 使用

```bash
npx postcss src/style.css -o dist/style.css
```

---

## 常用插件

### autoprefixer

自动添加浏览器前缀：

```javascript
module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: ['> 1%', 'last 2 versions'],
    }),
  ],
}
```

### postcss-preset-env

使用未来的 CSS 特性：

```javascript
module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 2,
    }),
  ],
}
```

### cssnano

CSS 压缩：

```javascript
module.exports = {
  plugins: [
    require('cssnano')({
      preset: 'default',
    }),
  ],
}
```

### postcss-import

支持 @import：

```javascript
module.exports = {
  plugins: [
    require('postcss-import'),
  ],
}
```

### postcss-nested

支持嵌套：

```javascript
module.exports = {
  plugins: [
    require('postcss-nested'),
  ],
}
```

---

## 完整配置示例

```javascript
module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-preset-env')({
      stage: 2,
    }),
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default',
    }),
  ],
}
```

---

## 与构建工具集成

### Webpack

使用 `postcss-loader`：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer'),
                ],
              },
            },
          },
        ],
      },
    ],
  },
}
```

### Vite

Vite 内置 PostCSS 支持：

```javascript
// vite.config.js
export default {
  css: {
    postcss: {
      plugins: [
        require('autoprefixer'),
      ],
    },
  },
}
```

### Rollup

使用 `rollup-plugin-postcss`：

```javascript
import postcss from 'rollup-plugin-postcss'

export default {
  plugins: [
    postcss({
      plugins: [
        require('autoprefixer'),
      ],
    }),
  ],
}
```

---

## CSS 优化

### 自动添加前缀

```javascript
require('autoprefixer')({
  overrideBrowserslist: ['> 1%', 'last 2 versions'],
})
```

### CSS 压缩

```javascript
require('cssnano')({
  preset: 'default',
})
```

### 移除未使用的 CSS

使用 `purgecss`：

```javascript
require('@fullhuman/postcss-purgecss')({
  content: ['./src/**/*.html', './src/**/*.js'],
})
```

---

## 现代 CSS 特性

### 使用 postcss-preset-env

```javascript
require('postcss-preset-env')({
  stage: 2, // 0-4，数字越小越实验性
  features: {
    'nesting-rules': true,
  },
})
```

支持的特性：
- 嵌套规则
- 自定义属性
- 颜色函数
- 逻辑属性

---

## 最佳实践

1. **使用 autoprefixer**：自动添加浏览器前缀
2. **启用压缩**：生产环境使用 cssnano
3. **使用 preset-env**：使用现代 CSS 特性
4. **移除未使用 CSS**：使用 purgecss
5. **配置浏览器列表**：使用 browserslist

---

## 相关链接

- [PostCSS 官方文档](https://postcss.org/)
- [PostCSS 插件列表](https://www.postcss.parts/)
- [工具链与构建 MOC](./!MOC-工具链与构建.md)

---

**最后更新**：2025

---

#PostCSS #CSS #工程化

