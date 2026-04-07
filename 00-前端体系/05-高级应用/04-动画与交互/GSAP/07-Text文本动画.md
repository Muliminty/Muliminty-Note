# Text 文本动画

> GSAP 的文本动画功能，用于创建文字拆分、打字机效果、数字计数等文本动画效果。

---

## 📚 文本动画概述

### 为什么需要文本动画？

- **吸引注意力**：动态文字比静态文字更吸引人
- **增强体验**：提升用户交互体验
- **信息传达**：通过动画强调重要信息

### GSAP 文本动画方式

1. **SplitText 插件**：文字拆分动画（付费）
2. **TextPlugin**：文字内容动画
3. **自定义实现**：使用 JavaScript 拆分文字

---

## 🚀 TextPlugin（文字内容动画）

### 基础用法

```javascript
gsap.to(".text", {
  textContent: "新文字内容",
  duration: 1
});
```

### 数字计数动画

```javascript
gsap.to(".counter", {
  textContent: 100,
  duration: 2,
  snap: { textContent: 1 },  // 整数显示
  ease: "power2.out"
});
```

### 格式化数字

```javascript
gsap.to(".price", {
  textContent: 999.99,
  duration: 2,
  snap: { textContent: 0.01 },  // 保留两位小数
  ease: "power2.out"
});
```

---

## 🎯 SplitText 文字拆分

### 安装 SplitText

SplitText 是 GSAP 的付费插件，需要 Club GreenSock 会员。

### 基础拆分

```javascript
// 引入 SplitText
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

// 拆分文字
const split = new SplitText(".text", {
  type: "chars"  // 按字符拆分
});

// 动画每个字符
gsap.from(split.chars, {
  opacity: 0,
  y: 50,
  duration: 0.5,
  stagger: 0.05
});
```

### 拆分类型

```javascript
// 按字符拆分
const split = new SplitText(".text", {
  type: "chars"
});

// 按单词拆分
const split = new SplitText(".text", {
  type: "words"
});

// 按行拆分
const split = new SplitText(".text", {
  type: "lines"
});

// 组合拆分
const split = new SplitText(".text", {
  type: "chars,words,lines"
});
```

---

## 🎨 自定义文字拆分（免费方案）

### 按字符拆分

```javascript
function splitTextToChars(element) {
  const text = element.textContent;
  const chars = text.split("").map(char => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;  // 保留空格
    span.style.display = "inline-block";
    return span;
  });
  
  element.textContent = "";
  chars.forEach(char => element.appendChild(char));
  
  return Array.from(element.children);
}

// 使用
const chars = splitTextToChars(document.querySelector(".text"));
gsap.from(chars, {
  opacity: 0,
  y: 20,
  duration: 0.3,
  stagger: 0.02
});
```

### 按单词拆分

```javascript
function splitTextToWords(element) {
  const text = element.textContent;
  const words = text.split(" ").map(word => {
    const span = document.createElement("span");
    span.textContent = word;
    span.style.display = "inline-block";
    span.style.marginRight = "0.3em";
    return span;
  });
  
  element.textContent = "";
  words.forEach(word => element.appendChild(word));
  
  return Array.from(element.children);
}

// 使用
const words = splitTextToWords(document.querySelector(".text"));
gsap.from(words, {
  opacity: 0,
  y: 30,
  duration: 0.5,
  stagger: 0.1
});
```

---

## 🎬 实战案例

### 案例 1：打字机效果

```javascript
function typewriter(element, text, speed = 50) {
  element.textContent = "";
  let i = 0;
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// 使用 GSAP 实现
function typewriterGSAP(element, text, duration = 1) {
  gsap.to(element, {
    textContent: text,
    duration: duration,
    ease: "none",
    snap: { textContent: 1 }
  });
}
```

### 案例 2：文字依次出现

```javascript
const text = document.querySelector(".text");
const chars = splitTextToChars(text);

gsap.from(chars, {
  opacity: 0,
  y: 50,
  rotationX: -90,
  duration: 0.5,
  stagger: 0.03,
  ease: "back.out(1.7)"
});
```

### 案例 3：文字波浪效果

```javascript
const text = document.querySelector(".text");
const chars = splitTextToChars(text);

chars.forEach((char, i) => {
  gsap.to(char, {
    y: -20,
    duration: 0.3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: i * 0.05
  });
});
```

### 案例 4：数字计数动画

```javascript
function animateCounter(element, target, duration = 2) {
  gsap.to(element, {
    textContent: target,
    duration: duration,
    snap: { textContent: 1 },
    ease: "power2.out",
    onUpdate: function() {
      element.textContent = Math.floor(this.targets()[0].textContent);
    }
  });
}

// 使用
animateCounter(document.querySelector(".counter"), 100);
```

### 案例 5：价格动画

```javascript
function animatePrice(element, target, duration = 1.5) {
  gsap.to(element, {
    textContent: target,
    duration: duration,
    snap: { textContent: 0.01 },
    ease: "power2.out",
    onUpdate: function() {
      const value = parseFloat(this.targets()[0].textContent);
      element.textContent = `¥${value.toFixed(2)}`;
    }
  });
}
```

### 案例 6：滚动触发文字动画

```javascript
const text = document.querySelector(".text");
const words = splitTextToWords(text);

gsap.from(words, {
  opacity: 0,
  y: 30,
  duration: 0.5,
  stagger: 0.1,
  scrollTrigger: {
    trigger: text,
    start: "top 80%",
    toggleActions: "play none none reverse"
  }
});
```

### 案例 7：文字高亮效果

```javascript
const text = document.querySelector(".text");
const words = splitTextToWords(text);

words.forEach((word, i) => {
  word.addEventListener("mouseenter", () => {
    gsap.to(word, {
      scale: 1.2,
      color: "#ff6b6b",
      duration: 0.3,
      ease: "back.out(1.7)"
    });
  });
  
  word.addEventListener("mouseleave", () => {
    gsap.to(word, {
      scale: 1,
      color: "inherit",
      duration: 0.3
    });
  });
});
```

### 案例 8：文字擦除效果

```javascript
const text = document.querySelector(".text");
const chars = splitTextToChars(text);

// 设置初始状态
gsap.set(chars, { opacity: 1 });

// 擦除动画
function eraseText() {
  gsap.to(chars, {
    opacity: 0,
    x: 50,
    duration: 0.3,
    stagger: 0.02,
    ease: "power2.in"
  });
}
```

---

## 🛠️ 高级技巧

### 保留 HTML 结构

```javascript
function splitTextPreserveHTML(element) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }
  
  textNodes.forEach(textNode => {
    const parent = textNode.parentNode;
    const text = textNode.textContent;
    const chars = text.split("").map(char => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      return span;
    });
    
    textNode.remove();
    chars.forEach(char => parent.appendChild(char));
  });
  
  return Array.from(element.querySelectorAll("span"));
}
```

### 结合 Timeline

```javascript
const text = document.querySelector(".text");
const words = splitTextToWords(text);

const tl = gsap.timeline();

words.forEach((word, i) => {
  tl.from(word, {
    opacity: 0,
    y: 20,
    duration: 0.3
  }, i * 0.1);
});
```

---

## 💡 最佳实践

### 1. 性能优化

```javascript
// ✅ 推荐：使用 transform 和 opacity
gsap.from(chars, {
  opacity: 0,
  y: 20,  // 使用 y 而不是 top
  duration: 0.3
});

// ❌ 不推荐：触发重排
gsap.from(chars, {
  opacity: 0,
  top: 20,  // 触发重排
  duration: 0.3
});
```

### 2. 合理使用 stagger

```javascript
// ✅ 推荐：适度的延迟
gsap.from(chars, {
  opacity: 0,
  stagger: 0.02  // 20ms 延迟
});

// ❌ 不推荐：延迟太长
gsap.from(chars, {
  opacity: 0,
  stagger: 0.2  // 200ms 延迟，太慢
});
```

### 3. 处理空格

```javascript
// ✅ 推荐：保留空格
span.textContent = char === " " ? "\u00A0" : char;  // 不间断空格

// ❌ 不推荐：丢失空格
span.textContent = char;  // 空格可能被忽略
```

---

## 🔗 相关资源

- [GSAP TextPlugin 文档](https://gsap.com/docs/v3/Plugins/TextPlugin/)
- [SplitText 插件](https://greensock.com/docs/v3/Plugins/SplitText)（付费）
- [上一节：Morphing 与路径动画](./06-Morphing与路径动画.md)
- [下一节：GSAP 实战案例](./08-GSAP实战案例.md)

---

#GSAP #文本动画 #文字动画 #SplitText #打字机效果
