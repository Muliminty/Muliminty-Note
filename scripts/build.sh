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

# 强制删除旧的 quartz（无论是符号链接还是目录）
if [ -e quartz ]; then
  if [ -L quartz ]; then
    LINK_TARGET=$(readlink quartz)
    echo "Found existing symlink pointing to: $LINK_TARGET"
    if [[ "$LINK_TARGET" == /* ]]; then
      echo "Warning: quartz symlink points to absolute path, will recreate with relative path"
    elif [ -d quartz ] && [ -f quartz/build.ts ]; then
      echo "quartz symlink already exists and is valid"
      # 符号链接有效，不需要重新创建
      QUARTZ_VALID=true
    else
      echo "Warning: quartz symlink is broken, will recreate"
    fi
  else
    echo "Warning: quartz exists but is not a symlink, will recreate"
  fi
  
  # 如果需要重新创建，先删除旧的
  if [ "${QUARTZ_VALID:-false}" != "true" ]; then
    echo "Removing old quartz..."
    rm -rf quartz
    # 确保删除成功
    if [ -e quartz ]; then
      echo "Error: Failed to remove quartz"
      exit 1
    fi
    echo "Creating new symlink..."
    ln -s "$QUARTZ_TARGET" quartz
    echo "Created quartz symlink"
  fi
else
  # 不存在，创建符号链接（使用相对路径）
  echo "Creating quartz symlink..."
  ln -s "$QUARTZ_TARGET" quartz
  echo "Created quartz symlink"
fi

# 验证符号链接是否有效
echo "Verifying quartz symlink..."
if [ ! -L quartz ]; then
  echo "Error: quartz is not a symlink"
  exit 1
fi

LINK_TARGET=$(readlink quartz)
echo "Symlink target: $LINK_TARGET"

if [ ! -f quartz/build.ts ]; then
  echo "Error: quartz symlink is invalid or build.ts not found"
  echo "Symlink target: $LINK_TARGET"
  echo "Expected target: $QUARTZ_TARGET"
  echo "Current directory: $(pwd)"
  echo "Checking if target exists:"
  if [ -f "$QUARTZ_TARGET/build.ts" ]; then
    echo "✓ Target build.ts exists at: $QUARTZ_TARGET/build.ts"
    echo "But symlink cannot access it. This might be a path resolution issue."
    echo "Trying to resolve symlink:"
    if command -v realpath >/dev/null 2>&1; then
      RESOLVED=$(realpath quartz 2>&1 || echo 'failed')
    else
      RESOLVED=$(readlink -f quartz 2>&1 || echo 'failed')
    fi
    echo "Resolved path: $RESOLVED"
  else
    echo "✗ Target build.ts not found at: $QUARTZ_TARGET/build.ts"
    ls -la "$QUARTZ_TARGET" 2>&1 || echo "Target directory does not exist"
  fi
  exit 1
fi

echo "✓ quartz symlink is valid and build.ts exists"

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

