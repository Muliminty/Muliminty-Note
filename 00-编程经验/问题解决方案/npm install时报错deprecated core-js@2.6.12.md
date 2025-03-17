
npm i core-js

---

```
zlink_pc_cn_front@5.0.0 E:\mvp\zlink_pc_cn_front  
+-- core-js@3.40.0  -> E:\mvp\zlink_pc_cn_front\node_modules\_core-js@3.40.0@core-js extraneous  
+-- react-app-polyfill@2.0.0 -> E:\mvp\zlink_pc_cn_front\node_modules\_react-app-polyfill@2.0.0@react-app-polyfill  
| `-- core-js@3.40.0  -> E:\mvp\zlink_pc_cn_front\node_modules\_core-js@3.40.0@core-js  
`-- workbox-webpack-plugin@5.1.4 -> E:\mvp\zlink_pc_cn_front\node_modules\_workbox-webpack-plugin@5.1.4@workbox-webpack-plugin  
  `-- workbox-build@5.1.4 -> E:\mvp\zlink_pc_cn_front\node_modules\_workbox-build@5.1.4@workbox-build  
    `-- strip-comments@1.0.2 -> E:\mvp\zlink_pc_cn_front\node_modules\_strip-comments@1.0.2@strip-comments  
      `-- babel-plugin-transform-object-rest-spread@6.26.0 -> E:\mvp\zlink_pc_cn_front\node_modules\_babel-plugin-transform-object-rest-spread@6.26.0@babel-plugin-transform-object-rest-spread  
        `-- babel-runtime@6.26.0 -> E:\mvp\zlink_pc_cn_front\node_modules\_babel-runtime@6.26.0@babel-runtime  
          `-- core-js@2.6.12  -> E:\mvp\zlink_pc_cn_front\node_modules\_core-js@2.6.12@core-js
```

根据依赖树分析，主要问题是由于多版本core-js共存（2.x和3.x）导致的依赖冲突。建议通过以下步骤解决：

```bash:e:\project2\zlink_pc_cn_front
# 1. 清理无效依赖
npm uninstall core-js@2.6.12 core-js@3.40.0 --save

# 2. 统一core-js版本（强制使用3.41.0）
npm install core-js@3.41.0 --save-exact

# 3. 更新babel相关依赖
npm install babel-runtime@7.24.1 --save

# 4. 清除缓存并重新安装
npm cache clean --force
rmdir /s /q node_modules
npm install --legacy-peer-deps
```

在package.json中添加版本锁定：

```diff json:e:\project2\zlink_pc_cn_front\package.json
{
  "dependencies": {
-    "core-js": "^3.41.0",
+    "core-js": "3.41.0",
    // ...其他依赖保持不变...
  },
+  "resolutions": {
+    "core-js": "3.41.0",
+    "babel-runtime": "7.24.1"
+  }
}
```

如果仍存在冲突，可添加npm overrides配置：

```json:e:\project2\zlink_pc_cn_front\package.json
{
  "overrides": {
    "babel-runtime": "7.24.1",
    "workbox-build": {
      "strip-comments": {
        "babel-runtime": "7.24.1"
      }
    }
  }
}
```





`resolutions` 字段是用于强制锁定特定依赖版本的特殊配置，主要用来解决嵌套依赖冲突问题。在您的配置中：

```json:e:\project2\zlink_pc_cn_front\package.json
"resolutions": {
  "core-js": "3.41.0",
  "babel-runtime": "7.24.1"
}
```

表示强制项目中**所有依赖链**都必须使用：
1. `core-js@3.41.0`（覆盖旧版 2.x）
2. `babel-runtime@7.24.1`（覆盖旧版 6.x）

该配置常见于以下场景：
```bash
# 当出现类似这样的警告时
npm WARN Could not resolve dependency:
npm WARN peer dependency core-js@^2.6.5 from babel-runtime@6.26.0
```

需要特别注意：
1. 这是 **Yarn** 的官方特性，在 npm 中需配合 [`npm-force-resolutions`](https://www.npmjs.com/package/npm-force-resolutions) 使用
2. 在您的项目中需要这样配置：

```diff json:e:\project2\zlink_pc_cn_front\package.json
{
  "name": "zlink_pc_cn_front",
  "version": "5.0.0",
+ "scripts": {
+   "preinstall": "npx npm-force-resolutions"
+ },
  "resolutions": {
    "core-js": "3.41.0",
    "babel-runtime": "7.24.1"
  }
}
```

安装必要工具：
```bash:e:\project2\zlink_pc_cn_front
npm install npm-force-resolutions --save-dev
npm install --legacy-peer-deps
```

该方案比 `overrides` 更彻底，会强制所有层级的子依赖都使用指定版本。如果不需要这么强制的控制，可以使用 npm 官方推荐的 `overrides` 字段替代。