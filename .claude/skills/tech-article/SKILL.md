---
name: tech-article
description: 技术文章创建 - 基于模板创建标准化的技术文章，自动填充元数据和结构
argument-hint: [文章类型，可选：basic, tutorial, api, review，默认为basic]
---

请帮我创建标准化的技术文章，适用于编程知识库。

**功能说明：**
/tech-article 是编程知识库的技术文章创建系统，提供以下功能：

1. **模板化创建** - 基于预定义模板创建技术文章
2. **元数据自动填充** - 自动生成YAML frontmatter，包含技术栈、难度级别等
3. **结构标准化** - 确保文章结构符合知识库规范
4. **智能位置推荐** - 根据内容推荐存放目录

**文章类型：**

1. **基础技术文章** (`basic`)
   - 技术概念解析
   - 原理说明
   - 最佳实践总结

2. **教程类文章** (`tutorial`)
   - 步骤式教程
   - 实战案例
   - 代码示例丰富

3. **API文档** (`api`)
   - API接口说明
   - 参数详解
   - 使用示例

4. **代码审查报告** (`review`)
   - 代码分析
   - 优化建议
   - 重构方案

**执行步骤：**

1. **类型选择**
   - 确定文章类型和对应模板
   - 收集文章基本信息（标题、技术栈、目标读者等）

2. **模板应用**
   ```bash
   # 根据类型选择模板
   template=".templates/tech-article/basic.md"
   case $type in
     "tutorial") template=".templates/tech-article/tutorial.md" ;;
     "api") template=".templates/tech-article/api-reference.md" ;;
     "review") template=".templates/tech-article/code-review.md" ;;
   esac
   ```

3. **元数据生成**
   - 自动填充创建日期、最后修改时间
   - 根据内容提取关键词作为标签
   - 设置技术栈和难度级别

4. **目录推荐**
   - 分析内容主题，推荐存放目录
   - 检查相关MOC，建议添加链接

**输出位置：**
- 文件：`[推荐目录]/[标准化文件名].md`
- 格式：包含完整YAML frontmatter的Markdown

**模板结构示例：**

```yaml
---
title: 文章标题
description: 文章描述
date: YYYY-MM-DD
lastModified: YYYY-MM-DD
tags: [标签1, 标签2]
category: 技术分类
techStack: [技术栈]
difficulty: beginner|intermediate|advanced
prerequisites: [前置知识]
toc: true
---

# 标题

## 概述

## 核心概念

## 实践示例

## 总结

## 参考链接
```

**参数说明：**
- `$ARGUMENTS[0]` - 文章类型（basic, tutorial, api, review，默认为basic）
- `$ARGUMENTS[1]` - 文章标题（可选，可后续输入）
- `$ARGUMENTS[2]` - 目标目录（可选，自动推荐）

**使用示例：**
```bash
# 创建基础技术文章
/tech-article

# 创建教程类文章
/tech-article tutorial "React Hooks入门教程"

# 创建API文档
/tech-article api "Node.js FS模块API详解"

# 创建代码审查报告
/tech-article review "用户认证模块代码优化"
```

**交互流程：**

1. **信息收集**
   - 文章标题和简要描述
   - 主要技术栈和受众
   - 关键概念和要点

2. **模板选择**
   - 根据内容特点推荐模板
   - 支持自定义调整

3. **内容填充**
   - 自动生成大纲结构
   - 提供写作提示和建议

4. **元数据完善**
   - 自动提取关键词
   - 设置合理分类和标签
   - 评估难度级别

**智能特性：**

1. **技术栈识别**
   - 自动识别文章涉及的技术栈
   - 推荐相关前置知识
   - 提示学习路径

2. **内容关联**
   - 推荐知识库中相关文章
   - 建议添加到对应MOC
   - 建立双向链接

3. **质量检查**
   - 检查技术术语准确性
   - 验证代码示例格式
   - 确保结构完整性

**成功标准：**
- 文章结构符合模板规范
- 元数据完整且准确
- 技术术语使用正确
- 代码示例可运行（如适用）

**注意事项：**
- 模板可根据需要自定义扩展
- 元数据可后续修改
- 建议定期更新技术文章保持时效性
- 复杂文章可分段创建，最后整合