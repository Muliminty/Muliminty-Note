# vite打包报错
```javascript
vite v4.5.3 building for production...
✓ 3556 modules transformed.
warnings when minifying css:
▲ [WARNING] Unexpected "{" [css-syntax-error]

    <stdin>:1059:2:
      1059 │ } {
           ╵   ^
```

![](附件/vite%20打包报错.png)

导致的原因
scss模块化的时候类名会混淆，
这样改动antd样式的时候需要使用global让类名不混淆

![](附件/vite%20打包报错-1.png)

解决方式
原文地址
[CSS 缩小警告不包含文件名，因此难以追踪 ·问题 #15915 ·vitejs/vite (github.com)](https://github.com/vitejs/vite/issues/15915)

![](附件/vite%20打包报错-2.png)

直接注释global之后就没报错了，确定原因就是这个

![](附件/vite%20打包报错-3.png)


