import{_ as o}from"./plugin-vue_export-helper-x3n3nnut.js";import{r as p,o as c,c as d,b as s,w as t,d as n,e as a,a as i}from"./app-wX6QS5KY.js";const r="/blog/assets/img-zZLhi2HZ.png",u="/blog/assets/img_1-KrrXxZgx.png",v="/blog/assets/img_2-bxxqLRPD.png",k="/blog/assets/img_3-s17P6jkm.png",m="/blog/assets/img_4-ONbJHf0N.png",b="/blog/assets/img_5-4elG7Crm.png",g={},h=n("h1",{id:"vuepress2搭建自己的博客-官方网站",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#vuepress2搭建自己的博客-官方网站"},[n("span",null,"VuePress2搭建自己的博客/官方网站")])],-1),x=n("figure",null,[n("img",{src:r,alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),_=i(`<p>VuePress 是一个以 Markdown 为中心的静态网站生成器。你可以使用 Markdown 来书写内容（如文档、博客等），然后 VuePress<br> 会帮助你生成一个静态网站来展示它们。</p><blockquote><p>ps: 以上介绍摘自官网</p></blockquote><p>平常我写博客只需要用markdown写好，然后运行打包命令，就可以将markdown转成html。接着将打包好的文件到nginx服务器上就可以供用户访问了。</p><h2 id="快速上手" tabindex="-1"><a class="header-anchor" href="#快速上手"><span>快速上手</span></a></h2><h3 id="依赖环境" tabindex="-1"><a class="header-anchor" href="#依赖环境"><span>依赖环境</span></a></h3><ul><li>Node.js v16.19.0+</li></ul><h3 id="手动安装" tabindex="-1"><a class="header-anchor" href="#手动安装"><span>手动安装</span></a></h3><ul><li><strong>步骤 1</strong>: 创建并进入一个新目录</li></ul><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> vuepress-starter
<span class="token builtin class-name">cd</span> vuepress-starter
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>步骤 2</strong>: 初始化项目</li></ul><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">git</span> init
<span class="token function">pnpm</span> init
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>步骤 3</strong>: 将 VuePress 安装为本地依赖</li></ul><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">pnpm</span> <span class="token function">add</span> <span class="token parameter variable">-D</span> vuepress@next @vuepress/client@next vue
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>步骤 4: 在 package.json 中添加一些 scripts</li></ul><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;scripts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;docs:dev&quot;</span><span class="token operator">:</span> <span class="token string">&quot;vuepress dev docs&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;docs:build&quot;</span><span class="token operator">:</span> <span class="token string">&quot;vuepress build docs&quot;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>步骤 5: 在 .gitignore 文件中添加下面内容</li></ul><div class="language-ignorelang line-numbers-mode" data-ext="ignorelang" data-title="ignorelang"><pre class="language-ignorelang"><code>.DS_Store
node_modules
/dist
.temp
.cache

docs/.vuepress/dist
# local env files
.env.local
.env.*.local

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor directories and files
.idea/
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>步骤 6</strong>: 创建你的第一篇文档</li></ul><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> docs
<span class="token builtin class-name">echo</span> <span class="token string">&#39;# Hello VuePress&#39;</span> <span class="token operator">&gt;</span> docs/README.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>步骤 7</strong>: 在本地启动服务器来开发你的文档网站</li></ul><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">pnpm</span> docs:dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="页面" tabindex="-1"><a class="header-anchor" href="#页面"><span>页面</span></a></h2><h3 id="页面路由" tabindex="-1"><a class="header-anchor" href="#页面路由"><span>页面路由</span></a></h3><p>vuepress会读取docs目录下所有的markdown文件转成html。然后通过浏览器的输入对应的路径就可以访问了。<br> 比如下面几个例子，左侧是文件在目录中的位置和文件名，右侧是在浏览器中的路由地址。</p><table><thead><tr><th>相对路径</th><th>路由路径</th></tr></thead><tbody><tr><td>/docs/README.md</td><td>/</td></tr><tr><td>/docs/index.md</td><td>/</td></tr><tr><td>/contributing.md</td><td>/</td></tr><tr><td>/guide/README.md</td><td>/guide/</td></tr><tr><td>/guide/getting-started.md</td><td>/guide/getting-started.html</td></tr></tbody></table><h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h2><p>vue-press的目录结构是这样的，config.js就是配置文件了。我们可以在这个文件里面定义vue-press的基本配置和主题配置。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>├─ docs
│  ├─ .vuepress
│  │  └─ config.js
│  └─ README.md
├─ .gitignore
└─ package.json
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不同的主题提供了不同的页面配置。同一主题对于首页和普通页面也有不同的配置选项。<br> 下面以默认主题为例子来讲述如何配置首页和普通页面。</p><p>后面我会以我的这个博客项目为例子讲解配置</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/qifan777/qifan-blog-vuepress2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="首页配置" tabindex="-1"><a class="header-anchor" href="#首页配置"><span>首页配置</span></a></h3><p>先介绍一下首页中的哪些元素是可以配置的。在图2中我已经一一标注在上面了。<br><img src="`+u+'" alt="" loading="lazy"></p>',33),f={href:"http://xn--docsREADME-9i2ph8f806b7iy1ik8ro.md",target:"_blank",rel:"noopener noreferrer"},y=i(`<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>---
home: true
heroImage: /images/logo.jpg
heroText: 起凡code闲聊
tagline: 全栈项目分享，实战干货。
actions:
  - text: 飞鸽邮筒
    link: /project/post-letter/
    type: primary
  - text: ChatGPT二次开发实战
    link: /project/chatgpt-assistant/
    type: secondary
features:
  - title: 项目
    details: SpringBoot3/Vue3/Mybatis/Jpa/MongoDB/Mysql/微信支付/小程序。各种主流技术开发的全栈项目
  - title: 工具
    details: 平常学习工作中能提高效率的工具，Jenkins/Docker/内网穿透等
  - title: 知识
    details: 开发中累计的实用知识技巧，Spring/HTTP调试/JPA等。
footer: 联系方式：ljc666max
---
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中的<code>home: true</code>代表当前页面设为首页。<code>heroImage: /images/logo.jpg</code><br> 设置图2中的HeroImage，需要注意的是该图片的存放位置位于<code>/docs/.vuepress/public/images/logo.jpg</code><br> 。该位置后的图片在打包后都会在根目录下，所以<code>/images/logo.jpg</code>可以生效。</p><h3 id="普通页面配置" tabindex="-1"><a class="header-anchor" href="#普通页面配置"><span>普通页面配置</span></a></h3><h4 id="生成当前页面侧边栏" tabindex="-1"><a class="header-anchor" href="#生成当前页面侧边栏"><span>生成当前页面侧边栏</span></a></h4><p>在普通页面的中输入<code>sidebar: auto</code>就会自动根据标题大小生成侧边目录。<code>sidebarDepth: 2</code>，用来控制侧边目录的深度，默认是2。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>---
sidebar: auto
sidebarDepth: 2
---
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="多个页面公用侧边栏" tabindex="-1"><a class="header-anchor" href="#多个页面公用侧边栏"><span>多个页面公用侧边栏</span></a></h4><p>有些博客的内容较多，需要分成很多期来讲，这种情况就可以在全局配置里面对同一路由开头下的页面公用侧边栏。</p>`,8),j=n("img",{src:v,width:"600"},null,-1),w=n("p",null,"图3 多个章节目录",-1),E=i(`<p>在<code>/docs/.vuepress/config.ts</code>中配置sidebar，我们这边配置了<code>/project/chatgpt-assistant/</code><br> 开头的路由都应用相同的侧边栏，其中有四项分别对于图3中的项目介绍，第八期，第九期，第十期。</p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineUserConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    theme<span class="token operator">:</span> <span class="token function">defaultTheme</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        sidebar<span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token string-property property">&#39;/project/chatgpt-assistant/&#39;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
                <span class="token punctuation">{</span>text<span class="token operator">:</span> <span class="token string">&#39;项目介绍&#39;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&#39;/project/chatgpt-assistant/&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token punctuation">{</span>text<span class="token operator">:</span> <span class="token string">&#39;第八期 websocket+stream请求+proxy&#39;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&#39;/project/chatgpt-assistant/chapter8/&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token punctuation">{</span>text<span class="token operator">:</span> <span class="token string">&#39;第九期 Vue3/ElementUI Plus实现聊天面板&#39;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&#39;/project/chatgpt-assistant/chapter9/&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token punctuation">{</span>text<span class="token operator">:</span> <span class="token string">&#39;第十期 消息发送和markdown显示消息记录&#39;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&#39;/project/chatgpt-assistant/chapter10/&#39;</span><span class="token punctuation">}</span>
            <span class="token punctuation">]</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果你想把第八期和第九期何在一个目录下面，你可以这样。</p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token string-property property">&#39;/project/chatgpt-assistant/&#39;</span>
<span class="token operator">:</span>
<span class="token punctuation">[</span>
    <span class="token punctuation">{</span>text<span class="token operator">:</span> <span class="token string">&#39;项目介绍&#39;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&#39;/project/chatgpt-assistant/&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
        text<span class="token operator">:</span> <span class="token string">&#39;第八期第九期&#39;</span><span class="token punctuation">,</span>
        children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;/project/chatgpt-assistant/chapter8/&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;/project/chatgpt-assistant/chapter9/&#39;</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>text<span class="token operator">:</span> <span class="token string">&#39;第十期 消息发送和markdown显示消息记录&#39;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&#39;/project/chatgpt-assistant/chapter10/&#39;</span><span class="token punctuation">}</span>
<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>效果如下</p>`,5),q=n("img",{src:k,width:"600"},null,-1),P=n("p",null,"图4 合并目录",-1),D=n("h3",{id:"配置导航栏",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#配置导航栏"},[n("span",null,"配置导航栏")])],-1),V=n("h4",{id:"下拉菜单",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#下拉菜单"},[n("span",null,"下拉菜单")])],-1),M=n("img",{src:m,width:"600"},null,-1),T=n("p",null,"图5 下拉菜单",-1),C=i(`<p>在导航栏中可以配置菜单，点击菜单就可以跳转到自己写的博客。下面演示配置下拉菜单。</p><p>下面这个配置会在导航栏中多一个下拉菜单<code>工具分享</code>，该下路菜单里面又包含三个子菜单如图5所示。</p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineUserConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>

    theme<span class="token operator">:</span> <span class="token function">defaultTheme</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        navbar<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token punctuation">{</span>
                text<span class="token operator">:</span> <span class="token string">&#39;工具分享&#39;</span><span class="token punctuation">,</span>
                children<span class="token operator">:</span> <span class="token punctuation">[</span>
                    <span class="token punctuation">{</span>text<span class="token operator">:</span> <span class="token string">&#39;私有ChatGPT搭建&#39;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&#39;/tools/chatgpt/&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
                    <span class="token punctuation">{</span>text<span class="token operator">:</span> <span class="token string">&#39;远程开发环境搭建&#39;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&#39;/tools/remote-develop/&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
                    <span class="token punctuation">{</span>text<span class="token operator">:</span> <span class="token string">&#39;vue-press2搭建博客&#39;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&#39;/tools/vue-press2/&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>

                <span class="token punctuation">]</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="下拉菜单分组" tabindex="-1"><a class="header-anchor" href="#下拉菜单分组"><span>下拉菜单分组</span></a></h4>`,4),A=n("img",{src:b,width:"600"},null,-1),N=n("p",null,"图6 下拉菜单分组",-1),R=i(`<p>下面的配置多了一个下拉菜单<code>知识分享</code>。知识分享中包含两个分组<code>spring boot技巧</code>和<code>jpa</code><br> 。通过观察你可以发现没有link属性的菜单项配置就是下拉菜单或者分组了。像<code>知识分享</code>和<code>工具分享</code><br> 这两个都没有link，又由于它们是位于第一层所以就被识别为下拉菜单。<code>spring boot技巧</code>和<code>jpa</code>两个菜单配置是属于子菜单且没有link属性，那它们就是分组菜单了。</p><div class="language-typescript line-numbers-mode" data-ext="ts" data-title="ts"><pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineUserConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>

    theme<span class="token operator">:</span> <span class="token function">defaultTheme</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        navbar<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token punctuation">{</span>
                text<span class="token operator">:</span> <span class="token string">&#39;工具分享&#39;</span><span class="token punctuation">,</span>
                children<span class="token operator">:</span> <span class="token punctuation">[</span>
                    <span class="token punctuation">{</span>text<span class="token operator">:</span> <span class="token string">&#39;私有ChatGPT搭建&#39;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&#39;/tools/chatgpt/&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
                    <span class="token punctuation">{</span>text<span class="token operator">:</span> <span class="token string">&#39;远程开发环境搭建&#39;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&#39;/tools/remote-develop/&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
                    <span class="token punctuation">{</span>text<span class="token operator">:</span> <span class="token string">&#39;vue-press2搭建博客&#39;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&#39;/tools/vue-press2/&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token punctuation">]</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span>
            <span class="token punctuation">{</span>
                text<span class="token operator">:</span> <span class="token string">&#39;知识分享&#39;</span><span class="token punctuation">,</span>
                children<span class="token operator">:</span> <span class="token punctuation">[</span>
                    <span class="token punctuation">{</span>
                        text<span class="token operator">:</span> <span class="token string">&#39;spring boot技巧&#39;</span><span class="token punctuation">,</span>
                        children<span class="token operator">:</span> <span class="token punctuation">[</span>
                            <span class="token punctuation">{</span>text<span class="token operator">:</span> <span class="token string">&#39;aop&#39;</span><span class="token punctuation">,</span> link<span class="token operator">:</span> <span class="token string">&#39;/knowledge/spring/aop/&#39;</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
                                text<span class="token operator">:</span> <span class="token string">&#39;如何发送http请求各种参数&#39;</span><span class="token punctuation">,</span>
                                link<span class="token operator">:</span> <span class="token string">&#39;/knowledge/spring/http/&#39;</span>
                            <span class="token punctuation">}</span>
                        <span class="token punctuation">]</span>
                    <span class="token punctuation">}</span><span class="token punctuation">,</span>
                    <span class="token punctuation">{</span>
                        text<span class="token operator">:</span> <span class="token string">&#39;jpa&#39;</span><span class="token punctuation">,</span>
                        children<span class="token operator">:</span> <span class="token punctuation">[</span>
                            <span class="token punctuation">{</span>
                                text<span class="token operator">:</span> <span class="token string">&#39;hibernate&#39;</span><span class="token punctuation">,</span>
                                link<span class="token operator">:</span> <span class="token string">&#39;/knowledge/jpa/hibernate/&#39;</span>
                            <span class="token punctuation">}</span>
                        <span class="token punctuation">]</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">]</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function I(B,H){const e=p("center"),l=p("ExternalLinkIcon");return c(),d("div",null,[h,x,s(e,null,{default:t(()=>[a("图1 VuePress效果图")]),_:1}),_,s(e,null,{default:t(()=>[a("图2 首页配置介绍")]),_:1}),n("p",null,[a("在了解了基本的配置元素后，"),n("a",f,[a("我们在docs下新建README.md"),s(l)]),a("。这个页面就当作我们的首页了，我们在这个页面下输入以下配置。")]),y,s(e,null,{default:t(()=>[j,w]),_:1}),E,s(e,null,{default:t(()=>[q,P]),_:1}),a(" 可以看见第八期和第九期被合并了。 "),D,V,s(e,null,{default:t(()=>[M,T]),_:1}),C,s(e,null,{default:t(()=>[A,N]),_:1}),a(" 要实现下拉菜单中分组，需要再嵌套一层菜单配置。 "),R])}const G=o(g,[["render",I],["__file","index.html.vue"]]);export{G as default};
