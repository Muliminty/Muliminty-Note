# 📘 H5 与原生 App 通信开发教程（Hybrid 通信闭环指南）

> 作者建议：本文档适用于正在开发或维护 **混合应用（Hybrid App）** 的项目，目标是快速上手 H5 与原生的双向通信流程并实现稳定对接。适配 iOS & Android 平台，支持生产落地。

---

## 一、🔍 什么是 Hybrid 通信？

Hybrid App 是使用 Web 技术开发前端界面（H5 页面），通过原生容器（App WebView）运行页面，并通过桥接通信与原生能力交互，如拍照、定位、扫码、支付等。

**核心就是通信机制：H5 ↔ 原生 App**

---

## 二、📦 混合通信架构设计

```
           ┌────────────────────┐
           │     原生 App       │
           │ (iOS / Android)    │
           └────────┬───────────┘
                    │
            JSBridge 注入 (App → H5)
                    │
      ┌─────────────▼─────────────┐
      │        WebView 容器        │
      │  加载 H5 页面（本地或远程） │
      └─────────────┬─────────────┘
                    │
         JSBridge 调用 (H5 → App)
                    │
              ┌─────▼─────┐
              │   H5 页面 │
              └───────────┘
```

---

## 三、🚀 快速开始：开发流程闭环

### 第 1 步：定义统一通信协议

通信使用 JSON 对象作为标准格式：

```json
{
  "method": "openCamera",
  "params": {
    "quality": "high"
  },
  "callbackId": "cb_1720598429371"
}
```

> 🚨 所有参数必须以 JSON 格式传递，回调 ID 用于异步响应。

---

### 第 2 步：前端封装 JSBridge（H5 调 App）

```js
function callApp(method, params = {}, callback) {
  const callbackId = 'cb_' + Date.now();

  if (typeof callback === 'function') {
    window[callbackId] = callback;
  }

  const message = {
    method,
    params,
    callbackId
  };

  try {
    if (window.webkit?.messageHandlers?.bridge) {
      // iOS
      window.webkit.messageHandlers.bridge.postMessage(message);
    } else if (window.AndroidBridge?.postMessage) {
      // Android
      window.AndroidBridge.postMessage(JSON.stringify(message));
    } else {
      console.warn('App Bridge 不可用');
    }
  } catch (err) {
    console.error('Bridge 调用失败:', err);
  }
}
```

---

### 第 3 步：前端调用示例（H5 → App）

```js
callApp('openCamera', { quality: 'high' }, function (res) {
  console.log('摄像返回:', res);
});
```

---

### 第 4 步：App 接收调用（App 端逻辑）

#### ✅ Android 端实现

```java
@JavascriptInterface
public void postMessage(String json) {
    JSONObject message = new JSONObject(json);
    String method = message.getString("method");
    JSONObject params = message.getJSONObject("params");
    String callbackId = message.getString("callbackId");

    // 执行业务逻辑（例如打开摄像头）
    String result = "{ \"imageUrl\": \"xxx.jpg\" }";

    // 回调 H5
    String js = String.format("window.%s('%s')", callbackId, result);
    webView.evaluateJavascript(js, null);
}

// 注入对象
webView.addJavascriptInterface(new JsBridge(), "AndroidBridge");
```

#### ✅ iOS 端实现（Swift）

```swift
class JSBridge: NSObject, WKScriptMessageHandler {
  func userContentController(_ userContentController: WKUserContentController,
                             didReceive message: WKScriptMessage) {
    let body = message.body as? [String: Any]
    let method = body["method"] as? String ?? ""
    let callbackId = body["callbackId"] as? String ?? ""

    // 调用摄像头逻辑
    let result = "{ \"imageUrl\": \"xxx.jpg\" }"
    webView.evaluateJavaScript("window.\(callbackId)(\(result))", completionHandler: nil)
  }
}

// 注入 handler
let controller = WKUserContentController()
controller.add(JSBridge(), name: "bridge")
```

---

### 第 5 步：App → H5 主动通信（App 调 JS）

```js
window.onLoginSuccess = function (userInfo) {
  console.log('用户信息:', userInfo);
};
```

App 调用：

```java
webView.evaluateJavascript("onLoginSuccess(" + json + ")", null);
```

或：

```swift
webView.evaluateJavaScript("onLoginSuccess(\(json))", completionHandler: nil)
```

---

## 四、🎯 推荐统一方法列表（接口约定）

|方法名|描述|参数结构|说明|
|---|---|---|---|
|`openCamera`|打开摄像头|`{ quality: 'high' }`|回调图片信息|
|`getLocation`|获取定位信息|`{}`|返回经纬度|
|`closePage`|关闭当前页面|`{}`||
|`share`|调用系统分享|`{ title, content, url }`||
|`login`|调用原生登录流程|`{}`|回调用户信息|
|`navigateTo`|跳转原生页面|`{ route: '/native/page' }`||

---

## 五、🛠️ 本地调试建议

### 方法一：H5 模拟桥接

```js
// mock AndroidBridge
window.AndroidBridge = {
  postMessage(data) {
    const msg = JSON.parse(data);
    setTimeout(() => {
      const res = { success: true, data: '模拟返回' };
      window[msg.callbackId](JSON.stringify(res));
    }, 1000);
  }
};
```

### 方法二：iOS 模拟 messageHandler

```js
window.webkit = {
  messageHandlers: {
    bridge: {
      postMessage(data) {
        console.log('模拟调用:', data);
        const cb = window[data.callbackId];
        cb && cb({ success: true, data: 'iOS模拟结果' });
      }
    }
  }
};
```

---

## 六、🛡️ 安全与容错建议

|项目|建议|
|---|---|
|参数校验|所有通信参数必须进行字段校验|
|回调防冲突|callbackId 需唯一，清理无效回调|
|异常捕获|JSBridge 通信需使用 try/catch 包裹|
|Android 安全风险|`addJavascriptInterface` 需注意权限|
|协议兼容|可增加 version 字段做 App 兼容判断|
|白名单控制|App 限制加载 H5 页面来源防注入攻击|

---

## 七、📚 项目实践建议（团队规范）

- 📁 **目录结构建议**
    
    ```
    src/
      utils/
        bridge.js           // 桥封装逻辑
      services/
        camera.js           // 摄像调用逻辑
      pages/
        example.vue         // 使用 callApp 示例
    ```
    
- 🧱 建议封装通用桥调用方法：`callApp(method, params, callback)`
    
- 🧩 每个方法配套文档说明：参数结构、返回结构、示例代码
    
- ✅ 与原生协定统一命名、格式、生命周期
    
- 🧪 建立 Mock 调试平台：支持非 App 环境下模拟通信流程
    

---

## 八、📦 高级扩展（可选）

- 支持 Promise 风格调用：
    
    ```js
    callAppPromise('getUserInfo').then(res => console.log(res));
    ```
    
- 支持队列调用、节流控制
    
- 支持事件监听型通信（如监听 token 失效、连接中断等）
