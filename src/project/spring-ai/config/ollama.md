---
order: 4
---
# Ollama本地部署

## 通用配置

请参考[通用配置](../config/base.md)

## 依赖配置

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-starter-model-ollama</artifactId>
</dependency>
```

## 密钥配置


```yml
spring:
  ai:
    ollama:
      # 填写模型所在的地址
      base-url: http://localhost:11434
      chat:
        model: xxx
```

## 使用

```java
private final OllamaChatModel chatModel;
```

## 消息发送案例

请参考[消息发送](../basic/chat.md)
