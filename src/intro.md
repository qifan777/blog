---
icon: circle-info
cover: /assets/images/cover3.jpg
article: false
---

# 简历

## 个人信息

起凡
男，2000 年出生

Java 研发工程师

## 教育经历

学士，华侨大学，信息管理与信息系统专业。

[//]: # (## 项目经历)

[//]: # ()

[//]: # (### - **华大快帮**)

[//]: # ()

[//]: # (*seata，openfeign，sentinel，spring gateway，rabbitmq，redis，sa-token，spring boot，jpa，k8s。*)

[//]: # ()

[//]: # (项目介绍：)

[//]: # ()

[//]: # (一个 springcloud+springboot 做后台，uni-app 做前端的跑腿小程序。)

[//]: # ()

[//]: # (账户中心：)

[//]: # ()

[//]: # (1. 基础用户（一个手机号对应一个），关联多个第三方用户。)

[//]: # (2. 基础账户，个人账户，跑腿账户。)

[//]: # ()

[//]: # (认证中心：)

[//]: # ()

[//]: # (1. 验证码发送)

[//]: # (2. 多种登录方式)

[//]: # (3. redis分布式session)

[//]: # ()

[//]: # (交易中心：)

[//]: # ()

[//]: # (1. 基础订单)

[//]: # (2. 多种支付方式)

[//]: # (3. 状态机)

[//]: # ()

[//]: # (任务中心：)

[//]: # ()

[//]: # (1. 发布任务)

[//]: # (2. 任务订单)

[//]: # ()

[//]: # (工作流中心：)

[//]: # ()

[//]: # (1. 跑腿资格申请)

[//]: # ()

[//]: # (基础模块：)

[//]: # ()

[//]: # (1. 代码生成器)

[//]: # (2. oss starter)

[//]: # (3. 权限拦截 starter)

[//]: # (4. 基础公用类)

[//]: # ()

[//]: # (**难点：**)

[//]: # ()

[//]: # (1. 多种订单计算价格逻辑不同，但都需要要支付功能。采用交易中心订单负责支付，支付完发送支付成功消息到rabbiqmq。其他业务监听自己的订单支付则执行后续逻辑。)

[//]: # (2. 工作流与资质审核集成，审核通过后发送http请求开通资格。)

[//]: # (3. 代码生成器，与Lombok原理一致。生成六边形架构模板。)

[//]: # (4. Mapstrcut，dto与entity类型转换。)

[//]: # (5. 幂等性，aop锁。)

[//]: # (6. 单点登录，统一token发放，引入权限模块查询redis认证。)

[//]: # (7. 状态机，订单状态流转。)

[//]: # (8. 责任链价格计算。)

[//]: # (9. 分布式事务。)

[//]: # (10. k8s部署。)

[//]: # ()

[//]: # (### - **在线寄信小程序**)

[//]: # ()

[//]: # (*SpringBoot，Spring Data JPA，MapStruct，Mysql，Vue3，TypeScript，ElementUI，Uni-App*)

[//]: # ()

[//]: # (项目介绍：)

[//]: # ()

[//]: # (在线寄信，在线寄明信片，在线寄商品，购物⻋，推⼴拉新，订单抽成。)

[//]: # ()

[//]: # (**难点：**)

[//]: # ()

[//]: # (1. 字数价格，照片价格，运费价格动态配置。)

[//]: # (2. 推广拉新订单抽成通过观察者模式解耦（监听消息）。)

[//]: # (3. 多模块打包，docker-compose快速部署。)

[//]: # ()

[//]: # (### - **卖课件项目**)

[//]: # ()

[//]: # (*SpringBoot，Mybatis-Plus，Mysql，Vue3，TypeScript，ElementUI*)

[//]: # ()

[//]: # (项目介绍：)

[//]: # ()

[//]: # (购买课件后可以在线预览课件&#40;ppt,doc,pdf 等&#41;, 购物⻋, vip, 兑换码。)

[//]: # ()

[//]: # (**业务难点：**)

[//]: # ()

[//]: # (    1. 上传时选择一整个文件夹，在小程序中依然呈现文件夹的目录结构。采用递归的形式生成树结构。)

[//]: # (    2. VIP购买打折，采用责任链对订单价格进行计算，可以扩展以后的价格计算逻辑。)

[//]: # (    3. 商品SKU配置表结构设计。)

[//]: # (    4. 手写CSS实现设计稿)

## 技能清单

- 后端开发
    1. JDK基础（集合，IO，并发，函数式编程）
    2. Jakarta EE
    3. MySQL，SQLServer，JDBC，JPA规范，Hibernate, Spring Data JPA，Mybatis，Mybatis-Plus
    4. Jackson，Mapstruct，Java Bean Validation
    5. Spring Core，Spring Data，Spring MVC，Spring Boot。
    6. 设计模式，六边形架构（DDD），日志规范，单元测试，Open Api
    7. Spring Cloud，Spring Cloud Aliababa，K8S。
    8. Git，Maven，IDEA
- 前端开发
    1. HTML+CSS+JS
    2. Webpack
    3. vue-router，vuex，vue2，vue-cli
    4. vue-router，pinia，vue3，typescript，vite
    5. uni-app+vue3+ts
- 运维
    - Nginx，Docker，Linux
- 中间件
    - Redis，RabbitMq，ElasticSearch
- 计算机基础
    - 数据库，计算机⽹络，操作系统，数据结构与算法
