#!/usr/bin/env node
/**
 * 元数据同步脚本
 * 统一知识库中YAML frontmatter格式，维护元数据一致性
 * 功能：
 * 1. 检查YAML frontmatter格式
 * 2. 自动添加缺失的必需字段
 * 3. 标准化标签、分类、技术栈等格式
 * 4. 生成元数据一致性报告
 */

const fs = require('fs');
const path = require('path');
const fileUtils = require('../utils/file-utils');

// 配置
const CONFIG = {
  dryRun: process.argv.includes('--dry-run'),
  verbose: process.argv.includes('--verbose'),
  specificDir: process.argv.slice(2).find(arg => !arg.startsWith('--')) || null,
  force: process.argv.includes('--force')
};

// 元数据规范
const METADATA_SPEC = {
  required: ['title', 'date'],
  recommended: [
    'description',
    'tags',
    'category',
    'techStack',
    'difficulty',
    'prerequisites',
    'toc',
    'lastModified'
  ],
  formats: {
    date: /^\d{4}-\d{2}-\d{2}$/,
    tags: 'array',
    techStack: 'array',
    prerequisites: 'array',
    difficulty: ['beginner', 'intermediate', 'advanced'],
    toc: 'boolean'
  },
  defaults: {
    toc: true,
    difficulty: 'intermediate',
    lastModified: () => new Date().toISOString().split('T')[0]
  }
};

/**
 * 推断文件的分类
 * @param {string} filePath - 文件路径
 * @returns {string} 分类名称
 */
function inferCategory(filePath) {
  const categories = fileUtils.getCategories();
  const pathParts = filePath.split('/');

  // 检查是否在已知分类目录中
  for (const category of categories) {
    if (pathParts.includes(category)) {
      return category.replace(/^\d+-/, ''); // 移除数字前缀
    }
  }

  // 根据目录结构推断
  if (pathParts.length >= 2) {
    const dirName = pathParts[0];
    return dirName.replace(/^\d+-/, '');
  }

  return 'uncategorized';
}

/**
 * 从内容中提取标签
 * @param {string} content - 文件内容
 * @param {string} filePath - 文件路径
 * @returns {string[]} 标签数组
 */
function extractTags(content, filePath) {
  const tags = new Set();

  // 从文件路径提取
  const pathTags = filePath.split('/')
    .filter(part => part.includes('-'))
    .map(part => part.replace(/^\d+-/, ''))
    .filter(part => part.length > 1);

  pathTags.forEach(tag => tags.add(tag));

  // 从内容中提取关键词（简单实现）
  const keywords = [
    // 技术栈关键词
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js', 'Python', 'Java',
    'CSS', 'HTML', 'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    // 概念关键词
    '算法', '数据结构', '设计模式', '架构', '性能', '安全', '测试',
    '部署', '监控', '日志', '数据库', '缓存', '消息队列'
  ];

  for (const keyword of keywords) {
    if (content.includes(keyword)) {
      tags.add(keyword);
    }
  }

  // 从技术栈推断
  const techStackMatch = content.match(/techStack:\s*\[([^\]]+)\]/);
  if (techStackMatch) {
    const techItems = techStackMatch[1].split(',').map(item => item.trim());
    techItems.forEach(item => tags.add(item));
  }

  return Array.from(tags).slice(0, 10); // 限制最多10个标签
}

/**
 * 推断技术栈
 * @param {string} content - 文件内容
 * @returns {string[]} 技术栈数组
 */
function inferTechStack(content) {
  const techStack = new Set();

  // 常见技术栈模式
  const patterns = [
    { regex: /\b(React|Vue|Angular|Svelte)\b/, category: '前端框架' },
    { regex: /\b(Node\.js|Express|Koa|NestJS)\b/, category: '后端框架' },
    { regex: /\b(JavaScript|TypeScript|Python|Java|Go|Rust)\b/, category: '编程语言' },
    { regex: /\b(MySQL|PostgreSQL|MongoDB|Redis)\b/, category: '数据库' },
    { regex: /\b(Docker|Kubernetes|Jenkins|GitHub Actions)\b/, category: '运维工具' },
    { regex: /\b(AWS|Azure|GCP|阿里云)\b/, category: '云平台' }
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern.regex);
    if (match) {
      techStack.add(match[1]);
    }
  }

  // 从代码块中推断
  const codeBlockRegex = /```(\w+)[\s\S]*?```/g;
  let codeMatch;
  while ((codeMatch = codeBlockRegex.exec(content)) !== null) {
    const lang = codeMatch[1];
    if (lang && !['txt', 'text', 'bash', 'shell', 'console'].includes(lang.toLowerCase())) {
      techStack.add(lang);
    }
  }

  return Array.from(techStack);
}

/**
 * 评估内容难度
 * @param {string} content - 文件内容
 * @returns {string} 难度级别
 */
function assessDifficulty(content) {
  // 简单启发式评估
  const wordCount = content.split(/\s+/).length;
  const codeBlockCount = (content.match(/```/g) || []).length / 2;
  const headingCount = (content.match(/^#+\s/gm) || []).length;

  // 计算复杂度分数
  let score = 0;
  score += wordCount > 2000 ? 2 : wordCount > 1000 ? 1 : 0;
  score += codeBlockCount > 5 ? 2 : codeBlockCount > 2 ? 1 : 0;
  score += headingCount > 10 ? 2 : headingCount > 5 ? 1 : 0;

  // 检查是否包含高级术语
  const advancedTerms = ['源码', '原理', '架构', '性能优化', '并发', '分布式', '算法复杂度'];
  if (advancedTerms.some(term => content.includes(term))) {
    score += 2;
  }

  if (score >= 4) return 'advanced';
  if (score >= 2) return 'intermediate';
  return 'beginner';
}

/**
 * 分析文件的元数据
 * @param {string} filePath - 文件路径
 * @returns {object} 分析结果
 */
function analyzeFileMetadata(filePath) {
  const rootDir = fileUtils.getKnowledgeBasePath();
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath);

  if (!fs.existsSync(absolutePath)) {
    return { filePath, exists: false };
  }

  try {
    const { frontmatter, content, fullContent } = fileUtils.readFileWithFrontmatter(filePath);
    const fileTimes = fileUtils.getFileTimes(filePath);

    // 检查必需字段
    const missingRequired = [];
    for (const field of METADATA_SPEC.required) {
      if (!frontmatter[field]) {
        missingRequired.push(field);
      }
    }

    // 检查推荐字段
    const missingRecommended = [];
    for (const field of METADATA_SPEC.recommended) {
      if (!frontmatter[field] && field !== 'lastModified') {
        missingRecommended.push(field);
      }
    }

    // 检查格式问题
    const formatIssues = [];
    for (const [field, format] of Object.entries(METADATA_SPEC.formats)) {
      if (frontmatter[field]) {
        if (format === 'array' && !Array.isArray(frontmatter[field])) {
          formatIssues.push({ field, issue: '应为数组格式' });
        } else if (format === 'boolean' && typeof frontmatter[field] !== 'boolean') {
          formatIssues.push({ field, issue: '应为布尔值' });
        } else if (Array.isArray(format) && !format.includes(frontmatter[field])) {
          formatIssues.push({ field, issue: `应为以下值之一: ${format.join(', ')}` });
        } else if (format instanceof RegExp && !format.test(frontmatter[field])) {
          formatIssues.push({ field, issue: `格式不正确，应匹配: ${format}` });
        }
      }
    }

    // 推断缺失字段的值
    const inferredValues = {};

    // 标题：从文件名或一级标题提取
    if (!frontmatter.title) {
      const fileName = path.basename(filePath, '.md');
      const h1Match = content.match(/^#\s+(.+)$/m);
      inferredValues.title = h1Match ? h1Match[1] : fileName.replace(/-/g, ' ');
    }

    // 日期：使用文件创建时间
    if (!frontmatter.date) {
      inferredValues.date = fileTimes.created;
    }

    // 最后修改时间
    if (!frontmatter.lastModified || CONFIG.force) {
      inferredValues.lastModified = fileTimes.modified;
    }

    // 分类
    if (!frontmatter.category) {
      inferredValues.category = inferCategory(filePath);
    }

    // 标签
    if (!frontmatter.tags || frontmatter.tags.length === 0) {
      inferredValues.tags = extractTags(fullContent, filePath);
    }

    // 技术栈
    if (!frontmatter.techStack || frontmatter.techStack.length === 0) {
      inferredValues.techStack = inferTechStack(fullContent);
    }

    // 难度
    if (!frontmatter.difficulty) {
      inferredValues.difficulty = assessDifficulty(fullContent);
    }

    // 描述：从开头段落提取
    if (!frontmatter.description && content.trim().length > 0) {
      const firstParagraph = content.split('\n\n')[0];
      if (firstParagraph && firstParagraph.length > 20) {
        inferredValues.description = firstParagraph
          .replace(/[#*`]/g, '')
          .substring(0, 150)
          .trim() + '...';
      }
    }

    // 应用默认值
    for (const [field, defaultValue] of Object.entries(METADATA_SPEC.defaults)) {
      if (!frontmatter[field] && !inferredValues[field]) {
        inferredValues[field] = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
      }
    }

    return {
      filePath,
      exists: true,
      frontmatter,
      content,
      missingRequired,
      missingRecommended,
      formatIssues,
      inferredValues,
      needsUpdate: missingRequired.length > 0 ||
                   missingRecommended.length > 0 ||
                   formatIssues.length > 0 ||
                   Object.keys(inferredValues).length > 0
    };
  } catch (error) {
    return {
      filePath,
      exists: true,
      error: error.message,
      needsUpdate: false
    };
  }
}

/**
 * 更新文件的元数据
 * @param {object} analysis - 分析结果
 * @returns {boolean} 是否成功更新
 */
function updateFileMetadata(analysis) {
  if (!analysis.needsUpdate || analysis.error) {
    return false;
  }

  const { filePath, frontmatter, content, inferredValues } = analysis;

  console.log(`  📝 准备更新: ${filePath}`);

  if (analysis.missingRequired.length > 0) {
    console.log(`    缺失必需字段: ${analysis.missingRequired.join(', ')}`);
  }
  if (analysis.missingRecommended.length > 0) {
    console.log(`    缺失推荐字段: ${analysis.missingRecommended.join(', ')}`);
  }
  if (analysis.formatIssues.length > 0) {
    console.log(`    格式问题: ${analysis.formatIssues.map(i => `${i.field}: ${i.issue}`).join(', ')}`);
  }

  if (CONFIG.dryRun) {
    console.log(`  🔄 模拟运行，不会实际修改文件`);
    return false;
  }

  try {
    // 合并现有frontmatter和推断值
    const updatedFrontmatter = { ...frontmatter, ...inferredValues };

    // 确保数组字段确实是数组
    for (const field of ['tags', 'techStack', 'prerequisites']) {
      if (updatedFrontmatter[field] && !Array.isArray(updatedFrontmatter[field])) {
        if (typeof updatedFrontmatter[field] === 'string') {
          updatedFrontmatter[field] = [updatedFrontmatter[field]];
        } else {
          delete updatedFrontmatter[field];
        }
      }
    }

    // 写入更新后的文件
    fileUtils.writeFileWithFrontmatter(filePath, updatedFrontmatter, content);

    console.log(`  ✅ 更新完成: 添加了 ${Object.keys(inferredValues).length} 个字段`);
    return true;
  } catch (error) {
    console.error(`  ❌ 更新失败: ${error.message}`);
    return false;
  }
}

/**
 * 生成元数据同步报告
 * @param {object[]} allAnalyses - 所有文件的分析结果
 * @param {number} updatedCount - 更新的文件数量
 */
function generateMetadataReport(allAnalyses, updatedCount) {
  const reportDir = path.join(fileUtils.getKnowledgeBasePath(), 'scripts/claude/logs');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const reportFile = path.join(reportDir, `metadata-sync-report-${dateStr}.md`);

  let reportContent = `# 元数据同步报告 ${dateStr}\n\n`;
  reportContent += `生成时间: ${new Date().toISOString()}\n`;
  reportContent += `更新模式: ${CONFIG.dryRun ? '模拟运行' : '实际更新'}\n`;
  reportContent += `扫描文件数: ${allAnalyses.length}\n`;
  reportContent += `需要更新的文件数: ${allAnalyses.filter(a => a.needsUpdate).length}\n`;
  reportContent += `实际更新的文件数: ${updatedCount}\n\n`;

  // 汇总统计
  let totalRequiredMissing = 0;
  let totalRecommendedMissing = 0;
  let totalFormatIssues = 0;
  const fieldStats = {};

  for (const analysis of allAnalyses) {
    if (analysis.exists && !analysis.error) {
      totalRequiredMissing += analysis.missingRequired.length;
      totalRecommendedMissing += analysis.missingRecommended.length;
      totalFormatIssues += analysis.formatIssues.length;

      // 统计各字段存在情况
      for (const field of [...METADATA_SPEC.required, ...METADATA_SPEC.recommended]) {
        if (analysis.frontmatter[field]) {
          fieldStats[field] = (fieldStats[field] || 0) + 1;
        }
      }
    }
  }

  const totalFiles = allAnalyses.filter(a => a.exists && !a.error).length;

  reportContent += `## 汇总统计\n\n`;
  reportContent += `- 扫描文件总数: ${allAnalyses.length}\n`;
  reportContent += `- 有效文件数: ${totalFiles}\n`;
  reportContent += `- 缺失必需字段总数: ${totalRequiredMissing}\n`;
  reportContent += `- 缺失推荐字段总数: ${totalRecommendedMissing}\n`;
  reportContent += `- 格式问题总数: ${totalFormatIssues}\n\n`;

  // 字段覆盖率
  reportContent += `## 字段覆盖率\n\n`;
  for (const field of [...METADATA_SPEC.required, ...METADATA_SPEC.recommended]) {
    const count = fieldStats[field] || 0;
    const coverage = totalFiles > 0 ? ((count / totalFiles) * 100).toFixed(1) : 0;
    const isRequired = METADATA_SPEC.required.includes(field);
    reportContent += `- ${field}${isRequired ? ' (必需)' : ''}: ${count}/${totalFiles} (${coverage}%)\n`;
  }
  reportContent += '\n';

  // 需要更新的文件列表
  const filesNeedingUpdate = allAnalyses.filter(a => a.needsUpdate && !a.error);
  if (filesNeedingUpdate.length > 0) {
    reportContent += `## 需要更新的文件\n\n`;
    for (const analysis of filesNeedingUpdate) {
      reportContent += `### ${analysis.filePath}\n\n`;
      if (analysis.missingRequired.length > 0) {
        reportContent += `- 缺失必需字段: ${analysis.missingRequired.join(', ')}\n`;
      }
      if (analysis.missingRecommended.length > 0) {
        reportContent += `- 缺失推荐字段: ${analysis.missingRecommended.join(', ')}\n`;
      }
      if (analysis.formatIssues.length > 0) {
        reportContent += `- 格式问题:\n`;
        for (const issue of analysis.formatIssues) {
          reportContent += `  - ${issue.field}: ${issue.issue}\n`;
        }
      }
      if (Object.keys(analysis.inferredValues).length > 0) {
        reportContent += `- 推断的值: ${Object.keys(analysis.inferredValues).join(', ')}\n`;
      }
      reportContent += '\n';
    }
  }

  // 建议
  reportContent += `## 建议\n\n`;
  if (totalRequiredMissing > 0) {
    reportContent += `1. 优先修复缺失的必需字段（title, date）\n`;
  }
  if (totalRecommendedMissing > totalFiles * 0.3) {
    reportContent += `2. 推荐字段覆盖率较低，建议批量添加\n`;
  }
  if (totalFormatIssues > 0) {
    reportContent += `3. 修复格式问题，确保元数据一致性\n`;
  }
  reportContent += `4. 定期运行元数据同步脚本，保持知识库规范性\n`;

  fs.writeFileSync(reportFile, reportContent, 'utf8');
  console.log(`\n📄 报告已生成: ${reportFile}`);
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 元数据同步脚本\n');
  console.log('=' .repeat(60));

  // 查找所有Markdown文件
  const rootDir = fileUtils.getKnowledgeBasePath();
  let allFiles = fileUtils.findMarkdownFiles(rootDir, [
    'node_modules', 'public', 'scripts', 'quartz', '.git', '.obsidian',
    'xx-归档', 'xx-草稿', 'Prompt', '书籍'
  ], [
    'README.md', 'index.md', '404.md'
  ]);

  if (CONFIG.specificDir) {
    // 过滤特定目录的文件
    allFiles = allFiles.filter(file => file.includes(CONFIG.specificDir));
    console.log(`\n🔍 找到 ${allFiles.length} 个Markdown文件（限制在目录: ${CONFIG.specificDir}）`);
  } else {
    console.log(`\n🔍 找到 ${allFiles.length} 个Markdown文件`);
  }

  if (allFiles.length === 0) {
    console.log('❌ 未找到Markdown文件，请检查知识库结构');
    return;
  }

  // 分析每个文件的元数据
  const allAnalyses = [];
  let updatedCount = 0;

  console.log('\n📊 开始分析元数据...\n');

  for (const file of allFiles) {
    if (CONFIG.verbose) {
      console.log(`分析: ${file}`);
    }

    const analysis = analyzeFileMetadata(file);
    allAnalyses.push(analysis);

    // 更新文件元数据
    const updated = updateFileMetadata(analysis);
    if (updated) {
      updatedCount++;
    }
  }

  // 生成报告
  generateMetadataReport(allAnalyses, updatedCount);

  console.log('\n' + '=' .repeat(60));
  console.log('🎉 元数据同步完成！');
  console.log(`📊 统计: 分析了 ${allAnalyses.length} 个文件，更新了 ${updatedCount} 个`);

  if (CONFIG.dryRun) {
    console.log('💡 本次为模拟运行，使用 --dry-run 参数查看实际效果');
  }
}

// 命令行参数解析
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
元数据同步脚本

用法:
  node scripts/claude/metadata/sync-frontmatter.js [选项] [目录]

选项:
  --dry-run     模拟运行，不实际修改文件
  --verbose     显示详细输出
  --force       强制更新最后修改时间等字段
  --help, -h    显示帮助信息

示例:
  # 检查并同步所有文件的元数据
  node scripts/claude/metadata/sync-frontmatter.js

  # 模拟运行，查看更新效果
  node scripts/claude/metadata/sync-frontmatter.js --dry-run

  # 只同步特定目录的文件
  node scripts/claude/metadata/sync-frontmatter.js 00-前端体系

  # 强制更新最后修改时间
  node scripts/claude/metadata/sync-frontmatter.js --force
  `);
  process.exit(0);
}

main();