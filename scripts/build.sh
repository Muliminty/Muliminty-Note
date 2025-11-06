#!/bin/bash
# Quartz 构建脚本，自动修复图片路径和 Markdown 链接

echo "Cleaning cache and output..."
rm -rf .quartz-cache public

echo "Ensuring quartz symlink exists..."
if [ ! -e quartz ]; then
  # 符号链接不存在，创建它
  if [ -d node_modules/quartz/quartz ]; then
    ln -s node_modules/quartz/quartz quartz
    echo "Created quartz symlink"
  else
    echo "Warning: node_modules/quartz/quartz does not exist"
  fi
elif [ ! -L quartz ]; then
  # quartz 存在但不是符号链接，删除并重新创建
  echo "Warning: quartz exists but is not a symlink, removing..."
  rm -rf quartz
  if [ -d node_modules/quartz/quartz ]; then
    ln -s node_modules/quartz/quartz quartz
    echo "Created quartz symlink"
  fi
elif [ ! -d quartz ]; then
  # 符号链接存在但指向无效，删除并重新创建
  echo "Warning: quartz symlink is broken, removing..."
  rm quartz
  if [ -d node_modules/quartz/quartz ]; then
    ln -s node_modules/quartz/quartz quartz
    echo "Created quartz symlink"
  fi
else
  echo "quartz symlink already exists and is valid"
fi

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

