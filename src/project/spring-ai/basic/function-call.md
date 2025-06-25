---
order: 7
---
# FunctionCall

本节的内容是：编写文档解析函数来学习`SpringAi`风格的`Function Call`

我们知道 AI 的能力是文本生成，但是遇到一些复杂的需求时如何让 ai 可以回答出用户的提问。比如我想让 ai 读取本地的某个文件然后回答文件里面的内容，那读取文件这个操作 ai 明显不会。因此我们可以编写函数来拓展 ai 的能力。

## 结构描述

下面是一个简单的函数描述，把我们代码里面已有的函数转化成这种格式的描述。这样 ai 就可以知道什么时候去调用函数，以及调用函数时需要填哪些参数。

更加详细的结构请参考[JSON Scheme reference](https://json-schema.org/understanding-json-schema/)

```json
{
  "type": "function",
  "function": {
    "name": "documentAnalyzerFunction",
    "description": "文档解析函数",
    "parameters": {
      "properties": {
        "path": {
          "type": "string",
          "description": "需要解析的文档路径"
        },
      },
      "required":["path"],
      "type": "object"
    }
  }
}
```

## 编写函数

引入依赖，用于读取本地的文档

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-tika-document-reader</artifactId>
</dependency>
```

编写函数的步骤

1. 定义函数的入参和返回结果
2. 实现`java.util.function.Function`表示它的一个可以被AI调用的函数
3. 描述函数，SpringAi会自动将下面的Java注解转换成[function call](#function-call)格式的描述
    - `function.name`：`@Service`将该类注册为 spring bean，bean的名字会作为函数的名称。
    - `function.description`: `@Description`可以描述函数的用途
    - `function.parameters.properties.xxx`:  `@JsonProperty`描述参数的属性名称
    - `function.parameters.required`: `@JsonProperty`是否必填
    - `function.parameters.properties.xxx.description`: `@JsonPropertyDescription`描述参数的作用
    - `function.parameters.properties.xxx.type`: String类型会自动生成[JSON Scheme reference](https://json-schema.org/understanding-json-schema/reference/type)下的`string`类型，其他的`Integer`,`List`等类型也一样。

```java
/**
 * 通过@Description描述函数的用途，这样ai在多个函数中可以根据描述进行选择。
 */
@Description("文档解析函数")
@Service
@Slf4j
public class DocumentAnalyzerFunction implements Function<DocumentAnalyzerFunction.Request, DocumentAnalyzerFunction.Response> {
    /**
     * 通过@JsonProperty声明属性名称和是否必填
     * 通过@JsonPropertyDescription描述属性的用途，这样ai可以提取出符合参数描述的内容。
     */
    @Data
    public static class Request {
        @JsonProperty(required = true, value = "path")
        @JsonPropertyDescription(value = "需要解析的文档路径")
        String path;
    }

    public record Response(String result) {
    }

    @SneakyThrows
    @Override
    public Response apply(Request request) {
        // ai解析用户的提问得到path参数，使用tika读取本地文件获取内容。把读取到的内容再返回给ai作为上下文去回答用户的问题。
        TikaDocumentReader tikaDocumentReader = new TikaDocumentReader(new FileSystemResource(request.path));
        return new Response(tikaDocumentReader.read().get(0).getContent());
    }


}

```

## 使用函数

在实际的开发中可以接收多个函数，通过`toolNames`参数传入。然后ai会根据提问从这些函数中选择一个执行。

```java
    private final ChatModel chatModel;

    /**
     * 调用自定义函数回答用户的提问
     *
     * @param prompt       用户的提问
     * @param functionName 函数名称（bean的名称，类名小写）
     * @return SSE流式响应
     */
    @GetMapping(value = "chat/stream/function", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> chatStreamWithFunction(@RequestParam String prompt, @RequestParam String functionName) {
        return ChatClient.create(chatModel).prompt()
                .messages(new UserMessage(prompt))
                // spring ai会从已注册为bean的function中查找函数，将它添加到请求中。如果成功触发就会调用函数
                .toolNames(functionName)
                .stream()
                .chatResponse()
                .map(chatResponse -> ServerSentEvent.builder(toJson(chatResponse))
                        .event("message")
                        .build());
    }
```

请求调用实例：

```txt
GET http://localhost:9902/message/chat/stream/function?prompt=D:\简历.pdf，这份简历的亮点是什么？&functionName=documentAnalyzerFunction
```
