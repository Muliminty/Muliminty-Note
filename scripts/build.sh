#!/bin/bash
# Quartz 构建脚本，自动修复图片路径和 Markdown 链接

echo "Building Quartz site..."
npx quartz build -d .

if [ $? -eq 0 ]; then
  echo "Build successful. Fixing image paths..."
  node scripts/fix-image-paths.js
  echo "Done!"
else
  echo "Build failed!"
  exit 1
fi

