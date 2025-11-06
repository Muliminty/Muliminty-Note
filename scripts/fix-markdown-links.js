#!/usr/bin/env node
/**
 * 修复 Markdown 文件中的相对路径链接
 * 将缺少 ./ 前缀的相对路径链接添加 ./ 前缀
 * 例如：将 [链接](路径/文件.md) 改为 [链接](./路径/文件.md)
 */

const fs = require('fs');
const path = require('path');

function fixMarkdownLinks(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    
    // 跳过某些目录（在 stat 之前检查，避免访问问题）
    if (file.startsWith('.') || file === 'node_modules' || file === 'public' || file === 'scripts' || file === 'quartz') {
      continue;
    }
    
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch (error) {
      // 如果无法访问文件/目录（如损坏的符号链接），跳过它
      console.warn(`Skipping inaccessible path: ${filePath} (${error.message})`);
      continue;
    }
    
    if (stat.isDirectory()) {
      fixedCount += fixMarkdownLinks(filePath);
    } else if (file.endsWith('.md')) {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // 1) 修复以 / 开头的绝对路径为相对路径： [文本](/路径/文件.md) -> [文本](路径/文件.md)
      content = content.replace(/\((\/[^(\)]*\.md)\)/g, (m, p1) => `(${p1.replace(/^\//, '')})`)

      // 2) 修复缺少 ./ 前缀的相对路径链接：将 [文本](路径/文件.md) 改为 [文本](./路径/文件.md)
      // 匹配模式：[文本](路径/文件.md)，但不匹配 [文本](./路径/文件.md) 或 [文本](../路径/文件.md) 或 [文本](#锚点)
      content = content.replace(/\[([^\]]+)\]\(([^./#][^)]*\.md)\)/g, (match, text, linkPath) => {
        if (!linkPath.startsWith('./') && !linkPath.startsWith('../') && !linkPath.startsWith('#')) {
          return `[${text}](./${linkPath})`
        }
        return match
      })
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed links in: ${filePath}`);
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

const rootDir = process.cwd();
console.log('Fixing markdown links in all .md files...');
const fixedCount = fixMarkdownLinks(rootDir);
console.log(`Done! Fixed ${fixedCount} file(s).`);

