const n=JSON.parse(`{"key":"v-6dbaeae3","path":"/project/qifan-mall/order/order-create.html","title":"订单创建","lang":"zh-CN","frontmatter":{"category":["起凡商城"],"tag":["订单","订单创建"],"order":0,"date":"2024-01-31T00:00:00.000Z","timeline":true,"description":"订单创建 订单创建订单创建 枚举值添加 需要把创建人和编辑人的id替换成自己的id 添加完之后调用该接口生成枚举类 表/实体类创建 创建订单接口 相关信息 路由配置 购物车提交处理 点击提交购物车时，购物车会把已选的SKU通过提交购物车事件向外传播，该方法处理提交购物车事件，并将已选的SKU传给订单提交页面。 当调用handleSubmit函数时，它接...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/blog/project/qifan-mall/order/order-create.html"}],["meta",{"property":"og:site_name","content":"起凡Code闲聊"}],["meta",{"property":"og:title","content":"订单创建"}],["meta",{"property":"og:description","content":"订单创建 订单创建订单创建 枚举值添加 需要把创建人和编辑人的id替换成自己的id 添加完之后调用该接口生成枚举类 表/实体类创建 创建订单接口 相关信息 路由配置 购物车提交处理 点击提交购物车时，购物车会把已选的SKU通过提交购物车事件向外传播，该方法处理提交购物车事件，并将已选的SKU传给订单提交页面。 当调用handleSubmit函数时，它接..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-02-18T13:32:55.000Z"}],["meta",{"property":"article:author","content":"起凡"}],["meta",{"property":"article:tag","content":"订单"}],["meta",{"property":"article:tag","content":"订单创建"}],["meta",{"property":"article:published_time","content":"2024-01-31T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-02-18T13:32:55.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"订单创建\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-01-31T00:00:00.000Z\\",\\"dateModified\\":\\"2024-02-18T13:32:55.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"起凡\\",\\"url\\":\\"https://www.jarcheng.top\\"}]}"]]},"headers":[{"level":2,"title":"枚举值添加","slug":"枚举值添加","link":"#枚举值添加","children":[]},{"level":2,"title":"表/实体类创建","slug":"表-实体类创建","link":"#表-实体类创建","children":[]},{"level":2,"title":"创建订单接口","slug":"创建订单接口","link":"#创建订单接口","children":[]},{"level":2,"title":"路由配置","slug":"路由配置","link":"#路由配置","children":[]},{"level":2,"title":"购物车提交处理","slug":"购物车提交处理","link":"#购物车提交处理","children":[]},{"level":2,"title":"订单创建页面","slug":"订单创建页面","link":"#订单创建页面","children":[{"level":3,"title":"地址选择","slug":"地址选择","link":"#地址选择","children":[]},{"level":3,"title":"商品Sku展示和价格详情","slug":"商品sku展示和价格详情","link":"#商品sku展示和价格详情","children":[]},{"level":3,"title":"订单提交","slug":"订单提交","link":"#订单提交","children":[]}]}],"git":{"createdTime":1707047725000,"updatedTime":1708263175000,"contributors":[{"name":"linjiacheng","email":"1507906763@qq.com","commits":2}]},"readingTime":{"minutes":19.8,"words":5941},"filePathRelative":"project/qifan-mall/order/order-create.md","localizedDate":"2024年1月31日","excerpt":"\\n<figure><figcaption>订单创建</figcaption></figure>\\n<h2>枚举值添加</h2>\\n<p>需要把创建人和编辑人的id替换成自己的id</p>\\n<div class=\\"language-sql\\" data-ext=\\"sql\\" data-title=\\"sql\\"><pre class=\\"language-sql\\"><code><span class=\\"token keyword\\">INSERT</span> <span class=\\"token keyword\\">INTO</span> mall<span class=\\"token punctuation\\">.</span>dict <span class=\\"token punctuation\\">(</span>id<span class=\\"token punctuation\\">,</span> created_time<span class=\\"token punctuation\\">,</span> edited_time<span class=\\"token punctuation\\">,</span> creator_id<span class=\\"token punctuation\\">,</span> editor_id<span class=\\"token punctuation\\">,</span> key_id<span class=\\"token punctuation\\">,</span> key_en_name<span class=\\"token punctuation\\">,</span> key_name<span class=\\"token punctuation\\">,</span> dict_id<span class=\\"token punctuation\\">,</span> dict_name<span class=\\"token punctuation\\">,</span> dict_en_name<span class=\\"token punctuation\\">,</span> order_num<span class=\\"token punctuation\\">)</span> <span class=\\"token keyword\\">VALUES</span> <span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'5fba34ff-760c-453a-9ce3-284ed68710ca'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-14 15:23:55.954376'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-14 15:23:55.954376'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">2</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'PRIVATE'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'保密'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1001</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'性别'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'GENDER'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token keyword\\">INSERT</span> <span class=\\"token keyword\\">INTO</span> mall<span class=\\"token punctuation\\">.</span>dict <span class=\\"token punctuation\\">(</span>id<span class=\\"token punctuation\\">,</span> created_time<span class=\\"token punctuation\\">,</span> edited_time<span class=\\"token punctuation\\">,</span> creator_id<span class=\\"token punctuation\\">,</span> editor_id<span class=\\"token punctuation\\">,</span> key_id<span class=\\"token punctuation\\">,</span> key_en_name<span class=\\"token punctuation\\">,</span> key_name<span class=\\"token punctuation\\">,</span> dict_id<span class=\\"token punctuation\\">,</span> dict_name<span class=\\"token punctuation\\">,</span> dict_en_name<span class=\\"token punctuation\\">,</span> order_num<span class=\\"token punctuation\\">)</span> <span class=\\"token keyword\\">VALUES</span> <span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'a3caf40e-a1ef-4a77-8096-f467fb14060e'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-10 10:50:18.555224'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-11 15:49:22.959501'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'MALE'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'男'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1001</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'性别'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'GENDER'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token keyword\\">INSERT</span> <span class=\\"token keyword\\">INTO</span> mall<span class=\\"token punctuation\\">.</span>dict <span class=\\"token punctuation\\">(</span>id<span class=\\"token punctuation\\">,</span> created_time<span class=\\"token punctuation\\">,</span> edited_time<span class=\\"token punctuation\\">,</span> creator_id<span class=\\"token punctuation\\">,</span> editor_id<span class=\\"token punctuation\\">,</span> key_id<span class=\\"token punctuation\\">,</span> key_en_name<span class=\\"token punctuation\\">,</span> key_name<span class=\\"token punctuation\\">,</span> dict_id<span class=\\"token punctuation\\">,</span> dict_name<span class=\\"token punctuation\\">,</span> dict_en_name<span class=\\"token punctuation\\">,</span> order_num<span class=\\"token punctuation\\">)</span> <span class=\\"token keyword\\">VALUES</span> <span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'b3366061-0be1-45f9-98de-5a86753665ce'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-10 13:55:26.468101'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-10 13:55:26.468101'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'FEMALE'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'女'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1001</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'性别'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'GENDER'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token keyword\\">INSERT</span> <span class=\\"token keyword\\">INTO</span> mall<span class=\\"token punctuation\\">.</span>dict <span class=\\"token punctuation\\">(</span>id<span class=\\"token punctuation\\">,</span> created_time<span class=\\"token punctuation\\">,</span> edited_time<span class=\\"token punctuation\\">,</span> creator_id<span class=\\"token punctuation\\">,</span> editor_id<span class=\\"token punctuation\\">,</span> key_id<span class=\\"token punctuation\\">,</span> key_en_name<span class=\\"token punctuation\\">,</span> key_name<span class=\\"token punctuation\\">,</span> dict_id<span class=\\"token punctuation\\">,</span> dict_name<span class=\\"token punctuation\\">,</span> dict_en_name<span class=\\"token punctuation\\">,</span> order_num<span class=\\"token punctuation\\">)</span> <span class=\\"token keyword\\">VALUES</span> <span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'1f01fa7b-f162-4376-870d-9207735f658d'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-16 09:33:09.151337'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-16 09:33:09.151337'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">2</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'BUTTON'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'按钮'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1002</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'菜单类型'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'MENU_TYPE'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">2</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token keyword\\">INSERT</span> <span class=\\"token keyword\\">INTO</span> mall<span class=\\"token punctuation\\">.</span>dict <span class=\\"token punctuation\\">(</span>id<span class=\\"token punctuation\\">,</span> created_time<span class=\\"token punctuation\\">,</span> edited_time<span class=\\"token punctuation\\">,</span> creator_id<span class=\\"token punctuation\\">,</span> editor_id<span class=\\"token punctuation\\">,</span> key_id<span class=\\"token punctuation\\">,</span> key_en_name<span class=\\"token punctuation\\">,</span> key_name<span class=\\"token punctuation\\">,</span> dict_id<span class=\\"token punctuation\\">,</span> dict_name<span class=\\"token punctuation\\">,</span> dict_en_name<span class=\\"token punctuation\\">,</span> order_num<span class=\\"token punctuation\\">)</span> <span class=\\"token keyword\\">VALUES</span> <span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'3860dff4-7f22-4ded-bc30-19cd1b4bc098'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-16 09:30:39.144272'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-16 09:33:15.663135'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'PAGE'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'页面'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1002</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'菜单类型'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'MENU_TYPE'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token keyword\\">INSERT</span> <span class=\\"token keyword\\">INTO</span> mall<span class=\\"token punctuation\\">.</span>dict <span class=\\"token punctuation\\">(</span>id<span class=\\"token punctuation\\">,</span> created_time<span class=\\"token punctuation\\">,</span> edited_time<span class=\\"token punctuation\\">,</span> creator_id<span class=\\"token punctuation\\">,</span> editor_id<span class=\\"token punctuation\\">,</span> key_id<span class=\\"token punctuation\\">,</span> key_en_name<span class=\\"token punctuation\\">,</span> key_name<span class=\\"token punctuation\\">,</span> dict_id<span class=\\"token punctuation\\">,</span> dict_name<span class=\\"token punctuation\\">,</span> dict_en_name<span class=\\"token punctuation\\">,</span> order_num<span class=\\"token punctuation\\">)</span> <span class=\\"token keyword\\">VALUES</span> <span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'416c90b4-42e8-4af1-a3f5-7e321c9c3437'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-16 09:32:28.555205'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-16 09:32:28.555205'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'DIRECTORY'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'目录'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1002</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'菜单类型'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'MENU_TYPE'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token keyword\\">INSERT</span> <span class=\\"token keyword\\">INTO</span> mall<span class=\\"token punctuation\\">.</span>dict <span class=\\"token punctuation\\">(</span>id<span class=\\"token punctuation\\">,</span> created_time<span class=\\"token punctuation\\">,</span> edited_time<span class=\\"token punctuation\\">,</span> creator_id<span class=\\"token punctuation\\">,</span> editor_id<span class=\\"token punctuation\\">,</span> key_id<span class=\\"token punctuation\\">,</span> key_en_name<span class=\\"token punctuation\\">,</span> key_name<span class=\\"token punctuation\\">,</span> dict_id<span class=\\"token punctuation\\">,</span> dict_name<span class=\\"token punctuation\\">,</span> dict_en_name<span class=\\"token punctuation\\">,</span> order_num<span class=\\"token punctuation\\">)</span> <span class=\\"token keyword\\">VALUES</span> <span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'2a8a7427-9fb6-4ecb-822c-8b22fd493a93'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-26 11:08:34.090534'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-26 11:08:37.984915'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">4</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'CLOSED'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'已关闭'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1003</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'商品订单状态'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'PRODUCT_ORDER_STATUS'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token keyword\\">INSERT</span> <span class=\\"token keyword\\">INTO</span> mall<span class=\\"token punctuation\\">.</span>dict <span class=\\"token punctuation\\">(</span>id<span class=\\"token punctuation\\">,</span> created_time<span class=\\"token punctuation\\">,</span> edited_time<span class=\\"token punctuation\\">,</span> creator_id<span class=\\"token punctuation\\">,</span> editor_id<span class=\\"token punctuation\\">,</span> key_id<span class=\\"token punctuation\\">,</span> key_en_name<span class=\\"token punctuation\\">,</span> key_name<span class=\\"token punctuation\\">,</span> dict_id<span class=\\"token punctuation\\">,</span> dict_name<span class=\\"token punctuation\\">,</span> dict_en_name<span class=\\"token punctuation\\">,</span> order_num<span class=\\"token punctuation\\">)</span> <span class=\\"token keyword\\">VALUES</span> <span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'461a361d-073c-4574-aed1-c025e04a81a3'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-26 11:09:32.434369'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-26 11:13:54.428416'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">5</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'REFUNDING'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'退款中'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1003</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'商品订单状态'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'PRODUCT_ORDER_STATUS'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token keyword\\">INSERT</span> <span class=\\"token keyword\\">INTO</span> mall<span class=\\"token punctuation\\">.</span>dict <span class=\\"token punctuation\\">(</span>id<span class=\\"token punctuation\\">,</span> created_time<span class=\\"token punctuation\\">,</span> edited_time<span class=\\"token punctuation\\">,</span> creator_id<span class=\\"token punctuation\\">,</span> editor_id<span class=\\"token punctuation\\">,</span> key_id<span class=\\"token punctuation\\">,</span> key_en_name<span class=\\"token punctuation\\">,</span> key_name<span class=\\"token punctuation\\">,</span> dict_id<span class=\\"token punctuation\\">,</span> dict_name<span class=\\"token punctuation\\">,</span> dict_en_name<span class=\\"token punctuation\\">,</span> order_num<span class=\\"token punctuation\\">)</span> <span class=\\"token keyword\\">VALUES</span> <span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'56e8d930-6953-4f6a-875c-34d5c26802a5'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-26 11:03:49.162351'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-26 11:04:00.418344'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">2</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'TO_BE_RECEIVED'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'待收货'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1003</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'商品订单状态'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'PRODUCT_ORDER_STATUS'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n<span class=\\"token keyword\\">INSERT</span> <span class=\\"token keyword\\">INTO</span> mall<span class=\\"token punctuation\\">.</span>dict <span class=\\"token punctuation\\">(</span>id<span class=\\"token punctuation\\">,</span> created_time<span class=\\"token punctuation\\">,</span> edited_time<span class=\\"token punctuation\\">,</span> creator_id<span class=\\"token punctuation\\">,</span> editor_id<span class=\\"token punctuation\\">,</span> key_id<span class=\\"token punctuation\\">,</span> key_en_name<span class=\\"token punctuation\\">,</span> key_name<span class=\\"token punctuation\\">,</span> dict_id<span class=\\"token punctuation\\">,</span> dict_name<span class=\\"token punctuation\\">,</span> dict_en_name<span class=\\"token punctuation\\">,</span> order_num<span class=\\"token punctuation\\">)</span> <span class=\\"token keyword\\">VALUES</span> <span class=\\"token punctuation\\">(</span><span class=\\"token string\\">'5c820b53-6545-45fd-8442-22f7e486fc8e'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-26 10:56:45.364997'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'2024-01-26 11:02:58.744868'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'0f07d638-f1bc-4011-88d8-6dc650ab06a7'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'TO_BE_PAID'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'待付款'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">1003</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'商品订单状态'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">'PRODUCT_ORDER_STATUS'</span><span class=\\"token punctuation\\">,</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n</code></pre></div>","autoDesc":true}`);export{n as data};
