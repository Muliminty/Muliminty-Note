# BOM（Browser Object Model）

> BOM（浏览器对象模型）提供了与浏览器窗口交互的 API，包括 window、location、navigator、history、screen 等对象。
> 
> **参考规范**：[HTML Living Standard](https://html.spec.whatwg.org/)

---

## 📚 目录

- [1. Window 对象](#1-window-对象)
- [2. Location 对象](#2-location-对象)
- [3. Navigator 对象](#3-navigator-对象)
- [4. History 对象](#4-history-对象)
- [5. Screen 对象](#5-screen-对象)
- [6. 对话框](#6-对话框)
- [7. 定时器](#7-定时器)

---

## 1. Window 对象

### 1.1 Window 概述

**Window** 是浏览器窗口的全局对象，代表浏览器窗口本身。

```javascript
// window 是全局对象
window === this;  // 在全局作用域中为 true

// 全局变量实际上是 window 的属性
var globalVar = 'test';
window.globalVar;  // "test"

// 全局函数是 window 的方法
function globalFunc() {}
window.globalFunc === globalFunc;  // true
```

### 1.2 窗口尺寸

```javascript
// 视口尺寸（不包括滚动条）
window.innerWidth;   // 视口宽度
window.innerHeight;  // 视口高度

// 窗口尺寸（包括滚动条和边框）
window.outerWidth;   // 窗口总宽度
window.outerHeight;  // 窗口总高度

// 屏幕尺寸
window.screen.width;   // 屏幕宽度
window.screen.height;  // 屏幕高度
```

### 1.3 窗口位置

```javascript
// 窗口相对于屏幕的位置
window.screenX;  // 窗口左边界到屏幕左边的距离
window.screenY;  // 窗口上边界到屏幕上边的距离

// 滚动位置
window.scrollX;  // 水平滚动距离（pageXOffset 的别名）
window.scrollY;  // 垂直滚动距离（pageYOffset 的别名）

// 滚动到指定位置
window.scrollTo(0, 100);
window.scrollTo({ top: 100, left: 0, behavior: 'smooth' });

// 滚动相对距离
window.scrollBy(0, 100);
window.scrollBy({ top: 100, behavior: 'smooth' });
```

### 1.4 窗口操作

```javascript
// 打开新窗口
const newWindow = window.open('https://example.com', '_blank', 'width=800,height=600');

// 关闭窗口
window.close();

// 调整窗口大小
window.resizeTo(800, 600);
window.resizeBy(100, 100);

// 移动窗口
window.moveTo(100, 100);
window.moveBy(50, 50);

// 聚焦窗口
window.focus();
window.blur();
```

### 1.5 页面加载事件

```javascript
// DOMContentLoaded - DOM 加载完成（推荐）
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded');
});

// load - 所有资源加载完成
window.addEventListener('load', function() {
  console.log('All resources loaded');
});

// beforeunload - 页面卸载前
window.addEventListener('beforeunload', function(event) {
  event.preventDefault();
  event.returnValue = '';  // Chrome 需要
  return '';  // 其他浏览器
});

// unload - 页面卸载
window.addEventListener('unload', function() {
  console.log('Page unloading');
});
```

---

## 2. Location 对象

### 2.1 Location 概述

**Location** 对象包含当前页面的 URL 信息。

```javascript
// location 是 window.location 的简写
location === window.location;  // true

// 当前 URL
console.log(location.href);
// "https://example.com:8080/path/to/page?query=value#hash"
```

### 2.2 URL 组成部分

```javascript
location.protocol;  // "https:"
location.host;      // "example.com:8080"
location.hostname;  // "example.com"
location.port;      // "8080"
location.pathname;  // "/path/to/page"
location.search;    // "?query=value"
location.hash;      // "#hash"
location.origin;    // "https://example.com:8080"
```

### 2.3 导航操作

```javascript
// 跳转到新页面
location.href = 'https://example.com';
location.assign('https://example.com');

// 替换当前页面（不保留历史记录）
location.replace('https://example.com');

// 重新加载页面
location.reload();           // 可能从缓存加载
location.reload(true);       // 强制从服务器加载
```

### 2.4 URL 参数操作

```javascript
// 获取查询参数
const urlParams = new URLSearchParams(location.search);
const value = urlParams.get('query');        // 获取单个参数
const all = urlParams.getAll('query');       // 获取所有同名参数
const has = urlParams.has('query');          // 检查参数是否存在

// 遍历参数
urlParams.forEach((value, key) => {
  console.log(key, value);
});

// 设置参数
urlParams.set('newParam', 'newValue');
urlParams.append('another', 'value');
urlParams.delete('oldParam');

// 更新 URL（不刷新页面）
const newUrl = location.pathname + '?' + urlParams.toString();
history.pushState({}, '', newUrl);
```

---

## 3. Navigator 对象

### 3.1 Navigator 概述

**Navigator** 对象包含浏览器的信息。

```javascript
// navigator 是 window.navigator 的简写
navigator === window.navigator;  // true
```

### 3.2 浏览器信息

```javascript
// 用户代理字符串
navigator.userAgent;
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ..."

// 浏览器名称（不可靠）
navigator.appName;   // "Netscape"（所有现代浏览器都返回这个）

// 浏览器版本（不可靠）
navigator.appVersion;

// 平台信息
navigator.platform;  // "Win32", "MacIntel", "Linux x86_64"

// 语言
navigator.language;        // "zh-CN"（首选语言）
navigator.languages;        // ["zh-CN", "en-US", ...]（所有语言）
```

### 3.3 功能检测

```javascript
// 检测功能支持（推荐方式）
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(/* ... */);
}

// 检测 Cookie 支持
navigator.cookieEnabled;  // true/false

// 检测在线状态
navigator.onLine;  // true/false

// 监听在线状态变化
window.addEventListener('online', () => {
  console.log('Online');
});
window.addEventListener('offline', () => {
  console.log('Offline');
});
```

### 3.4 设备信息

```javascript
// 硬件并发数（CPU 核心数）
navigator.hardwareConcurrency;  // 8

// 设备内存（Chrome 特有）
navigator.deviceMemory;  // 8（GB）

// 最大触摸点数
navigator.maxTouchPoints;  // 0（非触摸设备）或 5+

// 电池 API（实验性）
navigator.getBattery().then(battery => {
  console.log('Battery level:', battery.level);
  console.log('Charging:', battery.charging);
});
```

### 3.5 地理位置

```javascript
// 获取当前位置
navigator.geolocation.getCurrentPosition(
  function(position) {
    console.log('Latitude:', position.coords.latitude);
    console.log('Longitude:', position.coords.longitude);
  },
  function(error) {
    console.error('Error:', error.message);
  },
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }
);

// 监听位置变化
const watchId = navigator.geolocation.watchPosition(
  function(position) {
    console.log('Position:', position.coords);
  }
);

// 停止监听
navigator.geolocation.clearWatch(watchId);
```

### 3.6 剪贴板 API

```javascript
// 读取剪贴板
navigator.clipboard.readText().then(text => {
  console.log('Clipboard text:', text);
});

// 写入剪贴板
navigator.clipboard.writeText('Hello World').then(() => {
  console.log('Text copied');
});

// 读取剪贴板图片
navigator.clipboard.read().then(clipboardItems => {
  for (let item of clipboardItems) {
    if (item.types.includes('image/png')) {
      item.getType('image/png').then(blob => {
        // 处理图片
      });
    }
  }
});
```

---

## 4. History 对象

### 4.1 History 概述

**History** 对象提供浏览器历史记录的访问和操作。

```javascript
// history 是 window.history 的简写
history === window.history;  // true
```

### 4.2 历史记录导航

```javascript
// 前进
history.forward();

// 后退
history.back();

// 前进/后退指定步数
history.go(1);   // 前进 1 页
history.go(-1);  // 后退 1 页
history.go(0);   // 刷新当前页
```

### 4.3 History API（现代方法）

```javascript
// pushState - 添加历史记录（不刷新页面）
history.pushState({ page: 1 }, 'Title', '/page1');

// replaceState - 替换当前历史记录（不刷新页面）
history.replaceState({ page: 2 }, 'Title', '/page2');

// state - 获取当前状态
const state = history.state;

// 监听 popstate 事件（浏览器前进/后退时触发）
window.addEventListener('popstate', function(event) {
  console.log('State:', event.state);
  console.log('Location:', location.href);
});
```

### 4.4 历史记录长度

```javascript
// 历史记录数量
history.length;  // 当前会话的历史记录数量
```

---

## 5. Screen 对象

### 5.1 Screen 概述

**Screen** 对象包含屏幕显示的信息。

```javascript
// screen 是 window.screen 的简写
screen === window.screen;  // true
```

### 5.2 屏幕尺寸

```javascript
// 屏幕尺寸
screen.width;   // 屏幕总宽度
screen.height;  // 屏幕总高度

// 可用区域尺寸（排除任务栏等）
screen.availWidth;   // 可用宽度
screen.availHeight;  // 可用高度

// 颜色深度
screen.colorDepth;   // 24（位）
screen.pixelDepth;   // 24（位）
```

### 5.3 屏幕方向

```javascript
// 屏幕方向（移动设备）
screen.orientation;  // ScreenOrientation 对象

// 角度
screen.orientation.angle;  // 0, 90, 180, 270

// 类型
screen.orientation.type;  // "portrait-primary", "landscape-primary"

// 监听方向变化
screen.orientation.addEventListener('change', () => {
  console.log('Orientation changed:', screen.orientation.angle);
});
```

---

## 6. 对话框

### 6.1 警告框

```javascript
// alert - 警告框
alert('This is an alert');

// confirm - 确认框
const result = confirm('Are you sure?');
if (result) {
  console.log('User confirmed');
}

// prompt - 输入框
const input = prompt('Enter your name:', 'Default');
if (input !== null) {
  console.log('User entered:', input);
}
```

### 6.2 打印对话框

```javascript
// 打开打印对话框
window.print();
```

---

## 7. 定时器

### 7.1 setTimeout

```javascript
// setTimeout - 延迟执行
const timeoutId = setTimeout(function() {
  console.log('Delayed execution');
}, 1000);  // 1 秒后执行

// 清除定时器
clearTimeout(timeoutId);

// 传递参数
setTimeout(function(message) {
  console.log(message);
}, 1000, 'Hello');
```

### 7.2 setInterval

```javascript
// setInterval - 间隔执行
const intervalId = setInterval(function() {
  console.log('Repeated execution');
}, 1000);  // 每 1 秒执行一次

// 清除定时器
clearInterval(intervalId);
```

### 7.3 requestAnimationFrame

```javascript
// requestAnimationFrame - 动画帧（推荐用于动画）
let animationId;

function animate() {
  // 动画逻辑
  console.log('Animation frame');
  
  animationId = requestAnimationFrame(animate);
}

// 开始动画
animationId = requestAnimationFrame(animate);

// 停止动画
cancelAnimationFrame(animationId);
```

### 7.4 定时器注意事项

```javascript
// ⚠️ 定时器延迟不精确
// 最小延迟通常是 4ms（HTML5 规范）
setTimeout(() => console.log('Delayed'), 0);

// ⚠️ 页面不可见时，定时器可能被节流
// 标签页隐藏时，setInterval 可能被限制为每秒最多执行一次

// ✅ 使用 requestAnimationFrame 进行动画
// ✅ 使用 Web Workers 进行长时间计算
```

---

## 📖 参考资源

- [MDN - Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)
- [MDN - Location](https://developer.mozilla.org/zh-CN/docs/Web/API/Location)
- [MDN - Navigator](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator)
- [MDN - History API](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)

---

#javascript #bom #浏览器api #前端基础
