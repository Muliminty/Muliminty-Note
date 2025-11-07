# React MOC

> React 是一个用于构建用户界面的 JavaScript 库，采用组件化开发模式。
> 
> **学习路径**：学习 React 前需要掌握 [JavaScript 基础](../../01-基础入门/JavaScript/!MOC-javascript.md)。React 通常配合 [状态管理](../状态管理/!MOC-状态管理.md) 使用，推荐学习 [TypeScript](../TypeScript/!MOC-TypeScript.md) 增强类型安全。
> 
> **参考资源**：本知识体系参考了 [Dan Abramov 的博客](https://overreacted.io/)（React 核心团队成员）和 [React 官方文档](https://react.dev/)。

---

## 📚 知识体系结构

### 01-基础入门（Foundation）

**目标**：掌握 React 核心概念，能够使用 React 构建简单应用

#### 核心概念
- **JSX 语法** - JavaScript XML，React 的声明式语法
  - JSX 语法规则
  - JSX 表达式
  - JSX 属性
  - JSX 条件渲染
  - JSX 列表渲染
- **组件（Components）** - React 的构建块
  - 函数组件 vs 类组件
  - 组件组合
  - 组件复用
- **Props（属性）** - 组件间数据传递
  - Props 传递
  - Props 类型检查
  - Props 默认值
  - Children Props
- **State（状态）** - 组件内部可变数据
  - State 的声明和使用
  - State 更新机制
  - State 提升
- **事件处理（Event Handling）**
  - 事件绑定
  - 事件对象
  - 合成事件（SyntheticEvent）
  - 事件委托
  - 事件处理最佳实践
- **条件渲染**
  - if/else 条件渲染
  - 三元运算符
  - 逻辑与运算符
  - 阻止组件渲染
- **列表渲染**
  - 渲染列表
  - Key 的使用
  - 列表更新优化

**学习检查点**：能够使用 React 创建简单的交互式组件

---

### 02-核心机制（Core Mechanisms）

**目标**：深入理解 React 的工作原理和核心机制

#### React 作为 UI 运行时（React as a UI Runtime）
- **React 的设计理念**
  - 声明式编程
  - 组件化思想
  - 单向数据流
- **虚拟 DOM（Virtual DOM）**
  - 虚拟 DOM 概念
  - 虚拟 DOM 的优势
  - Diff 算法原理
  - Reconciliation（协调）过程
- **渲染机制**
  - 渲染流程
  - 渲染优化
  - 批量更新（Batching）
  - React 18 自动批处理（Automatic Batching）
- **React 元素（React Elements）**
  - React.createElement
  - 元素 vs 组件
  - 元素的不可变性

#### 组件生命周期（Component Lifecycle）
- **类组件生命周期**
  - Mounting（挂载）
  - Updating（更新）
  - Unmounting（卸载）
  - 生命周期方法详解
- **函数组件生命周期**
  - useEffect 替代生命周期
  - 生命周期对比

**学习检查点**：能够理解 React 的渲染机制和更新流程

---

### 03-Hooks 深度理解（Hooks Deep Dive）

**目标**：掌握 Hooks 的原理和使用，理解 Hooks 的设计思想

> **参考**：基于 [Dan Abramov 的 Hooks 系列文章](https://overreacted.io/a-complete-guide-to-useeffect/)

#### Hooks 基础
- **Hooks 简介**
  - 为什么需要 Hooks
  - Hooks 的设计理念
  - Hooks 规则
- **useState Hook**
  - 基本用法
  - 函数式更新
  - 状态更新机制
  - 状态更新批处理
- **useEffect Hook**
  - 副作用概念
  - useEffect 完整指南（参考：[A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)）
  - 依赖数组
  - 清理函数（Cleanup）
  - 常见陷阱和解决方案
- **useContext Hook**
  - Context API 基础
  - useContext 使用
  - Context 性能优化
- **useReducer Hook**
  - Reducer 模式
  - useReducer vs useState
  - 复杂状态管理

#### Hooks 进阶
- **useMemo 和 useCallback**
  - 性能优化原理
  - 何时使用 useMemo
  - 何时使用 useCallback
  - 常见误区（参考：[Before You memo()](https://overreacted.io/before-you-memo/)）
- **useRef Hook**
  - Ref 的使用场景
  - useRef vs useState
  - 访问 DOM 元素
  - 保存可变值
- **useLayoutEffect Hook**
  - useLayoutEffect vs useEffect
  - 使用场景
- **useId Hook**（React 18+）
  - 生成唯一 ID
  - 用于可访问性（accessibility）
  - SSR 兼容性
- **useSyncExternalStore Hook**（React 18+）
  - 外部状态订阅
  - 与外部状态库集成
  - 并发特性支持
- **useInsertionEffect Hook**（React 18+）
  - CSS-in-JS 库使用
  - DOM 注入时机
  - 性能优化
- **自定义 Hooks**
  - 自定义 Hooks 规则
  - 提取逻辑复用
  - 自定义 Hooks 最佳实践

#### Hooks 原理
- **Hooks 调用顺序的重要性**
  - 为什么 Hooks 依赖调用顺序（参考：[Why Do React Hooks Rely on Call Order?](https://overreacted.io/why-do-hooks-rely-on-call-order/)）
  - Hooks 实现原理
  - Hooks 链表结构
- **函数组件 vs 类组件**
  - 两者的区别（参考：[How Are Function Components Different from Classes?](https://overreacted.io/how-are-function-components-different-from-classes/)）
  - 闭包陷阱
  - this 绑定问题

**学习检查点**：能够正确使用 Hooks，理解 Hooks 的工作原理

---

### 04-组件设计模式（Component Design Patterns）

**目标**：掌握组件设计的最佳实践和常见模式

> **参考**：[The Elements of UI Engineering](https://overreacted.io/the-elements-of-ui-engineering/)

#### 组件设计原则
- **组件设计原则**
  - 单一职责原则
  - 可复用性
  - 可组合性
  - 可测试性
- **组件拆分策略**
  - 何时拆分组件
  - 组件粒度控制
  - 组件层次结构

#### 常见设计模式
- **容器组件 vs 展示组件（Container/Presentational）**
  - 模式概念
  - 实现方式
  - 现代替代方案
- **高阶组件（HOC - Higher-Order Components）**
  - HOC 概念
  - HOC 实现
  - HOC 使用场景
  - HOC 局限性
- **Render Props 模式**
  - Render Props 概念
  - Render Props 实现
  - Render Props vs HOC
  - 现代替代方案（Hooks）
- **组合模式（Composition）**
  - 组件组合
  - Children 模式
  - 插槽模式
- **受控组件 vs 非受控组件**
  - 受控组件
  - 非受控组件
  - 选择建议

#### 组件复用
- **逻辑复用**
  - 自定义 Hooks 复用逻辑
  - HOC 复用逻辑
  - Render Props 复用逻辑
- **UI 复用**
  - 组件库设计
  - 样式复用
  - 主题系统

#### 组件通信
- **父子组件通信**
  - Props 传递
  - 回调函数
  - Ref 转发
- **跨组件通信**
  - Context API
  - 状态提升
  - 全局事件总线（EventEmitter）
- **兄弟组件通信**
  - 状态提升到共同父组件
  - Context API
  - 状态管理库

**学习检查点**：能够设计可复用、可维护的 React 组件

---

### 05-状态管理（State Management）

**目标**：掌握 React 应用的状态管理方案

> **详细内容**：参见 [状态管理 MOC](../状态管理/!MOC-状态管理.md)

#### React 内置状态管理
- **组件状态（Component State）**
  - useState
  - useReducer
  - 状态提升
- **Context API**
  - Context 创建和使用
  - Context defaultValue
  - Context 性能优化
  - Context 最佳实践
  - Context 使用场景
  - Context 拆分策略

#### 外部状态管理库
- **Redux**
  - Redux 核心概念
  - Redux Toolkit
  - React-Redux
  - Redux 中间件（Thunk、Saga）
- **Zustand**
  - 轻量级状态管理
  - Zustand vs Redux
- **Jotai / Recoil**
  - 原子化状态管理
  - 使用场景

#### 状态管理最佳实践
- **何时使用状态管理**
- **状态管理选择指南**
- **状态管理模式**

**学习检查点**：能够根据项目需求选择合适的状态管理方案

---

### 06-性能优化（Performance Optimization）

**目标**：掌握 React 应用的性能优化技巧

> **参考**：[Before You memo()](https://overreacted.io/before-you-memo/) - Dan Abramov
> **详细内容**：参见 [性能优化 MOC](../../04-质量保障/性能/!MOC-性能.md)

#### 渲染优化
- **React.memo**
  - memo 的使用场景
  - memo 的局限性
  - 何时不需要 memo（参考：[Before You memo()](https://overreacted.io/before-you-memo/)）
- **useMemo 和 useCallback**
  - 正确的使用方式
  - 常见误区
  - 性能分析
- **PureComponent**
  - PureComponent 原理
  - PureComponent vs memo

#### 代码分割（Code Splitting）
- **React.lazy**
  - 懒加载组件
  - Suspense 配合使用
- **动态导入（Dynamic Import）**
  - import() 语法
  - 路由级别的代码分割
- **代码分割最佳实践**

#### 列表优化
- **虚拟化列表（Virtualization）**
  - react-window
  - react-virtualized
  - 虚拟化原理
- **列表渲染优化**
  - key 的重要性
  - 列表更新优化

#### 其他优化技巧
- **避免不必要的渲染**
- **批量更新**
- **Web Workers**
- **性能分析工具**
  - React DevTools Profiler
  - Performance API
  - React DevTools 使用技巧
- **调试技巧**
  - 组件调试
  - 状态调试
  - 性能分析
  - 错误追踪

**学习检查点**：能够识别和解决 React 应用的性能问题

---

### 07-高级特性（Advanced Features）

**目标**：掌握 React 的高级特性和 API

#### 错误处理
- **错误边界（Error Boundaries）**
  - 错误边界概念
  - 错误边界实现
  - 错误边界最佳实践
  - 错误边界局限性
- **错误处理策略**
  - 错误上报
  - 错误恢复

#### Portal
- **Portal 概念**
- **Portal 使用场景**
- **Portal 实现**

#### 并发特性（Concurrent Features）
- **Suspense**
  - Suspense 基础
  - Suspense 与数据获取
  - Suspense 与代码分割
  - Suspense 边界
- **useTransition**
  - 过渡状态
  - 非阻塞更新
  - startTransition API
  - isPending 状态
- **useDeferredValue**
  - 延迟值
  - 性能优化
  - 防抖替代方案
- **并发渲染**
  - 时间切片（Time Slicing）
  - 优先级调度
  - 可中断渲染
  - 自动批处理

#### 其他高级特性
- **Refs**
  - useRef
  - createRef
  - forwardRef
  - useImperativeHandle
  - callback ref
- **Fragments**
  - Fragment 使用
  - 短语法
  - key 属性
- **React 工具方法**
  - React.Children（map, forEach, count, toArray, only）
  - React.cloneElement
  - React.isValidElement
  - React.createElement
- **严格模式（Strict Mode）**
  - 严格模式作用
  - 开发工具
  - 双重渲染检测
  - 废弃 API 警告

**学习检查点**：能够使用 React 高级特性解决复杂问题

---

### 08-表单处理（Form Handling）

**目标**：掌握 React 中的表单处理

#### 表单基础
- **受控组件**
  - 受控输入
  - 受控选择
  - 受控文本域
- **非受控组件**
  - 非受控输入
  - 使用 ref 访问值
- **表单验证**
  - 基础验证
  - 实时验证
  - 错误提示

#### 表单库
- **React Hook Form**
  - 基本用法
  - 性能优势
  - 验证集成
- **Formik**
  - Formik 基础
  - Yup 验证
- **表单库对比**

#### 表单最佳实践
- **表单设计原则**
  - 表单验证策略
  - 错误处理
  - 用户体验优化
- **可访问性**
  - ARIA 标签
  - 键盘导航
  - 屏幕阅读器支持
- **高级表单场景**
  - 动态表单字段
  - 表单联动
  - 文件上传
  - 富文本编辑器

**学习检查点**：能够处理复杂的表单场景

---

### 09-路由管理（Routing）

**目标**：掌握 React 应用的路由管理

#### React Router
- **React Router 基础**
  - 路由配置
  - 路由匹配
  - 路由导航
  - BrowserRouter vs HashRouter
  - MemoryRouter
- **React Router Hooks**
  - useNavigate
  - useParams
  - useLocation
  - useSearchParams
  - useMatch
  - useRoutes
- **嵌套路由**
  - 路由嵌套
  - Outlet 组件
  - 路由匹配规则
- **路由守卫**
  - 权限控制
  - 路由拦截
  - 重定向
- **代码分割与路由**
  - 路由级别的代码分割
  - 懒加载路由组件
- **路由状态管理**
  - URL 参数管理
  - 查询参数管理
  - 路由状态持久化

#### 其他路由方案
- **Next.js 路由**
  - 文件系统路由
  - 动态路由
- **路由方案对比**

**学习检查点**：能够实现复杂的路由需求

---

### 10-测试（Testing）

**目标**：掌握 React 应用的测试方法

> **详细内容**：参见 [测试 MOC](../../04-质量保障/测试/!MOC-测试.md)

#### 测试基础
- **测试策略**
  - 单元测试
  - 集成测试
  - E2E 测试
- **测试工具**
  - Jest
  - React Testing Library
  - Enzyme（已废弃）

#### 组件测试
- **组件渲染测试**
- **用户交互测试**
- **Hooks 测试**
- **异步操作测试**
- **Context 测试**

#### 测试最佳实践
- **测试编写原则**
- **测试覆盖率**
- **Mock 和 Stub**
- **快照测试**

**学习检查点**：能够为 React 组件编写有效的测试

---

### 11-样式处理（Styling）

**目标**：掌握 React 应用的样式处理方案

#### CSS 方案
- **传统 CSS**
  - 全局 CSS
  - CSS 文件组织
  - 命名规范（BEM、CSS Modules 命名）
- **CSS Modules**
  - CSS Modules 基础
  - 作用域隔离
  - 组合和继承
- **Sass/SCSS**
  - Sass 基础
  - 变量和混入
  - 嵌套规则
  - 与 React 集成
- **Styled Components**
  - Styled Components 基础
  - 主题系统
  - 动态样式
  - 性能优化
- **Emotion**
  - Emotion 基础
  - CSS-in-JS 对比
  - 性能特性
- **Tailwind CSS**
  - Tailwind 基础
  - 与 React 集成
  - JIT 模式
  - 自定义配置
- **其他 CSS 方案**
  - Linaria（零运行时 CSS-in-JS）
  - Vanilla Extract（类型安全的 CSS）
  - CSS-in-JS vs CSS Modules
  - 方案对比与选择建议

#### 样式最佳实践
- **样式组织**
- **性能优化**
- **主题系统**

**学习检查点**：能够选择合适的样式方案

---

### 12-服务端渲染（SSR）

**目标**：掌握 React 服务端渲染

#### SSR 基础
- **SSR 概念**
  - 服务端渲染 vs 客户端渲染
  - SSR 优势
  - SSR 挑战
- **React SSR 实现**
  - renderToString
  - renderToStaticMarkup
  - renderToReadableStream（React 18+）
  - hydrate
  - hydrateRoot（React 18+）
- **React Server Components**（RSC）
  - Server Components 概念
  - Server Components vs Client Components
  - 数据获取
  - 性能优势
  - 使用场景

#### Next.js
- **Next.js 基础**
  - 项目创建
  - 页面路由
  - API 路由
  - App Router（Next.js 13+）
- **Next.js 特性**
  - 静态生成（SSG）
  - 服务端渲染（SSR）
  - 增量静态再生（ISR）
  - 图片优化
  - React Server Components 支持
  - Streaming SSR
- **Next.js 最佳实践**
  - 路由组织
  - 数据获取策略
  - 性能优化

#### 其他 SSR 方案
- **Remix**
- **Gatsby**
- **SSR 方案对比**

**学习检查点**：能够使用 Next.js 构建 SSR 应用

---

### 13-React 生态（React Ecosystem）

**目标**：了解 React 生态系统

#### 构建工具
- **Create React App**
- **Vite**
- **Webpack**
- **Parcel**

#### UI 组件库
- **Material-UI (MUI)**
- **Ant Design**
- **Chakra UI**
- **Mantine**

#### 工具库
- **数据获取**
  - React Query / TanStack Query
    - 数据获取
    - 缓存管理
    - 服务器状态管理
  - SWR
    - 数据获取
    - 实时更新
    - 缓存策略
  - Apollo Client（GraphQL）
- **动画库**
  - React Spring
    - 物理动画
    - 声明式动画
  - Framer Motion
    - 手势支持
    - 布局动画
  - React Transition Group
- **工具函数**
  - Lodash
  - Ramda（函数式编程）
  - date-fns（日期处理）

#### 移动端
- **React Native**
  - React Native 基础
  - 与 React 的差异
  - 原生模块
  - 导航（React Navigation）
  - 状态管理
- **跨平台框架**
  - Expo
  - React Native for Web
  - Taro（小程序）

**学习检查点**：能够选择合适的 React 生态工具

---

### 14-最佳实践与模式（Best Practices & Patterns）

**目标**：掌握 React 开发的最佳实践

> **参考**：[Writing Resilient Components](https://overreacted.io/writing-resilient-components/) - Dan Abramov

#### 代码组织
- **项目结构**
  - 文件组织
  - 组件组织
  - 功能模块组织
  - 特性驱动开发（Feature-driven）
- **代码规范**
  - ESLint 配置
  - Prettier 配置
  - 命名规范
  - TypeScript 类型规范
- **开发工具**
  - React DevTools
  - 调试技巧
  - 开发环境配置

#### 组件设计
- **编写健壮的组件**（参考：[Writing Resilient Components](https://overreacted.io/writing-resilient-components/)）
  - 防御性编程
  - 错误处理
  - 边界情况处理
- **可访问性（Accessibility）**
  - ARIA 属性
  - 键盘导航
  - 屏幕阅读器支持
- **国际化（i18n）**
  - react-i18next
  - 多语言支持

#### 版本管理
- **React 版本升级**
  - 版本迁移指南
  - 破坏性变更处理
  - 升级最佳实践
- **依赖管理**
  - 版本锁定策略
  - 依赖更新流程
  - 安全更新

#### 性能优化
- **性能监控**
- **性能分析**
- **优化策略**

#### 安全
- **XSS 防护**
  - 危险的 innerHTML
  - 用户输入验证
  - 内容安全策略（CSP）
- **CSRF 防护**
  - Token 验证
  - SameSite Cookie
- **依赖安全**
  - 依赖漏洞扫描
  - 安全更新
- **其他安全考虑**
  - 敏感信息处理
  - 权限控制
  - 安全最佳实践

**学习检查点**：能够编写高质量、可维护的 React 代码

---

### 15-原理深入（Deep Dive）

**目标**：深入理解 React 的实现原理

#### React 源码解析
- **React 架构**
  - Fiber 架构
  - 调度器（Scheduler）
  - 协调器（Reconciler）
  - 渲染器（Renderer）
  - 事件系统
- **Fiber 节点**
  - Fiber 数据结构
  - Fiber 树遍历
  - 工作循环
  - 双缓冲机制
- **Diff 算法**
  - Diff 策略
  - Key 的作用
  - 优化策略
  - 单节点 Diff
  - 多节点 Diff
- **Hooks 实现**
  - Hooks 数据结构
  - Hooks 调度流程
  - 状态更新流程

#### 概念深入
- **代数效应（Algebraic Effects）**
  - 概念理解（参考：[Algebraic Effects](https://overreacted.io/algebraic-effects-for-the-rest-of-us/)）
  - 在 React 中的应用
  - Suspense 原理
- **并发渲染原理**
  - 时间切片
  - 优先级调度
  - 可中断渲染

**学习检查点**：能够理解 React 的底层实现原理

---

## 📝 学习路径

### 初学者路径
1. **基础入门** → 掌握 JSX、组件、Props、State
2. **Hooks 基础** → 掌握 useState、useEffect
3. **组件设计** → 掌握组件拆分和组合
4. **状态管理** → 掌握 Context API
5. **路由** → 掌握 React Router
6. **实战项目** → 构建完整应用

### 进阶路径
1. **Hooks 深入** → 深入理解 Hooks 原理
2. **性能优化** → 掌握优化技巧
3. **高级特性** → 掌握并发特性、错误边界等
4. **状态管理** → 掌握 Redux 等方案
5. **测试** → 掌握测试方法
6. **SSR** → 掌握 Next.js

### 高级路径
1. **原理深入** → 理解 React 源码
2. **架构设计** → 大型应用架构
3. **性能优化** → 深度优化
4. **生态扩展** → 探索生态工具

---

## 📖 学习资源

### 官方资源
- [React 官方文档](https://react.dev/) - 最新官方文档
- [React 中文文档](https://zh-hans.react.dev/) - 中文官方文档
- [React GitHub](https://github.com/facebook/react) - React 源码

### 博客文章（Dan Abramov）
- [overreacted.io](https://overreacted.io/) - Dan Abramov 的博客
  - [A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)
  - [Before You memo()](https://overreacted.io/before-you-memo/)
  - [The Elements of UI Engineering](https://overreacted.io/the-elements-of-ui-engineering/)
  - [Writing Resilient Components](https://overreacted.io/writing-resilient-components/)
  - [React as a UI Runtime](https://overreacted.io/react-as-a-ui-runtime/)
  - [Why Do React Hooks Rely on Call Order?](https://overreacted.io/why-do-hooks-rely-on-call-order/)
  - [How Are Function Components Different from Classes?](https://overreacted.io/how-are-function-components-different-from-classes/)
  - [Algebraic Effects for the Rest of Us](https://overreacted.io/algebraic-effects-for-the-rest-of-us/)

### 其他资源
- [React 技术揭秘](https://react.iamkasong.com/) - 深入理解 React
- [React 模式](https://reactpatterns.com/) - React 设计模式
- [React 18 新特性](https://react.dev/blog/2022/03/29/react-v18) - React 18 官方发布说明
- [React Beta 文档](https://beta.react.dev/) - React 最新文档（测试版）

---

## 🔗 相关链接

- [JavaScript 基础](../../01-基础入门/JavaScript/!MOC-javascript.md) - React 前置知识
- [TypeScript](../TypeScript/!MOC-TypeScript.md) - 类型安全
- [状态管理](../状态管理/!MOC-状态管理.md) - 状态管理方案
- [性能优化](../../04-质量保障/性能/!MOC-性能.md) - 性能优化技巧
- [测试](../../04-质量保障/测试/!MOC-测试.md) - 测试方法

---

**最后更新**：2025
**维护规范**：参考 Dan Abramov 的博客和 React 官方文档持续更新

---

#react #前端框架 #组件化 #hooks #性能优化
