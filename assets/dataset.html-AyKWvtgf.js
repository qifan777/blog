import{_ as e}from"./plugin-vue_export-helper-x3n3nnut.js";import{r as p,o as c,c as t,d as n,e as s,b as o,a as l}from"./app-faHn3LcX.js";const i={},r=n("h1",{id:"数据集",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#数据集"},[n("span",null,"数据集")])],-1),d={href:"https://github.com/neo4j-examples/sec-edgar-notebooks/tree/main/data/sample",target:"_blank",rel:"noopener noreferrer"},m=n("code",null,"langchain",-1),u=n("code",null,"neo4j",-1),v=n("code",null,"SpringDataNeo4j",-1),k=n("code",null,"SpringAI",-1),b=l(`<p>下面认识一下本次构建知识图谱使用的数据集</p><h2 id="form-10k" tabindex="-1"><a class="header-anchor" href="#form-10k"><span>Form 10K</span></a></h2><p>Form 10-K是美国证券交易委员会（SEC）要求上市公司必须每年提交的有关其财务表现与公司运营的综合性报告，具体来说包括公司历史，组织架构，财务状况，每股收益，分支机构，高管薪酬等信息。</p><p>下面是Form10K每个字段的解释</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code>
<span class="token annotation punctuation">@Data</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Form10K</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     * 业务
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> item1<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * 危险因素
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> item1a<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * 管理层对财务状况及经营成果的探讨与分析。
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> item7<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * 市场风险的定量和定性披露
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> item7a<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * 中央索引键(CIK)用于证券交易委员会的计算机系统，用于识别已向证券交易委员会提交披露文件的公司和个人。
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> cik<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 。CUSIP的创立是为了给北美的每一个证券一个唯一的代码，这样在清算的时候就不会因为名字相似而出错。
     * 注意它是为了给每一个证券一个唯一的代码，这个证券包括股票，期权，期货，政府债券，企业债券等所有的证券
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> cusip<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * CUSIP的前六位是企业的代码
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> cusip6<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * 公司的名称（包含别名，所以有多个）列表
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> names<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * 该Form 10-K报告的原文
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> source<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个数据集可以构建<code>Company</code>、<code>Form</code>、<code>Chunk</code>三个节点。</p><p>也可以构建<code>FILED</code>、<code>SECTION</code>、<code>PART_OF</code>、<code>NEXT</code>这四种联。</p><div class="language-cypher line-numbers-mode" data-ext="cypher" data-title="cypher"><pre class="language-cypher"><code><span class="token punctuation">(</span><span class="token operator">:</span><span class="token class-name">Company</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token punctuation">[</span><span class="token operator">:</span><span class="token relationship property">FILED</span><span class="token punctuation">]</span><span class="token operator">-&gt;</span><span class="token punctuation">(</span><span class="token operator">:</span><span class="token class-name">Form</span><span class="token punctuation">)</span> <span class="token comment">// 公司发布了Form10K报告</span>
<span class="token punctuation">(</span><span class="token operator">:</span><span class="token class-name">Form</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token punctuation">[</span><span class="token operator">:</span><span class="token relationship property">SECTION</span><span class="token punctuation">]</span><span class="token operator">-&gt;</span><span class="token punctuation">(</span><span class="token operator">:</span><span class="token class-name">Chunk</span><span class="token punctuation">)</span> <span class="token comment">// Form10K报告包含了多个段落</span>
<span class="token punctuation">(</span><span class="token operator">:</span><span class="token class-name">Chunk</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token punctuation">[</span><span class="token operator">:</span><span class="token relationship property">PART_OF</span><span class="token punctuation">]</span><span class="token operator">-&gt;</span><span class="token punctuation">(</span><span class="token operator">:</span><span class="token class-name">Form</span><span class="token punctuation">)</span> <span class="token comment">// Chunk属于Form10K</span>
<span class="token punctuation">(</span><span class="token operator">:</span><span class="token class-name">Chunk</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token punctuation">[</span><span class="token operator">:</span><span class="token relationship property">NEXT</span><span class="token punctuation">]</span><span class="token operator">-&gt;</span><span class="token punctuation">(</span>Chunk<span class="token punctuation">)</span>    <span class="token comment">// 比如item1被切割成4个段，这4个通过next依次连接。</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="form13" tabindex="-1"><a class="header-anchor" href="#form13"><span>Form13</span></a></h2><p>Form13包含投资方公司投资的其他公司、所持股份数量和投资价值的信息。</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code>
<span class="token annotation punctuation">@Data</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Form13</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     * From13表格的原文链接
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> source<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * 投资方公司的CIK，参考Form10K中的CIK解释
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> managerCik<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * 投资方公司的名称
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> managerName<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * 投资方公司的地址
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> managerAddress<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * Form13报告发布的日期
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> reportCalendarOrQuarter<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * 参考Form10K中的CUSIP6解释
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> cusip6<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * 参考Form10K中的CUSIP解释
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> cusip<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * 被投资公司的名称
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> companyName<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * 投资的金额
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Double</span> value<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * 投资份额
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Double</span> shares<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Form13可以构建<code>Manager</code>节点和<code>OWNS_STOCK_IN</code>关联。</p><div class="language-cypher line-numbers-mode" data-ext="cypher" data-title="cypher"><pre class="language-cypher"><code><span class="token punctuation">(</span><span class="token operator">:</span><span class="token class-name">Manager</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token punctuation">[</span><span class="token operator">:</span><span class="token relationship property">OWNS_STOCK_IN</span><span class="token punctuation">]</span><span class="token operator">-&gt;</span><span class="token punctuation">(</span><span class="token operator">:</span><span class="token class-name">Company</span><span class="token punctuation">)</span> <span class="token comment">// 投资公司投资了其他公司</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,13);function g(h,y){const a=p("ExternalLinkIcon");return c(),t("div",null,[r,n("p",null,[s("本项目使用的数据集是"),n("a",d,[s("美国证券交易委员会数据集"),o(a)]),s("，将该项目的python技术栈"),m,s("+"),u,s("转成java的"),v,s("+"),k,s("。")]),b])}const F=e(i,[["render",g],["__file","dataset.html.vue"]]);export{F as default};
