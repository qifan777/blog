const e=JSON.parse('{"key":"v-4eaa9a80","path":"/project/spring-ai/vector-database/","title":"向量数据库","lang":"zh-CN","frontmatter":{"description":"向量数据库 安装RedisStack 需要先禁用掉自己原本的redis，防止端口冲突。访问localhost:8001查看数据库的信息。用户名：default,密码：123456。 引入依赖 配置连接 配置向量数据库 如果你的项目里面有用到redis，需要先禁用RedisVectorStoreAutoConfiguration。这是SpringAI自动...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/blog/project/spring-ai/vector-database/"}],["meta",{"property":"og:site_name","content":"起凡Code闲聊"}],["meta",{"property":"og:title","content":"向量数据库"}],["meta",{"property":"og:description","content":"向量数据库 安装RedisStack 需要先禁用掉自己原本的redis，防止端口冲突。访问localhost:8001查看数据库的信息。用户名：default,密码：123456。 引入依赖 配置连接 配置向量数据库 如果你的项目里面有用到redis，需要先禁用RedisVectorStoreAutoConfiguration。这是SpringAI自动..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-14T06:57:57.000Z"}],["meta",{"property":"article:author","content":"起凡"}],["meta",{"property":"article:modified_time","content":"2024-06-14T06:57:57.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"向量数据库\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-06-14T06:57:57.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"起凡\\",\\"url\\":\\"https://www.jarcheng.top\\"}]}"]]},"headers":[{"level":2,"title":"安装RedisStack","slug":"安装redisstack","link":"#安装redisstack","children":[]},{"level":2,"title":"引入依赖","slug":"引入依赖","link":"#引入依赖","children":[]},{"level":2,"title":"配置连接","slug":"配置连接","link":"#配置连接","children":[]},{"level":2,"title":"配置向量数据库","slug":"配置向量数据库","link":"#配置向量数据库","children":[]},{"level":2,"title":"文档嵌入","slug":"文档嵌入","link":"#文档嵌入","children":[]},{"level":2,"title":"文档查询","slug":"文档查询","link":"#文档查询","children":[]}],"git":{"createdTime":1718348277000,"updatedTime":1718348277000,"contributors":[{"name":"linjiacheng","email":"1507906763@qq.com","commits":1}]},"readingTime":{"minutes":1.66,"words":498},"filePathRelative":"project/spring-ai/vector-database/README.md","localizedDate":"2024年6月14日","excerpt":"\\n<h2>安装RedisStack</h2>\\n<p>需要先禁用掉自己原本的redis，防止端口冲突。访问<code>localhost:8001</code>查看数据库的信息。用户名：<code>default</code>,密码：<code>123456</code>。</p>\\n<div class=\\"language-bash\\" data-ext=\\"sh\\" data-title=\\"sh\\"><pre class=\\"language-bash\\"><code><span class=\\"token function\\">docker</span> run <span class=\\"token parameter variable\\">-d</span> <span class=\\"token parameter variable\\">--name</span> redis-stack <span class=\\"token parameter variable\\">--restart</span><span class=\\"token operator\\">=</span>always  <span class=\\"token parameter variable\\">-v</span> redis-data:/data <span class=\\"token parameter variable\\">-p</span> <span class=\\"token number\\">6379</span>:6379 <span class=\\"token parameter variable\\">-p</span> <span class=\\"token number\\">8001</span>:8001 <span class=\\"token parameter variable\\">-e</span> <span class=\\"token assign-left variable\\">REDIS_ARGS</span><span class=\\"token operator\\">=</span><span class=\\"token string\\">\\"--requirepass 123456\\"</span> redis/redis-stack:latest\\n</code></pre></div>","autoDesc":true}');export{e as data};
