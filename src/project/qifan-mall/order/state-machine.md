---
category:
  - 起凡商城
tag:
  - 订单
  - 状态机
order: 1
date: 2024-02-18
timeline: true
---
# 订单状态机

订单有待支付/待发货/待收货/待评价/已完成/已关闭/退款中等状态，每个状态下的操作结果都不一样。
比如待支付状态下取消订单不需要退款，而待发货状态下取消订单需要退款。待收货时就不能取消订单，需要走退款流程。
因此状态机就是为了实现，不同的状态下操作不一样，同样的操作在不同的状态下执行不同的逻辑。

## 上下文对象

每个处理器的上下文，可以是任意对象，比如订单id，支付详情，创建订单表单等等。因此`StateContext`中的`context`是泛型`C`。除此之外还有固定的操作事件对象，用于寻找对应的订单处理器。

```java
@Data
@Builder
public class StateContext<C> {

  /**
   * 订单操作事件
   */
  private StateEvent stateEvent;

  /**
   * 业务可定义的上下文泛型对象
   */
  private C context;

  public StateContext(StateEvent stateEvent, C context) {
    this.stateEvent = stateEvent;
    this.context = context;
  }

  /**
   * 订单状态迁移事件
   */
  @Data
  @Accessors(chain = true)
  @Builder
  public static class StateEvent {

    /**
     * 订单状态
     */
    private String orderState;
    /**
     * 触发事件
     */
    private String eventType;
    /**
     * 业务编码
     */
    private String businessCode;
    /**
     * 业务场景
     */
    private String sceneId;
  }
}
```

## 订单处理器

### 处理器接口

订单状态处理器接受一个上下文，返回处理结果。

1. **泛型参数：**
   - `T`: 表示处理器执行的操作返回的数据类型。
   - `C`: 表示处理器接受数据的类型。

```java
public interface StateProcessor<T, C> {
    R<T> action(OrderStateContext<C> context);
}
```

### 细化处理步骤

上面的处理器接口只是定义了逻辑入口，我们可以使用模板模式在内部将action细化为`prepare`, `check`, `getNextState`, `action`, `save`, `after`.

```java
public interface StateActionStep<T, C> {

  /**
   * 准备数据
   */
  default void prepare(OrderStateContext<C> context) {
  }

  /**
   * 校验
   */
  R<T> check(OrderStateContext<C> context);

  /**
   * 获取当前状态处理器处理完毕后，所处于的下一个状态
   */
  String getNextState(OrderStateContext<C> context);

  /**
   * 状态动作方法，主要状态迁移逻辑
   */
  R<T> action(String nextState, OrderStateContext<C> context);

  /**
   * 状态数据持久化
   */
  R<T> save(String nextState, OrderStateContext<C> context);

  /**
   * 状态迁移成功，持久化后执行的后续处理
   */
  void after(OrderStateContext<C> context);
}
```

### 抽象处理器模板模式编排步骤

抽象的订单状态处理器类 `AbstractStateProcessor`，实现了 `StateActionStep` 和 `StateProcessor` 接口，并提供了一个模板方法 `action`。

1. **泛型参数：**
   - `T`: 表示处理器执行的操作返回的数据类型。
   - `C`: 表示处理器接受数据的类型。

2. **`@SneakyThrows` 注解：**
   - 这是 Lombok 提供的注解，它可以自动处理 checked exceptions，减少了代码中异常处理的冗余。但要注意，它会将 checked exception 转换为 unchecked exception，因此需要谨慎使用。

3. **模板方法 `action`：**
   - 这是一个具体的订单状态处理逻辑的模板方法。它按照一定的顺序调用了 `prepare`、`check`、`getNextState`、`action`、`save` 和 `after` 方法，以完成订单状态的处理过程。
   - 在 `prepare` 方法中准备数据，`check` 方法中进行校验，`getNextState` 获取下一个状态，`action` 执行具体业务逻辑，`save` 进行持久化，最后调用 `after` 完成处理后的操作。
   - 在每个步骤中，如果有错误发生，会立即返回错误结果，中止后续步骤的执行。

4. **方法调用顺序：**
   - 调用顺序是 `prepare` -> `check` -> `getNextState` -> `action` -> `save` -> `after`。
   - 这个顺序保证了在执行业务逻辑前进行了数据准备和校验，并在最后进行了持久化和后续处理。

5. **异常处理：**
   - 使用了 `@SneakyThrows` 注解，对异常进行了简化处理，将 checked 异常转换为 unchecked 异常。在实际应用中需要确保异常处理的正确性和可维护性。

这个抽象类提供了一个通用的订单状态处理模板，具体的订单状态处理器只需要继承这个抽象类并实现相应的方法即可，方便了订单状态机的扩展和定制。

```java
public abstract class AbstractStateProcessor<T, C> implements StateActionStep<T, C>, StateProcessor<T, C> {
    @SneakyThrows
    @Override
    public R<T> action(OrderStateContext<C> context) {
        R<T> result = null;

        // 数据准备
        this.prepare(context);
        // 串行校验器
        result = this.check(context);
        if (!result.isSuccess()) {
            return result;
        }
        // getNextState不能在prepare前，因为有的nextState是根据prepare中的数据转换而来
        String nextState = this.getNextState(context);
        // 业务逻辑
        result = this.action(nextState, context);
        if (!result.isSuccess()) {
            return result;
        }
        // 持久化
        result = this.save(nextState, context);
        if (!result.isSuccess()) {
            return result;
        }
        // after
        this.after(context);
        return result;

    }
}
```

### 处理器注解

在处理器上添加`@OrderStateProcessor`代表该处理器处理的状态+事件+（场景和业务）。默认情况业务和场景是`*`的，表示所有场景和业务都处理。

例如：`@OrderStateProcessor(state = "TO_BE_PAID", event = "PREPAY", sceneId = "WE_CHAT_PAY")`处理的是待支付状态下的订单，预支付事件，场景是微信支付。通过这种方式可以细力度区分各种状态和事件还要场景。体现了单一职责的设计原理。

```java
/**
 * 状态机引擎的处理器注解标识
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Component
public @interface OrderStateProcessor {

  /**
   * 指定状态
   */
  String[] state() default {};

  /**
   * 业务
   */
  String[] bizCode() default {"*"};

  /**
   * 场景
   */
  String[] sceneId() default {"*"};

  /**
   * 事件
   */
  String event();
}
```

:::tip
在`OrderStateProcessor`上添加 `@Component`，使得被`@OrderStateProcessor`标记的处理器会被识别为`bean`。
:::

## 处理器注册

 `StateProcessorRegistry` 它实现了 `BeanPostProcessor` 接口，用于在Spring bean初始化之后进行处理。

1. **`stateProcessorMap` 静态成员变量：**
   - 使用 `ConcurrentHashMap` 来存储订单状态处理器的注册信息。结构是三层嵌套的 Map，第一层 key 是订单状态，第二层 key 是订单状态对应的事件，第三层 key 是业务码和场景的组合，值是对应的处理器列表。

2. **`acquireStateProcessor` 方法：**
   - 根据订单状态、事件类型、业务码和场景获取对应的订单状态处理器列表。

3. **`postProcessAfterInitialization` 方法：**
   - 是 `BeanPostProcessor` 接口的方法，用于在 bean 初始化后进行处理。
   - 对于实现了 `AbstractStateProcessor` 类并使用了 `OrderStateProcessor` 注解的 bean，会从注解中获取状态、事件、业务码和场景等信息，然后调用 `initProcessorMap` 方法进行注册。

4. **`initProcessorMap` 方法：**
   - 通过并行流处理状态、业务码和场景的组合，调用 `registerStateProcessor` 方法进行注册。

5. **`registerStateProcessor` 方法：**
   - 用于将订单状态处理器注册到 `stateProcessorMap` 中，按照订单状态、事件、业务码和场景的组合进行存储。

这个类的作用是提供一个中心化的地方，用于管理订单状态处理器的注册和获取。通过注解方式标记了订单状态处理器，将其注册到 `stateProcessorMap` 中。这样，状态机引擎在进行状态转换时可以根据订单状态、事件、业务码和场景快速查找到对应的处理器列表，方便进行后续的状态转换逻辑。使用并发安全的集合类，确保在多线程环境下的安全性。

```java
@Component
public class StateProcessorRegistry implements BeanPostProcessor {

  /**
   * 第一层key是订单状态。 第二层key是订单状态对应的事件，一个状态可以有多个事件。 第三层key是具体场景code，场景下对应的多个处理器，需要后续进行过滤选择出一个具体的执行。
   */
  private static Map<String, Map<String, Map<String, List<AbstractStateProcessor>>>> stateProcessorMap =
      new ConcurrentHashMap<>();

  public static List<AbstractStateProcessor> acquireStateProcessor(String orderState,
      String eventType, String businessCode,
      String sceneId) {
    List<AbstractStateProcessor> abstractStateProcessors =
        stateProcessorMap.get(orderState).get(eventType).get(businessCode + "@" + sceneId);
    return abstractStateProcessors;
  }

  @Override
  public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
    if (bean instanceof AbstractStateProcessor && bean.getClass().isAnnotationPresent(
        OrderStateProcessor.class)) {
      OrderStateProcessor annotation = bean.getClass().getAnnotation(OrderStateProcessor.class);
      String[] states = annotation.state();
      String event = annotation.event();
      String[] bizCodes = annotation.bizCode();
      String[] sceneIds = annotation.sceneId();
      initProcessorMap(states, event, bizCodes, sceneIds, stateProcessorMap,
          (AbstractStateProcessor<Object, Object>) bean);
    }
    return bean;
  }

  private <E extends StateProcessor<T, C>, T, C> void initProcessorMap(String[] states, String event,
      String[] bizCodes,
      String[] sceneIds,
      Map<String, Map<String, Map<String, List<E>>>> map,
      E processor) {
    for (String bizCode : bizCodes) {
      for (String sceneId : sceneIds) {
        Arrays.asList(states).parallelStream().forEach(orderStateEnum -> {
          registerStateProcessor(orderStateEnum, event, bizCode, sceneId, map, processor);
        });
      }
    }
  }

  /**
   * 初始化状态机处理器
   */
  public <E extends StateProcessor> void registerStateProcessor(String orderStateEnum, String event,
      String bizCode,
      String sceneId,
      Map<String, Map<String, Map<String, List<E>>>> map,
      E processor) {
    // state维度
    if (!map.containsKey(orderStateEnum)) {
      map.put(orderStateEnum, new ConcurrentHashMap<>());
    }
    Map<String, Map<String, List<E>>> stateTransformEventEnumMap = map.get(orderStateEnum);
    // event维度
    if (!stateTransformEventEnumMap.containsKey(event)) {
      stateTransformEventEnumMap.put(event, new ConcurrentHashMap<>());
    }
    // bizCode and sceneId
    Map<String, List<E>> processorMap = stateTransformEventEnumMap.get(event);
    String bizCodeAndSceneId = bizCode + "@" + sceneId;
    if (!processorMap.containsKey(bizCodeAndSceneId)) {
      processorMap.put(bizCodeAndSceneId, new CopyOnWriteArrayList<>());
    }
    processorMap.get(bizCodeAndSceneId).add(processor);
  }
}
```

## 状态机

`StateMachine`接收状态事件上下文，并根据当前状态事件找到对应的状态处理器，然后执行处理逻辑。通过调用 `StateProcessorRegistry` 类的方法，获取状态处理器列表，并进行相关的异常处理，确保状态机引擎的正常运行。

```java
@AllArgsConstructor
@Component
public class StateMachine {

  public <T, C> R<T> action(StateContext<C> context) {
    // 获取当前事件处理器
    StateProcessor<T, C> stateProcessor = this.getStateProcessor(context);
    // 执行处理逻辑
    return stateProcessor.action(context);
  }


  private <T, C> StateProcessor<T, C> getStateProcessor(StateContext<C> context) {
    StateEvent stateEvent = context.getStateEvent();
    // 根据状态+事件对象获取所对应的业务处理器集合
    List<AbstractStateProcessor> processorList =
        StateProcessorRegistry.acquireStateProcessor(stateEvent.getOrderState(),
            stateEvent.getEventType(), stateEvent.getBusinessCode(),
            stateEvent.getSceneId());
    if (processorList == null) {
      // 订单状态发生改变
      if (!Objects.isNull(stateEvent.getOrderState()) && !stateEvent.getOrderState()
          .equals(stateEvent.getOrderState())) {
        throw new BusinessException(ResultCode.TransferStatusError, "订单状态不匹配");
      }
      throw new BusinessException(ResultCode.NotFindError, "状态处理器未找到");
    }
    if (CollectionUtils.isEmpty(processorList)) {
      throw new BusinessException(ResultCode.NotFindError, "状态处理器未找到");
    }
    if (processorList.size() > 1) {
      throw new BusinessException(ResultCode.ValidateError, "状态处理器超过1");
    }
    return processorList.get(0);
  }
}
```

## 使用案例

请参考[订单创建流程](./order-create.md#创建订单接口)
