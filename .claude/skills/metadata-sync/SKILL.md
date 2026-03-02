---
name: metadata-sync
description: 元数据同步 - 统一知识库中YAML frontmatter格式，维护元数据一致性
argument-hint: [同步模式，可选：check, sync, report，默认为check]
---

请帮我同步知识库中的元数据，确保YAML frontmatter格式统一和完整。

**功能说明：**
/metadata-sync 是编程知识库的元数据管理系统，提供以下功能：

1. **元数据格式检查** - 检查YAML frontmatter格式是否符合规范
2. **缺失元数据补充** - 自动添加缺失的必需元数据字段
3. **元数据标准化** - 统一标签、分类、技术栈等格式
4. **一致性报告** - 生成元数据一致性报告和改进建议

**检查项：**

1. **必需字段**
   - `title`: 文章标题
   - `date`: 创建日期
   - `lastModified`: 最后修改日期（可自动生成）

2. **推荐字段**
   - `description`: 文章描述
   - `tags`: 标签数组
   - `category`: 分类
   - `techStack`: 技术栈数组
   - `difficulty`: 难度级别
   - `prerequisites`: 前置知识
   - `toc`: 是否显示目录

3. **格式规范**
   - 日期格式：`YYYY-MM-DD`
   - 数组格式：`[项目1, 项目2]`
   - 布尔值：`true` 或 `false`
   - 字符串：使用引号（如包含特殊字符）

**执行步骤：**

1. **模式选择**
   - `check`: 只检查不修改（默认）
   - `sync`: 检查并自动修复
   - `report`: 生成详细报告

2. **文件扫描**
   ```bash
   # 查找所有Markdown文件
   find . -name "*.md" -type f | grep -v node_modules | grep -v .git | grep -v public

   # 检查YAML frontmatter存在性
   grep -l "^---" $(find . -name "*.md")
   ```

3. **元数据分析**
   - 解析现有frontmatter结构
   - 识别缺失字段和格式问题
   - 评估标准化程度

4. **修复执行**（sync模式）
   - 添加缺失字段（如`date`, `lastModified`）
   - 修正格式错误
   - 标准化标签和分类

**输出位置：**
- 控制台：问题列表和修复建议
- 报告文件：`scripts/claude/logs/metadata-sync-YYYY-MM-DD.md`
- 备份文件：`.backup/metadata-sync-YYYY-MM-DD/`（修复前备份）

**元数据规范：**

```yaml
---
# 必需字段
title: "文章标题"
date: "YYYY-MM-DD"
lastModified: "YYYY-MM-DD"

# 推荐字段
description: "文章描述，约50-100字"
tags: ["标签1", "标签2", "标签3"]
category: "技术分类"
techStack: ["JavaScript", "React", "Node.js"]
difficulty: "beginner"  # beginner, intermediate, advanced
prerequisites: ["前置知识1", "前置知识2"]
toc: true

# 扩展字段（可选）
status: "draft|published|archived"
readingTime: 10
progress: "0%|25%|50%|75%|100%"
---
```

**参数说明：**
- `$ARGUMENTS[0]` - 同步模式（check, sync, report，默认为check）
- `$ARGUMENTS[1]` - 特定目录（可选，限制扫描范围）
- `$ARGUMENTS[2]` - 报告格式（可选：markdown, json, html）

**使用示例：**
```bash
# 检查元数据完整性
/metadata-sync

# 检查特定目录
/metadata-sync check 00-前端体系

# 自动同步修复
/metadata-sync sync

# 生成详细报告
/metadata-sync report
```

**修复策略：**

1. **必需字段修复**
   - `date`: 使用文件创建时间（stat信息）
   - `lastModified`: 使用文件修改时间
   - `title`: 从文件名或一级标题提取

2. **推荐字段优化**
   - `description`: 从开头段落自动提取摘要
   - `tags`: 从内容中提取关键词
   - `category`: 根据目录位置推断
   - `techStack`: 分析代码块和术语

3. **格式标准化**
   - 统一日期格式
   - 数组排序和去重
   - 布尔值规范化

**智能特性：**

1. **上下文感知**
   - 根据目录结构推断分类
   - 根据内容复杂度评估难度
   - 识别技术栈使用模式

2. **渐进式修复**
   - 支持预览修改内容
   - 可选择性应用修复
   - 保留用户自定义字段

3. **学习能力**
   - 记录常见修复模式
   - 优化标签提取算法
   - 改进分类推荐准确性

**成功标准：**
- 必需字段完整率100%
- 推荐字段覆盖率达到80%以上
- 格式标准化程度达到90%以上
- 修复准确率达到95%以上

**注意事项：**
- 修复前建议备份重要文件
- 可先运行`check`模式了解问题范围
- 支持批量处理和单文件修复
- 定期运行维护元数据一致性

**集成功能：**
- 与MOC系统集成，更新元数据后自动调整索引
- 支持导出报告，便于跟踪改进进度
- 可与CI/CD流程结合，确保提交时元数据合规