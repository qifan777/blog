---
order: 4
---
# 订单支付

![微信小程序支付流程图](https://pay.wechatpay.cn/wiki/doc/apiv3/assets/img/pay/wechatpay/6_2.png)

- 1-3 [订单创建阶段](./box-order-create.md)，包含盲盒、地址、优惠券等信息

- 4-8 [预支付阶段](#预支付)，后端会调用微信支付接口生成一个预支付订单，订单信息，包括订单金额、支付人信息、支付相关参数等。

- 9-15 [小程序支付](#小程序支付)，小程序端发起支付用户输入密码确认支付阶段。

- 16-19 [支付回调](#支付回调)，随机生成从盲盒中挑选商品生成

## 预支付

使用我封装的`weChatPayService.prepay`，只需要填写号基础订单和支付详情（参考[订单创建](./box-order-create.md)）即可生成支付参数。将结果返回给前端，然后在前端发起支付。

```java
    // MysteryBoxOrderService#prepay
    public WxPayUnifiedOrderV3Result.JsapiResult prepay(String id) {
        MysteryBoxOrder mysteryBoxOrder = mysteryBoxOrderRepository.findById(id, MysteryBoxOrderRepository.COMPLEX_FETCHER_FOR_FRONT)
                .orElseThrow(() -> new BusinessException(ResultCode.NotFindError));
        checkStatus(mysteryBoxOrder, DictConstants.ProductOrderStatus.TO_BE_PAID);
        checkOwner(mysteryBoxOrder);
        WxPayUnifiedOrderV3Result.JsapiResult prepay = weChatPayService.prepay(new WeChatPayModel()
                .setBaseOrder(mysteryBoxOrder.baseOrder())
                .setExpiredMinutes(5)
                .setNotifyUrl("/front/mystery-box-order/notify/pay/wechat"));
        log.info("预支付订单内容：{}", prepay);
        return prepay;
    }
```

## 小程序支付

`box-order.ts`封装了盲盒订单的支付方法，在订单列表页面可以发起支付，订单详情页也可以发起支付，因此放到ts文件中。

调用[预支付接口](#预支付)，得到预支付参数再通过`Taro.requestPayment`向微信支付，支付成功后微信回调我们的服务器。

```ts
// box-order.ts
export const boxWeChatPay = (id: string) => {
  return new Promise<boolean>((resolve, reject) => {
    Taro.showLoading();
    api.mysteryBoxOrderForFrontController
      .prepayWechat({ id })
      .then((res) => {
        Taro.requestPayment({
          nonceStr: res.nonceStr,
          package: res.packageValue,
          paySign: res.paySign,
          timeStamp: res.timeStamp,
          signType: res.signType as "RSA",
          success: () => {
            Taro.showToast({
              title: "支付成功",
              icon: "success",
            });
            resolve(true);
            Taro.hideLoading();
          },
          fail: (res) => {
            Taro.showToast({ title: res.errMsg });
            reject(res);
            Taro.hideLoading();
          },
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

```

## 支付回调

`Taro.requestPayment`支付成功后，微信会向[预支付](#预支付)时填写的`notifyUrl`发起回调。

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
        return mysteryBoxOrderService.paymentNotifyWechat(body, signatureHeader);
    }
```

```java
    /**
     * 支付成功回调
     * @param body 微信回调请求的body，带解密
     * @param signatureHeader 回调的请求头参数
     * @return 返回内容且http状态是200就代表成功，出现异常http状态会变成400，微信会认为回调失败，微信会轮询重试
     */
    @SneakyThrows
    public String paymentNotifyWechat(String body, SignatureHeader signatureHeader) {
        // 解密回调数据
        WxPayNotifyV3Result.DecryptNotifyResult notifyResult = wxPayService.parseOrderNotifyV3Result(body, signatureHeader)
                .getResult();
        log.info("支付回调:{}", notifyResult);
        String outTradeNo = notifyResult.getOutTradeNo();
        // 回调结果中的outTradeNo就代表预支付时填写的盲盒订单id
        MysteryBoxOrder mysteryBoxOrder = mysteryBoxOrderRepository.findByIdForFront(outTradeNo);
        // 切换当前登录上下文为订单创建人的id
        StpUtil.switchTo(mysteryBoxOrder.creator().id());
        mysteryBoxOrder.items().forEach(mysteryBoxOrderItem -> {
            // 从盲盒快照中获取商品信息
            List<Product> products = mysteryBoxOrderItem.mysteryBox()
                    .getProducts()
                    .stream()
                    .map(MystryBoxView.TargetOf_products::toEntity)
                    .toList();
            // 随机生成商品
            List<ProductView> generateProducts = generateProducts(products, mysteryBoxOrderItem.mysteryBoxCount());
            // 更新订单项
            mysteryBoxOrderItemRepository.updateProducts(mysteryBoxOrderItem.id(), generateProducts);
        });
        // 更新支付时间和微信的交易订单id
        paymentRepository.updatePayTimeAndTradeNo(mysteryBoxOrder.id(), notifyResult.getTransactionId(), LocalDateTime.now());
        // 状态变为待发货
        mysteryBoxOrderRepository.changeStatus(mysteryBoxOrder.id(), ProductOrderStatus.TO_BE_DELIVERED);
        return mysteryBoxOrder.id();
    }
```
