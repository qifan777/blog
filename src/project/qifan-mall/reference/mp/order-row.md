---
category:
  - 起凡商城
tag:
  - 订单
  - 订单列表
  - 订单横向展示卡片
order: 0
date: 2024-02-01
timeline: true
---
# 订单横向展示卡片

## 源码解析

### 显示订单事件和状态

:::tabs
@tab html

1. `<div class="time">`: 在时间-状态区块内显示订单创建的具体时间，使用 `dayjs(order.createdTime).format("YYYY-MM-DD HH:mm")` 对订单创建时间进行格式化处理，以年-月-日 时:分的形式展现。

2. `<dict-column>`：字段翻译组件，它接受两个props：
   - `dict-id="DictConstants.PRODUCT_ORDER_STATUS"`：指定字典编号，通过这个编号从字典服务获取对应的状态描述。
   - `:value="order.status"`：绑定当前订单的状态值到组件上，该组件会根据这个值查询并展示对应的订单状态文本。

总结起来，此组件负责呈现单个订单的时间和状态信息，其中时间信息直接通过JavaScript库（这里用的是dayjs）格式化后显示，而状态信息则是通过调用字典服务动态获取并展示的。

```html
<template>
  <div class="order-row">
    <div class="time-status">
      <div class="time">
        {{ dayjs(order.createdTime).format("YYYY-MM-DD HH:mm") }}
      </div>
      <dict-column
        :dict-id="DictConstants.PRODUCT_ORDER_STATUS"
        :value="order.status"
      ></dict-column>
    </div>
  </div>
</template>

```

@tab ts

```ts
import { ProductOrderDto } from "@/apis/__generated/model/dto";
import DictColumn from "@/components/dict/dict-column.vue";
import { DictConstants } from "@/apis/__generated/model/enums/DictConstants";
import { computed } from "vue";
import dayjs from "dayjs";

const props = defineProps<{
  order: ProductOrderDto["ProductOrderRepository/COMPLEX_FETCHER"];
}>();
```

@tab css

```scss
.order-row {
  padding: 30px;
  background-color: white;
  border-radius: 20px;
  margin-top: 20px;
  .time-status {
    display: flex;
    font-size: 26px;
    justify-content: space-between;
    color: rgba(black, 0.5);
    padding: 10px 0;
  }
}
```

:::

### 显示订单商品信息

:::tabs
@tab html

1. `<div class="order-row">`：包裹整个订单行内容的容器。

2. `<div class="list">`：包裹所有商品信息的列表容器。

3. [`<product-row>`](./product-row.md)：这是一个自定义的商品展示组件，用于显示单个商品信息，其类名设为"row"，并且根据当前遍历到的`item.productSku.id`作为唯一的`key`值，以确保复用时不会出现问题。

4. `:product="item.productSku"`：将当前遍历到的商品SKU对象绑定到`product-row`组件的`product`属性上，以便在子组件内部渲染商品详情。

5. `v-for="item in orderItems"`：遍历整个订单中的商品项目集合`orderItems`。

6. 在`<product-row>`组件内嵌套了一个模板插槽[`#operation`]，并在这个插槽内添加了商品数量信息：
   - `<div class="count">x{{ item.skuCount }}</div>`：显示每个商品的购买数量，其中`item.skuCount`是从当前遍历到的商品项目对象中获取的商品数量。

```html
<template>
  <div class="order-row">
    <!-- 忽略创建时间和订单状态 -->
    <div class="list">
      <product-row
        class="row"
        :key="item.productSku.id"
        :product="item.productSku"
        v-for="item in orderItems"
      >
        <template #operation>
          <div class="count">x{{ item.skuCount }}</div>
        </template>
      </product-row>
    </div>
  </div>
</template>
```

@tab ts

- 计算属性 `orderItems` 的值是通过调用 `props.order.items.map()` 方法遍历原始订单物品列表得到的。
  
  对于原始订单列表中的每个项目：
  
  - 提取出两个关键字段：`productSku` 和 `skuCount`。

  - 创建一个新的对象，并将 `productSku` 扩展以包含更多的属性：

    - 使用扩展运算符 `...` 将原始 `productSku` 对象的所有属性复制到新对象的 `productSku` 属性中。

    - 添加一个自定义的 `description` 属性，该属性由 `productSku.values` 数组的所有值拼接而成，之间用逗号分隔，例如“黑色,12gb+256gb”。

    - 添加一个从原 `productSku.product` 中提取出的 `brand` 属性。

- 最后返回的对象格式为 `{ productSku: { ... }, skuCount }`，这样在模板中可以直接使用这个新的 `orderItems` 数组渲染每个商品项及其详细信息。

```ts
const orderItems = computed(() => {
  return props.order.items.map(({ productSku, skuCount }) => {
    return {
      productSku: {
        ...productSku,
        description: productSku.values.join(","),
        brand: productSku.product.brand,
      },
      skuCount,
    };
  });
});
```

@tab css

```scss
.order-row {
  padding: 30px;
  background-color: white;
  border-radius: 20px;
  margin-top: 20px;
//   忽略订单状态和创建时间样式...
  .list {
    .row {
      .count {
        font-size: 26px;
      }
    }
  }
}
```

:::

### 价格总计和拓展

:::tabs
@tab html

- `<slot>` 元素是一个占位符，允许父组件在使用这个子组件时插入自定义内容。在本例中，.buttons 类的 div 容器内包含了一个插槽，这意味着父组件可以向此处注入按钮、链接或者其他任何需要出现在订单行下方的操作控件。这样设计提高了组件的复用性和灵活性。

```html
<template>
  <div class="order-row">
    <!-- 忽略... -->
    <div class="total">合计：￥{{ order.payment.payAmount }}</div>
    <div class="buttons">
      <slot></slot>
    </div>
  </div>
</template>
```

@tab css

```scss
  .total {
    font-size: 30px;
    display: flex;
    justify-content: flex-end;
    padding: 15px 10px;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
  }
```

:::
