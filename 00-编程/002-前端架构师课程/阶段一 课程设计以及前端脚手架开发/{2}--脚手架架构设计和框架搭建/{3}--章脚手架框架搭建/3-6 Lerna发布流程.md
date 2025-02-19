#### 一、版本管理核心流程
1. **版本号升级**
   ```bash
   lerna version  # 交互式版本升级
   ```
   - 支持选项：
     - `patch`（补丁版本：1.0.0 → 1.0.1）
     - `minor`（次版本：1.0.0 → 1.1.0）
     - `major`（主版本：1.0.0 → 2.0.0）
     - `prepatch`（预发布补丁：1.0.0 → 1.0.1-alpha.0）

2. **变更检测**
   ```bash
   lerna changed  # 检测自上次发布后的变更包
   lerna diff     # 查看具体代码差异
   ```

#### 二、发布前准备
1. **Git仓库配置**
   ```bash
   git remote add origin git@gitee.com:yourname/imooc-cli.git
   git push -u origin master  # 首次推送建立追踪关系
   ```

2. **必要文件配置**
   - 添加 `LICENSE.md`（推荐 MIT 协议）
   - 配置 `.gitignore`：
     ```
     node_modules/
     package-lock.json
     lerna-debug.log
     ```

#### 三、发布完整流程
```bash
# 1. 登录 npm 账号
npm login

# 2. 版本升级
lerna version --conventional-commits

# 3. 执行发布
lerna publish from-package
```
典型输出流程：
```
lerna notice Current version: 1.0.3
lerna info Looking for changed packages since v1.0.2
? Select a new version (currently 1.0.3) Patch (1.0.4)

Changes:
 - @imooc/core: 1.0.3 => 1.0.4
 - @imooc/utils: 1.0.3 => 1.0.4

? Are you sure you want to publish these packages? Yes
```

#### 四、关键配置项
1. **作用域包公开配置**
   ```json
   // package.json
   {
     "publishConfig": {
       "access": "public"
     }
   }
   ```

2. **CLI入口配置**
   ```json
   {
     "bin": {
       "imooc-cli": "./bin/index.js"
     }
   }
   ```

#### 五、常见问题排查
| 错误现象                  | 解决方案                                                                 |
|--------------------------|--------------------------------------------------------------------------|
| 402 权限错误              | 执行 `npm login` 并确认 registry 配置正确                                |
| 作用域包发布失败          | 添加 `publishConfig.access: "public"`                                    |
| 版本冲突错误              | 删除本地 tag：`git tag -d v1.0.3` 并重新执行发布流程                     |
| 缺少 LICENSE 文件         | 添加 MIT/Apache 等开源协议文件                                           |
| 符号链接未正确建立        | 执行 `lerna clean && lerna bootstrap` 重建依赖关系                       |

#### 六、最佳实践建议
1. **版本管理策略**
   - 推荐使用 `--conventional-commits` 自动生成 CHANGELOG
   - 开发阶段使用 `prerelease` 版本（如 `1.0.0-beta.0`）

2. **自动化集成**
   ```bash
   # GitHub Actions 示例配置
   name: Publish
   on: [push]
   jobs:
     publish:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '16'
             registry-url: 'https://registry.npmjs.org'
         - run: npm install -g lerna
         - run: lerna publish --yes --conventional-commits
           env:
             NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
   ```

#### 七、发布后验证
1. **NPM 包查询**
   ```bash
   npm view @imooc/core versions  # 查看已发布版本
   ```

2. **全局安装测试**
   ```bash
   npm install -g @imooc/core
   imooc-cli --version
   ```

> 注意事项：  
> 1. 确保所有待发布包在 `lerna.json` 的 `packages` 列表中  
> 2. 发布前执行完整测试流程：`lerna run test`  
> 3. 国内镜像用户需切换 registry：`npm config set registry https://registry.npmjs.org/`

完整项目示例：[imooc-cli 脚手架仓库](https://gitee.com/yourname/imooc-cli)