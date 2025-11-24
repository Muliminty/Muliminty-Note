# Webpack 深入解析

> Webpack 是一个现代 JavaScript 应用程序的静态模块打包器。它将项目中的各种资源（JS、CSS、图片等）视为模块，通过依赖关系图进行打包。

**学习路径**：学习 Webpack 前需要掌握 [JavaScript 基础](../../01-基础入门/JavaScript/!MOC-javascript.md) 和 [模块化](../../01-基础入门/JavaScript/03-模块化/README.md) 概念。Webpack 与 [工程化实践](../工程化/!MOC-工程化.md) 和 [性能优化](../../04-质量保障/性能/!MOC-性能.md) 密切相关。

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

## 📖 相关资源

- [Webpack 官方文档](https://webpack.js.org/)
- [Webpack 中文文档](https://webpack.docschina.org/)
- [Babel 转换管线](./Babel转换管线.md)
- [性能优化](../../04-质量保障/性能/!MOC-性能.md)
- [工程化实践](../工程化/!MOC-工程化.md)

---

#Webpack #构建工具 #工程化 #前端工具链

