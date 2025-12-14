# Vim 配置最佳实践

> 打造高效、舒适的 Vim 编辑环境

## 📁 配置文件位置

### 配置文件

- **Vim**：`~/.vimrc`
- **Neovim**：`~/.config/nvim/init.vim` 或 `~/.config/nvim/init.lua`

### 配置目录

- **Vim**：`~/.vim/`
- **Neovim**：`~/.config/nvim/`

---

## 🎯 基础配置

### 显示设置

```vim
" 显示行号
set number
set relativenumber    " 相对行号（方便使用数字+命令）

" 显示当前行
set cursorline

" 显示状态栏
set laststatus=2      " 总是显示状态栏

" 显示命令
set showcmd           " 显示正在输入的命令

" 显示匹配括号
set showmatch
set matchtime=1       " 匹配括号高亮时间（0.1秒）
```

### 搜索设置

```vim
" 搜索时高亮匹配
set hlsearch          " 高亮所有匹配
set incsearch         " 实时搜索（输入时就开始搜索）

" 搜索设置
set ignorecase        " 忽略大小写
set smartcase         " 如果搜索包含大写，则区分大小写

" 清除搜索高亮
nnoremap <leader><space> :nohlsearch<CR>
```

### 编辑设置

```vim
" 缩进设置
set autoindent        " 自动缩进
set smartindent       " 智能缩进
set tabstop=4         " Tab 键显示为4个空格
set shiftwidth=4      " 自动缩进使用4个空格
set expandtab         " 将 Tab 转换为空格
set softtabstop=4     " 编辑时 Tab 键等于4个空格

" 换行设置
set wrap              " 自动换行
set linebreak         " 在单词边界换行
set textwidth=80      " 文本宽度（可选）

" 其他编辑设置
set backspace=indent,eol,start  " 退格键可以删除缩进、换行、插入前的字符
set whichwrap+=<,>,h,l          " 允许在行首/行尾使用左右箭头
```

### 文件编码

```vim
" 编码设置
set encoding=utf-8
set fileencoding=utf-8
set fileencodings=utf-8,gbk,gb2312,big5

" 文件格式
set fileformat=unix   " Unix 格式（LF）
```

### 其他实用设置

```vim
" 语法高亮
syntax on

" 文件类型检测
filetype on
filetype plugin on
filetype indent on

" 鼠标支持（可选）
set mouse=a           " 启用鼠标

" 备份设置
set nobackup          " 不创建备份文件
set nowritebackup     " 不创建写入备份
set noswapfile        " 不创建交换文件

" 历史记录
set history=1000      " 命令历史记录数

" 自动重新加载文件
set autoread          " 文件被外部修改时自动重新加载

" 错误提示
set noerrorbells      " 关闭错误提示音
set visualbell        " 使用视觉提示代替声音
```

---

## ⌨️ 快捷键映射

### Leader 键设置

```vim
" 设置 Leader 键（默认为 \）
let mapleader = " "   " 使用空格作为 Leader 键
let maplocalleader = "\\"
```

### 常用快捷键映射

```vim
" 快速保存
nnoremap <leader>w :w<CR>

" 快速退出
nnoremap <leader>q :q<CR>

" 快速保存并退出
nnoremap <leader>x :wq<CR>

" 清除搜索高亮
nnoremap <leader><space> :nohlsearch<CR>

" 快速切换窗口
nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l

" 快速移动（插入模式）
inoremap <C-h> <Left>
inoremap <C-j> <Down>
inoremap <C-k> <Up>
inoremap <C-l> <Right>

" 快速移动（普通模式，如果习惯方向键）
" nnoremap <Up> <Nop>
" nnoremap <Down> <Nop>
" nnoremap <Left> <Nop>
" nnoremap <Right> <Nop>
```

### 实用映射

```vim
" 在可视模式下缩进后保持选中
vnoremap < <gv
vnoremap > >gv

" 快速跳转到行首行尾
nnoremap H ^
nnoremap L $

" Y 复制到行尾（默认只复制整行）
nnoremap Y y$

" 保持搜索结果在屏幕中央
nnoremap n nzzzv
nnoremap N Nzzzv

" 保持跳转结果在屏幕中央
nnoremap G Gzzzv
nnoremap gg ggzzzv
```

---

## 🎨 外观配置

### 颜色方案

```vim
" 启用 256 色
set t_Co=256

" 设置颜色方案
colorscheme desert    " 或其他喜欢的方案
" colorscheme molokai
" colorscheme solarized

" 背景色
set background=dark    " 或 light
```

### 字体和显示

```vim
" 如果使用 GUI 版本（gvim）
if has("gui_running")
    set guifont=Monaco:h14
    set guioptions-=T   " 隐藏工具栏
    set guioptions-=m   " 隐藏菜单栏
    set guioptions-=r   " 隐藏右侧滚动条
    set guioptions-=L   " 隐藏左侧滚动条
endif
```

---

## 🔌 插件管理

### 使用 vim-plug（推荐）

#### 安装 vim-plug

```bash
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

#### 配置示例

```vim
" 插件开始
call plug#begin('~/.vim/plugged')

" 插件列表
Plug 'tpope/vim-surround'        " 快速操作配对符号
Plug 'scrooloose/nerdtree'        " 文件树
Plug 'vim-airline/vim-airline'    " 状态栏
Plug 'junegunn/fzf.vim'           " 模糊搜索
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }

" 插件结束
call plug#end()
```

#### 插件管理命令

```vim
:PlugInstall    " 安装插件
:PlugUpdate     " 更新插件
:PlugClean      " 删除未使用的插件
:PlugUpgrade    " 升级 vim-plug 本身
```

---

## 📝 文件类型特定配置

### 自动命令

```vim
" 根据文件类型设置
autocmd FileType python setlocal tabstop=4 shiftwidth=4 expandtab
autocmd FileType javascript setlocal tabstop=2 shiftwidth=2 expandtab
autocmd FileType html setlocal tabstop=2 shiftwidth=2 expandtab
autocmd FileType css setlocal tabstop=2 shiftwidth=2 expandtab
autocmd FileType markdown setlocal wrap linebreak

" 自动去除行尾空格
autocmd BufWritePre * %s/\s\+$//e

" 自动添加文件头（可选）
autocmd BufNewFile *.sh,*.py exec ":call SetTitle()"
```

### 函数定义

```vim
" 添加文件头函数示例
func SetTitle()
    if &filetype == 'sh'
        call setline(1, "#!/bin/bash")
        call setline(2, "")
    elseif &filetype == 'python'
        call setline(1, "#!/usr/bin/env python")
        call setline(2, "# -*- coding: utf-8 -*-")
        call setline(3, "")
    endif
    normal G
    normal o
endfunc
```

---

## 🚀 性能优化

### 大文件处理

```vim
" 大文件时禁用某些功能
function! LargeFile()
    " 禁用语法高亮
    setlocal syntax=off
    " 禁用折叠
    setlocal nofoldenable
    " 禁用插件
    setlocal eventignore+=FileType
endfunction

autocmd BufReadPre * let f=getfsize(expand("<afile>"))
autocmd BufReadPre * if f > 10000000 | call LargeFile() | endif
```

### 其他优化

```vim
" 减少重绘
set lazyredraw

" 提高滚动性能
set ttyfast

" 限制语法高亮区域（可选）
set synmaxcol=200
```

---

## 📋 完整配置示例

```vim
" ========================================
" 基础设置
" ========================================
set number
set relativenumber
set cursorline
set showcmd
set showmatch
set matchtime=1

" ========================================
" 搜索设置
" ========================================
set hlsearch
set incsearch
set ignorecase
set smartcase
nnoremap <leader><space> :nohlsearch<CR>

" ========================================
" 编辑设置
" ========================================
set autoindent
set smartindent
set tabstop=4
set shiftwidth=4
set expandtab
set softtabstop=4
set backspace=indent,eol,start

" ========================================
" 文件设置
" ========================================
set encoding=utf-8
set fileencoding=utf-8
set fileencodings=utf-8,gbk,gb2312,big5
set fileformat=unix

" ========================================
" 其他设置
" ========================================
syntax on
filetype on
filetype plugin on
filetype indent on
set nobackup
set nowritebackup
set noswapfile
set history=1000
set autoread
set noerrorbells
set visualbell

" ========================================
" 快捷键
" ========================================
let mapleader = " "
nnoremap <leader>w :w<CR>
nnoremap <leader>q :q<CR>
nnoremap <leader>x :wq<CR>

" 窗口切换
nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l

" ========================================
" 插件管理（vim-plug）
" ========================================
call plug#begin('~/.vim/plugged')

Plug 'tpope/vim-surround'
Plug 'scrooloose/nerdtree'
Plug 'vim-airline/vim-airline'

call plug#end()

" ========================================
" 文件类型特定设置
" ========================================
autocmd FileType python setlocal tabstop=4 shiftwidth=4 expandtab
autocmd FileType javascript setlocal tabstop=2 shiftwidth=2 expandtab
autocmd BufWritePre * %s/\s\+$//e
```

---

## 💡 配置建议

### 1. 循序渐进

- 先使用基础配置
- 根据实际需求逐步添加
- 不要一次性配置太多

### 2. 备份配置

```bash
# 备份现有配置
cp ~/.vimrc ~/.vimrc.backup

# 版本控制
cd ~
git init
git add .vimrc
git commit -m "Initial vimrc"
```

### 3. 测试配置

- 修改配置后重新加载：`:source ~/.vimrc`
- 或重启 Vim 测试
- 遇到问题可以恢复备份

### 4. 参考他人配置

- GitHub 搜索 "vimrc"
- 学习他人的配置思路
- 但不要盲目复制，理解后再使用

---

## 🔧 常见问题

### Q: 配置不生效？

**A**: 
1. 检查配置文件路径是否正确
2. 重新加载配置：`:source ~/.vimrc`
3. 检查是否有语法错误：`:messages`

### Q: 如何临时禁用某个设置？

**A**: 在命令模式下使用 `:set no选项`，如 `:set nonumber`

### Q: 如何查看当前设置？

**A**: 使用 `:set 选项?`，如 `:set number?`

### Q: 配置太多，启动慢？

**A**: 
1. 使用延迟加载插件
2. 禁用不必要的插件
3. 使用 Neovim（性能更好）

---

## 📚 相关资源

- [Vim 官方文档](https://www.vim.org/docs.php)
- [Vim 中文文档](https://vimcdoc.sourceforge.net/)
- [Awesome Vim](https://github.com/akrawchyk/awesome-vim) - Vim 资源集合

---

**相关文档**：
- [01-Vim-新手快速上手指南](./01-Vim-新手快速上手指南.md)
- [05-Vim-插件推荐](./05-Vim-插件推荐.md)
