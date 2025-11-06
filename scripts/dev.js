#!/usr/bin/env node
/**
 * Quartz 开发服务器脚本，自动修复图片路径
 * 在每次构建后自动修复图片路径
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 保证 quartz 符号链接存在，并清理构建缓存
function prepareQuartz() {
  const symlinkPath = path.join(__dirname, '..', 'quartz')
  const target = path.join(__dirname, '..', 'node_modules', 'quartz', 'quartz')
  try {
    if (!fs.existsSync(symlinkPath)) {
      if (fs.existsSync(target)) {
        fs.symlinkSync(target, symlinkPath, 'dir')
        console.log('Created symlink: quartz -> node_modules/quartz/quartz')
      }
    }
  } catch (e) {
    console.warn('Ensure symlink failed:', e?.message)
  }

  // 清理缓存
  const cacheDir = path.join(__dirname, '..', '.quartz-cache')
  const publicDir = path.join(__dirname, '..', 'public')
  try { fs.rmSync(cacheDir, { recursive: true, force: true }) } catch {}
  try { fs.rmSync(publicDir, { recursive: true, force: true }) } catch {}
}

// 修复图片路径的函数（从 fix-image-paths.js 复制）
function fixImagePaths(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixedCount += fixImagePaths(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // 修复图片路径
      content = content.replace(/src="(\.\.\/)+img\//g, 'src="img/');
      content = content.replace(/src="\.\.\/\.\.\/img\//g, 'src="img/');
      content = content.replace(/src="\.\.\/\.\.\/\.\.\/img\//g, 'src="img/');
      content = content.replace(/src="\.\.\/\.\.\/\.\.\/\.\.\/img\//g, 'src="img/');
      content = content.replace(/src="\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/img\//g, 'src="img/');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

// 监听 public 目录的变化
function watchPublicDir() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  if (!fs.existsSync(publicDir)) {
    console.log('Waiting for public directory to be created...');
    return;
  }
  
  console.log('Watching public directory for changes...');
  
  // 使用简单的轮询方式监听文件变化
  let lastCheck = Date.now();
  const checkInterval = 2000; // 每2秒检查一次
  
  setInterval(() => {
    try {
      const stats = fs.statSync(publicDir);
      if (stats.mtimeMs > lastCheck) {
        lastCheck = Date.now();
        const fixedCount = fixImagePaths(publicDir);
        if (fixedCount > 0) {
          console.log(`Fixed ${fixedCount} HTML file(s) with image paths`);
        }
      }
    } catch (err) {
      // 忽略错误
    }
  }, checkInterval);
  
  // 初始修复
  fixImagePaths(publicDir);
}

// 启动 Quartz 开发服务器
prepareQuartz()
console.log('Starting Quartz development server...');
const quartz = spawn('npx', ['quartz', 'build', '--serve', '--port', '4399', '-d', '.'], {
  stdio: 'inherit',
  shell: true
});

// 延迟启动文件监听，等待首次构建完成
setTimeout(() => {
  watchPublicDir();
}, 5000);

// 处理退出
quartz.on('exit', (code) => {
  process.exit(code);
});

process.on('SIGINT', () => {
  quartz.kill('SIGINT');
  process.exit(0);
});

