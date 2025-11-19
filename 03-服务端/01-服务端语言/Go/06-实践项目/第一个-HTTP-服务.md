# 第一个 HTTP 服务

这是 Go 语言入门实践的第一个项目，我们将从零开始搭建一个简单的 HTTP 服务器。

## 项目结构

```
hello-server/
├── go.mod
├── go.sum
├── main.go
└── README.md
```

## 步骤 1：初始化项目

```bash
# 创建项目目录
mkdir hello-server
cd hello-server

# 初始化 Go Module
go mod init hello-server
```

## 步骤 2：编写最简单的 HTTP 服务器

```go
// main.go
package main

import (
    "fmt"
    "net/http"
)

// 处理函数：处理 HTTP 请求
func helloHandler(w http.ResponseWriter, r *http.Request) {
    // w: 用于写入响应
    // r: 包含请求信息
    
    // 设置响应头
    w.Header().Set("Content-Type", "text/plain; charset=utf-8")
    
    // 写入响应体
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    // 注册路由：将路径 "/" 映射到处理函数
    http.HandleFunc("/", helloHandler)
    
    // 启动服务器，监听 8080 端口
    fmt.Println("服务器启动在 http://localhost:8080")
    err := http.ListenAndServe(":8080", nil)
    
    // 如果启动失败，打印错误
    if err != nil {
        fmt.Printf("服务器启动失败: %v\n", err)
    }
}
```

## 步骤 3：运行服务器

```bash
# 运行程序
go run main.go

# 或者先编译再运行
go build -o server main.go
./server
```

## 步骤 4：测试服务器

```bash
# 在另一个终端测试
curl http://localhost:8080

# 或者在浏览器访问
# http://localhost:8080
```

## 完整示例：多路由服务器

```go
package main

import (
    "fmt"
    "net/http"
    "time"
)

// 首页处理函数
func homeHandler(w http.ResponseWriter, r *http.Request) {
    html := `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Go HTTP 服务器</title>
    </head>
    <body>
        <h1>欢迎使用 Go HTTP 服务器</h1>
        <p>当前时间: %s</p>
        <ul>
            <li><a href="/hello">Hello</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/api/info">API Info</a></li>
        </ul>
    </body>
    </html>
    `
    w.Header().Set("Content-Type", "text/html; charset=utf-8")
    fmt.Fprintf(w, html, time.Now().Format("2006-01-02 15:04:05"))
}

// Hello 处理函数
func helloHandler(w http.ResponseWriter, r *http.Request) {
    // 获取查询参数
    name := r.URL.Query().Get("name")
    if name == "" {
        name = "World"
    }
    
    w.Header().Set("Content-Type", "text/plain; charset=utf-8")
    fmt.Fprintf(w, "Hello, %s!", name)
}

// About 处理函数
func aboutHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/plain; charset=utf-8")
    fmt.Fprintf(w, "这是一个用 Go 语言编写的简单 HTTP 服务器")
}

// API Info 处理函数（返回 JSON）
func apiInfoHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
    json := `{
        "name": "Go HTTP Server",
        "version": "1.0.0",
        "status": "running"
    }`
    fmt.Fprintf(w, json)
}

func main() {
    // 注册多个路由
    http.HandleFunc("/", homeHandler)
    http.HandleFunc("/hello", helloHandler)
    http.HandleFunc("/about", aboutHandler)
    http.HandleFunc("/api/info", apiInfoHandler)
    
    // 启动服务器
    port := ":8080"
    fmt.Printf("服务器启动在 http://localhost%s\n", port)
    fmt.Println("可用路由:")
    fmt.Println("  - http://localhost:8080/")
    fmt.Println("  - http://localhost:8080/hello?name=Go")
    fmt.Println("  - http://localhost:8080/about")
    fmt.Println("  - http://localhost:8080/api/info")
    
    err := http.ListenAndServe(port, nil)
    if err != nil {
        fmt.Printf("服务器启动失败: %v\n", err)
    }
}
```

## 使用自定义 Server

```go
package main

import (
    "fmt"
    "net/http"
    "time"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    // 创建自定义 Server
    server := &http.Server{
        Addr:         ":8080",           // 监听地址
        Handler:      nil,               // 使用默认的 DefaultServeMux
        ReadTimeout:  10 * time.Second,  // 读取超时
        WriteTimeout: 10 * time.Second,  // 写入超时
        IdleTimeout:  120 * time.Second, // 空闲超时
    }
    
    // 注册路由
    http.HandleFunc("/", helloHandler)
    
    fmt.Println("服务器启动在 http://localhost:8080")
    
    // 启动服务器
    err := server.ListenAndServe()
    if err != nil {
        fmt.Printf("服务器启动失败: %v\n", err)
    }
}
```

## 处理不同的 HTTP 方法

```go
package main

import (
    "fmt"
    "net/http"
)

func userHandler(w http.ResponseWriter, r *http.Request) {
    // 根据 HTTP 方法处理不同的逻辑
    switch r.Method {
    case http.MethodGet:
        // GET 请求：获取用户信息
        id := r.URL.Query().Get("id")
        fmt.Fprintf(w, "获取用户 ID: %s", id)
        
    case http.MethodPost:
        // POST 请求：创建用户
        // 读取请求体
        name := r.FormValue("name")
        email := r.FormValue("email")
        fmt.Fprintf(w, "创建用户: %s (%s)", name, email)
        
    case http.MethodPut:
        // PUT 请求：更新用户
        id := r.URL.Query().Get("id")
        name := r.FormValue("name")
        fmt.Fprintf(w, "更新用户 ID: %s, 新名称: %s", id, name)
        
    case http.MethodDelete:
        // DELETE 请求：删除用户
        id := r.URL.Query().Get("id")
        fmt.Fprintf(w, "删除用户 ID: %s", id)
        
    default:
        // 不支持的 HTTP 方法
        http.Error(w, "不支持的 HTTP 方法", http.StatusMethodNotAllowed)
    }
}

func main() {
    http.HandleFunc("/user", userHandler)
    
    fmt.Println("服务器启动在 http://localhost:8080")
    http.ListenAndServe(":8080", nil)
}
```

## 读取请求数据

```go
package main

import (
    "fmt"
    "io"
    "net/http"
)

func dataHandler(w http.ResponseWriter, r *http.Request) {
    // 1. 读取查询参数
    name := r.URL.Query().Get("name")
    age := r.URL.Query().Get("age")
    fmt.Printf("查询参数: name=%s, age=%s\n", name, age)
    
    // 2. 读取表单数据（application/x-www-form-urlencoded）
    if r.Method == http.MethodPost {
        // 解析表单
        r.ParseForm()
        
        // 获取表单字段
        username := r.Form.Get("username")
        password := r.Form.Get("password")
        fmt.Printf("表单数据: username=%s, password=%s\n", username, password)
        
        // 或者直接获取
        username2 := r.FormValue("username")
        fmt.Printf("直接获取: %s\n", username2)
    }
    
    // 3. 读取 JSON 请求体
    if r.Header.Get("Content-Type") == "application/json" {
        body, err := io.ReadAll(r.Body)
        if err != nil {
            http.Error(w, "读取请求体失败", http.StatusBadRequest)
            return
        }
        defer r.Body.Close()
        
        fmt.Printf("JSON 数据: %s\n", string(body))
    }
    
    // 4. 读取请求头
    contentType := r.Header.Get("Content-Type")
    userAgent := r.Header.Get("User-Agent")
    fmt.Printf("Content-Type: %s\n", contentType)
    fmt.Printf("User-Agent: %s\n", userAgent)
    
    // 响应
    w.Header().Set("Content-Type", "text/plain; charset=utf-8")
    fmt.Fprintf(w, "数据接收成功")
}

func main() {
    http.HandleFunc("/data", dataHandler)
    
    fmt.Println("服务器启动在 http://localhost:8080")
    http.ListenAndServe(":8080", nil)
}
```

## 返回 JSON 响应

```go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "time"
)

// 定义响应结构
type Response struct {
    Code    int         `json:"code"`
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"`
    Time    string      `json:"time"`
}

// 用户结构
type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

func userHandler(w http.ResponseWriter, r *http.Request) {
    // 创建用户数据
    user := User{
        ID:    1,
        Name:  "Alice",
        Email: "alice@example.com",
    }
    
    // 创建响应
    response := Response{
        Code:    200,
        Message: "成功",
        Data:    user,
        Time:    time.Now().Format("2006-01-02 15:04:05"),
    }
    
    // 设置响应头
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
    
    // 编码 JSON
    jsonData, err := json.Marshal(response)
    if err != nil {
        http.Error(w, "JSON 编码失败", http.StatusInternalServerError)
        return
    }
    
    // 写入响应
    w.Write(jsonData)
}

func main() {
    http.HandleFunc("/user", userHandler)
    
    fmt.Println("服务器启动在 http://localhost:8080")
    http.ListenAndServe(":8080", nil)
}
```

## 静态文件服务

```go
package main

import (
    "fmt"
    "net/http"
)

func main() {
    // 提供静态文件服务
    // 将 /static/ 路径映射到 ./static/ 目录
    fs := http.FileServer(http.Dir("./static"))
    http.Handle("/static/", http.StripPrefix("/static/", fs))
    
    // 首页
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        html := `
        <!DOCTYPE html>
        <html>
        <head>
            <title>静态文件服务</title>
        </head>
        <body>
            <h1>静态文件服务示例</h1>
            <p>访问 <a href="/static/test.txt">/static/test.txt</a></p>
        </body>
        </html>
        `
        w.Header().Set("Content-Type", "text/html; charset=utf-8")
        fmt.Fprintf(w, html)
    })
    
    fmt.Println("服务器启动在 http://localhost:8080")
    fmt.Println("静态文件目录: ./static/")
    http.ListenAndServe(":8080", nil)
}
```

## 错误处理

```go
package main

import (
    "fmt"
    "log"
    "net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
    // 检查请求方法
    if r.Method != http.MethodGet {
        http.Error(w, "只支持 GET 方法", http.StatusMethodNotAllowed)
        return
    }
    
    // 处理逻辑
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    http.HandleFunc("/", helloHandler)
    
    port := ":8080"
    fmt.Printf("服务器启动在 http://localhost%s\n", port)
    
    // 使用 log.Fatal 自动处理错误
    // 如果启动失败，会自动退出程序
    log.Fatal(http.ListenAndServe(port, nil))
}
```

## 完整示例：带日志的服务器

```go
package main

import (
    "fmt"
    "log"
    "net/http"
    "time"
)

// 日志中间件
func loggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        
        // 调用下一个处理函数
        next(w, r)
        
        // 记录日志
        log.Printf(
            "%s %s %s %v",
            r.Method,
            r.RequestURI,
            r.RemoteAddr,
            time.Since(start),
        )
    }
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    // 使用中间件包装处理函数
    http.HandleFunc("/", loggingMiddleware(helloHandler))
    
    port := ":8080"
    fmt.Printf("服务器启动在 http://localhost%s\n", port)
    
    log.Fatal(http.ListenAndServe(port, nil))
}
```

## 测试服务器

### 使用 curl 测试

```bash
# GET 请求
curl http://localhost:8080/

# GET 请求带参数
curl "http://localhost:8080/hello?name=Go"

# POST 请求
curl -X POST http://localhost:8080/user \
  -d "name=Alice&email=alice@example.com"

# POST JSON 请求
curl -X POST http://localhost:8080/api/user \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}'
```

### 使用浏览器测试

直接在浏览器访问：
- http://localhost:8080/
- http://localhost:8080/hello?name=Go

## 常见问题

### 1. 端口被占用

```go
// 错误：listen tcp :8080: bind: address already in use
// 解决：更换端口或关闭占用端口的程序
port := ":8081"  // 使用其他端口
```

### 2. 跨域问题

```go
// 添加 CORS 头
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        
        next(w, r)
    }
}
```

### 3. 优雅关闭

```go
package main

import (
    "context"
    "fmt"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"
)

func main() {
    server := &http.Server{
        Addr:    ":8080",
        Handler: nil,
    }
    
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello, World!")
    })
    
    // 在 goroutine 中启动服务器
    go func() {
        fmt.Println("服务器启动在 http://localhost:8080")
        if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            fmt.Printf("服务器错误: %v\n", err)
        }
    }()
    
    // 等待中断信号
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    
    fmt.Println("正在关闭服务器...")
    
    // 优雅关闭：等待 5 秒让现有请求完成
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    
    if err := server.Shutdown(ctx); err != nil {
        fmt.Printf("服务器关闭错误: %v\n", err)
    }
    
    fmt.Println("服务器已关闭")
}
```

## 总结

通过这个项目，我们学会了：

1. **创建 HTTP 服务器**：使用 `http.ListenAndServe`
2. **注册路由**：使用 `http.HandleFunc`
3. **处理请求**：编写处理函数
4. **读取请求数据**：查询参数、表单、JSON
5. **返回响应**：文本、HTML、JSON
6. **错误处理**：使用 `http.Error`
7. **中间件**：包装处理函数
8. **优雅关闭**：使用 `Shutdown`

这是 Go Web 开发的基础，接下来可以学习使用 Web 框架（如 Gin、Echo）来简化开发！

---

#go #HTTP服务 #Web开发 #实践项目

