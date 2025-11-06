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
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // 跳过某些目录
      if (file.startsWith('.') || file === 'node_modules' || file === 'public' || file === 'scripts') {
        continue;
      }
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

