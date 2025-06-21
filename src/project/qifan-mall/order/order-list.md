---
category:
  - 起凡商城
tag:
  - 订单
  - 订单列表
order: 3
date: 2024-02-01
timeline: true
---

# 订单列表

![订单列表](image.png =x350)

## 用户订单分页查询

:::tabs
@tab 订单查询Dto

- `creator { id }`: 包含创建者的ID信息，可以按照创建者ID来筛选订单。

使用这个规格(Specification)进行查询时，可以根据用户提供的参数，灵活查询满足条件的所有订单记录，比如按订单备注部分文本、创建和修改时间范围以及创建者ID来过滤订单。

```text {9-11}
specification ProductOrderSpec {
    #allScalars
    like/i(remark)
    like/i(id)
    ge(createdTime)
    le(createdTime)
    ge(editedTime)
    le(editedTime)
    creator {
      id
    }
}
```

@tab 订单抓取器

1. `ProductOrderFetcher.COMPLEX_FETCHER`：创建了一个名为`COMPLEX_FETCHER`的复杂加载器，用于加载商品订单的详细信息。

2. `.allScalarFields()`：表示加载所有标量字段（如字符串、数字等基本属性）。

3. `.items(ProductOrderItemFetcher.$...)`：针对每个商品订单中的`items`（即商品订单项列表），进一步加载其相关联的详细信息：
   - `.productSku(ProductSkuFetcher.$...)`：加载每个商品订单项对应的`ProductSku`（商品SKU）信息，并进一步加载它的所有标量字段以及与其关联的：
     - `.product(ProductFetcher.$.allScalarFields())`：加载商品SKU所属的商品详细信息。
   - `.skuCount()`：加载商品订单项的数量。

4. `.address(AddressFetcher.$.allScalarFields())`：加载与订单关联的地址信息及其所有标量字段。

5. `.payment(PaymentFetcher.$.allScalarFields())`：加载与订单关联的支付详情及其所有标量字段。

6. `.creator(UserFetcher.$.phone().nickname())` 和 `.editor(UserFetcher.$.phone().nickname())`：分别加载创建和编辑此订单的用户的电话号码和昵称。

`COMPLEX_FETCHER`能够根据需要一次性从数据库加载商品订单及其相关实体（如商品SKU、商品、地址、支付详情、用户信息等）的完整信息，以提高数据读取效率，减少网络请求次数。

```java
public interface ProductOrderRepository extends JRepository<ProductOrder, String> {

  ProductOrderFetcher COMPLEX_FETCHER = ProductOrderFetcher.$.allScalarFields()
      .items(ProductOrderItemFetcher.$
          .productSku(ProductSkuFetcher.$
              .allScalarFields()
              .product(ProductFetcher.$.allScalarFields()))
          .skuCount())
      .address(AddressFetcher.$.allScalarFields())
      .payment(PaymentFetcher.$.allScalarFields())
      .creator(UserFetcher.$.phone().nickname())
      .editor(UserFetcher.$.phone().nickname());
}
```

@tab api

1. 方法参数：
   - `@RequestBody QueryRequest<ProductOrderSpec> queryRequest`：通过`@RequestBody`注解接收请求体中的JSON数据，并将其反序列化为`QueryRequest`对象，其中泛型类型是`ProductOrderSpec`，即订单查询规格对象，包含了查询条件和分页信息等。

2. 在方法内部：
   - 创建一个`TargetOf_creator`对象（[ProductOrderSpec](#用户订单分页查询)中定义的Creator），并使用`StpUtil.getLoginIdAsString()`获取当前登录用户的ID（SaToken）。
   - 将这个用户ID设置到订单查询规格的创建者字段上，这样在执行查询时，将会筛选出由当前登录用户创建的订单。

3. 调用`productOrderService.query(queryRequest)`：传入已设置好查询条件和分页信息的`queryRequest`对象，用于执行数据库查询操作。

4. 返回值类型为`Page<@FetchBy(value = "COMPLEX_FETCHER") ProductOrder>`：返回的是一个分页结果集，并用`@FetcherBy`声明返回类型，这样前端在同步API时可以根据`COMPLEX_FETCHER`中查询的内容获得类型，即订单的详细信息，如商品SKU、地址、支付详情以及与订单创建和编辑相关的用户信息等。

用户ID查询其创建的商品订单记录

```java
@RestController
@RequestMapping("productOrder")
@AllArgsConstructor
@DefaultFetcherOwner(ProductOrderRepository.class)
public class ProductOrderController {

  private final ProductOrderService productOrderService;

  @PostMapping("user")
  public Page<@FetchBy(value = "COMPLEX_FETCHER") ProductOrder> queryByUser(
      @RequestBody QueryRequest<ProductOrderSpec> queryRequest) {
    TargetOf_creator targetOfCreator = new TargetOf_creator();
    targetOfCreator.setId(StpUtil.getLoginIdAsString());
    queryRequest.getQuery().setCreator(targetOfCreator);
    return productOrderService.query(queryRequest);
  }
}
```

:::

## 路由配置

```ts
export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/user/index",
    "pages/address/address-list",
    "pages/address/address-save",
    "pages/order/order-create",
    "pages/order/order-list",
  ],
});

```

## 订单列表页面

### 小程序端字典

请参考[字典翻译](../dict|/README.md/#字典翻译) 和 [字典缓存](../dict/README.md/#字典缓存)

:::tabs
@tab 字典缓存

```ts
import type { DictSpec, Page } from "@/apis/__generated/model/static";
import type { DictDto } from "@/apis/__generated/model/dto";
import { api } from "@/utils/api-instance";

const dictMap: Record<
  number,
  Promise<Page<DictDto["DictRepository/COMPLEX_FETCHER"]>>
> = {};
export const queryDict = (dictSpec: DictSpec) => {
  if (!dictSpec.dictId) return;
  let res = dictMap[dictSpec.dictId];
  if (res) return res;
  res = api.dictController.query({
    body: {
      pageNum: 1,
      pageSize: 1000,
      likeMode: "ANYWHERE",
      query: dictSpec,
      sorts: [{ property: "dictId", direction: "ASC" }],
    },
  });
  dictMap[dictSpec.dictId] = res;
  return res;
};
```

@tab 字典翻译组件

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { DictDto } from "@/apis/__generated/model/dto";
import { queryDict } from "@/components/dict/dict";

const props = withDefaults(defineProps<{ dictId: number; value?: string }>(), {
  value: "",
});
const options = ref<DictDto["DictRepository/COMPLEX_FETCHER"][]>([]);
onMounted(async () => {
  const res = queryDict({ dictId: props.dictId });
  if (res) {
    options.value = (await res).content;
  }
});
const keyName = computed(() => {
  const option = options.value.find((option) => {
    return option.keyEnName === props.value;
  });
  return option ? option.keyName : "";
});
</script>

<template>
  <div>{{ keyName }}</div>
</template>

<style scoped lang="scss"></style>

```

:::

### 订单状态选项卡

::::tabs

@tab html

订单选型卡(tab)

1. `<nut-tabs v-model="activeStatus" @change="handleTabChange">`: 使用了 `nut-tabs` 创建含选项卡。`v-model="activeStatus"` 表示将 `activeStatus` 数据属性与选项卡的状态进行双向绑定。`@change="handleTabChange"` 表示当选项卡发生改变时，将调用名为 `handleTabChange` 的方法。

2. `<nut-tab-pane v-for="tab in tabList" :key="tab.keyId" :title="tab.keyName" :pane-key="tab.keyEnName">`: 使用了 `nut-tab-pane` 组件，它被放置在 `nut-tabs` 内部。通过 `v-for` 循环遍历 `tabList` 数组，为每个选项卡设置了唯一的 `key` 值（`:key="tab.keyId"`），标题（`:title="tab.keyName"`），和面板键值（`:pane-key="tab.keyEnName"`）。

```html
<template>
  <div class="order-list-page">
    <nut-tabs v-model="activeStatus" @change="handleTabChange">
      <nut-tab-pane
        v-for="tab in tabList"
        :key="tab.keyId"
        :title="tab.keyName"
        :pane-key="tab.keyEnName"
      >
      </nut-tab-pane>
    </nut-tabs>
  </div>
</template>
```

@tab ts

:::tip

1. **常量解构赋值：**

   ```javascript
   const { TO_BE_PAID, TO_BE_DELIVERED, TO_BE_RECEIVED, CLOSED } = Dictionaries.ProductOrderStatus;
   ```

   这一行代码使用解构赋值从 `Dictionaries.ProductOrderStatus` 中提取了四个订单状态的常量值。

2. **选项卡列表：**

   ```javascript
   const tabList = [TO_BE_PAID, TO_BE_DELIVERED, TO_BE_RECEIVED, CLOSED];
   ```

   创建了一个包含订单状态的数组 `tabList`，用于在选项卡中显示不同的状态。

3. **响应式状态：**

   ```javascript
   const activeStatus = ref<ProductOrderStatus>("TO_BE_PAID");
   ```

   使用 `ref` 函数创建了一个响应式引用 `activeStatus`，并将其初始化为默认值 `"TO_BE_PAID"`。

4. **选项卡变更处理函数：**

   ```javascript
   const handleTabChange = () => {
     reloadPageData({ status: activeStatus.value });
   };
   ```

   定义了一个名为 `handleTabChange` 的函数，用于在选项卡变更时重新加载页面数据，并将当前选中的状态作为参数传递给 `reloadPageData` 函数。

5. **使用PageHelper：**

   ```javascript
   const { pageData, reloadPageData } = usePageHelper(
     api.productOrderController.queryByUser,
     api.productOrderController,
     { status: activeStatus.value },
   );
   ```

   使用 `usePageHelper` 的自定义钩子，该钩子用于管理页面数据。通过调用 `queryByUser` 方法从 `api.productOrderController` 获取页面数据，并使用 `activeStatus.value` 作为初始状态进行初始化。返回的 `pageData` 和 `reloadPageData` 分别用于存储页面数据和重新加载页面数据的函数。

:::

```ts
const { TO_BE_PAID, TO_BE_DELIVERED, TO_BE_RECEIVED, CLOSED } =
  Dictionaries.ProductOrderStatus;
const tabList = [TO_BE_PAID, TO_BE_DELIVERED, TO_BE_RECEIVED, CLOSED];
const activeStatus = ref<ProductOrderStatus>("TO_BE_PAID");
const handleTabChange = () => {
  reloadPageData({ status: activeStatus.value });
};
const { pageData, reloadPageData } = usePageHelper(
  api.productOrderController.queryByUser,
  api.productOrderController,
  { status: activeStatus.value },
);
```

@tab css

```css
page {
  background-color: #f5f5f5;
}
.order-list-page {
  .nut-tabs__list {
    background-color: white;
  }
  .nut-tab-pane {
    padding: 0;
    background-color: #f5f5f5;
  }
}
```

::::

### 订单展示

::::tabs

@tab html

:::tip

1. 使用`v-for`指令遍历从`pageData.content`获取的所有订单数据：

   ```html
   <div class="order" v-for="order in pageData.content" :key="order.id">
   ```

   这里对每个订单项创建一个新的`.order`元素。

2. 在循环内部，使用自定义组件`order-row`来展示每个订单的详细信息，并将当前订单对象作为属性值传递给该组件：

   ```html
   <order-row :order="order" @click="switchPage('./order-details?id=' + order.id)">
   ```

   当用户点击这个订单行时，会触发`switchPage`事件处理器方法，跳转到对应的订单详情页，URL中包含了当前订单ID。

3. 根据订单状态动态显示按钮：
   - 如果满足`showCancel(order.status)`条件，则显示“取消订单”按钮。
   - 如果订单状态为 `'TO_BE_PAID'`，则显示“立即支付”按钮。

:::

```html {10-26}
<template>
  <div class="order-list-page">
    <nut-tabs v-model="activeStatus" @change="handleTabChange">
      <nut-tab-pane
        v-for="tab in tabList"
        :key="tab.keyId"
        :title="tab.keyName"
        :pane-key="tab.keyEnName"
      >
        <div class="order" v-for="order in pageData.content" :key="order.id">
          <order-row
            :order="order"
            @click="switchPage('./order-details?id=' + order.id)"
          >
            <nut-button size="small" plain v-if="showCancel(order.status)"
              >取消订单</nut-button
            >
            <nut-button
              size="small"
              type="danger"
              plain
              v-if="order.status === 'TO_BE_PAID'"
              >立即支付</nut-button
            >
          </order-row>
        </div>
      </nut-tab-pane>
    </nut-tabs>
  </div>
</template>
```

@tab ts

:::tip

1. 导入所需模块：
   - [`usePageHelper`](../reference/mp/page.md)：来自项目内部的工具函数，通常用来处理分页数据的获取、加载更多等功能。
   - `api`：导入自定义API实例，封装了与后端接口交互的方法。
   - `OrderRow`：导入自定义组件`OrderRow.vue`，用于在订单列表中展示每个订单的详情行。
   - `ProductOrderStatus`：从后端生成的类型文件中导入订单状态枚举。
   - `switchPage`：一个跳转页面的通用工具函数。

2. 使用[`usePageHelper`](../reference/mp/page.md)钩子来获取当前用户相关的订单数据，并进行分页处理：

   ```javascript
   const { pageData } = usePageHelper(
     api.productOrderController.queryByUser,
     api.productOrderController,
     {},
   );
   ```

   这里传入了两个参数：
   - 第一个参数是调用后端查询当前用户订单的API方法（`queryByUser`）。
   - 第二个`api.productOrderController`用于绑定查询方法的上下文, 即`this`指向当前组件实例。
   - 第三个参数查询条件，代表请求时需要传递给API的初始查询参数。

3. 定义一个辅助函数`showCancel`，根据订单状态判断是否显示“取消订单”按钮：

   ```javascript
   const showCancel = (status: ProductOrderStatus) => {
     return status === "TO_BE_PAID" || status === "TO_BE_DELIVERED";
   };
   ```

   当订单状态为“待支付”或“待发货”时，此函数会返回`true`，表示允许用户操作取消订单。

:::

```ts
import { usePageHelper } from "@/utils/page";
import { api } from "@/utils/api-instance";
import OrderRow from "@/components/order/order-row.vue";
import { ProductOrderStatus } from "@/apis/__generated/model/enums";
import { switchPage } from "@/utils/common";

const { pageData } = usePageHelper(
  api.productOrderController.queryByUser,
  api.productOrderController,
  { status: activeStatus.value },
);
const showCancel = (status: ProductOrderStatus) => {
  return status === "TO_BE_PAID" || status === "TO_BE_DELIVERED";
};
```

::::
