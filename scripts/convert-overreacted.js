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

// 转换图片路径为 img/ 文件夹格式
function convertImagePaths(content) {
  // 匹配 markdown 图片格式: ![alt](./image.png) 或 ![alt](image.png)
  // 匹配格式: ![alt](./image.png) 或 ![alt](image.png) 或 ![alt](image.png)
  const imagePattern = /!\[([^\]]*)\]\(([^\)]+\.(png|jpg|jpeg|gif|svg|webp))\)/gi;
  
  return content.replace(imagePattern, (match, alt, imagePath) => {
    // 如果已经是 ./img/ 格式，保持不变
    if (imagePath.startsWith('./img/') || imagePath.startsWith('img/')) {
      return match;
    }
    
    // 如果是外部链接（http:// 或 https://），保持不变
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return match;
    }
    
    // 提取文件名（去掉可能的 ./ 前缀）
    const imageName = imagePath.replace(/^\.\//, '');
    
    // 转换为 ./img/ 格式
    return `![${alt}](./img/${imageName})`;
  });
}

// 移动图片文件到 img/ 文件夹
function moveImagesToImgFolder(folderPath, folderName) {
  const imgDir = path.join(folderPath, 'img');
  
  // 创建 img 文件夹（如果不存在）
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
  }
  
  // 图片文件扩展名
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
  
  // 读取文件夹中的所有文件
  const files = fs.readdirSync(folderPath);
  let movedCount = 0;
  
  for (const file of files) {
    // 跳过 index.md 和 img 文件夹
    if (file === 'index.md' || file === 'img' || file === '.DS_Store') {
      continue;
    }
    
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);
    
    // 如果是文件且是图片文件
    if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if (imageExtensions.includes(ext)) {
        const destPath = path.join(imgDir, file);
        // 如果目标文件不存在，移动文件
        if (!fs.existsSync(destPath)) {
          fs.renameSync(filePath, destPath);
          movedCount++;
          console.log(`  移动图片: ${file} -> img/${file}`);
        }
      }
    }
  }
  
  return movedCount;
}

// 处理单个文件
function processFile(filePath, currentFolder, allFolders) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // 转换链接
  content = convertLinks(content, currentFolder, allFolders);
  
  // 转换图片路径
  content = convertImagePaths(content);
  
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
    const folderPath = path.join(overreactedDir, folder);
    const indexPath = path.join(folderPath, 'index.md');
    
    if (fs.existsSync(indexPath)) {
      // 先移动图片文件到 img/ 文件夹
      const movedCount = moveImagesToImgFolder(folderPath, folder);
      if (movedCount > 0) {
        console.log(`  已移动 ${movedCount} 个图片文件到 img/ 文件夹`);
      }
      
      // 然后处理 markdown 文件
      processFile(indexPath, folder, allFolders);
    }
  }
  
  console.log('\n转换完成！');
}

main();

