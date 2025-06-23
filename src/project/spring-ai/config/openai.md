---
order: 4
---
# OpenAI协议

## 通用配置

请参考[通用配置](../config/base.md)

## 依赖配置

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-starter-model-openai</artifactId>
</dependency>
```

## 密钥配置


```yml
spring:
  ai:
    openai:
      base-url: xxx
      api-key: ${OPENAI_API_KEY}
```

## 使用

```java
private final OpenAiChatModel chatModel;
```

## 消息发送案例

请参考[消息发送](../basic/chat.md)
