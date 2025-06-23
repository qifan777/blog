---
order: 2
---
# 灵积（通义千问）接入

## 通用配置

请参考[通用配置](../config/base.md)

## 依赖配置

```xml
<dependency>
    <groupId>com.alibaba.cloud.ai</groupId>
    <artifactId>spring-ai-alibaba-starter-dashscope</artifactId>
    <version>${spring-ai-alibaba.version}</version>
</dependency>
```

## 密钥配置

[灵积 api-key申请](https://dashscope.console.aliyun.com/apiKey)

```yml
spring:
  ai:
    # 阿里灵积
    dash-scope:
      api-key: xxx
      chat:
        options:
          model: qwen-max
```

## 使用

```java
private final ChatModel chatModel;
```

## 消息发送案例

请参考[消息发送](../basic/chat.md)
