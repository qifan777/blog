---
category:
  - 起凡商城
tag:
  - 认证

order: 2
date: 2024-01-09
timeline: true
---
# 手机号密码认证

## 后端

### 定义接口和模型

考虑到需要多种认证方式，定义认证接口，同一返回[`SaTokenInfo`](https://sa-token.cc/)。

#### 认证模型

```java
public interface AuthModel {

}  
```

#### 认证接口

```java
public interface IAuthStrategy {

  String PASSWORD = "password";
  String WECHAT = "wechat";

  SaTokenInfo auth(AuthModel authModel);
}
```

### 手机号密码认证实现

#### 模型实现

```java
@Data
public class PhonePasswordAuth implements AuthModel {

  private String phone;
  private String password;
}
```

#### 接口实现

在模型实现中需要将抽象的模型转换成具体的模型。即将[`AuthModel`](#认证模型)转成[`PhonePasswordAuth`](#模型实现)。

```java
@Service(IAuthStrategy.PASSWORD)
@AllArgsConstructor
public class PasswordAuthStrategyImpl implements IAuthStrategy {

  private final JSqlClient jSqlClient;


  @Override
  public SaTokenInfo auth(AuthModel authModel) {
    PhonePasswordAuth phonePasswordAuth = (PhonePasswordAuth) authModel;
    UserTable userTable = UserTable.$;
    // 从数据库去根据手机号找到相应的用户
    User databaseUser = jSqlClient.createQuery(userTable)
        .where(userTable.phone().eq(phonePasswordAuth.getPhone()))
        .select(userTable.fetch(UserFetcher.$.allScalarFields()))
        .fetchOptional()
        .orElseThrow(() -> new BusinessException(AuthErrorCode.USER_LOGIN_NOT_EXIST));

    // 将请求用户的密码与数据库密码进行比对
    // BCrypt
    if (!BCrypt.checkpw(phonePasswordAuth.getPassword(), databaseUser.password())) {
      throw new BusinessException(AuthErrorCode.USER_LOGIN_PASSWORD_ERROR);
    }
    // 生成token记录
    StpUtil.login(databaseUser.id(), LoginDevice.BROWSER);

    return StpUtil.getTokenInfo();
  }
}
```

:::tip
`@Service(IAuthStrategy.PASSWORD)`定义策略的名称。
在注入的时候`private final Map<String, IAuthStrategy> authStrategyMap;`其中键就是策略名称，值是策略bean实例。
:::

### 定义API

```java
@RestController
@RequestMapping("auth")
@AllArgsConstructor
public class AuthController {
  // 注入多种认证策略
  private final Map<String, IAuthStrategy> authStrategyMap;

  @PostMapping("phone-password")
  public SaTokenInfo authByPhonePassword(@RequestBody PhonePasswordAuth phonePasswordAuth) {
    // 获取到手机号密码认证策略
    return authStrategyMap.get(IAuthStrategy.PASSWORD).auth(phonePasswordAuth);
  }
}
```

## 前端

### 登录界面

```vue
<script lang="ts" setup>
import {
  ElAvatar,
  ElButton,
  ElCard,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElRow,
  type FormInstance,
  type FormRules
} from 'element-plus'
import { onMounted, reactive, ref, Transition } from 'vue'
import logo from '@/assets/logo.jpg'
import router from '@/router'
import background from '@/assets/background.jpg'
import { api } from '@/utils/api-instance'
import type { PhonePasswordAuth } from '@/apis/__generated/model/static'
import { assertSuccess } from '@/utils/common'
import { useHomeStore } from '@/stores/home-store'

const loginForm = reactive<PhonePasswordAuth>({ phone: '', password: '' })
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<typeof loginForm>>({
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { max: 16, min: 6, message: '密码长度介于6，16' }
  ]
})
const showPanel = ref(false)
onMounted(() => {
  setTimeout(() => {
    showPanel.value = true
  }, 1000)
})
const handleLogin = () => {
  api.authController.authByPhonePassword({ body: loginForm }).then((res) => {
    assertSuccess(res).then(async () => {
      await useHomeStore().init()
      router.replace({ path: '/' })
    })
  })
}
</script>
<template>
  <div>
    <img alt="背景图片" class="background" :src="background" />
    <el-row class="panel-wrapper" justify="center" align="middle">
      <el-col :xs="18" :sm="16" :md="14" :lg="10" :xl="10">
        <transition name="el-zoom-in-top">
          <el-card class="panel" v-if="showPanel">
            <div class="content">
              <div class="panel-left">
                <el-avatar alt="logo" :size="30" shape="square" :src="logo"></el-avatar>
                <div class="title">会员后台管理系统</div>
                <div class="description">积分，优惠券,VIP等营销功能</div>
              </div>
              <div class="panel-right">
                <div class="title">快速开始</div>
                <div class="description">登录你的账号</div>
                <el-form
                  ref="ruleFormRef"
                  :model="loginForm"
                  :rules="rules"
                  class="form"
                  label-position="top"
                  label-width="100px"
                >
                  <el-form-item label="手机号">
                    <el-input v-model="loginForm.phone"></el-input>
                  </el-form-item>
                  <el-form-item label="密码">
                    <el-input v-model="loginForm.password" type="password"></el-input>
                  </el-form-item>
                </el-form>
                <div class="button-wrapper">
                  <el-button class="login" type="primary" @click="handleLogin"> 登录 </el-button>
                  <el-button
                    class="register"
                    type="info"
                    size="small"
                    link
                    @click="() => router.push('/register')"
                  >
                    注册
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
.background {
  position: fixed;
  height: 100vh;
  width: 100vw;
  object-fit: cover;
  z-index: -10;
}

.panel-wrapper {
  height: 100vh;

  .panel {
    .content {
      display: flex;
      align-items: stretch;
      height: 50vh;

      .title {
        font-size: var(--el-font-size-extra-large);
        margin-top: 16px;
        font-weight: bold;
      }

      .description {
        margin-top: 20px;
        font-size: var(--el-font-size-base);
        color: var(--el-text-col);
      }

      .panel-left {
        box-sizing: border-box;
        padding: 30px;
        background-color: rgb(243, 245, 249);
        width: 50%;
        border-radius: 5px;
      }

      .panel-right {
        padding: 30px;
        width: 50%;

        .form {
          margin-top: 30px;
        }

        .button-wrapper {
          margin-top: 40px;
          display: flex;
          justify-content: center;
          position: relative;

          .login {
            width: 120px;
          }

          .register {
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }
      }
    }
  }
}
</style>

```

### 重定向登录

```ts
request.interceptors.response.use(
  (res) => {
    return res.data.result
  },
  ({ response }) => {
    if (response.data.code !== 1) {
      ElMessage.warning({ message: response.data.msg })
    }
    if (response.data.code === 1001007 || response.data.code === 1001008) {
      router.push('/login')
    }
    return Promise.reject(response.data.result)
  }
)

```
