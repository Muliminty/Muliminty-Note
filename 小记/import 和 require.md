在JavaScript中，`import` 和 `require` 都是用来导入模块的关键字，但它们属于不同的模块系统，并且有不同的特性和用法。

`require` 是 CommonJS 规范的一部分，主要应用于 Node.js 环境。它执行同步加载模块的，当执行到 `require` 语句时，会立即加载并执行模块代码。`require` 支持动态导入，可以在代码的任何位置动态地导入模块，不受位置限制。

而 `import` 是 ES6 (ECMAScript 2015) 引入的模块规范，主要应用于现代浏览器和前端框架。`import` 是静态引入，即在编译时确定模块依赖关系，且 `import` 语句必须位于模块的顶层作用域。`import` 是异步加载模块的，加载过程不会阻塞脚本的执行。

具体来说，`import` 和 `require` 的区别包括：

1. **语法**：
    
    - `require` 是 CommonJS 的模块引入方式，语法为：`const module = require('module')`。
        
    - `import` 是 ES6 的模块引入方式，语法为：`import module from 'module'`。
        
2. **动态加载**：
    
    - `require` 是动态加载模块的，可以在代码的任何地方使用。
        
    - `import` 是静态加载模块的，只能在文件的顶部使用。
        
3. **导出方式**：
    
    - `require` 是通过 `module.exports` 导出模块的。
        
    - `import` 是通过 `export` 导出模块的。
        
4. **适用环境**：
    
    - `require` 通常用于 Node.js 和一些早期的前端打包工具（如 Browserify）。
        
    - `import` 用于现代浏览器和 Node.js 环境。
        
5. **性能**：
    
    - `require` 由于是同步加载，可能会阻塞执行，特别是当模块较大或较多时。
        
    - `import` 由于是异步加载，可以提高应用程序的性能。
        
6. **缓存方式**：
    
    - 多次引入同一模块时，`require` 和 `import` 都会缓存模块，避免重复执行。
        

开发者可以根据具体的使用场景和需求，选择合适的导入方式。例如，在构建现代Web应用时，可能会优先选择 `import` 语法；而在Node.js环境中，可能会使用 `require`。

### 能否举例说明 import 和 require 在实际开发中的应用场景？

#### 使用 `import` 的场景（ES6 模块）

假设你正在开发一个 React 应用，并且想要导入 React 库以及你的组件和工具函数。

**导入 React 库**：


```javascript
import React from 'react';
import ReactDOM from 'react-dom';
```

**导入自定义组件**：


```javascript
import MyComponent from './MyComponent';
```

**导入工具函数**：


```javascript
import { add, subtract } from './mathUtils';
```

**导入 CSS**（如果你使用的是支持 CSS 模块的构建工具）：


```javascript
import './App.css';
```

**按需导入**（仅导入你需要的部分）：


```javascript
import { useState } from 'react';
```

**默认导入**（当模块使用默认导出时）：


```javascript
import MyDefaultComponent from './MyComponent';
```

#### 使用 `require` 的场景（CommonJS 模块）

假设你正在使用 Node.js 构建一个后端服务，并且想要导入各种模块。

**导入核心模块**：


```javascript
const fs = require('fs');
const path = require('path');
```

**导入第三方模块**（例如 lodash）：


```javascript
const _ = require('lodash');
```

**导入本地模块**：


```javascript
const config = require('./config');
const MyComponent = require('./MyComponent');
```

**动态导入模块**（在运行时根据条件导入模块）：


```javascript
if (someCondition) {
  const module = require('some-module');
}
```

**导入 JSON 文件**：


```javascript
const packageJson = require('./package.json');
```

**按需导入**（仅导入你需要的部分）：


```javascript
const { join } = require('path');
```

**总结**

在前端开发中，`import` 通常用于导入 JavaScript 模块、CSS 文件、图片资源等，特别是在使用现代 JavaScript 框架（如 React、Vue、Angular）时。它提供了更好的语法和静态分析能力，有助于构建工具进行代码分割和优化。

在 Node.js 环境中，`require` 更为常见，因为它是 Node.js 的默认模块系统。它允许动态导入模块，这在某些场景下非常有用，例如条件导入或基于环境的导入。

随着时间的推移，ES6 模块正在逐渐成为前端和 Node.js 的标准模块系统。从 Node.js 12 开始，Node.js 已经支持使用 `import` 和 `export` 语法，但 `require` 仍然被广泛使用，特别是在旧项目中。