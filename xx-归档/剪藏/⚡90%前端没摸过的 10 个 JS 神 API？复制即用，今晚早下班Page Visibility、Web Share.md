
[⚡90%前端没摸过的 10 个 JS 神 API？复制即用，今晚早下班Page Visibility、Web Share - 掘金](https://juejin.cn/post/7537913159111983154)


> 每个 API 都附 **浏览器支持率** + **30 秒上手代码** + **真实业务场景**，复制即用，今晚下班早！

---

## 1 Page Visibility API —— 页面“隐身”探测

**支持率：** 97%（Chrome 13+、Edge 12+）  
**场景：** 用户切标签页时暂停视频、停止轮询

```
document.addEventListener('visibilitychange', () => {
  document.visibilityState === 'hidden'
    ? video.pause()
    : video.play();
});
```

---

## 2 Web Share API —— 一键唤起系统分享

**支持率：** 92%（需 HTTPS）  
**场景：** 把当前文章内容分享到微信、微博

```
if (navigator.share) {
  navigator.share({
    title: '我的新文章',
    text: '快来看看',
    url: location.href,
  });
}
```

---

## 3 Broadcast Channel —— 跨标签页通信

**支持率：** 94%（Chrome 54+）  
**场景：** A 标签页登录，B 标签页自动刷新

```
const bc = new BroadcastChannel('login');
bc.postMessage({ token: 'abc123' });
bc.onmessage = (e) => console.log(e.data);
```

---

## 4 Intl.NumberFormat —— 一键千分位

**支持率：** 100%  
**场景：** 价格、股票、报表格式化

```
new Intl.NumberFormat('zh-CN').format(1234567); // 1,234,567
```

---

## 5 IntersectionObserver —— 懒加载 + 曝光埋点

**支持率：** 97%（Chrome 51+）  
**场景：** 图片懒加载、广告曝光统计

```
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => e.isIntersecting && loadImg(e.target));
});
io.observe(img);
```

---

## 6 ResizeObserver —— 元素级尺寸监听

**支持率：** 94%（Chrome 64+）  
**场景：** 响应式图表、虚拟滚动

```
const ro = new ResizeObserver((entries) => {
  entries.forEach((e) => console.log('尺寸变化', e.contentRect));
});
ro.observe(chartContainer);
```

---

## 7 Clipboard API —— 无依赖复制

**支持率：** 95%（需 HTTPS）  
**场景：** 一键复制邀请码、优惠券码

```
await navigator.clipboard.writeText('COUPON2025');
```

---

## 8 URLSearchParams —— 再也不用正则解析 query

**支持率：** 100%  
**场景：** 路由、埋点、搜索参数

```
const params = new URLSearchParams(location.search);
params.get('id'); // ?id=123
```

---

## 9 AbortController —— 可取消的 fetch

**支持率：** 100%  
**场景：** 取消过期请求、防抖动

```
const controller = new AbortController();
fetch(url, { signal: controller.signal });
controller.abort(); // 立即中断
```

---

## 10 requestIdleCallback —— 主线程垃圾时间调度器

**支持率：** 95%（Chrome 47+、Edge 79+）  
**场景：** 埋点、预加载、长计算零阻塞

```
requestIdleCallback(() => {
  // 在主线程空闲时执行
});
```

---

## 一键速查表（面试背）

|API|一句话记忆|
|---|---|
|Page Visibility|页面隐藏时暂停|
|Web Share|一键系统分享|
|Broadcast Channel|跨标签页通信|
|Intl.NumberFormat|千分位/货币格式化|
|IntersectionObserver|懒加载+曝光|
|ResizeObserver|元素尺寸监听|
|Clipboard|无依赖复制|
|URLSearchParams|解析 query 神器|
|AbortController|可取消 fetch|
|requestIdleCallback|垃圾时间任务|

把这张表贴在工位，下次写功能先翻 3 秒，别再手写轮询 + 正则了！

本文收录于以下专栏

![cover](https://p3-juejin-sign.byteimg.com/tos-cn-i-k3u1fbpfcp/95414745836549ce9143753e2a30facd~tplv-k3u1fbpfcp-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgNDA05pif55CD55qE54yr:q75.awebp?rk3s=f64ab15b&x-expires=1763556138&x-signature=%2F8dktcPYVT%2BRlRYvDX%2FpquB9f5s%3D)

上一篇

React useMemo 深度指南：原理、误区、实战与 2025 最佳实践

下一篇

🔍Vue 隐藏神技巧：99% 开发者没用过，却能让代码简洁 50%