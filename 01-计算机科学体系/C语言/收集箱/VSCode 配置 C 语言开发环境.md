# ​**​VSCode 配置 C 语言开发环境（Windows/Linux/macOS）​**​

在 VSCode 中配置 C 语言开发环境需要安装 ​**​编译器​**​、​**​调试工具​**​ 和 ​**​必要的扩展​**​。以下是详细配置方案：

---

## ​**​1. 安装编译器​**​

### ​**​Windows​**​

推荐使用 ​**​MinGW-w64​**​（GCC for Windows）：

1. 下载 [MinGW-w64](https://sourceforge.net/projects/mingw-w64/)（选择 `x86_64-posix-seh` 版本）。
2. 安装时勾选 ​**​`gcc`、`g++`、`gdb`​**​。
3. 添加 MinGW 的 `bin` 目录到系统 `PATH`（如 `C:\mingw64\bin`）。

### ​**​Linux（Ubuntu/Debian）​**​

```
sudo apt update
sudo apt install build-essential gdb
```

### ​**​macOS​**​

```
brew install gcc
```

---

## ​**​2. 安装 VSCode 扩展​**​

安装以下扩展（Ctrl+Shift+X）：

- ​**​C/C++​**​（Microsoft 官方扩展，提供智能提示、调试支持）
- ​**​Code Runner​**​（快速运行代码）
- ​**​C/C++ Extension Pack​**​（可选，包含常用工具）

---

## ​**​3. 配置 VSCode​**​

### ​**​(1) 创建 C 项目​**​

新建文件夹，用 VSCode 打开，创建 `main.c`：

```
#include <stdio.h>

int main() {
    printf("Hello, C Language!\n");
    return 0;
}
```

### ​**​(2) 配置编译器路径​**​

按 `Ctrl+Shift+P`，输入 ​**​`C/C++: Edit Configurations (UI)`​**​，设置：

- ​**​Compiler path​**​: `gcc`（Windows 为 `C:\mingw64\bin\gcc.exe`）
- ​**​IntelliSense mode​**​: `gcc-x64`

### ​**​(3) 配置调试环境​**​

创建 `.vscode/launch.json`：

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "C Debug",
            "type": "cppdbg",
            "request": "launch",
            "program": "${fileDirname}/${fileBasenameNoExtension}.exe",
            "args": [],
            "stopAtEntry": false,
            "cwd": "${workspaceFolder}",
            "environment": [],
            "externalConsole": true,
            "MIMode": "gdb",
            "miDebuggerPath": "gdb",  // Windows: "C:\\mingw64\\bin\\gdb.exe"
            "setupCommands": [
                {
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                }
            ]
        }
    ]
}
```

### ​**​(4) 配置编译任务​**​

创建 `.vscode/tasks.json`：

```
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build C Program",
            "type": "shell",
            "command": "gcc",
            "args": [
                "-g",
                "${file}",
                "-o",
                "${fileDirname}/${fileBasenameNoExtension}.exe"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```

---

## ​**​4. 运行和调试​**​

### ​**​方法 1：使用 Code Runner（快速运行）​**​

1. 安装 ​**​Code Runner​**​ 扩展。
2. 按 `Ctrl+Alt+N` 或点击右上角 ▶️ 运行代码。

### ​**​方法 2：手动编译 + 调试​**​

1. ​**​编译​**​：按 `Ctrl+Shift+B`（调用 `tasks.json` 编译）。
2. ​**​调试​**​：按 `F5` 启动调试（调用 `launch.json`）。

---

## ​**​5. 常见问题​**​

### ​**​Q1: 报错 "gcc not found"​**​

- 检查 `PATH` 是否包含 `gcc` 路径（Windows：`C:\mingw64\bin`）。
- 重启 VSCode 或终端。

### ​**​Q2: 调试时无法输入​**​

在 `launch.json` 中设置：

```
"externalConsole": true
```

### ​**​Q3: 代码提示不工作​**​

在 `C/C++` 扩展设置中重置 IntelliSense：

1. 按 `Ctrl+Shift+P`，输入 ​**​`C/C++: Reset IntelliSense Database`​**​。

---

## ​**​6. 总结​**​

|步骤|操作|
|---|---|
|​**​1. 安装编译器​**​|Windows: MinGW-w64, Linux: `build-essential`, macOS: `gcc`|
|​**​2. 安装扩展​**​|C/C++、Code Runner|
|​**​3. 配置项目​**​|`launch.json`（调试）、`tasks.json`（编译）|
|​**​4. 运行调试​**​|`F5` 调试，`Ctrl+Alt+N` 快速运行|

现在你的 VSCode 已经配置好 C 语言开发环境，可以愉快地写代码了！🚀

​**​📌 提示：​**​ 如果需要更复杂的项目（如多文件编译），可以修改 `tasks.json` 添加更多编译选项。