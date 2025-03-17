
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