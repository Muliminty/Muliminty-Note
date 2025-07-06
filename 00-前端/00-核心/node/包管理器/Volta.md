# 📦 Volta 使用笔记

> Volta 是一个用于管理 JavaScript 工具链（如 Node.js、npm、yarn 等）版本的现代工具，支持跨平台（macOS、Windows、Linux），速度快且不污染全局环境。

---

## ✨ 一、Volta 简介

### ✅ 为什么使用 Volta？

- 📌 **自动为项目锁定工具版本**（类似于 `.nvmrc`、`.npmrc` 但更强）
    
- ⚡️ **速度更快**：Volta 会在首次调用后缓存二进制执行文件，启动快于 nvm 等工具
    
- 📁 **不依赖 shell 配置**：Volta 安装后即生效，不需要修改 `.bashrc`、`.zshrc`
    
- 🔐 **更安全**：每个项目使用自己的 node/npm/yarn 版本，避免版本冲突
    

---

## 🛠️ 二、Volta 安装

### 2.1 macOS / Linux 安装

```bash
curl https://get.volta.sh | bash
```

安装完成后，重启终端或运行：

```bash
source ~/.bashrc    # or ~/.zshrc
```

### 2.2 Windows 安装

直接访问官网下载安装程序：

👉 [https://volta.sh](https://volta.sh/)

或使用 PowerShell 命令：

```powershell
iwr https://get.volta.sh -useb | iex
```

---

## 📌 三、Volta 常用命令速查表

|命令|作用|
|---|---|
|`volta install node@18`|安装并设置全局 Node.js 18|
|`volta install npm` / `yarn` / `pnpm`|安装并全局设置对应工具|
|`volta pin node@18`|给当前项目固定 node 版本|
|`volta pin npm@9.8.0`|给当前项目固定 npm 版本|
|`volta list`|查看当前安装的工具和版本|
|`volta which node`|查看 node 实际路径|
|`volta uninstall node`|卸载 node（不会影响项目固定版本）|

---

## 📂 四、项目内版本固定

Volta 允许为每个项目单独锁定 node/npm/yarn/pnpm 等版本。

### 示例：

```bash
volta pin node@18
volta pin npm@9
volta pin yarn@1.22
```

这将在项目根目录生成 `.volta` 字段的 `package.json`：

```json
{
  "volta": {
    "node": "18.17.0",
    "npm": "9.8.1",
    "yarn": "1.22.19"
  }
}
```

📦 当你 `cd` 到这个项目目录时，Volta 会自动切换到对应版本。

---

## 🔍 五、Volta 配置检查

### 查看全局配置

```bash
volta list
```

示例输出：

```bash
⚡️ Installed tool versions:
    Node: 18.17.0 (default)
    npm: 9.8.1 (default)
```

---

## 🔧 六、Volta 配合 npx / yarn 使用

- Volta 会拦截 `npx` 调用，自动下载并缓存 CLI 工具
    
- 无需全局安装 CLI，如：
    

```bash
npx create-react-app my-app
```

Volta 会自动下载 `create-react-app` 的对应依赖并执行，不污染全局。

---

## 📁 七、Volta 缓存和目录结构

- Volta 的安装路径：
    
    - macOS/Linux：`~/.volta`
        
    - Windows：`%USERPROFILE%\.volta`
        

### 重要目录：

|目录|作用|
|---|---|
|`tools/`|缓存的 node、yarn、npm 等工具版本|
|`bin/`|CLI 软链接所在目录|
|`log/`|日志记录目录|

---

## 🚀 八、与其他工具对比

|功能|Volta|nvm|asdf|
|---|---|---|---|
|多工具支持（node、yarn、npm）|✅|❌|✅|
|Windows 支持|✅|❌|✅（需额外插件）|
|无需修改 shell 配置|✅|❌|❌|
|版本锁定写入 `package.json`|✅|❌|❌|
|执行速度|快|较慢|一般|

---

## 🧹 九、故障排查

### 问题1：终端中 `volta` 无法识别

解决方法：

```bash
# 添加 volta 到 PATH
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
```

然后：

```bash
source ~/.zshrc  # or ~/.bashrc
```

---

## 📚 十、参考资料

- 官方网站：[https://volta.sh](https://volta.sh/)
    
- GitHub：[https://github.com/volta-cli/volta](https://github.com/volta-cli/volta)
    
- 官方文档：[https://docs.volta.sh/](https://docs.volta.sh/)
    

---

## ✅ 总结

Volta 是前端开发环境中极其实用的工具，特别适合你这种需要管理多个项目、多个 node/npm 版本的开发场景。它简单、跨平台、无污染，一次安装，终身受益。
