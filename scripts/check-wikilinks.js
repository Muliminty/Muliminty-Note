#!/usr/bin/env node
/**
 * 检查笔记中的双链引用，确保在 Quartz 中能正常工作
 * 检查项：
 * 1. 双链引用的文件是否存在
 * 2. 双链格式是否正确
 * 3. 路径是否正确（特别是跨目录引用）
 */

const fs = require('fs');
const path = require('path');

// 需要忽略的目录
const IGNORE_DIRS = [
  'node_modules',
  'public',
  'scripts',
  'quartz',
  '.git',
  '.obsidian',
  'xx-归档',
  'xx-草稿',
  'Prompt',
  '书籍',
];

// 需要忽略的文件
const IGNORE_FILES = [
  '书签整理.md',
  'README.md',
  'index.md',
  '404.md',
];

// 所有找到的 markdown 文件
const allMarkdownFiles = new Map();

// 所有双链引用
const wikilinks = [];

// 错误和警告
const errors = [];
const warnings = [];

/**
 * 递归查找所有 markdown 文件
 */
function findMarkdownFiles(dir, rootDir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    // 跳过隐藏文件和忽略的目录
    if (file.startsWith('.') || IGNORE_DIRS.includes(file)) {
      continue;
    }
    
    const filePath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch (error) {
      continue;
    }
    
    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, rootDir);
    } else if (file.endsWith('.md') && !IGNORE_FILES.includes(file)) {
      const relativePath = path.relative(rootDir, filePath);
      const slug = relativePath.replace(/\\/g, '/').replace(/\.md$/, '');
      allMarkdownFiles.set(slug, filePath);
      allMarkdownFiles.set(path.basename(file, '.md'), filePath);
    }
  }
}

/**
 * 提取文件中的所有双链（排除代码块中的）
 */
function extractWikilinks(content, filePath) {
  // 先移除代码块中的内容（避免误识别代码中的 [[...]]）
  const codeBlockRegex = /```[\s\S]*?```/g;
  const inlineCodeRegex = /`[^`]+`/g;
  
  // 标记代码块位置
  const codeBlockRanges = [];
  let match;
  
  // 标记代码块
  while ((match = codeBlockRegex.exec(content)) !== null) {
    codeBlockRanges.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  
  // 标记行内代码
  while ((match = inlineCodeRegex.exec(content)) !== null) {
    codeBlockRanges.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  
  // 检查位置是否在代码块中
  function isInCodeBlock(index) {
    return codeBlockRanges.some(range => index >= range.start && index < range.end);
  }
  
  // 匹配 [[链接]] 格式
  const wikilinkRegex = /\[\[([^\]]+)\]\]/g;
  const matches = [];
  
  while ((match = wikilinkRegex.exec(content)) !== null) {
    // 跳过代码块中的双链
    if (isInCodeBlock(match.index)) {
      continue;
    }
    
    const fullMatch = match[0];
    const linkContent = match[1];
    
    // 跳过明显是代码示例的双链（如包含特殊字符的）
    if (linkContent.includes('$') || linkContent.includes('==') || linkContent.includes('/*')) {
      continue;
    }
    
    // 解析双链内容
    let linkPath, displayText, anchor;
    
    if (linkContent.includes('|')) {
      // [[路径|显示文本]]
      const parts = linkContent.split('|');
      linkPath = parts[0].trim();
      displayText = parts[1].trim();
    } else {
      linkPath = linkContent.trim();
    }
    
    // 检查是否有锚点
    if (linkPath.includes('#')) {
      const parts = linkPath.split('#');
      linkPath = parts[0].trim();
      anchor = parts.slice(1).join('#').trim();
    }
    
    // 跳过示例性的双链（如"文件名"、"显示文本"等占位符）
    const placeholderPatterns = ['文件名', '显示文本', '链接', '路径', '锚点', '文件夹', '笔记名称', '示例笔记'];
    if (placeholderPatterns.some(pattern => linkPath === pattern || linkPath.includes(pattern))) {
      continue;
    }
    
    matches.push({
      full: fullMatch,
      path: linkPath,
      displayText: displayText || linkPath,
      anchor: anchor,
      file: filePath,
    });
  }
  
  return matches;
}

/**
 * 检查双链引用的文件是否存在
 */
function checkWikilink(wikilink, rootDir) {
  const linkPath = wikilink.path;
  const sourceFile = wikilink.file;
  const sourceDir = path.dirname(sourceFile);
  
  // 可能的文件路径
  const possiblePaths = [];
  
  // 1. 直接匹配文件名（不含扩展名）
  possiblePaths.push(linkPath);
  
  // 2. 相对于源文件的路径
  const relativePath = path.join(sourceDir, linkPath + '.md');
  possiblePaths.push(path.relative(rootDir, relativePath).replace(/\\/g, '/'));
  
  // 3. 从根目录查找
  const rootPath = path.join(rootDir, linkPath + '.md');
  if (fs.existsSync(rootPath)) {
    possiblePaths.push(linkPath);
  }
  
  // 4. 查找所有可能的路径
  for (const [slug, filePath] of allMarkdownFiles.entries()) {
    if (slug === linkPath || slug.endsWith('/' + linkPath) || slug === linkPath.replace(/\//g, '/')) {
      const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/').replace(/\.md$/, '');
      possiblePaths.push(relativePath);
    }
  }
  
  // 检查是否存在
  let found = false;
  let foundPath = null;
  
  for (const possiblePath of possiblePaths) {
    // 检查是否在 allMarkdownFiles 中
    if (allMarkdownFiles.has(possiblePath)) {
      found = true;
      foundPath = possiblePath;
      break;
    }
    
    // 检查文件是否存在
    const fullPath = path.join(rootDir, possiblePath + '.md');
    if (fs.existsSync(fullPath)) {
      found = true;
      foundPath = possiblePath;
      break;
    }
  }
  
  if (!found) {
    errors.push({
      type: 'missing_file',
      wikilink: wikilink.full,
      path: linkPath,
      source: path.relative(rootDir, sourceFile),
      message: `双链引用的文件不存在: [[${linkPath}]]`,
    });
  } else {
    // 检查锚点（如果存在）
    if (wikilink.anchor) {
      const targetFile = allMarkdownFiles.get(foundPath) || path.join(rootDir, foundPath + '.md');
      if (fs.existsSync(targetFile)) {
        const content = fs.readFileSync(targetFile, 'utf8');
        // 简单的锚点检查：查找标题
        const anchorRegex = new RegExp(`^#{1,6}\\s+${wikilink.anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm');
        if (!anchorRegex.test(content)) {
          warnings.push({
            type: 'missing_anchor',
            wikilink: wikilink.full,
            path: linkPath,
            anchor: wikilink.anchor,
            source: path.relative(rootDir, sourceFile),
            message: `双链的锚点可能不存在: [[${linkPath}#${wikilink.anchor}]]`,
          });
        }
      }
    }
  }
}

/**
 * 检查所有文件中的双链
 */
function checkAllWikilinks(rootDir) {
  console.log('🔍 扫描 Markdown 文件...\n');
  
  // 1. 查找所有 markdown 文件
  findMarkdownFiles(rootDir, rootDir);
  console.log(`找到 ${allMarkdownFiles.size} 个 Markdown 文件\n`);
  
  // 2. 提取所有双链
  console.log('🔗 提取双链引用...\n');
  for (const [slug, filePath] of allMarkdownFiles.entries()) {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const links = extractWikilinks(content, filePath);
      wikilinks.push(...links);
    }
  }
  console.log(`找到 ${wikilinks.length} 个双链引用\n`);
  
  // 3. 检查每个双链
  console.log('✅ 检查双链引用...\n');
  for (const wikilink of wikilinks) {
    checkWikilink(wikilink, rootDir);
  }
  
  // 4. 输出结果
  console.log('\n' + '='.repeat(60));
  console.log('📊 检查结果\n');
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ 所有双链引用都正常！\n');
  } else {
    if (errors.length > 0) {
      console.log(`❌ 发现 ${errors.length} 个错误：\n`);
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.message}`);
        console.log(`   文件: ${error.source}`);
        console.log(`   双链: ${error.wikilink}`);
        console.log(`   路径: ${error.path}\n`);
      });
    }
    
    if (warnings.length > 0) {
      console.log(`⚠️  发现 ${warnings.length} 个警告：\n`);
      warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning.message}`);
        console.log(`   文件: ${warning.source}`);
        console.log(`   双链: ${warning.wikilink}\n`);
      });
    }
  }
  
  console.log('='.repeat(60));
  
  // 返回退出码
  return errors.length > 0 ? 1 : 0;
}

// 主函数
const rootDir = process.cwd();
process.exit(checkAllWikilinks(rootDir));

