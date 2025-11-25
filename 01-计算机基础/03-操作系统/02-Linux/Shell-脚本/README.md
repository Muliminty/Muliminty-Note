# Shell（Shell Scripting）

> 快速掌握命令行与自动化脚本的学习路径与技能体系  
> **学习路径**：  
> - 🐚 **基础**：Shell 语法与环境配置  
> - 🛠️ **进阶**：脚本编写与工具链使用  
> - ⚡ **高级**：自动化与 CLI 工具开发  

---

## 📚 知识体系

### 1. Shell 基础语法

**目标**：掌握基础命令与语法结构

#### 变量与数组
- 变量定义：`name="value"`  
- 数组操作：`arr=(a b c)` / `echo ${arr[1]}`  
- 环境变量：`export PATH="$PATH:/new/path"`  

#### 控制流
- 条件判断：`if [ $a -eq 1 ]; then ... fi`  
- 循环结构：`for i in {1..5}; do ... done`  
- 分支选择：`case $var in ... esac`  

---

### 2. 脚本编程

**目标**：编写可维护的 Shell 脚本

#### 函数封装

```bash
function greet() {
  echo "Hello, $1!"
}
```

#### 脚本调试
- 调试模式：`bash -x script.sh`  
- 错误捕获：`set -euo pipefail`  

#### 正则表达式
- 基础匹配：`grep -E "pattern" file`  
- 提取文本：`sed -E 's/.*(group).*/\1/'`  

---

### 3. Zsh 环境配置

**目标**：定制高效开发环境

#### `.zshrc` 详解
- 别名定义：`alias ll='ls -la'`  
- 插件管理：`plugins=(git zsh-autosuggestions)`  
- 主题配置：`ZSH_THEME="agnoster"`  

#### 性能优化
- 延迟加载：`zinit light zsh-users/zsh-syntax-highlighting`  
- 路径缓存：`zstyle ':completion:*' use-cache on`  

---

## 🎯 学习路径

### 阶段一：基础语法
1. 变量与数组操作  
2. 条件判断与循环  
3. 函数定义与调用  

### 阶段二：脚本实战
1. 正则表达式处理文本  
2. 脚本调试与错误处理  
3. 自动化任务封装  

### 阶段三：环境定制
1. `.zshrc` 配置优化  
2. 插件与主题管理  
3. 跨环境配置同步  

---

## 📖 专题索引

### 效率优化
- [Zsh 别名最佳实践](./Shell-Alias最佳实践.md)  
- [正则表达式速查](./正则表达式速查.md)  

### 调试专题
- [Shell 脚本调试技巧](./Shell-调试技巧.md)  

---

## 🔗 相关链接

### 前置知识
- [Linux 基础命令](../01-计算机基础/Shell配置/Linux-基础命令.md)  

### 进阶学习
- [CLI 工具开发](../03-服务端/CLI工具开发/!MOC-CLI工具.md)  

---

## 📌 使用说明

### 文件命名规范
- 技术文档：`技术名-功能描述.md`（如 `Zsh-插件管理.md`）  
- 速查表：`主题-速查.md`（如 `正则表达式-速查.md`）  

### 目录结构

01-计算机基础/
└── Shell配置/
    ├── !MOC-Shell.md
    ├── 01-基础语法/
    │   ├── Shell-变量与数组.md
    │   └── Shell-控制流.md
    └── 02-脚本编程/
        ├── Shell-函数封装.md
        └── Shell-调试技巧.md


---

#shell #zsh #命令行 #脚本编程 #前端工程化
