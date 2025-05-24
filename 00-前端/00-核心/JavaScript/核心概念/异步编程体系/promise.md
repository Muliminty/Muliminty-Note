# Promise 知识体系

## 一、Promise 基础概念

### 1. 什么是 Promise

Promise 是 JavaScript 中用于处理异步操作的对象，它代表了一个可能现在、将来或永远不会完成的操作的结果。Promise 是 ES6 引入的标准，用于解决传统回调函数带来的"回调地狱"问题。

Promise 最初被提出是在 E 语言中，它是基于并列/并行处理设计的一种编程语言。在 JavaScript 中，Promise 是基于 [Promises/A+](https://promisesaplus.com/) 规范实现的。

### 2. Promise 的状态

Promise 有三种状态：

- **Pending（进行中）**：初始状态，表示异步操作尚未完成
- **Fulfilled（已成功）**：表示异步操作成功完成，且有一个确定的值
- **Rejected（已失败）**：表示异步操作失败，且有一个确定的错误原因

### 3. Promise 的状态吸收

Promise 的状态一旦改变，就会被"吸收"（也称为"状态锁定"），不会再发生变化。这意味着：

- 从 Pending 变为 Fulfilled 后，不能再变为 Rejected
- 从 Pending 变为 Rejected 后，不能再变为 Fulfilled
- 状态一旦确定，就不可逆转

这种特性确保了 Promise 的行为是可预测的，避免了状态的意外变化。

## 二、Promise 的基本用法

### 1. 创建 Promise

```javascript
// 使用 Promise 构造函数创建 Promise
const promise = new Promise((resolve, reject) => {
  // 异步操作
  if (/* 操作成功 */) {
    resolve(value); // 将 Promise 状态从 Pending 变为 Fulfilled
  } else {
    reject(error); // 将 Promise 状态从 Pending 变为 Rejected
  }
});
```

### 2. Promise 的方法

#### 2.1 then()

`then()` 方法用于指定 Promise 状态变为 Fulfilled 时的回调函数，以及可选的 Promise 状态变为 Rejected 时的回调函数。

```javascript
promise.then(
  value => {
    // Promise 成功时的处理
  },
  error => {
    // Promise 失败时的处理（可选）
  }
);
```

#### 2.2 catch()

`catch()` 方法用于指定 Promise 状态变为 Rejected 时的回调函数，相当于 `then(undefined, onRejected)`。

```javascript
promise.catch(error => {
  // Promise 失败时的处理
});
```

#### 2.3 finally()

`finally()` 方法用于指定不管 Promise 状态如何变化都会执行的回调函数。

```javascript
promise.finally(() => {
  // 不管 Promise 成功还是失败都会执行
});
```

### 3. Promise 链式调用

Promise 的一个重要特性是支持链式调用，每次调用 `then()` 或 `catch()` 方法都会返回一个新的 Promise 对象。

```javascript
promise
  .then(value1 => {
    // 处理 value1
    return newValue1; // 返回一个值，会被包装成 Promise
  })
  .then(value2 => {
    // 处理 value2
    return Promise.resolve(newValue2); // 返回一个 Promise
  })
  .catch(error => {
    // 处理前面所有 Promise 中的错误
    console.error(error);
    return recoveryValue; // 可以返回一个恢复值继续链式调用
  })
  .then(value3 => {
    // 处理 value3 或 recoveryValue
  });
```

## 三、Promise 的静态方法

### 1. Promise.resolve()

`Promise.resolve()` 方法返回一个以给定值解析后的 Promise 对象。

```javascript
// 等同于 new Promise(resolve => resolve(value))
const promise = Promise.resolve(value);
```

### 2. Promise.reject()

`Promise.reject()` 方法返回一个带有拒绝原因的 Promise 对象。

```javascript
// 等同于 new Promise((resolve, reject) => reject(reason))
const promise = Promise.reject(reason);
```

### 3. Promise.all()

`Promise.all()` 方法接收一个 Promise 对象数组作为参数，返回一个新的 Promise 对象。当所有 Promise 都成功时，返回的 Promise 状态变为 Fulfilled，值为所有 Promise 结果组成的数组；当任意一个 Promise 失败时，返回的 Promise 状态变为 Rejected，值为第一个失败的 Promise 的错误原因。

```javascript
const promises = [promise1, promise2, promise3];
Promise.all(promises).then(
  values => {
    // 所有 Promise 都成功时的处理
    console.log(values); // [value1, value2, value3]
  },
  error => {
    // 任意一个 Promise 失败时的处理
  }
);
```

### 4. Promise.race()

`Promise.race()` 方法接收一个 Promise 对象数组作为参数，返回一个新的 Promise 对象。当数组中任意一个 Promise 的状态变化时，返回的 Promise 状态跟随该 Promise 变化。

```javascript
const promises = [promise1, promise2, promise3];
Promise.race(promises).then(
  value => {
    // 第一个完成的 Promise 成功时的处理
  },
  error => {
    // 第一个完成的 Promise 失败时的处理
  }
);
```

### 5. Promise.allSettled()

`Promise.allSettled()` 方法接收一个 Promise 对象数组作为参数，返回一个新的 Promise 对象。当所有 Promise 都完成（无论成功或失败）时，返回的 Promise 状态变为 Fulfilled，值为所有 Promise 结果的状态和值组成的对象数组。

```javascript
const promises = [promise1, promise2, promise3];
Promise.allSettled(promises).then(results => {
  // results 是一个对象数组，每个对象表示对应的 Promise 结果
  // { status: 'fulfilled', value: ... } 或 { status: 'rejected', reason: ... }
});
```

### 6. Promise.any()

`Promise.any()` 方法接收一个 Promise 对象数组作为参数，返回一个新的 Promise 对象。当数组中任意一个 Promise 成功时，返回的 Promise 状态变为 Fulfilled，值为第一个成功的 Promise 的值；当所有 Promise 都失败时，返回的 Promise 状态变为 Rejected，值为一个 AggregateError 对象，包含所有失败的原因。

```javascript
const promises = [promise1, promise2, promise3];
Promise.any(promises).then(
  value => {
    // 任意一个 Promise 成功时的处理
  },
  errors => {
    // 所有 Promise 都失败时的处理
    console.log(errors); // AggregateError: All promises were rejected
  }
);
```

## 四、Promise 的错误处理

### 1. 错误处理方式

Promise 提供了多种错误处理方式：

#### 1.1 使用 then() 的第二个参数

```javascript
promise.then(
  value => {
    // 成功处理
  },
  error => {
    // 错误处理
  }
);
```

#### 1.2 使用 catch()

```javascript
promise
  .then(value => {
    // 成功处理
  })
  .catch(error => {
    // 错误处理
  });
```

### 2. then() 与 catch() 的区别

使用 `promise.then(onFulfilled, onRejected)` 的方式，在 `onFulfilled` 中发生的异常无法被 `onRejected` 捕获。而使用 `promise.then(onFulfilled).catch(onRejected)` 的方式，`then` 中产生的异常能在 `catch` 中捕获。

```javascript
// 不推荐的方式
promise.then(
  value => {
    throw new Error('then error'); // 这个错误不会被下面的 onRejected 捕获
  },
  error => {
    console.error('onRejected', error);
  }
);

// 推荐的方式
promise
  .then(value => {
    throw new Error('then error'); // 这个错误会被下面的 catch 捕获
  })
  .catch(error => {
    console.error('catch', error);
  });
```

### 3. 错误冒泡

Promise 链中的错误会沿着链向下传递，直到被捕获。

```javascript
promise
  .then(value => {
    throw new Error('error in first then');
  })
  .then(value => {
    console.log('这里不会执行');
  })
  .catch(error => {
    console.error(error); // 捕获上面抛出的错误
    return 'recovered';
  })
  .then(value => {
    console.log(value); // 'recovered'
  });
```

### 4. 未处理的拒绝（Unhandled Rejection）

如果 Promise 被拒绝但没有提供拒绝处理函数，就会发生未处理的拒绝。现代浏览器通常会在控制台中显示警告。

```javascript
// 这会导致未处理的拒绝警告
Promise.reject(new Error('Rejected Promise'));

// 正确的处理方式
Promise.reject(new Error('Rejected Promise')).catch(error => {
  console.error(error);
});
```

## 五、Promise 的高级应用

### 1. Promise 与异步函数的结合

#### 1.1 Promise 与 setTimeout

```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

delay(1000).then(() => {
  console.log('1秒后执行');
});
```

#### 1.2 Promise 与 AJAX

```javascript
function fetchData(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(new Error(`请求失败：${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error('网络错误'));
    xhr.send();
  });
}

fetchData('https://api.example.com/data')
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

### 2. Promise 的超时处理

```javascript
function timeoutPromise(promise, ms) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Promise timed out after ${ms} ms`));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]);
}

const fetchWithTimeout = timeoutPromise(fetch('https://api.example.com/data'), 5000);
fetchWithTimeout
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 3. Promise 的串行与并行

#### 3.1 串行执行

```javascript
const tasks = [task1, task2, task3]; // 每个任务都返回 Promise

tasks.reduce((promiseChain, currentTask) => {
  return promiseChain.then(chainResults => {
    return currentTask().then(currentResult => {
      return [...chainResults, currentResult];
    });
  });
}, Promise.resolve([])).then(results => {
  console.log(results); // [task1Result, task2Result, task3Result]
});
```

#### 3.2 并行执行

```javascript
const tasks = [task1, task2, task3]; // 每个任务都返回 Promise

Promise.all(tasks.map(task => task()))
  .then(results => {
    console.log(results); // [task1Result, task2Result, task3Result]
  })
  .catch(error => {
    console.error('至少一个任务失败:', error);
  });
```

### 4. Promise 的取消

ES6 Promise 本身不支持取消操作，但可以通过一些技巧实现类似的效果：

```javascript
function createCancelablePromise(promise) {
  let isCanceled = false;
  
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      value => isCanceled ? reject({ isCanceled: true }) : resolve(value),
      error => isCanceled ? reject({ isCanceled: true }) : reject(error)
    );
  });
  
  return {
    promise: wrappedPromise,
    cancel: () => { isCanceled = true; }
  };
}

const { promise, cancel } = createCancelablePromise(fetch('https://api.example.com/data'));

promise
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.isCanceled) {
      console.log('Promise was canceled');
    } else {
      console.error('Error:', error);
    }
  });

// 在某个时刻取消 Promise
cancel();
```

## 六、Promise 与其他异步模式的比较

### 1. Promise vs 回调函数

**回调函数：**
- 简单直接，但容易导致回调地狱
- 错误处理分散，每个回调都需要单独处理错误
- 代码可读性差，逻辑不连续

**Promise：**
- 链式调用，避免回调地狱
- 统一的错误处理机制
- 更好的代码组织和可读性

### 2. Promise vs async/await

**Promise：**
- ES6 标准，兼容性更好
- 链式调用，但多个 then 可能影响可读性
- 错误处理需要使用 catch

**async/await：**
- 基于 Promise 的语法糖，本质上还是使用 Promise
- 使用同步代码的风格编写异步代码，可读性更好
- 可以使用 try/catch 进行错误处理，更接近同步代码
- 更容易实现条件逻辑和循环

```javascript
// Promise 方式
function fetchData() {
  return fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => {
      return fetch(`https://api.example.com/related/${data.id}`);
    })
    .then(response => response.json());
}

// async/await 方式
async function fetchData() {
  const response1 = await fetch('https://api.example.com/data');
  const data = await response1.json();
  const response2 = await fetch(`https://api.example.com/related/${data.id}`);
  return response2.json();
}
```

## 七、Promise 的实现原理

Promise 的实现遵循 [Promises/A+](https://promisesaplus.com/) 规范，核心包括：

1. **状态管理**：维护 Promise 的三种状态（Pending、Fulfilled、Rejected）
2. **then 方法**：注册回调函数，并返回新的 Promise
3. **异步执行**：确保回调函数在当前执行栈清空后才被调用
4. **值的传递**：将 Promise 的值或拒绝原因传递给回调函数

简化的 Promise 实现示例：

```javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    
    const resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(callback => callback());
      }
    };
    
    const reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(callback => callback());
      }
    };
    
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };
    
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      
      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      
      if (this.state === 'pending') {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });
    
    return promise2;
  }
  
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError('Chaining cycle detected for promise'));
    return;
  }
  
  if (x instanceof MyPromise) {
    x.then(value => {
      resolvePromise(promise2, value, resolve, reject);
    }, reject);
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let called = false;
    try {
      const then = x.then;
      if (typeof then === 'function') {
        then.call(x, value => {
          if (called) return;
          called = true;
          resolvePromise(promise2, value, resolve, reject);
        }, reason => {
          if (called) return;
          called = true;
          reject(reason);
        });
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}
```

## 八、Promise 的最佳实践

### 1. 始终返回 Promise

在异步函数中始终返回 Promise，保持一致的接口。

```javascript
// 不好的做法
function getData(id) {
  if (id < 0) {
    return null; // 同步返回
  }
  return fetch(`/api/data/${id}`); // 异步返回 Promise
}

// 好的做法
function getData(id) {
  if (id < 0) {
    return Promise.reject(new Error('Invalid ID')); // 始终返回 Promise
  }
  return fetch(`/api/data/${id}`);
}
```

### 2. 正确处理错误

始终为 Promise 链添加错误处理。

```javascript
// 不好的做法
fetch('/api/data')
  .then(response => response.json())
  .then(data => processData(data));

// 好的做法
fetch('/api/data')
  .then(response => response.json())
  .then(data => processData(data))
  .catch(error => {
    console.error('Error:', error);
    // 适当的错误处理
  });
```

### 3. 避免嵌套 Promise

利用 Promise 链而不是嵌套 Promise。

```javascript
// 不好的做法
fetch('/api/user')
  .then(response => response.json())
  .then(user => {
    fetch(`/api/posts/${user.id}`)
      .then(response => response.json())
      .then(posts => {
        console.log(posts);
      });
  });

// 好的做法
fetch('/api/user')
  .then(response => response.json())
  .then(user => fetch(`/api/posts/${user.id}`))
  .then(response => response.json())
  .then(posts => {
    console.log(posts);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### 4. 并行处理多个 Promise

使用 `Promise.all()` 并行处理多个独立的 Promise。

```javascript
const userPromise = fetch('/api/user').then(r => r.json());
const postsPromise = fetch('/api/posts').then(r => r.json());
const commentsPromise = fetch('/api/comments').then(r => r.json());

Promise.all([userPromise, postsPromise, commentsPromise])
  .then(([user, posts, comments]) => {
    // 所有数据都已获取
    console.log(user, posts, comments);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### 5. 使用 async/await 简化 Promise 代码

在现代 JavaScript 中，使用 async/await 可以使 Promise 代码更加清晰。

```javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/user/${userId}`);
    const user = await response.json();
    const postsResponse = await fetch(`/api/posts/${user.id}`);
    const posts = await postsResponse.json();
    return { user, posts };
  } catch (error) {
    console.error('Error:', error);
    throw error; // 重新抛出错误以便调用者处理
  }
}

// 使用
fetchUserData(123)
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    // 处理错误
  });
```

## 九、参考资源

- [JavaScript Promise迷你书（中文版）](碎片整理/剪藏/JavaScript%20Promise迷你书（中文版）.md)
- [MDN Web Docs: Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Promises/A+ 规范](https://promisesaplus.com/)
- [ES6 标准入门 - Promise 对象](http://es6.ruanyifeng.com/#docs/promise)