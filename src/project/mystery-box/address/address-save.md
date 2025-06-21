---
order: 2
---
# 地址保存

![地址保存（图1）](../image-8.png =x500)

![地址选择（图2）](../image-7.png =x500)

## 实现解析

整个代码可以分3块

1. 调用`Taro.chooseLocation`选地点，如图2所示，选择完后只会返回经度、维度、地址详情。少了省、市、区。
2. 地址回显，如果是编辑地址，需要加载地址信息回显。创建地址则不需要
3. 地址保存，填写完地址，进行字段校验后提交到后端

::::tabs
@tab ts

```ts
<script lang="ts" setup>
import { ref } from "vue";
import Taro from "@tarojs/taro";
import { api } from "@/utils/api-instance";
import { AddressInput } from "@/apis/__generated/model/static";
import { RectRight } from "@nutui/icons-vue-taro";

const address = ref<AddressInput>({
  details: "",
  latitude: 0,
  longitude: 0,
  phoneNumber: "",
  realName: "",
  top: false,
  houseNumber: "",
});
// 编辑回显
Taro.useLoad(({ id }) => {
  if (id) {
    api.addressForFrontController.findById({ id }).then((res) => {
      address.value = res;
    });
  }
});
// 选择地址
const chooseAddress = () => {
  Taro.chooseLocation({
    success(result) {
      address.value.details = result.address;
      address.value.latitude = result.latitude;
      address.value.longitude = result.longitude;
    },
  });
};

// 提交表单
const submit = () => {
  if (!address.value.latitude) {
    return Taro.showToast({ title: "请选择地址", icon: "error" });
  }
  api.addressForFrontController.save({ body: address.value }).then(() => {
    Taro.showToast({ title: "提交成功", icon: "success" });
    Taro.navigateBack();
  });
};
</script>
```

@tab html

```html
<template>
  <div class="address-save">
    <div class="address-wrapper">
      <div class="address">
        <div class="btn" @click="chooseAddress">
          去选择收货地址
          <rect-right color="#999"></rect-right>
        </div>
        <div class="form">
          <div class="form-item">
            <div class="label">地址：</div>
            <div class="input">
              <input
                placeholder="请输入地址"
                v-model="address.details"
                readonly
              />
            </div>
          </div>
          <div class="form-item">
            <div class="label">门牌号</div>
            <div class="input">
              <input placeholder="请输入门牌号" v-model="address.houseNumber" />
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
        <div class="submit" @click="submit">保存地址</div>
      </div>
    </div>
  </div>
</template>
```

::::

## 地址保存接口

地址保存时后端做了4个步骤

1. `@Validated`地址校验
2. 编辑人校验
3. 设置默认地址
4. 地址解析并入库

```java
    @PostMapping("save")
    public String save(@RequestBody @Validated AddressInput addressInput) {
        if (StringUtils.hasText(addressInput.getId())) {
            Address address = addressRepository.findById(addressInput.getId(), AddressRepository.COMPLEX_FETCHER_FOR_FRONT).orElseThrow(() -> new BusinessException("数据不存在"));
            if (!address.creator().id().equals(StpUtil.getLoginIdAsString())) {
                throw new BusinessException("只能修改自己的数据");
            }
        }
        // 首个地址设为默认
        if (addressRepository.findUserAll(StpUtil.getLoginIdAsString()).isEmpty()) {
            addressInput.setTop(true);
        }
        return addressRepository.save(AddressDraft.$.produce(addressInput.toEntity(), draft -> {
            GeoCoderResponse geoCoderResponse = new RestTemplate()
                    .getForObject("https://apis.map.qq.com/ws/geocoder/v1/?address=" + addressInput.getDetails() + "&key=" + tenantMapProperty.getKey(),
                            GeoCoderResponse.class);
            GeoCoderResponse.Address addressComponents = geoCoderResponse.getResult().getAddressComponents();
            draft.setCity(addressComponents.getCity());
            draft.setProvince(addressComponents.getProvince());
            draft.setDistrict(addressComponents.getDistrict());
        })).id();
    }
```

### 地址解析

由于地址选点缺少了省、市、区，所以后端在入库之前需要通过腾讯地图的地址解析api根据地址详情解析出省市区。

定义腾讯地址解析的返回结果

```java
@Data
public static class GeoCoderResponse {
    private Result result;

    @Data
    public static class Result {
        private Location location;
        @JsonProperty("address_components")
        private Address addressComponents;
    }

    @Data
    public static class Location {
        private Double lat;
        private Double lng;
    }

    @Data
    public static class Address {
        private String province;
        private String city;
        private String district;
        private String street;
    }
}
```

```java
GeoCoderResponse geoCoderResponse = new RestTemplate()
        .getForObject("https://apis.map.qq.com/ws/geocoder/v1/?address=" + addressInput.getDetails() + "&key=" + tenantMapProperty.getKey(),
                GeoCoderResponse.class);
GeoCoderResponse.Address addressComponents = geoCoderResponse.getResult().getAddressComponents();
draft.setCity(addressComponents.getCity());
draft.setProvince(addressComponents.getProvince());
draft.setDistrict(addressComponents.getDistrict());
```

## 参数校验

地址保存的时候使用`jarkata validation`的注解校验规范在需要校验的字段上添加响应的注解和报错信息。

```java
    /**
     * 详细地址
     */
    @NotBlank(message = "详细地址不能为空")
    String details();

    /**
     * 手机号
     */
    @NotBlank(message = "手机号不能为空")
    String phoneNumber();

    /**
     * 真实姓名
     */
    @NotBlank(message = "真实姓名不能为空")
    String realName();

    /**
     * 门牌号
     */
    @NotBlank(message = "门牌号不能为空")
    String houseNumber();
```

地址保存接口，使用`@Validated`注解校验输入表单。

```java
    @PostMapping("save")
    public String save(@RequestBody @Validated AddressInput addressInput) {
        // 忽略....
    }

```

::: tip
`@Validated`注解是在`jarkata validation`校验注解规范的`@Valid`之上拓展了分组校验功能。如果是使用spring框架那使用`@Validated`就行了
:::
