# 实战项目：从零搭建 Vue 项目

> 本教程将带你从零开始，使用 Webpack 搭建一个完整的 Vue 3 项目。完成本教程后，你将拥有一个可以立即使用的 Vue 项目模板。

**预计时间**：30-40 分钟

---

## 📋 学习目标

完成本教程后，你将能够：

- ✅ 使用 Webpack 搭建 Vue 项目
- ✅ 配置 Vue Loader
- ✅ 配置开发环境和生产环境
- ✅ 使用 CSS 预处理器
- ✅ 配置热模块替换

---

## 第一步：项目初始化

### 1. 创建项目目录

```bash
mkdir vue-webpack-app
cd vue-webpack-app
```

### 2. 初始化 package.json

```bash
npm init -y
```

### 3. 安装 Vue

```bash
npm install vue@next
```

### 4. 安装 Webpack 相关依赖

```bash
# Webpack 核心
npm install --save-dev webpack webpack-cli webpack-dev-server

# Vue Loader
npm install --save-dev vue-loader vue-template-compiler
npm install --save-dev @vue/compiler-sfc

# Webpack 插件
npm install --save-dev html-webpack-plugin
npm install --save-dev mini-css-extract-plugin
npm install --save-dev css-minimizer-webpack-plugin
npm install --save-dev clean-webpack-plugin
npm install --save-dev webpack-merge
```

### 5. 安装 Babel

```bash
npm install --save-dev @babel/core @babel/preset-env babel-loader
```

### 6. 安装样式处理

```bash
npm install --save-dev style-loader css-loader sass-loader sass
npm install --save-dev postcss postcss-loader autoprefixer
```

---

## 第二步：创建项目结构

```
vue-webpack-app/
├── public/
│   └── index.html
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── components/
│   │   └── Hello.vue
│   ├── styles/
│   │   └── index.scss
│   └── assets/
├── dist/
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
├── webpack.config.js
└── package.json
```

---

## 第三步：创建源文件

### 1. HTML 模板

**public/index.html**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue Webpack App</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

### 2. 入口文件

**src/main.js**：
```javascript
import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.scss'

createApp(App).mount('#app')
```

### 3. 根组件

**src/App.vue**：
```vue
<template>
  <div class="app">
    <h1>Vue 3 + Webpack</h1>
    <Hello :name="name" />
    <div class="counter">
      <button @click="decrement">-</button>
      <span>{{ count }}</span>
      <button @click="increment">+</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import Hello from './components/Hello.vue'

export default {
  name: 'App',
  components: {
    Hello
  },
  setup() {
    const name = ref('Webpack')
    const count = ref(0)
    
    const increment = () => {
      count.value++
    }
    
    const decrement = () => {
      count.value--
    }
    
    return {
      name,
      count,
      increment,
      decrement
    }
  }
}
</script>

<style scoped lang="scss">
.app {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

  h1 {
    color: #42b983;
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
    border: 2px solid #42b983;
    background: white;
    color: #42b983;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #42b983;
      color: white;
    }
  }

  span {
    font-size: 24px;
    font-weight: bold;
    min-width: 50px;
  }
}
</style>
```

### 4. 子组件

**src/components/Hello.vue**：
```vue
<template>
  <h2>Hello, {{ name }}!</h2>
</template>

<script>
export default {
  name: 'Hello',
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
h2 {
  color: #333;
  margin: 20px 0;
}
</style>
```

### 5. 全局样式

**src/styles/index.scss**：
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#app {
  width: 100%;
  max-width: 600px;
  padding: 20px;
}
```

---

## 第四步：配置 Webpack

### 1. 公共配置

**webpack.common.js**：
```javascript
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  
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
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext]'
        }
      }
    ]
  },
  
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
}
```

### 2. 开发环境配置

**webpack.dev.js**：
```javascript
const path = require('path')

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
        test: /\.(css|scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 8080,
    hot: true,
    open: true,
    compress: true,
    historyApiFallback: true
  }
}
```

### 3. 生产环境配置

**webpack.prod.js**：
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
          'css-loader',
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
          priority: 10
        }
      }
    },
    runtimeChunk: 'single'
  }
}
```

### 4. 主配置文件

**webpack.config.js**：
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

## 第五步：配置 PostCSS

**postcss.config.js**：
```javascript
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

---

## 第六步：配置 package.json

```json
{
  "name": "vue-webpack-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production"
  }
}
```

---

## 第七步：运行项目

### 开发模式

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:8080`

### 生产构建

```bash
npm run build
```

---

## 项目特性

✅ **Vue 3 支持** - 使用 Composition API  
✅ **Vue Loader** - 支持单文件组件  
✅ **Sass 支持** - 使用 Sass 预处理器  
✅ **热模块替换** - 开发时自动刷新  
✅ **代码分割** - 自动分离第三方库  
✅ **生产优化** - 代码压缩和优化  

---

## 常见问题

### 1. Vue Loader 版本问题

确保使用兼容的版本：
- Vue 3 使用 `vue-loader@^16.x`
- Vue 2 使用 `vue-loader@^15.x`

### 2. 样式不生效

检查 `vue-loader` 和 `css-loader` 的配置顺序。

### 3. HMR 不工作

确保 `webpack-dev-server` 的 `hot` 选项已启用。

---

## 下一步

- [开发环境配置](./06-开发环境配置.md) - 深入学习开发环境配置
- [生产环境优化](./07-生产环境优化.md) - 学习生产环境优化
- [代码分割](./08-代码分割.md) - 学习代码分割策略

---

## 总结

恭喜！你已经成功搭建了一个完整的 Vue 3 + Webpack 项目！

**关键点**：
- 使用 `VueLoaderPlugin` 处理 Vue 文件
- 配置 `vue-loader` 处理 `.vue` 文件
- 使用 `webpack-merge` 分离开发和生产配置
- 配置 Sass 和 PostCSS 支持

继续学习，探索更多 Webpack 的强大功能！

---

#Webpack #Vue #Vue3 #实战项目 #项目搭建

