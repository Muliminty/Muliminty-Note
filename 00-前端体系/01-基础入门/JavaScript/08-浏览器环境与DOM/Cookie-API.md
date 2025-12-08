# Cookie API

## 1. 一句话概括主题

Cookie 是浏览器存储的小型文本数据，用于在客户端和服务器之间传递状态信息，常用于用户登录、购物车、个性化设置等场景。

---

## 2. 它是什么

想象一下，你去咖啡店买咖啡，店员给你一张会员卡，上面记录了你的积分、偏好口味等信息。下次再来时，店员看到这张卡就知道你是谁，喜欢什么口味的咖啡。

Cookie 就像这张"会员卡"：浏览器访问网站时，服务器可以给浏览器"发一张卡"（设置 Cookie），浏览器会把这张"卡"保存起来。下次再访问这个网站时，浏览器会"出示这张卡"（自动发送 Cookie），服务器就知道你是谁了。

**打个比方**：
- **Cookie**：就像咖啡店的会员卡，记录你的信息
- **设置 Cookie**：就像店员给你发卡
- **读取 Cookie**：就像店员看你的卡，知道你的信息
- **删除 Cookie**：就像你丢了卡，需要重新办一张

**举个例子**：
- 登录网站后，网站设置一个 Cookie 记录你的登录状态，下次访问时自动登录
- 购物网站用 Cookie 记录你购物车里的商品
- 网站用 Cookie 记住你的语言偏好、主题设置等

---

## 3. 能解决什么问题 + 为什么重要

### 解决的痛点

1. **HTTP 无状态问题**：HTTP 协议本身是无状态的，每次请求都是独立的，服务器不知道你是谁
2. **用户身份识别**：需要一种方式让服务器识别用户身份，实现登录状态保持
3. **个性化体验**：需要记住用户的偏好设置，提供个性化服务
4. **购物车等临时数据**：需要临时存储用户的操作数据

### 为什么重要

- **用户体验**：实现"记住我"功能，用户不需要每次都登录
- **状态管理**：在无状态的 HTTP 协议上实现有状态的交互
- **数据持久化**：在浏览器关闭后仍能保存数据（相比 SessionStorage）
- **跨页面通信**：同一域名下的不同页面可以共享数据

---

## 4. 核心知识点拆解

### 基本概念

**Cookie**：存储在浏览器中的小型文本数据（最大 4KB），由服务器通过 `Set-Cookie` 响应头设置，浏览器会自动在后续请求中通过 `Cookie` 请求头发送。

**Cookie 的组成**：
- **名称（Name）**：Cookie 的名称
- **值（Value）**：Cookie 的值
- **域名（Domain）**：Cookie 所属的域名
- **路径（Path）**：Cookie 的作用路径
- **过期时间（Expires/Max-Age）**：Cookie 的有效期
- **安全标志（Secure）**：是否只在 HTTPS 下发送
- **SameSite**：是否允许跨站请求携带 Cookie

### 必会概念与关键字

#### 1. **Domain（域名）**

指定 Cookie 所属的域名，决定哪些域名可以访问这个 Cookie。**这是实现跨子域 Cookie 共享的关键属性。**

```js
// 设置 Cookie 的域名
// domain=.example.com 表示 example.com 及其所有子域名都能访问
document.cookie = "token=abc123; domain=.example.com; path=/";

// 示例：
// 在 sso.example.com 设置 domain=.example.com
// 那么 oa.example.com、app.example.com 等子域名都能访问这个 Cookie
```

**Domain 规则**：
- 不设置 `domain`：默认是当前域名（不包括子域名）
- `domain=.example.com`：所有 `*.example.com` 的子域名都能访问
- `domain=example.com`：等价于 `domain=.example.com`
- 不能设置为其他域名（如 `domain=other.com`）
- 不能设置为公共顶级域（如 `domain=.com`、`domain=.cn`）

```js
// ❌ 错误：不能设置为其他域名
document.cookie = "token=abc; domain=other.com"; // 无效

// ❌ 错误：不能设置为公共顶级域
document.cookie = "token=abc; domain=.com"; // 浏览器会阻止
document.cookie = "token=abc; domain=.cn"; // 浏览器会阻止

// ✅ 正确：设置为当前域名的父域名
// 当前在 app.example.com
document.cookie = "token=abc; domain=.example.com"; // 所有 *.example.com 都能访问
```

### 为什么两个站点的 Cookie 不共享？

**核心原因：不同的子域名默认不会自动共享 Cookie**

**实际案例**：

假设你有两个站点：
- **站点 A**：`http://site-a.example.com`
- **站点 B**：`http://site-b.example.com`

它们是两个不同的子域名：
- `site-a.example.com`
- `site-b.example.com`

**默认情况下**：

```js
// 在站点 A（site-a.example.com）设置 Cookie
document.cookie = "token=abc123; path=/";

// 浏览器默认会设置：
// Domain=site-a.example.com（不包含点）
// 或者 Domain=site-a.example.com（精确域名）

// 结果：
// ✅ 站点 A 能读取：document.cookie → "token=abc123"
// ❌ 站点 B 读不到：document.cookie → ""（空）
```

**为什么站点 B 看不到？**

因为 Cookie 的 Domain 默认是**精确的当前域名**，不包括其他子域名：

| 设置方式 | Domain 值 | 站点 A 能访问 | 站点 B 能访问 | 说明 |
|---|---|---|---|---|
| 不设置 domain | `site-a.example.com` | ✅ | ❌ | 默认只对当前域名有效 |
| `domain=site-a.example.com` | `site-a.example.com` | ✅ | ❌ | 精确域名，只有站点 A 能访问 |
| `domain=.example.com` | `.example.com` | ✅ | ✅ | **父域名，所有子域名都能访问** |

### Domain 的三种情况详解

#### 情况1：Domain=精确子域（默认，不共享）

```js
// 在 site-a.example.com 设置
document.cookie = "token=abc123; path=/";
// 浏览器默认：Domain=site-a.example.com

// 结果：
// ✅ site-a.example.com 能读
// ❌ site-b.example.com 读不到
// ❌ 其他子域名都读不到
```

#### 情况2：Domain=父域（跨子域共享，推荐）

```js
// 在 site-a.example.com 设置
document.cookie = "token=abc123; path=/; domain=.example.com";
// 显式指定：Domain=.example.com

// 结果：
// ✅ site-a.example.com 能读
// ✅ site-b.example.com 能读
// ✅ 所有 *.example.com 的子域名都能读
```

**注意**：`domain` 前面必须加 `.`（点），表示包含所有子域名。

#### 情况3：Domain=其他域名（不允许）

```js
// ❌ 错误：不能设置为其他域名
document.cookie = "token=abc123; domain=other.com"; // 无效，浏览器会忽略

// ❌ 错误：不能设置为公共顶级域
document.cookie = "token=abc123; domain=.com"; // 浏览器会阻止
document.cookie = "token=abc123; domain=.cn"; // 浏览器会阻止
```

### 如何在控制台正确设置跨子域 Cookie？

**场景**：在站点 A（`site-a.example.com`）设置 Cookie，让站点 B（`site-b.example.com`）也能访问。

**正确做法**：

```js
// 在站点 A 的浏览器控制台输入：
document.cookie = "token=abc123; path=/; domain=.example.com";
```

**关键点**：
1. ✅ **domain 前要加 `.`**（点）：`domain=.example.com`
2. ✅ **必须是两个站点共同的父域**：`.example.com` 是 `site-a` 和 `site-b` 的共同父域
3. ✅ **path 必须为 `/`**：才能全站可见
4. ⚠️ **如果是 HTTPS，注意 secure 标志**：如果设置了 `secure`，必须在 HTTPS 环境下才能设置

**验证方法**：

```js
// 1. 在站点 A 控制台设置
document.cookie = "token=abc123; path=/; domain=.example.com";
console.log("站点 A Cookie:", document.cookie);
// 输出：token=abc123

// 2. 打开站点 B，在控制台查看
console.log("站点 B Cookie:", document.cookie);
// 输出：token=abc123（如果设置成功）
```

**完整测试脚本**：

```js
// 在站点 A（site-a.example.com）控制台执行
function setCrossDomainCookie(name, value, parentDomain) {
  // 提取父域名（去掉当前子域名部分）
  // 例如：site-a.example.com → .example.com
  const domain = parentDomain.startsWith('.') 
    ? parentDomain 
    : `.${parentDomain}`;
  
  // 设置 Cookie
  document.cookie = `${name}=${value}; path=/; domain=${domain}`;
  
  console.log(`Cookie 设置完成: ${name}=${value}`);
  console.log(`Domain: ${domain}`);
  console.log(`当前 Cookie: ${document.cookie}`);
}

// 使用示例
setCrossDomainCookie('token', 'abc123', '.example.com');

// 验证：在站点 B（site-b.example.com）控制台执行
console.log('站点 B Cookie:', document.cookie);
// 应该能看到：token=abc123
```

### 常见错误示例

```js
// ❌ 错误1：忘记设置 domain
document.cookie = "token=abc123; path=/";
// 结果：只有当前域名能访问，其他子域名看不到

// ❌ 错误2：domain 前面忘记加点
document.cookie = "token=abc123; path=/; domain=example.com";
// 虽然可能工作，但不是最佳实践，建议加 .

// ❌ 错误3：设置了错误的父域
document.cookie = "token=abc123; path=/; domain=.other.com";
// 如果当前是 site-a.example.com，这个设置可能无效
// 必须设置为 .example.com

// ✅ 正确：domain 前面加点，使用正确的父域
document.cookie = "token=abc123; path=/; domain=.example.com";
// 所有 *.example.com 的子域名都能访问
```

### HTTPS 环境下的注意事项

如果项目使用 HTTPS，需要注意：

```js
// ❌ 错误：在 HTTP 下设置 secure Cookie（会被忽略）
// 如果当前是 http://site-a.example.com
document.cookie = "token=abc123; path=/; domain=.example.com; secure";
// secure Cookie 在 HTTP 下无法设置

// ✅ 正确1：在 HTTPS 下设置 secure Cookie
// 如果当前是 https://site-a.example.com
document.cookie = "token=abc123; path=/; domain=.example.com; secure";

// ✅ 正确2：在 HTTP 下不设置 secure
// 如果当前是 http://site-a.example.com
document.cookie = "token=abc123; path=/; domain=.example.com";
// 不设置 secure，在 HTTP 和 HTTPS 下都能工作
```

#### 2. **Path（路径）**

指定 Cookie 的作用路径，只有在该路径下的页面才能访问这个 Cookie。

```js
// 设置 Cookie 的路径
document.cookie = "token=abc123; path=/";

// 示例：
// path=/ 表示所有路径都能访问
// path=/admin 表示只有 /admin 及其子路径能访问
```

**Path 规则**：
- `path=/`：所有路径都能访问（最常用）
- `path=/admin`：只有 `/admin`、`/admin/users` 等路径能访问
- 不设置 `path`：默认为当前路径

```js
// 在 https://example.com/admin 设置
document.cookie = "admin_token=abc; path=/admin";
// 这个 Cookie 只能在 /admin、/admin/users 等路径下访问
// 在 /home 路径下无法访问
```

#### 3. **Expires 和 Max-Age（过期时间）**

控制 Cookie 的有效期。

```js
// 方式1：使用 Expires（指定具体过期时间）
const expireDate = new Date();
expireDate.setTime(expireDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7天后
document.cookie = `token=abc; expires=${expireDate.toUTCString()}; path=/`;

// 方式2：使用 Max-Age（指定存活秒数，推荐）
document.cookie = "token=abc; max-age=604800; path=/"; // 7天 = 7 * 24 * 60 * 60 秒

// 会话 Cookie（浏览器关闭后删除）
document.cookie = "session_id=abc; path=/"; // 不设置 expires 或 max-age
```

**区别**：
- `Expires`：指定具体的过期日期时间（UTC 格式）
- `Max-Age`：指定存活秒数（更简单，推荐使用）
- 都不设置：会话 Cookie，浏览器关闭后删除

#### 4. **Secure（安全标志）**

只在 HTTPS 连接下发送 Cookie，防止被窃取。

```js
// 只在 HTTPS 下发送
document.cookie = "token=abc; secure; path=/";

// 注意：在 HTTP 下设置 secure Cookie 会被忽略
// 必须使用 HTTPS 才能设置 secure Cookie
```

#### 5. **HttpOnly（仅 HTTP）**

禁止 JavaScript 访问 Cookie，只能通过 HTTP 请求发送，防止 XSS 攻击。

```js
// ❌ 注意：HttpOnly 只能由服务器通过 Set-Cookie 响应头设置
// 前端 JavaScript 无法设置 HttpOnly

// 服务器端设置（Node.js 示例）
res.setHeader('Set-Cookie', 'token=abc; HttpOnly; Secure; SameSite=Strict');

// 前端无法读取 HttpOnly Cookie
console.log(document.cookie); // 不会显示 HttpOnly 的 Cookie
```

#### 6. **SameSite（同站策略）**

控制 Cookie 是否在跨站请求中发送，防止 CSRF 攻击。

```js
// SameSite 有三个值：Strict、Lax、None

// Strict：完全禁止跨站发送（最严格）
document.cookie = "token=abc; SameSite=Strict; path=/";
// 只有从同一站点发起的请求才会携带这个 Cookie

// Lax：允许部分跨站请求（默认值，推荐）
document.cookie = "token=abc; SameSite=Lax; path=/";
// GET 请求（如链接跳转）会携带，POST 请求不会

// None：允许所有跨站请求（需要配合 Secure）
document.cookie = "token=abc; SameSite=None; Secure; path=/";
// 所有跨站请求都会携带（必须使用 HTTPS）
```

**SameSite 对比**：

| 值 | GET 请求（链接跳转） | POST 请求（表单提交） | 跨站 iframe | 说明 |
|---|---|---|---|---|
| Strict | ❌ 不发送 | ❌ 不发送 | ❌ 不发送 | 最安全，但可能影响用户体验 |
| Lax | ✅ 发送 | ❌ 不发送 | ❌ 不发送 | 平衡安全性和用户体验（默认） |
| None | ✅ 发送 | ✅ 发送 | ✅ 发送 | 需要配合 Secure，允许所有跨站请求 |

### 关联知识

- Cookie → [[HTTP 基础]] — HTTP 协议中的 Cookie 机制
- Cookie → [[单点登录方案]] — SSO 中 Cookie 的应用
  - [[单点登录方案#方案一：同域 Cookie 共享（最简单）]] — 使用 Cookie 实现 SSO 的完整示例
  - [[单点登录方案#错误1：Cookie 域名设置错误，导致子域名无法共享]] — 常见错误及解决方案
- SameSite → [[XSS-CSRF原理与防护]] — 安全防护机制
- HttpOnly → [[XSS-CSRF原理与防护]] — XSS 攻击防护
- Domain → [[单点登录方案#Cookie 共享]] — 跨域 Cookie 共享在 SSO 中的应用

### 常见误解说明与纠正

**误解1**：Cookie 可以存储大量数据
- **纠正**：Cookie 最大只有 4KB，不适合存储大量数据，应该用 localStorage 或 sessionStorage

**误解2**：设置 `domain=.example.com` 可以让其他域名访问
- **纠正**：`domain` 只能设置为当前域名或其父域名，不能设置为其他域名

**误解3**：前端可以设置 HttpOnly Cookie
- **纠正**：HttpOnly 只能由服务器通过 `Set-Cookie` 响应头设置，前端 JavaScript 无法设置

**误解4**：SameSite=None 不需要 Secure
- **纠正**：Chrome 等浏览器要求 `SameSite=None` 必须配合 `Secure` 使用，否则会被忽略

---

## 5. 示例代码（可运行 + 逐行注释）

### 基础操作：设置、读取、删除 Cookie

```js
// ========== Cookie 工具类 ==========
class CookieUtil {
  // 设置 Cookie
  static set(name, value, options = {}) {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    // 设置过期时间（优先使用 max-age）
    if (options.maxAge) {
      cookieString += `; max-age=${options.maxAge}`;
    } else if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }
    
    // 设置路径
    if (options.path) {
      cookieString += `; path=${options.path}`;
    } else {
      cookieString += `; path=/`; // 默认根路径
    }
    
    // 设置域名
    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }
    
    // 设置 Secure（只在 HTTPS 下发送）
    if (options.secure) {
      cookieString += `; secure`;
    }
    
    // 设置 SameSite
    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`;
      // SameSite=None 必须配合 Secure
      if (options.sameSite === 'None' && !options.secure) {
        console.warn('SameSite=None 需要配合 Secure 使用');
        cookieString += `; secure`;
      }
    }
    
    // 设置 Cookie
    document.cookie = cookieString;
  }
  
  // 读取 Cookie
  static get(name) {
    // 获取所有 Cookie
    const cookies = document.cookie.split('; ');
    
    // 遍历查找目标 Cookie
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      // 解码并比较名称
      if (decodeURIComponent(cookieName) === name) {
        return decodeURIComponent(cookieValue || '');
      }
    }
    
    return null; // 未找到返回 null
  }
  
  // 读取所有 Cookie
  static getAll() {
    const cookies = {};
    const cookieString = document.cookie;
    
    if (!cookieString) {
      return cookies;
    }
    
    // 分割所有 Cookie
    cookieString.split('; ').forEach(cookie => {
      const [name, value] = cookie.split('=');
      cookies[decodeURIComponent(name)] = decodeURIComponent(value || '');
    });
    
    return cookies;
  }
  
  // 删除 Cookie（通过设置过期时间为过去）
  static remove(name, options = {}) {
    // 设置过期时间为过去，浏览器会自动删除
    this.set(name, '', {
      ...options,
      expires: new Date(0), // 1970-01-01
      maxAge: 0
    });
  }
  
  // 检查 Cookie 是否存在
  static has(name) {
    return this.get(name) !== null;
  }
}

// ========== 使用示例 ==========

// 1. 设置简单的 Cookie
CookieUtil.set('username', 'user123');
console.log(CookieUtil.get('username')); // 'user123'

// 2. 设置带过期时间的 Cookie（7天后过期）
CookieUtil.set('token', 'abc123', {
  maxAge: 7 * 24 * 60 * 60, // 7天的秒数
  path: '/'
});

// 3. 设置跨子域名的 Cookie
// 在 app.example.com 设置，所有 *.example.com 都能访问
CookieUtil.set('sso_token', 'xyz789', {
  domain: '.example.com',
  path: '/',
  maxAge: 3600, // 1小时
  secure: true, // 只在 HTTPS 下发送
  sameSite: 'Lax' // 同站策略
});

// 4. 读取 Cookie
const token = CookieUtil.get('token');
console.log('Token:', token);

// 5. 读取所有 Cookie
const allCookies = CookieUtil.getAll();
console.log('所有 Cookie:', allCookies);

// 6. 删除 Cookie
CookieUtil.remove('token');

// 7. 检查 Cookie 是否存在
if (CookieUtil.has('username')) {
  console.log('用户已登录');
} else {
  console.log('用户未登录');
}
```

### 实际应用：登录状态管理

```js
// ========== 用户登录状态管理 ==========
class AuthManager {
  constructor() {
    this.TOKEN_KEY = 'auth_token';
    this.USER_KEY = 'user_info';
    this.TOKEN_EXPIRE = 7 * 24 * 60 * 60; // 7天
  }
  
  // 登录成功后设置 Cookie
  login(token, userInfo) {
    // 设置 Token Cookie
    CookieUtil.set(this.TOKEN_KEY, token, {
      maxAge: this.TOKEN_EXPIRE,
      path: '/',
      secure: true, // 生产环境使用 HTTPS
      sameSite: 'Lax' // 防止 CSRF
    });
    
    // 用户信息可以存储在 Cookie 或 localStorage
    // 如果信息较大，建议用 localStorage
    localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
  }
  
  // 检查是否已登录
  isLoggedIn() {
    return CookieUtil.has(this.TOKEN_KEY);
  }
  
  // 获取 Token
  getToken() {
    return CookieUtil.get(this.TOKEN_KEY);
  }
  
  // 获取用户信息
  getUserInfo() {
    const userInfoStr = localStorage.getItem(this.USER_KEY);
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  }
  
  // 登出：清除 Cookie
  logout() {
    // 删除 Token Cookie
    CookieUtil.remove(this.TOKEN_KEY, {
      path: '/'
    });
    
    // 清除用户信息
    localStorage.removeItem(this.USER_KEY);
  }
  
  // 刷新 Token（更新过期时间）
  refreshToken(newToken) {
    CookieUtil.set(this.TOKEN_KEY, newToken, {
      maxAge: this.TOKEN_EXPIRE,
      path: '/',
      secure: true,
      sameSite: 'Lax'
    });
  }
}

// ========== 使用示例 ==========
const auth = new AuthManager();

// 登录
auth.login('abc123token', {
  id: 1,
  username: 'user123',
  email: 'user123@example.com'
});

// 检查登录状态
if (auth.isLoggedIn()) {
  console.log('用户已登录');
  console.log('Token:', auth.getToken());
  console.log('用户信息:', auth.getUserInfo());
} else {
  console.log('用户未登录');
}

// 登出
auth.logout();
```

### 跨域 Cookie 共享（SSO 场景）

> 💡 **相关知识点**：这是单点登录（SSO）的核心实现方式，详细方案请参考 [[单点登录方案#方案一：同域 Cookie 共享（最简单）]]

```js
// ========== 跨子域名 Cookie 共享 ==========
// 场景：sso.example.com 登录后，app.example.com 和 oa.example.com 都能访问

// 在认证中心（sso.example.com）登录成功后
function loginSuccess(token) {
  // 设置 Cookie 到父域名，所有子域名都能访问
  CookieUtil.set('sso_token', token, {
    domain: '.example.com', // 注意：前面有点
    path: '/',
    maxAge: 3600, // 1小时
    secure: true,
    sameSite: 'Lax'
  });
  
  // 跳转到业务系统
  window.location.href = 'https://app.example.com';
}

// 在业务系统（app.example.com）检查登录状态
function checkLogin() {
  // 读取共享的 Cookie
  const token = CookieUtil.get('sso_token');
  
  if (token) {
    console.log('已登录，Token:', token);
    // 验证 Token 并获取用户信息
    return true;
  } else {
    console.log('未登录，跳转到认证中心');
    // 跳转到认证中心登录
    window.location.href = 'https://sso.example.com/login?redirect=' + 
      encodeURIComponent(window.location.href);
    return false;
  }
}

// 页面加载时检查
checkLogin();
```

---

## 6. 常见错误与踩坑

### 错误1：Domain 设置错误，导致子域名无法共享

**为什么错**：`domain` 属性设置不正确，或者忘记设置，导致子域名无法访问 Cookie。

**会导致什么**：SSO 场景下，用户在认证中心登录后，业务系统无法读取 Cookie，导致登录失败。

**真实案例**：

假设有两个站点：
- 站点 A：`http://site-a.example.com`
- 站点 B：`http://site-b.example.com`

在站点 A 设置 Cookie 后，站点 B 看不到：

```js
// ❌ 错误1：不设置 domain，默认只能当前域名访问
// 在 site-a.example.com 设置
document.cookie = "token=abc123; path=/";
// 浏览器默认：Domain=site-a.example.com
// 结果：
// ✅ site-a.example.com 能看到：document.cookie → "token=abc123"
// ❌ site-b.example.com 看不到：document.cookie → ""（空）

// ❌ 错误2：domain 前面忘记加点
document.cookie = "token=abc123; path=/; domain=example.com";
// 虽然可能工作，但不是最佳实践，建议加 .

// ❌ 错误3：设置了错误的父域
document.cookie = "token=abc123; path=/; domain=.other.com";
// 如果当前是 site-a.example.com，这个设置可能无效
// 必须设置为 .example.com（两个站点的共同父域）

// ✅ 正确：domain 前面加点，使用正确的父域
document.cookie = "token=abc123; path=/; domain=.example.com";
// 结果：
// ✅ site-a.example.com 能看到：document.cookie → "token=abc123"
// ✅ site-b.example.com 能看到：document.cookie → "token=abc123"
// ✅ 所有 *.example.com 的子域名都能访问
```

**验证方法**：

```js
// 在站点 A 控制台设置
document.cookie = "token=abc123; path=/; domain=.example.com";
console.log("站点 A Cookie:", document.cookie);

// 打开站点 B，在控制台查看
console.log("站点 B Cookie:", document.cookie);
// 如果设置正确，应该能看到：token=abc123
```

### 错误2：SameSite=None 没有配合 Secure，Cookie 被忽略

**为什么容易踩**：Chrome 等浏览器要求 `SameSite=None` 必须配合 `Secure`，否则 Cookie 会被忽略。

**正确方式**：
```js
// ❌ 错误：SameSite=None 没有 Secure
document.cookie = "token=abc; SameSite=None; path=/";
// Chrome 会忽略这个 Cookie，不会设置成功

// ✅ 正确：SameSite=None 必须配合 Secure（需要 HTTPS）
document.cookie = "token=abc; SameSite=None; Secure; path=/";
// 注意：必须在 HTTPS 环境下才能设置 Secure Cookie
```

### 错误3：Cookie 值包含特殊字符没有编码，导致解析错误

**真实开发场景**：Cookie 值包含 `=`、`;`、空格等特殊字符，导致 Cookie 解析错误。

**正确方式**：
```js
// ❌ 错误：值包含特殊字符
document.cookie = "user=name=user123; age=20"; // 解析错误

// ✅ 正确：使用 encodeURIComponent 编码
const userName = "name=user123; age=20";
document.cookie = `user=${encodeURIComponent(userName)}; path=/`;

// 读取时也要解码
const value = decodeURIComponent(CookieUtil.get('user'));
```

### 错误4：Path 设置不当，导致某些页面无法访问 Cookie

**为什么容易踩**：Path 设置太具体，导致其他路径的页面无法访问 Cookie。

**正确方式**：
```js
// ❌ 错误：Path 设置太具体
document.cookie = "token=abc; path=/admin";
// 只有在 /admin 路径下才能访问，/home 路径无法访问

// ✅ 正确：Path 设置为根路径
document.cookie = "token=abc; path=/";
// 所有路径都能访问（最常用）
```

### 错误5：尝试用 JavaScript 设置 HttpOnly Cookie

**为什么错**：HttpOnly 只能由服务器通过 `Set-Cookie` 响应头设置，前端无法设置。

**正确方式**：
```js
// ❌ 错误：前端尝试设置 HttpOnly（无效）
document.cookie = "token=abc; HttpOnly; path=/";
// HttpOnly 会被忽略，Cookie 仍然可以通过 JavaScript 访问

// ✅ 正确：服务器端设置（Node.js 示例）
res.setHeader('Set-Cookie', [
  'token=abc; HttpOnly; Secure; SameSite=Strict; path=/'
]);
```

---

## 7. 实际应用场景

### 场景1：用户登录状态保持

**需求**：用户登录后，关闭浏览器再打开，仍然保持登录状态。

**解决方案**：
```js
// 登录时设置长期有效的 Cookie
CookieUtil.set('auth_token', token, {
  maxAge: 30 * 24 * 60 * 60, // 30天
  path: '/',
  secure: true,
  sameSite: 'Lax'
});
```

### 场景2：单点登录（SSO）与跨子域 Cookie 共享

> 💡 **完整方案**：详细实现请参考 [[单点登录方案]]，包含多种 SSO 实现方案和最佳实践。

**需求**：多个子域名系统共享登录状态。

**实际案例**：
- 站点 A：`http://site-a.example.com`
- 站点 B：`http://site-b.example.com`
- 需求：在站点 A 登录后，站点 B 也能自动登录

**解决方案**：

```js
// 在站点 A（site-a.example.com）登录成功后设置 Cookie
// 注意：domain 必须设置为两个站点的共同父域
CookieUtil.set('sso_token', token, {
  domain: '.example.com', // 注意：前面有点，是所有 *.example.com 的共同父域
  path: '/', // 必须设置为根路径，才能全站可见
  maxAge: 3600, // 1小时
  secure: true, // 如果是 HTTPS
  sameSite: 'Lax' // 防止 CSRF
});

// 在站点 B（site-b.example.com）检查登录状态
function checkLogin() {
  const token = CookieUtil.get('sso_token');
  if (token) {
    console.log('已登录，Token:', token);
    // 验证 Token 并获取用户信息
    return true;
  } else {
    console.log('未登录');
    return false;
  }
}

// 验证：在浏览器控制台测试
// 1. 在站点 A 控制台设置
document.cookie = "sso_token=abc123; path=/; domain=.example.com";
console.log("站点 A Cookie:", document.cookie);

// 2. 打开站点 B，在控制台查看
console.log("站点 B Cookie:", document.cookie);
// 如果设置正确，应该能看到：sso_token=abc123
```

**关键点**：
1. ✅ `domain` 必须设置为两个站点的**共同父域**：`.example.com`
2. ✅ `domain` 前面必须加 `.`（点）
3. ✅ `path` 必须设置为 `/`，才能全站可见
4. ⚠️ 如果是 HTTPS，需要设置 `secure: true`
5. ⚠️ 在 HTTP 环境下，不能设置 `secure`，否则 Cookie 无法设置

### 场景3：购物车数据临时存储

**需求**：用户添加商品到购物车，即使刷新页面也不丢失。

**解决方案**：
```js
// 存储购物车数据（如果数据量大，建议用 localStorage）
const cartData = JSON.stringify(cartItems);
CookieUtil.set('cart', cartData, {
  maxAge: 7 * 24 * 60 * 60, // 7天
  path: '/'
});
```

### 场景4：用户偏好设置

**需求**：记住用户的语言、主题等偏好设置。

**解决方案**：
```js
// 存储用户偏好
CookieUtil.set('language', 'zh-CN', {
  maxAge: 365 * 24 * 60 * 60, // 1年
  path: '/'
});

CookieUtil.set('theme', 'dark', {
  maxAge: 365 * 24 * 60 * 60,
  path: '/'
});
```

---

## 8. 给新手的练习题（可立即实践）

### 基础题：实现 Cookie 工具类

**目标**：创建一个完整的 Cookie 工具类，支持设置、读取、删除 Cookie。

**要求**：
1. 实现 `set(name, value, options)` 方法
2. 实现 `get(name)` 方法
3. 实现 `remove(name)` 方法
4. 支持 `maxAge`、`path`、`domain`、`secure`、`sameSite` 选项

**输出结果**：
- 能够成功设置和读取 Cookie
- 能够删除 Cookie
- 各种选项都能正常工作

### 进阶题：实现登录状态管理

**目标**：使用 Cookie 实现一个简单的登录状态管理系统。

**要求**：
1. 登录时设置 Token Cookie（7天有效期）
2. 检查登录状态
3. 登出时清除 Cookie
4. 实现 Token 刷新功能

**输出结果**：
- 登录后能保持登录状态
- 刷新页面后仍然登录
- 登出后清除登录状态

---

## 9. 用更简单的话再总结一遍（方便复习）

**Cookie 就是浏览器存储的小纸条**：
- 服务器给你"写纸条"（设置 Cookie）
- 浏览器"保存纸条"（存储 Cookie）
- 下次访问时"出示纸条"（自动发送 Cookie）
- 服务器"看纸条"（读取 Cookie），知道你是谁

**Cookie 的关键属性**：
- **Domain**：纸条在哪个"区域"有效（如 `.example.com` 表示所有子域名）
- **Path**：纸条在哪个"路径"有效（如 `/` 表示所有路径）
- **Max-Age**：纸条"有效期"多久（秒数）
- **Secure**：只在"安全通道"（HTTPS）出示纸条
- **SameSite**：是否允许"跨区域"出示纸条（防 CSRF）

**跨子域 Cookie 共享的核心**：
- **为什么两个站点 Cookie 不共享？**：默认情况下，不同子域名不会自动共享 Cookie
  - 例如：`site-a.example.com` 设置的 Cookie，`site-b.example.com` 默认看不到
- **如何让多个子域共享？**：设置 `domain` 为共同的父域，前面必须加 `.`
  - 例如：`domain=.example.com` 可以让所有 `*.example.com` 的子域名共享
- **控制台设置方法**：
  ```js
  document.cookie = "token=abc123; path=/; domain=.example.com";
  ```
  - 注意：`domain` 前面必须加 `.`（点）
  - 必须是两个站点的**共同父域**
  - `path` 必须为 `/` 才能全站可见

**记住五点**：
1. Cookie 最大 4KB，不能存太多数据
2. Domain 设置 `.example.com` 可以让所有子域名共享（注意前面有点）
3. HttpOnly 只能服务器设置，前端无法设置
4. 不同子域名默认不共享 Cookie，必须显式设置 `domain` 为父域
5. 在控制台设置跨子域 Cookie 时，`domain` 必须是两个站点的共同父域，且前面要加 `.`

---

## 10. 知识体系延伸 & 继续学习方向 & 遵守仓库规范文档

### 可学习的下一个知识点

- [[HTTP 基础]] — 深入了解 HTTP 协议中的 Cookie 机制
- [[单点登录方案]] — Cookie 在 SSO 中的应用
  - [[单点登录方案#方案一：同域 Cookie 共享（最简单）]] — 使用 Cookie 实现 SSO
  - [[单点登录方案#方案四：AccessToken + RefreshToken 实现（推荐方案）]] — 更安全的 SSO 方案
- [[XSS-CSRF原理与防护]] — Cookie 安全相关（HttpOnly、SameSite）
- [[Session 管理]] — Cookie 与 Session 的关系
- [[Storage API]] — localStorage、sessionStorage 与 Cookie 的对比
- [[浏览器环境与DOM]] — 浏览器存储机制总览

### 继续学习方向

1. **深入理解 Cookie 安全**
   - HttpOnly 防止 XSS
   - SameSite 防止 CSRF
   - Secure 确保传输安全
   - Cookie 加密与签名

2. **Cookie 与 Session 的关系**
   - Session ID 存储在 Cookie 中
   - 服务端 Session 管理
   - 分布式 Session 方案

3. **替代方案**
   - localStorage / sessionStorage（客户端存储）
   - IndexedDB（大量数据存储）
   - Token 认证（JWT）

4. **实际项目实践**
   - 单点登录实现
   - 用户偏好设置
   - 购物车数据存储
   - 分析追踪（Analytics）

### 遵守仓库规范文档

本文档遵循 [[仓库规范文档]] 的格式要求，使用标准的 Markdown 语法和双链格式。

---

**最后更新**：2025-01-20  
**标签**：#Cookie #Web-API #浏览器环境 #HTTP #存储 #安全

