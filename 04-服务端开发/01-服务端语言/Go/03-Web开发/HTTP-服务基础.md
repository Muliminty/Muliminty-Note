# HTTP 服务基础

Go 标准库提供了强大的 `net/http` 包，可以轻松创建 HTTP 服务器。

## 最简单的 HTTP 服务器

```go
package main

import (
    "fmt"
    "net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    // 注册路由
    http.HandleFunc("/", helloHandler)
    
    // 启动服务器
    fmt.Println("服务器启动在 http://localhost:8080")
    http.ListenAndServe(":8080", nil)
}
```

## HTTP 请求和响应

### Request（请求）

```go
package main

import (
    "fmt"
    "net/http"
)

func requestInfo(w http.ResponseWriter, r *http.Request) {
    // 请求方法
    fmt.Fprintf(w, "方法: %s\n", r.Method)
    
    // 请求 URL
    fmt.Fprintf(w, "URL: %s\n", r.URL.String())
    fmt.Fprintf(w, "路径: %s\n", r.URL.Path)
    fmt.Fprintf(w, "查询参数: %s\n", r.URL.RawQuery)
    
    // 查询参数
    name := r.URL.Query().Get("name")
    fmt.Fprintf(w, "name 参数: %s\n", name)
    
    // 请求头
    fmt.Fprintf(w, "User-Agent: %s\n", r.Header.Get("User-Agent"))
    fmt.Fprintf(w, "Content-Type: %s\n", r.Header.Get("Content-Type"))
    
    // 请求体（需要先读取）
    // body, _ := io.ReadAll(r.Body)
    // defer r.Body.Close()
    
    // 表单数据
    r.ParseForm()
    username := r.Form.Get("username")
    fmt.Fprintf(w, "username: %s\n", username)
    
    // 远程地址
    fmt.Fprintf(w, "远程地址: %s\n", r.RemoteAddr)
}

func main() {
    http.HandleFunc("/info", requestInfo)
    http.ListenAndServe(":8080", nil)
}
```

### Response（响应）

```go
package main

import (
    "fmt"
    "net/http"
)

func responseExample(w http.ResponseWriter, r *http.Request) {
    // 设置响应头
    w.Header().Set("Content-Type", "text/plain; charset=utf-8")
    w.Header().Set("X-Custom-Header", "custom-value")
    
    // 设置状态码
    w.WriteHeader(http.StatusOK)
    
    // 写入响应体
    fmt.Fprintf(w, "响应内容")
    
    // 或者使用 w.Write
    // w.Write([]byte("响应内容"))
}

func jsonResponse(w http.ResponseWriter, r *http.Request) {
    // JSON 响应
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
    
    json := `{"message": "Hello, World!", "status": "ok"}`
    fmt.Fprintf(w, json)
}

func errorResponse(w http.ResponseWriter, r *http.Request) {
    // 错误响应
    http.Error(w, "内部服务器错误", http.StatusInternalServerError)
    
    // 或者手动设置
    // w.WriteHeader(http.StatusNotFound)
    // fmt.Fprintf(w, "页面未找到")
}

func main() {
    http.HandleFunc("/", responseExample)
    http.HandleFunc("/json", jsonResponse)
    http.HandleFunc("/error", errorResponse)
    http.ListenAndServe(":8080", nil)
}
```

## 路由处理

### 基本路由

```go
package main

import (
    "fmt"
    "net/http"
)

func homeHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "首页")
}

func aboutHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "关于我们")
}

func userHandler(w http.ResponseWriter, r *http.Request) {
    // 从路径中提取参数（需要手动解析）
    // /user/123 -> 需要自己解析
    fmt.Fprintf(w, "用户页面")
}

func main() {
    // 注册路由
    http.HandleFunc("/", homeHandler)
    http.HandleFunc("/about", aboutHandler)
    http.HandleFunc("/user", userHandler)
    
    http.ListenAndServe(":8080", nil)
}
```

### 使用 ServeMux

```go
package main

import (
    "fmt"
    "net/http"
)

func main() {
    // 创建自定义 ServeMux
    mux := http.NewServeMux()
    
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "首页")
    })
    
    mux.HandleFunc("/about", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "关于")
    })
    
    // 使用自定义 ServeMux
    http.ListenAndServe(":8080", mux)
}
```

## 中间件

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
        
        next(w, r)
        
        log.Printf(
            "%s %s %s %v",
            r.Method,
            r.RequestURI,
            r.RemoteAddr,
            time.Since(start),
        )
    }
}

// 认证中间件
func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        token := r.Header.Get("Authorization")
        if token != "Bearer secret-token" {
            http.Error(w, "未授权", http.StatusUnauthorized)
            return
        }
        next(w, r)
    }
}

// CORS 中间件
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        
        next(w, r)
    }
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    // 组合多个中间件
    handler := loggingMiddleware(
        corsMiddleware(
            authMiddleware(helloHandler),
        ),
    )
    
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}
```

## 自定义 Server

```go
package main

import (
    "fmt"
    "net/http"
    "time"
)

func main() {
    // 创建自定义 Server
    server := &http.Server{
        Addr:         ":8080",                    // 监听地址
        Handler:      nil,                        // 使用 DefaultServeMux
        ReadTimeout:  10 * time.Second,          // 读取超时
        WriteTimeout: 10 * time.Second,          // 写入超时
        IdleTimeout:  120 * time.Second,         // 空闲连接超时
        MaxHeaderBytes: 1 << 20,                 // 最大请求头大小（1MB）
    }
    
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello, World!")
    })
    
    fmt.Println("服务器启动在 http://localhost:8080")
    server.ListenAndServe()
}
```

## 优雅关闭

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
    
    // 优雅关闭：等待现有请求完成
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    
    if err := server.Shutdown(ctx); err != nil {
        fmt.Printf("服务器关闭错误: %v\n", err)
    }
    
    fmt.Println("服务器已关闭")
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
    fs := http.FileServer(http.Dir("./static"))
    http.Handle("/static/", http.StripPrefix("/static/", fs))
    
    // 或者直接挂载到根路径
    // http.Handle("/", fs)
    
    fmt.Println("服务器启动在 http://localhost:8080")
    fmt.Println("静态文件目录: ./static/")
    http.ListenAndServe(":8080", nil)
}
```

## 文件上传

```go
package main

import (
    "fmt"
    "io"
    "net/http"
    "os"
    "path/filepath"
)

func uploadHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "只支持 POST 方法", http.StatusMethodNotAllowed)
        return
    }
    
    // 解析 multipart form
    err := r.ParseMultipartForm(10 << 20) // 10MB
    if err != nil {
        http.Error(w, "解析表单失败", http.StatusBadRequest)
        return
    }
    
    // 获取文件
    file, handler, err := r.FormFile("file")
    if err != nil {
        http.Error(w, "获取文件失败", http.StatusBadRequest)
        return
    }
    defer file.Close()
    
    // 创建目标文件
    dst, err := os.Create(filepath.Join("./uploads", handler.Filename))
    if err != nil {
        http.Error(w, "创建文件失败", http.StatusInternalServerError)
        return
    }
    defer dst.Close()
    
    // 复制文件内容
    _, err = io.Copy(dst, file)
    if err != nil {
        http.Error(w, "保存文件失败", http.StatusInternalServerError)
        return
    }
    
    fmt.Fprintf(w, "文件上传成功: %s", handler.Filename)
}

func main() {
    // 创建上传目录
    os.MkdirAll("./uploads", 0755)
    
    http.HandleFunc("/upload", uploadHandler)
    
    // 上传表单页面
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        html := `
        <!DOCTYPE html>
        <html>
        <head>
            <title>文件上传</title>
        </head>
        <body>
            <h1>文件上传</h1>
            <form action="/upload" method="post" enctype="multipart/form-data">
                <input type="file" name="file">
                <button type="submit">上传</button>
            </form>
        </body>
        </html>
        `
        w.Header().Set("Content-Type", "text/html; charset=utf-8")
        fmt.Fprintf(w, html)
    })
    
    fmt.Println("服务器启动在 http://localhost:8080")
    http.ListenAndServe(":8080", nil)
}
```

## 总结

Go HTTP 服务的特点：

1. **简单易用**：标准库提供完整的 HTTP 服务器功能
2. **灵活**：可以自定义 Server、中间件、路由
3. **性能好**：基于 net 包，性能优秀
4. **功能完整**：支持文件上传、静态文件、优雅关闭等

掌握这些基础后，可以学习使用 Web 框架（如 Gin、Echo）来简化开发！

---

#go #HTTP服务 #Web开发 #服务器

