---
order: 5
---
# Manager构建

## Manager节点

使用`easy-excel`读取`form13.csv`文件，将数据映射成`Manager`对象，并保存到数据库中。

```java
    private final Neo4jClient neo4jClient;
    private final ObjectMapper jacksonObjectMapper;
    private final ManagerRepository managerRepository;

    public List<Form13> readForm13List() {
        SyncReadListener syncReadListener = new SyncReadListener();
        EasyExcel.read(new File("F:\\workspace\\code\\learn\\sec-edgar-notebooks\\data\\sample\\form13.csv"), Form13.class, syncReadListener)
                .sheet()
                .doRead();
        return syncReadListener.getList()
                .stream()
                .map(o -> (Form13) o)
                .toList();
    }

    @PostMapping("nodes")
    public void createNodes() {
        List<Form13> form13List = readForm13List();
        // 投资方可能投资了多个证券，所以会有重复的投资方记录，去重一下
        List<String> cikList = form13List.stream().map(Form13::getManagerCik).distinct().toList();
        // 每个cik代表一个投资方，映射成Manager对象
        List<Manager> managerList = cikList.stream().map(cik -> {
            Form13 manager = form13List.stream()
                    .filter(form13 -> form13.getManagerCik().equals(cik))
                    .findFirst()
                    .orElseThrow(() -> new BusinessException("投资公司不存在"));
            return new Manager()
                    .setCik(manager.getManagerCik())
                    .setName(manager.getManagerName())
                    .setAddress(manager.getManagerAddress());
        }).toList();
        managerRepository.saveAll(managerList);
    }
```

## Manager和Company的关联

因为`Manager`和`Company`是多对多的关系，`form13.csv`相当于是中间表，通过它可以创建`OWNS_STOCK_IN`关系。因此下面我们遍历`form13.csv`，创建`OWNS_STOCK_IN`关系。

1. 根据`managerCik`和`cusip6`查询`Manager`和`Company`节点
2. 创建`OWNS_STOCK_IN`关系，更新或者创建`OWNS_STOCK_IN`关系，如果已存在，则更新`reportCalendarOrQuarter`
3. 第一次创建设置关系的`value`、`shares`属性

由于这个`Cypher`语句需要较多的参数，通过`toMap`方法将`Form13`对象转换为`Map`，然后通过`neo4jClient`的`bindAll`方法执行将参数传给`Cypher`语句。

```java
    @PostMapping("relationship/stock-in")
    public void createStockInRelationship() {
        List<Form13> form13List = readForm13List();
        form13List.forEach(form13 -> {
            neo4jClient.query("""
                            match (m:Manager {cik: $managerCik}), (com:Company {cusip6: $cusip6})
                            merge (m)-[owns:OWNS_STOCK_IN {reportCalendarOrQuarter: $reportCalendarOrQuarter}]->(com)
                            on create set
                                owns.value = $value,
                                owns.shares = $shares
                            """)
                    .bindAll(toMap(form13))
                    .run();
        });

    }

    @SneakyThrows
    public Map<String, Object> toMap(Form13 form13) {
        return jacksonObjectMapper.readValue(jacksonObjectMapper.writeValueAsString(form13), new TypeReference<>() {
        });
    }
```
