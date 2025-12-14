# Vim 编辑器（Vim Editor）

> 强大的文本编辑器，掌握 Vim 提高编辑效率

## 📚 知识体系

### 1. Vim 基础入门

**目标**：掌握 Vim 的基本操作和模式切换

#### Vim 模式
- **普通模式（Normal Mode）**：默认模式，用于导航和命令执行
- **插入模式（Insert Mode）**：用于输入文本
- **可视模式（Visual Mode）**：用于选择文本
- **命令模式（Command Mode）**：用于执行命令

#### 模式切换
- `i`：进入插入模式（光标前）
- `a`：进入插入模式（光标后）
- `o`：在下一行插入
- `O`：在上一行插入
- `v`：进入可视模式
- `V`：进入行可视模式
- `Esc`：返回普通模式
- `:`：进入命令模式

---

### 2. 基础操作

**目标**：掌握文件操作和基本编辑命令

#### 文件操作
- `:w`：保存文件
- `:q`：退出
- `:wq` 或 `:x`：保存并退出
- `:q!`：强制退出（不保存）
- `:e <file>`：打开文件
- `:w <file>`：另存为

#### 光标移动
- `h`、`j`、`k`、`l`：左、下、上、右
- `w`：移动到下一个单词开头
- `b`：移动到上一个单词开头
- `e`：移动到单词末尾
- `0`：移动到行首
- `$`：移动到行尾
- `gg`：移动到文件开头
- `G`：移动到文件末尾
- `{n}G`：移动到第 n 行

#### 文本编辑
- `x`：删除当前字符
- `dd`：删除当前行
- `dw`：删除单词
- `d$`：删除到行尾
- `yy`：复制当前行
- `yw`：复制单词
- `p`：粘贴
- `P`：在光标前粘贴
- `u`：撤销
- `Ctrl+r`：重做

---

### 3. 高级技巧

**目标**：掌握 Vim 的高级功能和技巧

#### 搜索与替换
- `/pattern`：向下搜索
- `?pattern`：向上搜索
- `n`：下一个匹配
- `N`：上一个匹配
- `:%s/old/new/g`：全局替换
- `:%s/old/new/gc`：全局替换（确认）

#### 多文件编辑
- `:split` 或 `:sp`：水平分割窗口
- `:vsplit` 或 `:vs`：垂直分割窗口
- `Ctrl+w` + 方向键：切换窗口
- `:tabnew`：新建标签页
- `gt`：下一个标签页
- `gT`：上一个标签页

#### 宏录制
- `q{a-z}`：开始录制宏到寄存器
- `q`：停止录制
- `@{a-z}`：执行宏

---

### 4. 配置文件

**目标**：定制 Vim 环境，提高编辑效率

#### 配置文件位置
- `~/.vimrc`：用户配置文件
- `~/.vim/`：用户配置目录

#### 常用配置示例
```vim
" 显示行号
set number

" 语法高亮
syntax on

" 显示相对行号
set relativenumber

" 高亮当前行
set cursorline

" 自动缩进
set autoindent
set smartindent

" Tab 键空格数
set tabstop=4
set shiftwidth=4
set expandtab

" 搜索高亮
set hlsearch
set incsearch

" 忽略大小写
set ignorecase
set smartcase

" 显示匹配括号
set showmatch

" 文件编码
set encoding=utf-8
set fileencoding=utf-8
```

---

### 5. 插件管理

**目标**：使用插件扩展 Vim 功能

#### 插件管理器
- **Vim-plug**：轻量级插件管理器
- **Vundle**：流行的插件管理器
- **Pathogen**：简单的插件管理

#### Vim-plug 安装示例
```bash
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

#### 插件配置示例
```vim
call plug#begin('~/.vim/plugged')

Plug 'tpope/vim-surround'
Plug 'scrooloose/nerdtree'
Plug 'vim-airline/vim-airline'
Plug 'junegunn/fzf.vim'

call plug#end()
```

---

## 🎯 学习路径

### 阶段一：基础操作
1. 掌握模式切换
2. 学习光标移动
3. 练习基本编辑命令

### 阶段二：高效编辑
1. 掌握搜索与替换
2. 学习多文件编辑
3. 练习宏录制

### 阶段三：环境定制
1. 配置 `.vimrc`
2. 安装常用插件
3. 优化工作流程

---

## 📖 专题索引

### 🚀 新手入门（推荐从这里开始）
- **[01-Vim-新手快速上手指南](./01-Vim-新手快速上手指南.md)** ⭐ - 30分钟快速上手，从零开始学习

### 基础入门
- [02-Vim-模式详解](./02-Vim-模式详解.md) - 深入理解各种模式
- [03-Vim-基础命令速查](./03-Vim-基础命令速查.md) - 常用命令快速参考

### 配置与插件
- [04-Vim-配置最佳实践](./04-Vim-配置最佳实践.md) - 打造高效编辑环境
- [05-Vim-插件推荐](./05-Vim-插件推荐.md) - 精选实用插件

### 高级技巧
- [06-Vim-高级技巧](./06-Vim-高级技巧.md) - 提升编辑效率的高级技巧
- [07-Vim-正则表达式](./07-Vim-正则表达式.md) - 搜索替换中的正则用法

### 🎯 实战项目
- **[08-Neovim-实战教程-React-Node项目](./08-Neovim-实战教程-React-Node项目.md)** 🚀 - 通过实际项目学习 Neovim，开发完整的前后端应用

---

## 📚 学习资源

- [Vim 官方文档](https://www.vim.org/docs.php)
- [Vim 中文文档](https://vimcdoc.sourceforge.net/)
- [Vim Adventures](https://vim-adventures.com/) — 游戏化学习 Vim
- [Open Vim](https://www.openvim.com/) — 交互式 Vim 教程

---

**学习目标**：熟练使用 Vim 进行文本编辑，掌握高效编辑技巧，定制个性化编辑环境

