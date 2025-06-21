---
category:
  - 起凡商城
tag:
  - 商品管理
  - 商品SKU
  - 小程序

order: 7
date: 2024-01-24
timeline: true
---

# 小程序购物车

![购物车](./cart-list.png =x350)

## 购物车组件

::::tabs
@tab html

引用cart-list组件，并接收商品sku对话框中的添加购物车事件。

```html {7,10}
<template>
  <product-sku-dialog
    v-if="chosenProduct"
    :key="chosenProduct.id"
    v-model:visible="dialogVisible"
    :product="chosenProduct"
    @add-sku="handleAddSku"
  ></product-sku-dialog>
  <!-- 忽略... -->
  <cart-list></cart-list>
  <register-popup></register-popup>
</template>
```

@tab ts

```ts
const cartStore = useCartStore();
const handleAddSku = (
  sku: ProductSkuFetcherDto["skuList"][0],
  product: ProductSkuFetcherDto,
) => {
  cartStore.pushItem({ checked: true, count: 1, sku: sku, product });
};
```

::::

:::info
[购物车组件](../reference/mp/cart-list.md)
:::
