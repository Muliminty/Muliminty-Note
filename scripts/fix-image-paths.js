#!/usr/bin/env node
/**
 * 修复 Quartz 生成的 HTML 文件中的图片路径
 * 将 ../../../../img/ 替换为 img/（相对于当前 HTML 文件）
 */

const fs = require('fs');
const path = require('path');

function fixImagePaths(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixImagePaths(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // 修复图片路径：将 ../../../../img/ 替换为 img/
      // 匹配各种深度的相对路径（包括 ../../../../、../../../、../../、../）
      content = content.replace(/src="(\.\.\/)+img\//g, 'src="img/');
      
      // 也处理可能存在的其他变体，如 ../../img/、../../../img/ 等
      // 确保图片路径是相对于当前 HTML 文件的
      content = content.replace(/src="\.\.\/\.\.\/img\//g, 'src="img/');
      content = content.replace(/src="\.\.\/\.\.\/\.\.\/img\//g, 'src="img/');
      content = content.replace(/src="\.\.\/\.\.\/\.\.\/\.\.\/img\//g, 'src="img/');
      content = content.replace(/src="\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/img\//g, 'src="img/');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed image paths in: ${filePath}`);
      }
    }
  }
}

const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  console.log('Fixing image paths in HTML files...');
  fixImagePaths(publicDir);
  console.log('Done!');
} else {
  console.error('Public directory not found!');
  process.exit(1);
}

