### **GitHub SSH 连接问题解决方案**

#github

[Solution for 'ssh: connect to host github.com port 22: Connection timed out' error · GitHub](https://gist.github.com/Tamal/1cc77f88ef3e900aeae65f0e5e504794)

#### **问题描述**

在尝试通过 SSH 连接 GitHub 时，遇到了如下错误：

```bash
ssh: connect to host github.com port 22: Connection timed out
fatal: Could not read from remote repository.
```

该问题通常由以下原因引起：
- **网络防火墙** 或其他网络限制阻止了对 GitHub SSH 默认端口（22）的访问。

#### **解决方法**

GitHub 提供了一个备用的 SSH 连接端口（443），该端口通常不会被防火墙阻挡。通过修改 SSH 配置文件，将连接端口从 22 改为 443，解决了此问题。

#### **步骤 1：验证连接端口**

首先，验证你能否通过端口 443 成功连接到 GitHub：

```bash
# 使用端口 443 连接 GitHub
ssh -T -p 443 git@ssh.github.com
```

输出结果表明你已经成功验证并通过端口 443 连接了 GitHub，但 GitHub 不提供直接的 shell 访问：

```bash
Hi xxxx! You've successfully authenticated, but GitHub does not provide shell access.
```

#### **步骤 2：修改 SSH 配置文件**

为了让 Git 自动使用端口 443，你需要修改 `~/.ssh/config` 文件，添加一条配置。这样所有指向 `github.com` 的 SSH 连接都会默认使用端口 443。

1. 打开 SSH 配置文件（如果不存在，手动创建）：

   ```bash
   vim ~/.ssh/config
   ```

2. 在配置文件中添加以下内容：

   ```bash
   # 使用 GitHub 的备用 SSH 端口 443
   Host github.com
     Hostname ssh.github.com
     Port 443
   ```

![](附件/ssh%20connect%20to%20host%20github.com%20port%2022-1.png)
#### **步骤 3：验证 SSH 配置**

配置文件修改完毕后，验证 Git 使用新的配置进行 SSH 连接：

```bash
ssh -T git@github.com
```

成功连接后，你将看到类似以下的输出，表示你已通过 SSH 成功验证 GitHub 帐号：

```bash
Hi xxxxx! You've successfully authenticated, but GitHub does not provide shell access.
```

![](附件/ssh%20connect%20to%20host%20github.com%20port%2022.png)

#### **步骤 4：克隆 GitHub 仓库**

使用 Git 克隆仓库时，Git 会自动使用你配置的 SSH 端口（443）进行连接。执行以下命令克隆仓库：

```bash
git clone git@github.com:xxxxxx/xxxxx.git my-awesome-proj
```

如果一切正常，你将看到如下输出，表示克隆操作成功：

```bash
Cloning into 'my-awesome-proj'...
remote: Enumerating objects: 15, done.
remote: Counting objects: 100% (15/15), done.
remote: Compressing objects: 100% (14/14), done.
remote: Total 15 (delta 0), reused 15 (delta 0), pack-reused 0
Receiving objects: 100% (15/15), 22.90 KiB | 4.58 MiB/s, done.
```

