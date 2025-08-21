下面给出一份「从零到一」的 **Neovim 项目开发实战手册**。  
目标：照着做，就能用 **Ubuntu 22.04 + Neovim** 完成日常编码、调试、Git、终端、项目管理等完整工作流。  
文档分为 6 个阶段，每个阶段都给出可复制的命令或最小配置，确保“一步一步就能跑起来”。

------------------------------------------------
阶段 0：一次性环境准备（Ubuntu 22.04）
------------------------------------------------
```bash
# 1. 升级系统 & 基础工具
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential git curl unzip ripgrep fd-find

# 2. 安装最新稳定 Neovim（>0.9）
sudo snap install nvim --classic        # 或 PPA 方式
# 验证
nvim -v
```

------------------------------------------------
阶段 1：目录结构与启动文件
------------------------------------------------
Neovim 配置统一放在 `~/.config/nvim`。  
下面用 **LazyVim** 发行版做基底（官方推荐，Lua 配置，插件懒加载）。

```bash
# 备份旧配置
mv ~/.config/nvim{,.bak}
mv ~/.local/share/nvim{,.bak}

# 一键安装 LazyVim
git clone https://github.com/LazyVim/starter ~/.config/nvim
```

首次启动会自动装插件，大概 30 s 左右。

------------------------------------------------
阶段 2：日常开发三件套（LSP + 补全 + 调试）
------------------------------------------------
1. 语言服务器  
   打开任意文件时，右下角会弹提示“Install LSP”，回车即可；或手动装：
   ```vim
   :Mason
   ```
   在 Mason 界面里选 `rust-analyzer`、`gopls`、`pyright`、`ts-ls` 等，按 `i` 安装。

2. 补全引擎  
   LazyVim 自带 `nvim-cmp`，开箱即用。如需加 Snippet：
   ```lua
   -- ~/.config/nvim/lua/plugins/cmp.lua
   return {
     "hrsh7th/nvim-cmp",
     dependencies = {
       "L3MON4D3/LuaSnip",
       "saadparwaiz1/cmp_luasnip",
     },
   }
   ```

3. 调试（DAP）  
   继续用 Mason：
   ```vim
   :MasonInstall codelldb delve debugpy
   ```
   然后 `F5` / `F10` 等快捷键即可，调试配置自动生成（VS Code launch.json 兼容）。

------------------------------------------------
阶段 3：项目管理 & 文件树
------------------------------------------------
LazyVim 已集成下列插件，开箱即用：

| 功能 | 按键 | 说明 |
|---|---|---|
| 文件树 | `<leader>e` | nvim-tree.lua 弹出/关闭 |
| Fuzzy Finder | `<leader>ff` | Telescope 查找文件 |
| Grep | `<leader>fg` | Telescope live grep（依赖 ripgrep） |
| Git 状态 | `<leader>gg` | LazyGit 浮窗 |

------------------------------------------------
阶段 4：完整 Git 工作流
------------------------------------------------
1. 安装 LazyGit（Ubuntu）  
   ```bash
   sudo apt install -y lazygit
   ```
2. 在 Neovim 内  
   - `<leader>gg` 打开 LazyGit → 正常 `add/commit/push`  
   - 侧边栏实时 diff 标记由 `gitsigns` 提供  
   - 冲突解决：`<leader>gR` 三向合并视图

------------------------------------------------
阶段 5：终端与多任务
------------------------------------------------
LazyVim 自带 `toggleterm.nvim`：

- Ctrl+\` 弹出/隐藏浮动终端  
- 多个终端按数字切换：`<leader>1`、`<leader>2` …  
- 运行当前文件：`<leader>r`（自动识别语言并执行）

------------------------------------------------
阶段 6：自定义快捷键 & 配色（示例）
------------------------------------------------
```lua
-- ~/.config/nvim/lua/config/keymaps.lua
vim.keymap.set("n", "<C-s>", ":w<CR>", { silent = true })
vim.keymap.set("i", "jj", "<Esc>", {})

-- 配色：onedark
return {
  "navarasu/onedark.nvim",
  lazy = false,
  priority = 1000,
  config = function()
    vim.cmd.colorscheme("onedark")
  end,
}
```

------------------------------------------------
阶段 7：日常开发完整流程（演示）
------------------------------------------------
以 **Go 项目** 为例，其他语言步骤完全一致。

```bash
# 1. 新建项目
mkdir hello-go && cd hello-go
go mod init hello

# 2. 用 nvim 打开
nvim .

# 3. 新建 main.go
```
在 nvim 内：

- `<leader>ff` → 输入 `main.go` 回车 → 自动模板  
- 键入 `func ma` → Tab 触发 Snippet → 自动生成 `func main() {...}`  
- 保存时自动 `gofmt` + `goimports`（通过 `null-ls`）  
- `<leader>r` 立即运行  
- `<leader>b` 编译  
- `<F5>` 进入调试，断点、变量监视与 VS Code 体验一致  

------------------------------------------------
阶段 8：备份与同步
------------------------------------------------
配置全部在 `~/.config/nvim` + `~/.local/share/nvim`，直接 push 到 GitHub 即可多端同步。

------------------------------------------------
总结
------------------------------------------------
按本文 8 个阶段操作，你即可在 Ubuntu 22.04 + Neovim 上获得：

- 开箱即用的 LSP、补全、调试  
- 类 VS Code 的 Git 图形界面  
- 文件树、模糊搜索、浮动终端、多光标、Snippet  
- 一键运行 / 调试任意语言  



# 下面是配置

LazyVim 超详细使用手册  
（基于官方仓库 https://github.com/LazyVim/LazyVim，2024-06 最新版）

────────────────────────
1. 系统要求
────────────────────────
• Neovim ≥ 0.9.0（需带 LuaJIT）  
• Git ≥ 2.19.0  
• 可选：Nerd Font（图标更好看）、C 编译器（treesitter 语法树需要）

一键检查  
```bash
nvim -v      # 版本 ≥ 0.9.0
git --version
```

────────────────────────
2. 安装 LazyVim（Ubuntu 22.04 示例）
────────────────────────
```bash
# 1) 备份旧配置（第一次安装可跳过）
mv ~/.config/nvim{,.bak}
mv ~/.local/share/nvim{,.bak}

# 或者直接删除
rm -rf ~/.config/nvim
rm -rf ~/.local/share/nvim

# 2) 克隆官方 starter
git clone https://github.com/LazyVim/starter ~/.config/nvim

# 3) 去掉 .git，方便以后自己建仓库
rm -rf ~/.config/nvim/.git

# 4) 首次启动（自动下载插件，约 30 s）
nvim
```
启动后界面是 LazyVim 的欢迎页即表示成功。

────────────────────────
3. 目录结构速览
────────────────────────
```
~/.config/nvim
├── init.lua              -- 唯一入口
├── lua/
│   ├── config/           -- 官方默认配置
│   │   ├── options.lua   -- 全局设置
│   │   ├── keymaps.lua   -- 快捷键
│   │   ├── autocmds.lua  -- 自动命令
│   │   └── lazy.lua      -- lazy.nvim 加载器
│   └── plugins/          -- 你的自定义插件
│       ├── coding.lua
│       ├── ui.lua
│       └── ...
```

────────────────────────
4. 日常按键速查表
────────────────────────

| 功能      | 默认键                 | 备注                   |
| ------- | ------------------- | -------------------- |
| 文件树     | `<leader>e`         | nvim-tree            |
| 模糊查找文件  | `<leader>ff`        | Telescope            |
| 全局搜索文本  | `<leader>fg`        | Telescope live\_grep |
| Git 状态  | `<leader>gg`        | LazyGit 浮窗           |
| 终端      | \`<leader>\`\`      | toggleterm           |
| 保存      | `<C-s>`             | 通用                   |
| 退出      | `<leader>q`         | 关闭 buffer            |
| 调试开始/结束 | `F5` / `<leader>dQ` | nvim-dap             |
`<leader>` 默认为空格键。

────────────────────────
5. 安装/管理语言服务器 & 调试器
────────────────────────
6) 打开 Mason（包管理器）  
   在 Normal 模式输入  
   ```
   :Mason
   ```
7) 光标移动到需要的条目，按 `i` 安装，例如  
   • LSP：`rust-analyzer` / `gopls` / `pyright` / `ts_ls`  
   • DAP：`codelldb` / `debugpy` / `delve`

安装完成后无需重启，LazyVim 自动生效。

────────────────────────
6. 自定义配置 3 步曲
────────────────────────
(1) 改全局设置  
```lua
-- ~/.config/nvim/lua/config/options.lua
vim.opt.relativenumber = true   -- 相对行号
vim.opt.wrap = false            -- 不自动折行
```

(2) 加自己的快捷键  
```lua
-- ~/.config/nvim/lua/config/keymaps.lua
vim.keymap.set("n", "<leader>z", ":ZenMode<CR>", { desc = "Zen Mode" })
```

(3) 加/覆盖插件  
```lua
-- ~/.config/nvim/lua/plugins/zen.lua
return {
  "folke/zen-mode.nvim",
  cmd = "ZenMode",
  keys = { { "<leader>z", "<cmd>ZenMode<cr>", desc = "Zen Mode" } },
}
```
保存后运行 `:Lazy sync` 自动拉取并启用。

────────────────────────
7. 完整项目开发流程示例（Go）
────────────────────────
```bash
# 1. 建项目
mkdir hello && cd hello
go mod init hello

# 2. 打开
nvim .

# 3. 新建 main.go
```
在 nvim 内：

| 动作 | 按键/命令 |
|---|---|
| 新建文件 | `<leader>fn` → 输入文件名 |
| 自动补全 | 输入时 TAB 触发 cmp |
| 格式化 | `<leader>cf` 或保存时自动 |
| 运行 | `<leader>r` |
| 调试 | 在 main 函数行按 `F9` 断点 → `F5` |
| Git 提交 | `<leader>gg` → `a` 暂存 → `c` 提交 → `p` 推送 |

────────────────────────
8. 更新 LazyVim & 插件
────────────────────────
```
:Lazy     -- 打开插件面板
U         -- 更新所有插件
```
每周执行一次即可保持最新。

────────────────────────
9. 备份 & 多端同步
────────────────────────
```bash
cd ~/.config/nvim
git init
git add .
git commit -m "init my LazyVim"
git remote add origin https://github.com/YOU/dotnvim.git
git push -u origin main
```
换机时只需 `git clone` 到 `~/.config/nvim` 即可还原全部环境。

────────────────────────
10. 常见问题速查
────────────────────────
Q1: 打开后提示 “No C compiler”  
→ `sudo apt install build-essential`

Q2: 图标全是方块  
→ 安装任意 Nerd Font，例如  
```bash
sudo apt install fonts-hack-ttf
```

Q3: 想恢复官方默认配置  
→ 删除 `~/.config/nvim` 重新 `git clone starter` 即可。

至此，你已拥有与 VS Code 同等功能、但启动 < 200 ms 的“终端 IDE”。Happy coding!