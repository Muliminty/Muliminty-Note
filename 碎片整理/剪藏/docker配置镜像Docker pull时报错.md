```
docker run hello-world时报错
Unable to find image 'hello-world:latest' locally
docker: Error response from daemon: Get "https://registry-1.docker.io/v2/": read tcp 192.168.30.91:51536->44.208.254.194:443: read: connection reset by peer.
```

这个错误表明Docker客户端尝试访问[Docker Hub](https://zhida.zhihu.com/search?content_id=253867805&content_type=Article&match_order=1&q=Docker+Hub&zhida_source=entity)或其他[Docker注册中心](https://zhida.zhihu.com/search?content_id=253867805&content_type=Article&match_order=1&q=Docker%E6%B3%A8%E5%86%8C%E4%B8%AD%E5%BF%83&zhida_source=entity)时出现了问题。具体来说，是在尝试获取注册中心API的响应时遇到了错误。可能的原因包括网络问题、认证问题、注册中心URL不正确或者注册中心服务本身不可用。

2、解决方法

```
systemctl status docker
sudo mkdir -p /etc/docker
vim /etc/docker/daemon.json  
```

添加：  

```
{
  "registry-mirrors" : ["https://docker.registry.cyou",
"https://docker-cf.registry.cyou",
"https://dockercf.jsdelivr.fyi",
"https://docker.jsdelivr.fyi",
"https://dockertest.jsdelivr.fyi",
"https://mirror.aliyuncs.com",
"https://dockerproxy.com",
"https://mirror.baidubce.com",
"https://docker.m.daocloud.io",
"https://docker.nju.edu.cn",
"https://docker.mirrors.sjtug.sjtu.edu.cn",
"https://docker.mirrors.ustc.edu.cn",
"https://mirror.iscas.ac.cn",
"https://docker.rainbond.cc",
"https://do.nark.eu.org",
"https://dc.j8.work",
"https://dockerproxy.com",
"https://gst6rzl9.mirror.aliyuncs.com",
"https://registry.docker-cn.com",
"http://hub-mirror.c.163.com",
"http://mirrors.ustc.edu.cn/",
"https://mirrors.tuna.tsinghua.edu.cn/",
"http://mirrors.sohu.com/" 
],
 "insecure-registries" : [
    "registry.docker-cn.com",
    "docker.mirrors.ustc.edu.cn"
    ],
"debug": true,
"experimental": false
}
```

重载和重启dockers服务

```
sudo systemctl daemon-reload
sudo systemctl restart docker
docker info
```

重新执行

![](https://pic1.zhimg.com/v2-91e2843593bdf43fbf4b29c6878baa80_1440w.jpg)