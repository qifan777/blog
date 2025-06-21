---
order: 5
---
# Kimi接入

## 通用配置

请参考[通用配置](../config/base.md)

## 依赖配置

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-moonshot-spring-boot-starter</artifactId>
</dependency>
```

## 密钥配置

[kimi api-key申请](https://platform.moonshot.cn/console/api-keys)

```yml
spring:
  ai:
    # kimi
    moonshot:
      api-key: xxx
```

## 使用

```java
private final MoonshotChatModel moonshotChatModel;
```

## 消息发送案例

请参考[消息发送](../basic/chat.md)
