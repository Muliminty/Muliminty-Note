# 使用 dotenv 轻松管理 Node.js 项目的多环境变量

在现代应用开发中，环境变量在不同环境（如开发、测试、生产）中起到关键作用。`dotenv` 是一个帮助 Node.js 开发者管理环境变量的小工具，它能够将环境配置从代码中解耦并轻松加载到项目中。

本文将介绍 `dotenv` 的使用场景、实现原理，进而拓展到多环境管理的实际操作，帮助开发者更灵活高效地管理环境变量。

## 1. dotenv 实现原理

`dotenv` 通过读取 `.env` 文件中的配置，将这些环境变量注入到 `process.env` 中，从而让 Node.js 应用访问这些环境变量。比如，如果 `.env` 文件内容如下：

```plaintext
API_URL=https://api.example.com
DB_USERNAME=admin
DB_PASSWORD=securepassword
```

使用 `dotenv` 后，可以在代码中通过 `process.env.API_URL` 直接访问这些变量。它的核心原理是：

1. 通过 `fs` 模块读取 `.env` 文件内容。
2. 使用正则表达式解析文件内容，将每行的键值对加入到 `process.env`。

### 使用 dotenv

首先，安装 `dotenv`：

```bash
npm install dotenv
```

在代码中导入并调用 `config()` 方法：

```javascript
require('dotenv').config();

console.log(process.env.API_URL); // 输出: https://api.example.com
```

这将自动读取项目根目录下的 `.env` 文件，并将其中的键值对添加到 `process.env`。

### 使用场景

1. **项目配置**：方便集中管理 API 接口、数据库连接等配置信息。
2. **敏感信息隔离**：将敏感信息从代码中剥离，避免在版本控制中暴露。
3. **多环境支持**：通过不同的 `.env` 文件支持开发、测试和生产环境的配置。

## 2. 多环境支持

在复杂的应用场景中，我们通常会有多个环境配置需求（如开发、测试、生产等），而 `dotenv` 的 `.env` 文件默认只适用于单一环境。为了解决这一问题，可以创建多个 `.env` 文件。

### 创建多环境文件

我们可以为不同环境创建专用的 `.env` 文件，如：

- `.env.development`：开发环境配置
- `.env.staging`：测试环境配置
- `.env.production`：生产环境配置

每个 `.env` 文件根据环境需求存放特定变量。例如：

#### `.env.development`
```plaintext
API_URL=https://dev-api.example.com
DATABASE_URL=mongodb://localhost:27017/devdb
PORT=3000
```

#### `.env.staging`
```plaintext
API_URL=https://staging-api.example.com
DATABASE_URL=mongodb://localhost:27017/stagingdb
PORT=4000
```

#### `.env.production`
```plaintext
API_URL=https://api.example.com
DATABASE_URL=mongodb://localhost:27017/proddb
PORT=5000
```

### 根据环境变量动态加载配置文件

我们可以通过 `NODE_ENV` 的值动态加载对应的 `.env` 文件。在项目启动时，设置 `NODE_ENV` 为不同的值，根据环境加载相应的配置：

```javascript
const dotenv = require('dotenv');
const path = require('path');

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log(`加载的环境文件: ${envFile}`);
console.log(`API URL: ${process.env.API_URL}`);
```

### 启动命令示例

在不同环境下启动项目时，可以指定 `NODE_ENV`，这样会根据代码动态加载对应的 `.env` 文件：

```bash
# 启动开发环境
NODE_ENV=development node app.js

# 启动测试环境
NODE_ENV=staging node app.js

# 启动生产环境
NODE_ENV=production node app.js
```

> 如果 `NODE_ENV` 未设置，代码将默认加载 `.env.development` 文件。

### 3. 使用 dotenv-cli 简化多环境切换

`dotenv-cli` 是 `dotenv` 的命令行工具，能够直接在启动时指定 `.env` 文件路径，不需要在代码中设置路径。

#### 安装 dotenv-cli

```bash
npm install -g dotenv-cli
```

#### 使用 dotenv-cli 启动项目

使用 `dotenv -e <env_file>` 可以指定 `.env` 文件启动项目：

```bash
# 使用开发环境
dotenv -e .env.development -- node app.js

# 使用测试环境
dotenv -e .env.staging -- node app.js

# 使用生产环境
dotenv -e .env.production -- node app.js
```

### 4. `.env.example` 文件

为了让项目中的环境变量信息更清晰，可以创建一个 `.env.example` 文件，存放环境变量的名称，并给出简单的解释，但不要填写真实的值。这样团队成员可以基于 `.env.example` 创建属于自己的 `.env` 文件。

#### `.env.example`
```plaintext
# API 接口地址
API_URL=

# 数据库连接字符串
DATABASE_URL=

# 应用监听端口
PORT=
```

将 `.env.example` 添加到版本控制，这样所有团队成员都能方便地创建属于自己的环境变量文件。

### 5. 在 Docker 中使用多环境配置

如果你的项目在 Docker 中运行，可以直接在启动容器时加载不同的环境变量文件：

```bash
docker run --env-file .env.production myapp
```

Docker 会直接读取并应用 `.env.production` 文件中的环境变量。这样可以轻松管理容器的多环境配置。

### 6. 高阶：安全地管理敏感信息

在生产环境中，直接存储敏感信息可能存在安全风险。可以考虑使用 AWS Secrets Manager、HashiCorp Vault 等密钥管理工具，将敏感信息外部化，并通过 API 动态加载，从而增强安全性。

### 总结

`dotenv` 让我们可以轻松管理环境变量。通过不同的 `.env` 文件，可以高效管理项目的多环境配置，并使用 `dotenv-cli` 和 Docker 等工具简化启动流程。在生产环境中，建议结合密钥管理工具进一步增强环境变量的安全性。

使用 `dotenv`，让 Node.js 项目中的环境变量管理变得更加灵活、规范、高效。