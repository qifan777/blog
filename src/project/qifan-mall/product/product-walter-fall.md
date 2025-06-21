---
category:
  - 起凡商城
tag:
  - 商品管理
  - 瀑布流
  - 小程序

order: 4
date: 2024-01-22
timeline: true
---

# 小程序商品瀑布流

:::center
![瀑布流](./walter-fall.png =x350)
:::

## 导入数据

导入完数据之后需要把创建人和编辑人的id修改为你系统中的用户id。

```sql
INSERT INTO mall.product (id, created_time, edited_time, creator_id, editor_id, name, price, cover, brand, category_id, stock, description, tags, specifications, attributes) VALUES ('04999440-6a62-46ae-8ec3-a25b374fc821', '2024-01-19 14:31:27.312976', '2024-01-20 14:49:48.728173', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '华为Mate 60 Pro', 7999.00, 'https://img12.360buyimg.com/n1/s450x450_jfs/t1/235988/15/12433/48078/65a8f4faF38ef4d31/fc8ca7c491173fe4.jpg', '华为', 'a4518fb9-6879-44a5-8ad2-783867ba46d7', 1, '4060', '["性能很好","颜值高"]', '[{"name":"充电功率","values":["80-119W"]},{"name":"质保期","values":["3年"]}]', '[{"name":"颜色","values":["雅川青","雅丹黑"]},{"name":"版本","values":["12gb+256gb","12gb+512gb"]}]');
INSERT INTO mall.product (id, created_time, edited_time, creator_id, editor_id, name, price, cover, brand, category_id, stock, description, tags, specifications, attributes) VALUES ('04999440-6a62-46ae-8ec3-a25b374fc829', '2024-01-19 14:31:27.312976', '2024-01-20 14:49:48.728173', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '华为Mate 60 Pro', 7999.00, 'https://img12.360buyimg.com/n1/s450x450_jfs/t1/235988/15/12433/48078/65a8f4faF38ef4d31/fc8ca7c491173fe4.jpg', '华为', 'a4518fb9-6879-44a5-8ad2-783867ba46d7', 1, '4060', '["性能很好","颜值高"]', '[{"name":"充电功率","values":["80-119W"]},{"name":"质保期","values":["3年"]}]', '[{"name":"颜色","values":["雅川青","雅丹黑"]},{"name":"版本","values":["12gb+256gb","12gb+512gb"]}]');
INSERT INTO mall.product (id, created_time, edited_time, creator_id, editor_id, name, price, cover, brand, category_id, stock, description, tags, specifications, attributes) VALUES ('fcd61ee7-ff1f-447c-1131-05c6dfea64b0', '2024-01-19 14:31:27.312976', '2024-01-20 14:49:48.728173', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '华为Mate 60 Pro', 7999.00, 'https://img12.360buyimg.com/n1/s450x450_jfs/t1/235988/15/12433/48078/65a8f4faF38ef4d31/fc8ca7c491173fe4.jpg', '华为', 'a4518fb9-6879-44a5-8ad2-783867ba46d7', 1, '4060', '["性能很好","颜值高"]', '[{"name":"充电功率","values":["80-119W"]},{"name":"质保期","values":["3年"]}]', '[{"name":"颜色","values":["雅川青","雅丹黑"]},{"name":"版本","values":["12gb+256gb","12gb+512gb"]}]');
INSERT INTO mall.product (id, created_time, edited_time, creator_id, editor_id, name, price, cover, brand, category_id, stock, description, tags, specifications, attributes) VALUES ('fcd61ee7-ff1f-447c-1131-05c6dfea64b7', '2024-01-22 16:25:52.694286', '2024-01-20 14:49:48.728173', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '华为Mate 60 Pro', 7999.00, 'https://img12.360buyimg.com/n1/s450x450_jfs/t1/235988/15/12433/48078/65a8f4faF38ef4d31/fc8ca7c491173fe4.jpg', '华为', 'a4518fb9-6879-44a5-8ad2-783867ba46d7', 1, '4060', '["性能很好","颜值高"]', '[{"name":"充电功率","values":["80-119W"]},{"name":"质保期","values":["3年"]}]', '[{"name":"颜色","values":["雅川青","雅丹黑"]},{"name":"版本","values":["12gb+256gb","12gb+512gb"]}]');
INSERT INTO mall.product (id, created_time, edited_time, creator_id, editor_id, name, price, cover, brand, category_id, stock, description, tags, specifications, attributes) VALUES ('fcd61ee7-ff1f-448c-1131-05c6dfea64b7', '2024-01-19 14:31:27.312976', '2024-01-22 16:25:52.694286', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '华为MateBook D 14 2024笔记本电脑 13代英特尔酷睿处理器/16:10护眼全面屏 i5 16G 512G 皓月银', 4199.00, 'https://img10.360buyimg.com/n1/jfs/t1/148460/39/40865/58528/65ad1436F567c3e26/9f121abdd7913e20.jpg', '华为（HUAWEI）', '9eba1038-5f7d-4440-a1b2-c9bd91ea15b4', 7, '华为MateBook D 14 2024笔记本电脑 13代英特尔酷睿处理器/16:10护眼全面屏 i5 16G 512G 皓月银', '["性能很好","颜值高"]', '[{"name":"屏幕比例","values":["16:10"]},{"name":"能效等级","values":["一级能效"]},{"name":"屏幕色域","values":["100%sRGB"]}]', '[{"name":"颜色","values":["皓月银","深空灰"]},{"name":"型号","values":["I5+16GB+512GB","I7+16GB+1T"]}]');
INSERT INTO mall.product (id, created_time, edited_time, creator_id, editor_id, name, price, cover, brand, category_id, stock, description, tags, specifications, attributes) VALUES ('fcd61ee7-ff1f-448c-1131-05c6dfec64b7', '2024-01-22 16:25:52.694286', '2024-01-22 16:25:52.694286', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '华为MateBook D 14 2024笔记本电脑 13代英特尔酷睿处理器/16:10护眼全面屏 i5 16G 512G 皓月银', 4199.00, 'https://img10.360buyimg.com/n1/jfs/t1/148460/39/40865/58528/65ad1436F567c3e26/9f121abdd7913e20.jpg', '华为（HUAWEI）', '9eba1038-5f7d-4440-a1b2-c9bd91ea15b4', 7, '华为MateBook D 14 2024笔记本电脑 13代英特尔酷睿处理器/16:10护眼全面屏 i5 16G 512G 皓月银', '["性能很好","颜值高"]', '[{"name":"屏幕比例","values":["16:10"]},{"name":"能效等级","values":["一级能效"]},{"name":"屏幕色域","values":["100%sRGB"]}]', '[{"name":"颜色","values":["皓月银","深空灰"]},{"name":"型号","values":["I5+16GB+512GB","I7+16GB+1T"]}]');
INSERT INTO mall.product (id, created_time, edited_time, creator_id, editor_id, name, price, cover, brand, category_id, stock, description, tags, specifications, attributes) VALUES ('fcd61ee7-ff1f-448c-8131-05c6dfea14b8', '2024-01-22 16:25:52.694286', '2024-01-22 16:25:52.694286', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '索尼（SONY）PS5 PlayStation5（轻薄版 1TB）数字版 国行PS5游戏机', 2999.00, 'https://img12.360buyimg.com/n7/jfs/t1/249378/1/3423/71589/65a788faF19f96be1/128abdbb059b0bd9.jpg', '索尼（SONY）', '9eba1038-5f7d-4440-a1b2-c9bd91ea15b4', 7, '华为MateBook D 14 2024笔记本电脑 13代英特尔酷睿处理器/16:10护眼全面屏 i5 16G 512G 皓月银', '["性能很好","颜值高"]', '[{"name":"屏幕比例","values":["16:10"]},{"name":"能效等级","values":["一级能效"]},{"name":"屏幕色域","values":["100%sRGB"]}]', '[{"name":"颜色","values":["皓月银","深空灰"]},{"name":"型号","values":["I5+16GB+512GB","I7+16GB+1T"]}]');
INSERT INTO mall.product (id, created_time, edited_time, creator_id, editor_id, name, price, cover, brand, category_id, stock, description, tags, specifications, attributes) VALUES ('fcd61ee7-ff1f-448c-8131-05c6dfea64b7', '2024-01-22 16:25:52.694286', '2024-01-22 16:25:52.694286', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '狼蛛（AULA） F99客制化机械键盘gasket结构全键热插拔有线蓝牙无线三模办公电竞游戏 星落凝云-收割者轴
', 259.00, 'https://img13.360buyimg.com/n7/jfs/t1/249540/23/1636/148199/6593c2c1F5b7c6041/7c04e37a0da39862.jpg', '狼蛛（AULA）', '9eba1038-5f7d-4440-a1b2-c9bd91ea15b4', 7, '华为MateBook D 14 2024笔记本电脑 13代英特尔酷睿处理器/16:10护眼全面屏 i5 16G 512G 皓月银', '["性能很好","颜值高"]', '[{"name":"屏幕比例","values":["16:10"]},{"name":"能效等级","values":["一级能效"]},{"name":"屏幕色域","values":["100%sRGB"]}]', '[{"name":"颜色","values":["皓月银","深空灰"]},{"name":"型号","values":["I5+16GB+512GB","I7+16GB+1T"]}]');
INSERT INTO mall.product (id, created_time, edited_time, creator_id, editor_id, name, price, cover, brand, category_id, stock, description, tags, specifications, attributes) VALUES ('fcd61ee7-ff1f-448c-8131-05c6dfea64b8', '2024-01-22 16:25:52.694286', '2024-01-22 16:25:52.694286', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '华为MateBook D 14 2024笔记本电脑 13代英特尔酷睿处理器/16:10护眼全面屏 i5 16G 512G 皓月银', 4199.00, 'https://img10.360buyimg.com/n1/jfs/t1/148460/39/40865/58528/65ad1436F567c3e26/9f121abdd7913e20.jpg', '华为（HUAWEI）', '9eba1038-5f7d-4440-a1b2-c9bd91ea15b4', 7, '华为MateBook D 14 2024笔记本电脑 13代英特尔酷睿处理器/16:10护眼全面屏 i5 16G 512G 皓月银', '["性能很好","颜值高"]', '[{"name":"屏幕比例","values":["16:10"]},{"name":"能效等级","values":["一级能效"]},{"name":"屏幕色域","values":["100%sRGB"]}]', '[{"name":"颜色","values":["皓月银","深空灰"]},{"name":"型号","values":["I5+16GB+512GB","I7+16GB+1T"]}]');
INSERT INTO mall.product (id, created_time, edited_time, creator_id, editor_id, name, price, cover, brand, category_id, stock, description, tags, specifications, attributes) VALUES ('fcd61ee7-ff1f-448c-8131-05c6dfea64bc', '2024-01-22 16:25:52.694286', '2024-01-22 16:25:52.694286', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '狼蛛（AULA） F99客制化机械键盘gasket结构全键热插拔有线蓝牙无线三模办公电竞游戏 星落凝云-收割者轴
', 259.00, 'https://img13.360buyimg.com/n7/jfs/t1/249540/23/1636/148199/6593c2c1F5b7c6041/7c04e37a0da39862.jpg', '狼蛛（AULA）', '9eba1038-5f7d-4440-a1b2-c9bd91ea15b4', 7, '华为MateBook D 14 2024笔记本电脑 13代英特尔酷睿处理器/16:10护眼全面屏 i5 16G 512G 皓月银', '["性能很好","颜值高"]', '[{"name":"屏幕比例","values":["16:10"]},{"name":"能效等级","values":["一级能效"]},{"name":"屏幕色域","values":["100%sRGB"]}]', '[{"name":"颜色","values":["皓月银","深空灰"]},{"name":"型号","values":["I5+16GB+512GB","I7+16GB+1T"]}]');
INSERT INTO mall.product (id, created_time, edited_time, creator_id, editor_id, name, price, cover, brand, category_id, stock, description, tags, specifications, attributes) VALUES ('fcd61ee7-ff1f-448c-8131-05c6dfea64bz', '2024-01-19 14:31:27.312976', '2024-01-20 14:49:48.728173', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '华为Mate 60 Pro', 7999.00, 'https://img12.360buyimg.com/n1/s450x450_jfs/t1/235988/15/12433/48078/65a8f4faF38ef4d31/fc8ca7c491173fe4.jpg', '华为', 'a4518fb9-6879-44a5-8ad2-783867ba46d7', 1, '4060', '["性能很好","颜值高"]', '[{"name":"充电功率","values":["80-119W"]},{"name":"质保期","values":["3年"]}]', '[{"name":"颜色","values":["雅川青","雅丹黑"]},{"name":"版本","values":["12gb+256gb","12gb+512gb"]}]');
INSERT INTO mall.product_category (id, created_time, edited_time, creator_id, editor_id, name, parent_id, image, description, sort_order) VALUES ('51eac0d9-a653-4edb-b156-5a7d96648196', '2024-01-18 14:40:58.923272', '2024-01-18 14:40:58.923272', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '显卡', '9eba1038-5f7d-4440-a1b2-c9bd91ea15b4', '', '显卡', 1);
INSERT INTO mall.product_category (id, created_time, edited_time, creator_id, editor_id, name, parent_id, image, description, sort_order) VALUES ('9eba1038-5f7d-4440-a1b2-c9bd91ea15b4', '2024-01-18 14:39:20.619126', '2024-01-18 14:39:20.619126', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '电脑', null, '', '电脑', 0);
INSERT INTO mall.product_category (id, created_time, edited_time, creator_id, editor_id, name, parent_id, image, description, sort_order) VALUES ('a4518fb9-6879-44a5-8ad2-783867ba46d7', '2024-01-18 14:40:06.789083', '2024-01-18 14:40:06.789083', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '内存条', '9eba1038-5f7d-4440-a1b2-c9bd91ea15b4', '', '内存条', 1);

```

## 启用下拉刷新

`index.config.ts`

```ts
export default definePageConfig({
  navigationBarTitleText: "首页",
  enablePullDownRefresh: true,
});

```

设置 `enablePullRefresh` 为 `true`后可以使用下面的代码监听下拉事件。

```ts
  Taro.usePullDownRefresh(() => {
    // 监听下拉刷新事件
  })
```

## 分页加载商品

```ts
const { pageData } = usePageHelper(
  api.productController.query,
  api.productController,
  {},
);
```

pageData中的数据会在进入页面时自动加载，触底时也会自动加载下一页。

:::info
[usePageHelper](../reference/mp/page.md)是组合式api封装的分页加载工具, 其中包含了下拉刷新，触底刷新，首次自动加载，加载动画。
:::

## 瀑布流组件

瀑布流左右两列有插槽，在插槽上使用[商品封面组件](../reference/mp/product-cover.md)

```html
  <walter-fall :data-list="pageData.content" class="product-walter-fall">
  <!-- 左侧插槽 -->
    <template #itemLeft="{ item }">
      <product-cover :product="item"></product-cover>
    </template>
    <!-- 右侧插槽 -->
    <template #itemRight="{ item }">
      <product-cover :product="item"></product-cover>
    </template>
  </walter-fall>
```

:::info
[product-cover](../reference/mp/product-cover.md)商品纵向详情组件
[walter-fall](../reference/mp/walter-fall.md)瀑布流布局组件
:::
