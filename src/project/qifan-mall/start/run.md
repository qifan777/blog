---
order: 0
---

# 项目运行

## 项目代码

[后端代码](https://github.com/qifan777/mall-backend)
[后台管理代码](https://github.com/qifan777/mall-admin)
[小程序代码](https://github.com/qifan777/mall-wechat-mp)

## 运行环境

### jdk17

### 创建docker网络

```shell
docker network create mall
```

### 安装redis

```shell
docker run --name redis \
    -p 6379:6379 \
    --network=mall \
    --network-alias=mall-redis \
    --restart=always \
    -v redis-data:/data \
    -d redis:7.2 redis-server \
    --save 60 1 \
    --loglevel warning
```

### 安装mysql

```shell
docker run -p 3306:3306 \
    -d \
    --name mysql8 \
    -e MYSQL_ROOT_PASSWORD=qifan123. \
    -e TZ=Asia/Shanghai  \
    -e MYSQL_DATABASE=mall \
    -v mysql-data:/var/lib/mysql \
    --network=mall \
    --network-alias=mall-mysql \
    --restart=always \
    mysql:8.0.26 \
    mysqld --character-set-server=utf8mb4 \
    --collation-server=utf8mb4_unicode_ci  
```

### nvm安装

使用nvm管理不同的node环境

## 后端启动

1. 配置maven镜像
2. 导入sql`scripts/database.sql`初始数据库。
3. 修改application-dev.yml中mysql和redis为你自己的密码
4. 配置IdeaCodeStyle
5. 启动mall-server模块下的`MallServerApplication`

## 后台管理启动

```shell
npm install
npm run dev
```

## 小程序启动

```shell
yarn install
yarn dev:weapp
```

然后导入`mall-wechat-mp`到微信开发者工具