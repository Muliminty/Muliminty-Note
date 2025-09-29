# JavaScript 滚动操作完整笔记

## 一、常用 API

### 1. `window.scrollTo(x, y)`

- 滚动到指定坐标位置。
    
- **示例**：
    
    ```js
    window.scrollTo(0, 500); // 直接跳到 y=500
    ```
    

### 2. `window.scrollBy(x, y)`

- 相对当前位置滚动。
    
- **示例**：
    
    ```js
    window.scrollBy(0, 200); // 向下滚动 200px
    ```
    

### 3. `element.scrollTo(options)`

- 针对某个 **容器元素** 的滚动。
    
- **示例**：
    
    ```js
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
    ```
    

### 4. `element.scrollIntoView(options)`

- 滚动页面以使某个元素进入可视区域。
    
- **示例**：
    
    ```js
    document.querySelector('#target').scrollIntoView({
      behavior: 'smooth',
      block: 'center', // 顶部(top)、底部(end)、居中(center)、默认值 nearest
    });
    ```
    

---

## 二、滚动到不同位置

### 1. 滚动到顶部

```js
window.scrollTo({
  top: 0,
  behavior: 'smooth',
});
```

### 2. 滚动到底部

```js
window.scrollTo({
  top: document.documentElement.scrollHeight,
  behavior: 'smooth',
});
```

### 3. 滚动到中间

```js
window.scrollTo({
  top: document.documentElement.scrollHeight / 2,
  behavior: 'smooth',
});
```

### 4. 滚动到指定位置（像素点）

```js
window.scrollTo({
  top: 800,
  behavior: 'smooth',
});
```

### 5. 滚动到指定元素

```js
document.querySelector('#section3').scrollIntoView({
  behavior: 'smooth',
  block: 'start',
});
```

---

## 三、相对滚动

### 1. 向下滚动 N 像素

```js
window.scrollBy({
  top: 300,
  behavior: 'smooth',
});
```

### 2. 向上滚动 N 像素

```js
window.scrollBy({
  top: -300,
  behavior: 'smooth',
});
```

---

## 四、滚动状态检测

### 1. 判断是否在顶部

```js
function isAtTop() {
  return window.scrollY === 0;
}
```

### 2. 判断是否在底部

```js
function isAtBottom() {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;
}
```

### 3. 监听滚动事件

```js
window.addEventListener('scroll', () => {
  console.log('当前位置：', window.scrollY);
});
```

---

## 五、常见应用场景

1. **返回顶部按钮**
    
    ```js
    const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    ```
    
2. **聊天窗口自动滚动到底部**
    
    ```js
    function scrollChatToBottom(container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
    ```
    
3. **目录导航滚动到对应区域**
    
    ```js
    function scrollToSection(id) {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    }
    ```
    
4. **懒加载场景检测是否触底**
    
    ```js
    window.addEventListener('scroll', () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
        console.log('触底啦，加载更多内容...');
      }
    });
    ```
    

---

## 六、兼容性与优化

- `behavior: 'smooth'` 在 IE 和部分老旧浏览器不支持。  
    ➝ 可用 **polyfill**（如 smoothscroll-polyfill）兼容。
    
- 滚动事件频繁触发，可能影响性能。  
    ➝ 使用 **节流/防抖** 优化（如 lodash.throttle）。
    
- 移动端要注意软键盘弹出时的布局和滚动计算差异。
    

---

## 七、总结

- **全局滚动**：`window.scrollTo`、`window.scrollBy`。
    
- **局部滚动**：`element.scrollTo`、`element.scrollBy`。
    
- **定位元素**：`element.scrollIntoView`。
    
- 支持 **顶部、中间、底部、相对滚动、指定元素**。
    
- 结合事件监听可实现 **返回顶部、聊天窗口、懒加载** 等常见功能。