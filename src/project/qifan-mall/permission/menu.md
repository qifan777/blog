---
category:
  - 起凡商城
tag:
  - 菜单
  - 权限管理

order: 2
date: 2024-01-16
timeline: true
---
# 角色菜单

## 建表

### 菜单表

```sql
-- auto-generated definition
create table menu
(
    id           varchar(36)   not null
        primary key,
    created_time datetime(6)   not null,
    edited_time  datetime(6)   not null,
    creator_id   varchar(36)   not null,
    editor_id    varchar(36)   not null,
    name         varchar(20)   not null,
    path         varchar(2000) not null,
    parent_id    varchar(36)   null,
    order_num    int           null,
    menu_type    varchar(36)   not null,
    icon         varchar(255)  null
);
```

### 角色菜单中间表

```sql
-- auto-generated definition
create table role_menu_rel
(
    id           varchar(36) not null
        primary key,
    created_time datetime(6) not null,
    edited_time  datetime(6) not null,
    creator_id   varchar(36) not null,
    editor_id    varchar(36) not null,
    role_id      varchar(36) not null,
    menu_id      varchar(36) not null,
    constraint role_id
        unique (role_id, menu_id)
);
```

## 实体建模

### 菜单类型枚举

在Dict表中插入下面的字典。再调用`http://localhost:8877/dict/java`生成枚举。

```sql
INSERT INTO mall.dict (id, created_time, edited_time, creator_id, editor_id, key_id, key_en_name, key_name, dict_id, dict_name, dict_en_name, order_num) VALUES ('1f01fa7b-f162-4376-870d-9207735f658d', '2024-01-16 09:33:09.151337', '2024-01-16 09:33:09.151337', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', 2, 'BUTTON', '按钮', 1002, '菜单类型', 'MENU_TYPE', 2);
INSERT INTO mall.dict (id, created_time, edited_time, creator_id, editor_id, key_id, key_en_name, key_name, dict_id, dict_name, dict_en_name, order_num) VALUES ('3860dff4-7f22-4ded-bc30-19cd1b4bc098', '2024-01-16 09:30:39.144272', '2024-01-16 09:33:15.663135', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', 0, 'PAGE', '页面', 1002, '菜单类型', 'MENU_TYPE', 1);
INSERT INTO mall.dict (id, created_time, edited_time, creator_id, editor_id, key_id, key_en_name, key_name, dict_id, dict_name, dict_en_name, order_num) VALUES ('416c90b4-42e8-4af1-a3f5-7e321c9c3437', '2024-01-16 09:32:28.555205', '2024-01-16 09:32:28.555205', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', '0f07d638-f1bc-4011-88d8-6dc650ab06a7', 1, 'DIRECTORY', '目录', 1002, '菜单类型', 'MENU_TYPE', 0);

```

### 菜单实体类

```java
@GenEntity
@Entity
public interface Menu extends BaseEntity {

  @GenField(value = "菜单名称", order = 0)
  String name();

  @GenField(value = "父菜单Id", order = 1)
  @Null
  String parentId();

  @GenField(value = "路由路径", order = 2)
  String path();

  @GenField(value = "排序号", order = 3)
  Integer orderNum();

  @GenField(value = "菜单类型", type = ItemType.SELECTABLE, dictEnName = DictConstants.MENU_TYPE, order = 4)
  MenuType menuType();

  @GenField(value = "图标", type = ItemType.PICTURE, order = 5)
  @Null
  String icon();

  @OneToMany(mappedBy = "menu")
  List<RoleMenuRel> roles();
}
```

### 角色菜单中间表实体类

```java
@Entity
public interface RoleMenuRel extends BaseEntity {
    @OnDissociate(DissociateAction.DELETE)
    @ManyToOne
    @Key
    Role role();

    @OnDissociate(DissociateAction.DELETE)
    @ManyToOne
    @Key
    Menu menu();
}
```

建完实体生成代码，参考[开发流程](../start/develop.md)。

## 菜单父亲选择

:::center
![父亲菜单选择](image.png)
:::

### 创建时选择父亲菜单

```ts
const handleConfirm = () => {
  if (createForm.value.parentId === '') {
    createForm.value.parentId = undefined
  }
  // 忽略...
}
const menuQueryOptions = async (keyword: string) => {
  return (
    await api.menuController.query({
      body: { query: { name: keyword, menuType: 'DIRECTORY'} }
    })
  ).content
}
```

```html
      <el-form-item label="父菜单Id" prop="parentId">
        <remote-select
          label-prop="name"
          :query-options="menuQueryOptions"
          v-model="createForm.parentId"
        ></remote-select>
      </el-form-item>
```

### 编辑时回显菜单

```ts
const menuQueryOptions = async (keyword: string, parentId: string) => {
  return (
    await api.menuController.query({
      body: { query: { name: keyword, menuType: 'DIRECTORY', id: parentId } }
    })
  ).content
}
```

```html
      <el-form-item label="父菜单Id" prop="parentId">
        <remote-select
          :key="updateForm.id"
          label-prop="name"
          :query-options="menuQueryOptions"
          v-model="updateForm.parentId"
        ></remote-select>
      </el-form-item>
```

## 创建角色配置菜单

:::center

![树形菜单选择](image-1.png)

:::

### Dto新增MenuIds

```text
input RoleInput {
    #allScalars(Role)
    id?
    menuIds: Array<String>
}
```

### 后端保存角色

在保存角色的时候同时在`RoleMenuRel`中间表中增加记录

```java
  public String save(RoleInput roleInput) {
    Role role = roleInput.toEntity();
    return roleRepository.save(RoleDraft.$.produce(role, draft -> {
      draft.setMenus(new ArrayList<>());
      Arrays.stream(roleInput.getMenuIds()).forEach(menuId -> {
        draft.addIntoMenus(roleMenuRelDraft -> roleMenuRelDraft.setRole(role)
            .applyMenu(menuDraft -> menuDraft.setId(menuId)));
      });
    })).id();
  }
```

### 创建角色时配置菜单

#### 树状菜单类型

```ts
export type MenuTreeDto = {
  children?: MenuTreeDto[]
} & MenuDto['MenuRepository/COMPLEX_FETCHER']
```

#### 菜单递归方法

```ts
export const buildMenuTree = (
  parentId: string | null,
  menus: MenuTreeDto[],
  filter?: (menu: MenuTreeDto) => boolean
) => {
  const children: MenuTreeDto[] = []
  menus.forEach((menu) => {
    if (menu.parentId === parentId && (filter != null ? filter(menu) : true)) {
      children.push(menu)
      const buildMenus = buildMenuTree(menu.id, menus, filter)
      if (buildMenus.length > 0) {
        menu.children = buildMenus
      }
    }
  })
  children.sort((a, b) => {
    return (a.orderNum || 99999) - (b.orderNum || 99999)
  })
  return children
}
```

#### 菜单树组件

```vue
<script setup lang="ts">
import type { MenuTreeDto } from '@/typings'

const defaultProps = {
  children: 'children',
  label: 'name'
}
defineProps<{ menuTree: MenuTreeDto[] }>()
defineSlots<{
  default(props: { node: { label: string }; data: MenuTreeDto }): void
}>()
</script>

<template>
  <el-tree :data="menuTree" :props="defaultProps" v-bind="$attrs">
    <template #default="{ node, data }: { node: { label: string }; data: MenuTreeDto }">
      <slot :node="node" :data="data"></slot>
    </template>
  </el-tree>
</template>

<style scoped lang="scss"></style>

```

#### 菜单树选择

加载所有的菜单在前端构建菜单树。并获取用户选择的菜单。

```ts
// 构建菜单树
const menuTreeList = ref<MenuTreeDto[]>([])
onMounted(() => {
  api.menuController.query({ body: { pageNum: 1, query: {}, pageSize: 100000 } }).then((res) => {
    menuTreeList.value = buildMenuTree(null, res.content)
    console.log(menuTreeList.value)
  })
})
// 处理菜单树选择事件
const handleNodeCheckChange = (
  value1: MenuTreeDto,
  value2: { checkedNodes: MenuTreeDto[]; checkedKeys: string[] }
) => {
  createForm.value.menuIds = value2.checkedKeys
}
```

```html
      <el-form-item label="菜单">
        <menu-tree
          :menu-tree="menuTreeList"
          show-checkbox
          check-strictly
          nodeKey="id"
          @check="handleNodeCheckChange"
        >
          <template v-slot:default="{ node }">{{ node.label }} </template>
        </menu-tree>
      </el-form-item>
```

## 修改角色回显菜单

### 后端查询角色菜单

在后端配置角色和中间表的关联。通过`@ManyToManyView`进一步获取菜单信息。请[参考用户角色](./role.md/#视图属性RolesView)

```java
@GenEntity
@Entity
public interface Role extends BaseEntity {
    // 忽略其余属性...

    @OneToMany(mappedBy = "role")
    List<RoleMenuRel> menus();
    @ManyToManyView(prop = "menus")
    List<Menu> menusView();
}
```

抓取菜单信息

```java
RoleFetcher ROLE_MENU_FETCHER = RoleFetcher.$.allScalarFields().menusView(true);
```

修复返回类型

```java
    @GetMapping("{id}")
    public @FetchBy(value = "ROLE_MENU_FETCHER") Role findById(@PathVariable String id) {
        return roleService.findById(id);
    }
```

### 前端回显

```ts
const init = async () => {
  dialogData.value.title = '编辑'
  const res = await api.roleController.findById({ id: updateForm.value.id || '' })
  // 回显，把角色关联的菜单信息转成菜单id。
  updateForm.value = {
    ...res,
    menuIds: res.menusView.map((menu) => menu.id)
  }
}
const menuTreeList = ref<MenuTreeDto[]>([])
onMounted(() => {
  api.menuController.query({ body: { pageNum: 1, query: {}, pageSize: 100000 } }).then((res) => {
    menuTreeList.value = buildMenuTree(null, res.content)
  })
})
const handleNodeCheckChange = (
  value1: MenuTreeDto,
  value2: { checkedNodes: MenuTreeDto[]; checkedKeys: string[] }
) => {
  updateForm.value.menuIds = value2.checkedKeys
}
```

```html
    <el-form-item label="菜单">
      <menu-tree
        :key="updateForm.id"
        :menu-tree="menuTreeList"
        show-checkbox
        check-strictly
        nodeKey="id"
        @check="handleNodeCheckChange"
        :default-checked-keys="updateForm.menuIds"
      >
        <template v-slot:default="{ node }">{{ node.label }} </template>
      </menu-tree>
    </el-form-item>
```
