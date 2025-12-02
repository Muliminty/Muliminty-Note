# REST API 设计原则

> REST（Representational State Transfer）是一种架构风格，用于设计网络应用程序的 API。RESTful API 是基于 REST 原则设计的 Web API。

---

## 什么是 REST

REST（Representational State Transfer，表述性状态转移）是一种软件架构风格，用于设计网络应用程序的 API。

### REST 的核心概念

- **资源（Resource）**：网络上的任何信息都可以是资源，如用户、文章、订单等
- **URI（Uniform Resource Identifier）**：资源的唯一标识符
- **HTTP 方法**：GET、POST、PUT、DELETE 等
- **表述（Representation）**：资源的表现形式，通常是 JSON 或 XML

---

## RESTful API 设计原则

### 1. 使用名词，不使用动词

**❌ 错误示例**：
```
GET /getUsers
POST /createUser
PUT /updateUser
DELETE /deleteUser
```

**✅ 正确示例**：
```
GET /users
POST /users
PUT /users/{id}
DELETE /users/{id}
```

### 2. 使用复数名词

**❌ 错误示例**：
```
GET /user
POST /user
```

**✅ 正确示例**：
```
GET /users
POST /users
```

### 3. 使用 HTTP 方法表示操作

| HTTP 方法 | 用途 | 示例 |
|---------|------|------|
| GET | 获取资源 | `GET /users` - 获取所有用户 |
| POST | 创建资源 | `POST /users` - 创建新用户 |
| PUT | 完整更新资源 | `PUT /users/{id}` - 更新整个用户信息 |
| PATCH | 部分更新资源 | `PATCH /users/{id}` - 更新用户的部分信息 |
| DELETE | 删除资源 | `DELETE /users/{id}` - 删除用户 |

### 4. 使用正确的 HTTP 状态码

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 OK | 成功 | GET、PUT、PATCH 成功 |
| 201 Created | 已创建 | POST 成功创建资源 |
| 204 No Content | 无内容 | DELETE 成功 |
| 400 Bad Request | 请求错误 | 请求参数错误 |
| 401 Unauthorized | 未授权 | 未提供认证信息 |
| 403 Forbidden | 禁止访问 | 无权限访问资源 |
| 404 Not Found | 未找到 | 资源不存在 |
| 409 Conflict | 冲突 | 资源冲突（如重复创建） |
| 500 Internal Server Error | 服务器错误 | 服务器内部错误 |

### 5. 使用嵌套资源表示关系

**示例**：
```
GET /users/{userId}/posts          # 获取用户的所有文章
GET /users/{userId}/posts/{postId} # 获取用户的特定文章
POST /users/{userId}/posts         # 为用户创建文章
```

### 6. 使用查询参数进行过滤、排序和分页

**示例**：
```
GET /users?page=1&limit=10              # 分页
GET /users?status=active                # 过滤
GET /users?sort=created_at&order=desc   # 排序
GET /users?search=张三                   # 搜索
```

### 7. 使用版本控制

**方式1：URL 路径版本控制**
```
GET /v1/users
GET /v2/users
```

**方式2：HTTP 头版本控制**
```
GET /users
Accept: application/vnd.api+json;version=1
```

### 8. 使用统一的响应格式

**成功响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com"
  }
}
```

**错误响应示例**：
```json
{
  "code": 404,
  "message": "用户不存在",
  "error": "User not found"
}
```

---

## RESTful API 设计示例

### 用户管理 API

```java
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    
    // GET /api/v1/users - 获取所有用户
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String status) {
        // 实现逻辑
        return ResponseEntity.ok(users);
    }
    
    // GET /api/v1/users/{id} - 获取指定用户
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
    
    // POST /api/v1/users - 创建用户
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody @Valid User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }
    
    // PUT /api/v1/users/{id} - 完整更新用户
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody @Valid User user) {
        User updatedUser = userService.updateUser(id, user);
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedUser);
    }
    
    // PATCH /api/v1/users/{id} - 部分更新用户
    @PatchMapping("/{id}")
    public ResponseEntity<User> patchUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        User updatedUser = userService.patchUser(id, updates);
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedUser);
    }
    
    // DELETE /api/v1/users/{id} - 删除用户
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
```

---

## 常见错误与注意事项

### 1. 不要在 URI 中使用动词

**❌ 错误**：
```
POST /users/create
GET /users/get/{id}
```

**✅ 正确**：
```
POST /users
GET /users/{id}
```

### 2. 不要使用单数名词

**❌ 错误**：
```
GET /user
POST /user
```

**✅ 正确**：
```
GET /users
POST /users
```

### 3. 不要忽略 HTTP 状态码

**❌ 错误**：所有请求都返回 200，在响应体中表示错误
```json
{
  "status": "error",
  "message": "用户不存在"
}
```

**✅ 正确**：使用正确的 HTTP 状态码
```json
// HTTP 404 Not Found
{
  "code": 404,
  "message": "用户不存在"
}
```

### 4. 不要过度嵌套资源

**❌ 错误**：
```
GET /users/{userId}/posts/{postId}/comments/{commentId}/replies/{replyId}
```

**✅ 正确**：
```
GET /replies/{replyId}?commentId={commentId}
```

### 5. 不要忽略版本控制

对于长期维护的 API，应该从一开始就考虑版本控制。

---

## 实际应用场景

### 1. 电商系统 API

```
GET    /api/v1/products              # 获取商品列表
GET    /api/v1/products/{id}         # 获取商品详情
POST   /api/v1/products              # 创建商品
PUT    /api/v1/products/{id}         # 更新商品
DELETE /api/v1/products/{id}        # 删除商品

GET    /api/v1/orders                # 获取订单列表
GET    /api/v1/orders/{id}           # 获取订单详情
POST   /api/v1/orders                # 创建订单
PATCH  /api/v1/orders/{id}/status    # 更新订单状态
```

### 2. 博客系统 API

```
GET    /api/v1/posts                 # 获取文章列表
GET    /api/v1/posts/{id}            # 获取文章详情
POST   /api/v1/posts                 # 创建文章
PUT    /api/v1/posts/{id}            # 更新文章
DELETE /api/v1/posts/{id}           # 删除文章

GET    /api/v1/posts/{id}/comments   # 获取文章评论
POST   /api/v1/posts/{id}/comments   # 创建评论
```

---

## 总结

RESTful API 设计要点：
- **使用名词和复数形式**：资源使用名词，使用复数形式
- **使用 HTTP 方法**：GET、POST、PUT、PATCH、DELETE
- **使用正确的状态码**：200、201、204、400、404 等
- **使用嵌套资源**：表示资源之间的关系
- **使用查询参数**：进行过滤、排序和分页
- **版本控制**：从设计之初考虑版本管理
- **统一响应格式**：保持 API 响应格式的一致性

遵循 REST 原则设计的 API 更加清晰、易用、易维护。

---

**相关链接**：
- [REST API 最佳实践](./REST-API-最佳实践.md) — REST API 最佳实践
- [Spring Boot 入门](../../01-服务端语言/Java/03-Web开发/Spring-Boot-入门.md) — Spring Boot 开发 REST API
- [第一个 HTTP 服务](../../01-服务端语言/Java/06-实践项目/第一个-HTTP-服务.md) — REST API 实践示例

---

#rest #restful #api设计 #web开发

