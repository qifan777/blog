---
order: 7
---
# Agent（智能体）

agent实际上也是一种`Function call`但是它内部还包含了一些`Function call`也就是`tool`。在`Function Call`中可以编写数据库查询，或者调用其他接口。也就是AI的记忆部分了。

## 前端实现

在前端的参数面板增加一个启用agent的按钮，点击后后端会把所有的agent加入`function call`中。

### agent开关按钮

```html
<el-form-item label="agent（智能体）">
    <el-switch v-model="options.enableAgent"></el-switch>
</el-form-item>
```

新增`enableAgent`记录是否启用agent

```ts
const options = ref<AiMessageParams>({
  enableVectorStore: false,
  enableAgent: false
})
```

## 后端实现

### @Agent注解

在类上添加注解`@Agent`标识当前的类是一个`agent`。被`@Agent`标记的类意味着也被`@Component`标记了，也就是说它会注册为一个`Bean`。

```java
@Component
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Agent {
}

```

可以从`ApplicationContext`中获取被`@Agent`标记的`Bean`。

```java
// 获取带有Agent注解的bean
Map<String, Object> beansWithAnnotation = applicationContext.getBeansWithAnnotation(Agent.class);
```

### 抽象Agent

有一些比较通用的方法可以抽取到抽象父类里面

1. 要实现`Function`接口
2. 都要创建一个`ChatClient`
3. 获取内嵌的`Function`列表

```java
@Slf4j
public abstract class AbstractAgent<Req, Resp> implements Function<Req, Resp> {
    private final ChatClient client;

    /**
     * 构建ChatClient方便子类使用
     *
     * @param chatModel 聊天模型
     */
    public AbstractAgent(ChatModel chatModel) {
        this.client = ChatClient
                .builder(chatModel)
                .defaultFunctions(getFunctions())
                .build();

    }

    public ChatClient getChatClient() {
        return client;
    }

    /**
     * 获取内嵌的Function Call也就是Agent的Tools
     *
     * @return Function Call名称列表
     */
    public String[] getFunctions() {
        List<Class<?>> classList = Arrays.stream(this.getClass().getClasses()).filter(aClass -> aClass.isAnnotationPresent(Description.class)).toList();
        String[] names = new String[classList.size()];
        classList.stream().map(aClass -> StringUtils.uncapitalize(this.getClass().getSimpleName()) + "." + aClass.getSimpleName()).toList().toArray(names);
        return names;
    }
}
```

### 例子 电脑助手Agent

1. 首先需要继承`AbstractAgent`，实现`Function`接口要填写两个泛型`Req`和`Resp`, 也就是当前`Agent`的入参类型和返类型。
下面这个例子的入参是`ComputerAssistant.Request`，返回类型是`String`。
2. 实现`apply`方法，调用父类的`getChatClient`它会自动将当前`Agent`中的`Function`加入到`Function Call`中，也就是将`DirectoryReader`和`CpuAnalyzer`自动添加。参考[父类](#抽象agent)的构造函数中的`.defaultFunctions(getFunctions())`
3. 使用`@Agent`标识，这样才会注册到容器中，并且被启用。
4. 使用`@Description`描述`Agent`的作用，这样可以在多个`Agent`中根据意图选择相应的`Agent`。

```java
@Agent
@Description("提供关于当前主机的cpu，文件，文件夹相关问题的有用回答")
public class ComputerAssistant extends AbstractAgent<ComputerAssistant.Request, String> {


    protected ComputerAssistant(ChatModel chatModel) {
        super(chatModel);
    }

    @Override
    public String apply(Request request) {
        return getChatClient()
                .prompt()
                .user(request.query())
                .call()
                .content();
    }

    public record Request(
            @JsonProperty(required = true) @JsonPropertyDescription(value = "用户原始的提问") String query) {
    }

    @Component
    @Description("读取用户给定的文件夹，列出文件夹下的所有文件")
    public static class DirectoryReader implements Function<DirectoryReader.Request, String> {
        @Override
        public String apply(Request request) {
            File f = new File(request.path);
            List<String> out = new ArrayList<>();
            if (f.exists()) {
                String[] list = f.list();
                if (list != null) {
                    out = Arrays.asList(list);
                }
            }
            return String.join(",", out);
        }

        public record Request(
                @JsonProperty(required = true) @JsonPropertyDescription("本机文件夹的绝对路径") String path
        ) {
        }
    }

    @Component
    @Description("读取CPU的数量")
    public static class CpuAnalyzer implements Function<CpuAnalyzer.Request, Integer> {
        @Override
        public Integer apply(Request request) {
            return Runtime.getRuntime().availableProcessors();
        }

        public record Request() {
        }
    }
}
```

### 扫描Agent并启用

当用户传入提问之后，大模型会从已有的`Agent`（被`@Agent`标注的类）中选择一个执行，如果没有匹配到大模型会自己回答。

```java
    @PostMapping(value = "chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> chat(@RequestBody AiMessageWrapper input) {
        String[] functionBeanNames = new String[0];
        // 如果启用Agent则获取Agent的bean
        if (input.getParams().getEnableAgent()) {
            // 获取带有Agent注解的bean
            Map<String, Object> beansWithAnnotation = applicationContext.getBeansWithAnnotation(Agent.class);
            functionBeanNames = new String[beansWithAnnotation.keySet().size()];
            functionBeanNames = beansWithAnnotation.keySet().toArray(functionBeanNames);
        }
        return ChatClient.create(chatModel).prompt()
                .user(promptUserSpec -> toPrompt(promptUserSpec, input.getMessage()))
                // agent列表
                .functions(functionBeanNames)
                // 忽略...
                .stream()
                .chatResponse()
                .map(chatResponse -> ServerSentEvent.builder(toJson(chatResponse))
                        // 和前端监听的事件相对应
                        .event("message")
                        .build());
    }
```
