角色定位：前端负责人，主力工程师

面试节奏把握
自我介绍 -> 项目介绍 -> 0-1项目搭建 ->  项目搭建个人亮点拓展（下文） -> ... 

项目搭建要点：
1.文件结构梳理
2.封装公用组件（自定义hook）以及全局状态方案调研（可以从Redux dva着手）
3.axios请求二次封装
4.eslint + prettier + husky 代码校验，代码格式化以及提交规范统一
5.代码质量检测 -> 从分支管理的角度以及结合第四点一起说
6.打包优化

### 具体场景问题展开

### 1.性能优化场景

① **减少HTTP请求**

- **合并文件**：将多个CSS或JavaScript文件合并为一个，减少HTTP请求次数。
- **使用CSS Sprites**：将多个小图标合并为一张大图，通过CSS定位显示所需部分。
- **内联小资源**：将小的CSS或JavaScript代码直接内联在HTML中，减少外部请求。

② **压缩和优化资源**

- **压缩CSS、JavaScript和HTML**：使用工具如UglifyJS、CSSNano等压缩代码，减少文件大小。
- **优化图片**：使用适当的图片格式（如WebP），压缩图片大小，使用响应式图片（`srcset`）。
- **启用Gzip/Brotli压缩**：在服务器端启用Gzip或Brotli压缩，减少传输文件大小。

③ **项目中组件的懒加载**

④ **优化CSS和JavaScript**

- **减少重绘和回流**：避免频繁操作DOM，使用`transform`和`opacity`等属性减少重绘和回流。
- **使用CSS动画代替JavaScript动画**：CSS动画通常比JavaScript动画性能更好。
- **避免使用昂贵的CSS选择器**：如`*`、`>`等，减少样式计算时间。

⑤ **打包配置相关优化**

vite:

依赖预构建
```js
// vite.config.js 
export default { 
  optimizeDeps: { include: ["lodash-es"], // 强制预构建特定依赖 
   exclude: ["vue"], // 排除无需预构建的库 } 
}
```

代码分割
```js
// vite.config.js

export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor' // 将 node_modules 代码单独打包
          }
        }
      }
    }
  }
}
```

静态资源处理
```js
// vite.config.js

export default {
  build: {
    assetsInlineLimit: 4096, // <4KB 文件转 base64
    chunkSizeWarningLimit: 1000, // 调整 chunk 大小警告阈值
  }
}
```


webpack:
缓存策略
```js
// webpack.config.js

module.exports = {
  cache: {
    type: 'filesystem', // 启用持久化缓存
  },
  output: {
    filename: '[name].[contenthash].js' // 内容哈希命名
  }
}
```

Tree Shaking 优化
```js
// webpack.config.js

module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true, // 启用 Tree Shaking
    concatenateModules: true // 启用 Scope Hoisting
  }
}

```

### 2.组件重构场景

例：在组件重构的过程中，在保持原有业务逻辑不变的同时减少组件的冗余代码，优化整理判断，使用hook以及新的状态管理方案进行梳理

可以提到提到旧代码当时的状态管理方案对于redux的使用率不高，针对全局的公共组件一言不合就挂载到window上，这对于代码整体的数据环境污染非常严重，优化之后整体完全采用redux,路由映射渲染页面以及组件，Provider的store中注册saga的中间件以及reducer，静态数据统一用reducer处理，saga可以通过映射表访问到对应的业务接口

### 3.用户体验提升场景 
可以从上面代码优化的角度展开说明

### 4.代码质量管理场景

上述第四点

### 5.移动端适配场景

我们H5端有一套比较成熟的rem计算方案，通过在b端对每个组件设置好样式数据以及是否放缩，在组件容器的上层对每个组件进行scale的缩放，大致的思路是把document的fontSize大小设置成跟窗口成一定比例的大小，从而实现响应式效果。

//docEl.style.fontSize = 32 * (调试设备宽度 / 设计图宽度) + 'px';

// 在写页面的过程中保持 调试设备宽度 等于 设计图宽度 就可以。
            


### 6. 技术选型场景

- **Vue**：
    - 更简单易学，文档清晰且友好，适合初学者。
    - 提供了更多的内置功能（如指令、过渡动画等），减少了学习第三方库的需求。
- **React**：
    - 学习曲线稍陡，尤其是需要理解 JSX、状态管理、Hooks 等概念。
    - 更灵活，但需要开发者自行选择和集成第三方库（如路由、状态管理）。

**建议**：如果是新手团队或快速开发项目，Vue 可能更合适；如果需要更灵活的技术栈或团队有一定经验，React 是更好的选择。

- **Vue**：
    - 提供了更直观的开发体验，模板语法易于理解，内置指令（如 `v-if`、`v-for`）简化了开发。
    - 单文件组件（SFC）将 HTML、CSS 和 JavaScript 放在一个文件中，便于维护。
- **React**：
    - 使用 JSX，将 HTML 和 JavaScript 混合在一起，灵活性更高，但可能需要适应。
    - 需要开发者自行组织代码结构，可能更灵活但也更复杂。

**建议**：如果团队更喜欢模板语法和结构化开发，选择 Vue；如果团队更喜欢 JavaScript 驱动的开发方式，选择 React。

- **React**：
    - 更适合大型复杂项目，尤其是需要高度定制化或与其他技术栈集成的场景。
    - 适合有经验的团队，能够灵活应对技术栈的变化。
- **Vue**：
    - 更适合中小型项目，尤其是需要快速开发的场景。
    - 适合新手团队或希望减少技术复杂度的团队。

**建议**：根据项目规模和团队经验选择，React 适合大型复杂项目，Vue 适合中小型项目。


### 7.遇到的难题

#### 示例 ：跨浏览器兼容性问题

**Situation**：  
在开发一个企业级管理系统时，我们发现某些功能在 IE 浏览器中无法正常运行。

**Task**：  
我的任务是确保系统在所有主流浏览器中都能正常运行，包括 IE 11。

**Action**：

1. 使用 Can I Use 和 Babel 检查代码的兼容性，发现主要是由于使用了 ES6+ 语法和 CSS Grid 布局。
2. 配置 Babel 和 PostCSS，将代码转换为兼容 IE 的 ES5 语法，并使用 Flexbox 替代 CSS Grid。
3. 使用 Polyfill 填补 IE 缺失的 API（如 `Promise`、`fetch`）。
4. 在 IE 中测试并修复剩余的样式和功能问题。

**Result**：  
系统在 IE 11 中正常运行，兼容性问题得到解决。通过这次经历，我掌握了跨浏览器兼容性调试的技巧。

可以举一反三讲移动端的


### 8.个人缺点
🚫 避免空话：不要说“我太追求完美”或“我工作太拼命”，显得敷衍。
🚫 避免甩锅：不要说“我的缺点是团队合作不好，因为同事水平差”。
✅ 强调行动：用学习计划、项目实践、方法论改进等证明你正在解决问题。
自由发挥
### 9.加班的看法 

我认为合理的加班是团队责任感的体现，比如重大项目上线或紧急故障修复时，我会主动配合进度。但常态化的加班可能意味着需求规划或技术方案需要优化。我个人更倾向于通过提升工作效率（如任务拆解、自动化工具）来减少不必要的加班，保持可持续的工作节奏。


### 10.谈薪

我个人期望的薪资大概在10-12这个区间，但是我也非常愿意根据贵公司的薪资结构和福利待遇做一定调整


