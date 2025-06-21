---
category:
  - 起凡商城
tag:
  - 微信小程序
  - 注册

order: 3
date: 2024-01-09
timeline: true
---
# 微信小程序注册

## 后端

### 创建UserWeChat表

user_id作为外键关联user表。每个微信用户在每个小程序中的open_id是唯一的，所以这里使用唯一索引。

```sql
-- auto-generated definition
create table user_we_chat
(
    id           varchar(36) not null
        primary key,
    created_time datetime(6) not null,
    edited_time  datetime(6) not null,
    open_id      varchar(30) not null,
    user_id      varchar(36) not null,
    constraint user_wechat_pk
        unique (open_id)
);
```

### 定义实体

使用插件生成实体类，请参考[开放流程](../start/develop.md)。并生成后端的增删改查。

```java
@Entity
@GenEntity
@Table(name = "user_wechat")
public interface UserWeChat extends BaseDateTime {

  @Id
  @GeneratedValue(generatorType = UUIDIdGenerator.class)
  String id();

  @Key
  @GenField(value = "openId", order = 0)
  String openId();

  @OneToOne
  User user();
}
```

在`User`实体类中新增关联关系。user和user_wechat表是一对一关系。

```java
  @Null
  @OneToOne(mappedBy = "user")
  UserWeChat wechat();
```

:::info
一对一关系配置请参考[@OneToOne](https://babyfish-ct.gitee.io/jimmer-doc/docs/mapping/base/association/one-to-one)
:::

### 定义模型

```java
@Data
public class UserWeChatRegisterInput {

  private String loginCode;
  private String phone;
  private String code;
}
```

### 注册API

```java
  @PostMapping("register")
  public SaTokenInfo register(@RequestBody @Validated UserWeChatRegisterInput registerInput) {
    return  userWeChatService.register(registerInput);
  }
```

### 注册逻辑实现

微信注册的流程如下：

1. 先查询微信用户表记录是否存在
2. 如果存在,则直接返回登录信息
3. 如果不存在,则说明该用户是第一次通过微信小程序使用起凡商城,则需要在微信用户表注册
4. 创建微信用户需要手机号用户和openId(微信小程序用户唯一标识)
5. 查询手机号用户是否存在(假设起凡商城还有app端,有些用户可能在app端可能注册过了)
6. 如果存在直接返回手机号用户信息创建微信用户
7. 如果不存在则说明用户是第一次使用起凡商城,则用手机号注册用户.
8. 创建微信用户,并关联手机号用户
9. 用手机号用户id登录.注意: 登录的id一定是user表id而不是第三方用户表user_wechat表的id.

```java

  @SneakyThrows
  public SaTokenInfo register(UserWeChatRegisterInput registerInput) {
    boolean checked = smsService.checkSms(registerInput.getPhone(), registerInput.getCode());
    if (!checked) {
      throw new BusinessException(ResultCode.ValidateError, "验证码错误");
    }
    UserWeChatTable t1 = UserWeChatTable.$;
    WxMaJscode2SessionResult session = wxMaService.getUserService()
        .getSessionInfo(registerInput.getLoginCode());
    String openid = session.getOpenid();

    UserWeChat userWeChat = userWeChatRepository.sql()
        .createQuery(t1)
        .where(t1.openId().eq(openid))
        .select(t1)
        .fetchOptional()
        // 如果用openId去查询微信用户表记录为空,则说明该用户从未在小程序登录过
        .orElseGet(() -> {
          UserTable t2 = UserTable.$;
          // 查询手机号对应的用户
          User user = userRepository.sql().createQuery(t2)
              .where(t2.phone().eq(registerInput.getPhone()))
              .select(t2)
              .fetchOptional()
              // 手机号查询的用户为空,则说明该用户从未使用过起凡商城
              .orElseGet(() -> {
                return userRepository.save(UserDraft.$.produce(draft -> {
                  draft.setNickname("微信用户")
                      // 此处密码无需加密,
                      .setPassword("123456")
                      .setPhone(registerInput.getPhone());
                }));
              });
          // 创建微信用户,将手机号对应的用户和微信的openId绑定.
          return userWeChatRepository.save(UserWeChatDraft.$.produce(draft -> {
            draft.setUser(user)
                .setOpenId(openid);
          }));
        });
    StpUtil.login(userWeChat.user().id(), LoginDevice.MP_WECHAT);
    return StpUtil.getTokenInfo();
  }
```

## 前端

### 发送短信API

```ts
import { request } from '@/utils/request'

export const sendSMS = (phone: string) => {
  return request<boolean>({ url: '/sms/send?phone=' + phone, method: 'post' })
}
```

### 用户信息Store

```ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "@/utils/api-instance";
import { UserDto } from "@/apis/__generated/model/dto";

export const useHomeStore = defineStore("home", () => {
  const userInfo = ref<UserDto["UserRepository/COMPLEX_FETCHER"]>({
    createdTime: "",
    editedTime: "",
    id: "",
    nickname: "",
    password: "",
    phone: "",
  });
  const registerShow = ref(false);
  const getUserInfo = async () => {
    userInfo.value = await api.userController.getUserInfo();
    return userInfo.value;
  };
  return { userInfo, registerShow, getUserInfo };
});
```

### 注册界面

```vue
<template>
  <nut-popup
    v-model:visible="registerShow"
    :style="{ padding: '30px 50px' }"
    position="bottom"
    pop-class="register-popup"
  >
    <div class="register-section">
      <view class="climb-icon">
        <image
          class="climb"
          mode="heightFix"
          src="../../assets/img/climb.png"
        ></image>
      </view>

      <view class="title-section">
        <view class="title">欢迎注册~</view>
        <view class="info">注册后可享受更好的服务体验</view>
      </view>
      <view class="register-input-section">
        <nut-input
          class="code-input"
          :border="false"
          :model-value="inputValue"
          @input="handleInput"
        >
          <template #right>
            <nut-button
              type="primary"
              size="small"
              @click="handleSendMessage"
              :disabled="registerInput.countDown > 0"
              >{{
                registerInput.countDown === 0
                  ? "获取验证码"
                  : registerInput.countDown
              }}</nut-button
            >
          </template>
        </nut-input>
        <div
          class="change-phone"
          v-if="registerInput.isSend"
          @click="changePhone"
        >
          修改手机号
        </div>
      </view>
      <view class="button-section">
        <button class="btn" @click="submit">
          <image
            class="icon"
            mode="heightFix"
            src="../../assets/icons/wechat.png"
          ></image>
          注册
        </button>
      </view>
    </div>
  </nut-popup>
</template>

<script lang="ts" setup>
import Taro from "@tarojs/taro";
import { useHomeStore } from "@/stores/home-store";
import { api } from "@/utils/api-instance";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { UserWeChatRegisterInput } from "@/apis/__generated/model/static";
import { sendSMS } from "@/apis/sms/sms-api";

const homeStore = useHomeStore();
const { registerShow } = storeToRefs(homeStore);
const registerInput = ref<
  UserWeChatRegisterInput & {
    isSend: boolean;
    countDown: number;
  }
>({
  code: "",
  loginCode: "",
  phone: "",
  isSend: false,
  countDown: 0,
});
const inputValue = computed({
  get: () => {
    if (registerInput.value.isSend) {
      return registerInput.value.code;
    } else {
      return registerInput.value.phone;
    }
  },
  set: (val) => {
    if (registerInput.value.isSend) {
      registerInput.value.code = val;
    } else {
      registerInput.value.phone = val;
    }
  },
});
const handleClose = () => {
  registerShow.value = false;
};
const handleInput = (e: { detail: { value: string } }) => {
  inputValue.value = e.detail.value;
};
const handleSendMessage = () => {
  let intervalId: NodeJS.Timeout;
  sendSMS(registerInput.value.phone).then((res) => {
    if (res) {
      registerInput.value.isSend = true;
      registerInput.value.countDown = 120;
      intervalId = setInterval(() => {
        if (registerInput.value.countDown === 0) {
          clearInterval(intervalId);
          return;
        }
        registerInput.value.countDown--;
      }, 1000);
    }
  });
};
const changePhone = () => {
  inputValue.value = registerInput.value.phone;
  registerInput.value.isSend = false;
  registerInput.value.countDown = 0;
};
const submit = () => {
  Taro.login({
    success: function (loginRes) {
      // 调用微信登录接口
      api.userWeChatController
        .register({
          body: {
            loginCode: loginRes.code,
            phone: registerInput.value.phone,
            code: registerInput.value.code,
          },
        })
        .then((res) => {
          Taro.setStorageSync("token", res.tokenValue);
          homeStore.getUserInfo();
          handleClose();
        });
    },
  });
};

defineExpose({
  submit,
  handleClose,
});
</script>

<style lang="scss">
page,
:root {
  .nut-popup {
    padding: 0 !important;
    overflow: unset;
  }
}

.register-section {
  height: 600px;
  background-color: white;
  width: 100%;

  .climb-icon {
    position: relative;
    width: 100%;

    .climb {
      position: absolute;
      height: 350px;
      right: 100px;
      top: -175px;
    }
  }

  .title-section {
    padding: 100px 0 20px 50px;

    .title {
      color: red;
      font-size: 55px;
      font-weight: bold;
      margin-bottom: 30px;
    }

    .info {
      color: #727272;
      font-size: 35px;
    }
  }
  .register-input-section {
    padding: 40px;
    .phone-input {
      border: 1px solid rgba(black, 0.1);
      border-radius: 80px;
      width: 600px;
      margin: auto;
    }
    .code-input {
      border: 1px solid rgba(black, 0.1);
      border-radius: 80px;
      width: 600px;
      margin: auto;
    }
    .change-phone {
      display: flex;
      justify-content: flex-end;
      margin-right: 60px;
      margin-top: 10px;
      color: rgba(black, 0.5);
      font-size: 26px;
    }
  }
  .button-section {
    width: 100%;
    display: flex;
    justify-content: center;

    .icon {
      height: 40px;
      margin-right: 20px;
    }

    .btn {
      background-color: rgb(0, 200, 0);
      margin: 0;
      color: white;
      width: 600px;
      height: 90px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 45px;
      font-size: 40px;
    }
  }
}
</style>
```

### 引入注册弹出组件

```vue
<template>
  <register-popup></register-popup>
</template>
```

### 重定向注册

```ts
import type { Method, Result } from "@/typings";
import Taro from "@tarojs/taro";
import { useHomeStore } from "@/stores/home-store";
const baseUrl = process.env.TARO_APP_API;

const requestWithToken = async <T>(
  url: string,
  method: Method,
  data: unknown,
  headers?: Record<string, unknown>,
): Promise<T> => {
  return await new Promise((resolve, reject) => {
    const token = Taro.getStorageSync("token");
    Taro.request({
      url: (baseUrl ?? "") + url,
      method,
      data,
      header: {
        token,
        ...headers,
      },
      dataType: "json",
      success: (response) => {
        const result = response.data as Result<T>;
        if (result.code !== 1) {
          Taro.showToast({
            title: result.msg,
            icon: "none",
          });
          reject(result);
        }
        if (result.code === 1001007 || result.code === 1001008) {
          useHomeStore().registerShow = true;
        } else {
          resolve(result.result);
        }
      },
      fail: (res: unknown) => {
        reject(res);
      },
    });
  });
};
export default requestWithToken;
```
