# 缓动函数 Easing

> 缓动函数控制动画的速度曲线，是创建自然、流畅动画的关键。

---

## 📚 什么是缓动函数？

缓动函数（Easing）定义了动画过程中速度的变化规律，决定了动画的"感觉"。

### 为什么需要缓动？

- **自然感**：模拟真实世界的物理运动
- **视觉舒适**：避免生硬的线性运动
- **突出重点**：通过速度变化引导注意力

---

## 🎯 GSAP 内置缓动

### 基础缓动类型

GSAP 提供了丰富的内置缓动函数：

#### Power 系列

```javascript
// power1（最弱）
gsap.to(".box", {
  x: 100,
  ease: "power1.out"  // 缓出
});

// power2（中等）
gsap.to(".box", {
  x: 100,
  ease: "power2.in"   // 缓入
});

// power3（较强）
gsap.to(".box", {
  x: 100,
  ease: "power3.inOut" // 缓入缓出
});

// power4（最强）
gsap.to(".box", {
  x: 100,
  ease: "power4.out"
});
```

#### 缓动方向

- **.in**：缓入（开始慢，结束快）
- **.out**：缓出（开始快，结束慢）
- **.inOut**：缓入缓出（开始和结束都慢）

```javascript
// 缓入：开始慢，结束快
gsap.to(".box", { x: 100, ease: "power2.in" });

// 缓出：开始快，结束慢（最常用）
gsap.to(".box", { x: 100, ease: "power2.out" });

// 缓入缓出：开始和结束都慢
gsap.to(".box", { x: 100, ease: "power2.inOut" });
```

---

### 特殊效果缓动

#### Back（回弹）

```javascript
// 基础回弹
gsap.to(".box", {
  x: 100,
  ease: "back.out"
});

// 自定义回弹强度（默认 1.7）
gsap.to(".box", {
  x: 100,
  ease: "back.out(2)"  // 更强的回弹
});
```

#### Elastic（弹性）

```javascript
// 基础弹性
gsap.to(".box", {
  x: 100,
  ease: "elastic.out"
});

// 自定义弹性参数
gsap.to(".box", {
  x: 100,
  ease: "elastic.out(1, 0.3)"  // amplitude, period
});
```

#### Bounce（弹跳）

```javascript
gsap.to(".box", {
  x: 100,
  ease: "bounce.out"  // 弹跳效果
});
```

#### Sine（正弦）

```javascript
gsap.to(".box", {
  x: 100,
  ease: "sine.inOut"  // 平滑的正弦曲线
});
```

#### Expo（指数）

```javascript
gsap.to(".box", {
  x: 100,
  ease: "expo.out"  // 指数曲线
});
```

#### Circ（圆形）

```javascript
gsap.to(".box", {
  x: 100,
  ease: "circ.inOut"  // 圆形曲线
});
```

---

## 🎨 缓动函数选择指南

### 根据场景选择

#### 入场动画（进入）

```javascript
// 推荐：back.out 或 power2.out
gsap.from(".box", {
  x: -100,
  opacity: 0,
  ease: "back.out(1.7)"  // 有回弹感
});
```

#### 退场动画（退出）

```javascript
// 推荐：power2.in 或 expo.in
gsap.to(".box", {
  x: 100,
  opacity: 0,
  ease: "power2.in"  // 快速消失
});
```

#### 悬停效果

```javascript
// 推荐：power2.out 和 power2.in
element.addEventListener("mouseenter", () => {
  gsap.to(element, {
    scale: 1.1,
    ease: "power2.out"  // 快速放大
  });
});

element.addEventListener("mouseleave", () => {
  gsap.to(element, {
    scale: 1,
    ease: "power2.in"  // 快速恢复
  });
});
```

#### 持续动画

```javascript
// 推荐：none（线性）或 sine.inOut
gsap.to(".box", {
  rotation: 360,
  duration: 2,
  repeat: -1,
  ease: "none"  // 匀速旋转
});
```

---

## 🛠️ 自定义缓动函数

### 使用 CustomEase 插件

```javascript
// 引入 CustomEase 插件
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);

// 创建自定义缓动
CustomEase.create("myEase", "M0,0 C0.5,0 0.5,1 1,1");

// 使用自定义缓动
gsap.to(".box", {
  x: 100,
  ease: "myEase"
});
```

### 使用缓动曲线编辑器

1. 访问 [GSAP Ease Visualizer](https://greensock.com/docs/v3/Eases)
2. 调整曲线
3. 复制生成的代码

### 函数形式

```javascript
// 使用函数定义缓动
gsap.to(".box", {
  x: 100,
  ease: function(t) {
    // t: 0-1 的进度值
    return t * t;  // 二次方曲线
  }
});
```

---

## 🎯 实战案例

### 案例 1：按钮点击反馈

```javascript
button.addEventListener("click", function() {
  gsap.to(button, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut"  // 快速响应
  });
});
```

### 案例 2：卡片翻转

```javascript
const tl = gsap.timeline();

tl.to(".card", {
  rotationY: 90,
  duration: 0.3,
  ease: "power2.in"  // 快速翻转
})
.to(".card", {
  rotationY: 0,
  duration: 0.3,
  ease: "power2.out"  // 缓慢恢复
});
```

### 案例 3：页面滚动指示器

```javascript
gsap.to(".progress-bar", {
  width: "100%",
  duration: 2,
  ease: "power1.out"  // 平滑增长
});
```

### 案例 4：加载动画

```javascript
// 弹性加载
gsap.from(".loader", {
  scale: 0,
  rotation: -180,
  duration: 0.6,
  ease: "elastic.out(1, 0.5)"  // 弹性效果
});
```

### 案例 5：模态框出现

```javascript
gsap.fromTo(".modal",
  {
    scale: 0.8,
    opacity: 0
  },
  {
    scale: 1,
    opacity: 1,
    duration: 0.4,
    ease: "back.out(1.7)"  // 回弹效果
  }
);
```

---

## 📊 缓动函数对比

### 速度曲线对比

```
Linear (none):     ████████████████████
Power2.out:        ████████████░░░░░░░░
Power2.in:         ░░░░░░░░████████████
Power2.inOut:      ░░░░████████████░░░░
Back.out:          ████████████░░░░░░░░ (有回弹)
Elastic.out:       ████████░░░░░░░░░░░░ (有弹性)
Bounce.out:        ████████░░░░░░░░░░░░ (有弹跳)
```

### 使用场景建议

| 缓动函数 | 适用场景 | 感觉 |
|---------|---------|------|
| `power2.out` | 通用入场动画 | 自然、流畅 |
| `power2.in` | 退场动画 | 快速消失 |
| `back.out` | 强调元素 | 有回弹感 |
| `elastic.out` | 加载动画 | 有弹性 |
| `bounce.out` | 趣味动画 | 有弹跳 |
| `none` | 持续动画 | 匀速 |

---

## 💡 最佳实践

### 1. 默认使用 power2.out

```javascript
// ✅ 推荐：power2.out 适合大多数场景
gsap.to(".box", {
  x: 100,
  ease: "power2.out"
});
```

### 2. 入场用 out，退场用 in

```javascript
// 入场：缓出（开始快，结束慢）
gsap.from(".box", {
  x: -100,
  ease: "power2.out"
});

// 退场：缓入（开始慢，结束快）
gsap.to(".box", {
  x: 100,
  ease: "power2.in"
});
```

### 3. 避免过度使用特殊效果

```javascript
// ❌ 不推荐：过度使用弹性效果
gsap.to(".box", {
  x: 100,
  ease: "elastic.out(2, 0.1)"  // 太夸张
});

// ✅ 推荐：适度使用
gsap.to(".box", {
  x: 100,
  ease: "back.out(1.2)"  // 轻微回弹
});
```

### 4. 使用 Ease Visualizer 工具

访问 [GSAP Ease Visualizer](https://greensock.com/docs/v3/Eases) 可视化查看和选择缓动函数。

---

## 🔗 相关资源

- [GSAP Ease Visualizer](https://greensock.com/docs/v3/Eases) - 可视化缓动函数
- [GSAP 官方文档 - Easing](https://gsap.com/docs/v3/Eases/)
- [上一节：Timeline 时间轴](./03-Timeline时间轴.md)
- [下一节：ScrollTrigger 滚动触发](./05-ScrollTrigger滚动触发.md)

---

#GSAP #缓动函数 #Easing #动画曲线
