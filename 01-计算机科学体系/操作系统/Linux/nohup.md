### 详细使用文档：`nohup` 启动和关闭 npm 应用

#### 一、核心概念

​**​`nohup` 是什么？​**​  
将命令设为​**​后台守护进程​**​，即使关闭终端或退出 SSH，进程仍持续运行。默认输出重定向到 `nohup.out` 文件。

​**​适用场景​**​

- 服务器部署时启动 Web 服务（如 `npm run start`）
- 需要长期运行且不被终端关闭影响的进程

---

#### 二、启动 npm 应用

##### 命令格式（核心）

```
nohup npm run start > 日志文件路径 2>&1 &
```

- ​**​`> 日志文件路径`​**​：将标准输出（正常日志）写入指定文件（如 `app.log`）
- ​**​`2>&1`​**​：将标准错误（如报错）重定向到标准输出（即同一日志文件）
- ​**​`&`​**​：后台运行

##### 示例：启动项目并保存日志

```
# 启动项目，日志保存到当前目录的 app.log
nohup npm run start > ./app.log 2>&1 &
```

​**​执行后返回提示​**​

```
[1] 12345  # 12345 是进程 PID（关键！后续关闭需用到）
```

##### 验证是否启动成功

```
# 查看日志尾部（持续监控用 Ctrl+C 退出）
tail -f app.log  

# 查看包含 npm 的进程
ps aux | grep npm
```

---

#### 三、关闭指定进程

需通过 ​**​PID（进程 ID）​**​ 关闭进程。

##### 步骤 1：查找进程 PID

​**​方法 1：通过 `ps` + `grep` 查找​**​

```
ps aux | grep 'npm run start'
```

​**​输出示例​**​

```
user   12345  0.0  0.1  00000000  ?  SL   Jan01   0:00 npm run start
```

> ✅ ​**​PID = `12345`​**​（第二列数字）

​**​方法 2：直接提取 PID（自动化命令）​**​

```
pid=$(ps aux | grep 'npm run start' | grep -v grep | awk '{print $2}')
echo $pid  # 打印 PID 确认
```

##### 步骤 2：关闭进程

```
kill -9 95247  # 替换为实际 PID
```

##### ⚠️ 常见问题

​**​Q：关闭后进程仍在？​**​  
可能是子进程（如 Node.js）未关闭。​**​补充命令​**​：

```
# 关闭主进程后，再关闭相关 node 进程
pkill -f node
```

---

#### 四、最佳实践

##### 方案 1：启动时保存 PID（推荐！）

```
# 启动命令（同时记录 PID 到文件）
nohup npm run start > app.log 2>&1 & echo $! > app.pid
```

​**​关闭时直接调用 PID 文件​**​

```
kill -9 $(cat app.pid)
```

##### 方案 2：端口关闭法（适合已知端口）

```
# 查找占用端口（如 3000）的 PID
lsof -i :3000 | awk 'NR==2 {print $2}' | xargs kill -9
```

---

#### 五、关键总结

|操作|命令|
|---|---|
|​**​启动应用​**​|`nohup npm run start > app.log 2>&1 &`|
|​**​保存 PID​**​|启动后添加 `echo $! > app.pid`|
|​**​关闭应用​**​|`kill -9 $(cat app.pid)` 或手动 `kill -9 PID`|
|​**​查残余进程​**​|`pkill -f node` 或 `ps aux \| grep node`|

> 💡 ​**​终极命令​**​：一键关闭整个进程树
> 
> ```
> pkill -f 'npm run start'  # 强制终止所有匹配进程
> ```