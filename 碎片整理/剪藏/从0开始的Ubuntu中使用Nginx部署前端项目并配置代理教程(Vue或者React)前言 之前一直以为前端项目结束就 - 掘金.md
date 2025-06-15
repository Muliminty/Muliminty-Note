![](https://p3-piu.byteimg.com/tos-cn-i-8jisjyls3a/796c19f610c146ffac65db71d7329490~tplv-8jisjyls3a-2:0:0:q75.image)

## 前言

之前一直以为前端项目结束就直接build了之后打包扔给后端就完事了，没想到最近新做了个项目，需要前端自己进行部署。之前一直没怎么做过，做起来手忙脚乱的，总算差不多了，写个文章记录一下。

## 前期准备

首先，需要有一个安装了Ubuntu的服务器，并且这个服务器配置好了SSH能远程登录。然后，需要在自己的电脑上下载：XShell和Xftp，一个用于远程连接到服务器并提供远程终端，另一个用于把本地的dist弄到服务器上面去。此外，还需要知道一些Linux/Ubuntu的命令和Linux的操作系统使用基础知识。

这两个软件的具体安装教程网上一搜一大把，这里就不再多说了。具体命令不知道也是，网上一搜全都有。就是你的服务器分了用户权限，可能需要你要个root用户的密码来去配置个sudoers，不然一堆命令没法用。

## 具体过程

## 一、nginx完全卸载（可跳过）

如果你之前安装过nginx，个人建议先走一下nginx卸载流程，防止发生奇奇怪怪的情况，如果没有可以直接跳过。我这里直接用的是root用户，如果是普通用户需要在命令开头加上sudo。

```
apt-get remove nginx nginx-common
apt-get purge nginx nginx-common
apt-get autoremove
apt-get remove nginx-full nginx-common
```

## 二、安装nginx

安装过程很简单，第一步，更新源列表

```
apt-get update
```

或者

```
sudo apt-get update
```

第二步，安装nginx

```
apt-get install nginx
```

或者

```
sudo apt-get install nginx
```

第三步，检查nginx是否安装成功。如果出现版本号说明安装成功。

```
nginx -v
```

## 三、nginx的配置文件以及进行配置

nginx的配置文件和静态资源文件分布在不同的地方，具体情况如下：

- /usr/sbin/nginx：主程序
- /etc/nginx：存放配置文件(nginx.conf)
- /usr/share/nginx：存放静态文件
- /var/log/nginx：存放日志

### 1. 配置监听端口号，访问IP和代理跨域

nginx提供的nginx.conf配置文件中并没有配置端口号和IP，这个我们需要自己手动添加，为了便于修改，我们将项目的配置放在其他地方文件里，然后在nginx.conf只需要将项目的配置文件所在路径引入即可。

计划将配置文件放到/etc/nginx/configs下，于是需要创建（这里可能也需要你加sudo前缀）这个文件夹

```
cd /etc/nginx
mkdir configs
```

然后创建project.conf（这里文件名和后缀名都是随便起的，可能需要sudo）

```
touch project.conf
```

最后，修改project.conf，将下面的内容修改成你想要的配置然后整个放到刚创建的project.conf里就行了： 先运行(如果你是普通用户的话一定记得加上sudo，并且不会用vim的需要网上搜搜教程，这玩意不知道怎么用的话用起来还是很懵逼的)

```
vim project.conf
```

```
server {
        listen       8080;                   # 自己设置端口号
        server_name  xxx.xxx.xxx.xxx;        # 自己设置ip地址 ip!
        #access_log  logs/host.access.log  main;
        location / {
            root   /usr/share/nginx/dist;        # 这里写项目打包好的dist文件的地址，可以改，这个随意
            index  index.html;               # 需要保证dist中有index.html文件
            try_files $uri $uri/ @router;
        }
 
        location @router {
            rewrite ^.*$ /index.html last;            # 解决重新刷新页面，页面空白的问题
        }
        
        location /api/ {   # 和之前开发的时候配代理服务器差不多，需要一个前缀
            proxy_pass http://xxx.xxx.xxx.xxx:9090/;    # 此处配置代理，把请求的后端域名端口啥的放这里
        }
        error_page   500 502 503 504  /50x.html;     #错误页面
}
```

### 2. 把你的配置导入到nginx的配置里

执行下面的命令，还是普通用户记得加sudo。

```
cd /etc/nginx
vim nginx.conf    
```

然后，在这个位置![QQ截图20231006201756.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a3a3ca4920344f4928577d918a755f8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=886&h=293&s=22336&e=png&b=1e1e1e) 加上这一句，记得加分号！nginx的语法检查非常严格的。

```
include /etc/nginx/configs/*.conf; 
```

## 四、Nginx，启动！

启动nginx

```
systemctl start nginx
```

停止nginx

```
systemctl stop nginx
```

重启nginx

```
systemctl reload nginx
```

查看nginx的启停状态（如果正常启动，会看到绿色的Running）

```
systemctl status nginx
```

## 可能遇到的问题

1. 启动或者重启失败，请使用`nginx -t`检查一下，大概率是犯了语法错误，忘了加分号，注释用的‘//’什么的。如果检查结果是ok，则说明没问题，那这其实就有大问题了，这个情况我没遇到，需要大家自己解决了。
2. 启动了，也没啥报错，就是访问的时候一直服务器拒绝访问。这个我遇到了，我说一下我的解决步骤，可能有些是没必要的，但是解决了我的问题：首先，从服务器的提供商那里的工作台修改一下服务器的安全组策略，把进入方向的对应你的端口的那里给放行了。看看解决没解决，一般来说这就解决了要是还没有，用sudo ufw status看看防火墙状态，要是不活动，坏了，我不会了就，否则，就sudo udo ufw allow 你的端口号给放行了就行了。
3. 如果你的服务器有端口映射的话，一定记得问清楚端口是如何映射的，要部署到你要部署的那个外部端口映射到的那个内部端口上！

本文收录于以下专栏

![cover](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95414745836549ce9143753e2a30facd~tplv-k3u1fbpfcp-jj:160:120:0:0:q75.avis)

上一篇

如何将Java Swing项目打包为exe文件

![avatar](https://p3-passport.byteacctimg.com/img/user-avatar/dfff7ae734ca736b246b4bdbdb1a90ef~70x70.awebp)