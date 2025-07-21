在 React 项目中，如果你要通过 **JSONP** 的方式避免跨域（尤其是在后端不支持 CORS 的老系统中），可以参考以下完整做法。

---

## 🧠 背景说明：为什么使用 JSONP？

浏览器的 **跨域限制（同源策略）** 会阻止你直接用 `fetch` 或 `axios` 请求跨域 API，但 `<script>` 标签没有跨域限制。

**JSONP 的原理就是动态插入 `<script>` 标签，利用 `script` 能跨域的特性加载远程返回的 JS 文件**，并在里面调用你页面上注册好的全局函数。

---

## ✅ React 中使用 JSONP 的方法

### ✅ 方法一：使用封装好的库（推荐）

可以使用 `jsonp` 库（轻量、好用）：

### 🔧 1. 安装 jsonp

```bash
npm install jsonp
```

---

### 🔧 2. 使用示例

```js
import jsonp from 'jsonp';

function getData() {
  jsonp('https://example.com/api/data?callback=callbackFn', null, (err, data) => {
    if (err) {
      console.error('JSONP 请求失败:', err);
    } else {
      console.log('JSONP 返回数据:', data);
    }
  });
}
```

✅ 在 React 中你可以放在 `useEffect`、点击事件中等任何地方使用。

---

### ✅ 方法二：手动实现 JSONP（学习原理）

如果不想用第三方库，也可以自己实现：

```js
function jsonpRequest(url, callbackName) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const callbackFn = `jsonp_cb_${Date.now()}`;

    window[callbackFn] = (data) => {
      resolve(data);
      document.body.removeChild(script);
      delete window[callbackFn];
    };

    script.src = `${url}${url.includes('?') ? '&' : '?'}${callbackName}=${callbackFn}`;
    script.onerror = reject;

    document.body.appendChild(script);
  });
}

// 用法：
jsonpRequest('https://example.com/api/data', 'callback')
  .then((res) => {
    console.log('返回数据:', res);
  })
  .catch((err) => {
    console.error('JSONP 请求失败', err);
  });
```

---

## ⚠️ 使用 JSONP 的注意事项

|限制|描述|
|---|---|
|✅ 只能是 `GET` 请求|因为 `script` 标签无法发起 `POST` 等请求|
|✅ 服务器必须支持 JSONP|后端必须返回一段 JS，如：`callbackFn({ data })`|
|⚠️ 安全风险|不建议对不可信域名使用 JSONP，可能被注入恶意脚本|
|❌ 不支持复杂请求头、认证等|无法传 Token、Header 等，适用场景有限|

---

## ✅ React 项目中 JSONP 使用场景举例

- 请求旧系统、第三方广告接口、股票接口等（如新浪、百度金融 API）
    
- 你没法控制后端，又需要跨域获取数据
    
- 不适合用于登录、支付、权限等安全敏感数据
    

---

## ✅ 总结

| 做法               | 说明                           |
| ---------------- | ---------------------------- |
| 使用 `jsonp` 库     | 推荐、最简单                       |
| 自己动态插 `<script>` | 可学原理，但不推荐重复造轮子               |
| React 中使用方式      | 在 `useEffect`、点击事件、请求封装中都可调用 |
