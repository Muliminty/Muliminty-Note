# React Native（React Native）MOC

> React Native 是一个用于构建原生移动应用的 JavaScript 框架，使用 React 语法开发 iOS 和 Android 应用。
> 
> **学习路径**：学习 React Native 前需要掌握 [React 基础](../!MOC-React.md) 和 [JavaScript 基础](../../../../01-基础入门/JavaScript/!MOC-javascript.md)。推荐学习 [TypeScript](../../TypeScript/!MOC-TypeScript.md) 增强类型安全。
> 
> **参考资源**：本知识体系参考了 [React Native 官方文档](https://reactnative.dev/) 和社区最佳实践。

---

## 知识体系结构

### 01-基础入门（Foundation）

**目标**：掌握 React Native 核心概念，能够搭建开发环境并创建第一个应用

#### 环境搭建
- [React Native 简介与环境搭建](./01-基础入门/01-React-Native简介与环境搭建.md) — 环境搭建、开发工具配置
- [项目结构与配置](./01-基础入门/02-项目结构与配置.md) — 项目结构、配置文件详解

#### 核心概念
- [核心组件与 API](./01-基础入门/03-核心组件与API.md) — View、Text、Image、ScrollView 等核心组件
- [样式系统](./01-基础入门/04-样式系统.md) — StyleSheet、Flexbox 布局
- [布局系统](./01-基础入门/05-布局系统.md) — Flexbox 在 React Native 中的应用

**学习检查点**：能够创建并运行一个简单的 React Native 应用

---

### 02-核心机制（Core Mechanisms）

**目标**：理解 React Native 的工作原理和与 React 的差异

#### 渲染机制
- [渲染机制](./02-核心机制/01-渲染机制.md) — 原生组件渲染、Bridge 通信
- [与 React 的差异](./02-核心机制/02-与React的差异.md) — 组件差异、API 差异、样式差异
- [原生模块通信](./02-核心机制/03-原生模块通信.md) — JavaScript 与原生代码通信机制

**学习检查点**：理解 React Native 的架构和渲染流程

---

### 03-导航系统（Navigation）

**目标**：掌握 React Native 应用的路由和导航

#### React Navigation
- [React Navigation 基础](./03-导航系统/01-React-Navigation基础.md) — 安装配置、基本使用
- [导航器类型](./03-导航系统/02-导航器类型.md) — Stack、Tab、Drawer 导航器
- [导航参数传递](./03-导航系统/03-导航参数传递.md) — 路由参数、导航选项、深度链接

**学习检查点**：能够实现多页面应用的导航功能

---

### 04-状态管理（State Management）

**目标**：掌握 React Native 应用的状态管理方案

#### 状态管理方案
- [Context API 在 RN 中的应用](./04-状态管理/01-Context-API在RN中的应用.md) — 使用 Context 管理全局状态
- [Redux 在 RN 中的应用](./04-状态管理/02-Redux在RN中的应用.md) — Redux Toolkit 集成
- [Zustand 在 RN 中的应用](./04-状态管理/03-Zustand在RN中的应用.md) — 轻量级状态管理

**学习检查点**：能够选择合适的状态管理方案并应用到项目中

---

### 05-原生功能集成（Native Integration）

**目标**：掌握原生模块开发和平台特定功能

#### 原生开发
- [原生模块开发](./05-原生功能集成/01-原生模块开发.md) — 创建原生模块、桥接原生代码
- [平台特定代码](./05-原生功能集成/02-平台特定代码.md) — Platform API、平台特定文件
- [设备 API 使用](./05-原生功能集成/03-设备API使用.md) — 相机、定位、通知等设备功能

**学习检查点**：能够开发和使用原生模块

---

### 06-性能优化（Performance Optimization）

**目标**：掌握 React Native 应用的性能优化技巧

#### 优化策略
- [渲染性能优化](./06-性能优化/01-渲染性能优化.md) — FlatList、优化重渲染、Memo 使用
- [内存管理](./06-性能优化/02-内存管理.md) — 内存泄漏排查、图片缓存
- [图片优化](./06-性能优化/03-图片优化.md) — 图片压缩、懒加载、缓存策略

**学习检查点**：能够识别并解决性能瓶颈

---

### 07-工程化实践（Engineering Practices）

**目标**：掌握 React Native 开发工具和最佳实践

#### 开发工具
- [开发工具配置](./07-工程化实践/01-开发工具配置.md) — ESLint、Prettier、TypeScript 配置
- [调试技巧](./07-工程化实践/02-调试技巧.md) — React Native Debugger、Flipper、日志调试
- [测试策略](./07-工程化实践/03-测试策略.md) — Jest、React Native Testing Library

**学习检查点**：能够配置完整的开发环境和测试流程

---

### 08-Expo 生态（Expo Ecosystem）

**目标**：掌握 Expo 工具链的使用

#### Expo 工具链
- [Expo 简介与使用](./08-Expo生态/01-Expo简介与使用.md) — Expo CLI、Expo Go、开发流程
- [Expo SDK 使用](./08-Expo生态/02-Expo-SDK使用.md) — 常用 SDK API、相机、定位等
- [Expo 开发流程](./08-Expo生态/03-Expo-开发流程.md) — 开发、构建、发布流程

**学习检查点**：能够使用 Expo 快速开发 React Native 应用

---

### 09-部署与发布（Deployment & Publishing）

**目标**：掌握应用的打包和发布流程

#### 打包发布
- [Android 打包发布](./09-部署与发布/01-Android打包发布.md) — 签名配置、APK/AAB 打包
- [iOS 打包发布](./09-部署与发布/02-iOS打包发布.md) — 证书配置、Archive 打包
- [应用商店发布](./09-部署与发布/03-应用商店发布.md) — Google Play、App Store 发布流程

**学习检查点**：能够独立完成应用的打包和发布

---

## 🎯 学习路径

### 初学者路径
1. **01-基础入门** → 掌握 React Native 基础概念和核心组件
2. **03-导航系统** → 实现多页面应用的导航
3. **04-状态管理** → 选择合适的状态管理方案
4. **08-Expo 生态** → 使用 Expo 快速开发（可选）

### 进阶路径
1. **02-核心机制** → 深入理解 React Native 工作原理
2. **05-原生功能集成** → 开发原生模块和集成设备功能
3. **06-性能优化** → 优化应用性能
4. **07-工程化实践** → 配置完整的开发工具链

### 生产环境路径
1. **09-部署与发布** → 掌握打包和发布流程
2. **06-性能优化** → 生产环境性能优化
3. **07-工程化实践** → 测试和代码质量保障

---

## 📖 相关资源

- [React Native 官方文档](https://reactnative.dev/)
- [React Navigation 文档](https://reactnavigation.org/)
- [Expo 文档](https://docs.expo.dev/)
- [React Native 社区](https://github.com/facebook/react-native)

---

#ReactNative #移动开发 #跨平台
