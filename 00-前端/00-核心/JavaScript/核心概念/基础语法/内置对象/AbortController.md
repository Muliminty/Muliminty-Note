#### 1. 基本概念
• **AbortController** 是一个用于取消异步任务（如 `fetch` 请求）的控制器对象。
• 包含：
  • **`signal` 属性**：一个 `AbortSignal` 实例，用于通知异步任务何时被取消。
  • **`abort()` 方法**：触发取消操作，使 `signal` 状态变为已中止。

#### 2. 基本用法
```javascript
const controller = new AbortController();
const { signal } = controller;

// 将 signal 传递给支持取消的异步操作（如 fetch）
fetch('https://api.example.com/data', { signal })
  .then(response => response.json())
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('请求被取消');
    }
  });

// 取消请求
controller.abort();
```

#### 3. 核心特性
• **`signal.aborted`**：布尔值，表示任务是否被取消。
• **`signal.reason`**：获取调用 `abort(reason)` 时传递的原因，默认为 `AbortError`。
• **事件监听**：通过 `signal.addEventListener('abort', callback)` 监听取消事件。

#### 4. 应用场景
• **取消重复请求**：如搜索框输入防抖，取消前一次未完成的请求。
• **组件卸载清理**：在 React 的 `useEffect` 清理函数中取消请求。
• **超时处理**：结合 `AbortSignal.timeout()` 自动取消长时间未完成的请求。

#### 5. 高级用法
**a. 取消多个请求**
```javascript
const controller = new AbortController();

// 多个请求共享同一个 signal
fetch(url1, { signal: controller.signal });
fetch(url2, { signal: controller.signal });

// 同时取消所有请求
controller.abort();
```

**b. 超时自动取消**
```javascript
// 使用 AbortSignal.timeout()（需注意浏览器兼容性）
fetch(url, { signal: AbortSignal.timeout(5000) })
  .catch(err => {
    if (err.name === 'TimeoutError') {
      console.log('请求超时');
    }
  });
```

**c. 组合多个 Signals**
```javascript
// 当任一 signal 被取消时，触发中止
const combinedSignal = AbortSignal.any([signal1, signal2]);
```

**d. 自定义异步任务支持 Abort**
```javascript
function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(), ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('任务被取消', 'AbortError'));
    });
  });
}
```

#### 6. 错误处理
• 捕获 `AbortError` 并区分其他错误：
```javascript
fetch(url, { signal })
  .catch(err => {
    if (err.name === 'AbortError') {
      // 处理取消逻辑
    } else {
      // 处理其他错误
    }
  });
```

#### 7. React 示例（组件卸载时取消）
```javascript
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then(/* ... */);

  return () => controller.abort(); // 清理函数中取消
}, []);
```

#### 8. 兼容性与注意事项
• **浏览器支持**：现代浏览器均支持，IE 不支持。Node.js 需 v15+。
• **不可重用**：一个 `AbortController` 只能取消一次，后续需新建实例。
• **第三方库**：如 Axios 支持通过 `signal` 取消请求：
  ```javascript
  const source = axios.CancelToken.source();
  axios.get(url, { cancelToken: source.token });
  source.cancel();
  ```

#### 9. 最佳实践
• **及时清理**：在异步任务完成后移除事件监听，避免内存泄漏。
• **复用 Signal**：合理设计 Signal 的作用域，避免不必要的控制器实例。
• **结合框架**：在 SPA 框架中，利用生命周期钩子统一管理异步任务。

#### 10. 静态方法（新增 API）
• **`AbortSignal.abort(reason)`**：返回一个已中止的 Signal。
• **`AbortSignal.any(signals)`**：任意 Signal 中止时触发。
• **`AbortSignal.throwIfAborted()`**：在异步任务中主动检查是否中止。

---

通过合理使用 `AbortController`，可以有效管理异步任务的生命周期，提升应用性能和用户体验。