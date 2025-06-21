---
order: 3
---
# 嵌入模型

如何用一段话去数据库查找数据？答案是向量求相似度。在高中的时候我们学过可以用cos求两个向量之间的夹角，cos值越大，夹角越小，夹角越小，相似度越高。

所以第一件事情需要将句子向量化，然后和向量数据库中的向量进行比较，找到最相似的向量。

嵌入模型就可以帮我们做到这件事情。

## 使用嵌入模型

请参考[基础配置](../config/base.md)。本例使用的是阿里嵌入模型。

选择模型

```yml
    # 阿里灵积
    dash-scope:
      api-key: xxx
      chat:
        options:
          model: qwen-max
      embedding:
        options:
          model: text-embedding-v2
```

文本嵌入

```java
    // 阿里嵌入模型
    private final EmbeddingModel embeddingModel;

    public void embeddingTest() {
        // 文本嵌入
        float[] embed = embeddingModel.embed("你好，我的名字是起凡");
        log.info("文本转换得到的向量: {}", embed);
    }
```
