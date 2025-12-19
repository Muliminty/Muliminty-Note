# Vue 项目集成

> Vue + ESBuild 完整配置

---

## 📋 学习目标

- ✅ 能够使用 ESBuild 构建 Vue 项目
- ✅ 掌握 Vue + ESBuild 的完整配置
- ✅ 理解 Vue SFC 处理
- ✅ 掌握开发和生产环境配置

---

## 基础配置

### 安装依赖

```bash
npm install vue
npm install -D esbuild esbuild-vue-plugin
```

### 基础配置

**esbuild.config.js**：
```javascript
const vuePlugin = require('esbuild-vue-plugin')

require('esbuild').build({
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  plugins: [vuePlugin()]
})
```

---

## Vue SFC 支持

### 使用插件

```javascript
const vuePlugin = require('esbuild-vue-plugin')

{
  plugins: [
    vuePlugin({
      // Vue 选项
    })
  ]
}
```

---

## 开发环境

### 开发服务器

```javascript
require('esbuild').serve({
  servedir: 'public',
  port: 3000
}, {
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'public/bundle.js',
  plugins: [vuePlugin()]
})
```

---

## 相关链接

- [esbuild-vue-plugin](https://github.com/antfu/esbuild-vue-plugin)
- [ESBuild MOC](../!MOC-ESBuild.md)

---

**最后更新**：2025

---

#ESBuild #Vue

