import{_ as i}from"./plugin-vue_export-helper-x3n3nnut.js";import{r as o,o as r,c as k,b as c,w as a,d as n,e as s,a as d}from"./app-ZTjFJLqt.js";const m="/blog/assets/image-8-qaXKImve.png",v={},b=d('<h1 id="地址选择" tabindex="-1"><a class="header-anchor" href="#地址选择"><span>地址选择</span></a></h1><p>该组件用于从地址列表中选择地址。通过弹出框显示地址列表，用户点击地址后，会更新选择的地址并发出选择事件。该组件还会在加载时从API获取用户地址列表，并设置第一个地址作为默认选择。</p><figure><img src="'+m+'" alt="地址选择组件" tabindex="0" loading="lazy"><figcaption>地址选择组件</figcaption></figure><h2 id="源码解析" tabindex="-1"><a class="header-anchor" href="#源码解析"><span>源码解析</span></a></h2><h3 id="展示地址" tabindex="-1"><a class="header-anchor" href="#展示地址"><span>展示地址</span></a></h3>',5),h=n("ul",null,[n("li",null,[n("code",null,"<nut-popup>"),s("：使用外部库的弹出框组件，可以显示一组地址列表。")]),n("li",null,[s("地址列表：使用"),n("code",null,"v-for"),s("循环遍历"),n("code",null,"addressList"),s("中的地址，并在每个地址上添加"),n("code",null,"address-wrapper"),s("类。点击地址时，调用"),n("code",null,"handleChoose"),s("方法。")]),n("li",null,[n("code",null,"<check>"),s("和"),n("code",null,"<location2>"),s("：这两个组件分别表示选中和未选中的图标，具体取决于当前地址是否与"),n("code",null,"chosenAddress"),s("相匹配。")]),n("li",null,[n("code",null,"<address-row>"),s("：这是一个组件，用于显示地址的详细信息。")])],-1),g=n("div",{class:"language-html line-numbers-mode","data-ext":"html","data-title":"html"},[n("pre",{class:"language-html"},[n("code",null,[n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),s("template")]),n("span",{class:"token punctuation"},">")]),s(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),s("div")]),s(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),s("address-choose"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),s(`
    `),n("span",{class:"token comment"},"<!-- 弹出地址列表 -->"),s(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),s("nut-popup")]),s(`
      `),n("span",{class:"token attr-name"},":visible"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),s("visible"),n("span",{class:"token punctuation"},'"')]),s(`
      `),n("span",{class:"token attr-name"},[n("span",{class:"token namespace"},"@update:"),s("visible")]),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),s("(value) => emit('update:visible', value)"),n("span",{class:"token punctuation"},'"')]),s(`
      `),n("span",{class:"token attr-name"},"position"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),s("bottom"),n("span",{class:"token punctuation"},'"')]),s(`
      `),n("span",{class:"token attr-name"},"closeable"),s(`
      `),n("span",{class:"token attr-name"},"round"),s(`
    `),n("span",{class:"token punctuation"},">")]),s(`
      `),n("span",{class:"token comment"},"<!-- 点击地址向外发送选择事件，事件内包含了选中的地址信息 -->"),s(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),s("div")]),s(`
        `),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),s("address-wrapper"),n("span",{class:"token punctuation"},'"')]),s(`
        `),n("span",{class:"token attr-name"},":key"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),s("address.id"),n("span",{class:"token punctuation"},'"')]),s(`
        `),n("span",{class:"token attr-name"},"v-for"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),s("address in addressList"),n("span",{class:"token punctuation"},'"')]),s(`
        `),n("span",{class:"token attr-name"},"@click"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),s("handleChoose(address)"),n("span",{class:"token punctuation"},'"')]),s(`
      `),n("span",{class:"token punctuation"},">")]),s(`
        `),n("span",{class:"token comment"},"<!-- 判断是否选中，选中则显示选中图标 -->"),s(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),s("check")]),s(),n("span",{class:"token attr-name"},"color"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),s("red"),n("span",{class:"token punctuation"},'"')]),s(),n("span",{class:"token attr-name"},"v-if"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),s("address.id == chosenAddress.id"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),s("check")]),n("span",{class:"token punctuation"},">")]),s(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),s("location2")]),s(),n("span",{class:"token attr-name"},"color"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),s("red"),n("span",{class:"token punctuation"},'"')]),s(),n("span",{class:"token attr-name"},"v-else"),n("span",{class:"token punctuation"},">")]),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),s("location2")]),n("span",{class:"token punctuation"},">")]),s(`
        `),n("span",{class:"token comment"},"<!-- 展示地址信息 -->"),s(`
        `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),s("address-row")]),s(),n("span",{class:"token attr-name"},"class"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),s("address"),n("span",{class:"token punctuation"},'"')]),s(),n("span",{class:"token attr-name"},":address"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),s("address"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),s(),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),s("address-row")]),n("span",{class:"token punctuation"},">")]),s(`
      `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),s("div")]),n("span",{class:"token punctuation"},">")]),s(`
    `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),s("nut-popup")]),n("span",{class:"token punctuation"},">")]),s(`
  `),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),s("div")]),n("span",{class:"token punctuation"},">")]),s(`
`),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),s("template")]),n("span",{class:"token punctuation"},">")]),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),f=n("ul",null,[n("li",null,[n("code",null,"defineProps"),s("："),n("code",null,"visible"),s(" 和 emit "),n("code",null,"update:visible"),s("配合起来可以实现双向绑定。引用地址选择组件的时候"),n("code",null,'<address-choose v-model:visible="visible"></address-choose>'),s("即可。")]),n("li",null,[n("code",null,"defineEmits"),s("：定义了两个事件，"),n("code",null,"update:visible"),s("和"),n("code",null,"choose"),s("，前者用于更新可见性，后者用于选择地址。")]),n("li",null,[s("使用nut-popup组件，可以实现弹出层效果。接收到visible的改变事件继续向外emit"),n("code",null,`@update:visible="(value) => emit('update:visible', value)"`)]),n("li",null,[n("code",null,"ref"),s("：创建了响应式变量 "),n("code",null,"addressList"),s("用于存储地址列表 和 "),n("code",null,"chosenAddress"),s("用于存储选中的地址。")]),n("li",null,[n("code",null,"Taro.useLoad"),s("：使用Taro框架的加载生命周期钩子，从API中获取用户的地址列表，并将其设置为"),n("code",null,"addressList"),s("。默认情况下，将第一个地址设置为"),n("code",null,"chosenAddress"),s("，并通过"),n("code",null,"emit"),s("发出"),n("code",null,"choose"),s("事件。")]),n("li",null,[n("code",null,"handleChoose"),s("：当用户选择某个地址时，该方法会更新"),n("code",null,"chosenAddress"),s("，将弹出框设置为不可见，并通过"),n("code",null,"emit"),s("发出"),n("code",null,"choose"),s("事件。")]),n("li",null,[n("code",null,"api.addressController.getUserAddress"),s(": 调用后端获取用地址API，后端已经把默认地址排序为第一个，使用前端将第一个地址设置为选中的默认地址。")])],-1),_=n("div",{class:"language-typescript line-numbers-mode","data-ext":"ts","data-title":"ts"},[n("pre",{class:"language-typescript"},[n("code",null,[n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(" ref "),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},'"vue"'),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(" AddressDto "),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},'"@/apis/__generated/model/dto"'),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(" api "),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},'"@/utils/api-instance"'),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token keyword"},"import"),s(" Taro "),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},'"@tarojs/taro"'),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token keyword"},"import"),s(),n("span",{class:"token punctuation"},"{"),s(" Check"),n("span",{class:"token punctuation"},","),s(" Location2 "),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"from"),s(),n("span",{class:"token string"},'"@nutui/icons-vue-taro"'),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token keyword"},"type"),s(),n("span",{class:"token class-name"},"SimpleAddressDto"),s(),n("span",{class:"token operator"},"="),s(" AddressDto"),n("span",{class:"token punctuation"},"["),n("span",{class:"token string"},'"AddressRepository/SIMPLE_FETCHER"'),n("span",{class:"token punctuation"},"]"),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token generic-function"},[n("span",{class:"token function"},"defineProps"),n("span",{class:"token generic class-name"},[n("span",{class:"token operator"},"<"),n("span",{class:"token punctuation"},"{"),s(" visible"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token builtin"},"boolean"),s(),n("span",{class:"token punctuation"},"}"),n("span",{class:"token operator"},">")])]),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token keyword"},"const"),s(" emit "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token generic-function"},[n("span",{class:"token function"},"defineEmits"),n("span",{class:"token generic class-name"},[n("span",{class:"token operator"},"<"),n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token string-property property"},'"update:visible"'),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"["),s("value"),n("span",{class:"token operator"},":"),s(),n("span",{class:"token builtin"},"boolean"),n("span",{class:"token punctuation"},"]"),n("span",{class:"token punctuation"},";"),s(`
  choose`),n("span",{class:"token operator"},":"),s(),n("span",{class:"token punctuation"},"["),s("address"),n("span",{class:"token operator"},":"),s(" SimpleAddressDto"),n("span",{class:"token punctuation"},"]"),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token operator"},">")])]),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token keyword"},"const"),s(" addressList "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token generic-function"},[n("span",{class:"token function"},"ref"),n("span",{class:"token generic class-name"},[n("span",{class:"token operator"},"<"),s("SimpleAddressDto"),n("span",{class:"token punctuation"},"["),n("span",{class:"token punctuation"},"]"),n("span",{class:"token operator"},">")])]),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"["),n("span",{class:"token punctuation"},"]"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token keyword"},"const"),s(" chosenAddress "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token function"},"ref"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),n("span",{class:"token punctuation"},"}"),s(),n("span",{class:"token keyword"},"as"),s(" SimpleAddressDto"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
Taro`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"useLoad"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
  api`),n("span",{class:"token punctuation"},"."),s("addressController"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"getUserAddress"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"then"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"("),s("res"),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
    addressList`),n("span",{class:"token punctuation"},"."),s("value "),n("span",{class:"token operator"},"="),s(" res"),n("span",{class:"token punctuation"},";"),s(`
    `),n("span",{class:"token keyword"},"if"),s(),n("span",{class:"token punctuation"},"("),s("res"),n("span",{class:"token punctuation"},"."),s("length "),n("span",{class:"token operator"},">"),s(),n("span",{class:"token number"},"0"),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token punctuation"},"{"),s(`
      `),n("span",{class:"token comment"},"// 默认地址会在第一个"),s(`
      chosenAddress`),n("span",{class:"token punctuation"},"."),s("value "),n("span",{class:"token operator"},"="),s(" res"),n("span",{class:"token punctuation"},"["),n("span",{class:"token number"},"0"),n("span",{class:"token punctuation"},"]"),n("span",{class:"token punctuation"},";"),s(`
      `),n("span",{class:"token function"},"emit"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"choose"'),n("span",{class:"token punctuation"},","),s(" res"),n("span",{class:"token punctuation"},"["),n("span",{class:"token number"},"0"),n("span",{class:"token punctuation"},"]"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
    `),n("span",{class:"token punctuation"},"}"),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token keyword"},"const"),s(),n("span",{class:"token function-variable function"},"handleChoose"),s(),n("span",{class:"token operator"},"="),s(),n("span",{class:"token punctuation"},"("),s("address"),n("span",{class:"token operator"},":"),s(" SimpleAddressDto"),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
  chosenAddress`),n("span",{class:"token punctuation"},"."),s("value "),n("span",{class:"token operator"},"="),s(" address"),n("span",{class:"token punctuation"},";"),s(`
  `),n("span",{class:"token function"},"emit"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"update:visible"'),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token boolean"},"false"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
  `),n("span",{class:"token function"},"emit"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"choose"'),n("span",{class:"token punctuation"},","),s(" address"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},";"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),y=n("div",{class:"language-scss line-numbers-mode","data-ext":"scss","data-title":"scss"},[n("pre",{class:"language-scss"},[n("code",null,[n("span",{class:"token selector"},".address-choose "),n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token selector"},".address-wrapper "),n("span",{class:"token punctuation"},"{"),s(`
    `),n("span",{class:"token property"},"margin"),n("span",{class:"token punctuation"},":"),s(" 0 20px"),n("span",{class:"token punctuation"},";"),s(`
    `),n("span",{class:"token property"},"display"),n("span",{class:"token punctuation"},":"),s(" flex"),n("span",{class:"token punctuation"},";"),s(`
    `),n("span",{class:"token property"},"align-items"),n("span",{class:"token punctuation"},":"),s(" center"),n("span",{class:"token punctuation"},";"),s(`
  `),n("span",{class:"token punctuation"},"}"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),w={class:"hint-container info"},A=n("p",{class:"hint-container-title"},"相关信息",-1),x={href:"https://cn.vuejs.org/guide/components/v-model.html",target:"_blank",rel:"noopener noreferrer"},q=n("br",null,null,-1),L=n("code",null,"<address-row/>",-1);function C(E,T){const l=o("Tabs"),p=o("ExternalLinkIcon"),u=o("RouterLink");return r(),k("div",null,[b,c(l,{id:"15",data:[{id:"html"},{id:"ts"},{id:"css"}]},{title0:a(({value:t,isActive:e})=>[s("html")]),title1:a(({value:t,isActive:e})=>[s("ts")]),title2:a(({value:t,isActive:e})=>[s("css")]),tab0:a(({value:t,isActive:e})=>[h,g]),tab1:a(({value:t,isActive:e})=>[f,_]),tab2:a(({value:t,isActive:e})=>[y]),_:1}),n("div",w,[A,n("p",null,[n("a",x,[s("双向绑定"),c(p)]),q,c(u,{to:"/project/qifan-mall/reference/mp/address-row.html"},{default:a(()=>[s("地址展示组件"),L]),_:1})])])])}const S=i(v,[["render",C],["__file","address-choose.html.vue"]]);export{S as default};