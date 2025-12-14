# Neovim 实战教程：开发 React + Node.js 项目

> 通过实际项目学习 Neovim，从零开始搭建前后端分离项目

## 📋 项目概述

### 项目目标

开发一个**待办事项（Todo）应用**，包含：
- **前端**：React + TypeScript + Vite
- **后端**：Node.js + Express + TypeScript
- **数据库**：SQLite（简单易用）

### 学习目标

通过这个项目，你将学会：
1. 配置 Neovim 用于现代 Web 开发
2. 使用 Neovim 进行 React 组件开发
3. 使用 Neovim 进行 Node.js API 开发
4. 掌握 Neovim 在实际开发中的高效技巧
5. 多文件编辑、代码导航、调试等高级功能

---

## 🛠️ 第一部分：环境准备

### 1.1 安装 Neovim

**macOS:**
```bash
brew install neovim
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install neovim
```

**验证安装:**
```bash
nvim --version
```

### 1.2 安装必要工具

```bash
# Node.js (使用 nvm 管理)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# 验证
node --version
npm --version
```

### 1.3 安装 Neovim 插件管理器

我们使用 **lazy.nvim**（现代、快速）：

```bash
git clone https://github.com/folke/lazy.nvim.git \
  ~/.local/share/nvim/lazy/lazy.nvim
```

---

## ⚙️ 第二部分：Neovim 配置

### 2.1 创建配置目录

```bash
mkdir -p ~/.config/nvim
cd ~/.config/nvim
```

### 2.2 基础配置文件

创建 `~/.config/nvim/init.lua`：

```lua
-- 设置 Leader 键为空格
vim.g.mapleader = " "
vim.g.maplocalleader = " "

-- 基础设置
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.cursorline = true
vim.opt.showcmd = true
vim.opt.incsearch = true
vim.opt.hlsearch = true
vim.opt.ignorecase = true
vim.opt.smartcase = true

-- 编辑设置
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.expandtab = true
vim.opt.autoindent = true
vim.opt.smartindent = true

-- 文件设置
vim.opt.encoding = "utf-8"
vim.opt.fileencoding = "utf-8"

-- 其他
vim.opt.backup = false
vim.opt.writebackup = false
vim.opt.swapfile = false
vim.opt.undofile = true

-- 快捷键
vim.keymap.set("n", "<leader><space>", ":nohlsearch<CR>")
vim.keymap.set("n", "<leader>w", ":w<CR>")
vim.keymap.set("n", "<leader>q", ":q<CR>")

-- 窗口切换
vim.keymap.set("n", "<C-h>", "<C-w>h")
vim.keymap.set("n", "<C-j>", "<C-w>j")
vim.keymap.set("n", "<C-k>", "<C-w>k")
vim.keymap.set("n", "<C-l>", "<C-w>l")
```

### 2.3 插件配置

创建 `~/.config/nvim/lua/plugins.lua`：

```lua
return {
  -- 插件管理器
  {
    "folke/lazy.nvim",
    -- lazy.nvim 会自动加载
  },

  -- 文件树
  {
    "nvim-tree/nvim-tree.lua",
    version = "*",
    dependencies = {
      "nvim-tree/nvim-web-devicons",
    },
    config = function()
      require("nvim-tree").setup({
        view = {
          width = 30,
        },
      })
      vim.keymap.set("n", "<leader>e", ":NvimTreeToggle<CR>")
    end,
  },

  -- 模糊搜索
  {
    "nvim-telescope/telescope.nvim",
    tag = "0.1.5",
    dependencies = { "nvim-lua/plenary.nvim" },
    config = function()
      local builtin = require("telescope.builtin")
      vim.keymap.set("n", "<leader>ff", builtin.find_files, {})
      vim.keymap.set("n", "<leader>fg", builtin.live_grep, {})
      vim.keymap.set("n", "<leader>fb", builtin.buffers, {})
    end,
  },

  -- LSP 配置
  {
    "neovim/nvim-lspconfig",
    dependencies = {
      "williamboman/mason.nvim",
      "williamboman/mason-lspconfig.nvim",
    },
    config = function()
      require("mason").setup()
      require("mason-lspconfig").setup({
        ensure_installed = {
          "tsserver",      -- TypeScript/JavaScript
          "eslint",        -- ESLint
          "jsonls",        -- JSON
        },
      })

      local lspconfig = require("lspconfig")
      local on_attach = function(client, bufnr)
        local opts = { noremap = true, silent = true, buffer = bufnr }
        vim.keymap.set("n", "gD", vim.lsp.buf.declaration, opts)
        vim.keymap.set("n", "gd", vim.lsp.buf.definition, opts)
        vim.keymap.set("n", "K", vim.lsp.buf.hover, opts)
        vim.keymap.set("n", "gi", vim.lsp.buf.implementation, opts)
        vim.keymap.set("n", "<C-k>", vim.lsp.buf.signature_help, opts)
        vim.keymap.set("n", "<leader>rn", vim.lsp.buf.rename, opts)
        vim.keymap.set("n", "<leader>ca", vim.lsp.buf.code_action, opts)
        vim.keymap.set("n", "gr", vim.lsp.buf.references, opts)
      end

      lspconfig.tsserver.setup({ on_attach = on_attach })
      lspconfig.eslint.setup({ on_attach = on_attach })
      lspconfig.jsonls.setup({ on_attach = on_attach })
    end,
  },

  -- 自动补全
  {
    "hrsh7th/nvim-cmp",
    dependencies = {
      "hrsh7th/cmp-nvim-lsp",
      "hrsh7th/cmp-buffer",
      "hrsh7th/cmp-path",
      "L3MON4D3/LuaSnip",
      "saadparwaiz1/cmp_luasnip",
    },
    config = function()
      local cmp = require("cmp")
      cmp.setup({
        snippet = {
          expand = function(args)
            require("luasnip").lsp_expand(args.body)
          end,
        },
        mapping = cmp.mapping.preset.insert({
          ["<C-b>"] = cmp.mapping.scroll_docs(-4),
          ["<C-f>"] = cmp.mapping.scroll_docs(4),
          ["<C-Space>"] = cmp.mapping.complete(),
          ["<C-e>"] = cmp.mapping.abort(),
          ["<CR>"] = cmp.mapping.confirm({ select = true }),
        }),
        sources = cmp.config.sources({
          { name = "nvim_lsp" },
          { name = "luasnip" },
        }, {
          { name = "buffer" },
          { name = "path" },
        }),
      })
    end,
  },

  -- 语法高亮
  {
    "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",
    config = function()
      require("nvim-treesitter.configs").setup({
        ensure_installed = {
          "javascript",
          "typescript",
          "tsx",
          "json",
          "lua",
        },
        highlight = {
          enable = true,
        },
      })
    end,
  },

  -- 状态栏
  {
    "nvim-lualine/lualine.nvim",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    config = function()
      require("lualine").setup()
    end,
  },

  -- Git 集成
  {
    "lewis6991/gitsigns.nvim",
    config = function()
      require("gitsigns").setup()
    end,
  },

  -- 注释
  {
    "numToStr/Comment.nvim",
    config = function()
      require("Comment").setup()
    end,
  },

  -- 自动配对
  {
    "windwp/nvim-autopairs",
    config = function()
      require("nvim-autopairs").setup({})
    end,
  },

  -- 颜色方案
  {
    "catppuccin/nvim",
    name = "catppuccin",
    priority = 1000,
    config = function()
      vim.cmd.colorscheme("catppuccin-mocha")
    end,
  },
}
```

### 2.4 加载插件配置

在 `init.lua` 末尾添加：

```lua
-- 加载插件
require("lazy").setup("plugins")
```

### 2.5 安装插件

启动 Neovim：
```bash
nvim
```

Neovim 会自动安装插件（首次启动可能需要几分钟）。

---

## 🚀 第三部分：项目搭建

### 3.1 创建项目目录

```bash
mkdir -p ~/projects/todo-app
cd ~/projects/todo-app
```

### 3.2 创建项目结构

```bash
mkdir -p frontend backend
```

### 3.3 初始化前端项目

```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
```

### 3.4 初始化后端项目

```bash
cd ../backend
npm init -y
npm install express cors dotenv
npm install -D typescript @types/node @types/express @types/cors ts-node nodemon
npm install better-sqlite3
npm install -D @types/better-sqlite3
```

### 3.5 配置后端 TypeScript

创建 `backend/tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 3.6 配置后端脚本

在 `backend/package.json` 中添加：

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

## 💻 第四部分：后端开发实战

### 4.1 创建后端目录结构

在 Neovim 中创建：

```bash
cd backend
nvim
```

**Neovim 操作**：
1. 按 `<leader>e` 打开文件树（nvim-tree）
2. 在文件树中按 `a` 创建新文件/目录
3. 创建以下结构：
   ```
   backend/
   ├── src/
   │   ├── index.ts
   │   ├── routes/
   │   │   └── todos.ts
   │   ├── db/
   │   │   └── database.ts
   │   └── types/
   │       └── todo.ts
   └── package.json
   ```

### 4.2 创建数据库模块

打开 `src/db/database.ts`：

```typescript
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/todos.db');
const db = new Database(dbPath);

// 创建表
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
```

**Neovim 技巧**：
- 使用 `gd` 跳转到类型定义
- 使用 `K` 查看函数文档
- 使用 `%` 在匹配的括号间跳转

### 4.3 创建类型定义

打开 `src/types/todo.ts`：

```typescript
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
}

export interface CreateTodoDto {
  text: string;
}

export interface UpdateTodoDto {
  text?: string;
  completed?: boolean;
}
```

**Neovim 技巧**：
- 使用 `ci"` 快速修改字符串
- 使用 `diw` 删除单词
- 使用 `>>` 和 `<<` 调整缩进

### 4.4 创建路由

打开 `src/routes/todos.ts`：

```typescript
import { Router } from 'express';
import db from '../db/database';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../types/todo';

const router = Router();

// 获取所有 todos
router.get('/', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
  res.json(todos);
});

// 创建 todo
router.post('/', (req, res) => {
  const { text }: CreateTodoDto = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const result = db
    .prepare('INSERT INTO todos (text) VALUES (?)')
    .run(text);

  const todo = db
    .prepare('SELECT * FROM todos WHERE id = ?')
    .get(result.lastInsertRowid);

  res.status(201).json(todo);
});

// 更新 todo
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed }: UpdateTodoDto = req.body;

  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const updates: string[] = [];
  const values: any[] = [];

  if (text !== undefined) {
    updates.push('text = ?');
    values.push(text);
  }
  if (completed !== undefined) {
    updates.push('completed = ?');
    values.push(completed ? 1 : 0);
  }

  if (updates.length === 0) {
    return res.json(todo);
  }

  values.push(id);
  db.prepare(`UPDATE todos SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  res.json(updated);
});

// 删除 todo
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  res.status(204).send();
});

export default router;
```

**Neovim 技巧**：
- 使用 `:%s/old/new/g` 批量替换
- 使用 `V` 选择整行，`>` 缩进
- 使用 `gcc` 注释/取消注释行

### 4.5 创建主文件

打开 `src/index.ts`：

```typescript
import express from 'express';
import cors from 'cors';
import todosRouter from './routes/todos';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/todos', todosRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**Neovim 技巧**：
- 使用 `<leader>ff` 快速搜索文件
- 使用 `<leader>fg` 全局搜索文本
- 使用 `:sp` 和 `:vsp` 分割窗口查看多个文件

### 4.6 创建数据目录

```bash
mkdir -p backend/data
```

### 4.7 测试后端

在终端中：
```bash
cd backend
npm run dev
```

在另一个终端测试：
```bash
curl http://localhost:3001/api/todos
```

---

## 🎨 第五部分：前端开发实战

### 5.1 配置前端 API

打开 `frontend/src/api/todos.ts`（需要创建）：

```typescript
const API_URL = 'http://localhost:3001/api/todos';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
}

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createTodo = async (text: string): Promise<Todo> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return response.json();
};

export const updateTodo = async (
  id: number,
  updates: Partial<Todo>
): Promise<Todo> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return response.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
};
```

**Neovim 技巧**：
- 使用 `yy` 复制行，`p` 粘贴
- 使用 `dd` 删除行
- 使用 `u` 撤销，`Ctrl+r` 重做

### 5.2 创建 Todo 组件

打开 `frontend/src/components/TodoItem.tsx`：

```typescript
import { Todo } from '../api/todos';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className={todo.completed ? 'completed' : ''}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>删除</button>
    </div>
  );
};
```

**Neovim 技巧**：
- 使用 `ci"` 修改 JSX 属性值
- 使用 `cit` 修改标签内容
- 使用 `>` 和 `<` 调整缩进

### 5.3 创建主应用组件

修改 `frontend/src/App.tsx`：

```typescript
import { useState, useEffect } from 'react';
import { Todo, getTodos, createTodo, updateTodo, deleteTodo } from './api/todos';
import { TodoItem } from './components/TodoItem';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    const data = await getTodos();
    setTodos(data);
  };

  const handleAdd = async () => {
    if (!input.trim()) return;
    await createTodo(input);
    setInput('');
    loadTodos();
  };

  const handleToggle = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      await updateTodo(id, { completed: !todo.completed });
      loadTodos();
    }
  };

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    loadTodos();
  };

  return (
    <div className="App">
      <h1>待办事项</h1>
      <div className="todo-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="添加新任务..."
        />
        <button onClick={handleAdd}>添加</button>
      </div>
      <div className="todo-list">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
```

**Neovim 技巧**：
- 使用 `gd` 跳转到函数定义
- 使用 `*` 搜索当前单词
- 使用 `:%s/old/new/gc` 交互式替换

### 5.4 添加样式

修改 `frontend/src/App.css`：

```css
.App {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.todo-input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-input input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
}

.todo-input button {
  padding: 10px 20px;
  font-size: 16px;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.todo-item .completed {
  text-decoration: line-through;
  color: #999;
}

.todo-item button {
  margin-left: auto;
  padding: 5px 10px;
}
```

**Neovim 技巧**：
- 使用 `V` 选择多行，`>` 缩进
- 使用 `ci{` 修改 CSS 属性值
- 使用 `:%s/;/;\r/g` 格式化（每行一个属性）

---

## 🎯 第六部分：Neovim 实战技巧

### 6.1 多文件编辑

**场景**：同时查看前后端代码

```vim
" 打开多个文件
:sp frontend/src/App.tsx
:vsp backend/src/index.ts

" 切换窗口
Ctrl+w h/j/k/l

" 关闭窗口
Ctrl+w q
```

### 6.2 代码导航

```vim
" 跳转到定义
gd              " 跳转到局部定义
gD              " 跳转到全局定义

" 跳转到引用
gr              " 查找所有引用

" 返回
Ctrl+o          " 跳转历史返回
Ctrl+i          " 跳转历史前进
```

### 6.3 快速搜索

```vim
" 搜索文件
<leader>ff      " 模糊搜索文件

" 搜索内容
<leader>fg      " 全局搜索文本

" 搜索缓冲区
<leader>fb      " 搜索已打开的文件
```

### 6.4 代码重构

```vim
" 重命名变量
<leader>rn      " LSP 重命名

" 提取函数（需要配置）
<leader>ca      " 代码操作
```

### 6.5 批量编辑

**场景**：修改多个组件的导入路径

```vim
" 使用宏录制
qa              " 开始录制
/import         " 搜索 import
n               " 下一个
ci"             " 修改路径
输入新路径
Esc
q               " 停止录制
@a              " 执行宏
10@a            " 执行 10 次
```

### 6.6 Git 操作

```vim
" 查看 Git 状态
:Gstatus

" 查看差异
:Gdiff

" 提交
:Gcommit

" 查看 Blame
:Gblame
```

### 6.7 终端集成

```vim
" 打开终端
:term

" 退出终端模式
Ctrl+\ Ctrl+n

" 在终端中运行命令
:!npm run dev
```

---

## 🚀 第七部分：运行项目

### 7.1 启动后端

```bash
cd backend
npm run dev
```

### 7.2 启动前端

```bash
cd frontend
npm run dev
```

### 7.3 访问应用

打开浏览器访问：`http://localhost:5173`

---

## 📚 第八部分：进阶练习

### 练习 1：添加编辑功能

1. 在后端添加 PUT 路由（已完成）
2. 在前端添加编辑按钮
3. 实现内联编辑功能

**Neovim 技巧**：
- 使用 `:%s/old/new/g` 批量替换
- 使用 `V` 选择多行进行编辑

### 练习 2：添加过滤功能

1. 添加"全部"、"进行中"、"已完成"过滤
2. 使用 React 状态管理

**Neovim 技巧**：
- 使用 `*` 搜索当前单词
- 使用 `n` 和 `N` 在搜索结果间跳转

### 练习 3：添加分类功能

1. 在数据库中添加 category 字段
2. 创建分类管理界面
3. 实现分类筛选

**Neovim 技巧**：
- 使用 `gd` 跳转到类型定义
- 使用 `gr` 查找所有引用

---

## 💡 Neovim 开发工作流

### 日常开发流程

1. **打开项目**
   ```bash
   cd ~/projects/todo-app
   nvim
   ```

2. **导航文件**
   - `<leader>e` 打开文件树
   - `<leader>ff` 快速搜索文件
   - `Ctrl+p` 在已打开文件间切换

3. **编辑代码**
   - `i` 进入插入模式
   - `Esc` 返回普通模式
   - `u` 撤销，`Ctrl+r` 重做

4. **代码导航**
   - `gd` 跳转到定义
   - `K` 查看文档
   - `gr` 查找引用

5. **保存和测试**
   - `<leader>w` 保存
   - `:term` 打开终端运行测试

### 推荐快捷键总结

| 快捷键 | 功能 |
|--------|------|
| `<leader>e` | 打开/关闭文件树 |
| `<leader>ff` | 搜索文件 |
| `<leader>fg` | 全局搜索 |
| `gd` | 跳转到定义 |
| `K` | 查看文档 |
| `gr` | 查找引用 |
| `<leader>rn` | 重命名 |
| `gcc` | 注释/取消注释 |
| `Ctrl+h/j/k/l` | 切换窗口 |

---

## 🎓 学习总结

通过这个实战项目，你学会了：

1. ✅ 配置 Neovim 用于现代 Web 开发
2. ✅ 使用 LSP 进行代码补全和导航
3. ✅ 多文件编辑和窗口管理
4. ✅ 代码搜索和重构
5. ✅ Git 集成
6. ✅ 实际项目开发流程

### 下一步

1. 探索更多 Neovim 插件
2. 自定义配置以适应你的工作流
3. 学习更多高级技巧（宏、寄存器等）
4. 在实际项目中应用这些技能

---

## 📖 相关资源

- [Neovim 官方文档](https://neovim.io/doc/)
- [Lazy.nvim 文档](https://github.com/folke/lazy.nvim)
- [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig)
- [React 官方文档](https://react.dev/)
- [Express 官方文档](https://expressjs.com/)

---

**相关文档**：
- [01-Vim-新手快速上手指南](./01-Vim-新手快速上手指南.md)
- [04-Vim-配置最佳实践](./04-Vim-配置最佳实践.md)
- [06-Vim-高级技巧](./06-Vim-高级技巧.md)
