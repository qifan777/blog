---
category:
  - 起凡商城
  - 前端基础
tag:
  - 组合式Helper工具
  
date: 2023-12-06
timeline: true
---

# Helper工具

## TableHelper

TableHelper抽取了表格组件中的通用变量pageData(分页结果), queryRequest(分页请求), tableSelectedRows(已选数据), loading([v-loading](https://element-plus.gitee.io/zh-CN/component/loading.html#%E5%8C%BA%E5%9F%9F%E5%8A%A0%E8%BD%BD)), table(ElTable实例)。除了通用的变量外还有通用的方法。

```ts
import {ElTable} from 'element-plus'
import {type Ref, ref} from 'vue'
import type {Page, QueryRequest} from '@/api/__generated/model/static'
import _ from 'lodash'

export type PageResult<T> = Pick<
    Page<T>,
    'content' | 'number' | 'size' | 'totalElements' | 'totalPages'
>

export const useTableHelper = <T extends Object, E>(
    // 调用后端的查询接口
    queryApi: (options: { readonly body: QueryRequest<T> }) => Promise<PageResult<E>>,
    object: unknown,
    // 查询条件
    initQuery?: T,
    // 分页数据后置处理
    postProcessor?: (data: PageResult<E>) => void
) => {
    const pageData = ref({
        content: <E>[],
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0
    }) as Ref<PageResult<E>>
    const queryRequest = ref({
        query: initQuery ?? {},
        pageNum: 1,
        pageSize: 10,
        likeMode: 'ANYWHERE',
        sorts: [{property: 'createdTime', direction: 'DESC'}]
    }) as Ref<QueryRequest<T>>
    const loading = ref(false)
    const tableSelectedRows = ref([]) as Ref<E[]>
    // ElTable实例
    const table = ref<InstanceType<typeof ElTable>>()

    // 请求分页数据
    const loadTableData = (request: Partial<QueryRequest<T>>) => {
        queryRequest.value = {
            ...queryRequest.value,
            ..._.omitBy(request, _.isNull)
        }
        queryRequest.value.query = {..._.omitBy(queryRequest.value.query, _.isEmpty)} as T
        loading.value = true
        queryApi.apply(object, [{body: queryRequest.value}]).then(
            (res) => {
                if (postProcessor !== undefined) {
                    postProcessor(res)
                }
                pageData.value = res
                loading.value = false
            },
            (res) => {
                console.log(res)
            }
        )
    }
    // 重新请求分页数据，pageNum=1, pageSize=10
    const reloadTableData = (
        queryRequest: Partial<QueryRequest<T>> = {pageNum: 1, pageSize: 10}
    ) => {
        loadTableData(queryRequest)
    }
    // 获取表格选中的数据
    const getTableSelectedRows = () => {
        return tableSelectedRows.value
    }
    // 当表格选择变动时更新选中的数据
    const handleSelectChange = (selectedRows: E[]) => {
        tableSelectedRows.value = selectedRows
    }
    const handleSortChange = ({
                                  prop,
                                  order
                              }: {
        prop: string
        order: 'ascending' | 'descending'
    }) => {
        const directionMap: { ascending: 'ASC'; descending: 'DESC' } = {
            ascending: 'ASC',
            descending: 'DESC'
        }
        const sorts = queryRequest.value.sorts
        sorts[sorts.length - 1]['direction'] = directionMap[order]
        sorts[sorts.length - 1]['property'] = prop
        reloadTableData()
    }

    return {
        table,
        loading,
        queryRequest,
        tableSelectedRows,
        pageData,
        loadTableData,
        reloadTableData,
        getTableSelectedRows,
        handleSortChange,
        handleSelectChange
    }
}
```

## DialogHelper

DialogHelper将Dialog通用的变量抽取出来，每次新建一个Dialog时只需要调用useDialogHelper就可以快速写出一个对话框。

```ts
export const useDialogHelper = () => {
    const dialogData = reactive<{ width: number; title: string; visible: boolean; mode: EditMode }>({
        width: 1200,
        title: '',
        visible: false,
        mode: 'CREATE'
    })
    const closeDialog = () => {
        dialogData.visible = false
    }
    const openDialog = async (mode?: EditMode) => {
        if (mode !== undefined) {
            dialogData.mode = mode
        }
        await nextTick()
        dialogData.visible = true
    }
    return {dialogData, closeDialog, openDialog}
}
```

## queryHelper

queryHelper抽取查询表单的通用变量和方法。辅助Query编写组件。

```ts
export const QueryHelper = <T>(initQuery: T) => {
    const queryData = ref({query: initQuery, matchMode: 'VAGUE'}) as Ref<{
        query: T
        matchMode: MatchMode
    }>
    const restQuery = () => {
        queryData.value.query = {...initQuery}
        queryData.value.matchMode = 'VAGUE'
    }
    return {queryData, restQuery}
}
```
