

## 技术栈
- `vue3`
- `element-ui`
- `typescript`
- `vuex`
- `router`
## 运行项目

管理员账号 admin，123456
### 环境配置
#### 1.修改阿里云oss
修改 src\utils\oss.ts
```typescript
const OSSParams = {
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAI5t6DcTaSUFLSX6YwBGxx',
    accessKeySecret: 'eiUTDvGwCg11GR118njEXjIoSX2fi9',
    bucket: 'letter-post'
}
```
#### 2.安装node16


### 运行

```shell
yarn install
```

```shell
yarn serve
```


