# History API

> History API 提供了操作浏览器历史记录的能力，可以实现单页应用（SPA）的路由功能，无需刷新页面。
> 
> **参考规范**：[HTML History API](https://html.spec.whatwg.org/multipage/history.html)

---

## 📚 目录

- [1. History API 概述](#1-history-api-概述)
- [2. 基本方法](#2-基本方法)
- [3. pushState 和 replaceState](#3-pushstate-和-replacestate)
- [4. popstate 事件](#4-popstate-事件)
- [5. 路由实现](#5-路由实现)
- [6. 实际应用](#6-实际应用)

---

## 1. History API 概述

### 1.1 什么是 History API

**History API** 允许 JavaScript 访问和操作浏览器的历史记录栈，实现无刷新的页面导航。

**主要方法**：
- `history.pushState()` - 添加历史记录
- `history.replaceState()` - 替换当前历史记录
- `history.back()` / `history.forward()` / `history.go()` - 导航

### 1.2 浏览器支持

```javascript
// 检查支持
if (window.history && window.history.pushState) {
  // 支持 History API
} else {
  // 需要降级处理（使用 hash 路由）
}
```

---

## 2. 基本方法

### 2.1 导航方法

```javascript
// 后退
history.back();

// 前进
history.forward();

// 前进/后退指定步数
history.go(-1);  // 后退 1 页
history.go(1);   // 前进 1 页
history.go(0);   // 刷新当前页
history.go(-2);  // 后退 2 页
```

### 2.2 历史记录长度

```javascript
// 获取历史记录数量
const length = history.length;
console.log('History length:', length);
```

### 2.3 历史记录状态

```javascript
// 获取当前状态
const state = history.state;
console.log('Current state:', state);
```

---

## 3. pushState 和 replaceState

### 3.1 pushState

```javascript
// pushState - 添加新的历史记录（不刷新页面）
history.pushState(
  { page: 1 },           // state 对象
  'Page 1',              // title（大多数浏览器忽略）
  '/page1'               // URL（相对或绝对路径）
);

// 完整示例
history.pushState(
  {
    userId: 123,
    page: 'user-profile'
  },
  'User Profile',
  '/users/123'
);
```

**特点**：
- 不刷新页面
- 不触发 `popstate` 事件
- URL 改变，但页面不重新加载
- 可以存储状态数据

### 3.2 replaceState

```javascript
// replaceState - 替换当前历史记录（不刷新页面）
history.replaceState(
  { page: 2 },
  'Page 2',
  '/page2'
);

// 使用场景：重定向或更新当前页面状态
if (user.isLoggedIn) {
  history.replaceState({ page: 'dashboard' }, 'Dashboard', '/dashboard');
}
```

**与 pushState 的区别**：
- `pushState`：添加新记录（可以后退）
- `replaceState`：替换当前记录（无法后退到替换前的状态）

### 3.3 State 对象

```javascript
// state 可以是任何可序列化的对象
history.pushState({
  data: 'value',
  timestamp: Date.now(),
  user: { id: 1, name: 'John' }
}, 'Title', '/path');

// 获取 state
const state = history.state;
console.log(state.data);      // "value"
console.log(state.timestamp); // 时间戳
console.log(state.user);      // { id: 1, name: 'John' }

// ⚠️ 注意：state 对象有大小限制（通常 640KB）
```

### 3.4 URL 处理

```javascript
// 相对路径
history.pushState({}, '', '/about');
// URL 变为：https://example.com/about

// 绝对路径
history.pushState({}, '', 'https://example.com/about');
// URL 变为：https://example.com/about

// 查询参数
history.pushState({}, '', '/search?q=javascript');
// URL 变为：https://example.com/search?q=javascript

// Hash（不推荐，会与 hash 路由冲突）
history.pushState({}, '', '/page#section');
// URL 变为：https://example.com/page#section

// ⚠️ 注意：不能跨域
// history.pushState({}, '', 'https://other-domain.com');  // 错误
```

---

## 4. popstate 事件

### 4.1 监听 popstate

```javascript
// popstate 事件在用户点击前进/后退按钮时触发
window.addEventListener('popstate', function(event) {
  console.log('Location:', location.href);
  console.log('State:', event.state);
  
  // 根据 state 更新页面
  if (event.state) {
    renderPage(event.state);
  }
});

// ⚠️ 注意：pushState 和 replaceState 不会触发 popstate
// 只有用户操作（前进/后退）或调用 history.back() 等才会触发
```

### 4.2 处理状态

```javascript
// 路由处理示例
window.addEventListener('popstate', function(event) {
  const state = event.state || {};
  const path = location.pathname;
  
  // 根据路径渲染对应页面
  switch (path) {
    case '/':
      renderHome();
      break;
    case '/about':
      renderAbout();
      break;
    case '/users':
      renderUsers(state.userId);
      break;
    default:
      render404();
  }
});
```

---

## 5. 路由实现

### 5.1 简单路由

```javascript
class SimpleRouter {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.init();
  }
  
  init() {
    // 监听 popstate
    window.addEventListener('popstate', (event) => {
      this.handleRoute(location.pathname, event.state);
    });
    
    // 处理初始路由
    this.handleRoute(location.pathname, history.state);
  }
  
  route(path, handler) {
    this.routes[path] = handler;
  }
  
  navigate(path, state = {}) {
    history.pushState(state, '', path);
    this.handleRoute(path, state);
  }
  
  replace(path, state = {}) {
    history.replaceState(state, '', path);
    this.handleRoute(path, state);
  }
  
  handleRoute(path, state) {
    const handler = this.routes[path];
    if (handler) {
      handler(state);
      this.currentRoute = path;
    } else {
      console.warn('Route not found:', path);
    }
  }
  
  back() {
    history.back();
  }
  
  forward() {
    history.forward();
  }
}

// 使用
const router = new SimpleRouter();

router.route('/', () => {
  document.body.innerHTML = '<h1>Home</h1>';
});

router.route('/about', () => {
  document.body.innerHTML = '<h1>About</h1>';
});

router.route('/users/:id', (state) => {
  const userId = location.pathname.split('/')[2];
  document.body.innerHTML = `<h1>User ${userId}</h1>`;
});

// 导航
router.navigate('/about');
```

### 5.2 拦截链接点击

```javascript
// 拦截所有链接点击，使用 History API
document.addEventListener('click', function(event) {
  const link = event.target.closest('a');
  if (!link) return;
  
  const href = link.getAttribute('href');
  
  // 只处理同源链接
  if (href && href.startsWith('/') && !link.hasAttribute('target')) {
    event.preventDefault();
    
    // 使用 History API 导航
    history.pushState({}, '', href);
    
    // 触发路由处理
    handleRoute(href);
  }
});
```

### 5.3 完整路由实现

```javascript
class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.beforeEachHooks = [];
    this.afterEachHooks = [];
    this.init();
  }
  
  init() {
    // 监听 popstate
    window.addEventListener('popstate', (event) => {
      this.handleRoute(location.pathname, event.state);
    });
    
    // 拦截链接点击
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (link && this.isSameOrigin(link.href)) {
        event.preventDefault();
        this.push(link.pathname);
      }
    });
    
    // 初始路由
    this.handleRoute(location.pathname, history.state);
  }
  
  route(path, handler, meta = {}) {
    this.routes.push({ path, handler, meta });
  }
  
  beforeEach(guard) {
    this.beforeEachHooks.push(guard);
  }
  
  afterEach(hook) {
    this.afterEachHooks.push(hook);
  }
  
  async push(path, state = {}) {
    // 执行前置守卫
    for (const guard of this.beforeEachHooks) {
      const result = await guard(path, this.currentRoute);
      if (result === false) {
        return false;
      }
    }
    
    history.pushState(state, '', path);
    await this.handleRoute(path, state);
    return true;
  }
  
  replace(path, state = {}) {
    history.replaceState(state, '', path);
    this.handleRoute(path, state);
  }
  
  async handleRoute(path, state) {
    const route = this.findRoute(path);
    if (route) {
      this.currentRoute = route;
      await route.handler(state, route);
      
      // 执行后置钩子
      this.afterEachHooks.forEach(hook => hook(route));
    } else {
      console.warn('Route not found:', path);
    }
  }
  
  findRoute(path) {
    return this.routes.find(route => {
      // 简单匹配（可以扩展支持参数）
      return route.path === path || this.matchRoute(route.path, path);
    });
  }
  
  matchRoute(routePath, currentPath) {
    // 简单的参数匹配
    const routeParts = routePath.split('/');
    const pathParts = currentPath.split('/');
    
    if (routeParts.length !== pathParts.length) {
      return false;
    }
    
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        continue;  // 参数匹配
      }
      if (routeParts[i] !== pathParts[i]) {
        return false;
      }
    }
    
    return true;
  }
  
  isSameOrigin(url) {
    try {
      const linkUrl = new URL(url, location.href);
      return linkUrl.origin === location.origin;
    } catch {
      return false;
    }
  }
  
  back() {
    history.back();
  }
  
  forward() {
    history.forward();
  }
}

// 使用
const router = new Router();

router.beforeEach((to, from) => {
  console.log('Navigating from', from?.path, 'to', to);
  // 可以返回 false 阻止导航
});

router.route('/', (state) => {
  document.body.innerHTML = '<h1>Home</h1>';
}, { title: 'Home' });

router.route('/about', (state) => {
  document.body.innerHTML = '<h1>About</h1>';
}, { title: 'About' });
```

---

## 6. 实际应用

### 6.1 与 React Router 类似的功能

```javascript
// 简单的 React Router 风格 API
class ReactStyleRouter {
  constructor() {
    this.routes = [];
    this.init();
  }
  
  init() {
    window.addEventListener('popstate', () => {
      this.render();
    });
    
    this.render();
  }
  
  Route(path, component) {
    this.routes.push({ path, component });
  }
  
  Link({ to, children, ...props }) {
    const link = document.createElement('a');
    link.href = to;
    link.textContent = children;
    Object.assign(link, props);
    
    link.addEventListener('click', (e) => {
      e.preventDefault();
      this.push(to);
    });
    
    return link;
  }
  
  push(path) {
    history.pushState({}, '', path);
    this.render();
  }
  
  render() {
    const path = location.pathname;
    const route = this.routes.find(r => r.path === path);
    
    if (route) {
      const component = new route.component();
      document.body.innerHTML = '';
      document.body.appendChild(component.render());
    }
  }
}
```

### 6.2 滚动位置恢复

```javascript
// 保存和恢复滚动位置
const scrollPositions = {};

window.addEventListener('scroll', () => {
  scrollPositions[location.pathname] = {
    x: window.scrollX,
    y: window.scrollY
  };
});

window.addEventListener('popstate', () => {
  const pos = scrollPositions[location.pathname];
  if (pos) {
    window.scrollTo(pos.x, pos.y);
  } else {
    window.scrollTo(0, 0);
  }
});
```

### 6.3 页面过渡动画

```javascript
class RouterWithTransition {
  constructor() {
    this.currentPage = null;
    this.init();
  }
  
  init() {
    window.addEventListener('popstate', () => {
      this.transition(location.pathname);
    });
  }
  
  navigate(path) {
    history.pushState({}, '', path);
    this.transition(path);
  }
  
  transition(path) {
    // 淡出当前页面
    if (this.currentPage) {
      this.currentPage.style.opacity = '0';
      this.currentPage.style.transition = 'opacity 0.3s';
    }
    
    // 加载新页面
    setTimeout(() => {
      this.loadPage(path);
    }, 300);
  }
  
  loadPage(path) {
    // 加载页面内容
    fetch(`/pages${path}.html`)
      .then(response => response.text())
      .then(html => {
        const newPage = document.createElement('div');
        newPage.innerHTML = html;
        newPage.style.opacity = '0';
        
        document.body.appendChild(newPage);
        
        // 淡入新页面
        setTimeout(() => {
          if (this.currentPage) {
            this.currentPage.remove();
          }
          this.currentPage = newPage;
          newPage.style.transition = 'opacity 0.3s';
          newPage.style.opacity = '1';
        }, 50);
      });
  }
}
```

---

## 📖 参考资源

- [MDN - History API](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)
- [MDN - Window.history](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/history)
- [HTML History API Specification](https://html.spec.whatwg.org/multipage/history.html)

---

#javascript #history #路由 #spa #前端基础
