---
order: 2
---
# 盲盒详情页

![首页](../image-1.png =x500)

![商品详情对话框](../image-3.png =x500)

## 表设计

订单详情页中多了商品信息，一个盲盒可以关联多个商品，商品可以被多个盲盒关联。

### 商品表

```sql
create table product
(
    id             varchar(36)    not null
        primary key,
    created_time   datetime(6)    not null,
    edited_time    datetime(6)    not null,
    creator_id     varchar(36)    not null,
    editor_id      varchar(36)    not null,
    name           varchar(255)   not null comment '名称',
    price          decimal(10, 2) not null comment '价格',
    cover          varchar(255)   not null comment '封面',
    brand          varchar(255)   not null comment '品牌',
    specifications text           not null comment '规格参数',
    quality_type   varchar(32)    not null comment '品质类型（普通款，隐藏款，超神款）'
    category_id    varchar(36)    not null comment '类别id（未用）',
    description    text           not null comment '描述（未用）',
    tags           varchar(255)   not null comment '标签（未用）',
    attributes     text           not null comment '属性（未用）',
)
    comment '商品表';
```

### 盲盒商品关系表

```sql
create table mystery_box_product_rel
(
    id             varchar(32) not null
        primary key,
    created_time   datetime(6) not null,
    edited_time    datetime(6) not null,
    creator_id     varchar(32) not null,
    editor_id      varchar(32) not null,
    mystery_box_id varchar(32) not null comment '盲盒',
    product_id     varchar(32) not null comment '商品'
)
    comment '盲盒-商品中间表';
```

通过下面的sql即可查询出盲盒内的商品

```sql
select t1.*, t3.*
from mystery_box t1
         left join mystery_box_product_rel t2 on t1.id = t2.mystery_box_id
         left join product t3 on t2.product_id = t3.id
where t1.id = 'ebf8f84d60814944a847e0de4bb1d8b4' -- 盲盒id
```

## 盲盒信息

:::tabs

@tab ts

```ts
// -----盲盒详情，含商品信息-----
const box =
  ref<MysteryBoxDto["MysteryBoxRepository/COMPLEX_FETCHER_FOR_FRONT"]>();
Taro.useLoad(({id}) => {
  api.mysteryBoxForFrontController.findById({ id }).then((res) => {
    res.products = res.products.sort((a, b) => a.price - b.price);
    box.value = res;
  });
});
// -----盲盒详情，含商品信息-----

// -----商品详情对话框-----
type Product =
  MysteryBoxDto["MysteryBoxRepository/COMPLEX_FETCHER_FOR_FRONT"]["products"][0];
const dialogVisible = ref(false);
const activeProduct = ref<Product>();
const handleProductClick = (product: Product) => {
  activeProduct.value = product;
  dialogVisible.value = true;
};
// -----商品详情对话框-----

```

@tab html+css

- 这边使用`<scroll-view></scroll-view>`的原因是想要达到背景图片固定，内容可以滑动的效果。（html 8行）

- 在`v-for`渲染商品时，根据商品的品质动态的添加class。不同的品质会渲染不同的背景图片和背景文字。(html 29行，css 40-54行)

- `class=product-list`设置网格布局，并且分成三列（css 9-15 ）。再通过`class=product`设置`margin: auto`达到在列里居中的效果(css 22)。

- 点击商品触发`handleProductClick`打卡商品详情对话框（html 30）。

```html {8,29,30}
<template>
  <div v-if="box">
    <product-dialog
      v-if="activeProduct"
      v-model:visible="dialogVisible"
      :product="activeProduct"
    ></product-dialog>
    <scroll-view class="box-details" :scroll-y="true">
      <!--盲盒基本信息-->
      <div class="box-info">
        <div class="name">{{ box.name }}</div>
        <div class="probability">
          <image src="@/assets/icons/baodi.png" mode="heightFix"></image>
          <div class="value">
            价值 {{ box.products[0].price }}-{{
              box.products[box.products.length - 1].price
            }}元
          </div>
        </div>
      </div>
      <!--盲盒商品列表-->
      <div class="product-list">
        <div
          class="product-wrapper"
          v-for="product in box.products"
          :key="product.id"
        >
          <div
            :class="['product', product.qualityType.toLowerCase()]"
            @click="handleProductClick(product)"
          >
            <image class="cover" :src="product.cover" mode="widthFix"></image>
            <div class="background-text"></div>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>
```

```css {9-15,22,41-55}
.box-details {
  box-sizing: border-box;
  height: 100vh;
  background-size: cover;
  background: url("../../assets/images/background.jpg") top no-repeat;
  // 防止刘海屏遮住
  padding-top: v-bind(marginTop);
  // 忽略...
  .product-list {
    padding: 30px;
    // 网格布局
    display: grid;
    // 分三列
    grid-template-columns: repeat(3, 1fr);
    grid-row-gap: 40px;
    
    .product {
      width: 200px;
      height: 302.7px;
      // 由于商品的信息宽度只有200px，整个屏幕的宽度有750px，即使扣除掉左右padding（60px）
      // 再分成三列，每列的宽度也有230px，意思就是商品在它的这列中没有居中。因此这边设置margin: auto使得在列里居中。
      margin: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-repeat: no-repeat;
      background-size: cover;
      .cover {
        width: 200px;
      }
      .background-text {
        background-repeat: no-repeat;
        background-size: contain;
        width: 200px;
        height: 66px;
        // 水平居中
        background-position: 50%;
      }
    }
    .legendary {
      background-image: url("../../assets/icons/legendary-style.png");
      .background-text {
        background-image: url("../../assets/icons/legendary-star.png");
      }
    }
    .hidden {
      background-image: url("../../assets/icons/hidden-style.png");
      .background-text {
        background-image: url("../../assets/icons/hidden-star.png");
      }
    }
    .general {
      background-image: url("../../assets/icons/general-style.png");
    }
  }
}
```

@tab java

定义需要抓取的信息，根据详情页的内容可以知道需要获取盲盒信息以及商品信息

```java
// 盲盒抓手 io.github.qifan777.server.box.root.repository.MysteryBoxRepository
MysteryBoxFetcher COMPLEX_FETCHER_FOR_FRONT = MysteryBoxFetcher.$
        // 盲盒表的所有字段
        .allScalarFields()
        // 抓取关联的商品
        .products(ProductRepository.COMPLEX_FETCHER_FOR_FRONT)
        .creator(true);
// 商品信息抓手 io.github.qifan777.server.product.root.repository.ProductRepository
ProductFetcher COMPLEX_FETCHER_FOR_FRONT = ProductFetcher.$
        // 商品表的所有字段
        .allScalarFields()
        // 抓取关联的类别
        .category(ProductCategoryFetcher.$.name())
        .creator(true);
```

盲盒详情获取接口，根据id查询盲盒，并且传入抓手获取需要的信息。

```java
    @GetMapping("{id}")
    public @FetchBy(value = "COMPLEX_FETCHER_FOR_FRONT") MysteryBox findById(@PathVariable String id) {
        return mysteryBoxRepository.findById(id, MysteryBoxRepository.COMPLEX_FETCHER_FOR_FRONT)
                .orElseThrow(() -> new BusinessException("数据不存在"));
    }

```

返回的数据结构

```json
{
  // ...忽略通用字段
  "name": "一见倾心的手办",
  "details": "一见倾心的手办",
  "tips": "预售",
  "price": 15.00,
  "cover": "https://arttalks.oss-cn-beijing.aliyuncs.com/20240826151931c55d7389a8438c7146d1dfb9e5ace76e.png",
  // 盲盒内的商品信息列表，一对多关联查询出的商品
  "products": [
    {
      "name": "GOLDEN HEAD 碧蓝航线 埃尔斯贝特 错失的高光时刻？ 1/7手办 限定版",
      "price": 1185.00,
      "cover": "https://arttalks.oss-cn-beijing.aliyuncs.com/202408261604563e68277669565a5f3925ea051cab3334.webp",
      "brand": "GOLDEN HEAD",
      // ....
    },
    {
      // ....
    },
    {
      // ....
    }
  ]
}
```

:::
