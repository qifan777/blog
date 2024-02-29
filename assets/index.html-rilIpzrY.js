const e=JSON.parse('{"key":"v-09c5eee0","path":"/knowledge/tips/binary-picture/","title":"前端显示二进制流图片","lang":"zh-CN","frontmatter":{"category":["IO"],"tag":["SpringBoot","图片二进制流"],"date":"2024-02-29T00:00:00.000Z","timeline":true,"description":"前端显示二进制流图片 读取resource目录下的图片 在resource目录下的文件（文件夹）编译后都会在classpath的根目录下下。如下图： resource目录的含义 从类路径中读取名为\\"logo.jpg\\"的文件内容，并将其转换为字节数组。 ClassPathResource(\\"logo.jpg\\")：这是创建一个Spring Framewor...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/blog/knowledge/tips/binary-picture/"}],["meta",{"property":"og:site_name","content":"起凡Code闲聊"}],["meta",{"property":"og:title","content":"前端显示二进制流图片"}],["meta",{"property":"og:description","content":"前端显示二进制流图片 读取resource目录下的图片 在resource目录下的文件（文件夹）编译后都会在classpath的根目录下下。如下图： resource目录的含义 从类路径中读取名为\\"logo.jpg\\"的文件内容，并将其转换为字节数组。 ClassPathResource(\\"logo.jpg\\")：这是创建一个Spring Framewor..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-02-29T13:51:55.000Z"}],["meta",{"property":"article:author","content":"起凡"}],["meta",{"property":"article:tag","content":"SpringBoot"}],["meta",{"property":"article:tag","content":"图片二进制流"}],["meta",{"property":"article:published_time","content":"2024-02-29T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-02-29T13:51:55.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"前端显示二进制流图片\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-02-29T00:00:00.000Z\\",\\"dateModified\\":\\"2024-02-29T13:51:55.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"起凡\\",\\"url\\":\\"https://www.jarcheng.top\\"}]}"]]},"headers":[{"level":2,"title":"读取resource目录下的图片","slug":"读取resource目录下的图片","link":"#读取resource目录下的图片","children":[]},{"level":2,"title":"前端展示","slug":"前端展示","link":"#前端展示","children":[]}],"git":{"createdTime":1709214715000,"updatedTime":1709214715000,"contributors":[{"name":"linjiacheng","email":"1507906763@qq.com","commits":1}]},"readingTime":{"minutes":2.55,"words":766},"filePathRelative":"knowledge/tips/binary-picture/README.md","localizedDate":"2024年2月29日","excerpt":"\\n<h2>读取resource目录下的图片</h2>\\n<p>在resource目录下的文件（文件夹）编译后都会在classpath的根目录下下。如下图：<br>\\n</p>\\n<p>从类路径中读取名为\\"logo.jpg\\"的文件内容，并将其转换为字节数组。</p>\\n<ol>\\n<li>\\n<p><code>ClassPathResource(\\"logo.jpg\\")</code>：这是创建一个Spring Framework中的<code>ClassPathResource</code>对象，它代表了一个应从类路径获取的资源。</p>\\n</li>\\n<li>\\n<p><code>.getInputStream()</code>：调用该方法会返回一个指向该资源的输入流（InputStream），通过这个输入流可以读取“logo.jpg”文件的实际内容。</p>\\n</li>\\n<li>\\n<p><code>.readAllBytes()</code>：进一步调用此方法会读取并返回输入流中的所有字节，即将“logo.jpg”图片文件的内容以字节数组的形式一次性读取出来。</p>\\n</li>\\n</ol>","autoDesc":true}');export{e as data};
