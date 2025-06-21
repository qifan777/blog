---
category:
  - 起凡商城
tag:
  - 地址
  - 地址保存
  - 小程序
order: 2
date: 2024-01-25
timeline: true
---
# 地址保存

![地址保存页面](./address-save.png =x350)

## 腾讯地图插件配置

```ts {6,9-20}
export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/user/index",
    "pages/address/address-list",
    "pages/address/address-save",
  ],
  // 忽略...
  plugins: {
    chooseLocation: {
      version: "1.0.10",
      provider: "wx76a9a06e5b4e693e",
    },
  },
  permission: {
    "scope.userLocation": {
      desc: "你的位置将用于确认收货地址",
    },
  },
  requiredPrivateInfos: ["getLocation"],
});

```

:::info
请参照[腾讯地图小程序插件接入指南](https://lbs.qq.com/miniProgram/plugin/pluginGuide/locationPicker)
:::

## 源码解析

### 地图标点

- `:markers="[marker]"`：传入一个包含单个标记（marker）的数组，代表地图上的某个特定地点标记。

::::tabs
@tab html

```html
<template>
  <div class="address-save">
    <map
      id="map"
      class="map"
      :latitude="address.latitude - 0.004"
      :longitude="address.longitude"
      :markers="[marker]"
    >
    </map>
  </div>
</template>
```

@tab ts

1. 使用`computed`计算属性创建一个名为`marker`的对象，用自定义图标标记当前位置：
   - `id`: 标记点的唯一ID。
   - `iconPath`: 自定义图标路径，指向一个本地地址图片资源。
   - `latitude` 和 `longitude`: 标记点在地图上的经纬度坐标，通过响应式变量`address.value.latitude`和`address.value.longitude`获取。
   - `width` 和 `height`: 图标在地图上的宽高。

2. 使用Taro框架处理用户地理位置授权，并获取当前位置经纬度：
   - 首先调用`Taro.authorize`方法请求用户的地理位置权限。
   - 授权成功后，调用`Taro.getLocation`获取当前设备的经纬度信息。
   - 在获取到经纬度后，检查当前是否处于编辑状态（即`address.value.id`是否存在）。如果不是编辑状态，则将当前经纬度赋值给`address.value`中的经纬度字段。

3. `address`: 存储地址表单信息

```ts
import { computed, ref } from "vue";
import Taro, { requirePlugin } from "@tarojs/taro";
import { api } from "@/utils/api-instance";
import { AddressInput } from "@/apis/__generated/model/static";
import { RectRight } from "@nutui/icons-vue-taro";

// 当前位置在地图上标记，自定义图标
const marker = computed(() => {
  return {
    id: 1,
    iconPath: "/assets/icons/address.png",
    latitude: address.value.latitude,
    longitude: address.value.longitude,
    width: 40,
    height: 40,
  };
});
// 获取到当前经纬度
Taro.authorize({
  scope: "scope.userLocation",
  success() {
    Taro.getLocation({
      success: (res) => {
        // 编辑时不需要获取当前地址
        if (!address.value.id) {
          address.value.latitude = res.latitude;
          address.value.longitude = res.longitude;
        }
      },
    });
  },
});
// 地址信息
const address = ref<AddressInput>({
  address: "",
  city: "",
  details: "",
  district: "",
  latitude: 23.099994,
  longitude: 113.32452,
  phoneNumber: "",
  province: "",
  realName: "",
  top: false,
});

```

@tab css

```scss
.address-save {
  .map {
    top: 0;
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100vh;
  }
}
```

::::

### 地址表单

:::tabs
@tab html

- "address-save"，它包裹了整个地址输入区域。

- 在".address-section"容器内，包含一个表单（`.form`）结构，用于展示并收集用户填写的地址详细信息。

- 表单中，每个字段以`.form-item`作为布局单元，包括：
  - `门牌号`：通过一个带有`v-model="address.details"`的输入框收集用户输入的具体门牌号或详细地址。
  - `联系人`：同样使用带绑定的输入框收集用户姓名信息，`v-model="address.realName"`。
  - `手机号`：收集用户的手机号码，使用`v-model="address.phoneNumber"`进行双向数据绑定。

所以，当用户在这些输入框中输入信息时，对应的`address`对象中的各个属性（如`details`、`realName`和`phoneNumber`）会自动更新，以便后续进行地址信息的验证与保存操作。

```html
<template>
  <div class="address-save">
    <!-- 忽略... -->
    <div class="address-section">
      <div class="form">
        <div class="form-item">
          <div class="label">门牌号</div>
          <div class="input">
            <input placeholder="请输入详细地址" v-model="address.details" />
          </div>
        </div>
        <div class="form-item">
          <div class="label">联系人</div>
          <div class="input">
            <input placeholder="请输入姓名" v-model="address.realName" />
          </div>
        </div>
        <div class="form-item">
          <div class="label">手机号</div>
          <div class="input">
            <input placeholder="请输入手机号" v-model="address.phoneNumber" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

@tab css

```scss
.address-save {
    // 忽略...
  .address-section {
    background-color: white;
    height: 100vh;
    margin: 300rpx 20rpx 0 20rpx;
    border-radius: 20rpx;
    padding: 40rpx 20rpx;
    .form {
      margin-top: 40rpx;
      .form-item {
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        .label {
          width: 120rpx;
          font-weight: bold;
        }
        .input {
          flex: 1;
          padding: 20rpx 0;
          border-bottom: 1px solid rgba(black, 0.1);
        }
      }
    }
  }
}


```

:::

### 地图选点

:::tabs

@tab html

```html
<template>
  <div class="address-save">
    <!-- 忽略... -->
    <div class="address-section">
      <div class="btn" @click="chooseAddress">
        去选择收货地址
        <rect-right color="#999"></rect-right>
      </div>
      <!-- 忽略... -->
    </div>
  </div>
</template>
```

@tab ts

调用腾讯地图选择地点插件，并在用户返回时获取所选位置信息并更新地址状态。

1. 首先加载`chooseLocation`插件，这个插件允许用户跳转到腾讯地图页面进行位置选择。

2. 定义一个名为`chooseAddress`的函数，用于打开腾讯地图的位置选择页面：
   - 函数内部设置了必要的参数，如API key（这里是示例key，请替换为实际有效的key）、来源信息（referer）和类别（category）。
   - 使用Taro的`navigateTo`方法跳转至插件提供的URL，该URL包含了传递给插件的关键参数。

3. 使用Taro生命周期钩子`useDidShow`，当页面显示时执行回调函数：
   - 当在腾讯地图中选择完毕回到本页面时，`chooseLocation.getLocation()`方法获取用户在腾讯地图上选择的位置信息。
   - 将获取到的位置信息与现有的`address.value`对象合并，并将结果赋值回`address.value`。

```ts
// 加载插件
const chooseLocation = requirePlugin("chooseLocation");
// 跳转到腾讯地图选择地点
const chooseAddress = () => {
  // 你的key，我的key已经和我的小程序绑定了
  const key = "ZWNBZ-2ARW3-J6H3Q-3SUEF-BILFZ-TLFPW";
  const referer = "华大快帮";
  const category = "小区";
  Taro.navigateTo({
    url:
      "plugin://chooseLocation/index?key=" +
      key +
      "&referer=" +
      referer +
      "&category=" +
      category,
  });
};
// 返回到小程序的时候获取用户选择的位置
Taro.useDidShow(() => {
  const chooseAddress = chooseLocation.getLocation();
  address.value = { ...address.value, ...chooseAddress };
});

```

@tab css

```scss
.address-save {
    // 忽略...
  .address-section {
    background-color: white;
    height: 100vh;
    margin: 300rpx 20rpx 0 20rpx;
    border-radius: 20rpx;
    padding: 40rpx 20rpx;
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 400rpx;
      border: 1.5px solid orange;
      text-align: center;
      padding: 15rpx 50rpx;
      color: orange;
      font-weight: bold;
      margin: auto;
      border-radius: 15rpx;
    }
    // 忽略...
  }
}

```

:::

### 提交表单/回显表单

:::tabs
@tab html

```html
<template>
  <div class="address-save">
    <!-- 忽略... -->
    <div class="address-section">
        <!-- 忽略... -->
      <div class="submit" @click="submit">保存地址</div>
    </div>
  </div>
</template>
```

@tab ts

分别处理表单提交和编辑时的数据回显。

1. 提交表单功能：
   - `submit`函数负责处理地址信息的提交操作。当用户点击提交按钮时调用此函数。
   - 通过调用后端API（`api.addressController.save`）将表单中`address.value`对象的值作为请求体发送到服务器进行保存。
   - 若保存成功，则使用Taro库提供的`Taro.showToast`方法显示一个“提交成功”的提示消息，并带有"success"图标。
   - 提交成功后，调用`Taro.navigateBack`方法使页面返回上一级，即从地址编辑或添加页面返回至前一页面。

2. 编辑回显功能：
   - 使用Taro生命周期钩子`useLoad`在页面加载时执行回调函数，该函数接收一个参数ops，可能包含了页面跳转时传递的查询参数。
   - 如果`ops.id`存在（表明当前是在编辑地址），则调用后端API（`api.addressController.findById`）根据传入的ID获取相应的地址详情。
   - 获取到地址详情后，将其赋值给响应式变量`address.value`，从而实现地址数据在表单中的回显。

```ts
// 提交表单
const submit = () => {
  api.addressController.save({ body: address.value }).then(() => {
    Taro.showToast({ title: "提交成功", icon: "success" });
    Taro.navigateBack();
  });
};
// 编辑回显
Taro.useLoad((ops: any) => {
  if (ops.id) {
    api.addressController.findById({ id: ops.id }).then((res) => {
      address.value = res;
    });
  }
});
```

@tab css

```scss
.address-save {
    // 忽略...
  .address-section {
    background-color: white;
    height: 100vh;
    margin: 300rpx 20rpx 0 20rpx;
    border-radius: 20rpx;
    padding: 40rpx 20rpx;
    // 忽略...
    .submit {
      margin-top: 30rpx;
      text-align: center;
      padding: 20rpx 0;
      font-weight: bold;
      background-image: linear-gradient(#fcd956, #f5d131);
      border-radius: 15rpx;
    }
  }
}

```

:::
