import{_ as a}from"./plugin-vue_export-helper-x3n3nnut.js";import{o as e,c as n,a as s}from"./app--8vYtAEY.js";const i="/blog/assets/111-thceAFyj.png",d={},t=s(`<h2 id="技术栈" tabindex="-1"><a class="header-anchor" href="#技术栈"><span>技术栈</span></a></h2><ul><li><code>vue2</code></li><li><code>uni-app</code></li><li><code>typescript</code></li></ul><h2 id="运行步骤" tabindex="-1"><a class="header-anchor" href="#运行步骤"><span>运行步骤</span></a></h2><h3 id="_1-安装依赖包" tabindex="-1"><a class="header-anchor" href="#_1-安装依赖包"><span>1. 安装依赖包</span></a></h3><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">yarn</span> <span class="token function">install</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>出现提示按 enter 等待下载完成</p><h3 id="_2-修改-appid" tabindex="-1"><a class="header-anchor" href="#_2-修改-appid"><span>2. 修改 appid</span></a></h3><p>在 manifest.json 中修改 mp-wexin-&gt; appId</p><h3 id="_3-运行到微信小程序" tabindex="-1"><a class="header-anchor" href="#_3-运行到微信小程序"><span>3. 运行到微信小程序</span></a></h3><p>运行下面这个命令</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">yarn</span> dev:mp-weixin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后会生成 dist 文件夹，在微信开发者工具打开导入</p><p><code>dist/dev/mp-weixin</code></p><figure><img src="`+i+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>',14),c=[t];function p(l,r){return e(),n("div",null,c)}const u=a(d,[["render",p],["__file","index.html.vue"]]);export{u as default};