### 在 Linux 上配置 Git 和 Node.js 环境的完整指南

#### 🧰 一、安装 Git

```
# 更新包列表
sudo apt update

# 安装 Git
sudo apt install git -y

# 验证安装
git --version
# 成功示例：git version 2.34.1
```

#### 🔧 配置 Git 身份（首次使用需设置）：

```
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### ⚡ 二、安装 Node.js（推荐使用 nvm）

> 官方建议使用 nvm（Node Version Manager）安装，避免权限问题

```
# 1. 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. 重载环境变量
source ~/.bashrc  # 或 source ~/.zshrc（Zsh用户）

# 3. 验证安装
nvm --version
# 成功示例：0.39.7

# 4. 安装最新 LTS 版本
nvm install --lts

# 5. 验证 Node 和 npm
node -v  # 示例：v20.11.1
npm -v   # 示例：10.2.3
```

#### 🛠️ 三、常用工具增强

```
# 安装构建工具（C++编译依赖）
sudo apt install build-essential -y

# 全局安装常用工具
npm install -g yarn nodemon typescript
```

#### 🔍 四、验证环境

创建测试项目：

```
mkdir test-project && cd test-project
npm init -y
echo "console.log('Hello World!');" > index.js
node index.js
# 应输出：Hello World!
```

#### ⚙️ 五、配置优化（可选）

1. ​**​加快 npm 安装速度​**​：
    
    ```
    npm set registry https://registry.npmmirror.com
    ```
    
2. ​**​设置默认 Node 版本​**​：
    
    ```
    nvm alias default 20  # 将版本20设为默认
    ```
    
3. ​**​解决全局安装权限问题​**​：
    
    ```
    mkdir ~/.npm-global
    npm config set prefix '~/.npm-global'
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
    source ~/.bashrc
    ```
    

#### 🚨 六、防火墙配置（如需）

```
# 允许 HTTP/HTTPS
sudo ufw allow http
sudo ufw allow https
```

#### 💻 七、创建系统服务示例（Express应用）

```
# 安装 Express 生成器
npm install -g express-generator

# 创建项目
express myapp
cd myapp
npm install

# 启动服务
DEBUG=myapp:* npm start
# 访问 http://localhost:3000
```

#### 🧩 常用命令速查：

|功能|命令|
|---|---|
|切换 Node 版本|`nvm use 18`|
|查看已安装版本|`nvm ls`|
|安装最新 Node|`nvm install node --reinstall-packages-from=node`|
|更新 npm|`npm install -g npm@latest`|
|查看 Git 配置|`git config --list`|
|生成 SSH 密钥|`ssh-keygen -t ed25519 -C "your_email@example.com"`|

✅ ​**​完成配置后​**​：

1. 将 SSH 公钥 `(~/.ssh/id_ed25519.pub)` 添加到 GitHub/GitLab
2. 使用 `git clone` 测试仓库拉取功能
3. 通过 `nvm install 18` 等命令安装其他所需版本

> 💡 ​**​提示​**​：开发环境建议安装 [nvm](https://github.com/nvm-sh/nvm) + [pm2](https://pm2.keymetrics.io/)（进程管理），搭配 VS Code 作为 IDE 使用效果更佳。