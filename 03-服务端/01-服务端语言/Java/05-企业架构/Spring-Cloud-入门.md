# Spring Cloud 入门

Spring Cloud 是构建分布式系统和微服务架构的工具集。

## 什么是 Spring Cloud

Spring Cloud 提供了一整套微服务解决方案：
- **服务注册与发现**：Eureka、Consul、Nacos
- **配置管理**：Config Server、Nacos Config
- **服务调用**：OpenFeign、RestTemplate
- **负载均衡**：Ribbon、Spring Cloud LoadBalancer
- **断路器**：Hystrix、Resilience4j
- **API 网关**：Spring Cloud Gateway
- **分布式追踪**：Sleuth、Zipkin

## Spring Cloud 版本

Spring Cloud 版本命名规则：
- **2020.0.x** (Ilford) - 对应 Spring Boot 2.4.x
- **2021.0.x** (Jubilee) - 对应 Spring Boot 2.6.x
- **2022.0.x** (Kilburn) - 对应 Spring Boot 3.0.x

## 快速开始

### 1. 创建父项目

#### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.example</groupId>
    <artifactId>spring-cloud-demo</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <properties>
        <java.version>17</java.version>
        <spring-cloud.version>2023.0.0</spring-cloud.version>
    </properties>
    
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    
    <modules>
        <module>eureka-server</module>
        <module>user-service</module>
        <module>order-service</module>
    </modules>
</project>
```

## 服务注册与发现

### 使用 Nacos（推荐）

Nacos 是阿里巴巴开源的动态服务发现、配置管理和服务管理平台。

#### 1. 安装 Nacos

```bash
# 下载 Nacos
wget https://github.com/alibaba/nacos/releases/download/2.3.0/nacos-server-2.3.0.tar.gz

# 解压
tar -xzf nacos-server-2.3.0.tar.gz

# 启动（单机模式）
cd nacos/bin
sh startup.sh -m standalone
```

访问：http://localhost:8848/nacos（默认账号/密码：nacos/nacos）

#### 2. 服务提供者

##### 添加依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    <version>2022.0.0.0</version>
</dependency>
```

##### 配置文件

```properties
spring.application.name=user-service
server.port=8081

# Nacos 配置
spring.cloud.nacos.discovery.server-addr=localhost:8848
```

##### 启用服务发现

```java
@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
```

#### 3. 服务消费者

```java
@RestController
public class OrderController {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Bean
    @LoadBalanced  // 启用负载均衡
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    @GetMapping("/order/{id}")
    public Order getOrder(@PathVariable Integer id) {
        // 使用服务名调用（自动负载均衡）
        User user = restTemplate.getForObject(
            "http://user-service/api/users/1", 
            User.class
        );
        // ...
    }
}
```

## 服务调用

### 使用 OpenFeign

#### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

#### 创建 Feign 客户端

```java
package com.example.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * 用户服务 Feign 客户端
 */
@FeignClient(name = "user-service", path = "/api/users")
public interface UserFeignClient {
    
    @GetMapping("/{id}")
    User getUserById(@PathVariable("id") Integer id);
    
    @GetMapping
    List<User> getAllUsers();
}
```

#### 启用 Feign

```java
@SpringBootApplication
@EnableFeignClients
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
```

#### 使用 Feign

```java
@RestController
public class OrderController {
    
    @Autowired
    private UserFeignClient userFeignClient;
    
    @GetMapping("/order/{id}")
    public Order getOrder(@PathVariable Integer id) {
        Order order = orderService.getOrderById(id);
        
        // 通过 Feign 调用用户服务
        User user = userFeignClient.getUserById(order.getUserId());
        order.setUser(user);
        
        return order;
    }
}
```

## 配置中心

### 使用 Nacos Config

#### 添加依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    <version>2022.0.0.0</version>
</dependency>
```

#### 配置文件

```properties
# bootstrap.properties
spring.application.name=user-service
spring.cloud.nacos.config.server-addr=localhost:8848
spring.cloud.nacos.config.file-extension=yaml
spring.cloud.nacos.config.namespace=dev
```

#### 使用配置

```java
@RestController
@RefreshScope  // 支持动态刷新
public class ConfigController {
    
    @Value("${app.name:默认名称}")
    private String appName;
    
    @Value("${app.version:1.0.0}")
    private String appVersion;
    
    @GetMapping("/config")
    public Map<String, String> getConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("name", appName);
        config.put("version", appVersion);
        return config;
    }
}
```

## API 网关

### 使用 Spring Cloud Gateway

#### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

#### 配置文件

```yaml
spring:
  cloud:
    gateway:
      routes:
        # 用户服务路由
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
        # 订单服务路由
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
          filters:
            - StripPrefix=1
      # 全局跨域配置
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: "*"
            allowedMethods: "*"
            allowedHeaders: "*"
```

#### 自定义过滤器

```java
@Component
public class AuthFilter implements GatewayFilter, Ordered {
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String token = request.getHeaders().getFirst("Authorization");
        
        if (token == null || token.isEmpty()) {
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }
        
        return chain.filter(exchange);
    }
    
    @Override
    public int getOrder() {
        return -1;  // 优先级
    }
}
```

## 断路器

### 使用 Resilience4j

#### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
</dependency>
```

#### 使用断路器

```java
@Service
public class UserService {
    
    @Autowired
    private CircuitBreakerFactory circuitBreakerFactory;
    
    public User getUserById(Integer id) {
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("user-service");
        
        return circuitBreaker.run(
            () -> {
                // 调用远程服务
                return restTemplate.getForObject(
                    "http://user-service/api/users/" + id, 
                    User.class
                );
            },
            throwable -> {
                // 降级处理
                return new User();  // 返回默认值
            }
        );
    }
}
```

## 分布式追踪

### 使用 Sleuth + Zipkin

#### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-sleuth</artifactId>
</dependency>
<dependency>
    <groupId>io.zipkin.reporter2</groupId>
    <artifactId>zipkin-reporter-brave</artifactId>
</dependency>
```

#### 配置

```properties
spring.sleuth.sampler.probability=1.0
spring.zipkin.base-url=http://localhost:9411
```

## 实际应用示例

### 项目结构

```
spring-cloud-demo/
├── pom.xml
├── user-service/          # 用户服务
│   ├── pom.xml
│   └── src/
├── order-service/         # 订单服务
│   ├── pom.xml
│   └── src/
├── gateway-service/       # API 网关
│   ├── pom.xml
│   └── src/
└── config-service/        # 配置服务（可选）
    ├── pom.xml
    └── src/
```

### 完整示例

参考 [微服务基础](./微服务基础.md) 中的实践示例。

## 总结

Spring Cloud 提供了完整的微服务解决方案：
- **服务注册与发现**：Nacos、Eureka
- **服务调用**：OpenFeign、RestTemplate
- **配置管理**：Nacos Config、Config Server
- **API 网关**：Spring Cloud Gateway
- **断路器**：Resilience4j
- **分布式追踪**：Sleuth + Zipkin

掌握 Spring Cloud 可以构建完整的微服务架构。

---

**相关链接**：
- [微服务基础](./微服务基础.md) — 微服务架构基础
- [Spring Boot 入门](../03-Web开发/Spring-Boot-入门.md) — Spring Boot 基础

---

#java #spring-cloud #微服务 #分布式系统

