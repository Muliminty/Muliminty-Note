在 Ubuntu 上配置 GitHub SSH
1
2
3
【Ubuntu软件篇】Git的安装及github远程仓库ssh连接_ubuntu g…
https://blog.csdn.net/weixin_44994302/article/details/122447879
ubuntu 安装Git与配置SSH key_ubuntu系统设置本地git的ssh-CS…
https://blog.csdn.net/yunna520/article/details/83346207
ubuntu 安装Git与配置SSH key_ubuntu系统设置本地git的ssh-CS…
https://blog.csdn.net/yunna520/article/details/83346207
在 Ubuntu 上配置 GitHub SSH 连接可以提高代码管理的安全性和效率。以下是详细步骤：

1. 安装 Git

打开终端，输入以下命令安装 Git：

sudo apt-get install git
2. 配置 Git 用户信息

设置全局用户名和邮箱：

git config --global user.name "muliminty"
git config --global user.email "313195303@qq.com"

3. 生成 SSH 密钥

生成 SSH 密钥对：

ssh-keygen -t rsa -C "your_email@example.com"
按回车键接受默认路径和文件名。生成的密钥文件位于 ~/.ssh 目录下，id_rsa 是私钥，id_rsa.pub 是公钥。

4. 添加 SSH 密钥到 GitHub

打开公钥文件并复制内容：

cat ~/.ssh/id_rsa.pub
登录 GitHub，进入 Settings -> SSH and GPG keys -> New SSH key，将复制的公钥粘贴到 Key 栏中，然后点击 Add SSH key。

5. 测试 SSH 连接

测试是否成功连接到 GitHub：

ssh -T git@github.com
如果看到类似 "Hi username! You've successfully authenticated" 的消息，则表示配置成功。

6. 将本地仓库连接到远程仓库

在本地项目目录中，添加远程仓库地址：

git remote add origin git@github.com:Username/Repository_Name.git
如果需要删除错误的远程仓库地址，可以使用以下命令：

git remote remove origin
通过以上步骤，你已经成功在 Ubuntu 上配置了 GitHub 的 SSH 连接
1
2
。