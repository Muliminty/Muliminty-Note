# GSAP 完整教程（GreenSock Animation Platform）

> GSAP（GreenSock Animation Platform）是业界最强大的 JavaScript 动画库，用于创建高性能、专业级的动画效果。
> 
> **学习路径**：GSAP 是高级动画库，需要掌握 [JavaScript](../../../../01-基础入门/JavaScript/!MOC-javascript.md) 和 [DOM 操作](../../../../01-基础入门/JavaScript/08-浏览器环境与DOM/DOM操作.md) 基础。GSAP 动画性能优化与 [性能优化](../../../../04-质量保障/性能/!MOC-性能.md) 密切相关。

---

## 📚 核心主题

### 基础入门
- [01-GSAP 基础入门](./01-GSAP基础入门.md) — GSAP 简介、安装、基本用法（需要掌握 [JavaScript](../../../../01-基础入门/JavaScript/!MOC-javascript.md) 基础）
- [02-GSAP 核心 API](./02-GSAP核心API.md) — gsap.to()、gsap.from()、gsap.fromTo() 详解

### 核心概念
- [03-Timeline 时间轴](./03-Timeline时间轴.md) — 时间轴管理、动画序列、控制方法
- [04-缓动函数 Easing](./04-缓动函数Easing.md) — 内置缓动、自定义缓动、缓动曲线

### 高级特性
- [05-ScrollTrigger 滚动触发](./05-ScrollTrigger滚动触发.md) — 滚动动画、视口检测、固定元素
- [06-Morphing 与路径动画](./06-Morphing与路径动画.md) — SVG 路径动画、形状变形
- [07-Text 文本动画](./07-Text文本动画.md) — 文字动画、打字机效果、文字拆分

### 实战应用
- [08-GSAP 实战案例](./08-GSAP实战案例.md) — 页面过渡、加载动画、交互效果
- [09-性能优化](./09-性能优化.md) — 60fps 优化、GPU 加速、性能监控（配合 [性能优化](../../../../04-质量保障/性能/!MOC-性能.md)）

### 框架集成
- [10-React 集成](./10-React集成.md) — GSAP 与 React 结合使用（需要了解 [React](../../../../02-框架进阶/React/!MOC-React.md)）
- [11-Vue 集成](./11-Vue集成.md) — GSAP 与 Vue 结合使用（需要了解 [Vue](../../../../02-框架进阶/Vue/!MOC-Vue.md)）

---

## 🎯 GSAP 核心能力

### 基础动画
- **Tween 动画**：单个元素的属性动画
- **Timeline 时间轴**：管理多个动画序列
- **控制方法**：play、pause、reverse、restart 等

### 高级功能
- **ScrollTrigger**：基于滚动的动画触发
- **Morphing**：SVG 形状变形
- **Text**：文字动画和拆分
- **MotionPath**：沿路径运动
- **SplitText**：文字拆分动画

### 性能特性
- **高性能**：60fps 流畅动画
- **GPU 加速**：自动硬件加速
- **兼容性好**：支持所有主流浏览器
- **体积小**：核心库仅 45KB（gzipped）

---

## 📝 学习建议

1. **前置知识**：
   - [JavaScript 基础](../../../../01-基础入门/JavaScript/!MOC-javascript.md)
   - [DOM 操作](../../../../01-基础入门/JavaScript/08-浏览器环境与DOM/DOM操作.md)
   - [CSS 基础](../../../../01-基础入门/CSS/!MOC-CSS.md)（了解 transform、opacity 等属性）

2. **学习顺序**：
   - 基础入门 → 核心 API → Timeline → 缓动函数
   - 高级特性（ScrollTrigger、Morphing、Text）
   - 实战案例 → 性能优化
   - 框架集成（如需要）

3. **实践建议**：
   - 从简单动画开始，逐步增加复杂度
   - 关注性能，使用浏览器 DevTools 监控
   - 参考官方示例和 CodePen 案例
   - 结合项目需求，选择合适的 GSAP 插件

4. **性能优化**：
   - 使用 transform 和 opacity（GPU 加速属性）
   - 避免动画 width、height、top、left 等触发重排的属性
   - 合理使用 will-change 属性
   - 监控动画性能（参考 [性能优化](../../../../04-质量保障/性能/!MOC-性能.md)）

---

## 📖 学习资源

### 官方资源
- [GSAP 官网](https://gsap.com/)
- [GSAP 文档](https://gsap.com/docs/)
- [GSAP 学习中心](https://greensock.com/learning/)
- [GSAP 论坛](https://greensock.com/forums/)

### 教程资源
- [GSAP 官方教程](https://greensock.com/get-started/)
- [CodePen GSAP 示例](https://codepen.io/collection/DYpWYq)
- [YouTube GSAP 教程](https://www.youtube.com/results?search_query=gsap+tutorial)

### 工具与插件
- [GSAP 插件列表](https://greensock.com/docs/v3/Plugins)
- [GSAP Ease Visualizer](https://greensock.com/docs/v3/Eases)
- [GSAP Playground](https://gsap.com/playground/)

---

## 🚀 快速开始

### 安装

```bash
# npm
npm install gsap

# yarn
yarn add gsap

# CDN
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
```

### 基础示例

```javascript
// 简单动画
gsap.to(".box", {
  x: 100,
  duration: 1,
  ease: "power2.out"
});

// 时间轴动画
const tl = gsap.timeline();
tl.to(".box1", { x: 100, duration: 1 })
  .to(".box2", { y: 100, duration: 1 }, "-=0.5") // 提前 0.5 秒开始
  .to(".box3", { rotation: 360, duration: 1 });
```

---

#GSAP #动画 #前端动画 #GreenSock #交互设计
