---
title: "Rollup 知识体系"
date: "2026-04-21"
lastModified: "2026-04-21"
tags: ["前端开发", "工程化", "Rollup"]
moc: "[[!MOC-工具链与构建]]"
description: "整理 Rollup 的定位、核心能力与在库构建场景下的使用方式。"
publish: true
toc: true
---

# Rollup 知识体系

> Rollup 是一个 ES 模块打包器，专注于生成小而高效的库和应用程序。Rollup 的 Tree-shaking 能力非常优秀，适合库开发。

---

## 📋 学习目标

- ✅ 理解 Rollup 的核心概念和优势
- ✅ 掌握 Rollup 的基础配置
- ✅ 能够使用 Rollup 打包库
- ✅ 理解 Tree-shaking 原理
- ✅ 掌握 Rollup 插件系统

---

## 什么是 Rollup

Rollup 是一个 JavaScript 模块打包器，主要特点：

- **ES 模块优先**：专注于 ES 模块打包
- **Tree-shaking**：优秀的 Tree-shaking 能力
- **输出格式多样**：支持多种输出格式（ES、CJS、UMD 等）
- **适合库开发**：特别适合打包库和组件

---

## 核心概念

### Entry（入口）

指定打包的入口文件：

```javascript
export default {
  input: 'src/index.js',
}
```

### Output（输出）

指定输出配置：

```javascript
export default {
  output: {
    file: 'dist/bundle.js',
    format: 'es', // 'es' | 'cjs' | 'umd' | 'iife'
  },
}
```

### Plugins（插件）

使用插件扩展功能：

```javascript
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  plugins: [
    nodeResolve(),
    commonjs(),
  ],
}
```

---

## 快速开始

### 安装

```bash
npm install -D rollup
```

### 基础配置

**rollup.config.js**

```javascript
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'es',
  },
}
```

### 打包

```bash
npx rollup -c
```

---

## 输出格式

### ES 模块（ES）

```javascript
export default {
  output: {
    format: 'es',
    file: 'dist/bundle.es.js',
  },
}
```

### CommonJS（CJS）

```javascript
export default {
  output: {
    format: 'cjs',
    file: 'dist/bundle.cjs.js',
  },
}
```

### UMD

```javascript
export default {
  output: {
    format: 'umd',
    name: 'MyLibrary',
    file: 'dist/bundle.umd.js',
  },
}
```

### 多格式输出

```javascript
export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/bundle.es.js', format: 'es' },
    { file: 'dist/bundle.cjs.js', format: 'cjs' },
    { file: 'dist/bundle.umd.js', format: 'umd', name: 'MyLibrary' },
  ],
}
```

---

## 常用插件

### @rollup/plugin-node-resolve

解析 node_modules 中的模块：

```javascript
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  plugins: [
    nodeResolve(),
  ],
}
```

### @rollup/plugin-commonjs

将 CommonJS 模块转换为 ES 模块：

```javascript
import commonjs from '@rollup/plugin-commonjs'

export default {
  plugins: [
    commonjs(),
  ],
}
```

### @rollup/plugin-babel

使用 Babel 转译代码：

```javascript
import { babel } from '@rollup/plugin-babel'

export default {
  plugins: [
    babel({
      babelHelpers: 'bundled',
    }),
  ],
}
```

### @rollup/plugin-typescript

TypeScript 支持：

```javascript
import typescript from '@rollup/plugin-typescript'

export default {
  plugins: [
    typescript(),
  ],
}
```

### @rollup/plugin-terser

代码压缩：

```javascript
import { terser } from '@rollup/plugin-terser'

export default {
  plugins: [
    terser(),
  ],
}
```

---

## Tree Shaking

Rollup 的 Tree-shaking 能力非常优秀，会自动移除未使用的代码：

```javascript
// utils.js
export function used() {
  return 'used'
}

export function unused() {
  return 'unused'
}

// index.js
import { used } from './utils.js'
console.log(used())
```

打包后，`unused` 函数会被自动移除。

---

## 库开发配置

### 完整配置示例

```javascript
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from '@rollup/plugin-terser'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.es.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'MyLibrary',
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(),
    terser(),
  ],
  external: ['react', 'react-dom'], // 外部依赖
}
```

---

## 与 Webpack 对比

| 特性 | Rollup | Webpack |
|------|--------|---------|
| **Tree-shaking** | 优秀 | 较好 |
| **输出格式** | 多样 | 单一 |
| **适用场景** | 库开发 | 应用开发 |
| **配置复杂度** | 简单 | 复杂 |
| **生态** | 较小 | 丰富 |

---

## 最佳实践

1. **库开发首选**：Rollup 特别适合库开发
2. **Tree-shaking**：充分利用 Tree-shaking 能力
3. **多格式输出**：提供多种输出格式
4. **外部依赖**：正确配置 external
5. **Source Map**：生产环境也生成 Source Map

---

## 相关链接

- [Rollup 官方文档](https://rollupjs.org/)
- [Rollup 插件列表](https://github.com/rollup/plugins)
- [工具链与构建 MOC](./!MOC-工具链与构建.md)

---

**最后更新**：2025

---

#Rollup #构建工具 #工程化
