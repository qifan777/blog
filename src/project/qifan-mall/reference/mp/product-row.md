---
category:
  - 起凡商城
  - 小程序
tag:
  - 商品详情
date: 2024-01-21
timeline: true
---

# 商品横向详情

![商品横向详情](./product-row.png)
::::tabs
@tab 骨架

```vue
<template>
   <!-- 左边显示封面，右边显示商品详情 -->
  <div class="qi-product">
    <!-- 封面 -->
    <image class="cover"></image>
    <!-- 商品详情，垂直展示详情 -->
    <div class="info">
      <!-- 商品名称 -->  
      <div class="name"></div>
      <!-- 商品描述 -->
      <div class="description">
      </div>
      <!-- 品牌 -->
      <div class="brand">
      </div>
      <!-- 商品价格 -->
      <div class="price-row">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
// 导入多行溢出scss函数
@import "../../app.scss";
.qi-product {
  padding: 15px 0;
  display: flex;
  align-items: flex-start;
  width: 100%;
  .cover {
    width: 150px;
    height: 150px;
    border-radius: 10px;
  }
  .info {
    // 撑开多余的空间
    flex: 1;
    margin-left: 20px;
    padding-right: 10px;
  }
}
</style>

```

@tab 封面/名称/描述

```vue
<template>
  <div class="qi-product">
    <!-- 封面 aspectFill优先保证图片比例 -->
    <image class="cover" :src="product.cover" mode="aspectFill"></image>
    <!-- 商品详情 -->
    <div class="info">
      <div class="name">{{ product.name }}</div>
      <div class="description">
        {{ product.description }}
      </div>
      <div class="brand">
        <nut-tag type="success">{{ product.brand }}</nut-tag>
      </div>
      <div class="price-row">
        <div class="price">
          <span class="prefix">￥</span>
          <span>{{ product.price }}</span>
        </div>
        <!-- 拓展插槽 -->
        <slot name="operation"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProductDto } from "@/apis/__generated/model/dto";
type Product = Pick<
  ProductDto["ProductRepository/COMPLEX_FETCHER"],
  "id" | "name" | "description" | "price" | "cover" | "brand"
>;
defineProps<{
  product: Product;
}>();
</script>

<style lang="scss">
@import "../../app.scss";
.qi-product {
  padding: 15px 0;
  display: flex;
  align-items: flex-start;
  width: 100%;
  .cover {
    width: 150px;
    height: 150px;
    border-radius: 10px;
  }
  .info {
    // 撑开多余的空间
    flex: 1;
    margin-left: 20px;
    padding-right: 10px;
    .name {
      font-size: 28px;
      font-weight: bold;
      @include text-max-line(1);
    }
    .description {
      margin-top: 10px;
      font-size: 24px;
      color: rgba($color: #000000, $alpha: 0.7);
      @include text-max-line(1);
    }
    .brand {
      padding: 0;
      --nut-tag-font-size: 20px;
    }
    .price-row {
      display: flex;
      // 水平方向上均衡分布
      justify-content: space-between;
      // 垂直方向居中
      align-items: center;
      .price {
        display: flex;
        // ￥ 和 数字底部对齐
        align-items: flex-end;
        .prefix {
          font-size: 28px;
          color: red;
        }

        color: red;
        font-weight: bold;
        font-size: 28px;
      }
    }
  }
}
</style>

```

::::
