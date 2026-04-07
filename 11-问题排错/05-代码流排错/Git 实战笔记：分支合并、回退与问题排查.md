# Git 实战笔记：分支合并、回退与问题排查

> 基于近期实际使用场景整理的 Git 操作总结，便于后续查阅与学习。

---

## 一、Rebase 相关

### 1.1 识别 Rebase 进行中

当终端出现类似提示：

```
You are currently editing a commit while rebasing branch 'xxx' on 'yyy'.
```

说明当前处于 rebase 过程中。

### 1.2 Rebase 失败：`Could not apply` 且 `nothing to commit, working tree clean`

**原因**：某个 commit 无法应用，且工作区干净，通常表示该 commit 的改动已存在于当前分支。

**处理**：

```bash
# 跳过当前无法应用的 commit，继续 rebase
git rebase --skip
```

### 1.3 中止 Rebase

不想继续 rebase 时：

```bash
git rebase --abort
```

会回到 rebase 开始前的状态。

### 1.4 查看 Rebase 会涉及哪些文件

```bash
git diff --name-only <base_commit>...<source_branch>
```

---

## 二、Merge 相关

### 2.1 查找某次 Merge 提交

```bash
git log --oneline --merges --grep="关键词"
```

### 2.2 查看 Merge 提交详情

```bash
git show <merge_commit> --stat
git log <merge_commit> -1 --format=fuller
```

### 2.3 撤销 Merge（保留历史）

```bash
# -m 1 表示保留第一个父提交（被合并进的分支），撤销第二个父提交的改动
git revert -m 1 <merge_commit>
```

**注意**：Merge 之后若有很多新提交，revert 时可能产生冲突，需要手动解决。

### 2.4 撤销 Merge（彻底回退）

```bash
# 回退到 merge 前的提交
git reset --hard <merge_commit>^1
```

会丢弃 merge 及之后的所有提交，仅适合未推送或确定可丢弃的情况。

---

## 三、常见问题与处理

### 3.1 Vim Swap 文件冲突

执行 `git revert`、`git commit` 等会打开编辑器时，出现：

```
Found a swap file by the name ".COMMIT_EDITMSG.swp"
```

**处理步骤**：

1. 在 Vim 中按 `Q` 或 `A` 退出
2. 删除 swap 文件：`rm .git/.COMMIT_EDITMSG.swp`
3. 避免再次打开编辑器：`git revert -m 1 <commit> --no-edit`
4. 长期方案：更换默认编辑器，例如 `git config --global core.editor "code --wait"`

### 3.2 `revert` 失败：`your local changes would be overwritten`

**原因**：有未提交的本地修改。

**处理**：

```bash
git stash
git revert -m 1 <commit>
git stash pop
```

### 3.3 查看某行代码的来源提交

```bash
git blame -L <start>,<end> <file_path>
```

### 3.4 查找某段代码首次出现的提交

```bash
git log -p -S "要搜索的字符串" -- <file_path>
```

---

## 四、回退到指定提交

### 4.1 硬回退（丢弃之后所有提交）

```bash
# 建议先备份
git branch backup-before-reset

# 回退到指定提交
git reset --hard <commit_hash>
```

### 4.2 软回退（保留改动在暂存区）

```bash
git reset --soft <commit_hash>
```

### 4.3 仅查看某次提交的代码（不改变分支）

```bash
git checkout <commit_hash>
# 查看完毕后切回分支
git checkout <branch_name>
```

---

## 五、同步本地回退到远程

本地已 `reset --hard` 后，要让远程分支与本地一致：

```bash
git push --force-with-lease origin <branch_name>
```

- `--force-with-lease`：若远程有他人新提交会拒绝推送，比 `--force` 更安全
- 会覆盖远程分支历史，需与团队沟通

---

## 六、常用辅助命令

| 用途           | 命令                                      |
|----------------|-------------------------------------------|
| 查看操作历史   | `git reflog`                              |
| 查看分支       | `git branch -a`                           |
| 查看提交历史   | `git log --oneline -20`                   |
| 查看 merge 提交 | `git log --oneline --merges`              |
| 查看某提交的父提交 | `git rev-parse <commit>^1`、`<commit>^2` |
| 统计两提交间数量 | `git rev-list --count A..B`              |
| 判断提交关系   | `git merge-base --is-ancestor A B`        |

---

## 七、本次实战流程概览

1. 发现 rebase 进行中 → 使用 `git rebase --abort` 中止
2. 查找上海证券分支合并到私有化-dev 的 merge → 使用 `git log --merges --grep`
3. 尝试 `git revert -m 1` 撤销 merge → 遇到 Vim swap 和本地修改冲突
4. 用 `git blame` 和 `git log -p -S` 定位上海证券相关代码的引入提交
5. 使用 `git reset --hard 66860268` 回退到指定提交
6. 使用 `git push --force-with-lease` 将远程分支同步到本地状态

---

## 八、实践建议

1. 重要操作前先 `git branch backup-xxx` 做备份
2. 优先使用 `--force-with-lease` 而不是 `--force`
3. 已推送的分支做 reset/revert 前，先和团队确认
4. 遇到问题可先用 `git reflog` 查看历史，再决定回退或恢复
