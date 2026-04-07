# React 项目集成

> React + ESBuild 完整配置

---

## 📋 学习目标

- ✅ 能够使用 ESBuild 构建 React 项目
- ✅ 掌握 React + ESBuild 的完整配置
- ✅ 理解开发环境配置
- ✅ 掌握生产环境优化

---

## 基础配置

### 安装依赖

```bash
npm install react react-dom
npm install -D esbuild
```

### 基础配置

**esbuild.config.js**：
```javascript
require('esbuild').build({
  entryPoints: ['src/index.jsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  loader: {
    '.jsx': 'jsx'
  },
  jsx: 'automatic',
  jsxImportSource: 'react'
})
```

---

## 开发环境

### 开发服务器

```javascript
require('esbuild').serve({
  servedir: 'public',
  port: 3000
}, {
  entryPoints: ['src/index.jsx'],
  bundle: true,
  outfile: 'public/bundle.js'
})
```

---

## 生产环境

### 生产配置

```javascript
require('esbuild').build({
  entryPoints: ['src/index.jsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true,
  sourcemap: true,
  jsx: 'automatic'
})
```

---

## 相关链接

- [ESBuild React 示例](https://esbuild.github.io/getting-started/#react)
- [ESBuild MOC](../!MOC-ESBuild.md)

---

**最后更新**：2025

---

#ESBuild #React

