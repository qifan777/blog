const n=JSON.parse('{"key":"v-274b62ba","path":"/project/qifan-mall/product/product-category.html","title":"商品类别","lang":"zh-CN","frontmatter":{"category":["起凡商城"],"tag":["商品管理","商品类别"],"order":1,"date":"2024-01-18T00:00:00.000Z","timeline":true,"description":"商品类别 商品类别商品类别 建表 实体类 生成代码 参考 父亲类别选择 父亲类别查询 product-category-store.ts 远程选择器 product-category-create-form.vue product-category-query.vue product-category-update-form.vue ","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/blog/project/qifan-mall/product/product-category.html"}],["meta",{"property":"og:site_name","content":"起凡Code闲聊"}],["meta",{"property":"og:title","content":"商品类别"}],["meta",{"property":"og:description","content":"商品类别 商品类别商品类别 建表 实体类 生成代码 参考 父亲类别选择 父亲类别查询 product-category-store.ts 远程选择器 product-category-create-form.vue product-category-query.vue product-category-update-form.vue "}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-02-04T11:55:25.000Z"}],["meta",{"property":"article:author","content":"起凡"}],["meta",{"property":"article:tag","content":"商品管理"}],["meta",{"property":"article:tag","content":"商品类别"}],["meta",{"property":"article:published_time","content":"2024-01-18T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-02-04T11:55:25.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"商品类别\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-01-18T00:00:00.000Z\\",\\"dateModified\\":\\"2024-02-04T11:55:25.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"起凡\\",\\"url\\":\\"https://www.jarcheng.top\\"}]}"]]},"headers":[{"level":2,"title":"建表","slug":"建表","link":"#建表","children":[]},{"level":2,"title":"实体类","slug":"实体类","link":"#实体类","children":[]},{"level":2,"title":"生成代码","slug":"生成代码","link":"#生成代码","children":[]},{"level":2,"title":"父亲类别选择","slug":"父亲类别选择","link":"#父亲类别选择","children":[{"level":3,"title":"父亲类别查询","slug":"父亲类别查询","link":"#父亲类别查询","children":[]},{"level":3,"title":"远程选择器","slug":"远程选择器","link":"#远程选择器","children":[]}]}],"git":{"createdTime":1707047725000,"updatedTime":1707047725000,"contributors":[{"name":"linjiacheng","email":"1507906763@qq.com","commits":1}]},"readingTime":{"minutes":0.94,"words":283},"filePathRelative":"project/qifan-mall/product/product-category.md","localizedDate":"2024年1月18日","excerpt":"\\n<div style=\\"text-align:center\\">\\n<figure><figcaption>商品类别</figcaption></figure>\\n</div>\\n<h2>建表</h2>\\n<div class=\\"language-sql\\" data-ext=\\"sql\\" data-title=\\"sql\\"><pre class=\\"language-sql\\"><code><span class=\\"token comment\\">-- auto-generated definition</span>\\n<span class=\\"token keyword\\">create</span> <span class=\\"token keyword\\">table</span> product_category\\n<span class=\\"token punctuation\\">(</span>\\n    id           <span class=\\"token keyword\\">varchar</span><span class=\\"token punctuation\\">(</span><span class=\\"token number\\">36</span><span class=\\"token punctuation\\">)</span>  <span class=\\"token operator\\">not</span> <span class=\\"token boolean\\">null</span>\\n        <span class=\\"token keyword\\">primary</span> <span class=\\"token keyword\\">key</span><span class=\\"token punctuation\\">,</span>\\n    created_time <span class=\\"token keyword\\">datetime</span><span class=\\"token punctuation\\">(</span><span class=\\"token number\\">6</span><span class=\\"token punctuation\\">)</span>  <span class=\\"token operator\\">not</span> <span class=\\"token boolean\\">null</span><span class=\\"token punctuation\\">,</span>\\n    edited_time  <span class=\\"token keyword\\">datetime</span><span class=\\"token punctuation\\">(</span><span class=\\"token number\\">6</span><span class=\\"token punctuation\\">)</span>  <span class=\\"token operator\\">not</span> <span class=\\"token boolean\\">null</span><span class=\\"token punctuation\\">,</span>\\n    creator_id   <span class=\\"token keyword\\">varchar</span><span class=\\"token punctuation\\">(</span><span class=\\"token number\\">36</span><span class=\\"token punctuation\\">)</span>  <span class=\\"token operator\\">not</span> <span class=\\"token boolean\\">null</span><span class=\\"token punctuation\\">,</span>\\n    editor_id    <span class=\\"token keyword\\">varchar</span><span class=\\"token punctuation\\">(</span><span class=\\"token number\\">36</span><span class=\\"token punctuation\\">)</span>  <span class=\\"token operator\\">not</span> <span class=\\"token boolean\\">null</span><span class=\\"token punctuation\\">,</span>\\n    name         <span class=\\"token keyword\\">varchar</span><span class=\\"token punctuation\\">(</span><span class=\\"token number\\">50</span><span class=\\"token punctuation\\">)</span>  <span class=\\"token operator\\">not</span> <span class=\\"token boolean\\">null</span><span class=\\"token punctuation\\">,</span>\\n    parent_id    <span class=\\"token keyword\\">varchar</span><span class=\\"token punctuation\\">(</span><span class=\\"token number\\">36</span><span class=\\"token punctuation\\">)</span>  <span class=\\"token boolean\\">null</span><span class=\\"token punctuation\\">,</span>\\n    image        <span class=\\"token keyword\\">varchar</span><span class=\\"token punctuation\\">(</span><span class=\\"token number\\">100</span><span class=\\"token punctuation\\">)</span> <span class=\\"token boolean\\">null</span><span class=\\"token punctuation\\">,</span>\\n    description  <span class=\\"token keyword\\">text</span>         <span class=\\"token operator\\">not</span> <span class=\\"token boolean\\">null</span><span class=\\"token punctuation\\">,</span>\\n    sort_order   <span class=\\"token keyword\\">int</span>          <span class=\\"token operator\\">not</span> <span class=\\"token boolean\\">null</span>\\n<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n</code></pre></div>","autoDesc":true}');export{n as data};
