---
order: 2
---
# 用户优惠券

![优惠券列表](../image-9.png =x500)

## 优惠券展示和选择

用户优惠券的入口有两个，一个是用户中心页面，一个是订单创建页面。下面介绍各种操作在不同的来源下的逻辑

- 优惠券列表查询
  - 来自订单创建：传商品总金额过滤符合使用门槛且可使用的优惠券
  - 来自用户中心：查询所有可使用的优惠券
- 立即使用按钮
  - 来自订单创建：点击立即使用，返回到订单创建页面，并传送已选的优惠券
  - 来自用户中心：跳转到盲盒列表
- 取消使用按钮：
  - 来自订单创建：跳转到优惠券列表时传输已选的优惠券id，此时优惠券会显示取消使用，点击即可返回到订单创建页面并取消优惠券

:::tabs

@tab vue

```vue
<template>
  <div class="coupon-page">
    <coupon-row
      v-for="couponUser in pageData.content"
      :key="couponUser.id"
      :coupon-user="couponUser"
      @use="chooseCoupon"
      :active="activeId == couponUser.id"
    ></coupon-row>
  </div>
</template>

<script setup lang="ts">
import { api } from "@/utils/api-instance";
import { usePageHelper } from "@/utils/page";
import CouponRow from "@/components/coupon/coupon-row.vue";
import Taro from "@tarojs/taro";
import { ref } from "vue";
import { CouponUserRelDto } from "@/apis/__generated/model/dto";
type CouponUser =
  CouponUserRelDto["CouponUserRelRepository/COMPLEX_FETCHER_FOR_FRONT"];
// 分页查询可使用的优惠券列表
const { pageData, reloadPageData } = usePageHelper(
  api.couponUserRelForFrontController.query,
  api.couponUserRelForFrontController,
  { query: {} },
  // 取消进入页面自动加载
  { enableLoad: false },
);
// 不同的入口传入的参数值不一样，订单创建页会传amount，id，用户页面会传from。
const activeId = ref<string>();
const fromUser = ref(false);
Taro.useLoad(({ amount, id, from }) => {
  if (from) {
    fromUser.value = true;
  }
  activeId.value = id;
  // 首次进入页面自动加载，如果携带了商品金额则过滤优惠券门槛低于该值的。没携带就查询所有可使用的优惠券
  reloadPageData({
    query: { maxThresholdAmount: amount || 999999999 },
  });
});
// 点击立即使用
const chooseCoupon = (couponUser?: CouponUser) => {
  if (fromUser.value) {
    return Taro.switchTab({ url: "/pages/box/index" });
  }
  Taro.navigateBack({
    success() {
      Taro.eventCenter.trigger("coupon", couponUser);
    },
  });
};
</script>
```

@tab java

定义动态查询dto，接收查询条件

- 优惠券（`Coupon`表）查询条件
  - couponId查询优惠券id
  - `le(thresholdAmount)`，传入`maxThresholdAmount`即可过滤门槛 `thresholdAmount <= maxThresholdAmount`。maxThresholdAmount就是前端的商品总价。
  - `le(effectiveDate)`，传入`maxEffectiveDate`即可过滤生效日期`effectiveDate <= maxEffectiveDate`。maxEffectiveDate填的是当前日期，过滤生效时间在今天之前的优惠券。
  - `ge(expirationDate)`，传入`minExpirationDate`即可过滤失效日期`expirationDate >= minExpirationDate`。minExpirationDate填的是当前日期，过滤失效日期在今天之后的优惠券。
  - `couponStatus`，传优惠券的状态
- 用户优惠券(`CouponUserRel`表)查询条件
  - `status`查询优惠券是否已被使用
  - `id(user)`查询属于某个用户的优惠券

```txt
// mystery-box-backend/src/main/dto/coupon/CouponUserRel.dto
specification CouponUserRelSpec {
    #allScalars
    id(creator)
    flat(coupon) {
        id as couponId
        le(thresholdAmount)
        le(effectiveDate)
        ge(expirationDate)
        status as couponStatus
    }
    id(user)
}
```

理解了上面的dto，下面填写一些默认参数

- `userId` 填当前用户的id
- `maxEffectiveDate` 填当前日期
- `minExpirationDate` 填当前日期
- `status` 填未使用
- `couponStatus` 填启用（true）

还有门槛过滤条件`maxThresholdAmount`在前端传。请在vue页签中查看首次进入页面加载部分的代码。

```java
    @PostMapping("query")
    public Page<@FetchBy(value = "COMPLEX_FETCHER_FOR_FRONT") CouponUserRel> query(@RequestBody QueryRequest<CouponUserRelSpec> queryRequest) {
        CouponUserRelSpec query = queryRequest.getQuery();
        query.setUserId(StpUtil.getLoginIdAsString());
        query.setMinExpirationDate(LocalDateTime.now());
        query.setMaxEffectiveDate(LocalDateTime.now());
        query.setStatus(DictConstants.CouponUseStatus.UNUSED);
        query.setCouponStatus(true);
        return couponUserRelRepository.findPage(queryRequest, CouponUserRelRepository.COMPLEX_FETCHER_FOR_FRONT);
    }
```

:::
