### ​**​Homebrew 终极使用指南​**​

#### 一、核心概念

|​**​术语​**​|​**​说明​**​|
|---|---|
|​**​Formula​**​|命令行工具或库（如 `wget`, `node`, `python`）|
|​**​Cask​**​|图形界面应用（如 `google-chrome`, `visual-studio-code`）|
|​**​Tap​**​|第三方软件源仓库（如 `homebrew/cask-fonts`）|
|​**​Keg​**​|软件安装目录（如 `/opt/homebrew/Cellar/wget/1.21.4`）|
|​**​Cellar​**​|所有软件的安装根目录（默认为 `/opt/homebrew/Cellar`）|

---

#### 二、环境配置（安装后必须执行）

```
# Apple Silicon (M1/M2/M3)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc

# Intel Mac
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zshrc

# 生效配置
source ~/.zshrc
```

---

#### 三、基础操作命令

|​**​命令​**​|​**​功能​**​|​**​示例​**​|
|---|---|---|
|`brew update`|更新 Homebrew 自身||
|`brew install <formula>`|安装软件|`brew install wget`|
|`brew install --cask <app>`|安装图形应用|`brew install --cask firefox`|
|`brew uninstall <formula>`|卸载软件|`brew uninstall node`|
|`brew list`|列出所有安装的软件|`brew list --versions`|
|`brew search <keyword>`|搜索软件|`brew search python`|
|`brew info <formula>`|查看软件详情|`brew info mysql`|
|`brew upgrade`|更新所有软件|`brew upgrade git`（指定更新）|
|`brew cleanup`|清理旧版本缓存|`brew cleanup -s`（清理所有）|
|`brew doctor`|诊断环境问题||

---

#### 四、高级操作技巧

​**​1. 管理服务（如 MySQL/Nginx）​**​

```
brew services start redis      # 启动服务
brew services stop postgresql  # 停止服务
brew services list             # 查看运行中的服务
```

​**​2. 使用第三方仓库（Tap）​**​

```
brew tap homebrew/cask-fonts  # 添加字体仓库
brew install font-fira-code   # 安装字体

brew tap aws/tap              # 添加 AWS 工具
brew install aws-sam-cli
```

​**​3. 查看依赖关系​**​

```
brew deps --tree git          # 显示依赖树
brew uses --installed python  # 查看哪些软件依赖Python
```

​**​4. 锁定软件版本​**​

```
brew pin node@18            # 锁定Node 18版本
brew unpin node@18          # 解除锁定
```

​**​5. 跨平台开发库管理​**​

```
# 安装依赖库并链接到系统路径
brew install openssl
export LDFLAGS="-L$(brew --prefix openssl)/lib"
export CPPFLAGS="-I$(brew --prefix openssl)/include"
```

---

#### 五、国内用户优化（加速安装）

​**​1. 更换镜像源​**​

```
# 使用清华大学源
git -C "$(brew --repo)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git
git -C "$(brew --repo homebrew/core)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git

# 重置官方源
git -C "$(brew --repo)" remote set-url origin https://github.com/Homebrew/brew
```

​**​2. 设置环境变量（临时）​**​

```
export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles
```

---

#### 六、常用开发环境配置示例

​**​1. Python 开发栈​**​

```
brew install python@3.11
brew install pyenv
brew install poetry
```

​**​2. Node.js 多版本管理​**​

```
brew install nvm
mkdir ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
```

​**​3. 数据科学工具集​**​

```
brew install miniconda
brew install jupyterlab
brew install apache-spark
```

---

#### 七、故障排除手册

|​**​问题​**​|​**​解决方案​**​|
|---|---|
|安装卡顿/超时|`export HOMEBREW_BOTTLE_DOMAIN=镜像地址`|
|`Error: Permission denied`|`sudo chown -R $(whoami) $(brew --prefix)/*`|
|`command not found: brew`|检查 `~/.zshrc` 中的 PATH 配置|
|软件无法启动|`brew link --overwrite <formula>`|
|Cask 安装的应用不显示|`brew install --cask appcleaner && open /Applications`|

---

#### 八、推荐软件列表

​**​开发工具​**​

```
brew install git git-lfs gh
brew install --cask iterm2 visual-studio-code docker
```

​**​效率工具​**​

```
brew install tmux htop neofetch
brew install --cask rectangle raycast obsidian
```

​**​多媒体工具​**​

```
brew install ffmpeg imagemagick
brew install --cask vlc handbrake spotify
```

---

#### 九、最佳实践

1. ​**​定期维护​**​
    
    ```
    brew update && brew upgrade && brew cleanup
    ```
    
2. ​**​查看过期软件​**​
    
    ```
    brew outdated
    ```
    
3. ​**​完全卸载​**​
    
    ```
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"
    ```
    
4. ​**​迁移到新电脑​**​
    
    ```
    brew bundle dump --file=~/Brewfile      # 导出已安装列表
    brew bundle install --file=~/Brewfile   # 在新机恢复
    ```
    

> ​**​官方文档​**​：[](https://docs.brew.sh/)  
> ​**​包搜索入口​**​：[](https://formulae.brew.sh/)

此文档覆盖了 Homebrew 的 99% 使用场景，建议保存为本地参考手册。可根据实际需求组合命令，提升开发效率！