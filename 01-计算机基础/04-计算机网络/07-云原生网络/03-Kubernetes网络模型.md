---
title: "Kubernetes网络模型（Kubernetes Network Model）"
date: "2026-04-10"
lastModified: "2026-04-10"
tags: ["Kubernetes", "Pod网络", "Service", "CNI", "网络策略"]
moc: "[[!MOC-计算机网络]]"
description: "Kubernetes网络模型是Kubernetes集群的网络架构和实现方式，为Pod提供网络通信和服务发现能力"
publish: true
toc: true
---

# Kubernetes网络模型（Kubernetes Network Model）

> Kubernetes网络模型是Kubernetes集群的网络架构和实现方式，为Pod提供网络通信和服务发现能力

---

## Kubernetes网络概述

Kubernetes网络是Kubernetes集群的基础设施，为Pod提供网络连接、服务发现和负载均衡能力。Kubernetes网络遵循特定的设计原则，确保容器化应用的灵活性和可移植性。

### Kubernetes网络设计原则

Kubernetes网络设计遵循以下四个核心原则：

1. **Pod间无NAT通信**：所有Pod都可以在无需NAT的情况下与所有其他Pod通信
2. **Node与Pod通信**：节点与集群中的所有Pod可以直接通信
3. **IP地址平等**：Pod看到的IP地址与其他Pod或节点看到的IP地址相同
4. **出向通信**：出向通信可以使用NAT

### Kubernetes网络模型

```
Kubernetes网络模型：
┌─────────────────────────────────────┐
│         外部网络                   │
│  ┌─────┐ ┌─────┐ ┌─────┐        │
│  │Load │ │Ingress│ │NodePort│       │
│  │Balancer│ │       │        │
│  └─────┘ └─────┘ └─────┘        │
└─────────┬─────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│        Kubernetes集群              │
│  ┌─────────────────────────────┐  │
│  │      Service              │  │
│  │  ┌─────┐ ┌─────┐ ┌─────┐│  │
│  │  │ SVC1│ │ SVC2│ │ SVC3││  │
│  │  └─────┘ └─────┘ └─────┘│  │
│  └─────────────────────────────┘  │
│  ┌─────────────────────────────┐  │
│  │       Pod网络              │  │
│  │ ┌─────┐ ┌─────┐ ┌─────┐│  │
│  │ │Pod A│ │Pod B│ │Pod C││  │
│  │ └─────┘ └─────┘ └─────┘│  │
│  └─────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## Kubernetes网络组件

### 1. Pod网络

Pod网络是Kubernetes中最基本的网络单元，为Pod提供IP地址和网络连接。

#### Pod网络架构

```
Pod网络结构：
┌─────────────────────────────────────┐
│             Pod                   │
│  ┌─────────────────────────────┐  │
│  │        Pause容器          │  │
│  │   ┌─────────────────┐     │  │
│  │   │     eth0       │     │  │
│  │   │ 10.244.1.10/24 │     │  │
│  │   └─────────────────┘     │  │
│  └─────────────────────────────┘  │
│  ┌─────────────────────────────┐  │
│  │       应用容器           │  │
│  │   ┌─────────────────┐     │  │
│  │   │   网络命名空间     │     │  │
│  │   └─────────────────┘     │  │
│  └─────────────────────────────┘  │
└─────────────────────────────────────┘
```

#### Pod网络特点

- **Pause容器**：每个Pod都有一个Pause容器，负责维护网络命名空间
- **共享网络**：Pod内的所有容器共享网络命名空间
- **独立IP**：每个Pod有独立的IP地址
- **端口共享**：Pod内的容器不能使用相同端口

### 2. Service网络

Service是Kubernetes中的网络抽象，为一组Pod提供稳定的访问入口。

#### Service类型

- **ClusterIP**：集群内部访问，分配虚拟IP
- **NodePort**：通过节点的静态端口暴露服务
- **LoadBalancer**：通过云服务商的负载均衡器暴露服务
- **ExternalName**：将服务映射到外部DNS名称

#### Service网络实现

```
Service网络实现：
┌─────────────────────────────────────┐
│         Service                  │
│    ClusterIP: 10.96.0.100       │
│    ┌─────────────────────┐        │
│    │     iptables       │        │
│    │   或IPVS规则       │        │
│    └─────────────────────┘        │
│              │                   │
│              ▼                   │
│    ┌─────────────────────┐        │
│    │       目标Pod       │        │
│    │ 10.244.1.10:8080   │        │
│    │ 10.244.1.11:8080   │        │
│    │ 10.244.1.12:8080   │        │
│    └─────────────────────┘        │
└─────────────────────────────────────┘
```

### 3. Ingress网络

Ingress是Kubernetes中管理外部访问的API对象，提供HTTP/HTTPS路由规则。

#### Ingress架构

```
Ingress网络架构：
外部请求
    │
    ▼
┌─────────────────┐
│   Ingress      │
│    Controller   │
│ ┌─────────────┐ │
│ │  Nginx     │ │
│ │  或Traefik  │ │
│ └─────────────┘ │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│    Service     │
│   ClusterIP    │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│      Pod       │
└─────────────────┘
```

---

## Kubernetes网络实现

### 1. 网络插件（CNI插件）

Kubernetes通过CNI（Container Network Interface）插件实现网络功能。

#### CNI工作流程

```
CNI工作流程：
1. 创建Pod
    │
    ▼
2. Kubelet调用CNI插件
    │
    ▼
3. CNI插件配置网络
    │
    ▼
4. 返回网络配置
    │
    ▼
5. Pod启动
```

#### 主流CNI插件

| 插件名称 | 实现方式 | 特点 | 适用场景 |
|---------|---------|------|----------|
| Flannel | VXLAN/UDP | 简单易用 | 中小型集群 |
| Calico | BGP/IP-in-IP | 网络策略支持 | 需要细粒度控制 |
| Weave | Weave Net | 自动发现 | 动态环境 |
| Canal | Flannel+Calico | 结合两者优势 | 需要策略+覆盖网络 |
| Cilium | eBPF | 高性能 | 高性能需求 |

### 2. 网络策略

网络策略是Kubernetes中控制Pod间通信的规则。

#### 网络策略示例

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          role: frontend
    ports:
    - protocol: TCP
      port: 6379
  egress:
  - to:
    - podSelector:
        matchLabels:
          role: backend
    ports:
    - protocol: TCP
      port: 8080
```

### 3. DNS服务

Kubernetes提供内置DNS服务，实现服务发现。

#### DNS服务架构

```
Kubernetes DNS架构：
┌─────────────────┐
│    kube-dns     │
│    或CoreDNS     │
│  ┌─────────────┐ │
│  │ DNS服务     │ │
│  │   SkyDNS    │ │
│  └─────────────┘ │
│  ┌─────────────┐ │
│  │ 健康检查    │ │
│  │  sidecar    │ │
│  └─────────────┘ │
└─────────────────┘
       │
       ▼
┌─────────────────┐
│     API Server │
└─────────────────┘
```

---

## Kubernetes网络通信模式

### 1. 同节点Pod通信

同节点上的Pod通信通过网络桥或虚拟交换机实现。

#### 同节点通信架构

```
同节点Pod通信：
┌─────────────────────────────────────┐
│           节点                    │
│  ┌─────────────────────┐         │
│  │       网桥         │         │
│  │   (cni0)         │         │
│  │  ┌─────┐ ┌─────┐   │         │
│  │  │PodA │ │PodB │   │         │
│  │  │10.1 │ │10.2 │   │         │
│  │  └─────┘ └─────┘   │         │
│  └─────────────────────┘         │
└─────────────────────────────────────┘
```

### 2. 跨节点Pod通信

跨节点Pod通信通过覆盖网络或底层网络实现。

#### 跨节点通信架构（Overlay）

```
跨节点Pod通信（Overlay）：
节点A                    节点B
┌─────────────┐        ┌─────────────┐
│   PodA      │        │   PodB      │
│ 10.244.1.2  │        │ 10.244.2.3  │
└─────┬───────┘        └─────┬───────┘
      │                    │
      ▼                    ▼
┌─────────────┐        ┌─────────────┐
│  网桥cni0    │        │  网桥cni0    │
│ 10.244.1.1  │        │ 10.244.2.1  │
└─────┬───────┘        └─────┬───────┘
      │                    │
      ▼                    ▼
┌─────────────┐        ┌─────────────┐
│ VTEP设备     │        │ VTEP设备     │
└─────┬───────┘        └─────┬───────┘
      │                    │
      └───── 覆盖网络 ────┘
             │
             ▼
       ┌─────────────┐
       │  物理网络   │
       └─────────────┘
```

### 3. Pod与Service通信

Pod通过kube-proxy实现的负载均衡访问Service。

#### Service访问流程

```
Pod访问Service：
PodA
  │
  │ 请求 ClusterIP:10.96.0.100
  ▼
┌─────────────────┐
│   PodA         │
│ 10.244.1.2     │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│  本地DNS解析     │
│ myservice →   │
│ 10.96.0.100   │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│  iptables/IPVS │
│   负载均衡     │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│   目标Pod       │
│ 10.244.2.3     │
└─────────────────┘
```

---

## Kubernetes网络优化

### 1. 性能优化

#### 网络参数调整

```yaml
# Pod网络参数
apiVersion: v1
kind: Pod
metadata:
  name: network-optimized
spec:
  securityContext:
    sysctls:
    - name: net.core.rmem_max
      value: "134217728"
    - name: net.core.wmem_max
      value: "134217728"
```

#### 高性能网络插件

- **Cilium**：基于eBPF的高性能网络插件
- **DPDK**：数据平面开发套件
- **SR-IOV**：单根I/O虚拟化
- **XDP**：eXpress Data Path

### 2. 安全优化

#### 网络策略

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-specific
spec:
  podSelector:
    matchLabels:
      app: myapp
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: allowed-namespace
```

#### Pod安全策略

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
```

### 3. 可观察性

#### 网络监控

```yaml
# 网络监控工具
apiVersion: apps/v1
kind: Deployment
metadata:
  name: network-monitor
spec:
  template:
    spec:
      containers:
      - name: monitor
        image: network-monitor
        args:
        - --source=kubernetes
        - --metrics-address=0.0.0.0:9100
```

#### 网络日志

```yaml
# 网络日志收集
apiVersion: v1
kind: DaemonSet
metadata:
  name: network-logger
spec:
  template:
    spec:
      containers:
      - name: logger
        image: network-logger
        args:
        - --source=/var/log/network
        - --output=elasticsearch
```

---

## Kubernetes网络故障排查

### 1. 网络连接问题

#### 常见问题

- **Pod无法访问外部**：检查DNS和路由
- **Pod间无法通信**：检查网络插件和策略
- **Service无法访问**：检查Service和Endpoint
- **Ingress无法访问**：检查Ingress配置

#### 排查工具

```bash
# 检查Pod网络配置
kubectl exec -it <pod> -- ip addr

# 检查路由表
kubectl exec -it <pod> -- ip route

# 测试DNS解析
kubectl exec -it <pod> -- nslookup kubernetes.default

# 检查网络连接
kubectl exec -it <pod> -- telnet <target-ip> <port>
```

### 2. 性能问题

#### 性能指标

- **网络延迟**：Pod间通信延迟
- **吞吐量**：网络带宽利用率
- **丢包率**：网络数据包丢失率
- **连接数**：并发连接数

#### 优化方法

- **调整资源限制**：增加CPU和内存
- **优化网络插件**：选择合适的网络插件
- **调整网络参数**：优化内核网络参数
- **使用本地缓存**：减少网络请求

---

## Kubernetes网络发展趋势

### 1. eBPF网络

- **高性能**：基于eBPF的高性能网络
- **可编程**：可编程网络数据平面
- **观测性**：内置可观测性能力
- **安全性**：增强安全隔离

### 2. 服务网格集成

- **深度集成**：与Istio等服务网格深度集成
- **流量管理**：高级流量管理能力
- **安全策略**：精细的安全策略控制
- **可观测性**：全面的可观测性支持

### 3. 多集群网络

- **跨集群通信**：支持多集群间通信
- **全局服务**：全局服务发现和访问
- **统一管理**：多集群网络统一管理
- **故障转移**：自动故障转移和恢复

---

## 🔗 相关链接

- [容器网络概述](./01-容器网络概述.md)
- [CNI（容器网络接口）](./02-CNI容器网络接口.md)
- [网络插件](./04-网络插件.md)
- [网络策略](./11-网络策略.md)

---

**最后更新**：2025-01-26
**维护规范**：详见 [笔记规范文档](../../../../../.cursorrules)

#Kubernetes #Pod网络 #Service #CNI #网络策略