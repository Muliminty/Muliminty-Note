# 什么是 ESBuild

> ESBuild 简介、为什么快、适用场景

---

## 📋 学习目标

- ✅ 理解 ESBuild 的核心概念
- ✅ 了解 ESBuild 为什么这么快
- ✅ 掌握 ESBuild 的适用场景
- ✅ 理解 ESBuild 的架构设计

---

## ESBuild 简介

ESBuild 是一个极速的 JavaScript 和 TypeScript 打包器，由 Evan Wallace 使用 Go 语言编写。

### 核心特点

- **极速构建**：比传统工具快 10-100 倍
- **零配置**：开箱即用
- **功能完整**：支持 JS/TS、JSX/TSX、代码压缩等
- **原生支持**：无需额外插件

---

## 为什么 ESBuild 这么快？

### 1. Go 语言的优势

**编译型语言 vs 解释型语言**：
- Go 编译为机器码，执行速度快
- JavaScript 需要解释执行，速度较慢

**性能对比**：
```
ESBuild (Go):    0.5s
Webpack (JS):     30s
Rollup (JS):      25s
```

### 2. 并行处理

**多核 CPU 利用**：
- ESBuild 充分利用多核 CPU
- 并行解析、转换、生成代码

### 3. 单一可执行文件

**无需依赖**：
- 单个二进制文件
- 无需安装 Node.js 模块
- 启动速度快

---

## 适用场景

### 适合使用的场景

1. **快速原型开发**
2. **库开发打包**
3. **CI/CD 流程**
4. **需要极速构建的项目**

### 不适合的场景

1. **需要丰富插件生态的项目**
2. **复杂的自定义构建流程**
3. **需要深度定制的项目**

---

## 架构设计

### 核心组件

1. **解析器**：快速解析 JavaScript/TypeScript
2. **转换器**：语法转换和优化
3. **打包器**：模块打包和代码分割
4. **压缩器**：代码压缩和优化

---

## 相关链接

- [ESBuild 官方文档](https://esbuild.github.io/)
- [ESBuild GitHub](https://github.com/evanw/esbuild)
- [ESBuild MOC](../!MOC-ESBuild.md)

---

**最后更新**：2025

---

#ESBuild #构建工具

