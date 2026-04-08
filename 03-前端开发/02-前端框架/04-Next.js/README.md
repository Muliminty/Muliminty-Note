# Next.js 目录说明

本目录收纳 `Next.js` 相关的正式专题内容，当前以 `App Router` 体系为主。

## 当前角色

- `!MOC-Next.js.md`：主题导航入口，负责阅读路径和专题索引。
- `README.md`：目录说明文件，负责说明目录结构与维护边界。
- 子目录正文：承载具体知识内容与实战文章。

## 目录结构

```text
Next.js/
├── !MOC-Next.js.md
├── README.md
├── 01-基础入门
├── 02-核心机制
├── 03-App-Router体系
├── 04-数据与后端
├── 05-工程化与最佳实践
└── 06-性能SEO与部署
```

## 收录范围

- Next.js 基础入门与项目配置
- 渲染模式与运行时机制
- App Router 相关架构能力
- 数据获取、Server Actions、Route Handlers
- 工程化、性能优化、SEO 与部署

## 维护约束

- 导航职责统一由 [!MOC-Next.js.md](./!MOC-Next.js.md) 承担。
- `README.md` 不再承担专题导航或正文索引职责。
- 后续新增内容优先归入现有分区，避免继续在根目录平铺。
