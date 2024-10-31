## 自动拉取 Git 仓库最新代码的定时任务

在开发过程中，保持代码的最新状态非常重要。本文将介绍如何使用 Node.js 创建一个定时任务，自动拉取指定 GitHub 仓库的最新代码。我们将使用 `cron` 模块来设置定时任务，并通过 `child_process` 模块执行 Git 命令。

### 1. 环境准备

首先，确保你的系统上安装了 Node.js 和 Git。接下来，在项目目录中安装所需的依赖包：

```bash
npm install cron
```

### 2. 代码实现

下面是完整的代码实现：

```javascript
const CronJob = require('cron').CronJob;
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 设置你的 GitHub 仓库 URL 和本地路径
const gitRepoUrl = 'git@github.com:Muliminty/Muliminty-Note.git'; // 替换为你的仓库 URL
const repositoryPath = 'C:\\project\\新建文件夹'; // 替换为你的本地路径

// 配置对象
const cronConfig = {
    daily: '0 0 * * *',        // 每天凌晨
    hourly: '0 * * * *',       // 每小时
    halfDay: '0 */12 * * *',   // 半天
    halfHour: '*/30 * * * *'   // 每半个小时
};

// 根据需要选择执行频率
const schedule = cronConfig.daily; // 可以更改为 hourly, halfDay, halfHour

function initializeGitRepo() {
    try {
        // 初始化 Git 仓库
        execSync(`git init "${repositoryPath}"`);
        execSync(`git -C "${repositoryPath}" remote add origin ${gitRepoUrl}`);
        console.log(`成功初始化 Git 仓库并添加远程仓库: ${gitRepoUrl}`);
    } catch (error) {
        console.error('初始化 Git 仓库失败:', error.message);
    }
}

function updateProject() {
    try {
        // 切换到项目目录
        process.chdir(repositoryPath);
        console.log('开始拉取最新代码...');
        // 拉取最新的代码
        execSync('git pull', { stdio: 'inherit' });
        console.log('Project updated successfully');
    } catch (error) {
        console.error('Failed to update project:', error.message);
    }
}

// 定义定时任务
const updateJob = new CronJob(schedule, function () {
    const gitDir = path.join(repositoryPath, '.git');

    if (fs.existsSync(gitDir)) {
        console.log('检测到 Git 仓库，开始拉取最新代码...');
        updateProject();
    } else {
        console.log('未检测到 Git 仓库，正在初始化...');
        initializeGitRepo();
        // 初始化完成后立即拉取代码
        updateProject();
    }
});

// 启动定时任务
updateJob.start();
```

### 3. 代码详解

- **仓库初始化**: `initializeGitRepo` 函数会检查指定路径是否是一个 Git 仓库，如果不是，就会进行初始化并添加远程仓库。

- **代码更新**: `updateProject` 函数负责切换到项目目录并执行 `git pull` 命令，拉取最新的代码。

- **定时任务配置**: 我们通过 `cronConfig` 对象定义了多种调度频率，可以轻松更改定时任务的执行频率。

### 4. 启动和测试

将上述代码保存为 `pullCode.js` 文件，然后在命令行中运行：

```bash
node pullCode.js
```

此时，定时任务将会自动执行，按照配置的频率拉取最新代码。

### 5. 结论

通过这种方式，你可以确保你的本地项目始终与远程仓库保持同步，减少手动拉取的工作量，提高工作效率。根据不同的项目需求，你可以灵活调整拉取的频率，确保代码的及时更新。
