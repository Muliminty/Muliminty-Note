# 测试（Testing）MOC

> 前端测试策略和工具，包括单元测试、集成测试、端到端测试。
> 
> **学习路径**：测试是质量保障的重要环节，与 [性能优化](../性能/!MOC-性能.md) 和 [安全](../安全/!MOC-前端安全.md) 共同保障代码质量。测试通常配合 [工程化实践](../../03-工程化实践/工程化/代码规范.md) 使用。

---

## 📚 核心主题

- [单元测试（Jest/Vitest）](./单元测试.md) — 单元测试实践（测试 [JavaScript](../../01-基础入门/JavaScript/!MOC-javascript.md) 和框架组件）
- [集成测试（Testing Library/Cypress）](./集成测试.md) — 集成测试方案（测试 [React](../../02-框架进阶/React/!MOC-React.md) 或 [Vue](../../02-框架进阶/Vue/!MOC-Vue.md) 组件）
- [端到端测试（Playwright/Cypress）](./端到端测试.md) — E2E 测试实践（测试完整应用流程）
- [静态分析与类型安全](./静态分析与类型安全.md) — 静态代码分析（配合 [TypeScript](../../01-基础入门/TypeScript/!MOC-TypeScript.md) 使用）

---

## 🎯 测试类型

### 单元测试
- Jest、Vitest
- 测试框架使用
- Mock 和 Stub
- 测试覆盖率

### 集成测试
- Testing Library
- 组件测试
- API 测试
- 状态测试

### 端到端测试
- Playwright
- Cypress
- 测试场景设计
- 自动化测试流程

### 静态分析
- ESLint（详见 [代码规范](../../03-工程化实践/工程化/代码规范.md)）
- TypeScript 类型检查（配合 [TypeScript](../../01-基础入门/TypeScript/!MOC-TypeScript.md) 使用）
- 代码质量检查

---

## 📝 学习建议

1. **前置知识**：需要掌握 [JavaScript 基础](../../01-基础入门/JavaScript/!MOC-javascript.md) 和前端框架基础
2. **学习顺序**：JavaScript → 前端框架 → 测试 → [性能优化](../性能/!MOC-性能.md) → [安全](../安全/!MOC-前端安全.md)
3. **质量保障体系**：
   - 测试：保障功能正确性
   - [性能优化](../性能/!MOC-性能.md)：保障性能
   - [安全](../安全/!MOC-前端安全.md)：保障安全性
   - [可访问性](../无障碍/!MOC-无障碍.md)：保障可访问性
4. **实践应用**：测试配合 [工程化工具](../../03-工程化实践/工具链与构建/!MOC-工具链与构建.md) 实现自动化测试

---

## 📖 学习资源

- [Jest 官方文档](https://jestjs.io/)
- [Vitest 官方文档](https://vitest.dev/)
- [Playwright 官方文档](https://playwright.dev/)

---

#测试 #质量保障 #前端测试

