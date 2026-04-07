# Babel 转换管线

> Babel 是一个 JavaScript 编译器，用于将新版本的 ECMAScript 代码转换为向后兼容的 JavaScript 版本。

---

## 📋 学习目标

- ✅ 理解 Babel 的核心概念和工作原理
- ✅ 掌握 Babel 的配置方法
- ✅ 能够使用 Babel 转换 ES6+ 代码
- ✅ 理解 Babel 插件和预设
- ✅ 掌握 Babel 与构建工具的集成

---

## 什么是 Babel

Babel 是一个 JavaScript 编译器，主要功能：

- **语法转换**：将新语法转换为旧语法
- **Polyfill**：添加缺失的功能
- **代码转换**：JSX、TypeScript 等转换
- **插件系统**：高度可扩展

---

## 核心概念深度解析

### Babel 转换流程详解

#### 1. 解析阶段（Parse）

**输入**：源代码字符串
**输出**：AST（抽象语法树）

**过程**：
```javascript
// 源代码
const arrow = () => console.log('hello')

// 解析为 AST
{
  type: "Program",
  body: [{
    type: "VariableDeclaration",
    declarations: [{
      type: "VariableDeclarator",
      id: { type: "Identifier", name: "arrow" },
      init: {
        type: "ArrowFunctionExpression",
        params: [],
        body: { /* ... */ }
      }
    }]
  }]
}
```

**解析器**：@babel/parser（基于 acorn）
- 支持所有 ECMAScript 特性
- 支持 JSX、TypeScript、Flow
- 可配置解析选项

#### 2. 转换阶段（Transform）

**输入**：AST
**输出**：转换后的 AST

**过程**：
```javascript
// 插件遍历 AST
traverse(ast, {
  // 访问箭头函数节点
  ArrowFunctionExpression(path) {
    // 转换为普通函数
    path.replaceWith(/* 新的函数节点 */)
  }
})
```

**插件执行顺序**：
1. 插件在 Presets 之前执行
2. 插件从前往后执行
3. Presets 从后往前执行

```javascript
{
  plugins: ['plugin-a', 'plugin-b'],  // 先执行 plugin-a
  presets: ['preset-a', 'preset-b']   // 先执行 preset-b
}
```

#### 3. 生成阶段（Generate）

**输入**：转换后的 AST
**输出**：JavaScript 代码字符串

**过程**：
```javascript
// AST 转换为代码
generate(ast, {
  compact: false,      // 是否压缩
  comments: true,      // 保留注释
  minified: false,     // 是否最小化
  sourceMaps: true     // 生成 Source Map
})
```

### Babel 核心包架构

#### @babel/core

**核心功能**：
- AST 解析和生成
- 插件系统
- 配置管理
- 缓存机制

**API 使用**：
```javascript
const babel = require('@babel/core')

// 同步转换
const result = babel.transformSync(code, {
  presets: ['@babel/preset-env']
})

// 异步转换
const result = await babel.transformAsync(code, {
  presets: ['@babel/preset-env']
})

// 文件转换
babel.transformFile('src/index.js', {
  presets: ['@babel/preset-env']
}, (err, result) => {
  console.log(result.code)
})
```

#### @babel/parser

**解析选项**：
```javascript
require('@babel/parser').parse(code, {
  sourceType: 'module',     // 'script' | 'module' | 'unambiguous'
  plugins: [
    'jsx',                  // JSX 支持
    'typescript',           // TypeScript 支持
    'decorators-legacy',    // 装饰器
    'classProperties',      // 类属性
    'asyncGenerators'       // 异步生成器
  ],
  allowImportExportEverywhere: false,
  allowReturnOutsideFunction: false
})
```

#### @babel/generator

**生成选项**：
```javascript
generate(ast, {
  compact: false,           // 压缩输出
  comments: true,           // 保留注释
  retainLines: false,       // 保留行号
  minified: false,          // 最小化
  jsescOption: {            // 转义选项
    quotes: 'double',
    wrap: true
  }
})
```

### Babel 插件系统原理

#### 插件结构

```javascript
export default function myPlugin({ types: t }) {
  return {
    name: 'my-plugin',
    visitor: {
      // 访问节点类型
      Identifier(path) {
        // path 是节点的包装对象
        // path.node 是实际的 AST 节点
        // path.parent 是父节点
        // path.scope 是作用域信息
      }
    }
  }
}
```

#### Path 对象详解

**Path 是节点的包装**：
```javascript
{
  node: ASTNode,           // 实际节点
  parent: ASTNode,         // 父节点
  parentPath: Path,        // 父路径
  scope: Scope,            // 作用域
  context: TraversalContext, // 遍历上下文
  
  // 方法
  replaceWith(node),      // 替换节点
  remove(),               // 删除节点
  insertBefore(nodes),     // 在之前插入
  insertAfter(nodes),      // 在之后插入
  findParent(callback),    // 查找父节点
  get(key),               // 获取属性
  set(key, value)         // 设置属性
}
```

#### Scope 对象详解

**作用域信息**：
```javascript
{
  bindings: {
    // 变量绑定
    'myVar': {
      kind: 'const',       // 'var' | 'let' | 'const'
      path: Path,          // 声明路径
      references: [Path],  // 引用路径
      constant: true,     // 是否为常量
      referenced: true    // 是否被引用
    }
  },
  
  // 方法
  hasBinding(name),       // 检查绑定
  getBinding(name),       // 获取绑定
  generateUid(name),      // 生成唯一 ID
  rename(oldName, newName) // 重命名
}
```

---

## 快速开始

### 安装

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

### 基础配置

**babel.config.js**

```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions'],
      },
    }],
  ],
}
```

### 转换代码

```bash
npx babel src --out-dir dist
```

---

## 配置方式

### babel.config.js（推荐）

```javascript
module.exports = {
  presets: ['@babel/preset-env'],
  plugins: ['@babel/plugin-transform-runtime'],
}
```

### .babelrc

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

### package.json

```json
{
  "babel": {
    "presets": ["@babel/preset-env"],
    "plugins": ["@babel/plugin-transform-runtime"]
  }
}
```

---

## Presets（预设）深度解析

### @babel/preset-env：智能环境适配

#### 核心原理

**工作原理**：
1. 读取 `targets` 配置
2. 查询 `compat-table` 数据库（浏览器/Node.js 特性支持表）
3. 根据目标环境决定需要转换的特性
4. 只转换目标环境不支持的特性

**配置详解**：
```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', {
      // 目标环境
      targets: {
        // 浏览器（使用 browserslist 查询）
        browsers: [
          '> 1%',              // 市场份额 > 1%
          'last 2 versions',   // 最后 2 个版本
          'not dead',          // 未停止维护
          'not ie <= 11'       // 排除 IE 11
        ],
        
        // 或指定具体浏览器
        chrome: '80',
        firefox: '75',
        safari: '13',
        edge: '80',
        
        // Node.js
        node: '14',            // Node.js 14+
        node: 'current',       // 当前版本
        node: true             // 不转换 Node.js 特性
      },
      
      // 模块系统
      modules: false,          // 'amd' | 'umd' | 'systemjs' | 'commonjs' | 'cjs' | 'auto' | false
      // false: 保留 ES 模块（用于 tree-shaking）
      
      // Polyfill 策略
      useBuiltIns: 'usage',    // 'usage' | 'entry' | false
      // 'usage': 按需引入（推荐）
      // 'entry': 入口引入（需要手动 import '@babel/polyfill'）
      // false: 不引入
      
      // Core-js 版本
      corejs: {
        version: 3,           // 使用 core-js@3
        proposals: true        // 包含提案特性
      },
      
      // 调试选项
      debug: false,            // 输出转换信息
      
      // 包含/排除特性
      include: [],             // 强制包含的插件
      exclude: [],             // 排除的插件
      
      // 松散模式（更少的转换，可能不兼容）
      loose: false,
      
      // 强制所有转换（忽略目标环境）
      forceAllTransforms: false,
      
      // 配置合并策略
      configPath: process.cwd(),
      ignoreBrowserslistConfig: false,
      browserslistEnv: undefined
    }],
  ],
}
```

#### useBuiltIns 策略对比

**'usage' 模式（推荐）**：
```javascript
// 输入
const promise = Promise.resolve()
const array = [1, 2, 3].includes(2)

// 输出（自动引入需要的 polyfill）
import "core-js/modules/es.promise.js"
import "core-js/modules/es.array.includes.js"

const promise = Promise.resolve()
const array = [1, 2, 3].includes(2)
```

**'entry' 模式**：
```javascript
// 入口文件
import '@babel/polyfill'  // 或 'core-js/stable'

// Babel 根据 targets 替换为具体导入
import "core-js/modules/es.promise.js"
import "core-js/modules/es.array.includes.js"
// ... 所有需要的 polyfill
```

**false 模式**：
```javascript
// 不自动引入，需要手动引入
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

#### 实际案例：不同目标环境的转换

**目标：现代浏览器（Chrome 90+）**：
```javascript
// 输入
const arrow = () => {}
class MyClass {}
const spread = [...arr]

// 输出（几乎不转换）
const arrow = () => {}
class MyClass {}
const spread = [...arr]
```

**目标：IE 11**：
```javascript
// 输入
const arrow = () => {}
class MyClass {}
const spread = [...arr]

// 输出（大量转换）
var arrow = function arrow() {}
function _classCallCheck(instance, Constructor) { /* ... */ }
var MyClass = function MyClass() {
  _classCallCheck(this, MyClass)
}
var spread = [].concat(arr)
```

### @babel/preset-react：JSX 转换

**配置选项**：
```javascript
module.exports = {
  presets: [
    ['@babel/preset-react', {
      // JSX 运行时
      runtime: 'automatic',   // 'automatic' | 'classic'
      // automatic: React 17+，自动导入 jsx
      // classic: 需要手动导入 React
      
      // 开发选项
      development: process.env.NODE_ENV === 'development',
      // 开发环境：添加调试信息
      
      // 导入源（automatic 模式）
      importSource: 'react',  // 默认 'react'
      
      // 是否使用新的 JSX 转换
      pragma: 'React.createElement',  // classic 模式
      pragmaFrag: 'React.Fragment',   // Fragment 语法
      
      // 是否保留 propTypes
      useBuiltIns: false,
      useSpread: false
    }],
  ],
}
```

**转换对比**：

**Classic 模式**：
```javascript
// 输入
function App() {
  return <div>Hello</div>
}

// 输出
import React from 'react'
function App() {
  return React.createElement('div', null, 'Hello')
}
```

**Automatic 模式**：
```javascript
// 输入
function App() {
  return <div>Hello</div>
}

// 输出
import { jsx as _jsx } from 'react/jsx-runtime'
function App() {
  return _jsx('div', { children: 'Hello' })
}
```

### @babel/preset-react

转换 React JSX：

```javascript
module.exports = {
  presets: [
    '@babel/preset-react',
  ],
}
```

### @babel/preset-typescript

转换 TypeScript：

```javascript
module.exports = {
  presets: [
    '@babel/preset-typescript',
  ],
}
```

---

## Plugins（插件）

### 常用插件

#### @babel/plugin-transform-runtime

复用辅助函数：

```javascript
module.exports = {
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
    }],
  ],
}
```

#### @babel/plugin-proposal-decorators

装饰器支持：

```javascript
module.exports = {
  plugins: [
    ['@babel/plugin-proposal-decorators', {
      legacy: true,
    }],
  ],
}
```

---

## Polyfill

### @babel/polyfill（已废弃）

```javascript
// 旧方式（已废弃）
import '@babel/polyfill'
```

### @babel/preset-env + core-js（推荐）

```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: 3,
    }],
  ],
}
```

### @babel/runtime

```javascript
module.exports = {
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
    }],
  ],
}
```

---

## 与构建工具集成

### Webpack

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
}
```

### Rollup

```javascript
import { babel } from '@rollup/plugin-babel'

export default {
  plugins: [
    babel({
      babelHelpers: 'bundled',
    }),
  ],
}
```

### Vite

Vite 默认使用 ESBuild，但可以配置 Babel：

```javascript
import { defineConfig } from 'vite'
import { babel } from 'vite-plugin-babel'

export default defineConfig({
  plugins: [
    babel({
      babelHelpers: 'bundled',
    }),
  ],
})
```

---

## 自定义插件

### 插件结构

```javascript
module.exports = function({ types: t }) {
  return {
    visitor: {
      Identifier(path) {
        if (path.node.name === 'n') {
          path.node.name = 'x'
        }
      },
    },
  }
}
```

### 使用自定义插件

```javascript
module.exports = {
  plugins: ['./my-plugin.js'],
}
```

---

## 性能优化

### 缓存

```javascript
module.exports = {
  cacheDirectory: true,
  cacheCompression: false,
}
```

### 排除 node_modules

```javascript
module.exports = {
  exclude: /node_modules/,
}
```

### 并行处理

```javascript
module.exports = {
  cacheDirectory: true,
  // 使用多进程
}
```

---

## 与 SWC 对比

| 特性 | Babel | SWC |
|------|-------|-----|
| **速度** | 较慢 | 极快（Rust） |
| **生态** | 丰富 | 较小 |
| **配置** | 灵活 | 简单 |
| **插件** | 丰富 | 较少 |

**选择建议**：
- **生态优先**：Babel
- **性能优先**：SWC

---

## 最佳实践

1. **使用 preset-env**：根据目标环境自动转换
2. **按需引入 Polyfill**：使用 `useBuiltIns: 'usage'`
3. **启用缓存**：提升构建速度
4. **排除 node_modules**：避免转换第三方库
5. **使用 transform-runtime**：复用辅助函数

---

## 相关链接

- [Babel 官方文档](https://babeljs.io/)
- [Babel 插件列表](https://babeljs.io/docs/en/plugins)
- [工具链与构建 MOC](./!MOC-工具链与构建.md)

---

**最后更新**：2025

---

#Babel #编译工具 #工程化

