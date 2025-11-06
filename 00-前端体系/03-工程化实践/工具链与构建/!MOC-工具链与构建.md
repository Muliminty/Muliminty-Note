# 工具链与构建 MOC

> 前端构建工具链，包括打包、转换、优化等工具。
> 
> **学习路径**：学习构建工具前需要掌握 [JavaScript 基础](../../01-基础入门/JavaScript/!MOC-javascript.md) 和前端框架（[React](../../02-框架进阶/React/!MOC-React.md)、[Vue](../../02-框架进阶/Vue/!MOC-Vue.md)）。构建工具与 [工程化实践](../工程化/!MOC-工程化.md) 配合使用。

---

## 📚 核心主题

- [Vite原理与配置](./Vite原理与配置.md) — Vite 快速构建（常用于 [React](../../02-框架进阶/React/!MOC-React.md) 和 [Vue](../../02-框架进阶/Vue/!MOC-Vue.md) 项目）
- [Webpack深入（loader/plugin）](./Webpack深入.md) — Webpack 深度解析（传统构建工具）
- [Rollup/ESBuild/SWC对比](./Rollup-ESBuild-SWC对比.md) — 构建工具对比
- [Babel转换管线](./Babel转换管线.md) — 代码转换与编译（编译 [JavaScript](../../01-基础入门/JavaScript/!MOC-javascript.md) 和 [TypeScript](../../02-框架进阶/TypeScript/!MOC-TypeScript.md)）
- [包管理与版本策略（npm/yarn/pnpm）](./包管理与版本策略.md) — 包管理最佳实践
- [Monorepo管理（pnpm workspace/Lerna/Turborepo）](./Monorepo管理.md) — Monorepo 管理方案（大型项目，参考 [架构设计](../../05-高级应用/架构/!MOC-架构.md)）

---

## 🎯 核心工具

### 构建工具
- **Vite**：快速的开发构建工具
- **Webpack**：模块打包器
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

## 📖 学习资源

- [Vite 官方文档](https://vitejs.dev/)
- [Webpack 官方文档](https://webpack.js.org/)
- [Babel 官方文档](https://babeljs.io/)

---

#构建工具 #工程化 #前端工具链

