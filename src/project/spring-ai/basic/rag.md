---
order: 6
---
# RAG(检索增强生成)

要搭建自己的知识库除了文档嵌入到向量数据库之外，就是RAG了。当用户提问的时候先从想来数据库搜索相关的资料，再把相关的资料拼接到用户的提问中，再让模型生成答案。

## 文档嵌入

请参考[文档嵌入](./vector-database.md#文档嵌入)，向数据库中插入一些自己的文档。

## QuestionAnswerAdvisor

`QuestionAnswerAdvisor`可以在用户发起的提问时，先向数据库查询相关的文档，再把相关的文档拼接到用户的提问中，再让模型生成答案。那就是`RAG`的实现了。

`RAG`的实现过程：

1. `query` = 用户的提问；`template` = 提示词模板
2. `QuestionAnswerAdvisor`会在运行时替换模板中的占位符`question_answer_context`，替换成向量数据库中查询到的文档，即`context=template.replace("question_answer_context",查询到的文档)`。此时的`contextQuery`=`query`+`context`;
3. `contextQuery`发送给大模型得到答案

正常的提问过程是`query`=用户的提问;`query`发送给大模型得到答案。
对比`RAG`的提问过程可以发现多了提示词模板和向量数据库查询的过程。

```java
    private final ChatModel chatModel;
    private final VectorStore vectorStore;
    /**
     * 从向量数据库中查找文档，并将查询的文档作为上下文回答。
     *
     * @param prompt 用户的提问
     * @return SSE流响应
     */
    @GetMapping(value = "chat/stream/database", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> chatStreamWithDatabase(@RequestParam String prompt) {
        // 1. 定义提示词模板，question_answer_context会被替换成向量数据库中查询到的文档。
        String promptWithContext = """
                下面是上下文信息
                ---------------------
                {question_answer_context}
                ---------------------
                给定的上下文和提供的历史信息，而不是事先的知识，回复用户的意见。如果答案不在上下文中，告诉用户你不能回答这个问题。
                """;
        return ChatClient.create(chatModel).prompt()
                .user(prompt)
                // 2. QuestionAnswerAdvisor会在运行时替换模板中的占位符`question_answer_context`，替换成向量数据库中查询到的文档。此时的query=用户的提问+替换完的提示词模板;
                .advisors(new QuestionAnswerAdvisor(vectorStore, SearchRequest.defaults(), promptWithContext))
                .stream()
                // 3. query发送给大模型得到答案
                .content()
                .map(chatResponse -> ServerSentEvent.builder(chatResponse)
                        .event("message")
                        .build());
    }

```
