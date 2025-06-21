---
category:
  - 起凡商城
tag:
  - 微信小程序
  - 认证

order: 4
date: 2024-01-09
timeline: true
---

# 微信小程序认证

## 小程序认证模型

请参考[手机号密码认证](./phone-password-auth.md/#模型实现)

```java
@Data
public class WeChatAuth implements AuthModel {
    private String loginCode;
}
```

## 小程序认证策略

```java
@Service(IAuthStrategy.WECHAT)
@Slf4j
@AllArgsConstructor
public class WechatAuthStrategyImpl implements IAuthStrategy {
  // 微信小程序工具包
  private final WxMaService wxMaService;
  private final JSqlClient jSqlClient;

  @SneakyThrows
  @Override
  public SaTokenInfo auth(AuthModel authModel) {
    WeChatAuth weChatAuth = (WeChatAuth) authModel;
    // 能解析出openId就已经代表认证成功
    WxMaJscode2SessionResult session = wxMaService.getUserService()
        .getSessionInfo(weChatAuth.getLoginCode());
    String openid = session.getOpenid();
    UserWeChatTable t = UserWeChatTable.$;
    UserWeChat userWechat = jSqlClient.createQuery(t)
        .where(t.openId().eq(openid))
        .select(t)
        .fetchOptional()
        .orElseThrow(
            () -> new BusinessException(AuthErrorCode.USER_PERMISSION_UNAUTHENTICATED, "请绑定手机号"));
    // 登录的设备是微信
    StpUtil.login(userWechat.user().id(), LoginDevice.MP_WECHAT);
    return StpUtil.getTokenInfo();
  }
}
```

:::info
[WxMaService](https://github.com/Wechat-Group/WxJava/tree/develop/spring-boot-starters/wx-java-mp-spring-boot-starter)这个包中实现了小程序的服务端API，并且提供了starter只需配置好APPID和SECRET即可使用。
:::

## 定义API

在`AuthController`中新增微信小程序认证方式。

```java
  @PostMapping("wechat")
  public SaTokenInfo authByWecChat(@RequestBody WeChatAuth weChatAuth) {
    return authStrategyMap.get(IAuthStrategy.WECHAT).auth(weChatAuth);
  }
```

## 配置小程序

```yaml
wx:
  miniapp:
    appid: appid #你的小程序appid
    secret: secret #你的小程序secret
    config-storage:
      http-client-type: HttpClient
      type: redistemplate
```

## 自动续签

在application.yml中新增sa-token配置

```yaml
  # 自动续签
  auto-renew: true
```

## 小程序端

### 小程序登录

在`src/pages/index/index.vue`调用登录接口。

```ts
<script setup lang="ts">
import Taro from "@tarojs/taro";
import { api } from "@/utils/api-instance";
import { useHomeStore } from "@/stores/home-store";
import RegisterPopup from "@/components/register-popup/register-popup.vue";

const homeStore = useHomeStore();
Taro.useLoad(() => {
  Taro.login({
    success: function (loginRes) {
      // 调用微信登录接口
      api.authController
        .authByWecChat({
          body: {
            loginCode: loginRes.code,
          },
        })
        .then((res) => {
          // 存储token，下次发起请求时携带
          Taro.setStorageSync("token", res.tokenValue);
          homeStore.getUserInfo();
        });
    },
  });
});
</script>

<template>
  <register-popup></register-popup>
</template>

<style scoped lang="scss"></style>

```
