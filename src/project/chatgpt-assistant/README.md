---
title: ChatGPT二次开发
category:
  - ChatGPT
tag:
  - MongoDB
  - Vue3
  - Typescript
  - ElementUI
  - WebSocket
date: 2023-05-17
timeline: true
---
# ChatGPT-Assistant

## 项目介绍

本次项目是基于ChatGPT的二次开发网站，旨在实现在线聊天的功能。
使用的技术有前端框架Vue3、TypeScript和ElementUI以及后端技术SpringBoot、MongoDB、Spring Data MongoDB和Spring WebSocket。

### 自我介绍

[我是起凡](https://space.bilibili.com/357290237)，一名全栈程序员，刚刚毕业于华侨大学。主要技术栈后端SpringBoot,JPA(
Hibernate), MongoDB, Mybatis, SQL等。前端Vue3, Typescript, Taro小程序, Uni-App等。

### 主要功能

1. 登录注册
   用户sa-token管理用户的session。
2. 在线聊天
   用户在聊天框输入内容并发送给后端，后端将请求转发到Open AI的Chat GPT接口，返回数据后通过WebSocket推送给用户。

### 项目运行

#### clone仓库

```shell
git clone https://github.com/qifan777/chatgpt-assistant.git
```

#### 目录介绍

- bom 依赖管理
- chatgpt-assistant-client vue客户端
    - src
        - api 存放调用后端的接口
        - assets 静态资源图片等
        - components 通用的组件
        - router 路由
        - stores pinia状态管理
        - views 页面
            - home
                - components home页面使用的私有组件
                - HomeView.vue home页面
- chatgpt-assistant-server java核心代码
- infrastructure 基础设施
    - infrastructure-common 通用的类
    - infrastructure-generator 代码生成器
        - generator-core 注解定义
        - generator-processor 生成器逻辑
    - infrastructure-security 通用登录认证拦截器

#### 环境安装

- jdk 17
- mongodb
    ```shell
    docker run -d \
      --name mongo \
      -e MONGO_INITDB_ROOT_USERNAME=root \
      -e MONGO_INITDB_ROOT_PASSWORD=123456 \
      -p 27017:27017 \
      mongo:6.0.5-jammy
    ```
- node18

#### 运行

**前端**

1. vscode/webstorm导入chatgpt-assistant-client
2. 运行命令
    ```shell
    npm install
    npm run dev
    ```

**后端**

1. idea 导入chatgpt-assistant整个文件夹
2. mvn install
3. 运行chatgpt-assistant-server下的Application。

## 第一期

## 第二期

本期内容实现了登陆了功能。
实现的逻辑分下面几个步骤

1. 代码生成器生成controller，service，repository，mapper，dto。
2. 编写login接口接收用户名和密码。
3. login处理逻辑中调用mongoTemplate查询用户名是否存在不存在则创建一个用户，密码使用BCrypt加密。最后调用sa-token发放token给用户。
4. 后端使用idea请求测试工具测试接口和idea中连接mongodb。
5. 在前端复制生成的type定义和api接口，在登录界面中发起login请求。需要在vite中配置转发前端的请求到后端。登录成功在浏览器中存储token并跳转到首页。
## 第三期

本期内容实现了认证拦截Starter，统一异常处理，统一异常返回。
在springboot3中的starter有所变化。现在需要在
classpath:META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
中声明需要引入的configuration。在每个configuration中可以写一些判断条件来确定是否要被引入spring容器中。

在统一异常拦截中我们拦截到了NotLoginException，并将改异常转成我们系统的统一返回结果+自定义的异常编码通知前端。前端可以根据异常编码知道用户此时的状态。
## 第四期
本期实现内容有
1. 页面的统一页头。通过在index页面中添加子路由的形式，使得所有的子路由都获得夫路由的样式即index页面的样式。因此我们首先在index页面中写上页头的样式然后在index路由下配置子路由。
2. 页面切换的过度效果。在vue的官方文档中有介绍`<transition/>`组件的用法。页面的过度有进入页面时从无到有的过程，以及离开页面时从有到无的过程。两个阶段四个过程。通过css样式来调整过渡的效果
## 第五期
1. 菜单子路由跳转。鼠标点击左侧的菜单切换激活状态并且右侧内容随之改变。
2. 在首页获取个人信息存储到pinia全局状态管理。然后在个人信息界面从全局状态中加载用户信息。
3. 编辑用户信息时上传头像到后端，后端再上传到阿里云oss返回url结果给前端。
## 第六期
1. 学习如何使用dto。不同的dto对应不同的场景，有效的将原理集中在一个类上的复杂逻辑分解到各个dto。
2. 自定义实体类在dto直接的映射，不同的场景同一个字段的校验逻辑或者显示内容不同。
3. 前端部分深入理解路由实现路由到页面的props传参。
## 第七期
1. 聊天会话和聊天消息的实体类设计，一个聊天会话包含多条聊天消息。聊天会话中的创建用户使用`@CreatedBy` 自动在创建时设置当前用户的信息。
2. 聊天会话通过自定义关联mongoDB查询得到属于该聊天会话下的消息。
3. 使用MapStruct解决实体类之间的循环依赖。
4. spring websocket的接入，并配置了Stomp协议。开箱即用的消息发送和消息转发功能。并配置了从http升级到websocket的握手，根据http请求头中的cookie或者token获取当前登录的用户信息。