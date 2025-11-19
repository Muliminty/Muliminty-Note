# Goroutine 协程

Goroutine 是 Go 语言并发编程的核心，它是轻量级线程，由 Go 运行时管理。

## 什么是 Goroutine？

Goroutine 是 Go 语言的并发执行单元，类似于线程，但更轻量：
- **线程**：通常需要几 MB 内存，创建和切换成本高
- **Goroutine**：只需要几 KB 内存，创建和切换成本低

## 创建 Goroutine

### 基本用法

```go
package main

import (
    "fmt"
    "time"
)

func sayHello() {
    fmt.Println("Hello from Goroutine!")
}

func main() {
    // 使用 go 关键字启动 Goroutine
    go sayHello()
    
    // 主 Goroutine 继续执行
    fmt.Println("Hello from main!")
    
    // 等待一下，让 Goroutine 有时间执行
    time.Sleep(time.Second)
    
    // 输出（顺序可能不同）：
    // Hello from main!
    // Hello from Goroutine!
}
```

### 匿名函数 Goroutine

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // 使用匿名函数创建 Goroutine
    go func() {
        fmt.Println("匿名函数 Goroutine")
    }()
    
    // 带参数的匿名函数
    go func(name string) {
        fmt.Printf("Hello, %s!\n", name)
    }("Go")
    
    time.Sleep(time.Second)
}
```

### 多个 Goroutine

```go
package main

import (
    "fmt"
    "time"
)

func printNumbers(id int) {
    for i := 0; i < 5; i++ {
        fmt.Printf("Goroutine %d: %d\n", id, i)
        time.Sleep(100 * time.Millisecond)
    }
}

func main() {
    // 启动多个 Goroutine
    for i := 0; i < 3; i++ {
        go printNumbers(i)
    }
    
    // 等待所有 Goroutine 完成
    time.Sleep(2 * time.Second)
    
    // 输出（顺序不确定）：
    // Goroutine 0: 0
    // Goroutine 1: 0
    // Goroutine 2: 0
    // Goroutine 0: 1
    // ...
}
```

## Goroutine 的生命周期

```go
package main

import (
    "fmt"
    "time"
)

func worker(id int) {
    fmt.Printf("Worker %d 开始工作\n", id)
    time.Sleep(time.Second)
    fmt.Printf("Worker %d 完成工作\n", id)
}

func main() {
    // 启动 Goroutine
    go worker(1)
    go worker(2)
    go worker(3)
    
    // 主 Goroutine 不等待，直接退出
    // 如果主 Goroutine 退出，所有子 Goroutine 也会被终止
    // 所以需要等待
    
    time.Sleep(2 * time.Second)
    fmt.Println("主程序结束")
}
```

## 等待 Goroutine 完成

### 使用 time.Sleep（不推荐）

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    go func() {
        time.Sleep(2 * time.Second)
        fmt.Println("Goroutine 完成")
    }()
    
    time.Sleep(3 * time.Second)  // 不确定需要等待多久
    fmt.Println("主程序结束")
}
```

### 使用 sync.WaitGroup（推荐）

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done()  // 完成时减少计数
    
    fmt.Printf("Worker %d 开始工作\n", id)
    time.Sleep(time.Second)
    fmt.Printf("Worker %d 完成工作\n", id)
}

func main() {
    var wg sync.WaitGroup
    
    // 启动 3 个 Goroutine
    for i := 1; i <= 3; i++ {
        wg.Add(1)  // 增加计数
        go worker(i, &wg)
    }
    
    // 等待所有 Goroutine 完成
    wg.Wait()
    fmt.Println("所有 Worker 完成，主程序结束")
}
```

### 使用 Channel（推荐）

```go
package main

import (
    "fmt"
    "time"
)

func worker(id int, done chan bool) {
    fmt.Printf("Worker %d 开始工作\n", id)
    time.Sleep(time.Second)
    fmt.Printf("Worker %d 完成工作\n", id)
    done <- true  // 发送完成信号
}

func main() {
    done := make(chan bool, 3)  // 缓冲 Channel
    
    // 启动 3 个 Goroutine
    for i := 1; i <= 3; i++ {
        go worker(i, done)
    }
    
    // 等待所有 Goroutine 完成
    for i := 0; i < 3; i++ {
        <-done  // 接收完成信号
    }
    
    fmt.Println("所有 Worker 完成，主程序结束")
}
```

## Goroutine 的调度

```go
package main

import (
    "fmt"
    "runtime"
    "time"
)

func main() {
    // 查看当前 Goroutine 数量
    fmt.Printf("当前 Goroutine 数量: %d\n", runtime.NumGoroutine())
    
    // 启动多个 Goroutine
    for i := 0; i < 10; i++ {
        go func(id int) {
            time.Sleep(time.Second)
            fmt.Printf("Goroutine %d 执行\n", id)
        }(i)
    }
    
    fmt.Printf("启动后 Goroutine 数量: %d\n", runtime.NumGoroutine())
    
    time.Sleep(2 * time.Second)
    fmt.Printf("完成后 Goroutine 数量: %d\n", runtime.NumGoroutine())
    
    // 让出 CPU 时间片
    runtime.Gosched()
    
    // 设置最大 CPU 核心数
    runtime.GOMAXPROCS(4)  // 使用 4 个 CPU 核心
}
```

## 常见模式

### 1. 生产者-消费者模式

```go
package main

import (
    "fmt"
    "time"
)

func producer(ch chan<- int) {
    for i := 0; i < 5; i++ {
        ch <- i
        fmt.Printf("生产: %d\n", i)
        time.Sleep(100 * time.Millisecond)
    }
    close(ch)  // 关闭 Channel
}

func consumer(ch <-chan int) {
    for value := range ch {
        fmt.Printf("消费: %d\n", value)
        time.Sleep(200 * time.Millisecond)
    }
}

func main() {
    ch := make(chan int, 3)  // 缓冲 Channel
    
    go producer(ch)
    go consumer(ch)
    
    time.Sleep(3 * time.Second)
}
```

### 2. Worker Pool 模式

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    
    for job := range jobs {
        fmt.Printf("Worker %d 处理任务 %d\n", id, job)
        time.Sleep(time.Second)  // 模拟工作
        results <- job * 2       // 返回结果
    }
}

func main() {
    const numWorkers = 3
    const numJobs = 10
    
    jobs := make(chan int, numJobs)
    results := make(chan int, numJobs)
    var wg sync.WaitGroup
    
    // 启动 Worker
    for i := 1; i <= numWorkers; i++ {
        wg.Add(1)
        go worker(i, jobs, results, &wg)
    }
    
    // 发送任务
    for j := 1; j <= numJobs; j++ {
        jobs <- j
    }
    close(jobs)
    
    // 等待所有 Worker 完成
    go func() {
        wg.Wait()
        close(results)
    }()
    
    // 收集结果
    for result := range results {
        fmt.Printf("结果: %d\n", result)
    }
}
```

### 3. 扇出-扇入模式

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

// 扇出：一个 Channel 分发到多个 Goroutine
func fanOut(input <-chan int, outputs []chan<- int) {
    defer func() {
        for _, ch := range outputs {
            close(ch)
        }
    }()
    
    for value := range input {
        for _, ch := range outputs {
            ch <- value
        }
    }
}

// 扇入：多个 Channel 合并到一个 Channel
func fanIn(inputs []<-chan int, output chan<- int) {
    var wg sync.WaitGroup
    
    for _, ch := range inputs {
        wg.Add(1)
        go func(c <-chan int) {
            defer wg.Done()
            for value := range c {
                output <- value
            }
        }(ch)
    }
    
    wg.Wait()
    close(output)
}

func main() {
    input := make(chan int)
    outputs := []chan<- int{
        make(chan int, 10),
        make(chan int, 10),
    }
    finalOutput := make(chan int, 20)
    
    // 启动扇出
    go fanOut(input, outputs)
    
    // 启动扇入
    inputs := []<-chan int{outputs[0], outputs[1]}
    go fanIn(inputs, finalOutput)
    
    // 发送数据
    go func() {
        for i := 0; i < 10; i++ {
            input <- i
        }
        close(input)
    }()
    
    // 接收结果
    for value := range finalOutput {
        fmt.Printf("结果: %d\n", value)
    }
}
```

## 注意事项

### 1. 闭包陷阱

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // 错误示例：所有 Goroutine 共享同一个变量
    for i := 0; i < 3; i++ {
        go func() {
            fmt.Println(i)  // 可能都打印 3
        }()
    }
    
    time.Sleep(time.Second)
    
    // 正确示例：传递参数
    for i := 0; i < 3; i++ {
        go func(id int) {
            fmt.Println(id)  // 打印 0, 1, 2
        }(i)
    }
    
    time.Sleep(time.Second)
    
    // 或者创建局部变量
    for i := 0; i < 3; i++ {
        i := i  // 创建新的局部变量
        go func() {
            fmt.Println(i)  // 打印 0, 1, 2
        }()
    }
    
    time.Sleep(time.Second)
}
```

### 2. Goroutine 泄漏

```go
package main

import (
    "fmt"
    "time"
)

func leakyGoroutine() {
    ch := make(chan int)
    
    // 启动 Goroutine 等待 Channel
    go func() {
        <-ch  // 永远阻塞，因为没有人发送数据
        fmt.Println("这行永远不会执行")
    }()
    
    // 主程序退出，Goroutine 泄漏
}

func fixedGoroutine() {
    ch := make(chan int)
    
    go func() {
        <-ch
        fmt.Println("收到数据")
    }()
    
    // 发送数据或关闭 Channel
    ch <- 1
    // 或者 close(ch)
    
    time.Sleep(time.Second)
}
```

### 3. 资源竞争

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

var counter int  // 共享变量

// 错误示例：有资源竞争
func incrementUnsafe() {
    for i := 0; i < 1000; i++ {
        counter++  // 不是原子操作
    }
}

// 正确示例：使用互斥锁
var mutex sync.Mutex

func incrementSafe() {
    for i := 0; i < 1000; i++ {
        mutex.Lock()
        counter++
        mutex.Unlock()
    }
}

func main() {
    // 不安全的并发
    counter = 0
    go incrementUnsafe()
    go incrementUnsafe()
    time.Sleep(time.Second)
    fmt.Printf("不安全结果: %d (期望: 2000)\n", counter)
    
    // 安全的并发
    counter = 0
    go incrementSafe()
    go incrementSafe()
    time.Sleep(time.Second)
    fmt.Printf("安全结果: %d (期望: 2000)\n", counter)
}
```

## 总结

Goroutine 的特点：

1. **轻量级**：创建成本低，可以创建大量 Goroutine
2. **简单**：使用 `go` 关键字即可启动
3. **高效**：由 Go 运行时调度，充分利用多核 CPU
4. **需要注意**：
   - 避免 Goroutine 泄漏
   - 注意资源竞争
   - 正确等待 Goroutine 完成

Goroutine 是 Go 并发编程的基础，配合 Channel 可以实现强大的并发程序！

---

#go #Goroutine #并发编程 #协程

