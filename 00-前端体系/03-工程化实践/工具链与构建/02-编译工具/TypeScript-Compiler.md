# TypeScript Compiler (tsc)

> TypeScript 官方编译器，用于类型检查和将 TypeScript 代码编译为 JavaScript。

---

## 📋 学习目标

- ✅ 理解 TypeScript Compiler 的核心功能
- ✅ 掌握 tsconfig.json 配置
- ✅ 理解编译选项和类型检查
- ✅ 能够配置生产环境编译
- ✅ 理解与构建工具的集成

---

## 什么是 TypeScript Compiler

TypeScript Compiler (tsc) 是 TypeScript 的官方编译器，主要功能：

- **类型检查**：检查类型错误
- **代码编译**：将 TypeScript 编译为 JavaScript
- **声明文件生成**：生成 .d.ts 文件
- **配置灵活**：丰富的编译选项

---

## 快速开始

### 安装

```bash
npm install -D typescript
```

### 初始化配置

```bash
npx tsc --init
```

### 编译

```bash
npx tsc
```

---

## tsconfig.json 配置

### 基础配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

---

## 核心编译选项

### 目标环境

```json
{
  "compilerOptions": {
    "target": "ES2020",        // 编译目标
    "lib": ["ES2020", "DOM"],   // 类型库
    "module": "ESNext",         // 模块系统
  }
}
```

### 类型检查

```json
{
  "compilerOptions": {
    "strict": true,                    // 严格模式
    "noImplicitAny": true,            // 禁止隐式 any
    "strictNullChecks": true,         // 严格空值检查
    "strictFunctionTypes": true,      // 严格函数类型
    "noUnusedLocals": true,          // 未使用的局部变量
    "noUnusedParameters": true,      // 未使用的参数
  }
}
```

### 输出配置

```json
{
  "compilerOptions": {
    "outDir": "./dist",              // 输出目录
    "outFile": "./dist/bundle.js",   // 单文件输出
    "declaration": true,             // 生成声明文件
    "declarationMap": true,          // 声明文件映射
    "sourceMap": true,               // 生成 Source Map
  }
}
```

### JSX 配置

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",  // "preserve" | "react" | "react-jsx" | "react-native"
  }
}
```

---

## 路径别名

### 配置路径

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

### 使用路径别名

```typescript
import { Button } from '@components/Button'
import { formatDate } from '@utils/date'
```

---

## 项目引用

### 多项目配置

**tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" }
  ]
}
```

**packages/core/tsconfig.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist"
  }
}
```

---

## 与构建工具集成

### Webpack

使用 `ts-loader`：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}
```

### Rollup

使用 `@rollup/plugin-typescript`：

```javascript
import typescript from '@rollup/plugin-typescript'

export default {
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
}
```

### Vite

Vite 原生支持 TypeScript：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  // TypeScript 自动支持
})
```

### ESBuild

ESBuild 原生支持 TypeScript：

```javascript
require('esbuild').build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
})
```

---

## 类型检查

### 只进行类型检查

```bash
npx tsc --noEmit
```

### 监听模式

```bash
npx tsc --watch
```

### 增量编译

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo"
  }
}
```

---

## 性能优化

### 项目引用

使用项目引用提升编译速度：

```json
{
  "compilerOptions": {
    "composite": true
  },
  "references": [
    { "path": "./packages/core" }
  ]
}
```

### 跳过类型检查

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

### 增量编译

```json
{
  "compilerOptions": {
    "incremental": true
  }
}
```

---

## 与 Babel 对比

| 特性 | TypeScript Compiler | Babel |
|------|---------------------|-------|
| **类型检查** | ✅ | ❌ |
| **编译速度** | 较慢 | 较快 |
| **配置** | 复杂 | 简单 |
| **生态** | 官方 | 丰富 |

**选择建议**：
- **类型检查**：TypeScript Compiler
- **快速编译**：Babel + @babel/preset-typescript

---

## 最佳实践

1. **启用严格模式**：`"strict": true`
2. **使用路径别名**：简化导入路径
3. **生成声明文件**：`"declaration": true`
4. **配置 Source Map**：便于调试
5. **使用项目引用**：提升大型项目编译速度

---

## 相关链接

- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [TypeScript Compiler 选项](https://www.typescriptlang.org/tsconfig)
- [工具链与构建 MOC](./!MOC-工具链与构建.md)

---

**最后更新**：2025

---

#TypeScript #编译工具 #工程化

