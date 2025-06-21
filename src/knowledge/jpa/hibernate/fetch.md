---
category:
  - JPA
tag:
  - ORM
  - JPA
  - Hibernate
  - 懒加载
date: 2023-04-01
timeline: true

---

Hibernate中的数据懒加载和提前加载，根据需要可以动态的加载需要的数据。可以说是SQL中select ...

<!-- more -->

# 3. 抓取数据（Fetch）

在查询的时候返回太多的数据对于 JDBC 传输数据和 ResultSet 处理过程都是不必要的开销，抓取太少的数据会导致执行额外的查询语句也降低了执行效率。所以说调节数据抓取的深度和广度对应用的性能影响是是很大的。

## 3.1 基础概念

抓取数据本身的概念可以将抓取数据产生的问题分成两种问题。

- 数据什么时候会被抓取？提前（`EAGER`）还是稍后（`LAZY`）

- 数据应该被怎么抓取

> 提前（eager）：在查询的同时返回所需要的数据
>
> 稍后（lazy）：在需要用到该数据时，再自动调用查询去获取数据。
>
> 如果百分白确定数据是一定是会被使用的，使用eager策略。如果是可能会使用则lazy。



下面有几个范围（scope）用来定义抓取数据的行为

***静态（static）***

静态定义的抓取策略是在数据映射过程执行的，静态策略是在没有动态策略情况下的备用策略。

​    **SELECT**

​ 执行额外的SQL去抓取数据，这种行为可以是 `EAGER`（立即发送一条SQL去抓取数据），也可以是`LAZY`（在数据被访问的时候再发送一条SQL去抓取数据）. 这种策略通常称为 `N+1`。

​    **JOIN**

​ 这种策略是只能是`EAGER`。数据会在通过 OUT JOIN 抓取，所以这种方式只需要执行一条sql语句效率较高。

​    **BATCH**

​ 执行额外的SQL去加载一些相关的数据通过 IN （:ids）来限制。和`SELECT`一样也分为 `EAGER`和`LAZY`

​    **SUBSELECT**

​ 执行额外的SQL加载关联的数据。和`SELECT`一样也分为 `EAGER`和`LAZY`

***动态（dynamic）***

> 动态加载：在运行时选择需要加载的数据

​

​    **fetch profiles**

​ 在实体类的映射上面定义，但是可以在执行查询的时候选择启用或者禁用。

​    **JPQL / Criteria**

​ JPQL 是JPA规范的查询语句 和 JPA Criteria （JPQL的Java版本）都可以在查询的时候指定要抓取的数据。

​    **entity graph**

​ 使用 JPA EntityGraphs

## 3.2 直接抓取和实体查询

要了解直接抓取数据和实体查询在提前地抓（`eagerly`）取关联数据上的区别，可以看下面这个例子。

```java
@Entity(name = "Department")
public static class Department {

	@Id
	private Long id;

	//Getters and setters omitted for brevity
}

@Entity(name = "Employee")
public static class Employee {

	@Id
	private Long id;

	@NaturalId
	private String username;

	@ManyToOne(fetch = FetchType.EAGER)
	private Department department;

	//Getters and setters omitted for brevity
}
```

`Employee`拥有和`Department`的`@ManyToOne`关联并且是提前抓取该关联。

*直接抓取例子*

```java
Employee employee = entityManager.find(Employee.class, 1L);
```

```sql
-- 生成的sql
select
    e.id as id1_1_0_,
    e.department_id as departme3_1_0_,
    e.username as username2_1_0_,
    d.id as id1_0_1_
from
    Employee e
left outer join
    Department d
        on e.department_id=d.id
where
    e.id = 1
```

可以看见，直接抓取通过 out join 加载了关联的数据。原因是因为`Employee`配置了`    @ManyToOne(fetch = FetchType.EAGER)`，意味着需要在查找`Employee`的同时也把`Department`加载出来。

*实体查询例子*

```java
Employee employee = entityManager.createQuery(
		"select e " +
		"from Employee e " +
		"where e.id = :id", Employee.class)
.setParameter("id", 1L)
.getSingleResult();
```

```sql
-- 生成的sql
select
    e.id as id1_1_,
    e.department_id as departme3_1_,
    e.username as username2_1_
from
    Employee e
where
    e.id = 1

select
    d.id as id1_0_0_
from
    Department d
where
    d.id = 1
```

可以看见一共生成了两条sql，原因是在查询的时候没有加载`Department`，而在`Employee`中又配置了它需要`Department`。所以Hibernate通过再生成一条sql查询来保证`@ManyToOne(fetch = FetchType.EAGER)`，同时又不影响第一条的sql语句。

> 上面的例子提醒了我们，如果我们在关联上配置了 `fetch = FetchType.EAGER` 那么我们在写实体查询的时候就要使用`join fetch`去将配置了上诉注解的关联加载出来。要不然就会出现`N+1`的性能问题，生成了额外的查询语句。

## 3.3 不抓取数据

```java
	@Entity(name = "Department")
	public static class Department {

		@Id
		private Long id;

		@OneToMany(mappedBy = "department")
		private List<Employee> employees = new ArrayList<>();

		//Getters and setters omitted for brevity
	}

	@Entity(name = "Employee")
	public static class Employee {

		@Id
		private Long id;

		@NaturalId
		private String username;

		@Column(name = "pswd")
		@ColumnTransformer(
			read = "decrypt('AES', '00', pswd )",
			write = "encrypt('AES', '00', ?)"
		)
		private String password;

		private int accessLevel;

		@ManyToOne(fetch = FetchType.LAZY)
		private Department department;

		@ManyToMany(mappedBy = "employees")
		private List<Project> projects = new ArrayList<>();

		//Getters and setters omitted for brevity
	}

	@Entity(name = "Project")
	public class Project {

		@Id
		private Long id;

		@ManyToMany
		private List<Employee> employees = new ArrayList<>();

		//Getters and setters omitted for brevity
	}
```

对于登录这个场景，我们只需要`Employee`的 username 和 password，并不需要`Project`也不需要`Department`的信息。

针对这种情况，我们可以在关联的上配置`fetch = FetchType.LAZY`，但是我们发现为什么`@ManyToMany`没有配置`fetch = FetchType.LAZY`。那是因为 JPA规定了`@OneToOne` 和`@ManyToOne`默认是`fetch = FetchType.EAGER`，而其他的关联默认是`LAZY`。也可以说，如果关联的是一个集合（Collection），那么这个关系就是懒加载。`@OneToMany`和`@ManyToOne`都是作用在关联实体集合上所以说它们是懒加载。

```java
Employee employee = entityManager.createQuery(
	"select e " +
	"from Employee e " +
	"where " +
	"	e.username = :username and " +
	"	e.password = :password",
	Employee.class)
.setParameter("username", username)
.setParameter("password", password)
.getSingleResult();
```

现在上面的实体查询就不会触发额外的sql语句，只会从`Employee`中获取数据。

## 3.4 动态抓取

第二种场景，页面上需要显示`Employee`的`Projects`，但是不需要显示`Department`。所以我们需要加载`Employee`和它关联的`Projects`

### 3.4.1 通过查询动态抓取

***通过 JPQL 动态抓取***

```java
// left join fetch 取得关联的数据
Employee employee = entityManager.createQuery(
	"select e " +
	"from Employee e " +
	"left join fetch e.projects " +
	"where " +
	"	e.username = :username and " +
	"	e.password = :password",
	Employee.class)
.setParameter("username", username)
.setParameter("password", password)
.getSingleResult();
```

***通过 JPA Criteria动态抓取***

```java
CriteriaBuilder builder = entityManager.getCriteriaBuilder();
CriteriaQuery<Employee> query = builder.createQuery(Employee.class);
Root<Employee> root = query.from(Employee.class);
// fetch 取得 projects数据
root.fetch("projects", JoinType.LEFT);
query.select(root).where(
	builder.and(
		builder.equal(root.get("username"), username),
		builder.equal(root.get("password"), password)
	)
);
Employee employee = entityManager.createQuery(query).getSingleResult();
```

上面两个案例表单意思是一样的，写法不同。都是 JPA 规定的查询语法分表叫`JPQL` 和`Criteria Api `。通过`fetch`可以取得所需的数据，在查询的同时会生成 out join 去加载相关联的数据。通过上面这种方法动态加载，只需要一条sql语句就可以获取所需的数据。

### 3.4.2 通过EntityGraph动态抓取

JPA还支持通过一种叫`EntityGraphs`的特性来动态加载数据。通过这种方式可以更加精细化的来控制加载数据。它有两种模式可以选择

​    **fetch mode**

​ 在`EntityGraph`中指定的所有关系都需要提前加载，没有指定的其他关系在都认为是懒加载。

​    **load graph**

​ 在`EntityGraph`中指定的所有关系都需要提前加载，没有指定的其他关系按照静态（参考3.1）策略。

下面定义一个基础的`EntityGraph`

```java
@Entity(name = "Employee")
@NamedEntityGraph(name = "employee.projects",
	attributeNodes = @NamedAttributeNode("projects")
)
```

```java
// 查询的时候使用EntityGraph
Employee employee = entityManager.find(
	Employee.class,
	userId,
	Collections.singletonMap(
		"jakarta.persistence.fetchgraph",
		entityManager.getEntityGraph("employee.projects")
	)
);
```

> 如果你想对关联的实体类嵌套定义`EntityGraph`可以使用`@NamedSubgraph`。

