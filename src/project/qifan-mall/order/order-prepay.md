---
category:
  - 起凡商城
tag:
  - 订单
  - 订单预支付
  - 订单支付
  - 微信支付
order: 5
date: 2024-02-19
timeline: true
---

# 订单预支付

![微信小程序支付流程图](https://pay.wechatpay.cn/wiki/doc/apiv3/assets/img/pay/wechatpay/6_2.png)

1-3是属于[订单创建阶段](./order-create.md)

4-8是预支付阶段，后端会调用微信支付接口生成一个预支付订单，订单信息，包括订单金额、支付人信息、支付相关参数等。

9-15是小程序端发起支付用户输入密码确认支付阶段。

## 依赖和配置

### maven依赖

`wx-java-pay-spring-boot-starter`集成了微信支付相关的API，只需要配置相关的密钥信息即可开始使用。

```pom
      <dependency>
        <groupId>com.github.binarywang</groupId>
        <artifactId>wx-java-pay-spring-boot-starter</artifactId>
        <version>${wechat.version}</version>
      </dependency>
```

### 密钥配置

`application.yml`

```yaml
wx:
  pay:
    appId: appid # 小程序appid
    mchId: mchid #商户id
    apiV3Key: v3Key #微信支付V3密钥
    certSerialNo: 4C144AABC0CC486EC0AB2DD492DCE6A2ZE2E6268 # 证书序列号
    privateKeyPath: classpath:wechat/apiclient_key.pem #apiclient_key.pem证书文件的绝对路径或者以classpath:开头的类路径
    privateCertPath: classpath:wechat/apiclient_cert.pem  #apiclient_cert.pem证书文件的绝对路径或者以classpath:开头的类路径
    notifyUrl: "https://www.jarcheng.top/test-api/productOrder/notify" #支付成功回调地址，填写你的服务器地址
```

### 配置文件读取

`WxPayPropertiesExtension`在`WxPayProperties`的基础上拓展了`notifyUrl`字段。

```java
@ConfigurationProperties(
    prefix = "wx.pay"
)
@Data
public class WxPayPropertiesExtension {
  private String notifyUrl;
}
```

```java {3}
@SpringBootApplication
@EnableImplicitApi
@EnableConfigurationProperties(value = {WxPayPropertiesExtension.class})
public class MallServerApplication {

  public static void main(String[] args) {
    SpringApplication.run(MallServerApplication.class, args);
  }
}
```

## api

`io.qifan.mall.server.order.service.ProductOrderService#prepay`

```java
  @PostMapping("{id}/prepay")
  public WxPayUnifiedOrderV3Result.JsapiResult prepay(@PathVariable String id) {
    return productOrderService.prepay(id);
  }
```

## 发送预支付事件

`io.qifan.mall.server.order.service.ProductOrderService#prepay`

使用订单状态机，向状态机发送相关的信息让状态机寻找响应的处理器。

```java
  public JsapiResult prepay(String id) {
    ProductOrder productOrder = productOrderRepository
        .findById(id,
            ProductOrderFetcher.$
                .allScalarFields()
                .payment(PaymentFetcher.$.payType()))
        .orElseThrow(() -> new BusinessException(ResultCode.NotFindError, "订单不存在"));
    StateEvent stateEvent = StateEvent.builder()
        .orderState(productOrder.status().getKeyEnName())
        .eventType("PREPAY")
        .sceneId(productOrder.payment().payType().getKeyEnName())
        .businessCode("PRODUCT_ORDER")
        .build();
    R<JsapiResult> res = stateMachine.action(
        new StateContext<>(stateEvent, new PrepayWeChatContext()
            .setOrderId(id)));
    return res.getResult();
  }
```

## 预支付上下文

存储预支付下单请求，`WxPayUnifiedOrderV3Request`是调用微信微信服务器的请求参数。以及`JsapiResult`是预支付下单的响应结果。

```java
@Data
@Accessors(chain = true)
public class PrepayWeChatContext {

  private String orderId;
  private WxPayUnifiedOrderV3Request wxPayUnifiedOrderV3Request;
  private WxPayUnifiedOrderV3Result.JsapiResult jsapiResult;
}
```

## 预支付处理器

### 处理器

订单预支付状态处理器 `PrepayWeChatProcessor`，用于处理订单状态为 "TO_BE_PAID"，事件为 "PREPAY"，场景为 "WE_CHAT_PAY" 的情况。

1. **`@OrderStateProcessor` 注解：**
   - 标记了该类为订单状态处理器，并指定了处理的订单状态为 "TO_BE_PAID"，事件为 "PREPAY"，场景为 "WE_CHAT_PAY"。

2. **`@Slf4j` 注解：**
   - 使用 Lombok 提供的注解，自动生成日志记录器。

3. **`@AllArgsConstructor` 注解：**
   - 使用 Lombok 提供的注解，生成包含所有参数的构造方法。

4. **继承自 `AbstractStateProcessor`：**
   - 该类继承了一个抽象的订单状态处理器 `AbstractStateProcessor`，并实现了其中的抽象方法。
   - 泛型类型为 `<WxPayUnifiedOrderV3Result.JsapiResult, PrepayWeChatContext>`，表示该处理器处理的是返回结果类型为 `WxPayUnifiedOrderV3Result.JsapiResult`，上下文类型为 `PrepayWeChatContext` 的订单状态。

5. **构造方法参数：**
   - `WxPayService wxPayService`：微信支付服务对象。
   - `ObjectMapper objectMapper`：用于序列化和反序列化的对象映射工具。
   - `RedisTemplate<String, Object> redisTemplate`：Redis 缓存模板。
   - `ProductOrderRepository productOrderRepository`：商品订单的数据仓库。
   - `UserWeChatRepository userWeChatRepository`：用户微信信息的数据仓库。
   - `WxPayPropertiesExtension wxPayPropertiesExtension`：微信支付配置的扩展属性。
   - `WxPayProperties wxPayProperties`：微信支付配置的基本属性。

总体而言，该处理器用于处理订单状态为 "TO_BE_PAID"，事件为 "PREPAY"，场景为 "WE_CHAT_PAY" 的情况，其中包含了与微信支付相关的业务逻辑。

```java
@OrderStateProcessor(state = "TO_BE_PAID", event = "PREPAY", sceneId = "WE_CHAT_PAY", bizCode = "PRODUCT_ORDER")
@Slf4j
@AllArgsConstructor
public class PrepayWeChatProcessor extends
    AbstractStateProcessor<WxPayUnifiedOrderV3Result.JsapiResult, PrepayWeChatContext> {

  private final WxPayService wxPayService;
  private final ObjectMapper objectMapper;
  private final RedisTemplate<String, Object> redisTemplate;
  private final ProductOrderRepository productOrderRepository;
  private final UserWeChatRepository userWeChatRepository;
  private final WxPayPropertiesExtension wxPayPropertiesExtension;
  private final WxPayProperties wxPayProperties;

  @Override
  public void prepare(StateContext<PrepayWeChatContext> context) {
     // 忽略...
  }

  @Override
  @SneakyThrows
  public R<JsapiResult> check(StateContext<PrepayWeChatContext> context) {
     // 忽略...
  }

  @Override
  public String getNextState(StateContext<PrepayWeChatContext> context) {
     // 忽略...
  }

  @Override
  public R<WxPayUnifiedOrderV3Result.JsapiResult> action(String nextState,
      StateContext<PrepayWeChatContext> context) {
     // 忽略...
  }

  @Override
  public R<WxPayUnifiedOrderV3Result.JsapiResult> save(String nextState,
      StateContext<PrepayWeChatContext> context) {
         // 忽略...
  }


  @Override
  public void after(StateContext<PrepayWeChatContext> context) {

  }
}
```

### 预支付请求体构建-prepare阶段

1. **获取订单信息：**
   - 通过订单ID（`context.getContext().getOrderId()`）从数据库中查询订单信息。
   - 使用 `ProductOrderFetcher.$.allScalarFields().payment(PaymentFetcher.$.allScalarFields())` 配置订单信息的查询，包括订单本身的所有标量字段以及关联的支付信息。

2. **获取当前用户关联的微信用户：**
   - 查询当前用户关联的微信用户信息，使用 `UserWeChatTable.$` 表示 `UserWeChat` 数据表。
   - 使用 `userWeChatRepository.sql().createQuery(weChatTable)` 构建 SQL 查询语句。
   - 查询条件为当前用户ID，使用 `weChatTable.userId().eq(StpUtil.getLoginIdAsString())`。
   - 通过 `select(weChatTable)` 进行结果选择，并通过 `fetchOptional()` 获取可选的微信用户信息。

3. **构建微信支付请求对象 `WxPayUnifiedOrderV3Request`：**
   - 创建一个 `WxPayUnifiedOrderV3Request` 对象用于发起微信支付。
   - 设置支付价格，将订单的支付金额（以分为单位）赋给 `amount.setTotal`。
   - 获取支付人信息，设置支付人的 `openid` 为当前用户的微信 OpenID。
   - 设置其他支付相关参数，包括回调地址、小程序 AppID、商家号、支付描述、订单系统的订单号、过期时间等。

4. **设置预支付订单请求对象：**
   - 将构建好的 `WxPayUnifiedOrderV3Request` 对象设置到上下文中，以备后续的微信支付请求。
5. **日志记录：**
   - 使用日志记录器 `log` 记录预支付订单内容填写的日志信息。

 `prepare` 方法主要用于准备微信支付的预支付订单信息，包括订单金额、支付人信息、支付相关参数等。

```java
  @Override
  public void prepare(StateContext<PrepayWeChatContext> context) {
    ProductOrder productOrder =
        productOrderRepository.findById(context.getContext().getOrderId(),
                ProductOrderFetcher.$.allScalarFields().payment(PaymentFetcher.$.allScalarFields()))
            .orElseThrow(() -> new BusinessException(ResultCode.NotFindError));
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssXXX");
    ZonedDateTime dateTime = ZonedDateTime.now().plusHours(1);
    // 查找当前用户关联的微信用户
    UserWeChatTable weChatTable = UserWeChatTable.$;
    UserWeChat userWeChat = userWeChatRepository.sql().createQuery(weChatTable)
        .where(weChatTable.userId().eq(StpUtil.getLoginIdAsString()))
        .select(weChatTable)
        .fetchOptional()
        .orElseThrow(() -> new BusinessException(ResultCode.NotFindError, "非小程序用户, 请注册"));
    WxPayUnifiedOrderV3Request wxPayUnifiedOrderV3Request = new WxPayUnifiedOrderV3Request();
    // 支付价格
    WxPayUnifiedOrderV3Request.Amount amount = new WxPayUnifiedOrderV3Request.Amount();
    amount.setTotal(productOrder.payment().payAmount()
        .multiply(BigDecimal.valueOf(
            100)).intValue());
    // 获取支付人信息
    WxPayUnifiedOrderV3Request.Payer payer = new WxPayUnifiedOrderV3Request.Payer();
    payer.setOpenid(userWeChat.openId());
    wxPayUnifiedOrderV3Request.setPayer(payer)
        .setAmount(amount)
        // 回调地址
        .setNotifyUrl(wxPayPropertiesExtension.getNotifyUrl())
        // 小程序appid
        .setAppid(wxPayProperties.getAppId())
        // 商家号
        .setMchid(wxPayProperties.getMchId())
        // 支付描述
        .setDescription(productOrder.remark())
        // 订单系统的订单号
        .setOutTradeNo(productOrder.id())
        // 过期时间
        .setTimeExpire(dateTimeFormatter.format(dateTime))
        .setDescription("www.jarcheng.top");
    context.getContext().setWxPayUnifiedOrderV3Request(wxPayUnifiedOrderV3Request);
    log.info("预支付订单内容：{}", wxPayUnifiedOrderV3Request);
  }

```

### 预支付校验-check阶段

1. **获取订单信息：**
   - 通过订单ID（`context.getContext().getOrderId()`）从数据库中查询订单信息。
   - 使用 `ProductOrderFetcher.$` 查询订单本身的所有标量字段，以及设置 `creator(true)` 表示同时查询订单创建者信息，设置 `items` 表示查询订单项信息，包括订单项的 `skuCount` 和关联的商品SKU信息。

2. **校验订单拥有者：**
   - 检查当前登录用户的ID是否与订单的创建者ID一致，确保支付的是自己的订单。如果不一致，抛出异常表示无法支付他人订单。

3. **查询是否存在预支付信息：**
   - 利用 Redis 缓存查询是否存在预支付信息，通过 `redisTemplate.opsForValue().get("prepay:" + context.getContext().getOrderId())` 获取预支付信息。

4. **判断是否存在预支付信息：**
   - 如果存在预支付信息，则直接将该信息转换为 `WxPayUnifiedOrderV3Result.JsapiResult` 对象，并返回包含该对象的 `R` 结果。
   - 在这里，通过反序列化操作，将预支付信息从 Redis 中取出，并转换为对应的 Java 对象。
5. **日志记录：**
   - 使用日志记录器 `log` 记录是否存在预支付的订单。
6. **返回结果：**
   - 如果存在预支付信息，将 `R` 对象的状态码设置为 `ResultCode.Fail.getCode()`，表示后续不需要执行其他操作，直接返回包含预支付信息的 `R` 对象。
7. **返回空结果：**
   - 如果没有预支付信息，直接返回一个表示成功的 `R` 对象，其中的数据部分为 `null`。

总体而言，该 `check` 方法主要用于在进行微信支付前，校验订单的拥有者是否为当前登录用户，并检查是否存在预支付信息。如果存在预支付信息，则直接返回包含该信息的 `R` 对象，并不执行后续的支付操作；如果不存在预支付信息，则返回一个表示成功的 `R` 对象。这一步骤有助于避免重复发起支付请求，提高支付效率。

```java
  @Override
  @SneakyThrows
  public R<JsapiResult> check(StateContext<PrepayWeChatContext> context) {
    ProductOrder productOrder = productOrderRepository
        .findById(context.getContext().getOrderId(),
            ProductOrderFetcher.$
                .creator(true)
                .items(ProductOrderItemFetcher.$
                    .skuCount()
                    .productSku(ProductSkuFetcher.$.allScalarFields())))
        .orElseThrow(() -> new BusinessException(ResultCode.NotFindError, "订单不存在"));
    if (!StpUtil.getLoginIdAsString().equals(productOrder.creator().id())) {
      throw new BusinessException(ResultCode.NotGrant, "无法支付他人订单");
    }
    Object prepayRes = redisTemplate.opsForValue()
        .get("prepay:" + context.getContext().getOrderId());
    if (prepayRes != null) {
      log.info("已存在预支付订单：{}", prepayRes);
      // 如果存在预支付订单则直接发起支付
      WxPayUnifiedOrderV3Result.JsapiResult jsapiResult = objectMapper.readValue(
          objectMapper.writeValueAsString(prepayRes), WxPayUnifiedOrderV3Result.JsapiResult.class);
      R<WxPayUnifiedOrderV3Result.JsapiResult> ok = R.ok(jsapiResult);
      // 不执行后续的方法
      ok.setCode(ResultCode.Fail.getCode());
      return ok;
    }
    return R.ok(null);
  }

```

### 调用接口预支付下单-action阶段

对应支付流程图中的4，6，7阶段。

1. **发起预支付订单：**
   - 使用 `wxPayService.createOrderV3` 方法通过微信支付服务发起预支付订单。
   - 传递了支付类型参数 `TradeTypeEnum.JSAPI` 表示使用 JSAPI 进行支付。
   - 将预支付订单的请求对象（`context.getContext().getWxPayUnifiedOrderV3Request()`）传递给 `createOrderV3` 方法。

2. **捕获异常：**
   - 捕获 `WxPayException` 异常，该异常表示微信支付接口返回的错误信息。
   - 如果发生异常，抛出自定义业务异常，并将微信支付接口返回的错误信息作为异常信息。

3. **记录日志：**
   - 在预支付订单下单成功后，使用日志记录器 `log` 记录下单成功的日志信息。

4. **设置上下文信息：**
   - 将预支付订单的结果（`wxPayAppOrderResult`）设置到上下文中，以备后续的支付处理。

5. **返回结果：**
   - 返回一个包含预支付订单结果的 `R` 对象，其中状态码表示成功，数据部分为预支付订单的结果对象。

总体而言，这两个方法主要用于获取下一个状态和发起预支付订单的操作。`getNextState` 方法返回订单状态不变，仍然是待支付状态；`action` 方法则调用微信支付服务发起预支付订单，并记录相关的日志信息，最后返回包含预支付订单结果的 `R` 对象。这两个方法是状态机中状态迁移和状态动作的一部分。

```java
  @Override
  public String getNextState(StateContext<PrepayWeChatContext> context) {
    // 状态不变，仍然是待支付状态
    return ProductOrderStatus.TO_BE_PAID.getKeyEnName();
  }

  @Override
  public R<WxPayUnifiedOrderV3Result.JsapiResult> action(String nextState,
      StateContext<PrepayWeChatContext> context) {
    JsapiResult
        wxPayAppOrderResult;
    try {
      wxPayAppOrderResult = wxPayService.createOrderV3(TradeTypeEnum.JSAPI,
          context.getContext()
              .getWxPayUnifiedOrderV3Request());
    } catch (WxPayException e) {
      throw new BusinessException(ResultCode.TransferStatusError, e.getReturnMsg());
    }
    log.info("预支付订单，下单成功：{}", wxPayAppOrderResult);
    context.getContext().setJsapiResult(wxPayAppOrderResult);
    return R.ok(wxPayAppOrderResult);
  }
```

### 预支付订单保存-save阶段

1. **记录日志：**
   - 使用日志记录器 `log` 记录保存预支付订单的日志信息。

2. **设置预支付订单过期时间：**
   - 利用 Redis 缓存将预支付订单信息存储起来，使用 `redisTemplate.opsForValue().set` 方法。
   - 设置键为 `"prepay:" + context.getContext().getOrderId()`，值为 `context.getContext().getJsapiResult()`。
   - 设置过期时间为 1 小时，即预支付订单的有效期为 1 小时。

3. **返回结果：**
   - 返回一个包含预支付订单结果的 `R` 对象，其中状态码表示成功，数据部分为预支付订单的结果对象。

总体而言，`save` 方法主要用于保存预支付订单的信息到 Redis 缓存中，并设置了预支付订单的过期时间。通过保存预支付订单信息到缓存中，可以在下次支付请求时直接获取缓存中的信息，避免了重复发起支付请求。返回的 `R` 对象包含了预支付订单结果作为成功的标志。

```java
  @Override
  public R<WxPayUnifiedOrderV3Result.JsapiResult> save(String nextState,
      StateContext<PrepayWeChatContext> context) {
    log.info("保存预支付订单");
    // 一个小时后预支付订单过期
    redisTemplate.opsForValue()
        .set("prepay:" + context.getContext().getOrderId(),
            context.getContext().getJsapiResult(),
            1, TimeUnit.HOURS);
    return R.ok(context.getContext().getJsapiResult());
  }
```

## 小程序发起支付

对应支付流程图中的9和13阶段。

在前端发起支付的过程中，通过按钮点击事件 `handlePay` 触发支付操作。以下是该前端代码的主要步骤解释：

1. **按钮点击事件：**
   - 在页面中通过 `<nut-button>` 组件渲染了一个按钮，点击按钮触发 `handlePay` 方法。

2. **支付处理函数 `handlePay`：**
   - 使用 `api.productOrderController.prepay` 发起请求，该请求向后端发起预支付订单的请求，其中传递了订单的 `id`。
   - 在请求成功后，获取后端返回的支付参数。

3. **调用 `Taro.requestPayment`：**
   - 使用 Taro 框架的 `Taro.requestPayment` 方法发起微信支付。
   - 传递了微信支付所需的参数，包括 `nonceStr`、`package`、`paySign`、`timeStamp`、`signType` 等。
   - 定义了支付成功和支付失败的回调函数。

4. **支付成功回调：**
   - 在支付成功的回调函数中，显示支付成功的提示信息。

5. **支付失败回调：**
   - 在支付失败的回调函数中，将失败的信息打印到控制台。

总体而言，前端的支付流程是通过按钮点击触发支付处理函数 `handlePay`，该函数向后端发起请求获取支付参数，然后调用微信支付接口 `Taro.requestPayment` 进行支付。支付成功后显示成功提示，支付失败则在控制台打印失败信息。

`order-details.vue`

:::tabs
@tab html

```html
        <nut-button type="danger" @click="handlePay"
          >立即支付 ￥{{ order.payment.payAmount }}</nut-button
        >
```

@tab ts

```ts
const handlePay = () => {
  if (order.value) {
    api.productOrderController.prepay({ id: order.value.id }).then((res) => {
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
        },
        fail: (res) => {
          console.log(res);
        },
      });
    });
  }
};
```
