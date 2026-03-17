# DOM 操作（DOM Manipulation）

> DOM（Document Object Model）是 HTML 和 XML 文档的编程接口，提供了对文档结构和内容的访问与操作能力。
> 
> **参考规范**：[DOM Living Standard](https://dom.spec.whatwg.org/)

---

## 📚 目录

- [1. DOM 概述](#1-dom-概述)
- [2. 节点类型](#2-节点类型)
- [3. 节点查询](#3-节点查询)
- [4. 节点操作](#4-节点操作)
- [5. 属性操作](#5-属性操作)
- [6. 样式操作](#6-样式操作)
- [7. 内容操作](#7-内容操作)
- [8. 事件绑定](#8-事件绑定)
- [9. 性能优化](#9-性能优化)

---

## 1. DOM 概述

### 1.1 什么是 DOM

**DOM** 是文档对象模型，将 HTML/XML 文档表示为树形结构，每个节点都是对象。

**DOM 树结构**：
```
Document
  └── html
       ├── head
       │    ├── meta
       │    └── title
       └── body
            ├── div
            │    └── p
            └── script
```

### 1.2 节点类型

DOM 中的节点类型（Node Types）：

| 节点类型 | 常量值 | 说明 |
|---------|--------|------|
| ELEMENT_NODE | 1 | 元素节点 |
| TEXT_NODE | 3 | 文本节点 |
| COMMENT_NODE | 8 | 注释节点 |
| DOCUMENT_NODE | 9 | 文档节点 |
| DOCUMENT_TYPE_NODE | 10 | 文档类型节点 |

```javascript
// 检查节点类型
element.nodeType === Node.ELEMENT_NODE;  // true
text.nodeType === Node.TEXT_NODE;        // true
```

---

## 2. 节点类型

### 2.1 Element 节点

**Element** 是 DOM 中最常见的节点类型，代表 HTML 元素。

```javascript
const div = document.createElement('div');
div.tagName;        // "DIV"
div.nodeName;       // "DIV"
div.nodeType;       // 1 (ELEMENT_NODE)
```

### 2.2 Text 节点

**Text** 节点包含文本内容。

```javascript
const text = document.createTextNode('Hello');
text.nodeType;      // 3 (TEXT_NODE)
text.textContent;   // "Hello"
```

### 2.3 Document 节点

**Document** 是文档的根节点。

```javascript
document.nodeType;  // 9 (DOCUMENT_NODE)
document.documentElement;  // <html> 元素
document.body;      // <body> 元素
```

---

## 3. 节点查询

### 3.1 单个元素查询

```javascript
// getElementById - 通过 ID 查询（最快）
const element = document.getElementById('myId');

// querySelector - CSS 选择器查询单个元素
const element = document.querySelector('.my-class');
const element = document.querySelector('#myId');
const element = document.querySelector('div > p');
```

### 3.2 多个元素查询

```javascript
// getElementsByClassName - 通过类名查询（返回 HTMLCollection）
const elements = document.getElementsByClassName('my-class');

// getElementsByTagName - 通过标签名查询（返回 HTMLCollection）
const divs = document.getElementsByTagName('div');

// querySelectorAll - CSS 选择器查询多个元素（返回 NodeList）
const elements = document.querySelectorAll('.my-class');
const elements = document.querySelectorAll('div > p');
```

### 3.3 HTMLCollection vs NodeList

**HTMLCollection**：
- 动态集合，DOM 变化时自动更新
- 只有 `length` 和索引访问
- `getElementsByClassName`、`getElementsByTagName` 返回

**NodeList**：
- 静态集合（`querySelectorAll`）或动态集合（`childNodes`）
- 有 `forEach`、`entries`、`keys`、`values` 等方法
- `querySelectorAll` 返回静态 NodeList

```javascript
// HTMLCollection 转数组
const array = Array.from(htmlCollection);
const array = [...htmlCollection];

// NodeList 转数组
const array = Array.from(nodeList);
const array = [...nodeList];
```

### 3.4 相对查询

```javascript
const element = document.querySelector('.parent');

// 子元素查询
element.children;              // HTMLCollection（只包含元素节点）
element.childNodes;            // NodeList（包含所有节点）
element.firstElementChild;     // 第一个子元素
element.lastElementChild;      // 最后一个子元素

// 父元素查询
element.parentElement;         // 父元素
element.parentNode;            // 父节点

// 兄弟元素查询
element.nextElementSibling;    // 下一个兄弟元素
element.previousElementSibling; // 上一个兄弟元素
```

---

## 4. 节点操作

### 4.1 创建节点

```javascript
// 创建元素节点
const div = document.createElement('div');
const p = document.createElement('p');

// 创建文本节点
const text = document.createTextNode('Hello World');

// 创建注释节点
const comment = document.createComment('This is a comment');

// 创建文档片段（性能优化）
const fragment = document.createDocumentFragment();
```

### 4.2 添加节点

```javascript
const parent = document.querySelector('.parent');
const child = document.createElement('div');

// appendChild - 添加到末尾
parent.appendChild(child);

// insertBefore - 插入到指定位置
const referenceNode = parent.firstChild;
parent.insertBefore(child, referenceNode);

// insertAdjacentElement - 相对位置插入
element.insertAdjacentElement('beforebegin', newElement);  // 元素前
element.insertAdjacentElement('afterbegin', newElement);   // 元素内开头
element.insertAdjacentElement('beforeend', newElement);    // 元素内末尾
element.insertAdjacentElement('afterend', newElement);     // 元素后

// insertAdjacentHTML - 插入 HTML 字符串
element.insertAdjacentHTML('beforeend', '<p>New paragraph</p>');
```

### 4.3 移除节点

```javascript
const parent = document.querySelector('.parent');
const child = document.querySelector('.child');

// removeChild - 移除子节点（返回被移除的节点）
const removed = parent.removeChild(child);

// remove - 移除自身（现代方法）
child.remove();
```

### 4.4 替换节点

```javascript
const parent = document.querySelector('.parent');
const oldChild = document.querySelector('.old');
const newChild = document.createElement('div');

// replaceChild - 替换子节点
parent.replaceChild(newChild, oldChild);

// replaceWith - 替换自身（现代方法）
oldChild.replaceWith(newChild);
```

### 4.5 克隆节点

```javascript
const element = document.querySelector('.element');

// cloneNode(false) - 浅克隆（只克隆元素本身）
const shallowClone = element.cloneNode(false);

// cloneNode(true) - 深克隆（克隆元素及其所有子节点）
const deepClone = element.cloneNode(true);
```

---

## 5. 属性操作

### 5.1 标准属性

```javascript
const element = document.querySelector('img');

// 直接访问（推荐）
element.src = 'https://example.com/image.jpg';
element.alt = 'Description';
element.className = 'my-class';  // class 是保留字，使用 className

// getAttribute / setAttribute
element.setAttribute('src', 'https://example.com/image.jpg');
const src = element.getAttribute('src');

// hasAttribute / removeAttribute
element.hasAttribute('src');     // true
element.removeAttribute('alt');
```

### 5.2 自定义属性

```javascript
// data-* 属性（推荐方式）
element.setAttribute('data-user-id', '123');
const userId = element.getAttribute('data-user-id');

// dataset API（更优雅）
element.dataset.userId = '123';
const userId = element.dataset.userId;  // "123"
// data-user-name -> dataset.userName（驼峰命名）

// 自定义属性（不推荐，可能冲突）
element.setAttribute('custom-attr', 'value');
```

### 5.3 属性列表

```javascript
const element = document.querySelector('div');

// attributes - 所有属性的 NamedNodeMap
const attrs = element.attributes;
for (let attr of attrs) {
  console.log(attr.name, attr.value);
}

// 遍历属性
Array.from(element.attributes).forEach(attr => {
  console.log(attr.name, attr.value);
});
```

---

## 6. 样式操作

### 6.1 style 属性

```javascript
const element = document.querySelector('.element');

// 直接设置（内联样式）
element.style.color = 'red';
element.style.backgroundColor = 'blue';
element.style.fontSize = '16px';

// 批量设置
element.style.cssText = 'color: red; background: blue;';

// 读取样式（只能读取内联样式）
const color = element.style.color;
```

### 6.2 计算样式

```javascript
// getComputedStyle - 获取最终计算后的样式
const computedStyle = window.getComputedStyle(element);
const color = computedStyle.color;
const fontSize = computedStyle.fontSize;
const margin = computedStyle.margin;

// 获取伪元素样式
const beforeStyle = window.getComputedStyle(element, '::before');
```

### 6.3 classList API

```javascript
const element = document.querySelector('.element');

// 添加类
element.classList.add('active');
element.classList.add('class1', 'class2');

// 移除类
element.classList.remove('active');
element.classList.remove('class1', 'class2');

// 切换类
element.classList.toggle('active');

// 检查类
element.classList.contains('active');  // true/false

// 替换类
element.classList.replace('old', 'new');

// 遍历类
element.classList.forEach(className => {
  console.log(className);
});
```

---

## 7. 内容操作

### 7.1 textContent

```javascript
const element = document.querySelector('.element');

// 设置文本内容（会移除所有 HTML 标签）
element.textContent = 'Hello World';

// 获取文本内容（包括隐藏元素）
const text = element.textContent;
```

### 7.2 innerHTML

```javascript
const element = document.querySelector('.element');

// 设置 HTML 内容
element.innerHTML = '<p>Hello <strong>World</strong></p>';

// 获取 HTML 内容
const html = element.innerHTML;

// ⚠️ 安全警告：innerHTML 可能导致 XSS 攻击
// 如果内容来自用户输入，应该使用 textContent 或进行转义
```

### 7.3 innerText

```javascript
const element = document.querySelector('.element');

// 设置文本内容（只显示可见文本）
element.innerText = 'Hello World';

// 获取文本内容（只返回可见文本）
const text = element.innerText;

// ⚠️ 注意：innerText 会触发重排，性能较差，推荐使用 textContent
```

### 7.4 outerHTML

```javascript
const element = document.querySelector('.element');

// 获取包含元素本身的 HTML
const html = element.outerHTML;
// "<div class='element'>Content</div>"

// 设置 outerHTML 会替换整个元素
element.outerHTML = '<span>New</span>';
```

---

## 8. 事件绑定

### 8.1 事件监听器

```javascript
const element = document.querySelector('.button');

// addEventListener - 推荐方式
element.addEventListener('click', function(event) {
  console.log('Clicked!');
});

// 命名函数
function handleClick(event) {
  console.log('Clicked!');
}
element.addEventListener('click', handleClick);

// 移除事件监听器
element.removeEventListener('click', handleClick);
```

### 8.2 事件选项

```javascript
// 第三个参数可以是选项对象
element.addEventListener('click', handler, {
  capture: true,        // 捕获阶段触发
  once: true,           // 只触发一次
  passive: true,        // 被动监听（提升滚动性能）
  signal: abortSignal   // 通过 AbortSignal 控制
});

// 旧式写法（不推荐）
element.addEventListener('click', handler, true);  // capture
```

### 8.3 事件委托

```javascript
// 在父元素上监听，利用事件冒泡
const list = document.querySelector('.list');

list.addEventListener('click', function(event) {
  // event.target 是实际点击的元素
  if (event.target.matches('.item')) {
    console.log('Item clicked:', event.target);
  }
});
```

---

## 9. 性能优化

### 9.1 批量操作

```javascript
// ❌ 不好：多次 DOM 操作
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  parent.appendChild(div);
}

// ✅ 好：使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  fragment.appendChild(div);
}
parent.appendChild(fragment);
```

### 9.2 缓存查询结果

```javascript
// ❌ 不好：重复查询
for (let i = 0; i < 100; i++) {
  document.querySelector('.element').style.color = 'red';
}

// ✅ 好：缓存查询结果
const element = document.querySelector('.element');
for (let i = 0; i < 100; i++) {
  element.style.color = 'red';
}
```

### 9.3 使用现代 API

```javascript
// ❌ 不好：innerHTML（可能触发多次重排）
element.innerHTML += '<p>New</p>';

// ✅ 好：insertAdjacentHTML
element.insertAdjacentHTML('beforeend', '<p>New</p>');

// ✅ 更好：createElement + appendChild
const p = document.createElement('p');
p.textContent = 'New';
element.appendChild(p);
```

### 9.4 避免强制同步布局

```javascript
// ❌ 不好：强制同步布局（Layout Thrashing）
for (let i = 0; i < elements.length; i++) {
  elements[i].style.width = elements[i].offsetWidth + 10 + 'px';
}

// ✅ 好：批量读取，批量写入
const widths = elements.map(el => el.offsetWidth);
elements.forEach((el, i) => {
  el.style.width = widths[i] + 10 + 'px';
});
```

---

## 📖 参考资源

- [MDN - DOM](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)
- [DOM Living Standard](https://dom.spec.whatwg.org/)
- [JavaScript.info - DOM](https://zh.javascript.info/dom-nodes)

---

#javascript #dom #前端基础
