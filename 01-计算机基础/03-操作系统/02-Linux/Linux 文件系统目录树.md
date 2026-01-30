Linux 文件系统目录树（核心结构）

```
├── bin/           # 核心用户命令（系统启动必需）
├── boot/          # 引导加载程序、内核文件
├── dev/           # 设备文件
├── etc/           # 系统配置文件
├── home/          # 用户主目录
├── lib/           # 系统核心库文件
├── media/         # 可移动设备挂载点
├── mnt/           # 临时挂载点
├── opt/           # 第三方大型软件
├── proc/          # 进程和内核信息（虚拟文件系统）
├── root/          # root用户主目录
├── run/           # 运行时数据（重启后清空）
├── sbin/          # 系统管理命令（root权限）
├── srv/           # 服务相关数据
├── sys/           # 内核和硬件信息（虚拟文件系统）
├── tmp/           # 临时文件
├── usr/           # 用户程序和只读数据
├── var/           # 可变数据（日志、缓存等）
└── lost+found/    # 文件系统修复时找回的文件
```

详细目录作用解析

1. /bin（Binary）

• 作用：存放系统启动和基本维护必需的命令

• 内容：ls、cp、bash、grep、mount 等

• 权限：所有用户可执行

• 注意：现代系统常与 /usr/bin 合并（符号链接）

2. /boot（Boot）

• 作用：存放引导加载程序、内核镜像

• 内容：vmlinuz（内核）、initramfs、grub/ 目录

• 注意：不要随意删除，否则系统无法启动

3. /dev（Device）

• 作用：设备文件（硬件和虚拟设备）

• 内容：

  • /dev/sda（硬盘）

  • /dev/tty（终端）

  • /dev/null（黑洞设备）

• 特点：虚拟文件系统，不占用磁盘空间

4. /etc（Etcetera）

• 作用：系统和应用程序的配置文件

• 内容：

  • /etc/passwd（用户账户）

  • /etc/fstab（挂载配置）

  • 应用配置目录（/etc/nginx/、/etc/ssh/）

• 注意：不要放可执行文件或数据文件

5. /home（Home）

• 作用：普通用户的主目录

• 内容：/home/username/（个人文件、配置、桌面等）

• 注意：/root 是 root 用户的独立主目录

6. /lib（Library）

• 作用：系统核心库文件

• 内容：*.so 共享库（供 /bin 和 /sbin 使用）

• 注意：现代系统常与 /usr/lib 合并

7. /media 和 /mnt（Mount）

• /media：自动挂载可移动设备（U 盘、光盘）

• /mnt：临时手动挂载（NFS、硬盘分区）

• 区别：/media 用于用户设备，/mnt 用于管理员挂载

8. /opt（Optional）

• 作用：第三方大型软件包

• 内容：每个软件独立子目录（/opt/google/chrome/）

• 特点：集中管理、避免与系统软件冲突

9. /proc（Process）

• 作用：虚拟文件系统，显示进程和内核信息

• 内容：

  • /proc/cpuinfo（CPU 信息）

  • /proc/meminfo（内存信息）

  • 数字目录（进程 PID）

• 特点：内存中生成，重启后消失

10. /root（Root）

• 作用：root 用户的个人主目录

• 注意：与 /home 隔离，权限更高

11. /run（Run）

• 作用：运行时数据（PID 文件、套接字）

• 内容：/run/sshd.pid、/run/docker.sock

• 特点：重启后清空，替代旧的 /var/run

12. /sbin（System Binary）

• 作用：系统管理命令（需 root 权限）

• 内容：fdisk、ifconfig、iptables、systemctl

• 注意：普通用户一般无法执行

13. /srv（Service）

• 作用：对外服务的数据文件

• 内容：

  • /srv/www/（Web 网站）

  • /srv/ftp/（FTP 文件）

• 最佳实践：明确服务用途，避免混用

14. /sys（System）

• 作用：内核和硬件信息（虚拟文件系统）

• 内容：设备驱动、电源管理、内核参数

• 特点：与 /proc 类似，但更结构化

15. /tmp（Temporary）

• 作用：临时文件

• 特点：

  • 所有用户可读写

  • 重启后可能被清空

  • 权限为 1777（防他人删除）

16. /usr（User System Resources）

• 作用：只读的用户程序和资源

• 子目录：

  • /usr/bin：普通用户命令

  • /usr/lib：共享库

  • /usr/share：只读数据（文档、图标）

  • /usr/local：本地编译安装的软件

• 注意：系统安装后一般不变

17. /var（Variable）

• 作用：可变数据（运行时产生）

• 子目录：

  • /var/log：日志文件

  • /var/cache：缓存数据

  • /var/lib：数据库、状态文件

  • /var/spool：队列文件（邮件、打印）

• 注意：需要定期维护（日志轮转）

18. /lost+found（Lost and Found）

• 作用：文件系统修复时找回的文件

• 特点：fsck 修复磁盘后存放无法归位的文件

核心原则总结

1. FHS 标准：确保系统一致性和可维护性
2. 职责分离：
   • /bin、/sbin：系统命令

   • /etc：配置

   • /var：数据

   • /opt：第三方软件

3. 虚拟文件系统：/proc、/sys、/dev 不占磁盘空间
4. 权限控制：不同目录对应不同用户权限

如果你需要针对特定项目（如 Web 服务、数据库、容器部署）推荐目录结构，我可以为你提供具体的最佳实践方案。