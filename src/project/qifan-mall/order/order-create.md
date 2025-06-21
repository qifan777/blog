---
category:
  - 起凡商城
tag:
  - 订单
  - 订单创建
order: 2
date: 2024-01-31
timeline: true
---
# 订单创建

![订单创建](image-1.png =x350)

## 枚举值添加

需要把创建人和编辑人的id替换成自己的id

```sql
INSERT INTO mall.dict (id, created_time, edited_time, creator_id, editor_id, key_id, key_en_name, key_name, dict_id, dict_name, dict_en_name, order_num) VALUES ('2a8a7427-9fb6-4ecb-822c-8b22fd493a93', '2024-01-26 11:08:34.090534', '2024-01-26 11:08:37.984915', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', 4, 'CLOSED', '已关闭', 1003, '商品订单状态', 'PRODUCT_ORDER_STATUS', 0);
INSERT INTO mall.dict (id, created_time, edited_time, creator_id, editor_id, key_id, key_en_name, key_name, dict_id, dict_name, dict_en_name, order_num) VALUES ('461a361d-073c-4574-aed1-c025e04a81a3', '2024-01-26 11:09:32.434369', '2024-01-26 11:13:54.428416', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', 5, 'REFUNDING', '退款中', 1003, '商品订单状态', 'PRODUCT_ORDER_STATUS', 0);
INSERT INTO mall.dict (id, created_time, edited_time, creator_id, editor_id, key_id, key_en_name, key_name, dict_id, dict_name, dict_en_name, order_num) VALUES ('56e8d930-6953-4f6a-875c-34d5c26802a5', '2024-01-26 11:03:49.162351', '2024-01-26 11:04:00.418344', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', 2, 'TO_BE_RECEIVED', '待收货', 1003, '商品订单状态', 'PRODUCT_ORDER_STATUS', 0);
INSERT INTO mall.dict (id, created_time, edited_time, creator_id, editor_id, key_id, key_en_name, key_name, dict_id, dict_name, dict_en_name, order_num) VALUES ('5c820b53-6545-45fd-8442-22f7e486fc8e', '2024-01-26 10:56:45.364997', '2024-01-26 11:02:58.744868', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', 0, 'TO_BE_PAID', '待付款', 1003, '商品订单状态', 'PRODUCT_ORDER_STATUS', 0);
INSERT INTO mall.dict (id, created_time, edited_time, creator_id, editor_id, key_id, key_en_name, key_name, dict_id, dict_name, dict_en_name, order_num) VALUES ('a1a13655-7328-45c3-8cdd-dc0d41ef5792', '2024-01-26 11:06:10.939935', '2024-01-26 11:06:16.216645', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', 3, 'TO_BE_EVALUATED', '待评价', 1003, '商品订单状态', 'PRODUCT_ORDER_STATUS', 0);
INSERT INTO mall.dict (id, created_time, edited_time, creator_id, editor_id, key_id, key_en_name, key_name, dict_id, dict_name, dict_en_name, order_num) VALUES ('f0e0c95e7ad249deb9359691d009fd7a', '2024-02-18 15:08:27.511795', '2024-02-18 15:10:19.268405', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', 6, 'TO_BE_CREATE', '待创建', 1003, '商品订单状态', 'PRODUCT_ORDER_STATUS', 0);
INSERT INTO mall.dict (id, created_time, edited_time, creator_id, editor_id, key_id, key_en_name, key_name, dict_id, dict_name, dict_en_name, order_num) VALUES ('fc930d38-0612-4217-91ab-809a5be03656', '2024-01-26 11:02:08.987958', '2024-01-26 11:02:22.277984', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', 1, 'TO_BE_DELIVERED', '待发货', 1003, '商品订单状态', 'PRODUCT_ORDER_STATUS', 0);

INSERT INTO mall.dict (id, created_time, edited_time, creator_id, editor_id, key_id, key_en_name, key_name, dict_id, dict_name, dict_en_name, order_num) VALUES ('1a687b7d-9b24-47b0-aa57-e361812dcdf0', '2024-01-26 11:10:49.521488', '2024-01-26 11:10:49.521488', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', 0, 'WE_CHAT_PAY', '微信支付', 1004, '支付类型', 'PAY_TYPE', 0);
INSERT INTO mall.dict (id, created_time, edited_time, creator_id, editor_id, key_id, key_en_name, key_name, dict_id, dict_name, dict_en_name, order_num) VALUES ('a268e25b-b3b7-4fc2-880d-5b97e1acab0b', '2024-01-26 11:11:40.133277', '2024-01-26 11:11:40.133277', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', 1, 'ALI_PAY', '支付宝', 1004, '支付类型', 'PAY_TYPE', 0);


```

添加完之后调用该接口生成枚举类

```shell
GET http://localhost:8877/dict/java
```

## 表/实体类创建

:::tabs

@tab 商品订单

```sql
create table product_order
(
    id             varchar(36) not null
        primary key,
    created_time   datetime(6) not null,
    edited_time    datetime(6) not null,
    creator_id     varchar(36) not null,
    editor_id      varchar(36) not null,
    payment_id     varchar(36) not null,
    address_id     varchar(36) not null,
    status         varchar(36) not null,
    remark         text        null
)
```

```java
@Entity
@GenEntity
public interface ProductOrder extends BaseEntity {

  @GenField(value = "备注", order = 0)
  String remark();

  @GenField(value = "订单状态", order = 1, type = ItemType.SELECTABLE, dictEnName = DictConstants.PRODUCT_ORDER_STATUS)
  ProductOrderStatus status();

  @OneToOne
  Payment payment();

  @OneToOne
  Address address();

  @OneToMany(mappedBy = "productOrder")
  @Valid
  @Size(min = 1, message = "订单至少需要一个商品")
  @NotNull(message = "订单至少需要一个商品")
  List<ProductOrderItem> items();
}
```

这个`ProductOrder`实体类设计是电商系统中订单模块的核心部分，它继承了`BaseEntity`基础实体接口。

 实体关系映射 (Jimmer注解)

- `@Entity` 表示这是一个Java持久化实体，将会映射到数据库的`product_order`表。
- `@OneToOne` 关系用于表示一个订单对应一个支付详情记录和一个收货地址信息。例如，通过`payment()`方法可以获取到与该订单相关的具体支付详情，包括支付方式、金额、时间等；而`address()`方法则能获取到用户下单时选择的配送地址信息。
- `@OneToMany(mappedBy = "productOrder")` 表示一个订单可以包含多个商品订单项，与`ProductOrderItem`实体之间是一对多的关系。其中，`mappedBy`属性指定了关联关系在对方实体类（即`ProductOrderItem`）中的维护端字段。

字段解释

1. **备注（remark）**：
   - 该字段是一个字符串类型，用于记录关于此订单的任何额外信息或者用户特殊要求，例如用户对配送、包装等的个性化说明。

2. **订单状态（status）**：
   - 使用枚举类型 `ProductOrderStatus` 表示订单的不同状态，如待支付、已支付、待发货、已发货、已完成、已取消等。通过 `@GenField` 注解定义为可选列表类型，在前端展示时可以从字典表（DictConstants.PRODUCT_ORDER_STATUS）中获取对应的选项。

3. **payment**：
   - 这是一个一对一关联关系，表示每个商品订单都有一个与之关联的支付记录（Payment）。当需要查询订单支付详情时，可以通过这个字段直接访问关联的 `Payment` 实体。

4. **address**：
   - 同样是一对一关联关系，关联到用户的收货地址信息（Address）。存储订单配送的具体地址信息。

5. **items**：
   - 通过一对多关联，定义了一个包含多个 `ProductOrderItem` 的列表，代表订单中包含的商品明细项。
   - 使用 `@Valid` 注解表示列表中的每个元素都必须是有效的 `ProductOrderItem` 实体。
   - `@Size(min = 1, message = "订单至少需要一个商品")` 指定订单至少包含一项商品，否则会抛出校验异常。
   - `@NotNull(message = "订单至少需要一个商品")` 也确保了这一约束，即不能为空列表。

@tab 商品订单项

```sql
create table product_order_item
(
    id               varchar(36) not null
        primary key,
    created_time     datetime(6) not null,
    edited_time      datetime(6) not null,
    creator_id       varchar(36) not null,
    editor_id        varchar(36) not null,
    product_order_id varchar(36) not null,
    product_sku_id   varchar(36) not null,
    count            int         not null
);
```

```java
@Entity
public interface ProductOrderItem extends BaseEntity {

  @ManyToOne
  @Key
  ProductOrder productOrder();

  @ManyToOne
  @Key
  ProductSku productSku();

  @IdView
  String productOrderId();

  @IdView
  @NotBlank(message = "商品sku不能为空")
  String productSkuId();

  @Column(name = "count")
  @Min(value = 1, message = "商品数量不能少于1")
  int skuCount();
}
```

`ProductOrderItem`实体类设计主要是为了实现电商系统中订单项（商品详情）的管理，它是`ProductOrder`与`ProductSku`之间多对多关系的一种体现。

1. **关联订单和商品SKU**：
   - 使用`@ManyToOne`注解表明每个订单项都对应一个具体的订单 (`ProductOrder`) 和一个商品SKU (`ProductSku`)。通过这种方式将订单与具体购买的商品细节紧密关联起来。

2. **复合主键设计**：
   - `productOrderId` 和 `productSkuId` 两个字段共同组成订单项的唯一标识，采用复合主键来确保即使同一订单中有多个相同商品的情况也能区分不同行记录。
   - `@Key` 注解表示这两个字段是此实体类的主键部分。
   - `@NotBlank(message = "商品sku不能为空")` 确保商品SKU ID必填，因为这是识别商品的关键信息。

3. **商品数量记录**：
   - `skuCount` 字段记录了用户在该订单中购买的某一特定商品SKU的数量，通过`@Min(value = 1, message = "商品数量不能少于1")` 进行数据校验，确保商品数量的合法性。

4. **业务逻辑约束**：
   - 类中包含了必要的业务规则约束，如商品数量至少为1，确保订单项记录的是有效购买行为。

`ProductOrderItem`实体类的设计思路就是建立一个连接订单和商品SKU的桥梁，用于详细记录订单中的每一件商品的具体信息，包括购买数量。

@tab 支付详情

```sql
create table payment
(
    id             varchar(36)    not null
        primary key,
    created_time   datetime(6)    not null,
    edited_time    datetime(6)    not null,
    creator_id     varchar(36)    not null,
    editor_id      varchar(36)    not null,
    pay_type       varchar(36)    not null,
    pay_time       datetime       null,
    pay_amount     decimal(10, 2) not null,
    vip_amount     decimal(10, 2) not null,
    coupon_amount  decimal(10, 2) not null,
    product_amount decimal(10, 2) not null,
    delivery_fee   decimal(10, 2) not null,
    trade_no       varchar(36)    null
);
```

```java
@Entity
public interface Payment extends BaseEntity {

  @GenField(value = "支付类型", order = 1, type = ItemType.SELECTABLE, dictEnName = DictConstants.PAY_TYPE)
  PayType payType();

  @NotNull
  @GenField(value = "实付金额", order = 2, type = ItemType.INPUT_NUMBER)
  BigDecimal payAmount();

  @NotNull
  @GenField(value = "配送费", order = 3, type = ItemType.INPUT_NUMBER)
  BigDecimal deliveryFee();

  @NotNull
  @GenField(value = "优惠卷减免", order = 4, type = ItemType.INPUT_NUMBER)
  BigDecimal couponAmount();

  @NotNull
  @GenField(value = "VIP减免", order = 5, type = ItemType.INPUT_NUMBER)
  BigDecimal vipAmount();

  @NotNull
  @GenField(value = "商品金额", order = 6, type = ItemType.INPUT_NUMBER)
  BigDecimal productAmount();

  @GenField(value = "支付时间", order = 7, type = ItemType.DATETIME)
  @Null
  LocalDateTime payTime();

  @GenField(value = "支付订单号", order = 8)
  @Null
  String tradeNo();
}
```

`Payment`实体类它主要负责存储和管理与支付相关的详细信息。

1. **支付类型（payType）**：
   - 使用枚举类型 `PayType` 来表示支付方式，如支付宝、微信支付、银行卡等。通过 `@GenField` 注解可以自动生成前端展示所需的配置信息，并使用字典表（DictConstants.PAY_TYPE）来维护可选的支付类型。

2. **实付金额（payAmount）、配送费（deliveryFee）、优惠券减免（couponAmount）、VIP减免（vipAmount）、商品金额（productAmount）**：
   - 这些字段分别记录了用户实际支付的总金额、订单中的运费、使用的优惠券抵扣额、VIP等级享受的优惠金额以及商品本身的总价。这些数据用于财务对账、结算和分析用户的消费行为。

3. **支付时间（payTime）**：
   - 用于记录订单完成支付的具体时间，这对于追踪交易状态、计算退款期限和进行数据分析至关重要。
   - 使用 `LocalDateTime` 类型存储日期和时间，并允许为空（`@Null`），因为可能有未支付的订单或正在处理中的支付请求。

4. **支付订单号（tradeNo）**：
   - 这是第三方支付平台生成的唯一标识符，通常用于关联到具体的支付交易。当需要查询支付平台上的交易详情或者进行退款操作时，支付订单号是必不可少的信息。

总结来说，`Payment`实体类的设计充分考虑了电商系统中支付环节的各种细节需求，不仅记录了支付的基本信息，还涵盖了费用构成、支付状态及与第三方支付平台交互所需的关键数据，确保整个支付过程能够被准确、完整地记录和追溯。

:::

## 创建订单接口

:::tabs
@tab 创建订单Dto
创建dto修改

`ProductOrderInput` 是一个用于创建订单时的数据传输对象（DTO, Data Transfer Object），它包含了从客户端传递到服务器端创建新订单所需的部分属性，但排除了某些字段并添加了一些额外的细节。

```text
input ProductOrderInput {
    #allScalars(ProductOrder)
    id? # 可选字段，在创建新订单时不需要提供。
    -status # 排除字段，表示在创建订单输入时不包含“status”属性，因为订单状态通常是由系统根据业务逻辑自动设置的，如默认为待支付状态。
    id(address) 用户需要提供一个收货地址的ID，这个地址已经在系统中存在，通过这个ID将订单与具体的收货地址关联起来
    items {            # 订单项集合，包含每个商品SKU的数量和ID信息。
        skuCount       # 每个商品SKU的数量，例如购买某款商品5件。
        productSkuId   # 商品SKU的唯一标识符，用于确定具体购买的是哪一款商品的不同变体。
    }
    payment{
      payType
    }
}
```

实际案例： 假设一位用户要下单购买两个不同商品，分别是商品A的红色款式3件，商品B的蓝色款式2件。那么对应的 ProductOrderInput 示例数据可能是这样的：

```json
{
  "addressId": "1234", // 假设这是已存在的一个有效地址ID
  "items": [
    {
      "skuCount": 3,
      "productSkuId": "AS001-RED"
    },
    {
      "skuCount": 2,
      "productSkuId": "BS002-BLUE"
    }
  ]
}
```

@tab API

```java
  @PostMapping("create")
  public String create(@RequestBody @Validated ProductOrderInput productOrder) {
    return productOrderService.create(productOrder);
  }
```

@tab Service

- 接收一个 `ProductOrderInput` 类型的参数，表示创建订单时的输入信息。
- 构建了一个 `StateEvent` 对象，用于描述订单状态迁移的事件。其中，订单状态为 "TO_BE_CREATE"，事件类型为 "CREATE"，场景ID为 `*`，业务码为 `*`。
- 创建一个 `NewCreateContext` 对象，并设置其 `productOrderInput` 属性。
- 构建了一个 `StateContext` 对象，该对象包含了状态事件和上下文信息。
- 调用 `stateMachine.action` 方法，传入状态上下文，执行订单创建的逻辑。
- 返回订单创建结果。

```java
  private final StateMachine stateMachine;
  
  public String create(ProductOrderInput productOrderInput) {
    StateEvent stateEvent = StateEvent.builder()
        .orderState(ProductOrderStatus.TO_BE_CREATE.getKeyEnName())
        .eventType("CREATE")
        .sceneId("*")
        .businessCode("PRODUCT_ORDER").build();
    NewCreateContext newCreateContext = new NewCreateContext().setProductOrderInput(
        productOrderInput);
    R<String> res = stateMachine.action(new StateContext<>(stateEvent, newCreateContext));
    return res.getResult();
  }
```

@tab 订单创建上下文

1. **`@Data` 注解：**
   - 使用 Lombok 提供的注解，自动生成 getter、setter、equals、hashCode 和 toString 方法。

2. **`@Accessors(chain = true)` 注解：**
   - 该注解表示生成的 setter 方法返回当前对象，以支持链式调用。

3. **属性：**
   - `productOrderInput`：用于存储创建订单时的输入信息，类型为 `ProductOrderInput`。
   - `payment`：用于存储支付信息，类型为 `Payment`。

```java
@Data
@Accessors(chain = true)
public class NewCreateContext {

  private ProductOrderInput productOrderInput;
  private Payment payment;
}
```

@tab 订单创建处理器
这是一个订单状态处理器 `NewCreateProcessor`，用于处理订单状态为 "TO_BE_CREATE"，事件为 "CREATE" 的情况。以下是对该处理器的主要特点和作用的解释：

1. **`@OrderStateProcessor` 注解：**
   - 标记了该类为订单状态处理器，并指定了处理的订单状态为 "TO_BE_CREATE"，事件为 "CREATE"。

2. **`@AllArgsConstructor` 注解：**
   - 使用 Lombok 提供的注解，生成包含所有参数的构造方法, 使得可以使用构造器注入依赖。

3. **继承自 `AbstractStateProcessor`：**
   - 该类继承了一个抽象的订单状态处理器 `AbstractStateProcessor`，并实现了其中的抽象方法。
   - 泛型类型为 `<String, NewCreateContext>`，表示该处理器处理的是返回结果类型为 `String`，上下文类型为 `NewCreateContext` 。

4. **`prepare` 方法：**
   - 在状态迁移之前进行准备数据的方法，这里主要是设置支付信息，通过调用 `PaymentDraft.$.produce` 方法构建支付信息的实体。
   - 在支付信息中设置了优惠券金额、商品金额、实际支付金额、运费、VIP 金额等。

5. **`check` 方法：**
   - 在状态迁移之前进行校验的方法，主要校验商品库存是否足够，以及其他一些业务规则。
   - 如果库存不足，抛出相应的业务异常。

6. **`getNextState` 方法：**
   - 根据业务逻辑确定订单状态迁移后的下一个状态，这里是将订单状态迁移到 "TO_BE_PAID"。

7. **`action` 方法：**
   - 执行具体的业务逻辑，例如扣减库存等操作。
   - 这里使用了一个库存表的更新操作，将商品库存进行扣减。

8. **`save` 方法：**
   - 执行状态迁移成功后的持久化操作，创建一个新的订单，并保存到数据库中。
   - 生成订单号，构建订单实体，并保存订单。

```java
@OrderStateProcessor(state = "TO_BE_CREATE", event = "CREATE", bizCode = "PRODUCT_ORDER")
@Service
@AllArgsConstructor
public class NewCreateProcessor extends AbstractStateProcessor<String, NewCreateContext> {

  private final ProductOrderRepository productOrderRepository;
  private final ProductSkuRepository productSkuRepository;

  @Override
  public void prepare(StateContext<NewCreateContext> context) {
    context.getContext().setPayment(PaymentDraft.$.produce(
        context.getContext().getProductOrderInput().getPayment().toEntity(),
        draft -> draft
            .setId(IdUtil.fastSimpleUUID())
            .setCouponAmount(BigDecimal.ZERO)
            // 商品价格计算
            .setProductAmount(BigDecimal.valueOf(0.01))
            // 实际支付价格计算
            .setPayAmount(BigDecimal.valueOf(0.01))
            // 运费计算
            .setDeliveryFee(BigDecimal.ZERO)
            // VIP价格计算
            .setVipAmount(BigDecimal.ZERO)));
  }

  @Override
  public R<String> check(StateContext<NewCreateContext> context) {
    context.getContext().getProductOrderInput().getItems().forEach(item -> {
      ProductSku productSku = productSkuRepository
          .findById(item.getProductSkuId())
          .orElseThrow(() -> new BusinessException(
              ResultCode.NotFindError, "商品SKU不存在"));
      if (productSku.stock() - item.getSkuCount() <= 0) {
        throw new BusinessException(ResultCode.ValidateError, "商品库存不足");
      }
      // 优惠券校验
    });
    return R.ok();
  }

  @Override
  public String getNextState(StateContext<NewCreateContext> context) {
    return ProductOrderStatus.TO_BE_PAID.getKeyEnName();
  }

  @Override
  public R<String> action(String nextState, StateContext<NewCreateContext> context) {
    context.getContext().getProductOrderInput().getItems().forEach(productOrderItem -> {
      // 扣减库存
      ProductSkuTable t = ProductSkuTable.$;
      productSkuRepository
          .sql()
          .createUpdate(t)
          .set(t.stock(), t.stock().minus(productOrderItem.getSkuCount()))
          .where(t.id().eq(productOrderItem.getProductSkuId()))
          .execute();
    });
    // 扣减优惠券等等
    return R.ok();
  }

  @Override
  public R<String> save(String nextState, StateContext<NewCreateContext> context) {
    String orderId = IdUtil.fastSimpleUUID();
    ProductOrder entity = ProductOrderDraft.$.produce(context.getContext().getProductOrderInput()
            .toEntity(),
        draft -> {
          // 设置订单项关联的订单id
          draft.setItems(draft.items().stream().map(item -> {
            return ProductOrderItemDraft.$.produce(item, productOrderItemDraft -> {
              productOrderItemDraft.setProductOrderId(orderId);
            });
          }).toList());
          // 设置订单的id和状态
          draft
              .setId(orderId)
              .setStatus(ProductOrderStatus.valueOf(nextState));

          // 设置支付详情
          draft.setPayment(context.getContext().getPayment());
        });
    return R.ok(productOrderRepository.save(entity).id());
  }

  @Override
  public void after(StateContext<NewCreateContext> context) {

  }
}
```

:::

:::info
[订单状态机](./state-machine.md)
:::

## 路由配置

```json {7}
export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/user/index",
    "pages/address/address-list",
    "pages/address/address-save",
    "pages/order/order-create",
  ],
//   忽略...
});

```

## 购物车提交处理

点击提交购物车时，购物车会把已选的SKU通过提交购物车事件向外传播，该方法处理提交购物车事件，并将已选的SKU传给订单提交页面。

1. 当调用`handleSubmit`函数时，它接收一个参数`catItems`，这个数组包含了用户购物车中已选择的商品项目（CartItem对象列表），每个CartItem通常会包含商品的SKU信息（Stock Keeping Unit，库存量单位）以及其他相关信息，如数量、价格等。

2. 函数内部使用了Taro的API `Taro.navigateTo` 来进行页面跳转，将用户的当前路径导航至订单创建页面——"/pages/order/order-create"。

3. 在页面跳转成功后（即`success`回调函数中），通过调用`Taro.eventCenter.trigger`方法触发了一个自定义全局事件——"submitCart"，同时将传入的`catItems`作为参数传递出去。这样，在订单创建页面或其他监听此事件的地方，可以通过`Taro.eventCenter.on`订阅该事件，并接收到这些选中的商品SKU信息，进而实现从购物车到订单页面的数据传输和订单生成操作。

```html
  <cart-list @submit="handleSubmit"></cart-list>
```

```ts
const handleSubmit = (catItems: CartItem[]) => {
  Taro.navigateTo({
    url: "/pages/order/order-create",
    success: () => {
      Taro.eventCenter.trigger("submitCart", catItems);
    },
  });
};
```

## 订单创建页面

### 地址选择

:::tabs
@tab html

1. 地址选择弹出。
   - `v-if="address"`：只有当`address`这个数据属性存在时，才会渲染这部分内容。
   - `@click="addressChooseVisible = true"`：点击此组件时，会触发事件处理器，将`addressChooseVisible`设置为`true`，从而打开地址选择弹出框。

2. `nut-cell`组件中：
   - 使用了`location2`图标组件来表示位置信息。
   - 通过插槽`#title`展示当前选中的地址，由`address-row`组件负责呈现详细信息。
   - 最后，有一个指向右侧的小箭头图标，表明用户可以更换地址。

3. 接下来是一个`<address-choose>`自定义组件，它是一个地址选择器：
   - `v-model:visible="addressChooseVisible"`：该组件使用Vue的`v-model`指令与`addressChooseVisible`双向绑定，控制其可见性，即是否显示地址选择弹出框。
   - `@choose="handleAddressChose"`：监听并绑定`choose`事件，当用户在地址列表中选择了一个新地址时，会触发`handleAddressChose`方法。

```html
<template>
  <div class="order-submit">
    <div class="address" v-if="address">
      <nut-cell is-link center @click="addressChooseVisible = true">
        <template #icon>
          <location2
            color="red"
            size="20"
            style="margin-right: 10px"
          ></location2>
        </template>
        <template #title>
          <address-row :address="address"></address-row>
        </template>
        <template #link>
          <rect-right></rect-right>
        </template>
      </nut-cell>
    </div>
    <address-choose
      v-model:visible="addressChooseVisible"
      @choose="handleAddressChose"
    ></address-choose>
  </div>
</template>
```

@tab ts

1. 导入依赖：
   - `CartItem`：自定义类型，表示购物车中的商品项。
   - `AddressDto`：地址详情Dto。
   - `AddressChoose`：自定义组件，它是一个页面级别的组件，用户可以在该组件内进行地址的选择操作。
   - `RectRight` 和 `Location2`：来自 `@nutui/icons-vue-taro`，这两个组件可能是图标库中的两个图标组件，分别代表矩形右箭头和位置图标。
   - `api`：从 `@/utils/api-instance` 导入的API实例，封装了与服务器通信的方法。

2. 定义响应式状态变量：
   - `addressChooseVisible`：用于控制地址选择弹窗的显示隐藏状态。
   - `address`：存储当前选中的用户地址信息。

3. 定义事件处理器函数：
   - `handleAddressChose`：当用户在 `AddressChoose` 组件中选择了新的地址时，会触发这个函数，并将新选择的地址作为参数传递进来。
   - 在函数内部，通过 `address.value = value` 将新选择的地址赋值给响应式变量 `address`，这样在 UI 上展示的地址就会根据用户的最新选择实时更新。

```ts
import Taro from "@tarojs/taro";
import { computed, ref } from "vue";
import { CartItem } from "@/components/cart/cart-store";
import { AddressDto } from "@/apis/__generated/model/dto";
import AddressChoose from "@/pages/address/address-choose.vue";
import { RectRight, Location2 } from "@nutui/icons-vue-taro";
import { api } from "@/utils/api-instance";

const addressChooseVisible = ref(false);
const address = ref<AddressDto["AddressRepository/SIMPLE_FETCHER"]>();
const handleAddressChose = (
  value: AddressDto["AddressRepository/SIMPLE_FETCHER"],
) => {
  address.value = value;
};
```

@tab css

```scss
page {
  background-color: rgba(black, 0.05);
}

.order-submit {
  .address {
    background-color: white;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    .nut-cell {
      margin-top: 0;
    }
    .address-row {
      padding: 0;
    }
  }
}
```

:::

### 商品Sku展示和价格详情

用户提交订单时呈现他们所选商品的具体信息和预估订单费用概览。

:::tabs

@tab html

1. **商品列表**：
   - 使用 `v-for` 循环遍历 `cartItems` （包含了购物车中的所有已选商品项）。
   - 对于每个商品项 `item`，生成一个名为 `product-row` 的自定义组件实例，并将商品 SKU 信息以及品牌信息传入作为属性值。

   ```html
   <product-row
     v-for="item in cartItems"
     :key="item.sku.values.join(',')"
     :product="{
       ...item.sku,
       description: item.sku.values.join(','),
       brand: item.product.brand,
     }"
   >
    <template #operation>
      <div class="sku-count">x{{ item.count }}</div>
    </template>
   </product-row>
   ```

   - 在每个 `product-row` 组件内部，通过插槽 (`<template #operation>`) 渲染出商品数量，显示为 `x{{ item.count }}`。

2. **订单价格详情**：
   - 使用 `nut-cell-group` 和多个嵌套的 `nut-cell` 组件展示订单总价、配送费、优惠券抵扣金额及VIP优惠等详细信息。
   - 目前这些金额都暂时设置为 `0`，之后会在后端进行计算并替换这些静态值。

```html
<template>
  <div class="order-submit">
    <!-- 忽略地址信息... -->
    <div class="product-list">
      <product-row
        v-for="item in cartItems"
        :key="item.sku.values.join(',')"
        :product="{
          ...item.sku,
          description: item.sku.values.join(','),
          brand: item.product.brand,
        }"
      >
        <template #operation>
          <div class="sku-count">x{{ item.count }}</div>
        </template>
      </product-row>
    </div>
    <nut-cell-group class="summary">
      <nut-cell title="商品总价">
        <template #desc>
          <div class="value">￥{{ productPrice }}</div>
        </template>
      </nut-cell>
      <nut-cell title="配送费">
        <template #desc>
          <div class="value">￥{{ 0 }}</div>
        </template>
      </nut-cell>
      <nut-cell title="优惠券">
        <template #desc>
          <div class="value">-￥{{ 0 }}</div>
        </template>
      </nut-cell>
      <nut-cell title="vip优惠">
        <template #desc>
          <div class="value">-￥{{ 0 }}</div>
        </template>
      </nut-cell>
    </nut-cell-group>
  </div>
</template>
```

@tab ts

1. **定义`cartItems` ref数组**：

   ```javascript
   const cartItems = ref<CartItem[]>([]);
   ```

2. **定义计算属性 `productPrice`**：

   ```javascript
   const productPrice = computed(() => {
     return cartItems.value.reduce(
       (prev, cur) => prev + cur.sku.price * cur.count,
       0,
     );
   });
   ```

   `productPrice` 是一个计算属性，它依赖于 `cartItems` 数组的变化而自动更新。这里的计算逻辑是对 `cartItems` 中每一个商品项的价格（`cur.sku.price`）乘以购买数量（`cur.count`），然后累加所有商品的总价值，初始值设为 `0`。

3. **监听提交购物车事件**：

   ```javascript
   Taro.eventCenter.on("submitCart", (items: CartItem[]) => {
     cartItems.value = items;
   });
   ```

   使用Taro的全局事件中心 (`Taro.eventCenter`) 监听名为 "submitCart" 的事件。当这个事件被触发时，回调函数会接收到一个 `CartItem` 类型的数组 `items`，并将这个数组赋值给 `cartItems` ，从而更新购物车中的商品列表。

整体逻辑：接收到新的购物车商品数据时，通过监听的“submitCart”事件将新数据同步到 `cartItems` 中，并自动更新计算出的商品总价

```ts
// 忽略地址...
const cartItems = ref<CartItem[]>([]);
const productPrice = computed(() => {
  return cartItems.value.reduce(
    (prev, cur) => prev + cur.sku.price * cur.count,
    0,
  );
});
Taro.eventCenter.on("submitCart", (items: CartItem[]) => {
  cartItems.value = items;
});
```

@tab css

```scss
.order-submit {
  // 忽略地址样式...
  // 商品SKU展示样式
  .product-list {
    background-color: white;
    padding: 32px;
    border-radius: 12px;
    margin-bottom: 30px;
    .sku-count {
      font-size: 28px;
    }
  }
  // 价格详情样式
  .summary {
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    .value {
      color: rgba(black, 0.9);
      font-weight: bold;
    }
  }
}
```

:::

### 订单提交

:::tabs
@tab html

```html
<template>
  <div class="order-submit">
    <div class="submit-bar-wrapper">
      <div class="submit-bar">
        <div class="price">￥{{ productPrice }}</div>
        <nut-button type="danger" @click="saveOrder">提交订单</nut-button>
      </div>
    </div>
  </div>
</template>
```

@tab ts

处理订单提交的逻辑。具体步骤如下：

1. **地址验证**：
   - 首先检查 `address.value` 是否存在（即用户是否已选择收货地址）。若未选择，则通过 Taro 的 `Taro.showToast` API 显示一个提示信息“请选择收货地址”，并返回以阻止后续操作。

2. **发起API请求**：
   - 如果地址已选择，则调用后端接口 `api.productOrderController.create` 创建一个新的订单。
   - 请求体([ProductOrderInput](#创建订单接口))包含以下字段：
     - `remark`：空字符串，代表订单备注，默认为空。
     - `items`：基于购物车商品数据（`cartItems.value`）映射生成，每个元素是一个对象，包含商品SKU ID (`productSkuId`) 和购买数量 (`skuCount`)。
     - `addressId`：用户选择的收货地址ID。
     - `payment.payType`: 支付类型为微信支付

3. **处理响应结果**：
   - 当后端成功创建订单并返回响应时，打印响应内容到控制台，并使用 `Taro.showToast` 展示一个成功的提示消息：“订单创建成功”。

```ts
const saveOrder = () => {
  if (!address.value) {
    Taro.showToast({
      title: "请选择收货地址",
      icon: "none",
      duration: 1000,
    });
    return;
  }
  api.productOrderController
    .create({
      body: {
        remark: "",
        items: cartItems.value.map((item) => ({
          productSkuId: item.sku.id,
          skuCount: item.count,
        })),
        addressId: address.value.id,
        payment: {
          payType: "WE_CHAT_PAY",
        }
      },
    })
    .then((res) => {
      console.log(res);
      Taro.showToast({
        title: "订单创建成功",
        icon: "success",
        duration: 1000,
      });
    });
};
```

@tab css

```scss
.order-submit {
  .submit-bar-wrapper {
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: white;

    .submit-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      width: 700px;
      .price {
        font-size: 34px;
        color: red;
      }
    }
  }
}
```

:::
