import{_ as n}from"./plugin-vue_export-helper-x3n3nnut.js";import{o as s,c as a,a as e}from"./app-0qpHL51_.js";const i={},t=e(`<h1 id="eslint" tabindex="-1"><a class="header-anchor" href="#eslint"><span>ESLint</span></a></h1><p>ESLint可以做两件事</p><ol><li>语法校验。扫描你代码中的一些不规范写法提出意见。<br> 比如for循环渲染数据时忘记加key。vue的eslint插件就会对这种影响性能的写法提出意见。</li><li>代码整理。每个eslint插件都可以增加自己的代码整理规则。</li></ol><h2 id="概念" tabindex="-1"><a class="header-anchor" href="#概念"><span>概念</span></a></h2><ul><li>ESLint 插件：定义一系列的校验规则，常以 eslint-plugin-* 命名，在 ESLint 配置文件中通过 plugins 选项引入。<br> 需要注意的是，插件仅定义规则，并不启用规则。规则是由 ESLint 配置的 rules 选项启用的。</li><li>可共享配置（ Shareable Configs ）：每个 ESLint 配置文件都可以复用其他配置，这些配置称为可共享配置。可共享配置一共有两种形式： <ul><li>ESLint Config：纯粹的配置，包含各个 ESLint 配置选项，常用 eslint-config-* 命名发布</li><li>ESLint 插件带配置（ Plugins with configs ） ：在原先的 ESLint 插件上导出 configs 对象，configs 等价于<br> ESLint Config。拓展此类插件的可共享配置时需要在前面增加 plugin: 前缀，比如 plugin:<br> prettier/recommended</li></ul></li></ul><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装"><span>安装</span></a></h2><p><strong>@vue/eslint-config-standard</strong></p><p>这是Vue官方提供的共享配置。里面包含了eslint标准配置和eslint-plugin-vue插件。</p><ul><li><p>eslint标准配置。eslint标准配置依赖了eslint官方插件。</p></li><li><p>eslint-plugin-vue插件。eslint-plugin-vue包含了vue语法的校验规则和少量的vue代码整理。<br> eslint-plugin-vue中又包含了好几个共享配置。</p></li></ul><p><strong>@vue/eslint-config-prettier</strong></p><p>前面介绍了eslint提供了html/css/js的校验和整理规则，但是eslint自带的整理规则不太好看。<br> 所以我这边使用了prettier的规则。</p><p><strong>@rushstack/eslint-patch</strong></p><p>eslint为什么配置起来很麻烦？主要原因是当我们在安装eslint-config时还需要手动去安装这些config对应的plugin。<br> eslint没办法逐层的加载依赖。</p><p>eslint-patch就是为了解决这一问题。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">npm</span> i @rushstack/eslint-patch <span class="token parameter variable">-D</span>
<span class="token function">npm</span> i @vue/eslint-config-prettier <span class="token parameter variable">-D</span>
<span class="token function">npm</span> i @vue/eslint-config-standard <span class="token parameter variable">-D</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h2><p>由于ESLint是运行在Node.js上，所以它的模块结构是CommonJS。而我们的前端项目<br> .js文件默认是ESM模块（.mjs），为了让ESLint可以正确导入模块这边使用.cjs声明该js文件的模块是 CommonJS<br> 格式。</p><p><code>.eslintrc.cjs</code></p><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token comment">// 使用CommonJS是使用 require 导入，ESM是使用 import 导入</span>
<span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;@rushstack/eslint-patch/modern-module-resolution&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">root</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token keyword">extends</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token comment">// Vue语法的ESLint插件</span>
    <span class="token string">&quot;plugin:vue/vue3-recommended&quot;</span><span class="token punctuation">,</span>
    <span class="token comment">// 继承Vue官方提供的ESLint标准配置</span>
    <span class="token string">&quot;@vue/eslint-config-standard&quot;</span><span class="token punctuation">,</span>
    <span class="token comment">// 继承Vue官方提供的ESLintPrettier标准配置</span>
    <span class="token string">&quot;@vue/eslint-config-prettier&quot;</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>.gitignore</code></p><div class="language-ignorelang line-numbers-mode" data-ext="ignorelang" data-title="ignorelang"><pre class="language-ignorelang"><code>### IntelliJ IDEA ###
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

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>新增了两个script，format和lint分别用于整理代码和修复eslint报错。lint的同时也会整理所有代码。如果你仅仅只想整理代码可以使用format。</p><p><code>package.json</code></p><div class="language-json line-numbers-mode" data-ext="json" data-title="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;scripts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;dev&quot;</span><span class="token operator">:</span> <span class="token string">&quot;vite&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;build&quot;</span><span class="token operator">:</span> <span class="token string">&quot;vite build&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;preview&quot;</span><span class="token operator">:</span> <span class="token string">&quot;vite preview&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;format&quot;</span><span class="token operator">:</span> <span class="token string">&quot;prettier --write .&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;lint&quot;</span><span class="token operator">:</span> <span class="token string">&quot;eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;dependencies&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;vite&quot;</span><span class="token operator">:</span> <span class="token string">&quot;^4.4.9&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;vue&quot;</span><span class="token operator">:</span> <span class="token string">&quot;^3.3.4&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;devDependencies&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;vite&quot;</span><span class="token operator">:</span> <span class="token string">&quot;^4.4.9&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;@vitejs/plugin-vue&quot;</span><span class="token operator">:</span> <span class="token string">&quot;^4.3.4&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;@rushstack/eslint-patch&quot;</span><span class="token operator">:</span> <span class="token string">&quot;^1.3.3&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;@vue/eslint-config-prettier&quot;</span><span class="token operator">:</span> <span class="token string">&quot;^8.0.0&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;@vue/eslint-config-standard&quot;</span><span class="token operator">:</span> <span class="token string">&quot;^8.0.1&quot;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="" tabindex="-1"><a class="header-anchor" href="#"><span></span></a></h3>`,25),l=[t];function o(p,r){return s(),a("div",null,l)}const d=n(i,[["render",o],["__file","index.html.vue"]]);export{d as default};
