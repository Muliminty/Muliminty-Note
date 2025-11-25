# 工具链与构建（Build Tools）MOC

> 前端构建工具链，包括打包、转换、优化等工具。
> 
> **学习路径**：
> - 📖 **入门**：基础构建工具使用（Vite、Webpack）
> - 🚀 **进阶**：构建工具深入配置和优化
> - 💡 **高级**：构建工具原理和自定义插件
> 
> 学习构建工具前需要掌握 [JavaScript 基础](../../01-基础入门/JavaScript/!MOC-javascript.md) 和前端框架（[React](../../02-框架进阶/React/!MOC-React.md)、[Vue](../../02-框架进阶/Vue/!MOC-Vue.md)）。构建工具与 [工程化实践](../工程化/!MOC-工程化.md) 配合使用。

---

## 📚 知识体系

### 1. 构建工具（Build Tools）

前端项目构建和打包工具。

#### 主流构建工具
- Vite原理与配置（待整理）— Vite 快速构建（常用于 [React](../../02-框架进阶/React/!MOC-React.md) 和 [Vue](../../02-框架进阶/Vue/!MOC-Vue.md) 项目）
- [Webpack 知识体系](./Webpack/!MOC-Webpack.md) — Webpack 完整知识体系（从入门到实战，包含 React/Vue 项目搭建）
- [Webpack深入](./Webpack深入.md) — Webpack 深入解析
- Rollup/ESBuild/SWC对比（待整理）— 构建工具对比

#### 编译工具
- Babel转换管线（待整理）— 代码转换与编译（编译 [JavaScript](../../01-基础入门/JavaScript/!MOC-javascript.md) 和 [TypeScript](../../02-框架进阶/TypeScript/!MOC-TypeScript.md)）

---

### 2. 包管理（Package Management）

包管理和 Monorepo 管理方案。

#### 包管理工具
- 包管理与版本策略（npm/yarn/pnpm）（待整理）— 包管理最佳实践

#### Monorepo 管理
- Monorepo管理（pnpm workspace/Lerna/Turborepo）（待整理）— Monorepo 管理方案（大型项目，参考 [架构设计](../../05-高级应用/架构/!MOC-架构.md)）

---

## 🎯 核心工具

### 构建工具
- **Vite**：快速的开发构建工具
- **Webpack**：模块打包器
- **Rspack**：基于 Rust 的高性能构建工具
- **Turbopack**：Next.js 团队开发的极速打包工具
- **Rollup**：ES 模块打包器
- **ESBuild**：极速 JavaScript 打包器
- **SWC**：Rust 编写的快速转译器

### 编译工具
- **Babel**：JavaScript 编译器
- **TypeScript Compiler**：TypeScript 编译器
- **PostCSS**：CSS 后处理器

### 包管理
- **npm**：Node.js 包管理器
- **yarn**：快速、可靠的包管理器
- **pnpm**：高效的包管理器（推荐用于 [Monorepo](./Monorepo管理.md)）

---

## ✅ 技能要求

**你需要掌握：**

- 看懂项目的构建配置（Vite/Webpack/Rspack 任意一种）
- 理解打包拆分、动态加载、CI/CD 流程
- 能排查构建问题（路径解析、依赖冲突）

---

## 📝 学习建议

1. **前置知识**：需要掌握 [JavaScript 基础](../../01-基础入门/JavaScript/!MOC-javascript.md) 和前端框架基础
2. **学习顺序**：JavaScript → 前端框架 → 构建工具 → [工程化实践](../工程化/!MOC-工程化.md)
3. **实践应用**：
   - 构建工具用于编译和打包前端代码
   - 配合 [工程化实践](../工程化/!MOC-工程化.md) 实现完整的开发流程
   - 与 [性能优化](../../04-质量保障/性能/!MOC-性能.md) 结合，实现代码分割和优化
4. **工具选择**：
   - 新项目推荐 Vite（快速、现代）
   - 大型项目可能需要 Webpack（功能丰富）
   - 库开发推荐 Rollup（输出格式好）

---

## 🎯 学习路径

### 阶段一：基础入门

**目标**：掌握基础构建工具的使用

**学习顺序**：
1. Vite原理与配置（待整理）（推荐新项目）
2. [Webpack 知识体系](./Webpack/!MOC-Webpack.md)（大型项目）
3. [Webpack深入](./Webpack深入.md)

**学习检查点**：
- ✅ 能够配置 Vite 或 Webpack
- ✅ 理解构建工具的基本概念
- ✅ 能够使用包管理工具

---

### 阶段二：进阶实践

**目标**：掌握构建工具的高级配置和优化

**学习顺序**：
1. Babel转换管线（待整理）
2. 包管理与版本策略（待整理）
3. Monorepo管理（待整理）

**学习检查点**：
- ✅ 能够配置 Babel 转换
- ✅ 能够管理包版本和依赖
- ✅ 能够搭建 Monorepo 项目

---

### 阶段三：高级应用

**目标**：深入理解构建工具原理和自定义插件

**学习顺序**：
1. Webpack 深入（Loader、Plugin）
2. 构建工具对比和选择

**学习检查点**：
- ✅ 能够编写自定义 Loader 和 Plugin
- ✅ 能够根据项目选择合适的构建工具

---

## 🔗 相关链接

### 前置知识

- [JavaScript 基础](../../01-基础入门/JavaScript/!MOC-javascript.md) — JavaScript 基础知识
- [TypeScript](../../02-框架进阶/TypeScript/!MOC-TypeScript.md) — TypeScript 类型系统
- [React](../../02-框架进阶/React/!MOC-React.md) / [Vue](../../02-框架进阶/Vue/!MOC-Vue.md) — 前端框架基础

### 相关主题

- [工程化实践](../工程化/!MOC-工程化.md) — 工程化实践（配合使用）
- [性能优化](../../04-质量保障/性能/!MOC-性能.md) — 性能优化（构建优化）
- [架构设计](../../05-高级应用/架构/!MOC-架构.md) — 架构设计（Monorepo 架构）

---

## 📌 使用说明

### 目录结构

```
工具链与构建/
├── !MOC-工具链与构建.md
├── Vite原理与配置.md（待整理）
├── Webpack深入.md
├── Rollup-ESBuild-SWC对比.md（待整理）
├── Babel转换管线.md（待整理）
├── 包管理与版本策略.md（待整理）
├── Monorepo管理.md（待整理）
└── Webpack/
    ├── !MOC-Webpack.md
    └── ...
```

### 文件命名规范

- **MOC 文件**：`!MOC-工具链与构建.md`
- **普通文件**：使用中划线分隔，如 `Vite原理与配置.md`

---

## 📖 学习资源

- [Vite 官方文档](https://vitejs.dev/)
- [Webpack 官方文档](https://webpack.js.org/)
- [Babel 官方文档](https://babeljs.io/)

---

**最后更新**：2025  
**维护规范**：每次新增笔记后，在对应 MOC 中加入链接

---

#构建工具 #工程化 #前端工具链

