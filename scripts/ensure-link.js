#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const symlinkPath = path.join(__dirname, '..', 'quartz')
const target = path.join(__dirname, '..', 'node_modules', 'quartz', 'quartz')

// 检查目标目录是否存在
if (!fs.existsSync(target)) {
  console.warn(`Target directory does not exist: ${target}`)
  console.warn('Skipping symlink creation. This is normal if dependencies are not installed yet.')
} else {
  // 检查符号链接是否存在
  if (!fs.existsSync(symlinkPath)) {
    // 符号链接不存在，创建它
    try {
      fs.symlinkSync(target, symlinkPath, 'dir')
      console.log('Created symlink: quartz -> node_modules/quartz/quartz')
    } catch (e) {
      console.warn('Ensure symlink failed:', e?.message)
      // 不退出，继续执行其他操作
    }
  } else {
    // 检查现有符号链接是否有效
    let isValid = false
    try {
      const linkStat = fs.lstatSync(symlinkPath)
      if (linkStat.isSymbolicLink()) {
        // 验证符号链接指向的目标是否存在
        try {
          const realPath = fs.realpathSync(symlinkPath)
          if (fs.existsSync(realPath) && fs.existsSync(path.join(realPath, 'build.ts'))) {
            isValid = true
            console.log('quartz symlink is valid')
          } else {
            console.warn('quartz symlink points to invalid location')
            // 删除并重新创建
            fs.unlinkSync(symlinkPath)
            fs.symlinkSync(target, symlinkPath, 'dir')
            console.log('Recreated symlink: quartz -> node_modules/quartz/quartz')
          }
        } catch (e) {
          // 符号链接损坏，删除并重新创建
          console.warn('quartz symlink is broken:', e?.message)
          fs.unlinkSync(symlinkPath)
          fs.symlinkSync(target, symlinkPath, 'dir')
          console.log('Recreated symlink: quartz -> node_modules/quartz/quartz')
        }
      } else {
        // 存在但不是符号链接，由 build.sh 处理
        console.warn('quartz exists but is not a symlink, will be handled by build.sh')
      }
    } catch (e) {
      // 检查失败，尝试删除并重新创建
      console.warn('Failed to check symlink:', e?.message)
      try {
        if (fs.existsSync(symlinkPath)) {
          fs.unlinkSync(symlinkPath)
        }
        fs.symlinkSync(target, symlinkPath, 'dir')
        console.log('Recreated symlink: quartz -> node_modules/quartz/quartz')
      } catch (e2) {
        console.warn('Failed to recreate symlink:', e2?.message)
      }
    }
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


