## 核心矛盾
JavaScript 单线程特性与浏览器渲染机制：
• **主线程阻塞**：同步执行百万任务会导致事件循环被长期占用
• **渲染延迟**：浏览器每 16.6ms（60Hz）需要执行一次渲染，长时间任务会导致掉帧

## 核心解决方案
将同步任务分解为异步任务分片，允许主线程在任务执行间隙处理渲染和其他事件

---

## 实现方案详解

### 方案一：定时器分片（setTimeout）
```javascript
function processMillionTasks() {
  let tasksRemaining = 1_000_000;
  let progress = 0;

  function processChunk() {
    const start = Date.now();
    while (tasksRemaining > 0 && Date.now() - start < 50) {
      // 执行单个任务
      processTask(progress++);
      tasksRemaining--;
    }

    if (tasksRemaining > 0) {
      setTimeout(processChunk, 0);
    } else {
      console.log("All tasks completed");
    }
  }

  setTimeout(processChunk, 0);
}
```
**特点**：
• 使用时间阈值（50ms）控制单次执行时长
• 每个分片后让出主线程
• 兼容性好，但调度精度较低

---

### 方案二：RAF + 双向链表
```javascript
class TaskScheduler {
  constructor() {
    this.tasks = new LinkedList();
    this.isProcessing = false;
  }

  addTask(task) {
    this.tasks.append(task);
    if (!this.isProcessing) {
      this.schedule();
    }
  }

  schedule() {
    this.isProcessing = true;
    const startTime = performance.now();
    let task = this.tasks.shift();

    while (task && performance.now() - startTime < 8) {
      task.execute();
      task = this.tasks.shift();
    }

    if (this.tasks.size > 0) {
      requestAnimationFrame(() => this.schedule());
    } else {
      this.isProcessing = false;
    }
  }
}
```
**优化点**：
• 使用 `performance.now()` 获取高精度时间
• 双向链表实现 O(1) 复杂度操作
• 配合 RAF 实现帧同步
• 8ms 执行阈值（1000ms/120fps）

---

### 方案三：Web Workers 多线程
```javascript
// 主线程
const worker = new Worker('task-worker.js');
worker.postMessage({ type: 'INIT', total: 1e6 });

worker.onmessage = (e) => {
  if (e.data.type === 'PROGRESS') {
    updateProgress(e.data.value);
  }
};

// worker.js
self.onmessage = function(e) {
  if (e.data.type === 'INIT') {
    processTasks(e.data.total);
  }
};

function processTasks(total) {
  const chunkSize = 5000;
  for (let i = 0; i < total; i += chunkSize) {
    const end = Math.min(i + chunkSize, total);
    // 执行任务分片
    for (let j = i; j < end; j++) {
      processTask(j);
    }
    self.postMessage({ 
      type: 'PROGRESS',
      value: end / total 
    });
  }
}
```
**优势**：
• 完全解放主线程
• 支持 CPU 密集型计算
• 可配合 OffscreenCanvas 处理图形计算

---

### 方案四：Generator + requestIdleCallback
```javascript
function* taskGenerator(total) {
  let i = 0;
  while (i < total) {
    yield i++;
  }
}

function runTasks(total) {
  const generator = taskGenerator(total);
  const idleCallback = (deadline) => {
    while (deadline.timeRemaining() > 5 && !generator.done) {
      const { value } = generator.next();
      processTask(value);
    }
    if (!generator.done) {
      requestIdleCallback(idleCallback);
    }
  };
  requestIdleCallback(idleCallback);
}
```
**特性**：
• 利用空闲期执行任务
• 自动适应浏览器空闲时间
• 需处理超时任务恢复

---

## 性能优化关键指标
1. **单分片时间控制**：建议 8-15ms
2. **内存管理**：
   • 避免闭包内存泄漏
   • 使用 TypedArray 处理大数据
3. **优先级调度**：
   ```javascript
   const PRIORITY = {
     HIGH: 0,
     NORMAL: 1,
     LOW: 2
   };

   class PriorityQueue {
     constructor() {
       this.queue = [[], [], []];
     }
     push(task, priority) {
       this.queue[priority].push(task);
     }
     shift() {
       return this.queue[PRIORITY.HIGH].shift() ||
              this.queue[PRIORITY.NORMAL].shift() ||
              this.queue[PRIORITY.LOW].shift();
     }
   }
   ```

---

## 不同场景选择建议

| 场景特征               | 推荐方案                 | 注意事项                  |
|------------------------|--------------------------|--------------------------|
| 纯计算任务             | Web Workers              | 数据序列化开销           |
| DOM 相关操作           | RAF + 双向链表           | 避免样式抖动             |
| 后台静默任务           | requestIdleCallback      | 可能被高优先级任务打断   |
| 需要精确时序控制       | setTimeout + 时间分片   | 注意计时器精度问题       |
| 混合型复杂任务         | 组合方案（Worker + RAF） | 注意线程间通信频率       |

---

## 调试与监控
1. **Performance 面板分析**
   ```javascript
   function profile() {
     console.profile('Task Processing');
     // 任务执行代码
     console.profileEnd();
   }
   ```
2. **帧率监控**
   ```javascript
   const fpsCounter = new (class {
     constructor() {
       this.frames = 0;
       this.last = performance.now();
       this.raf();
     }
     raf() {
       requestAnimationFrame(() => {
         this.frames++;
         const now = performance.now();
         if (now - this.last >= 1000) {
           console.log(`FPS: ${this.frames}`);
           this.frames = 0;
           this.last = now;
         }
         this.raf();
       });
     }
   })();
   ```

---

## 进阶优化技巧
1. **SIMD 优化**（仅限WebAssembly）
   ```cpp
   // example.cpp
   #include <emmintrin.h>
   void simdProcess(float* data, int len) {
     for (int i = 0; i < len; i += 4) {
       __m128 vec = _mm_load_ps(&data[i]);
       // SIMD 计算
       _mm_store_ps(&data[i], vec);
     }
   }
   ```
2. **内存复用策略**
   ```javascript
   class RecyclableArray {
     constructor(size) {
       this.buffer = new ArrayBuffer(size);
       this.views = new Map();
     }
     getView(type) {
       if (!this.views.has(type)) {
         this.views.set(type, new type(this.buffer));
       }
       return this.views.get(type);
     }
   }
   ```

---

## 最终决策树
```
开始
│
├─ 是否涉及 DOM 操作？
│  ├─ 是 → 采用 RAF 分片方案
│  └─ 否 → 进入下一步
│
├─ 是否 CPU 密集型？
│  ├─ 是 → 使用 Web Workers
│  └─ 否 → 进入下一步
│
├─ 需要后台执行？
│  ├─ 是 → requestIdleCallback
│  └─ 否 → 进入下一步
│
└─ 采用 Generator + 微任务队列
```
