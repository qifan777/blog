import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/project/post-letter/": [
    { text: "飞鸽邮筒", link: "/project/post-letter/" },
    { text: "后端介绍", link: "/project/post-letter/springboot/" },
    { text: "小程序介绍", link: "/project/post-letter/uni-app/" },
    { text: "后台管理介绍", link: "/project/post-letter/vue3/" },
  ],
  "/project/chatgpt-assistant/": [
    { text: "项目介绍", link: "/project/chatgpt-assistant/" },
    {
      text: "第八期 websocket+stream请求+proxy",
      link: "/project/chatgpt-assistant/chapter8/",
    },
    {
      text: "第九期 Vue3/ElementUI Plus实现聊天面板",
      link: "/project/chatgpt-assistant/chapter9/",
    },
    {
      text: "第十期 消息发送和markdown显示消息记录",
      link: "/project/chatgpt-assistant/chapter10/",
    },
  ],
  "/project/qifan-mall/": [
    { text: "项目介绍", link: "/project/qifan-mall/" },
    { text: "快速上手", prefix: "start/", children: "structure" },
    { text: "登录注册", prefix: "login/", children: "structure" },
    "dict/",
    { text: "权限", prefix: "permission/", children: "structure" },
    { text: "后台框架", prefix: "layout", children: "structure" },
    { text: "商品管理", prefix: "product", children: "structure" },
    { text: "用户中心", prefix: "user", children: "structure" },
    { text: "地址", prefix: "address", children: "structure" },
    { text: "订单", prefix: "order", children: "structure" },
    {
      text: "参考",
      prefix: "reference/",
      children: [
        {
          text: "后台管理端",
          prefix: "front",
          children: "structure",
        },
        "backend/",
        "generator/",
        {
          text: "小程序端",
          prefix: "mp",
          children: "structure",
        },
      ],
    },
  ],
  "/project/uni-ai/": "structure",
  "/project/spring-ai/": 'structure',
  "/project/mystery-box": 'structure',
  '/project/college-help':'structure',
  "/knowledge/vite/": [
    { text: "Vite", link: "/knowledge/vite/" },
    {
      text: "Vue",
      link: "/knowledge/vite/vue",
    },
    {
      text: "ESLint",
      link: "/knowledge/vite/eslint",
    },
    {
      text: "TypeScript",
      link: "/knowledge/vite/typescript",
    },
  ],
  "/knowledge/jpa/hibernate": "structure",
  "/tools/idea": "structure",
});
