---
category:
  - 前端工程化
tag:
  - Typescript
date: 2023-09-08
timeline: true
---

# Typescript

vite对typescript的支持是内置的，因此不需要配置typescript的编译，只需要在代码中增加tsconfig.json控制typescript的提示效果。

## 配置

修改package.json中的依赖，然后执行`npm install`。



`package.json`
```json
  "devDependencies": {
    "vite": "^4.4.9",
    "@vitejs/plugin-vue": "^4.3.4",
    "@rushstack/eslint-patch": "^1.3.3",
    "@vue/eslint-config-prettier": "^8.0.0",
    "@vue/eslint-config-standard-with-typescript": "^8.0.0",
    "@vue/tsconfig": "^0.4.0"
  }
```

`@vue/tsconfig`是Vue官方提供的typescript配置，所以我们只需要继承整个配置就可以在代码里面写typescript了。

`tsconfig.json`

```json
{
    "extends": "@vue/tsconfig/tsconfig.dom.json"
}
```
`@vue/eslint-config-standard-with-typescript`是Vue官方提供的ESLint+TypeScript+Vue共享配置，里面已经配置了这三个插件并解决了冲突的规则。

`.eslintrc.cjs`
```js
// 使用CommonJS是使用 require 导入，ESM是使用 import 导入
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    // Vue语法的ESLint插件
    "plugin:vue/vue3-recommended",
    // ESLint+TypeScript Lint+Vue Lint三个插件的集合与配置 
    "@vue/eslint-config-standard-with-typescript",
    // 继承Vue官方提供的ESLintPrettier标准配置
    "@vue/eslint-config-prettier",
  ],
};

```

## 代码

`vite.config.js`->`vite.config.ts`

`index.js`-> 删除

`index.html`->

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<script src="/src/main.ts" type="module"></script>

<body>
    <div id="app"></div>
</body>
</html>
```
`src/main.js` -> `src/main.ts`

`App.vue` -> 
```vue
<template>
  <div>
    <div>当前计数器：{{ counter }}</div>
    <button @click="handleCounterChange(counter + 1)">点击增加</button>
    <button @click="handleCounterChange(counter - 1)">点击减少</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const counter = ref<number>(0);
const handleCounterChange = (value: number): void => {
  counter.value = value;
};
</script>

<style scoped></style>
```

