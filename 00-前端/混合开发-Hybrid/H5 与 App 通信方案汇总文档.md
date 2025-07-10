# 📘 H5 与 App 通信方案汇总文档

---

## 一、📌 背景说明

在 Hybrid 应用开发中，前端 H5 页面需要调用原生能力（如摄像头、定位、支付等），需要通过某种**通信机制**与原生 App 进行交互。

目前主流通信方案有：

|通信方向|常用方案|
|---|---|
|H5 → App|`JSBridge` 注入 / 自定义协议跳转|
|App → H5|执行 JS 函数 / 回调 / JS 注入|

---

## 二、📦 通信方案汇总对比

|方案编号|通信方案|适用方向|优点|缺点|适用平台|
|---|---|---|---|---|---|
|①|`addJavascriptInterface`|H5 → Android|原生支持、实现简单|安全风险高、API 过于开放|Android|
|②|`window.webkit.messageHandlers`|H5 → iOS|安全、稳定、主流|仅 WKWebView 可用、iOS 10 以下需兼容 UIWebView|iOS|
|③|自定义 URL 协议拦截（如 `app://`）|H5 → App|全平台通用、实现简单|无返回值、通信效率低|iOS / Android|
|④|App 执行 JS 回调函数|App → H5|直观、简单、兼容性好|无状态管理、容易丢回调|iOS / Android|
|⑤|注入 JSBridge 全套桥|双向|全功能双向通信、可扩展性强|实现复杂、维护成本高|推荐 ✅|

---

## 三、🌉 推荐方案：注入式 JSBridge（封装统一通信）

### ✅ 原理

- App 向 WebView 中注入桥（对象或 handler）
    
- H5 使用统一的 `callApp` 接口发起通信
    
- App 接收请求后执行操作并调用回调函数通知 H5
    

---

## 四、🛠️ Demo 示例（含代码）

### 🧩 1. H5 调用 App 桥接（H5 → App）

#### JSBridge 封装（前端）👇

```js
// jsbridge.js
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
      console.warn('App 桥接不可用');
    }
  } catch (e) {
    console.error('Bridge 调用失败:', e);
  }
}
```

#### 调用摄像头👇

```js
callApp('openCamera', { quality: 'high' }, function (res) {
  console.log('图片地址:', res.imageUrl);
});
```

---

### 🧩 2. App 注入桥（App 端）

#### ✅ Android 注入 👇

```java
public class JSBridge {
    @JavascriptInterface
    public void postMessage(String jsonStr) {
        JSONObject json = new JSONObject(jsonStr);
        String method = json.getString("method");
        String callbackId = json.getString("callbackId");

        // 示例：模拟结果
        String result = "{\"imageUrl\": \"https://xxx.com/pic.jpg\"}";
        String js = "window." + callbackId + "(" + result + ")";
        webView.evaluateJavascript(js, null);
    }
}

// WebView 注入
webView.addJavascriptInterface(new JSBridge(), "AndroidBridge");
```

---

#### ✅ iOS 注入（Swift WKWebView）👇

```swift
class JSBridge: NSObject, WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController,
                                didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let callbackId = body["callbackId"] as? String else { return }

        let result = "{ \"imageUrl\": \"https://xxx.com/image.jpg\" }"
        webView.evaluateJavaScript("window.\(callbackId)(\(result))", completionHandler: nil)
    }
}

// 注入
let controller = WKUserContentController()
controller.add(JSBridge(), name: "bridge")
let config = WKWebViewConfiguration()
config.userContentController = controller
```

---

### 🧩 3. App → H5 通知事件（主动调用）

```js
// H5 预定义函数
window.onLoginSuccess = function (userInfo) {
  alert('登录成功，用户信息：' + JSON.stringify(userInfo));
};
```

```swift
// iOS 调用示例
webView.evaluateJavaScript("onLoginSuccess({ name: 'Tom', token: 'abc123' })", nil);
```

---

## 五、✅ 完整闭环通信流程图

```txt
H5 页面（callApp）
   ↓ method/params/callbackId
App 接收（messageHandlers / AndroidBridge）
   ↓ 执行原生功能
App 执行结果 → 调用 window.callbackId(result)
   ↑
H5 获取回调结果
```

---

## 六、🧪 本地调试模拟工具（H5 端）

可本地模拟桥接环境，无需 App 真机：

```js
// 模拟 AndroidBridge
window.AndroidBridge = {
  postMessage(json) {
    const { method, callbackId } = JSON.parse(json);
    console.log('模拟调用原生方法:', method);
    setTimeout(() => {
      const result = { imageUrl: 'https://test.com/image.png' };
      window[callbackId](result);
    }, 500);
  }
};
```

---

## 七、🔐 安全与兼容性建议

|类型|建议|
|---|---|
|Android 安全|不注入多余 API，仅暴露必要方法|
|参数校验|所有参数应 JSON 格式，字段检查|
|异常捕获|使用 try/catch 包裹桥接调用|
|回调清理|使用后销毁回调 ID，防止内存泄露|
|兼容判断|H5 建议判断 `window.AndroidBridge` 或 `window.webkit` 存在|

---

## 八、📂 示例项目结构（Vue/React 项目）

```
src/
  bridge/
    jsbridge.js              # 通用通信封装
  components/
    CameraButton.vue         # 示例组件
  services/
    camera.js                # 摄像调用封装
  pages/
    home.vue                 # 页面调用 bridge
```

---

## 九、📎 附录：H5 调用方法定义表

|方法名|参数示例|返回字段|说明|
|---|---|---|---|
|`openCamera`|`{ quality: 'high' }`|`{ imageUrl }`|调用摄像头|
|`getLocation`|`{}`|`{ lat, lng }`|获取定位信息|
|`share`|`{ title, content, url }`|`{ success: true }`|分享内容|
|`closePage`|`{}`|`{}`|关闭页面|
|`navigateTo`|`{ route: '/native/page' }`|`{}`|跳转原生页面|

---

## ✅ 十、总结推荐

|项目场景|推荐方案|
|---|---|
|快速集成，支持回调|JSBridge ✅|
|简单跳转、统计曝光等轻量功能|URL Scheme / JS 调用|
|仅安卓|`addJavascriptInterface`（需做安全防护）|
|支持未来扩展|封装统一桥接模块（支持 Promise）|
