# Intersection Observer API

> Intersection Observer API 提供了异步观察目标元素与其祖先元素或视口交叉状态的能力，常用于实现懒加载、无限滚动等功能。
> 
> **参考规范**：[Intersection Observer](https://w3c.github.io/IntersectionObserver/)

---

## 📚 目录

- [1. Intersection Observer 概述](#1-intersection-observer-概述)
- [2. 基本用法](#2-基本用法)
- [3. 配置选项](#3-配置选项)
- [4. 实际应用](#4-实际应用)
- [5. 性能优化](#5-性能优化)

---

## 1. Intersection Observer 概述

### 1.1 什么是 Intersection Observer

**Intersection Observer** 用于异步观察目标元素与根元素（通常是视口）的交叉状态，当目标元素进入或离开视口时触发回调。

**优势**：
- 性能更好（比 scroll 事件更高效）
- 异步执行（不阻塞主线程）
- 自动管理（无需手动添加/移除监听器）

### 1.2 浏览器支持

```javascript
// 检查支持
if ('IntersectionObserver' in window) {
  // 支持 Intersection Observer
} else {
  // 需要 polyfill 或降级方案
}
```

---

## 2. 基本用法

### 2.1 创建 Observer

```javascript
// 创建 Intersection Observer
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('Element is visible');
    } else {
      console.log('Element is not visible');
    }
  });
});

// 观察目标元素
const target = document.querySelector('.target');
observer.observe(target);
```

### 2.2 回调函数

```javascript
const observer = new IntersectionObserver((entries, observer) => {
  // entries - 所有被观察元素的交叉状态数组
  // observer - IntersectionObserver 实例
  
  entries.forEach(entry => {
    // entry.target - 被观察的元素
    // entry.isIntersecting - 是否交叉
    // entry.intersectionRatio - 交叉比例（0-1）
    // entry.intersectionRect - 交叉区域
    // entry.boundingClientRect - 目标元素边界
    // entry.rootBounds - 根元素边界
    // entry.time - 时间戳
  });
});
```

### 2.3 停止观察

```javascript
const observer = new IntersectionObserver(callback);
const target = document.querySelector('.target');

// 观察
observer.observe(target);

// 停止观察单个元素
observer.unobserve(target);

// 停止观察所有元素并销毁
observer.disconnect();
```

---

## 3. 配置选项

### 3.1 root

```javascript
// root - 根元素（默认是视口）
const observer = new IntersectionObserver(callback, {
  root: document.querySelector('.scroll-container')  // 指定根元素
});

// 默认是 null（视口）
const observer = new IntersectionObserver(callback, {
  root: null  // 视口
});
```

### 3.2 rootMargin

```javascript
// rootMargin - 根元素的边距（类似 CSS margin）
const observer = new IntersectionObserver(callback, {
  rootMargin: '50px'           // 所有边都是 50px
  rootMargin: '10px 20px'      // 上下 10px，左右 20px
  rootMargin: '10px 20px 30px 40px'  // 上右下左
  rootMargin: '-50px'          // 负值，缩小触发区域
});

// 示例：提前 100px 触发
const observer = new IntersectionObserver(callback, {
  rootMargin: '100px'
});
```

### 3.3 threshold

```javascript
// threshold - 交叉比例阈值（0-1）
const observer = new IntersectionObserver(callback, {
  threshold: 0.5  // 当 50% 可见时触发
});

// 多个阈值
const observer = new IntersectionObserver(callback, {
  threshold: [0, 0.25, 0.5, 0.75, 1]  // 在多个比例时触发
});

// 示例：完全可见时触发
const observer = new IntersectionObserver(callback, {
  threshold: 1.0
});
```

### 3.4 完整配置

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    console.log('Intersection ratio:', entry.intersectionRatio);
  });
}, {
  root: null,                    // 视口
  rootMargin: '0px',            // 无边距
  threshold: [0, 0.5, 1.0]      // 0%、50%、100% 时触发
});
```

---

## 4. 实际应用

### 4.1 图片懒加载

```javascript
// 图片懒加载
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      
      // 加载图片
      img.src = img.dataset.src;
      img.classList.add('loaded');
      
      // 停止观察
      observer.unobserve(img);
    }
  });
});

// 观察所有懒加载图片
document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// HTML
// <img data-src="image.jpg" alt="Lazy loaded image">
```

### 4.2 无限滚动

```javascript
// 无限滚动
const sentinelObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 加载更多内容
      loadMoreContent();
    }
  });
});

// 观察哨兵元素
const sentinel = document.querySelector('.sentinel');
sentinelObserver.observe(sentinel);

// HTML
// <div class="content-list">
//   <!-- 内容 -->
// </div>
// <div class="sentinel"></div>  <!-- 哨兵元素 -->
```

### 4.3 元素进入视口动画

```javascript
// 元素进入视口时添加动画
const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      // 可选：动画后停止观察
      animationObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1  // 10% 可见时触发
});

// 观察所有需要动画的元素
document.querySelectorAll('.animate-on-scroll').forEach(el => {
  animationObserver.observe(el);
});

// CSS
// .animate-on-scroll {
//   opacity: 0;
//   transform: translateY(20px);
//   transition: opacity 0.6s, transform 0.6s;
// }
// .animate-on-scroll.animate {
//   opacity: 1;
//   transform: translateY(0);
// }
```

### 4.4 广告可见性检测

```javascript
// 检测广告是否可见
const adObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 记录广告可见
      recordAdView(entry.target.dataset.adId);
    }
  });
}, {
  threshold: 0.5  // 50% 可见才算可见
});

// 观察广告元素
document.querySelectorAll('.ad').forEach(ad => {
  adObserver.observe(ad);
});
```

### 4.5 固定导航栏

```javascript
// 当内容滚动到顶部时固定导航栏
const headerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const header = document.querySelector('.header');
    if (!entry.isIntersecting) {
      header.classList.add('fixed');
    } else {
      header.classList.remove('fixed');
    }
  });
});

// 观察顶部元素
const topElement = document.querySelector('.top-element');
headerObserver.observe(topElement);
```

### 4.6 阅读进度

```javascript
// 阅读进度条
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progress = entry.intersectionRatio;
      updateProgressBar(progress);
    }
  });
}, {
  threshold: Array.from({ length: 100 }, (_, i) => i / 100)
});

// 观察文章内容
const article = document.querySelector('.article');
progressObserver.observe(article);
```

---

## 5. 性能优化

### 5.1 复用 Observer

```javascript
// ✅ 好：复用同一个 Observer
const observer = new IntersectionObserver(callback);

document.querySelectorAll('.lazy-image').forEach(img => {
  observer.observe(img);
});

// ❌ 不好：为每个元素创建 Observer
document.querySelectorAll('.lazy-image').forEach(img => {
  const observer = new IntersectionObserver(callback);
  observer.observe(img);
});
```

### 5.2 及时停止观察

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 处理逻辑
      handleIntersection(entry.target);
      
      // 处理完后停止观察（如果不再需要）
      observer.unobserve(entry.target);
    }
  });
});
```

### 5.3 合理设置 threshold

```javascript
// ✅ 好：根据需求设置合适的 threshold
const observer = new IntersectionObserver(callback, {
  threshold: 0.1  // 只需要 10% 可见
});

// ❌ 不好：使用过小的 threshold（可能频繁触发）
const observer = new IntersectionObserver(callback, {
  threshold: 0.01  // 1% 可见就触发，可能过于频繁
});
```

### 5.4 封装工具类

```javascript
class LazyLoader {
  constructor(options = {}) {
    this.options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };
    
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.options
    );
  }
  
  observe(element) {
    this.observer.observe(element);
  }
  
  unobserve(element) {
    this.observer.unobserve(element);
  }
  
  disconnect() {
    this.observer.disconnect();
  }
  
  handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.load(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }
  
  load(element) {
    // 子类实现
    console.log('Loading:', element);
  }
}

// 图片懒加载实现
class LazyImageLoader extends LazyLoader {
  load(img) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    }
  }
}

// 使用
const imageLoader = new LazyImageLoader();
document.querySelectorAll('img[data-src]').forEach(img => {
  imageLoader.observe(img);
});
```

---

## 📖 参考资源

- [MDN - Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)
- [Intersection Observer Specification](https://w3c.github.io/IntersectionObserver/)
- [Google Developers - Intersection Observer](https://developers.google.com/web/updates/2016/04/intersection-observer)

---

#javascript #intersection-observer #懒加载 #性能优化 #前端基础
