### 使用 SSH 配置 Git 和 Sourcetree 的详细技术文档

这份文档将指导你如何生成 SSH 密钥，配置 Git 和 Sourcetree 使用 SSH 进行身份验证，并推送代码到 GitHub。

---

#### 目录
1. 生成 SSH 密钥
2. 添加 SSH 密钥到 GitHub
3. 配置 Sourcetree 使用 SSH
4. 推送代码到 GitHub
5. 验证推送结果

---

### 1. 生成 SSH 密钥

**步骤 1**: 打开终端或 Git Bash，输入以下命令生成新的 SSH 密钥：

```sh
ssh-keygen -t ed25519 -C "your_email@example.com"
```

**步骤 2**: 当提示输入保存文件路径时，直接按回车键使用默认路径：

```sh
Enter file in which to save the key (/c/Users/YourUsername/.ssh/id_ed25519):
```

你也可以指定一个自定义路径：

```sh
Enter file in which to save the key (/c/Users/YourUsername/.ssh/id_ed25519): /path/to/your_custom_key
```

**步骤 3**: 设置一个密码短语（可以为空，但不建议）：

```sh
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

**步骤 4**: 启动 `ssh-agent` 并添加私钥：

```sh
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

如果你使用了自定义路径，请替换路径：

```sh
ssh-add /path/to/your_custom_key
```

---

### 2. 添加 SSH 密钥到 GitHub

**步骤 1**: 复制公钥内容到剪贴板：

```sh
cat ~/.ssh/id_ed25519.pub
```

如果你使用了自定义路径，请替换路径：

```sh
cat /path/to/your_custom_key.pub
```

**步骤 2**: 登录到 GitHub，进入 `Settings` -> `SSH and GPG keys`。

**步骤 3**: 点击 `New SSH key`，将公钥粘贴进去，添加一个描述（例如：`My Laptop`），然后点击 `Add SSH key`。

---

### 3. 配置 Sourcetree 使用 SSH

**步骤 1**: 打开 Sourcetree，点击菜单栏的 `Tools` -> `Options`。

**步骤 2**: 在 `General` 标签页中，找到 `SSH Client Configuration` 部分，确保选择了正确的 SSH 客户端路径（通常是默认的 OpenSSH）。

**步骤 3**: 在 `Tools` 菜单中选择 `Create or Import SSH Keys`，导入你生成的私钥文件。如果你的密钥文件不在默认路径下，请指定路径：

```sh
C:\Users\YourUsername\.ssh\id_ed25519
```

**步骤 4**: 确认远程仓库 URL 使用的是 SSH 格式：

```sh
git@github.com:YourUsername/your-repository.git
```

**步骤 5**: 打开 Sourcetree，选择你的仓库。

**步骤 6**: 点击 `Settings`，在 `Remotes` 选项卡中编辑远程仓库 URL 为 SSH 格式：

```sh
git@github.com:YourUsername/your-repository.git
```

---

### 4. 推送代码到 GitHub

**步骤 1**: 打开 Sourcetree，选择你的仓库。

**步骤 2**: 点击 `Push` 按钮。

**步骤 3**: 在弹出的窗口中，选择要推送的分支（例如 `main`），并确认远程仓库 URL 为 `git@github.com:YourUsername/your-repository.git`。

**步骤 4**: 点击 `OK` 按钮进行推送。

---

### 5. 验证推送结果

**步骤 1**: 在命令行中检查推送状态：

```sh
git status
```

**步骤 2**: 查看提交历史，确认最新提交已推送到远程仓库：

```sh
git log
```

**步骤 3**: 可以尝试通过 SSH 连接到 GitHub，确认 SSH 配置是否正确：

```sh
ssh -T git@github.com
```

你应该会看到类似以下的消息：

```sh
Hi <username>! You've successfully authenticated, but GitHub does not provide shell access.
```

如果你完成了以上所有步骤，你已经成功地通过 SSH 配置了 Git 和 Sourcetree，并可以无缝地推送代码到 GitHub。如果在执行过程中遇到任何问题，请参考相应的错误信息进行调整，或者联系我们寻求进一步的帮助。