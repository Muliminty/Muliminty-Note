# 怎么优化webpack的打包速度

---

## **一、工具升级**
1. **使用最新版本的 Webpack 和 Node.js**  
   - Webpack 每个新版本都会优化构建性能。
   - Node.js 的升级能提高模块解析和文件处理速度。

---

## **二、Loader 配置优化**
1. **缩小 Loader 处理范围**  
   ```javascript
   module: {
     rules: [
       {
         test: /\.js$/,
         loader: 'babel-loader',
         include: path.resolve(__dirname, 'src'), // 仅处理 src 目录
         exclude: /node_modules/ // 排除 node_modules
       }
     ]
   }
   ```
2. **缓存 Loader 结果**  
   - **Webpack 5+**：内置持久化缓存（无需插件）  
     ```javascript
     module.exports = {
       cache: { type: 'filesystem' } // 开启文件系统缓存
     };
     ```
   - **Webpack 4 及以下**：使用 `cache-loader`  
     ```javascript
     // 注意：cache-loader 需放在其他 loader 之前
     use: ['cache-loader', 'babel-loader']
     ```

3. **使用更快的工具替代 Loader**  
   - 用 `swc-loader` 替代 `babel-loader`（基于 Rust 的编译器，速度更快）。

---

## **三、多线程/并行处理**
1. **thread-loader**  
   将耗时的 Loader（如 Babel）放到子线程运行：  
   ```javascript
   module: {
     rules: [
       {
         test: /\.js$/,
         use: [
           'thread-loader', // 放在其他 loader 之前
           'babel-loader'
         ]
       }
     ]
   }
   ```
2. **并行压缩代码**  
   - 使用 `TerserPlugin` 开启多进程：  
     ```javascript
     const TerserPlugin = require('terser-webpack-plugin');
     module.exports = {
       optimization: {
         minimizer: [new TerserPlugin({ parallel: true })], // 默认开启多进程
       }
     };
     ```
   - 使用 `ESBuild` 替代 Terser（速度更快）：  
     ```javascript
     const ESBuildMinifyPlugin = require('esbuild-loader').ESBuildMinifyPlugin;
     optimization: { minimizer: [new ESBuildMinifyPlugin()] }
     ```

---

## **四、代码分割与按需加载**
1. **SplitChunksPlugin 优化**  
   拆分公共代码与第三方库：  
   ```javascript
   optimization: {
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
   ```
2. **动态导入（按需加载）**  
   使用 `import()` 语法分割代码：  
   ```javascript
   // React 路由按需加载
   const Home = React.lazy(() => import('./Home'));
   ```

---

## **五、解析优化**
1. **减少文件搜索范围**  
   ```javascript
   resolve: {
     modules: [path.resolve(__dirname, 'src'), 'node_modules'], // 指定模块路径
     extensions: ['.js', '.jsx'], // 减少后缀尝试
     alias: { '@': path.resolve(__dirname, 'src') } // 别名缩短路径
   }
   ```
2. **避免处理非源码文件**  
   - 使用 `module.noParse` 跳过大型库（如 Lodash）：  
     ```javascript
     module: { noParse: /lodash|jquery/ }
     ```

---

## **六、外部扩展（Externals）**
将第三方库通过 CDN 引入，不打包到 Bundle：  
```javascript
externals: {
  react: 'React',
  'react-dom': 'ReactDOM'
}
// 同时在 HTML 中通过 <script> 引入 CDN 链接
```

---

## **七、开发环境优化**
1. **禁用生产环境工具**  
   - 开发环境关闭代码压缩、SourceMap 等：  
     ```javascript
     devtool: 'eval-cheap-source-map', // 快速生成 SourceMap
     optimization: { minimize: false }
     ```
2. **使用 DevServer 的热更新（HMR）**  
   ```javascript
   devServer: { hot: true }
   ```

---

## **八、分析工具**
1. **打包速度分析**  
   ```bash
   npm install speed-measure-webpack-plugin --save-dev
   ```
   ```javascript
   const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
   const smp = new SpeedMeasurePlugin();
   module.exports = smp.wrap(config); // 包裹配置对象
   ```
2. **Bundle 体积分析**  
   ```bash
   npm install webpack-bundle-analyzer --save-dev
   ```
   ```javascript
   const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
   plugins: [new BundleAnalyzerPlugin()]
   ```

---

## **九、其他优化**
1. **DLLPlugin（Webpack 4 及以下）**  
   预编译不常变动的库（如 React、Vue）：  
   ```javascript
   // 1. 创建 webpack.dll.config.js 生成 manifest.json 和 dll 文件
   // 2. 主配置中引用 DllReferencePlugin
   plugins: [new webpack.DllReferencePlugin({ manifest: require('./manifest.json') })]
   ```
2. **模块联邦（Webpack 5+）**  
   跨项目共享模块，避免重复打包（微前端场景）。

---

## **十、硬件级优化**
1. **增加内存**  
   ```bash
   node --max-old-space-size=4096 ./node_modules/webpack/bin/webpack.js
   ```
2. **使用 SSD 硬盘**  
   减少文件读写时间。

---

## **总结**
- **优先升级工具链**（Webpack 5+、Node.js 16+）。
- **利用缓存与多线程**（`cache:filesystem`、`thread-loader`）。
- **减少不必要的处理**（缩小 Loader 范围、`noParse`、`externals`）。
- **分析瓶颈**（使用 `speed-measure-webpack-plugin` 和 `webpack-bundle-analyzer`）。