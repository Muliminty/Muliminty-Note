# ESBuild（ESBuild）MOC

> ESBuild 是一个极速的 JavaScript 和 TypeScript 打包器，使用 Go 语言编写，性能比传统工具快 10-100 倍。
> 
> **学习路径**：
> - 📖 **入门**：ESBuild 基础使用和配置
> - 🚀 **进阶**：核心功能和高级配置
> - 💡 **高级**：性能优化和工具对比
> 
> 学习 ESBuild 前需要掌握 [JavaScript 基础](../../../01-基础入门/JavaScript/!MOC-javascript.md) 和 [TypeScript](../../../02-框架进阶/TypeScript/!MOC-TypeScript.md) 基础。ESBuild 与 [工具链与构建](../!MOC-工具链与构建.md) 和 [性能优化](../../../04-质量保障/性能/!MOC-性能.md) 密切相关。

---

## 🎯 学习目标

完成本知识体系学习后，你将能够：

- ✅ 理解 ESBuild 的核心特性和优势
- ✅ 从零开始搭建 ESBuild 项目
- ✅ 配置开发环境和生产环境
- ✅ 使用 ESBuild 处理 JavaScript、TypeScript、JSX/TSX
- ✅ 优化构建速度和输出体积
- ✅ 与 React、Vue 等框架集成
- ✅ 理解 ESBuild 与其他构建工具的对比和选择

---

## 📚 知识体系（按学习顺序）

### 阶段一：基础入门

**目标**：快速上手，搭建第一个 ESBuild 项目

#### 01-基础入门
- [什么是 ESBuild](./01-基础入门/01-什么是ESBuild.md) — ESBuild 简介、为什么快、适用场景
- [快速开始](./01-基础入门/02-快速开始.md) — 安装、第一个项目、基础配置
- [核心概念](./01-基础入门/03-核心概念.md) — Entry、Output、Format、Platform 等

---

### 阶段二：核心功能

**目标**：掌握 ESBuild 的核心功能

#### 02-核心功能
- [JavaScript/TypeScript 编译](./02-核心功能/01-JS-TS编译.md) — JS/TS 编译、语法支持
- [JSX/TSX 支持](./02-核心功能/02-JSX-TSX支持.md) — React、Vue JSX 配置
- [代码压缩](./02-核心功能/03-代码压缩.md) — 内置压缩、压缩选项
- [代码分割](./02-核心功能/04-代码分割.md) — 代码分割、动态导入
- [插件系统](./02-核心功能/05-插件系统.md) — 插件开发、常用插件

---

### 阶段三：配置与实践

**目标**：掌握实际项目配置和集成

#### 03-配置与实践
- [基础配置](./03-配置与实践/01-基础配置.md) — 完整配置选项、环境变量
- [React 项目集成](./03-配置与实践/02-React项目集成.md) — React + ESBuild 完整配置
- [Vue 项目集成](./03-配置与实践/03-Vue项目集成.md) — Vue + ESBuild 完整配置
- [库开发配置](./03-配置与实践/04-库开发配置.md) — 库打包、多格式输出
- [生产环境优化](./03-配置与实践/05-生产环境优化.md) — 生产环境最佳实践

---

### 阶段四：性能优化

**目标**：优化构建速度和输出体积

#### 04-性能优化
- [构建速度优化](./04-性能优化/01-构建速度优化.md) — 缓存、并行处理、增量构建
- [输出体积优化](./04-性能优化/02-输出体积优化.md) — Tree Shaking、代码压缩、资源优化

---

### 阶段五：对比分析

**目标**：理解 ESBuild 与其他工具的对比和选择

#### 05-对比分析
- [ESBuild vs Webpack](./05-对比分析/01-ESBuild-vs-Webpack.md) — 性能、功能、适用场景对比
- [ESBuild vs Rollup](./05-对比分析/02-ESBuild-vs-Rollup.md) — 打包策略、输出格式对比
- [ESBuild vs SWC](./05-对比分析/03-ESBuild-vs-SWC.md) — 转译能力、性能对比
- [ESBuild vs Vite](./05-对比分析/04-ESBuild-vs-Vite.md) — Vite 如何使用 ESBuild
- [高性能构建工具对比](./05-对比分析/05-高性能构建工具对比.md) — ESBuild、Rspack、Turbopack 全面对比

---

## 🎯 核心特性

### 性能优势
- **极速构建**：Go 语言实现，比传统工具快 10-100 倍
- **并行处理**：充分利用多核 CPU
- **零配置**：开箱即用，无需复杂配置

### 功能特性
- **JavaScript/TypeScript**：原生支持，无需额外配置
- **JSX/TSX**：支持 React、Vue 等框架
- **代码压缩**：内置压缩，无需额外工具
- **Source Map**：支持生成 Source Map
- **代码分割**：支持代码分割和动态导入

### 适用场景
- **快速原型开发**：需要快速构建和迭代
- **库开发**：需要快速打包和测试
- **CI/CD 流程**：需要快速构建
- **大型项目**：需要极速构建速度

---

## ✅ 技能要求

**你需要掌握：**

- 理解 ESBuild 的核心概念和配置
- 能够搭建 ESBuild 项目
- 能够配置开发和生产环境
- 能够优化构建性能
- 能够根据项目选择合适的构建工具

---

## 📝 学习建议

1. **前置知识**：需要掌握 [JavaScript 基础](../../../01-基础入门/JavaScript/!MOC-javascript.md) 和 [TypeScript](../../../02-框架进阶/TypeScript/!MOC-TypeScript.md) 基础
2. **学习顺序**：基础入门 → 核心功能 → 配置与实践 → 性能优化 → 对比分析
3. **实践应用**：
   - ESBuild 用于快速构建和打包
   - 配合 [工具链与构建](../!MOC-工具链与构建.md) 实现完整的开发流程
   - 与 [性能优化](../../../04-质量保障/性能/!MOC-性能.md) 结合，实现构建优化
4. **工具选择**：
   - **极速构建**：ESBuild（Go 实现，性能极佳）
   - **开发体验**：Vite（使用 ESBuild 作为开发服务器）
   - **大型项目**：Webpack 或 Rspack（功能更丰富）

---

## 🔗 相关链接

### 前置知识
- [JavaScript 基础](../../../01-基础入门/JavaScript/!MOC-javascript.md) — JavaScript 基础知识
- [TypeScript](../../../02-框架进阶/TypeScript/!MOC-TypeScript.md) — TypeScript 类型系统
- [模块化](../../../01-基础入门/JavaScript/03-模块化/README.md) — 模块化概念

### 相关主题
- [工具链与构建](../!MOC-工具链与构建.md) — 构建工具完整指南
- [性能优化](../../../04-质量保障/性能/!MOC-性能.md) — 性能优化（构建优化）
- [工程化实践](../../工程化/!MOC-工程化.md) — 工程化实践

---

## 📌 使用说明

### 目录结构

```
ESBuild/
├── !MOC-ESBuild.md
├── 01-基础入门/
│   ├── 01-什么是ESBuild.md
│   ├── 02-快速开始.md
│   └── 03-核心概念.md
├── 02-核心功能/
│   ├── 01-JS-TS编译.md
│   ├── 02-JSX-TSX支持.md
│   ├── 03-代码压缩.md
│   ├── 04-代码分割.md
│   └── 05-插件系统.md
├── 03-配置与实践/
│   ├── 01-基础配置.md
│   ├── 02-React项目集成.md
│   ├── 03-Vue项目集成.md
│   ├── 04-库开发配置.md
│   └── 05-生产环境优化.md
├── 04-性能优化/
│   ├── 01-构建速度优化.md
│   └── 02-输出体积优化.md
└── 05-对比分析/
    ├── 01-ESBuild-vs-Webpack.md
    ├── 02-ESBuild-vs-Rollup.md
    ├── 03-ESBuild-vs-SWC.md
    ├── 04-ESBuild-vs-Vite.md
    └── 05-高性能构建工具对比.md
```

### 文件命名规范

- **MOC 文件**：`!MOC-ESBuild.md`
- **普通文件**：使用中划线分隔，如 `01-什么是ESBuild.md`

---

## 📖 学习资源

### 官方文档
- [ESBuild 官方文档](https://esbuild.github.io/)
- [ESBuild GitHub](https://github.com/evanw/esbuild)
- [ESBuild API 文档](https://esbuild.github.io/api/)

### 相关资源
- [ESBuild 性能对比](https://esbuild.github.io/faq/#why-is-esbuild-fast)
- [构建工具性能基准测试](https://github.com/privatenumber/minification-benchmarks)

---

**最后更新**：2025  
**维护规范**：每次新增笔记后，在对应 MOC 中加入链接

---

#ESBuild #构建工具 #工程化 #前端工具链

