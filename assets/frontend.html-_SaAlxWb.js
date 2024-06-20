const n=JSON.parse('{"key":"v-326bf680","path":"/project/spring-ai/knowledge/frontend.html","title":"前端实现","lang":"zh-CN","frontmatter":{"description":"前端实现 前端需要有一个知识库开关让用户决定本次的查询是否要使用知识库。也需要有一个上传文件的功能，提取出文件中的内容，然后转向量再存入向量数据库。 额外参数面板 这个面板可以放一些额外的参数，如后面还可以选择function call，设置模型参数等。 目前在这个面板我放了上传文档功能和知识库开关。 上传文件的时候要loading一下，避免用户多次重...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/blog/project/spring-ai/knowledge/frontend.html"}],["meta",{"property":"og:site_name","content":"起凡Code闲聊"}],["meta",{"property":"og:title","content":"前端实现"}],["meta",{"property":"og:description","content":"前端实现 前端需要有一个知识库开关让用户决定本次的查询是否要使用知识库。也需要有一个上传文件的功能，提取出文件中的内容，然后转向量再存入向量数据库。 额外参数面板 这个面板可以放一些额外的参数，如后面还可以选择function call，设置模型参数等。 目前在这个面板我放了上传文档功能和知识库开关。 上传文件的时候要loading一下，避免用户多次重..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-20T02:02:33.000Z"}],["meta",{"property":"article:author","content":"起凡"}],["meta",{"property":"article:modified_time","content":"2024-06-20T02:02:33.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"前端实现\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-06-20T02:02:33.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"起凡\\",\\"url\\":\\"https://www.jarcheng.top\\"}]}"]]},"headers":[{"level":2,"title":"额外参数面板","slug":"额外参数面板","link":"#额外参数面板","children":[]},{"level":2,"title":"发送消息携带额外的参数","slug":"发送消息携带额外的参数","link":"#发送消息携带额外的参数","children":[]}],"git":{"createdTime":1718848953000,"updatedTime":1718848953000,"contributors":[{"name":"linjiacheng","email":"1507906763@qq.com","commits":1}]},"readingTime":{"minutes":1.25,"words":375},"filePathRelative":"project/spring-ai/knowledge/frontend.md","localizedDate":"2024年6月20日","excerpt":"\\n<p>前端需要有一个知识库开关让用户决定本次的查询是否要使用知识库。也需要有一个上传文件的功能，提取出文件中的内容，然后转向量再存入向量数据库。</p>\\n<h2>额外参数面板</h2>\\n<p>这个面板可以放一些额外的参数，如后面还可以选择<code>function call</code>，设置模型参数等。</p>\\n<p>目前在这个面板我放了上传文档功能和知识库开关。</p>\\n<div class=\\"language-html\\" data-ext=\\"html\\" data-title=\\"html\\"><pre class=\\"language-html\\"><code><span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>div</span> <span class=\\"token attr-name\\">class</span><span class=\\"token attr-value\\"><span class=\\"token punctuation attr-equals\\">=</span><span class=\\"token punctuation\\">\\"</span>option-panel<span class=\\"token punctuation\\">\\"</span></span><span class=\\"token punctuation\\">&gt;</span></span>\\n    <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>el-form</span><span class=\\"token punctuation\\">&gt;</span></span>\\n        <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>el-form-item</span><span class=\\"token punctuation\\">&gt;</span></span>\\n        <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>el-upload</span>\\n            <span class=\\"token attr-name\\">v-loading</span><span class=\\"token attr-value\\"><span class=\\"token punctuation attr-equals\\">=</span><span class=\\"token punctuation\\">\\"</span>embeddingLoading<span class=\\"token punctuation\\">\\"</span></span>\\n            <span class=\\"token attr-name\\">:action</span><span class=\\"token attr-value\\"><span class=\\"token punctuation attr-equals\\">=</span><span class=\\"token punctuation\\">\\"</span>`${API_PREFIX}/document/embedding`<span class=\\"token punctuation\\">\\"</span></span>\\n            <span class=\\"token attr-name\\">:show-file-list</span><span class=\\"token attr-value\\"><span class=\\"token punctuation attr-equals\\">=</span><span class=\\"token punctuation\\">\\"</span>false<span class=\\"token punctuation\\">\\"</span></span>\\n            <span class=\\"token attr-name\\">:on-success</span><span class=\\"token attr-value\\"><span class=\\"token punctuation attr-equals\\">=</span><span class=\\"token punctuation\\">\\"</span>onUploadSuccess<span class=\\"token punctuation\\">\\"</span></span>\\n            <span class=\\"token attr-name\\">:before-upload</span><span class=\\"token attr-value\\"><span class=\\"token punctuation attr-equals\\">=</span><span class=\\"token punctuation\\">\\"</span>beforeUpload<span class=\\"token punctuation\\">\\"</span></span>\\n        <span class=\\"token punctuation\\">&gt;</span></span>\\n            <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>el-button</span> <span class=\\"token attr-name\\">type</span><span class=\\"token attr-value\\"><span class=\\"token punctuation attr-equals\\">=</span><span class=\\"token punctuation\\">\\"</span>primary<span class=\\"token punctuation\\">\\"</span></span><span class=\\"token punctuation\\">&gt;</span></span>上传文档<span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>el-button</span><span class=\\"token punctuation\\">&gt;</span></span>\\n        <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>el-upload</span><span class=\\"token punctuation\\">&gt;</span></span>\\n        <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>el-form-item</span><span class=\\"token punctuation\\">&gt;</span></span>\\n        <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>el-form-item</span> <span class=\\"token attr-name\\">label</span><span class=\\"token attr-value\\"><span class=\\"token punctuation attr-equals\\">=</span><span class=\\"token punctuation\\">\\"</span>知识库<span class=\\"token punctuation\\">\\"</span></span><span class=\\"token punctuation\\">&gt;</span></span>\\n        <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;</span>el-switch</span> <span class=\\"token attr-name\\">v-model</span><span class=\\"token attr-value\\"><span class=\\"token punctuation attr-equals\\">=</span><span class=\\"token punctuation\\">\\"</span>options.enableVectorStore<span class=\\"token punctuation\\">\\"</span></span><span class=\\"token punctuation\\">&gt;</span></span><span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>el-switch</span><span class=\\"token punctuation\\">&gt;</span></span>\\n        <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>el-form-item</span><span class=\\"token punctuation\\">&gt;</span></span>\\n    <span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>el-form</span><span class=\\"token punctuation\\">&gt;</span></span>\\n<span class=\\"token tag\\"><span class=\\"token tag\\"><span class=\\"token punctuation\\">&lt;/</span>div</span><span class=\\"token punctuation\\">&gt;</span></span>\\n</code></pre></div>","autoDesc":true}');export{n as data};
