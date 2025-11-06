#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const symlinkPath = path.join(__dirname, '..', 'quartz')
const target = path.join(__dirname, '..', 'node_modules', 'quartz', 'quartz')

if (!fs.existsSync(symlinkPath)) {
  if (fs.existsSync(target)) {
    try {
      fs.symlinkSync(target, symlinkPath, 'dir')
      console.log('Created symlink: quartz -> node_modules/quartz/quartz')
    } catch (e) {
      console.warn('Ensure symlink failed:', e?.message)
      // 不退出，继续执行其他操作
    }
  } else {
    console.warn(`Target directory does not exist: ${target}`)
    console.warn('Skipping symlink creation. This is normal if dependencies are not installed yet.')
  }
} else {
  // 检查现有符号链接是否有效
  try {
    const stat = fs.statSync(symlinkPath)
    if (!stat.isDirectory()) {
      console.warn('quartz exists but is not a directory, skipping')
    }
  } catch (e) {
    console.warn('Existing quartz symlink is broken:', e?.message)
    // 可以尝试删除并重新创建，但为了安全起见，这里只警告
  }
}

// Ensure node_modules/quartz/quartz.config.ts re-exports the project's root config
try {
  const injected = path.join(__dirname, '..', 'node_modules', 'quartz', 'quartz.config.ts')
  const targetDir = path.join(__dirname, '..', 'node_modules', 'quartz')
  if (fs.existsSync(targetDir)) {
    const content = 'export { default } from "../../quartz.config"\n'
    fs.writeFileSync(injected, content, 'utf8')
    console.log('Injected config shim:', injected)
  }
} catch (e) {
  console.warn('Inject config failed:', e?.message)
}


process.exit(0)


