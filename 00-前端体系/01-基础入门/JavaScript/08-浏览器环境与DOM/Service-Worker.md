# Service Worker

> Service Worker 是浏览器在后台运行的脚本，可以拦截网络请求、缓存资源，实现离线功能和推送通知，是 PWA（Progressive Web App）的核心技术。
> 
> **参考规范**：[Service Workers](https://w3c.github.io/ServiceWorker/)

---

## 📚 目录

- [1. Service Worker 概述](#1-service-worker-概述)
- [2. 注册和安装](#2-注册和安装)
- [3. 生命周期](#3-生命周期)
- [4. 缓存策略](#4-缓存策略)
- [5. 网络拦截](#5-网络拦截)
- [6. 推送通知](#6-推送通知)
- [7. 实际应用](#7-实际应用)

---

## 1. Service Worker 概述

### 1.1 什么是 Service Worker

**Service Worker** 是运行在浏览器后台的脚本，独立于网页，可以：
- 拦截网络请求
- 缓存资源
- 实现离线功能
- 接收推送通知
- 后台同步

**特点**：
- 运行在独立线程
- 不能直接访问 DOM
- 必须通过 HTTPS（localhost 除外）
- 事件驱动

### 1.2 浏览器支持

```javascript
// 检查支持
if ('serviceWorker' in navigator) {
  // 支持 Service Worker
} else {
  console.warn('Service Worker not supported');
}
```

---

## 2. 注册和安装

### 2.1 注册 Service Worker

```javascript
// 注册 Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registered:', registration);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}
```

### 2.2 Service Worker 文件

```javascript
// sw.js
// 安装事件
self.addEventListener('install', event => {
  console.log('Service Worker installing');
  
  // 等待直到缓存完成
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js'
      ]);
    })
  );
});

// 激活事件
self.addEventListener('activate', event => {
  console.log('Service Worker activating');
  
  // 清理旧缓存
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== 'v1') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### 2.3 作用域

```javascript
// 注册时指定作用域
navigator.serviceWorker.register('/sw.js', {
  scope: '/app/'  // 只拦截 /app/ 下的请求
});

// ⚠️ 注意：作用域不能超过 Service Worker 文件所在目录
// /sw.js 的作用域最大是 /
```

---

## 3. 生命周期

### 3.1 生命周期阶段

```
注册 → 安装 → 激活 → 运行
  ↓      ↓      ↓      ↓
register install activate fetch
```

### 3.2 安装阶段

```javascript
self.addEventListener('install', event => {
  console.log('Installing Service Worker');
  
  // 跳过等待，立即激活
  self.skipWaiting();
  
  // 预缓存资源
  event.waitUntil(
    caches.open('static-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js'
      ]);
    })
  );
});
```

### 3.3 激活阶段

```javascript
self.addEventListener('activate', event => {
  console.log('Activating Service Worker');
  
  // 立即控制所有客户端
  event.waitUntil(
    clients.claim().then(() => {
      console.log('Service Worker is controlling clients');
    })
  );
  
  // 清理旧缓存
  event.waitUntil(cleanOldCaches());
});
```

### 3.4 更新 Service Worker

```javascript
// 主线程检查更新
navigator.serviceWorker.addEventListener('controllerchange', () => {
  console.log('New Service Worker controlling the page');
  window.location.reload();
});

// 手动更新
navigator.serviceWorker.ready.then(registration => {
  registration.update();
});
```

---

## 4. 缓存策略

### 4.1 Cache API

```javascript
// 打开缓存
caches.open('my-cache').then(cache => {
  // 添加单个资源
  cache.add('/image.jpg');
  
  // 添加多个资源
  cache.addAll([
    '/',
    '/index.html',
    '/styles.css'
  ]);
  
  // 添加响应
  cache.put('/api/data', response);
  
  // 匹配缓存
  cache.match('/image.jpg').then(response => {
    if (response) {
      console.log('Found in cache');
    }
  });
  
  // 删除缓存
  cache.delete('/image.jpg');
});
```

### 4.2 缓存策略

```javascript
// 1. Cache First（缓存优先）
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;  // 从缓存返回
      }
      return fetch(event.request);  // 网络请求
    })
  );
});

// 2. Network First（网络优先）
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);  // 网络失败时使用缓存
    })
  );
});

// 3. Stale While Revalidate（后台更新）
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        caches.open('v1').then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});
```

### 4.3 动态缓存

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).then(response => {
      // 克隆响应（响应流只能读取一次）
      const responseClone = response.clone();
      
      // 缓存响应
      caches.open('dynamic-v1').then(cache => {
        cache.put(event.request, responseClone);
      });
      
      return response;
    }).catch(() => {
      // 网络失败，尝试从缓存获取
      return caches.match(event.request);
    })
  );
});
```

---

## 5. 网络拦截

### 5.1 Fetch 事件

```javascript
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // 只处理 GET 请求
  if (request.method !== 'GET') {
    return;
  }
  
  // 只处理同源请求
  if (new URL(request.url).origin !== location.origin) {
    return;
  }
  
  // 拦截并处理请求
  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  // 尝试从缓存获取
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // 网络请求
  try {
    const response = await fetch(request);
    
    // 缓存响应
    const cache = await caches.open('v1');
    cache.put(request, response.clone());
    
    return response;
  } catch (error) {
    // 网络失败，返回离线页面
    return caches.match('/offline.html');
  }
}
```

### 5.2 请求修改

```javascript
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // 修改请求 URL
  if (url.pathname.startsWith('/api/')) {
    url.pathname = '/api/v2' + url.pathname;
    const modifiedRequest = new Request(url, event.request);
    event.respondWith(fetch(modifiedRequest));
  }
});
```

---

## 6. 推送通知

### 6.1 请求通知权限

```javascript
// 主线程
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    console.log('Notification permission granted');
  }
});
```

### 6.2 推送事件

```javascript
// sw.js
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'New Notification';
  const options = {
    body: data.body || 'You have a new message',
    icon: '/icon.png',
    badge: '/badge.png',
    tag: 'notification-tag',
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
```

### 6.3 通知点击

```javascript
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')  // 打开窗口
  );
});
```

---

## 7. 实际应用

### 7.1 离线应用

```javascript
// sw.js
const CACHE_NAME = 'offline-v1';
const OFFLINE_URL = '/offline.html';

// 安装时缓存离线页面
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([OFFLINE_URL]);
    })
  );
  self.skipWaiting();
});

// 拦截请求
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
```

### 7.2 后台同步

```javascript
// 主线程
navigator.serviceWorker.ready.then(registration => {
  return registration.sync.register('sync-data');
});

// sw.js
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // 同步数据到服务器
  const data = await getPendingData();
  await fetch('/api/sync', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
```

### 7.3 完整 PWA 示例

```javascript
// sw.js
const CACHE_NAME = 'pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json'
];

// 安装
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 激活
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 拦截请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200) {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
```

---

## 📖 参考资源

- [MDN - Service Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)
- [MDN - Using Service Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers)
- [Service Workers Specification](https://w3c.github.io/ServiceWorker/)

---

#javascript #service-worker #pwa #离线应用 #前端基础
