---
category:
  - ChatGPT
tag:
  - Vue3
  - Stream请求
  - Websocket
  - Stomp
  - Proxy
date: 2023-06-22
timeline: true
---
# 第八期 Stream 请求 ChatGPT/WebSocket 推送响应

## 本期内容

1. 使用 Websocket Stomp 协议配合`@MessageMapping`和`@Payload` 开放消息接口，和接收 JSON 请求体。
2. 实现私有订阅，服务器将请求的结果响应给对应的用户，而不是广播给所有用户。
3. 使用 Proxy 将请求转发给 OpenAI。
4. 对代码进行逻辑分层，让代码更清晰。

## 代码实现

### 1. WebsocketController 接收消息

与 MVC 中的 Controller 不同，这边不能使用`@RestController`需要用`@Controller`。`@AllArgsConstructor`是 lombok 提供的一个为类中的属性生成构成器的注解。这样我们可以方便的使用 Spring 推荐的构造器依赖注入。

`@MessageMapping`类似于`@RequestMapping`用来标识消息路由。它不仅可以加在方法上，也可以加载类上。加在类上那就表名类中的所有消息路由都会拼接上这个路径。

在被`@MessageMapping`标识的方法中（如下的 chat 方法），可以使用`@Payload`解析 JSON 格式的消息体和`@RequestBody`一样。同时也可以配合`@Valid`或者`@Validated`做参数校验。

chat()方法的第二个参数接收了`Principle`。它代表着在 websocket 的 handshake 阶段获取到的用户信息。可以参考`io.qifan.chatgpt.assistant.infrastructure.websocket.UserHandshakeHandler#determineUser`这个方法。

```java

@Controller
@AllArgsConstructor
@Slf4j
public class WebsocketChatMessageController {
    private final ChatMessageService chatMessageService;

    @MessageMapping("/chatMessage/send")
    public void chat(@Payload ChatMessageCreateRequest requestMessage, Principal principal) {
        chatMessageService.sendMessage(requestMessage, principal);
    }
}
```

> 此外，在被`@MessageMapping`标识的方法中还可以接收
>
> 1. `@Headers`或者`@Header`获取 Stomp 协议中的消息头，和 http 协议中的请求头类似。
> 2. `@DestinationVariable`获取`@MessageMapping("/chat/{id}")`的 id 变量。和`@PathVariable`一样
> 3. 接受完整的`Message`对象，其中包含消息头和消息体消息目标路由等。
>
> 详细可以参考[Spring WebSocket](https://docs.spring.io/spring-framework/reference/web/websocket/stomp/handle-annotations.html)

### 2 发送消息

发送消息的逻辑包含下面四个步骤。

1. GPT 配置校验
2. 创建 OpenAIService 用于调用 OpenAI 接口。
3. 构造请求参数，将用户发送的内容以及用户的 GPT 配置填充到请求中。
4. 发送请求并将响应的结果通过私有订阅地址推送给响应的用户。

#### 2.1 GPT 配置校验

在正式调用 OpenAI 的 GPT 接口之前，需要做一些基础配置的校验。只有这些基础数据校验通过后才能保障后面的代码正常运行。如果不存在 API Key 则无法调用 OpenAI 的 GPT 接口。

```java

@Service
@AllArgsConstructor
@Slf4j
public class SendMessageService {
    private final MongoTemplate mongoTemplate;

    /**
     * 校验用户是否存在GPT配置以及GPT配置中是否已经配置了API Key
     *
     * @param principal 握手阶段得到的用户信息
     * @return 该用户的GPT配置
     */
    public ChatConfig checkConfig(Principal principal) {
        log.info("GPT配置校验，当前用户：{}", principal);
        ChatConfig chatConfig = Optional.ofNullable(mongoTemplate.findOne(Query.query(Criteria.where("createdBy.id")
                                                                                              .is(principal.getName())),
                                                                          ChatConfig.class))
                                        .orElseThrow(() -> new BusinessException(ResultCode.NotFindError,
                                                                                 "请配置API Key"));
        if (!StringUtils.hasText(chatConfig.getApiKey())) {
            throw new BusinessException(ResultCode.ValidateError, "请配置API Key");
        }
        log.info("GPT配置校验通过，配置内容：{}", chatConfig);
        return chatConfig;
    }
}
```

#### 2.2 创建 OpenAIService

配置 proxy，通过 proxy 转发给 OpenAI。先定义 Property 配置类，spring boot 会自动读取 application.yml 中的配置信息到配置类中。在代码中注入该配置类就可以获取到 yml 中的配置信息了。

```java
@ConfigurationProperties(prefix = "gpt")
@Component
@Data
public class GPTProperty {
    Proxy proxy;

    @Data
    public static class Proxy {
        private String host;
        private Integer port;
    }
}
```

```yaml
# 下面是我的代理信息，你们可以根据自己的实际情况更换host和port
gpt:
  proxy:
    host: localhost
    port: 7890
```

引入封装好的OpenAI API。

```xml

<dependency>
    <groupId>com.theokanning.openai-gpt3-java</groupId>
    <artifactId>service</artifactId>
    <version>0.12.0</version>
</dependency>
```

下面开始创建 OpenAIService，用于发送请求。在创建 OpenAIService 时我们配置了它底层的代理，API Key 以及 Jackson 序列化和反序列化。

```java
@Service
@AllArgsConstructor
@Slf4j
public class SendMessageService {
    private final MongoTemplate mongoTemplate;
    private final GPTProperty gptProperty;

    public ChatConfig checkConfig(Principal principal) {
        //...
    }

    /**
     * @param chatConfig 用户的GPT配置
     * @return OpenAIService用于调用OpenAI接口
     */
    public OpenAiService createOpenAIService(ChatConfig chatConfig) {
        log.info("开始创建OpenAIService");
        ObjectMapper mapper = defaultObjectMapper();
        Proxy proxy = new Proxy(Proxy.Type.HTTP,
                                new InetSocketAddress(gptProperty.getProxy().getHost(),
                                                      gptProperty.getProxy().getPort()));
        OkHttpClient client = defaultClient(chatConfig.getApiKey(), Duration.ofMinutes(1))
                .newBuilder()
                .proxy(proxy)
                .build();
        Retrofit retrofit = defaultRetrofit(client, mapper);
        OpenAiApi api = retrofit.create(OpenAiApi.class);
        return new OpenAiService(api);
    }
}
```

#### 2.3 构造 ChatGPT 请求

构造的 ChatGPT 请求参数需要包含用户的历史发送消息和 GPT 的历史回复消息，这样它才能记住你们之前的对话内容。所以可以看见我开始的时候根据聊天会话查询该会话内的聊天记录，然后将最新的消息插入到历史消息的尾部。还需要填写要使用的 GPT 模型，默认是 3.5。还有随机性，话题新鲜度，最大回复数。最后我们选择了请求方式是 stream，这样可以一个个字的得到 ChatGPT 的响应，而不是长时间的等待最后得到一个结果。

```java
@Service
@AllArgsConstructor
@Slf4j
public class SendMessageService {
    private final MongoTemplate mongoTemplate;
    private final GPTProperty gptProperty;

    public ChatConfig checkConfig(Principal principal) {
        //...
    }


    public OpenAiService createOpenAIService(ChatConfig chatConfig) {
        //...
    }

    /**
     * 构造ChatGPT请求参数
     *
     * @param chatMessage 用户的发送内容
     * @param chatConfig  用户的GPT配置信息
     * @return 返回包含用户发送内容+配置信息的ChatGPT请求参数。
     */
    public ChatCompletionRequest createChatRequest(ChatMessage chatMessage, ChatConfig chatConfig) {
        List<ChatMessage> chatMessageList = mongoTemplate.find(Query.query(Criteria.where("session.id")
                                                                                   .is(chatMessage.getSession()
                                                                                                  .getId())),
                                                               ChatMessage.class);

        chatMessageList.add(chatMessage);
        ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
                                                                           .messages(chatMessageList.stream()
                                                                                                    .map(chatMessageMapper::entityToMessage)
                                                                                                    .collect(
                                                                                                            Collectors.toList()))
                                                                           .model(chatConfig.getModel().getName())
                                                                           .presencePenalty(
                                                                                   chatConfig.getPresencePenalty())
                                                                           .temperature(chatConfig.getTemperature())
                                                                           .maxTokens(chatConfig.getMaxTokens())
                                                                           .stream(true)
                                                                           .build();


        log.info("请求体：{}", chatCompletionRequest);
        return chatCompletionRequest;
    }
}
```

还需要在 ChatMessageMapper 中添加我们的 ChatMessage 实体类和第三方包中的 ChatMessage 映射，这样我们可以方便的构造请求参数。

```java
public interface ChatMessageMapper {
    // ...
    com.theokanning.openai.completion.chat.ChatMessage entityToMessage(ChatMessage entity);
}
```

#### 2.4 发送请求和推送消息

在`io.qifan.chatgpt.assistant.gpt.session.ChatSession.Statistic`新增 plusChat 和 plusToken 方法。方便统计用户调用 GPT 接口时的消耗情况。

```java
public static class Statistic {
    private Integer charCount;
    private Integer tokenCount;

    public Statistic plusChar(Integer charCount) {
        this.charCount += charCount;
        return this;
    }

    public Statistic plusToken(Integer tokenCount) {
        this.tokenCount += tokenCount;
        return this;
    }
}
```

先获取已有的统计数量，在上面累加本次用户发送消息的长度。新建一个 ChatGPT 回答消息对象`responseMessage`用于记录回答的消息。由于本次的请求是 stream 类型，所以每次响应是一个 Token（一个单词或者一个中文字）的，这边就需要阻塞一个按顺序调用`convertAndSendToUser`推送给前端。回答完毕后将用户发送的消息和 GPT 回答的消息都插入到数据库，并且更新会话消耗 Token 的统计数量。

```java
@Service
@AllArgsConstructor
@Slf4j
public class SendMessageService {
    private final MongoTemplate mongoTemplate;
    private final GPTProperty gptProperty;

    public ChatConfig checkConfig(Principal principal) {
        // ...
    }


    public OpenAiService createOpenAIService(ChatConfig chatConfig) {
        // ...
    }


    public ChatCompletionRequest createChatRequest(ChatMessage chatMessage, ChatConfig chatConfig) {
        // ...
    }

    /**
     * 向OpenAI发起ChatGPT请求，并将响应的结果推送给前端。
     * @param openAiService 封装好的OpenAI的服务，调用就可以发起请求。
     * @param chatCompletionRequest ChatGPT请求参数
     * @param chatMessage 用户发送的消息内容
     * @param chatSession 消息归属的会话
     * @param principal 当前用户信息
     */
    @SneakyThrows
    public void sendMessage(OpenAiService openAiService,
                            ChatCompletionRequest chatCompletionRequest,
                            ChatMessage chatMessage,
                            ChatSession chatSession,
                            Principal principal) {
        ChatSession.Statistic statistic = chatSession.getStatistic()
                                                     .plusChar(chatMessage.getContent().length())
                                                     .plusToken(chatMessage.getContent().length());

        ChatMessage responseMessage = new ChatMessage().setContent("")
                                                       .setRole("assistant")
                                                       .setSession(chatSession);
        openAiService.streamChatCompletion(chatCompletionRequest)
                     .doOnError(Throwable::printStackTrace)
                     .blockingForEach(chunk -> {
                         log.info(chunk.toString());
                         String text = chunk.getChoices().get(0).getMessage().getContent();
                         if (text == null) {
                             return;
                         }
                         statistic.plusToken(1)
                                  .plusChar(text.length());
                         messagingTemplate.convertAndSendToUser(principal.getName(),
                                                                "/queue/chatMessage/receive",
                                                                text);
                         responseMessage.setContent(responseMessage.getContent() + text);
                     });
        chatMessageRepository.save(chatMessage);
        chatMessageRepository.save(responseMessage);
        chatSessionRepository.save(chatSession);
    }

}
```

### 3. 组合各个步骤发送消息

依次按照配置校验，创建 OpenAIService，ChatGPT 请求参数，发送请求的顺序调用实现消息发送逻辑。

```java
@Slf4j
@Service
@Transactional
@AllArgsConstructor
public class ChatMessageService {
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatMessageMapper chatMessageMapper;
    private final SendMessageService sendMessageService;

    // ...

    public void sendMessage(ChatMessageCreateRequest requestMessage, Principal principal) {
        ChatSession chatSession = chatSessionRepository.findById(requestMessage.getSession().getId())
                                                       .orElseThrow(() -> new BusinessException(ResultCode.NotFindError));
        ChatMessage chatMessage = chatMessageMapper.createRequest2Entity(requestMessage);
        ChatConfig chatConfig = sendMessageService.checkConfig(principal);
        OpenAiService openAIService = sendMessageService.createOpenAIService(chatConfig);
        ChatCompletionRequest chatRequest = sendMessageService.createChatRequest(chatMessage, chatConfig);
        sendMessageService.sendMessage(openAIService, chatRequest, chatMessage, chatSession, principal);
    }
}
```

## 代码测试

### 创建会话

调用创建聊天会话接口，得到会话 id。

```
POST http://localhost:8080/chatSession/create
Content-Type: application/json

{}
```

复制你调用后得到的 result。

```json
{
  "code": 1,
  "msg": "操作成功",
  //   会话id
  "result": "6495a20647fbac571764c984",
  "success": true
}
```

### 发送消息

安装 stompjs 和 websocket。stompjs 是在 websocket 建立的连接上用特定的协议去通信。也就是说单单安装 stompjs 无法使用，需要有 websocket 的连接才能使用。

```shell
npm install @stomp/stompjs ws
```

`HomeView.vue`中编写如下的测试代码，先是向后端发起 websocket 连接，如果握手成功则订阅`/user/queue/chatMessage/receive`。

```html

<script lang="ts" setup>
    import {Client} from "@stomp/stompjs";
    import {ref} from "vue";

    const result = ref("");
    const prompt = ref("");
    const client = new Client({
        brokerURL: "ws://localhost:8080/handshake",
        onConnect: () => {
            client.subscribe(
                    "/user/queue/chatMessage/receive",
                    (message) => (result.value += message.body)
            );
        },
    });
    client.activate();
    const handleSend = () => {
        client.publish({
            destination: "/socket/chatMessage/send",
            body: JSON.stringify({
                session: {id: "6495a20647fbac571764c984"},
                content: prompt.value,
                role: "user",
            }),
        });
        result.value = "";
        prompt.value = "";
    };
</script>
<template>
    <div>
        <el-form>
            <el-form-item label="结果">
                <el-input v-model="result" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="提问">
                <el-input v-model="prompt"></el-input>
            </el-form-item>
            <el-button type="primary" @click="handleSend">发送</el-button>
        </el-form>
    </div>
</template>
```

要注意，后端推送的订阅地址是`/queue/chatMessage/receive`，而用户的订阅地址是`/user/queue/chatMessage/receive`。但是为什么依然可以推送给对应的用户呢？

可以这么理解，当用户发送订阅消息`/user/queue/chatMessage/receive`时，其中的`/user`被替换成了用户 id 如：`/queue/chatMessage/receive-1234`。然后在服务端推送消息时，使用的是`convertAndSendToUser`推送给这个订阅地址`/queue/chatMessage/receive`，实际上会推送给`/queue/chatMessage/receive-1234`。这样推送和订阅的最终地址都达到了一致，并且这个地址是用户私有的。

那为什么`/user`可以被替换成用户 id 呢？因为我们之前在 `io.qifan.chatgpt.assistant.infrastructure.websocket.WebSocketConfig#configureMessageBroker`里面配置了`.setUserDestinationPrefix("/user")`。这行配置就是告诉 SpringWebSocket 遇到 `/user`开头的订阅地址要替换成用户 id，变成改用户的私有订阅地址。
