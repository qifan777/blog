const e=JSON.parse('{"key":"v-80ef2c12","path":"/project/spring-ai/graph/graph-rag.html","title":"GraphRag案例","lang":"zh-CN","frontmatter":{"order":6,"description":"GraphRag案例 配置 模型必须选上下文比较大的，下面这两个都可以，其他的ai厂家可以参考官网描述。 Chunk RAG 为了防止大模型的context过大，我们一般会把原始的文本切割成小块然后嵌入到向量数据库中。当用户提问的时候就去向量数据库中查询相关的Chunk，这样就可以只取出原始文本的一小部分作为上下文信息给AI。 这样也会产生一个弊端，就...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/blog/project/spring-ai/graph/graph-rag.html"}],["meta",{"property":"og:site_name","content":"起凡Code闲聊"}],["meta",{"property":"og:title","content":"GraphRag案例"}],["meta",{"property":"og:description","content":"GraphRag案例 配置 模型必须选上下文比较大的，下面这两个都可以，其他的ai厂家可以参考官网描述。 Chunk RAG 为了防止大模型的context过大，我们一般会把原始的文本切割成小块然后嵌入到向量数据库中。当用户提问的时候就去向量数据库中查询相关的Chunk，这样就可以只取出原始文本的一小部分作为上下文信息给AI。 这样也会产生一个弊端，就..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-07-18T09:55:53.000Z"}],["meta",{"property":"article:author","content":"起凡"}],["meta",{"property":"article:modified_time","content":"2024-07-18T09:55:53.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"GraphRag案例\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-07-18T09:55:53.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"起凡\\",\\"url\\":\\"https://www.jarcheng.top\\"}]}"]]},"headers":[{"level":2,"title":"配置","slug":"配置","link":"#配置","children":[]},{"level":2,"title":"Chunk RAG","slug":"chunk-rag","link":"#chunk-rag","children":[{"level":3,"title":"关联上下游Chunk Cypher","slug":"关联上下游chunk-cypher","link":"#关联上下游chunk-cypher","children":[]},{"level":3,"title":"Chunk RAG实现","slug":"chunk-rag实现","link":"#chunk-rag实现","children":[]},{"level":3,"title":"测试","slug":"测试","link":"#测试","children":[]}]},{"level":2,"title":"投资方（Manager） RAG","slug":"投资方-manager-rag","link":"#投资方-manager-rag","children":[{"level":3,"title":"关联投资方Cypher","slug":"关联投资方cypher","link":"#关联投资方cypher","children":[]},{"level":3,"title":"Manager RAG实现","slug":"manager-rag实现","link":"#manager-rag实现","children":[]},{"level":3,"title":"测试","slug":"测试-1","link":"#测试-1","children":[]}]}],"git":{"createdTime":1721286856000,"updatedTime":1721296553000,"contributors":[{"name":"linjiacheng","email":"1507906763@qq.com","commits":2}]},"readingTime":{"minutes":5.81,"words":1743},"filePathRelative":"project/spring-ai/graph/graph-rag.md","localizedDate":"2024年7月18日","excerpt":"\\n<h2>配置</h2>\\n<p>模型必须选上下文比较大的，下面这两个都可以，其他的ai厂家可以参考官网描述。</p>\\n<div class=\\"language-yaml\\" data-ext=\\"yml\\" data-title=\\"yml\\"><pre class=\\"language-yaml\\"><code>    <span class=\\"token key atrule\\">dash-scope</span><span class=\\"token punctuation\\">:</span>\\n      <span class=\\"token key atrule\\">api-key</span><span class=\\"token punctuation\\">:</span> xxx\\n      <span class=\\"token key atrule\\">chat</span><span class=\\"token punctuation\\">:</span>\\n        <span class=\\"token key atrule\\">model</span><span class=\\"token punctuation\\">:</span> qwen<span class=\\"token punctuation\\">-</span>max<span class=\\"token punctuation\\">-</span>longcontext\\n    <span class=\\"token key atrule\\">moonshot</span><span class=\\"token punctuation\\">:</span>\\n      <span class=\\"token key atrule\\">api-key</span><span class=\\"token punctuation\\">:</span> xxx\\n      <span class=\\"token key atrule\\">chat</span><span class=\\"token punctuation\\">:</span>\\n        <span class=\\"token key atrule\\">options</span><span class=\\"token punctuation\\">:</span>\\n          <span class=\\"token key atrule\\">model</span><span class=\\"token punctuation\\">:</span> moonshot<span class=\\"token punctuation\\">-</span>v1<span class=\\"token punctuation\\">-</span>128k\\n</code></pre></div>","autoDesc":true}');export{e as data};