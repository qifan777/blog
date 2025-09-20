# 手工预约商店

## 项目简介

手工预约系统是一个开源的在线预约平台，专为手工制作体验店设计，允许用户在线浏览各类手工项目、选择预约时间段并完成支付。系统支持不同手工项目设置不同的收费标准，以及灵活的计费方式。

## 主要特性

- **手工项目管理**：创建、编辑和管理各类手工项目信息
- **灵活的预约系统**：支持设置不同时间段、价格和人数限制
- **多种计费方式**：支持按时间段和按时长计费
- **完整的订单流程**：从预约到支付的全流程管理
- **多端支持**：包含小程序端和管理后台
- **用户友好界面**：简洁直观的操作体验

## 系统架构

手工预约系统采用典型的前后端分离架构，整体架构设计清晰，各模块职责明确，便于维护和扩展。

### 后端架构详解

后端采用Spring Boot框架，采用模块化、分层设计，各模块之间通过清晰的接口进行交互。

#### 模块划分

后端项目按功能划分为多个核心模块：

1. **handicraft模块**：手工预约核心业务模块
    - **handicraft.booking**：预约时间段管理
    - **handicraft.category**：手工项目分类管理
    - **handicraft.item**：手工项目详情管理
    - **handicraft.order**：手工预约订单管理
    - **handicraft.root**：手工项目基础信息管理

2. **order模块**：通用订单管理模块，处理订单创建、查询、支付等

3. **payment模块**：支付相关功能，集成微信支付等第三方支付平台

4. **user模块**：用户管理，包括用户信息、权限等
    - **user.root**：用户基础信息管理
    - **user.wechat**：微信用户集成

5. **product模块**：商品管理（如材料包等）

6. **coupon模块**：优惠券管理

7. **dict模块**：系统字典管理

8. **infrastructure模块**：基础设施模块，提供公共组件和配置
    - **infrastructure.aop**：AOP切面管理
    - **infrastructure.config**：系统配置
    - **infrastructure.jimmer**：ORM框架集成
    - **infrastructure.model**：数据模型基础类

9. **其他辅助模块**：如地址管理、菜单管理、支付管理、退款管理等

#### 分层设计

每个业务模块内部采用经典的MVC分层架构：

- **Controller层**：处理HTTP请求，返回响应
- **Service层**：实现核心业务逻辑
- **Repository层**：数据访问层，与数据库交互
- **Entity层**：数据实体定义

### 管理后台架构

基于Vue 3 + TypeScript + Vite构建的单页应用，采用组件化、模块化设计：

- **布局组件**：`layout`目录下的通用布局组件
- **路由管理**：`router`目录管理系统所有路由
- **状态管理**：使用Pinia进行全局状态管理
- **API接口**：集中管理与后端的交互接口
- **业务页面**：按功能模块组织的页面组件
- **公共组件**：可复用的UI组件
- **工具函数**：提供通用功能支持

主要页面模块包括：

- 手工项目管理
- 预约管理
- 订单管理
- 用户管理
- 系统配置

### 小程序架构

基于Taro + Vue 3 + TypeScript构建的跨平台应用，支持多端部署：

- **页面管理**：`pages`目录包含所有业务页面
- **组件管理**：`components`目录包含可复用组件
- **状态管理**：使用Pinia进行全局状态管理
- **API接口**：统一管理与后端的交互接口
- **工具函数**：提供通用功能支持
- **配置管理**：多环境配置管理

主要页面模块包括：

- 首页（手工项目展示）
- 手工项目详情
- 预约流程
- 订单管理
- 购物车
- 用户中心

## 技术栈

### 微信小程序端

在小程序端我选择使用京东的`Taro`小程序开发框架。其实采用`Taro`，`Uni-App`，`微信小程序官方语法`
这三个框架开发并没有多大的差别。它们的配置，目录结构，API，都是遵循统一的规范。主要差别是在于`Taro`对于`Vue3`+`TypeScript`
支持较好。

| 技术         | 说明                                                                | 官网                                                     |
|------------|-------------------------------------------------------------------|--------------------------------------------------------|
| Taro       | 小程序统一开发框架                                                         | <https://docs.taro.zone/>                              |
| Vue3       | Vue 基于标准 HTML 拓展了一套模板语法。Vue 会自动跟踪 JavaScript 状态并在其发生变化时响应式地更新 DOM | <https://cn.vuejs.org/>                                |
| NutUI      | 支持TypeScript提示的TaroUI组件库，80+ 高质量组件，覆盖移动端主流场景                      | <https://nutui.jd.com/taro/vue/4x/#/zh-CN/guide/intro> |
| Pinia      | 全局状态管理框架，支持TypeScript类型提示                                         | <https://pinia.web3doc.top/>                           |
| TypeScript | 让 JS 具备类型声明                                                       | <https://www.typescriptlang.org/>                      |
| ESLint     | 语法校验和格式整理                                                         | <https://eslint.org/>                                  |

### Java服务端

| 技术             | 说明                                                                             | 官网                                                                                     |
|----------------|--------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| SpringBoot3    | Web应用开发框架，需要JDK17及以上版本                                                         | <https://spring.io/projects/spring-boot>                                               |
| SaToken        | 一个轻量级 Java 权限认证框架，主要解决：登录认证、权限认证、单点登录、OAuth2.0、分布式Session会话、微服务网关鉴权 等一系列权限相关问题 | <https://sa-token.cc/>                                                                 |
| Jimmer         | 不仅有Mybatis的灵活性也有Hibernate的复用性                                                  | <https://babyfish-ct.github.io/jimmer-doc/zh/>                                         |
| QiFanGenerator | 自己写的代码生成器，快速生成前后端增删改查。                                                         | 无官网，在代码里面参考`@GenEentity`和`@GenXXXField`注解就行了                                           |
| 阿里云OSS         | 存储图片，学习用途基本上免费。                                                                | [对象存储 OSS-阿里云帮助中心 (aliyun.com)](https://help.aliyun.com/zh/oss/)                       |
| 微信小程序服务端API    | 用户登录，订阅消息等接口                                                                   | [微信开放文档 (qq.com)](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/)        |
| 微信支付V3         | 用户支付订单                                                                         | [微信支付开发者文档 (qq.com)](https://pay.weixin.qq.com/wiki/doc/apiv3/wxpay/pages/index.shtml) |
| 腾讯地图Api        | 通过地址详情解析出省、市、区                                                                 | [腾讯地图](https://lbs.qq.com/dev/console/home)                                            |

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

## 快速开始

### 代码地址

```shell
git remote add origin https://github.com/qifan777/handmade-shop.git
```

### 环境要求

- JDK 17
- Node.js 20+ 和 npm/yarn/pnpm
- MySQL 8.x
- Redis 7.x
- 微信开发者工具
- 微信小程序（企业个体工商户主体）
- 微信支付
- 阿里云oss
- 腾讯地图api key
- 小程序申请`wx.chooseLocation`权限

### 后端启动

1. 导入sql`database.sql`初始数据库
2. 配置微信支付/小程序/阿里云oss/腾讯地图apiKey
3. 修改`application-dev.yml`中`mysql`和`redis`为你自己的密码
4. 启动`ServerApplication`
5. target/generated-sources/annotations右键mark directory as/generated source root

### 后台管理启动

1. `npm install`
2. `npm run api-admin`同步接口和ts类型，先启动后端
3. `npm run dev`

### 小程序启动

1. `yarn install`
2. `yarn api`同步接口和ts类型，先启动后端
3. `project.config.json`修改`appId`
4. `yarn dev:weapp`
5. 导入`handmade-shop-miniprogram`到微信开发者工具

## 联系方式

- 需要以下服务联系微信：ljc666max
    - 付费远程运行
    - 定制开发
    - 环境租借（微信支付、小程序），仅用于学习跑通流程
- 其他关于程序运行安装报错请加QQ群：
    - 416765656（满）
    - 632067985