import{_ as e}from"./plugin-vue_export-helper-x3n3nnut.js";import{o as i,c as n,a as l}from"./app-5cZR4oor.js";const s={},d=l(`<h1 id="模型设计" tabindex="-1"><a class="header-anchor" href="#模型设计"><span>模型设计</span></a></h1><p>权限管理模型主要分以下几种</p><ul><li>ACL模型：访问控制列表</li><li>DAC 模型：自主访问控制</li><li>MAC 模型：强制访问控制</li><li>ABAC 模型：基于属性的访问控制</li><li>RBAC 模型：基于角色的权限访问控制 <ul><li>RBAC0 模型</li><li>RBAC1 模型</li><li>RBAC2 模型</li><li>RBAC3 模型</li></ul></li></ul><p>在上面的这么多模型中,RBAC这类的模型是应用最广泛的。然后根据系统的复杂度在RBAC0-3中进行选择。RBAC0就已经可以解决大部分小项目的需求了。</p><p>下面的内容就是实现RBAC0权限模型。</p><h2 id="er图" tabindex="-1"><a class="header-anchor" href="#er图"><span>ER图</span></a></h2><div class="language-er line-numbers-mode" data-ext="er" data-title="er"><pre class="language-er"><code>User ||--o{ UserRoleRel : &quot;拥有&quot;
UserRoleRel ||--o{ Role : &quot;被拥有&quot;
Role ||--o{ RoleMenuRel: &quot;拥有&quot;
RoleMenuRel ||--o{ Menu : &quot;被拥有&quot;
User {
    string id PK
}
UserRoleRel { 
    string id PK
    string userId FK &quot;外键关联到user表主键&quot;
    string roleId FK &quot;外键关联到role表主键&quot;
}
Role {
    string id PK
}

RoleMenuRel { 
    string id PK
    string roleId FK &quot;外键关联到role表主键&quot;
    string menuId FK &quot;外键关联到menu表主键&quot;
}
Menu {
    string id PK
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),r=[d];function a(u,o){return i(),n("div",null,r)}const c=e(s,[["render",a],["__file","design.html.vue"]]);export{c as default};
