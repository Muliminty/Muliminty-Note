#!/usr/bin/env node
/**
 * MOC自动更新脚本
 * 扩展check-moc-links.js功能，提供自动更新MOC索引的能力
 * 功能：
 * 1. 检查MOC完整性（重用check-moc-links.js逻辑）
 * 2. 自动添加缺失链接到MOC
 * 3. 移除无效链接
 * 4. 生成更新报告
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const fileUtils = require('../utils/file-utils');

// 配置
const CONFIG = {
  dryRun: process.argv.includes('--dry-run'),
  verbose: process.argv.includes('--verbose'),
  specificDir: process.argv.slice(2).find(arg => !arg.startsWith('--')) || null
};

/**
 * 运行现有检查脚本并解析输出
 */
function runCheckScripts() {
  console.log('🔍 运行MOC完整性检查...\n');

  try {
    // 运行check-moc-links.js
    const checkOutput = execSync('node scripts/check-moc-links.js', { encoding: 'utf8' });
    console.log(checkOutput);

    // 运行check-wikilinks.js
    const wikilinkOutput = execSync('node scripts/check-wikilinks.js', { encoding: 'utf8' });
    console.log(wikilinkOutput);

    return { checkOutput, wikilinkOutput };
  } catch (error) {
    console.error('检查脚本执行失败:', error.message);
    return null;
  }
}

/**
 * 分析目录结构，找出需要添加到MOC的文件
 * @param {string} mocPath - MOC文件路径
 * @returns {object} 分析结果
 */
function analyzeMocDirectory(mocPath) {
  const rootDir = fileUtils.getKnowledgeBasePath();
  const mocDir = path.dirname(mocPath);
  const mocName = path.basename(mocPath);

  console.log(`\n📊 分析MOC: ${mocName}`);

  // 获取目录下所有Markdown文件（排除MOC文件）
  const allFiles = fileUtils.findMarkdownFiles(mocDir, [
    'node_modules', 'public', 'scripts', 'quartz', '.git', '.obsidian',
    'xx-归档', 'xx-草稿', 'Prompt', '书籍'
  ], [
    'README.md', 'index.md', '404.md'
  ]);

  const contentFiles = allFiles.filter(file => !file.includes('!MOC-'));

  // 读取MOC内容
  let mocContent = '';
  try {
    mocContent = fs.readFileSync(mocPath, 'utf8');
  } catch (error) {
    console.error(`无法读取MOC文件: ${mocPath}`, error.message);
    return { mocPath, contentFiles, existingLinks: [], missingFiles: [] };
  }

  // 提取现有链接
  const existingLinks = fileUtils.extractLinksFromMarkdown(mocContent, mocDir);

  // 找出缺失链接的文件
  const missingFiles = [];
  for (const file of contentFiles) {
    const fileName = path.basename(file);
    const filePath = path.join(mocDir, file).replace(/\\/g, '/');

    // 检查是否在现有链接中
    const hasLink = existingLinks.some(link => {
      if (link.type === 'markdown') {
        const linkFullPath = path.resolve(mocDir, link.path).replace(/\\/g, '/');
        return linkFullPath === filePath;
      }
      return false;
    });

    if (!hasLink) {
      missingFiles.push({
        file,
        fileName,
        fullPath: filePath
      });
    }
  }

  // 找出无效链接（链接指向不存在的文件）
  const invalidLinks = [];
  for (const link of existingLinks) {
    if (link.type === 'markdown') {
      const linkPath = path.resolve(mocDir, link.path);
      if (!fs.existsSync(linkPath)) {
        invalidLinks.push(link);
      }
    }
  }

  return {
    mocPath,
    mocDir,
    mocName,
    contentFiles,
    existingLinks,
    missingFiles,
    invalidLinks,
    totalFiles: contentFiles.length,
    linkedFiles: contentFiles.length - missingFiles.length,
    linkCoverage: contentFiles.length > 0 ?
      ((contentFiles.length - missingFiles.length) / contentFiles.length * 100).toFixed(1) : 0
  };
}

/**
 * 为文件生成MOC链接项
 * @param {object} fileInfo - 文件信息
 * @param {string} mocDir - MOC所在目录
 * @returns {string} Markdown链接项
 */
function generateLinkItem(fileInfo, mocDir) {
  const relativePath = path.relative(mocDir, fileInfo.fullPath).replace(/\\/g, '/');
  const fileName = fileInfo.fileName.replace('.md', '');

  // 尝试读取文件获取标题
  let title = fileName;
  try {
    const content = fs.readFileSync(fileInfo.fullPath, 'utf8');

    // 提取YAML frontmatter中的title
    const frontmatterMatch = content.match(/^---\s*\ntitle:\s*["']?([^"'\n]+)["']?\s*\n/);
    if (frontmatterMatch) {
      title = frontmatterMatch[1];
    }
    // 提取一级标题
    else {
      const h1Match = content.match(/^#\s+(.+)$/m);
      if (h1Match) {
        title = h1Match[1];
      }
    }
  } catch (error) {
    // 如果无法读取文件，使用文件名
  }

  return `- [${title}](${relativePath})`;
}

/**
 * 更新MOC文件，添加缺失链接
 * @param {object} analysis - 分析结果
 * @returns {boolean} 是否成功更新
 */
function updateMocFile(analysis) {
  const { mocPath, mocDir, missingFiles, invalidLinks } = analysis;

  if (missingFiles.length === 0 && invalidLinks.length === 0) {
    console.log(`  ✅ ${analysis.mocName} 已经是最新的，无需更新`);
    return false;
  }

  console.log(`  📝 准备更新 ${analysis.mocName}:`);
  if (missingFiles.length > 0) {
    console.log(`    需要添加 ${missingFiles.length} 个缺失链接`);
  }
  if (invalidLinks.length > 0) {
    console.log(`    需要移除 ${invalidLinks.length} 个无效链接`);
  }

  if (CONFIG.dryRun) {
    console.log(`  🔄 模拟运行，不会实际修改文件`);
    return false;
  }

  try {
    // 读取原始内容
    let content = fs.readFileSync(mocPath, 'utf8');

    // 移除无效链接
    for (const link of invalidLinks) {
      content = content.replace(link.raw + '\n', '');
      content = content.replace(link.raw, '');
      console.log(`    ❌ 移除无效链接: ${link.text}`);
    }

    // 添加缺失链接
    let addedCount = 0;
    for (const file of missingFiles) {
      const linkItem = generateLinkItem(file, mocDir);

      // 寻找合适的位置插入（在链接列表的末尾）
      const lines = content.split('\n');
      let insertIndex = lines.length;

      // 查找最后一个链接项的位置
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].match(/^- \[.+\]\(\.\/.+\.md\)/)) {
          insertIndex = i + 1;
          break;
        }
      }

      // 如果没有找到链接项，在文件末尾添加
      lines.splice(insertIndex, 0, linkItem);
      content = lines.join('\n');
      addedCount++;
      console.log(`    ✅ 添加链接: ${file.fileName}`);
    }

    // 写入更新后的内容
    fs.writeFileSync(mocPath, content, 'utf8');
    console.log(`  ✨ 更新完成: 添加了 ${addedCount} 个链接，移除了 ${invalidLinks.length} 个无效链接`);

    return true;
  } catch (error) {
    console.error(`  ❌ 更新失败: ${error.message}`);
    return false;
  }
}

/**
 * 生成更新报告
 * @param {object[]} allAnalyses - 所有MOC的分析结果
 * @param {number} updatedCount - 更新的MOC数量
 */
function generateReport(allAnalyses, updatedCount) {
  const reportDir = path.join(fileUtils.getKnowledgeBasePath(), 'scripts/claude/logs');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const reportFile = path.join(reportDir, `moc-update-report-${dateStr}.md`);

  let reportContent = `# MOC更新报告 ${dateStr}\n\n`;
  reportContent += `生成时间: ${new Date().toISOString()}\n`;
  reportContent += `更新模式: ${CONFIG.dryRun ? '模拟运行' : '实际更新'}\n`;
  reportContent += `处理的MOC数量: ${allAnalyses.length}\n`;
  reportContent += `更新的MOC数量: ${updatedCount}\n\n`;

  // 汇总统计
  let totalFiles = 0;
  let totalLinkedFiles = 0;
  let totalMissingFiles = 0;
  let totalInvalidLinks = 0;

  for (const analysis of allAnalyses) {
    totalFiles += analysis.totalFiles;
    totalLinkedFiles += analysis.linkedFiles;
    totalMissingFiles += analysis.missingFiles.length;
    totalInvalidLinks += analysis.invalidLinks.length;
  }

  const overallCoverage = totalFiles > 0 ? (totalLinkedFiles / totalFiles * 100).toFixed(1) : 0;

  reportContent += `## 汇总统计\n\n`;
  reportContent += `- 总文件数: ${totalFiles}\n`;
  reportContent += `- 已链接文件数: ${totalLinkedFiles}\n`;
  reportContent += `- 缺失链接文件数: ${totalMissingFiles}\n`;
  reportContent += `- 无效链接数: ${totalInvalidLinks}\n`;
  reportContent += `- 整体链接覆盖率: ${overallCoverage}%\n\n`;

  // 详细分析
  reportContent += `## 详细分析\n\n`;
  for (const analysis of allAnalyses) {
    reportContent += `### ${analysis.mocName}\n\n`;
    reportContent += `- 目录: ${analysis.mocDir}\n`;
    reportContent += `- 文件总数: ${analysis.totalFiles}\n`;
    reportContent += `- 已链接文件: ${analysis.linkedFiles}\n`;
    reportContent += `- 缺失链接: ${analysis.missingFiles.length}\n`;
    reportContent += `- 无效链接: ${analysis.invalidLinks.length}\n`;
    reportContent += `- 链接覆盖率: ${analysis.linkCoverage}%\n\n`;

    if (analysis.missingFiles.length > 0) {
      reportContent += `#### 缺失链接的文件\n`;
      for (const file of analysis.missingFiles) {
        reportContent += `- ${file.fileName}\n`;
      }
      reportContent += '\n';
    }

    if (analysis.invalidLinks.length > 0) {
      reportContent += `#### 无效链接\n`;
      for (const link of analysis.invalidLinks) {
        reportContent += `- ${link.text} -> ${link.path}\n`;
      }
      reportContent += '\n';
    }
  }

  // 建议
  reportContent += `## 建议\n\n`;
  if (totalMissingFiles > 0) {
    reportContent += `1. 建议定期运行MOC更新脚本，保持索引完整性\n`;
  }
  if (totalInvalidLinks > 0) {
    reportContent += `2. 检查并修复无效链接指向的文件\n`;
  }
  if (overallCoverage < 90) {
    reportContent += `3. 当前链接覆盖率较低，建议加强MOC维护\n`;
  }

  fs.writeFileSync(reportFile, reportContent, 'utf8');
  console.log(`\n📄 报告已生成: ${reportFile}`);
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 MOC自动更新脚本\n');
  console.log('=' .repeat(60));

  // 运行现有检查脚本
  runCheckScripts();

  // 查找所有MOC文件
  const mocFiles = fileUtils.findMocFiles();

  if (CONFIG.specificDir) {
    // 过滤特定目录的MOC
    const filteredMocFiles = mocFiles.filter(file =>
      file.includes(CONFIG.specificDir)
    );
    console.log(`\n🔍 找到 ${filteredMocFiles.length} 个MOC文件（限制在目录: ${CONFIG.specificDir}）`);
    mocFiles.length = 0;
    mocFiles.push(...filteredMocFiles);
  } else {
    console.log(`\n🔍 找到 ${mocFiles.length} 个MOC文件`);
  }

  if (mocFiles.length === 0) {
    console.log('❌ 未找到MOC文件，请检查知识库结构');
    return;
  }

  // 分析每个MOC
  const allAnalyses = [];
  let updatedCount = 0;

  for (const mocFile of mocFiles) {
    const mocPath = path.join(fileUtils.getKnowledgeBasePath(), mocFile);
    const analysis = analyzeMocDirectory(mocPath);
    allAnalyses.push(analysis);

    // 更新MOC文件
    const updated = updateMocFile(analysis);
    if (updated) {
      updatedCount++;
    }
  }

  // 生成报告
  generateReport(allAnalyses, updatedCount);

  console.log('\n' + '=' .repeat(60));
  console.log('🎉 MOC更新完成！');
  console.log(`📊 统计: 分析了 ${allAnalyses.length} 个MOC，更新了 ${updatedCount} 个`);

  if (CONFIG.dryRun) {
    console.log('💡 本次为模拟运行，使用 --dry-run 参数查看实际效果');
  }
}

// 命令行参数解析
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
MOC自动更新脚本

用法:
  node scripts/claude/moc/update-moc.js [选项] [目录]

选项:
  --dry-run     模拟运行，不实际修改文件
  --verbose     显示详细输出
  --help, -h    显示帮助信息

示例:
  # 检查并更新所有MOC
  node scripts/claude/moc/update-moc.js

  # 模拟运行，查看更新效果
  node scripts/claude/moc/update-moc.js --dry-run

  # 只更新特定目录的MOC
  node scripts/claude/moc/update-moc.js 00-前端体系
  `);
  process.exit(0);
}

main();