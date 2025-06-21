# 后端实现

后端实现会话和消息记录必然要先从建表开始，然后编写增删改查，最后实现一些功能。

会话

- 会话保存接口
  - 会话保存dto
- 会话列表接口
  - 获取当前登录用户id作为查询条件
  - 一对多关联获取会话内的消息
- 会话删除接口
  - 根据会话id列表批量删除
  - 删除会话时，会话内的消息也一并级联删除
- 会话id查询接口
  - 一对多关联获取会话内的消息

消息

- 消息发送接口
  - 消息保存dto（接收前端发送的消息）
  - 消息实体内容设计，支持图片/语音/文字
  - `MessageChatMemoryAdvisor`历史消息增强和消息自动保存，调用`AiMessageChatMemory`的`get`方法获取会话的历史消息和`add`方法保存消息。
  - 使用`ChatClient`填写用户发送的消息（可能包含图片/语言），填写`MessageChatMemoryAdvisor`。最后发起流式请求，获取AI回复的消息。
- 历史消息实现
  - `add`方法，保存用户发送的消息和AI回复的消息。因为需要填写创建人id，创建人id是在请求里面存储的。保存的时候是在异步的线程里面，要模拟请求环境才能插入数据到数据库。
  - `get`方法，获取会话历史消息
  - `clear`方法，清空会话的历史消息
  - 消息转换器，将消息实体转换为SpringAI的`Message`，将`Message`转换为消息实体。互相转换。

## 实体设计

### 消息实体设计

消息表

```sql
create table ai_message
(
    id            varchar(36) not null
        primary key,
    created_time  datetime(6) not null,
    edited_time   datetime(6) not null,
    creator_id    varchar(32) not null,
    editor_id     varchar(32) not null,
    type          varchar(32) not null comment '消息类型(用户/ 助手/ 系统)',
    text_content  text        not null comment '消息内容',
    medias        json        null comment '媒体内容如图片链接、语音链接',
    ai_session_id varchar(32) not null comment '会话id'
);
```

消息实体类

```java
/**
 * 历史消息
 */ 
@Entity
public interface AiMessage extends BaseEntity {

    /**
     * 消息类型(用户/助手/系统)
     */
    MessageType type();

    /**
     * 消息内容
     */
    String textContent();

    @Serialized
    @Null
    List<Media> medias();

    @IdView
    String sessionId();

    /**
     * 会话
     */
    @ManyToOne
    @JoinColumn(name = "ai_session_id")
    @OnDissociate(DissociateAction.DELETE)
    AiSession session();

    @Data
    @AllArgsConstructor
    class Media {
        public String type;
        public String data;
    }
}

```

### 会话实体设计

会话表

```sql
create table ai_session
(
    id           varchar(36) not null
        primary key,
    created_time datetime(6) not null,
    edited_time  datetime(6) not null,
    creator_id   varchar(32) not null,
    editor_id    varchar(32) not null,
    name         varchar(32) not null comment '会话名称'
);
```

会话实体类

```java
/**
 * 会话
 */
@Entity
public interface AiSession extends BaseEntity {

    /**
     * 会话名称
     */
    String name();

    /**
     * 一对多关联消息，按创建时间升序
     */

    @OneToMany(mappedBy = "session", orderedProps = @OrderedProp(value = "createdTime"))
    List<AiMessage> messages();
}

```

## AiMessageChatMemory（数据库消息记录）

`AiMessageChatMemory`实现了`ChatMemory`接口，用于保存聊天记录到数据库。

```java
@Service
@AllArgsConstructor
public class AiMessageChatMemory implements ChatMemory {
    private final AiMessageRepository messageRepository;
    
    /**
     * 不实现，手动前端发起请求保存用户的消息和大模型回复的消息
     */
    @Override
    public void add(String conversationId, List<Message> messages) {
    }

    /**
     * 查询会话内的消息最新n条历史记录
     *
     * @param conversationId 会话id
     * @param lastN          最近n条
     * @return org.springframework.ai.chat.messages.Message格式的消息
     */
    @Override
    public List<Message> get(String conversationId, int lastN) {
        return messageRepository
                // 查询会话内的最新n条消息
                .findBySessionId(conversationId, lastN)
                .stream()
                // 转成Message对象
                .map(AiMessageChatMemory::toSpringAiMessage)
                .toList();
    }

    /**
     * 清除会话内的消息
     *
     * @param conversationId 会话id
     */
    @Override
    public void clear(String conversationId) {
        messageRepository.deleteBySessionId(conversationId);
    }
    /**
     * 忽略...
     */
}
```

可以把`AiMessageChatMemory`注入到`MessageChatMemoryAdvisor`中。

MessageChatMemoryAdvisor的作用有下面三个

1. 用户消息发送给大模型之前，获取会话内的最新n条记录和用户的消息拼接在一起，形成历史消息记录。
2. 拼接完历史消息之后把用户发送的消息保存到数据库。
3. 大模型回复完消息之后，将回复的消息保存到数据库。

```java
// 注入chatMemory
private final AiMessageChatMemory chatMemory;
// 传入chatMemory，会话id，查询最近n条历史消息
var messageChatMemoryAdvisor = new MessageChatMemoryAdvisor(chatMemory, input.getSessionId(), 10);
```

## 消息发送接口

通常来说发送消息给大模型只需要填写用户的消息就行，但是要支持历史会话需要获取历史消息。这个功能可以使用[MessageChatMemoryAdvisor](#aimessagechatmemory数据库消息记录)来实现。

```java
@RequestMapping("message")
@RestController
@AllArgsConstructor
@Slf4j
public class AiMessageController {
    private final AiMessageChatMemory chatMemory;
    private final DashScopeAiChatModel dashScopeAiChatModel;
    private final ObjectMapper objectMapper;
    private final AiMessageRepository messageRepository;

    /**
     * 消息保存
     * @param input 用户发送的消息/AI回复的消息
     */
    @PostMapping
    public void save(@RequestBody AiMessageInput input) {
        messageRepository.save(input.toEntity());
    }

    /**
     *
     * @param input 消息包含文本信息，会话id，多媒体信息（图片语言）。参考src/main/dto/AiMessage.dto
     * @return SSE流
     */
    @PostMapping(value = "chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> chatStreamWithHistory(@RequestBody AiMessageInput input) {
        // MessageChatMemoryAdvisor的三个参数解释。
        // 1. 如果需要存储会话和消息到数据库，自己可以实现ChatMemory接口，这里使用自己实现的AiMessageChatMemory，数据库存储。
        // 2. 传入会话id，MessageChatMemoryAdvisor会根据会话id去查找消息。
        // 3. 只需要携带最近10条消息
        var messageChatMemoryAdvisor = new MessageChatMemoryAdvisor(chatMemory, input.getSessionId(), 10);
        return ChatClient.create(dashScopeAiChatModel).prompt()
                .user(promptUserSpec -> {
                    // AiMessageInput转成Message
                    Message message = AiMessageChatMemory.toSpringAiMessage(input.toEntity());
                    if (message instanceof UserMessage userMessage &&
                            !CollectionUtils.isEmpty(userMessage.getMedia())) {
                        // 用户发送的图片/语言
                        Media[] medias = new Media[userMessage.getMedia().size()];
                        promptUserSpec.media(userMessage.getMedia().toArray(medias));
                    }
                    // 用户发送的文本
                    promptUserSpec.text(message.getContent());
                })
                // MessageChatMemoryAdvisor会在消息发送给大模型之前，从ChatMemory中获取会话的历史消息，然后一起发送给大模型。
                .advisors(messageChatMemoryAdvisor)
                .stream()
                .content()
                .map(chatResponse -> ServerSentEvent.builder(toJson(chatResponse))
                        // 和前端监听的事件相对应
                        .event("message")
                        .build());
    }
    @SneakyThrows
    public String toJson(ChatResponse response) {
        return objectMapper.writeValueAsString(response);
    }
}
```
