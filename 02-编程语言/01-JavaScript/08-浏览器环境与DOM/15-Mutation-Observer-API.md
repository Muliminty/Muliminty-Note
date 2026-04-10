---
title: "Mutation Observer API"
date: "2026-04-10"
lastModified: "2026-04-10"
tags: ["javascript", "mutation-observer", "dom", "前端基础"]
moc: "[[!MOC-JavaScript]]"
description: "Mutation Observer API 提供了观察 DOM 树变化的能力，当 DOM 发生变化时异步触发回调，是 Mutation Events 的现代替代方案。"
publish: true
toc: true
---

# Mutation Observer API

> Mutation Observer API 提供了观察 DOM 树变化的能力，当 DOM 发生变化时异步触发回调，是 Mutation Events 的现代替代方案。
> 
> **参考规范**：[DOM Mutation Observers](https://dom.spec.whatwg.org/#mutation-observers)

---

## 📚 目录

- [1. Mutation Observer 概述](#1-mutation-observer-概述)
- [2. 基本用法](#2-基本用法)
- [3. 配置选项](#3-配置选项)
- [4. 实际应用](#4-实际应用)
- [5. 性能考虑](#5-性能考虑)

---

## 1. Mutation Observer 概述

### 1.1 什么是 Mutation Observer

**Mutation Observer** 用于观察 DOM 树的变化，包括：
- 子节点的添加、删除、移动
- 属性的添加、删除、修改
- 文本内容的变化

**优势**：
- 性能更好（比 Mutation Events 更高效）
- 异步执行（批量处理变化）
- 更灵活（可配置观察类型）

### 1.2 浏览器支持

```javascript
// 检查支持
if ('MutationObserver' in window) {
  // 支持 Mutation Observer
} else {
  // 需要 polyfill 或降级方案
}
```

---

## 2. 基本用法

### 2.1 创建 Observer

```javascript
// 创建 Mutation Observer
const observer = new MutationObserver((mutations, observer) => {
  mutations.forEach(mutation => {
    console.log('DOM changed:', mutation);
  });
});

// 开始观察
const target = document.querySelector('.target');
observer.observe(target, {
  childList: true,        // 观察子节点变化
  attributes: true,       // 观察属性变化
  characterData: true,    // 观察文本内容变化
  subtree: true          // 观察所有后代节点
});
```

### 2.2 回调函数

```javascript
const observer = new MutationObserver((mutations, observer) => {
  // mutations - MutationRecord 数组
  // observer - MutationObserver 实例
  
  mutations.forEach(mutation => {
    // mutation.type - 变化类型
    // mutation.target - 变化的节点
    // mutation.addedNodes - 添加的节点
    // mutation.removedNodes - 删除的节点
    // mutation.attributeName - 变化的属性名
    // mutation.oldValue - 旧值
  });
});
```

### 2.3 停止观察

```javascript
const observer = new MutationObserver(callback);
const target = document.querySelector('.target');

// 开始观察
observer.observe(target, options);

// 停止观察
observer.disconnect();

// 获取已记录的变更（在 disconnect 前）
const records = observer.takeRecords();
```

---

## 3. 配置选项

### 3.1 childList

```javascript
// childList: true - 观察子节点的添加和删除
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      console.log('Added nodes:', mutation.addedNodes);
      console.log('Removed nodes:', mutation.removedNodes);
      console.log('Previous sibling:', mutation.previousSibling);
      console.log('Next sibling:', mutation.nextSibling);
    }
  });
});

observer.observe(target, {
  childList: true
});

// 示例
target.appendChild(document.createElement('div'));  // 触发
target.removeChild(target.firstChild);              // 触发
```

### 3.2 attributes

```javascript
// attributes: true - 观察属性变化
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'attributes') {
      console.log('Attribute:', mutation.attributeName);
      console.log('Old value:', mutation.oldValue);
      console.log('New value:', mutation.target.getAttribute(mutation.attributeName));
    }
  });
});

observer.observe(target, {
  attributes: true,
  attributeOldValue: true,  // 记录旧值
  attributeFilter: ['class', 'id']  // 只观察特定属性
});

// 示例
target.setAttribute('class', 'new-class');  // 触发
target.id = 'new-id';                       // 触发
```

### 3.3 characterData

```javascript
// characterData: true - 观察文本节点内容变化
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'characterData') {
      console.log('Text changed:', mutation.target.textContent);
      console.log('Old value:', mutation.oldValue);
    }
  });
});

const textNode = target.firstChild;  // 文本节点
observer.observe(textNode, {
  characterData: true,
  characterDataOldValue: true  // 记录旧值
});

// 示例
textNode.textContent = 'New text';  // 触发
```

### 3.4 subtree

```javascript
// subtree: true - 观察所有后代节点
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    console.log('Changed node:', mutation.target);
  });
});

observer.observe(target, {
  childList: true,
  subtree: true  // 观察所有后代
});

// 示例
target.querySelector('.child').appendChild(document.createElement('div'));  // 触发
```

### 3.5 完整配置

```javascript
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    console.log('Mutation type:', mutation.type);
    console.log('Target:', mutation.target);
  });
});

observer.observe(target, {
  childList: true,              // 子节点变化
  attributes: true,             // 属性变化
  characterData: true,          // 文本内容变化
  subtree: true,                // 所有后代节点
  attributeOldValue: true,      // 记录属性旧值
  characterDataOldValue: true, // 记录文本旧值
  attributeFilter: ['class']    // 只观察 class 属性
});
```

---

## 4. 实际应用

### 4.1 动态内容监听

```javascript
// 监听动态添加的元素
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // 处理新添加的元素
        if (node.matches('.dynamic-item')) {
          initializeItem(node);
        }
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

function initializeItem(element) {
  // 初始化新元素
  console.log('New item added:', element);
}
```

### 4.2 属性变化监听

```javascript
// 监听 class 变化
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      const element = mutation.target;
      const oldClasses = mutation.oldValue;
      const newClasses = element.className;
      
      console.log('Class changed from', oldClasses, 'to', newClasses);
      
      // 根据 class 变化执行操作
      if (element.classList.contains('active')) {
        activateElement(element);
      } else {
        deactivateElement(element);
      }
    }
  });
});

observer.observe(target, {
  attributes: true,
  attributeOldValue: true,
  attributeFilter: ['class']
});
```

### 4.3 表单验证

```javascript
// 监听表单输入变化
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      // 检查是否有新的输入元素
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.matches('input')) {
          setupValidation(node);
        }
      });
    }
  });
});

observer.observe(form, {
  childList: true,
  subtree: true
});
```

### 4.4 第三方脚本检测

```javascript
// 检测第三方脚本添加的元素
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // 检测广告脚本
        if (node.matches('.ad, [data-ad]')) {
          console.warn('Ad detected:', node);
          handleAd(node);
        }
        
        // 检测跟踪脚本
        if (node.matches('script[src*="tracking"]')) {
          console.warn('Tracking script detected');
        }
      }
    });
  });
});

observer.observe(document.head, {
  childList: true,
  subtree: true
});
```

### 4.5 自动保存

```javascript
// 监听内容变化并自动保存
let saveTimer;
const observer = new MutationObserver((mutations) => {
  // 防抖保存
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveContent();
  }, 1000);
});

observer.observe(editor, {
  childList: true,
  characterData: true,
  subtree: true
});

function saveContent() {
  const content = editor.innerHTML;
  localStorage.setItem('draft', content);
  console.log('Auto-saved');
}
```

### 4.6 无限滚动检测

```javascript
// 检测新内容加载
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.matches('.item')) {
        // 新内容加载完成
        console.log('New item loaded:', node);
        animateIn(node);
      }
    });
  });
});

observer.observe(container, {
  childList: true,
  subtree: true
});
```

---

## 5. 性能考虑

### 5.1 合理使用 subtree

```javascript
// ⚠️ 注意：subtree: true 会观察所有后代节点，可能影响性能
const observer = new MutationObserver(callback);

// ✅ 好：只观察需要的部分
observer.observe(specificContainer, {
  childList: true,
  subtree: false  // 不观察后代
});

// ⚠️ 谨慎：观察整个文档
observer.observe(document.body, {
  childList: true,
  subtree: true  // 观察所有后代，可能影响性能
});
```

### 5.2 批量处理变化

```javascript
// ✅ 好：批量处理变化
const observer = new MutationObserver((mutations) => {
  // 收集所有变化
  const changes = {
    added: [],
    removed: [],
    attributes: []
  };
  
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      changes.added.push(...mutation.addedNodes);
      changes.removed.push(...mutation.removedNodes);
    } else if (mutation.type === 'attributes') {
      changes.attributes.push({
        element: mutation.target,
        attribute: mutation.attributeName
      });
    }
  });
  
  // 批量处理
  processChanges(changes);
});
```

### 5.3 及时停止观察

```javascript
const observer = new MutationObserver(callback);

// 开始观察
observer.observe(target, options);

// 处理完成后停止观察
function handleChanges() {
  // 处理逻辑
  processChanges();
  
  // 停止观察
  observer.disconnect();
}
```

### 5.4 使用 attributeFilter

```javascript
// ✅ 好：只观察需要的属性
observer.observe(target, {
  attributes: true,
  attributeFilter: ['class', 'data-state']  // 只观察这些属性
});

// ❌ 不好：观察所有属性
observer.observe(target, {
  attributes: true  // 观察所有属性，可能不必要
});
```

### 5.5 封装工具类

```javascript
class DOMWatcher {
  constructor(options = {}) {
    this.options = {
      childList: true,
      subtree: false,
      ...options
    };
    
    this.observer = new MutationObserver(
      this.handleMutations.bind(this)
    );
    
    this.callbacks = {
      added: [],
      removed: [],
      attributes: []
    };
  }
  
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }
  
  watch(element) {
    this.observer.observe(element, this.options);
  }
  
  stop() {
    this.observer.disconnect();
  }
  
  handleMutations(mutations) {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          this.callbacks.added.forEach(cb => cb(node, mutation));
        });
        mutation.removedNodes.forEach(node => {
          this.callbacks.removed.forEach(cb => cb(node, mutation));
        });
      } else if (mutation.type === 'attributes') {
        this.callbacks.attributes.forEach(cb => {
          cb(mutation.target, mutation.attributeName, mutation);
        });
      }
    });
  }
}

// 使用
const watcher = new DOMWatcher({ subtree: true });
watcher.on('added', (node) => {
  console.log('Node added:', node);
});
watcher.watch(document.body);
```

---

## 📖 参考资源

- [MDN - MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)
- [DOM Mutation Observers Specification](https://dom.spec.whatwg.org/#mutation-observers)
- [Google Developers - Mutation Observer](https://developers.google.com/web/updates/2012/02/Detect-DOM-changes-with-Mutation-Observers)

---

#javascript #mutation-observer #dom #前端基础
