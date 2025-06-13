# Lena 执行流程详细分析笔记

## 一、require 路径解析机制
### 1.1 相对路径写法
- `require('.')` 表示当前目录，等价于 `require('./index.js')`
- `require('..')`表示父级目录，等价于 `require('../index.js')`
- 路径解析顺序：
  1. 查找 `.js` 文件
  2. 查找 `.json` 文件
  3. 查找目录下的 `package.json` main 字段
  4. 查找目录下的 `index.js`

### 1.2 调试示例
```javascript
// 正确写法（当前目录的index.js）
const module = require('.');

// 错误写法（父级目录没有index.js）
const wrongModule = require('..'); // 会报错
```

## 二、Node.js 模块加载流程
### 2.1 模块执行顺序
1. 执行 `require('./index.js')`
2. 按顺序执行模块内所有顶层代码
3. 遇到 `module.exports` 时确定导出内容
4. 返回导出对象给调用方

### 2.2 参数传递过程
```javascript
// index.js
module.exports = function main(argv) {
  // 处理逻辑
}

// 调用方式
const main = require('.');
main(process.argv.slice(2));
```
- `process.argv` 参数结构示例：
  ```bash
  [ 
    '/usr/bin/node',
    '/usr/local/bin/lena',
    'ls'
  ]
  ```
- `slice(2)` 后得到 `['ls']`

## 三、Lena 命令注册机制
### 3.1 命令文件结构
```
packages/
  list/
    command.js  # 真实入口文件
    package.json # main 字段不是真实入口
```

### 3.2 命令模块标准结构
```javascript
// command.js
module.exports = {
  command: 'ls',
  describe: 'List components',
  builder: (yargs) => {
    // 参数配置
  },
  handler: (argv) => {
    // 命令处理逻辑
  }
}
```

### 3.3 调试技巧
1. 在 `module.exports` 处设置断点
2. 使用 `Step Over` 跳过模块初始化代码
3. 使用 `Step Into` 进入依赖模块分析
4. 使用 `Step Out` 快速返回调用栈上层

## 四、核心执行流程
### 4.1 完整调用链
```
lena ls -> bin/lena.js
  require('./index.js')(process.argv.slice(2))
    -> packages/list/command.js
      -> handler 工厂函数
        -> require('./index')(参数) // 实际业务逻辑
```

### 4.2 关键节点说明
| 阶段 | 文件位置 | 主要操作 |
|------|----------|----------|
| 命令解析 | bin/lena.js | 参数切片处理 |
| 模块加载 | packages/list/command.js | 注册 yargs 命令配置 |
| 业务逻辑 | packages/list/index.js | 实现具体列表功能 |

## 五、常见调试问题排查
1. **路径加载错误**：检查 `require` 路径是否指向正确目录层级
2. **命令未注册**：确认 `package.json` 的 `main` 字段是否指向正确入口
3. **参数解析异常**：使用 `console.log(process.argv)` 验证参数切片
4. **依赖模块缺失**：通过调试器的 `Loaded Scripts` 面板检查模块加载顺序

## 六、高效调试技巧
1. **折叠代码**：使用 `Cmd + Shift + [-]` (Mac) 快速折叠所有函数
2. **条件断点**：在循环或高频调用处设置命中条件
3. **Watch 表达式**：添加 `process.argv` 和 `module.exports` 实时监控
4. **调用栈分析**：利用调试器的 Call Stack 面板回溯执行路径

## 七、核心源码摘要
### 7.1 主入口文件
```javascript
// bin/lena.js
const main = require('.'); // 加载 packages/list/index.js
main(process.argv.slice(2));
```

### 7.2 命令处理模块
```javascript
// packages/list/command.js
module.exports = {
  handler: (argv) => {
    const factory = require('.');
    return factory(argv);
  }
}
```

### 7.3 业务逻辑实现
```javascript
// packages/list/index.js
module.exports = async function (argv) {
  // 获取配置
  // 读取文件系统
  // 格式化输出
}
```