---
title: "Nginx worker 与连接调优"
date: "2026-03-19"
lastModified: "2026-03-19"
tags: ["Nginx", "性能优化", "worker", "连接调优"]
moc: "[[!MOC-Nginx]]"
stage: "工程化实践"
prerequisites: ["核心概念", "配置文件结构"]
description: "说明 Nginx worker 进程、worker_connections 与连接容量的基础调优方法和判断思路。"
publish: true
aliases: ["worker 与连接调优", "Nginx worker 调优"]
toc: true
---

# Nginx worker 与连接调优

## 1. 先理解这件事

对新手来说，可以先把性能调优理解成一句话：

- 让 Nginx 在现有机器上更稳地接住更多请求

最先接触到的两个参数通常是：

- `worker_processes`
- `worker_connections`

它们分别回答两个问题：

- 要开多少个 worker 进程处理请求
- 每个 worker 最多能同时处理多少连接

对有经验的读者，更值得关注的是：

- 连接数上限如何和 CPU、文件描述符、keep-alive 策略一起评估
- 为什么“把参数调大”不一定等于吞吐更高

## 2. 最小可用配置

```nginx
worker_processes auto;

events {
    worker_connections 10240;
    multi_accept on;
}
```

先理解这几行：

- `worker_processes auto;` 表示让 Nginx 按 CPU 核数自动决定 worker 数量
- `worker_connections 10240;` 表示单个 worker 可处理的最大连接数
- `multi_accept on;` 表示单次事件循环尽量多接收新连接

## 3. 这些参数该怎么判断

新手先记一个基础公式：

- 理论最大连接数约等于 `worker_processes * worker_connections`

但它只是上限参考，不代表真实可承载请求量。

因为实际容量还会受到这些因素影响：

- keep-alive 连接占用
- 反向代理场景下一个请求可能占两侧连接
- 系统文件描述符限制
- CPU、内存和网络带宽

所以更稳妥的理解是：

- `worker_processes` 决定并发处理能力的进程侧基础
- `worker_connections` 决定每个 worker 能挂住多少连接
- 真正容量还要结合系统资源和业务模式一起看

## 4. 推荐起步策略

1. `worker_processes` 优先用 `auto`。
2. `worker_connections` 先从中等值开始，比如 `4096` 或 `10240`。
3. 调大参数前先确认系统 `ulimit -n` 足够。
4. 压测时同时观察连接数、CPU 和响应时间，不要只看单一指标。

## 5. 常见误区

### 5.1 只把连接数调大，不看系统限制

如果系统文件描述符不够，参数再大也没意义，甚至会带来误判。

### 5.2 只盯并发，不看请求模式

静态文件服务、长连接 API、WebSocket、反向代理场景，对连接占用的影响完全不同。

### 5.3 把 `worker_processes` 开得远大于 CPU 核数

这通常不会带来线性收益，反而可能增加上下文切换成本。

## 6. 排查清单

- [ ] `worker_processes` 已按 CPU 与场景合理设置
- [ ] `worker_connections` 已与系统限制一起评估
- [ ] 已检查 `ulimit -n` 与系统文件描述符配置
- [ ] 已通过压测验证调整后的真实效果

## 7. 相关笔记

- [02-压缩缓存与静态资源加速.md](./02-压缩缓存与静态资源加速.md)
- [03-超时与缓冲区调优.md](./03-超时与缓冲区调优.md)
- [../07-日志与监控/03-status监控与指标采集.md](../07-日志与监控/03-status监控与指标采集.md)
