#!/bin/bash
# Quartz 开发服务器脚本，自动修复图片路径

# 先构建一次并修复路径
echo "Initial build..."
npx quartz build -d .
node fix-image-paths.js

# 启动开发服务器（带监听模式）
echo "Starting development server with watch mode..."
npx quartz build --serve --port 4399 -d . --watch &
QUARTZ_PID=$!

# 监听 public 目录变化，自动修复图片路径
echo "Watching for changes and auto-fixing image paths..."
fswatch -o public -m poll_monitor | while read f; do
  echo "Detected changes, fixing image paths..."
  node fix-image-paths.js
done &
FSWATCH_PID=$!

# 等待进程退出
wait $QUARTZ_PID
kill $FSWATCH_PID 2>/dev/null

