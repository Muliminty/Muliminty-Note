# Morphing 与路径动画

> GSAP 的 Morphing 和路径动画功能，用于创建 SVG 形状变形和沿路径运动的动画效果。

---

## 📚 Morphing 简介

### 什么是 Morphing？

Morphing（变形）是指将一个形状平滑地转换为另一个形状，常用于 SVG 动画。

### 应用场景

- Logo 动画
- 图标转换
- 形状过渡
- 数据可视化

---

## 🚀 SVG Morphing

### 基础 Morphing

```javascript
// 需要 MorphSVGPlugin（付费插件）
gsap.to("#path1", {
  morphSVG: "#path2",
  duration: 1
});
```

### 使用路径字符串

```javascript
gsap.to("#path", {
  morphSVG: "M0,0 L100,0 L100,100 L0,100 Z",
  duration: 1
});
```

---

## 🎯 MotionPathPlugin（路径动画）

MotionPathPlugin 是 GSAP 的免费插件，用于创建沿路径运动的动画。

### 安装与引入

```javascript
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);
```

### 基础用法

```javascript
// 沿 SVG 路径运动
gsap.to(".box", {
  motionPath: {
    path: "#path",  // SVG 路径 ID
    alignOrigin: [0.5, 0.5]  // 对齐原点
  },
  duration: 2
});
```

### 使用路径字符串

```javascript
gsap.to(".box", {
  motionPath: {
    path: "M0,0 Q50,50 100,0 T200,0",  // SVG 路径字符串
    autoRotate: true  // 自动旋转
  },
  duration: 2
});
```

---

## 🎨 MotionPathPlugin 配置

### path（路径）

```javascript
motionPath: {
  path: "#svg-path",  // SVG 路径元素
  // 或
  path: "M0,0 L100,100",  // 路径字符串
  // 或
  path: [{x: 0, y: 0}, {x: 100, y: 100}]  // 点数组
}
```

### autoRotate（自动旋转）

```javascript
motionPath: {
  path: "#path",
  autoRotate: true,  // 沿路径方向旋转
  autoRotate: 90    // 旋转偏移角度
}
```

### alignOrigin（对齐原点）

```javascript
motionPath: {
  path: "#path",
  alignOrigin: [0.5, 0.5]  // [x, y] 对齐点（0-1）
}
```

### start/end（起始和结束位置）

```javascript
motionPath: {
  path: "#path",
  start: 0,    // 起始位置（0-1）
  end: 1       // 结束位置（0-1）
}
```

---

## 🎬 实战案例

### 案例 1：沿曲线运动

```javascript
gsap.to(".ball", {
  motionPath: {
    path: "M0,0 Q50,-50 100,0 T200,0",
    autoRotate: true
  },
  duration: 2,
  repeat: -1,
  ease: "none"
});
```

### 案例 2：圆形轨道

```html
<svg>
  <circle id="orbit" cx="100" cy="100" r="50" fill="none" stroke="#ccc"/>
</svg>
```

```javascript
gsap.to(".planet", {
  motionPath: {
    path: "#orbit",
    autoRotate: true
  },
  duration: 3,
  repeat: -1,
  ease: "none"
});
```

### 案例 3：复杂路径动画

```javascript
const complexPath = "M0,0 C50,50 150,50 200,0 S350,-50 400,0";

gsap.to(".element", {
  motionPath: {
    path: complexPath,
    autoRotate: true,
    alignOrigin: [0.5, 0.5]
  },
  duration: 4,
  ease: "power2.inOut"
});
```

### 案例 4：往返路径动画

```javascript
const tl = gsap.timeline({ repeat: -1, yoyo: true });

tl.to(".box", {
  motionPath: {
    path: "#path",
    autoRotate: true
  },
  duration: 2,
  ease: "power2.inOut"
});
```

### 案例 5：多个元素沿同一路径

```javascript
const path = "M0,0 Q50,50 100,0";

gsap.utils.toArray(".item").forEach((item, i) => {
  gsap.to(item, {
    motionPath: {
      path: path,
      start: i * 0.2,  // 错开起始位置
      end: (i * 0.2) + 0.8
    },
    duration: 2,
    repeat: -1,
    ease: "none"
  });
});
```

---

## 🎨 SVG 路径动画技巧

### 路径字符串格式

```javascript
// M = Move to（移动到）
// L = Line to（直线到）
// C = Curve to（三次贝塞尔曲线）
// Q = Quadratic curve to（二次贝塞尔曲线）
// Z = Close path（闭合路径）

const path = "M0,0 L100,0 L100,100 L0,100 Z";  // 矩形
const path = "M50,0 A50,50 0 1,1 50,100 A50,50 0 1,1 50,0 Z";  // 圆形
```

### 动态生成路径

```javascript
function createCirclePath(centerX, centerY, radius) {
  return `M${centerX},${centerY - radius} A${radius},${radius} 0 1,1 ${centerX},${centerY + radius} A${radius},${radius} 0 1,1 ${centerX},${centerY - radius} Z`;
}

gsap.to(".box", {
  motionPath: {
    path: createCirclePath(100, 100, 50)
  },
  duration: 2
});
```

---

## 🛠️ 高级技巧

### 结合 ScrollTrigger

```javascript
gsap.to(".box", {
  motionPath: {
    path: "#path",
    autoRotate: true
  },
  scrollTrigger: {
    trigger: ".container",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});
```

### 路径进度控制

```javascript
const tl = gsap.timeline();

tl.to(".box", {
  motionPath: {
    path: "#path",
    end: 0.5  // 只移动到路径的一半
  },
  duration: 1
})
.to(".box", {
  motionPath: {
    path: "#path",
    start: 0.5,
    end: 1  // 从一半到结束
  },
  duration: 1
});
```

### 自定义路径函数

```javascript
function createWavePath(amplitude, frequency, length) {
  let path = "M0,0";
  for (let i = 0; i <= length; i++) {
    const x = i;
    const y = Math.sin(i / frequency) * amplitude;
    path += ` L${x},${y}`;
  }
  return path;
}

gsap.to(".wave", {
  motionPath: {
    path: createWavePath(50, 10, 200)
  },
  duration: 2,
  repeat: -1,
  ease: "none"
});
```

---

## 💡 最佳实践

### 1. 优化路径复杂度

```javascript
// ❌ 不推荐：过于复杂的路径
const complexPath = "M0,0 C10,10 20,20 30,30 C40,40 50,50 60,60..."; // 太多点

// ✅ 推荐：简化路径
const simplePath = "M0,0 Q50,50 100,0";  // 使用二次曲线
```

### 2. 使用 autoRotate 增强真实感

```javascript
// ✅ 推荐：自动旋转
motionPath: {
  path: "#path",
  autoRotate: true  // 元素沿路径方向旋转
}
```

### 3. 合理使用 ease

```javascript
// 持续运动：使用 none
gsap.to(".box", {
  motionPath: { path: "#path" },
  ease: "none"  // 匀速
});

// 加速/减速：使用缓动
gsap.to(".box", {
  motionPath: { path: "#path" },
  ease: "power2.inOut"  // 缓入缓出
});
```

---

## 🔗 相关资源

- [GSAP MotionPathPlugin 文档](https://gsap.com/docs/v3/Plugins/MotionPathPlugin/)
- [SVG 路径教程 - MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)
- [上一节：ScrollTrigger 滚动触发](./05-ScrollTrigger滚动触发.md)
- [下一节：Text 文本动画](./07-Text文本动画.md)

---

#GSAP #MotionPath #路径动画 #SVG动画 #Morphing
