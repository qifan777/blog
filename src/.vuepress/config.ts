import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: '/blog/',
  dest: 'src/.vuepress/blog',
  lang: "zh-CN",
  title: "起凡Code闲聊",
  description: "起凡Code闲聊",
  theme,
  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
