import{_ as r}from"./plugin-vue_export-helper-x3n3nnut.js";import{r as t,o as c,c as o,d as n,e,b as i,w as l,a}from"./app-z-rc3cIN.js";const v="/blog/assets/confirm-oxxkrIhu.png",m="/blog/assets/finish-1ex0NLsx.png",u="/blog/assets/img-kEZxdMPM.png",p="/blog/assets/img_1-PwcWGEhj.png",_="/blog/assets/img_2-IF7737D9.png",g="/blog/assets/img_3-3wcitfMs.png",b="/blog/assets/img_4-kcfW_rnp.png",h="/blog/assets/img_5-VYQgCKXY.png",x="/blog/assets/img_6-RYQ0WCN2.png",f={},w=a('<h1 id="手把手教你搭建静态-博客网站" tabindex="-1"><a class="header-anchor" href="#手把手教你搭建静态-博客网站"><span>手把手教你搭建静态/博客网站</span></a></h1><p>在搭建静态网站中，搭建博客是一个很典型的应用场景。我们一般用markdown写好博客内容，通过webpack打包成前端的html，jss，css等其他静态资源。然后我们需要将这些静态资源放到服务器上供他人阅读。本期的教程就是教搭建如何使用Nginx将我们的博客搭建起来。</p><h2 id="宝塔面板" tabindex="-1"><a class="header-anchor" href="#宝塔面板"><span>宝塔面板</span></a></h2><p>宝塔面板是一个很好用的软件管理工具可以帮助你快速的安装各种软件并且可视化的配置这些软件，也包含了一些常用的运维监控。比如防火墙，CPU占用异常，定时任务等。</p><p>如果不使用宝塔面板，你需要手工输入命令安装各类软件，操作起来费时费力并且容易出错，而且需要记住很多Linux的命令，非常复杂。</p><p>使用宝塔后，比如你安装Nginx，Docker，Mysql只需要在软件商店里面点击安装就行了。</p><h3 id="安装宝塔" tabindex="-1"><a class="header-anchor" href="#安装宝塔"><span>安装宝塔</span></a></h3>',7),E={href:"https://www.bt.cn/new/download.html",target:"_blank",rel:"noopener noreferrer"},B=a(`<div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>yum <span class="token function">install</span> <span class="token parameter variable">-y</span> <span class="token function">wget</span> <span class="token operator">&amp;&amp;</span> <span class="token function">wget</span> <span class="token parameter variable">-O</span> install.sh https://download.bt.cn/install/install_6.0.sh <span class="token operator">&amp;&amp;</span> <span class="token function">sh</span> install.sh ed8484bec
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>安装的过程中会询问是否同意安装到/www目录，选择y同意（图1）。</p>`,2),k=n("img",{src:v,width:"500"},null,-1),A=n("p",null,"图 1 确认安装宝塔",-1),y=n("p",null,"安装结束后，会出现以下提示（图2）。复制外网地址，且需要在云服务器的安全组中开放35402（下面有提示，每个人需要开放端口不一样）。打开网站后输入下面的账号密码。",-1),z=n("p",null,"如果你忘记了下面的网址和密码，只需要在服务器上输入bt，再根据提示输入 14 查看面板默认信息，就会出现安装成功后提示的信息。",-1),C=n("img",{src:m,width:"500"},null,-1),$=n("p",null,"图 2 宝塔安装完成",-1),j=n("h3",{id:"安装nginx",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#安装nginx"},[n("span",null,"安装Nginx")])],-1),F=n("p",null,[e("在宝塔面板的左侧菜单中找到软件商店（图3），点击右侧的安装按钮然后选择极速安装等待安装完成。"),n("br"),n("img",{src:u,alt:"img.png",loading:"lazy"})],-1),N=a('<h2 id="nginx" tabindex="-1"><a class="header-anchor" href="#nginx"><span>Nginx</span></a></h2><p>Nginx是我不管自己学习时还是工作后都经常用到的一个服务器，负载均衡，SSL证书，K8S Ingress<br> Controller，反向代理，静态内容缓存，网站搭建等等。作为个人开发者反向代理，网站搭建，SSL证书配置这三个的使用频率是最高的，在工作中上诉的功能都经常会用到。</p><p>那这次我们要讲的网站搭建就是把Nginx当作静态资源服务器，访问nginx的时候它会根据我们配置的规则读取网页html，js，css，等其他图片媒体资源。</p><h3 id="上传静态网站文件" tabindex="-1"><a class="header-anchor" href="#上传静态网站文件"><span>上传静态网站文件</span></a></h3><p>可以看到这是我打包后的博客，你们的目录不必和我的一样，只需要确保你的网站里面有index.html。</p><figure><img src="'+p+'" alt="img_1.png" tabindex="0" loading="lazy"><figcaption>img_1.png</figcaption></figure>',6),D=n("p",null,[e("在宝塔面板的左侧菜单栏中找到"),n("code",null,"文件"),e("菜单，并切换目录到"),n("code",null,"/www/server/nginx/html"),e("。我们在这个目录下新建一个文件夹"),n("code",null,"blog"),e("。")],-1),S=n("figure",null,[n("img",{src:_,alt:"img_2.png",tabindex:"0",loading:"lazy"}),n("figcaption",null,"img_2.png")],-1),q=n("p",null,"点击左上角的上传，上传你网站内容的压缩包，然后解压到blog中，上传完后的目录结构。确保blog下有index.html",-1),I=n("figure",null,[n("img",{src:g,alt:"img_3.png",tabindex:"0",loading:"lazy"}),n("figcaption",null,"img_3.png")],-1),L=a(`<h3 id="nginx配置" tabindex="-1"><a class="header-anchor" href="#nginx配置"><span>nginx配置</span></a></h3><p>我们已经上传完博客，当用户访问我们网站的时候我们希望把博客内容从服务器上读取并返回给用户的浏览器。</p><p>按照（图7）的指示点开nginx的配置文件，我们在<code>http{}</code>下新增一个sever监听80端口，并且匹配<code>/</code>开头的请求，将<code>/</code><br> 后的路径在root目录下查找，查找成功则返回内容。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>server {
  listen 80;
  server_name qifan;
  index index.html index.htm;
  location / {
    root /www/server/nginx/html/blog;
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="`+b+'" alt="img_4.png" tabindex="0" loading="lazy"><figcaption>img_4.png</figcaption></figure>',5),M=a(`<p>完整版的配置文件</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>user  www www;
worker_processes auto;
error_log  /www/wwwlogs/nginx_error.log  crit;
pid        /www/server/nginx/logs/nginx.pid;
worker_rlimit_nofile 51200;

stream {
    log_format tcp_format &#39;$time_local|$remote_addr|$protocol|$status|$bytes_sent|$bytes_received|$session_time|$upstream_addr|$upstream_bytes_sent|$upstream_bytes_received|$upstream_connect_time&#39;;
  
    access_log /www/wwwlogs/tcp-access.log tcp_format;
    error_log /www/wwwlogs/tcp-error.log;
    include /www/server/panel/vhost/nginx/tcp/*.conf;
}

events
    {
        use epoll;
        worker_connections 51200;
        multi_accept on;
    }

http
    {
        include       mime.types;
		#include luawaf.conf;

		include proxy.conf;

        default_type  application/octet-stream;

        server_names_hash_bucket_size 512;
        client_header_buffer_size 32k;
        large_client_header_buffers 4 32k;
        client_max_body_size 50m;

        sendfile   on;
        tcp_nopush on;

        keepalive_timeout 60;

        tcp_nodelay on;

        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
        fastcgi_buffer_size 64k;
        fastcgi_buffers 4 64k;
        fastcgi_busy_buffers_size 128k;
        fastcgi_temp_file_write_size 256k;
		fastcgi_intercept_errors on;

        gzip on;
        gzip_min_length  1k;
        gzip_buffers     4 16k;
        gzip_http_version 1.1;
        gzip_comp_level 2;
        gzip_types     text/plain application/javascript application/x-javascript text/javascript text/css application/xml;
        gzip_vary on;
        gzip_proxied   expired no-cache no-store private auth;
        gzip_disable   &quot;MSIE [1-6]\\.&quot;;

        limit_conn_zone $binary_remote_addr zone=perip:10m;
		limit_conn_zone $server_name zone=perserver:10m;

        server_tokens off;
        access_log off;
# 下面的这个server{}是新增的
server {
  listen 80;
  server_name qifan;
  index index.html index.htm;
  location / {
    root /www/server/nginx/html/blog;
  }
}
server
    {
        listen 888;
        server_name phpmyadmin;
        index index.html index.htm index.php;
        root  /www/server/phpmyadmin;

        #error_page   404   /404.html;
        include enable-php.conf;

        location ~ .*\\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
        }

        location ~ .*\\.(js|css)?$
        {
            expires      12h;
        }

        location ~ /\\.
        {
            deny all;
        }

        access_log  /www/wwwlogs/access.log;
    }
include /www/server/panel/vhost/nginx/*.conf;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),V=n("br",null,null,-1),P={href:"//192.168.0.1/images/logo.jpg%EF%BC%88%E9%BB%98%E8%AE%A480%E7%AB%AF%E5%8F%A3%EF%BC%89%E3%80%82%E5%9B%A0%E4%B8%BA%E6%88%91%E4%BB%AC%E5%9C%A8nginx%E4%B8%AD%E9%85%8D%E7%BD%AE%E4%BA%86server%EF%BC%8C%E5%AE%83%E5%9C%A880%E7%AB%AF%E5%8F%A3%E4%B8%8B%E7%9B%91%E5%90%AC%E3%80%82%E6%89%80%E4%BB%A5%E6%88%91%E4%BB%AC%E9%A6%96%E5%85%88%E6%98%AF%E8%AE%BF%E9%97%AE%E5%88%B0%E4%BA%86nginx%EF%BC%8C%E5%8F%88%E5%9B%A0%E4%B8%BA%E6%88%91%E4%BB%AC%E9%85%8D%E7%BD%AE%E4%BA%86location%E5%8C%B9%E9%85%8D",target:"_blank",rel:"noopener noreferrer"},W=n("code",null,"/",-1),Y=n("br",null,null,-1),K=n("code",null,"/",-1),O=n("code",null,"/www/server/nginx/html/blog",-1),Q=n("br",null,null,-1),G=n("code",null,"/www/server/nginx/html/blog/images/logo.jpg",-1),R=n("p",null,"重启nginx，输入服务器的ip地址。如果访问不到请查看是否开放80端口。",-1),T=n("figure",null,[n("img",{src:h,alt:"img_5.png",tabindex:"0",loading:"lazy"}),n("figcaption",null,"img_5.png")],-1),U=n("figure",null,[n("img",{src:x,alt:"img_6.png",tabindex:"0",loading:"lazy"}),n("figcaption",null,"img_6.png")],-1);function X(Z,H){const d=t("ExternalLinkIcon"),s=t("center");return c(),o("div",null,[w,n("p",null,[e("根据你的系统在"),n("a",E,[e("官网"),i(d)]),e("这边选择对应的脚本。我这边以CentOS7为例子")]),B,i(s,null,{default:l(()=>[k,A]),_:1}),y,z,i(s,null,{default:l(()=>[C,$]),_:1}),j,F,i(s,null,{default:l(()=>[e(" 图 3 安装nginx ")]),_:1}),N,i(s,null,{default:l(()=>[e(" 图 4 待上传的博客 ")]),_:1}),D,S,i(s,null,{default:l(()=>[e(" 图 5 新建blog文件夹 ")]),_:1}),q,I,i(s,null,{default:l(()=>[e(" 图 6 上传博客内容 ")]),_:1}),L,i(s,null,{default:l(()=>[e(" 图 7 修改nginx配置文件 ")]),_:1}),M,n("blockquote",null,[n("p",null,[e("举个例子，假设我的服务器ip地址是，192.168.0.1。我现在访问http:"),V,n("a",P,[e("//192.168.0.1/images/logo.jpg（默认80端口）。因为我们在nginx中配置了server，它在80端口下监听。所以我们首先是访问到了nginx，又因为我们配置了location匹配"),i(d)]),W,Y,e(" 开头的请求，所以所有的请求会被拦截。拦截后nginx将"),K,e("后的路径拼接到root"),O,Q,e(" 上，去服务的目录里面找是否存在该资源。因此我们实际访问的是"),G,e("。")])]),R,T,i(s,null,{default:l(()=>[e(" 图 8 重启nginx ")]),_:1}),U,i(s,null,{default:l(()=>[e(" 图 9 访问效果 ")]),_:1})])}const en=r(f,[["render",X],["__file","index.html.vue"]]);export{en as default};
