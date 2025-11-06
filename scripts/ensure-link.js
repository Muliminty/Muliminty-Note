#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

// 使用相对路径（在 CI 环境中更可靠）
const projectRoot = path.resolve(__dirname, '..')
const symlinkPath = path.join(projectRoot, 'quartz')
const target = path.join(projectRoot, 'node_modules', 'quartz', 'quartz')
// 计算相对路径（相对于符号链接所在目录）
const relativeTarget = path.relative(path.dirname(symlinkPath), target)

// 检查目标目录是否存在
if (!fs.existsSync(target)) {
  console.warn(`Target directory does not exist: ${target}`)
  console.warn('Skipping symlink creation. This is normal if dependencies are not installed yet.')
} else {
  // 检查符号链接是否存在
  if (!fs.existsSync(symlinkPath)) {
    // 符号链接不存在，创建它（使用相对路径）
    try {
      fs.symlinkSync(relativeTarget, symlinkPath, 'dir')
      console.log('Created symlink: quartz -> node_modules/quartz/quartz')
    } catch (e) {
      // 如果失败，可能是因为文件已存在（race condition）
      if (e.code !== 'EEXIST') {
        console.warn('Ensure symlink failed:', e?.message)
      }
      // 不退出，继续执行其他操作
    }
  } else {
    // 检查现有符号链接是否有效
    try {
      const linkStat = fs.lstatSync(symlinkPath)
      if (linkStat.isSymbolicLink()) {
        // 检查符号链接指向的路径
        const currentTarget = fs.readlinkSync(symlinkPath)
        // 如果指向绝对路径，需要重新创建为相对路径
        if (path.isAbsolute(currentTarget)) {
          console.warn('quartz symlink points to absolute path, recreating with relative path')
          try {
            // 强制删除旧的符号链接
            if (fs.existsSync(symlinkPath)) {
              fs.unlinkSync(symlinkPath)
            }
            // 确保删除成功
            if (fs.existsSync(symlinkPath)) {
              console.warn('Failed to remove old symlink, trying again...')
              // 尝试使用 rm -rf（如果可能）
              const { execSync } = require('child_process')
              try {
                execSync(`rm -rf "${symlinkPath}"`, { stdio: 'ignore' })
              } catch {}
            }
            // 创建新的符号链接
            if (!fs.existsSync(symlinkPath)) {
              fs.symlinkSync(relativeTarget, symlinkPath, 'dir')
              console.log('Recreated symlink: quartz -> node_modules/quartz/quartz')
            } else {
              console.warn('Cannot create symlink, old one still exists')
            }
          } catch (e2) {
            console.warn('Failed to recreate symlink:', e2?.message)
          }
        } else {
          // 验证符号链接指向的目标是否存在
          let isValid = false
          try {
            const realPath = fs.realpathSync(symlinkPath)
            if (fs.existsSync(realPath) && fs.existsSync(path.join(realPath, 'build.ts'))) {
              isValid = true
              console.log('quartz symlink is valid')
            }
          } catch (e) {
            // 符号链接损坏或指向不存在的路径
            console.warn('quartz symlink is broken or points to invalid location:', e?.message)
          }
          
          // 如果无效，删除并重新创建
          if (!isValid) {
            try {
              if (fs.existsSync(symlinkPath)) {
                fs.unlinkSync(symlinkPath)
              }
              // 确保删除成功
              if (!fs.existsSync(symlinkPath)) {
                fs.symlinkSync(relativeTarget, symlinkPath, 'dir')
                console.log('Recreated symlink: quartz -> node_modules/quartz/quartz')
              }
            } catch (e2) {
              console.warn('Failed to recreate symlink:', e2?.message)
            }
          }
        }
      } else {
        // 存在但不是符号链接，由 build.sh 处理
        console.warn('quartz exists but is not a symlink, will be handled by build.sh')
      }
    } catch (e) {
      // 检查失败，可能是文件不存在或权限问题
      if (e.code !== 'ENOENT') {
        console.warn('Failed to check symlink:', e?.message)
      }
      // 不尝试重新创建，由 build.sh 处理
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


