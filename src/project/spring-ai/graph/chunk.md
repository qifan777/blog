---
order: 2
---
# Chunk构建

## nero4j安装

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

## 依赖

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>easyexcel</artifactId>
    <version>3.3.4</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-neo4j</artifactId>
</dependency>
```

## 配置

模型必须选上下文比较大的，下面这两个都可以，其他的ai厂家可以参考官网描述。

```yml
spring:
  neo4j:
    authentication:
      username: neo4j
      password: 12345678
    uri: bolt://localhost:7687
  ai:
    dash-scope:
      api-key: xxx
      chat:
        model: qwen-max-longcontext
    moonshot:
      api-key: xxx
      chat:
        options:
          model: moonshot-v1-128k
```

## 构建Chunk节点

节点定义

```java
@Builder
@Data
@Node
public class Chunk {
    @Id
    private String id;
    // 切割后的文本
    private String text;
    // item1, item1a, item7, item7a
    private String item;
    // Chunk序列号
    private Integer chunkSeqId;
    // 属于的Form
    private String formId;
    // text的embedding
    private List<Double> textEmbedding;
}
```

1. 读取form10k文件夹下的json文件，每个json文件就代表一个form10k报表信息
2. 将form10k的json文件解析成Chunk节点，每个item会变解析成一个`List<Chunk>`，因此一个form节点有4个`List<Chunk>`。
3. 将每个Chunk节点保存到neo4j中。

```java
    /**
     * 创建Chunk节点，
     */

    @PostMapping("node")
    public void createNodes() {
        var fileDir = new File("F:\\workspace\\code\\learn\\sec-edgar-notebooks\\data\\sample\\form10k");
        File[] files = fileDir.listFiles();
        for (File file : files) {
            if (!file.getName().contains(".json")) continue;
            chunkRepository.saveAll(fileToChunkList(file));
        }

    }

    /**
     * 解析form10k的中的item属性切割成Chunk
     *
     * @param file form10k的json文件
     * @return Chunk节点
     */
    @SneakyThrows
    public List<Chunk> fileToChunkList(File file) {
        ObjectNode node = new ObjectMapper().readValue(file, ObjectNode.class);
        // 每个form10k有item1，item1a，item7，item7a四种文本信息，都需要将切割
        String[] items = {"item1", "item1a", "item7", "item7a"};
        List<Chunk> chunks = new ArrayList<>();
        for (String item : items) {
            String text = node.get(item).asText();
            // 切割文本成
            List<Document> documents = new TokenTextSplitter().split(new Document(text));
            // 最多不超过20 Chunk
            for (int chunkSeqId = 0; chunkSeqId < Integer.min(documents.size(), 20); chunkSeqId++) {
                String formId = file.getName().replace(".json", "");
                chunks.add(Chunk.builder()
                        .id("%s-%s-chunk%04d".formatted(formId, item, chunkSeqId))
                        .chunkSeqId(chunkSeqId)
                        .formId(formId)
                        .text(documents.get(chunkSeqId).getContent())
                        .item(item)
                        .build());
            }
        }
        return chunks;
    }
```

## Chunk链接创建

上面已经将Chunk节点保存到neo4j中，下面需要将同一个item的Chunk节点链接起来。

1. 查询所有的formId
2. 查询每个formId下item1，item1a，item7，item7a四种文本信息对应的Chunk列表
3. 然后按照chunkSeqId进行排序，然后通过`apoc.nodes.link`创建连接

```java
@PostMapping("link")
    public void createLink() {
        Collection<String> formIds = neo4jClient.query("match (c:Chunk) return distinct c.formId as formId")
                .fetchAs(String.class).all();
        // 每个form10k有item1，item1a，item7，item7a四种文本信息，都需要将切割后的Chunk通过NEXT关联起来
        formIds.forEach(formId -> {
            List.of("item1", "item1a", "item7", "item7a").forEach(item -> {
                neo4jClient.query("""
                                MATCH (c:Chunk) // 匹配所有的节点
                                WHERE c.formId = $formId // 属于同一个form和同一个item的节点
                                  AND c.item = $item
                                WITH c
                                  ORDER BY c.chunkSeqId ASC // 根据seqId排序一下节点
                                WITH collect(c) as section_chunk_list // 转成list
                                  CALL apoc.nodes.link(section_chunk_list, "NEXT", {avoidDuplicates: true}) // 节点之间依按顺序创建连接
                                RETURN size(section_chunk_list)
                                """)
                        .bind(formId).to("formId")
                        .bind(item).to("item")
                        .run();
            });
        });
    }
```

## Chunk嵌入

对所有Chunk进行embedding，neo4j中支持向量索引，只有创建索引之后才可以查询相似的向量

```java

    @PostMapping("embedding")
    public void createEmbedding() {
        // 随便将一段文本转成向量，看看这个嵌入模型的向量维度是多少
        int dimension = embeddingModel.embed("你好").size();

        // 在Chunk节点创建索引，使用cosine求向量之间的相似度
        neo4jClient.query("""
                        CREATE VECTOR INDEX `form_10k_chunks` IF NOT EXISTS
                        FOR (c:Chunk) ON (c.textEmbedding)
                        OPTIONS { indexConfig: {
                        `vector.dimensions`: $dimensions,
                        `vector.similarity_function`: 'cosine'
                        }}
                        """)
                .bind(dimension).to("dimensions")
                .run();
        // 对那些没有嵌入的Chunk进行embedding
        List<Chunk> waitToEmbedList = chunkRepository.findByTextEmbeddingIsNull();
        waitToEmbedList.forEach(chunk -> {
            //  调用嵌入模型将文本转向量
            chunk.setTextEmbedding(embeddingModel.embed(chunk.getText()));
        });
        chunkRepository.saveAll(waitToEmbedList);
    }

```
