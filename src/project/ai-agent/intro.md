# 项目介绍

本项目使用Spring AI实现了一个可以发布AI智能体到市场，管理员可以审核是否通过，其他用户在首页可以浏览其他用户发布的智能体。
并根据智能体的收藏量分周榜总榜。也可以通过类别进行检索。

本项目主要提供给AI开发初学者学习使用，并不具备可以商业使用的能力。

![首页](./home.png)

![智能体详情](./agent.png)

![智能体对话](./chat.png)

## 运行环境

- Java 17
- Node.js 18+
- MySQL 8
- Open AI 协议（大部分厂商都支持）
- Redis
- 阿里云OSS
- IDEA Ultimate 2025

## 运行步骤

1. clone代码

    ```shell
    git clone https://github.com/qifan777/ai-agent-market
    ```

2. idea打开项目, 本项目包含了前后端，直接用idea打开就可以同时前端和和后端
3. 修改配置文件, 修改application.yml中的API-KEY, MySQL, Redis, 阿里云OSS配置
4. 初始化数据库，新建`ai_agent`数据库导入database.sql到数据库
5. 后端运行
    1. 运行ServerApplication.java
    2. target/generated-sources/annotations右键mark directory as/generated source root
6. 前端运行
    1. cd ai-agent-admin
    2. npm run install
    3. npm run api（先运行后端）
    4. npm run dev

## 技术栈

### Java服务端

| 技术             | 说明                                                                             | 官网                                                               |
|----------------|--------------------------------------------------------------------------------|------------------------------------------------------------------|
| SpringBoot3    | Web应用开发框架，需要JDK17及以上版本                                                         | <https://spring.io/projects/spring-boot>                         |
| SpringAI       | 用一套通用的写法可以对接各个AI                                                               | <https://docs.spring.io/spring-ai/reference/index.html>          |
| SaToken        | 一个轻量级 Java 权限认证框架，主要解决：登录认证、权限认证、单点登录、OAuth2.0、分布式Session会话、微服务网关鉴权 等一系列权限相关问题 | <https://sa-token.cc/>                                           |
| Jimmer         | 不仅有Mybatis的灵活性也有Hibernate的复用性                                                  | <https://babyfish-ct.github.io/jimmer-doc/zh/>                   |
| QiFanGenerator | 自己写的代码生成器，快速生成前后端增删改查。                                                         | 无官网，在代码里面参考`@GenEentity`和`@GenXXXField`注解就行了                     |
| Gradle         | JimmerORM框架搭配Gradle可以大大的提升开发效率，大量的业务DTO类只需要在src/dto中编写重新运行即可生成代码               | <https://gradle.org/>                                            |
| 阿里云OSS         | 存储图片，学习用途基本上免费。                                                                | [对象存储 OSS-阿里云帮助中心 (aliyun.com)](https://help.aliyun.com/zh/oss/) |

### 后台管理端

| 技术             | 说明                                                                | 官网                                     |
|----------------|-------------------------------------------------------------------|----------------------------------------|
| Vite           | 开箱即用的现代前端打包工具                                                     | <https://cn.vitejs.dev/>               |
| Vue3           | Vue 基于标准 HTML 拓展了一套模板语法。Vue 会自动跟踪 JavaScript 状态并在其发生变化时响应式地更新 DOM | <https://cn.vuejs.org/>                |
| Vue Router     | Vue官方路由管理框架                                                       | <https://router.vuejs.org/>            |
| ElementUI Plus | 支持TypeScript提示的Vue3前端UI框架                                         | <https://element-plus.gitee.io/zh-CN/> |
| Pinia          | 全局状态管理框架，支持TypeScript类型提示                                         | <https://pinia.web3doc.top/>           |
| TypeScript     | 让 JS 具备类型声明                                                       | <https://www.typescriptlang.org/>      |
| ESLint         | 语法校验和格式整理                                                         | <https://eslint.org/>                  |
| DayJS          | 日期取值/赋值/运算等操作                                                     | <https://dayjs.fenxianglu.cn/>         |
| LodashJs       | JS各种常用的工具方法                                                       | <https://www.lodashjs.com/>            |

## 联系方式

付费远程运行/安装/定制开发联系微信：ljc666max

其他关于程序运行安装报错请加QQ群：

- 416765656（满）
- 632067985
