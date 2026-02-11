# SDD 规范驱动开发 — 实践指南

## 开始前：先让 AI 知道项目长啥样

别一上来就扔需求，AI 啥都不知道。

1. 把 README、`package.json`、`src` 目录结构喂给它
2. 有 `.cursorrules` 就一起发
3. 问一句：`你总结一下这个项目用啥技术栈、有啥约定？` 看它复述对不对，不对就纠正

**举例**：你有个 Vite + React + TypeScript 项目，用 antd 做 UI。先让 AI 确认「用 antd 的 Table、不用自己造轮子」。

## RIPER 五步（用「用户列表页」举例）

### R — 搞清楚要干啥

把需求丢给 AI，哪怕是「我要做个用户列表，能搜索、能分页」这种糙话也行。

- 你说：`复述一下你要做的功能，有啥不清楚的问我`
- AI 可能会问：搜索按啥字段？分页一页几条？数据从哪来？
- 你答完，让它整理成 `01_requirement.md`，里面要有：背景、目标、验收标准（比如「输入关键词能过滤用户」）

### I — 想清楚怎么干

- 你说：`按这个需求，给个技术方案，用 React + antd`
- 它说用 `useState` 存列表、用 `Input` 做搜索，你追问：`还有别的写法吗？这样有啥坑？`
- 它要是不确定接口格式，让它直接问你，别瞎猜
- 定下来后整理进 `03_implementation.md` 的设计部分（用啥组件、数据咋流），有接口的话再写 `02_interface.md`

### P — 细化到能照着写

让 AI 写出具体要改哪些文件、加哪些函数。

- 比如：`src/pages/UserList/index.tsx` 新建、`src/api/user.ts` 加 `getUserList`、`src/hooks/useUserList.ts` 封装请求
- 让它拆成 Step1、Step2… 每一步换个人都能照着做
- 产出 `03_implementation.md`

### E — 按计划一步步写

别让它一次生成一整页代码，会跑偏。

- 先说：`先做 Step1，建 UserList 页面骨架`
- 做完问：`你刚做了啥？和 Spec 对得上吗？`
- 再：`Step2，接 getUserList 接口`
- 每步跑一下：`npm run dev` 能跑、没 lint 报错，再往下

### R — 换个人（新对话）审一遍

你自己容易「觉得对了」，换个视角更稳。

- 开 New Chat，把 `01_requirement`、`02_interface`、`03_implementation` 和这次改的 diff 贴进去
- 问：`按这份 Spec 看下代码，有没有 bug、漏了的逻辑、和文档不一致的地方？`
- 也可以问：`假如资深 React 工程师来 review，会挑啥毛病？`
- 测试跑过、接口返回和 `02_interface.md` 里写的契约一致，才算过

## 出 Bug 了咋办：LAFR

1. **Locate**：把 Spec、相关代码、报错信息一起喂给 AI
2. **Analyze**：让它判断：是代码写错了，还是当初需求/设计就没写对？
3. **Fix**：代码错 → 直接改；文档错 → **先改文档，再让 AI 按新文档重生成**
4. **Record**：在 `SKILL.md` 加一条（比如「列表接口必须带分页参数」），下次 AI 就不会再忘

## 文档放哪、写啥

在项目里建 `docs/specs/user-list/`（按功能分）：

| 文档 | 全称 | 写啥 |
|------|------|------|
| **01** | `01_requirement.md` | 要做什么、验收标准（背景、目标、范围、AC） |
| **02** | `02_interface.md` | 接口 path、请求参数、返回格式，前后端对齐用 |
| **03** | `03_implementation.md` | 改哪些文件、加哪些函数、分几步执行 |
| **04** | `04_test_spec.md` | 要测哪些场景、数据准备、回归点 |
| — | `AI_CHANGELOG.md` | 某天基于啥文档改了啥、有啥风险 |

**React 项目举例**：`02_interface.md` 里写 `GET /api/users?keyword=xxx&page=1&pageSize=10`，返回 `{ list, total }`。前端用这个文档生成类型、Mock 数据；后端按这个实现。

## 几条硬规则

- **SKILL.md**：写死规矩，比如「金额用 number 存分、显示时除以 100」「列表必须 loading 态」。AI 犯过一次就加一条，下次重生成会跟规矩走
- **改东西顺序**：
  - 需求变了 → 先改 `01_requirement.md`，再改代码（否则 AI 和文档对不上）
  - 重构/改实现 → 先改 `03_implementation.md`，再动手
  - 线上 Bug 修完 → 在 `04_test_spec.md` 补用例，防止复发
- **敏感数据**：别把用户手机号、token 喂给外部模型
- **幻觉**：AI 用了你没听过的 npm 包，大概率胡说，让它贴官方文档链接
- **背锅**：谁最后签字谁负责，别甩给 AI

## 啥时候用啥版本

| 场景 | 做法 |
|------|------|
| 自己玩、原型、赶时间 | 只写一份 Task_Spec，够用就行 |
| 多人协作、业务复杂、要长期维护 | 老老实实走 01→02→03→04 整套文档 |

## 相关

- [TDD](TDD.md) — 测试驱动开发
- [vibe code](vibe%20code.md) — Vibe Coding 概览
