# MyBatis 入门

MyBatis 是一个优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射。

## 什么是 MyBatis

MyBatis 是一个半自动化的 ORM 框架，特点：
- **SQL 可控**：可以编写原生 SQL，灵活控制
- **结果映射**：自动将 SQL 结果映射到 Java 对象
- **简单易学**：学习成本低，配置简单

## MyBatis vs JDBC

| 特性 | JDBC | MyBatis |
|------|------|---------|
| SQL 编写 | 代码中硬编码 | XML 或注解配置 |
| 结果映射 | 手动处理 | 自动映射 |
| 代码量 | 多 | 少 |
| 灵活性 | 高 | 高 |
| 学习成本 | 低 | 中 |

## 在 Spring Boot 中使用 MyBatis

### 1. 添加依赖

```xml
<dependencies>
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- MyBatis Spring Boot Starter -->
    <dependency>
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>3.0.3</version>
    </dependency>
    
    <!-- MySQL 驱动 -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>8.0.33</version>
    </dependency>
</dependencies>
```

### 2. 配置文件

#### application.properties

```properties
# 数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/test_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# MyBatis 配置
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.type-aliases-package=com.example.entity
mybatis.configuration.map-underscore-to-camel-case=true
```

### 3. 创建实体类

```java
package com.example.entity;

/**
 * 用户实体类
 */
public class User {
    private Integer id;
    private String name;
    private String email;
    private Integer age;
    
    // 构造方法
    public User() {
    }
    
    public User(String name, String email, Integer age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }
    
    // Getter 和 Setter 方法
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
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
    
    public Integer getAge() {
        return age;
    }
    
    public void setAge(Integer age) {
        this.age = age;
    }
    
    @Override
    public String toString() {
        return "User{id=" + id + ", name='" + name + "', email='" + email + "', age=" + age + "}";
    }
}
```

### 4. 创建 Mapper 接口

```java
package com.example.mapper;

import com.example.entity.User;
import org.apache.ibatis.annotations.*;
import java.util.List;

/**
 * 用户 Mapper 接口
 * @Mapper 注解标识这是一个 MyBatis Mapper
 */
@Mapper
public interface UserMapper {
    
    /**
     * 查询所有用户
     * 使用 @Select 注解编写 SQL
     */
    @Select("SELECT * FROM users")
    List<User> findAll();
    
    /**
     * 根据 ID 查询用户
     */
    @Select("SELECT * FROM users WHERE id = #{id}")
    User findById(Integer id);
    
    /**
     * 插入用户
     * @Options 用于获取自增主键
     */
    @Insert("INSERT INTO users (name, email, age) VALUES (#{name}, #{email}, #{age})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);
    
    /**
     * 更新用户
     */
    @Update("UPDATE users SET name = #{name}, email = #{email}, age = #{age} WHERE id = #{id}")
    int update(User user);
    
    /**
     * 删除用户
     */
    @Delete("DELETE FROM users WHERE id = #{id}")
    int deleteById(Integer id);
    
    /**
     * 根据年龄查询用户
     */
    @Select("SELECT * FROM users WHERE age > #{age}")
    List<User> findByAgeGreaterThan(Integer age);
}
```

### 5. 使用 XML 配置（可选）

#### UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.mapper.UserMapper">
    
    <!-- 结果映射 -->
    <resultMap id="userResultMap" type="User">
        <id property="id" column="id"/>
        <result property="name" column="name"/>
        <result property="email" column="email"/>
        <result property="age" column="age"/>
    </resultMap>
    
    <!-- 查询所有用户 -->
    <select id="findAll" resultMap="userResultMap">
        SELECT * FROM users
    </select>
    
    <!-- 根据 ID 查询 -->
    <select id="findById" parameterType="Integer" resultMap="userResultMap">
        SELECT * FROM users WHERE id = #{id}
    </select>
    
    <!-- 插入用户 -->
    <insert id="insert" parameterType="User" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO users (name, email, age) 
        VALUES (#{name}, #{email}, #{age})
    </insert>
    
    <!-- 更新用户 -->
    <update id="update" parameterType="User">
        UPDATE users 
        SET name = #{name}, email = #{email}, age = #{age} 
        WHERE id = #{id}
    </update>
    
    <!-- 删除用户 -->
    <delete id="deleteById" parameterType="Integer">
        DELETE FROM users WHERE id = #{id}
    </delete>
    
    <!-- 动态 SQL：根据条件查询 -->
    <select id="findByCondition" parameterType="User" resultMap="userResultMap">
        SELECT * FROM users
        <where>
            <if test="name != null and name != ''">
                AND name LIKE CONCAT('%', #{name}, '%')
            </if>
            <if test="age != null">
                AND age = #{age}
            </if>
        </where>
    </select>
</mapper>
```

### 6. 创建 Service 层

```java
package com.example.service;

import com.example.entity.User;
import com.example.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 用户服务类
 */
@Service
public class UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    /**
     * 获取所有用户
     */
    public List<User> getAllUsers() {
        return userMapper.findAll();
    }
    
    /**
     * 根据 ID 获取用户
     */
    public User getUserById(Integer id) {
        return userMapper.findById(id);
    }
    
    /**
     * 创建用户
     */
    public int createUser(User user) {
        return userMapper.insert(user);
    }
    
    /**
     * 更新用户
     */
    public int updateUser(User user) {
        return userMapper.update(user);
    }
    
    /**
     * 删除用户
     */
    public int deleteUser(Integer id) {
        return userMapper.deleteById(id);
    }
}
```

### 7. 创建 Controller

```java
package com.example.controller;

import com.example.entity.User;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 获取所有用户
     */
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    /**
     * 根据 ID 获取用户
     */
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }
    
    /**
     * 创建用户
     */
    @PostMapping
    public User createUser(@RequestBody User user) {
        userService.createUser(user);
        return user;
    }
    
    /**
     * 更新用户
     */
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Integer id, @RequestBody User user) {
        user.setId(id);
        userService.updateUser(user);
        return user;
    }
    
    /**
     * 删除用户
     */
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }
}
```

## 动态 SQL

### if 标签

```xml
<select id="findByCondition" resultMap="userResultMap">
    SELECT * FROM users
    <where>
        <if test="name != null and name != ''">
            AND name = #{name}
        </if>
        <if test="age != null">
            AND age = #{age}
        </if>
    </where>
</select>
```

### choose、when、otherwise

```xml
<select id="findByCondition" resultMap="userResultMap">
    SELECT * FROM users
    <where>
        <choose>
            <when test="name != null">
                AND name = #{name}
            </when>
            <when test="email != null">
                AND email = #{email}
            </when>
            <otherwise>
                AND age > 0
            </otherwise>
        </choose>
    </where>
</select>
```

### foreach 标签

```xml
<!-- 批量查询 -->
<select id="findByIds" resultMap="userResultMap">
    SELECT * FROM users
    WHERE id IN
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>

<!-- 批量插入 -->
<insert id="batchInsert">
    INSERT INTO users (name, email, age) VALUES
    <foreach collection="users" item="user" separator=",">
        (#{user.name}, #{user.email}, #{user.age})
    </foreach>
</insert>
```

## 参数传递

### 单个参数

```java
// Mapper 接口
@Select("SELECT * FROM users WHERE id = #{id}")
User findById(Integer id);

// 调用
User user = userMapper.findById(1);
```

### 多个参数

```java
// 使用 @Param 注解
@Select("SELECT * FROM users WHERE name = #{name} AND age = #{age}")
User findByNameAndAge(@Param("name") String name, @Param("age") Integer age);

// 使用 Map
@Select("SELECT * FROM users WHERE name = #{name} AND age = #{age}")
User findByMap(Map<String, Object> params);
```

### 对象参数

```java
// 直接使用对象属性
@Update("UPDATE users SET name = #{name}, email = #{email} WHERE id = #{id}")
int update(User user);
```

## 结果映射

### 自动映射

```java
// 字段名和属性名一致时自动映射
@Select("SELECT id, name, email, age FROM users")
List<User> findAll();
```

### 手动映射

```xml
<resultMap id="userResultMap" type="User">
    <id property="id" column="id"/>
    <result property="name" column="user_name"/>
    <result property="email" column="user_email"/>
    <result property="age" column="user_age"/>
</resultMap>
```

## 最佳实践

### 1. 使用 Mapper 扫描

```java
@SpringBootApplication
@MapperScan("com.example.mapper")  // 扫描 Mapper 接口
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 2. 使用 XML 配置复杂 SQL

```java
// 简单 SQL 使用注解
@Select("SELECT * FROM users WHERE id = #{id}")
User findById(Integer id);

// 复杂 SQL 使用 XML
// 在 UserMapper.xml 中配置
```

### 3. 使用动态 SQL

```xml
<!-- 根据条件动态构建 SQL -->
<select id="findByCondition" resultMap="userResultMap">
    SELECT * FROM users
    <where>
        <if test="name != null">AND name = #{name}</if>
        <if test="age != null">AND age = #{age}</if>
    </where>
</select>
```

## 总结

MyBatis 是一个强大的持久层框架：
- **注解方式**：简单 SQL 使用注解
- **XML 方式**：复杂 SQL 使用 XML
- **动态 SQL**：灵活的条件查询
- **结果映射**：自动或手动映射
- **参数传递**：支持多种参数类型

掌握 MyBatis 可以高效地进行数据库操作。

---

**相关链接**：
- [JDBC 基础](./JDBC-基础.md) — JDBC 基础操作
- [Spring Boot 入门](../03-Web开发/Spring-Boot-入门.md) — Spring Boot 集成

---

#java #mybatis #orm #数据库

