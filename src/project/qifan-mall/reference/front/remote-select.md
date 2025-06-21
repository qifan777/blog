---
category:
  - 起凡商城
  - 前端基础
tag:
  - 远程选择器
  - 一对一
  - 一对多
  
date: 2023-12-11
timeline: true
---

# 远程选择器

使用该组件可以快速的选择数据库中的数据。

:::center
![图2 角色选择案例](./img_2.png)
:::

## 使用案例

下面的content就是需要选择的角色列表。

```json
{
  "totalElements": 3,
  "totalPages": 1,
  "size": 10,
  "number": 0,
  "content": [
    {
      "id": "d5352808-e463-4af9-9252-6db6b7df2ca0",
      "name": "测试2"
    },
    {
      "id": "17509f5c-9a6b-429c-b467-cadbd8873d2d",
      "name": "测试3"
    },
    {
      "id": "1",
      "name": "管理员"
    }
  ]
}
```

- `roleQueryOptions`：提供待选择的角色列表
- `roleIds`：已选的角色会双向绑定到该数组
- `label-prop`：根据上面的数据结构知道name可以作为[el-option组件](https://element-plus.gitee.io/zh-CN/component/select.html#option-attributes)的label
- `value-prop`：根据上面的数据结构知道id可以作为el-option组件的value

```vue

<script lang="ts" setup>
  const roleIds = ref<string[]>([])
  // 调用后端获取待选择的列表
  const roleQueryOptions = async (keyword: string) => {
    return (await api.roleController.query({body: {query: {name: keyword}}})).content
  }
</script>
<template>
  <remote-select
      :query-options="roleQueryOptions"
      v-model="roleIds"
      label-prop="name"
      value-prop="id"
      multiple
  >
  </remote-select>
</template>
```

## 源码解析

```vue

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ElOption, ElSelect } from "element-plus";

export interface OptionItem {
  label: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    // 双向绑定选中的值，单向是string，多选是string[]
    modelValue: string[] | string | undefined
    // 待选项
    queryOptions: (query: string) => Promise<Record<string, any>[]>
    // 是否多选，默认false
    multiple?: boolean
    // 待选项中的哪个属性作为label
    labelProp: string
    // 待选项中的哪个属性作为value，默认是id
    valueProp?: string
  }>(),
  { multiple: false, valueProp: "id", modelValue: '' }
);
//  实现双向绑定，https://cn.vuejs.org/guide/components/v-model.html
const emit = defineEmits<{ "update:modelValue": [value: string | string[]] }>();
// 待选项
const options = ref<OptionItem[]>([]);
// 等待数据返回时要显示加载动画
const loading = ref(false);
const remoteMethod = (keyword: string, enforce: boolean = false) => {
  if (keyword || enforce) {
    loading.value = true;
    // 获取带选项
    props.queryOptions(keyword.trim()).then((res) => {
      options.value = res.map((row) => {
        return {
          // 根据映射规则得到label和value
          label: row[props.labelProp] as string,
          value: row[props.valueProp]
        } satisfies OptionItem;
      });
      // 取消加载动画
      loading.value = false;
    });
  }
};
const handleChange = (value: string[] | string) => {
  emit("update:modelValue", value);
};

onMounted(() => {
  remoteMethod("", true);
});
</script>
<template>
  <!--  el-select组件请参考 https://element-plus.gitee.io/zh-CN/component/select.html -->
  <el-select
    :model-value="modelValue"
    clearable
    collapseTags
    filterable
    :multiple="multiple"
    remote
    remote-show-suffix
    :remote-method="remoteMethod"
    :loading="loading"
    @change="handleChange"
  >
    <el-option
      :key="option.value"
      :value="option.value"
      :label="option.label"
      v-for="option in options"
    ></el-option>
  </el-select>
</template>


```