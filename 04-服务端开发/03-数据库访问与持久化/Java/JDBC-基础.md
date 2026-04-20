# JDBC 基础

JDBC（Java Database Connectivity）是 Java 访问数据库的标准 API。

## 什么是 JDBC

JDBC 是 Java 提供的用于执行 SQL 语句的 API，它提供了：
- 连接数据库的方法
- 执行 SQL 语句的方法
- 处理查询结果的方法

## JDBC 架构

```
Java 应用程序
    ↓
JDBC API
    ↓
JDBC 驱动管理器（DriverManager）
    ↓
JDBC 驱动（Driver）
    ↓
数据库
```

## 准备工作

### 1. 添加数据库驱动依赖

#### Maven 配置（MySQL 示例）

```xml
<dependencies>
    <!-- MySQL 驱动 -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>8.0.33</version>
    </dependency>
</dependencies>
```

### 2. 创建数据库和表

```sql
-- 创建数据库
CREATE DATABASE test_db;

-- 使用数据库
USE test_db;

-- 创建用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    age INT
);

-- 插入测试数据
INSERT INTO users (name, email, age) VALUES
('张三', 'zhangsan@example.com', 25),
('李四', 'lisi@example.com', 30),
('王五', 'wangwu@example.com', 28);
```

## JDBC 基本步骤

### 1. 加载驱动

```java
// 方式1：使用 Class.forName（旧方式，JDBC 4.0+ 可以省略）
Class.forName("com.mysql.cj.jdbc.Driver");

// 方式2：JDBC 4.0+ 自动加载驱动（推荐）
// 不需要显式加载，只要在 classpath 中有驱动即可
```

### 2. 建立连接

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class JDBCConnection {
    // 数据库连接信息
    private static final String URL = "jdbc:mysql://localhost:3306/test_db?useSSL=false&serverTimezone=UTC";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "password";
    
    public static Connection getConnection() throws SQLException {
        // 建立数据库连接
        Connection conn = DriverManager.getConnection(URL, USERNAME, PASSWORD);
        return conn;
    }
}
```

### 3. 执行 SQL 语句

#### Statement

```java
import java.sql.*;

public class StatementExample {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/test_db?useSSL=false&serverTimezone=UTC";
        String username = "root";
        String password = "password";
        
        try (Connection conn = DriverManager.getConnection(url, username, password);
             Statement stmt = conn.createStatement()) {
            
            // 执行查询
            String sql = "SELECT * FROM users";
            ResultSet rs = stmt.executeQuery(sql);
            
            // 处理结果集
            while (rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("name");
                String email = rs.getString("email");
                int age = rs.getInt("age");
                
                System.out.println("ID: " + id + ", 姓名: " + name + 
                                 ", 邮箱: " + email + ", 年龄: " + age);
            }
            
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

#### PreparedStatement（推荐）

```java
import java.sql.*;

public class PreparedStatementExample {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/test_db?useSSL=false&serverTimezone=UTC";
        String username = "root";
        String password = "password";
        
        try (Connection conn = DriverManager.getConnection(url, username, password)) {
            
            // 插入数据（使用 PreparedStatement，防止 SQL 注入）
            String insertSql = "INSERT INTO users (name, email, age) VALUES (?, ?, ?)";
            try (PreparedStatement pstmt = conn.prepareStatement(insertSql)) {
                pstmt.setString(1, "赵六");
                pstmt.setString(2, "zhaoliu@example.com");
                pstmt.setInt(3, 32);
                
                int rows = pstmt.executeUpdate();
                System.out.println("插入了 " + rows + " 行");
            }
            
            // 查询数据
            String selectSql = "SELECT * FROM users WHERE age > ?";
            try (PreparedStatement pstmt = conn.prepareStatement(selectSql)) {
                pstmt.setInt(1, 25);
                
                ResultSet rs = pstmt.executeQuery();
                while (rs.next()) {
                    System.out.println("姓名: " + rs.getString("name") + 
                                     ", 年龄: " + rs.getInt("age"));
                }
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

## CRUD 操作示例

### 完整的 CRUD 示例

```java
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {
    private String url = "jdbc:mysql://localhost:3306/test_db?useSSL=false&serverTimezone=UTC";
    private String username = "root";
    private String password = "password";
    
    // 获取数据库连接
    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }
    
    /**
     * 创建用户
     */
    public int createUser(String name, String email, int age) {
        String sql = "INSERT INTO users (name, email, age) VALUES (?, ?, ?)";
        
        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, name);
            pstmt.setString(2, email);
            pstmt.setInt(3, age);
            
            return pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            return 0;
        }
    }
    
    /**
     * 根据 ID 查询用户
     */
    public User getUserById(int id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        
        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                User user = new User();
                user.setId(rs.getInt("id"));
                user.setName(rs.getString("name"));
                user.setEmail(rs.getString("email"));
                user.setAge(rs.getInt("age"));
                return user;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
    
    /**
     * 查询所有用户
     */
    public List<User> getAllUsers() {
        String sql = "SELECT * FROM users";
        List<User> users = new ArrayList<>();
        
        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            
            while (rs.next()) {
                User user = new User();
                user.setId(rs.getInt("id"));
                user.setName(rs.getString("name"));
                user.setEmail(rs.getString("email"));
                user.setAge(rs.getInt("age"));
                users.add(user);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return users;
    }
    
    /**
     * 更新用户
     */
    public int updateUser(int id, String name, String email, int age) {
        String sql = "UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?";
        
        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, name);
            pstmt.setString(2, email);
            pstmt.setInt(3, age);
            pstmt.setInt(4, id);
            
            return pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            return 0;
        }
    }
    
    /**
     * 删除用户
     */
    public int deleteUser(int id) {
        String sql = "DELETE FROM users WHERE id = ?";
        
        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            return pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            return 0;
        }
    }
    
    // 用户实体类
    static class User {
        private int id;
        private String name;
        private String email;
        private int age;
        
        // Getter 和 Setter 方法
        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public int getAge() { return age; }
        public void setAge(int age) { this.age = age; }
        
        @Override
        public String toString() {
            return "User{id=" + id + ", name='" + name + "', email='" + email + "', age=" + age + "}";
        }
    }
}
```

## 事务管理

```java
import java.sql.*;

public class TransactionExample {
    public static void transferMoney(int fromId, int toId, double amount) {
        String url = "jdbc:mysql://localhost:3306/test_db?useSSL=false&serverTimezone=UTC";
        String username = "root";
        String password = "password";
        
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(url, username, password);
            
            // 关闭自动提交，开启事务
            conn.setAutoCommit(false);
            
            // 扣除转出账户金额
            String sql1 = "UPDATE accounts SET balance = balance - ? WHERE id = ?";
            try (PreparedStatement pstmt1 = conn.prepareStatement(sql1)) {
                pstmt1.setDouble(1, amount);
                pstmt1.setInt(2, fromId);
                pstmt1.executeUpdate();
            }
            
            // 增加转入账户金额
            String sql2 = "UPDATE accounts SET balance = balance + ? WHERE id = ?";
            try (PreparedStatement pstmt2 = conn.prepareStatement(sql2)) {
                pstmt2.setDouble(1, amount);
                pstmt2.setInt(2, toId);
                pstmt2.executeUpdate();
            }
            
            // 提交事务
            conn.commit();
            System.out.println("转账成功");
            
        } catch (SQLException e) {
            // 回滚事务
            try {
                if (conn != null) {
                    conn.rollback();
                    System.out.println("事务回滚");
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
        } finally {
            // 恢复自动提交
            try {
                if (conn != null) {
                    conn.setAutoCommit(true);
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
```

## 连接池

### 使用 HikariCP（推荐）

#### 添加依赖

```xml
<dependency>
    <groupId>com.zaxxer</groupId>
    <artifactId>HikariCP</artifactId>
    <version>5.0.1</version>
</dependency>
```

#### 使用连接池

```java
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class ConnectionPoolExample {
    private static HikariDataSource dataSource;
    
    static {
        // 配置连接池
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/test_db?useSSL=false&serverTimezone=UTC");
        config.setUsername("root");
        config.setPassword("password");
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        
        // 连接池配置
        config.setMaximumPoolSize(10);  // 最大连接数
        config.setMinimumIdle(5);       // 最小空闲连接数
        config.setConnectionTimeout(30000);  // 连接超时时间（毫秒）
        config.setIdleTimeout(600000);   // 空闲连接超时时间
        config.setMaxLifetime(1800000);  // 连接最大生存时间
        
        dataSource = new HikariDataSource(config);
    }
    
    // 获取连接
    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
    
    // 关闭连接池
    public static void close() {
        if (dataSource != null) {
            dataSource.close();
        }
    }
}
```

## 最佳实践

### 1. 使用 try-with-resources

```java
// 推荐：自动关闭资源
try (Connection conn = getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql);
     ResultSet rs = pstmt.executeQuery()) {
    // 使用资源
} catch (SQLException e) {
    e.printStackTrace();
}
```

### 2. 使用 PreparedStatement

```java
// 推荐：防止 SQL 注入
PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
pstmt.setInt(1, userId);

// 不推荐：容易 SQL 注入
Statement stmt = conn.createStatement();
stmt.executeQuery("SELECT * FROM users WHERE id = " + userId);
```

### 3. 处理异常

```java
try {
    // JDBC 操作
} catch (SQLException e) {
    // 记录日志
    logger.error("数据库操作失败", e);
    // 抛出业务异常或返回错误信息
    throw new RuntimeException("操作失败", e);
}
```

### 4. 使用连接池

```java
// 推荐：使用连接池管理连接
// 不推荐：每次都创建新连接（性能差）
```

## 总结

JDBC 是 Java 访问数据库的基础：
- **连接数据库**：使用 DriverManager 或连接池
- **执行 SQL**：使用 Statement 或 PreparedStatement
- **处理结果**：使用 ResultSet
- **事务管理**：使用 Connection 的事务方法
- **最佳实践**：使用 PreparedStatement、连接池、try-with-resources

掌握 JDBC 是学习 ORM 框架（如 MyBatis）的基础。

---

**相关链接**：
- [MyBatis-入门](./MyBatis-入门.md) — MyBatis ORM 框架
- [Spring Boot 入门](../03-Web开发/Spring-Boot-入门.md) — Spring Boot 数据库集成

---

#java #jdbc #数据库 #sql

