# 基于 Vite + React 实现国际化功能

在现代前端开发中，国际化是一个不可或缺的功能。本文将详细介绍如何在 Vite + React 项目中集成国际化，并使用 Ant Design 组件库。我们将从项目的基础配置开始，逐步实现一个可切换多语言的应用。

## 项目配置

首先，我们需要确保我们的项目使用 Vite 和 React。你可以按照以下步骤进行配置。

### 1. 创建项目

如果你还没有创建项目，可以使用 Vite 脚手架工具创建一个新的 React 项目：

```bash
npm create vite@latest my-project --template react
cd my-project
npm install
```

### 2. 安装依赖

我们需要安装 `i18next` 和 `react-i18next` 以实现国际化功能，同时安装 `antd` 以使用 Ant Design 组件库：

```bash
npm install i18next react-i18next antd
```

### 3. 配置 `i18next`

在项目的 `src` 目录下创建一个 `i18n.js` 文件，并添加以下内容：

```js
// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import EN_US from './languages/en_US.json';
import zh_CN from './languages/zh_CN.json';
import zh_TW from './languages/zh_TW.json';

const resources = {
  'en-US': {
    translation: EN_US
  },
  'zh-CN': {
    translation: zh_CN
  },
  'zh-TW': {
    translation: zh_TW
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'zh-CN',
  interpolation: {
    escapeValue: false
  },
  fallbackLng: 'zh-CN'
});

export default i18n;
```

在 `src` 目录下创建 `languages` 文件夹，并添加 `en_US.json`、`zh_CN.json` 和 `zh_TW.json` 文件。这些文件将包含各自语言的翻译内容。例如：

```json
// src/languages/en_US.json
{
  "welcome": "Welcome"
}

// src/languages/zh_CN.json
{
  "welcome": "欢迎"
}

// src/languages/zh_TW.json
{
  "welcome": "歡迎"
}
```

### 4. 配置 Ant Design 主题和语言

创建一个 `config.js` 文件以集中管理 Ant Design 的主题和语言配置：

```js
// src/config.js
import { zhCN, enUS, zhTW } from 'antd/es/locale';

export const getAntDesignLocale = (lng) => {
  switch (lng) {
    case 'zh-CN':
      return zhCN;
    case 'zh-TW':
      return zhTW;
    case 'en-US':
    default:
      return enUS;
  }
};

export const themeConfig = {
  token: {
    borderRadius: 6,
    colorPrimary: 'rgb(122, 193, 67)',
  },
  components: {
    Button: {
      colorPrimary: 'rgb(122, 193, 67)',
      algorithm: true,
    },
  },
};
```

### 5. 创建语言上下文

为了管理语言状态，我们可以使用 React 的上下文 API。创建一个 `LanguageContext.jsx` 文件：

```jsx
// src/i18n/LanguageContext.jsx
import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'zh-CN');

  const changeLanguage = (lng) => {
    setLanguage(lng);
    localStorage.setItem('language', lng);
    i18n.changeLanguage(lng); // 更新 i18n 的当前语言
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
```

### 6. 更新 `index.jsx` 文件

确保在 `index.jsx` 中使用 `LanguageProvider` 并配置 `ConfigProvider`：

```jsx
// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { ConfigProvider } from 'antd';
import { getAntDesignLocale, themeConfig } from './config';
import './i18n';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

const Root = () => {
  const { language } = useLanguage();

  return (
    <ConfigProvider
      locale={getAntDesignLocale(language)}
      theme={themeConfig}
    >
      <App />
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <Root />
    </LanguageProvider>
  </React.StrictMode>
);
```

### 7. 创建语言切换组件

添加一个简单的语言切换组件 `LanguageSwitcher.jsx`：

```jsx
// src/LanguageSwitcher.jsx
import React from 'react';
import { useLanguage } from './i18n/LanguageContext';

const LanguageSwitcher = () => {
  const { changeLanguage } = useLanguage();

  return (
    <div>
      <button onClick={() => changeLanguage('en-US')}>English</button>
      <button onClick={() => changeLanguage('zh-CN')}>中文</button>
      <button onClick={() => changeLanguage('zh-TW')}>繁體中文</button>
    </div>
  );
};

export default LanguageSwitcher;
```

### 8. 更新 App 组件

在你的 `App` 组件中使用 `LanguageSwitcher`：

```jsx
// src/App.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const App = () => {
  const { t } = useTranslation();

  return (
    <div>
      <LanguageSwitcher />
      <h1>{t('welcome')}</h1>
    </div>
  );
};

export default App;
```

### 9. 验证和调试

启动你的应用并测试语言切换功能：

```bash
npm run dev
```

确保在点击语言切换按钮后，语言能够正确切换且页面不需要重新加载。检查 `localStorage` 中的语言设置是否正确保存，并确保翻译内容在切换语言时能够更新。

### 总结

通过上述步骤，我们在 Vite + React 项目中成功实现了国际化功能，并集成了 Ant Design 组件库。我们使用了 `i18next` 来管理多语言资源，通过上下文 API 管理语言状态，并实现了语言切换功能。希望这篇博客能够帮助你在项目中实现类似的功能。如果有任何问题或需要进一步调整，请根据实际需求进行修改。
