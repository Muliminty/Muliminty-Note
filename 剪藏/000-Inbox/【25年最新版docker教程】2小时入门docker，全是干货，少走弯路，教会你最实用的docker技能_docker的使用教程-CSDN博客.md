
[什么是 Docker · Docker -- 从入门到实践](https://docker-practice.github.io/zh-cn/introduction/what.html)

#### 文章目录

- [一、认识docker](#docker_7)
- - [1. 镜像](#1__11)
    - [2. 容器](#2__13)
    - [3. 仓库](#3__19)
- [二、快速安装](#_27)
- - [1. [可选] 为docker配置镜像加速](#1__docker_37)
    - [2. 创建并运行你的第一个docker容器](#2_docker_50)
- [三、常用docker命令](#docker_79)
- - [1. docker pull 与docker push](#1_docker_pull_docker_push_80)
    - [2. docker images](#2_docker_images_101)
    - [3. docker rmi](#3_docker_rmi_106)
    - [4. docker ps](#4_docker_ps_109)
    - [5. docker rm](#5_docker_rm_113)
    - [6. docker logs](#6_docker_logs_120)
    - [7. docker exec](#7_docker_exec_124)
    - [8. docker stop 和 docker start](#8_docker_stop__docker_start_135)
    - [9. docker run](#9_docker_run_141)
    - [10. docker save 和 docker load](#10_docker_save__docker_load_150)
    - [11. docker build](#11_docker_build_155)
- [四、数据卷](#_186)
- [1. 快速体验](#1__197)
- [五、docker 网络](#docker__211)
- - [1. docker network create 与 docker network ls](#1_docker_network_create__docker_network_ls_222)
    - [2. docker network rm](#2_docker_network_rm_224)
    - [3. docker network prune](#3_docker_network_prune_226)
    - [4. docker network connect](#4_docker_network_connect_228)
- [六、docker compose](#docker_compose_235)
- [七、Linux下安装docker和docker compose](#Linuxdockerdocker_compose_271)
- - [1. yum 更新到最新版本](#1_yum__272)
    - [2. 安装Docker所需的依赖包](#2_Docker_292)
    - [3.设置Docker的yum的源](#3Dockeryum_324)
    - [4. 查看仓库所有Docker版本](#4_Docker_334)
    - [5. 安装Docker](#5_Docker_359)
    - [6. 安装Docker-Compose](#6_DockerCompose_363)
    - [7. 启动Docker并添加开机自启动](#7_Docker_370)
    - [8.卸载docker](#8docker_383)
    - [9.设置国内镜像](#9_396)

---

![](https://i-blog.csdnimg.cn/direct/630b8a10860c403296ec5ff63ed2dc7b.png)

## 一、认识docker

> Docker 是一个开源的容器化平台，它可以让开发者将应用程序及其依赖项打包成一个可移植的容器，然后在任何支持 Docker 的环境中运行

### 1. 镜像

镜像是一个只读的模板，包含了运行容器所需的文件系统、应用程序代码、运行时环境、库等。

### 2. 容器

容器是基于镜像创建的运行实例，它是一个独立的、可执行的环境，包含了应用程序及其所有依赖项。容器之间相互隔离，每个容器都有自己的文件系统、进程空间、网络配置等，就像在一台物理机上运行着多个相互独立的虚拟机一样，但容器相比虚拟机更加轻量级，启动速度更快，资源占用更少。

`通俗版解释`

> 就好比我们用U盘拷贝了一份QQ，把他们放在其他电脑上运行，其他电脑就是容器，U盘里存的QQ就是镜像  
> 一个容器就是一个独立的Linux系统，通过镜像创建容器，就是在Linux系统中运行这个镜像所指代的程序，如MySQL, Nginx等

### 3. 仓库

仓库是用于存储和共享镜像的地方，类似于代码仓库。Docker 官方提供了一个公共的仓库 Docker Hub，里面包含了大量的官方镜像和社区贡献的镜像，开发者可以方便地从仓库中拉取所需的镜像，也可以将自己构建的镜像推送到仓库中供他人使用。

## 二、快速安装

考虑到大部分初学者没有Linux操作系统，本节教程将告诉大家如何在windows上学习和使用docker命令  
Linux下安装docker请看文章最后部分

> 首先先下载 docker desktop：https://www.docker.com/products/docker-desktop/

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/df5a860fe61d4e319974bd1874cdd4a7.png)

安装完成后，可以测试一下在 cmd 中是否能执行 [docker 命令](https://so.csdn.net/so/search?q=docker%20%E5%91%BD%E4%BB%A4&spm=1001.2101.3001.7020)  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/1ae12ea31e6842b8831f65b4d2f1c887.png)

### 1. [可选] 为docker配置镜像加速

直接在docker上拉取镜像会用到国外的仓库，如果没有梯子可能会比较慢或者频繁拉取失败，可以会docker配置国内镜像来加速镜像的拉取

阿里云容器镜像服务地址：https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors

每个人都有一个独属的加速器地址，复制自己的地址

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c733faa8c1064f3ba044fc8da4d1f588.png)

打开设置，找到docker engine，在如下位置粘贴刚才复制的地址

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5788f846564c44588b0782a3f2527c1d.png)

### 2. 创建并运行你的第一个docker容器

`docker run -d --name mysql -p 3306:3306 -e TZ=Asia/Shanghai -e MYSQL_ROOT_PASSWORD=123 mysql`

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/bf126a7d339c41518e04d24b0229be0a.png)  
启动成功，在docker desktop中点击 containers 可以看到我们的 mysql 容器已经启动  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5c78c5572d6048a49fcf04bc0cb282f2.png)  
我们可以用Idea连接数据库测试一下，输入用户名 root 和密码 123，显示连接成功，连接上后可以看到 mysql 默认的几个数据库

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/7cd55ea2c8844e009ab780e253d0ba80.png)

那么我们来解释一下这个命令是什么意思呢

`docker run -d --name mysql -p 3306:3306 -e TZ=Asia/Shanghai -e MYSQL_ROOT_PASSWORD=123 mysql`

- `docker run` 创建和启动一个新容器。
- `--name` 用于为创建的容器指定一个自定义的名称。
- `-p` 表示端口映射。这个参数将主机的 3306 端口映射到容器内部的 3306 端口。
- `-e` 用于设置容器内的环境变量。
- `mysql` 最后一个参数 mysql 表示要使用的镜像名称。镜像名称一般分两部分组成：[repository]:[tag]。如mysql:5.7。在没有指定tag时，默认是latest，代表最新版本的镜像。

综上所述，这条命令的作用是在后台创建一个名为 mysql 的容器，将主机的 3306 端口映射到容器内的 3306 端口，设置容器内的时区为上海时区，并将 MySQL 数据库 root 用户的密码设置为 123，最后使用 mysql 镜像来启动容器并运行其中的 MySQL 服务。

可能有的小伙伴会有疑问，这个环境变量我起个名字叫MYSQL_ROOT_PASSWORD设置个123，我的mysql的root用户密码就是123了？

那我起别的名字行吗？我怎么知道要设置哪些环境变量？

回答：起别的名字不行，要设置哪些环境变量要根据镜像提供方的文档来决定，设置MYSQL_ROOT_PASSWORD环境变量是mysql镜像提供方设计的规则，设置好了之后，在创建容器的时候，镜像里会有脚本代码读取这个环境变量的值设置给root用户的密码

## 三、常用docker命令

### 1. docker pull 与docker push

`docker pull`  
拉取镜像到本地，如拉取mysql镜像可以用docker pull mysql：版本号，不写默认是最新  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/0d46c5d9c31a4ea8b443b4fff1fde739.png)

`dokcer push`【选学】

这里用push mysql到自己的仓库做示范

在自己的docker hub中登录账号，并创建仓库

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/2ffe607a22ad4d71831a644da7af2b4e.png)  
先给mysql镜像打个标签，docker tag 本地镜像名:tag namespace/仓库名

然后再用docker push命令推送  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/f09a23048be64ef088084195310d37ac.png)

可以在docker hub仓库中看到我们刚刚推送的mysql镜像仓库  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/8a7f96e969d741c6ac60b261ab4022ba.png)

### 2. docker images

查看本地都有哪些镜像  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e1a82da1426e48b1bdf7b203c8fb8524.png)

### 3. docker rmi

删除本地镜像  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c2f5687696fe4cc3acf6a550cfaac603.png)

### 4. docker ps

列出当前`正在运行`的 Docker 容器  
docker ps -a ，列出所有创建的容器，包括停止运行的容器，-a 代表 --all，“ps” 是 “process status” 的缩写  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/cf0c1f10230c4b79a9194f1e03da540e.png)

### 5. docker rm

删除指定容器，删除前需要停止运行容器，或使用docker rm -f 强制删除

docker rm 容器ID或者容器名都可以删除容器

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a764c375a2354b93a5eb6d3e5229af60.png)  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d7d17211564540589c9c68ee9978e2d8.png)

### 6. docker logs

查看容器运行日志

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/bac559df95464fc88bf9e77ac8850c5b.png)

### 7. docker exec

进行容器内部  
docker exec -it rabbitmq bash 这条命令的意思是在一个正在运行的名为 rabbitmq 的 Docker 容器中执行交互式的 bash 命令

-i 和 -t 是两个常用的选项，通常一起使用。

-i 表示交互式（interactive）操作，它会保持标准输入打开，使得用户可以与容器内的命令进行交互，输入命令并获取输出。

-t 表示分配一个伪终端（tty），它为容器内的命令提供了一个类似于终端的环境，使得命令的输出更易于阅读和交互，并且支持一些基于终端的操作，如使用上下键查看历史命令等。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5840eb7454f2402ba48f260b70c557f2.png)

### 8. docker stop 和 docker start

docker stop 停止容器运行  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/6768f1f954ae4ff0801bae47782036a5.png)  
docker start 开始运行容器  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/5dab0475db584308888f87fb8b0ebb78.png)

### 9. docker run

前面已经演示过使用docker run 创建并运行mysql镜像  
`docker run -d --name mysql -p 3306:3306 -e TZ=Asia/Shanghai -e MYSQL_ROOT_PASSWORD=123 mysql`

那么docker run 和docker start 有什么区别呢？

> - docker run：用于创建一个新的容器，并在该容器中启动指定的镜像所对应的应用程序或进程。它会先检查本地是否存在指定的镜像，如果不存在，则会从默认的镜像仓库（如 DockerHub）中拉取该镜像，然后基于该镜像创建容器，并为容器分配所需的资源，最后启动容器内的应用程序。如果镜像已经存在，则直接使用本地镜像创建并启动容器。
> - docker start用于启动已经创建但处于停止状态的容器。它不会创建新的容器，也不会检查或拉取镜像，而是直接启动之前已经创建好的处于停止状态的容器，使容器内的应用程序或进程继续运行。

### 10. docker save 和 docker load

docker save把镜像打包到本地，tar和zip包都行，如果一个镜像有多个tag，可以在后面加上tag保存指定版本的镜像，如果不写的话，所有版本都会被保存，加载的时候所有版本也都会被加载

docker load用于加载本地的压缩包成为docker镜像  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/95c336f2406d44c5a2226b3ff71b134c.png)

### 11. docker build

一般docker build是用来执行Dockerfile文件的，制作自己的镜像时会用到

假设当前目录下有一个Dockerfile文件  
`docker build -t paran/myapp:3.0 -f ./Dockerfile .`

1. `-t` --tag: 用于为构建的镜像指定标签和名称，格式为 [仓库地址]/[用户名]/[镜像名]:[标签]，不写仓库地址默认就是docker hub的地址，没有私服可以不用管。
2. `-f` --file：指定 Dockerfile 的路径和文件名。
3. 最后的 `.` 代表构建上下文的路径，也就是告诉 Docker，将当前目录及其包含的所有文件和子目录作为构建镜像时可访问的范围。

> Dockerfile文件示例

```
# 基础镜像
FROM openjdk:8-jre-slim

# 作者
MAINTAINER xxx

# 配置
ENV PARAMS=""

# 时区
ENV TZ=PRC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 添加应用
ADD target/my-app.jar /my-app.jar

ENTRYPOINT ["sh","-c","java -jar $JAVA_OPTS /my-app.jar $PARAMS"]
```

## 四、数据卷

数据卷的作用就是把容器内部的文件或文件夹映射到宿主机上，这样想修改某个文件就不需要再用docker exec命令跑到容器内部了，比较方便，同时如mysql存储的文件，我们希望它能挂载到宿主机上，这样不会导致容器的体积过大，或者误删容器导致数据也没了。  
`容器与数据卷的挂载要在创建容器时配置，对于创建好的容器，是不能设置数据卷的`

|命令|作用|
|---|---|
|docker volume create|创建数据卷|
|docker volume ls|查看所有数据卷|
|docker volume rm|删除指定数据卷|
|docker volume inspect|查看某个数据卷详情|
|docker volume prune|清除数据卷|

## 1. 快速体验

`docker run -d --name nginx -p 80:80 -v html:/usr/share/nginx/html nginx`  
把nginx容器内部的`/usr/share/nginx/html`映射到`html`数据卷上，这里映射的是文件夹，映射文件和文件夹都行  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/62dce338fb9144e4bf70a94bc2f7634a.png)  
使用`docker volume inspect html`命令查看数据卷的详细信息，发现html数据卷对应的是`/var/lib/docker/volumes/html/_data`文件夹（Linux系统下有效）  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/0faeb004210245e48694ae4b56414bf0.png)  
如果把html换成一个本地存在的目录，它就不会默认存放到`/var/lib/docker/volumes/xxx/_data`下了，而是会存放到你给的本地目录下

```
# 挂载本地目录​
-v 本地目录:容器内目录​
# 挂载本地文件​
-v 本地文件:容器内文件
```

## 五、docker 网络

每次创建容器的时候，分配的ip地址可能会改变，使用docker创建网络可以方便容器之间的通信

|命令|作用|
|---|---|
|docker network create|创建网络|
|docker network ls|查看所有网络|
|docker network rm|删除指定网络|
|docker network prune|清除未使用的网络|
|docker network connect 网络名 容器名|让指定容器加入某个网络|
|docker network disconnect 网络名 容器名|让指定容器离开某个网络|
|docker network inspect|查看网络详细信息|

### 1. docker network create 与 docker network ls

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/761bd96caebc4968aaeb8131ab95d32d.png)

### 2. docker network rm

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/12ac35ea05114d3795ffb536d6022662.png)

### 3. docker network prune

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/4d06f410aac24429b4ee6327d62e4372.png)

### 4. docker network connect

`docker network connect mynet nginx`  
`docker network connect mynet mysql`  
把nginx和mysql加入到同一个网络，然后进入nginx，ping mysql，发现可以ping通  
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/f5c6b77397cb4f44af1626b096820bef.png)

## 六、docker compose

> 作用：允许用户通过一个 YAML 格式的配置文件来配置多个相关联的容器，使得复杂的多容器应用的部署、启动、停止和管理变得更加简单和高效。

一个docker-compose的yml文件大概就长下面这样  
一般用`docker-compose -f docker-compose-environment.yml up -d`执行

```
version: '3.9'
services:
  mysql:
    image: mysql:8.0.32
    container_name: mysql
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_PASSWORD: 123456
    ports:
      - "3306:3306"
    volumes:
      - ./mysql/sql:/docker-entrypoint-initdb.d
    networks:
      - my-network

  redis:
    image: redis:6.2
    container_name: redis
    ports:
      - 6379:6379
    volumes:
      - ./redis/redis.conf:/usr/local/etc/redis/redis.conf
    networks:
      - my-network

networks:
  my-network:
    driver: bridge
```

## 七、Linux下安装docker和docker compose

### 1. yum 更新到最新版本

```
sudo yum update
```

```
Loaded plugins: fastestmirror
Determining fastest mirrors
base                                                                                                                                                                                                                                                                                              | 3.6 kB  00:00:00     
epel                                                                                                                                                                                                                                                                                              | 4.3 kB  00:00:00     
extras                                                                                                                                                                                                                                                                                            | 2.9 kB  00:00:00     
updates                                                                                                                                                                                                                                                                                           | 2.9 kB  00:00:00     
(1/7): base/7/x86_64/group_gz                                                                                                                                                                                                                                                                     | 153 kB  00:00:00     
(2/7): epel/x86_64/group                                                                                                                                                                                                                                                                          | 399 kB  00:00:00     
(3/7): epel/x86_64/updateinfo                                                                                                                                                                                                                                                                     | 1.0 MB  00:00:00     
(4/7): base/7/x86_64/primary_db                                                                                                                                                                                                                                                                   | 6.1 MB  00:00:00     
(5/7): extras/7/x86_64/primary_db                                                                                                                                                                                                                                                                 | 253 kB  00:00:00     
(6/7): epel/x86_64/primary_db                                                                                                                                                                                                                                                                     | 8.7 MB  00:00:00     
(7/7): updates/7/x86_64/primary_db                                                                                                                                                                                                                                                                |  27 MB  00:00:00     
No packages marked for update
```

### 2. 安装Docker所需的依赖包

```
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

```
Total                                                                                                                                                                                                                                                                                     19 MB/s | 3.2 MB  00:00:00     
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : 7:device-mapper-event-libs-1.02.170-6.el7_9.5.x86_64                                                                                                                                                                                                                                                  1/6 
  Installing : libaio-0.3.109-13.el7.x86_64                                                                                                                                                                                                                                                                          2/6 
  Installing : device-mapper-persistent-data-0.8.5-3.el7_9.2.x86_64                                                                                                                                                                                                                                                  3/6 
  Installing : 7:device-mapper-event-1.02.170-6.el7_9.5.x86_64                                                                                                                                                                                                                                                       4/6 
  Installing : 7:lvm2-libs-2.02.187-6.el7_9.5.x86_64                                                                                                                                                                                                                                                                 5/6 
  Installing : 7:lvm2-2.02.187-6.el7_9.5.x86_64                                                                                                                                                                                                                                                                      6/6 
  Verifying  : 7:device-mapper-event-1.02.170-6.el7_9.5.x86_64                                                                                                                                                                                                                                                       1/6 
  Verifying  : 7:lvm2-libs-2.02.187-6.el7_9.5.x86_64                                                                                                                                                                                                                                                                 2/6 
  Verifying  : device-mapper-persistent-data-0.8.5-3.el7_9.2.x86_64                                                                                                                                                                                                                                                  3/6 
  Verifying  : libaio-0.3.109-13.el7.x86_64                                                                                                                                                                                                                                                                          4/6 
  Verifying  : 7:lvm2-2.02.187-6.el7_9.5.x86_64                                                                                                                                                                                                                                                                      5/6 
  Verifying  : 7:device-mapper-event-libs-1.02.170-6.el7_9.5.x86_64                                                                                                                                                                                                                                                  6/6 

Installed:
  device-mapper-persistent-data.x86_64 0:0.8.5-3.el7_9.2                                                                                                                 lvm2.x86_64 7:2.02.187-6.el7_9.5                                                                                                                

Dependency Installed:
  device-mapper-event.x86_64 7:1.02.170-6.el7_9.5                                    device-mapper-event-libs.x86_64 7:1.02.170-6.el7_9.5                                    libaio.x86_64 0:0.3.109-13.el7                                    lvm2-libs.x86_64 7:2.02.187-6.el7_9.5                                   

Complete!
```

### 3.设置Docker的yum的源

```
sudo yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

```
Loaded plugins: fastestmirror
adding repo from: https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
grabbing file https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo to /etc/yum.repos.d/docker-ce.repo
repo saved to /etc/yum.repos.d/docker-ce.repo
```

### 4. 查看仓库所有Docker版本

```
yum list docker-ce --showduplicates | sort -r
```

```
Loading mirror speeds from cached hostfile
Loaded plugins: fastestmirror
docker-ce.x86_64            3:26.1.4-1.el7                      docker-ce-stable
docker-ce.x86_64            3:26.1.3-1.el7                      docker-ce-stable
docker-ce.x86_64            3:26.1.2-1.el7                      docker-ce-stable
docker-ce.x86_64            3:26.1.1-1.el7                      docker-ce-stable
docker-ce.x86_64            3:26.1.0-1.el7                      docker-ce-stable
docker-ce.x86_64            3:26.0.2-1.el7                      docker-ce-stable
docker-ce.x86_64            3:26.0.1-1.el7                      docker-ce-stable
docker-ce.x86_64            3:26.0.0-1.el7                      docker-ce-stable
docker-ce.x86_64            3:25.0.5-1.el7                      docker-ce-stable
docker-ce.x86_64            3:25.0.4-1.el7                      docker-ce-stable
docker-ce.x86_64            3:25.0.3-1.el7                      docker-ce-stable
docker-ce.x86_64            3:25.0.2-1.el7                      docker-ce-stable
docker-ce.x86_64            3:25.0.1-1.el7                      docker-ce-stable
docker-ce.x86_64            3:25.0.0-1.el7                      docker-ce-stable
docker-ce.x86_64            3:24.0.9-1.el7                      docker-ce-stable
docker-ce.x86_64            3:24.0.8-1.el7                      docker-ce-stable
```

### 5. 安装Docker

```
sudo yum install docker-ce
```

### 6. 安装Docker-Compose

```
# 指定路径【推荐】
sudo curl -L https://gitee.com/fustack/docker-compose/releases/download/v2.24.1/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
# 设置权限
sudo chmod +x /usr/local/bin/docker-compose
```

### 7. 启动Docker并添加开机自启动

```
#启动 Docker
sudo systemctl start docker
```

```
#设置开机启动 Docker
systemctl enable docker
```

```
#重启 Docker 命令
sudo systemctl restart docker
```

### 8.卸载docker

```
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine
```

### 9.设置国内镜像

```
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://xxxxx.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```