---
title: "Loader 详解"
date: "2026-04-21"
lastModified: "2026-04-21"
tags: ["前端开发", "工程化", "Webpack", "Loader"]
moc: "[[!MOC-Webpack]]"
description: "介绍 Webpack Loader 的职责、执行顺序与常见配置方式。"
publish: true
toc: true
---

# Loader 详解

> Loader 是 Webpack 的核心功能之一，用于转换非 JavaScript 文件。本章详细介绍 Loader 的工作原理、常用 Loader 的使用方法，以及如何自定义 Loader。

---

## 📋 学习目标

- ✅ 理解 Loader 的工作原理
- ✅ 掌握常用 Loader 的配置
- ✅ 理解 Loader 的执行顺序
- ✅ 学会自定义 Loader
- ✅ 掌握 Loader 的最佳实践

---

## Loader 工作原理

### 什么是 Loader

Loader 是一个函数，接收源文件内容，返回转换后的内容。

```
源文件 → Loader1 → Loader2 → Loader3 → 最终结果
```

### Loader 的基本结构

```javascript
module.exports = function(source) {
  // source 是源文件的内容（字符串）
  // 进行转换处理
  const result = transform(source)
  // 返回转换后的内容
  return result
}
```

### Loader 的执行流程

1. Webpack 识别需要处理的文件（通过 `test` 匹配）
2. 按顺序执行 Loader（从右到左）
3. 每个 Loader 接收上一个 Loader 的输出
4. 最后一个 Loader 返回 JavaScript 代码

---

## 常用 Loader

### 1. Babel Loader（转译 JavaScript）

**安装**：
```bash
npm install --save-dev babel-loader @babel/core @babel/preset-env
```

**配置**：
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
            presets: ['@babel/preset-env'],
            plugins: []
          }
        }
      }
    ]
  }
}
```

**高级配置**：
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,  // 启用缓存
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: 3
              }],
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      }
    ]
  }
}
```

### 2. CSS Loader

**安装**：
```bash
npm install --save-dev style-loader css-loader
```

**基础配置**：
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',  // 将 CSS 注入到 DOM
          'css-loader'      // 解析 CSS 文件
        ]
      }
    ]
  }
}
```

**CSS Modules 配置**：
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]'
              },
              importLoaders: 1
            }
          }
        ]
      }
    ]
  }
}
```

### 3. Sass/Less Loader

**安装**：
```bash
npm install --save-dev sass-loader sass
# 或
npm install --save-dev less-loader less
```

**Sass 配置**：
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

**Less 配置**：
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  }
}
```

### 4. PostCSS Loader

**安装**：
```bash
npm install --save-dev postcss postcss-loader autoprefixer
```

**配置**：
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer')
                ]
              }
            }
          }
        ]
      }
    ]
  }
}
```

**postcss.config.js**：
```javascript
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

### 5. 文件资源 Loader（Webpack 5）

**Webpack 5 使用 Asset Modules**：
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext]'
        }
      }
    ]
  }
}
```

**小文件转 base64**：
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/,
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

### 6. TypeScript Loader

**安装**：
```bash
npm install --save-dev ts-loader typescript
# 或使用 babel-loader
npm install --save-dev @babel/preset-typescript
```

**ts-loader 配置**：
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

**Babel 配置**：
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript']
          }
        }
      }
    ]
  }
}
```

### 7. 字体文件 Loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext]'
        }
      }
    ]
  }
}
```

### 8. 数据文件 Loader

**JSON**：
```javascript
// Webpack 5 内置支持，无需配置
import data from './data.json'
```

**CSV/TSV**：
```bash
npm install --save-dev csv-loader
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(csv|tsv)$/,
        use: 'csv-loader'
      }
    ]
  }
}
```

---

## Loader 执行顺序

### 执行顺序规则

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

**执行流程**：
1. `sass-loader` 将 SCSS 转换为 CSS
2. `css-loader` 解析 CSS 中的 `@import` 和 `url()`
3. `style-loader` 将 CSS 注入到 DOM

### 使用对象配置 Loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'singletonStyleTag'
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          'sass-loader'
        ]
      }
    ]
  }
}
```

---

## 自定义 Loader

### 基础 Loader

**loaders/my-loader.js**：
```javascript
module.exports = function(source) {
  // source 是源文件内容
  const result = source.replace(/console\.log\(/g, '// console.log(')
  return result
}
```

**使用自定义 Loader**：
```javascript
const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, 'loaders/my-loader.js')
        ]
      }
    ]
  }
}
```

### 带选项的 Loader

**loaders/replace-loader.js**：
```javascript
module.exports = function(source) {
  const options = this.getOptions() || {}
  const { search, replace } = options
  
  if (search && replace) {
    return source.replace(new RegExp(search, 'g'), replace)
  }
  
  return source
}
```

**使用**：
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve(__dirname, 'loaders/replace-loader.js'),
            options: {
              search: 'OLD_TEXT',
              replace: 'NEW_TEXT'
            }
          }
        ]
      }
    ]
  }
}
```

### 异步 Loader

```javascript
module.exports = function(source) {
  const callback = this.async()
  
  // 异步操作
  setTimeout(() => {
    const result = source.toUpperCase()
    callback(null, result)
  }, 1000)
}
```

### 返回多个结果

```javascript
module.exports = function(source) {
  // 返回多个结果
  this.emitFile('extra-file.js', 'extra content')
  return source
}
```

---

## Loader 最佳实践

### 1. 使用 include/exclude

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
}
```

### 2. 使用 oneOf（只匹配一个规则）

```javascript
module.exports = {
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader'
          },
          {
            test: /\.js$/,
            use: 'babel-loader'
          }
        ]
      }
    ]
  }
}
```

### 3. 启用缓存

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  }
}
```

### 4. 使用 enforce 控制执行顺序

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',  // 在其他 Loader 之前执行
        use: 'eslint-loader'
      },
      {
        test: /\.js$/,
        enforce: 'post',  // 在其他 Loader 之后执行
        use: 'some-loader'
      }
    ]
  }
}
```

---

## 完整配置示例

```javascript
const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.(css|scss)$/,
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
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024
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
  }
}
```

---

## 总结

- **Loader 作用**：转换非 JavaScript 文件
- **执行顺序**：从右到左（或从下到上）
- **常用 Loader**：Babel、CSS、Sass、文件资源等
- **自定义 Loader**：可以创建自己的 Loader 处理特殊需求
- **最佳实践**：使用 include/exclude、启用缓存、控制执行顺序

---

## 下一步

- [Plugin 详解](./05-Plugin详解.md) - 学习插件的使用
- [开发环境配置](./06-开发环境配置.md) - 配置开发环境
- [实战项目：从零搭建 React 项目](./10-实战项目-React.md) - 实践 Loader 配置

---

#Webpack #Loader #资源处理 #自定义Loader
