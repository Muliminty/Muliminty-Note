# Spring Boot 入门

Spring Boot 是 Spring 框架的扩展，简化了 Spring 应用的开发和部署。

## 什么是 Spring Boot

Spring Boot 是一个基于 Spring 框架的快速开发框架，具有以下特点：
- **自动配置**：自动配置 Spring 应用
- **起步依赖**：简化依赖管理
- **内嵌服务器**：内置 Tomcat、Jetty 等服务器
- **生产就绪**：提供监控、健康检查等功能

## 创建 Spring Boot 项目

### 方式1：使用 Spring Initializr

访问 https://start.spring.io/，选择：
- **Project**：Maven 或 Gradle
- **Language**：Java
- **Spring Boot**：选择版本（推荐 3.x）
- **Dependencies**：选择需要的依赖

### 方式2：使用 IDE

IntelliJ IDEA 和 Eclipse 都支持直接创建 Spring Boot 项目。

### 方式3：手动创建

```bash
# 创建项目目录
mkdir spring-boot-demo
cd spring-boot-demo

# 创建 Maven 项目结构
mkdir -p src/main/java/com/example/demo
mkdir -p src/main/resources
mkdir -p src/test/java/com/example/demo
```

## 项目结构

```
spring-boot-demo/
├── pom.xml                    # Maven 配置文件
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/demo/
│   │   │       └── DemoApplication.java  # 主类
│   │   └── resources/
│   │       ├── application.properties     # 配置文件
│   │       └── static/                   # 静态资源
│   └── test/
│       └── java/
│           └── com/example/demo/
│               └── DemoApplicationTests.java
```

## 第一个 Spring Boot 应用

### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <!-- 继承 Spring Boot 父项目 -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>
    <description>Spring Boot Demo</description>
    
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
            <!-- Spring Boot Maven 插件 -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 主类（Application）

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot 主类
 * @SpringBootApplication 注解包含：
 * - @Configuration：标识为配置类
 * - @EnableAutoConfiguration：启用自动配置
 * - @ComponentScan：组件扫描
 */
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        // 启动 Spring Boot 应用
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

### 第一个 Controller

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST 控制器
 * @RestController = @Controller + @ResponseBody
 * 返回的数据会自动转换为 JSON
 */
@RestController
public class HelloController {
    
    /**
     * 处理 GET 请求
     * @GetMapping("/hello") 等价于 @RequestMapping(value = "/hello", method = RequestMethod.GET)
     * 访问：http://localhost:8080/hello
     */
    @GetMapping("/hello")
    public String hello() {
        return "Hello, Spring Boot!";
    }
    
    /**
     * 返回 JSON 数据
     * 访问：http://localhost:8080/user
     */
    @GetMapping("/user")
    public User getUser() {
        User user = new User();
        user.setId(1);
        user.setName("张三");
        user.setAge(25);
        return user;
    }
    
    // 内部类：用户实体
    static class User {
        private int id;
        private String name;
        private int age;
        
        // Getter 和 Setter 方法
        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public int getAge() { return age; }
        public void setAge(int age) { this.age = age; }
    }
}
```

### application.properties

```properties
# 服务器端口（默认 8080）
server.port=8080

# 应用名称
spring.application.name=demo

# 日志级别
logging.level.root=INFO
logging.level.com.example.demo=DEBUG
```

## 运行应用

### 方式1：使用 Maven

```bash
# 运行应用
mvn spring-boot:run

# 或者先编译再运行
mvn clean package
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

### 方式2：使用 IDE

直接在 IDE 中运行 `DemoApplication` 类的 `main` 方法。

### 测试

```bash
# 测试 Hello 接口
curl http://localhost:8080/hello

# 测试 User 接口
curl http://localhost:8080/user
```

## 常用注解

### @RestController

```java
@RestController
public class ApiController {
    // 返回的数据会自动转换为 JSON
    @GetMapping("/api/data")
    public Map<String, Object> getData() {
        Map<String, Object> data = new HashMap<>();
        data.put("message", "Hello");
        data.put("timestamp", System.currentTimeMillis());
        return data;
    }
}
```

### @RequestMapping

```java
@RestController
@RequestMapping("/api")  // 类级别的路径前缀
public class ApiController {
    
    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public List<String> getUsers() {
        return Arrays.asList("张三", "李四");
    }
    
    // 简写形式
    @GetMapping("/users")
    public List<String> getUsers2() {
        return Arrays.asList("张三", "李四");
    }
}
```

### @PathVariable

```java
@RestController
public class UserController {
    // 路径变量
    // 访问：http://localhost:8080/user/1
    @GetMapping("/user/{id}")
    public String getUserById(@PathVariable int id) {
        return "用户ID：" + id;
    }
    
    // 多个路径变量
    @GetMapping("/user/{id}/post/{postId}")
    public String getUserPost(@PathVariable int id, @PathVariable int postId) {
        return "用户ID：" + id + "，文章ID：" + postId;
    }
}
```

### @RequestParam

```java
@RestController
public class SearchController {
    // 查询参数
    // 访问：http://localhost:8080/search?keyword=Java
    @GetMapping("/search")
    public String search(@RequestParam String keyword) {
        return "搜索关键词：" + keyword;
    }
    
    // 可选参数
    @GetMapping("/search2")
    public String search2(@RequestParam(required = false, defaultValue = "默认值") String keyword) {
        return "搜索关键词：" + keyword;
    }
}
```

### @RequestBody

```java
@RestController
public class UserController {
    // 接收 JSON 请求体
    @PostMapping("/user")
    public User createUser(@RequestBody User user) {
        // 处理用户创建逻辑
        return user;
    }
}
```

## 配置文件

### application.properties

```properties
# 服务器配置
server.port=8080
server.servlet.context-path=/api

# 数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/test
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA 配置
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### application.yml

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

## 实际应用示例

### 示例：RESTful API

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserRestController {
    // 模拟数据库
    private Map<Integer, User> users = new HashMap<>();
    private int nextId = 1;
    
    // GET /api/users - 获取所有用户
    @GetMapping
    public List<User> getAllUsers() {
        return new ArrayList<>(users.values());
    }
    
    // GET /api/users/{id} - 获取指定用户
    @GetMapping("/{id}")
    public User getUserById(@PathVariable int id) {
        return users.get(id);
    }
    
    // POST /api/users - 创建用户
    @PostMapping
    public User createUser(@RequestBody User user) {
        user.setId(nextId++);
        users.put(user.getId(), user);
        return user;
    }
    
    // PUT /api/users/{id} - 更新用户
    @PutMapping("/{id}")
    public User updateUser(@PathVariable int id, @RequestBody User user) {
        user.setId(id);
        users.put(id, user);
        return user;
    }
    
    // DELETE /api/users/{id} - 删除用户
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id) {
        users.remove(id);
    }
    
    // 用户实体类
    static class User {
        private int id;
        private String name;
        private String email;
        
        // Getter 和 Setter
        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
```

## 总结

Spring Boot 入门要点：
- **自动配置**：简化配置
- **起步依赖**：简化依赖管理
- **内嵌服务器**：无需部署到外部服务器
- **注解驱动**：使用注解简化开发
- **RESTful API**：快速开发 REST 接口

掌握 Spring Boot 可以快速开发 Web 应用。

---

**相关链接**：
- [第一个 HTTP 服务](../06-实践项目/第一个-HTTP-服务.md) — 实践项目
- [数据库操作](../04-数据库操作/JDBC-基础.md) — 数据库操作

---

#java #spring-boot #web开发 #restful-api

