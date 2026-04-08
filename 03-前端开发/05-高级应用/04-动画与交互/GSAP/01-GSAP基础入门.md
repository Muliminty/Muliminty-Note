# GSAP 基础入门

> GSAP（GreenSock Animation Platform）是业界最强大的 JavaScript 动画库，用于创建高性能、专业级的动画效果。

---

## 📖 什么是 GSAP？

GSAP 是一个功能强大的 JavaScript 动画库，具有以下特点：

- **高性能**：60fps 流畅动画，自动 GPU 加速
- **功能强大**：支持几乎所有可动画的属性
- **兼容性好**：支持所有主流浏览器（包括 IE9+）
- **体积小**：核心库仅 45KB（gzipped）
- **易于使用**：简洁的 API，丰富的文档

---

## 🚀 安装与引入

### 方式一：npm/yarn 安装

```bash
# npm
npm install gsap

# yarn
yarn add gsap
```

```javascript
// ES6 模块
import { gsap } from "gsap";

// CommonJS
const { gsap } = require("gsap");
```

### 方式二：CDN 引入

```html
<!-- 完整版（包含所有插件） -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>

<!-- 仅核心库 -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js"></script>
```

### 方式三：使用插件

```javascript
// 引入插件（如 ScrollTrigger）
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
```

---

## 🎯 第一个动画

### 最简单的动画

```javascript
// 将元素移动到 x: 100 的位置，持续 1 秒
gsap.to(".box", {
  x: 100,
  duration: 1
});
```

### HTML 示例

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .box {
      width: 100px;
      height: 100px;
      background: #3498db;
    }
  </style>
</head>
<body>
  <div class="box"></div>
  
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script>
    gsap.to(".box", {
      x: 100,
      duration: 1,
      ease: "power2.out"
    });
  </script>
</body>
</html>
```

---

## 📚 核心方法

### 1. gsap.to()

从当前状态动画到目标状态。

```javascript
gsap.to(".box", {
  x: 100,        // 移动到 x: 100
  y: 50,         // 移动到 y: 50
  rotation: 360, // 旋转 360 度
  opacity: 0.5,  // 透明度变为 0.5
  duration: 1,   // 持续 1 秒
  delay: 0.5     // 延迟 0.5 秒
});
```

### 2. gsap.from()

从指定状态动画到当前状态。

```javascript
gsap.from(".box", {
  x: -100,       // 从 x: -100 开始
  opacity: 0,    // 从透明开始
  duration: 1
});
```

### 3. gsap.fromTo()

从指定状态动画到目标状态。

```javascript
gsap.fromTo(".box", 
  {
    // 起始状态
    x: -100,
    opacity: 0
  },
  {
    // 目标状态
    x: 100,
    opacity: 1,
    duration: 1
  }
);
```

### 4. gsap.set()

立即设置属性值（无动画）。

```javascript
gsap.set(".box", {
  x: 100,
  opacity: 0.5
});
```

---

## 🎨 常用属性

### Transform 属性

```javascript
gsap.to(".box", {
  // 位移
  x: 100,              // translateX
  y: 50,               // translateY
  z: 0,                // translateZ
  
  // 旋转
  rotation: 360,       // rotateZ
  rotationX: 180,     // rotateX
  rotationY: 90,      // rotateY
  
  // 缩放
  scale: 1.5,          // scaleX 和 scaleY
  scaleX: 2,           // scaleX
  scaleY: 0.5,         // scaleY
  
  // 倾斜
  skewX: 45,          // skewX
  skewY: 30           // skewY
});
```

### 其他常用属性

```javascript
gsap.to(".box", {
  // 透明度
  opacity: 0.5,
  
  // 颜色（需要 ColorPropsPlugin）
  backgroundColor: "#ff0000",
  color: "#ffffff",
  
  // 尺寸
  width: "200px",
  height: "100px",
  
  // 边框
  borderWidth: "5px",
  borderRadius: "50%"
});
```

---

## ⏱️ 时间控制

### duration（持续时间）

```javascript
gsap.to(".box", {
  x: 100,
  duration: 2  // 持续 2 秒
});
```

### delay（延迟）

```javascript
gsap.to(".box", {
  x: 100,
  delay: 1  // 延迟 1 秒后开始
});
```

### repeat（重复次数）

```javascript
gsap.to(".box", {
  x: 100,
  repeat: 2  // 重复 2 次（总共执行 3 次）
});

// 无限重复
gsap.to(".box", {
  x: 100,
  repeat: -1  // 无限重复
});
```

### yoyo（往返动画）

```javascript
gsap.to(".box", {
  x: 100,
  repeat: -1,
  yoyo: true  // 往返动画（去和回）
});
```

---

## 🎭 缓动函数（Easing）

### 内置缓动

```javascript
gsap.to(".box", {
  x: 100,
  ease: "power1.out"    // 缓出
});

gsap.to(".box", {
  x: 100,
  ease: "power2.in"    // 缓入
});

gsap.to(".box", {
  x: 100,
  ease: "power3.inOut" // 缓入缓出
});
```

### 常用缓动类型

- **power1/2/3/4**：幂函数缓动（1 最弱，4 最强）
- **back**：回弹效果
- **elastic**：弹性效果
- **bounce**：弹跳效果
- **sine**：正弦曲线
- **expo**：指数曲线
- **circ**：圆形曲线

```javascript
// 回弹效果
gsap.to(".box", {
  x: 100,
  ease: "back.out(1.7)"
});

// 弹性效果
gsap.to(".box", {
  x: 100,
  ease: "elastic.out(1, 0.3)"
});
```

---

## 🎯 选择器

### CSS 选择器

```javascript
// 类选择器
gsap.to(".box", { x: 100 });

// ID 选择器
gsap.to("#myBox", { x: 100 });

// 标签选择器
gsap.to("div", { x: 100 });

// 组合选择器
gsap.to(".container .box", { x: 100 });
```

### DOM 元素

```javascript
const element = document.querySelector(".box");
gsap.to(element, { x: 100 });

// 多个元素
const elements = document.querySelectorAll(".box");
gsap.to(elements, { x: 100 });
```

### 数组

```javascript
gsap.to([element1, element2, element3], { x: 100 });
```

---

## 🎬 动画控制

### 保存动画引用

```javascript
const animation = gsap.to(".box", {
  x: 100,
  duration: 1
});

// 控制动画
animation.play();    // 播放
animation.pause();   // 暂停
animation.reverse(); // 反向播放
animation.restart(); // 重新开始
animation.kill();    // 销毁动画
```

### 全局控制

```javascript
// 暂停所有 GSAP 动画
gsap.globalTimeline.pause();

// 恢复所有 GSAP 动画
gsap.globalTimeline.resume();

// 设置全局时间缩放
gsap.globalTimeline.timeScale(0.5); // 慢速播放（0.5 倍速）
```

---

## 📝 回调函数

### onComplete（完成回调）

```javascript
gsap.to(".box", {
  x: 100,
  duration: 1,
  onComplete: function() {
    console.log("动画完成！");
  }
});
```

### onStart（开始回调）

```javascript
gsap.to(".box", {
  x: 100,
  duration: 1,
  onStart: function() {
    console.log("动画开始！");
  }
});
```

### onUpdate（更新回调）

```javascript
gsap.to(".box", {
  x: 100,
  duration: 1,
  onUpdate: function() {
    console.log("进度:", this.progress()); // 0 到 1
  }
});
```

---

## 🎨 实战示例

### 淡入淡出

```javascript
// 淡入
gsap.to(".box", {
  opacity: 1,
  duration: 1
});

// 淡出
gsap.to(".box", {
  opacity: 0,
  duration: 1
});
```

### 滑入滑出

```javascript
// 从左侧滑入
gsap.from(".box", {
  x: -100,
  opacity: 0,
  duration: 1,
  ease: "power2.out"
});

// 滑出到右侧
gsap.to(".box", {
  x: 100,
  opacity: 0,
  duration: 1,
  ease: "power2.in"
});
```

### 缩放动画

```javascript
// 放大出现
gsap.from(".box", {
  scale: 0,
  opacity: 0,
  duration: 0.5,
  ease: "back.out(1.7)"
});

// 缩小消失
gsap.to(".box", {
  scale: 0,
  opacity: 0,
  duration: 0.5,
  ease: "back.in(1.7)"
});
```

### 旋转动画

```javascript
// 旋转出现
gsap.from(".box", {
  rotation: -180,
  opacity: 0,
  duration: 1,
  ease: "power2.out"
});

// 持续旋转
gsap.to(".box", {
  rotation: 360,
  duration: 2,
  repeat: -1,
  ease: "none"
});
```

---

## 💡 最佳实践

### 1. 使用 transform 属性

✅ **推荐**：使用 `x`、`y`、`scale`、`rotation` 等 transform 属性（GPU 加速）

```javascript
gsap.to(".box", {
  x: 100,      // ✅ GPU 加速
  scale: 1.5   // ✅ GPU 加速
});
```

❌ **不推荐**：使用 `left`、`top`、`width`、`height` 等属性（触发重排）

```javascript
gsap.to(".box", {
  left: "100px",  // ❌ 触发重排
  width: "200px"  // ❌ 触发重排
});
```

### 2. 合理使用 will-change

```css
.box {
  will-change: transform, opacity;
}
```

### 3. 批量动画使用 Timeline

对于多个动画，使用 Timeline 而不是多个独立的 to() 调用。

```javascript
// ❌ 不推荐
gsap.to(".box1", { x: 100, duration: 1 });
gsap.to(".box2", { y: 100, duration: 1 });
gsap.to(".box3", { rotation: 360, duration: 1 });

// ✅ 推荐
const tl = gsap.timeline();
tl.to(".box1", { x: 100, duration: 1 })
  .to(".box2", { y: 100, duration: 1 })
  .to(".box3", { rotation: 360, duration: 1 });
```

---

## 🔗 相关资源

- [GSAP 官方文档](https://gsap.com/docs/)
- [GSAP 学习中心](https://greensock.com/learning/)
- [下一节：GSAP 核心 API](./02-GSAP核心API.md)

---

#GSAP #动画 #基础入门 #前端动画
