## Vite 项目启动时打印自定义启动信息

在开发和维护前端项目时，特别是使用 Vite 这样的现代构建工具，我们经常需要在项目启动时输出一些自定义的启动信息，例如当前运行的环境、API 地址以及端口号等。本文将介绍如何通过自定义 Vite 插件，在项目启动时打印这些信息，并提供详细的代码和注释说明。

## 需求分析

在启动 Vite 开发服务器时，我们希望能够看到以下信息：
- 当前连接的服务器名称
- 本地地址
- 网络地址
- 环境名称
- API 基础地址
- 端口号

## 实现思路

我们可以通过编写一个 Vite 插件来实现这个功能。Vite 插件系统非常灵活，允许我们在不同的生命周期钩子中执行自定义逻辑。这里，我们将利用 `configureServer` 钩子来添加自定义的启动信息打印逻辑。

## 插件代码

下面是插件的完整代码，并附带详细的 JSDoc 注释：

```javascript
import envConfig from '../env'

/**
 * Vite 插件，用于在服务器启动时输出自定义的启动信息。
 * @returns {Object} Vite 插件配置对象
 */
export default function viteCustomStartupInfo() {
  return {
    name: 'vite-custom-startup-info',
    /**
     * 配置 Vite 服务器，在服务器启动时打印自定义的启动信息。
     * @param {Object} server - Vite 服务器实例
     */
    configureServer(server) {
      server.httpServer.once('listening', () => {
        const mode = server.config.mode;
        const env = envConfig[mode];

        const { port, host } = server.config.server;
        const localAddress = `http://localhost:${port}/?displayPosition=1`;
        const networkAddress = `http://${host}:${port}/`;

        const serverInfo = {

          'Local': localAddress,
          'Network': networkAddress,
          'name': env.VITE_NAME,
          'url': env.VITE_API_BASE_URL,
          'port': env.VITE_PORT
        };
        console.log(`当前连接服务器=========>> \n`);
        console.table(JSON.stringify(serverInfo, null, 2));
      });
    }
  }
}

```

### 代码说明

#### 1. 引入环境配置

我们首先从 `../env` 文件中引入环境配置，这个配置文件包含了各个环境的变量信息，如 API 基础地址、端口号等。

```javascript
import envConfig from '../env'
```

#### 2. 定义插件函数

定义一个名为 `viteCustomStartupInfo` 的函数，它返回一个 Vite 插件配置对象。插件的名称为 `vite-custom-startup-info`。

```javascript
export default function viteCustomStartupInfo() {
  return {
    name: 'vite-custom-startup-info',
    ...
  }
}
```

#### 3. 配置服务器

在插件对象中，使用 `configureServer` 钩子来配置 Vite 服务器。这个钩子接收一个 `server` 参数，代表 Vite 服务器实例。

```javascript
configureServer(server) {
  server.httpServer.once('listening', () => {
    const mode = server.config.mode;
    const env = envConfig[mode];
    ...
  });
}
```

#### 4. 获取配置信息

从 `server.config` 中获取当前的模式（`mode`）和服务器配置（`port` 和 `host`），并根据模式从 `envConfig` 中获取相应的环境变量。

```javascript
const mode = server.config.mode;
const env = envConfig[mode];

const { port, host } = server.config.server;
const localAddress = `http://localhost:${port}/?displayPosition=1`;
const networkAddress = `http://${host}:${port}/`;
```

#### 5. 打印启动信息

将获取的信息整理成一个对象，并使用 `JSON.stringify` 将其格式化为漂亮的 JSON 字符串，然后打印到控制台。

```javascript
const serverInfo = {
  '当前连接服务器': '=========>>',
  'Local': localAddress,
  'Network': networkAddress,
  'name': env.VITE_NAME,
  'url': env.VITE_API_BASE_URL,
  'port': env.VITE_PORT
};

console.log(JSON.stringify(serverInfo, null, 2));
```

## 环境配置文件

为了让插件能够正确读取环境变量，我们需要一个环境配置文件 `env.js`。下面是配置文件的代码，并附带详细的 JSDoc 注释：

```javascript
/**
 * @typedef {Object} EnvironmentConfig
 * @property {string} VITE_API_BASE_URL - API 基础 URL
 * @property {number} VITE_PORT - 应用端口
 * @property {string} OTHER_VARIABLE - 其他变量
 * @property {string} VITE_NAME - 环境名称
 * @property {string} VITE_APP_ENV - 应用环境标识
 */

/**
 * 应用环境配置
 * @type {{development: EnvironmentConfig, staging: EnvironmentConfig, production: EnvironmentConfig, zxq: EnvironmentConfig}}
 */

const env = {
  development: {
    VITE_API_BASE_URL: 'https://dev.api.yourservice.com',
    VITE_PORT: 3000,
    OTHER_VARIABLE: 'value_for_dev',
    VITE_NAME: 'dev环境',
    VITE_APP_ENV: 'dev'
  },
  staging: {
    VITE_API_BASE_URL: 'https://staging.api.yourservice.com',
    VITE_PORT: 3001,
    OTHER_VARIABLE: 'value_for_staging',
    VITE_NAME: 'staging环境',
    VITE_APP_ENV: 'staging'
  },
  production: {
    VITE_API_BASE_URL: 'https://api.yourservice.com',
    VITE_PORT: 3002,
    OTHER_VARIABLE: 'value_for_production',
    VITE_NAME: 'prod环境',
    VITE_APP_ENV: 'prod'
  }
};

export default env
```

### 代码说明

#### 1. 定义 `EnvironmentConfig` 类型

通过 JSDoc 注释定义一个 `EnvironmentConfig` 类型，描述环境配置对象的结构。

```javascript
/**
 * @typedef {Object} EnvironmentConfig
 * @property {string} VITE_API_BASE_URL - API 基础 URL
 * @property {number} VITE_PORT - 应用端口
 * @property {string} OTHER_VARIABLE - 其他变量
 * @property {string} VITE_NAME - 环境名称
 * @property {string} VITE_APP_ENV - 应用环境标识
 */
```

#### 2. 定义环境配置对象

定义一个包含所有环境配置的对象 `env`，每个环境（如 `development`、`staging`、`production`）都有自己的配置。

```javascript
/**
 * 应用环境配置
 * @type {{development: EnvironmentConfig, staging: EnvironmentConfig, production: EnvironmentConfig, zxq: EnvironmentConfig}}
 */

const env = {
  development: {
    VITE_API_BASE_URL: 'https://dev.api.yourservice.com',
    VITE_PORT: 3000,
    OTHER_VARIABLE: 'value_for_dev',
    VITE_NAME: 'dev环境',
    VITE_APP_ENV: 'dev'
  },
  staging: {
    VITE_API_BASE_URL: 'https://staging.api.yourservice.com',
    VITE_PORT: 3001,
    OTHER_VARIABLE: 'value_for_staging',
    VITE_NAME: 'staging环境',
    VITE_APP_ENV: 'staging'
  },
  production: {
    VITE_API_BASE_URL: 'https://api.yourservice.com',
    VITE_PORT: 3002,
    OTHER_VARIABLE: 'value_for_production',
    VITE_NAME: 'prod环境',
    VITE_APP_ENV: 'prod'
  }
};

export default env
```

## 效果展示

当你运行 Vite 开发服务器时，将会在控制台看到如下输出：

```plaintext
当前连接服务器=========>>

{
  "Local": "http://localhost:3001/?displayPosition=1",
  "Network": "http://0.0.0.0:3001/",
  "name": "staging环境",
  "url": "https://staging.api.yourservice.com",
  "port": 3001
}
```

## 总结

通过编写一个简单的 Vite 插件，并结合环境配置文件，我们可以在开发服务器启动时打印出自定义的启动信息。这对于调试和确认环境配置非常有帮助。希望本文对你有所帮助，如果有任何问题或建议，欢迎交流讨论。

Happy coding! 🚀
