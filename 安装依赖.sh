#!/bin/bash

# Quartz 项目初始化脚本

echo "📦 开始安装 Quartz 依赖..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

# 检查 Node 版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ 错误：需要 Node.js 18 或更高版本，当前版本：$(node -v)"
    exit 1
fi

echo "✅ Node.js 版本：$(node -v)"

# 安装依赖
echo "📥 正在安装依赖包..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 依赖安装完成！"
    echo ""
    echo "🚀 下一步："
    echo "   1. 运行 'npm run dev' 启动本地预览"
    echo "   2. 查看 '快速开始.md' 了解详细说明"
    echo "   3. 查看 '部署说明.md' 了解 GitHub Pages 部署"
else
    echo "❌ 依赖安装失败，请检查错误信息"
    exit 1
fi

