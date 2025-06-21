---
order: 1
---
# 地址列表

![地址列表](../image-5.png =x500)

![长按菜单](../image-6.png =x500)

## 表设计

地址表没有太复杂的逻辑，结合页面就可以看出每个字段的含义了

```sql
create table address
(
    id           varchar(36)  not null
        primary key,
    created_time datetime(6)  not null,
    edited_time  datetime(6)  not null,
    creator_id   varchar(36)  not null,
    editor_id    varchar(36)  not null,
    latitude     double       not null comment '维度',
    longitude    double       not null comment '经度',
    details      varchar(255) not null comment '详细地址',
    province     varchar(255) not null comment '省',
    city         varchar(255) not null comment '市',
    district     varchar(255) not null comment '区',
    phone_number varchar(255) not null comment '手机号',
    real_name    varchar(255) not null comment '真实姓名',
    house_number varchar(255) not null comment '门牌号',
    top          tinyint(1)   not null comment '是否置顶'
)
    comment '地址表';
```

## 地址展示

- 首先使用`usePageHelper`分页加载地址列表，`v-for`遍历地址列表并使用`address-row`组件渲染地址
- 在地址上有四种操作
  - 编辑操作
  - 删除操作
  - 点击操作，当订单创建页面跳转到地址列表页面时，点击地址就代表选择该地址作为收货地址
  - 长按操作，弹出菜单，菜单中包含了两种操作
    - 复制地址
    - 设置默认

### 点击操作

进入到地址列表有两个入口，一个是通过用户中小页面的地址簿，第二个是从创建订单页面地址选择跳转。如果是来自订单创建，点击地址后要回退，并且在回退成功后发送地址到订单创建页面。

在`Taro.useLoad`的回调函数中可以获取别的页面传入的参数，订单创建页面会传`from`参数，通过这个参数来判断跳转来源。

### 长按操作

监听`longpress`事件修改`show`变量弹出`<nut-action-sheet/>`。因为每个菜单项都对应一种操作，这边可以使用策略模式的技巧，将菜单的名字和操作通过map绑定。

当用户点击菜单的时候通过名字从`actionMap`取出菜单对应的操作。

```vue
<template>
  <div class="address-list-page">
    <address-row
      class="address"
      :key="address.id"
      :address="address"
      v-for="address in pageData.content"
      @longpress="showActionSheet(address)"
      @click="handleAddressChoose(address)"
    >
      <template #operation>
        <div class="operations">
          <del class="delete" @click="handleDelete(address.id)"></del>
          <edit
            class="edit"
            @click.stop="switchPage(`./address-save?id=${address.id}`)"
          ></edit>
        </div>
      </template>
    </address-row>
    <div class="add-address" @click="switchPage('./address-save')">
      <div class="btn">
        <plus></plus>
        添加收货地址
      </div>
    </div>
    <nut-action-sheet
      v-model:visible="show"
      :menu-items="actions"
      @choose="handleActionChoose"
    />
  </div>
</template>

<script lang="ts" setup>
import { api } from "@/utils/api-instance";
import { switchPage } from "@/utils/common";
import AddressRow from "@/components/address/address-row.vue";
import Taro from "@tarojs/taro";
import { Edit, Del, Plus } from "@nutui/icons-vue-taro";
import { ref } from "vue";
import { AddressDto } from "@/apis/__generated/model/dto";
import { menuItems } from "@nutui/nutui-taro/dist/types/__VUE/actionsheet/index.taro.vue";
import { usePageHelper } from "@/utils/page";
// -----地址列表加载-----
type Address = AddressDto["AddressRepository/COMPLEX_FETCHER_FOR_FRONT"];
const { pageData, reloadPageData } = usePageHelper(
  api.addressForFrontController.query,
  api.addressForFrontController,
  { pageSize: 10000, pageNum: 1, query: {} },
  // 每次进入页面刷新数据（Taro.useDidShow），禁用首次进入页面刷新（Taro.useLoad），避免重复请求
  { enableShowLoad: true, enableLoad: false },
);
// -----地址列表加载-----

// -----地址删除操作-----
const handleDelete = (id: string) => {
  Taro.showModal({
    title: "是否确认删除",
    showCancel: true,
    success: async ({ confirm }) => {
      if (confirm) {
        await api.addressForFrontController.delete({ body: [id] });
        await reloadPageData();
      }
    },
  });
};
// -----地址删除操作-----

// -----地址点击操作-----
const isFromOrder = ref(false);
Taro.useLoad(({ from }) => {
  if (from === "order") {
    isFromOrder.value = true;
  }
});
const handleAddressChoose = (value: Address) => {
  if (isFromOrder.value) {
    Taro.navigateBack({
      success() {
        Taro.eventCenter.trigger("address", value);
      },
    });
  }
};
// -----地址点击操作-----

// -----长按地址显示菜单操作-----
const show = ref(false);
const activeAddress = ref<Address>();
const showActionSheet = (address: Address) => {
  activeAddress.value = address;
  show.value = true;
};

const actions = [{ name: "复制地址" }, { name: "设为默认" }] as menuItems[];
// 菜单项对应的操作
const actionMap = {
  ["复制地址"]: (address: Address) => {
    const value = `收件人：${address.realName}\n手机号码：${address.phoneNumber}\n详细地址：${address.details} ${address.houseNumber}`;
    Taro.setClipboardData({ data: value });
  },
  ["设为默认"]: async (address: Address) => {
    await api.addressForFrontController.top({ id: address.id });
    await reloadPageData();
  },
};
const handleActionChoose = (action: menuItems) => {
  actionMap[action.name](activeAddress.value);
};
// -----长按地址显示菜单操作-----
</script>
```
