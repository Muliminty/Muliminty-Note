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
      process.exit(0)
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


