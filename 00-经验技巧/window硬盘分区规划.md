# 硬盘分区规划

```
C:\ (1TB 总空间)
├── [系统自带目录 - 保持默认，不要乱动]
│   ├── Windows               # 操作系统核心
│   ├── Program Files         # 64位软件默认安装位置 (Chrome, VS Code, Docker)
│   ├── Program Files (x86)   # 32位软件默认安装位置
│   └── Users                 # 用户配置 (桌面、AppData、系统级缓存)
│
├── 01_Developer _____________ [核心：前端开发生产力]
│   ├── \Environment          # 运行环境 (nvm 路径、pnpm-store、npm-global)
│   ├── \Projects             # 代码仓库
│   │   ├── \Company_A        # 公司 A 的项目 (物理隔离，防止误操作)
│   │   ├── \Company_B        # 公司 B 的项目
│   │   └── \Personal         # 个人 GitHub 仓库 / Side Projects
│   ├── \Tools                # 绿色版软件 (Postman, SwitchHosts, Terminals)
│   └── \Learning             # 学习笔记备份、Demo 练习、技术 PDF 文档
│
├── 02_Social ________________ [社交：空间杀手隔离区]
│   ├── \Apps                 # 微信、QQ、钉钉、飞书的安装路径
│   └── \ChatFiles            # 关键：手动在软件设置中将“文件存储”改为此处
│       ├── \WeChat_Data      # 存放成千上万的聊天图片和工作文件
│       └── \QQ_Data          # 存放接收的各种安装包和大文件
│
├── 03_Life __________________ [生活：云同步与私人数据]
│   ├── \BaiduSynch           # 百度网盘同步盘 (实时备份此文件夹)
│   ├── \Finance              # 个人财务、合同扫描件、简历
│   ├── \Notes                # GitHub 笔记的本地克隆版
│   └── \Photos               # 手机备份的照片与私人视频
│
├── 04_Entertainment _________ [娱乐：游戏与大文件]
│   ├── \SteamLibrary         # Steam 游戏库 (安装 Steam 后首选此处)
│   ├── \Games_Others         # Epic、原神、单机游戏等
│   └── \Media                # 离线电影、美剧、录屏剪辑素材
│
├── 05_Backups _______________ [安全：重装系统前的救命稻草]
│   ├── \SSH_GPG              # .ssh 密钥和 GPG 密钥备份
│   ├── \Config               # VS Code 插件清单、OhMyZsh 配置、hosts 备份
│   └── \Drivers              # 常用驱动程序备份
│
└── 06_Temp __________________ [缓冲区：每周清理的垃圾桶]
    ├── \Downloads            # 浏览器默认下载路径 (改到这里！)
    └── \Screenshots          # 临时截图、录屏预览、未整理的素材
```