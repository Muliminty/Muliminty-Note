const fs = require('fs');
const path = require('path');

const overreactedDir = path.join(__dirname, '..', '书籍', 'overreacted');

// 获取所有文章文件夹名称
function getAllArticleFolders() {
  const folders = [];
  const entries = fs.readdirSync(overreactedDir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const indexPath = path.join(overreactedDir, entry.name, 'index.md');
      if (fs.existsSync(indexPath)) {
        folders.push(entry.name);
      }
    }
  }
  
  return folders;
}

// 转换绝对路径链接为相对路径
function convertLinks(content, currentFolder, allFolders) {
  // 匹配 markdown 链接格式: [text](/path/) 或 [text](/path)
  const linkPattern = /\[([^\]]+)\]\((\/[^\)]+)\)/g;
  
  return content.replace(linkPattern, (match, text, linkPath) => {
    // 移除开头和末尾的斜杠
    const cleanPath = linkPath.replace(/^\/+|\/+$/g, '');
    
    // 如果是外部链接（包含 http:// 或 https://），保持不变
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      return match;
    }
    
    // 检查是否是 overreacted 文件夹下的文章
    if (allFolders.includes(cleanPath)) {
      // 如果是当前文件夹，使用相对路径
      if (cleanPath === currentFolder) {
        return `[${text}](./index.md)`;
      }
      // 否则使用相对路径指向其他文章
      return `[${text}](../${cleanPath}/index.md)`;
    }
    
    // 如果路径以 / 开头但不是已知的文章，保持原样（可能是外部链接）
    return match;
  });
}

// 处理单个文件
function processFile(filePath, currentFolder, allFolders) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // 转换链接
  content = convertLinks(content, currentFolder, allFolders);
  
  // 确保 frontmatter 格式正确
  // 处理 tags 在 frontmatter 外部的情况
  if (content.startsWith('tags:')) {
    // 如果 tags 在开头，需要将其移到 frontmatter 内部
    const tagsEnd = content.indexOf('---');
    if (tagsEnd !== -1) {
      const tags = content.substring(0, tagsEnd).trim();
      const rest = content.substring(tagsEnd);
      content = rest;
    }
  }
  
  if (content.startsWith('---')) {
    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd !== -1) {
      let frontmatter = content.substring(4, frontmatterEnd).trim();
      const body = content.substring(frontmatterEnd + 3);
      
      // 检查是否需要添加 tags
      if (!frontmatter.includes('tags:')) {
        // 如果有 cta 字段，可以将其作为 tag
        const ctaMatch = frontmatter.match(/cta:\s*['"]([^'"]+)['"]/);
        if (ctaMatch) {
          const cta = ctaMatch[1];
          frontmatter = frontmatter + `\ntags:\n  - ${cta}`;
        }
      }
      
      // 重新组装 frontmatter
      content = `---\n${frontmatter}\n---${body}`;
    }
  }
  
  // 写回文件
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✓ 已处理: ${filePath}`);
}

// 主函数
function main() {
  console.log('开始转换 overreacted 文件夹...\n');
  
  const allFolders = getAllArticleFolders();
  console.log(`找到 ${allFolders.length} 篇文章\n`);
  
  // 处理每个文章文件夹
  for (const folder of allFolders) {
    const indexPath = path.join(overreactedDir, folder, 'index.md');
    if (fs.existsSync(indexPath)) {
      processFile(indexPath, folder, allFolders);
    }
  }
  
  console.log('\n转换完成！');
}

main();

