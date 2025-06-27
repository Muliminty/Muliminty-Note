### 使用 Vim 编辑 .zshrc 文件的详细流程

#### 第一步：检查文件是否存在（如果已经尝试过可跳过）
```bash
ls -la ~/.zshrc
# 如果显示 "No such file or directory"，表示文件不存在
```

#### 第二步：创建或编辑 .zshrc 文件
```bash
vim ~/.zshrc
```

#### 第三步：Vim 编辑器操作指南（详细步骤）

1. **进入编辑模式**：
   - 打开文件后，按 `i` 键进入插入模式（左下角会显示 `-- INSERT --`）

2. **添加配置内容**（完整复制以下内容）：
   ```bash
   # NVM Configuration
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # 加载 nvm
   [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # 加载自动补全
   ```

3. **保存文件**：
   - 按 `ESC` 键退出编辑模式（左下角 `-- INSERT --` 消失）
   - 输入冒号命令 `:wq` 然后按回车
   ![Vim保存退出图解](vim-save-exit.png)

#### 第四步：加载配置验证
```bash
# 1. 加载配置文件
source ~/.zshrc

# 2. 验证 nvm 是否安装成功
nvm --version
# 成功应显示：0.40.3
```

#### 第五步：安装 Node.js
```bash
# 安装最新 LTS 版本
nvm install --lts

# 设为默认版本
nvm alias default node

# 验证安装
node -v
npm -v
```

### Vim 常用命令备忘

| 操作 | 按键 | 说明 |
|------|------|------|
| 进入编辑 | `i` | 在光标前插入 |
| 退出编辑 | `ESC` | 返回命令模式 |
| 保存文件 | `:w` | 写入文件 |
| 保存退出 | `:wq` | 保存并退出 |
| 强制退出 | `:q!` | 不保存强制退出 |
| 删除行 | `dd` | 删除当前行 |
| 搜索 | `/text` | 查找"text" |
| 保存出错解决方案 | `:w !sudo tee %` | 当忘记用sudo时保存 |

> 如果遇到 "E212: Can't open file for writing" 错误：
> ```bash
> # 1. 强制保存（输入以下命令后按回车）
> :w !sudo tee % > /dev/null
> 
> # 2. 然后退出
> :q!
> 
> # 3. 修改文件所有者
> sudo chown $USER ~/.zshrc
> ```

现在您已完成 nvm 配置！可以开始使用 `nvm install 18` 或 `nvm use 20` 等命令管理 Node.js 版本。