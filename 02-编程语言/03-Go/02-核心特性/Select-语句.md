---
title: "Select 语句"
date: "2026-04-20"
lastModified: "2026-04-20"
tags: ["Go", "编程语言", "并发编程", "Select"]
moc: "[[!MOC-Go]]"
description: "介绍 Go 中 select 的语义、典型用途与并发选择模式。"
publish: true
toc: true
---

# Select 语句

## 1. 定义

`select` 用于同时监听多个 Channel 操作，并在其中一个可执行时进入对应分支。

## 2. 典型用途

- 监听多个消息源
- 处理超时与取消
- 避免阻塞等待单一 Channel

## 3. 基本示例

```go
select {
case msg := <-ch1:
    _ = msg
case ch2 <- 1:
default:
}
```

## 4. 关注重点

- `default` 分支的非阻塞语义
- 配合 `time.After` 实现超时
- 在循环中处理退出信号

## 5. 相关链接

- [Go 总入口](../!MOC-Go.md)
- [Channel 通道](./Channel-通道.md)
- [并发模式](./并发模式.md)
