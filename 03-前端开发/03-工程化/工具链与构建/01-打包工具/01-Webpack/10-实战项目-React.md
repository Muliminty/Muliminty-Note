# 实战项目：从零搭建 React 项目

> 本教程将带你从零开始，使用 Webpack 搭建一个完整的 React + TypeScript 项目。完成本教程后，你将拥有一个可以立即使用的 React 项目模板。

**预计时间**：30-40 分钟

---

## 📋 学习目标

完成本教程后，你将能够：

- ✅ 使用 Webpack 搭建 React 项目
- ✅ 配置 TypeScript 支持
- ✅ 配置开发环境和生产环境
- ✅ 使用 CSS Modules 和 Sass
- ✅ 配置热模块替换（HMR）
- ✅ 优化生产环境构建

---

## 第一步：项目初始化

### 1. 创建项目目录

```bash
mkdir react-webpack-app
cd react-webpack-app
```

### 2. 初始化 package.json

```bash
npm init -y
```

### 3. 安装 React 依赖

```bash
# 安装 React
npm install react react-dom

# 安装类型定义（TypeScript）
npm install --save-dev @types/react @types/react-dom
```

### 4. 安装 Webpack 相关依赖

```bash
# Webpack 核心
npm install --save-dev webpack webpack-cli webpack-dev-server

# Webpack 插件
npm install --save-dev html-webpack-plugin
npm install --save-dev mini-css-extract-plugin
npm install --save-dev css-minimizer-webpack-plugin
npm install --save-dev terser-webpack-plugin
npm install --save-dev clean-webpack-plugin

# 配置合并工具
npm install --save-dev webpack-merge
```

### 5. 安装 Babel 相关依赖

```bash
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript
npm install --save-dev babel-loader
npm install --save-dev @pmmmwh/react-refresh-webpack-plugin
```

### 6. 安装 TypeScript

```bash
npm install --save-dev typescript
```

### 7. 安装样式处理依赖

```bash
npm install --save-dev style-loader css-loader sass-loader sass
npm install --save-dev postcss postcss-loader autoprefixer
```

---

## 第二步：创建项目结构

创建以下目录结构：

```
react-webpack-app/
├── public/
│   └── index.html          # HTML 模板
├── src/
│   ├── index.tsx          # 入口文件
│   ├── App.tsx            # 根组件
│   ├── components/        # 组件目录
│   │   └── Hello.tsx
│   ├── styles/            # 样式目录
│   │   └── index.scss
│   └── assets/            # 静态资源
├── dist/                  # 输出目录（自动生成）
├── tsconfig.json          # TypeScript 配置
├── webpack.common.js      # 公共配置
├── webpack.dev.js         # 开发环境配置
├── webpack.prod.js        # 生产环境配置
├── webpack.config.js       # 主配置文件
└── package.json
```

---

## 第三步：创建源文件

### 1. 创建 HTML 模板

**public/index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Webpack App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

### 2. 创建入口文件

**src/index.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.scss'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### 3. 创建根组件

**src/App.tsx**

```typescript
import React, { useState } from 'react'
import Hello from './components/Hello'
import styles from './App.module.scss'

const App: React.FC = () => {
  const [count, setCount] = useState(0)

  return (
    <div className={styles.app}>
      <h1>React + Webpack + TypeScript</h1>
      <Hello name="Webpack" />
      <div className={styles.counter}>
        <button onClick={() => setCount(count - 1)}>-</button>
        <span>{count}</span>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
    </div>
  )
}

export default App
```

### 4. 创建子组件

**src/components/Hello.tsx**

```typescript
import React from 'react'

interface HelloProps {
  name: string
}

const Hello: React.FC<HelloProps> = ({ name }) => {
  return <h2>Hello, {name}!</h2>
}

export default Hello
```

### 5. 创建样式文件

**src/styles/index.scss**

```scss
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

**src/App.module.scss**

```scss
.app {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

  h1 {
    color: #333;
    margin-bottom: 20px;
  }
}

.counter {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  button {
    width: 40px;
    height: 40px;
    font-size: 20px;
    border: 2px solid #667eea;
    background: white;
    color: #667eea;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #667eea;
      color: white;
    }
  }

  span {
    font-size: 24px;
    font-weight: bold;
    min-width: 50px;
  }
}
```

---

## 第四步：配置 TypeScript

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
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 第五步：配置 Webpack

### 1. 公共配置

**webpack.common.js**

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  
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
            ]
          }
        }
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
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    })
  ]
}
```

### 2. 开发环境配置

**webpack.dev.js**

```javascript
const path = require('path')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = {
  mode: 'development',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  
  devtool: 'eval-source-map',
  
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
              },
              importLoaders: 2
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  
  plugins: [
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

### 3. 生产环境配置

**webpack.prod.js**

```javascript
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    publicPath: '/',
    clean: true
  },
  
  devtool: 'source-map',
  
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]'
              },
              importLoaders: 2
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css'
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

### 4. 主配置文件

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

## 第六步：配置 PostCSS

**postcss.config.js**

```javascript
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

---

## 第七步：配置 package.json 脚本

**package.json**

```json
{
  "name": "react-webpack-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "build:analyze": "webpack-bundle-analyzer dist/stats.json"
  }
}
```

---

## 第八步：运行项目

### 开发模式

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:3000`，你可以看到你的 React 应用。

### 生产构建

```bash
npm run build
```

构建完成后，`dist` 目录会包含优化后的文件。

---

## 项目特性

✅ **TypeScript 支持** - 完整的类型检查  
✅ **CSS Modules** - 样式模块化  
✅ **Sass 支持** - 使用 Sass 预处理器  
✅ **热模块替换** - 开发时自动刷新  
✅ **代码分割** - 自动分离第三方库  
✅ **生产优化** - 代码压缩和优化  
✅ **路径别名** - 使用 `@` 代替 `src`  

---

## 常见问题

### 1. HMR 不工作

确保安装了 `@pmmmwh/react-refresh-webpack-plugin` 并在开发配置中启用。

### 2. TypeScript 类型错误

检查 `tsconfig.json` 配置，确保 `jsx` 设置为 `"react-jsx"`。

### 3. CSS Modules 不生效

确保 `css-loader` 的 `modules` 选项已启用。

---

## 下一步

- [开发环境配置](./06-开发环境配置.md) - 深入学习开发环境配置
- [生产环境优化](./07-生产环境优化.md) - 学习生产环境优化技巧
- [代码分割](./08-代码分割.md) - 学习代码分割策略

---

## 总结

恭喜！你已经成功搭建了一个完整的 React + TypeScript + Webpack 项目！

**关键点**：
- 使用 `webpack-merge` 分离开发和生产配置
- 配置 Babel 转译 TypeScript 和 React
- 使用 CSS Modules 实现样式隔离
- 配置 HMR 提升开发体验
- 优化生产环境构建

继续学习，探索更多 Webpack 的强大功能！

---

#Webpack #React #TypeScript #实战项目 #项目搭建

