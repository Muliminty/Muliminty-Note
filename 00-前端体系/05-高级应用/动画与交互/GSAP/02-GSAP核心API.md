# GSAP 核心 API

> 深入理解 GSAP 的核心 API：gsap.to()、gsap.from()、gsap.fromTo() 的详细用法和高级技巧。

---

## 📚 核心方法详解

### gsap.to()

从当前状态动画到目标状态。

#### 基本语法

```javascript
gsap.to(target, vars);
```

#### 参数说明

- **target**：目标元素（选择器、DOM 元素、数组）
- **vars**：动画配置对象

#### 基础示例

```javascript
// 移动到指定位置
gsap.to(".box", {
  x: 100,
  y: 50,
  duration: 1
});

// 旋转和缩放
gsap.to(".box", {
  rotation: 360,
  scale: 1.5,
  duration: 2
});
```

#### 高级用法

```javascript
// 使用函数返回值
gsap.to(".box", {
  x: function(index, target) {
    return index * 100; // 每个元素移动不同距离
  },
  duration: 1
});

// 使用相对值
gsap.to(".box", {
  x: "+=100",  // 相对当前位置增加 100
  y: "-=50"    // 相对当前位置减少 50
});
```

---

### gsap.from()

从指定状态动画到当前状态（常用于入场动画）。

#### 基本语法

```javascript
gsap.from(target, vars);
```

#### 基础示例

```javascript
// 从左侧滑入
gsap.from(".box", {
  x: -100,
  opacity: 0,
  duration: 1
});

// 从缩放 0 放大到正常
gsap.from(".box", {
  scale: 0,
  rotation: -180,
  duration: 1
});
```

#### 实战：列表项依次出现

```javascript
gsap.from(".list-item", {
  x: -50,
  opacity: 0,
  duration: 0.5,
  stagger: 0.1  // 每个元素延迟 0.1 秒
});
```

---

### gsap.fromTo()

从指定状态动画到目标状态（完全控制起始和结束状态）。

#### 基本语法

```javascript
gsap.fromTo(target, fromVars, toVars);
```

#### 基础示例

```javascript
gsap.fromTo(".box",
  {
    // 起始状态
    x: -100,
    opacity: 0,
    scale: 0.5
  },
  {
    // 目标状态
    x: 100,
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: "power2.out"
  }
);
```

#### 实战：往返动画

```javascript
const animation = gsap.fromTo(".box",
  { x: 0 },
  { x: 100, duration: 1 }
);

// 点击按钮切换方向
button.addEventListener("click", () => {
  animation.reversed(!animation.reversed());
});
```

---

### gsap.set()

立即设置属性值（无动画，常用于初始化）。

#### 基本语法

```javascript
gsap.set(target, vars);
```

#### 基础示例

```javascript
// 设置初始状态
gsap.set(".box", {
  x: -100,
  opacity: 0
});

// 然后动画到目标状态
gsap.to(".box", {
  x: 0,
  opacity: 1,
  duration: 1
});
```

#### 实战：初始化多个元素

```javascript
// 初始化所有卡片为隐藏状态
gsap.set(".card", {
  opacity: 0,
  y: 50
});

// 然后依次显示
gsap.to(".card", {
  opacity: 1,
  y: 0,
  duration: 0.5,
  stagger: 0.1
});
```

---

## 🎯 高级配置选项

### stagger（错开动画）

让多个元素依次执行动画。

```javascript
// 基础错开
gsap.to(".box", {
  x: 100,
  duration: 1,
  stagger: 0.2  // 每个元素延迟 0.2 秒
});

// 高级错开配置
gsap.to(".box", {
  x: 100,
  duration: 1,
  stagger: {
    amount: 1,      // 总错开时间 1 秒
    from: "start",   // 从开始位置
    ease: "power2"  // 错开缓动
  }
});
```

#### 实战：网格动画

```javascript
gsap.to(".grid-item", {
  scale: 1.2,
  opacity: 1,
  duration: 0.5,
  stagger: {
    grid: "auto",    // 自动检测网格
    amount: 1.5,     // 总时间 1.5 秒
    from: "center"   // 从中心开始
  }
});
```

---

### 函数值（Function Values）

使用函数动态计算属性值。

```javascript
// 基于索引
gsap.to(".box", {
  x: function(index) {
    return index * 100;
  },
  duration: 1
});

// 基于元素
gsap.to(".box", {
  rotation: function(index, target) {
    return target.dataset.angle || 0;
  },
  duration: 1
});

// 随机值
gsap.to(".box", {
  x: function() {
    return Math.random() * 500;
  },
  y: function() {
    return Math.random() * 500;
  },
  duration: 1
});
```

---

### 相对值（Relative Values）

使用相对值进行动画。

```javascript
// 相对当前位置
gsap.to(".box", {
  x: "+=100",   // 增加 100px
  y: "-=50",    // 减少 50px
  rotation: "+=360"  // 增加 360 度
});

// 相对百分比
gsap.to(".box", {
  x: "+=50%",   // 增加自身宽度的 50%
  scale: "+=0.5" // 增加 0.5 倍
});
```

---

### 字符串值（String Values）

使用字符串指定单位或特殊值。

```javascript
// 带单位的值
gsap.to(".box", {
  x: "100px",
  y: "50%",
  rotation: "180deg"
});

// 颜色值
gsap.to(".box", {
  backgroundColor: "rgb(255, 0, 0)",
  color: "#ffffff"
});
```

---

## 🎬 动画控制方法

### 保存动画引用

```javascript
const animation = gsap.to(".box", {
  x: 100,
  duration: 1
});
```

### 控制方法

```javascript
// 播放
animation.play();

// 暂停
animation.pause();

// 恢复（从暂停位置继续）
animation.resume();

// 反向播放
animation.reverse();

// 重新开始
animation.restart();

// 跳转到指定时间
animation.seek(0.5);  // 跳转到 0.5 秒位置

// 跳转到指定进度
animation.progress(0.5);  // 跳转到 50% 进度

// 设置时间缩放
animation.timeScale(0.5);  // 慢速播放（0.5 倍速）
animation.timeScale(2);    // 快速播放（2 倍速）

// 销毁动画
animation.kill();

// 部分销毁（只销毁特定属性）
animation.kill("x");  // 只销毁 x 属性动画
```

### 获取动画状态

```javascript
// 是否正在播放
animation.isActive();

// 当前进度（0-1）
animation.progress();

// 当前时间
animation.time();

// 总时长
animation.duration();

// 是否已反转
animation.reversed();
```

---

## 🎨 实战案例

### 案例 1：卡片悬停效果

```javascript
const cards = document.querySelectorAll(".card");

cards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    gsap.to(card, {
      scale: 1.05,
      y: -10,
      duration: 0.3,
      ease: "power2.out"
    });
  });
  
  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.in"
    });
  });
});
```

### 案例 2：按钮点击动画

```javascript
const button = document.querySelector(".button");

button.addEventListener("click", function() {
  // 点击缩放效果
  gsap.to(button, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut"
  });
});
```

### 案例 3：加载动画

```javascript
// 旋转加载图标
const loader = gsap.to(".loader", {
  rotation: 360,
  duration: 1,
  repeat: -1,
  ease: "none"
});

// 加载完成后停止
function hideLoader() {
  gsap.to(".loader", {
    opacity: 0,
    scale: 0,
    duration: 0.3,
    onComplete: () => {
      loader.kill();
    }
  });
}
```

### 案例 4：列表项依次出现

```javascript
// 初始化：隐藏所有项
gsap.set(".list-item", {
  opacity: 0,
  y: 20
});

// 依次显示
gsap.to(".list-item", {
  opacity: 1,
  y: 0,
  duration: 0.5,
  stagger: 0.1,
  ease: "power2.out"
});
```

### 案例 5：模态框动画

```javascript
// 显示模态框
function showModal() {
  gsap.fromTo(".modal",
    {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: "back.out(1.7)"
    }
  );
  
  // 背景遮罩
  gsap.fromTo(".modal-backdrop",
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  );
}

// 隐藏模态框
function hideModal() {
  gsap.to(".modal", {
    opacity: 0,
    scale: 0.8,
    y: 50,
    duration: 0.3,
    ease: "back.in(1.7)"
  });
  
  gsap.to(".modal-backdrop", {
    opacity: 0,
    duration: 0.3
  });
}
```

---

## 💡 最佳实践

### 1. 使用对象引用而不是选择器

```javascript
// ✅ 推荐：性能更好
const box = document.querySelector(".box");
gsap.to(box, { x: 100 });

// ❌ 不推荐：每次都要查询 DOM
gsap.to(".box", { x: 100 });
```

### 2. 批量操作使用数组

```javascript
// ✅ 推荐：一次查询，批量动画
const boxes = document.querySelectorAll(".box");
gsap.to(boxes, { x: 100 });

// ❌ 不推荐：多次查询
gsap.to(".box", { x: 100 });  // 内部会查询多次
```

### 3. 合理使用 stagger

```javascript
// ✅ 推荐：使用 stagger 而不是循环
gsap.to(".item", {
  opacity: 1,
  stagger: 0.1
});

// ❌ 不推荐：循环创建多个动画
document.querySelectorAll(".item").forEach((item, i) => {
  gsap.to(item, {
    opacity: 1,
    delay: i * 0.1
  });
});
```

### 4. 及时清理动画

```javascript
// 保存动画引用
const animation = gsap.to(".box", { x: 100 });

// 组件卸载时清理
function cleanup() {
  animation.kill();
}
```

---

## 🔗 相关资源

- [GSAP 官方文档 - gsap.to()](https://gsap.com/docs/v3/GSAP/gsap.to())
- [GSAP 官方文档 - gsap.from()](https://gsap.com/docs/v3/GSAP/gsap.from())
- [上一节：GSAP 基础入门](./01-GSAP基础入门.md)
- [下一节：Timeline 时间轴](./03-Timeline时间轴.md)

---

#GSAP #核心API #动画 #前端动画
