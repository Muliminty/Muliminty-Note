---
name: moc-manage
description: MOC管理系统 - 自动检查、更新和维护知识库的MOC索引文件
argument-hint: [操作模式，可选：check, update, report，默认为check]
---

请帮我执行MOC管理操作，维护编程知识库的MOC索引系统。

**功能说明：**
/moc-manage 是编程知识库的MOC管理系统，基于现有脚本增强，提供以下功能：

1. **MOC完整性检查** - 检查MOC文件中引用的文件是否存在，文件夹中的文件是否都在MOC中有链接
2. **MOC自动更新** - 自动将新文件添加到对应MOC，维护索引完整性
3. **MOC报告生成** - 生成MOC系统健康状况报告
4. **双链引用检查** - 检查笔记中的双链引用是否有效

**执行步骤：**

1. **模式选择**
   - `check`：运行完整性检查（默认）
   - `update`：自动更新MOC索引
   - `report`：生成详细报告

2. **数据收集**
   ```bash
   # 查找所有MOC文件
   find . -name "!MOC-*.md" -type f | grep -v node_modules | grep -v .git

   # 统计各分类文件数量
   find . -name "*.md" -type f | grep -v "!MOC-" | wc -l
   ```

3. **执行操作**
   - 检查模式：运行 `node scripts/check-moc-links.js` 和 `node scripts/check-wikilinks.js`
   - 更新模式：运行 `node scripts/claude/moc/update-moc.js`
   - 报告模式：生成综合报告

**输出位置：**
- 控制台：实时显示检查结果和问题列表
- 日志文件：`scripts/claude/logs/moc-check-YYYY-MM-DD.log`

**检查项：**

1. **MOC文件完整性**
   - MOC中引用的文件是否真实存在
   - 文件夹中的文件是否都在MOC中有链接
   - MOC文件格式是否正确

2. **双链引用有效性**
   - 双链引用的文件是否存在
   - 双链格式是否正确
   - 跨目录引用路径是否正确
   - 锚点是否存在

3. **学习路径完整性**
   - MOC中的学习路径是否连贯
   - 前置知识是否已覆盖
   - 进阶内容是否有基础支撑

**参数说明：**
- `$ARGUMENTS[0]` - 操作模式（check, update, report，默认为check）
- `$ARGUMENTS[1]` - 特定目录（可选，限制检查范围）

**使用示例：**
```bash
# 检查所有MOC完整性
/moc-manage

# 检查特定目录的MOC
/moc-manage check 00-前端体系

# 自动更新MOC索引
/moc-manage update

# 生成详细报告
/moc-manage report
```

**数据依赖：**
- MOC文件：所有以 `!MOC-` 开头的Markdown文件
- 内容文件：知识库中的所有Markdown文件
- 现有脚本：`scripts/check-moc-links.js` 和 `scripts/check-wikilinks.js`

**集成功能：**
- 重用现有检查脚本，保持兼容性
- 支持渐进式更新，避免大规模重写
- 提供修复建议和自动化选项

**错误处理：**
- 缺失文件：列出具体路径，建议创建或删除引用
- 缺失链接：提供快速添加链接的命令
- 格式错误：提示正确格式和修复方法

**成功标准：**
- 所有MOC引用的文件都存在
- 所有内容文件都在对应MOC中有链接
- 双链引用100%有效
- 学习路径逻辑连贯

**注意事项：**
- 首次运行建议使用 `check` 模式了解当前状态
- 更新前建议备份重要MOC文件
- 定期运行维护知识库结构健康