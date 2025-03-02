---

### **Node.js 源码调试进阶技巧（WebStorm 版）**

---

#### **一、IDE 配置优化**
1. **启用 Node.js 内置库支持**  
   - **操作路径**：`Preferences > Languages & Frameworks > Node.js and NPM`  
   - **关键选项**：勾选 **`Coding assistance for Node.js`**  
   - **作用**：对 `fs`、`path` 等 Node.js 内置模块提供智能提示、跳转和高亮支持。  
   - **未启用的后果**：无法直接跳转查看内置库源码，影响代码理解。

2. **第三方库源码跳转**  
   - **操作路径**：`Preferences > Build, Execution, Deployment > Debugger > Stepping`  
   - **关键选项**：取消勾选 **`Do not step into library scripts`**  
   - **作用**：允许调试时进入 `node_modules` 中的第三方库源码（如 `commander`）。  
   - **注意事项**：  
     - 可能误入无关库代码，可通过 **Step Out** 快速返回业务逻辑。

---

#### **二、调试操作核心三剑客**
| **操作**       | **快捷键**     | **功能**                                                                 |
|----------------|---------------|--------------------------------------------------------------------------|
| **Step Over**  | `F8`          | 逐行执行代码，不进入函数内部（跳过当前行的函数调用）。                          |
| **Step Into**  | `F7`          | 进入当前行的函数内部（如 `require()` 或自定义函数），深入调试逻辑。                |
| **Step Out**   | `Shift+F8`    | 从当前函数跳出，回到调用该函数的下一行代码（避免深陷库文件逻辑）。                   |

**示例场景**：  
```javascript
const config = loadConfig(); // Step Over：直接执行完 loadConfig()
const app = initApp(config); // Step Into：进入 initApp() 函数内部
logger.info("Ready");        // Step Out：若进入 logger 库，快速跳出
```

---

#### **三、高效调试技巧**
1. **条件断点（Conditional Breakpoints）**  
   - **用法**：右键断点 → 设置条件（如 `user.id === 'admin'`）。  
   - **场景**：仅在某些条件下触发断点（如特定用户或数据）。

2. **观察表达式（Watches）**  
   - **用法**：调试面板 → **Watches** → `+` → 输入变量名（如 `process.env.NODE_ENV`）。  
   - **作用**：实时监控变量值的变化，无需手动展开调用栈。

3. **调试控制台（Debug Console）**  
   - **功能**：在暂停状态时，直接在控制台执行代码片段（如 `console.log(config)`）。  
   - **快捷键**：`Alt + F8` 快速计算表达式。

---

#### **四、常见问题解决**
1. **无法跳转到第三方库源码**  
   - **原因**：未正确安装依赖或 IDE 索引未完成。  
   - **解决**：  
     - 确保 `node_modules` 完整（`npm install`）。  
     - 右键项目 → `Reindex Project` 重建索引。

2. **断点不生效**  
   - **排查步骤**：  
     1. 确认文件未被忽略（检查 `.gitignore` 或 `.idea` 配置）。  
     2. 确保代码路径与运行路径一致（如符号链接问题）。  
     3. 重启调试会话。

---

#### **五、实战调试建议**
1. **分层调试**  
   - 先通过 **Step Over** 快速定位问题范围，再针对关键函数 **Step Into**。  
   - 对复杂逻辑使用 **条件断点** 减少干扰。

2. **记录上下文**  
   - 在 **Watches** 中添加关键变量（如 `this.args`、`options.debug`）。  
   - 使用 **Debug Console** 动态修改运行时数据（慎用，避免污染逻辑）。

3. **结合源码结构**  
   - 结合 `packages/` 下的模块划分，优先调试核心模块（如 `cli`、`core`）。  
   - 利用 **Find Usages**（`Alt+F7`）追踪函数调用链路。

---

**下一步**：尝试在 `lena init` 命令的初始化流程中设置断点，观察配置加载和模板下载逻辑！