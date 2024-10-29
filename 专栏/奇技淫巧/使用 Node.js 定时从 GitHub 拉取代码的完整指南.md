# 使用 Node.js 定时从 GitHub 拉取代码的完整指南

在本篇博客中，我们将学习如何使用 Node.js 编写一个定时脚本，以便定期从 GitHub 拉取最新的代码。我们将使用 `node-schedule` 模块来设置定时任务，并利用 `child_process` 模块执行 Git 命令。

## 1. 安装依赖

首先，你需要安装 `node-schedule`。打开终端并运行以下命令：

```bash
npm install node-schedule
```

## 2. 编写脚本

创建一个名为 `updateRepo.js` 的文件，并添加以下代码：

```javascript
const { exec } = require('child_process');
const schedule = require('node-schedule');

// 设置你的 GitHub 仓库 URL 和本地路径
const gitRepoUrl = 'https://github.com/你的用户名/你的仓库.git'; // 替换为你的仓库 URL
const localPath = '/path/to/your/local/repo'; // 替换为你的本地路径

// 定义拉取代码的函数
function pullLatestCode() {
    exec(`git -C ${localPath} pull`, (error, stdout, stderr) => {
        if (error) {
            console.error(`拉取代码失败: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`错误: ${stderr}`);
            return;
        }
        console.log(`拉取代码成功: ${stdout}`);
    });
}

// 定时任务，每小时拉取一次
const job = schedule.scheduleJob('0 * * * *', () => {
    console.log('开始拉取最新代码...');
    pullLatestCode();
});

// 如果需要，可以在程序结束时取消定时任务
// job.cancel();
```

## 3. 配置你的仓库和本地路径

确保替换以下变量：

- **gitRepoUrl**: 你的 GitHub 仓库的 URL。
- **localPath**: 你的本地仓库的路径。

## 4. 运行脚本

在终端中运行脚本：

```bash
node updateRepo.js
```

## 5. 持续运行

如果你希望这个脚本在后台持续运行，可以使用 `nohup` 或者 `pm2` 来管理它。以下是使用 `pm2` 的示例：

### 安装 pm2

```bash
npm install -g pm2
```

### 启动脚本

```bash
pm2 start updateRepo.js
```

### 保存 pm2 配置

```bash
pm2 save
```

### 设置开机自启

```bash
pm2 startup
```

## 注意事项

1. 确保你的本地仓库已初始化并与远程仓库关联。
2. 确保有适当的权限访问该仓库（如果是私有仓库，可能需要 SSH 访问或者 Token）。
3. 如果你在 CI/CD 环境中，可以考虑使用该环境提供的定时任务功能。

## 总结

通过以上步骤，你已经成功创建了一个 Node.js 脚本，能够定期从 GitHub 拉取最新的代码。这在保持项目同步和更新时非常有用，尤其是在团队开发或持续集成的场景中。希望这篇博客能帮助你顺利实现自动化更新！
