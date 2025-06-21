---
order: 5
---
# 向量数据库

向量数据库是AI记忆的核心组件，AI记忆除了历史的对话信息之外就是向量数据库中存储文档了，也就是大家常说的知识库。本节内容介绍如何向量数据库中存储文档和检索文档。为接下来的知识库(RAG)搭建做铺垫

## 基础模型的接入

本案例使用的是阿里的灵积AI服务请参考[灵积接入](../config/dash-scope.md)。

## 安装RedisStack

需要先禁用掉自己原本的redis，防止端口冲突。访问`localhost:8001`查看数据库的信息。用户名：`default`,密码：`123456`。

```shell
docker run -d --name redis-stack --restart=always  -v redis-data:/data -p 6379:6379 -p 8001:8001 -e REDIS_ARGS="--requirepass 123456" redis/redis-stack:latest
```

## 引入依赖

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-redis-store</artifactId>
</dependency>
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-tika-document-reader</artifactId>
</dependency>
```

## 配置连接

```yml
spring:
  data:
    redis:
      database: 0
      timeout: 10s
      lettuce:
        pool:
          # 连接池最大连接数
          max-active: 200
          # 连接池最大阻塞等待时间（使用负值表示没有限制）
          max-wait: -1ms
          # 连接池中的最大空闲连接
          max-idle: 10
          # 连接池中的最小空闲连接
          min-idle: 0
      repositories:
        enabled: false
      password: 123456
```

## 配置向量数据库

如果你的项目里面有用到redis，需要先禁用`RedisVectorStoreAutoConfiguration`。这是SpringAI自动配置RedisStack的向量数据库连接，会导致Redis的连接配置冲突。

`VectorStore`对象需要提供`EmbeddingModel`，这个案例提供的是阿里灵积的`EmbeddingModel`。可以切换换成其他厂家的EmbeddingModel。

```java
@Configuration
// 禁用SpringAI提供的RedisStack向量数据库的自动配置，会和Redis的配置冲突。
@EnableAutoConfiguration(exclude = {RedisVectorStoreAutoConfiguration.class})
// 读取RedisStack的配置信息
@EnableConfigurationProperties({RedisVectorStoreProperties.class})
@AllArgsConstructor
public class RedisVectorConfig {

    /**
     * 创建RedisStack向量数据库
     *
     * @param embeddingModel 嵌入模型
     * @param properties     redis-stack的配置信息
     * @return vectorStore 向量数据库
     */
    @Bean
    public VectorStore vectorStore(EmbeddingModel embeddingModel,
                                   RedisVectorStoreProperties properties,
                                   RedisConnectionDetails redisConnectionDetails) {
        RedisVectorStore.RedisVectorStoreConfig config = RedisVectorStore.RedisVectorStoreConfig.builder().withIndexName(properties.getIndex()).withPrefix(properties.getPrefix()).build();
        return new RedisVectorStore(config, embeddingModel,
                new JedisPooled(redisConnectionDetails.getStandalone().getHost(),
                        redisConnectionDetails.getStandalone().getPort()
                        , redisConnectionDetails.getUsername(),
                        redisConnectionDetails.getPassword()),
                properties.isInitializeSchema());
    }
}
```

## 文档嵌入

在上面的`VectorStore`配置中我们提供了`EmbeddingModel`，调用`vectorStore.add(splitDocuments)`底层会把文档给`EmbeddingModel`把文本变成向量然后再存入向量数据库。

```java
    private final VectorStore vectorStore;
   /**
     * 嵌入文件
     *
     * @param file 待嵌入的文件
     * @return 是否成功
     */
    @SneakyThrows
    @PostMapping("embedding")
    public Boolean embedding(@RequestParam MultipartFile file) {
        // 从IO流中读取文件
        TikaDocumentReader tikaDocumentReader = new TikaDocumentReader(new InputStreamResource(file.getInputStream()));
        // 将文本内容划分成更小的块
        List<Document> splitDocuments = new TokenTextSplitter()
                .apply(tikaDocumentReader.read());
        // 存入向量数据库，这个过程会自动调用embeddingModel,将文本变成向量再存入。
        vectorStore.add(splitDocuments);
        return true;
    }
```

## 文档查询

调用`vectorStore.similaritySearch(query)`时同样会先把用户的提问给`EmbeddingModel`，将提问变成向量，然后与向量数据库中的文档向量进行相似度计算（cosine值）。

要注意：此时向量数据库不会回答用户的提问。要回答用户的提问请参考后面的`RAG`

```java

    /**
     * 查询向量数据库
     *
     * @param query 用户的提问
     * @return 匹配到的文档
     */

    @GetMapping("query")
    public List<Document> query(@RequestParam String query) {
        return vectorStore.similaritySearch(query);
    }
```
