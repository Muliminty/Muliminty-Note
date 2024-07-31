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
![image.png](https://cdn.nlark.com/yuque/0/2024/png/12539472/1722392305679-15b796c9-2d38-4d5d-b00e-78da4c218866.png#averageHue=%23e7e8ee&clientId=ua028eaac-c433-4&from=paste&height=566&id=u6b414cac&originHeight=566&originWidth=729&originalType=binary&ratio=1&rotation=0&showTitle=false&size=39265&status=done&style=none&taskId=u9c5e20aa-7aa3-4381-a81e-606b1d820f8&title=&width=729)
导致的原因
scss模块化的时候类名会混淆，
这样改动antd样式的时候需要使用global让类名不混淆
![image.png](https://cdn.nlark.com/yuque/0/2024/png/12539472/1722392340045-d282179d-a354-4e80-b9d2-6d495a312d5f.png#averageHue=%23dbf0d1&clientId=ua028eaac-c433-4&from=paste&height=285&id=u99fb5b12&originHeight=285&originWidth=941&originalType=binary&ratio=1&rotation=0&showTitle=false&size=35824&status=done&style=none&taskId=u6e093495-fe51-4fe0-86b4-05e57937a00&title=&width=941)
解决方式
原文地址
[CSS 缩小警告不包含文件名，因此难以追踪 ·问题 #15915 ·vitejs/vite (github.com)](https://github.com/vitejs/vite/issues/15915)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/12539472/1722392384839-f618c059-1207-438b-a444-38c9bf3a9a87.png#averageHue=%2313181f&clientId=ua028eaac-c433-4&from=paste&height=930&id=u202e2423&originHeight=930&originWidth=1034&originalType=binary&ratio=1&rotation=0&showTitle=false&size=89274&status=done&style=none&taskId=ucefe2762-a750-405b-9cc5-ed5b3e9a98f&title=&width=1034)

直接注释global之后就没报错了，确定原因就是这个

![image.png](https://cdn.nlark.com/yuque/0/2024/png/12539472/1722392452843-3ed51d21-f705-4c15-a566-461c72823081.png#averageHue=%236fabc6&clientId=ua028eaac-c433-4&from=paste&height=790&id=u7bec5201&originHeight=790&originWidth=729&originalType=binary&ratio=1&rotation=0&showTitle=false&size=76167&status=done&style=none&taskId=u3c176a93-fa61-4e44-a286-43f76df7461&title=&width=729)


