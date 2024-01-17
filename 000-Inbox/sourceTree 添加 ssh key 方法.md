
# sourceTree 添加 ssh key 方法

## 使用 git 客户的生成公私钥：id_rsa、id_rsa.pub

- 1.1 设置 Git 的 user name 和 email：

```
git config --global user.name "xxx"
git config --global user.email "xxx.mail@xxx.com"
```

- 1.2. 生成 SSH 密钥过程：
  - 1.2.1. 检查是不是已经存在密钥（能进去说明已经存在，就删掉文件夹，重新创建）：
  - cd ~/.ssh
- 1.3. 生成 SSH 密钥
  - ssh-keygen -t rsa -C “<xxx.mail@xxx.com>”
  - 按 3 个回车，密码为空。
- 1.4. 文件存放位置 ~/.ssh，如果是 window 的话就在：C:\Users\Administrator.ssh 下面，当然如果你不是 Administrator 用户的话，需要换成对应的用户。

## 设置 SourceTree 的 SSH 客户端

- 配置 SourceTree 的 SSH 客户的为：OpenSSH
  - 1.1. 工具 -> 选项
  - ![20170107104616094.png](https://cdn.nlark.com/yuque/0/2023/png/12539472/1701051365460-12fea6b3-89d4-40e0-84af-5f20cea09153.png#averageHue=%23f2eeee&clientId=u053910cd-5928-4&from=drop&id=u375ed370&originHeight=416&originWidth=687&originalType=binary&ratio=1&rotation=0&showTitle=false&size=48634&status=done&style=none&taskId=u21564150-8a10-46fa-9e97-96aaa6a7955&title=)
  - 1.2. 设置 OpenSSH, 这时候，SSH 密钥这一栏自然会去选择当前用户下的 .ssh 目录下的 id_rsa 这个私钥：
  - ![20170107104654561.png](https://cdn.nlark.com/yuque/0/2023/png/12539472/1701051384547-fe0b5632-4709-47e3-852c-7cc3c7fe465a.png#averageHue=%23f1efed&clientId=u053910cd-5928-4&from=drop&id=ud54d9613&originHeight=758&originWidth=577&originalType=binary&ratio=1&rotation=0&showTitle=false&size=95966&status=done&style=none&taskId=ua9f6082b-b497-4388-b5fb-5e8d601a204&title=)

## 添加 ~/.ssh/id_rsa.pub 文件内容到 git 服务器里面去

- 3.1. 比如你的 git 服务是 github，那么你需要在 [https://github.com/settings/keys](https://github.com/settings/keys) 里面添加 SSH ke
  - ![20170107105602777.png](https://cdn.nlark.com/yuque/0/2023/png/12539472/1701051419938-9e11d626-48ae-448e-b155-28526f8cb175.png#averageHue=%23fbfafa&clientId=u053910cd-5928-4&from=drop&id=u133a5315&originHeight=718&originWidth=1352&originalType=binary&ratio=1&rotation=0&showTitle=false&size=107125&status=done&style=none&taskId=u00149937-2590-4f24-bbc5-493ddcac5dd&title=)
  - ![20170107110027846.png](https://cdn.nlark.com/yuque/0/2023/png/12539472/1701051423340-548a0a60-5089-4a91-b45b-4ec6f6c182a3.png#averageHue=%23faf9f8&clientId=u053910cd-5928-4&from=drop&id=u80db61b3&originHeight=712&originWidth=1298&originalType=binary&ratio=1&rotation=0&showTitle=false&size=130921&status=done&style=none&taskId=u347fe2a2-3070-4ad6-a6a2-f542fae5686&title=)
- 3.2.SourceTree 来下载 git 项目
  - 3.2.1. 复制你的 git 地址：<git@github.com>:ztd770960436/justgame.git
  - 3.2.2. 从 SourceTree 里面新建一个地址，这时候你发现你本地已经可以下载远程的 git 代码了
  - ![20170107110045393.png](https://cdn.nlark.com/yuque/0/2023/png/12539472/1701051491744-77325ac7-2cff-4d69-836e-33e3b9ab5d0a.png#averageHue=%23e4e3e3&clientId=u053910cd-5928-4&from=drop&id=u069e42e9&originHeight=376&originWidth=723&originalType=binary&ratio=1&rotation=0&showTitle=false&size=32217&status=done&style=none&taskId=ue18bf26b-79b1-42c5-92e8-35b2ef23989&title=)

## 解释

1.ssh-keygen 是公钥私钥的非对称加密方式：<br /> 1.1. 公钥：用于向外发布，任何人都能获取。<br /> 1.2. 私钥：要自己保存，切勿给别人<br />2. 公钥私钥加解密的原理<br /> 2.1. 客户端把自己的公钥存放到要链接的远程主机上（相当于我们把自己的 id_rsa.pub 存放到 git 服务器上）<br /> 2.2. 客户端要链接远程主机的时候，远程主机会向客户的发送一条随机的字符串，客户的收到字符串之后使用自己的私钥对字符串加密然后发送到远程主机，远程主机根据自己存放的公钥对这个字符串进行解密，如果解密成功证明客户端是可信的，直接允许登录，不在要求登录。
