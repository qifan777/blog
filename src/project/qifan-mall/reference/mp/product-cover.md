---
category:
  - 起凡商城
  - 小程序
tag:
  - 商品详情
date: 2024-01-20
timeline: true
---
# 商品纵向详情

![效果](./product-cover.png)

## 源码解析

### 骨架

从上到下分别显示

- 封面
- 标题
- 标签
- 价格和品牌

:::tabs

@tab html

```html
<template>
  <div class="product-cover">
    <!-- 图片的高度自适应，宽度固定 -->
    <image
      class="cover"
      mode="widthFix"
    ></image>
    <div class="title">
    </div>
    <div class="tags">
    </div>
    <div class="price-brand">
    </div>
  </div>
</template>
```

@tab css

```scss
.product-cover {
  border-radius: 15px;
  background-color: #ffffff;
  padding: 14px;
  position: relative;
}

```

:::

:::tip
mode="widthFix"可以使得图片的宽度固定，高度自适应
:::

### 封面和标题

:::tabs
@tab html

```html {4,7,10}
<template>
  <div class="product-cover">
    <image
      :src="product.cover"
      class="cover"
      mode="widthFix"
      :style="{ width }"
    ></image>
    <div class="title">
      {{ product.name }}
    </div>
    <div class="tags">
    </div>
    <div class="price-brand">
    </div>
  </div>
</template>
```

@tab css

```scss {1-10,17-28}
// 通用的多行溢出scss函数
@mixin text-max-line($line) {
    // 文字只能显示一行
    -webkit-line-clamp: $line;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
    // 溢出部分用 ...代替
    text-overflow: ellipsis;
}
.product-cover {
  border-radius: 15px;
  background-color: #ffffff;
  padding: 14px;
  position: relative;

  .cover {
    // 圆角
    border-radius: 10rpx;
  }

  .title {
    font-size: 28rpx;
    margin-top: 5px;
    color: rgba(black, 0.9);
    // 超过两行的标题溢出处理
    @include text-max-line(2);
  }
}
```

@tab ts

```ts
import { ProductDto } from "@/apis/__generated/model/dto/ProductDto";
// withDefaults 用于设置默认值，相当于defineProps({with:{type: String, default: "100%", 忽略...}})
withDefaults(
  defineProps<{
    product: ProductDto["ProductRepository/COMPLEX_FETCHER"];
    width?: string;
  }>(),
  { width: "100%" },
);
```

:::

### 标签价格品牌

:::tabs
@tab html

```html {13-22,25-28}
<template>
  <div class="product-cover">
    <image
      :src="product.cover"
      class="cover"
      mode="widthFix"
      :style="{ width }"
    ></image>
    <div class="title">
      {{ product.name }}
    </div>
    <div class="tags">
      <!-- 循环tag列表 -->
      <nut-tag
        v-for="tag in product.tags"
        :key="tag"
        class="tag"
        color="#E9E9E9"
        textColor="#999999"
      >
        {{ tag }}
      </nut-tag>
    </div>
    <div class="price-brand">
      <div class="price">￥{{ product.price }}</div>
      <div class="brand">
        <nut-tag type="primary">{{ product.brand }}</nut-tag>
      </div>
    </div>
  </div>
</template>
```

@tab css

```scss {29-54}
// 通用的多行溢出scss函数
@mixin text-max-line($line) {
    // 文字只能显示一行
    -webkit-line-clamp: $line;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
    // 溢出部分用 ...代替
    text-overflow: ellipsis;
}
.product-cover {
  border-radius: 15px;
  background-color: #ffffff;
  padding: 14px;
  position: relative;

  .cover {
    // 圆角
    border-radius: 10rpx;
  }

  .title {
    font-size: 28rpx;
    margin-top: 5px;
    color: rgba(black, 0.9);
    // 超过两行的标题溢出处理
    @include text-max-line(2);
  }
  .tags {
    margin-top: 15px;
    display: flex;
    // 标签溢出自动换行
    flex-wrap: wrap;
    .tag {
      margin-right: 10px;
      --nut-tag-font-size: 18px;
    }
  }
  .price-brand {
    margin-top: 15px;
    display: flex;
    align-items: center;
    // 价格和标签左右两端
    justify-content: space-between;
    .price {
      color: rgba(red, 0.9);
    }
    .brand {
      // nut-tag设置字体大小
      --nut-tag-font-size: 18px;
      display: flex;
      align-items: center;
    }
  }
}
```

:::

## 源码

```vue
<template>
  <div class="product-cover">
    <image
      :src="product.cover"
      class="cover"
      mode="widthFix"
      :style="{ width }"
    ></image>
    <div class="title">
      {{ product.name }}
    </div>
    <div class="tags">
      <nut-tag
        v-for="tag in product.tags"
        :key="tag"
        class="tag"
        color="#E9E9E9"
        textColor="#999999"
      >
        {{ tag }}
      </nut-tag>
    </div>
    <div class="price-brand">
      <div class="price">￥{{ product.price }}</div>
      <div class="brand">
        <nut-tag type="primary">{{ product.brand }}</nut-tag>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ProductDto } from "@/apis/__generated/model/dto/ProductDto";
withDefaults(
  defineProps<{
    product: ProductDto["ProductRepository/COMPLEX_FETCHER"];
    width?: string;
  }>(),
  { width: "100%" },
);
</script>

<style lang="scss">
@import "../../app.scss";
.product-cover {
  border-radius: 15px;
  background-color: #ffffff;
  padding: 14px;
  position: relative;

  .cover {
    border-radius: 10rpx;
  }

  .title {
    font-size: 28rpx;
    margin-top: 5px;
    color: rgba(black, 0.9);
    @include text-max-line(2);
  }
  .tags {
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
    .tag {
      margin-right: 10px;
      --nut-tag-font-size: 18px;
    }
  }
  .price-brand {
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .price {
      color: rgba(red, 0.9);
    }
    .brand {
      --nut-tag-font-size: 18px;
      display: flex;
      align-items: center;
    }
  }
}
</style>

```
