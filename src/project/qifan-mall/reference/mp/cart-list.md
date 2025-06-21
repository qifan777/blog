---
category:
  - 小程序
  - 起凡商城
tag:
  - 购物车
date: 2024-01-23
timeline: true
---
# 购物车

![购物车](../../product/cart-list.png =x350)

## 购物车store

全局存储购物车的数据

```ts
import { ProductDto } from "@/apis/__generated/model/dto";
import Taro from "@tarojs/taro";
import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";
type ProductSkuFetcherDto = ProductDto["ProductRepository/PRODUCT_SKU_FETCHER"];
export type CartItem = {
  product: ProductSkuFetcherDto;
  sku: ProductSkuFetcherDto["skuList"][0];
  count: number;
  checked: boolean;
};
export const useCartStore = defineStore("cart", () => {
  // 购物车是否显示
  const visible = ref(false);
  // 从本地存储中获取购物车列表
  const cartList = ref<CartItem[]>(
    JSON.parse(Taro.getStorageSync("cart") || "[]"),
  );
  // cartList有变动就缓存到本地存储
  watchEffect(() => {
    Taro.setStorageSync("cart", JSON.stringify(cartList.value));
  });
  const checkedItems = computed(() =>
    cartList.value.filter((item) => item.checked),
  );
  // 总价
  const totalPrice = computed(() =>
    checkedItems.value
      // 计算每个商品的总价
      .map((item) => item.count * item.sku.price)
      // 求和
      .reduce((prev, curr) => prev + curr, 0),
  );
  // 购物车添加商品
  const pushItem = (cartItem: CartItem) => {
    const index = cartList.value.findIndex(
      (item) => item.sku.id === cartItem.sku.id,
    );
    if (index === -1) {
      cartList.value.push(cartItem);
    } else {
      plusItem(index);
    }
  };
  // 购物车减少商品数量
  const plusItem = (index: number) => {
    cartList.value[index].count++;
  };
  // 购物车减少商品数量
  const minusItem = (index: number) => {
    const item = cartList.value[index];
    if (item.count === 1) {
      // 少于1时移除购物车
      cartList.value.splice(index, 1);
    } else {
      item.count--;
    }
  };
  // 清空购物车
  const clearCart = () => {
    cartList.value = [];
  };
  // 全选或者反选
  const toggleCart = () => {
    // 如果已选的数量等于购物车数量反向否则全勋。
    const value = checkedItems.value.length !== cartList.value.length;
    cartList.value.forEach((item) => {
      item.checked = value;
    });
  };

  return {
    visible,
    checkedItems,
    cartList,
    totalPrice,
    pushItem,
    plusItem,
    minusItem,
    clearCart,
    toggleCart,
  };
});

```

## 源码解析

### 购物车弹出

![购物车悬浮条](image-1.png)

- 点击购物车悬浮条修改visible控制购物车的显示隐藏
- 点击结算触发submit事件
- totalPrice显示总价

:::tabs

@tab html

```html
<template>
  <nut-popup
    ref="popup"
    v-model:visible="visible"
    background-color="#fff"
    position="bottom"
    z-index="19"
  >
    <div class="cart-content">
    </div>
  </nut-popup>
  <div class="cart-bar-wrapper">
    <div class="cart-bar">
      <div class="left" @click="visible = true">
        <div class="price">￥{{ totalPrice }}</div>
      </div>
      <div class="right" @click="submit">去结算</div>
    </div>
  </div>
</template>
```

@tab ts

```ts
import { storeToRefs } from "pinia";
import { type CartItem, useCartStore } from "./cart-store";
import { Del, Minus, Plus } from "@nutui/icons-vue-taro";
import ProductRow from "@/components/product/product-row.vue";
import { computed } from "vue";

const cartStore = useCartStore();
const { visible, totalPrice } = storeToRefs(cartStore);
const emit = defineEmits<{ submit: [value: CartItem[]] }>();
const submit = () => {
  emit("submit", cartStore.checkedItems);
};
```

@tab css

```scss
// 多行溢出scss函数
@import "../../app.scss";
.cart-content {
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  padding: 0 30rpx 150rpx 30rpx;
}
// 横条父亲的宽度和屏幕宽度一样, 让子元素横条居中.并且将横条的位置固定在页面底部
.cart-bar-wrapper {
  position: fixed;
  z-index: 20;
  bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  // 此时购物车横条处于居中状态,左边显示价格,右边显示提交按钮
  .cart-bar {
    width: 700rpx;
    display: flex;
    height: 100rpx;

    .left {
      background-color: black;
      width: 500rpx;
      height: 100%;
      border-bottom-left-radius: 60rpx;
      border-top-left-radius: 60rpx;
      display: flex;
      align-items: center;

      .price {
        color: white;
        margin-left: 40rpx;
        font-size: 40rpx;
      }
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 207, 92);
      width: 200rpx;
      height: 100%;
      border-bottom-right-radius: 60rpx;
      border-top-right-radius: 60rpx;
      font-size: 35rpx;
      font-weight: bold;
    }
  }
}
```

:::

### 购物车展示

![购物车商品展示](image.png)

遍历购物车中的sku并使用`product-row`组件展示详情。同时在详情的左侧添置`<nut-checkbox/>` 用于双向绑定勾选状态。只有勾选的SKU才参与价格计算。

:::tabs
@tab html

```html
<template>
  <nut-popup
    ref="popup"
    v-model:visible="visible"
    background-color="#fff"
    position="bottom"
    z-index="19"
  >
    <div class="cart-content">
        <!-- 展示商品信息，左边是选择器，右边是商品详情 -->
      <div
        v-for="(item, index) in cartStore.cartList"
        :key="item.sku.id"
        class="product-row"
      >
        <nut-checkbox
          v-model="item.checked"
          :label="item.sku.id"
        ></nut-checkbox>
        <!-- sku中的组合值替换description -->
        <product-row
          :product="{
            ...item.sku,
            description: item.sku.values.join(','),
            brand: item.product.brand,
          }"
        >
        </product-row>
      </div>
    </div>
  </nut-popup>
  <!-- 忽略... -->
</template>
```

@tab css

```scss
// 多行溢出scss函数
@import "../../app.scss";
.cart-content {
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  padding: 0 30rpx 150rpx 30rpx;

  .product-row {
    display: flex;
    align-items: center;
    margin-top: 20rpx;
    border-bottom: 1px solid rgba(black, 0.05);
    .nut-checkbox {
      margin-right: 0;
    }
  }
}
// 忽略...
```

:::

### 商品数量加减

![商品数量加减](image-2.png)

在`product-row`组件中添加插槽`operation`，用来展示加减按钮。触发加减按钮点击事件，调用[购物车store](#购物车store)中的方法`minusItem`和`plusItem`。
:::tabs
@tab html

```html
<template>
  <nut-popup
    ref="popup"
    v-model:visible="visible"
    background-color="#fff"
    position="bottom"
    z-index="19"
  >
    <div class="cart-content">
      <div
        v-for="(item, index) in cartStore.cartList"
        :key="item.sku.id"
        class="product-row"
      >
        <nut-checkbox
          v-model="item.checked"
          :label="item.sku.id"
        ></nut-checkbox>
        <product-row
          :product="{
            ...item.sku,
            description: item.sku.values.join(','),
            brand: item.product.brand,
          }"
        >
            <!-- 横向商品详情组件的插槽 -->
          <template #operation>
            <div class="count-wrapper">
              <Minus size="32" @click="minusItem(index)"></Minus>
              <div class="count">{{ item.count }}</div>
              <Plus
                size="32"
                :color="'#f0ad4e'"
                @click="plusItem(index)"
              ></Plus>
            </div>
          </template>
        </product-row>
      </div>
    </div>
  </nut-popup>
  <!-- 忽略... -->
</template>
```

@tab ts

```ts
import { storeToRefs } from "pinia";
import { type CartItem, useCartStore } from "./cart-store";
import { Del, Minus, Plus } from "@nutui/icons-vue-taro";
import ProductRow from "@/components/product/product-row.vue";
import { computed } from "vue";

const cartStore = useCartStore();
const { visible, totalPrice } = storeToRefs(cartStore);
const { minusItem, plusItem } = cartStore;

const emit = defineEmits<{ submit: [value: CartItem[]] }>();
const submit = () => {
  emit("submit", cartStore.cartList);
};
```

@tab css

```scss
// 多行溢出scss函数
@import "../../app.scss";
.cart-content {
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  padding: 0 30rpx 150rpx 30rpx;

  .product-row {
    display: flex;
    align-items: center;
    margin-top: 20rpx;
    border-bottom: 1px solid rgba(black, 0.05);
    .nut-checkbox {
      margin-right: 0;
    }
    // 加减按钮居中对齐
    .count-wrapper {
      display: flex;
      align-items: center;

      .count {
        font-size: 30rpx;
      }
    }
  }
// 忽略...
}
```

:::

### 购物车全选和清空

![清空购物车和全选](image-3.png)

清空购物车和全选/反选购物车用的是[购物车store](#购物车store)中的方法

:::tabs
@tab html

```html
<template>
  <nut-popup
    ref="popup"
    v-model:visible="visible"
    background-color="#fff"
    position="bottom"
    z-index="19"
  >
    <div class="cart-content">
      <div class="top-bar">
        <div class="left">
          <nut-checkbox
            :model-value="checkedItems.length > 0"
            :indeterminate="isIndeterminate"
            @click="toggleCart"
          >
            已选：{{ checkedItems.length }}
          </nut-checkbox>
        </div>
        <div class="right" @click="clearCart">
          <Del size="20"></Del>
          <div class="tip">清空购物车</div>
        </div>
      </div>
      <!-- 忽略... -->
    </div>
  </nut-popup>
  <!-- 忽略... -->
</template>
```

@tab ts

- checkedItems购物车中导出的已选SKU
- clearCart清空购物车方法, toggleCart全选/反选购物车方法
- isIndeterminate是否选中状态，介于反选和全选中间即是`indeterminate`. 传给`nut-chekbox`组件。

```ts
import { storeToRefs } from "pinia";
import { type CartItem, useCartStore } from "./cart-store";
import { Del, Minus, Plus } from "@nutui/icons-vue-taro";
import ProductRow from "@/components/product/product-row.vue";
import { computed } from "vue";

const cartStore = useCartStore();
const { visible, totalPrice, checkedItems } = storeToRefs(cartStore);
const { minusItem, plusItem, clearCart, toggleCart } = cartStore;

const emit = defineEmits<{ submit: [value: CartItem[]] }>();
const submit = () => {
  emit("submit", cartStore.cartList);
};
// 中间状态
const isIndeterminate = computed(() => {
  return (
    checkedItems.value.length > 0 &&
    checkedItems.value.length < cartStore.cartList.length
  );
});

```

@tab css

```scss
// 多行溢出scss函数
@import "../../app.scss";
.cart-content {
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  padding: 0 30rpx 150rpx 30rpx;

  .top-bar {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 0;
    border-bottom: 1px solid rgba(black, 0.1);
    .left {
      display: flex;
      align-items: center;
      color: #1485ee;
    }
    .right {
      display: flex;
      align-items: center;
      .tip {
        margin-left: 5px;
      }
    }
  }

// 忽略...
}
```

:::
