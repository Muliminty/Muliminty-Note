# REST API 最佳实践

> REST API 开发的最佳实践，包括错误处理、安全、性能优化、文档化等方面。

---

## 错误处理

### 统一的错误响应格式

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "用户不存在",
    "details": "用户 ID 123 不存在",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

### 使用正确的 HTTP 状态码

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    // 资源未找到
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException e) {
        ErrorResponse error = new ErrorResponse("NOT_FOUND", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    // 参数验证错误
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        ErrorResponse error = new ErrorResponse("VALIDATION_ERROR", "参数验证失败", e.getBindingResult());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
    
    // 服务器错误
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception e) {
        ErrorResponse error = new ErrorResponse("INTERNAL_ERROR", "服务器内部错误");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

---

## 安全实践

### 1. 使用 HTTPS

所有 API 请求都应该使用 HTTPS 协议，保护数据传输安全。

### 2. 认证和授权

**JWT 认证示例**：
```java
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    
    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        // 获取当前用户信息
        return ResponseEntity.ok(userService.getUserByUsername(userDetails.getUsername()));
    }
}
```

### 3. 输入验证

```java
public class CreateUserRequest {
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度必须在 3-20 之间")
    private String username;
    
    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 8, message = "密码长度至少 8 位")
    private String password;
}
```

### 4. 防止 SQL 注入

使用参数化查询或 ORM 框架，避免直接拼接 SQL。

### 5. 防止 XSS 攻击

对用户输入进行转义处理，使用框架的自动转义功能。

### 6. 速率限制（Rate Limiting）

```java
@RestController
@RequestMapping("/api/v1")
public class ApiController {
    
    @GetMapping("/public")
    @RateLimiter(name = "publicApi", fallbackMethod = "fallback")
    public ResponseEntity<String> publicApi() {
        return ResponseEntity.ok("Public API");
    }
    
    public ResponseEntity<String> fallback() {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
            .body("请求过于频繁，请稍后再试");
    }
}
```

---

## 性能优化

### 1. 分页

```java
@GetMapping("/users")
public ResponseEntity<Page<User>> getUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "id") String sortBy) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
    Page<User> users = userService.findAll(pageable);
    return ResponseEntity.ok(users);
}
```

### 2. 字段过滤

允许客户端指定需要返回的字段：

```
GET /api/v1/users?fields=id,name,email
```

### 3. 缓存

```java
@GetMapping("/users/{id}")
@Cacheable(value = "users", key = "#id")
public ResponseEntity<User> getUserById(@PathVariable Long id) {
    User user = userService.getUserById(id);
    return ResponseEntity.ok(user);
}
```

### 4. 压缩响应

在服务器配置中启用 Gzip 压缩。

### 5. 数据库查询优化

- 使用索引
- 避免 N+1 查询问题
- 使用连接查询代替多次查询

---

## 版本管理

### URL 路径版本控制

```
GET /api/v1/users
GET /api/v2/users
```

### HTTP 头版本控制

```
GET /api/users
Accept: application/vnd.api+json;version=1
```

### 版本策略

- **主版本号（Major）**：不兼容的 API 变更
- **次版本号（Minor）**：向后兼容的功能新增
- **修订版本号（Patch）**：向后兼容的问题修复

---

## 文档化

### 使用 Swagger/OpenAPI

```java
@RestController
@RequestMapping("/api/v1/users")
@Api(tags = "用户管理")
public class UserController {
    
    @GetMapping
    @ApiOperation(value = "获取用户列表", notes = "分页获取所有用户")
    @ApiResponses({
        @ApiResponse(code = 200, message = "成功"),
        @ApiResponse(code = 401, message = "未授权")
    })
    public ResponseEntity<List<User>> getUsers(
            @ApiParam(value = "页码", defaultValue = "0") @RequestParam int page,
            @ApiParam(value = "每页数量", defaultValue = "20") @RequestParam int size) {
        // 实现逻辑
        return ResponseEntity.ok(users);
    }
}
```

---

## 响应格式

### 统一响应结构

```java
public class ApiResponse<T> {
    private int code;
    private String message;
    private T data;
    private long timestamp;
    
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "success", data, System.currentTimeMillis());
    }
    
    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, message, null, System.currentTimeMillis());
    }
}
```

### 分页响应

```java
public class PageResponse<T> {
    private List<T> data;
    private Pagination pagination;
    
    public static class Pagination {
        private int page;
        private int size;
        private long total;
        private int totalPages;
    }
}
```

---

## 测试

### 单元测试

```java
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testGetUsers() throws Exception {
        mockMvc.perform(get("/api/v1/users"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").isArray());
    }
    
    @Test
    void testCreateUser() throws Exception {
        String userJson = "{\"username\":\"test\",\"email\":\"test@example.com\"}";
        
        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.username").value("test"));
    }
}
```

---

## 常见问题与解决方案

### 1. 跨域问题（CORS）

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("https://example.com"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

### 2. 请求超时

在配置文件中设置超时时间：
```properties
spring.mvc.async.request-timeout=30000
```

### 3. 大文件上传

使用分片上传或流式上传。

---

## 总结

REST API 最佳实践要点：
- **错误处理**：统一的错误响应格式，正确的 HTTP 状态码
- **安全**：HTTPS、认证授权、输入验证、速率限制
- **性能**：分页、字段过滤、缓存、查询优化
- **版本管理**：明确的版本控制策略
- **文档化**：使用 Swagger/OpenAPI 生成 API 文档
- **测试**：编写单元测试和集成测试

遵循这些最佳实践，可以开发出高质量、易维护的 REST API。

---

**相关链接**：
- [REST API 设计原则](./REST-API-设计原则.md) — REST API 设计原则
- [Spring Boot 入门](../../01-服务端语言/Java/03-Web开发/Spring-Boot-入门.md) — Spring Boot 开发 REST API

---

#rest #api设计 #最佳实践 #web开发

