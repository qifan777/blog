---
category:
  - 起凡商城
tag:
  - 权限管理
  - RBAC模型
order: 0
date: 2024-01-15
timeline: true
---
# 模型设计

权限管理模型主要分以下几种

- ACL模型：访问控制列表
- DAC 模型：自主访问控制
- MAC 模型：强制访问控制
- ABAC 模型：基于属性的访问控制
- RBAC 模型：基于角色的权限访问控制
  - RBAC0 模型
  - RBAC1 模型
  - RBAC2 模型
  - RBAC3 模型

在上面的这么多模型中,RBAC这类的模型是应用最广泛的。然后根据系统的复杂度在RBAC0-3中进行选择。RBAC0就已经可以解决大部分小项目的需求了。

下面的内容就是实现RBAC0权限模型。

## ER图

```er 用户权限ER图
User ||--o{ UserRoleRel : "拥有"
UserRoleRel ||--o{ Role : "被拥有"
Role ||--o{ RoleMenuRel: "拥有"
RoleMenuRel ||--o{ Menu : "被拥有"
User {
    string id PK
}
UserRoleRel { 
    string id PK
    string userId FK "外键关联到user表主键"
    string roleId FK "外键关联到role表主键"
}
Role {
    string id PK
}

RoleMenuRel { 
    string id PK
    string roleId FK "外键关联到role表主键"
    string menuId FK "外键关联到menu表主键"
}
Menu {
    string id PK
}
```
