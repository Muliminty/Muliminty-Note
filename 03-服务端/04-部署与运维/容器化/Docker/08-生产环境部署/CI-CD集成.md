# CI/CD 集成

> Docker 与 CI/CD 流程的集成

---

## 📋 目录

- [GitHub Actions 集成](#github-actions-集成)
- [GitLab CI 集成](#gitlab-ci-集成)
- [Jenkins 集成](#jenkins-集成)
- [自动化构建与部署](#自动化构建与部署)
- [镜像自动推送](#镜像自动推送)

---

## GitHub Actions 集成

### 基本配置

```yaml
# .github/workflows/docker.yml
name: Docker Build and Push

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push
        uses: docker/build-push-action@v2
        with:
          context: .
          push: true
          tags: user/app:latest
```

---

## GitLab CI 集成

### 基本配置

```yaml
# .gitlab-ci.yml
build:
  stage: build
  script:
    - docker build -t myapp:latest .
    - docker push myapp:latest
```

---

## Jenkins 集成

### Jenkinsfile

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t myapp:latest .'
            }
        }
        stage('Push') {
            steps {
                sh 'docker push myapp:latest'
            }
        }
    }
}
```

---

## 自动化构建与部署

### 构建流程

1. 代码提交
2. 触发 CI/CD
3. 构建镜像
4. 运行测试
5. 推送镜像
6. 部署到生产环境

---

## 镜像自动推送

### 推送到 Docker Hub

```bash
# 登录
docker login

# 构建并推送
docker build -t username/app:latest .
docker push username/app:latest
```

---

## 📚 参考资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitLab CI 文档](https://docs.gitlab.com/ee/ci/)
- [Jenkins 文档](https://www.jenkins.io/doc/)

---

[[!MOC-Docker|返回 Docker 知识体系]]

#Docker #CI/CD #持续集成
