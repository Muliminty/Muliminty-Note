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


## TODO 清单

这份重装系统及文件夹规划的 **TODO 清单**，是专为前端开发场景设计的。你可以按照这个顺序执行，确保从重装到高效办公、快乐游戏无缝切换。

---

### 第一阶段：重装前备份（最关键）

* [ ] **备份 SSH/GPG 密钥**：拷贝 `C:\Users\你的名字\.ssh` 和 GPG 密钥。
* [ ] **备份 Git 全局配置**：记录或拷贝 `.gitconfig`。
* [ ] **备份笔记/重要文档**：确保 GitHub 上的笔记已 Push，百度云已同步最新版本。
* [ ] **软件配置导出**：VS Code 开启账号同步，或备份 `settings.json` 和插件清单。
* [ ] **驱动准备**：特别是网卡驱动（如果系统没自动识别，没网会很痛苦）。

---

### 第二阶段：系统安装与基础初始化

* [ ] **系统安装**：建议安装 **Windows 11 Pro**（对前端开发和多桌面支持更好）。
* [ ] **创建逻辑目录**：进入桌面第一件事，按照你的规划创建 `01_Developer` 到 `06_Temp` 这 6 个文件夹。
* [ ] **开启长路径支持**：
* 管理员身份运行 PowerShell：`New-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force`
* *理由：防止 `node_modules` 嵌套太深导致删除或移动报错。*



---

### 第三阶段：开发环境配置（01_Developer）

* [ ] **安装 Git & VS Code**：装在 `Program Files`。
* [ ] **安装 NVM**：建议将 NVM 本身及 Node 路径安装在 `C:\01_Developer\Environment\nvm`。
* [ ] **全局依赖重定向**：
* `npm config set cache "C:\01_Developer\Environment\npm-cache"`
* `pnpm config set store-dir "C:\01_Developer\Environment\pnpm-store"`


* [ ] **拉取项目**：将公司和个人项目分别 Clone 到 `01_Developer\Projects` 对应的子目录下。

---

### 第四阶段：社交与软件管理（02_Social）

* [ ] **安装通讯软件**：微信、QQ、钉钉安装到 `C:\02_Social\Apps`。
* [ ] **修改存储路径**（**必做**）：
* 微信：`设置 -> 文件管理 -> 更改` -> 定位到 `C:\02_Social\ChatFiles\WeChat_Data`。
* QQ：`设置 -> 存储管理` -> 修改到 `C:\02_Social\ChatFiles\QQ_Data`。


* [ ] **百度云设置**：安装百度云，同步文件夹设为 `C:\03_Life\BaiduSynch`。

---

### 第五阶段：娱乐与系统优化（04 & 06）

* [ ] **浏览器下载重定向**：修改 Chrome/Edge 设置，下载路径设为 `C:\06_Temp\Downloads`。
* [ ] **游戏库设置**：安装 Steam，将“库文件夹”设为 `C:\04_Entertainment\SteamLibrary`。
* [ ] **影音软件缓存**：安装音乐/视频软件，手动将“缓存路径”改到 `06_Temp` 或 `04_Entertainment\Media\Cache`。

---

### 第六阶段：习惯养成（长期 TODO）

* [ ] **多桌面隔离**：
* `Win + Tab` 新建桌面。
* **桌面 1 (Work)**：只开 VS Code、终端、公司文档 Chrome。
* **桌面 2 (Life)**：只开微信、游戏、B 站。


* [ ] **定期清空 06_Temp**：每周五下班前，手动清空该文件夹。

---

### 💡 核心贴士总结

* **安装软件时**：永远点“自定义安装”，看清它是进 `Program Files` 还是悄悄溜进 `AppData`。
* **数字目录**：保持 `01-06` 的命名，它们是你 1TB 硬盘的“交通警察”。
* **代码隔离**：公司项目一定进 `Company_X`，个人项目进 `Personal`，保持 Git 邮箱配置正确。

**准备好了吗？祝你重装顺利，获得一个“如丝般顺滑”的新系统！**




这个表格是为你量身定制的“软件归宿判定器”。以后每当你下载一个 `.exe` 或 `.msi` 安装包时，对照这个表格就能立刻决定它该去哪。

### 📂 软件安装与存放归类表

| 软件类型 | 判定特征 | 推荐安装/存放位置 | 典型例子 |
| --- | --- | --- | --- |
| **系统级工具** | 与系统深度集成、需要右键菜单、浏览器 | `C:\Program Files` | Chrome, VS Code, Git, Docker, 7-Zip |
| **开发运行环境** | 命令行工具、版本管理器、依赖库缓存 | `C:\01_Developer\Environment` | nvm, pnpm-store, npm-global, Python |
| **绿色开发工具** | 解压即用、无需安装、纯工作辅助 | `C:\01_Developer\Tools` | Postman, SwitchHosts, Terminals, Heidisql |
| **办公通讯** | 产生大量聊天记录、图片、传阅文档的 | `C:\02_Social\Apps` | 微信, 钉钉, 飞书, QQ, Slack |
| **云端/生产力** | 负责同步文件、笔记、个人简历 | `C:\03_Life\BaiduSynch` | 百度网盘, 坚果云 (软件装C盘，同步目录设在此) |
| **大型游戏** | 体积通常超过 10GB，重度图形运算 | `C:\04_Entertainment\Games` | Steam游戏, 原神, 绝区零, 模拟器 |
| **影音娱乐** | 听歌、看视频、视频剪辑、直播软件 | `C:\04_Entertainment\MediaTools` | 网易云音乐, 哔哩哔哩, 剪映, PotPlayer |
| **临时工具** | 只用一次（如格式转换、抢票软件） | `C:\06_Temp` | 各种“一次性”小插件、测速工具 |

---

### 💡 三个“安装不迷路”的原则

1. **“重量级”原则**：
凡是体积大、未来可能产生大量数据的软件（游戏、社交、影音），**绝对不要**点“快速安装”，必须手动改路径到 `02` 或 `04` 文件夹。
2. **“缓存重定向”原则**：
软件本体装在哪不重要（通常才几百 MB），**重要的是缓存 (Cache) 装在哪**。
* *操作：* 安装完娱乐和社交软件后，立刻在设置里找到“文件存储”或“缓存路径”，指向 `02_Social\ChatFiles` 或 `06_Temp`。


3. **“重装系统考虑”原则**：
问自己一句话：“如果明天我又要重装系统，这个软件配置丢了我会心疼吗？”
* **会心疼：** 放 `01_Developer` 或 `03_Life`（因为你会备份这两个）。
* **无所谓：** 随它去，或者放 `06_Temp`。



---

### 🚀 临别赠言：

你现在的系统架构已经非常极客了。只要坚持这个表格的逻辑，即便你的 C 盘只有 1TB，用上两年依然会像新电脑一样井井有条。

**最后确认一下：你需要我把刚才提到的那段“一键创建目录”的脚本再发你一遍，还是你已经保存好了？**