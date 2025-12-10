# Performance API

> Performance API 提供了测量和监控 Web 应用性能的能力，包括页面加载时间、资源加载时间、用户交互性能等。
> 
> **参考规范**：[Performance Timeline](https://w3c.github.io/perf-timing-primer/)

---

## 📚 目录

- [1. Performance API 概述](#1-performance-api-概述)
- [2. Performance Timeline](#2-performance-timeline)
- [3. Navigation Timing](#3-navigation-timing)
- [4. Resource Timing](#4-resource-timing)
- [5. User Timing](#5-user-timing)
- [6. Performance Observer](#6-performance-observer)
- [7. 实际应用](#7-实际应用)

---

## 1. Performance API 概述

### 1.1 什么是 Performance API

**Performance API** 提供了访问性能相关数据的能力，包括：
- 页面加载时间
- 资源加载时间
- 用户交互响应时间
- 内存使用情况

### 1.2 浏览器支持

```javascript
// 检查支持
if ('performance' in window) {
  // 支持 Performance API
} else {
  console.warn('Performance API not supported');
}
```

---

## 2. Performance Timeline

### 2.1 获取性能条目

```javascript
// 获取所有性能条目
const entries = performance.getEntries();

// 获取特定类型的条目
const navigationEntries = performance.getEntriesByType('navigation');
const resourceEntries = performance.getEntriesByType('resource');
const measureEntries = performance.getEntriesByType('measure');

// 获取特定名称的条目
const entries = performance.getEntriesByName('my-measure');
```

### 2.2 清除性能条目

```javascript
// 清除所有条目
performance.clearMarks();
performance.clearMeasures();
performance.clearResourceTimings();

// 清除特定类型的条目
performance.getEntriesByType('measure').forEach(entry => {
  performance.clearMarks(entry.name);
});
```

---

## 3. Navigation Timing

### 3.1 页面加载时间

```javascript
// 获取导航性能数据
const navigation = performance.getEntriesByType('navigation')[0];

// 关键时间点
console.log('DNS 查询:', navigation.domainLookupEnd - navigation.domainLookupStart);
console.log('TCP 连接:', navigation.connectEnd - navigation.connectStart);
console.log('请求响应:', navigation.responseEnd - navigation.requestStart);
console.log('DOM 解析:', navigation.domInteractive - navigation.domLoading);
console.log('资源加载:', navigation.loadEventEnd - navigation.domContentLoadedEventEnd);

// 总加载时间
console.log('总加载时间:', navigation.loadEventEnd - navigation.fetchStart);
```

### 3.2 关键指标

```javascript
function getPageLoadMetrics() {
  const navigation = performance.getEntriesByType('navigation')[0];
  
  return {
    // DNS 查询时间
    dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
    
    // TCP 连接时间
    tcpTime: navigation.connectEnd - navigation.connectStart,
    
    // SSL 握手时间（HTTPS）
    sslTime: navigation.connectEnd - navigation.secureConnectionStart,
    
    // 请求时间
    requestTime: navigation.responseEnd - navigation.requestStart,
    
    // 响应时间
    responseTime: navigation.responseEnd - navigation.responseStart,
    
    // DOM 解析时间
    domParseTime: navigation.domInteractive - navigation.domLoading,
    
    // DOMContentLoaded 时间
    domContentLoadedTime: navigation.domContentLoadedEventEnd - navigation.fetchStart,
    
    // 页面完全加载时间
    loadTime: navigation.loadEventEnd - navigation.fetchStart,
    
    // 首次渲染时间（FCP）
    firstPaint: performance.getEntriesByType('paint').find(
      entry => entry.name === 'first-contentful-paint'
    )?.startTime
  };
}

const metrics = getPageLoadMetrics();
console.log('Page Load Metrics:', metrics);
```

### 3.3 性能指标计算

```javascript
// 计算关键性能指标
function calculateWebVitals() {
  const navigation = performance.getEntriesByType('navigation')[0];
  
  // TTFB (Time to First Byte)
  const ttfb = navigation.responseStart - navigation.fetchStart;
  
  // FCP (First Contentful Paint)
  const fcp = performance.getEntriesByType('paint').find(
    entry => entry.name === 'first-contentful-paint'
  )?.startTime;
  
  // LCP (Largest Contentful Paint) - 需要 PerformanceObserver
  // DCL (DOMContentLoaded)
  const dcl = navigation.domContentLoadedEventEnd - navigation.fetchStart;
  
  // Load
  const load = navigation.loadEventEnd - navigation.fetchStart;
  
  return { ttfb, fcp, dcl, load };
}
```

---

## 4. Resource Timing

### 4.1 资源加载时间

```javascript
// 获取所有资源加载数据
const resources = performance.getEntriesByType('resource');

resources.forEach(resource => {
  console.log('Resource:', resource.name);
  console.log('Duration:', resource.duration);
  console.log('Size:', resource.transferSize);
  console.log('Type:', resource.initiatorType);
});
```

### 4.2 分析资源性能

```javascript
function analyzeResources() {
  const resources = performance.getEntriesByType('resource');
  
  const analysis = {
    total: resources.length,
    byType: {},
    slowest: [],
    largest: []
  };
  
  resources.forEach(resource => {
    // 按类型分类
    const type = resource.initiatorType;
    if (!analysis.byType[type]) {
      analysis.byType[type] = {
        count: 0,
        totalSize: 0,
        totalTime: 0
      };
    }
    analysis.byType[type].count++;
    analysis.byType[type].totalSize += resource.transferSize;
    analysis.byType[type].totalTime += resource.duration;
    
    // 找出最慢的资源
    analysis.slowest.push({
      name: resource.name,
      duration: resource.duration
    });
    
    // 找出最大的资源
    analysis.largest.push({
      name: resource.name,
      size: resource.transferSize
    });
  });
  
  // 排序
  analysis.slowest.sort((a, b) => b.duration - a.duration);
  analysis.largest.sort((a, b) => b.size - a.size);
  
  return analysis;
}

const analysis = analyzeResources();
console.log('Resource Analysis:', analysis);
```

### 4.3 资源加载优化

```javascript
// 找出加载慢的资源
function findSlowResources(threshold = 1000) {
  const resources = performance.getEntriesByType('resource');
  
  return resources
    .filter(resource => resource.duration > threshold)
    .map(resource => ({
      url: resource.name,
      duration: resource.duration,
      type: resource.initiatorType,
      size: resource.transferSize
    }))
    .sort((a, b) => b.duration - a.duration);
}

const slowResources = findSlowResources(1000);
console.log('Slow Resources:', slowResources);
```

---

## 5. User Timing

### 5.1 标记和测量

```javascript
// 标记时间点
performance.mark('start');
// ... 执行代码
performance.mark('end');

// 测量两个标记之间的时间
performance.measure('my-measure', 'start', 'end');

// 获取测量结果
const measure = performance.getEntriesByName('my-measure')[0];
console.log('Duration:', measure.duration);
```

### 5.2 性能测量工具

```javascript
class PerformanceTimer {
  constructor() {
    this.marks = {};
    this.measures = {};
  }
  
  start(label) {
    performance.mark(`${label}-start`);
    this.marks[label] = true;
  }
  
  end(label) {
    if (!this.marks[label]) {
      console.warn(`Mark "${label}" not started`);
      return;
    }
    
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    this.measures[label] = measure.duration;
    
    // 清理标记
    performance.clearMarks(`${label}-start`);
    performance.clearMarks(`${label}-end`);
    
    return measure.duration;
  }
  
  getMeasure(label) {
    return this.measures[label];
  }
  
  getAllMeasures() {
    return { ...this.measures };
  }
}

// 使用
const timer = new PerformanceTimer();

timer.start('data-fetch');
fetch('/api/data').then(() => {
  const duration = timer.end('data-fetch');
  console.log('Data fetch took:', duration, 'ms');
});
```

### 5.3 异步操作测量

```javascript
// 测量异步操作
async function measureAsyncOperation(operation) {
  performance.mark('async-start');
  
  try {
    const result = await operation();
    performance.mark('async-end');
    performance.measure('async-operation', 'async-start', 'async-end');
    
    const measure = performance.getEntriesByName('async-operation')[0];
    console.log('Operation took:', measure.duration, 'ms');
    
    return result;
  } finally {
    performance.clearMarks('async-start');
    performance.clearMarks('async-end');
  }
}

// 使用
measureAsyncOperation(async () => {
  await fetch('/api/data');
  await processData();
});
```

---

## 6. Performance Observer

### 6.1 监听性能条目

```javascript
// 创建 Performance Observer
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    console.log('Performance entry:', entry);
  });
});

// 观察特定类型
observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
```

### 6.2 监听 Web Vitals

```javascript
// 监听 LCP (Largest Contentful Paint)
const lcpObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  
  console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
});

lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

// 监听 FID (First Input Delay)
const fidObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    console.log('FID:', entry.processingStart - entry.startTime);
  });
});

fidObserver.observe({ entryTypes: ['first-input'] });

// 监听 CLS (Cumulative Layout Shift)
let clsValue = 0;
const clsObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
    }
  });
  
  console.log('CLS:', clsValue);
});

clsObserver.observe({ entryTypes: ['layout-shift'] });
```

### 6.3 监听长任务

```javascript
// 监听长任务（阻塞主线程超过 50ms 的任务）
const longTaskObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    console.warn('Long task detected:', entry.duration, 'ms');
    console.log('Start time:', entry.startTime);
    console.log('Attribution:', entry.attribution);
  });
});

longTaskObserver.observe({ entryTypes: ['longtask'] });
```

---

## 7. 实际应用

### 7.1 性能监控工具

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
    this.init();
  }
  
  init() {
    // 监听页面加载
    window.addEventListener('load', () => {
      this.collectPageMetrics();
    });
    
    // 监听资源加载
    this.setupResourceObserver();
    
    // 监听 Web Vitals
    this.setupWebVitalsObserver();
  }
  
  collectPageMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    this.metrics.pageLoad = {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      request: navigation.responseEnd - navigation.requestStart,
      domParse: navigation.domInteractive - navigation.domLoading,
      load: navigation.loadEventEnd - navigation.fetchStart
    };
    
    // 发送到服务器
    this.sendMetrics();
  }
  
  setupResourceObserver() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.duration > 1000) {
          console.warn('Slow resource:', entry.name, entry.duration);
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }
  
  setupWebVitalsObserver() {
    // LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // FID
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        this.metrics.fid = entry.processingStart - entry.startTime;
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    
    this.observers.push(lcpObserver, fidObserver);
  }
  
  sendMetrics() {
    // 发送性能数据到服务器
    fetch('/api/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.metrics)
    });
  }
  
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
  }
}

// 使用
const monitor = new PerformanceMonitor();
```

### 7.2 性能报告

```javascript
function generatePerformanceReport() {
  const report = {
    timestamp: Date.now(),
    navigation: {},
    resources: [],
    measures: []
  };
  
  // 导航数据
  const navigation = performance.getEntriesByType('navigation')[0];
  if (navigation) {
    report.navigation = {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      request: navigation.responseEnd - navigation.requestStart,
      domParse: navigation.domInteractive - navigation.domLoading,
      load: navigation.loadEventEnd - navigation.fetchStart
    };
  }
  
  // 资源数据
  const resources = performance.getEntriesByType('resource');
  report.resources = resources.map(resource => ({
    name: resource.name,
    duration: resource.duration,
    size: resource.transferSize,
    type: resource.initiatorType
  }));
  
  // 测量数据
  const measures = performance.getEntriesByType('measure');
  report.measures = measures.map(measure => ({
    name: measure.name,
    duration: measure.duration
  }));
  
  return report;
}

// 生成报告
const report = generatePerformanceReport();
console.log('Performance Report:', report);
```

---

## 📖 参考资源

- [MDN - Performance API](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance)
- [MDN - Performance Timeline API](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance_Timeline)
- [Web Vitals](https://web.dev/vitals/)

---

#javascript #performance #性能监控 #前端基础
