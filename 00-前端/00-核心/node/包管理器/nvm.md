# NVM (Node Version Manager) 完全指南

## 1. 什么是 NVM？

NVM (Node Version Manager) 是一个用于管理多个 Node.js 版本的工具，它允许你在同一台计算机上安装、切换和管理不同版本的 Node.js。<mcreference link="https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/" index="1">1</mcreference> 这对于需要在不同项目中使用不同 Node.js 版本的开发者来说非常有用。

### 1.1 为什么需要 NVM？

- 不同项目可能需要不同的 Node.js 版本
- 测试应用在不同 Node.js 版本下的兼容性
- 尝试 Node.js 的新特性而不影响现有环境
- 避免权限问题（不需要管理员权限安装全局包）

## 2. 安装 NVM

### 2.1 在 Windows 上安装

在 Windows 上，我们使用 nvm-windows，这是一个为 Windows 专门设计的 NVM 版本。<mcreference link="https://github.com/coreybutler/nvm-windows" index="3">3</mcreference>

1. 访问 [nvm-windows 发布页面](https://github.com/coreybutler/nvm-windows/releases)
2. 下载最新版本的 `nvm-setup.exe`
3. 运行安装程序并按照提示完成安装
4. 安装完成后，打开新的命令提示符或 PowerShell 窗口
5. 验证安装：

```bash
nvm version
```

### 2.2 在 macOS/Linux 上安装

在 macOS 和 Linux 上，可以使用官方的 nvm 脚本进行安装：<mcreference link="https://github.com/nvm-sh/nvm" index="2">2</mcreference>

#### 使用 curl 安装：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

#### 使用 wget 安装：

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

安装脚本会将 nvm 仓库克隆到 `~/.nvm` 目录，并尝试将以下代码添加到正确的配置文件中（`~/.bashrc`、`~/.bash_profile`、`~/.zshrc` 或 `~/.profile`）：

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # 加载 nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # 加载 nvm bash 补全
```

#### 使用 Homebrew 安装（仅限 macOS）：<mcreference link="https://2coffee.dev/en/articles/how-to-use-and-tips-for-nvm-node-version-manager" index="6">6</mcreference>

```bash
brew install nvm
```

安装后，需要将以下配置添加到 `~/.profile` 或 `~/.zshrc`（如果使用 zsh）：

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$HOMEBREW_PREFIX/opt/nvm/nvm.sh" ] && \. "$HOMEBREW_PREFIX/opt/nvm/nvm.sh" # 加载 nvm
[ -s "$HOMEBREW_PREFIX/opt/nvm/etc/bash_completion.d/nvm" ] && \. "$HOMEBREW_PREFIX/opt/nvm/etc/bash_completion.d/nvm" # 加载 nvm bash 补全
```

### 2.3 验证安装

安装完成后，关闭并重新打开终端，或者运行以下命令使更改生效：

```bash
source ~/.bashrc  # 或 ~/.zshrc，取决于你使用的 shell
```

然后验证 nvm 是否正确安装：

```bash
nvm --version
```

## 3. 使用 NVM 管理 Node.js 版本

### 3.1 安装 Node.js 版本

#### 安装最新版本：

```bash
nvm install node  # 安装最新版本
```

#### 安装特定版本：

```bash
nvm install 14.17.0  # 安装特定版本
nvm install 14  # 安装特定主版本的最新版本
```

#### 安装长期支持版本 (LTS)：<mcreference link="https://github.com/nvm-sh/nvm" index="2">2</mcreference>

```bash
nvm install --lts  # 安装最新的 LTS 版本
nvm install lts/*  # 同上
nvm install lts/fermium  # 安装特定 LTS 版本线（例如 Node.js 14 LTS）
```

### 3.2 列出可用的 Node.js 版本

#### 列出已安装的版本：

```bash
nvm ls
```

#### 列出可安装的所有版本：

```bash
nvm ls-remote
```

#### 列出可安装的 LTS 版本：

```bash
nvm ls-remote --lts
```

### 3.3 切换 Node.js 版本

#### 使用特定版本：

```bash
nvm use 14.17.0  # 使用特定版本
nvm use 14  # 使用特定主版本的最新版本
nvm use --lts  # 使用最新的 LTS 版本
```

#### 设置默认版本：

```bash
nvm alias default 14.17.0  # 设置默认版本
nvm alias default node  # 设置最新版本为默认版本
nvm alias default lts/*  # 设置最新 LTS 版本为默认版本
```

### 3.4 查看当前使用的版本

```bash
nvm current
```

或者：

```bash
node -v
```

### 3.5 卸载 Node.js 版本

```bash
nvm uninstall 14.17.0  # 卸载特定版本
```

## 4. 项目特定的 Node.js 版本管理

### 4.1 使用 .nvmrc 文件

`.nvmrc` 文件是一个简单的文本文件，用于指定项目所需的 Node.js 版本。<mcreference link="https://www.tothenew.com/blog/node-version-using-nvmrc/" index="7">7</mcreference> 这使得团队成员可以轻松地使用相同的 Node.js 版本。

#### 创建 .nvmrc 文件：

```bash
echo "14.17.0" > .nvmrc  # 指定精确版本
# 或
echo "14" > .nvmrc  # 指定主版本
# 或
echo "lts/*" > .nvmrc  # 指定最新 LTS 版本
```

#### 使用 .nvmrc 文件：

当你进入包含 `.nvmrc` 文件的目录时，只需运行：

```bash
nvm use
```

NVM 将自动读取 `.nvmrc` 文件并切换到指定的 Node.js 版本。<mcreference link="https://davidwalsh.name/nvmrc" index="8">8</mcreference>

### 4.2 自动切换版本

你可以配置 shell 在进入包含 `.nvmrc` 文件的目录时自动切换 Node.js 版本。<mcreference link="https://2coffee.dev/en/articles/how-to-use-and-tips-for-nvm-node-version-manager" index="6">6</mcreference>

#### Bash：

将以下代码添加到 `~/.bashrc`：

```bash
cdnvm() {
    command cd "$@" || return $?
    nvm_path=$(nvm_find_up .nvmrc | tr -d '\n')

    if [[ -e "$nvm_path/.nvmrc" ]]; then
        declare nvm_version
        nvm_version=$(<"$nvm_path/.nvmrc")

        if [[ "$nvm_version" == "N/A" ]]; then
            nvm deactivate
        elif [[ "$nvm_version" == "system" ]]; then
            nvm use system
        else
            nvm use "$nvm_version"
        fi
    elif [[ -n "$PREV_NVM_PATH" && "$PREV_NVM_PATH" != "$nvm_path" ]]; then
        declare default_version
        default_version=$(nvm version default)
        if [[ "$default_version" == "N/A" ]]; then
            nvm deactivate
        else
            nvm use default
        fi
    fi
    PREV_NVM_PATH="$nvm_path"
}

alias cd='cdnvm'
cdnvm .
```

#### Zsh：

将以下代码添加到 `~/.zshrc`：

```bash
autoload -U add-zsh-hook

load-nvmrc() {
  local nvmrc_path
  nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version
    nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$(nvm version)" ]; then
      nvm use
    fi
  elif [ -n "$(PWD=$OLDPWD nvm_find_nvmrc)" ] && [ "$(nvm version)" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}

add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

## 5. 高级用法

### 5.1 使用别名

你可以为常用的 Node.js 版本创建别名：

```bash
nvm alias mynode 14.17.0  # 创建别名
nvm use mynode  # 使用别名
nvm unalias mynode  # 删除别名
```

### 5.2 在安装时迁移全局包

当你安装新版本的 Node.js 时，可以从之前的版本迁移全局包：

```bash
nvm install 16 --reinstall-packages-from=14  # 从 Node.js 14 迁移全局包
```

### 5.3 设置默认全局包

你可以创建一个 `default-packages` 文件，列出在安装新 Node.js 版本时要自动安装的全局包：

```bash
# 在 $NVM_DIR 目录中创建 default-packages 文件
echo -e "yarn\nrimraf\ntypescript" > "$NVM_DIR/default-packages"
```

### 5.4 使用镜像源

如果你在中国或其他网络受限的地区，可以使用镜像源加速下载：

```bash
# 使用淘宝镜像源
export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node
```

将上面的命令添加到你的 shell 配置文件（如 `~/.bashrc` 或 `~/.zshrc`）中，使其永久生效。

## 6. 常见问题与解决方案

### 6.1 "nvm 不是内部或外部命令" 错误

**问题**：在 Windows 上安装 nvm 后，命令提示符显示 "nvm 不是内部或外部命令"。

**解决方案**：
1. 确保 nvm 安装路径已添加到系统环境变量中
2. 重新启动命令提示符或 PowerShell
3. 如果问题仍然存在，尝试以管理员身份运行命令提示符

### 6.2 安装后无法使用 nvm 命令

**问题**：在 Linux/macOS 上安装 nvm 后，`nvm` 命令不可用。

**解决方案**：
1. 确保已将 nvm 初始化脚本添加到正确的配置文件中
2. 运行 `source ~/.bashrc` 或 `source ~/.zshrc` 使更改生效
3. 关闭并重新打开终端

### 6.3 Node.js 版本切换后全局包丢失

**问题**：切换 Node.js 版本后，之前安装的全局包不可用。

**解决方案**：
1. 全局包是特定于每个 Node.js 版本的
2. 使用 `--reinstall-packages-from` 选项在安装新版本时迁移全局包
3. 考虑使用本地包而不是全局包

### 6.4 在 CI/CD 环境中使用 NVM

**问题**：在 CI/CD 环境中配置 NVM。

**解决方案**：
1. 在 CI/CD 配置中添加 NVM 安装步骤
2. 确保在非交互式环境中正确加载 NVM
3. 使用 `.nvmrc` 文件指定项目所需的 Node.js 版本

### 6.5 NVM 与其他 Node.js 版本管理器的冲突

**问题**：NVM 与系统安装的 Node.js 或其他版本管理器冲突。

**解决方案**：
1. 卸载系统级 Node.js 安装
2. 确保环境变量中没有其他 Node.js 路径
3. 避免同时使用多个 Node.js 版本管理器

## 7. 最佳实践

1. **为每个项目创建 `.nvmrc` 文件**：确保团队成员使用相同的 Node.js 版本
2. **配置自动版本切换**：提高工作效率，避免手动切换版本
3. **使用 LTS 版本**：对于生产环境，优先使用长期支持版本
4. **定期更新 NVM**：获取最新功能和安全修复
5. **使用本地依赖而非全局包**：提高项目的可移植性和一致性
6. **在 CI/CD 流程中集成 NVM**：确保构建环境与开发环境一致
7. **记录 Node.js 版本要求**：在项目文档中明确说明所需的 Node.js 版本

## 8. 参考资源

- [NVM GitHub 仓库](https://github.com/nvm-sh/nvm)
- [NVM for Windows GitHub 仓库](https://github.com/coreybutler/nvm-windows)
- [Node.js 官方网站](https://nodejs.org/)
- [NPM 官方文档](https://docs.npmjs.com/)