#!/bin/bash
# Quartz 构建脚本，自动修复图片路径和 Markdown 链接

echo "Cleaning cache and output..."
rm -rf .quartz-cache public

echo "Ensuring quartz symlink exists..."
if [ ! -d node_modules/quartz/quartz ]; then
  echo "Error: node_modules/quartz/quartz does not exist"
  echo "Please run 'npm install' first"
  exit 1
fi

# 检查 quartz 是否存在
if [ -e quartz ]; then
  # 检查是否是符号链接
  if [ -L quartz ]; then
    # 检查符号链接是否有效
    if [ -d quartz ] && [ -f quartz/build.ts ]; then
      echo "quartz symlink already exists and is valid"
    else
      echo "Warning: quartz symlink is broken, removing..."
      rm -f quartz
      ln -s node_modules/quartz/quartz quartz
      echo "Recreated quartz symlink"
    fi
  else
    # 存在但不是符号链接，删除并重新创建
    echo "Warning: quartz exists but is not a symlink, removing..."
    rm -rf quartz
    ln -s node_modules/quartz/quartz quartz
    echo "Created quartz symlink"
  fi
else
  # 不存在，创建符号链接
  ln -s node_modules/quartz/quartz quartz
  echo "Created quartz symlink"
fi

# 验证符号链接是否有效
if [ ! -f quartz/build.ts ]; then
  echo "Error: quartz symlink is invalid or build.ts not found"
  echo "Symlink target: $(readlink -f quartz 2>/dev/null || echo 'unknown')"
  exit 1
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

