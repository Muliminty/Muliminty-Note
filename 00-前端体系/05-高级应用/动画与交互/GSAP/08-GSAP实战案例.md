# GSAP 实战案例

> 综合运用 GSAP 的各种功能，创建完整的动画交互效果。

---

## 🎯 案例 1：页面加载动画

### 完整页面加载序列

```javascript
// 创建加载时间轴
const loadTl = gsap.timeline();

// 1. Logo 出现
loadTl.from(".logo", {
  scale: 0,
  rotation: -180,
  duration: 0.8,
  ease: "back.out(1.7)"
})
// 2. 导航栏出现
.from(".nav-item", {
  x: -30,
  opacity: 0,
  duration: 0.5,
  stagger: 0.1
}, "-=0.4")
// 3. 主标题出现
.from(".hero-title", {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
}, "-=0.3")
// 4. 副标题出现
.from(".hero-subtitle", {
  y: 30,
  opacity: 0,
  duration: 0.8
}, "-=0.5")
// 5. 按钮出现
.from(".cta-button", {
  scale: 0,
  opacity: 0,
  duration: 0.5,
  ease: "back.out(1.7)"
}, "-=0.3")
// 6. 背景元素
.from(".bg-element", {
  scale: 1.2,
  opacity: 0,
  duration: 1.5,
  ease: "power2.out"
}, 0);
```

---

## 🎯 案例 2：卡片悬停效果

### 3D 卡片翻转

```javascript
const cards = document.querySelectorAll(".card");

cards.forEach(card => {
  const cardInner = card.querySelector(".card-inner");
  
  // 鼠标进入
  card.addEventListener("mouseenter", () => {
    gsap.to(card, {
      y: -10,
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
    
    gsap.to(cardInner, {
      rotationY: 5,
      rotationX: 5,
      duration: 0.3
    });
  });
  
  // 鼠标移动
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    gsap.to(cardInner, {
      rotationX: rotateX,
      rotationY: rotateY,
      duration: 0.3
    });
  });
  
  // 鼠标离开
  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.in"
    });
    
    gsap.to(cardInner, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.3
    });
  });
});
```

---

## 🎯 案例 3：滚动视差效果

### 多层视差滚动

```javascript
// 背景层（慢速）
gsap.to(".parallax-bg", {
  y: -300,
  scrollTrigger: {
    trigger: ".parallax-container",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

// 中间层（中速）
gsap.to(".parallax-mid", {
  y: -150,
  scrollTrigger: {
    trigger: ".parallax-container",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

// 前景层（正常速度）
gsap.to(".parallax-front", {
  y: -50,
  scrollTrigger: {
    trigger: ".parallax-container",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});
```

---

## 🎯 案例 4：滚动进度指示器

### 页面滚动进度条

```javascript
// 进度条
gsap.to(".progress-bar", {
  width: "100%",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});

// 百分比显示
gsap.to(".progress-text", {
  textContent: 100,
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      document.querySelector(".progress-text").textContent = 
        Math.round(self.progress * 100) + "%";
    }
  }
});
```

---

## 🎯 案例 5：固定导航栏

### 滚动时固定导航

```javascript
ScrollTrigger.create({
  trigger: ".header",
  start: "top top",
  end: "bottom top",
  pin: true,
  pinSpacing: true
});

// 滚动时改变样式
gsap.to(".header", {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  scrollTrigger: {
    trigger: "body",
    start: "top -100",
    end: "bottom top",
    scrub: true
  }
});
```

---

## 🎯 案例 6：数字计数动画

### 滚动触发数字计数

```javascript
const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {
  const target = parseInt(counter.dataset.target);
  
  gsap.to(counter, {
    textContent: target,
    duration: 2,
    snap: { textContent: 1 },
    ease: "power2.out",
    scrollTrigger: {
      trigger: counter,
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
});
```

---

## 🎯 案例 7：模态框动画

### 完整的模态框动画序列

```javascript
function showModal() {
  const modal = document.querySelector(".modal");
  const backdrop = document.querySelector(".modal-backdrop");
  
  // 显示遮罩
  gsap.set(backdrop, { display: "block" });
  gsap.fromTo(backdrop,
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  );
  
  // 显示模态框
  gsap.set(modal, { display: "block" });
  gsap.fromTo(modal,
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
    }
  );
  
  // 内容依次出现
  const tl = gsap.timeline({ delay: 0.2 });
  tl.from(".modal-header", { y: -20, opacity: 0, duration: 0.3 })
    .from(".modal-body", { y: 20, opacity: 0, duration: 0.3 }, "-=0.2")
    .from(".modal-footer", { y: 20, opacity: 0, duration: 0.3 }, "-=0.2");
}

function hideModal() {
  const modal = document.querySelector(".modal");
  const backdrop = document.querySelector(".modal-backdrop");
  
  const tl = gsap.timeline({
    onComplete: () => {
      gsap.set([modal, backdrop], { display: "none" });
    }
  });
  
  tl.to(modal, {
    opacity: 0,
    scale: 0.8,
    y: 50,
    duration: 0.3,
    ease: "back.in(1.7)"
  })
  .to(backdrop, {
    opacity: 0,
    duration: 0.3
  }, 0);
}
```

---

## 🎯 案例 8：文字拆分动画

### 标题文字依次出现

```javascript
function splitTextToChars(element) {
  const text = element.textContent;
  const chars = text.split("").map(char => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    return span;
  });
  
  element.textContent = "";
  chars.forEach(char => element.appendChild(char));
  
  return Array.from(element.children);
}

// 使用
const title = document.querySelector(".title");
const chars = splitTextToChars(title);

gsap.from(chars, {
  opacity: 0,
  y: 50,
  rotationX: -90,
  duration: 0.5,
  stagger: 0.03,
  ease: "back.out(1.7)",
  scrollTrigger: {
    trigger: title,
    start: "top 80%",
    toggleActions: "play none none reverse"
  }
});
```

---

## 🎯 案例 9：图片画廊动画

### 图片依次出现

```javascript
const images = gsap.utils.toArray(".gallery-item");

images.forEach((image, i) => {
  gsap.from(image, {
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: image,
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    delay: i * 0.1
  });
});
```

---

## 🎯 案例 10：按钮交互效果

### 按钮点击波纹效果

```javascript
const buttons = document.querySelectorAll(".button");

buttons.forEach(button => {
  button.addEventListener("click", function(e) {
    // 创建波纹元素
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    this.appendChild(ripple);
    
    // 获取点击位置
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 设置位置
    gsap.set(ripple, {
      left: x,
      top: y,
      xPercent: -50,
      yPercent: -50
    });
    
    // 动画
    gsap.to(ripple, {
      scale: 4,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => ripple.remove()
    });
    
    // 按钮缩放
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  });
});
```

---

## 🎯 案例 11：页面切换动画

### 页面过渡效果

```javascript
function pageTransition(outElement, inElement) {
  const tl = gsap.timeline();
  
  // 退出动画
  tl.to(outElement, {
    opacity: 0,
    y: -50,
    duration: 0.5,
    ease: "power2.in"
  })
  // 进入动画
  .fromTo(inElement,
    {
      opacity: 0,
      y: 50
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    },
    "-=0.3"
  );
}
```

---

## 🎯 案例 12：加载动画

### 旋转加载器

```javascript
// 创建加载动画
const loader = gsap.timeline({ repeat: -1 });

loader.to(".loader-circle", {
  rotation: 360,
  duration: 1,
  ease: "none"
});

// 加载完成后
function hideLoader() {
  gsap.to(".loader", {
    opacity: 0,
    scale: 0,
    duration: 0.3,
    onComplete: () => {
      document.querySelector(".loader").style.display = "none";
      loader.kill();
    }
  });
}
```

---

## 💡 最佳实践总结

### 1. 性能优化

```javascript
// ✅ 使用 transform 和 opacity
gsap.to(".box", {
  x: 100,      // transform
  opacity: 0.5 // opacity
});

// ❌ 避免触发重排
gsap.to(".box", {
  left: "100px",  // 触发重排
  width: "200px"  // 触发重排
});
```

### 2. 合理使用 Timeline

```javascript
// ✅ 推荐：使用 Timeline 管理多个动画
const tl = gsap.timeline();
tl.to(".box1", { x: 100 })
  .to(".box2", { y: 100 }, "-=0.5");
```

### 3. 及时清理

```javascript
// 保存动画引用
const animation = gsap.to(".box", { x: 100 });

// 组件卸载时清理
function cleanup() {
  animation.kill();
  ScrollTrigger.getAll().forEach(st => st.kill());
}
```

### 4. 响应式处理

```javascript
// 窗口大小改变时刷新
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});
```

---

## 🔗 相关资源

- [GSAP CodePen 示例](https://codepen.io/collection/DYpWYq)
- [GSAP 学习中心](https://greensock.com/learning/)
- [上一节：Text 文本动画](./07-Text文本动画.md)
- [下一节：性能优化](./09-性能优化.md)

---

#GSAP #实战案例 #动画效果 #交互设计
