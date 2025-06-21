---
order: 6
---
# 会员

![会员页面（图1）](./image-13.png =x500)

![开通会员（图2）](./image-14.png =x500)

## 表设计

在图二中用户购买套餐（`vip_package`），在后端会生成一个vip订单(`vip_order`)记录了要购买的套餐，支付成功后会在`vip`中增加到期时间（图1中展示）。

```sql
create table vip
(
    id           varchar(32) not null
        primary key,
    created_time datetime(6) not null,
    edited_time  datetime(6) not null,
    creator_id   varchar(32) not null,
    editor_id    varchar(32) not null,
    user_id      varchar(32) not null comment '用户id',
    end_time     datetime(6) not null comment '到期时间'
)
    comment '会员信息';
```

```sql
create table vip_package
(
    id           varchar(32)    not null
        primary key,
    created_time datetime(6)    not null,
    edited_time  datetime(6)    not null,
    creator_id   varchar(32)    not null,
    editor_id    varchar(32)    not null,
    name         varchar(32)    not null comment '套餐名称',
    price        decimal(10, 2) not null comment '价格',
    days         int            not null comment '天数'
)
    comment 'vip套餐';
```

```sql
create table vip_order
(
    id             varchar(32) not null
        primary key,
    created_time   datetime(6) not null,
    edited_time    datetime(6) not null,
    creator_id     varchar(32) not null,
    editor_id      varchar(32) not null,
    user_id        varchar(32) not null comment '用户id',
    vip_package_id varchar(32) not null comment 'vip套餐',
    base_order_id  varchar(32) not null comment '基础订单'
)
    comment 'vip订单';
```

## 开通会员

### 浏览套餐

如图二所示，加载后端（`usePageHelper`）的vip套牌，点击不同的套餐可以切换颜色（`active`变量），点击立即购买提交订单（`api.vipOrderForFrontController.save`），得到支付参数在小程序端向微信付款(`Taro.requestPayment`)。

```vue
<template>
  <div class="vip-package-page">
    <div class="vip-package-list">
      <div
        :class="['vip-package', level.id == active ? 'active' : '']"
        v-for="level in pageData.content"
        :key="level.id"
        @click="active = level.id"
      >
        <div class="name">{{ level.name }}</div>
        <div class="price">{{ level.price }} ￥</div>
        <div class="row">
          <div class="label">天数：</div>
          <div class="value">{{ level.days }}天</div>
        </div>
      </div>
    </div>
    <nut-button class="submit" block type="primary" @click="handleSubmit"
      >立即购买
    </nut-button>
  </div>
</template>

<script setup lang="ts">
import { usePageHelper } from "@/utils/page";
import { api } from "@/utils/api-instance";
import { ref } from "vue";
import Taro from "@tarojs/taro";
// ----- 加载vip套餐 -----
const { pageData, reloadPageData } = usePageHelper(
  api.vipPackageForFrontController.query,
  api.vipPackageForFrontController,
  {
    pageNum: 1,
    pageSize: 1000,
    query: {},
  },
  { enableLoad: false },
);
// 选中的套餐
const active = ref();
Taro.useDidShow(async () => {
  await reloadPageData();
  active.value = pageData.value.content[0].id;
});
// ----- 加载vip套餐 -----

// ----- 提交订单 -----
const handleSubmit = () => {
  Taro.showLoading();
  api.vipOrderForFrontController
    .save({
      body: {
        vipPackageId: active.value,
      },
    })
    .then((res) => {
        // 支付订单
      Taro.requestPayment({
        nonceStr: res.nonceStr,
        package: res.packageValue,
        paySign: res.paySign,
        timeStamp: res.timeStamp,
        signType: res.signType as "RSA",
        success: () => {
          Taro.showLoading();
          Taro.showToast({
            title: "支付成功",
            icon: "success",
          });
          Taro.navigateBack();
        },
        fail: (res) => {
          Taro.showLoading();
          Taro.showToast({ title: res.errMsg, icon: "none" });
        },
      });
    });
};
// ----- 提交订单 -----
</script>
```

### 订单创建

创建订单主要是创建三个对象: 支付详情（`payment`）、基础订单(`baseOrder`)、vip订单(`vip_order`)。可以参考[盲盒订单创建](./box/box-order-create.md)过程理解支付详情和基础订单。

支付详情中只需要填写商品总价即vip套餐的价格即可，因此这边单独写了一个方法`initPayment`创建支付详情。

基础订单，支付详情，vip订单三者的id保持一致，这三者直接是一对一对一的关系，这样可以方便查询。

`weChatPayService.prepay`是我封装的微信支付通用方法，传入规范的对象即可生成支付参数。这也是为什么我要抽取出基础订单和支付详情的原因，这样可以做通用的支付功能。

```java
    private Payment initPayment(BigDecimal price, String id) {
        return PaymentDraft.$.produce(draft -> {
            draft.setProductAmount(price)
                    .setPayType(DictConstants.PayType.WE_CHAT_PAY)
                    .setCouponAmount(BigDecimal.ZERO)
                    .setVipAmount(BigDecimal.ZERO)
                    .setDeliveryFee(BigDecimal.ZERO)
                    .setPayAmount(price)
                    .setId(id);
        });
    }
     public WxPayUnifiedOrderV3Result.JsapiResult save(VipOrderInput vipOrderInput) {
        // 查询需要购买vip套餐
        VipPackage vipPackage = vipPackageRepository.findById(vipOrderInput.getVipPackageId()).orElseThrow(() -> new BusinessException(ResultCode.NotFindError));
        // 创建支付详情，商品总价就是套餐的价格
        Payment payment = this.initPayment(vipPackage.price());
        String orderId = IdUtil.fastSimpleUUID();
        // 创建vip订单
        VipOrder produce = VipOrderDraft.$.produce(vipOrderInput.toEntity(), draft -> {
            draft.setId(orderId)
                    .setUserId(StpUtil.getLoginIdAsString());
            // 创建基础订单
            draft.applyBaseOrder(baseOrderDraft -> {
                baseOrderDraft.setId(orderId)
                        // 创建支付详情
                        .setPayment(initPayment(vipPackage.price(), orderId))
                        .setRemark("userId:" + StpUtil.getLoginIdAsString() + ";vipPackageId:" + vipPackage.id())
                        .setType(DictConstants.OrderType.VIP_ORDER)
                ;
            });
        });
        // 保存到数据库
        VipOrder activityOrder = vipOrderRepository.save(produce);
        // 生成支付参数, 填写notifyUrl，支付成功后微信回调该地址
        return weChatPayService.prepay(new WeChatPayModel().setBaseOrder(activityOrder.baseOrder())
                .setExpiredMinutes(5)
                .setNotifyUrl("/front/vip-order/notify/pay/wechat"));
    }
```

### 支付回调

[在套餐浏览页](#浏览套餐)`Taro.requestPayment`支付成功后，微信会向[订单创建](#订单创建)时填写的`notifyUrl`发起回调。

构造`SignatureHeader`对象接收微信回调的请求中的请求头

```java
    @PostMapping("notify/pay/wechat")
    @ApiIgnore
    public String paymentNotifyWechat(@RequestBody String body,
                                      @RequestHeader(value = "Wechatpay-Timestamp") String timestamp,
                                      @RequestHeader(value = "Wechatpay-Nonce") String nonce,
                                      @RequestHeader(value = "Wechatpay-Signature") String signature,
                                      @RequestHeader(value = "Wechatpay-Serial") String serial) {
        SignatureHeader signatureHeader = SignatureHeader.builder().signature(signature)
                .serial(serial)
                .nonce(nonce)
                .timeStamp(timestamp).build();
        return vipOrderService.paymentNotifyWechat(body, signatureHeader);
    }
```

解密请求内容得到支付的订单id

```java
    @SneakyThrows
    public String paymentNotifyWechat(String body, SignatureHeader signatureHeader) {
        WxPayNotifyV3Result.DecryptNotifyResult notifyResult = wxPayService.parseOrderNotifyV3Result(
                        body, signatureHeader)
                .getResult();
        log.info("收到微信支付回调通知，订单号：{}", notifyResult);
        // vip订单id
        String outTradeNo = notifyResult.getOutTradeNo();
        // 查找订单
        VipOrder vipOrder = vipOrderRepository.findById(outTradeNo, VipOrderRepository.COMPLEX_FETCHER_FOR_ADMIN).orElseThrow(() -> new BusinessException(ResultCode.NotFindError, "订单不存在"));
        // 切换当前的登录用户为订单创建人
        StpUtil.switchTo(vipOrder.creator().id());
        // 没开通过vip则创建默认的vip对象
        Vip vip = vipRepository.findCurrentUserVip()
                .orElseGet(() ->
                        VipDraft.$.produce(draft -> {
                            draft.setUserId(StpUtil.getLoginIdAsString())
                                    .setEndTime(LocalDateTime.now());
                        }));
        vipRepository.save(VipDraft.$.produce(vip, draft -> {
            // 续日期
            LocalDateTime endTime = LocalDateTime.now().isAfter(vip.endTime()) ? LocalDateTime.now() : vip.endTime();
            draft.setEndTime(endTime.plusDays(vipOrder.vipPackage().days()));
        }));
        // 更新支付信息
        return vipOrderRepository.save(VipOrderDraft.$.produce(vipOrder, draft -> draft
                        .baseOrder()
                        .payment()
                        .setPayTime(LocalDateTime.now())
                        .setTradeNo(outTradeNo)))
                .id();
    }
```

## Vip折扣计算

```java
@Service
@Slf4j
@AllArgsConstructor
@Transactional
public class VipService {
    private final VipRepository vipRepository;
    private final VipConfigRepository vipConfigRepository;

    public BigDecimal calculate(BigDecimal price) {
        return vipRepository.findCurrentUserVip()
                .map(vip -> {
                    if (vip.endTime().isAfter(LocalDateTime.now())) {
                        BigDecimal value = BigDecimal.TEN.subtract(vipConfigRepository.get().getDiscount()).divide(BigDecimal.TEN, 2, RoundingMode.HALF_UP);
                        return price.multiply(value);
                    }
                    return BigDecimal.ZERO;
                })
                .orElse(BigDecimal.ZERO);
    }

}
```
