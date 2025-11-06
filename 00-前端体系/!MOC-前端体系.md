# 前端全局导航 MOC
> 本笔记作为前端知识体系的顶层索引，串联所有子 MOC 和关键原子笔记。  
> 用法：作为入口导航，按需跳转到各层级或专题笔记。

---

## 🚀 快速起点
- [前端概览-路线图](./前端概览-路线图.md) — 学习路径与技能地图  
- [前端核心能力清单](./前端核心能力清单.md) — 必备技能与成熟度模型  
- [每日/每周学习清单](./每日每周学习清单.md) — 学习任务与复习计划  

---

## 🧱 核心语言与规范
### HTML
- [HTML-MOC](./HTML/!MOC-HTML.md)  
- [语义化HTML](./HTML/语义化HTML.md)  
- [表单与验证](./HTML/表单与验证.md)  
- [无障碍基础-ARIA入门](./HTML/无障碍基础-ARIA入门.md)  

### CSS
- [CSS-MOC](./CSS/!MOC-CSS.md)  
- [布局（Flex/Grid）](./CSS/布局-Flex-Grid.md)  
- [响应式设计/移动优先](./CSS/响应式设计-移动优先.md)  
- [CSS现代写法（变量/自定义属性/容器查询）](./CSS/CSS现代写法.md)  
- [性能与关键渲染路径](./CSS/性能与关键渲染路径.md)  

### JavaScript / TypeScript
- [JavaScript MOC](./02-javascript/!MOC-javascript.md)
- [TypeScript-MOC](./TypeScript/!MOC-TypeScript.md)  
- [编译时类型设计](./TypeScript/编译时类型设计.md)  
- [运行时类型保护与模式](./TypeScript/运行时类型保护与模式.md)  

---

## ⚙️ 前端框架与库
- [React-MOC](./React/!MOC-React.md)  
  - [Hooks原理与实践](./React/Hooks原理与实践.md)  
  - [组件设计模式](./React/组件设计模式.md)  
  - [性能优化（memo、虚拟化）](./React/性能优化.md)  
- [Vue-MOC](./Vue/!MOC-Vue.md)  
  - [响应式原理（Proxy/依赖收集）](./Vue/响应式原理.md)  
- [Angular-MOC](./Angular/!MOC-Angular.md)  
- [状态管理-MOC](./状态管理/!MOC-状态管理.md)  
  - [Redux](./状态管理/Redux.md)  
  - [Redux-Saga](./状态管理/Redux-Saga.md)  
  - [Redux/RTK](./状态管理/Redux-Toolkit.md)  
  - [MobX](./状态管理/MobX.md)  
  - [Recoil/State Machines（XState）](./状态管理/Recoil-XState.md)  
- [组件库与设计系统-MOC](./组件库与设计系统/!MOC-组件库与设计系统.md)  
  - [设计代数/Token/主题切换](./组件库与设计系统/设计代数-Token-主题切换.md)  
  - [可复用组件规范](./组件库与设计系统/可复用组件规范.md)  

---

## 📦 构建、工具链与打包
- [工具链与构建-MOC](./工具链与构建/!MOC-工具链与构建.md)  
  - [Vite原理与配置](./工具链与构建/Vite原理与配置.md)  
  - [Webpack深入（loader/plugin）](./工具链与构建/Webpack深入.md)  
  - [Rollup/ESBuild/SWC对比](./工具链与构建/Rollup-ESBuild-SWC对比.md)  
  - [Babel转换管线](./工具链与构建/Babel转换管线.md)  
- [包管理与版本策略（npm/yarn/pnpm）](./工具链与构建/包管理与版本策略.md)  
- [Monorepo管理（pnpm workspace/Lerna/Turborepo）](./工具链与构建/Monorepo管理.md)  

---

## 🔁 前端工程化与最佳实践
- [项目脚手架与目录结构](./工程化/项目脚手架与目录结构.md)  
- [代码规范（ESLint/Prettier）](./工程化/代码规范.md)  
- [模块化与分包（code-splitting/lazy）](./工程化/模块化与分包.md)  
- [国际化i18n / L10n](./工程化/国际化i18n-L10n.md)  
- [权限与多租户](./工程化/权限与多租户.md)  

---

## 🧪 测试与质量保障
- [测试-MOC](./测试/!MOC-测试.md)  
  - [单元测试（Jest/Vitest）](./测试/单元测试.md)  
  - [集成测试（Testing Library/Cypress）](./测试/集成测试.md)  
  - [端到端测试（Playwright/Cypress）](./测试/端到端测试.md)  
  - [契约测试 / 可测试性策略](./测试/契约测试.md)  
- [静态分析与类型安全](./测试/静态分析与类型安全.md)  
- [可观测性（覆盖率/错误率）](./测试/可观测性.md)  

---

## ⚡ 性能与可观测性
- [性能-MOC](./性能/!MOC-性能.md)  
  - [加载性能（LCP/FCP/TTI）](./性能/加载性能.md)  
  - [运行时性能（FPS/长任务）](./性能/运行时性能.md)  
  - [关键资源优化（图片/字体/预加载）](./性能/关键资源优化.md)  
  - [代码分割与按需加载](./性能/代码分割与按需加载.md)  
- [监控/日志/用户行为分析（RUM）](./性能/监控-日志-用户行为分析.md)  
- [性能回归检测流程](./性能/性能回归检测流程.md)  

---

## ♿ 可访问性（A11y）
- [无障碍-MOC](./无障碍/!MOC-无障碍.md)  
  - [WCAG关键点](./无障碍/WCAG关键点.md)  
  - [键盘导航/屏幕阅读器测试](./无障碍/键盘导航-屏幕阅读器测试.md)  
  - [可访问性自动化工具](./无障碍/可访问性自动化工具.md)  

---

## 🔐 安全
- [前端安全-MOC](./安全/!MOC-前端安全.md)  
  - [XSS/CSRF原理与防护](./安全/XSS-CSRF原理与防护.md)  
  - [内容安全策略（CSP）](./安全/内容安全策略-CSP.md)  
  - [安全依赖管理](./安全/安全依赖管理.md)  

---

## 🌐 网络与后端交互
- [网络与传输-MOC](./网络与传输/!MOC-网络与传输.md)  
  - [HTTP/2/3、TLS基础](./网络与传输/HTTP-2-3-TLS基础.md)  
  - [缓存策略（HTTP cache、Service Worker）](./网络与传输/缓存策略.md)  
- [数据获取与缓存](./网络与传输/数据获取与缓存.md)  
  - [REST/GraphQL/Streaming（SSE/WebSocket）](./网络与传输/REST-GraphQL-Streaming.md)  
  - [客户端缓存策略（SWR/React Query）](./网络与传输/客户端缓存策略.md)  
- [离线与PWA](./网络与传输/离线与PWA.md)  

---

## 🏗 架构与工程设计
- [架构-MOC](./架构/!MOC-架构.md)  
  - [微前端（module federation / iframe / web components）](./架构/微前端.md)  
  - [前端分层（Shell、Micro Apps）](./架构/前端分层.md)  
  - [可扩展组件系统设计](./架构/可扩展组件系统设计.md)  
  - [DDD/边界上下文在前端的实践](./架构/DDD-边界上下文在前端的实践.md)  

---

## 📱 移动与跨平台
- [移动性能与适配](./移动与跨平台/移动性能与适配.md)  
- [React Native / Flutter 基本对照](./移动与跨平台/React-Native-Flutter基本对照.md)  
- [响应式与适配策略（视口/触控/高分屏）](./移动与跨平台/响应式与适配策略.md)  

---

## 🎨 UX / 设计协作
- [设计系统-MOC](./设计系统/!MOC-设计系统.md)  
  - [组件规范与可访问性](./设计系统/组件规范与可访问性.md)  
  - [设计Tokens与主题管理](./设计系统/设计Tokens与主题管理.md)  
- [交互设计基础（动画/微交互）](./设计系统/交互设计基础.md)  
- [用户研究与可用性测试流程](./设计系统/用户研究与可用性测试流程.md)  

---

## 🧰 运维 / 部署 / CI-CD
- [部署与发布-MOC](./部署与发布/!MOC-部署与发布.md)  
  - [静态站点托管（Netlify/Vercel）](./部署与发布/静态站点托管.md)  
  - [CDN与缓存策略](./部署与发布/CDN与缓存策略.md)  
- [CI/CD流程（GitHub Actions/GitLab CI）](./部署与发布/CI-CD流程.md)  
- [回滚 / Canary / 灰度发布策略](./部署与发布/回滚-Canary-灰度发布策略.md)  

---

## 🧾 法规 / 合规 / 隐私
- [隐私与合规（GDPR/CCPA）](./合规/隐私与合规-GDPR-CCPA.md)  
- [数据脱敏与用户同意管理](./合规/数据脱敏与用户同意管理.md)  

---

## 📈 观测、运营与商业指标
- [指标体系（DAU/MAU/转化率/性能KPIs）](./运营/指标体系.md)  
- [A/B测试与实验平台](./运营/AB测试与实验平台.md)  
- [埋点策略与数据质量](./运营/埋点策略与数据质量.md)  

---

## 🧑‍🤝‍🧑 团队协作与流程
- [代码评审最佳实践](./团队协作/代码评审最佳实践.md)  
- [设计/产品/研发协作流程](./团队协作/设计-产品-研发协作流程.md)  
- [知识共享（内部文档/技术分享）](./团队协作/知识共享.md)  
- [招聘与面试题库](./团队协作/招聘与面试题库.md)  

---

## 🔎 深入专题（研究/前沿）
- [WebAssembly](./前沿/WebAssembly.md)  
- [Edge Computing / Functions at Edge](./前沿/Edge-Computing.md)  
- [Server Components / SSR / ISR](./前沿/Server-Components-SSR-ISR.md)  
- [GraphQL进阶（订阅/性能）](./前沿/GraphQL进阶.md)  

---

## 🧭 学习资源与常用链接
- [权威规范（ECMAScript/WHATWG）](./学习资源/权威规范.md)  
- [常用工具与扩展清单](./学习资源/常用工具与扩展清单.md)  
- [书籍/博客/课程索引](./学习资源/书籍-博客-课程索引.md)  

---

## ✨ 维护规范
- MOC 文件只做索引：每个条目指向一个原子笔记或子 MOC。  
- 命名规范：`领域-子领域-MOC.md`（如`架构-微前端-MOC.md`），原子笔记按 `层级/主题/概念.md` 命名。  
- 更新频率：每次新增笔记后，务必在对应 MOC 中加入链接并补充简短注释。  
- 标签建议：`#level/基础 #level/进阶 #type/概念 #type/实践`，便于筛选与 Graph View 可视化。  
