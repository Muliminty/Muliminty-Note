# Promise

> Promise 是 JavaScript 处理异步操作的现代方式，让你告别"回调地狱"。

---

## 1. 一句话概括主题

Promise 是一个表示异步操作最终完成或失败的对象，它让你可以用更清晰的方式处理异步代码。

---

## 2. 它是什么

想象你要点外卖，以前的方式（回调函数）就像这样：
- 你打电话点餐
- 服务员说："好的，做好了我会打电话给你"
- 然后你只能干等着，不知道什么时候会来

Promise 就像给你一个"订单号"：
- 你点餐后得到一个订单号（Promise）
- 这个订单号有三种状态：等待中、已完成、已失败
- 你可以随时查看订单状态，也可以设置"完成时做什么"、"失败时做什么"

**简单理解**：Promise = 一个"承诺"，告诉你"这个异步操作最终会成功或失败，你可以提前安排好成功和失败时要做的事"。

---

## 3. 能解决什么问题 + 为什么重要

### 解决的问题

1. **回调地狱（Callback Hell）**：多层嵌套的回调函数，代码难以阅读和维护
2. **错误处理困难**：每个回调都要单独处理错误，容易遗漏
3. **无法链式调用**：回调函数无法优雅地串联多个异步操作
4. **无法同时处理多个异步操作**：难以等待多个异步操作全部完成

### 为什么重要

- **现代 JavaScript 的基础**：async/await 基于 Promise，是现代异步编程的核心
- **提高代码可读性**：让异步代码看起来像同步代码
- **更好的错误处理**：统一的错误处理机制
- **链式调用**：可以优雅地串联多个异步操作

---

## 4. 核心知识点拆解

### 4.1 Promise 的三种状态

Promise 有三种状态，一旦改变就不能再变：

1. **pending（等待中）**：初始状态，既不是成功也不是失败
2. **fulfilled（已完成）**：操作成功完成
3. **rejected（已失败）**：操作失败

```javascript
// Promise 的状态转换
pending → fulfilled（成功）
pending → rejected（失败）
```

### 4.2 创建 Promise

使用 `new Promise()` 创建 Promise：

```javascript
// 基本语法
const promise = new Promise((resolve, reject) => {
  // 异步操作
  // 成功时调用 resolve(结果)
  // 失败时调用 reject(错误)
});
```

**参数说明**：
- `resolve`：成功时调用的函数，传入结果值
- `reject`：失败时调用的函数，传入错误信息

### 4.3 使用 Promise

使用 `.then()` 处理成功，`.catch()` 处理失败：

```javascript
promise
  .then(result => {
    // 成功时的处理
    console.log('成功：', result);
  })
  .catch(error => {
    // 失败时的处理
    console.log('失败：', error);
  });
```

### 4.4 Promise 链式调用

Promise 可以链式调用，每个 `.then()` 返回一个新的 Promise：

```javascript
promise
  .then(result => {
    // 第一个操作
    return processData(result);
  })
  .then(processedData => {
    // 第二个操作
    return saveData(processedData);
  })
  .then(savedData => {
    // 第三个操作
    console.log('保存成功：', savedData);
  })
  .catch(error => {
    // 任何一步出错都会到这里
    console.error('出错：', error);
  });
```

### 4.5 Promise 的静态方法

#### Promise.resolve()

创建一个立即成功的 Promise：

```javascript
const promise = Promise.resolve('成功的结果');
// 等同于
const promise = new Promise(resolve => resolve('成功的结果'));
```

#### Promise.reject()

创建一个立即失败的 Promise：

```javascript
const promise = Promise.reject('错误信息');
// 等同于
const promise = new Promise((resolve, reject) => reject('错误信息'));
```

#### Promise.all()

等待所有 Promise 都成功，如果有一个失败就立即失败：

```javascript
const promise1 = fetch('/api/user');
const promise2 = fetch('/api/posts');
const promise3 = fetch('/api/comments');

Promise.all([promise1, promise2, promise3])
  .then(results => {
    // 所有请求都成功
    const [user, posts, comments] = results;
    console.log('全部完成');
  })
  .catch(error => {
    // 任何一个失败都会到这里
    console.error('有请求失败：', error);
  });
```

#### Promise.allSettled()

等待所有 Promise 完成（无论成功或失败）：

```javascript
Promise.allSettled([promise1, promise2, promise3])
  .then(results => {
    // 所有 Promise 都完成了，无论成功或失败
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Promise ${index} 成功：`, result.value);
      } else {
        console.log(`Promise ${index} 失败：`, result.reason);
      }
    });
  });
```

#### Promise.race()

返回第一个完成的 Promise（无论成功或失败）：

```javascript
Promise.race([promise1, promise2, promise3])
  .then(result => {
    // 第一个完成的 Promise 的结果
    console.log('最快的完成了：', result);
  })
  .catch(error => {
    // 如果第一个完成的是失败的
    console.error('最快的失败了：', error);
  });
```

---

## 5. 示例代码（可运行 + 逐行注释）

### 示例 1：基础 Promise 使用

```javascript
// 创建一个模拟异步操作的 Promise
function fetchUserData(userId) {
  // 返回一个新的 Promise
  return new Promise((resolve, reject) => {
    // 模拟网络请求延迟
    setTimeout(() => {
      // 模拟成功情况
      if (userId > 0) {
        const userData = {
          id: userId,
          name: '小明',
          email: 'xiaoming@example.com'
        };
        // 成功时调用 resolve，传入数据
        resolve(userData);
      } else {
        // 失败时调用 reject，传入错误信息
        reject(new Error('用户ID无效'));
      }
    }, 1000); // 1秒后返回结果
  });
}

// 使用 Promise
fetchUserData(1)
  .then(user => {
    // 成功时的处理
    console.log('获取用户数据成功：', user);
    return user; // 可以返回数据给下一个 then
  })
  .then(user => {
    // 链式调用：处理上一步返回的数据
    console.log('用户名：', user.name);
  })
  .catch(error => {
    // 失败时的处理
    console.error('获取用户数据失败：', error.message);
  });

// 输出：
// 1秒后...
// 获取用户数据成功： { id: 1, name: '小明', email: 'xiaoming@example.com' }
// 用户名： 小明
```

### 示例 2：Promise 链式调用

```javascript
// 模拟多个异步操作
function login(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === '123456') {
        resolve({ token: 'abc123', userId: 1 });
      } else {
        reject(new Error('用户名或密码错误'));
      }
    }, 500);
  });
}

function getUserInfo(token) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token) {
        resolve({ name: '管理员', role: 'admin' });
      } else {
        reject(new Error('无效的token'));
      }
    }, 300);
  });
}

function getPermissions(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['read', 'write', 'delete']);
    }, 200);
  });
}

// 链式调用多个异步操作
login('admin', '123456')
  .then(authResult => {
    // 第一步：登录成功，获取 token
    console.log('登录成功，token：', authResult.token);
    // 返回 token 给下一步
    return getUserInfo(authResult.token);
  })
  .then(userInfo => {
    // 第二步：获取用户信息成功
    console.log('用户信息：', userInfo);
    // 返回用户ID给下一步
    return getPermissions(1);
  })
  .then(permissions => {
    // 第三步：获取权限成功
    console.log('用户权限：', permissions);
    console.log('所有操作完成！');
  })
  .catch(error => {
    // 任何一步出错都会到这里
    console.error('操作失败：', error.message);
  });

// 输出：
// 登录成功，token： abc123
// 用户信息： { name: '管理员', role: 'admin' }
// 用户权限： ['read', 'write', 'delete']
// 所有操作完成！
```

### 示例 3：Promise.all() 并发处理

```javascript
// 模拟多个并发的 API 请求
function fetchData(url) {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 1000; // 随机延迟
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% 成功率
        resolve({ url, data: `数据来自 ${url}` });
      } else {
        reject(new Error(`${url} 请求失败`));
      }
    }, delay);
  });
}

// 并发请求多个接口
const urls = ['/api/users', '/api/posts', '/api/comments'];

Promise.all(urls.map(url => fetchData(url)))
  .then(results => {
    // 所有请求都成功
    console.log('所有请求完成：');
    results.forEach(result => {
      console.log(result.data);
    });
  })
  .catch(error => {
    // 任何一个请求失败
    console.error('有请求失败：', error.message);
  });
```

---

## 6. 常见错误与踩坑

### 错误 1：忘记返回 Promise

```javascript
// ❌ 错误：没有返回 Promise
function fetchData() {
  fetch('/api/data')
    .then(response => response.json());
  // 没有 return，外部无法使用这个 Promise
}

// ✅ 正确：返回 Promise
function fetchData() {
  return fetch('/api/data')
    .then(response => response.json());
}
```

**为什么错**：如果不返回 Promise，外部代码无法链式调用或等待结果。

### 错误 2：在 Promise 中抛出错误但没有 catch

```javascript
// ❌ 错误：错误没有被捕获
new Promise((resolve, reject) => {
  throw new Error('出错了！');
  // 这个错误会被 Promise 捕获，但如果没有 catch，会变成未处理的错误
});

// ✅ 正确：添加 catch 处理错误
new Promise((resolve, reject) => {
  throw new Error('出错了！');
})
  .catch(error => {
    console.error('捕获到错误：', error);
  });
```

**为什么错**：Promise 中的错误如果不被 catch，会变成"未处理的 Promise 拒绝"，可能导致程序崩溃。

### 错误 3：在 then 中忘记返回 Promise

```javascript
// ❌ 错误：链式调用中断
promise
  .then(result => {
    // 执行异步操作，但没有返回 Promise
    fetch('/api/process', {
      method: 'POST',
      body: JSON.stringify(result)
    });
    // 没有 return，下一个 then 会立即执行，无法等待这个请求完成
  })
  .then(data => {
    // 这里拿不到上面的请求结果
    console.log(data); // undefined
  });

// ✅ 正确：返回 Promise
promise
  .then(result => {
    // 返回 Promise，链式调用可以继续
    return fetch('/api/process', {
      method: 'POST',
      body: JSON.stringify(result)
    });
  })
  .then(response => response.json())
  .then(data => {
    // 可以拿到上面的请求结果
    console.log(data);
  });
```

**为什么错**：如果不返回 Promise，下一个 `.then()` 无法等待异步操作完成，会立即执行。

### 错误 4：Promise.all() 中有一个失败就全部失败

```javascript
// ❌ 如果只想要成功的结果，但有一个失败就全部失败
Promise.all([promise1, promise2, promise3])
  .then(results => {
    // 如果 promise2 失败，这里不会执行
    console.log(results);
  });

// ✅ 正确：使用 allSettled 或单独处理每个 Promise
Promise.allSettled([promise1, promise2, promise3])
  .then(results => {
    // 所有 Promise 都完成，可以分别处理成功和失败
    const successful = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);
    console.log('成功的结果：', successful);
  });
```

---

## 7. 实际应用场景

### 场景 1：API 请求

```javascript
// 封装 API 请求函数
function apiRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP错误！状态码：${response.status}`);
        }
        return response.json();
      })
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
}

// 使用
apiRequest('/api/users')
  .then(users => {
    console.log('用户列表：', users);
  })
  .catch(error => {
    console.error('请求失败：', error);
  });
```

### 场景 2：文件上传

```javascript
function uploadFile(file) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    
    fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          resolve(data.url);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(error => reject(error));
  });
}

// 使用
uploadFile(fileInput.files[0])
  .then(url => {
    console.log('上传成功，文件地址：', url);
  })
  .catch(error => {
    console.error('上传失败：', error);
  });
```

### 场景 3：等待多个操作完成

```javascript
// 加载用户数据、文章列表、评论列表
function loadDashboard() {
  const userPromise = fetch('/api/user').then(r => r.json());
  const postsPromise = fetch('/api/posts').then(r => r.json());
  const commentsPromise = fetch('/api/comments').then(r => r.json());
  
  return Promise.all([userPromise, postsPromise, commentsPromise])
    .then(([user, posts, comments]) => {
      return {
        user,
        posts,
        comments
      };
    });
}

// 使用
loadDashboard()
  .then(dashboard => {
    console.log('仪表盘数据加载完成：', dashboard);
    // 渲染页面
  })
  .catch(error => {
    console.error('加载失败：', error);
    // 显示错误提示
  });
```

---

## 8. 给新手的练习题（可立即实践）

### 基础题：创建一个延迟函数

**要求**：
1. 创建一个 `delay` 函数，接受一个数字（毫秒数）
2. 返回一个 Promise，在指定时间后成功
3. 使用这个函数延迟 2 秒后输出"延迟完成"

**参考代码**：
```javascript
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

// 使用
delay(2000)
  .then(() => {
    console.log('延迟完成');
  });
```

### 进阶题：顺序执行多个异步操作

**要求**：
1. 创建三个异步函数：`step1()`、`step2()`、`step3()`
2. 每个函数返回一个 Promise，延迟 1 秒后成功
3. 使用 Promise 链式调用，按顺序执行这三个函数
4. 每个步骤输出"步骤X完成"

**提示**：
- 使用 `delay` 函数创建延迟
- 使用 `.then()` 链式调用

---

## 9. 用更简单的话再总结一遍（方便复习）

**Promise 是什么**：
- 就是一个"承诺"，告诉你异步操作最终会成功或失败
- 有三种状态：等待中、成功、失败

**核心要点**：
1. 用 `new Promise()` 创建
2. 成功调用 `resolve()`，失败调用 `reject()`
3. 用 `.then()` 处理成功，`.catch()` 处理失败
4. 可以链式调用，一个接一个执行
5. `Promise.all()` 等待所有完成，`Promise.race()` 等待第一个完成

**记住**：
- Promise = 异步操作的"订单号"
- 可以提前安排好成功和失败时做什么
- 让异步代码更容易阅读和维护

---

## 10. 知识体系延伸 & 继续学习方向

### 相关知识点

- [[回调函数|回调函数]] - Promise 之前处理异步的方式
- [[async-await|async/await]] - 基于 Promise 的语法糖，让异步代码更像同步代码
- [[异步编程最佳实践|异步编程最佳实践]] - 异步编程的最佳实践和常见模式
- [[事件循环机制|事件循环机制]] - Promise 在事件循环中的执行机制

### 继续学习方向

1. **async/await**：学习更现代的异步语法，基于 Promise
2. **错误处理**：学习 Promise 的错误处理最佳实践
3. **并发控制**：学习如何使用 Promise.all、Promise.race 等
4. **实际应用**：学习在真实项目中使用 Promise

---

**最后更新**：2025

#javascript #promise #异步编程 #前端基础

