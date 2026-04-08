# Webpack 深入解析

> Webpack 是一个现代 JavaScript 应用程序的静态模块打包器。它将项目中的各种资源（JS、CSS、图片等）视为模块，通过依赖关系图进行打包。

**学习路径**：学习 Webpack 前需要掌握 [JavaScript 基础](../../../../02-编程语言/01-JavaScript/!MOC-JavaScript.md) 和 [模块化](../../../../02-编程语言/01-JavaScript/03-模块化/README.md) 概念。Webpack 与 [工程化实践](../工程化/!MOC-工程化.md) 和 [性能优化](../../04-质量保障/性能/!MOC-性能.md) 密切相关。

---

## 📚 目录

- [核心概念](#核心概念)
- [基础配置](#基础配置)
- [Entry 和 Output](#entry-和-output)
- [Loader 系统](#loader-系统)
- [Plugin 系统](#plugin-系统)
- [代码分割与优化](#代码分割与优化)
- [开发环境配置](#开发环境配置)
- [生产环境优化](#生产环境优化)
- [性能优化](#性能优化)
- [常见问题排查](#常见问题排查)
- [最佳实践](#最佳实践)
- [实战案例](#实战案例)

---

## 核心概念

### 什么是 Webpack

Webpack 是一个**模块打包器**（Module Bundler），它的主要功能是：

1. **依赖分析**：从入口文件开始，递归分析所有依赖关系
2. **资源转换**：通过 Loader 将各种资源转换为 JavaScript 模块
3. **代码打包**：将所有模块打包成一个或多个 bundle 文件
4. **优化处理**：通过 Plugin 进行代码压缩、优化等处理

### 核心概念

#### 1. Entry（入口）

指定 Webpack 从哪个文件开始构建依赖图。

```javascript
module.exports = {
  entry: './src/index.js'
}
```

#### 2. Output（输出）

指定打包后的文件输出位置和命名规则。

```javascript
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
}
```

#### 3. Loader（加载器）

用于转换非 JavaScript 文件（如 CSS、图片、TypeScript 等）。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
```

#### 4. Plugin（插件）

用于执行更广泛的任务，如打包优化、资源管理、环境变量注入等。

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}
```

#### 5. Mode（模式）

指定构建模式：`development`、`production` 或 `none`。

```javascript
module.exports = {
  mode: 'production'
}
```

---

## 基础配置

### 最小配置示例

```javascript
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: 'development'
}
```

### 完整配置结构

```javascript
const path = require('path')

module.exports = {
  // 入口
  entry: './src/index.js',
  
  // 输出
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  
  // 模式
  mode: 'development',
  
  // 模块处理
  module: {
    rules: []
  },
  
  // 插件
  plugins: [],
  
  // 解析配置
  resolve: {
    extensions: ['.js', '.json'],
    alias: {}
  },
  
  // 开发服务器
  devServer: {},
  
  // 优化配置
  optimization: {}
}
```

---

## Entry 和 Output

### Entry 配置

#### 单入口

```javascript
module.exports = {
  entry: './src/index.js'
}
```

#### 多入口

```javascript
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  }
}
```

#### 动态入口

```javascript
module.exports = {
  entry: () => './src/index.js'
}
```

### Output 配置

#### 基础配置

```javascript
const path = require('path')

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
}
```

#### 多入口输出

```javascript
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'  // main.bundle.js, vendor.bundle.js
  }
}
```

#### 使用 Hash

```javascript
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',  // 内容 hash
    chunkFilename: '[name].[chunkhash].js'  // chunk hash
  }
}
```

**Hash 类型说明**：
- `[hash]`：整个项目的 hash
- `[chunkhash]`：chunk 的 hash
- `[contenthash]`：内容的 hash（推荐用于生产环境）

---

## Loader 系统

### Loader 工作原理

Loader 是一个函数，接收源文件内容，返回转换后的内容。

```javascript
module.exports = function(source) {
  // 转换逻辑
  return transformedSource
}
```

### 常用 Loader

#### 1. Babel Loader（转译 JavaScript）

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
```

#### 2. CSS Loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',  // 将 CSS 注入到 DOM
          'css-loader'     // 解析 CSS 文件
        ]
      }
    ]
  }
}
```

#### 3. Sass/Less Loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
}
```

#### 4. 文件资源 Loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext]'
        }
      }
    ]
  }
}
```

#### 5. URL Loader（小文件转 base64）

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024  // 8KB 以下转 base64
          }
        }
      }
    ]
  }
}
```

#### 6. TypeScript Loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
}
```

### Loader 执行顺序

Loader 从**右到左**（或从下到上）执行：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',   // 3. 最后执行
          'css-loader',     // 2. 然后执行
          'sass-loader'     // 1. 最先执行
        ]
      }
    ]
  }
}
```

### 自定义 Loader

```javascript
// my-loader.js
module.exports = function(source) {
  // source 是源文件内容
  const result = source.replace(/console\.log\(/g, '// console.log(')
  return result
}
```

使用自定义 Loader：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: path.resolve(__dirname, 'loaders/my-loader.js')
      }
    ]
  }
}
```

---

## Plugin 系统

### Plugin 工作原理

Plugin 是一个类，通过 `apply` 方法注册到 Webpack 的生命周期钩子中。

```javascript
class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('MyPlugin', (stats) => {
      console.log('构建完成！')
    })
  }
}
```

### 常用 Plugin

#### 1. HtmlWebpackPlugin（生成 HTML）

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    })
  ]
}
```

#### 2. CleanWebpackPlugin（清理输出目录）

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  plugins: [
    new CleanWebpackPlugin()
  ]
}
```

#### 3. MiniCssExtractPlugin（提取 CSS）

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    })
  ]
}
```

#### 4. DefinePlugin（定义环境变量）

```javascript
const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.API_URL': JSON.stringify('https://api.example.com')
    })
  ]
}
```

#### 5. ProvidePlugin（自动引入模块）

```javascript
const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
}
```

#### 6. BundleAnalyzerPlugin（分析打包结果）

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  ]
}
```

### 自定义 Plugin

```javascript
class MyPlugin {
  constructor(options) {
    this.options = options
  }
  
  apply(compiler) {
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
      // 在生成文件之前执行
      console.log('准备生成文件...')
      callback()
    })
  }
}

module.exports = MyPlugin
```

---

## 代码分割与优化

### 代码分割方式

#### 1. Entry 分割

```javascript
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  }
}
```

#### 2. SplitChunks 自动分割

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```

#### 3. 动态导入（Dynamic Import）

```javascript
// 使用 import() 动态导入
import('./module').then(module => {
  module.doSomething()
})

// 或使用 React.lazy
const LazyComponent = React.lazy(() => import('./LazyComponent'))
```

### SplitChunks 配置详解

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',  // 'initial' | 'async' | 'all'
      minSize: 20000,  // 最小 chunk 大小
      maxSize: 0,  // 最大 chunk 大小
      minChunks: 1,  // 最小引用次数
      maxAsyncRequests: 30,  // 最大异步请求数
      maxInitialRequests: 30,  // 最大初始请求数
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10
        }
      }
    }
  }
}
```

---

## 开发环境配置

### DevServer 配置

```javascript
module.exports = {
  devServer: {
    contentBase: './dist',
    port: 3000,
    hot: true,  // 热模块替换
    open: true,  // 自动打开浏览器
    compress: true,  // 启用 gzip 压缩
    historyApiFallback: true,  // SPA 路由支持
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
```

### 热模块替换（HMR）

```javascript
const webpack = require('webpack')

module.exports = {
  devServer: {
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
```

在代码中使用 HMR：

```javascript
if (module.hot) {
  module.hot.accept('./module', () => {
    // 模块更新后的处理逻辑
  })
}
```

### Source Map 配置

```javascript
module.exports = {
  devtool: 'source-map',  // 开发环境推荐
  // 或
  devtool: 'eval-source-map',  // 开发环境快速构建
  // 生产环境
  devtool: 'hidden-source-map'  // 或 false
}
```

**Source Map 类型**：
- `source-map`：生成独立的 .map 文件，最完整但最慢
- `eval-source-map`：使用 eval 包裹，适合开发环境
- `cheap-module-source-map`：不包含列信息，构建较快
- `hidden-source-map`：生成 .map 文件但不引用，适合生产环境

---

## 生产环境优化

### 代码压缩

```javascript
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true  // 移除 console
          }
        }
      }),
      new CssMinimizerPlugin()
    ]
  }
}
```

### Tree Shaking

Tree Shaking 用于移除未使用的代码。

```javascript
module.exports = {
  mode: 'production',  // 自动启用 Tree Shaking
  optimization: {
    usedExports: true,
    sideEffects: false  // 标记无副作用
  }
}
```

在 `package.json` 中标记副作用：

```json
{
  "sideEffects": ["*.css", "*.scss"]
}
```

### 作用域提升（Scope Hoisting）

```javascript
module.exports = {
  optimization: {
    concatenateModules: true  // 启用作用域提升
  }
}
```

---

## 性能优化

### 构建速度优化

#### 1. 使用缓存

```javascript
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  }
}
```

#### 2. 减少解析范围

```javascript
module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,  // 排除 node_modules
        use: 'babel-loader'
      }
    ]
  }
}
```

#### 3. 使用多进程构建

```javascript
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true  // 启用多进程
      })
    ]
  }
}
```

#### 4. 使用 DllPlugin（动态链接库）

```javascript
// webpack.dll.js
const webpack = require('webpack')

module.exports = {
  entry: {
    vendor: ['react', 'react-dom']
  },
  output: {
    path: path.resolve(__dirname, 'dll'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_library',
      path: path.resolve(__dirname, 'dll/[name].manifest.json')
    })
  ]
}

// webpack.config.js
const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require('./dll/vendor.manifest.json')
    })
  ]
}
```

### 运行时性能优化

#### 1. 代码分割

参考 [代码分割与优化](#代码分割与优化) 部分。

#### 2. 懒加载

```javascript
// 路由懒加载
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
```

#### 3. 预加载和预获取

```javascript
// 预加载（高优先级）
import(/* webpackPreload: true */ './module')

// 预获取（低优先级）
import(/* webpackPrefetch: true */ './module')
```

---

## 常见问题排查

### 1. 路径解析问题

**问题**：`Module not found: Can't resolve 'xxx'`

**解决方案**：
```javascript
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.json', '.jsx']
  }
}
```

### 2. 依赖冲突

**问题**：多个版本的同名依赖

**解决方案**：
```javascript
module.exports = {
  resolve: {
    alias: {
      'react': path.resolve(__dirname, 'node_modules/react')
    }
  }
}
```

### 3. 构建速度慢

**解决方案**：
- 使用缓存
- 减少解析范围
- 使用多进程构建
- 使用 DllPlugin

### 4. 内存溢出

**问题**：`JavaScript heap out of memory`

**解决方案**：
```bash
# 增加 Node.js 内存限制
node --max-old-space-size=4096 node_modules/.bin/webpack
```

### 5. 样式不生效

**问题**：CSS 样式未正确加载

**解决方案**：
- 检查 Loader 配置顺序
- 检查 `sideEffects` 配置
- 使用 `MiniCssExtractPlugin` 提取 CSS

---

## 最佳实践

### 1. 配置文件组织

```javascript
// webpack.common.js - 公共配置
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}

// webpack.dev.js - 开发环境
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    hot: true
  }
})

// webpack.prod.js - 生产环境
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true
  }
})
```

### 2. 环境变量管理

```javascript
// 使用 dotenv
require('dotenv').config()

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL)
    })
  ]
}
```

### 3. 性能监控

```javascript
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()

module.exports = smp.wrap({
  // webpack 配置
})
```

### 4. 代码规范

- 使用 ESLint 检查代码
- 使用 Prettier 格式化代码
- 配置 pre-commit 钩子

### 5. 版本管理

- 使用 `[contenthash]` 实现长期缓存
- 合理配置 `splitChunks`
- 使用 `runtimeChunk` 分离运行时代码

```javascript
module.exports = {
  optimization: {
    runtimeChunk: 'single',  // 分离运行时代码
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}
```

---

## 实战案例

### 案例一：从零搭建基础 Webpack 项目

#### 1. 项目初始化

```bash
# 创建项目目录
mkdir webpack-demo && cd webpack-demo

# 初始化 package.json
npm init -y

# 安装 Webpack 核心依赖
npm install --save-dev webpack webpack-cli

# 安装常用 Loader 和 Plugin
npm install --save-dev html-webpack-plugin
npm install --save-dev style-loader css-loader
npm install --save-dev babel-loader @babel/core @babel/preset-env
```

#### 2. 项目结构

```
webpack-demo/
├── src/
│   ├── index.js          # 入口文件
│   ├── index.html        # HTML 模板
│   ├── styles/
│   │   └── main.css      # 样式文件
│   └── utils/
│       └── helper.js     # 工具函数
├── dist/                 # 输出目录（自动生成）
├── webpack.config.js     # Webpack 配置
└── package.json
```

#### 3. 创建源文件

**src/index.js**
```javascript
import './styles/main.css'
import { greet } from './utils/helper'

console.log('Webpack 项目启动成功！')
greet('Webpack')
```

**src/utils/helper.js**
```javascript
export function greet(name) {
  console.log(`Hello, ${name}!`)
}
```

**src/styles/main.css**
```css
body {
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
  background: #f5f5f5;
}

h1 {
  color: #333;
}
```

**src/index.html**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webpack Demo</title>
</head>
<body>
  <div id="app">
    <h1>Webpack 项目</h1>
  </div>
</body>
</html>
```

#### 4. 基础 Webpack 配置

**webpack.config.js**
```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // 入口文件
  entry: './src/index.js',
  
  // 输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true  // 清理输出目录
  },
  
  // 模式
  mode: 'development',
  
  // 开发工具
  devtool: 'eval-source-map',
  
  // 模块处理
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    })
  ],
  
  // 开发服务器
  devServer: {
    static: './dist',
    port: 3000,
    hot: true,
    open: true
  }
}
```

#### 5. 配置 package.json 脚本

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack serve --mode development",
    "watch": "webpack --watch --mode development"
  }
}
```

#### 6. 运行项目

```bash
# 开发模式
npm run dev

# 生产构建
npm run build
```

---

### 案例二：React 项目完整配置

#### 1. 安装依赖

```bash
npm install react react-dom
npm install --save-dev @babel/preset-react
npm install --save-dev @babel/preset-typescript
npm install --save-dev typescript ts-loader
npm install --save-dev sass-loader sass
npm install --save-dev file-loader url-loader
```

#### 2. 项目结构

```
react-app/
├── src/
│   ├── index.tsx         # 入口文件
│   ├── App.tsx           # 根组件
│   ├── components/       # 组件目录
│   ├── styles/           # 样式目录
│   └── assets/           # 静态资源
├── public/
│   └── index.html
├── tsconfig.json
├── webpack.config.js
└── package.json
```

#### 3. TypeScript 配置

**tsconfig.json**
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
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

#### 4. Webpack 配置（开发环境）

**webpack.dev.js**
```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  
  devtool: 'eval-source-map',
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
            plugins: [
              'react-refresh/babel'  // HMR 支持
            ]
          }
        }
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]'
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext]'
        }
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new ReactRefreshWebpackPlugin()  // React 热更新
  ],
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,  // SPA 路由支持
    compress: true
  }
}
```

#### 5. Webpack 配置（生产环境）

**webpack.prod.js**
```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.tsx',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[name].[contenthash].chunk.js',
    publicPath: '/',
    clean: true
  },
  
  devtool: 'source-map',
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]'
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext]'
        }
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].chunk.css'
    })
  ],
  
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: 'single'
  }
}
```

#### 6. 合并配置（webpack-merge）

**webpack.common.js**
```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
}
```

**webpack.config.js**
```javascript
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    return merge(common, require('./webpack.prod.js'))
  }
  return merge(common, require('./webpack.dev.js'))
}
```

---

### 案例三：Vue 项目完整配置

#### 1. 安装依赖

```bash
npm install vue@next
npm install --save-dev vue-loader vue-template-compiler
npm install --save-dev @vue/compiler-sfc
```

#### 2. Webpack 配置

**webpack.config.js**
```javascript
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'vue$': 'vue/dist/vue.esm-bundler.js'
    }
  },
  
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    ...(process.env.NODE_ENV === 'production'
      ? [new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash].css' })]
      : [])
  ],
  
  devServer: {
    static: './dist',
    port: 8080,
    hot: true,
    open: true
  }
}
```

#### 3. Vue 组件示例

**src/App.vue**
```vue
<template>
  <div class="app">
    <h1>{{ message }}</h1>
    <button @click="handleClick">点击我</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: 'Hello Vue with Webpack!'
    }
  },
  methods: {
    handleClick() {
      this.message = '按钮被点击了！'
    }
  }
}
</script>

<style scoped>
.app {
  padding: 20px;
  text-align: center;
}

h1 {
  color: #42b983;
}
</style>
```

---

### 案例四：多页面应用（MPA）配置

#### 1. 项目结构

```
mpa-project/
├── src/
│   ├── pages/
│   │   ├── home/
│   │   │   ├── index.js
│   │   │   └── index.html
│   │   ├── about/
│   │   │   ├── index.js
│   │   │   └── index.html
│   │   └── contact/
│   │       ├── index.js
│   │       └── index.html
│   └── shared/
│       ├── utils.js
│       └── styles.css
└── webpack.config.js
```

#### 2. 动态生成多入口配置

**webpack.config.js**
```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const glob = require('glob')

// 动态获取所有页面入口
function getEntries() {
  const entries = {}
  const htmlPlugins = []
  
  glob.sync('./src/pages/**/index.js').forEach(file => {
    const name = file.match(/\/pages\/(.+)\/index\.js$/)[1]
    entries[name] = file
    
    htmlPlugins.push(
      new HtmlWebpackPlugin({
        template: file.replace('index.js', 'index.html'),
        filename: `${name}.html`,
        chunks: [name]
      })
    )
  })
  
  return { entries, htmlPlugins }
}

const { entries, htmlPlugins } = getEntries()

module.exports = {
  entry: entries,
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    clean: true
  },
  
  plugins: [
    ...htmlPlugins
  ],
  
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        common: {
          name: 'common',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```

---

### 案例五：实际项目配置示例

#### 完整的企业级配置

**webpack.config.js**
```javascript
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProduction ? 'production' : 'development',
  
  entry: {
    main: './src/index.js',
    vendor: ['react', 'react-dom']  // 单独打包第三方库
  },
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction 
      ? 'js/[name].[contenthash:8].js'
      : 'js/[name].js',
    chunkFilename: isProduction
      ? 'js/[name].[contenthash:8].chunk.js'
      : 'js/[name].chunk.js',
    publicPath: '/',
    clean: true,
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets')
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }],
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              !isProduction && 'react-refresh/babel'
            ].filter(Boolean)
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]__[hash:base64:5]'
              },
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024  // 8KB 以下转 base64
          }
        },
        generator: {
          filename: 'images/[hash][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext]'
        }
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      minify: isProduction ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
      } : false
    }),
    
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify(process.env.API_URL || '')
    }),
    
    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].chunk.css'
          })
        ]
      : [new webpack.HotModuleReplacementPlugin()]),
    
    // 分析打包结果（可选）
    ...(process.env.ANALYZE ? [new BundleAnalyzerPlugin()] : [])
  ],
  
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: isProduction,
            drop_debugger: isProduction
          }
        }
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  },
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 3000,
    hot: true,
    open: true,
    compress: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  },
  
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  
  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
}
```

#### package.json 脚本

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack serve",
    "build": "cross-env NODE_ENV=production webpack",
    "build:analyze": "cross-env NODE_ENV=production ANALYZE=true webpack",
    "build:prod": "cross-env NODE_ENV=production webpack --mode production"
  }
}
```

---

### 实战技巧总结

#### 1. 环境变量管理

创建 `.env.development` 和 `.env.production`：

```bash
# .env.development
NODE_ENV=development
API_URL=http://localhost:8080

# .env.production
NODE_ENV=production
API_URL=https://api.production.com
```

使用 `dotenv-webpack` 加载：

```javascript
const Dotenv = require('dotenv-webpack')

module.exports = {
  plugins: [
    new Dotenv({
      path: `.env.${process.env.NODE_ENV || 'development'}`
    })
  ]
}
```

#### 2. 路径别名配置

```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@styles': path.resolve(__dirname, 'src/styles')
  }
}
```

#### 3. 代码分割策略

```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    maxInitialRequests: 25,
    minSize: 20000,
    cacheGroups: {
      framework: {
        test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
        name: 'framework',
        priority: 40
      },
      lib: {
        test: /[\\/]node_modules[\\/]/,
        name: 'lib',
        priority: 30
      },
      common: {
        minChunks: 2,
        priority: 10,
        reuseExistingChunk: true
      }
    }
  }
}
```

#### 4. 性能监控

```javascript
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()

module.exports = smp.wrap({
  // webpack 配置
})
```

---

## 📖 相关资源

- [Webpack 官方文档](https://webpack.js.org/)
- [Webpack 中文文档](https://webpack.docschina.org/)
- [Babel 转换管线](../02-编译工具/Babel转换管线.md)
- [性能优化](../../04-质量保障/性能/!MOC-性能.md)
- [工程化实践](../工程化/!MOC-工程化.md)

---

#Webpack #构建工具 #工程化 #前端工具链
