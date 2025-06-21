---
order: 1
---
# 盲盒

![首页](../image.png =x500)

## 表设计

观察首页可以看出和盲盒相关的表有“盲盒表”和“盲盒类别表”。

- 盲盒表

    下面的这几个字段都很明显，除了“盲盒详情”这个字段目前没用到其他的在首页都可以看见

    ```sql
    create table mystery_box
    (
        id           varchar(32)    not null
            primary key,
        created_time datetime(6)    not null,
        edited_time  datetime(6)    not null,
        creator_id   varchar(32)    not null,
        editor_id    varchar(32)    not null,
        name         varchar(32)    not null comment '盲盒名字',
        details      text           not null comment '盲盒详情',
        tips         varchar(1000)  not null comment '购买提示',
        price        decimal(10, 2) not null comment '价格',
        cover        varchar(255)   not null comment '封面',
        category_id  varchar(32)    not null comment '类别id'
    )
        comment '盲盒';
    ```

- 盲盒类别表

    盲盒类别要支持可排序，图标和描述目前没用到。如果用侧边类别，可以使用图标。

    ```sql
    create table mystery_box_category
    (
        id           varchar(36)  not null
            primary key,
        created_time datetime(6)  not null,
        edited_time  datetime(6)  not null,
        creator_id   varchar(36)  not null,
        editor_id    varchar(36)  not null,
        name         varchar(50)  not null comment '类别名称',
        icon         varchar(255) null comment '类别图标',
        description  text         null comment '描述',
        sort_order   int          null comment '排序号'
    )
        comment '盲盒类别';
    ```

## 盲盒展示

- 首先通过`usePageHelper`调用`api.mysteryBoxForFrontController.query`（盲盒分页接口）
- `usePageHelper`会监听下拉触底事件并加载下一页
- 将盲盒数据传入`walter-fall`瀑布流组件，数据会被分割成左右两边，左右两边分的插槽用户传入自定义组件
- 在插槽中使用`product-cover`组件展示盲盒
- 触发点击事件跳转盲盒详情页

:::tabs
@tab html

```html
    <walter-fall :data-list="pageData.content" class="product-walter-fall">
      <template #itemLeft="{ item }: { item: MysteryBox }">
        <product-cover
          :product="{ ...item, tags: [item.tips] }"
          @click="switchPage('/pages/box/box-details?id=' + item.id)"
        ></product-cover>
      </template>
      <template #itemRight="{ item }: { item: MysteryBox }">
        <product-cover
          :product="{ ...item, tags: [item.tips] }"
          @click="switchPage('/pages/box/box-details?id=' + item.id)"
        ></product-cover>
      </template>
    </walter-fall>
```

@tab ts

```ts
type MysteryBox =
  MysteryBoxDto["MysteryBoxRepository/COMPLEX_FETCHER_FOR_FRONT"];
const { pageData, reloadPageData } = usePageHelper(
  api.mysteryBoxForFrontController.query,
  api.mysteryBoxForFrontController,
  { query: {} },
);
```

:::

## 盲盒类别

:::tabs

@tab html

```html
    <scroll-view class="category-scroll" :scroll-x="true" v-if="activeCategory">
      <div class="category-list">
        <div
          :class="[
            'category',
            activeCategory.id == category.id ? 'active' : '',
          ]"
          v-for="category in categories"
          :key="category.id"
          @click="handleChangeCategory(category)"
        >
          {{ category.name }}
        </div>
      </div>
    </scroll-view>
```

@tab ts

```ts
type Category = Pick<
  MysteryBoxCategoryDto["MysteryBoxCategoryRepository/COMPLEX_FETCHER_FOR_FRONT"],
  "id" | "name"
>;
const categories = ref<Category[]>([{ name: "全部", id: "" }]);
Taro.useLoad(() => {
  api.mysteryBoxCategoryForFrontController
    .query({
      body: {
        pageNum: 1,
        pageSize: 1000,
        query: {},
        sorts: [{ property: "sortOrder", direction: "ASC" }],
      },
    })
    .then((res) => {
      categories.value.push(...res.content);
    });
});
const activeCategory = ref<{ id: string; name: string }>({
  id: "",
  name: "全部",
});
const handleChangeCategory = (category: Category) => {
  activeCategory.value = category;
  reloadPageData({
    pageNum: 1,
    pageSize: 10,
    query: { categoryId: category.id },
  });
};
```

@tab css

```css
@import "../../app.scss";

page {
  background-color: #f5f5f5;
}
.box-list {
  .category-scroll {
    padding: 30px 0;
    background-color: white;
    border-top: 1px solid rgba(black, 0.05);
    .category-list {
      white-space: nowrap;

      .category {
        font-size: 28px;
        display: inline-block;
        margin-left: 20px;
        border-radius: 999px;
        padding: 15px 30px;
        border: 1px solid rgba($primary-color, 0.3);
        color: $primary-color;

        &.active {
          background-color: $primary-color;
          color: white;
          font-weight: bold;
        }
      }
    }
  }
}
```

:::

### 类别展示

- 调用盲盒类别分页接口，`pageSize`设置到1000可以获取所有的类别，`sorts`设置按`sortOrder`升序
- 使用`scroll-view`组件使得类别可以横向滚动，需要搭配`white-space: nowrap;`，让所有内容强制在一行这样才会触发x轴滚动。

### 类别切换

- 定义`activeCategory`表示当前激活的类别
- 动态class，如果当前的类别id和激活的类别id相等用`active`class表示，在css中设置`active`的样式
- 点击类别时触发`handleChangeCategory`设置激活的类别，并重新加载盲盒信息，附带类别查询条件

::: tip
观察`MysteryBoxRepository`你会发现我没有写任何查询条件的拼接，这边我使用了jimmer的[超级QBE](https://babyfish-ct.github.io/jimmer-doc/zh/docs/quick-view/dsl/super_qbe)。

可以看见我这边定义了`id(category)`，意思就是当前端传入`categoryId`就会自动拼接到查询条件中。依次类推传入`details`就会使用`like '%details文本内容%'`自动拼接到查询条件中。

```txt
// src/main/dto/box/MysteryBox.dto
specification MysteryBoxSpec {
    #allScalars
    like/i(name)
    like/i(details)
    like/i(tips)
    id(creator)
    id(category)
}
```

:::
