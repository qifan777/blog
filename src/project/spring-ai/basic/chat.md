---
order: 1
---
# ChatClient发送消息

下面是一个简单的ChatClient结合ChatModel的消息发送实例。

## AI厂商接入

本案例使用的是阿里的灵积AI服务请参考[灵积接入](../config/dash-scope.md)。

其他AI厂商接入方式请参考下面的链接：
[百度千帆](../config/qian-fan.md)
[智谱清言](../config/zhi-pu.md)
[kimi](../config/kimi.md)

## 注入AI模型

我这边使用的阿里的灵积模型

```java
private final ChatModel chatModel;
```

## 非流式消息发送

需要注意`ChatResponse`来自`org.springframework.ai.chat.model`。

```java
    // AI模型基座，可以切换不同的AI厂商模型
    // 阿里灵积
    private final ChatModel chatModel;

    /**
     * 非流式问答
     *
     * @param prompt 用户提问
     * @return org.springframework.ai.chat.model.ChatResponse
     */
    @GetMapping("chat")
    public String chat(@RequestParam String prompt) {
        ChatClient chatClient = ChatClient.create(chatModel);
        return chatClient.prompt()
                // 输入单条提示词
                .user(prompt)
                // call代表非流式问答，返回的结果可以是ChatResponse，也可以是Entity（转成java类型），也可以是字符串直接提取回答结果。
                .call()
                .content();
    }
```

响应结果

```json
{
    "code": 1,
    "msg": "操作成功",
    "result": "你好！有什么我能为你效劳的吗？",
    "success": true
}
```

## 流式消息发送

声明该接口的返回类型是文本流，然后将回答结果转成SSE格式的文本流，再配合前端sse请求，就可以实现流式问答了。

```java
@GetMapping(value = "chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
```

```java
    private final ObjectMapper objectMapper;
    /**
     * 流式问答
     *
     * @param prompt 用户提问
     * @return Flux<ServerSentEvent < String>> 流式响应
     */
    @GetMapping(value = "chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> chatStream(@RequestParam String prompt) {
        return ChatClient.create(chatModel).prompt()
                // 输入多条消息，可以将历史记录传入
                .messages(new SystemMessage("你是一个Java智能助手，应用你的Java知识帮助用户解决问题或者编写程序"),
                        new UserMessage(prompt))
                // 流式返回
                .stream()
                // 构造SSE（ServerSendEvent）格式返回结果
                .chatResponse().map(chatResponse -> ServerSentEvent.builder(toJson(chatResponse))
                        .event("message")
                        .build());
    }

    /**
     * 将流式回答结果转json字符串
     *
     * @param chatResponse 流式回答结果
     * @return String json字符串
     */
    @SneakyThrows
    public String toJson(ChatResponse chatResponse) {
        return objectMapper.writeValueAsString(chatResponse);
    }
```

可以看到接口流式的响应，并且系统指令生效，AI知道自己是一个Java助手。

注意：灵积会把之前的响应内容累加起来。其他的AI厂家模型不会。

```text
event:message
data:{"result":{"output":{"messageType":"ASSISTANT","media":[],"metadata":{"messageType":"ASSISTANT"},"content":"你好"},"metadata":{"finishReason":"null","contentFilterMetadata":null}},"metadata":{},"results":[{"output":{"messageType":"ASSISTANT","media":[],"metadata":{"messageType":"ASSISTANT"},"content":"你好"},"metadata":{"finishReason":"null","contentFilterMetadata":null}}]}

event:message
data:{"result":{"output":{"messageType":"ASSISTANT","media":[],"metadata":{"messageType":"ASSISTANT"},"content":"你好！很高兴"},"metadata":{"finishReason":"null","contentFilterMetadata":null}},"metadata":{},"results":[{"output":{"messageType":"ASSISTANT","media":[],"metadata":{"messageType":"ASSISTANT"},"content":"你好！很高兴"},"metadata":{"finishReason":"null","contentFilterMetadata":null}}]}

....省略
event:message
data:{"result":{"output":{"messageType":"ASSISTANT","media":[],"metadata":{"messageType":"ASSISTANT"},"content":"你好！很高兴能在这里帮助你。如果你有任何关于Java编程的问题、需要解决特定问题的代码示例或是想要了解Java某个概念，请随时告诉我。无论是基础语法、面向对象编程、集合框架、多线程、网络编程还是其他高级话题，我都乐于协助。你现在需要帮助吗？"},"metadata":{"finishReason":"stop","contentFilterMetadata":null}},"metadata":{},"results":[{"output":{"messageType":"ASSISTANT","media":[],"metadata":{"messageType":"ASSISTANT"},"content":"你好！很高兴能在这里帮助你。如果你有任何关于Java编程的问题、需要解决特定问题的代码示例或是想要了解Java某个概念，请随时告诉我。无论是基础语法、面向对象编程、集合框架、多线程、网络编程还是其他高级话题，我都乐于协助。你现在需要帮助吗？"},"metadata":{"finishReason":"stop","contentFilterMetadata":null}}]}
.....
```
