#### 一、核心命令操作指南
1. **依赖管理**
   - **全局安装依赖**  
     ```bash
     lerna add imooc-utils  # 所有子包安装依赖
     ```
     执行后自动更新所有子包的 `package.json`，并在根目录生成 `package-lock.json`（建议加入 `.gitignore`）

   - **指定包安装依赖**  
     ```bash
     lerna add imooc-utils --scope=core  # 仅core包安装
     ```
     需注意 `--scope` 参数值为 `package.json` 中的 `name` 字段，非文件夹名

2. **环境清理**
   ```bash
   lerna clean  # 删除所有子包的 node_modules
   ```
   清理前会提示确认删除目录，支持 `-y` 跳过确认

3. **依赖链接**
   ```bash
   lerna link  # 自动处理跨包依赖
   ```
   当 `core/package.json` 存在 `"imooc-utils": "^1.0.0"` 时，自动创建符号链接至本地包

4. **批量命令执行**
   - **跨包执行任意命令**  
     ```bash
     lerna exec -- rm -rf node_modules  # 删除所有子包 node_modules
     ```
     上下文为各子包目录，支持 `--scope` 过滤

   - **执行 npm scripts**  
     ```bash
     lerna run test --scope=core  # 仅执行 core 包的 test 脚本
     ```
     支持通配符 `lerna run build --scope="package-*"`

#### 二、注意事项与最佳实践
1. **路径参数规范**
   - `--scope` 需使用 `package.json` 的 `name` 字段（如 `@project/core`）
   - 文件夹路径需完整（如 `packages/core`）

2. **版本一致性管理**
   ```bash
   lerna version --conventional-commits  # 基于提交记录自动升级版本
   ```
   Fixed 模式统一版本号，Independent 模式独立版本管理

3. **工作流优化**
   ```bash
   lerna bootstrap --hoist  # 提升公共依赖到根目录
   ```
   减少重复安装，需在 `lerna.json` 配置 `"hoist": true`

#### 三、常见问题排查
4. **依赖残留问题**  
   现象：执行 `lerna add` 后 `node_modules` 存在旧依赖  
   解决方案：
   ```bash
   lerna clean && lerna bootstrap  # 完整清理后重新安装
   ```

5. **符号链接失效**  
   现象：`lerna link` 后依赖未正确链接  
   检查项：
   - 确保依赖声明符合 `"imooc-utils": "^1.0.0"`
   - 确认被依赖包已通过 `lerna publish` 发布或本地存在有效构建

6. **作用域过滤异常**  
   现象：`--scope=core` 未生效  
   验证步骤：
   ```bash
   lerna list  # 确认包名与 scope 参数匹配
   ```

#### 四、命令速查表
| 命令                             | 作用描述              | 示例用法                           |
| ------------------------------ | ----------------- | ------------------------------ |
| `lerna add <pkg>`              | 全局安装依赖            | `lerna add lodash`             |
| `lerna add <pkg> --scope=<包名>` | 指定包安装依赖           | `lerna add axios --scope=core` |
| `lerna exec -- <command>`      | 跨包执行命令            | `lerna exec -- rm -rf dist`    |
| `lerna run <script>`           | 执行 npm scripts    | `lerna run build`              |
| `lerna link`                   | 链接跨包依赖            | `lerna link`                   |
| `lerna clean`                  | 清理所有 node_modules | `lerna clean -y`               |

> 参考资料：  
> [Lerna 官方文档](https://lerna.js.org)  
> [多包管理最佳实践](https://gitcode.gitcode.host/docs-cn/lerna-docs-cn/)