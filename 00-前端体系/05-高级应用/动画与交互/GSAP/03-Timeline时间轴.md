# Timeline 时间轴

> Timeline 是 GSAP 的核心功能之一，用于管理多个动画序列，创建复杂的动画时间线。

---

## 📚 Timeline 基础

### 为什么需要 Timeline？

当需要创建多个动画序列时，使用 Timeline 可以：

- **精确控制时间**：控制动画的执行顺序和时机
- **统一管理**：所有动画在一个时间轴上管理
- **易于控制**：可以统一暂停、播放、反向等操作
- **灵活编排**：支持复杂的动画序列

### 创建 Timeline

```javascript
// 创建时间轴
const tl = gsap.timeline();

// 添加动画
tl.to(".box1", { x: 100, duration: 1 })
  .to(".box2", { y: 100, duration: 1 })
  .to(".box3", { rotation: 360, duration: 1 });
```

---

## 🎯 Timeline 基本用法

### 顺序执行（默认）

```javascript
const tl = gsap.timeline();

// 动画按顺序执行
tl.to(".box1", { x: 100, duration: 1 })    // 0-1 秒
  .to(".box2", { y: 100, duration: 1 })    // 1-2 秒
  .to(".box3", { rotation: 360, duration: 1 }); // 2-3 秒
```

### 同时执行（使用位置参数）

```javascript
const tl = gsap.timeline();

// 所有动画同时开始
tl.to(".box1", { x: 100, duration: 1 }, 0)    // 从 0 秒开始
  .to(".box2", { y: 100, duration: 1 }, 0)    // 从 0 秒开始
  .to(".box3", { rotation: 360, duration: 1 }, 0); // 从 0 秒开始
```

### 相对位置

```javascript
const tl = gsap.timeline();

// 使用相对位置
tl.to(".box1", { x: 100, duration: 1 })
  .to(".box2", { y: 100, duration: 1 }, "-=0.5")  // 提前 0.5 秒开始
  .to(".box3", { rotation: 360, duration: 1 }, "+=0.5"); // 延迟 0.5 秒开始
```

### 位置标签（Labels）

```javascript
const tl = gsap.timeline();

// 添加标签
tl.to(".box1", { x: 100, duration: 1 })
  .addLabel("middle")  // 添加标签
  .to(".box2", { y: 100, duration: 1 })
  .to(".box3", { rotation: 360, duration: 1 }, "middle"); // 从 middle 标签位置开始
```

---

## 🎨 Timeline 配置选项

### 默认配置

```javascript
const tl = gsap.timeline({
  paused: true,        // 创建时暂停
  repeat: 2,           // 重复 2 次
  yoyo: true,          // 往返动画
  delay: 1,            // 延迟 1 秒
  defaults: {          // 默认值
    duration: 1,
    ease: "power2.out"
  }
});
```

### 常用配置

```javascript
const tl = gsap.timeline({
  // 时间控制
  paused: false,       // 是否暂停
  delay: 0,            // 延迟时间
  repeat: 0,           // 重复次数（-1 为无限）
  yoyo: false,         // 是否往返
  repeatDelay: 0,     // 重复之间的延迟
  
  // 默认值
  defaults: {
    duration: 1,
    ease: "power2.out"
  },
  
  // 回调
  onComplete: function() {
    console.log("完成");
  },
  onStart: function() {
    console.log("开始");
  }
});
```

---

## 🎬 Timeline 控制方法

### 基本控制

```javascript
const tl = gsap.timeline();

// 播放
tl.play();

// 暂停
tl.pause();

// 恢复
tl.resume();

// 反向播放
tl.reverse();

// 重新开始
tl.restart();

// 跳转到指定时间
tl.seek(1.5);  // 跳转到 1.5 秒

// 跳转到指定进度
tl.progress(0.5);  // 跳转到 50% 进度

// 跳转到标签
tl.seek("middle");  // 跳转到 middle 标签位置
```

### 时间缩放

```javascript
// 设置播放速度
tl.timeScale(0.5);  // 慢速播放（0.5 倍速）
tl.timeScale(2);    // 快速播放（2 倍速）
tl.timeScale(1);    // 正常速度
```

### 获取状态

```javascript
// 是否正在播放
tl.isActive();

// 当前进度（0-1）
tl.progress();

// 当前时间
tl.time();

// 总时长
tl.duration();

// 是否已反转
tl.reversed();
```

---

## 🎯 位置参数详解

### 绝对位置

```javascript
const tl = gsap.timeline();

tl.to(".box1", { x: 100, duration: 1 }, 0)      // 从 0 秒开始
  .to(".box2", { y: 100, duration: 1 }, 1)      // 从 1 秒开始
  .to(".box3", { rotation: 360, duration: 1 }, 2); // 从 2 秒开始
```

### 相对位置

```javascript
const tl = gsap.timeline();

tl.to(".box1", { x: 100, duration: 1 })
  .to(".box2", { y: 100, duration: 1 }, "-=0.5")  // 提前 0.5 秒
  .to(".box3", { rotation: 360, duration: 1 }, "+=0.5"); // 延迟 0.5 秒
```

### 位置标签

```javascript
const tl = gsap.timeline();

tl.to(".box1", { x: 100, duration: 1 })
  .addLabel("start")
  .to(".box2", { y: 100, duration: 1 })
  .addLabel("middle")
  .to(".box3", { rotation: 360, duration: 1 }, "middle"); // 从 middle 开始
```

### 相对标签位置

```javascript
const tl = gsap.timeline();

tl.to(".box1", { x: 100, duration: 1 })
  .addLabel("middle")
  .to(".box2", { y: 100, duration: 1 }, "middle+=0.5")  // middle 标签后 0.5 秒
  .to(".box3", { rotation: 360, duration: 1 }, "middle-=0.2"); // middle 标签前 0.2 秒
```

---

## 🎨 实战案例

### 案例 1：页面加载动画

```javascript
const tl = gsap.timeline();

// 依次显示元素
tl.from(".header", { y: -50, opacity: 0, duration: 0.5 })
  .from(".nav-item", { x: -20, opacity: 0, duration: 0.3, stagger: 0.1 }, "-=0.3")
  .from(".hero-title", { y: 50, opacity: 0, duration: 0.6 }, "-=0.2")
  .from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.5 }, "-=0.4")
  .from(".cta-button", { scale: 0, opacity: 0, duration: 0.4, ease: "back.out(1.7)" }, "-=0.2");
```

### 案例 2：卡片翻转效果

```javascript
const cards = document.querySelectorAll(".card");

cards.forEach(card => {
  const tl = gsap.timeline({ paused: true });
  
  tl.to(card, { rotationY: 90, duration: 0.3 })
    .set(card, { z: -100 })  // 切换内容
    .to(card, { rotationY: 0, duration: 0.3 });
  
  card.addEventListener("click", () => {
    tl.play();
  });
});
```

### 案例 3：进度条动画

```javascript
function animateProgress(percent) {
  const tl = gsap.timeline();
  
  tl.to(".progress-bar", {
    width: `${percent}%`,
    duration: 1,
    ease: "power2.out"
  })
  .to(".progress-text", {
    textContent: `${percent}%`,
    duration: 0.5,
    snap: { textContent: 1 }  // 整数显示
  }, "-=0.5");
}
```

### 案例 4：模态框动画序列

```javascript
function showModal() {
  const tl = gsap.timeline();
  
  // 背景遮罩
  tl.fromTo(".modal-backdrop",
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  )
  // 模态框内容
  .fromTo(".modal",
    {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: "back.out(1.7)"
    },
    "-=0.2"  // 提前 0.2 秒开始
  )
  // 内容元素依次出现
  .from(".modal-header", { y: -20, opacity: 0, duration: 0.3 }, "-=0.2")
  .from(".modal-body", { y: 20, opacity: 0, duration: 0.3 }, "-=0.1")
  .from(".modal-footer", { y: 20, opacity: 0, duration: 0.3 }, "-=0.1");
}
```

### 案例 5：时间轴嵌套

```javascript
// 主时间轴
const mainTl = gsap.timeline();

// 创建子时间轴
const headerTl = gsap.timeline();
headerTl.from(".logo", { scale: 0, duration: 0.5 })
         .from(".nav", { x: -100, duration: 0.5 }, "-=0.3");

const contentTl = gsap.timeline();
contentTl.from(".title", { y: 50, opacity: 0, duration: 0.6 })
          .from(".content", { y: 30, opacity: 0, duration: 0.5 }, "-=0.3");

// 将子时间轴添加到主时间轴
mainTl.add(headerTl)
      .add(contentTl, "-=0.2");  // 提前 0.2 秒开始
```

---

## 💡 最佳实践

### 1. 使用 defaults 减少重复代码

```javascript
const tl = gsap.timeline({
  defaults: {
    duration: 0.5,
    ease: "power2.out"
  }
});

// 不需要重复指定 duration 和 ease
tl.to(".box1", { x: 100 })
  .to(".box2", { y: 100 })
  .to(".box3", { rotation: 360 });
```

### 2. 使用标签提高可读性

```javascript
const tl = gsap.timeline();

tl.addLabel("start")
  .to(".box1", { x: 100, duration: 1 })
  .addLabel("middle")
  .to(".box2", { y: 100, duration: 1 })
  .addLabel("end")
  .to(".box3", { rotation: 360, duration: 1 });

// 可以轻松跳转到特定位置
tl.seek("middle");
```

### 3. 合理使用相对位置

```javascript
// ✅ 推荐：使用相对位置，易于调整
tl.to(".box1", { x: 100, duration: 1 })
  .to(".box2", { y: 100, duration: 1 }, "-=0.5");

// ❌ 不推荐：使用绝对位置，难以维护
tl.to(".box1", { x: 100, duration: 1 }, 0)
  .to(".box2", { y: 100, duration: 1 }, 0.5);
```

### 4. 及时清理时间轴

```javascript
// 保存时间轴引用
const tl = gsap.timeline();

// 组件卸载时清理
function cleanup() {
  tl.kill();
}
```

---

## 🔗 相关资源

- [GSAP 官方文档 - Timeline](https://gsap.com/docs/v3/GSAP/Timeline/)
- [上一节：GSAP 核心 API](./02-GSAP核心API.md)
- [下一节：缓动函数 Easing](./04-缓动函数Easing.md)

---

#GSAP #Timeline #时间轴 #动画序列
