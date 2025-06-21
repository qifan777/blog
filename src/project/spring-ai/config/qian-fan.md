---
order: 4
---
# 千帆（文言一心）接入

## 通用配置

请参考[通用配置](../config/base.md)

## 依赖配置

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-qianfan-spring-boot-starter</artifactId>
</dependency>
```

## 密钥配置

[千帆 API Key和Secret Key申请](https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application)

```yml
spring:
  ai:
    # 百度千帆
    qian-fan:
      api-key: xxx
      secret-key: xxx
```

## 使用

```java
private final QianFanChatModel qianFanChatModel;
```

## 消息发送案例

请参考[消息发送](../basic/chat.md)
