### Lena 源码分析笔记（第一部分：入口与调试准备）

---

#### **一、源码准备步骤**
1. **下载源码**
   - 通过 Git 克隆仓库：  
     ```bash
     git clone <repository-url>
     ```
   - 或直接下载 ZIP 包（适合快速查看）。

2. **安装依赖**
   - 使用包管理器安装项目依赖：  
     ```bash
     npm install  # 或 yarn
     ```
   - 确保安装 `@lena-cli/core` 等核心依赖（根据项目配置）。

3. **IDE 配置**
   - 使用 WebStorm/VSCode 等 IDE 打开项目，确保语法高亮、代码跳转功能正常。

---

#### **二、入口文件定位**
1. **核心逻辑位置**
   - 入口文件通常位于 `bin` 目录，通过 `package.json` 的 `bin` 字段指定。
   - **关键路径**：  
     ```json
     // packages/cli/package.json
     {
       "bin": {
        "Lerna":"core/lerna/cli.js"
       }
     }
     ```
   - 实际入口文件：`packages/cli/bin/lena-cli.js`。

2. **验证入口**
   - 全局安装后，命令行输入 `lena` 会执行该文件。
   - 本地调试时，直接运行 `node packages/cli/bin/lena-cli.js <command>`。

---

#### **三、调试环境配置（WebStorm 示例）**
1. **创建调试配置**
   - 点击 **Run > Edit Configurations > + > Node.js**。
   - 配置项：
     - **Name**: `Lena Debug`
     - **JavaScript file**: 选择 `packages/cli/bin/lena-cli.js`
     - **Application parameters**: 输入命令（如 `ls`）。

2. **设置断点**
   - 在关键代码行左侧单击（如 `cli.parse()` 处）。

3. **启动调试**
   - 点击 **Debug** 按钮，观察执行流程、变量变化及调用栈。

---

#### **四、源码阅读准备标准**
1. **入口文件确认**
   - 能明确回答：项目启动时执行的第一行代码在哪里？
2. **可调试性验证**
   - 断点生效，运行时上下文（变量、调用栈）可观察。

---

#### **五、Lena 执行流程初探**
1. **初始化阶段**
   - 加载 `commander` 库，定义 CLI 框架。
   - 注册全局命令（如 `ls`, `init`）。
2. **命令解析**
   - 解析用户输入（如 `lena ls`），匹配对应逻辑。
3. **执行逻辑**
   - 调用内部模块或插件，完成具体操作（如列出所有包）。

---

#### **六、关键问题思考**
1. **如何管理多包（Monorepo）？**
   - 观察 `packages/` 目录结构，学习 Lerna 的包管理策略。
2. **插件机制如何实现？**
   - 搜索 `plugin`, `register` 等关键词，分析扩展点设计。
3. **配置加载逻辑？**
   - 跟踪 `loadConfig()` 或类似函数，理解优先级（全局/本地配置）。

---

**下一步行动**：从 `cli.parse()` 出发，逐行分析命令注册与执行链路，结合调试验证推测。