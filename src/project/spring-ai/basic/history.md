---
order: 2
---
# 对话记录（内存存储）

为了让AI记住你和它的对话，需要把对话信息存储起来。当你N+1次和AI聊天的时候，需要把之前的N次对话都带上这样AI才能记住你和它的对话。
不过有时候为了节省`Token`，并不一定把所有的对话都带上，可以只携带前面几条对话。

## 基础模型的接入

本案例使用的是阿里的灵积AI服务请参考[灵积接入](../config/dash-scope.md)。

## MessageChatMemoryAdvisor

`MessageChatMemoryAdvisor`会读取会话id对应的消息列表，并把消息列表拼接到历史的消息中。

历史消息的实现过程：

1. 提供ChatMemory，通过会话id查找历史消息。下面的例子提供的是`MessageWindowChatMemory`，内存存储。
2. `MessageChatMemoryAdvisor`会在运行时调用`MessageWindowChatMemory`，通过会话id查找历史消息。然后把消息列表拼接到历史的消息中。
3. 发送消息给大模型得到答案

```java
    // AI模型基座，可以切换不同的AI厂商模型
    // 阿里灵积
    private final ChatModel chatModel;
    // 模拟数据库存储会话和消息
    private final MessageWindowChatMemory chatMemory = MessageWindowChatMemory.builder()
            .maxMessages(10)
            .build();
    /**
     * 根据会话id，从数据库中查找历史消息，并将消息作为上下文回答。
     *
     * @param prompt    用户的提问
     * @param sessionId 会话id
     * @return SSE流响应
     */
    @GetMapping(value = "chat/stream/history", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> chatStreamWithHistory(@RequestParam String prompt,
                                                               @RequestParam String sessionId) {
        // 1. 如果需要存储会话和消息到数据库，自己可以实现ChatMemory接口，这里使用InMemoryChatMemory，内存存储。
        // 2. 传入会话id，MessageChatMemoryAdvisor会根据会话id去查找消息。
        // 3. 只需要携带最近10条消息
        MessageChatMemoryAdvisor  messageChatMemoryAdvisor= MessageChatMemoryAdvisor
                .builder(chatMemory)
                .conversationId(sessionId)
                .build();
        return ChatClient.create(chatModel).prompt()
                .user(prompt)
                // MessageChatMemoryAdvisor会在消息发送给大模型之前，从ChatMemory中获取会话的历史消息，然后一起发送给大模型。
                .advisors(messageChatMemoryAdvisor)
                .stream()
                .content()
                .map(chatResponse -> ServerSentEvent.builder(chatResponse)
                        .event("message")
                        .build());
    }
```
