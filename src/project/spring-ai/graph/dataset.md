---
order: 1
---
# 数据集

本项目使用的数据集是[美国证券交易委员会数据集](https://github.com/neo4j-examples/sec-edgar-notebooks/tree/main/data/sample)，将该项目的python技术栈`langchain`+`neo4j`转成java的`SpringDataNeo4j`+`SpringAI`。

下面认识一下本次构建知识图谱使用的数据集

## Form 10K

Form 10-K是美国证券交易委员会（SEC）要求上市公司必须每年提交的有关其财务表现与公司运营的综合性报告，具体来说包括公司历史，组织架构，财务状况，每股收益，分支机构，高管薪酬等信息。

下面是Form10K每个字段的解释

```java

@Data
public class Form10K {
    /**
     * 业务
     */
    private String item1;
    /**
     * 危险因素
     */
    private String item1a;
    /**
     * 管理层对财务状况及经营成果的探讨与分析。
     */
    private String item7;
    /**
     * 市场风险的定量和定性披露
     */
    private String item7a;
    /**
     * 中央索引键(CIK)用于证券交易委员会的计算机系统，用于识别已向证券交易委员会提交披露文件的公司和个人。
     */
    private String cik;

    /**
     * 。CUSIP的创立是为了给北美的每一个证券一个唯一的代码，这样在清算的时候就不会因为名字相似而出错。
     * 注意它是为了给每一个证券一个唯一的代码，这个证券包括股票，期权，期货，政府债券，企业债券等所有的证券
     */
    private List<String> cusip;
    /**
     * CUSIP的前六位是企业的代码
     */
    private String cusip6;
    /**
     * 公司的名称（包含别名，所以有多个）列表
     */
    private List<String> names;
    /**
     * 该Form 10-K报告的原文
     */
    private String source;
}
```

这个数据集可以构建`Company`、`Form`、`Chunk`三个节点。

也可以构建`FILED`、`SECTION`、`PART_OF`、`NEXT`这四种联。

```cypher
(:Company)-[:FILED]->(:Form) // 公司发布了Form10K报告
(:Form)-[:SECTION]->(:Chunk) // Form10K报告包含了多个段落
(:Chunk)-[:PART_OF]->(:Form) // Chunk属于Form10K
(:Chunk)-[:NEXT]->(Chunk)    // 比如item1被切割成4个段，这4个通过next依次连接。
```

## Form13

Form13包含投资方公司投资的其他公司、所持股份数量和投资价值的信息。

```java

@Data
public class Form13 {
    /**
     * From13表格的原文链接
     */
    private String source;
    /**
     * 投资方公司的CIK，参考Form10K中的CIK解释
     */
    private String managerCik;
    /**
     * 投资方公司的名称
     */
    private String managerName;
    /**
     * 投资方公司的地址
     */
    private String managerAddress;
    /**
     * Form13报告发布的日期
     */
    private String reportCalendarOrQuarter;
    /**
     * 参考Form10K中的CUSIP6解释
     */
    private String cusip6;
    /**
     * 参考Form10K中的CUSIP解释
     */
    private String cusip;
    /**
     * 被投资公司的名称
     */
    private String companyName;
    /**
     * 投资的金额
     */
    private Double value;
    /**
     * 投资份额
     */
    private Double shares;
}
```

Form13可以构建`Manager`节点和`OWNS_STOCK_IN`关联。

```cypher
(:Manager)-[:OWNS_STOCK_IN]->(:Company) // 投资公司投资了其他公司
```
