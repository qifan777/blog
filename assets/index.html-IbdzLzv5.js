import{_ as a}from"./plugin-vue_export-helper-x3n3nnut.js";import{r as d,o as c,c as r,b as n,w as s,d as e,e as l,a as t}from"./app-5cZR4oor.js";const p="/blog/assets/cicd-jjBr3VCi.jpg",u="/blog/assets/img-hbugW5SI.png",_="/blog/assets/img_1-tAmdusA-.png",g="/blog/assets/img_2-UAZ4CQw1.png",h="/blog/assets/img_3-Qac2SyqM.png",m="/blog/assets/img_4-RuaD4U_y.png",v="/blog/assets/img_5-ijZYTG7z.png",b="/blog/assets/img_6-7ZzuNXhT.png",f="/blog/assets/img_7-DIfkSMSh.png",x="/blog/assets/img_8-_RCB2INK.png",k="/blog/assets/img_9-UsN0px__.png",S="/blog/assets/img_11--Bb40vHg.png",D="/blog/assets/img_10-sLfNPRNJ.png",C={},w=e("h1",{id:"工作必用的jenkins",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#工作必用的jenkins"},[e("span",null,"工作必用的Jenkins")])],-1),q=e("p",null,"Jenkins是一个可扩展的自动化服务器，Jenkins 可以作为一个简单的 CI 服务器使用，或者成为任何项目的持续交付中心。",-1),P=e("h2",{id:"ci-cd",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#ci-cd"},[e("span",null,"CI/CD")])],-1),j=e("img",{alt:"img.png",src:p},null,-1),I=e("p",null,"图0 CI/CD概念图",-1),N=t('<p>通过上面这张图可以分三部分来理解CI/CD</p><ul><li><strong>第一部分</strong></li></ul><p>先看看软件开发生命周期（SDLC）和CI/CD是如何结合的。软件开发一般包含几个重要的阶段：开发（Develop），测试（Test），部署（Deploy），维护（Maintain）。CI/CD可以将上述的流程流程串联一起来形成一个自动化的闭环，使得每次发布都更快更可靠。</p><ul><li><strong>第二部分</strong></li></ul><p>Continuous Integration(CI) 持续集成会不断的监听仓库并且执行构建测试确保最后合并到发布分支是没问题的。这样可以提早的发现问题，而不是累计了多次提交等合并到发布分支的时候才发现问题，这样回滚的时候会比较麻烦。</p><p>Continuous Delivery(CD) 持续交付主要是在部署方面的自动化，它也会运行一些测试，每次发布分支有更新CD就会把CI构建好的代码部署到生产上。</p><ul><li><strong>第三部分</strong></li></ul><p>总结一下整体的流程可以有如下步骤</p><ul><li>开发者提交代码到参考</li><li>CI 服务器检测到代码更新触发构建</li><li>构建好代码并且测试</li><li>生成测试结果报告</li><li>部署打包的代码到模拟环境</li><li>后续可能会有模拟环境的测试</li><li>最后发布到生成环境</li></ul><p>那CI/CD是如何工作的呢？它其实不神秘，你把它看成一个软件（Jenkins），它可以运行在你的电脑上也可以单独运行在服务器上。它首先会监听你的代码仓库，每次有代码提交到仓库上它就会开始运转第一部分的流程图，先是把代码拉取下来在本地编译（Jenkins所在的机器）和测试(<br> 测试环境)。然后用前端的自动化测试模拟用户点击（e2e<br> test），这步通过后就可以部署到模拟环境（Staging）或者生成环境（Production）。如果出现了问题就会通知开发者，开发者根据报错日志修改bug并且提交代码，接着又重复上述的流程。</p><h2 id="jenkins安装" tabindex="-1"><a class="header-anchor" href="#jenkins安装"><span>Jenkins安装</span></a></h2><p>本教程以windows为例安装jenkins，其他系统请参照官方文档。</p>',12),J=e("br",null,null,-1),B={href:"https://www.jenkins.io/doc/book/installing/windows/",target:"_blank",rel:"noopener noreferrer"},y=e("br",null,null,-1),H={href:"https://www.jenkins.io/download/#downloading-jenkins",target:"_blank",rel:"noopener noreferrer"},T=e("p",null,"打开安装包链接出现图1网页，再点击Windows即可下载。",-1),G=e("img",{alt:"img.png",src:u},null,-1),M=e("p",null,"图1 下载Jenkins Windows安装包",-1),V=e("ul",null,[e("li",null,"第二步")],-1),L=e("p",null,"按照提示走到这边。在这边输入你windows的用户名和密码。然后点击验证凭证。",-1),W=e("img",{alt:"img_1.png",src:_},null,-1),A=e("p",null,"图2 以本地用户运行",-1),E=t("<p>如果出错请按照以下步骤添加权限</p><ol><li>打开开始，输入<code>本地安全策略</code></li><li>展开<code>本地策略</code>并点击右侧的<code>用户权限分配</code></li><li>在右侧面板中找到<code>作为服务登录</code>，右键-&gt;属性</li><li>点击<code>添加用户或组</code></li><li>在输入框内输入你的Windows用户名，然后点击<code>检查名称</code>再点击确定。</li></ol>",2),R=e("img",{alt:"img_1.png",src:g},null,-1),U=e("p",null,"图3 为用户添加作为服务登录权限",-1),Z=e("ul",null,[e("li",null,"第三步")],-1),z=e("p",null,"在选择好端口和jdk路径后就安装结束了。安装成功后在任务管理器的服务中可以看见Jenkins服务",-1),Q=e("img",{alt:"img_1.png",src:h},null,-1),F=e("p",null,"图4 安装成功查看Jenkins服务",-1),K=e("ul",null,[e("li",null,"第四步")],-1),O=e("p",null,[l("在浏览器中打开"),e("code",null,"http://localhost:8080"),l("，如果你是安装时选择的端口号不是8080那替换成你选择的端口。打开后出现图5页面，根据红色的提示路径获取初始密码（图6）")],-1),X=e("img",{alt:"img_1.png",src:m},null,-1),Y=e("p",null,"图5 输入初始密码",-1),$=e("img",{alt:"img_1.png",src:v},null,-1),ee=e("p",null,"图6 初始密码",-1),ne=t('<ul><li>第五步</li></ul><p>安装推荐的插件，并且创建一个用户。</p><h2 id="博客ci-cd案例" tabindex="-1"><a class="header-anchor" href="#博客ci-cd案例"><span>博客CI/CD案例</span></a></h2><p>以前我每次写完博客需要自己编译打包部署。有时候部署完后发现格式或者内容出了一些问题又要重新打包部署，每次重复的干这些事显然是很枯燥无味的。使用Jenkins编写pipeline就可以帮助我完成这些重复的工作。</p><h3 id="安装插件" tabindex="-1"><a class="header-anchor" href="#安装插件"><span>安装插件</span></a></h3><p>除了安装推荐的插件之外还需要安装下面两个插件</p><ul><li><code>Publish Over SSH</code> 用于发送构建好的文件到服务器</li><li><code>NodeJS Plugin</code> 管理不同版本的Node.js</li></ul><h3 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h3><ul><li><strong>配置服务器信息</strong></li></ul><p><code>Dashboard-&gt; Manage Jenkins-&gt; System -&gt; Publish over SSH -&gt; 新增SSH Server</code></p>',10),ie=e("img",{alt:"img_1.png",src:b},null,-1),se=e("p",null,"图7 配置服务信息",-1),le=e("ul",null,[e("li",null,[e("strong",null,"配置Node.js")])],-1),te=e("p",null,[e("code",null,"Dashboard-> Manage Jenkins-> Tools -> NodeJS -> 新增NodeJS")],-1),oe=e("img",{alt:"img_1.png",src:f},null,-1),de=e("p",null,"图8 nodejs配置",-1),ae=e("h3",{id:"新建pipeline项目",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#新建pipeline项目"},[e("span",null,"新建Pipeline项目")])],-1),ce=e("p",null,[e("code",null,"Dashboard -> 新建Item -> Pipeline")],-1),re=e("img",{alt:"img_1.png",src:x},null,-1),pe=e("p",null,"图9 新建pipeline项目",-1),ue=t(`<h3 id="编写pipeline" tabindex="-1"><a class="header-anchor" href="#编写pipeline"><span>编写Pipeline</span></a></h3><p><code>Dashboard -&gt; qifan-blog(你的项目) -&gt; 配置</code></p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>pipeline {
    agent any
    // 选择node 16
    tools {
      nodejs &#39;node 16&#39;
    }
   // 将整个构建部署分成三个阶段，整个分成几个阶段没有一个标准，全部合成一个阶段也可以。
   // 分成多个阶段的好处的优点有 1. 逻辑清晰 2. 对于大项目如果其中某个阶段失败了，下次可以从失败的地方再运行。已经成功的阶段就不需要运行了。可以节省时间。3. 方便统计每个阶段的运行时间，好定位问题。
    stages {
        // 从git参考获取代码
        stage(&#39;Git Checkout&#39;) {
            steps {
              // 从github获取代码，这边使用的是你本机的git。相当于你自己执行了git clone https://github.com/qifan777/qifan-blog-vuepress2.git
              // git checkout master
              git branch: &#39;master&#39;, url: &#39;https://github.com/qifan777/qifan-blog-vuepress2.git&#39;
            }
        }
        // 获取代码后在node16上构建博客代码
        stage(&#39;Build&#39;) {
            steps {
                bat &quot;node -v&quot;
                bat &quot;npm install&quot;
                bat &quot;npm run docs:build&quot;
            }
        }
        // 将构建好的博客上传到服务器上
        stage(&#39;SSH Punlisher&#39;) {
            steps{
                sshPublisher(publishers: [sshPublisherDesc(configName: &#39;centos7&#39;,
                 transfers: [sshTransfer( execCommand: &#39;nginx -s reopen&#39;,
                 remoteDirectory: &#39;/www/server/nginx/html/blog&#39;,
                 removePrefix: &#39;docs/.vuepress/dist&#39;,
                  sourceFiles: &#39;docs/.vuepress/dist/**&#39;)])])
            }
        }
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>点击保存</p><h3 id="构建pipeline" tabindex="-1"><a class="header-anchor" href="#构建pipeline"><span>构建Pipeline</span></a></h3><p><code>Dashboard -&gt; qifan-blog(你的项目) -&gt; Build Now</code></p>`,6),_e=e("img",{alt:"img_1.png",src:k},null,-1),ge=e("p",null,"图10 查看构建详情",-1),he=t('<h2 id="pipeline介绍" tabindex="-1"><a class="header-anchor" href="#pipeline介绍"><span>Pipeline介绍</span></a></h2><h3 id="概念介绍" tabindex="-1"><a class="header-anchor" href="#概念介绍"><span>概念介绍</span></a></h3><p>pipeline流水线以<code>pipeline {}</code>开始，<code>pipeline{}</code>下可以包含<code>Sections</code>,<code>Steps</code>,<code>Directives</code>, 赋值语句。</p>',3),me=e("img",{alt:"img_1.png",src:S},null,-1),ve=e("p",null,"图11 pipeline基本概念",-1),be=e("img",{alt:"img_1.png",src:D},null,-1),fe=e("p",null,"图12 pipeline结构图",-1),xe=t(`<p>通过上面的例子相信大家对pipeline有了初步的了解。</p><p>我们看图11中pipeline启动的方式可以是监听git仓库，每次git仓库有代码推送就会自动启动pipeline。前面的例子中我们是手动点击<code>Build Now</code><br> 启动Pipeline的。</p><p>在观察图中有多个Stage，对照我们之前写的例子其中有<code>Git Checkout</code>,<code>Build</code>和<code>SSH Punlisher</code><br> 三个Stage。Stage的作用就是将整个构建部署流程从逻辑上划分成多个阶段。</p><p>每个阶段（Stage）中又可以添加<code>Steps</code>，在<code>Steps</code>下可以添加<code>Directives</code>。我们看一下之前例子中的<code>Build</code>阶段，该阶段下有一个<br><code>Steps</code>其中包含了三条<code>Directives</code>。在同一个<code>Steps</code>下的指令是可以共享局部变量，比如你可以在<code>Steps</code>中顶一个变量<code>def count=1</code>，下面的指令都可以使用count变量。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>steps {
    bat &quot;node -v&quot;
    bat &quot;npm install&quot;
    bat &quot;npm run docs:build&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="如何编写pipeline" tabindex="-1"><a class="header-anchor" href="#如何编写pipeline"><span>如何编写Pipeline</span></a></h3><p>一般分如下几个步骤</p><ol><li>确定Pipeline运行的<code>agent（机器/环境）</code></li></ol><p>如果是本机直接填写<code>agent: any</code>，还可以运行在docker，其他服务器，k8s上。可以参考官方文档中的<code>agent</code>参数。</p><ol start="2"><li>配置需要工具</li></ol><p>如果你安装了git，maven插件，下面你tools你也可以添加。其他的工具也可以在插件市场中找到，安装完插件配置工具的版本，然后在<code>tools{}</code><br> 中选择相应的版本。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code> tools {
    nodejs &#39;node 16&#39;
    git &#39;配置的git版本&#39;
    maven &#39;配置的maven版本&#39;
 }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>划分stage</li></ol><p>参考我写的例子</p><ol start="4"><li>在每个stage中使用指令(Directives)</li></ol><p>编写指令的时候，如果你不知道如何使用指令可以参考这个指令生成器和片段生成器。<br> 指令生成器生成（Declarative Directive<br> Generator）的是官方提供的语法，片段生成器可以生成你下载的插件指令。比如之前写的例子中<code>tools</code>,<code>bat</code><br> 就是官方的指令，<code>git</code>,<code>sshPublisher</code>就是我安装的插件提供的指令。</p><p><code>Dashboard -&gt; qifan-blog(你的项目) -&gt; 流水线语法 -&gt; Declarative Directive Generator</code></p><p><code>Dashboard -&gt; qifan-blog(你的项目) -&gt; 流水线语法 -&gt; 片段生成器</code></p>`,18);function ke(Se,De){const i=d("center"),o=d("ExternalLinkIcon");return c(),r("div",null,[w,q,P,n(i,null,{default:s(()=>[j,I]),_:1}),N,e("ul",null,[e("li",null,[l("第一步"),J,l(" 在"),e("a",B,[l("官网"),n(o)]),y,l(" 下载"),e("a",H,[l("安装包"),n(o)])])]),T,n(i,null,{default:s(()=>[G,M]),_:1}),V,L,n(i,null,{default:s(()=>[W,A]),_:1}),E,n(i,null,{default:s(()=>[R,U]),_:1}),Z,z,n(i,null,{default:s(()=>[Q,F]),_:1}),K,O,n(i,null,{default:s(()=>[X,Y]),_:1}),n(i,null,{default:s(()=>[$,ee]),_:1}),ne,n(i,null,{default:s(()=>[ie,se]),_:1}),le,te,n(i,null,{default:s(()=>[oe,de]),_:1}),ae,ce,n(i,null,{default:s(()=>[re,pe]),_:1}),ue,n(i,null,{default:s(()=>[_e,ge]),_:1}),he,n(i,null,{default:s(()=>[me,ve]),_:1}),n(i,null,{default:s(()=>[be,fe]),_:1}),xe])}const qe=a(C,[["render",ke],["__file","index.html.vue"]]);export{qe as default};
