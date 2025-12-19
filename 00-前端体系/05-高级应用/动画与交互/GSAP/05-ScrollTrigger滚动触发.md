# ScrollTrigger 滚动触发

> ScrollTrigger 是 GSAP 最强大的插件之一，用于创建基于滚动的动画效果。

---

## 📚 ScrollTrigger 简介

### 什么是 ScrollTrigger？

ScrollTrigger 允许你根据滚动位置触发动画，创建丰富的滚动交互效果。

### 主要功能

- **滚动触发动画**：元素进入视口时触发动画
- **固定元素**：滚动时固定元素位置
- **滚动进度动画**：根据滚动进度控制动画
- **视口检测**：精确控制元素与视口的关系

---

## 🚀 安装与引入

### 安装

```bash
npm install gsap
```

### 引入并注册

```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
```

### CDN 引入

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script>
  gsap.registerPlugin(ScrollTrigger);
</script>
```

---

## 🎯 基础用法

### 滚动触发动画

```javascript
gsap.to(".box", {
  x: 100,
  scrollTrigger: {
    trigger: ".box",        // 触发元素
    start: "top center",    // 开始位置
    end: "bottom top",      // 结束位置
    toggleActions: "play none none none"  // 触发动作
  }
});
```

### 视口进入动画

```javascript
gsap.from(".box", {
  x: -100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: ".box",
    start: "top 80%",  // 当元素顶部距离视口顶部 80% 时触发
    toggleActions: "play none none reverse"  // 进入时播放，离开时反向
  }
});
```

---

## 🎨 ScrollTrigger 配置选项

### trigger（触发元素）

```javascript
scrollTrigger: {
  trigger: ".box",  // 可以是选择器、DOM 元素或数组
}
```

### start 和 end（开始和结束位置）

```javascript
scrollTrigger: {
  start: "top center",  // 格式：触发元素位置 视口位置
  end: "bottom top"     // 格式：触发元素位置 视口位置
}
```

**位置值**：
- `top`、`center`、`bottom`：元素位置
- `top`、`center`、`bottom`：视口位置
- 也可以使用像素值：`"top 100px"`

**常用组合**：
```javascript
start: "top bottom"    // 元素顶部进入视口底部
start: "top center"    // 元素顶部到达视口中心
start: "top top"       // 元素顶部到达视口顶部
start: "center center" // 元素中心到达视口中心
```

### toggleActions（触发动作）

```javascript
toggleActions: "play none none none"
// 格式：onEnter onLeave onEnterBack onLeaveBack
```

**动作值**：
- `play`：播放
- `pause`：暂停
- `resume`：恢复
- `reverse`：反向
- `restart`：重新开始
- `reset`：重置
- `complete`：完成
- `none`：无动作

**常用配置**：
```javascript
toggleActions: "play none none reverse"  // 进入时播放，返回时反向
toggleActions: "play pause resume pause" // 进入播放，离开暂停，返回恢复
```

---

## 🎬 高级用法

### 滚动进度动画

```javascript
gsap.to(".box", {
  x: 500,
  scrollTrigger: {
    trigger: ".container",
    start: "top top",
    end: "bottom bottom",
    scrub: true  // 动画跟随滚动（平滑）
  }
});
```

### scrub 选项

```javascript
scrub: true        // 平滑跟随（默认）
scrub: 1          // 延迟 1 秒跟随
scrub: false      // 不跟随（一次性触发）
```

### 固定元素（Pin）

```javascript
gsap.to(".box", {
  x: 100,
  scrollTrigger: {
    trigger: ".container",
    start: "top top",
    end: "+=1000",  // 固定 1000px 的滚动距离
    pin: true,      // 固定触发元素
    scrub: true
  }
});
```

### 固定多个元素

```javascript
ScrollTrigger.create({
  trigger: ".section1",
  start: "top top",
  end: "+=1000",
  pin: ".section1",
  pinSpacing: true  // 保持间距
});
```

---

## 🎯 实战案例

### 案例 1：视口进入动画

```javascript
// 多个元素依次出现
gsap.utils.toArray(".fade-in").forEach((element, index) => {
  gsap.from(element, {
    y: 50,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: element,
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    delay: index * 0.1
  });
});
```

### 案例 2：滚动进度条

```javascript
gsap.to(".progress-bar", {
  width: "100%",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});
```

### 案例 3：视差滚动

```javascript
gsap.to(".parallax-element", {
  y: -200,
  scrollTrigger: {
    trigger: ".container",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});
```

### 案例 4：固定导航栏

```javascript
ScrollTrigger.create({
  trigger: ".header",
  start: "top top",
  end: "bottom top",
  pin: true,
  pinSpacing: false
});
```

### 案例 5：滚动数字计数

```javascript
gsap.to(".counter", {
  textContent: 100,
  duration: 2,
  snap: { textContent: 1 },
  scrollTrigger: {
    trigger: ".counter",
    start: "top center",
    toggleActions: "play none none none"
  }
});
```

### 案例 6：水平滚动

```javascript
const horizontalSection = gsap.utils.toArray(".horizontal-item");
const horizontalWidth = horizontalSection[0].offsetWidth * horizontalSection.length;

gsap.to(".horizontal-container", {
  x: -horizontalWidth + window.innerWidth,
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-wrapper",
    start: "top top",
    end: () => `+=${horizontalWidth}`,
    pin: true,
    scrub: true
  }
});
```

### 案例 7：图片序列动画

```javascript
const images = gsap.utils.toArray(".sequence-image");

images.forEach((img, i) => {
  gsap.to(img, {
    opacity: 1,
    scrollTrigger: {
      trigger: img,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => {
        // 根据进度显示不同图片
        const progress = self.progress;
        const index = Math.floor(progress * (images.length - 1));
        images.forEach((img, idx) => {
          img.style.opacity = idx === index ? 1 : 0;
        });
      }
    }
  });
});
```

---

## 🛠️ ScrollTrigger 方法

### 创建独立的 ScrollTrigger

```javascript
const st = ScrollTrigger.create({
  trigger: ".box",
  start: "top center",
  onEnter: () => console.log("进入"),
  onLeave: () => console.log("离开"),
  onEnterBack: () => console.log("返回进入"),
  onLeaveBack: () => console.log("返回离开")
});
```

### 控制方法

```javascript
// 刷新（窗口大小改变时）
ScrollTrigger.refresh();

// 更新所有
ScrollTrigger.update();

// 销毁
st.kill();

// 销毁所有
ScrollTrigger.getAll().forEach(st => st.kill());
```

### 获取 ScrollTrigger 实例

```javascript
// 获取所有
const triggers = ScrollTrigger.getAll();

// 获取特定元素的
const st = ScrollTrigger.getById("myTrigger");
```

---

## 💡 最佳实践

### 1. 及时刷新

```javascript
// 窗口大小改变时刷新
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});
```

### 2. 使用 markers 调试

```javascript
scrollTrigger: {
  trigger: ".box",
  start: "top center",
  markers: true  // 显示标记（开发时使用）
}
```

### 3. 避免过度使用 pin

```javascript
// ❌ 不推荐：固定太多元素
gsap.to(".box1", { scrollTrigger: { pin: true } });
gsap.to(".box2", { scrollTrigger: { pin: true } });
gsap.to(".box3", { scrollTrigger: { pin: true } });

// ✅ 推荐：合理使用
gsap.to(".box", {
  scrollTrigger: {
    pin: true,
    pinSpacing: true  // 保持间距
  }
});
```

### 4. 性能优化

```javascript
// 使用 will-change
.element {
  will-change: transform;
}

// 批量处理
gsap.utils.toArray(".item").forEach(item => {
  gsap.from(item, {
    scrollTrigger: {
      trigger: item,
      start: "top 80%"
    }
  });
});
```

---

## 🔗 相关资源

- [GSAP ScrollTrigger 官方文档](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [ScrollTrigger 示例](https://greensock.com/st-demos/)
- [上一节：缓动函数 Easing](./04-缓动函数Easing.md)
- [下一节：Morphing 与路径动画](./06-Morphing与路径动画.md)

---

#GSAP #ScrollTrigger #滚动动画 #视口检测
