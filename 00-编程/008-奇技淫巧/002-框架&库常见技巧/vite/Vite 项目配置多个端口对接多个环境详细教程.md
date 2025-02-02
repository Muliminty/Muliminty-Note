# Vite 项目配置多个端口对接多个环境

## 介绍

在开发过程中，我们经常需要在不同的环境中测试我们的应用程序，例如开发环境、测试环境和生产环境。使用 Vite 作为构建工具，我们可以通过配置多个端口来实现这一目标。本文将详细介绍如何配置一个 Vite 项目，以便在不同端口上对接多个环境。

## 目录

1. 创建 Vite 项目
2. 配置环境文件
3. 配置 Vite 服务器
4. 运行不同环境
5. 总结

## 1. 创建 Vite 项目

首先，创建一个新的 Vite 项目。如果你还没有安装 Vite，可以使用以下命令来安装：

```bash
npm create vite@latest my-vite-project
cd my-vite-project
npm install
```

## 2. 配置环境文件

在项目的根目录下，创建不同的环境文件。例如，创建以下三个环境文件：

- `.env.development`
- `.env.test`
- `.env.production`

每个环境文件中添加不同的环境变量，例如 API 基础 URL：

```env
# .env.development
VITE_API_BASE_URL=https://dev.api.yourservice.com
VITE_PORT=3000
```

```env
# .env.test
VITE_API_BASE_URL=https://test.api.yourservice.com
VITE_PORT=3001
```

```env
# .env.production
VITE_API_BASE_URL=https://api.yourservice.com
VITE_PORT=3002
```

## 3. 配置 Vite 服务器

修改 `vite.config.js` 文件以读取环境变量并配置服务器端口。安装 `dotenv` 来加载环境变量：

```bash
npm install dotenv
```

在 `vite.config.js` 中添加以下代码：

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dotenv from 'dotenv';

// 读取当前环境
const env = process.env.NODE_ENV || 'development';
const envConfig = dotenv.config({ path: `.env.${env}` }).parsed;

export default defineConfig({
  plugins: [vue()],
  server: {
    port: envConfig.VITE_PORT,
  },
  define: {
    'process.env': envConfig
  }
});
```

## 4. 运行不同环境

现在可以使用不同的脚本来运行不同的环境。例如，在 `package.json` 中添加以下脚本：

```json
{
  "scripts": {
    "dev": "NODE_ENV=development vite",
    "test": "NODE_ENV=test vite",
    "build": "NODE_ENV=production vite build",
    "serve": "NODE_ENV=production vite preview"
  }
}
```

运行以下命令来启动不同环境的服务器：

```bash
npm run dev     # 开发环境，端口3000
npm run test    # 测试环境，端口3001
npm run build   # 构建生产环境
npm run serve   # 预览生产环境，端口3002
```

## 5. 总结

通过以上步骤，我们已经成功配置了一个 Vite 项目，可以在不同的端口上对接多个环境。这样不仅有助于开发和测试，还能提高工作效率。

---

### 附录

#### 完整的 `vite.config.js` 文件

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';
const envConfig = dotenv.config({ path: `.env.${env}` }).parsed;

export default defineConfig({
  plugins: [vue()],
  server: {
    port: envConfig.VITE_PORT,
  },
  define: {
    'process.env': envConfig
  }
});
```

#### 完整的环境文件示例

```env
# .env.development
VITE_API_BASE_URL=https://dev.api.yourservice.com
VITE_PORT=3000
```

```env
# .env.test
VITE_API_BASE_URL=https://test.api.yourservice.com
VITE_PORT=3001
```

```env
# .env.production
VITE_API_BASE_URL=https://api.yourservice.com
VITE_PORT=3002
```

#### `package.json` 脚本示例

```json
{
  "scripts": {
    "dev": "NODE_ENV=development vite",
    "test": "NODE_ENV=test vite",
    "build": "NODE_ENV=production vite build",
    "serve": "NODE_ENV=production vite preview"
  }
}
```

通过本文档，开发者可以轻松配置 Vite 项目以在不同端口上对接多个环境，从而更高效地进行开发、测试和部署。