[sgo: 将任意一个目录设置成一个静态服务器，用于快速原型设计的开发服务器。 将目录设置为静态服务器。它提供了404整洁的界面，用于列出目录的内容并切换到子文件夹。](https://gitee.com/jaywcjlove/sgo#%E5%91%BD%E4%BB%A4%E5%B8%AE%E5%8A%A9)

```
npm install -g sgo # 安装 sgo
sgo --fallback index.html # 创建静态服务，预览网站
```

## 流程

创建一个 Doc 的文件夹 输入指令

```
npm install -g sgo

git clone https://github.com/ant-design/ant-design.git --depth 1 -b gh-pages // 安装antd文档
```

这个时候文件夹生成对应文档的文件夹

![这是图片](附件/Pasted%20image%2020230511110635.png 'Magic Gardens')

然后进入对应文件夹输入指令 

```
cd ant-design
sgo --fallback index.html
```

就部署成功了

![这是图片](附件/Pasted%20image%2020230511111054.png 'Magic Gardens')

## 各种文档资源

React
```
git clone https://github.com/reactjs/zh-hans.reactjs.org.git --depth 1 -b gh-pages
cd zh-hans.reactjs.org # 进入目录
sgo --fallback index.html # 创建静态服务，预览网站
```

Vue

```
git clone https://github.com/reactjs/zh-hans.reactjs.org.git --depth 1 -b gh-pages
cd zh-hans.reactjs.org # 进入目录
sgo --fallback index.html # 创建静态服务，预览网站
```

Ant Design

```
git clone https://github.com/ant-design/ant-design.git --depth 1 -b gh-pages
# or Gitee
git clone https://gitee.com/ant-design/ant-design.git --depth 1 -b gh-pages
```

Ant Design Pro

```
git clone https://github.com/ant-design/ant-design-pro.git --depth 1 -b gh-pages
# or Gitee
git clone https://gitee.com/ant-design/ant-design-pro-site.git --depth 1 -b master
```
Element

```
# Vue版
git clone https://github.com/ElemeFE/element.git --depth 1 -b gh-pages
# React版
git clone https://github.com/ElemeFE/element-react.git --depth 1 -b gh-pages
```

