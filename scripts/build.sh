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

# 使用相对路径创建符号链接（在 CI 环境中更可靠）
QUARTZ_TARGET="node_modules/quartz/quartz"

# 检查 quartz 是否存在且有效
if [ -e quartz ]; then
  # 检查是否是符号链接
  if [ -L quartz ]; then
    # 检查符号链接是否指向相对路径（而不是绝对路径）
    LINK_TARGET=$(readlink quartz)
    if [[ "$LINK_TARGET" == /* ]]; then
      # 指向绝对路径，需要删除并重新创建为相对路径
      echo "Warning: quartz symlink points to absolute path, recreating with relative path..."
      rm -f quartz
      ln -s "$QUARTZ_TARGET" quartz
      echo "Recreated quartz symlink with relative path"
    elif [ -d quartz ] && [ -f quartz/build.ts ]; then
      # 指向相对路径且有效
      echo "quartz symlink already exists and is valid"
    else
      # 指向相对路径但无效，重新创建
      echo "Warning: quartz symlink is broken, removing..."
      rm -f quartz
      ln -s "$QUARTZ_TARGET" quartz
      echo "Recreated quartz symlink"
    fi
  else
    # 存在但不是符号链接，删除并重新创建
    echo "Warning: quartz exists but is not a symlink, removing..."
    rm -rf quartz
    ln -s "$QUARTZ_TARGET" quartz
    echo "Created quartz symlink"
  fi
else
  # 不存在，创建符号链接（使用相对路径）
  ln -s "$QUARTZ_TARGET" quartz
  echo "Created quartz symlink"
fi

# 验证符号链接是否有效
if [ ! -f quartz/build.ts ]; then
  echo "Error: quartz symlink is invalid or build.ts not found"
  if [ -L quartz ]; then
    echo "Symlink target: $(readlink quartz)"
    echo "Resolved path: $(readlink -f quartz 2>/dev/null || echo 'unknown')"
  else
    echo "quartz is not a symlink"
  fi
  echo "Expected target: $QUARTZ_TARGET"
  echo "Checking if target exists:"
  ls -la "$QUARTZ_TARGET/build.ts" 2>&1 || echo "Target build.ts not found"
  echo "Current directory: $(pwd)"
  echo "Listing node_modules/quartz:"
  ls -la node_modules/quartz/ 2>&1 || echo "node_modules/quartz not found"
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

