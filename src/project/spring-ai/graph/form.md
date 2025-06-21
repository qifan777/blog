---
order: 3
---
# Form构建

## Form节点

先读取form10k数据，构建form节点

```java
    private final FormRepository formRepository;
    
    @SneakyThrows
    @PostMapping("node")
    public void createNodes() {
        var fileDir = new File("F:\\workspace\\code\\learn\\sec-edgar-notebooks\\data\\sample\\form10k");
        File[] files = fileDir.listFiles();
        for (File file : files) {
            if (!file.getName().contains(".json")) continue;
            var form10K = new ObjectMapper().readValue(file, Form10K.class);
            var fullText = "About " +
                           String.join(",", form10K.getNames()) +
                           "..." +
                           form10K.getItem1() +
                           "\n" +
                           form10K.getItem1a() +
                           "\n" +
                           form10K.getItem7() +
                           "\n" +
                           form10K.getItem7a();
            var formId = file.getName().replace(".json", "");
            var form = Form.builder().id(formId)
                    .fullText(fullText)
                    .cusip6(form10K.getCusip6())
                    .source(form10K.getSource())
                    .build();
            formRepository.save(form);
        }
    }
```

## Form与Chunk的关联

### PartOf关系

根据formId关联`Chunk`节点和`Form`节点，然后使用`merge`创建`PART_OF`关系。

```cypher
match (c:Chunk), (f:Form) where c.formId=f.id
merge (c)-[r:PART_OF]->(f)
return count(r);
```

```java
@PostMapping("relationship/section")
    public void createSectionRelationship() {
        neo4jClient.query("""
                        match (c:Chunk),(f:Form) where c.chunkSeqId=0 and f.id = c.formId
                        merge (f)-[r:SECTION {item:c.item}] -> (c)
                        return count(r)
                        """)
                .run();
    }
```

### Section关系

form关联Chunk链接的头节点，`c.chunkSeqId=0`代表该节点是开头。`{item:c.item}`是给`SECTION`关系添加属性。之前说过一个form有多个`item`因此需要该属性做区分。

```cypher
match (c:Chunk),(f:Form) where c.chunkSeqId=0 and f.id = c.formId
merge (f)-[r:SECTION {item:c.item}] -> (c)
return count(r)
```

```java
@PostMapping("relationship/section")
    public void createSectionRelationship() {
        neo4jClient.query("""
                        match (c:Chunk),(f:Form) where c.chunkSeqId=0 and f.id = c.formId
                        merge (f)-[r:SECTION {item:c.item}] -> (c)
                        return count(r)
                        """)
                .run();
    }
```
