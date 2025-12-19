# JavaScript/TypeScript 编译

> JS/TS 编译、语法支持

---

## 📋 学习目标

- ✅ 理解 ESBuild 的 JavaScript 编译能力
- ✅ 掌握 TypeScript 编译配置
- ✅ 了解支持的语法特性
- ✅ 理解编译选项和限制

---

## JavaScript 编译

### 原生支持

ESBuild 原生支持所有现代 JavaScript 特性：

- ES6+ 语法
- 模块系统（ESM、CommonJS）
- 异步/等待
- 生成器
- 类

### 语法转换

ESBuild 会根据 `target` 配置自动转换语法：

```javascript
{
  target: 'es2015'  // 转换到 ES2015
}
```

---

## TypeScript 编译

### 原生支持

ESBuild 内置 TypeScript 支持，无需额外配置：

```javascript
{
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js'
}
```

### TypeScript 配置

**tsconfig.json**：
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext"
  }
}
```

### 支持的 TypeScript 特性

- 类型注解（编译时移除）
- 接口和类型
- 泛型
- 装饰器（实验性）
- JSX/TSX

### 不支持的特性

- 类型检查（只编译，不检查）
- 某些高级类型特性

---

## 语法支持

### 支持的语法

- 所有 ES2022 特性
- 部分 ES2023 特性
- TypeScript 语法
- JSX/TSX

### 目标环境

```javascript
{
  target: [
    'es2020',
    'chrome80',
    'firefox78',
    'safari13',
    'node14'
  ]
}
```

---

## 相关链接

- [ESBuild TypeScript 支持](https://esbuild.github.io/content-types/#typescript)
- [ESBuild MOC](../!MOC-ESBuild.md)

---

**最后更新**：2025

---

#ESBuild #TypeScript #编译

