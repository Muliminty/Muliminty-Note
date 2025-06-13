In this guide, we will see what is **Docker**, how to **install Docker Engine in Ubuntu** Linux. In addition, we will also see how to **install Docker compose**, a tool to define and run multi-container Docker applications.

This guide has been officially tested on Ubuntu 22.04 LTS. However, it should work on older versions such as 20.04 LTS, and 18.04 LTS. For better security and stability, I recommend you to use the most recent Ubuntu 22.04 LTS version.

- [What Is Docker?](#What_Is_Docker "What Is Docker?")
- [Docker Requirements](#Docker_Requirements "Docker Requirements")
- [Install Docker In Ubuntu 22.04 LTS](#Install_Docker_In_Ubuntu_2204_LTS "Install Docker In Ubuntu 22.04 LTS")
    - [1. Update Ubuntu](#1_Update_Ubuntu "1. Update Ubuntu")
    - [2. Add Docker Repository](#2_Add_Docker_Repository "2. Add Docker Repository")
    - [3. Install Docker](#3_Install_Docker "3. Install Docker")
    - [4. Testing Docker](#4_Testing_Docker "4. Testing Docker")
    - [5. Upgrade Docker](#5_Upgrade_Docker "5. Upgrade Docker")
    - [6. Run Docker As Non-root User In Linux (Optional)](#6_Run_Docker_As_Non-root_User_In_Linux_Optional "6. Run Docker As Non-root User In Linux (Optional)")
- [Install Docker Compose In Ubuntu](#Install_Docker_Compose_In_Ubuntu "Install Docker Compose In Ubuntu")
    - [Method 1 – Install Docker Compose Using Binary](#Method_1_%E2%80%93_Install_Docker_Compose_Using_Binary "Method 1 – Install Docker Compose Using Binary")
    - [Method 2 – Install Docker Compose Using PiP](#Method_2_%E2%80%93_Install_Docker_Compose_Using_PiP "Method 2 – Install Docker Compose Using PiP")
    - [Upgrade Docker Compose](#Upgrade_Docker_Compose "Upgrade Docker Compose")
- [Uninstall Docker Engine](#Uninstall_Docker_Engine "Uninstall Docker Engine")
- [Uninstall Docker Compose](#Uninstall_Docker_Compose "Uninstall Docker Compose")
- [Conclusion](#Conclusion "Conclusion")

## What Is Docker?

**Docker** is a fast, lightweight and OS level virtualization technology for developers and system administrators who wants to build an application with all of required dependencies, and ship it out as only one package.

Unlike other Virtualization methods, such as VMWare, Xen and VirtualBox, there is no need of separate guest operating system for each virtual machine.

All Docker containers efficiently share the host operating system's Kernel. Each container will run in an isolated userspace in the same operating system.
l
Docker containers will also run on any Linux variant. Let us say you're working in Fedora, and I am using Ubuntu. We can still develop, share and distribute the Docker images with each other.

You don't have to worry about the OS, software, customized settings, or anything. We can continue the development as  long as we have Docker installed in our host system. Simply put, Docker will work everywhere!

You read two terms in the above paragraphs namely **Docker images** and **Docker containers**. You might wonder, what they are and what is the difference between them.

In layman's terms, a Docker image is a file which describes how a Container should behave, whereas Docker container is the running (or stopped) state of the Docker image.

Hope you got a basic idea about Docker. Refer official Docker user guide for more details. The link is attached at the end of this guide.

## Docker Requirements

To install and configure Docker, your system must meet the following minimum requirements.

1. **64 bit** Linux or Windows operating systems.
2. If you're on Linux, the Kernel version should be **3.10** or above.
3. An user account with **`sudo`** privileges.
4. **VT** (virtualization technology) support enabled on your system BIOS. [Read: **[How To Find If A CPU Supports Virtualization Technology (VT)](https://ostechnix.com/how-to-find-if-a-cpu-supports-virtualization-technology-vt/)**]
5. Your system should be connected to Internet.

In Linux, to verify the Kernel and architecture details, run the following command from the Terminal:

$ uname -a

**Sample Output:**

Linux Ubuntu22CT **==5.15.35-3-pve==** #1 SMP PVE 5.15.35-6 (Fri, 17 Jun 2022 13:42:35 +0200) **==x86_64 x86_64 x86_64 GNU/Linux==**

As you see in the above output, my Ubuntu system's kernel version is **5.15.35-3-pve** and my Ubuntu system's architecture is **64 bit** (**x86_64 x86_64 x86_64 GNU/Linux**). Check the bold letters in the above result.

**Heads Up:** Here, I am using Ubuntu 22.04 container in **[Proxmox](https://ostechnix.com/install-proxmox-ve/)**. This is why you see the word "pve" in the kernel version in the above output. If you're using Ubuntu physical (or virtual) machine, you will see **5.15.35-3-generic** as kernel version.

Well, the Kernel version is higher than the minimum requirement, and the arch is 64 bit. So, we can install and use Docker without any problems.

Please note that it doesn't matter which Ubuntu OS you use. Also, It doesn't matter whether you use Ubuntu Desktop or Ubuntu Server edition or any other Ubuntu variants such as Lubuntu, Kubuntu, Xubuntu.

Docker will work just fine as long as your system has the Kernel version 3.10+, and your system's arch is 64 bit.

## Install Docker In Ubuntu 22.04 LTS

First of all, update your Ubuntu system.

### 1. Update Ubuntu

Open your Terminal, and run the following commands one by one:

$ sudo apt update

$ sudo apt upgrade

$ sudo apt full-upgrade

### 2. Add Docker Repository

First of all, install the necessary certificates and to allow **apt** package manager to use a repository over HTTPS using command:

$ sudo apt install apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release

Next, add Docker's official GPG key by running the following commands:

$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

Add the Docker official repository:

$ echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

Update Ubuntu sources list using command:

$ sudo apt update

### 3. Install Docker

Finally, run the following command to install latest Docker CE in Ubuntu 22.04 LTS server:

$ sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

[![Install Docker In Ubuntu](https://ostechnix.com/wp-content/uploads/2022/06/Install-Docker-In-Ubuntu.png "Install Docker In Ubuntu")](https://ostechnix.com/wp-content/uploads/2022/06/Install-Docker-In-Ubuntu.png)

Install Docker In Ubuntu

You can, of course, install a specific Docker version as well. To check the list of available Docker versions, run:

$ apt-cache madison docker-ce

**Sample output:**

 docker-ce | 5:20.10.17~3-0~ubuntu-jammy | https://download.docker.com/linux/ubuntu jammy/stable amd64 Packages
 docker-ce | 5:20.10.16~3-0~ubuntu-jammy | https://download.docker.com/linux/ubuntu jammy/stable amd64 Packages
 docker-ce | 5:20.10.15~3-0~ubuntu-jammy | https://download.docker.com/linux/ubuntu jammy/stable amd64 Packages
 docker-ce | 5:20.10.14~3-0~ubuntu-jammy | https://download.docker.com/linux/ubuntu jammy/stable amd64 Packages
 docker-ce | 5:20.10.13~3-0~ubuntu-jammy | https://download.docker.com/linux/ubuntu jammy/stable amd64 Packages

You can pick any available version from the above list and install it. For instance, to install version **5:20.10.16~3-0~ubuntu-jammy**, run:

$ sudo apt install docker-ce=5:20.10.16~3-0~ubuntu-jammy docker-ce-cli=5:20.10.16~3-0~ubuntu-jammy containerd.io

Once it is installed, verify if the Docker service is running with command:

$ systemctl status docker

You'll see an output something like below.

* docker.service - Docker Application Container Engine
     **==Loaded: loaded==** (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
     **==Active: active (running)==** since Mon 2022-06-27 13:07:43 UTC; 3min 4s ago
TriggeredBy: * docker.socket
       Docs: https://docs.docker.com
   Main PID: 2208 (dockerd)
      Tasks: 8
     Memory: 29.6M
        CPU: 126ms
     CGroup: /system.slice/docker.service
             `-2208 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock

Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.071453522Z" level=info msg="ccResolverWrapper: sending update to cc: {[{unix:>
Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.071459974Z" level=info msg="ClientConn switching balancer to \"pick_first\"" >
Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.130989294Z" level=info msg="Loading containers: start."
Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.187439756Z" level=info msg="Default bridge (docker0) is assigned with an IP a>
Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.235966874Z" level=info msg="Loading containers: done."
Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.240149866Z" level=warning msg="Not using native diff for overlay2, this may c>
Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.240281966Z" level=info msg="Docker daemon" commit=a89b842 graphdriver(s)=over>
Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.240386856Z" level=info msg="Daemon has completed initialization"
Jun 27 13:07:43 Ubuntu22CT systemd[1]: Started Docker Application Container Engine.
Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.276336600Z" level=info msg="API listen on /run/docker.sock"

Great! Docker service is up and running!

If it is not started already, run the following command to start Docker service.

$ sudo systemctl start docker

Enable Docker service to start automatically on every reboot:

$ sudo systemctl enable docker

The installed Docker version can be found using command:

$ sudo docker version

**Sample Output:**

Client: Docker Engine - Community
 Version:           20.10.17
 API version:       1.41
 Go version:        go1.17.11
 Git commit:        100c701
 Built:             Mon Jun  6 23:02:46 2022
 OS/Arch:           linux/amd64
 Context:           default
 Experimental:      true

Server: Docker Engine - Community
 Engine:
  Version:          20.10.17
  API version:      1.41 (minimum version 1.12)
  Go version:       go1.17.11
  Git commit:       a89b842
  Built:            Mon Jun  6 23:00:51 2022
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.6.6
  GitCommit:        10c12954828e7c7c9b6e0ea9b0c02b01407d3ae1
 runc:
  Version:          1.1.2
  GitCommit:        v1.1.2-0-ga916309
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0

[![Check Docker Version](https://ostechnix.com/wp-content/uploads/2022/06/Check-Docker-Version.png "Check Docker Version")](https://ostechnix.com/wp-content/uploads/2022/06/Check-Docker-Version.png)

Check Docker Version

### 4. Testing Docker

Let us go ahead, and test whether Docker is working or not.

To do so, run:

$ sudo docker run hello-world

The above command will download a test Docker image, and execute a sample **hello_world** program inside the container.

If you see an output something like below, congratulations! Docker is working fine in our Ubuntu system.

Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db29710123e: Pull complete 
Digest: sha256:13e367d31ae85359f42d637adf6da428f76d75dc9afeb3c21faea0d976f5c651
Status: Downloaded newer image for hello-world:latest

**==Hello from Docker!
This message shows that your installation appears to be working correctly.==**

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/

[![Run Hello World Docker Container](https://ostechnix.com/wp-content/uploads/2022/06/Run-Hello-World-Docker-Container.png "Run Hello World Docker Container")](https://ostechnix.com/wp-content/uploads/2022/06/Run-Hello-World-Docker-Container.png)

Run Hello World Docker Container

Great! Docker is ready to use.

I installed Docker, now what? Check the next article in this series to learn the Docker basics.

> [**Getting started with Docker**](https://ostechnix.com/getting-started-with-docker/)

### 5. Upgrade Docker

To upgrade Docker engine to latest available version, simply do:

$ sudo apt update

$ sudo apt upgrade

$ sudo apt full-upgrade

### 6. Run Docker As Non-root User In Linux (Optional)

By default, the Docker daemon binds to a Unix socket instead of a TCP port. Since that **Unix socket is owned by the root** user, the Docker daemon will only run as the root user. Hence, the normal users can't perform most Docker commands.

If you want to run Docker as non-root user in Linux, refer the following guide:

> [**How To Run Docker As Non-root User In Linux**](https://ostechnix.com/how-to-run-docker-as-non-root-user-in-linux/)

I personally do not use this and **do not recommend it** as well. If you don't expose your system to Internet, it is fine. However, do not run Docker as non-root user in production system.

## Install Docker Compose In Ubuntu

**Docker Compose** is a tool that can be used to define and run multi-container Docker applications. With Compose, you use a Compose file to configure your application’s services. Then, using a single command, you can create and start all the services from your configuration.

We can install Docker Compose using any one of the following methods.

### Method 1 - Install Docker Compose Using Binary

Download the latest Docker Compose from [**here**](https://github.com/docker/compose/releases).

As of writing this, the latest version was **2.6.1**.

Run the following command to download latest stable Docker compose file:

$ sudo curl -L "https://github.com/docker/compose/releases/download/**v2.6.1**/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

If a new version is available, just replace the number **v2.6.1** in the above command with the new version number. Please don't forget to preface **"v"** before the version number.

Finally, apply executable permissions to the binary using command:

$ sudo chmod +x /usr/local/bin/docker-compose

To check installed docker composer version, run:

$ docker-compose version
Docker Compose version v2.6.1

### Method 2 - Install Docker Compose Using PiP

Alternatively, we can install Docker Compose using **PIP**. Pip is a python package manager used to install applications written in Python programming language.

Refer the following guide to install Pip on your system.

> [**How To Manage Python Packages Using Pip**](https://ostechnix.com/manage-python-packages-using-pip/)

Once pip installed, run the following command to install docker compose. The following command is same for all Linux distributions!

$ pip install docker-compose

After installing Docker Compose, you can check the version with command:

$ docker-compose --version

You will see an output something like below.

docker-compose version **2.6.1**, build 8a1c60f6

Congratulations! We have successfully installed Docker Community Edition and Docker Compose.

Read our introductory guide to Docker Compose to learn how to use Docker compose in real time to define and manage containers.

> **[Getting Started With Docker Compose In Linux](https://ostechnix.com/introduction-to-docker-compose/)**

### Upgrade Docker Compose

To upgrade Docker Compose, simply download the newer package file and repeat the installation instructions as shown in Method 1. If you have installed Compose using Pip, you can upgrade Docker Compose using the following command:

$ pip install --upgrade docker-compose

## Uninstall Docker Engine

To remove Docker Engine from your Ubuntu system, run:

$ sudo apt purge docker-ce docker-ce-cli containerd.io docker-compose-plugin

The Docker images, containers, volumes, or customized configuration files on your system are not automatically removed.

You should manually delete all images, containers, and volumes using the following commands:

$ sudo rm -rf /var/lib/docker

$ sudo rm -rf /var/lib/containerd

## Uninstall Docker Compose

If you have installed Compose using binary file, simply remove it from `/usr/local/bin/` path.

$ sudo rm /usr/local/bin/docker-compose

If you installed Compose using PiP, run the following command to remove Docker Compose:

$ pip uninstall docker-compose

## Conclusion

In this guide, we discussed what is Docker and how to install Docker in Ubuntu 22.04 LTS Jammy Jellyfish. Then we learned how to test docker installation by running a hello-world docker image. Finally, we concluded the tutorial by installing Docker compose using two different ways and how to remove Docker Engine and Compose when they are no longer required.

To install Docker in RPM based systems such as RHEL, Fedora, CentOS, AlmaLinux, Rocky Linux and openSUSE, check the following link.

> **[Install Docker Engine And Docker Compose In AlmaLinux, CentOS, Rocky Linux](https://ostechnix.com/install-docker-almalinux-centos-rocky-linux/)**

**Resource:**

- **[Docker website](https://www.docker.com/)**