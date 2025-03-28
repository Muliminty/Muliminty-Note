- OSI七层模型
    - 物理层（Physical Layer）
        - 负责在物理介质上传输原始的比特流。
        - 主要设备：中继器、集线器。
        - 协议示例：RS-232、V.35。
    - 数据链路层（Data Link Layer）
        - 负责在直接相连的节点之间可靠地传输数据帧。
        - 主要设备：交换机、网桥。
        - 协议示例：以太网（IEEE 802.3）、PPP。
    - [!MOC-网络层](01-计算机科学体系/计算机网络/网络层/!MOC-网络层.md)（Network Layer）
        - 负责在不同网络之间进行数据包的路由和转发。
        - 主要设备：路由器。
        - 协议示例：IP、ICMP、ARP。
    - [!MOC-传输层](01-计算机科学体系/计算机网络/传输层/!MOC-传输层.md)（Transport Layer）
        - 负责提供端到端的可靠数据传输服务。
        - 协议示例：TCP、UDP。
    - 会话层（Session Layer）
        - 负责建立、管理和终止会话。
        - 协议示例：RPC、NetBIOS。
    - 表示层（Presentation Layer）
        - 负责数据的格式化、加密和压缩。
        - 协议示例：SSL/TLS、JPEG。
    - [!MOC-应用层](01-计算机科学体系/计算机网络/应用层/!MOC-应用层.md)（Application Layer）
        - 负责为用户提供网络服务和应用程序接口。
        - 协议示例：HTTP、FTP、SMTP、DNS。

<br/>

	
- TCP/IP四层模型
    - 网络接口层（Network Interface Layer）
        - 相当于OSI模型中的物理层和数据链路层。
        - 负责在物理介质上传输数据帧。
        - 协议示例：以太网、Wi-Fi。
    - [!MOC-网络层](01-计算机科学体系/计算机网络/网络层/!MOC-网络层.md)（Internet Layer）
        - 相当于OSI模型中的网络层。
        - 负责在不同网络之间进行数据包的路由和转发。
        - 协议示例：IP、ICMP、ARP。
    - [!MOC-传输层](01-计算机科学体系/计算机网络/传输层/!MOC-传输层.md)（Transport Layer）
        - 相当于OSI模型中的传输层。
        - 负责提供端到端的可靠数据传输服务。
        - 协议示例：TCP、UDP。
    - [!MOC-应用层](01-计算机科学体系/计算机网络/应用层/!MOC-应用层.md)（Application Layer）
        - 相当于OSI模型中的会话层、表示层和应用层。
        - 负责为用户提供网络服务和应用程序接口。
        - 协议示例：HTTP、FTP、SMTP、DNS。
    