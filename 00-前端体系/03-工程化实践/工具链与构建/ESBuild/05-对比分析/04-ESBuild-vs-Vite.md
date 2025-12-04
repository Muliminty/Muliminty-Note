# ESBuild vs Vite

> Vite 如何使用 ESBuild

---

## 📋 学习目标

- ✅ 理解 ESBuild 和 Vite 的关系
- ✅ 掌握 Vite 如何使用 ESBuild
- ✅ 了解两者的区别
- ✅ 能够根据场景选择

---

## 关系说明

### Vite 使用 ESBuild

Vite 在开发环境使用 ESBuild 进行：
1. **依赖预构建**：使用 ESBuild 预构建 node_modules
2. **快速转译**：使用 ESBuild 转译代码

### 生产环境

Vite 生产环境使用 Rollup 进行打包。

---

## 功能对比

| 特性 | ESBuild | Vite |
|------|---------|------|
| **定位** | 打包器 | 开发工具 |
| **开发体验** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **插件生态** | ⭐⭐ | ⭐⭐⭐⭐ |
| **框架集成** | ⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 适用场景

### ESBuild 适合

- 直接使用打包器
- 需要极速构建
- 简单项目

### Vite 适合

- 新项目开发
- 需要开发服务器
- 框架项目（React/Vue）

---

## 相关链接

- [Vite原理与配置](../../Vite原理与配置.md)
- [ESBuild MOC](../!MOC-ESBuild.md)

---

**最后更新**：2025

---

#ESBuild #Vite #对比

