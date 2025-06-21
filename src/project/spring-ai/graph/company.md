---
order: 4
---
# Company构建

## Company节点

```java
    private final CompanyRepository companyRepository;

    @SneakyThrows
    @PostMapping("nodes")
    public void createNodes() {
        var fileDir = new File("F:\\workspace\\code\\learn\\sec-edgar-notebooks\\data\\sample\\form10k");
        File[] files = fileDir.listFiles();
        for (File file : files) {
            if (!file.getName().contains(".json")) continue;
            var form10K = new ObjectMapper().readValue(file, Form10K.class);
            var company = Company.builder().cusip6(form10K.getCusip6())
                    .cusips(form10K.getCusip())
                    .names(form10K.getNames())
                    .name(form10K.getNames().get(0))
                    .build();
            companyRepository.save(company);
        }
    }
```

## Company和Form的关联

通过`cusip6`关联`Company`和`Form`，然后使用`merge`语句创建`FILED`关系。

```cypher
match (com:Company), (f:Form) where com.cusip6 = f.cusip6
merge (com)-[:FILED]->(form)
```

```java
    @PostMapping("relationship/filed")
    public void createFiledRelationship() {
        // 创建公司和form关系
        neo4jClient.query("""
                        match (com:Company), (f:Form) where com.cusip6 = f.cusip6
                        merge (com)-[:FILED]->(form)
                        """)
                .run();
    }
```
