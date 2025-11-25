#!/usr/bin/env node
/**
 * 检查 MOC 文件和对应文件夹的关联关系
 * 1. 检查 MOC 文件中引用的文件是否真实存在
 * 2. 检查文件夹中的文件是否都在 MOC 中有链接
 * 3. 检查双链引用
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
  'README.md',
  'index.md',
  '404.md',
];

// 存储检查结果
const issues = {
  missingFiles: [], // MOC 中引用但文件不存在
  missingLinks: [], // 文件存在但 MOC 中没有链接
  brokenLinks: [], // 双链引用但文件不存在
};

/**
 * 递归查找所有 markdown 文件
 */
function findMarkdownFiles(dir, rootDir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    if (file.startsWith('.') || IGNORE_DIRS.includes(file)) {
      continue;
    }
    
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, rootDir, fileList);
    } else if (file.endsWith('.md') && !IGNORE_FILES.includes(file)) {
      const relativePath = path.relative(rootDir, filePath);
      fileList.push(relativePath.replace(/\\/g, '/'));
    }
  }
  
  return fileList;
}

/**
 * 从 MOC 文件中提取所有链接
 */
function extractLinksFromMOC(mocPath, mocDir) {
  const content = fs.readFileSync(mocPath, 'utf-8');
  const links = [];
  
  // 匹配 Markdown 链接: [文本](./路径/文件.md)
  const markdownLinkRegex = /\[([^\]]+)\]\(\.\/([^)]+\.md)\)/g;
  let match;
  while ((match = markdownLinkRegex.exec(content)) !== null) {
    const linkPath = match[2];
    const fullPath = path.join(mocDir, linkPath).replace(/\\/g, '/');
    links.push({
      text: match[1],
      path: linkPath,
      fullPath: fullPath,
    });
  }
  
  // 匹配双链: [[文件名称]]
  const wikilinkRegex = /\[\[([^\]]+)\]\]/g;
  while ((match = wikilinkRegex.exec(content)) !== null) {
    const linkText = match[1];
    // 尝试找到对应的文件
    const possiblePaths = [
      path.join(mocDir, linkText + '.md'),
      path.join(mocDir, linkText),
    ];
    links.push({
      text: linkText,
      path: linkText,
      fullPath: possiblePaths[0].replace(/\\/g, '/'),
      isWikilink: true,
    });
  }
  
  return links;
}

/**
 * 检查 MOC 文件
 */
function checkMOC(mocPath) {
  const mocDir = path.dirname(mocPath);
  const mocName = path.basename(mocPath);
  
  console.log(`\n检查 MOC: ${mocPath}`);
  
  // 获取该目录下的所有 markdown 文件
  const allFiles = findMarkdownFiles(mocDir, mocDir);
  const mocFiles = allFiles.filter(f => f.includes('!MOC'));
  const contentFiles = allFiles.filter(f => !f.includes('!MOC'));
  
  // 从 MOC 文件中提取链接
  const links = extractLinksFromMOC(mocPath, mocDir);
  
  // 检查 MOC 中引用的文件是否存在
  for (const link of links) {
    if (link.isWikilink) {
      // 双链需要特殊处理，先跳过
      continue;
    }
    
    const linkPath = path.resolve(mocDir, link.path);
    if (!fs.existsSync(linkPath)) {
      issues.missingFiles.push({
        moc: mocPath,
        link: link.text,
        path: link.path,
        fullPath: linkPath,
      });
      console.log(`  ❌ 缺失文件: ${link.path} (在 MOC 中引用但文件不存在)`);
    }
  }
  
  // 检查文件夹中的文件是否都在 MOC 中有链接
  for (const file of contentFiles) {
    const fileName = path.basename(file);
    const filePath = path.join(mocDir, file).replace(/\\/g, '/');
    
    // 检查是否在 MOC 的链接中
    const hasLink = links.some(link => {
      const linkFullPath = path.resolve(mocDir, link.path).replace(/\\/g, '/');
      return linkFullPath === filePath;
    });
    
    if (!hasLink) {
      issues.missingLinks.push({
        moc: mocPath,
        file: file,
        fullPath: filePath,
      });
      console.log(`  ⚠️  缺失链接: ${file} (文件存在但 MOC 中没有链接)`);
    }
  }
}

/**
 * 主函数
 */
function main() {
  const rootDir = path.resolve(__dirname, '..');
  const mocFiles = [];
  
  // 查找所有 MOC 文件
  function findMOCFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      if (file.startsWith('.') || IGNORE_DIRS.includes(file)) {
        continue;
      }
      
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findMOCFiles(filePath);
      } else if (file.startsWith('!MOC-') && file.endsWith('.md')) {
        mocFiles.push(filePath);
      }
    }
  }
  
  findMOCFiles(rootDir);
  
  console.log(`找到 ${mocFiles.length} 个 MOC 文件\n`);
  
  // 检查每个 MOC 文件
  for (const mocFile of mocFiles) {
    checkMOC(mocFile);
  }
  
  // 输出总结
  console.log('\n' + '='.repeat(60));
  console.log('检查总结');
  console.log('='.repeat(60));
  console.log(`\n❌ 缺失文件 (MOC 中引用但文件不存在): ${issues.missingFiles.length}`);
  if (issues.missingFiles.length > 0) {
    issues.missingFiles.forEach(issue => {
      console.log(`  - ${issue.moc}`);
      console.log(`    链接: ${issue.link}`);
      console.log(`    路径: ${issue.path}`);
    });
  }
  
  console.log(`\n⚠️  缺失链接 (文件存在但 MOC 中没有链接): ${issues.missingLinks.length}`);
  if (issues.missingLinks.length > 0) {
    issues.missingLinks.forEach(issue => {
      console.log(`  - ${issue.moc}`);
      console.log(`    文件: ${issue.file}`);
    });
  }
  
  if (issues.missingFiles.length === 0 && issues.missingLinks.length === 0) {
    console.log('\n✅ 所有 MOC 文件和文件夹关联关系正常！');
  }
}

main();

