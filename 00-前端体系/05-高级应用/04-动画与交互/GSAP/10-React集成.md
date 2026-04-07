# GSAP 与 React 集成

> 如何在 React 项目中使用 GSAP 创建动画效果。

---

## 📚 React 集成概述

### 为什么需要特殊处理？

React 的虚拟 DOM 和组件生命周期需要特殊的集成方式：

- **useRef**：获取 DOM 元素引用
- **useEffect**：在组件挂载后初始化动画
- **清理函数**：组件卸载时清理动画

---

## 🚀 基础集成

### 安装

```bash
npm install gsap
```

### 基础示例

```jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function AnimatedBox() {
  const boxRef = useRef(null);
  
  useEffect(() => {
    gsap.to(boxRef.current, {
      x: 100,
      duration: 1,
      ease: "power2.out"
    });
  }, []);
  
  return <div ref={boxRef} className="box">动画盒子</div>;
}
```

---

## 🎯 使用 useRef 获取元素

### 单个元素

```jsx
function FadeInBox() {
  const boxRef = useRef(null);
  
  useEffect(() => {
    gsap.from(boxRef.current, {
      opacity: 0,
      y: 50,
      duration: 1
    });
  }, []);
  
  return <div ref={boxRef}>淡入盒子</div>;
}
```

### 多个元素

```jsx
function MultipleBoxes() {
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const box3Ref = useRef(null);
  
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.to(box1Ref.current, { x: 100, duration: 1 })
      .to(box2Ref.current, { y: 100, duration: 1 }, "-=0.5")
      .to(box3Ref.current, { rotation: 360, duration: 1 });
  }, []);
  
  return (
    <>
      <div ref={box1Ref}>盒子 1</div>
      <div ref={box2Ref}>盒子 2</div>
      <div ref={box3Ref}>盒子 3</div>
    </>
  );
}
```

### 使用 querySelector

```jsx
function QuerySelectorExample() {
  useEffect(() => {
    const boxes = document.querySelectorAll(".box");
    
    gsap.from(boxes, {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.1
    });
  }, []);
  
  return (
    <>
      <div className="box">盒子 1</div>
      <div className="box">盒子 2</div>
      <div className="box">盒子 3</div>
    </>
  );
}
```

---

## 🎨 动画清理

### 基础清理

```jsx
function AnimatedComponent() {
  const boxRef = useRef(null);
  const animationRef = useRef(null);
  
  useEffect(() => {
    // 创建动画
    animationRef.current = gsap.to(boxRef.current, {
      x: 100,
      duration: 1
    });
    
    // 清理函数
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);
  
  return <div ref={boxRef}>动画元素</div>;
}
```

### Timeline 清理

```jsx
function TimelineComponent() {
  const boxRef = useRef(null);
  const tlRef = useRef(null);
  
  useEffect(() => {
    tlRef.current = gsap.timeline();
    
    tlRef.current
      .to(boxRef.current, { x: 100, duration: 1 })
      .to(boxRef.current, { y: 100, duration: 1 });
    
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, []);
  
  return <div ref={boxRef}>时间轴动画</div>;
}
```

### ScrollTrigger 清理

```jsx
import { ScrollTrigger } from "gsap/ScrollTrigger";

function ScrollComponent() {
  const boxRef = useRef(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.to(boxRef.current, {
      x: 100,
      scrollTrigger: {
        trigger: boxRef.current,
        start: "top center"
      }
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);
  
  return <div ref={boxRef}>滚动动画</div>;
}
```

---

## 🎬 实战案例

### 案例 1：列表项依次出现

```jsx
function AnimatedList({ items }) {
  const listRef = useRef(null);
  
  useEffect(() => {
    const items = listRef.current.querySelectorAll(".list-item");
    
    gsap.from(items, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, [items]);
  
  return (
    <ul ref={listRef}>
      {items.map((item, i) => (
        <li key={i} className="list-item">{item}</li>
      ))}
    </ul>
  );
}
```

### 案例 2：卡片悬停效果

```jsx
function HoverCard({ children }) {
  const cardRef = useRef(null);
  
  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.05,
      y: -10,
      duration: 0.3,
      ease: "power2.out"
    });
  };
  
  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.in"
    });
  };
  
  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
```

### 案例 3：模态框动画

```jsx
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      // 显示动画
      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.8, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "back.out(1.7)"
        }
      );
    } else {
      // 隐藏动画
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 0.3
      });
      
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3
      });
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <>
      <div ref={backdropRef} className="modal-backdrop" onClick={onClose} />
      <div ref={modalRef} className="modal">
        {children}
      </div>
    </>
  );
}
```

### 案例 4：滚动触发动画

```jsx
import { ScrollTrigger } from "gsap/ScrollTrigger";

function ScrollReveal({ children }) {
  const elementRef = useRef(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.from(elementRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: elementRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);
  
  return <div ref={elementRef}>{children}</div>;
}
```

### 案例 5：数字计数动画

```jsx
function Counter({ target }) {
  const counterRef = useRef(null);
  
  useEffect(() => {
    gsap.to(counterRef.current, {
      textContent: target,
      duration: 2,
      snap: { textContent: 1 },
      ease: "power2.out"
    });
  }, [target]);
  
  return <span ref={counterRef}>0</span>;
}
```

---

## 🛠️ 自定义 Hook

### useGSAP Hook

```jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function useGSAP(animationFn, deps = []) {
  const elementRef = useRef(null);
  const animationRef = useRef(null);
  
  useEffect(() => {
    if (elementRef.current) {
      animationRef.current = animationFn(elementRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        if (animationRef.current.kill) {
          animationRef.current.kill();
        } else if (Array.isArray(animationRef.current)) {
          animationRef.current.forEach(anim => anim.kill());
        }
      }
    };
  }, deps);
  
  return elementRef;
}

// 使用
function AnimatedBox() {
  const boxRef = useGSAP((element) => {
    return gsap.to(element, {
      x: 100,
      duration: 1
    });
  });
  
  return <div ref={boxRef}>动画盒子</div>;
}
```

### useScrollTrigger Hook

```jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function useScrollTrigger(animationFn, deps = []) {
  const elementRef = useRef(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (elementRef.current) {
      animationFn(elementRef.current);
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, deps);
  
  return elementRef;
}

// 使用
function ScrollReveal({ children }) {
  const elementRef = useScrollTrigger((element) => {
    gsap.from(element, {
      opacity: 0,
      y: 50,
      scrollTrigger: {
        trigger: element,
        start: "top 80%"
      }
    });
  });
  
  return <div ref={elementRef}>{children}</div>;
}
```

---

## 💡 最佳实践

### 1. 使用 useRef 而不是 useState

```jsx
// ✅ 推荐：使用 useRef
const boxRef = useRef(null);

// ❌ 不推荐：使用 useState
const [box, setBox] = useState(null);
```

### 2. 在 useEffect 中初始化动画

```jsx
// ✅ 推荐：组件挂载后初始化
useEffect(() => {
  gsap.to(boxRef.current, { x: 100 });
}, []);

// ❌ 不推荐：在渲染中直接调用
gsap.to(boxRef.current, { x: 100 }); // 可能元素还未挂载
```

### 3. 及时清理动画

```jsx
useEffect(() => {
  const animation = gsap.to(boxRef.current, { x: 100 });
  
  return () => {
    animation.kill(); // 清理动画
  };
}, []);
```

### 4. 避免在渲染中创建动画

```jsx
// ❌ 不推荐：每次渲染都创建动画
function Component() {
  gsap.to(".box", { x: 100 }); // 错误！
  return <div className="box">盒子</div>;
}

// ✅ 推荐：在 useEffect 中创建
function Component() {
  useEffect(() => {
    gsap.to(".box", { x: 100 });
  }, []);
  return <div className="box">盒子</div>;
}
```

---

## 🔗 相关资源

- [React 官方文档](https://react.dev/)
- [GSAP React 集成指南](https://greensock.com/docs/v3/React)
- [上一节：性能优化](./09-性能优化.md)
- [下一节：Vue 集成](./11-Vue集成.md)

---

#GSAP #React #React集成 #前端动画
