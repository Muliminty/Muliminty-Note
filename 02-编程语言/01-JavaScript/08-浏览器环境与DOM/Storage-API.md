# Storage API

> Storage API 提供了浏览器本地存储能力，包括 localStorage 和 sessionStorage，用于在客户端持久化数据。
> 
> **参考规范**：[Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html)

---

## 📚 目录

- [1. Storage 概述](#1-storage-概述)
- [2. localStorage](#2-localstorage)
- [3. sessionStorage](#3-sessionstorage)
- [4. Storage 事件](#4-storage-事件)
- [5. 存储限制](#5-存储限制)
- [6. 最佳实践](#6-最佳实践)
- [7. 封装工具](#7-封装工具)

---

## 1. Storage 概述

### 1.1 存储类型

浏览器提供了两种存储机制：

- **localStorage**：持久化存储，数据在浏览器关闭后仍然保留
- **sessionStorage**：会话存储，数据在标签页关闭后清除

### 1.2 共同特性

两种存储都：
- 只能存储字符串
- 同源策略限制（协议、域名、端口相同）
- 提供相同的 API
- 存储大小限制（通常 5-10MB）

---

## 2. localStorage

### 2.1 基本操作

```javascript
// 设置数据
localStorage.setItem('key', 'value');
localStorage.setItem('user', JSON.stringify({ name: 'John', age: 30 }));

// 获取数据
const value = localStorage.getItem('key');
const user = JSON.parse(localStorage.getItem('user'));

// 删除数据
localStorage.removeItem('key');

// 清空所有数据
localStorage.clear();

// 获取键名
const key = localStorage.key(0);  // 获取第 0 个键名

// 获取长度
const length = localStorage.length;
```

### 2.2 遍历数据

```javascript
// 方式 1：使用 for 循环
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(key, value);
}

// 方式 2：使用 Object.keys
Object.keys(localStorage).forEach(key => {
  const value = localStorage.getItem(key);
  console.log(key, value);
});

// 方式 3：使用 for...in（不推荐，可能包含其他属性）
for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    const value = localStorage.getItem(key);
    console.log(key, value);
  }
}
```

### 2.3 检查支持

```javascript
// 检查 localStorage 是否支持
function isLocalStorageSupported() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// 使用
if (isLocalStorageSupported()) {
  localStorage.setItem('key', 'value');
} else {
  console.warn('localStorage is not supported');
}
```

### 2.4 存储对象和数组

```javascript
// 存储对象
const user = { name: 'John', age: 30 };
localStorage.setItem('user', JSON.stringify(user));

// 读取对象
const storedUser = JSON.parse(localStorage.getItem('user'));

// 存储数组
const items = [1, 2, 3, 4, 5];
localStorage.setItem('items', JSON.stringify(items));

// 读取数组
const storedItems = JSON.parse(localStorage.getItem('items'));
```

---

## 3. sessionStorage

### 3.1 基本操作

```javascript
// sessionStorage 的 API 与 localStorage 完全相同
sessionStorage.setItem('key', 'value');
const value = sessionStorage.getItem('key');
sessionStorage.removeItem('key');
sessionStorage.clear();
```

### 3.2 与 localStorage 的区别

| 特性 | localStorage | sessionStorage |
|------|-------------|----------------|
| 生命周期 | 永久（除非手动清除） | 标签页关闭时清除 |
| 作用域 | 同源的所有标签页共享 | 仅当前标签页 |
| 使用场景 | 持久化数据 | 临时数据 |

```javascript
// localStorage：所有标签页共享
localStorage.setItem('shared', 'value');
// 在其他标签页也能访问

// sessionStorage：仅当前标签页
sessionStorage.setItem('private', 'value');
// 其他标签页无法访问
```

---

## 4. Storage 事件

### 4.1 监听存储变化

```javascript
// 监听 storage 事件（localStorage 和 sessionStorage 都触发）
window.addEventListener('storage', function(event) {
  console.log('Storage changed');
  console.log('Key:', event.key);
  console.log('Old value:', event.oldValue);
  console.log('New value:', event.newValue);
  console.log('Storage area:', event.storageArea);
  console.log('URL:', event.url);
});

// ⚠️ 注意：storage 事件只在其他标签页/窗口触发，不在当前标签页触发
```

### 4.2 自定义存储事件

```javascript
// 在当前标签页监听，需要自定义事件
class StorageObserver {
  constructor() {
    this.originalSetItem = Storage.prototype.setItem;
    this.originalRemoveItem = Storage.prototype.removeItem;
    this.originalClear = Storage.prototype.clear;
    
    this.setupProxy();
  }
  
  setupProxy() {
    const self = this;
    
    Storage.prototype.setItem = function(key, value) {
      const oldValue = this.getItem(key);
      self.originalSetItem.call(this, key, value);
      
      // 触发自定义事件
      window.dispatchEvent(new CustomEvent('storageChange', {
        detail: {
          key,
          oldValue,
          newValue: value,
          storageArea: this
        }
      }));
    };
    
    Storage.prototype.removeItem = function(key) {
      const oldValue = this.getItem(key);
      self.originalRemoveItem.call(this, key);
      
      window.dispatchEvent(new CustomEvent('storageChange', {
        detail: {
          key,
          oldValue,
          newValue: null,
          storageArea: this
        }
      }));
    };
    
    Storage.prototype.clear = function() {
      self.originalClear.call(this);
      
      window.dispatchEvent(new CustomEvent('storageChange', {
        detail: {
          key: null,
          oldValue: null,
          newValue: null,
          storageArea: this
        }
      }));
    };
  }
}

// 使用
new StorageObserver();

window.addEventListener('storageChange', function(event) {
  console.log('Storage changed in current tab:', event.detail);
});
```

---

## 5. 存储限制

### 5.1 存储大小

```javascript
// 检查存储使用量
function getStorageSize(storage) {
  let total = 0;
  for (let key in storage) {
    if (storage.hasOwnProperty(key)) {
      total += storage[key].length + key.length;
    }
  }
  return total;
}

// 获取大小（字节）
const localStorageSize = getStorageSize(localStorage);
console.log('localStorage size:', localStorageSize, 'bytes');

// 估算可用空间
function estimateStorageQuota() {
  return new Promise((resolve) => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        console.log('Quota:', estimate.quota);
        console.log('Usage:', estimate.usage);
        resolve(estimate);
      });
    } else {
      resolve(null);
    }
  });
}
```

### 5.2 处理存储错误

```javascript
// 捕获存储错误（如超出配额）
function setItemSafe(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded');
      // 清理旧数据或提示用户
    } else {
      console.error('Storage error:', e);
    }
    return false;
  }
}
```

---

## 6. 最佳实践

### 6.1 数据序列化

```javascript
// ✅ 好：使用 JSON 序列化复杂数据
localStorage.setItem('user', JSON.stringify({ name: 'John' }));

// ❌ 不好：直接存储对象
// localStorage.setItem('user', { name: 'John' });  // 会变成 "[object Object]"
```

### 6.2 数据验证

```javascript
function getItemWithDefault(key, defaultValue) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) {
      return defaultValue;
    }
    return JSON.parse(value);
  } catch (e) {
    console.error('Error parsing stored value:', e);
    return defaultValue;
  }
}

// 使用
const user = getItemWithDefault('user', { name: 'Guest' });
```

### 6.3 数据过期

```javascript
function setItemWithExpiry(key, value, expiryMinutes) {
  const item = {
    value: value,
    expiry: Date.now() + expiryMinutes * 60 * 1000
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getItemWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  
  try {
    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch (e) {
    return null;
  }
}

// 使用
setItemWithExpiry('token', 'abc123', 60);  // 60 分钟后过期
const token = getItemWithExpiry('token');
```

---

## 7. 封装工具

### 7.1 Storage 工具类

```javascript
class StorageUtil {
  constructor(storage = localStorage) {
    this.storage = storage;
  }
  
  set(key, value, expiryMinutes = null) {
    try {
      const item = {
        value: value,
        timestamp: Date.now()
      };
      
      if (expiryMinutes) {
        item.expiry = Date.now() + expiryMinutes * 60 * 1000;
      }
      
      this.storage.setItem(key, JSON.stringify(item));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  }
  
  get(key, defaultValue = null) {
    try {
      const itemStr = this.storage.getItem(key);
      if (!itemStr) {
        return defaultValue;
      }
      
      const item = JSON.parse(itemStr);
      
      // 检查过期
      if (item.expiry && Date.now() > item.expiry) {
        this.remove(key);
        return defaultValue;
      }
      
      return item.value;
    } catch (e) {
      console.error('Storage get error:', e);
      return defaultValue;
    }
  }
  
  remove(key) {
    this.storage.removeItem(key);
  }
  
  clear() {
    this.storage.clear();
  }
  
  has(key) {
    return this.storage.getItem(key) !== null;
  }
  
  keys() {
    return Object.keys(this.storage);
  }
  
  size() {
    let total = 0;
    for (let key in this.storage) {
      if (this.storage.hasOwnProperty(key)) {
        total += this.storage[key].length + key.length;
      }
    }
    return total;
  }
}

// 使用
const storage = new StorageUtil(localStorage);
storage.set('user', { name: 'John' }, 60);  // 60 分钟过期
const user = storage.get('user');
```

### 7.2 命名空间工具

```javascript
class NamespacedStorage {
  constructor(namespace, storage = localStorage) {
    this.namespace = namespace + ':';
    this.storage = storage;
  }
  
  _getKey(key) {
    return this.namespace + key;
  }
  
  set(key, value) {
    this.storage.setItem(this._getKey(key), JSON.stringify(value));
  }
  
  get(key, defaultValue = null) {
    const value = this.storage.getItem(this._getKey(key));
    return value ? JSON.parse(value) : defaultValue;
  }
  
  remove(key) {
    this.storage.removeItem(this._getKey(key));
  }
  
  clear() {
    const keys = Object.keys(this.storage);
    keys.forEach(key => {
      if (key.startsWith(this.namespace)) {
        this.storage.removeItem(key);
      }
    });
  }
  
  getAll() {
    const result = {};
    const keys = Object.keys(this.storage);
    keys.forEach(key => {
      if (key.startsWith(this.namespace)) {
        const actualKey = key.substring(this.namespace.length);
        result[actualKey] = JSON.parse(this.storage.getItem(key));
      }
    });
    return result;
  }
}

// 使用
const userStorage = new NamespacedStorage('user', localStorage);
userStorage.set('name', 'John');
userStorage.set('age', 30);
const all = userStorage.getAll();  // { name: 'John', age: 30 }
```

---

## 📖 参考资源

- [MDN - Web Storage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API)
- [MDN - Window.localStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)
- [MDN - Window.sessionStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage)

---

#javascript #storage #localstorage #sessionstorage #前端基础
