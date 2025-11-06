#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const symlinkPath = path.join(__dirname, '..', 'quartz')
const target = path.join(__dirname, '..', 'node_modules', 'quartz', 'quartz')

if (!fs.existsSync(symlinkPath)) {
  // 符号链接不存在，创建它
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
  let isValid = false
  try {
    const stat = fs.statSync(symlinkPath)
    if (stat.isDirectory()) {
      // 检查是否是符号链接
      const linkStat = fs.lstatSync(symlinkPath)
      if (linkStat.isSymbolicLink()) {
        // 验证符号链接指向的目标是否存在
        const realPath = fs.realpathSync(symlinkPath)
        if (fs.existsSync(realPath)) {
          isValid = true
        }
      } else if (fs.existsSync(target)) {
        // 如果是目录但不是符号链接，可能需要删除并重新创建
        console.warn('quartz exists but is not a symlink, will be handled by build.sh')
      }
    }
  } catch (e) {
    // 符号链接损坏，尝试删除并重新创建
    console.warn('Existing quartz symlink is broken:', e?.message)
    try {
      fs.unlinkSync(symlinkPath)
      console.log('Removed broken symlink')
      if (fs.existsSync(target)) {
        fs.symlinkSync(target, symlinkPath, 'dir')
        console.log('Recreated symlink: quartz -> node_modules/quartz/quartz')
        isValid = true
      }
    } catch (e2) {
      console.warn('Failed to recreate symlink:', e2?.message)
    }
  }
  
  if (isValid) {
    console.log('quartz symlink is valid')
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


