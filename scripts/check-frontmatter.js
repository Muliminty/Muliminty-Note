#!/usr/bin/env node
/**
 * check-frontmatter.js
 * 检查 Markdown 文件的 Frontmatter 合规性
 *
 * 用法：
 *   node scripts/check-frontmatter.js          # 全量扫描
 *   node scripts/check-frontmatter.js --staged # 仅检查 git staged 文件
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

// ─── 配置 ──────────────────────────────────────────────────────────────────────

const EXCLUDE_DIRS = [
  '99-系统/99-参考与归档',
  '.git',
  '.obsidian',
  '.agents',
  '.claude',
  '.codex',
  '.github',
  '.hinote',
  '.windsurf',
  'node_modules',
  'static',
  'public',
  'reports',
  'scripts',
  '.quartz-cache',
];

const EXCLUDE_PATTERNS = [
  /^README\.md$/,
  /^!MOC-/,
  /^AGENTS\.md$/,
  /^CLAUDE\.md$/,
  /^404\.md$/,
  /^index\.md$/,
];

const KNOWLEDGE_BASE_DIR = '98-知识库';
const KNOWLEDGE_BASE_REQUIRED = ['title', 'date', 'tags'];
const STANDARD_REQUIRED = ['title', 'date', 'tags', 'status'];

// ─── 工具函数 ──────────────────────────────────────────────────────────────────

function isExcludedDir(relativePath) {
  return EXCLUDE_DIRS.some(dir => relativePath.startsWith(dir));
}

function isExcludedFile(filename) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(filename));
}

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const fields = {};

  // 检查 kanban-plugin 特殊格式
  if (yaml.includes('kanban-plugin')) {
    return { __kanban: true };
  }

  // 简单 YAML 解析（仅检查顶层字段是否存在）
  for (const line of yaml.split('\n')) {
    const fieldMatch = line.match(/^(\w[\w-]*):\s*/);
    if (fieldMatch) {
      fields[fieldMatch[1]] = true;
    }
  }

  return fields;
}

function collectMarkdownFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(ROOT, fullPath);

    if (entry.isDirectory()) {
      if (!isExcludedDir(relativePath)) {
        collectMarkdownFiles(fullPath, files);
      }
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      if (!isExcludedFile(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      cwd: ROOT,
      encoding: 'utf-8',
    });
    return output
      .trim()
      .split('\n')
      .filter(f => f.endsWith('.md'))
      .map(f => path.join(ROOT, f))
      .filter(f => {
        const rel = path.relative(ROOT, f);
        const filename = path.basename(f);
        return !isExcludedDir(rel) && !isExcludedFile(filename);
      });
  } catch {
    return [];
  }
}

// ─── 主逻辑 ──────────────────────────────────────────────────────────────────

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(ROOT, filePath);
  const fields = parseFrontmatter(content);

  // 无 frontmatter
  if (!fields) {
    return { file: relativePath, error: '缺少 Frontmatter' };
  }

  // kanban 文件跳过
  if (fields.__kanban) {
    return null;
  }

  // 判断应该用哪套规则
  const isKnowledgeBase = relativePath.startsWith(KNOWLEDGE_BASE_DIR);
  const required = isKnowledgeBase ? KNOWLEDGE_BASE_REQUIRED : STANDARD_REQUIRED;

  const missing = required.filter(field => !fields[field]);
  if (missing.length > 0) {
    return {
      file: relativePath,
      error: `缺少必填字段：${missing.join(', ')}`,
    };
  }

  return null;
}

function main() {
  const isStaged = process.argv.includes('--staged');

  const files = isStaged ? getStagedFiles() : collectMarkdownFiles(ROOT);

  if (files.length === 0) {
    if (isStaged) {
      process.exit(0); // 没有 staged 的 md 文件
    }
    console.log('未找到 Markdown 文件');
    process.exit(0);
  }

  const errors = [];

  for (const file of files) {
    const result = checkFile(file);
    if (result) {
      errors.push(result);
    }
  }

  // 输出结果
  if (errors.length === 0) {
    console.log(`✅ 检查通过：${files.length} 个文件均合规`);
    process.exit(0);
  }

  console.log(`\n❌ Frontmatter 合规检查未通过（${errors.length} 个问题）：\n`);

  for (const { file, error } of errors) {
    console.log(`  - ${file}`);
    console.log(`    ${error}\n`);
  }

  if (isStaged) {
    console.log('提交已阻止。请补充 Frontmatter 后重新 commit。');
    console.log('规范参考：99-系统/01-百科写作规范.md §3\n');
  } else {
    console.log(`共 ${files.length} 个文件，${errors.length} 个不合规。`);
    console.log(`合规率：${((1 - errors.length / files.length) * 100).toFixed(1)}%\n`);
  }

  process.exit(isStaged ? 1 : 0);
}

main();
