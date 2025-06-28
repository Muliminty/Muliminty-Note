### Homebrew 详细安装和使用教程

#### 一、什么是 Homebrew？

Homebrew 是 macOS（也支持 Linux）的包管理器，用于安装和管理命令行工具、开源软件和开发库。它简化了软件安装过程，自动解决依赖关系。

---

#### 二、安装 Homebrew

​**​前提条件​**​：

- macOS 系统（建议 macOS 10.13+）
- 已安装 Xcode Command Line Tools（终端执行 `xcode-select --install`）

​**​安装步骤​**​：

1. ​**​一键安装​**​（官方推荐）：
    
    ```
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
    
2. ​**​配置环境变量​**​（安装完成后按提示操作）：
    
    - ​**​Intel Mac​**​：
        
        ```
        echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zshrc
        source ~/.zshrc
        ```
        
    - ​**​Apple Silicon (M1/M2) Mac​**​：
        
        ```
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
        source ~/.zshrc
        ```
        
3. ​**​验证安装​**​：
    
    ```
    brew --version
    # 输出类似：Homebrew 4.x.x
    ```
    

---

#### 三、基础使用命令

|命令|说明|
|---|---|
|`brew update`|更新 Homebrew 自身|
|`brew install <formula>`|安装软件包（如 `brew install wget`）|
|`brew uninstall <formula>`|卸载软件包|
|`brew list`|列出已安装的软件|
|`brew search <keyword>`|搜索软件包（如 `brew search python`）|
|`brew info <formula>`|查看软件详细信息|
|`brew upgrade`|更新所有已安装软件|
|`brew upgrade <formula>`|更新指定软件|
|`brew cleanup`|清理旧版本软件缓存|

---

#### 四、安装图形界面软件（Cask）

Homebrew Cask 用于安装 macOS 图形界面应用（如 Chrome、VS Code）。

1. ​**​安装 Cask 软件​**​：
    
    ```
    brew install --cask google-chrome
    ```
    
2. ​**​常用 Cask 命令​**​：
    
    ```
    brew list --cask       # 列出已安装的图形应用
    brew search --cask     # 搜索图形应用
    ```
    

---

#### 五、高级用法

1. ​**​管理服务​**​（如 MySQL/Nginx）：
    
    ```
    brew services start mysql    # 启动服务
    brew services stop mysql     # 停止服务
    brew services list           # 查看运行中的服务
    ```
    
2. ​**​安装开发库​**​（如 OpenSSL）：
    
    ```
    brew install openssl
    ```
    
3. ​**​解决依赖问题​**​：
    
    ```
    brew deps <formula>    # 查看依赖
    brew doctor            # 检查环境问题
    ```
    

---

#### 六、常见问题解决

1. ​**​安装慢/卡顿​**​：
    
    - 更换国内镜像源（推荐清华源）：
        
        ```
        # 替换 Homebrew 源
        git -C "$(brew --repo)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git
        # 替换 Homebrew Core 源
        git -C "$(brew --repo homebrew/core)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git
        brew update
        ```
        
2. ​**​权限问题​**​：
    
    ```
    sudo chown -R $(whoami) $(brew --prefix)/*
    ```
    
3. ​**​软件无法运行​**​：
    
    - 检查环境变量：确保 `~/.zshrc` 或 `~/.bash_profile` 已正确配置。

---

#### 七、卸载 Homebrew

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"
```

---

#### 八、实用技巧

- ​**​快速安装常用工具​**​：
    
    ```
    brew install wget git tree node@18 python@3.11
    ```
    
- ​**​查看软件安装路径​**​：
    
    ```
    brew --prefix openssl  # 输出：/opt/homebrew/opt/openssl
    ```
    

通过 Homebrew，你可以高效管理 macOS 上的开发环境和常用工具，享受一键安装的便捷！