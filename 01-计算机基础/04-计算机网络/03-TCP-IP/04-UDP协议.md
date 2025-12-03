# UDP 协议（UDP Protocol）

> UDP（User Datagram Protocol，用户数据报协议）是一种无连接的、不可靠的传输层协议。

---

## 什么是 UDP

UDP 是传输层协议，提供无连接的、不可靠的数据传输服务。

### UDP 的特点

- **无连接**：不需要建立连接，直接发送数据
- **不可靠**：不保证数据到达，不保证顺序
- **速度快**：头部小，处理简单
- **无流量控制**：发送方可以任意速度发送
- **无拥塞控制**：不控制发送速度

---

## UDP 头部结构

### UDP 头部格式

```
 0      7 8     15 16    23 24    31
+--------+--------+--------+--------+
|     Source      |   Destination   |
|      Port       |      Port       |
+--------+--------+--------+--------+
|                 |                 |
|     Length      |    Checksum     |
+--------+--------+--------+--------+
|                                   |
|          data octets ...          |
+-----------------------------------+
```

**字段说明**：
- **Source Port**：源端口（16 位）
- **Destination Port**：目标端口（16 位）
- **Length**：UDP 头部和数据的总长度（16 位）
- **Checksum**：校验和（16 位，可选）

**头部大小**：8 字节（固定）

---

## UDP vs TCP

| 特性 | UDP | TCP |
|------|-----|-----|
| 连接 | 无连接 | 面向连接 |
| 可靠性 | 不可靠 | 可靠 |
| 速度 | 快 | 较慢 |
| 头部大小 | 8 字节 | 20 字节 |
| 流量控制 | ❌ | ✅ |
| 拥塞控制 | ❌ | ✅ |
| 数据顺序 | 不保证 | 保证 |
| 适用场景 | 实时应用 | 可靠传输 |

---

## UDP 应用场景

### 1. DNS（域名解析）

**为什么使用 UDP**：
- 查询请求小，响应快
- 不需要可靠传输
- 如果超时，可以重试

**端口**：53

### 2. 视频/音频流

**为什么使用 UDP**：
- 实时性要求高
- 丢失少量数据包影响不大
- 延迟要求低

**示例**：视频会议、在线直播

### 3. 在线游戏

**为什么使用 UDP**：
- 实时性要求高
- 延迟要求低
- 可以容忍少量数据丢失

### 4. DHCP（动态主机配置）

**为什么使用 UDP**：
- 客户端可能没有 IP 地址
- 广播/组播场景

**端口**：67（服务器）、68（客户端）

### 5. SNMP（网络管理）

**为什么使用 UDP**：
- 查询请求简单
- 不需要可靠传输

**端口**：161

---

## UDP 可靠性实现

虽然 UDP 本身不可靠，但可以在应用层实现可靠性。

### 1. 应用层确认机制

**实现方式**：
- 接收方收到数据后，发送确认消息
- 发送方未收到确认，重传数据

### 2. 应用层序列号

**实现方式**：
- 在应用层数据中添加序列号
- 接收方根据序列号重组数据

### 3. 超时重传

**实现方式**：
- 发送数据后启动定时器
- 超时未收到确认，重传数据

### 4. 应用层流量控制

**实现方式**：
- 接收方告知可用缓冲区大小
- 发送方根据缓冲区大小调整发送速度

---

## UDP 广播和组播

### 广播（Broadcast）

**定义**：向同一网络内的所有主机发送数据

**类型**：
- **有限广播**：255.255.255.255
- **直接广播**：网络地址的主机部分全为 1

**示例**：
```c
// 发送广播数据
sendto(sock, data, len, 0, "255.255.255.255", port);
```

### 组播（Multicast）

**定义**：向一组主机发送数据

**IP 地址范围**：224.0.0.0 - 239.255.255.255

**示例**：
```c
// 加入组播组
struct ip_mreq mreq;
mreq.imr_multiaddr.s_addr = inet_addr("224.0.0.1");
mreq.imr_interface.s_addr = INADDR_ANY;
setsockopt(sock, IPPROTO_IP, IP_ADD_MEMBERSHIP, &mreq, sizeof(mreq));
```

---

## UDP 编程示例

### Python UDP 服务器

```python
import socket

# 创建 UDP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# 绑定地址和端口
server_address = ('localhost', 8888)
sock.bind(server_address)

print('UDP 服务器启动，监听端口 8888')

while True:
    # 接收数据
    data, client_address = sock.recvfrom(1024)
    print(f'收到来自 {client_address} 的数据: {data.decode()}')
    
    # 发送响应
    response = f'收到: {data.decode()}'
    sock.sendto(response.encode(), client_address)
```

### Python UDP 客户端

```python
import socket

# 创建 UDP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# 服务器地址
server_address = ('localhost', 8888)

# 发送数据
message = 'Hello, UDP Server!'
sock.sendto(message.encode(), server_address)

# 接收响应
data, server_address = sock.recvfrom(1024)
print(f'收到响应: {data.decode()}')

# 关闭 socket
sock.close()
```

---

## UDP 常见问题

### 1. UDP 数据包大小限制

**MTU（Maximum Transmission Unit）**：
- 以太网 MTU：1500 字节
- UDP 头部：8 字节
- IP 头部：20 字节
- 最大 UDP 数据：1500 - 8 - 20 = 1472 字节

**建议**：
- 单个 UDP 数据包不超过 512 字节（避免分片）
- 如果数据大，在应用层分片

### 2. UDP 数据包丢失

**原因**：
- 网络拥塞
- 缓冲区满
- 校验和错误

**处理**：
- 应用层实现重传机制
- 使用冗余数据
- 接受数据丢失（如视频流）

### 3. UDP 数据包乱序

**原因**：
- 网络路由不同
- 数据包可能走不同路径

**处理**：
- 应用层添加序列号
- 接收方按序列号重组

---

## 总结

UDP 协议要点：
- **无连接**：不需要建立连接，直接发送
- **不可靠**：不保证数据到达和顺序
- **速度快**：头部小，处理简单
- **应用场景**：DNS、视频流、在线游戏等实时应用
- **可靠性**：可以在应用层实现

UDP 适合对实时性要求高、可以容忍少量数据丢失的应用。

---

**相关链接**：
- [03-TCP 协议](./03-TCP协议.md) — TCP 协议详解
- [05-DNS 原理](./05-DNS原理.md) — DNS 使用 UDP

---

#UDP #传输层协议 #网络协议

