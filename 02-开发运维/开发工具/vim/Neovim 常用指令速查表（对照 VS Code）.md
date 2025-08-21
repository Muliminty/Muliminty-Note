明白了 👍  
如果你习惯了 **VS Code**，想无缝切到 **Neovim**，核心是掌握 **文件操作 / 分屏 / 查找 / 跳转 / 代码编辑** 这些常用操作。下面我给你整理一份 **从 VS Code 到 Neovim 的常用指令对照表**（你可以当作速查表用 👇）：

---

# 📝 Neovim 常用指令速查表（对照 VS Code）

## 🔹 文件/项目管理

|VS Code|Neovim|
|---|---|
|打开文件夹|`nvim .` （进入目录浏览模式 `:Ex`）|
|文件树切换|`:NvimTreeToggle` 或 `:Neotree toggle`|
|打开文件|在文件树或 `:e 路径/文件名`|
|保存文件|`:w`|
|保存并退出|`:wq`|
|退出不保存|`:q!`|
|打开最近文件|`:Telescope oldfiles`|

---

## 🔹 窗口/分屏操作

|VS Code|Neovim|
|---|---|
|新建分屏 (右)|`:vsp`|
|新建分屏 (下)|`:sp`|
|在分屏间切换|`Ctrl-w h/j/k/l`|
|关闭分屏|`:q`|
|调整分屏大小|`Ctrl-w <` / `Ctrl-w >` / `Ctrl-w =`|

---

## 🔹 多文件/标签页

| VS Code | Neovim    |
| ------- | --------- |
| 打开新标签   | `:tabnew` |
| 下一个标签   | `:tabn`   |
| 上一个标签   | `:tabp`   |
| 关闭当前标签  | `:tabc`   |

---

## 🔹 查找/跳转

|VS Code|Neovim|
|---|---|
|全局搜索文件|`:Telescope find_files`|
|全局搜索内容|`:Telescope live_grep`|
|查找并替换|`:%s/old/new/g`|
|跳转到函数定义|`gd` (LSP 插件支持)|
|查看引用|`gr`|
|显示文档提示|`K`|

---

## 🔹 编辑操作

|VS Code|Neovim|
|---|---|
|复制|`y`|
|剪切|`d`|
|粘贴|`p`|
|撤销|`u`|
|重做|`Ctrl-r`|
|全选|`ggVG`|
|格式化代码|`:lua vim.lsp.buf.format()` 或 `=G`|
|注释|插件（如 Comment.nvim），快捷键一般是 `gcc` 或 `gc` 选区|

---

## 🔹 Git 集成

|VS Code|Neovim|
|---|---|
|查看改动|`:Git`（fugitive 插件）|
|提交|`:Git commit`|
|推送|`:Git push`|
|查看 diff|`:Gdiffsplit`|

---

## 🔹 其他常用技巧

- **退出插入模式** → `Esc`
    
- **命令行模式** → `:`
    
- **搜索内容** → `/关键字` 然后 `n`/`N` 跳转
    
- **折叠代码** → `zc` 折叠，`zo` 展开
    
- **多光标编辑** → 用 `vim-visual-multi` 插件 (`Ctrl-n` 添加光标)
    

---

⚡ **建议过渡方式**

1. 先用 Neovim 里的 **文件树 + Telescope + LSP**，这些能替代 VS Code 的核心功能。
    
2. 记住 `:w`（保存）、`:q`（退出）、`/`（搜索）、`:e`（打开文件），就能开始用了。
    
3. 配合插件（LazyVim/NvChad/AstroNvim 等）会让体验更接近 VS Code。
    

---

要不要我帮你写一份 **最小化的 Neovim 配置**（带文件树、Telescope、LSP、注释），这样你开箱就能像 VS Code 一样用？