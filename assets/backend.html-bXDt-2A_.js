import{_ as n}from"./plugin-vue_export-helper-x3n3nnut.js";import{o as s,c as a,a as e}from"./app-UxvkHG6A.js";const t={},p=e(`<h1 id="后端实现" tabindex="-1"><a class="header-anchor" href="#后端实现"><span>后端实现</span></a></h1><p>后端实现会话和消息记录必然要先从建表开始，然后编写增删改查，最后实现一些功能。</p><p>会话</p><ul><li>会话保存接口 <ul><li>会话保存dto</li></ul></li><li>会话列表接口 <ul><li>获取当前登录用户id作为查询条件</li><li>一对多关联获取会话内的消息</li></ul></li><li>会话删除接口 <ul><li>根据会话id列表批量删除</li><li>删除会话时，会话内的消息也一并级联删除</li></ul></li><li>会话id查询接口 <ul><li>一对多关联获取会话内的消息</li></ul></li></ul><p>消息</p><ul><li>消息发送接口 <ul><li>消息保存dto（接收前端发送的消息）</li><li>消息实体内容设计，支持图片/语音/文字</li><li><code>MessageChatMemoryAdvisor</code>历史消息增强和消息自动保存，调用<code>AiMessageChatMemory</code>的<code>get</code>方法获取会话的历史消息和<code>add</code>方法保存消息。</li><li>使用<code>ChatClient</code>填写用户发送的消息（可能包含图片/语言），填写<code>MessageChatMemoryAdvisor</code>。最后发起流式请求，获取AI回复的消息。</li></ul></li><li>历史消息实现 <ul><li><code>add</code>方法，保存用户发送的消息和AI回复的消息。因为需要填写创建人id，创建人id是在请求里面存储的。保存的时候是在异步的线程里面，要模拟请求环境才能插入数据到数据库。</li><li><code>get</code>方法，获取会话历史消息</li><li><code>clear</code>方法，清空会话的历史消息</li><li>消息转换器，将消息实体转换为SpringAI的<code>Message</code>，将<code>Message</code>转换为消息实体。互相转换。</li></ul></li></ul><h2 id="实体设计" tabindex="-1"><a class="header-anchor" href="#实体设计"><span>实体设计</span></a></h2><h3 id="消息实体设计" tabindex="-1"><a class="header-anchor" href="#消息实体设计"><span>消息实体设计</span></a></h3><p>消息表</p><div class="language-sql line-numbers-mode" data-ext="sql" data-title="sql"><pre class="language-sql"><code><span class="token keyword">create</span> <span class="token keyword">table</span> ai_message
<span class="token punctuation">(</span>
    id            <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">36</span><span class="token punctuation">)</span> <span class="token operator">not</span> <span class="token boolean">null</span>
        <span class="token keyword">primary</span> <span class="token keyword">key</span><span class="token punctuation">,</span>
    created_time  <span class="token keyword">datetime</span><span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">)</span> <span class="token operator">not</span> <span class="token boolean">null</span><span class="token punctuation">,</span>
    edited_time   <span class="token keyword">datetime</span><span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">)</span> <span class="token operator">not</span> <span class="token boolean">null</span><span class="token punctuation">,</span>
    creator_id    <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">32</span><span class="token punctuation">)</span> <span class="token operator">not</span> <span class="token boolean">null</span><span class="token punctuation">,</span>
    editor_id     <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">32</span><span class="token punctuation">)</span> <span class="token operator">not</span> <span class="token boolean">null</span><span class="token punctuation">,</span>
    <span class="token keyword">type</span>          <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">32</span><span class="token punctuation">)</span> <span class="token operator">not</span> <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;消息类型(用户/ 助手/ 系统)&#39;</span><span class="token punctuation">,</span>
    text_content  <span class="token keyword">text</span>        <span class="token operator">not</span> <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;消息内容&#39;</span><span class="token punctuation">,</span>
    medias        json        <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;媒体内容如图片链接、语音链接&#39;</span><span class="token punctuation">,</span>
    ai_session_id <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">32</span><span class="token punctuation">)</span> <span class="token operator">not</span> <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;会话id&#39;</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>消息实体类</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 历史消息
 */</span> 
<span class="token annotation punctuation">@Entity</span>
<span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">AiMessage</span> <span class="token keyword">extends</span> <span class="token class-name">BaseEntity</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 消息类型(用户/助手/系统)
     */</span>
    <span class="token class-name">MessageType</span> <span class="token function">type</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 消息内容
     */</span>
    <span class="token class-name">String</span> <span class="token function">textContent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Serialized</span>
    <span class="token annotation punctuation">@Null</span>
    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Media</span><span class="token punctuation">&gt;</span></span> <span class="token function">medias</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token annotation punctuation">@IdView</span>
    <span class="token class-name">String</span> <span class="token function">sessionId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 会话
     */</span>
    <span class="token annotation punctuation">@ManyToOne</span>
    <span class="token annotation punctuation">@JoinColumn</span><span class="token punctuation">(</span>name <span class="token operator">=</span> <span class="token string">&quot;ai_session_id&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@OnDissociate</span><span class="token punctuation">(</span><span class="token class-name">DissociateAction</span><span class="token punctuation">.</span><span class="token constant">DELETE</span><span class="token punctuation">)</span>
    <span class="token class-name">AiSession</span> <span class="token function">session</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Data</span>
    <span class="token annotation punctuation">@AllArgsConstructor</span>
    <span class="token keyword">class</span> <span class="token class-name">Media</span> <span class="token punctuation">{</span>
        <span class="token keyword">public</span> <span class="token class-name">String</span> type<span class="token punctuation">;</span>
        <span class="token keyword">public</span> <span class="token class-name">String</span> data<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="会话实体设计" tabindex="-1"><a class="header-anchor" href="#会话实体设计"><span>会话实体设计</span></a></h3><p>会话表</p><div class="language-sql line-numbers-mode" data-ext="sql" data-title="sql"><pre class="language-sql"><code><span class="token keyword">create</span> <span class="token keyword">table</span> ai_session
<span class="token punctuation">(</span>
    id           <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">36</span><span class="token punctuation">)</span> <span class="token operator">not</span> <span class="token boolean">null</span>
        <span class="token keyword">primary</span> <span class="token keyword">key</span><span class="token punctuation">,</span>
    created_time <span class="token keyword">datetime</span><span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">)</span> <span class="token operator">not</span> <span class="token boolean">null</span><span class="token punctuation">,</span>
    edited_time  <span class="token keyword">datetime</span><span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">)</span> <span class="token operator">not</span> <span class="token boolean">null</span><span class="token punctuation">,</span>
    creator_id   <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">32</span><span class="token punctuation">)</span> <span class="token operator">not</span> <span class="token boolean">null</span><span class="token punctuation">,</span>
    editor_id    <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">32</span><span class="token punctuation">)</span> <span class="token operator">not</span> <span class="token boolean">null</span><span class="token punctuation">,</span>
    name         <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">32</span><span class="token punctuation">)</span> <span class="token operator">not</span> <span class="token boolean">null</span> <span class="token keyword">comment</span> <span class="token string">&#39;会话名称&#39;</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>会话实体类</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 会话
 */</span>
<span class="token annotation punctuation">@Entity</span>
<span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">AiSession</span> <span class="token keyword">extends</span> <span class="token class-name">BaseEntity</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 会话名称
     */</span>
    <span class="token class-name">String</span> <span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 一对多关联消息，按创建时间升序
     */</span>

    <span class="token annotation punctuation">@OneToMany</span><span class="token punctuation">(</span>mappedBy <span class="token operator">=</span> <span class="token string">&quot;session&quot;</span><span class="token punctuation">,</span> orderedProps <span class="token operator">=</span> <span class="token annotation punctuation">@OrderedProp</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;createdTime&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">AiMessage</span><span class="token punctuation">&gt;</span></span> <span class="token function">messages</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="aimessagechatmemory-数据库消息记录" tabindex="-1"><a class="header-anchor" href="#aimessagechatmemory-数据库消息记录"><span>AiMessageChatMemory（数据库消息记录）</span></a></h2><p><code>AiMessageChatMemory</code>实现了<code>ChatMemory</code>接口，用于保存聊天记录到数据库。</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token annotation punctuation">@Service</span>
<span class="token annotation punctuation">@AllArgsConstructor</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AiMessageChatMemory</span> <span class="token keyword">implements</span> <span class="token class-name">ChatMemory</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">AiMessageRepository</span> messageRepository<span class="token punctuation">;</span>
    
    <span class="token doc-comment comment">/**
     * 不实现，手动前端发起请求保存用户的消息和大模型回复的消息
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token class-name">String</span> conversationId<span class="token punctuation">,</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Message</span><span class="token punctuation">&gt;</span></span> messages<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 查询会话内的消息最新n条历史记录
     *
     * <span class="token keyword">@param</span> <span class="token parameter">conversationId</span> 会话id
     * <span class="token keyword">@param</span> <span class="token parameter">lastN</span>          最近n条
     * <span class="token keyword">@return</span> org.springframework.ai.chat.messages.Message格式的消息
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Message</span><span class="token punctuation">&gt;</span></span> <span class="token function">get</span><span class="token punctuation">(</span><span class="token class-name">String</span> conversationId<span class="token punctuation">,</span> <span class="token keyword">int</span> lastN<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> messageRepository
                <span class="token comment">// 查询会话内的最新n条消息</span>
                <span class="token punctuation">.</span><span class="token function">findBySessionId</span><span class="token punctuation">(</span>conversationId<span class="token punctuation">,</span> lastN<span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">stream</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token comment">// 转成Message对象</span>
                <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token class-name">AiMessageChatMemory</span><span class="token operator">::</span><span class="token function">toSpringAiMessage</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">toList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 清除会话内的消息
     *
     * <span class="token keyword">@param</span> <span class="token parameter">conversationId</span> 会话id
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">clear</span><span class="token punctuation">(</span><span class="token class-name">String</span> conversationId<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        messageRepository<span class="token punctuation">.</span><span class="token function">deleteBySessionId</span><span class="token punctuation">(</span>conversationId<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token doc-comment comment">/**
     * 忽略...
     */</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以把<code>AiMessageChatMemory</code>注入到<code>MessageChatMemoryAdvisor</code>中。</p><p>MessageChatMemoryAdvisor的作用有下面三个</p><ol><li>用户消息发送给大模型之前，获取会话内的最新n条记录和用户的消息拼接在一起，形成历史消息记录。</li><li>拼接完历史消息之后把用户发送的消息保存到数据库。</li><li>大模型回复完消息之后，将回复的消息保存到数据库。</li></ol><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token comment">// 注入chatMemory</span>
<span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">AiMessageChatMemory</span> chatMemory<span class="token punctuation">;</span>
<span class="token comment">// 传入chatMemory，会话id，查询最近n条历史消息</span>
<span class="token keyword">var</span> messageChatMemoryAdvisor <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MessageChatMemoryAdvisor</span><span class="token punctuation">(</span>chatMemory<span class="token punctuation">,</span> input<span class="token punctuation">.</span><span class="token function">getSessionId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="消息发送接口" tabindex="-1"><a class="header-anchor" href="#消息发送接口"><span>消息发送接口</span></a></h2><p>通常来说发送消息给大模型只需要填写用户的消息就行，但是要支持历史会话需要获取历史消息。这个功能可以使用<a href="#aimessagechatmemory%E6%95%B0%E6%8D%AE%E5%BA%93%E6%B6%88%E6%81%AF%E8%AE%B0%E5%BD%95">MessageChatMemoryAdvisor</a>来实现。</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">&quot;message&quot;</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@RestController</span>
<span class="token annotation punctuation">@AllArgsConstructor</span>
<span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AiMessageController</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">AiMessageChatMemory</span> chatMemory<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">DashScopeAiChatModel</span> dashScopeAiChatModel<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">ObjectMapper</span> objectMapper<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">AiMessageRepository</span> messageRepository<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 消息保存
     * <span class="token keyword">@param</span> <span class="token parameter">input</span> 用户发送的消息/AI回复的消息
     */</span>
    <span class="token annotation punctuation">@PostMapping</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">save</span><span class="token punctuation">(</span><span class="token annotation punctuation">@RequestBody</span> <span class="token class-name">AiMessageInput</span> input<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        messageRepository<span class="token punctuation">.</span><span class="token function">save</span><span class="token punctuation">(</span>input<span class="token punctuation">.</span><span class="token function">toEntity</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@param</span> <span class="token parameter">input</span> 消息包含文本信息，会话id，多媒体信息（图片语言）。参考src/main/dto/AiMessage.dto
     * <span class="token keyword">@return</span> SSE流
     */</span>
    <span class="token annotation punctuation">@PostMapping</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;chat&quot;</span><span class="token punctuation">,</span> produces <span class="token operator">=</span> <span class="token class-name">MediaType</span><span class="token punctuation">.</span><span class="token constant">TEXT_EVENT_STREAM_VALUE</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token class-name">Flux</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ServerSentEvent</span><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token function">chatStreamWithHistory</span><span class="token punctuation">(</span><span class="token annotation punctuation">@RequestBody</span> <span class="token class-name">AiMessageInput</span> input<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// MessageChatMemoryAdvisor的三个参数解释。</span>
        <span class="token comment">// 1. 如果需要存储会话和消息到数据库，自己可以实现ChatMemory接口，这里使用自己实现的AiMessageChatMemory，数据库存储。</span>
        <span class="token comment">// 2. 传入会话id，MessageChatMemoryAdvisor会根据会话id去查找消息。</span>
        <span class="token comment">// 3. 只需要携带最近10条消息</span>
        <span class="token keyword">var</span> messageChatMemoryAdvisor <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MessageChatMemoryAdvisor</span><span class="token punctuation">(</span>chatMemory<span class="token punctuation">,</span> input<span class="token punctuation">.</span><span class="token function">getSessionId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token class-name">ChatClient</span><span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>dashScopeAiChatModel<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">prompt</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">user</span><span class="token punctuation">(</span>promptUserSpec <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
                    <span class="token comment">// AiMessageInput转成Message</span>
                    <span class="token class-name">Message</span> message <span class="token operator">=</span> <span class="token class-name">AiMessageChatMemory</span><span class="token punctuation">.</span><span class="token function">toSpringAiMessage</span><span class="token punctuation">(</span>input<span class="token punctuation">.</span><span class="token function">toEntity</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token class-name">CollectionUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token function">getMedia</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        <span class="token comment">// 用户发送的图片/语言</span>
                        <span class="token class-name">Media</span><span class="token punctuation">[</span><span class="token punctuation">]</span> medias <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Media</span><span class="token punctuation">[</span>message<span class="token punctuation">.</span><span class="token function">getMedia</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
                        promptUserSpec<span class="token punctuation">.</span><span class="token function">media</span><span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token function">getMedia</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toArray</span><span class="token punctuation">(</span>medias<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                    <span class="token comment">// 用户发送的文本</span>
                    promptUserSpec<span class="token punctuation">.</span><span class="token function">text</span><span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token function">getContent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span><span class="token punctuation">)</span>
                <span class="token comment">// MessageChatMemoryAdvisor会在消息发送给大模型之前，从ChatMemory中获取会话的历史消息，然后一起发送给大模型。</span>
                <span class="token punctuation">.</span><span class="token function">advisors</span><span class="token punctuation">(</span>messageChatMemoryAdvisor<span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">stream</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">content</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>chatResponse <span class="token operator">-&gt;</span> <span class="token class-name">ServerSentEvent</span><span class="token punctuation">.</span><span class="token function">builder</span><span class="token punctuation">(</span><span class="token function">toJson</span><span class="token punctuation">(</span>chatResponse<span class="token punctuation">)</span><span class="token punctuation">)</span>
                        <span class="token comment">// 和前端监听的事件相对应</span>
                        <span class="token punctuation">.</span><span class="token function">event</span><span class="token punctuation">(</span><span class="token string">&quot;message&quot;</span><span class="token punctuation">)</span>
                        <span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token annotation punctuation">@SneakyThrows</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">toJson</span><span class="token punctuation">(</span><span class="token class-name">ChatResponse</span> response<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> objectMapper<span class="token punctuation">.</span><span class="token function">writeValueAsString</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,27),o=[p];function c(i,l){return s(),a("div",null,o)}const k=n(t,[["render",c],["__file","backend.html.vue"]]);export{k as default};
