---
category:
  - 前端工程化
tag:
  - ESLint
date: 2023-09-08
timeline: true
---

# ESLint

ESLint可以做两件事

1. 语法校验。扫描你代码中的一些不规范写法提出意见。
   比如for循环渲染数据时忘记加key。vue的eslint插件就会对这种影响性能的写法提出意见。
2. 代码整理。每个eslint插件都可以增加自己的代码整理规则。

## 概念

- ESLint 插件：定义一系列的校验规则，常以 eslint-plugin-* 命名，在 ESLint 配置文件中通过 plugins 选项引入。
  需要注意的是，插件仅定义规则，并不启用规则。规则是由 ESLint 配置的 rules 选项启用的。
- 可共享配置（ Shareable Configs ）：每个 ESLint 配置文件都可以复用其他配置，这些配置称为可共享配置。可共享配置一共有两种形式：
    - ESLint Config：纯粹的配置，包含各个 ESLint 配置选项，常用 eslint-config-* 命名发布
    - ESLint 插件带配置（ Plugins with configs ） ：在原先的 ESLint 插件上导出 configs 对象，configs 等价于
      ESLint Config。拓展此类插件的可共享配置时需要在前面增加 plugin: 前缀，比如 plugin:
      prettier/recommended

## 安装

**@vue/eslint-config-standard**

这是Vue官方提供的共享配置。里面包含了eslint标准配置和eslint-plugin-vue插件。

- eslint标准配置。eslint标准配置依赖了eslint官方插件。

- eslint-plugin-vue插件。eslint-plugin-vue包含了vue语法的校验规则和少量的vue代码整理。
  eslint-plugin-vue中又包含了好几个共享配置。

**@vue/eslint-config-prettier**

前面介绍了eslint提供了html/css/js的校验和整理规则，但是eslint自带的整理规则不太好看。
所以我这边使用了prettier的规则。

**@rushstack/eslint-patch**

eslint为什么配置起来很麻烦？主要原因是当我们在安装eslint-config时还需要手动去安装这些config对应的plugin。
eslint没办法逐层的加载依赖。

eslint-patch就是为了解决这一问题。

```shell
npm i @rushstack/eslint-patch -D
npm i @vue/eslint-config-prettier -D
npm i @vue/eslint-config-standard -D
```

## 配置

由于ESLint是运行在Node.js上，所以它的模块结构是CommonJS。而我们的前端项目
.js文件默认是ESM模块（.mjs），为了让ESLint可以正确导入模块这边使用.cjs声明该js文件的模块是 CommonJS
格式。

`.eslintrc.cjs`

```js
// 使用CommonJS是使用 require 导入，ESM是使用 import 导入
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    // Vue语法的ESLint插件
    "plugin:vue/vue3-recommended",
    // 继承Vue官方提供的ESLint标准配置
    "@vue/eslint-config-standard",
    // 继承Vue官方提供的ESLintPrettier标准配置
    "@vue/eslint-config-prettier",
  ],
};

```

`.gitignore`

```ignorelang
### IntelliJ IDEA ###
/.idea/
*.iws
*.iml
*.ipr
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
.DS_Store
dist
dist-ssr
coverage
*.local

/cypress/videos/
/cypress/screenshots/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

新增了两个script，format和lint分别用于整理代码和修复eslint报错。lint的同时也会整理所有代码。如果你仅仅只想整理代码可以使用format。

`package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "format": "prettier --write .",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore"
  },
  "dependencies": {
    "vite": "^4.4.9",
    "vue": "^3.3.4"
  },
  "devDependencies": {
    "vite": "^4.4.9",
    "@vitejs/plugin-vue": "^4.3.4",
    "@rushstack/eslint-patch": "^1.3.3",
    "@vue/eslint-config-prettier": "^8.0.0",
    "@vue/eslint-config-standard": "^8.0.1"
  }
}
```

###              


