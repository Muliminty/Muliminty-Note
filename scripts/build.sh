#!/bin/bash
# Quartz 构建脚本，自动修复图片路径和 Markdown 链接

echo "Cleaning cache and output..."
rm -rf .quartz-cache public

echo "Ensuring quartz symlink exists..."
[ -d quartz ] || ln -s node_modules/quartz/quartz quartz

echo "Ensuring config shim exists..."
node scripts/ensure-link.js

echo "Building Quartz site..."
export NODE_OPTIONS=--preserve-symlinks
npx quartz build -d .

if [ $? -eq 0 ]; then
  echo "Build successful. Fixing image paths..."
  node scripts/fix-image-paths.js
  echo "Done!"
else
  echo "Build failed!"
  exit 1
fi

