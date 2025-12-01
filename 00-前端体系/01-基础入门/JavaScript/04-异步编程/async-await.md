# async/await

> async/await 是 Promise 的语法糖，让你用写同步代码的方式写异步代码。

---

## 1. 一句话概括主题

async/await 是基于 Promise 的语法糖，让你可以用同步代码的写法来处理异步操作，代码更清晰易读。

---

## 2. 它是什么（像和朋友聊天一样解释）

还记得 Promise 吗？虽然比回调函数好多了，但还是要写 `.then()`、`.catch()`，代码还是有点复杂。

async/await 就像给 Promise 加了一个"魔法"，让你可以这样写：

```javascript
// 用 Promise 的方式（有点复杂）
fetch('/api/user')
  .then(response => response.json())
  .then(user => {
    console.log(user);
  })
  .catch(error => {
    console.error(error);
  });

// 用 async/await 的方式（像同步代码）
async function getUser() {
  try {
    const response = await fetch('/api/user');
    const user = await response.json();
    console.log(user);
  } catch (error) {
    console.error(error);
  }
}
```

是不是看起来像同步代码？这就是 async/await 的魅力！

**简单理解**：async/await = Promise 的"简化版"，让你用写同步代码的方式写异步代码。

---

## 3. 能解决什么问题 + 为什么重要

### 解决的问题

1. **代码更清晰**：不需要写 `.then()`、`.catch()` 链，代码更易读
2. **错误处理更简单**：用 `try/catch` 就能处理错误，和同步代码一样
3. **调试更容易**：可以在异步代码中打断点，像调试同步代码一样
4. **条件判断更自然**：可以用 `if/else` 直接判断异步结果

### 为什么重要

- **现代 JavaScript 的标准**：ES2017 引入，现在是最推荐的异步写法
- **提高开发效率**：代码更短、更清晰，开发更快
- **降低学习成本**：如果你会写同步代码，就会写 async/await
- **更好的错误处理**：统一的错误处理方式

---

## 4. 核心知识点拆解

### 4.1 async 函数

在函数前面加 `async` 关键字，这个函数就变成了异步函数：

```javascript
// 普通函数
function normalFunction() {
  return '普通返回值';
}

// async 函数
async function asyncFunction() {
  return '异步返回值';
}
```

**关键点**：
- async 函数**总是返回 Promise**
- 即使你返回的是普通值，也会被包装成 Promise
- 如果返回 Promise，就直接返回这个 Promise

### 4.2 await 关键字

在 async 函数中使用 `await`，可以"等待" Promise 完成：

```javascript
async function example() {
  // await 会等待 Promise 完成，然后返回结果
  const result = await somePromise();
  // 这行代码会等上面的 Promise 完成后再执行
  console.log(result);
}
```

**关键点**：
- `await` 只能在 `async` 函数中使用
- `await` 会暂停函数执行，等待 Promise 完成
- `await` 返回 Promise 的结果值（如果是 fulfilled）
- 如果 Promise 被 reject，`await` 会抛出错误

### 4.3 错误处理

使用 `try/catch` 处理错误，就像处理同步代码一样：

```javascript
async function example() {
  try {
    const result = await somePromise();
    console.log('成功：', result);
  } catch (error) {
    console.error('失败：', error);
  }
}
```

### 4.4 并行执行

如果需要并行执行多个异步操作，不要用 `await` 一个一个等：

```javascript
// ❌ 错误：串行执行，很慢
async function slow() {
  const result1 = await fetch('/api/1'); // 等 1 秒
  const result2 = await fetch('/api/2'); // 再等 1 秒
  const result3 = await fetch('/api/3'); // 再等 1 秒
  // 总共 3 秒
}

// ✅ 正确：并行执行，很快
async function fast() {
  const [result1, result2, result3] = await Promise.all([
    fetch('/api/1'),
    fetch('/api/2'),
    fetch('/api/3')
  ]);
  // 总共 1 秒（三个请求同时进行）
}
```

### 4.5 async 函数的返回值

async 函数总是返回 Promise：

```javascript
async function getValue() {
  return 42; // 返回普通值
}

// 实际上返回的是 Promise<42>
getValue().then(value => {
  console.log(value); // 42
});

// 等价于
function getValue() {
  return Promise.resolve(42);
}
```

---

## 5. 示例代码（可运行 + 逐行注释）

### 示例 1：基础 async/await 使用

```javascript
// 模拟异步函数
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({
          id: userId,
          name: '小明',
          email: 'xiaoming@example.com'
        });
      } else {
        reject(new Error('用户ID无效'));
      }
    }, 1000);
  });
}

// 使用 async/await
async function getUser(userId) {
  try {
    // await 等待 Promise 完成，然后返回结果
    const user = await fetchUserData(userId);
    // 这行代码会等上面的 Promise 完成后再执行
    console.log('获取用户成功：', user);
    return user;
  } catch (error) {
    // 如果 Promise 失败，会跳到这里
    console.error('获取用户失败：', error.message);
    throw error; // 重新抛出错误
  }
}

// 调用 async 函数
getUser(1)
  .then(user => {
    console.log('用户信息：', user);
  })
  .catch(error => {
    console.error('处理失败：', error);
  });

// 输出：
// 1秒后...
// 获取用户成功： { id: 1, name: '小明', email: 'xiaoming@example.com' }
// 用户信息： { id: 1, name: '小明', email: 'xiaoming@example.com' }
```

### 示例 2：链式异步操作

```javascript
// 模拟多个异步操作
function login(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === '123456') {
        resolve({ token: 'abc123', userId: 1 });
      } else {
        reject(new Error('登录失败'));
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
        reject(new Error('无效token'));
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

// 使用 async/await 链式调用
async function loadDashboard(username, password) {
  try {
    // 第一步：登录
    const auth = await login(username, password);
    console.log('登录成功，token：', auth.token);
    
    // 第二步：获取用户信息（等待上一步完成）
    const userInfo = await getUserInfo(auth.token);
    console.log('用户信息：', userInfo);
    
    // 第三步：获取权限（等待上一步完成）
    const permissions = await getPermissions(auth.userId);
    console.log('权限：', permissions);
    
    // 返回所有数据
    return {
      user: userInfo,
      permissions: permissions
    };
  } catch (error) {
    // 任何一步出错都会到这里
    console.error('加载失败：', error.message);
    throw error;
  }
}

// 使用
loadDashboard('admin', '123456')
  .then(dashboard => {
    console.log('仪表盘加载完成：', dashboard);
  })
  .catch(error => {
    console.error('最终失败：', error);
  });

// 输出：
// 登录成功，token： abc123
// 用户信息： { name: '管理员', role: 'admin' }
// 权限： ['read', 'write', 'delete']
// 仪表盘加载完成： { user: {...}, permissions: [...] }
```

### 示例 3：并行执行多个异步操作

```javascript
// 模拟多个 API 请求
async function fetchData(url) {
  return new Promise((resolve) => {
    const delay = Math.random() * 1000;
    setTimeout(() => {
      resolve({ url, data: `数据来自 ${url}` });
    }, delay);
  });
}

// 并行执行多个请求
async function loadAllData() {
  try {
    // 使用 Promise.all 并行执行
    const [users, posts, comments] = await Promise.all([
      fetchData('/api/users'),
      fetchData('/api/posts'),
      fetchData('/api/comments')
    ]);
    
    console.log('所有数据加载完成：');
    console.log('用户：', users.data);
    console.log('文章：', posts.data);
    console.log('评论：', comments.data);
    
    return { users, posts, comments };
  } catch (error) {
    console.error('加载失败：', error);
    throw error;
  }
}

// 使用
loadAllData()
  .then(data => {
    console.log('全部完成');
  })
  .catch(error => {
    console.error('失败：', error);
  });
```

### 示例 4：条件判断和循环

```javascript
// 使用 async/await 的条件判断
async function checkUserStatus(userId) {
  try {
    const user = await fetchUserData(userId);
    
    // 可以直接用 if/else 判断异步结果
    if (user.role === 'admin') {
      const permissions = await getAdminPermissions();
      return { user, permissions };
    } else {
      const permissions = await getNormalPermissions();
      return { user, permissions };
    }
  } catch (error) {
    console.error('检查失败：', error);
    throw error;
  }
}

// 在循环中使用 async/await
async function processUsers(userIds) {
  const results = [];
  
  // 串行处理（一个接一个）
  for (const userId of userIds) {
    const user = await fetchUserData(userId);
    results.push(user);
  }
  
  // 或者并行处理（同时进行）
  const parallelResults = await Promise.all(
    userIds.map(id => fetchUserData(id))
  );
  
  return { serial: results, parallel: parallelResults };
}
```

---

## 6. 常见错误与踩坑

### 错误 1：忘记写 async

```javascript
// ❌ 错误：没有 async，不能使用 await
function fetchData() {
  const data = await fetch('/api/data'); // 报错！
  return data;
}

// ✅ 正确：加上 async
async function fetchData() {
  const data = await fetch('/api/data');
  return data;
}
```

**为什么错**：`await` 只能在 `async` 函数中使用。

### 错误 2：在非 async 函数中使用 await

```javascript
// ❌ 错误：普通函数中不能使用 await
function handleClick() {
  const data = await fetchData(); // 报错！
  console.log(data);
}

// ✅ 正确：改成 async 函数
async function handleClick() {
  const data = await fetchData();
  console.log(data);
}

// 或者使用 .then()
function handleClick() {
  fetchData().then(data => {
    console.log(data);
  });
}
```

### 错误 3：串行执行应该并行的操作

```javascript
// ❌ 错误：串行执行，很慢
async function slow() {
  const user = await fetch('/api/user');      // 等 1 秒
  const posts = await fetch('/api/posts');    // 再等 1 秒
  const comments = await fetch('/api/comments'); // 再等 1 秒
  // 总共 3 秒
}

// ✅ 正确：并行执行，很快
async function fast() {
  const [user, posts, comments] = await Promise.all([
    fetch('/api/user'),
    fetch('/api/posts'),
    fetch('/api/comments')
  ]);
  // 总共 1 秒
}
```

**为什么错**：如果多个操作互不依赖，应该并行执行，而不是一个一个等。

### 错误 4：忘记处理错误

```javascript
// ❌ 错误：没有错误处理
async function fetchData() {
  const data = await fetch('/api/data');
  return data.json();
  // 如果请求失败，错误没有被捕获
}

// ✅ 正确：添加错误处理
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error('请求失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取数据失败：', error);
    throw error; // 重新抛出，让调用者处理
  }
}
```

---

## 7. 实际应用场景

### 场景 1：API 请求封装

```javascript
// 封装 API 请求
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP错误！状态码：${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API请求失败：', error);
    throw error;
  }
}

// 使用
async function loadUserData() {
  try {
    const user = await apiRequest('/api/user');
    const posts = await apiRequest('/api/posts');
    return { user, posts };
  } catch (error) {
    console.error('加载失败：', error);
    // 显示错误提示给用户
  }
}
```

### 场景 2：文件上传

```javascript
async function uploadFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('上传失败');
    }
    
    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error('上传失败：', error);
    throw error;
  }
}

// 使用
async function handleFileUpload(fileInput) {
  const file = fileInput.files[0];
  if (!file) return;
  
  try {
    const url = await uploadFile(file);
    console.log('上传成功，文件地址：', url);
    // 更新 UI
  } catch (error) {
    console.error('上传失败：', error);
    // 显示错误提示
  }
}
```

### 场景 3：表单提交

```javascript
async function submitForm(formData) {
  try {
    // 验证数据
    if (!formData.email || !formData.password) {
      throw new Error('请填写所有必填项');
    }
    
    // 提交数据
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('提交失败：', error);
    throw error;
  }
}

// 使用
async function handleSubmit(event) {
  event.preventDefault();
  
  const formData = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };
  
  try {
    const result = await submitForm(formData);
    console.log('注册成功：', result);
    // 跳转到登录页
  } catch (error) {
    alert(error.message);
  }
}
```

---

## 8. 给新手的练习题（可立即实践）

### 基础题：创建一个延迟函数

**要求**：
1. 创建一个 `delay` 函数，接受毫秒数
2. 使用 async/await 等待指定时间
3. 调用这个函数，延迟 2 秒后输出"延迟完成"

**参考代码**：
```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testDelay() {
  console.log('开始等待...');
  await delay(2000);
  console.log('延迟完成');
}

testDelay();
```

### 进阶题：顺序执行多个异步操作

**要求**：
1. 创建三个异步函数：`step1()`、`step2()`、`step3()`
2. 每个函数延迟 1 秒后返回"步骤X完成"
3. 使用 async/await 按顺序执行这三个函数
4. 每个步骤输出结果

**提示**：
- 使用 `delay` 函数
- 使用 `await` 等待每个步骤完成

---

## 9. 用更简单的话再总结一遍（方便复习）

**async/await 是什么**：
- 就是 Promise 的"简化版"
- 让你用写同步代码的方式写异步代码

**核心要点**：
1. 函数前面加 `async`，就变成异步函数
2. 在 async 函数中用 `await` 等待 Promise
3. 用 `try/catch` 处理错误，和同步代码一样
4. 需要并行时用 `Promise.all()`
5. async 函数总是返回 Promise

**记住**：
- async/await = Promise 的语法糖
- 代码更清晰，更容易读
- 错误处理更简单

---

## 10. 知识体系延伸 & 继续学习方向

### 相关知识点

- [[Promise|Promise]] - async/await 基于 Promise
- [[回调函数|回调函数]] - 异步编程的演进历史
- [[异步编程最佳实践|异步编程最佳实践]] - async/await 的最佳实践
- [[事件循环机制|事件循环机制]] - async/await 在事件循环中的执行

### 继续学习方向

1. **错误处理**：学习 async/await 的错误处理最佳实践
2. **并发控制**：学习如何控制并发数量
3. **实际应用**：学习在真实项目中使用 async/await
4. **性能优化**：学习如何优化异步代码的性能

---

**最后更新**：2025

#javascript #async-await #异步编程 #前端基础

