### GitHub API 请求示例（使用 `axios`）

#### 1. 获取仓库信息

```javascript
const axios = require('axios');

const getRepositoryInfo = async (owner, repo) => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

getRepositoryInfo('octocat', 'Hello-World');
```

#### 2. 列出仓库中的文件

```javascript
const getRepositoryContents = async (owner, repo, path) => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

getRepositoryContents('octocat', 'Hello-World', 'README.md');
```

#### 3. 获取文件内容

```javascript
const getFileContent = async (owner, repo, path) => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            responseType: 'arraybuffer'
        });
        const fileContent = Buffer.from(response.data).toString('utf-8');
        console.log(fileContent);
    } catch (error) {
        console.error(error);
    }
};

getFileContent('octocat', 'Hello-World', 'README.md');
```

#### 4. 搜索代码

```javascript
const searchCode = async (query, owner, repo) => {
    try {
        const response = await axios.get(`https://api.github.com/search/code`, {
            params: {
                q: `${query} repo:${owner}/${repo}`
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

searchCode('console.log', 'octocat', 'Hello-World');
```

#### 5. 获取用户信息

```javascript
const getUserInfo = async (username) => {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

getUserInfo('octocat');
```

#### 6. 列出用户的仓库

```javascript
const getUserRepositories = async (username) => {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

getUserRepositories('octocat');
```

#### 7. 获取拉取请求

```javascript
const getPullRequest = async (owner, repo, pullNumber) => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

getPullRequest('octocat', 'Hello-World', 1);
```

#### 8. 列出问题

```javascript
const getIssues = async (owner, repo) => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

getIssues('octocat', 'Hello-World');
```

#### 9. 检查速率限制

```javascript
const checkRateLimit = async (token) => {
    try {
        const response = await axios.get('https://api.github.com/rate_limit', {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

checkRateLimit('YOUR_ACCESS_TOKEN');
```

### 备注

- **身份认证**: 如果需要访问受限数据或提高请求限制，请在请求头中添加 `Authorization` 字段。
- **错误处理**: 示例中使用了基本的错误处理，建议在实际开发中根据需求进行更详细的处理。
- **响应格式**: 有些请求的响应需要进行处理（如文件内容），确保根据实际情况进行解码或解析。

这些示例可以作为你与 GitHub API 交互的基础，你可以根据实际需要进行调整和扩展。


### 参考文档

- [GitHub REST API 文档](https://docs.github.com/en/rest)
- [GitHub API 授权文档](https://docs.github.com/en/authentication)
