---
category:
  - 起凡商城
  - 小程序
tag:
  - 分页工具
date: 2024-01-23
timeline: true
---
# 分页工具类

## 使用方法

- `api.productOrderController.queryByUser` 是一个后端API方法，用于根据用户查询产品订单。
- 第二个参数传入了`api.productOrderController`，API方法需要在控制器实例上下文中执行, 即`this`指向当前组件实例。
- 初始化查询参数为空对象 {}。

```ts
const { pageData } = usePageHelper(
  api.productOrderController.queryByUser,
  api.productOrderController,
  {},
);
```

## 源码解析

使用组合式API的思想，将小程序分页加载数据的逻辑封装成一个工具类，使用起来非常简单。

1. 加载动画
2. 触底加载下页
3. 下拉刷新
4. 首次加载

- 函数签名：

  ```typescript
  export const usePageHelper = <
    T extends Object,
    E
  >(
    queryApi: (options: { readonly body: QueryRequest<T> }) => Promise<PageResult<E>>,
    object: unknown, // 这里可能是为了调用queryApi方法时绑定上下文，但类型未指定可能需要修正
    initQuery?: T,
    postProcessor?: (data: PageResult<E>) => void,
  ) => ...
  ```

- 输入参数：
  - `queryApi`: 后端分页查询接口，接受一个包含查询请求体的对象。
  - `object`: 用于在调用`queryApi`时绑定上下文，。
  - `initQuery`: 可选的初始查询条件。
  - `postProcessor`: 可选的回调函数，用于对从后端获取的分页数据进行后置处理。

- 内部状态管理：
  - `pageData`: 存储当前页面的分页数据结果。
  - `queryRequest`: 存储当前的查询请求参数，包括查询条件、页码、每页大小等。

- 定义了以下功能函数：
  - `loadPageData`: 根据给定的查询条件请求新的一页数据，并将返回的数据合并到现有的`pageData`中，同时更新分页相关的状态。
  - `reloadPageData`: 重置分页并重新加载第一页数据。
  - 钩挂了Taro的生命周期/事件：
    - `usePullDownRefresh`: 当用户下拉刷新时，清空现有内容并重新加载第一页数据。
    - `useReachBottom`: 当用户滑动到底部时，触发加载下一页数据。
    - `useLoad`: 页面首次加载时执行加载第一页数据。

这个Hook函数可以方便地应用在任何需要展示分页数据的组件中，提供了一种统一且易于复用的方式来管理和加载来自后端的分页数据。

::: tabs
@tab 发起分页请求

```ts
import { type Ref, ref } from "vue";
import type { Page, QueryRequest } from "@/apis/__generated/model/static";
import _ from "lodash";
import Taro from "@tarojs/taro";

export type PageResult<T> = Pick<
  Page<T>,
  "content" | "number" | "size" | "totalElements" | "totalPages"
>;

export const usePageHelper = <T extends Object, E>(
  // 调用后端的查询接口
  queryApi: (options: {
    readonly body: QueryRequest<T>;
  }) => Promise<PageResult<E>>,
  // queryApi所在对象
  object: unknown,
  // 查询条件
  initQuery?: T,
  // 分页数据后置处理
  postProcessor?: (data: PageResult<E>) => void,
) => {
  // 存储分页结果
  const pageData = ref({
    content: [] as E,
    number: 1,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  }) as Ref<PageResult<E>>;
  const queryRequest = ref({
    query: { ...initQuery } ?? {},
    pageNum: 1,
    pageSize: 10,
    likeMode: "ANYWHERE",
    sorts: [{ property: "createdTime", direction: "DESC" }],
  }) as Ref<QueryRequest<T>>;
  // 控制是否到底
  const finish = ref(false);

  // 请求分页数据
  const loadPageData = (request: Partial<QueryRequest<T>> = {}) => {
    // 通用查询对象，防止传入空值
    queryRequest.value = {
      ...queryRequest.value,
      ..._.omitBy(request, _.isNil),
    };
    // 如果查询条件为null，undefined，空字符串则过滤不提交
    queryRequest.value.query = {
      ..._.omitBy(queryRequest.value.query, (row) => {
        if (_.isString(row)) {
          return _.isEmpty(row);
        } else {
          return _.isNil(row);
        }
      }),
    } as T;
    if (finish.value) return;
    // 显示加载动画
    Taro.showLoading({
      title: "加载中",
    });
    // 调用查询接口
    queryApi.apply(object, [{ body: queryRequest.value }]).then(
      (res: PageResult<E>) => {
        if (postProcessor !== undefined) {
          postProcessor(res);
        }
        // 返回结果
        pageData.value.content.push(...res.content);
        finish.value = res.content.length < res.size;
        queryRequest.value.pageNum = (queryRequest.value.pageNum || 1) + 1;
        // 取消加载动画
        Taro.hideLoading();
      },
      (res) => {
        console.log(res);
        Taro.hideLoading();
      },
    );
  };
  // 忽略...
  return {
    queryRequest,
    pageData,
    loadPageData,
  };
};
```

@tab 进入页面自动加载

```ts
export const usePageHelper = <T extends Object, E>(
  // 调用后端的查询接口
  queryApi: (options: {
    readonly body: QueryRequest<T>;
  }) => Promise<PageResult<E>>,
  // queryApi所在对象
  object: unknown,
  // 查询条件
  initQuery?: T,
  // 分页数据后置处理
  postProcessor?: (data: PageResult<E>) => void,
) => {
  // 忽略...

  // 首次进入页面加载
  Taro.useLoad(() => {
    loadPageData();
  });
  return {
    queryRequest,
    pageData,
    loadPageData,
  };
};
```

当进入到页面时会触发`loadPageData()`此时`pageData`就会有数据

@tab 触底加载

```ts
export const usePageHelper = <T extends Object, E>(
  // 调用后端的查询接口
  queryApi: (options: {
    readonly body: QueryRequest<T>;
  }) => Promise<PageResult<E>>,
  // queryApi所在对象
  object: unknown,
  // 查询条件
  initQuery?: T,
  // 分页数据后置处理
  postProcessor?: (data: PageResult<E>) => void,
) => {
  // 忽略...

  // 触底加载
  Taro.useReachBottom(() => {
    loadPageData();
  });
  return {
    queryRequest,
    pageData,
    loadPageData,
  };
};
```

@tab 下拉刷新

```ts
export const usePageHelper = <T extends Object, E>(
  // 调用后端的查询接口
  queryApi: (options: {
    readonly body: QueryRequest<T>;
  }) => Promise<PageResult<E>>,
  // queryApi所在对象
  object: unknown,
  // 查询条件
  initQuery?: T,
  // 分页数据后置处理
  postProcessor?: (data: PageResult<E>) => void,
) => {
  // 忽略...

  // 重置请求分页数据，pageNum=1, pageSize=10。也可以手动指定重置的页数，默认是回到第一页。
  const reloadPageData = (query?: T) => {
    finish.value = false;
    pageData.value.content = [];
    loadPageData({ pageNum: 1, pageSize: 10, query });
  };
  // 下拉刷新
  Taro.usePullDownRefresh(() => {
    reloadPageData();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 300);
  });
  return {
    queryRequest,
    pageData,
    loadPageData,
    reloadPageData
  };
};
```

:::

## 源码

```ts
import { type Ref, ref } from "vue";
import type { Page, QueryRequest } from "@/apis/__generated/model/static";
import _ from "lodash";
import Taro from "@tarojs/taro";

export type PageResult<T> = Pick<
  Page<T>,
  "content" | "number" | "size" | "totalElements" | "totalPages"
>;

export const usePageHelper = <T extends Object, E>(
  // 调用后端的查询接口
  queryApi: (options: {
    readonly body: QueryRequest<T>;
  }) => Promise<PageResult<E>>,
  object: unknown,
  // 查询条件
  initQuery?: T,
  // 分页数据后置处理
  postProcessor?: (data: PageResult<E>) => void,
) => {
  const pageData = ref({
    content: [] as E,
    number: 1,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  }) as Ref<PageResult<E>>;
  const queryRequest = ref({
    query: { ...initQuery } ?? {},
    pageNum: 1,
    pageSize: 10,
    likeMode: "ANYWHERE",
    sorts: [{ property: "createdTime", direction: "DESC" }],
  }) as Ref<QueryRequest<T>>;
  const finish = ref(false);

  // 请求分页数据
  const loadPageData = (request: Partial<QueryRequest<T>> = {}) => {
    // 通用查询对象，防止传入空值
    queryRequest.value = {
      ...queryRequest.value,
      ..._.omitBy(request, _.isNil),
    };
    // 如果查询条件为null，undefined，空字符串则过滤不提交
    queryRequest.value.query = {
      ..._.omitBy(queryRequest.value.query, (row) => {
        if (_.isString(row)) {
          return _.isEmpty(row);
        } else {
          return _.isNil(row);
        }
      }),
    } as T;
    if (finish.value) return;
    // 显示加载动画
    Taro.showLoading({
      title: "加载中",
    });
    // 调用查询接口
    queryApi.apply(object, [{ body: queryRequest.value }]).then(
      (res: PageResult<E>) => {
        if (postProcessor !== undefined) {
          postProcessor(res);
        }
        // 返回结果
        pageData.value.content.push(...res.content);
        finish.value = res.content.length < res.size;
        queryRequest.value.pageNum = (queryRequest.value.pageNum || 1) + 1;
        // 取消加载动画
        Taro.hideLoading();
      },
      (res) => {
        console.log(res);
        Taro.hideLoading();
      },
    );
  };
  // 重新请求分页数据，pageNum=1, pageSize=10
  const reloadPageData = (query?: T) => {
    finish.value = false;
    pageData.value.content = [];
    loadPageData({ pageNum: 1, pageSize: 10, query });
  };
  // 下拉刷新
  Taro.usePullDownRefresh(() => {
    reloadPageData();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 300);
  });
  // 触底加载
  Taro.useReachBottom(() => {
    loadPageData();
  });
  // 首次进入页面加载
  Taro.useLoad(() => {
    loadPageData();
  });
  return {
    queryRequest,
    pageData,
    loadPageData,
    reloadPageData,
  };
};
```
