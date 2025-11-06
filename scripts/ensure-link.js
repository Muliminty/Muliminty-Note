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
process.exit(0)


