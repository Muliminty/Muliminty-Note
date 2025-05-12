# Window.postMessage API 详解

## 1. 基本概念

Window.postMessage() 是一种跨源通信的方法，它提供了一种受控机制，安全地实现不同源（origin）之间的窗口通信。在浏览器的同源策略（Same-Origin Policy）限制下，不同源的页面通常不能直接访问彼此的方法和属性，而 postMessage 提供了一种绕过这一限制的安全方式。

### 1.1 同源策略（Same-Origin Policy）

同源策略是浏览器的一项安全功能，它限制了一个源（origin）的文档或脚本如何与另一个源的资源进行交互。两个 URL 具有相同的源，需要满足以下条件：

- 相同的协议（protocol）
- 相同的域名（domain）
- 相同的端口（port）

例如：`https://example.com:443` 和 `https://example.com:443/page.html` 是同源的，而 `https://example.com` 和 `http://example.com`（不同协议）或 `https://example.com` 和 `https://sub.example.com`（不同域名）则不是同源的。

### 1.2 为什么需要 postMessage

在现代 Web 应用中，经常需要在不同源的窗口之间进行通信，例如：

- 主页面与嵌入的第三方 iframe 之间的通信
- 主窗口与弹出窗口（popup）之间的通信
- 不同子域之间的通信

postMessage 提供了一种安全的方式来实现这些跨源通信需求。

## 2. API 详解

### 2.1 语法

```javascript
otherWindow.postMessage(message, targetOrigin, [transfer]);
```

#### 参数说明：

- **otherWindow**：接收消息的窗口的引用。可以是以下之一：
  - iframe 的 contentWindow 属性
  - 通过 window.open 返回的窗口对象
  - 通过 window.frames 获取的窗口对象
  - window.parent（在 iframe 中引用父窗口）

- **message**：要发送的数据。该数据会被结构化克隆算法序列化，支持的数据类型包括：
  - 所有原始类型（除了 Symbol）
  - Boolean 对象
  - String 对象
  - Date
  - RegExp（序列化后只保留标志和源文本）
  - Blob
  - File
  - FileList
  - ArrayBuffer
  - ArrayBufferView（如 Uint8Array 等）
  - Map
  - Set
  - 普通对象（Object）
  - 数组（Array）

- **targetOrigin**：指定接收消息的窗口的源，它有两种特殊值：
  - `"*"` 表示不限制接收方的源（不推荐使用，存在安全风险）
  - `"/"` 表示只有与发送方同源的接收方才能接收到消息
  
  出于安全考虑，应该始终指定确切的目标源，而不是使用 `"*"`。

- **transfer**（可选）：是一个 Transferable 对象的序列，这些对象的所有权将被转移到接收方，发送方将不再能使用这些对象。

### 2.2 接收消息

要接收通过 postMessage 发送的消息，需要在目标窗口中监听 `message` 事件：

```javascript
window.addEventListener("message", (event) => {
  // 首先验证发送方的源
  if (event.origin !== "https://trusted-domain.com") return;
  
  // 处理接收到的数据
  console.log("收到消息:", event.data);
  
  // 可以使用 event.source 回复消息
  event.source.postMessage("收到你的消息了", event.origin);
}, false);
```

#### message 事件对象的属性：

- **data**：从其他窗口发送过来的消息内容
- **origin**：发送消息的窗口的源（协议、域名和端口）
- **source**：发送消息的窗口对象的引用，可用于回复消息
- **lastEventId**：一个唯一的标识符
- **ports**：与消息一起发送的 MessagePort 对象，用于通道通信

## 3. 安全考虑

使用 postMessage 进行跨源通信时，需要注意以下安全事项：

### 3.1 验证发送方的源

在接收消息时，始终验证 `event.origin` 属性，确保消息来自预期的源：

```javascript
window.addEventListener("message", (event) => {
  // 只接受来自特定源的消息
  if (event.origin !== "https://trusted-domain.com") {
    console.error("拒绝来自未知源的消息:", event.origin);
    return;
  }
  
  // 处理消息...
});
```

### 3.2 指定确切的目标源

发送消息时，应该指定确切的目标源，而不是使用通配符 `"*"`：

```javascript
// 不推荐
iframe.contentWindow.postMessage(data, "*");

// 推荐
iframe.contentWindow.postMessage(data, "https://trusted-domain.com");
```

### 3.3 验证消息内容

不要假设接收到的消息格式总是正确的，应该验证消息的结构和内容：

```javascript
window.addEventListener("message", (event) => {
  if (event.origin !== "https://trusted-domain.com") return;
  
  try {
    // 验证消息格式
    if (typeof event.data !== "object" || !event.data.type) {
      throw new Error("无效的消息格式");
    }
    
    // 根据消息类型处理
    switch (event.data.type) {
      case "REQUEST_DATA":
        // 处理数据请求
        break;
      case "UPDATE":
        // 处理更新
        break;
      default:
        throw new Error("未知的消息类型: " + event.data.type);
    }
  } catch (error) {
    console.error("处理消息时出错:", error);
  }
});
```

### 3.4 避免执行不可信的代码

永远不要直接执行从消息中接收到的代码：

```javascript
// 危险！不要这样做
window.addEventListener("message", (event) => {
  if (event.data.code) {
    eval(event.data.code); // 严重的安全风险！
  }
});
```

## 4. 使用场景

### 4.1 iframe 通信

最常见的使用场景是主页面与嵌入的 iframe 之间的通信：

- 主页面向 iframe 发送配置信息或命令
- iframe 向主页面报告状态或发送数据
- 不同域的 iframe 之间通过主页面中转通信

### 4.2 弹出窗口通信

主窗口与通过 window.open() 打开的弹出窗口之间的通信：

- 主窗口向弹出窗口发送数据
- 弹出窗口完成任务后向主窗口返回结果

### 4.3 跨域 AJAX 请求代理

在一些情况下，可以使用 iframe 加载不同域的页面，然后通过 postMessage 实现跨域 AJAX 请求的代理。

### 4.4 第三方集成

当集成第三方服务（如支付系统、社交媒体小部件等）时，可以使用 postMessage 在主站点和第三方服务之间安全地传递数据。

## 5. iframe 通信实例

下面是一个完整的示例，演示了主页面与嵌入的 iframe 之间的双向通信。

### 5.1 主页面（parent.html）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>postMessage 主页面示例</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      display: flex;
      gap: 20px;
    }
    .controls {
      flex: 1;
    }
    .iframe-container {
      flex: 1;
      border: 1px solid #ccc;
      padding: 10px;
    }
    iframe {
      width: 100%;
      height: 300px;
      border: 1px solid #ddd;
    }
    .message-log {
      margin-top: 20px;
      border: 1px solid #eee;
      padding: 10px;
      height: 200px;
      overflow-y: auto;
      background-color: #f9f9f9;
    }
    .message {
      margin-bottom: 8px;
      padding: 8px;
      border-radius: 4px;
    }
    .sent {
      background-color: #e6f7ff;
      border-left: 4px solid #1890ff;
    }
    .received {
      background-color: #f6ffed;
      border-left: 4px solid #52c41a;
    }
  </style>
</head>
<body>
  <h1>postMessage 主页面示例</h1>
  
  <div class="container">
    <div class="controls">
      <h2>发送消息到 iframe</h2>
      <div>
        <label for="messageType">消息类型：</label>
        <select id="messageType">
          <option value="TEXT">文本消息</option>
          <option value="JSON">JSON 数据</option>
          <option value="COMMAND">命令</option>
        </select>
      </div>
      <div>
        <label for="messageContent">消息内容：</label>
        <textarea id="messageContent" rows="5" style="width: 100%;">Hello from parent page!</textarea>
      </div>
      <button id="sendButton">发送消息</button>
      
      <h3>消息日志</h3>
      <div class="message-log" id="messageLog"></div>
    </div>
    
    <div class="iframe-container">
      <h2>嵌入的 iframe（不同源）</h2>
      <!-- 注意：在实际使用中，iframe 的 src 应该指向不同源的页面 -->
      <iframe id="targetFrame" src="iframe.html"></iframe>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const targetFrame = document.getElementById('targetFrame');
      const messageType = document.getElementById('messageType');
      const messageContent = document.getElementById('messageContent');
      const sendButton = document.getElementById('sendButton');
      const messageLog = document.getElementById('messageLog');
      
      // 添加消息到日志
      function logMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = message;
        messageLog.appendChild(messageElement);
        messageLog.scrollTop = messageLog.scrollHeight;
      }
      
      // 发送消息到 iframe
      sendButton.addEventListener('click', () => {
        const type = messageType.value;
        let content = messageContent.value;
        let message;
        
        switch (type) {
          case 'TEXT':
            message = content;
            break;
          case 'JSON':
            try {
              // 尝试解析为 JSON，如果输入不是有效的 JSON，则创建一个包含文本的对象
              message = JSON.parse(content);
            } catch (e) {
              message = { text: content };
            }
            break;
          case 'COMMAND':
            message = { 
              type: 'COMMAND', 
              command: content,
              timestamp: new Date().toISOString()
            };
            break;
        }
        
        // 获取 iframe 的源（在实际应用中，这应该是 iframe 的实际源）
        // 注意：在本地测试时，可能需要使用 '*'，但在生产环境中应指定确切的源
        const targetOrigin = '*'; // 实际应用中应使用如 'https://iframe-domain.com'
        
        // 发送消息
        targetFrame.contentWindow.postMessage(message, targetOrigin);
        
        // 记录发送的消息
        logMessage(`发送: ${JSON.stringify(message)}`, 'sent');
      });
      
      // 监听来自 iframe 的消息
      window.addEventListener('message', (event) => {
        // 在实际应用中，应该验证消息的源
        // if (event.origin !== 'https://iframe-domain.com') return;
        
        // 处理接收到的消息
        const message = event.data;
        logMessage(`接收: ${JSON.stringify(message)}`, 'received');
        
        // 如果需要，可以在这里添加对特定消息类型的处理
      });
    });
  </script>
</body>
</html>
```

### 5.2 iframe 页面（iframe.html）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>postMessage iframe 示例</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 15px;
      background-color: #f0f2f5;
    }
    .controls {
      margin-bottom: 15px;
    }
    .message-log {
      border: 1px solid #d9d9d9;
      padding: 10px;
      height: 150px;
      overflow-y: auto;
      background-color: white;
      margin-bottom: 15px;
    }
    .message {
      margin-bottom: 8px;
      padding: 6px;
      border-radius: 4px;
    }
    .sent {
      background-color: #f0f7ff;
      border-left: 3px solid #69c0ff;
    }
    .received {
      background-color: #fcffe6;
      border-left: 3px solid #bae637;
    }
    button {
      padding: 5px 10px;
      background-color: #1890ff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #40a9ff;
    }
    textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      resize: vertical;
    }
  </style>
</head>
<body>
  <h2>iframe 内容</h2>
  <p>这是嵌入在主页面中的 iframe。它可以与主页面通过 postMessage 进行通信。</p>
  
  <div class="message-log" id="messageLog">
    <!-- 消息将在这里显示 -->
  </div>
  
  <div class="controls">
    <textarea id="replyContent" rows="3" placeholder="输入回复消息...">Hello from iframe!</textarea>
    <button id="replyButton">回复主页面</button>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const messageLog = document.getElementById('messageLog');
      const replyContent = document.getElementById('replyContent');
      const replyButton = document.getElementById('replyButton');
      
      // 添加消息到日志
      function logMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = message;
        messageLog.appendChild(messageElement);
        messageLog.scrollTop = messageLog.scrollHeight;
      }
      
      // 监听来自父页面的消息
      window.addEventListener('message', (event) => {
        // 在实际应用中，应该验证消息的源
        // if (event.origin !== 'https://parent-domain.com') return;
        
        // 处理接收到的消息
        const message = event.data;
        logMessage(`接收: ${JSON.stringify(message)}`, 'received');
        
        // 如果收到的是命令类型的消息，可以执行特定操作
        if (typeof message === 'object' && message.type === 'COMMAND') {
          // 执行命令相关的操作
          logMessage(`执行命令: ${message.command}`, 'received');
          
          // 自动回复命令确认
          const response = {
            type: 'COMMAND_RESPONSE',
            originalCommand: message.command,
            status: 'success',
            timestamp: new Date().toISOString()
          };
          
          // 发送回复到父页面
          window.parent.postMessage(response, '*'); // 实际应用中应指定确切的源
          logMessage(`自动回复: ${JSON.stringify(response)}`, 'sent');
        }
      });
      
      // 发送回复到父页面
      replyButton.addEventListener('click', () => {
        const content = replyContent.value;
        const message = {
          type: 'REPLY',
          content: content,
          timestamp: new Date().toISOString()
        };
        
        // 发送消息到父页面
        window.parent.postMessage(message, '*'); // 实际应用中应指定确切的源
        
        // 记录发送的消息
        logMessage(`发送: ${JSON.stringify(message)}`, 'sent');
      });
      
      // 通知父页面 iframe 已加载完成
      window.parent.postMessage({
        type: 'READY',
        timestamp: new Date().toISOString()
      }, '*'); // 实际应用中应指定确切的源
    });
  </script>
</body>
</html>
```

### 5.3 使用说明

1. 将上述两个 HTML 文件保存到同一目录下
2. 在浏览器中打开 parent.html
3. 你将看到主页面和嵌入的 iframe，可以在它们之间发送消息

**注意**：在实际应用中，iframe 通常会加载不同源的页面。在本地测试时，两个文件可能会被视为同源，但这不影响 postMessage 的演示。在生产环境中，应该将 iframe 的 src 设置为实际的不同源 URL，并在发送消息时指定确切的目标源。

## 6. 浏览器兼容性

postMessage API 在现代浏览器中得到了广泛支持：

- Chrome 1+
- Firefox 3+
- Safari 4+
- Edge 12+
- Internet Explorer 8+（但在 IE8-9 中有一些限制）

在 IE8-9 中，postMessage 只能发送字符串，不能发送对象。如果需要支持这些旧版浏览器，应该在发送前将对象转换为 JSON 字符串，并在接收时解析回对象：

```javascript
// 发送
otherWindow.postMessage(JSON.stringify(data), targetOrigin);

// 接收
window.addEventListener('message', (event) => {
  try {
    const data = JSON.parse(event.data);
    // 处理数据...
  } catch (e) {
    console.error('无法解析接收到的消息:', e);
  }
});
```

## 7. 最佳实践

1. **始终验证消息源**：在处理接收到的消息时，验证 `event.origin` 是否来自预期的源。

2. **指定确切的目标源**：发送消息时，使用确切的目标源，而不是通配符 `"*"`。

3. **结构化消息**：使用结构化的消息格式，包含类型字段，便于接收方处理不同类型的消息。

   ```javascript
   // 良好的消息结构
   {
     type: 'ACTION_TYPE',
     data: { ... },
     timestamp: Date.now()
   }
   ```

4. **错误处理**：在处理接收到的消息时，使用 try-catch 块捕获可能的错误。

5. **安全验证**：不要信任接收到的数据，始终进行验证和清理。

6. **考虑兼容性**：如果需要支持旧版浏览器，使用 JSON.stringify/parse 处理消息。

7. **使用消息队列**：如果在 iframe 加载完成前需要发送消息，可以实现一个消息队列，等 iframe 准备好后再发送。

8. **双向通信**：实现可靠的双向通信机制，包括请求-响应模式和错误处理。

## 8. 总结

Window.postMessage() API 提供了一种安全的方式来实现跨源通信，特别适用于主页面与嵌入的 iframe 之间的通信。使用时需要注意安全问题，始终验证消息的源和内容，并遵循最佳实践。

通过本文提供的详细示例，你可以轻松实现主页面与 iframe 之间的双向通信，并根据自己的需求进行扩展和定制。

## 9. 参考资料

- [MDN Web Docs: Window.postMessage()](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)
- [HTML Living Standard: Cross-document messaging](https://html.spec.whatwg.org/multipage/web-messaging.html#web-messaging)
- [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)