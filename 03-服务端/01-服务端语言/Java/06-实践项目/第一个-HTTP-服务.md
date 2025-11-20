# 第一个 HTTP 服务

这是 Java 入门实践的第一个项目，我们将从零开始搭建一个简单的 HTTP 服务器。

## 项目目标

创建一个简单的 HTTP 服务，实现：
- 返回简单的文本响应
- 处理不同的 HTTP 方法（GET、POST）
- 返回 JSON 数据
- 处理路径参数和查询参数

## 项目结构

```
first-http-service/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/
│   │   │       └── FirstHttpServiceApplication.java
│   │   │       └── controller/
│   │   │           └── HelloController.java
│   │   │           └── UserController.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
```

## 步骤 1：创建项目

### 使用 Spring Initializr

1. 访问 https://start.spring.io/
2. 选择：
   - **Project**：Maven
   - **Language**：Java
   - **Spring Boot**：3.2.0
   - **Dependencies**：Spring Web
3. 点击 "Generate" 下载项目

### 或手动创建

```bash
# 创建项目目录
mkdir first-http-service
cd first-http-service

# 创建 Maven 项目结构
mkdir -p src/main/java/com/example
mkdir -p src/main/resources
mkdir -p src/test/java/com/example
```

## 步骤 2：配置 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.example</groupId>
    <artifactId>first-http-service</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>first-http-service</name>
    <description>第一个 HTTP 服务</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Web 起步依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- Spring Boot 测试起步依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

## 步骤 3：创建主类

```java
package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot 应用主类
 * 
 * @SpringBootApplication 注解包含：
 * - @Configuration：标识为配置类
 * - @EnableAutoConfiguration：启用自动配置
 * - @ComponentScan：组件扫描
 */
@SpringBootApplication
public class FirstHttpServiceApplication {
    public static void main(String[] args) {
        // 启动 Spring Boot 应用
        SpringApplication.run(FirstHttpServiceApplication.class, args);
        System.out.println("HTTP 服务启动成功！");
        System.out.println("访问地址：http://localhost:8080");
    }
}
```

## 步骤 4：创建第一个 Controller

```java
package com.example.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Hello Controller
 * 
 * @RestController 注解：
 * - 标识为 REST 控制器
 * - 等价于 @Controller + @ResponseBody
 * - 返回的数据会自动转换为 JSON
 */
@RestController
public class HelloController {
    
    /**
     * 处理 GET 请求
     * 
     * @GetMapping("/hello") 等价于：
     * @RequestMapping(value = "/hello", method = RequestMethod.GET)
     * 
     * 访问：http://localhost:8080/hello
     */
    @GetMapping("/hello")
    public String hello() {
        return "Hello, World!";
    }
    
    /**
     * 返回带参数的响应
     * 访问：http://localhost:8080/greet?name=张三
     */
    @GetMapping("/greet")
    public String greet(String name) {
        if (name == null || name.isEmpty()) {
            name = "访客";
        }
        return "你好，" + name + "！";
    }
}
```

## 步骤 5：创建用户管理 Controller

```java
package com.example.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

/**
 * 用户管理 Controller
 * 实现简单的 CRUD 操作
 */
@RestController
@RequestMapping("/api/users")  // 路径前缀
public class UserController {
    // 模拟数据库（实际项目中应该使用数据库）
    private Map<Integer, User> users = new HashMap<>();
    private int nextId = 1;
    
    /**
     * 获取所有用户
     * GET /api/users
     */
    @GetMapping
    public List<User> getAllUsers() {
        return new ArrayList<>(users.values());
    }
    
    /**
     * 根据 ID 获取用户
     * GET /api/users/{id}
     * 
     * @PathVariable 用于获取路径变量
     */
    @GetMapping("/{id}")
    public User getUserById(@PathVariable int id) {
        User user = users.get(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        return user;
    }
    
    /**
     * 创建用户
     * POST /api/users
     * 
     * @RequestBody 用于接收 JSON 请求体
     */
    @PostMapping
    public User createUser(@RequestBody User user) {
        user.setId(nextId++);
        users.put(user.getId(), user);
        return user;
    }
    
    /**
     * 更新用户
     * PUT /api/users/{id}
     */
    @PutMapping("/{id}")
    public User updateUser(@PathVariable int id, @RequestBody User user) {
        if (!users.containsKey(id)) {
            throw new RuntimeException("用户不存在");
        }
        user.setId(id);
        users.put(id, user);
        return user;
    }
    
    /**
     * 删除用户
     * DELETE /api/users/{id}
     */
    @DeleteMapping("/{id}")
    public Map<String, String> deleteUser(@PathVariable int id) {
        if (!users.containsKey(id)) {
            throw new RuntimeException("用户不存在");
        }
        users.remove(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "用户删除成功");
        return response;
    }
    
    /**
     * 用户实体类
     * 内部类，用于数据传输
     */
    static class User {
        private int id;
        private String name;
        private String email;
        private int age;
        
        // 无参构造方法（JSON 反序列化需要）
        public User() {
        }
        
        // 有参构造方法
        public User(int id, String name, String email, int age) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.age = age;
        }
        
        // Getter 和 Setter 方法（JSON 序列化需要）
        public int getId() {
            return id;
        }
        
        public void setId(int id) {
            this.id = id;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public int getAge() {
            return age;
        }
        
        public void setAge(int age) {
            this.age = age;
        }
    }
}
```

## 步骤 6：配置文件

### application.properties

```properties
# 服务器端口（默认 8080）
server.port=8080

# 应用名称
spring.application.name=first-http-service

# 日志配置
logging.level.root=INFO
logging.level.com.example=DEBUG

# 编码配置
server.servlet.encoding.charset=UTF-8
server.servlet.encoding.enabled=true
server.servlet.encoding.force=true
```

## 步骤 7：运行项目

### 方式1：使用 Maven

```bash
# 在项目根目录执行
mvn spring-boot:run
```

### 方式2：使用 IDE

在 IDE 中运行 `FirstHttpServiceApplication` 类的 `main` 方法。

### 方式3：打包运行

```bash
# 打包
mvn clean package

# 运行
java -jar target/first-http-service-0.0.1-SNAPSHOT.jar
```

## 步骤 8：测试服务

### 使用 curl 测试

```bash
# 1. 测试 Hello 接口
curl http://localhost:8080/hello
# 输出：Hello, World!

# 2. 测试 Greet 接口
curl http://localhost:8080/greet?name=张三
# 输出：你好，张三！

# 3. 获取所有用户
curl http://localhost:8080/api/users
# 输出：[]

# 4. 创建用户
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","email":"zhangsan@example.com","age":25}'
# 输出：{"id":1,"name":"张三","email":"zhangsan@example.com","age":25}

# 5. 获取指定用户
curl http://localhost:8080/api/users/1
# 输出：{"id":1,"name":"张三","email":"zhangsan@example.com","age":25}

# 6. 更新用户
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","email":"zhangsan@new.com","age":26}'

# 7. 删除用户
curl -X DELETE http://localhost:8080/api/users/1
```

### 使用浏览器测试

1. 打开浏览器访问：http://localhost:8080/hello
2. 访问：http://localhost:8080/greet?name=李四
3. 访问：http://localhost:8080/api/users

### 使用 Postman 测试

1. 安装 Postman
2. 创建请求：
   - GET http://localhost:8080/hello
   - POST http://localhost:8080/api/users
   - Body 选择 raw，格式选择 JSON
   - 输入 JSON 数据

## 项目扩展

### 添加异常处理

```java
package com.example.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;

/**
 * 全局异常处理器
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
```

### 添加日志

```java
package com.example.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    // 创建日志对象
    private static final Logger logger = LoggerFactory.getLogger(HelloController.class);
    
    @GetMapping("/hello")
    public String hello() {
        logger.info("收到 Hello 请求");
        return "Hello, World!";
    }
}
```

## 总结

通过这个项目，我们学会了：
- 创建 Spring Boot 项目
- 创建 REST 控制器
- 处理不同的 HTTP 方法
- 处理路径参数和查询参数
- 返回 JSON 数据
- 实现简单的 CRUD 操作

这是 Java Web 开发的第一步，后续可以继续学习：
- 连接数据库
- 添加认证授权
- 实现更复杂的功能

---

**相关链接**：
- [Spring Boot 入门](../03-Web开发/Spring-Boot-入门.md) — Spring Boot 详细教程
- [JDBC 基础](../04-数据库操作/JDBC-基础.md) — 数据库操作

---

#java #spring-boot #http服务 #实践项目

