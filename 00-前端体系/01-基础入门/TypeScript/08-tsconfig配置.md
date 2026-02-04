# tsconfig.json 配置指南

> tsconfig.json 是 TypeScript 项目的核心配置文件，理解各配置项对于项目开发至关重要。

---

## 基本结构

```json
{
  "compilerOptions": {
    // 编译选项
  },
  "include": [],    // 包含的文件
  "exclude": [],    // 排除的文件
  "extends": "",    // 继承的配置
  "files": [],      // 指定编译的文件
  "references": []  // 项目引用
}
```

---

## 核心编译选项

### 目标与模块

```json
{
  "compilerOptions": {
    // 编译目标 ES 版本
    "target": "ES2020",
    
    // 模块系统
    "module": "ESNext",
    
    // 模块解析策略
    "moduleResolution": "bundler",
    
    // 生成的 JavaScript 文件使用的换行符
    "newLine": "lf"
  }
}
```

**target 常用值**：
- `ES5`：兼容老浏览器
- `ES2015`/`ES6`：支持 class、箭头函数
- `ES2020`：支持可选链、空值合并
- `ESNext`：最新 ES 特性

**module 常用值**：
- `CommonJS`：Node.js 项目
- `ESNext`：现代前端项目
- `NodeNext`：Node.js ESM 项目

**moduleResolution 常用值**：
- `node`：Node.js 风格解析
- `bundler`：配合打包工具（Vite、Webpack）
- `nodenext`：Node.js ESM 解析

### 严格模式

```json
{
  "compilerOptions": {
    // 开启所有严格检查
    "strict": true,
    
    // 或单独配置
    "noImplicitAny": true,           // 禁止隐式 any
    "strictNullChecks": true,        // 严格空值检查
    "strictFunctionTypes": true,     // 严格函数类型检查
    "strictBindCallApply": true,     // 严格 bind/call/apply 检查
    "strictPropertyInitialization": true, // 类属性初始化检查
    "noImplicitThis": true,          // 禁止隐式 this
    "alwaysStrict": true,            // 使用 "use strict"
    "useUnknownInCatchVariables": true // catch 变量为 unknown
  }
}
```

### 类型检查

```json
{
  "compilerOptions": {
    // 额外检查
    "noUnusedLocals": true,          // 未使用的局部变量报错
    "noUnusedParameters": true,       // 未使用的参数报错
    "noImplicitReturns": true,        // 函数必须有返回值
    "noFallthroughCasesInSwitch": true, // switch 必须有 break
    "noUncheckedIndexedAccess": true, // 索引访问可能为 undefined
    "exactOptionalPropertyTypes": true // 可选属性精确类型
  }
}
```

---

## 输出配置

```json
{
  "compilerOptions": {
    // 输出目录
    "outDir": "./dist",
    
    // 根目录
    "rootDir": "./src",
    
    // 生成声明文件
    "declaration": true,
    "declarationDir": "./dist/types",
    
    // 生成 source map
    "sourceMap": true,
    "declarationMap": true,
    
    // 只生成声明文件，不编译
    "emitDeclarationOnly": false,
    
    // 不生成输出文件
    "noEmit": false,
    
    // 删除注释
    "removeComments": true,
    
    // 导入辅助函数
    "importHelpers": true,
    
    // 降级 async/await
    "downlevelIteration": true
  }
}
```

---

## 模块解析

```json
{
  "compilerOptions": {
    // 基础路径
    "baseUrl": ".",
    
    // 路径别名
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    },
    
    // 类型定义目录
    "typeRoots": ["./node_modules/@types", "./types"],
    
    // 只包含指定的类型
    "types": ["node", "jest"],
    
    // 允许导入 JSON 文件
    "resolveJsonModule": true,
    
    // 允许合成默认导入
    "allowSyntheticDefaultImports": true,
    
    // ES 模块互操作
    "esModuleInterop": true
  }
}
```

---

## React/JSX 配置

```json
{
  "compilerOptions": {
    // JSX 转换模式
    "jsx": "react-jsx",
    
    // JSX 工厂函数（React 17+ 不需要）
    // "jsxFactory": "React.createElement",
    
    // JSX Fragment
    // "jsxFragmentFactory": "React.Fragment",
    
    // JSX 导入源
    "jsxImportSource": "react"
  }
}
```

**jsx 常用值**：
- `preserve`：保留 JSX，输出 .jsx
- `react`：转换为 `React.createElement`
- `react-jsx`：React 17+ 新转换
- `react-jsxdev`：开发模式

---

## 文件包含与排除

```json
{
  // 包含的文件
  "include": [
    "src/**/*",
    "types/**/*"
  ],
  
  // 排除的文件
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ],
  
  // 指定编译的文件（很少使用）
  "files": [
    "src/index.ts"
  ]
}
```

---

## 配置继承

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}

// tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext"
  },
  "include": ["src"]
}
```

---

## 常用配置模板

### React + Vite 项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Vue 3 项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ]
}
```

### Node.js 项目

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### 库开发

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

---

## 项目引用（Project References）

用于大型 Monorepo 项目：

```json
// packages/shared/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist"
  },
  "include": ["src"]
}

// packages/app/tsconfig.json
{
  "compilerOptions": {
    // ...
  },
  "references": [
    { "path": "../shared" }
  ]
}

// 根目录 tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/app" }
  ]
}
```

构建命令：
```bash
tsc --build
tsc -b --watch
```

---

## 常见问题排查

### 类型找不到

```json
{
  "compilerOptions": {
    // 添加类型定义目录
    "typeRoots": ["./node_modules/@types", "./types"],
    
    // 或跳过库检查
    "skipLibCheck": true
  }
}
```

### 模块解析问题

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true
  }
}
```

### ESM/CJS 兼容问题

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

---

## 最佳实践

1. **始终开启 strict 模式**：提供最佳类型安全
2. **使用 skipLibCheck**：加快编译速度
3. **配置路径别名**：避免深层相对导入
4. **使用配置继承**：复用通用配置
5. **为不同环境创建不同配置**：tsconfig.json、tsconfig.node.json

```bash
# 常用命令
tsc --init              # 初始化 tsconfig.json
tsc --noEmit            # 只检查不输出
tsc --watch             # 监听模式
tsc --project tsconfig.build.json  # 指定配置文件
```

---

#typescript #配置 #tsconfig
