---
order: 3
---
# 提交订单

![订单创建（图1）](../image-4.png =x500)

页面：*box-order-create.vue*

## 表设计

从创建订单的页面中可以分成三类信息

1. 盲盒信息，购买的盲盒id以及盲盒数量。
2. 通用信息，地址/优惠券/备注/物流信息（发货后显示）
3. 价格计算，vip优惠/优惠券优惠/邮费/商品总价/实付金额

### 盲盒订单

```sql
create table mystery_box_order
(
    id            varchar(32) not null
        primary key,
    created_time  datetime(6) not null,
    edited_time   datetime(6) not null,
    creator_id    varchar(32) not null,
    editor_id     varchar(32) not null,
    status        varchar(32) not null comment '订单状态',
    base_order_id varchar(32) not null comment '基础订单id'
)
    comment '盲盒订单';
```

如果有做购物车功能，一次性可能会购买多个盲盒，每个盲盒的数量不一样。这样的需求就需要一个中间表来关联订单和盲盒的关系。

设计订单时要考虑到盲盒信息会发生变动，因此要把购买时的盲盒信息存入到数据库（盲盒快照），而不是只存储盲盒id。如果存储的是盲盒id，通过关联查询得到是最新的盲盒信息，而不是下单时的信息。

只有在支付成功后才会显示开盲盒得到的商品，同样也是存储商品快照。

```sql
create table mystery_box_order_item
(
    id                   varchar(32) not null
        primary key,
    created_time         datetime(6) not null,
    edited_time          datetime(6) not null,
    creator_id           varchar(32) not null,
    editor_id            varchar(32) not null,
    mystery_box_id       varchar(32) not null comment '盲盒id',
    mystery_box          json        not null comment '盲盒信息',
    mystery_box_order_id varchar(32) not null comment '盲盒订单id',
    mystery_box_count    int         not null comment '盲盒数量',
    products             json        null comment '开盲盒得到的商品'
)
    comment '盲盒订单项';
```

### 基础订单

基础订单是各种订单里面抽出来的通用字段组合成的一张表，并且关联了支付的详情信息，因为支付本身也是一种通用的信息。

基础订单里面存储的是地址的快照，而不是地址id。之所以能存储优惠券id是因为优惠券一般不会修改，只会作废下线再生成新的优惠券。

除了盲盒订单之外，[VIP订单](../vip.md)也用到了基础订单，所以这边`type`字段可以标识基础订单是来自于哪个业务。

除了理解字段外，可空性也比较重要。像有些订单不需要发货走线下自然就不会用到地址信息和物流单号，有些订单不需要优惠券，但是支付信息是必须要的。

```sql
create table base_order
(
    id              varchar(36)   not null
        primary key,
    created_time    datetime(6)   not null,
    edited_time     datetime(6)   not null,
    creator_id      varchar(36)   not null,
    editor_id       varchar(36)   not null,
    payment_id      varchar(36)   not null comment '支付订单id',
    address         varchar(1000) null comment '地址详情',
    remark          varchar(100)  null comment '备注',
    tracking_number varchar(50)   null comment '物流单号',
    coupon_user_id  varchar(36)   null comment '用户优惠券id',
    type            varchar(32)   not null comment '订单类型'
)
    comment '基础订单';
```

### 支付详情

支付详情在创建订单的时候就有了，此时支付时间和外系统交易订单号还是为空的状态。

用户在小程序中发起支付后，微信支付收到金额再调用我们的后台。在我们的后台中收到微信回调的请求，并用私钥解密请求得到订单id，再更新订单状态和支付信息。

支付方式在这个项目中只用到了微信支付。

```sql
create table payment
(
    id             varchar(36)    not null
        primary key,
    created_time   datetime(6)    not null,
    edited_time    datetime(6)    not null,
    creator_id     varchar(36)    not null,
    editor_id      varchar(36)    not null,
    pay_type       varchar(36)    not null comment '支付方式（微信，支付宝等）',
    pay_time       datetime       null comment '支付时间',
    pay_amount     decimal(10, 2) not null comment '实付金额',
    vip_amount     decimal(10, 2) not null comment 'vip优惠金额',
    coupon_amount  decimal(10, 2) not null comment '优惠券优惠金额',
    product_amount decimal(10, 2) not null comment '商品总价',
    delivery_fee   decimal(10, 2) not null comment '邮费',
    trade_no       varchar(36)    null comment '外系统交易订单号'
)
    comment '支付详情';
```

## 地址选择

点选择地址时跳转到[地址列表](../address/address-list.md)，并携带参数`from`标识跳转来源。

当用户在地址列表页选择完后，地址列表页会发送`address`事件，该事件携带了用户选择的地址详情。因此需要在当前页面监听`address`事件。

:::tabs

@tab html

```html
<template>
  <div class="box-order-create" v-if="payment">
    <div class="box-order">
        <!-- 忽略... -->
      <nut-cell-group class="cells">
        <nut-cell
          is-link
          center
          @click="switchPage('/pages/address/address-list?from=order')"
        >
          <template #icon>
            <image
              class="icon"
              src="@/assets/icons/local.png"
              mode="widthFix"
            ></image>
          </template>
          <template #title>
            <address-row
              :address="chosenAddress"
              v-if="chosenAddress"
            ></address-row>
          </template>
          <template #desc v-if="!chosenAddress"> 请选择地址</template>
          <template #link>
            <rect-right></rect-right>
          </template>
        </nut-cell>
        <!-- 忽略... -->
      </nut-cell-group>
    </div>
    <!-- 忽略... -->
  </div>
</template>
```

@tab ts

监听`address`事件将地址详情赋值给`chosenAddress`。由于地址会影响运费，调用`calculate`重新[计算价格](#计算价格)

```ts
type Address = AddressDto["AddressRepository/COMPLEX_FETCHER_FOR_FRONT"];
const chosenAddress = ref<Address>();
Taro.eventCenter.on("address", (value: Address) => {
  chosenAddress.value = value;
  order.value.baseOrder.addressId = value.id;
  calculate();
});

```

:::

## 优惠券选择

点选择优惠券时跳转到[优惠券列表](../coupon/coupon-user.md)，并携带参数`amount`和`id`，详细内容请参考优惠券列表页面。

当用户在优惠券列表页选择完后，优惠券列表页会发送`coupon`事件，该事件携带了用户选择的优惠券详情，因此需要在当前页面监听`coupon`事件。

:::tabs
@tab html

```html
<template>
  <div class="box-order-create" v-if="payment">
    <div class="box-order">
        <!-- 忽略... -->
      <nut-cell-group class="cells">
        <nut-cell
          is-link
          center
          @click="
            switchPage(
              `/pages/coupon/index?amount=${payment.productAmount}&id=${chosenCoupon?.id}`,
            )
          "
        >
          <template #icon>
            <image class="icon" src="@/assets/icons/coupon.png"></image>
          </template>
          <template #title>
            {{ chosenCoupon?.coupon.name }}
          </template>
          <template #desc v-if="!chosenCoupon"> 请选择优惠券 </template>
          <template #link>
            <rect-right></rect-right>
          </template>
        </nut-cell>
        <!-- 忽略... -->
      </nut-cell-group>
    </div>
    <!-- 忽略... -->
  </div>
</template>
```

@tab ts

监听`coupon`事件将地址详情赋值给`chosenCoupon`。由于优惠券会影响价格，调用`calculate`重新[计算价格](#计算价格)

```ts
type CouponUserRel =
  CouponUserRelDto["CouponUserRelRepository/COMPLEX_FETCHER_FOR_FRONT"];
const chosenCoupon = ref<CouponUserRel>();
Taro.eventCenter.on("coupon", (couponUserRel?: CouponUserRel) => {
  chosenCoupon.value = couponUserRel;
  order.value.baseOrder.couponUserId = couponUserRel?.id;
  calculate();
});
```

:::

## 计算价格

- 累加盲盒价格得到商品总价
- [优惠券计算](../coupon/coupon.md#优惠券计算)得到优惠价格
- [运费计算](../carriage-template.md#运费计算)得到运费价格
- [vip计算](../vip.md#vip折扣计算)得到vip价格

:::tabs
@tab html

```html
<template>
  <div class="box-order-create" v-if="payment">
    <div class="box-order">
      <!-- 忽略... -->
      <nut-cell-group class="summary">
        <nut-cell title="盲盒总价">
          <template #desc>
            <div class="value">￥{{ payment.productAmount }}</div>
          </template>
        </nut-cell>
        <nut-cell title="运费">
          <template #desc>
            <div class="value">￥{{ payment.deliveryFee }}</div>
          </template>
        </nut-cell>
        <nut-cell title="优惠券">
          <template #desc>
            <div class="value">-￥{{ payment.couponAmount }}</div>
          </template>
        </nut-cell>
        <nut-cell title="会员优惠">
          <template #desc>
            <div class="value">-￥{{ payment.vipAmount }}</div>
          </template>
        </nut-cell>
      </nut-cell-group>
      <!-- 忽略... -->
    </div>
  </div>
</template>
```

@tab ts

```ts
const payment = ref<PaymentPriceView>();
const calculate = async () => {
  payment.value = await api.mysteryBoxOrderForFrontController.calculate({
    body: order.value,
  });
};
```

@tab java

`MysteryBoxOrderService`

```java
    public PaymentPriceView calculate(MysteryBoxOrderInput mysteryBoxOrderInput) {
        var baseOrder = mysteryBoxOrderInput.getBaseOrder();
        Payment produce = PaymentDraft.$.produce(draft -> {
            draft.setProductAmount(BigDecimal.ZERO)
                    .setDeliveryFee(BigDecimal.ZERO)
                    .setVipAmount(BigDecimal.ZERO)
                    .setCouponAmount(BigDecimal.ZERO);
            BigDecimal totalPrice = BigDecimal.ZERO;
            for (var item : mysteryBoxOrderInput.getItems()) {
                MysteryBox mysteryBox = mysteryBoxRepository.findById(item.getMysteryBoxId())
                        .orElseThrow(() -> new BusinessException(ResultCode.NotFindError, "盲盒不存在"));
                BigDecimal price = mysteryBox.price().multiply(BigDecimal.valueOf(item.getMysteryBoxCount()));
                totalPrice = totalPrice.add(price);
            }
            // 计算商品总价
            draft.setProductAmount(totalPrice);
            // 计算优惠券
            draft.setCouponAmount(couponService.calculate(baseOrder.getCouponUserId(), totalPrice));
            // 计算运费
            draft.setDeliveryFee(carriageTemplateService.calculate(baseOrder.getAddressId(), totalPrice));
            // 计算VIP优惠价格
            draft.setVipAmount(vipService.calculate(totalPrice));
            // 计算实际支付价格
            draft.setPayAmount(
                    draft.productAmount()
                            .add(draft.deliveryFee())
                            .subtract(draft.couponAmount())
                            .subtract(draft.vipAmount())
            );
        });
        return new PaymentPriceView(produce);
    }
```

:::

## 创建订单

```java
    public String create(MysteryBoxOrderInput mysteryBoxOrderInput) {
        String orderId = IdUtil.fastSimpleUUID();
        PaymentPriceView calculated = calculate(mysteryBoxOrderInput);
        // 支付详情
        Payment payment = PaymentDraft.$.produce(
                calculated.toEntity(),
                paymentDraft -> paymentDraft
                        .setId(orderId)
                        .setPayType(PayType.WE_CHAT_PAY));
        Address address = addressRepository
                .findUserAddressById(mysteryBoxOrderInput.getBaseOrder().getAddressId())
                .orElseThrow(() -> new BusinessException("地址不存在"));
        MysteryBoxOrder entity = Objects.createMysteryBoxOrder(mysteryBoxOrderInput
                        .toEntity(),
                draft -> {
                    // 设置订单项关联的订单id，并且设置盲盒快照
                    draft.setItems(draft
                            .items()
                            .stream()
                            .map(item -> Objects.createMysteryBoxOrderItem(item, mysteryBoxOrderItemDraft -> {
                                MysteryBox box = mysteryBoxRepository
                                        .findById(item.mysteryBoxId(), MysteryBoxRepository.COMPLEX_FETCHER_FOR_FRONT)
                                        .orElseThrow(() -> new BusinessException(ResultCode.NotFindError, "盲盒不存在"));
                                mysteryBoxOrderItemDraft.setMysteryBoxOrderId(orderId)
                                        // 盲盒快照，购买时的盲盒详情存入
                                        .setMysteryBox(new MystryBoxView(box));
                            }))
                            .toList()
                    );
                    // 设置订单的id和状态
                    draft.setId(orderId)
                            .setStatus(ProductOrderStatus.TO_BE_PAID);
                    // 设置基础订单
                    draft.baseOrder()
                            .setId(orderId)
                            .setType(OrderType.PRODUCT_ORDER)
                            .setPayment(payment)
                            // 地址快照
                            .setAddress(new AddressView(address));
                });
        // 同时创建mysteryBoxOrder, mysteryBoxOrderItem, baseOrder, payment
        MysteryBoxOrder save = mysteryBoxOrderRepository.save(entity);
        // 优惠券设置为已使用
        couponService.changeStatus(mysteryBoxOrderInput.getBaseOrder().getCouponUserId(), CouponUseStatus.USED);
        return save.id();
    }
```
