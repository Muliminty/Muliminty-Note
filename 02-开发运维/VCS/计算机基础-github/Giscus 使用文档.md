## Giscus 使用文档

### 1. 什么是 Giscus？

**Giscus** 是一个基于 GitHub Discussions 的评论系统，可以为静态网站（如博客、文档站点等）添加评论功能。它的特点包括：
- 完全免费。
- 数据存储在 GitHub 仓库的 Discussions 中。
- 支持 Markdown、表情符号、主题切换等功能。
- 适合开发者使用，尤其是使用 GitHub 托管项目的用户。

---

### 2. 准备工作

#### 2.1 启用 GitHub Discussions
1. 打开你的 GitHub 仓库。
2. 点击顶部菜单的 **Settings**。
3. 向下滚动到 **Features** 部分，确保 **Discussions** 已启用。

#### 2.2 安装 Giscus App
1. 访问 [Giscus GitHub App](https://github.com/apps/giscus)。
2. 点击 **Install**，选择你要启用 Giscus 的仓库（可以是单个仓库或所有仓库）。

---

### 3. 配置 Giscus

访问 [Giscus 官网](https://giscus.app/)，填写以下信息以生成配置代码：

1. **Repository**：
   - 输入你的 GitHub 仓库，格式为：`<用户名>/<仓库名>`，例如 `Muliminty/muliminty-blog`。

2. **Discussion Category**：
   - 选择 Discussions 的分类（Giscus 会自动创建一个分类，你也可以手动创建）。

3. **Mapping**：
   - 选择如何将评论与页面关联。推荐使用 **URL** 或 **Page Title**。

4. **Theme**：
   - 选择评论框的主题，例如 `light`、`dark` 或 `preferred_color_scheme`（跟随系统主题）。

5. **其他选项**：
   - 可以选择是否启用评论框的懒加载、是否允许评论框中的表情符号等。

---

### 4. 获取 Giscus 脚本

在 Giscus 官网填写完配置后，你会得到一段类似以下的代码：

```html
<script
  src="https://giscus.app/client.js"
  data-repo="<用户名>/<仓库名>"
  data-repo-id="你的仓库ID"
  data-category="General"
  data-category-id="你的分类ID"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="bottom"
  data-theme="preferred_color_scheme"
  data-lang="zh-CN"
  crossorigin="anonymous"
  async
></script>
```

---

### 5. 将 Giscus 集成到你的网站

#### 5.1 静态网站（HTML）
将生成的脚本直接插入到你的 HTML 文件中，例如：

```html
<div id="giscus-comments"></div>
<script
  src="https://giscus.app/client.js"
  data-repo="<用户名>/<仓库名>"
  data-repo-id="你的仓库ID"
  data-category="General"
  data-category-id="你的分类ID"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="bottom"
  data-theme="preferred_color_scheme"
  data-lang="zh-CN"
  crossorigin="anonymous"
  async
></script>
```

#### 5.2 React 项目
在 React 项目中，可以使用 `useEffect` 动态加载 Giscus 脚本：

```tsx
import React, { useEffect, useRef } from "react";

const GiscusComments = () => {
  const giscusRef = useRef(null);

  useEffect(() => {
    if (!giscusRef.current) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "<用户名>/<仓库名>");
    script.setAttribute("data-repo-id", "你的仓库ID");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "你的分类ID");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    giscusRef.current.appendChild(script);
  }, []);

  return <div ref={giscusRef} />;
};

export default GiscusComments;
```

然后在需要的地方使用 `<GiscusComments />` 组件即可。

---

### 6. 自定义样式

你可以通过 CSS 自定义 Giscus 评论框的样式。例如：

```css
.giscus, .giscus-frame {
  width: 100%;
  border: none;
  margin-top: 20px;
}
```

---

### 7. 测试评论功能

1. 打开你的网站，找到集成了 Giscus 的页面。
2. 确保评论框正常加载。
3. 尝试发表一条评论，评论会自动同步到 GitHub Discussions。

---

### 8. 高级功能

#### 8.1 多语言支持
Giscus 支持多种语言，可以通过 `data-lang` 参数设置。例如：
- `en`：英文
- `zh-CN`：简体中文
- `ja`：日文

#### 8.2 主题切换
Giscus 支持动态切换主题，例如跟随系统主题或手动切换。可以通过 `data-theme` 参数设置：
- `light`：亮色主题
- `dark`：暗色主题
- `preferred_color_scheme`：跟随系统主题

#### 8.3 懒加载
可以通过 `data-loading="lazy"` 启用懒加载，提升页面性能。

---

### 9. 常见问题

#### 9.1 评论框未加载
- 检查仓库名称、仓库 ID 和分类 ID 是否正确。
- 确保 GitHub Discussions 已启用。
- 检查网络连接是否正常。

#### 9.2 评论未同步到 GitHub
- 确保 Giscus App 已正确安装并授权。
- 检查 Discussions 分类是否存在。

#### 9.3 私有仓库支持
- Giscus 默认不支持私有仓库。如果必须使用私有仓库，建议将仓库设置为公开，或使用其他评论系统（如 Disqus）。

---

### 10. 参考链接

- [Giscus 官网](https://giscus.app/)
- [GitHub Discussions 文档](https://docs.github.com/en/discussions)
- [GitHub API 文档](https://docs.github.com/en/rest)
- [giscus](https://giscus.app/zh-CN)

---

### 总结

通过以上步骤，你可以轻松地将 Giscus 集成到你的网站中，为静态网站或博客添加评论功能。Giscus 基于 GitHub Discussions，数据安全可靠，非常适合开发者使用。