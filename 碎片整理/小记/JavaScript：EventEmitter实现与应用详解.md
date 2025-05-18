# JavaScript：EventEmitter实现与应用详解

## 1. 什么是发布订阅模式？

发布订阅模式是一种设计模式，它定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个主题对象。这个主题对象在状态发生变化时，会通知所有观察者对象，使它们能够自动更新自己。

在JavaScript中，发布订阅模式被广泛应用于处理异步事件。它的核心思想是：

- **发布者（Publisher）**：负责发布事件/消息
- **订阅者（Subscriber）**：负责订阅并处理事件/消息
- **事件中心（Event Channel）**：负责存储事件和订阅者的关系，并在事件发生时通知相关订阅者

与观察者模式相比，发布订阅模式多了一个事件中心作为调度中心，用于解耦发布者和订阅者。

## 2. EventEmitter 基础实现

下面我们来实现一个简单的 EventEmitter 类，它是发布订阅模式的典型应用：

```javascript
class EventEmitter {
  constructor() {
    // 用于存储事件和对应的监听函数
    this.events = {};
  }

  // 订阅事件
  on(eventName, callback) {
    // 如果事件不存在，则创建一个新数组来存储回调函数
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    // 将回调函数添加到事件数组中
    this.events[eventName].push(callback);
    return this; // 支持链式调用
  }

  // 发布事件
  emit(eventName, ...args) {
    // 检查是否有订阅者
    const callbacks = this.events[eventName];
    if (!callbacks || callbacks.length === 0) {
      return false;
    }
    
    // 依次执行所有回调函数
    callbacks.forEach(callback => {
      callback.apply(this, args);
    });
    
    return true;
  }

  // 移除事件监听
  off(eventName, callback) {
    // 如果没有提供事件名，则移除所有事件
    if (!eventName) {
      this.events = {};
      return this;
    }
    
    // 如果没有提供回调函数，则移除该事件的所有监听器
    const callbacks = this.events[eventName];
    if (!callbacks) return this;
    
    if (!callback) {
      delete this.events[eventName];
      return this;
    }
    
    // 移除特定的回调函数
    this.events[eventName] = callbacks.filter(
      fn => fn !== callback
    );
    
    // 如果事件数组为空，则删除该事件
    if (this.events[eventName].length === 0) {
      delete this.events[eventName];
    }
    
    return this;
  }
}
```

这个基础实现包含了 EventEmitter 的三个核心方法：

- **on(eventName, callback)**：订阅事件
- **emit(eventName, ...args)**：发布事件
- **off(eventName, callback)**：取消订阅

## 3. 使用示例

让我们通过一个简单的例子来看看如何使用 EventEmitter：

```javascript
// 创建 EventEmitter 实例
const emitter = new EventEmitter();

// 订阅事件
function messageHandler(message) {
  console.log(`收到消息: ${message}`);
}

emitter.on('message', messageHandler);

// 发布事件
emitter.emit('message', 'Hello World'); // 输出: 收到消息: Hello World

// 取消订阅
emitter.off('message', messageHandler);

// 再次发布事件，但不会有任何输出，因为已经取消了订阅
emitter.emit('message', 'Hello Again');
```

## 4. 进阶功能实现

现在，让我们为 EventEmitter 添加一些进阶功能：

### 4.1 一次性事件监听 (once)

有时我们希望事件只被监听一次，触发后自动移除监听器：

```javascript
class EventEmitter {
  // ... 前面的代码 ...
  
  // 只监听一次事件
  once(eventName, callback) {
    // 创建一个包装函数，在调用原始回调后自动移除监听器
    const wrapper = (...args) => {
      callback.apply(this, args);
      this.off(eventName, wrapper);
    };
    
    // 保存原始回调的引用，方便后续移除
    wrapper.original = callback;
    
    // 注册包装后的监听器
    return this.on(eventName, wrapper);
  }
  
  // 修改 off 方法以支持移除 once 监听器
  off(eventName, callback) {
    // ... 前面的代码 ...
    
    if (callback) {
      this.events[eventName] = callbacks.filter(fn => {
        return fn !== callback && fn.original !== callback;
      });
    }
    
    // ... 后面的代码 ...
  }
}
```

### 4.2 获取事件监听器数量

```javascript
class EventEmitter {
  // ... 前面的代码 ...
  
  // 获取特定事件的监听器数量
  listenerCount(eventName) {
    const callbacks = this.events[eventName] || [];
    return callbacks.length;
  }
  
  // 获取所有事件名称
  eventNames() {
    return Object.keys(this.events);
  }
}
```

### 4.3 设置最大监听器数量

为了防止内存泄漏，我们可以限制每个事件的最大监听器数量：

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
    this.maxListeners = 10; // 默认最大监听器数量
  }
  
  // 设置最大监听器数量
  setMaxListeners(n) {
    this.maxListeners = n;
    return this;
  }
  
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    
    // 检查是否超过最大监听器数量
    if (
      this.maxListeners !== 0 &&
      this.events[eventName].length >= this.maxListeners
    ) {
      console.warn(
        `警告: ${eventName} 事件的监听器数量超过了最大限制 ${this.maxListeners}。` +
        '这可能导致内存泄漏。'
      );
    }
    
    this.events[eventName].push(callback);
    return this;
  }
  
  // ... 其他方法 ...
}
```

## 5. 完整的 EventEmitter 实现

下面是一个功能完整的 EventEmitter 类实现：

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
    this.maxListeners = 10;
  }

  // 设置最大监听器数量
  setMaxListeners(n) {
    this.maxListeners = n;
    return this;
  }

  // 获取最大监听器数量
  getMaxListeners() {
    return this.maxListeners;
  }

  // 添加事件监听器
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    
    if (
      this.maxListeners !== 0 &&
      this.events[eventName].length >= this.maxListeners
    ) {
      console.warn(
        `警告: ${eventName} 事件的监听器数量超过了最大限制 ${this.maxListeners}。` +
        '这可能导致内存泄漏。'
      );
    }
    
    this.events[eventName].push(callback);
    return this;
  }

  // 添加一次性事件监听器
  once(eventName, callback) {
    const wrapper = (...args) => {
      callback.apply(this, args);
      this.off(eventName, wrapper);
    };
    
    wrapper.original = callback;
    return this.on(eventName, wrapper);
  }

  // 移除事件监听器
  off(eventName, callback) {
    if (!eventName) {
      this.events = {};
      return this;
    }
    
    const callbacks = this.events[eventName];
    if (!callbacks) return this;
    
    if (!callback) {
      delete this.events[eventName];
      return this;
    }
    
    this.events[eventName] = callbacks.filter(fn => {
      return fn !== callback && fn.original !== callback;
    });
    
    if (this.events[eventName].length === 0) {
      delete this.events[eventName];
    }
    
    return this;
  }

  // 触发事件
  emit(eventName, ...args) {
    const callbacks = this.events[eventName];
    if (!callbacks || callbacks.length === 0) {
      return false;
    }
    
    callbacks.forEach(callback => {
      callback.apply(this, args);
    });
    
    return true;
  }

  // 获取事件监听器列表
  listeners(eventName) {
    return this.events[eventName] || [];
  }

  // 获取事件监听器数量
  listenerCount(eventName) {
    return this.listeners(eventName).length;
  }

  // 获取所有已注册的事件名称
  eventNames() {
    return Object.keys(this.events);
  }

  // 移除所有监听器
  removeAllListeners(eventName) {
    if (eventName) {
      delete this.events[eventName];
    } else {
      this.events = {};
    }
    return this;
  }
}
```

## 6. 实际应用场景

### 6.1 组件通信

在前端框架中，EventEmitter 可以用于组件间通信：

```javascript
// 创建一个全局事件总线
const eventBus = new EventEmitter();

// 组件 A
function ComponentA() {
  // 发送消息
  function sendMessage() {
    eventBus.emit('message', '来自组件A的消息');
  }
  
  return {
    sendMessage
  };
}

// 组件 B
function ComponentB() {
  // 初始化时订阅消息
  eventBus.on('message', (message) => {
    console.log('组件B收到:', message);
  });
  
  // 清理函数
  function destroy() {
    eventBus.off('message');
  }
  
  return {
    destroy
  };
}

// 使用示例
const compA = ComponentA();
const compB = ComponentB();

compA.sendMessage(); // 输出: 组件B收到: 来自组件A的消息

// 组件销毁时清理监听器
compB.destroy();
```

### 6.2 异步任务管理

EventEmitter 可以用于管理异步任务的状态变化：

```javascript
class TaskManager extends EventEmitter {
  constructor() {
    super();
    this.tasks = [];
  }
  
  addTask(task) {
    const taskId = Date.now() + Math.random().toString(36).substr(2, 5);
    this.tasks.push({ id: taskId, ...task });
    this.emit('taskAdded', taskId);
    return taskId;
  }
  
  async runTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    this.emit('taskStarted', taskId);
    
    try {
      const result = await task.execute();
      this.emit('taskCompleted', taskId, result);
      return result;
    } catch (error) {
      this.emit('taskFailed', taskId, error);
      throw error;
    }
  }
}

// 使用示例
const taskManager = new TaskManager();

// 监听任务状态变化
taskManager.on('taskAdded', (id) => console.log(`任务 ${id} 已添加`));
taskManager.on('taskStarted', (id) => console.log(`任务 ${id} 已开始`));
taskManager.on('taskCompleted', (id, result) => console.log(`任务 ${id} 已完成:`, result));
taskManager.on('taskFailed', (id, error) => console.log(`任务 ${id} 失败:`, error));

// 添加并运行任务
const taskId = taskManager.addTask({
  execute: () => new Promise(resolve => {
    setTimeout(() => resolve('任务结果'), 1000);
  })
});

taskManager.runTask(taskId);
```

### 6.3 自定义DOM事件封装

EventEmitter 可以用于封装和简化 DOM 事件处理：

```javascript
class DOMEventEmitter extends EventEmitter {
  constructor(element) {
    super();
    this.element = element;
    this.domListeners = new Map();
  }
  
  on(eventName, callback) {
    // 如果是标准 DOM 事件，则使用 addEventListener
    if (typeof this.element.addEventListener === 'function') {
      const domCallback = (event) => callback(event);
      
      // 保存 DOM 回调函数的引用，以便后续移除
      if (!this.domListeners.has(eventName)) {
        this.domListeners.set(eventName, new Map());
      }
      this.domListeners.get(eventName).set(callback, domCallback);
      
      this.element.addEventListener(eventName, domCallback);
    }
    
    // 同时使用 EventEmitter 的事件系统
    return super.on(eventName, callback);
  }
  
  off(eventName, callback) {
    // 如果是标准 DOM 事件，则使用 removeEventListener
    if (
      typeof this.element.removeEventListener === 'function' &&
      this.domListeners.has(eventName)
    ) {
      const listeners = this.domListeners.get(eventName);
      if (listeners.has(callback)) {
        const domCallback = listeners.get(callback);
        this.element.removeEventListener(eventName, domCallback);
        listeners.delete(callback);
      }
      
      if (listeners.size === 0) {
        this.domListeners.delete(eventName);
      }
    }
    
    // 同时使用 EventEmitter 的事件系统
    return super.off(eventName, callback);
  }
  
  // 销毁方法，清理所有事件监听
  destroy() {
    // 清理所有 DOM 事件监听
    this.domListeners.forEach((listeners, eventName) => {
      listeners.forEach((domCallback) => {
        this.element.removeEventListener(eventName, domCallback);
      });
    });
    this.domListeners.clear();
    
    // 清理所有 EventEmitter 事件
    this.removeAllListeners();
  }
}

// 使用示例
const button = document.querySelector('#myButton');
const buttonEvents = new DOMEventEmitter(button);

// 监听点击事件
function handleClick(event) {
  console.log('按钮被点击了!', event);
}

buttonEvents.on('click', handleClick);

// 移除监听
// buttonEvents.off('click', handleClick);

// 完全销毁
// buttonEvents.destroy();
```

## 7. 与 Node.js 的 EventEmitter 对比

Node.js 内置了一个功能强大的 EventEmitter 类，它是 Node.js 事件驱动架构的核心。我们实现的 EventEmitter 与 Node.js 的版本有许多相似之处，但也有一些区别：

1. **错误处理**：Node.js 的 EventEmitter 对 'error' 事件有特殊处理，如果没有监听器，会抛出异常
2. **异步执行**：Node.js 的 EventEmitter 可以通过 setImmediate 或 process.nextTick 异步执行回调
3. **捕获新增监听器**：Node.js 的 EventEmitter 提供了 'newListener' 和 'removeListener' 事件

如果你在 Node.js 环境中工作，建议直接使用内置的 EventEmitter：

```javascript
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
```

## 8. 总结

EventEmitter 是发布订阅模式的典型实现，它提供了一种优雅的方式来处理事件和回调。通过 EventEmitter，我们可以：

1. **解耦组件**：发布者和订阅者不需要直接了解对方
2. **简化异步编程**：通过事件驱动的方式处理异步操作
3. **增强可维护性**：代码更加模块化，易于测试和维护

在实际开发中，EventEmitter 被广泛应用于前端框架、后端服务、组件通信等场景。掌握 EventEmitter 的实现原理和使用方法，将帮助你更好地理解事件驱动编程和发布订阅模式。

希望这篇文章能够帮助你深入理解 EventEmitter 和发布订阅模式！