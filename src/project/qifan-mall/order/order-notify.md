---
category:
  - 起凡商城
tag:
  - 订单
  - 订单回调
  - 订单支付
  - 微信支付
order: 6
date: 2024-02-19
timeline: true
---

# 订单支付回调

![微信小程序支付流程图](https://pay.wechatpay.cn/wiki/doc/apiv3/assets/img/pay/wechatpay/6_2.png)

用户支付成功后，16-18阶段微信服务器我会通知我方的服务器，通知内容是加密后的支付结果，需要解密后才能确认支付结果。

:::tip
在[预支付下单阶段](./order-prepay.md#预支付请求体构建-prepare阶段)已经配置好了回调地址，微信服务器会自动调用回调地址，通知支付结果。
:::

## api

```java
  @PostMapping("notify/wechat")
  @ApiIgnore
  public String paymentNotifyWechat(@RequestBody String body,
      @RequestHeader(value = "Wechatpay-Timestamp") String timestamp,
      @RequestHeader(value = "Wechatpay-Nonce") String nonce,
      @RequestHeader(value = "Wechatpay-Signature") String signature,
      @RequestHeader(value = "Wechatpay-Serial") String serial) {
    SignatureHeader signatureHeader = SignatureHeader.builder().signature(signature)
        .serial(serial)
        .nonce(nonce)
        .timeStamp(timestamp).build();;
    return productOrderService.paymentNotifyWechat(body, signatureHeader);
  }

```

## 发送支付回调事件

订单支付成功后的异步通知处理逻辑

- **方法注解：**
  - 使用 `@SneakyThrows` 注解表示在方法内部捕获异常并转换为运行时异常，简化异常处理代码。

- **方法参数：**
  - `String body`: 微信支付回调的请求体，包含支付结果信息。
  - `SignatureHeader signatureHeader`: 包含微信支付回调请求头的信息，如时间戳、随机数、签名等。

- **解密回调结果：**
  - 调用 `wxPayService.parseOrderNotifyV3Result` 方法解密微信支付回调结果，获取 `DecryptNotifyResult` 对象。

- **获取订单信息：**
  - 从解密的回调结果中获取商户订单号 `outTradeNo`。
  - 使用商户订单号查询数据库，获取对应的订单信息 `productOrder`。

- **构建状态事件 `StateEvent`：**
  - 根据订单信息构建 `StateEvent` 对象，包括订单状态、事件类型、场景ID等信息。

- **调用状态机处理支付回调事件：**
  - 创建 `StateContext` 对象，传递 `StateEvent` 和包含解密结果的上下文对象 `NotifyWeChatContext`。
  - 调用 `stateMachine.action` 方法，触发状态机处理支付回调事件。

- **返回处理结果：**
  - 返回处理结果，通常是一个包含处理信息的字符串。

该方法的主要作用是解密微信支付回调结果，获取订单信息，构建状态事件，然后调用状态机引擎处理支付回调事件。

```java
  @SneakyThrows
  public String paymentNotifyWechat(String body, SignatureHeader signatureHeader) {
    DecryptNotifyResult notifyResult = wxPayService.parseOrderNotifyV3Result(body, signatureHeader)
        .getResult();
    String outTradeNo = notifyResult.getOutTradeNo();
    ProductOrder productOrder = productOrderRepository
        .findById(outTradeNo,
            ProductOrderFetcher.$
                .allScalarFields()
                .payment(PaymentFetcher.$.payType()))
        .orElseThrow(() -> new BusinessException(ResultCode.NotFindError, "订单不存在"));
    StateEvent stateEvent = StateEvent.builder()
        .orderState(productOrder.status().getKeyEnName())
        .eventType("NOTIFY")
        .sceneId(productOrder.payment().payType().getKeyEnName())
        .businessCode("PRODUCT_ORDER")
        .build();
    R<String> res = stateMachine.action(
        new StateContext<>(stateEvent, new NotifyWeChatContext()
            .setDecryptNotifyResult(notifyResult)));
    return res.getResult();
  }

```

## 支付回调上下文

```java
@Data
@Accessors(chain = true)
public class NotifyWeChatContext {
  private DecryptNotifyResult decryptNotifyResult;
  private ProductOrder productOrder;
}
```

## 支付回调处理器

- **类注解：**
  - `@OrderStateProcessor`: 指示该类是一个订单状态处理器，处理待支付订单状态，回调事件，微信支付场景。
  - `@Slf4j`: 自动生成日志实例，用于日志记录。
  - `@AllArgsConstructor`: 自动生成全参构造方法。

- **方法参数：**
  - `StateContext<NotifyWeChatContext> context`: 状态机上下文对象，包含了支付回调上下文。

- **`prepare` 方法：**
  - 通过上下文获取微信支付回调结果和商户订单号。
  - 查询订单信息，包括订单创建者、支付信息等。
  - 使用 `ProductOrderDraft` 创建一个新的订单对象，更新支付信息，包括微信支付订单ID和支付时间。
  - 将新创建的订单对象设置到上下文中，以便后续处理。
- **`save` 方法：**
  - 从上下文中获取包含更新后支付信息的订单对象 `productOrder`。
  - 切换当前登录用户到订单创建者，使用 `StpUtil.switchTo` 方法。
  - 创建新的订单对象 `producedOrder`，并将状态设置为下一个状态。
  - 调用订单仓库的 `save` 方法保存更新后的订单对象。
  - 将保存后订单对象的ID包装成成功的响应返回。

```java
@OrderStateProcessor(state = "TO_BE_PAID", event = "NOTIFY", sceneId = "WE_CHAT_PAY", bizCode = "PRODUCT_ORDER")
@Slf4j
@AllArgsConstructor
public class NotifyWeChatProcessor extends AbstractStateProcessor<String, NotifyWeChatContext> {

  private final ProductOrderRepository orderRepository;

  @Override
  public void prepare(StateContext<NotifyWeChatContext> context) {
    NotifyWeChatContext notifyWeChatContext = context.getContext();
    DecryptNotifyResult notifyResult = notifyWeChatContext.getDecryptNotifyResult();
    String outTradeNo = notifyResult.getOutTradeNo();
    ProductOrder productOrder = orderRepository.findById(outTradeNo,
        ProductOrderFetcher.$.allScalarFields().creator(true).payment(
            PaymentFetcher.$.allScalarFields())).orElseThrow(
        () -> new BusinessException(ResultCode.NotFindError, "订单不存在"));
    // 设置微信支付订单id
    ProductOrder producedOrder = ProductOrderDraft.$.produce(productOrder, draft -> {
      draft.payment().setTradeNo(notifyResult.getTransactionId())
          .setPayTime(LocalDateTime.now());
    });
    notifyWeChatContext.setProductOrder(producedOrder);
  }

  @Override
  public R<String> check(StateContext<NotifyWeChatContext> context) {
    // 可以校验支付的金额是否正确
    return R.ok();
  }

  @Override
  public String getNextState(StateContext<NotifyWeChatContext> context) {
    return ProductOrderStatus.TO_BE_DELIVERED.getKeyEnName();
  }

  @Override
  public R<String> action(String nextState, StateContext<NotifyWeChatContext> context) {
    // 后续拉新分成可以在这边发送事件
    return R.ok();
  }

  @Override
  public R<String> save(String nextState, StateContext<NotifyWeChatContext> context) {
    ProductOrder productOrder = context.getContext().getProductOrder();
    StpUtil.switchTo(productOrder.creator().id());
    ProductOrder producedOrder = ProductOrderDraft.$.produce(productOrder, draft -> {
      draft.setStatus(ProductOrderStatus.valueOf(nextState));
    });
    return R.ok(orderRepository.save(producedOrder).id());
  }

  @Override
  public void after(StateContext<NotifyWeChatContext> context) {

  }
}

```
