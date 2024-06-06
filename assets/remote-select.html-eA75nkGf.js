const n=JSON.parse('{"key":"v-e436c70c","path":"/project/qifan-mall/reference/front/remote-select.html","title":"远程选择器","lang":"zh-CN","frontmatter":{"category":["起凡商城","前端基础"],"tag":["远程选择器","一对一","一对多"],"date":"2023-12-11T00:00:00.000Z","timeline":true,"description":"远程选择器 使用该组件可以快速的选择数据库中的数据。 图2 角色选择案例图2 角色选择案例 使用案例 下面的content就是需要选择的角色列表。 roleQueryOptions：提供待选择的角色列表 roleIds：已选的角色会双向绑定到该数组 label-prop：根据上面的数据结构知道name可以作为el-option组件的label valu...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/blog/project/qifan-mall/reference/front/remote-select.html"}],["meta",{"property":"og:site_name","content":"起凡Code闲聊"}],["meta",{"property":"og:title","content":"远程选择器"}],["meta",{"property":"og:description","content":"远程选择器 使用该组件可以快速的选择数据库中的数据。 图2 角色选择案例图2 角色选择案例 使用案例 下面的content就是需要选择的角色列表。 roleQueryOptions：提供待选择的角色列表 roleIds：已选的角色会双向绑定到该数组 label-prop：根据上面的数据结构知道name可以作为el-option组件的label valu..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-02-20T08:19:44.000Z"}],["meta",{"property":"article:author","content":"起凡"}],["meta",{"property":"article:tag","content":"远程选择器"}],["meta",{"property":"article:tag","content":"一对一"}],["meta",{"property":"article:tag","content":"一对多"}],["meta",{"property":"article:published_time","content":"2023-12-11T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-02-20T08:19:44.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"远程选择器\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-12-11T00:00:00.000Z\\",\\"dateModified\\":\\"2024-02-20T08:19:44.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"起凡\\",\\"url\\":\\"https://www.jarcheng.top\\"}]}"]]},"headers":[{"level":2,"title":"使用案例","slug":"使用案例","link":"#使用案例","children":[]},{"level":2,"title":"源码解析","slug":"源码解析","link":"#源码解析","children":[]}],"git":{"createdTime":1708417184000,"updatedTime":1708417184000,"contributors":[{"name":"linjiacheng","email":"1507906763@qq.com","commits":1}]},"readingTime":{"minutes":1.76,"words":529},"filePathRelative":"project/qifan-mall/reference/front/remote-select.md","localizedDate":"2023年12月11日","excerpt":"\\n<p>使用该组件可以快速的选择数据库中的数据。</p>\\n<div style=\\"text-align:center\\">\\n<figure><figcaption>图2 角色选择案例</figcaption></figure>\\n</div>\\n<h2>使用案例</h2>\\n<p>下面的content就是需要选择的角色列表。</p>\\n<div class=\\"language-json\\" data-ext=\\"json\\" data-title=\\"json\\"><pre class=\\"language-json\\"><code><span class=\\"token punctuation\\">{</span>\\n  <span class=\\"token property\\">\\"totalElements\\"</span><span class=\\"token operator\\">:</span> <span class=\\"token number\\">3</span><span class=\\"token punctuation\\">,</span>\\n  <span class=\\"token property\\">\\"totalPages\\"</span><span class=\\"token operator\\">:</span> <span class=\\"token number\\">1</span><span class=\\"token punctuation\\">,</span>\\n  <span class=\\"token property\\">\\"size\\"</span><span class=\\"token operator\\">:</span> <span class=\\"token number\\">10</span><span class=\\"token punctuation\\">,</span>\\n  <span class=\\"token property\\">\\"number\\"</span><span class=\\"token operator\\">:</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">,</span>\\n  <span class=\\"token property\\">\\"content\\"</span><span class=\\"token operator\\">:</span> <span class=\\"token punctuation\\">[</span>\\n    <span class=\\"token punctuation\\">{</span>\\n      <span class=\\"token property\\">\\"id\\"</span><span class=\\"token operator\\">:</span> <span class=\\"token string\\">\\"d5352808-e463-4af9-9252-6db6b7df2ca0\\"</span><span class=\\"token punctuation\\">,</span>\\n      <span class=\\"token property\\">\\"name\\"</span><span class=\\"token operator\\">:</span> <span class=\\"token string\\">\\"测试2\\"</span>\\n    <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">,</span>\\n    <span class=\\"token punctuation\\">{</span>\\n      <span class=\\"token property\\">\\"id\\"</span><span class=\\"token operator\\">:</span> <span class=\\"token string\\">\\"17509f5c-9a6b-429c-b467-cadbd8873d2d\\"</span><span class=\\"token punctuation\\">,</span>\\n      <span class=\\"token property\\">\\"name\\"</span><span class=\\"token operator\\">:</span> <span class=\\"token string\\">\\"测试3\\"</span>\\n    <span class=\\"token punctuation\\">}</span><span class=\\"token punctuation\\">,</span>\\n    <span class=\\"token punctuation\\">{</span>\\n      <span class=\\"token property\\">\\"id\\"</span><span class=\\"token operator\\">:</span> <span class=\\"token string\\">\\"1\\"</span><span class=\\"token punctuation\\">,</span>\\n      <span class=\\"token property\\">\\"name\\"</span><span class=\\"token operator\\">:</span> <span class=\\"token string\\">\\"管理员\\"</span>\\n    <span class=\\"token punctuation\\">}</span>\\n  <span class=\\"token punctuation\\">]</span>\\n<span class=\\"token punctuation\\">}</span>\\n</code></pre></div>","autoDesc":true}');export{n as data};