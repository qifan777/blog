# 用户头像

## 源码

```vue
<template>
  <div>
    <!-- v-bind="$attrs" 可以将为定义在props中的额外属性传给image组件 -->
    <image
      v-if="src"
      :style="{ width, height, borderRadius: radius }"
      v-bind="{ ...$attrs, src, mode }"
    ></image>
        <!-- 头像地址为空则使用默认头像 -->
    <image
      v-else
      :style="{ width, height, borderRadius: radius }"
      v-bind="{ ...$attrs, mode }"
      src="@/assets/icons/person.png"
    ></image>
  </div>
</template>

<script lang="ts" setup>
import { ImageProps } from "@tarojs/components";

withDefaults(
  defineProps<{
    src?: string;
    radius?: string;
    width?: string;
    height?: string;
    mode?: ImageProps["mode"];
  }>(),
  {
    width: "60rpx",
    height: "60rpx",
    radius: "50rpx",
    mode: "widthFix",
  },
);
defineOptions({
  inheritAttrs: false,
});
</script>

<style></style>

```

:::tip
[穿透属性](https://cn.vuejs.org/guide/components/props.html)可以复用组件已有的参数
:::
