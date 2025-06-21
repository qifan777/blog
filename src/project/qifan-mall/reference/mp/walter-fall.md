---
category:
  - 起凡商城
  - 小程序
tag:
  - 瀑布流
date: 2024-01-23
timeline: true
---
# 瀑布流组件

![效果](../../product/walter-fall.png =x350)

## 网格布局左右两列

:::tabs
@tab html

```html
<div class="water-fall">
  <!-- 左侧瀑布流   -->
  <div class="left-water-fall">
  </div>
  <!--  右侧瀑布流  -->
  <div class="right-water-fall">
  </div>
</div>
```

@tab css

```scss
.water-fall {
  // 网格布局
  display: grid;
  // 左右两边均等分
  grid-template-columns: 1fr 1fr;
  // 中间间隔
  grid-gap: 15px;
  margin: 15px;
  // 左列内的内容居中
  .left-water-fall {
    justify-content: center;
  }
  // 右列内的内容居中
  .right-water-fall {
    justify-content: center;
  }
}
```

:::

## 计算属性+插槽显示数据

:::tabs

@tab html

```html {5-7,11-13}
<template>
  <div class="water-fall">
    <!-- 左侧瀑布流   -->
    <div class="left-water-fall">
      <div v-for="(item, index) in leftList" :key="index" class="item-wrapper">
        <slot :item="item" name="itemLeft"></slot>
      </div>
    </div>
    <!--  右侧瀑布流  -->
    <div class="right-water-fall">
      <div v-for="(item, index) in rightList" :key="index" class="item-wrapper">
        <slot :item="item" name="itemRight"></slot>
      </div>
    </div>
  </div>
</template>

@tab css

```scss {6-8}
.water-fall {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;
  margin: 15px;
  .item-wrapper {
    margin-top: 15px;
  }
  .left-water-fall {
    justify-content: center;
  }

  .right-water-fall {
    justify-content: center;
  }
}
```

@tab ts

```ts
// generic="T" 定义泛型
<script lang="ts" setup generic="T">
import { computed } from "vue";
// 接收输入的列表数据
const props = defineProps<{ dataList: T[] }>();
defineSlots<{
  itemRight: (props: { item: T }) => void;
  itemLeft: (props: { item: T }) => void;
}>();
// 划分左右两边的列表
const leftList = computed(() =>
  props.dataList.filter((_value, index) => index % 2 === 0),
);
const rightList = computed(() =>
  props.dataList.filter((_value, index) => index % 2 !== 0),
);
</script>
```

:::

