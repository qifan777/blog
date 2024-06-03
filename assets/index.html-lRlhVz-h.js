import{_ as i}from"./plugin-vue_export-helper-x3n3nnut.js";import{r as s,o,c as r,d as t,e,b as n,a as d}from"./app-z-rc3cIN.js";const a="/blog/assets/image-ZphxNfbK.png",h="/blog/assets/image-1-puxwiwQS.png",u="/blog/assets/image-2-tqk2mg-W.png",c="/blog/assets/image-3-upoE0vee.png",p={},_=d('<h1 id="uni-ai-ai聚合" tabindex="-1"><a class="header-anchor" href="#uni-ai-ai聚合"><span>UNI-AI（AI聚合）</span></a></h1><h2 id="项目内容" tabindex="-1"><a class="header-anchor" href="#项目内容"><span>项目内容</span></a></h2><table><thead><tr><th>厂家</th><th>文本对话</th><th>图片理解</th><th>图片生成</th><th>知识库（向量数据库）</th><th>预置角色</th></tr></thead><tbody><tr><td>OpenAI</td><td>✔</td><td>✔</td><td>计划中</td><td>✔</td><td>✔</td></tr><tr><td>阿里灵积</td><td>✔</td><td>✔</td><td>计划中</td><td>✔</td><td>✔</td></tr><tr><td>百度千帆</td><td>✔</td><td>×</td><td>计划中</td><td>✔</td><td>✔</td></tr><tr><td>讯飞星火</td><td>✔</td><td>×</td><td>计划中</td><td>×</td><td>✔</td></tr><tr><td>智普清言</td><td>✔</td><td>✔</td><td>计划中</td><td>✔</td><td>✔</td></tr><tr><td>kimi</td><td>✔</td><td>×</td><td>计划中</td><td>×</td><td>✔</td></tr></tbody></table><h3 id="知识库" tabindex="-1"><a class="header-anchor" href="#知识库"><span>知识库</span></a></h3><figure><img src="'+a+'" alt="知识库" tabindex="0" loading="lazy"><figcaption>知识库</figcaption></figure><h3 id="图片理解" tabindex="-1"><a class="header-anchor" href="#图片理解"><span>图片理解</span></a></h3><figure><img src="'+h+'" alt="千问VL" tabindex="0" loading="lazy"><figcaption>千问VL</figcaption></figure><figure><img src="'+u+'" alt="智谱清言VL" tabindex="0" loading="lazy"><figcaption>智谱清言VL</figcaption></figure><h3 id="文本对话" tabindex="-1"><a class="header-anchor" href="#文本对话"><span>文本对话</span></a></h3><figure><img src="'+c+'" alt="markdown解析+流式对话+多种模型" tabindex="0" loading="lazy"><figcaption>markdown解析+流式对话+多种模型</figcaption></figure><h2 id="项目结构" tabindex="-1"><a class="header-anchor" href="#项目结构"><span>项目结构</span></a></h2><ul><li>uni-ai-admin 聊天界面+后台管理 <ul><li>scripts <ul><li>generate-api.js 请求后端生成src/apis下的接口和ts类型</li></ul></li><li>src <ul><li>apis 调用后端的接口和接口的ts类型</li><li>assets 静态资源</li><li>components 全局通用组件</li><li>layout 页头/页签管理/左侧树菜单</li><li>router 路由</li><li>store 全局级别的状态管理</li><li>utils 工具</li><li>typings 通用ts类型</li><li>views 页面 <ul><li>xxx(如: menu) <ul><li>xxx-vuw.vue 入口页面，在router中注册</li><li>components 页面级别的通用组件 <ul><li>xxx-create-form.vue 创建表单</li><li>xxx-update-form.vue 编辑表单</li><li>xxx-table.vue 展示表格</li><li>xxx-query.vue 查询表单</li><li>xxx-dialog.vue 对话框</li></ul></li><li>store 页面级别的状态管理，上述几个组件共享store中的变量</li></ul></li></ul></li><li>App.vue 整个项目的入口</li><li>main.ts vue实例初始化</li></ul></li><li>env.development 开发态环境变量</li><li>env.production 生产态环境变量</li><li>.eslintrc.js eslint配置</li><li>.prettierrc.json prettier配置</li><li>env.d.ts 全局ts类型声明文件</li><li>package.json npm依赖</li><li>tsconfig.json ts配置</li><li>tsconfig.node.json 与打包相关的ts配置，和web开发无关(dev dependencies)</li><li>tsconfig.app.json web开发相关的ts配置(dependencies)</li><li>view.config.js vite配置</li></ul></li><li>uni-ai-server Java服务端 <ul><li>buildSrc 通用的依赖和配置，如lombok，springboot依赖</li><li>common 通用的类</li><li>generator-core 代码生成器的注解部分</li><li>generator-processor 代码生成器的实现部分</li><li>gradle 依赖版本号管理</li><li>scripts 数据库sql脚本</li><li>server 后端启动模块 <ul><li>src/main <ul><li>dto jimmer的dto文件，可以参考jimmer官方文档</li><li>java/io.qifan.server <ul><li>ServerApplication 启动类</li><li>infrastructure 基础设施配置</li><li>ai ai模块 <ul><li>message 聊天消息</li><li>session 聊天会话</li><li>model AI模型</li><li>role AI角色</li><li>tag AI模型标签</li><li>uni 各厂家模型统一接口</li></ul></li><li>dict 字典管理</li><li>menu 菜单管理</li><li>role 角色管理</li><li>user 用户管理</li><li>setting token价格配置</li><li>wallet 钱包计费</li></ul></li></ul></li></ul></li><li>spring-ai-dashscope-spring-boot-stater 阿里灵积AI</li><li>spring-ai-qianfan-spring-boot-stater 百度千帆AI</li><li>spring-ai-spark-spring-boot-stater 讯飞星火AI</li><li>spring-ai-kimi-spring-boot-stater kimi AI</li><li>spring-boot-starter-oss 阿里云oss，腾讯云oss，nginx静态文件服务</li><li>spring-boot-starter-sms 短信发送服务，阿里云短信，控制台短信测试</li><li>spring-boot-starter-security SaToken配置</li></ul></li></ul><h2 id="技术栈" tabindex="-1"><a class="header-anchor" href="#技术栈"><span>技术栈</span></a></h2><h3 id="管理端" tabindex="-1"><a class="header-anchor" href="#管理端"><span>管理端</span></a></h3>',14),g=t("thead",null,[t("tr",null,[t("th",null,"技术"),t("th",null,"说明"),t("th",null,"官网")])],-1),f=t("td",null,"Vite",-1),m=t("td",null,"开箱即用的现代前端打包工具",-1),b={href:"https://cn.vitejs.dev/",target:"_blank",rel:"noopener noreferrer"},x=t("td",null,"Vue3",-1),v=t("td",null,"Vue 基于标准 HTML 拓展了一套模板语法。Vue 会自动跟踪 JavaScript 状态并在其发生变化时响应式地更新 DOM",-1),k={href:"https://cn.vuejs.org/",target:"_blank",rel:"noopener noreferrer"},w=t("td",null,"Vue Router",-1),y=t("td",null,"Vue官方路由管理框架",-1),S={href:"https://router.vuejs.org/",target:"_blank",rel:"noopener noreferrer"},j=t("td",null,"ElementUI Plus",-1),A=t("td",null,"支持TypeScript提示的Vue3前端UI框架",-1),I={href:"https://element-plus.gitee.io/zh-CN/",target:"_blank",rel:"noopener noreferrer"},V=t("td",null,"Pinia",-1),q=t("td",null,"全局状态管理框架，支持TypeScript类型提示",-1),J={href:"https://pinia.web3doc.top/",target:"_blank",rel:"noopener noreferrer"},L=t("td",null,"TypeScript",-1),E=t("td",null,"让 JS 具备类型声明",-1),M={href:"https://www.typescriptlang.org/",target:"_blank",rel:"noopener noreferrer"},N=t("td",null,"ESLint",-1),O=t("td",null,"语法校验和格式整理",-1),T={href:"https://eslint.org/",target:"_blank",rel:"noopener noreferrer"},z=t("td",null,"DayJS",-1),B=t("td",null,"日期取值/赋值/运算等操作",-1),P={href:"https://dayjs.fenxianglu.cn/",target:"_blank",rel:"noopener noreferrer"},D=t("td",null,"LodashJs",-1),C=t("td",null,"JS各种常用的工具方法",-1),G={href:"https://www.lodashjs.com/",target:"_blank",rel:"noopener noreferrer"},Q=t("tr",null,[t("td",null,"SSE.js"),t("td",null,"SSE流式请求"),t("td")],-1),R=t("tr",null,[t("td",null,"md-editor-v3"),t("td",null,"markdown语法解析"),t("td")],-1),U=t("h3",{id:"服务端",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#服务端"},[t("span",null,"服务端")])],-1),F=t("p",null,[e("以我做过三十多个项目和实际工作的经验来说，实际上大部分的需求都是增删改查，我前三年的所有项目的ORM框架都是选用"),t("code",null,"MyBatis（Plus）"),t("br"),e(" 。每次写动态查询、多表查询、字段映射、字段修改（增加/删除/修改）都需要耗费很多精力去修改Mapper。特别是当需求比较多时，大量的时间被这种无聊地增删改查SQL占用，写代码就变得很无趣。")],-1),H=t("p",null,[e("最近我发现了一个国产的ORM框架"),t("code",null,"Jimmer"),e("，它和不仅有Mybatis的灵活也有JPA的简便，非常适合自己开发项目。")],-1),K=t("thead",null,[t("tr",null,[t("th",null,"技术"),t("th",null,"说明"),t("th",null,"官网")])],-1),W=t("td",null,"SpringBoot3",-1),Z=t("td",null,"Web应用开发框架，需要JDK17及以上版本",-1),X={href:"https://spring.io/projects/spring-boot",target:"_blank",rel:"noopener noreferrer"},Y=t("td",null,"SpringAi",-1),$=t("td",null,"统一AI的聊天模型，embedding模型，向量数据库的入参模型等等",-1),tt={href:"https://docs.spring.io/spring-ai/reference/api/index.html",target:"_blank",rel:"noopener noreferrer"},et=t("td",null,"SaToken",-1),lt=t("td",null,"一个轻量级 Java 权限认证框架，主要解决：登录认证、权限认证、单点登录、OAuth2.0、分布式Session会话、微服务网关鉴权 等一系列权限相关问题",-1),nt={href:"https://sa-token.cc/",target:"_blank",rel:"noopener noreferrer"},it=t("td",null,"Jimmer",-1),st=t("td",null,"不仅有Mybatis的灵活性也有Hibernate的复用性",-1),ot={href:"https://babyfish-ct.gitee.io/jimmer-doc/",target:"_blank",rel:"noopener noreferrer"},rt=t("tr",null,[t("td",null,"QiFanGenerator"),t("td",null,"自己写的代码生成器，快速生成前后端增删改查。"),t("td",null,[e("无官网，在代码里面参考"),t("code",null,"@GenEentity"),e("和"),t("code",null,"@GenField"),e("就两个注解就行了")])],-1),dt=t("td",null,"阿里云OSS",-1),at=t("td",null,"存储图片，学习用途基本上免费。",-1),ht={href:"https://help.aliyun.com/zh/oss/",target:"_blank",rel:"noopener noreferrer"},ut=t("td",null,"微信小程序服务端API",-1),ct=t("td",null,"用户登录，订阅消息等接口",-1),pt={href:"https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/",target:"_blank",rel:"noopener noreferrer"},_t=t("td",null,"微信支付V3",-1),gt=t("td",null,"用户支付订单",-1),ft={href:"https://pay.weixin.qq.com/wiki/doc/apiv3/wxpay/pages/index.shtml",target:"_blank",rel:"noopener noreferrer"},mt=t("tr",null,[t("td",null,"gradle"),t("td",null,"本项目有许多模块，gradle起来比较方便"),t("td")],-1),bt=t("h3",{id:"小程序端",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#小程序端"},[t("span",null,"小程序端")])],-1),xt=t("p",null,"小程序端规划中",-1),vt=t("h2",{id:"联系方式",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#联系方式"},[t("span",null,"联系方式")])],-1),kt=t("p",null,[e("商务合作：ljc66max(微信)"),t("br"),e(" 交流群：416765656")],-1);function wt(yt,St){const l=s("ExternalLinkIcon");return o(),r("div",null,[_,t("table",null,[g,t("tbody",null,[t("tr",null,[f,m,t("td",null,[t("a",b,[e("https://cn.vitejs.dev/"),n(l)])])]),t("tr",null,[x,v,t("td",null,[t("a",k,[e("https://cn.vuejs.org/"),n(l)])])]),t("tr",null,[w,y,t("td",null,[t("a",S,[e("https://router.vuejs.org/"),n(l)])])]),t("tr",null,[j,A,t("td",null,[t("a",I,[e("https://element-plus.gitee.io/zh-CN/"),n(l)])])]),t("tr",null,[V,q,t("td",null,[t("a",J,[e("https://pinia.web3doc.top/"),n(l)])])]),t("tr",null,[L,E,t("td",null,[t("a",M,[e("https://www.typescriptlang.org/"),n(l)])])]),t("tr",null,[N,O,t("td",null,[t("a",T,[e("https://eslint.org/"),n(l)])])]),t("tr",null,[z,B,t("td",null,[t("a",P,[e("https://dayjs.fenxianglu.cn/"),n(l)])])]),t("tr",null,[D,C,t("td",null,[t("a",G,[e("https://www.lodashjs.com/"),n(l)])])]),Q,R])]),U,F,H,t("table",null,[K,t("tbody",null,[t("tr",null,[W,Z,t("td",null,[t("a",X,[e("SpringBoot"),n(l)])])]),t("tr",null,[Y,$,t("td",null,[t("a",tt,[e("SpringAI"),n(l)])])]),t("tr",null,[et,lt,t("td",null,[t("a",nt,[e("SaToken"),n(l)])])]),t("tr",null,[it,st,t("td",null,[t("a",ot,[e("Jimmer"),n(l)])])]),rt,t("tr",null,[dt,at,t("td",null,[t("a",ht,[e("对象存储 OSS-阿里云帮助中心 (aliyun.com)"),n(l)])])]),t("tr",null,[ut,ct,t("td",null,[t("a",pt,[e("微信开放文档 (qq.com)"),n(l)])])]),t("tr",null,[_t,gt,t("td",null,[t("a",ft,[e("微信支付开发者文档 (qq.com)"),n(l)])])]),mt])]),bt,xt,vt,kt])}const It=i(p,[["render",wt],["__file","index.html.vue"]]);export{It as default};
