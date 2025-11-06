#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

// Ensure node_modules/quartz/quartz.config.ts re-exports the project's root config
const targetDir = path.join(__dirname, '..', 'node_modules', 'quartz')
const targetFile = path.join(targetDir, 'quartz.config.ts')
try {
  if (fs.existsSync(targetDir)) {
    const content = 'export { default } from "../quartz.config"\n'
    fs.writeFileSync(targetFile, content, 'utf8')
    console.log('Injected config shim:', targetFile)
  }
} catch (e) {
  console.warn('Inject config failed:', e?.message)
}

