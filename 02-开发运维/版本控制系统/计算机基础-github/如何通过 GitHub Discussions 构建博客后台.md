# 如何通过 GitHub Discussions 构建博客后台

## 1. **前言**

GitHub Discussions 是 GitHub 提供的讨论功能，通常用于开源项目的社区讨论、问答以及反馈。除此之外，GitHub Discussions 还可以作为轻量的博客后台，借助 GitHub 的 API，开发者可以将 Discussions 内容拉取到自己的前端应用中，展示博客文章、管理评论等功能。

本篇博客将详细介绍如何通过 GitHub Discussions 构建一个基于 API 的博客系统，重点介绍 GitHub 提供的各种 API 使用方法，并提供相应的代码示例。

## 2. **GitHub Discussions 基础**

在构建博客之前，首先需要在 GitHub 仓库中启用 Discussions 功能：

### 启用 Discussions
1. 打开你希望用作博客后台的 GitHub 仓库。
2. 点击仓库页面右上角的 `Settings`（设置）选项。
3. 在 `Features` 选项卡中，勾选启用 `Discussions`。
4. 启用后，仓库页面会出现一个 `Discussions` 标签，你可以通过它来发布博客内容。

每个 Discussions 主题可以用作博客文章，每个回复可以用作文章的评论。

---

## 3. **GitHub API 介绍**

GitHub 提供两类 API，可以用来访问 Discussions 内容：
- **GitHub REST API**: 传统的 REST 风格 API，简单易用，适合常见的请求场景。
- **GitHub GraphQL API**: 通过 GraphQL 查询方式，允许更灵活的数据请求和优化，适合复杂的数据拉取场景。

### 3.1 **GitHub REST API**

GitHub 的 REST API 提供了基础的 CRUD 功能，你可以通过它获取 Discussions 列表、特定 Discussions 的详细内容以及创建新的 Discussions。

#### 获取 Discussions 列表
API 请求示例：
```bash
GET /repos/{owner}/{repo}/discussions
```

#### 请求示例（Node.js）
```js
const axios = require('axios');

const getDiscussions = async (owner, repo, token) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/discussions`;
  
  const response = await axios.get(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });
  
  return response.data;
};

// 示例使用
getDiscussions('Muliminty', 'noteBook', 'YOUR_PERSONAL_ACCESS_TOKEN')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

**返回结果**：
- `title`: Discussions 主题标题，通常为博客文章的标题。
- `body`: Discussions 主体内容，用 Markdown 撰写，适合博客文章。
- `comments`: Discussions 评论列表。

#### 获取单篇 Discussions 的详情
```bash
GET /repos/{owner}/{repo}/discussions/{discussion_number}
```

#### 获取单篇 Discussions 评论
```bash
GET /repos/{owner}/{repo}/discussions/{discussion_number}/comments
```

---

### 3.2 **GitHub GraphQL API**

GitHub GraphQL API 提供了更多的灵活性，允许一次请求获取不同字段，并且减少不必要的数据传输，非常适合需要精细控制数据展示的场景。

#### 查询 Discussions 列表
GraphQL 查询：
```graphql
{
  repository(owner: "Muliminty", name: "noteBook") {
    discussions(first: 10) {
      nodes {
        id
        title
        bodyHTML
        createdAt
        number
        comments {
          totalCount
        }
      }
    }
  }
}
```

#### 请求示例（Node.js）
```js
const axios = require('axios');

const getDiscussionsGraphQL = async (token) => {
  const query = `
  {
    repository(owner: "Muliminty", name: "noteBook") {
      discussions(first: 10) {
        nodes {
          id
          title
          bodyHTML
          createdAt
          number
          comments {
            totalCount
          }
        }
      }
    }
  }
  `;

  const response = await axios.post(
    'https://api.github.com/graphql',
    { query },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  return response.data.data.repository.discussions.nodes;
};

// 示例使用
getDiscussionsGraphQL('YOUR_PERSONAL_ACCESS_TOKEN')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

#### 返回结果解析
- `title`: 文章标题。
- `bodyHTML`: 文章内容，HTML 格式，适合直接在网页上渲染。
- `createdAt`: 文章创建时间。
- `comments.totalCount`: 评论数量。

#### 获取单个 Discussions 及其评论
使用 `discussion` 的 `number` 可以获取单个 Discussions 的详情，代码如下：

```graphql
{
  repository(owner: "Muliminty", name: "noteBook") {
    discussion(number: 1) {
      title
      bodyHTML
      comments(first: 5) {
        nodes {
          bodyHTML
          author {
            login
          }
          createdAt
        }
      }
    }
  }
}
```

---

## 4. **博客前端实现**

借助上述 API，你可以轻松地将 Discussions 数据拉取到前端应用中。我们可以使用现代前端框架如 `Vue.js` 或 `React.js` 来展示博客内容。

### 4.1 **Vue.js 示例**

#### 安装依赖
```bash
npm install axios
```

#### 获取 Discussions 并展示文章
```js
<template>
  <div>
    <h1>博客文章列表</h1>
    <ul>
      <li v-for="discussion in discussions" :key="discussion.id">
        <h2>{{ discussion.title }}</h2>
        <div v-html="discussion.bodyHTML"></div>
        <p>评论数: {{ discussion.comments.totalCount }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      discussions: []
    };
  },
  async created() {
    const token = 'YOUR_PERSONAL_ACCESS_TOKEN';
    const query = `
    {
      repository(owner: "Muliminty", name: "noteBook") {
        discussions(first: 10) {
          nodes {
            id
            title
            bodyHTML
            comments {
              totalCount
            }
          }
        }
      }
    }
    `;
    
    const response = await axios.post(
      'https://api.github.com/graphql',
      { query },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    this.discussions = response.data.data.repository.discussions.nodes;
  }
};
</script>
```

通过上述示例，我们可以在前端页面中展示博客文章列表。你可以进一步根据评论数、发布时间等进行排序或过滤。

---

## 5. **GitHub Actions 实现自动部署**

通过 GitHub Actions，你可以在每次 Discussions 更新时自动部署博客前端。

### Actions 配置文件（`deploy.yml`）
```yaml
name: Deploy Blog

on:
  discussion:
    types: [created, edited]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Install dependencies
        run: |
          npm install
          npm run build

      - name: Deploy to Netlify
        run: npm run deploy
```

每当 Discussions 主题被创建或编辑时，GitHub Actions 将会触发自动构建和部署。

---

## 6. **总结**

通过 GitHub Discussions 和 GitHub API，你可以非常轻松地搭建一个轻量级的博客后台。GitHub REST API 和 GraphQL API 各有优点，REST API 适合简单的场景，而 GraphQL API 适合复杂的查询场景。此外，借助 GitHub Actions 还可以实现博客的自动化更新和部署，将 Discussions 作为博客系统不仅简化了内容管理，还充分利用了 GitHub 的生态和社区互动能力。

你可以根据自己的需求选择适合的 API 和框架，快速搭建一个高效的博客系统。
