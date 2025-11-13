# Scripts 脚本说明文档

本目录包含用于构建、开发和维护 Quartz 笔记站点的各种脚本工具。

## 📋 脚本列表

### 构建相关

#### `build.sh`
**功能**：Quartz 构建脚本，用于生产环境构建

**主要功能**：
- 清理构建缓存和输出目录（`.quartz-cache` 和 `public`）
- 确保 `quartz` 符号链接存在且有效
- 使用相对路径创建符号链接（在 CI 环境中更可靠）
- 运行 Quartz 构建命令
- 自动修复图片路径和 Markdown 链接

**使用方式**：
```bash
./scripts/build.sh
# 或
npm run build
```

**注意事项**：
- 构建前会自动运行 `prebuild` 钩子，执行 `ensure-link.js` 和 `fix-markdown-links.js`
- 构建后会自动修复图片路径

---

### 开发相关

#### `dev.js`
**功能**：开发服务器脚本，支持热重载和自动修复

**主要功能**：
- 确保 `quartz` 符号链接存在
- 清理构建缓存
- 启动 Quartz 开发服务器（端口 4399）
- 监听 `public` 目录变化，自动修复图片路径
- 支持文件变化自动重建

**使用方式**：
```bash
node scripts/dev.js
# 或
npm run dev
```

**访问地址**：`http://localhost:4399`

---

### 链接和路径修复

#### `ensure-link.js`
**功能**：确保 Quartz 符号链接存在且有效

**主要功能**：
- 检查并创建 `quartz` 符号链接（指向 `node_modules/quartz/quartz`）
- 验证符号链接是否有效
- 如果符号链接损坏或指向绝对路径，自动修复为相对路径
- 注入配置 shim（`node_modules/quartz/quartz.config.ts`）

**使用方式**：
```bash
node scripts/ensure-link.js
```

**自动调用时机**：
- `npm run dev` 前
- `npm run build` 前（通过 `prebuild` 钩子）

---

#### `fix-markdown-links.js`
**功能**：修复 Markdown 文件中的相对路径链接

**主要功能**：
- 修复以 `/` 开头的绝对路径为相对路径
- 为缺少 `./` 前缀的相对路径链接添加前缀
- 递归处理所有 Markdown 文件

**修复示例**：
- `[文本](/路径/文件.md)` → `[文本](路径/文件.md)`
- `[文本](路径/文件.md)` → `[文本](./路径/文件.md)`

**使用方式**：
```bash
node scripts/fix-markdown-links.js
# 或
npm run fix:links
```

**自动调用时机**：
- `npm run build` 前（通过 `prebuild` 钩子）

---

#### `fix-image-paths.js`
**功能**：修复 Quartz 生成的 HTML 文件中的图片路径

**主要功能**：
- 修复错误的相对路径（如 `../../../../img/`）
- 统一转换为正确的相对路径（`img/`）
- 递归处理 `public` 目录中的所有 HTML 文件

**修复示例**：
- `src="../../../../img/window.png"` → `src="img/window.png"`

**使用方式**：
```bash
node scripts/fix-image-paths.js
# 或
npm run fix
```

**自动调用时机**：
- `npm run build` 后
- `dev.js` 监听文件变化时自动调用

---

### 双链检查

#### `check-wikilinks.js`
**功能**：检查笔记中的双链引用，确保在 Quartz 中能正常工作

**主要功能**：
- 扫描所有 Markdown 文件
- 提取双链引用（`[[链接]]` 格式）
- 排除代码块中的双链（避免误识别）
- 排除示例性占位符（如"文件名"、"显示文本"等）
- 验证引用的文件是否存在
- 检查锚点是否存在
- 输出详细的检查报告

**检查项**：
1. 双链引用的文件是否存在
2. 双链格式是否正确
3. 路径是否正确（特别是跨目录引用）
4. 锚点是否存在

**使用方式**：
```bash
node scripts/check-wikilinks.js
# 或
npm run check:wikilinks
```

**输出示例**：
```
🔍 扫描 Markdown 文件...
找到 126 个 Markdown 文件

🔗 提取双链引用...
找到 0 个双链引用

✅ 检查双链引用...

============================================================
📊 检查结果

✅ 所有双链引用都正常！
============================================================
```

**建议**：在部署前运行此脚本，确保所有双链引用正常。

---

### 配置相关

#### `inject-config.js`
**功能**：注入配置 shim，使 Quartz 使用项目根目录的配置

**主要功能**：
- 在 `node_modules/quartz/quartz.config.ts` 中创建配置重导出
- 确保 Quartz 使用项目根目录的 `quartz.config.ts`

**使用方式**：
```bash
node scripts/inject-config.js
```

**自动调用时机**：
- `ensure-link.js` 中自动调用

---

#### `disable-og.js`
**功能**：禁用 CustomOgImages 插件，避免编码错误

**主要功能**：
- 在 `node_modules/quartz` 中查找所有相关文件
- 注释掉 `Plugin.CustomOgImages()` 调用
- 避免构建时的编码错误（如 `codepoint 31-20e3 not found in map`）

**使用方式**：
```bash
node scripts/disable-og.js
```

**自动调用时机**：
- GitHub Actions 部署流程中自动调用

**注意事项**：
- 此修改在 `npm install` 后会丢失，需要重新运行

---

### 内容转换

#### `convert-overreacted.js`
**功能**：转换 overreacted 文章中的链接和图片路径

**主要功能**：
- 转换绝对路径链接为相对路径
- 修复图片路径
- 处理 `书籍/overreacted/` 目录下的文章

**使用方式**：
```bash
node scripts/convert-overreacted.js
```

**适用场景**：
- 导入 overreacted 博客文章时使用

---

## 🔄 工作流程

### 开发流程
```bash
npm run dev
```
1. 运行 `ensure-link.js` 确保符号链接
2. 运行 `dev.js` 启动开发服务器
3. 自动监听文件变化并修复图片路径

### 构建流程
```bash
npm run build
```
1. 运行 `prebuild` 钩子：
   - `ensure-link.js` - 确保符号链接
   - `fix-markdown-links.js` - 修复 Markdown 链接
2. 运行 `build.sh`：
   - 清理缓存
   - 创建符号链接
   - 运行 Quartz 构建
   - 修复图片路径

### 检查流程
```bash
npm run check:wikilinks
```
- 检查所有双链引用是否正常

---

## 📝 注意事项

1. **符号链接**：`quartz` 符号链接必须存在且有效，否则构建会失败
2. **路径修复**：图片路径修复在构建后自动执行，无需手动操作
3. **双链检查**：建议在每次提交前运行 `check:wikilinks` 确保双链正常
4. **配置注入**：`inject-config.js` 确保 Quartz 使用正确的配置文件
5. **CustomOgImages**：该插件在 CI 环境中会自动禁用，避免编码错误

---

## 🛠️ 故障排除

### 符号链接问题
如果遇到符号链接相关错误：
```bash
node scripts/ensure-link.js
```

### 图片路径错误
如果图片无法显示：
```bash
npm run fix
```

### 双链无法工作
1. 检查配置：确保 `quartz.config.ts` 中 `wikilinks: true`
2. 运行检查：`npm run check:wikilinks`
3. 查看错误报告并修复

### 构建失败
1. 确保已安装依赖：`npm install`
2. 确保符号链接存在：`node scripts/ensure-link.js`
3. 检查配置文件：`quartz.config.ts` 和 `quartz.layout.ts`

---

## 📚 相关文档

- [Quartz 官方文档](https://quartz.jzhao.xyz/)
- [项目配置说明](../quartz.config.ts)
- [布局配置说明](../quartz.layout.ts)

