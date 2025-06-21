---
order: 1
---

# 项目介绍

《动手学SpringAI》包含SSE流/Agent智能体/知识图谱RAG/FunctionCall/历史消息/图片生成/图片理解/Embedding/VectorDatabase/RAG

![项目内容](./cover.png)

![知识点](SrpingAI知识点.png)

[源码地址](https://github.com/qifan777/dive-into-spring-ai)

<BiliBili bvid="BV14y411q7RN" />

## 运行环境

- Java 17
- Node.js 18+
- MySQL 8
- DashScope API KEY（或者其他）
- Redis-Stack

    redis基础上拓展向量查询功能

    ```shell
    docker run -d \
    --name redis-stack \
    --restart=always \
    -v redis-data:/data \
    -p 6379:6379 \
    -p 8001:8001 \
    -e REDIS_ARGS="--requirepass 123456" \ 
    redis/redis-stack:latest
    ```

- neo4j 5+

    安装完neo4j访问`localhost:7474`, 默认的账号密码都是`neo4j`和`neo4j`。

    ```shell
    docker run \
    -d \
    -p 7474:7474 -p 7687:7687 \
    -v neo4j-data:/data -v neo4j-data:/plugins \
    --name neo4j \
    -e NEO4J_apoc_export_file_enabled=true \
    -e NEO4J_apoc_import_file_enabled=true \
    -e NEO4J_apoc_import_file_use__neo4j__config=true \
    -e NEO4JLABS_PLUGINS=\[\"apoc\"\] \
    -e NEO4J_dbms_security_procedures_unrestricted=apoc.\\\* \
    neo4j
    ```

## 运行步骤

### 1.clone代码

```shell
git clone https://github.com/qifan777/dive-into-spring-ai
```

### 2. idea打开项目

### 3. 修改配置文件

修改application.yml中的API-KEY, MySQL, Redis-Stack, Neo4j配置

### 4. 运行项目

后端运行

1. 运行ServerApplication.java
2. target/generated-sources/annotations右键mark directory as/generated source root

前端运行，在front-end目录下

- npm run install
- npm run api （先运行后端）
- npm run dev

## 联系方式

付费远程运行/安装/定制开发联系微信：ljc666max

其他关于程序运行安装报错请加QQ群：

- 416765656（满）
- 632067985
