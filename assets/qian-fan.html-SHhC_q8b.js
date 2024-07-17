import{_ as i}from"./plugin-vue_export-helper-x3n3nnut.js";import{r as t,o,c as d,d as a,e as n,b as s,w as l,a as c}from"./app-UCWpdoSl.js";const r={},u=a("h1",{id:"千帆-文言一心-接入",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#千帆-文言一心-接入"},[a("span",null,"千帆（文言一心）接入")])],-1),k=a("h2",{id:"通用配置",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#通用配置"},[a("span",null,"通用配置")])],-1),m=c(`<h2 id="依赖配置" tabindex="-1"><a class="header-anchor" href="#依赖配置"><span>依赖配置</span></a></h2><div class="language-xml line-numbers-mode" data-ext="xml" data-title="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>io.github.qifan777<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-ai-qianfan-spring-boot-starter<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="密钥配置" tabindex="-1"><a class="header-anchor" href="#密钥配置"><span>密钥配置</span></a></h2>`,3),h={href:"https://console.bce.baidu.com/iam/#/iam/accesslist",target:"_blank",rel:"noopener noreferrer"},v=c(`<div class="language-yaml line-numbers-mode" data-ext="yml" data-title="yml"><pre class="language-yaml"><code><span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">ai</span><span class="token punctuation">:</span>
    <span class="token comment"># 百度千帆</span>
    <span class="token key atrule">qian-fan</span><span class="token punctuation">:</span>
      <span class="token key atrule">access-key</span><span class="token punctuation">:</span> xxx
      <span class="token key atrule">secret-key</span><span class="token punctuation">:</span> xxx
      <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
      <span class="token key atrule">chat</span><span class="token punctuation">:</span>
        <span class="token key atrule">model</span><span class="token punctuation">:</span> ERNIE<span class="token punctuation">-</span>4.0<span class="token punctuation">-</span>8K
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用" tabindex="-1"><a class="header-anchor" href="#使用"><span>使用</span></a></h2><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">QianFanAiChatModel</span> qianFanAiChatModel<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="消息发送案例" tabindex="-1"><a class="header-anchor" href="#消息发送案例"><span>消息发送案例</span></a></h2>`,4);function g(b,_){const e=t("RouterLink"),p=t("ExternalLinkIcon");return o(),d("div",null,[u,k,a("p",null,[n("请参考"),s(e,{to:"/project/spring-ai/config/base.html"},{default:l(()=>[n("通用配置")]),_:1})]),m,a("p",null,[a("a",h,[n("千帆 access-key和secret-key申请"),s(p)])]),v,a("p",null,[n("请参考"),s(e,{to:"/project/spring-ai/chat/"},{default:l(()=>[n("消息发送")]),_:1})])])}const y=i(r,[["render",g],["__file","qian-fan.html.vue"]]);export{y as default};