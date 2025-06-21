---
category:
  - 起凡商城
tag:
  - 注册

order: 1
date: 2024-01-09
timeline: true
---
# 手机号密码注册

## 后端

### 注册DTO

在`src/main/dto/io/qifan/mall/server/user/entity/User.dto`新增DTO用户接收手机号、密码、验证码。

```text
input UserRegisterInput{
    phone
    password
    code: String
}
```

### 定义API

`UserController`中新增register api

```java
  @GetMapping("user-info")
  public @FetchBy(value = "COMPLEX_FETCHER", ownerType = UserRepository.class) User getUserInfo() {
    return userService.getUserInfo();
  }
  @PostMapping("register")
  public SaTokenInfo register(@RequestBody @Validated UserRegisterInput registerInput) {
    return userService.register(registerInput);
  }
```

### 实现注册

```java
@Service
@Slf4j
@AllArgsConstructor
@Transactional
public class UserService {

  private final UserRepository userRepository;
  // 注入短信发送服务
  private final SmsService smsService;
  
  // 获取当前登录用户信息
  public User getUserInfo() {
    return userRepository.findById(StpUtil.getLoginIdAsString(), UserRepository.COMPLEX_FETCHER)
        .orElseThrow(() -> new BusinessException(ResultCode.NotFindError, "数据不存在"));
  }
  // 注册
  public SaTokenInfo register(UserRegisterInput registerInput) {
    // 校验手机号和验证码是否匹配
    boolean checked = smsService.checkSms(registerInput.getPhone(), registerInput.getCode());
    if (!checked) {
      throw new BusinessException(ResultCode.ValidateError, "验证码错误");
    }
    UserTable userTable = UserTable.$;
    userRepository.sql().createQuery(userTable)
        .where(userTable.phone().eq(registerInput.getPhone()))
        .select(userTable).fetchOptional()
        .ifPresent((user) -> {
          throw new BusinessException(ResultCode.StatusHasValid, "用户已经存在");
        });
     // 创建用户得到id，并生成token。
    StpUtil.login(userRepository.save(UserDraft.$.produce(registerInput.toEntity(), draft -> {
      draft.setNickname("默认用户").setPassword(BCrypt.hashpw(draft.password()));
    })).id(), LoginDevice.BROWSER);
    return StpUtil.getTokenInfo();
  }

}
```

:::tip

在jimmer中创建实体类需要通过“实体名称+Draft”类来创建。比如要创建User实体类，则需要通过UserDraft类创建。

因为UserRegisterInput类中包含了`phone`和`password`两个字段，`registerInput.toEntity()`得到的User实体对象中也就有了phone和password两个字段。

在此基础上继续填写了`nickname`字段并对password进行了加密处理。

```java
UserDraft.$.produce(registerInput.toEntity(), draft -> {
      draft.setNickname("默认用户").setPassword(BCrypt.hashpw(draft.password()));
    })
```

:::

## 前端

### 用户信息store

```ts
import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import type { UserDto } from '@/apis/__generated/model/dto'
import { api } from '@/utils/api-instance'

export const useHomeStore = defineStore('home', () => {
  const userInfo = ref<UserDto['UserRepository/COMPLEX_FETCHER']>({
    createdTime: '',
    editedTime: '',
    id: '',
    nickname: '',
    password: '',
    phone: ''
  })
  const getUserInfo = async () => {
    userInfo.value = await api.userController.getUserInfo()
  }
  const init = async () => {
    await getUserInfo()
  }

  onMounted(async () => {
    await init()
  })
  return { userInfo, getUserInfo, init }
})
```

### 短信发送API

```ts
import { request } from '@/utils/request'

export const sendSMS = (phone: string) => {
  return request<boolean>({ url: '/sms/send?phone=' + phone, method: 'post' })
}

```

### 注册界面

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
import { defineComponent, onMounted, reactive, ref, Transition } from 'vue'
import logo from '@/assets/logo.jpg'
import router from '@/router'
import background from '@/assets/background.jpg'
import { api } from '@/utils/api-instance'
import type { UserRegisterInput } from '@/apis/__generated/model/static'
import { assertFormValidate, assertSuccess } from '@/utils/common'
import { sendSMS } from '@/apis/sms/sms-api'
const registerForm = reactive<UserRegisterInput>({ phone: '', password: '', code: '' })

const showPanel = ref(false)
onMounted(() => {
  setTimeout(() => {
    showPanel.value = true
  }, 1000)
})
const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules<typeof registerForm>>({
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { max: 16, min: 6, message: '密码长度介于6，16' }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})
const handleRegister = async () => {
  if (!ruleFormRef.value) return
  await ruleFormRef.value.validate(
    assertFormValidate(() =>
      api.userController.register({ body: registerForm }).then((res) => {
        assertSuccess(res).then(() => {
          router.replace({ path: '/' })
          localStorage.setItem('token', res.tokenValue)
        })
      })
    )
  )
}

const countDown = ref(0)
let intervalId = 0
const handleSendSMS = () => {
  sendSMS(registerForm.phone).then((res) => {
    assertSuccess(res).then(() => {
      countDown.value = 120
      intervalId = setInterval(() => {
        if (countDown.value === 0) {
          clearInterval(intervalId)
          return
        }
        countDown.value--
      }, 1000)
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
          <el-card class="panel">
            <div class="content">
              <div class="panel-left">
                <el-avatar alt="logo" :size="30" shape="square" :src="logo"></el-avatar>
                <div class="title">会员后台管理系统</div>
                <div class="description">积分，优惠券,VIP等营销功能</div>
              </div>
              <div class="panel-right">
                <div class="title">快速开始</div>
                <div class="description">创建你的账号</div>
                <el-form
                  ref="ruleFormRef"
                  :model="registerForm"
                  :rules="rules"
                  class="form"
                  label-position="top"
                  label-width="100px"
                >
                  <el-form-item label="手机号" prop="phone">
                    <el-input v-model="registerForm.phone"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="password">
                    <el-input v-model="registerForm.password" type="password"></el-input>
                  </el-form-item>
                  <el-form-item label="验证码" prop="code">
                    <div class="sms">
                      <el-input v-model="registerForm.code"></el-input>
                      <el-button
                        class="send-sms"
                        type="success"
                        @click="handleSendSMS"
                        :disabled="countDown > 0"
                      >
                        {{ countDown === 0 ? '发送验证码' : countDown }}
                      </el-button>
                    </div>
                  </el-form-item>
                </el-form>
                <div class="button-wrapper">
                  <el-button class="register" type="primary" @click="handleRegister">
                    注册
                  </el-button>
                  <el-button class="login" size="small" link @click="router.replace('/login')">
                    登录
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

          .sms {
            display: flex;
            align-items: center;
            width: 100%;

            .send-sms {
              margin-left: 20px;
            }
          }
        }

        .button-wrapper {
          margin-top: 40px;
          display: flex;
          justify-content: center;
          position: relative;
          .register {
            width: 120px;
          }
          .login {
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

### 注册路由

```ts
import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '@/views/login/register-view.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/user', component: () => import('@/views/user/user-view.vue') },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    }
  ]
})

export default router

```
