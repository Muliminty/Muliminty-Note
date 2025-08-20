好的 👍 我帮你整理一份 **Ubuntu 前端开发环境安装的完整流程文档**，覆盖从基础工具到常用开发工具的安装步骤，适合前端开发者开箱即用。

---

# 🖥 Ubuntu 前端开发环境安装文档

## 1. 更新系统

在开始之前，先确保系统是最新的：

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 2. 基础工具安装

### 2.1 安装常用工具

```bash
sudo apt install -y build-essential curl wget git unzip zip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

- **build-essential** → 编译工具（node-gyp 等依赖需要）
    
- **curl / wget** → 下载工具
    
- **git** → 版本控制工具
    

### 2.2 配置 Git

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
git config --global core.editor "vim"   # 或 nano, code
git config --global pull.rebase false
git config --global init.defaultBranch main
```

查看配置：

```bash
git config --list
```

---

## 3. Node.js 环境安装（推荐使用 NVM）

### 3.1 安装 NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
```

安装完成后，刷新环境变量：

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

也可以写进 `~/.bashrc` 或 `~/.zshrc`：

```bash
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
```

### 3.2 安装 Node.js

```bash
nvm install --lts     # 安装长期支持版本
nvm install node      # 安装最新版本
nvm alias default lts/*   # 默认使用 LTS
```

验证：

```bash
node -v
npm -v
npx -v
```

---

## 4. 包管理器推荐

除了 `npm`，前端常用 **yarn** 或 **pnpm**：

### 安装 yarn

```bash
npm install -g yarn
yarn -v
```

### 安装 pnpm

```bash
npm install -g pnpm
pnpm -v
```

---

## 5. 前端常用全局工具

```bash
npm install -g typescript ts-node eslint prettier serve
```

- **typescript / ts-node** → TypeScript 开发
    
- **eslint / prettier** → 代码规范
    
- **serve** → 启动静态文件服务器
    

---

## 6. 开发工具（IDE & 编辑器）

### 6.1 安装 VS Code

```bash
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /usr/share/keyrings/
sudo sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/packages.microsoft.gpg] \
https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt update
sudo apt install -y code
```

常用插件：

- ESLint
    
- Prettier
    
- GitLens
    
- Live Server
    
- Path Intellisense
    
- React / Vue / Angular 插件
    

### 6.2 其他编辑器（可选）

- **WebStorm**（付费，但功能强大）
    
- **Sublime Text**
    
- **Neovim**（轻量级 CLI 编辑器）
    

---

## 7. 浏览器安装（调试用）

### Chrome

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb -y
```

### Firefox（默认自带，可升级）

```bash
sudo apt install firefox -y
```

---

## 8. 版本控制 & 协作工具（可选）

- **GitHub CLI**
    

```bash
sudo apt install gh -y
gh auth login
```

- **Docker**（如需本地环境模拟后端）
    

```bash
sudo apt install docker.io -y
sudo usermod -aG docker $USER
```

---

## 9. 前端调试辅助工具

### 9.1 网络调试

- **Postman** → API 调试
    
- **Insomnia** → API 调试工具
    

### 9.2 UI 框架调试

- Vue Devtools / React Devtools（Chrome 插件）
    

---

## 10. 常见问题

### Node-sass 报错

安装依赖：

```bash
sudo apt install -y python3 g++ make
```

### 权限问题（避免使用 sudo 安装 npm 包）

使用 nvm 安装 Node.js，可以避免全局 npm 包的权限问题。
