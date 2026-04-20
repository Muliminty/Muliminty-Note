---
title: "Channel 通道"
date: "2026-04-20"
lastModified: "2026-04-20"
tags: ["Go", "编程语言", "并发编程", "Channel"]
moc: "[[!MOC-Go]]"
description: "介绍 Go 中 Channel 的作用、基本用法与常见使用方式。"
publish: true
toc: true
---

# Channel 通道

## 1. 定义

Channel 是 Go 并发模型中的核心通信机制，用于在多个 Goroutine 之间安全地传递数据。

## 2. 作用

- 在并发任务之间传递数据
- 用通信替代共享内存
- 作为任务同步和关闭信号的载体

## 3. 基本用法

```go
ch := make(chan int)
go func() {
    ch <- 1
}()
value := <-ch
```

## 4. 常见主题

- 无缓冲与有缓冲 Channel
- 单向 Channel
- `close` 与遍历读取
- 超时控制与取消协作

## 5. 相关链接

- [Go 总入口](../!MOC-Go.md)
- [Goroutine 协程](./Goroutine-协程.md)
- [Select 语句](./Select-语句.md)
