# JSX/TSX 支持

> React、Vue JSX 配置

---

## 📋 学习目标

- ✅ 理解 ESBuild 的 JSX 支持
- ✅ 掌握 React JSX 配置
- ✅ 掌握 Vue JSX 配置
- ✅ 了解 JSX 转换选项

---

## JSX 基础

### 启用 JSX

```javascript
{
  loader: 'jsx',  // 或 'tsx'
  jsx: 'transform'  // 'transform' | 'preserve'
}
```

---

## React JSX

### 基础配置

```javascript
{
  entryPoints: ['src/index.jsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  loader: {
    '.jsx': 'jsx'
  },
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment'
}
```

### React 17+ 新 JSX 转换

```javascript
{
  jsx: 'automatic',  // 自动导入
  jsxImportSource: 'react'
}
```

---

## Vue JSX

### 配置

```javascript
{
  entryPoints: ['src/index.jsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  loader: {
    '.jsx': 'jsx'
  },
  jsx: 'transform',
  jsxFactory: 'h',  // Vue 的 h 函数
  jsxFragment: 'Fragment'
}
```

---

## JSX 选项

### jsxFactory

指定 JSX 工厂函数：

```javascript
{
  jsxFactory: 'React.createElement'
}
```

### jsxFragment

指定 Fragment：

```javascript
{
  jsxFragment: 'React.Fragment'
}
```

### jsxImportSource

自动导入源：

```javascript
{
  jsxImportSource: 'react'
}
```

---

## 相关链接

- [ESBuild JSX 文档](https://esbuild.github.io/api/#jsx)
- [ESBuild MOC](../!MOC-ESBuild.md)

---

**最后更新**：2025

---

#ESBuild #JSX #React #Vue

