# Gulp 简介与安装

> Gulp 是一个前端自动化构建工具（Task Runner），用来把「重复、机械、容易出错」的前端工作交给机器完成。

---

## 📋 目录

- [什么是 Gulp](#什么是-gulp)
- [Gulp 核心特点](#gulp-核心特点)
- [环境要求](#环境要求)
- [安装 Gulp](#安装-gulp)
- [验证安装](#验证安装)
- [第一个 Gulp 项目](#第一个-gulp-项目)

---

## 什么是 Gulp

Gulp 是一个基于 Node.js 的自动化构建工具，通过代码（JavaScript）来定义任务，实现前端工作流的自动化。

### Gulp 解决什么问题

```javascript
// 手动操作（繁琐、易错）
1. 手动压缩 CSS/JS
2. 手动合并文件
3. 手动添加浏览器前缀
4. 手动刷新浏览器
5. 手动部署文件

// Gulp 自动化（高效、可靠）
1. 自动监听文件变化
2. 自动执行预设任务
3. 自动优化资源
4. 自动刷新浏览器
5. 一键部署
```

### Gulp vs 其他构建工具

| 工具 | 特点 | 配置方式 | 生态 |
|------|------|----------|------|
| **Gulp** | 代码驱动、流式处理 | JavaScript | 丰富 |
| Grunt | 配置驱动、文件中间态 | JSON | 一般 |
| Webpack | 模块打包、全能型 | JavaScript | 非常庞大 |
| Rollup | ES 模块打包 | JavaScript | 较小 |
| Parcel | 零配置 | - | 较小 |

**选择建议**:
- **Gulp**: 适合任务流清晰、需要灵活定制的项目
- **Webpack**: 适合现代前端框架项目
- **Rollup**: 适合库开发

---

## Gulp 核心特点

### 1. 基于流（Stream-based）

```javascript
// Gulp 使用 Node.js Stream，无需写入中间文件
gulp.src('src/*.js')      // 读取源文件（输入流）
  .pipe(uglify())         // 压缩处理（转换流）
  .pipe(gulp.dest('dist')) // 写入目标文件（输出流）
```

**优势**:
- 内存中处理，速度快
- 无需中间文件，节省磁盘空间
- 管道式操作，代码简洁

### 2. 代码即配置（Code over Configuration）

```javascript
// Grunt 配置式（繁琐）
{
  uglify: {
    files: {
      'dist/app.js': 'src/*.js'
    }
  }
}

// Gulp 代码式（简洁）
gulp.task('scripts', () => {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
```

### 3. 生态系统丰富

```bash
# 常用插件（超过 3000+）
gulp-sass          # Sass 编译
gulp-less          # Less 编译
gulp-postcss       # PostCSS 处理
gulp-autoprefixer  # 自动添加前缀
gulp-uglify        # JS 压缩
gulp-clean-css     # CSS 压缩
gulp-imagemin      # 图片压缩
gulp-concat        # 文件合并
gulp-rename        # 文件重命名
gulp-sourcemaps    # Source Map
gulp-livereload    # 自动刷新
gulp-connect       # 本地服务器
```

### 4. 易于学习

```javascript
// Gulp 核心概念简单
- gulp.src()    // 读取文件
- gulp.dest()   // 写入文件
- gulp.watch()  // 监听文件
- gulp.task()   // 定义任务
- gulp.series() // 串行执行任务
- gulp.parallel() // 并行执行任务
```

---

## 环境要求

### Node.js 版本要求

```bash
# 查看 Node.js 版本
node -v

# Gulp 3.x 要求
Node.js >= 0.10

# Gulp 4.x 要求
Node.js >= 8.0.0 (推荐使用 LTS 版本)

# 推荐版本
Node.js 14.x 或更高
npm 6.x 或更高
```

### 检查环境

```bash
# 检查 Node.js
node -v
# v14.17.0

# 检查 npm
npm -v
# 6.14.13

# 检查 npx（Gulp 4.x 需要）
npx -v
# 10.0.0
```

---

## 安装 Gulp

### 方式 1: 全局安装 + 本地安装（推荐）

```bash
# 1. 全局安装 Gulp CLI（命令行工具）
npm install --global gulp-cli

# 验证安装
gulp --version
# CLI version: 2.3.0

# 2. 在项目目录中初始化 npm
mkdir my-project
cd my-project
npm init -y

# 3. 本地安装 Gulp（作为项目依赖）
npm install --save-dev gulp

# 验证本地安装
npx gulp --version
# CLI version: 2.3.0
# Local version: 4.0.2
```

### 方式 2: 仅本地安装

```bash
# 不全局安装，全部使用本地版本
mkdir my-project
cd my-project
npm init -y

# 安装 Gulp 和 Gulp CLI 到本地
npm install --save-dev gulp gulp-cli

# 在 package.json 中添加 scripts
{
  "scripts": {
    "gulp": "gulp"
  }
}

# 使用 npm 运行
gulp 任务名
```

### 方式 3: 使用 npx（无需全局安装）

```bash
# 直接通过 npx 运行（npm 5.2+）
npx gulp 任务名

# 或者添加到 package.json
{
  "scripts": {
    "build": "gulp build",
    "watch": "gulp watch",
    "dev": "gulp dev"
  }
}
```

---

## 验证安装

### 检查全局安装

```bash
# 检查 Gulp CLI
gulp --version

# 输出示例:
# CLI version: 2.3.0
```

### 检查本地安装

```bash
# 在项目目录中
npx gulp --version

# 输出示例:
# CLI version: 2.3.0
# Local version: 4.0.2
```

### 检查 npm 包

```bash
# 查看全局安装的包
npm list -g --depth=0

# 查看项目本地安装的包
npm list --depth=0
```

---

## 第一个 Gulp 项目

### 1. 创建项目目录

```bash
mkdir gulp-demo
cd gulp-demo
```

### 2. 初始化项目

```bash
npm init -y
```

### 3. 安装 Gulp

```bash
# 全局安装 Gulp CLI（如果还没安装）
npm install --global gulp-cli

# 本地安装 Gulp
npm install --save-dev gulp
```

### 4. 创建源文件

```bash
# 创建目录结构
mkdir -p src/js src/css src/images dist

# 创建示例 JS 文件
echo 'function greet() {
  console.log("Hello, Gulp!");
}
greet();' > src/js/app.js

# 创建示例 CSS 文件
echo 'body {
  background: #f0f0f0;
  font-family: Arial, sans-serif;
}

.greet {
  color: #333;
  text-align: center;
}' > src/css/style.css
```

### 5. 创建 gulpfile.js

```javascript
// gulpfile.js

// 导入 Gulp
const { src, dest, watch, series, parallel } = require('gulp');

// 定义任务：复制文件
gulp.task('copy', () => {
  return src('src/**/*')
    .pipe(dest('dist/'));
});

// 定义任务：压缩 CSS（需要先安装 gulp-clean-css）
gulp.task('styles', () => {
  const cleanCSS = require('gulp-clean-css');
  
  return src('src/css/**/*.css')
    .pipe(cleanCSS())
    .pipe(dest('dist/css'));
});

// 定义任务：压缩 JS（需要先安装 gulp-uglify）
gulp.task('scripts', () => {
  const uglify = require('gulp-uglify');
  
  return src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(dest('dist/js'));
});

// 定义默认任务
gulp.task('default', gulp.series('copy'));

// 导出任务（Gulp 4.x 推荐方式）
exports.copy = copy;
exports.styles = styles;
exports.scripts = scripts;
exports.default = series(copy);
```

### 6. 安装所需插件

```bash
# 安装 CSS 压缩插件
npm install --save-dev gulp-clean-css

# 安装 JS 压缩插件
npm install --save-dev gulp-uglify
```

### 7. 运行任务

```bash
# 运行默认任务
gulp

# 运行指定任务
gulp copy
gulp styles
gulp scripts

# 运行组合任务（Gulp 4.x）
gulp series(copy, styles, scripts)
gulp parallel(styles, scripts)
```

### 8. 创建监听任务

```javascript
// 监听文件变化
gulp.task('watch', () => {
  watch('src/js/**/*.js', scripts);
  watch('src/css/**/*.css', styles);
  watch('src/images/**/*', copyImages);
});

// 开发模式
gulp.task('dev', series('build', 'watch'));

// 导出
exports.watch = watch;
exports.dev = dev;
```

### 9. 运行监听

```bash
# 启动监听
gulp watch

# 或者开发模式
gulp dev
```

---

## 常见问题解决

### 问题 1: Gulp 命令找不到

```bash
# 错误: command not found: gulp

# 解决方案 1: 使用 npx
npx gulp

# 解决方案 2: 添加到 npm scripts
echo '{"scripts": {"gulp": "gulp"}}' > package.json
npm run gulp

# 解决方案 3: 重新安装 Gulp CLI
npm uninstall -g gulp-cli
npm install -g gulp-cli
```

### 问题 2: Gulp 3.x 与 4.x 的区别

```bash
# 检查版本
gulp -v

# 如果是 Gulp 3.x，建议升级到 4.x
npm uninstall --save-dev gulp
npm install --save-dev gulp@^4.0.0
```

### 问题 3: 权限错误

```bash
# macOS/Linux 权限错误
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# 或者使用 nvm（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
```

---

## 📚 相关链接

- [Gulp 核心概念](./核心概念.md)
- [Gulp 基本使用](./基本使用.md)
- [Gulp 常用插件](../03-常用插件/常用插件.md)
- [官方文档](https://gulpjs.com/docs/en/getting-started/quick-start)

---

**标签**: #gulp #前端构建 #工程化 #npm #nodejs
