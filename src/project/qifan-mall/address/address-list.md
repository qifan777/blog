---
category:
  - 起凡商城
tag:
  - 地址
  - 地址列表
  - 小程序
order: 1
date: 2024-01-25
timeline: true
---
# 地址列表

![地址列表页面](./address-list.png =x350)

## 后端

### 建表

```sql
-- auto-generated definition
create table address
(
    id           varchar(36)  not null
        primary key,
    created_time datetime(6)  not null,
    edited_time  datetime(6)  not null,
    creator_id   varchar(36)  not null,
    editor_id    varchar(36)  not null,
    latitude     double       not null,
    longitude    double       not null,
    address      varchar(255) not null,
    province     varchar(255) not null,
    city         varchar(255) not null,
    district     varchar(255) not null,
    phone_number varchar(255) not null,
    real_name    varchar(255) not null,
    top          tinyint(1)   not null,
    details      varchar(255) not null
);
```

### 实体类

```java
@Entity
@GenEntity
public interface Address extends BaseEntity {

  @GenField(value = "维度", order = 0, type = ItemType.INPUT_NUMBER)
  double latitude();

  @GenField(value = "经度", order = 1, type = ItemType.INPUT_NUMBER)
  double longitude();

  @GenField(value = "地址信息", order = 2)
  String address();

  @GenField(value = "地址详情", order = 3)
  String details();

  @GenField(value = "省份", order = 4)
  String province();

  @GenField(value = "城市", order = 5)
  String city();

  @GenField(value = "区县", order = 6)
  String district();

  @GenField(value = "电话", order = 7)
  String phoneNumber();

  @GenField(value = "姓名", order = 8)
  String realName();

  @GenField(value = "是否置顶", order = 9)
  boolean top();
}
```

### 生成代码

请参照[开发流程](../start/develop.md)

### 用户地址查询/设置默认地址

:::tabs
@tab 简单抓取器

创建一个只包含地址表所有标量字段的抓取器，用于在查询时仅获取基本属性，不加载关联对象或深度嵌套的属性, 不需要使用`COMPLEX_FETCHER`.

```java {7}
public interface AddressRepository extends JRepository<Address, String> {

  AddressTable addressTable = AddressTable.$;
  AddressFetcher COMPLEX_FETCHER = AddressFetcher.$.allScalarFields()
      .creator(UserFetcher.$.phone().nickname())
      .editor(UserFetcher.$.phone().nickname());
  AddressFetcher SIMPLE_FETCHER = AddressFetcher.$.allScalarFields();;

// 忽略...
}
```

@tab 查询方法/设置默认

1. `getUserAddress()`方法：
   - 使用SQL查询语句从数据库中获取当前登录用户的地址列表（通过`StpUtil.getLoginIdAsString()`获取用户ID）。
   - 查询结果按照`top`字段降序排列，确保默认地址排在最前面。
   - 使用了`SIMPLE_FETCHER`简单抓取器仅加载所有标量字段的数据，提高查询效率。

2. `top(String id)`方法：
   - 首先将该用户的所有地址的`top`字段设置为`false`，即取消所有其他地址的默认状态。
   - 然后更新指定ID的地址记录，将其`top`字段设置为`true`，使其成为新的默认地址。
   - 方法最后返回`true`表示操作成功。

```java {11-32}
@Service
@Slf4j
@AllArgsConstructor
@Transactional
public class AddressService {

  private final AddressRepository addressRepository;

  // 忽略...

  public List<Address> getUserAddress() {
    AddressTable t = AddressTable.$;
    return addressRepository.sql().createQuery(t)
        .where(t.creator().id().eq(StpUtil.getLoginIdAsString()))
        // 默认地址排在上面
        .orderBy(t.top().desc())
        // 使用简单抓取器
        .select(t.fetch(AddressRepository.SIMPLE_FETCHER))
        .execute();
  }
  public Boolean top(String id) {
    AddressTable t = AddressTable.$;
    // 设置该用户的其他地址为非默认
    addressRepository.sql().createUpdate(t)
        .set(t.top(), false)
        .where(t.creator().id().eq(StpUtil.getLoginIdAsString()))
        .execute();
    // 设置传入的地址为默认
    addressRepository.update(AddressDraft.$.produce(draft -> draft.setId(id)
        .setTop(true)));
    return true;
  }
}
```

@tab API

1. `@DefaultFetcherOwner(AddressRepository.class)`：设置默认的数据加载器（Fetcher）的所有者为`AddressRepository`类。

2. `getUserAddress()`方法：
   - 方法内部调用`addressService.getUserAddress()`来获取当前登录用户的地址列表，返回类型使用`@FetchBy`声明返回的形状是什么，前端同步类型的时候，该接口返回的字段就会根据`SIMPLE_FETCHER`中抓取的字段来确定。`SIMPLE_FETCHER`会在上面指定的Owner中查找

3. `top()`方法：
   - 通过`@RequestParam String id`从请求中获取要设为默认地址的ID。

```java {10-18}
@RestController
@RequestMapping("address")
@AllArgsConstructor
@DefaultFetcherOwner(AddressRepository.class)
public class AddressController {

  private final AddressService addressService;
  // 忽略...

  @GetMapping("user")
  public List<@FetchBy(value = "SIMPLE_FETCHER") Address> getUserAddress() {
    return addressService.getUserAddress();
  }

  @PostMapping("top")
  public Boolean top(@RequestParam String id) {
    return addressService.top(id);
  }
}
```

:::

## 小程序端

### 地址展示

::::tabs
@tab html

```html
<template>
  <div class="address-list-page">
    <!-- 遍历地址列表并使用 address-row 组件展示地址 -->
    <address-row
      class="address"
      :key="address.id"
      :address="address"
      v-for="address in addressList"
    >
    </address-row>
  </div>
</template>

```

@tab css

```scss
page {
  background-color: #f5f5f5;
}
```

@tab ts

1. 首先，导入了以下几个模块：
   - `api`：从`@/utils/api-instance`中引入了一个API服务实例，用于与后端接口交互。
   - `switchPage`：来自`@/utils/common`的一个通用函数，可能用于切换页面或导航。
   - `AddressRow`：自定义组件，显示单个地址信息。
   - `Taro`：Taro框架的核心库，提供了丰富的跨端API。
   - `Edit, Del, Plus`：NutUI图标组件，用于在地址列表中进行编辑、删除和添加操作。
   - `ref`：Vue 3.x中的响应式API，用于创建可响应的数据源。

2. 定义了一个名为`addressList`的响应式引用变量，并初始化为空数组，它将用来存储用户的地址数据。

3. 定义了一个异步函数`loadData()`，该函数通过调用`api.addressController.getUserAddress()`向后端请求用户的地址列表，然后将返回的地址数据赋值给`addressList.value`。

4. 使用Taro生命周期钩子`useDidShow`来监听页面每次展示时触发的事件，在页面每次被打开或重新激活时调用`loadData()`函数，从而确保每次用户进入页面时都会加载最新的地址列表。

`AddressDto["AddressRepository/SIMPLE_FETCHER"]`是一个类型注解，表明`addressList`数组中的元素应该是从后端接口`AddressRepository/SIMPLE_FETCHER`获取的数据类型。

```ts
import { api } from "@/utils/api-instance";
import { switchPage } from "@/utils/common";
import AddressRow from "@/components/address/address-row.vue";
import Taro from "@tarojs/taro";
import { Edit, Del, Plus } from "@nutui/icons-vue-taro";
import { ref } from "vue";
import { AddressDto } from "@/apis/__generated/model/dto";
// 存储用户的地址列表
const addressList = ref<AddressDto["AddressRepository/SIMPLE_FETCHER"][]>([]);
const loadData = () => {
  api.addressController.getUserAddress().then((res) => {
    addressList.value = res;
  });
};
// 每次进入页面都会请求用户地址列表
Taro.useDidShow(() => {
  loadData();
});
```

::::

:::info
[地址详情展示组件(address-row)](../reference/mp/address-row.md)
:::

### 地址删除和编辑跳转

::::tabs
@tab html

在[`<address-row>`](../reference/mp/address-row.md)组件中，有一个名为`#operation`的插槽（slot），用于地址行内的操作部分。这个插槽内包含了两个操作按钮：删除和编辑。

1. 删除按钮：
   - 使用了`<Del>`组件，并添加了类名"delete"以便于样式定制。
   - 监听了点击事件`@click="handleDelete(address.id)"`，当用户点击删除按钮时，会触发`handleDelete`方法并将当前地址ID作为参数传入，用于执行删除指定地址的操作。

2. 编辑按钮：
   - 使用了一个假设存在的`<edit>`组件，并添加了类名"edit"。
   - 该编辑按钮的点击事件绑定了一个函数表达式``@click="switchPage(`/pages/address/address-save?id=${address.id}`)"``，当用户点击时，将会调用`switchPage`函数并跳转到地址编辑页面，同时将地址ID作为查询参数传递给目标页面，方便用户编辑指定地址的信息。

```html {9-19}
<template>
  <div class="address-list-page">
    <address-row
      class="address"
      :key="address.id"
      :address="address"
      v-for="address in addressList"
    >
    <!-- 地址详情组件的插槽 -->
      <template #operation>
        <!-- 有两个操作按钮，删除和编辑 -->
        <div class="operations">
          <Del class="delete" @click="handleDelete(address.id)"></Del>
          <edit
            class="edit"
            @click="switchPage(`/pages/address/address-save?id=${address.id}`)"
          ></edit>
        </div>
      </template>
    </address-row>
  </div>
</template>
```

@tab css

```scss {2-10}
.address-list-page {
  // 让删除和编辑按钮垂直居中
  .operations {
    display: flex;
    justify-content: center;

    .edit {
      margin-left: 20px;
    }
  }
}
```

@tab ts

1. 函数接收一个参数`id`，即待删除地址的ID。

2. 使用Taro框架提供的`showModal`方法显示一个模态对话框：
   - 对话框标题为"是否确认删除"。
   - 设置`showCancel`为`true`，表示在弹出框中显示取消按钮。
   - 在`success`回调函数中处理用户点击确认或取消后的逻辑。

3. 在`success`回调函数内：
   - 首先检查用户是否点击了“确认”按钮，通过判断`confirm`属性（类型为布尔值）是否为`true`来实现。
   - 如果用户点击的是“确认”，则调用`api.addressController.delete`方法向后端发送请求，传入包含待删除地址ID的对象。
   - 请求成功后，调用`loadData`函数重新加载用户地址列表数据，以确保页面展示最新的地址信息。

```ts {18-33}
import { api } from "@/utils/api-instance";
import { switchPage } from "@/utils/common";
import AddressRow from "@/components/address/address-row.vue";
import Taro from "@tarojs/taro";
import { Edit, Del, Plus } from "@nutui/icons-vue-taro";
import { ref } from "vue";
import { AddressDto } from "@/apis/__generated/model/dto";

const addressList = ref<AddressDto["AddressRepository/SIMPLE_FETCHER"][]>([]);
const loadData = () => {
  api.addressController.getUserAddress().then((res) => {
    addressList.value = res;
  });
};
Taro.useDidShow(() => {
  loadData();
});
const handleDelete = (id: string) => {
  //显示弹出框。有确认和取消两个按钮，不管点哪个都会进入success函数，需要判断是否点击了确认。
  Taro.showModal({
    title: "是否确认删除",
    showCancel: true,
    success: ({ confirm }) => {
      // 点击的是确认则删除地址
      if (confirm) {
        api.addressController.delete({ body: [id] }).then(() => {
          // 刷新数据
          loadData();
        });
      }
    },
  });
};
```

::::

### 新增地址跳转

::::tabs

@tab html

```html {4-10}
<template>
  <div class="address-list-page">
    <!-- 忽略... -->
    <div class="add-address" @click="switchPage('/pages/address/address-save')">
      <div class="btn">
        <plus></plus>
        添加收货地址
      </div>
    </div>
  </div>
</template>
```

@tab css

```scss {4-26}
.address-list-page {
  // 忽略 ...

  // 底部的白色区域
  .add-address {
    border-top: 1px solid rgba(black, 0.1);
    box-shadow: 10rpx -10rpx 10rpx rgba(black, 0.05);
    // 位置固定
    position: fixed;
    // 固定在底部
    bottom: 0;
    width: 100%;
    padding: 30rpx 0 60rpx 0;

    // 添加地址按钮
    .btn {
      margin: auto;
      justify-content: center;
      display: flex;
      align-items: center;
      background-image: linear-gradient(#fcd956, #f5d131);
      width: 600rpx;
      padding: 20rpx 0;
      border-radius: 10rpx;
    }
  }
}
```

::::

### 地址复制和默认

::::tabs
@tab html

地址列表中长按地址行时显示操作菜单的功能，用户可以选择不同的操作对地址进行处理

1. 监听`@longpress="showActionSheet(address)"`事件，在用户长按某个地址行时触发`showActionSheet`方法，并将当前地址作为参数传递, 随后从底部弹出菜单。

2. `<nut-action-sheet>`组件：
   - 使用`v-model:visible="show"`绑定动作菜单的可见性状态，当`show`值为`true`时显示动作菜单，否则隐藏。
   - 绑定`:menu-items="actions"`属性，这里的`actions`是定义好的一系列操作选项，如“复制地址”、“设为默认”等。
   - 监听`@choose="handleActionChoose"`事件，当用户从动作菜单中选择一项操作后触发`handleActionChoose`方法，这个方法会根据选择项的值执行相应的操作。

```html {8,13-18}
<template>
  <div class="address-list-page">
    <address-row
      class="address"
      :key="address.id"
      :address="address"
      v-for="address in addressList"
      @longpress="showActionSheet(address)"
    >
    <!-- 忽略... -->
    </address-row>
    <!-- 忽略... -->
    <nut-action-sheet
      v-model:visible="show"
      :menu-items="actions"
      @choose="handleActionChoose"
    />
  </div>
</template>
```

@tab ts

处理地址行长按事件并显示操作菜单的逻辑部分：

1. 定义了一个响应式变量`show`，用于控制操作菜单（`<nut-action-sheet>`组件）的显示与隐藏，默认值为`false`。

2. 创建另一个响应式变量`activeAddress`，存储当前被长按的目标地址信息，默认值是一个空对象。

3. 定义了数组`actions`，包含了两个菜单项：复制地址和设为默认。

4. 定义了一个对象`actionMap`，键是菜单项名称，值是对应的操作函数。当用户从动作菜单中选择一项时，会执行相应的操作：
   - `复制地址`操作：将地址信息格式化后存入剪贴板。
   - `设为默认`操作：调用API方法设置目标地址为默认地址，并在成功后重新加载数据。

5. `handleActionChoose`函数根据用户选择的动作执行对应的函数。它接收一个`menuItems`类型的参数`action`，并查找`actionMap`中对应的动作函数进行执行。

6. `showActionSheet`函数在用户长按地址行时触发，它接收被长按的地址对象作为参数，并将其赋值给`activeAddress`，同时将`show`置为`true`以显示操作菜单。这样，在长按时，不仅会激活当前地址以便后续操作，还会显示出包含“复制地址”和“设为默认”选项的操作菜单。

```ts {1,3-35}
import { menuItems } from "@nutui/nutui-taro/dist/types/__VUE/actionsheet/index.taro.vue";
// 忽略...
// 控制是否显示操作菜单
const show = ref(false);
// 长按地址后这个值会变成目标地址
const activeAddress = ref({} as AddressDto["AddressRepository/SIMPLE_FETCHER"]);
// 菜单项
const actions = [{ name: "复制地址" }, { name: "设为默认" }] as menuItems[];
// 菜单项对应的操作
const actionMap = {
  ["复制地址"]: () => {
    // 复制地址到剪贴板
    const address = activeAddress.value;
    const value = `收件人：${address.realName}\n手机号码：${address.phoneNumber}\n详细地址：${address.address} ${address.details}`;
    Taro.setClipboardData({ data: value });
  },
  ["设为默认"]: () => {
    // 设置默认地址
    api.addressController.top({ id: activeAddress.value.id }).then(() => {
      loadData();
    });
  },
};
// 选择菜单后触发
const handleActionChoose = (action: menuItems) => {
  // 执行对应的操作
  actionMap[action.name]();
};
// 长按地址后触发，显示
const showActionSheet = (
  address: AddressDto["AddressRepository/SIMPLE_FETCHER"],
) => {
  activeAddress.value = address;
  show.value = true;
};
```

::::
