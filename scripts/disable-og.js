#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

function findFiles(dir, matcher, results = []) {
  const entries = fs.existsSync(dir) ? fs.readdirSync(dir) : []
  for (const entry of entries) {
    const p = path.join(dir, entry)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) {
      findFiles(p, matcher, results)
    } else if (matcher.test(entry)) {
      results.push(p)
    }
  }
  return results
}

function disableCustomOgImages(rootDir) {
  const targetRoot = path.join(rootDir, 'node_modules', 'quartz')
  if (!fs.existsSync(targetRoot)) {
    console.error('Quartz package not found at', targetRoot)
    process.exit(0)
  }
  const files = findFiles(targetRoot, /\.([cm]?ts|m?js)$/)
  let patched = 0
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8')
    if (content.includes('CustomOgImages')) {
      // Comment out any Plugin.CustomOgImages( ... ) occurrence safely
      const replaced = content.replace(/(\s*)Plugin\.CustomOgImages\s*\([^)]*\)\s*,?/g, (m, ws) => `${ws}// ${m.trim()}`)
      if (replaced !== content) {
        fs.writeFileSync(file, replaced, 'utf8')
        patched++
      }
    }
  }
  console.log(`Patched files: ${patched}`)
}

disableCustomOgImages(process.cwd())


