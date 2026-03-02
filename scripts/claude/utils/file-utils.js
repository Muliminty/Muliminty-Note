/**
 * 文件工具函数库
 * 提供知识库文件操作的通用函数
 */

const fs = require('fs');
const path = require('path');

/**
 * 读取知识库配置文件中的环境变量
 */
function getConfig() {
  const configPath = path.join(process.cwd(), '.claude', 'settings.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return config.env || {};
    } catch (error) {
      console.warn('无法读取.claude/settings.json配置:', error.message);
    }
  }
  return {};
}

/**
 * 获取知识库根目录
 */
function getKnowledgeBasePath() {
  const config = getConfig();
  return config.KNOWLEDGE_BASE_PATH || process.cwd();
}

/**
 * 获取MOC文件前缀
 */
function getMocPrefix() {
  const config = getConfig();
  return config.MOC_PREFIX || '!MOC-';
}

/**
 * 获取分类列表
 */
function getCategories() {
  const config = getConfig();
  if (config.CATEGORIES) {
    return config.CATEGORIES.split(',').map(cat => cat.trim());
  }
  return [];
}

/**
 * 递归查找所有Markdown文件
 * @param {string} dir - 起始目录
 * @param {string[]} ignoreDirs - 忽略的目录列表
 * @param {string[]} ignoreFiles - 忽略的文件列表
 * @returns {string[]} 文件路径列表（相对路径）
 */
function findMarkdownFiles(dir, ignoreDirs = [], ignoreFiles = []) {
  const results = [];
  const rootDir = getKnowledgeBasePath();

  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      // 跳过隐藏文件
      if (item.startsWith('.')) {
        continue;
      }

      const itemPath = path.join(currentDir, item);
      const relativePath = path.relative(rootDir, itemPath);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // 检查是否在忽略列表中
        if (ignoreDirs.includes(item) || ignoreDirs.includes(relativePath)) {
          continue;
        }
        scan(itemPath);
      } else if (item.endsWith('.md')) {
        // 检查是否在忽略列表中
        if (ignoreFiles.includes(item) || ignoreFiles.includes(relativePath)) {
          continue;
        }
        results.push(relativePath.replace(/\\/g, '/'));
      }
    }
  }

  scan(dir);
  return results;
}

/**
 * 查找所有MOC文件
 * @returns {string[]} MOC文件路径列表（相对路径）
 */
function findMocFiles() {
  const rootDir = getKnowledgeBasePath();
  const mocPrefix = getMocPrefix();
  const mocFiles = [];

  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      // 跳过隐藏文件
      if (item.startsWith('.')) {
        continue;
      }

      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scan(itemPath);
      } else if (item.startsWith(mocPrefix) && item.endsWith('.md')) {
        const relativePath = path.relative(rootDir, itemPath);
        mocFiles.push(relativePath.replace(/\\/g, '/'));
      }
    }
  }

  scan(rootDir);
  return mocFiles;
}

/**
 * 读取文件内容，支持YAML frontmatter解析
 * @param {string} filePath - 文件路径（相对或绝对）
 * @returns {object} 包含frontmatter和content的对象
 */
function readFileWithFrontmatter(filePath) {
  const rootDir = getKnowledgeBasePath();
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }

  const content = fs.readFileSync(absolutePath, 'utf8');

  // 解析YAML frontmatter
  const frontmatter = {};
  let body = content;

  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);

  if (match) {
    body = content.slice(match[0].length);
    const yamlContent = match[1];

    // 简单的YAML解析（适用于简单结构）
    const lines = yamlContent.split('\n');
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();

        // 处理数组格式
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(item => item.trim());
        }
        // 处理布尔值
        else if (value === 'true' || value === 'false') {
          value = value === 'true';
        }
        // 处理数字
        else if (!isNaN(value) && value.trim() !== '') {
          value = Number(value);
        }
        // 移除字符串引号
        else if ((value.startsWith('"') && value.endsWith('"')) ||
                 (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        frontmatter[key] = value;
      }
    }
  }

  return {
    frontmatter,
    content: body,
    fullContent: content
  };
}

/**
 * 写入文件，支持YAML frontmatter
 * @param {string} filePath - 文件路径（相对或绝对）
 * @param {object} frontmatter - YAML frontmatter对象
 * @param {string} content - 文件内容
 */
function writeFileWithFrontmatter(filePath, frontmatter, content) {
  const rootDir = getKnowledgeBasePath();
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath);

  let fileContent = '';

  // 如果有frontmatter，则生成YAML
  if (frontmatter && Object.keys(frontmatter).length > 0) {
    fileContent += '---\n';

    for (const [key, value] of Object.entries(frontmatter)) {
      if (Array.isArray(value)) {
        fileContent += `${key}: [${value.join(', ')}]\n`;
      } else if (typeof value === 'boolean') {
        fileContent += `${key}: ${value}\n`;
      } else if (typeof value === 'number') {
        fileContent += `${key}: ${value}\n`;
      } else {
        // 字符串类型，如果包含特殊字符则加引号
        if (value.includes(':') || value.includes('#') || value.includes('"') || value.includes("'")) {
          fileContent += `${key}: "${value.replace(/"/g, '\\"')}"\n`;
        } else {
          fileContent += `${key}: ${value}\n`;
        }
      }
    }

    fileContent += '---\n\n';
  }

  fileContent += content;

  // 确保目录存在
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(absolutePath, fileContent, 'utf8');
}

/**
 * 从Markdown内容中提取链接
 * @param {string} content - Markdown内容
 * @param {string} baseDir - 基础目录（用于解析相对路径）
 * @returns {object[]} 链接对象数组
 */
function extractLinksFromMarkdown(content, baseDir = '') {
  const links = [];
  const rootDir = getKnowledgeBasePath();

  // 匹配Markdown链接: [文本](./路径/文件.md)
  const markdownLinkRegex = /\[([^\]]+)\]\(\.\/([^)]+\.md)\)/g;
  let match;

  while ((match = markdownLinkRegex.exec(content)) !== null) {
    const linkPath = match[2];
    const fullPath = path.join(rootDir, baseDir, linkPath).replace(/\\/g, '/');
    links.push({
      type: 'markdown',
      text: match[1],
      path: linkPath,
      fullPath: fullPath,
      raw: match[0]
    });
  }

  // 匹配双链: [[文件名称]]
  const wikilinkRegex = /\[\[([^\]]+)\]\]/g;
  while ((match = wikilinkRegex.exec(content)) !== null) {
    const linkText = match[1];
    links.push({
      type: 'wikilink',
      text: linkText,
      path: linkText,
      raw: match[0]
    });
  }

  return links;
}

/**
 * 获取文件的创建和修改时间
 * @param {string} filePath - 文件路径
 * @returns {object} 包含created和modified日期的对象
 */
function getFileTimes(filePath) {
  const rootDir = getKnowledgeBasePath();
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }

  const stats = fs.statSync(absolutePath);

  return {
    created: new Date(stats.birthtime).toISOString().split('T')[0], // YYYY-MM-DD
    modified: new Date(stats.mtime).toISOString().split('T')[0]
  };
}

/**
 * 生成日志文件
 * @param {string} logDir - 日志目录
 * @param {string} prefix - 日志文件前缀
 * @param {string} content - 日志内容
 * @returns {string} 日志文件路径
 */
function writeLog(logDir, prefix, content) {
  const rootDir = getKnowledgeBasePath();
  const logsDir = path.join(rootDir, logDir);

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logFile = path.join(logsDir, `${prefix}-${dateStr}-${timestamp}.log`);

  const logContent = `=== 日志生成时间: ${new Date().toISOString()} ===\n\n${content}\n`;
  fs.writeFileSync(logFile, logContent, 'utf8');

  return logFile;
}

module.exports = {
  getConfig,
  getKnowledgeBasePath,
  getMocPrefix,
  getCategories,
  findMarkdownFiles,
  findMocFiles,
  readFileWithFrontmatter,
  writeFileWithFrontmatter,
  extractLinksFromMarkdown,
  getFileTimes,
  writeLog
};