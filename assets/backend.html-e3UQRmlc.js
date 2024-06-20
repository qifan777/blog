import{_ as t}from"./plugin-vue_export-helper-x3n3nnut.js";import{r as p,o as e,c as o,d as c,e as n,b as i,w as u,a as s}from"./app-iWtAWHSw.js";const l={},r=s(`<h1 id="后端实现" tabindex="-1"><a class="header-anchor" href="#后端实现"><span>后端实现</span></a></h1><h2 id="消息dto改造" tabindex="-1"><a class="header-anchor" href="#消息dto改造"><span>消息dto改造</span></a></h2><p>将之前的 <code>AiMessageInput</code> 改造成 <code>AiMessageWrapper</code>，新增了一个 <code>params</code> 属性，用来传递一些参数。前端可以选择是否开启知识库。</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token annotation punctuation">@Data</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AiMessageWrapper</span> <span class="token punctuation">{</span>
    <span class="token class-name">AiMessageInput</span> message<span class="token punctuation">;</span>
    <span class="token class-name">AiMessageParams</span> params<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token annotation punctuation">@Data</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AiMessageParams</span> <span class="token punctuation">{</span>
    <span class="token class-name">Boolean</span> enableVectorStore<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="questionansweradvisor" tabindex="-1"><a class="header-anchor" href="#questionansweradvisor"><span>QuestionAnswerAdvisor</span></a></h2>`,5),k=s(`<div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@param</span> <span class="token parameter">input</span> 消息包含文本信息，会话id，多媒体信息（图片语言）。参考src/main/dto/AiMessage.dto
     * <span class="token keyword">@return</span> SSE流
     */</span>
    <span class="token annotation punctuation">@PostMapping</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;chat&quot;</span><span class="token punctuation">,</span> produces <span class="token operator">=</span> <span class="token class-name">MediaType</span><span class="token punctuation">.</span><span class="token constant">TEXT_EVENT_STREAM_VALUE</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token class-name">Flux</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ServerSentEvent</span><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token function">chatStreamWithHistory</span><span class="token punctuation">(</span><span class="token annotation punctuation">@RequestBody</span> <span class="token class-name">AiMessageWrapper</span> input<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">ChatClient</span><span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>dashScopeAiChatModel<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">prompt</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">user</span><span class="token punctuation">(</span>promptUserSpec <span class="token operator">-&gt;</span> <span class="token function">toPrompt</span><span class="token punctuation">(</span>promptUserSpec<span class="token punctuation">,</span> input<span class="token punctuation">.</span><span class="token function">getMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">advisors</span><span class="token punctuation">(</span>advisorSpec <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
                    <span class="token comment">// 使用历史消息</span>
                    <span class="token function">useChatHistory</span><span class="token punctuation">(</span>advisorSpec<span class="token punctuation">,</span> input<span class="token punctuation">.</span><span class="token function">getMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getSessionId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token comment">// 如果启用向量数据库</span>
                    <span class="token keyword">if</span> <span class="token punctuation">(</span>input<span class="token punctuation">.</span><span class="token function">getParams</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getEnableVectorStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        <span class="token comment">// 使用向量数据库w</span>
                        <span class="token function">useVectorStore</span><span class="token punctuation">(</span>advisorSpec<span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">stream</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">chatResponse</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>chatResponse <span class="token operator">-&gt;</span> <span class="token class-name">ServerSentEvent</span><span class="token punctuation">.</span><span class="token function">builder</span><span class="token punctuation">(</span><span class="token function">toJson</span><span class="token punctuation">(</span>chatResponse<span class="token punctuation">)</span><span class="token punctuation">)</span>
                        <span class="token comment">// 和前端监听的事件相对应</span>
                        <span class="token punctuation">.</span><span class="token function">event</span><span class="token punctuation">(</span><span class="token string">&quot;message&quot;</span><span class="token punctuation">)</span>
                        <span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">useVectorStore</span><span class="token punctuation">(</span><span class="token class-name">ChatClient<span class="token punctuation">.</span>AdvisorSpec</span> advisorSpec<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// question_answer_context是一个占位符，会替换成向量数据库中查询到的文档。QuestionAnswerAdvisor会替换。</span>
        <span class="token class-name">String</span> promptWithContext <span class="token operator">=</span> <span class="token triple-quoted-string string">&quot;&quot;&quot;
                下面是上下文信息
                ---------------------
                {question_answer_context}
                ---------------------
                给定的上下文和提供的历史信息，而不是事先的知识，回复用户的意见。如果答案不在上下文中，告诉用户你不能回答这个问题。
                &quot;&quot;&quot;</span><span class="token punctuation">;</span>
        advisorSpec<span class="token punctuation">.</span><span class="token function">advisors</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">QuestionAnswerAdvisor</span><span class="token punctuation">(</span>vectorStore<span class="token punctuation">,</span> <span class="token class-name">SearchRequest</span><span class="token punctuation">.</span><span class="token function">defaults</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> promptWithContext<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1);function d(v,m){const a=p("RouterLink");return e(),o("div",null,[r,c("p",null,[n("之前已经介绍过"),i(a,{to:"/project/spring-ai/rag.html"},{default:u(()=>[n("RAG")]),_:1}),n("，请参考之前的教程。")]),k])}const h=t(l,[["render",d],["__file","backend.html.vue"]]);export{h as default};
