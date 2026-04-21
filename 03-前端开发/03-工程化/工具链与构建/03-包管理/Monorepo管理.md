---
title: "Monorepo 管理"
date: "2026-04-21"
lastModified: "2026-04-21"
tags: ["前端开发", "工程化", "Monorepo", "包管理"]
moc: "[[!MOC-工具链与构建]]"
description: "介绍 Monorepo 的组织方式、工具选择与工程治理要点。"
publish: true
toc: true
---

# Monorepo 管理

> Monorepo 是一种将多个项目放在同一个代码仓库中的项目管理方式，使用 pnpm workspace、Lerna、Turborepo 等工具管理。

---

## 📋 学习目标

- ✅ 理解 Monorepo 的概念和优势
- ✅ 掌握 pnpm workspace 的使用
- ✅ 理解 Lerna 的工作方式
- ✅ 掌握 Turborepo 的配置
- ✅ 能够从 0-1 搭建 Monorepo 项目
- ✅ 能够搭建和维护 Monorepo 项目

---

## 🚀 从 0-1 搭建 Monorepo 项目

### 方案一：pnpm workspace（推荐入门）

这是最简单、最常用的 Monorepo 方案，适合中小型项目。

#### 第一步：环境准备

```bash
# 1. 安装 Node.js（推荐 v18+）
node --version

# 2. 安装 pnpm（如果未安装）
npm install -g pnpm

# 3. 验证安装
pnpm --version
```

#### 第二步：初始化项目

```bash
# 1. 创建项目目录
mkdir my-monorepo
cd my-monorepo

# 2. 初始化根目录 package.json
pnpm init

# 3. 创建 pnpm-workspace.yaml
touch pnpm-workspace.yaml
```

#### 第三步：配置 workspace

**pnpm-workspace.yaml**

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

**根目录 package.json**

```json
{
  "name": "my-monorepo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter \"*\" dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "clean": "pnpm -r clean"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

#### 第四步：创建包结构

```bash
# 创建目录结构
mkdir -p packages/core packages/utils apps/web

# 初始化各个包
cd packages/core && pnpm init
cd ../utils && pnpm init
cd ../../apps/web && pnpm init
cd ../..
```

#### 第五步：配置各个包

**packages/core/package.json**

```json
{
  "name": "@my-monorepo/core",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "workspace:*"
  }
}
```

**packages/core/src/index.ts**

```typescript
export const greet = (name: string) => {
  return `Hello, ${name}!`;
};

export const add = (a: number, b: number) => {
  return a + b;
};
```

**packages/core/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**packages/utils/package.json**

```json
{
  "name": "@my-monorepo/utils",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@my-monorepo/core": "workspace:*"
  },
  "devDependencies": {
    "typescript": "workspace:*"
  }
}
```

**packages/utils/src/index.ts**

```typescript
import { greet, add } from '@my-monorepo/core';

export const formatMessage = (name: string) => {
  return greet(name).toUpperCase();
};

export const multiply = (a: number, b: number) => {
  let result = 0;
  for (let i = 0; i < b; i++) {
    result = add(result, a);
  }
  return result;
};
```

**apps/web/package.json**

```json
{
  "name": "@my-monorepo/web",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@my-monorepo/core": "workspace:*",
    "@my-monorepo/utils": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "workspace:*",
    "vite": "^5.0.0"
  }
}
```

#### 第六步：安装依赖

```bash
# 在根目录执行，会自动安装所有包的依赖
pnpm install
```

#### 第七步：配置构建顺序

由于 `utils` 依赖 `core`，`web` 依赖两者，需要确保构建顺序：

```bash
# 手动构建（按依赖顺序）
pnpm --filter @my-monorepo/core build
pnpm --filter @my-monorepo/utils build
pnpm --filter @my-monorepo/web build

# 或者使用并行构建（pnpm 会自动处理依赖顺序）
pnpm -r build
```

#### 第八步：运行项目

```bash
# 运行所有包的 dev 命令
pnpm dev

# 或运行特定包
pnpm --filter @my-monorepo/web dev
```

#### 完整项目结构

```
my-monorepo/
├── packages/
│   ├── core/
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── dist/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── utils/
│       ├── src/
│       │   └── index.ts
│       ├── dist/
│       ├── package.json
│       └── tsconfig.json
├── apps/
│   └── web/
│       ├── src/
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── pnpm-workspace.yaml
├── package.json
└── pnpm-lock.yaml
```

---

### 方案二：pnpm workspace + Turborepo（推荐生产环境）

适合大型项目，提供增量构建和缓存优化。

#### 第一步：完成方案一的前六步

先按照方案一搭建基础的 pnpm workspace 结构。

#### 第二步：安装 Turborepo

```bash
# 在根目录安装
pnpm add -D -w turbo
```

#### 第三步：配置 Turborepo

**turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

#### 第四步：更新根目录 package.json

```json
{
  "name": "my-monorepo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "typescript": "^5.0.0"
  }
}
```

#### 第五步：更新各包的 package.json

在每个包的 `package.json` 中添加 `turbo` 脚本：

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "jest",
    "lint": "eslint ."
  }
}
```

#### 第六步：使用 Turborepo 运行

```bash
# 构建所有包（自动处理依赖顺序和缓存）
turbo run build

# 开发模式
turbo run dev

# 只构建变更的包
turbo run build --filter=...@my-monorepo/core

# 清理缓存
turbo run build --force
```

---

### 方案三：Lerna + pnpm（需要版本管理）

适合需要发布到 npm 的库项目。

#### 第一步：安装 Lerna

```bash
# 全局安装（推荐）
npm install -g lerna

# 或本地安装
pnpm add -D -w lerna
```

#### 第二步：初始化 Lerna

```bash
# 在根目录执行
lerna init
```

#### 第三步：配置 Lerna

**lerna.json**

```json
{
  "version": "independent",
  "npmClient": "pnpm",
  "packages": ["packages/*"],
  "command": {
    "publish": {
      "conventionalCommits": true,
      "message": "chore(release): publish"
    },
    "bootstrap": {
      "ignore": "component-*",
      "npmClientArgs": ["--no-package-lock"]
    }
  }
}
```

#### 第四步：使用 Lerna 管理

```bash
# 创建新包
lerna create @my-monorepo/new-package

# 安装依赖（会自动链接内部依赖）
lerna bootstrap

# 运行命令
lerna run build
lerna run test --scope=@my-monorepo/core

# 版本管理
lerna version
lerna publish
```

---

## 📝 完整实战示例：React + TypeScript Monorepo

### 项目结构

```
my-monorepo/
├── packages/
│   ├── ui/              # 共享 UI 组件库
│   ├── utils/           # 工具函数
│   ├── config/          # 共享配置（ESLint、TypeScript 等）
│   └── types/           # 共享类型定义
├── apps/
│   ├── web/             # Web 应用（React + Vite）
│   ├── admin/           # 管理后台（React + Vite）
│   └── docs/            # 文档站点（VitePress）
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── .gitignore
```

### 详细配置步骤

#### 1. 根目录配置

**.gitignore**

```
node_modules
dist
.next
.turbo
*.log
.DS_Store
coverage
```

**package.json**

```json
{
  "name": "my-monorepo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

#### 2. 共享配置包（packages/config）

**packages/config/eslint-config/package.json**

```json
{
  "name": "@my-monorepo/eslint-config",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.50.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0"
  }
}
```

**packages/config/eslint-config/index.js**

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
```

#### 3. 共享 UI 组件（packages/ui）

**packages/ui/package.json**

```json
{
  "name": "@my-monorepo/ui",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@my-monorepo/eslint-config": "workspace:*",
    "@types/react": "^18.2.0",
    "typescript": "workspace:*"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  }
}
```

**packages/ui/src/Button.tsx**

```tsx
import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary'
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};
```

**packages/ui/src/index.ts**

```typescript
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

#### 4. Web 应用（apps/web）

**apps/web/package.json**

```json
{
  "name": "@my-monorepo/web",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "@my-monorepo/ui": "workspace:*",
    "@my-monorepo/utils": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@my-monorepo/eslint-config": "workspace:*",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "workspace:*",
    "vite": "^5.0.0"
  }
}
```

**apps/web/vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@my-monorepo/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@my-monorepo/utils': path.resolve(__dirname, '../../packages/utils/src')
    }
  }
});
```

**apps/web/src/App.tsx**

```tsx
import React from 'react';
import { Button } from '@my-monorepo/ui';
import { formatMessage } from '@my-monorepo/utils';

function App() {
  return (
    <div>
      <h1>{formatMessage('World')}</h1>
      <Button onClick={() => alert('Clicked!')}>
        Click Me
      </Button>
    </div>
  );
}

export default App;
```

---

## 🔧 常见问题与解决方案

### 1. 依赖安装问题

**问题**：`workspace:*` 协议不生效

**解决**：
```bash
# 确保 pnpm-workspace.yaml 配置正确
# 删除 node_modules 和 lock 文件重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 2. TypeScript 路径解析问题

**问题**：无法解析 workspace 包的路径

**解决**：在 `tsconfig.json` 中配置路径映射

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@my-monorepo/*": ["packages/*/src"],
      "@my-monorepo/ui": ["packages/ui/src"],
      "@my-monorepo/utils": ["packages/utils/src"]
    }
  }
}
```

### 3. 构建顺序问题

**问题**：依赖包未构建导致构建失败

**解决**：使用 Turborepo 自动处理依赖顺序

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]  // ^ 表示依赖的包先构建
    }
  }
}
```

### 4. 循环依赖问题

**问题**：包之间相互依赖导致循环

**解决**：
- 提取公共代码到新包
- 使用依赖注入模式
- 重新设计包结构

### 5. 版本管理问题

**问题**：如何管理多个包的版本

**解决**：
- 使用 Lerna 进行版本管理
- 或使用 `changesets` 工具
- 统一版本 vs 独立版本根据项目需求选择

---

## 🎯 工具选择决策树

```
需要发布到 npm？
├─ 是 → 需要版本管理？
│   ├─ 是 → Lerna + pnpm
│   └─ 否 → pnpm workspace
└─ 否 → 项目规模？
    ├─ 小型（< 10 包）→ pnpm workspace
    ├─ 中型（10-50 包）→ pnpm + Turborepo
    └─ 大型（> 50 包）→ Nx 或 Lerna + Turborepo
```

---

## 📚 最佳实践总结

1. **项目结构**：
   - `packages/` 存放共享包
   - `apps/` 存放应用
   - 根目录只放配置文件

2. **依赖管理**：
   - 使用 `workspace:*` 引用内部包
   - 统一外部依赖版本（使用 `pnpm.overrides`）
   - 合理使用 `peerDependencies`

3. **构建优化**：
   - 使用 Turborepo 进行增量构建
   - 配置正确的构建缓存
   - 并行构建不相关的包

4. **开发体验**：
   - 统一的代码规范（ESLint、Prettier）
   - 共享 TypeScript 配置
   - 统一的测试框架

5. **CI/CD**：
   - 只构建变更的包
   - 使用构建缓存加速 CI
   - 自动化版本管理和发布

---

## 📖 基础概念

### 什么是 Monorepo

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

### Monorepo 工具对比

| 工具 | 特点 | 优势 | 适用场景 |
|------|------|------|----------|
| **pnpm workspace** | pnpm 内置的 workspace 功能 | 简单易用，性能好 | 中小型 Monorepo |
| **Lerna** | 成熟的 Monorepo 管理工具 | 功能丰富，生态成熟 | 大型 Monorepo，需要版本管理 |
| **Turborepo** | 高性能的构建系统 | 增量构建，缓存优秀 | 大型 Monorepo，构建性能要求高 |
| **Nx** | 企业级 Monorepo 工具 | 功能最丰富，支持多种技术栈 | 超大型 Monorepo |

---

## 📚 详细配置参考

### pnpm workspace 详细配置

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
