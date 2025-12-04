# Monorepo 管理

> Monorepo 是一种将多个项目放在同一个代码仓库中的项目管理方式，使用 pnpm workspace、Lerna、Turborepo 等工具管理。

---

## 📋 学习目标

- ✅ 理解 Monorepo 的概念和优势
- ✅ 掌握 pnpm workspace 的使用
- ✅ 理解 Lerna 的工作方式
- ✅ 掌握 Turborepo 的配置
- ✅ 能够搭建和维护 Monorepo 项目

---

## 什么是 Monorepo

Monorepo（单一仓库）是一种将多个相关项目放在同一个代码仓库中的项目管理方式。

### 优势

- **代码共享**：便于共享代码和工具
- **统一版本**：统一管理依赖版本
- **原子提交**：跨项目的原子性提交
- **统一工具链**：统一的构建、测试、发布流程

### 劣势

- **仓库体积**：仓库可能变得很大
- **权限管理**：需要更细粒度的权限控制
- **工具复杂度**：需要额外的工具支持

---

## Monorepo 工具对比

### pnpm workspace

- **特点**：pnpm 内置的 workspace 功能
- **优势**：简单易用，性能好
- **适用**：中小型 Monorepo

### Lerna

- **特点**：成熟的 Monorepo 管理工具
- **优势**：功能丰富，生态成熟
- **适用**：大型 Monorepo，需要版本管理

### Turborepo

- **特点**：高性能的构建系统
- **优势**：增量构建，缓存优秀
- **适用**：大型 Monorepo，构建性能要求高

### Nx

- **特点**：企业级 Monorepo 工具
- **优势**：功能最丰富，支持多种技术栈
- **适用**：超大型 Monorepo

---

## pnpm workspace

### 项目结构

```
monorepo/
├── packages/
│   ├── core/
│   │   ├── package.json
│   │   └── src/
│   ├── utils/
│   │   ├── package.json
│   │   └── src/
│   └── app/
│       ├── package.json
│       └── src/
├── pnpm-workspace.yaml
└── package.json
```

### 配置

**pnpm-workspace.yaml**

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

**根目录 package.json**

```json
{
  "name": "monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter app dev",
    "build": "pnpm -r build"
  }
}
```

### 使用

```bash
# 安装所有依赖
pnpm install

# 在特定包中运行命令
pnpm --filter core dev

# 在所有包中运行命令
pnpm -r build

# 添加依赖到特定包
pnpm --filter core add lodash

# 包之间相互引用
pnpm --filter app add core@workspace:*
```

---

## Lerna

### 安装

```bash
npm install -g lerna
lerna init
```

### 项目结构

```
monorepo/
├── packages/
│   ├── core/
│   └── utils/
├── lerna.json
└── package.json
```

### 配置

**lerna.json**

```json
{
  "version": "independent",
  "npmClient": "pnpm",
  "packages": ["packages/*"],
  "command": {
    "publish": {
      "conventionalCommits": true
    }
  }
}
```

### 常用命令

```bash
# 初始化
lerna init

# 创建包
lerna create package-name

# 安装依赖
lerna bootstrap

# 运行命令
lerna run build
lerna run test --scope=core

# 发布
lerna publish
lerna version
```

---

## Turborepo

### 安装

```bash
npm install -D turbo
```

### 项目结构

```
monorepo/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── ui/
│   └── utils/
├── turbo.json
└── package.json
```

### 配置

**turbo.json**

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

### 使用

```bash
# 运行构建
turbo run build

# 运行开发
turbo run dev

# 只运行变更的包
turbo run build --filter=...core

# 清理缓存
turbo run build --force
```

---

## 版本管理策略

### 固定版本（Fixed）

所有包使用相同版本：

```json
{
  "version": "1.0.0"
}
```

### 独立版本（Independent）

每个包独立版本：

```json
{
  "version": "independent"
}
```

---

## 依赖管理

### 内部依赖

**packages/core/package.json**

```json
{
  "name": "@monorepo/core",
  "version": "1.0.0"
}
```

**packages/app/package.json**

```json
{
  "dependencies": {
    "@monorepo/core": "workspace:*"
  }
}
```

### 外部依赖

统一管理外部依赖版本：

**根目录 package.json**

```json
{
  "pnpm": {
    "overrides": {
      "react": "18.2.0"
    }
  }
}
```

---

## 构建和发布

### 构建顺序

使用依赖关系确定构建顺序：

```json
{
  "dependencies": {
    "@monorepo/core": "workspace:*"
  }
}
```

### 发布流程

1. **版本更新**：更新包版本
2. **构建**：构建所有包
3. **测试**：运行测试
4. **发布**：发布到 npm

### 使用 Lerna 发布

```bash
# 版本更新
lerna version

# 发布
lerna publish from-package
```

---

## 最佳实践

1. **使用 workspace 协议**：`workspace:*`
2. **统一依赖版本**：使用 overrides
3. **合理拆分包**：按功能或业务拆分
4. **使用构建缓存**：Turborepo 缓存
5. **统一工具链**：统一的构建、测试工具
6. **文档完善**：每个包都有 README

---

## 工具选择建议

### 小型 Monorepo

- **pnpm workspace**：简单易用

### 中型 Monorepo

- **pnpm workspace + Turborepo**：性能好

### 大型 Monorepo

- **Lerna + pnpm**：功能丰富
- **Nx**：企业级方案

---

## 相关链接

- [pnpm workspace 文档](https://pnpm.io/workspaces)
- [Lerna 官方文档](https://lerna.js.org/)
- [Turborepo 官方文档](https://turbo.build/repo)
- [Nx 官方文档](https://nx.dev/)
- [工具链与构建 MOC](./!MOC-工具链与构建.md)

---

**最后更新**：2025

---

#Monorepo #工程化 #包管理

