# Git 提交规范

为了保持代码库的一致性和可维护性，请遵循以下 Git 提交规范：

## 提交信息格式

每个提交信息应遵循以下格式：

```
<类型>[<可选的范围>]: <简短描述>

<详细描述>

<相关问题的跟踪 ID>
```

### 1. 类型

提交的类型应描述变更的性质。常见的类型包括：

- `feat`: 新功能
- `fix`: 修复缺陷
- `docs`: 仅文档更改
- `style`: 格式化、缺少分号等（不会影响代码运行）
- `refactor`: 代码重构（即：不是修复 bug 也不是添加功能）
- `perf`: 性能提升
- `test`: 添加缺少的测试或修复现有测试
- `chore`: 其他更改（如构建过程或辅助工具的更改）
- `build`: 影响构建系统或外部依赖的更改

### 2. 范围（可选）

范围是一个可选的部分，用于描述提交影响的部分。例如：

- `feat(auth)`: 新增认证功能
- `fix(api)`: 修复 API 请求

### 3. 简短描述

简短描述应简洁明了，通常不超过 100 个字符。它应以动词的原形开始，例如：

- `Add new user authentication feature`
- `Fix API response handling`

### 4. 详细描述（可选）

详细描述可以用于解释更改的原因和背景。描述应简洁明了，避免过多的细节，通常用于解释复杂的更改。

### 5. 相关问题的跟踪 ID（可选）

如果你的提交与某个问题或任务相关，可以在提交信息中包括相关的 ID。例如：

```
Fix login issue (#123)
```

## 示例提交信息

- **功能新增**:
  ```
  feat(user-profile): add user profile page

  Added a new page for user profiles. Users can view and edit their profile information.
  ```

- **缺陷修复**:
  ```
  fix(api): resolve API response handling issue

  Fixed an issue where the API response was not properly handled in the front-end. Added error handling for better stability.
  ```

- **代码重构**:
  ```
  refactor(auth): simplify authentication logic

  Refactored the authentication logic to improve readability and maintainability. No functional changes were made.
  ```

- **文档更新**:
  ```
  docs(README): update installation instructions

  Added additional details to the installation instructions in the README file to assist new developers.
  ```

## 提交规范最佳实践

- **频繁提交**: 保持提交频繁而小巧，这样可以减少合并冲突，并使代码审查变得更容易。
- **描述清晰**: 提交信息应清晰描述更改的内容和目的，便于团队成员理解和跟踪。
- **避免空提交**: 不要提交空白或不必要的更改，如代码格式化，除非它们是其他更改的一部分。
- **使用动词原形**: 使用动词原形进行描述，使提交信息更具一致性和易读性。
- **遵循团队规范**: 确保你的提交信息符合团队或项目的提交规范，增强团队协作。

---

请确保在团队内共享并遵循此规范，以促进项目的高效开发和维护。