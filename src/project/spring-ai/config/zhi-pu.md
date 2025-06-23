---
order: 3
---
# 智谱清言接入

## 通用配置

请参考[通用配置](../config/base.md)

## 依赖配置

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-starter-model-zhipuai</artifactId>
</dependency>
```

## 密钥配置

[智谱清言 api-key申请](https://maas.aminer.cn/usercenter/apikeys)

```yml
spring:
  ai:
    # 智谱
    zhipuai:
      api-key: xxx
      chat:
        enabled: true
        options:
          model: GLM-4
```

## 使用

```java
private final ZhiPuAiChatModel zhiPuAiChatModel;
```

## 消息发送案例

请参考[消息发送](../basic/chat.md)
