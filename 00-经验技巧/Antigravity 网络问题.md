在 Google **Antigravity**（Google 开发的 AI 编程平台）中遇到 “Agent terminated due to error” 是一个比较常见的问题。这通常不是因为你的操作有误，而是由配置冲突、插件过载或账号权限引起的。

你可以尝试以下几种解决方案，按成功率从高到低排列：

### 1. 禁用或检查 MCP 服务器 (最常见原因)

MCP (Model Context Protocol) 插件如果配置不当或响应过慢，会直接导致 Agent 崩溃。

- 点击 Agent 面板右上角的 **三个点 (...)**。
    
- 选择 **MCP Servers**。  选择 MCP 服务器。
    
- 尝试**关闭所有 MCP 服务器**，看问题是否解决。如果恢复正常，再逐个开启以排查是哪一个插件出了问题。
    

### 2. 重置 Onboarding (解决账号/权限问题)

有时候账号的“开发者身份”或“年龄验证”状态在后台失效，会导致请求被拒。

- 在 Antigravity 中按下 `Ctrl + Shift + P` (Mac 为 `Cmd + Shift + P`)。
    
- 输入并运行：`>Antigravity: Reset onboarding`。
    
- 按照提示**重新登录**。这会强制系统重新校验你的账号权限，很多用户反馈此操作非常有效。
    

### 3. 降级模型或开启新对话

如果上下文（Chat History）太长，或者你使用的模型（如 Claude Opus）请求数据量过大，会触发 “Payload Too Large” 错误。

- **新开对话**：点击 “New Chat”，排除历史缓存干扰。
    
- **切换模型**：在底部模型选择器中，尝试从 Gemini 3 Pro 切换到 **Gemini 3 Flash**。Flash 模型更轻量，对连接波动的容忍度更高。
    

### 4. 检查网络与防火墙

- **VPN/代理**：Antigravity 对网络稳定性要求极高，尝试关闭代理或更换更稳定的全局节点。
    
- **防火墙**：确保 Windows Defender 或第三方防火墙没有拦截 Antigravity 的后台进程。
    

### 5. 清理本地缓存 (进阶方案)

如果上述方法都无效，可能是本地配置文件损坏：

- **Windows**: 删除目录 `%AppData%\Antigravity\Cache`。
    
- **macOS**: 删除目录 `~/Library/Application Support/Antigravity/Cache`。
    
