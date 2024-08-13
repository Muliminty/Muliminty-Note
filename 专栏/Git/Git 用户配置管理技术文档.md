# Git 用户配置管理技术文档

## 1. 简介

Git 是一个广泛使用的分布式版本控制系统，允许用户跟踪代码更改并协作开发。在 Git 中，用户配置包含用户名和邮箱，这些信息用于标识提交的作者。正确配置 Git 用户信息对保证代码提交的准确性和追踪性至关重要。

## 2. 查看 Git 用户配置

### 2.1 查看全局配置

要查看全局 Git 配置中的用户名和邮箱，可以使用以下命令：

```bash
git config --global user.name
git config --global user.email
```

- `git config --global user.name`：显示全局配置中的用户名。
- `git config --global user.email`：显示全局配置中的邮箱地址。

### 2.2 查看项目级配置

如果你希望查看当前项目（仓库）的 Git 用户配置，请使用以下命令：

```bash
git config user.name
git config user.email
```

这些命令将显示在当前 Git 仓库中配置的用户名和邮箱地址。如果项目级配置未设置，将回退到全局配置。

### 2.3 查看所有 Git 配置

要查看所有 Git 配置（包括全局和项目级配置），可以使用以下命令：

```bash
git config --list
```

此命令将显示所有配置项及其值，包括用户名和邮箱。

## 3. 修改 Git 用户配置

### 3.1 修改全局配置

要修改全局 Git 配置中的用户名和邮箱，可以使用以下命令：

```bash
git config --global user.name "新用户名"
git config --global user.email "新邮箱@example.com"
```

- `git config --global user.name "新用户名"`：将全局配置中的用户名设置为“新用户名”。
- `git config --global user.email "新邮箱@example.com"`：将全局配置中的邮箱地址设置为“新邮箱@example.com”。

### 3.2 修改项目级配置

要修改当前项目的 Git 配置中的用户名和邮箱，请使用以下命令：

```bash
git config user.name "新用户名"
git config user.email "新邮箱@example.com"
```

- `git config user.name "新用户名"`：将当前项目的用户名设置为“新用户名”。
- `git config user.email "新邮箱@example.com"`：将当前项目的邮箱地址设置为“新邮箱@example.com”。

### 3.3 删除配置

如果你需要删除全局或项目级配置中的某个项，可以使用 `--unset` 参数：

```bash
git config --global --unset user.name
git config --global --unset user.email
```

或者对于项目级配置：

```bash
git config --unset user.name
git config --unset user.email
```

## 4. 管理 Git 凭据

### 4.1 Windows 凭据管理器

如果你使用 Windows 系统，你可以通过“凭据管理器”来管理 Git 凭据：

1. 打开“控制面板”。
2. 选择“用户账户”。
3. 选择“凭据管理器”。
4. 在“Windows 凭据”下，查找和管理 GitHub 或其他 Git 凭据。

### 4.2 macOS 钥匙串

如果你使用 macOS 系统，你可以通过“钥匙串访问”来管理 Git 凭据：

1. 打开“钥匙串访问”应用。
2. 在搜索框中输入“git”或“GitHub”。
3. 查找和管理相关的 Git 凭据。

### 4.3 Git 凭据缓存

Git 也支持凭据缓存功能，可以使用以下命令来配置凭据缓存：

```bash
git config --global credential.helper cache
```

默认情况下，凭据缓存会在 15 分钟内保持有效。

## 5. 参考资料

- [Git 官方文档](https://git-scm.com/doc)
- [GitHub 官方文档](https://docs.github.com/)

---

以上详细描述了如何查看和修改 Git 用户配置，并提供了关于管理 Git 凭据的信息。