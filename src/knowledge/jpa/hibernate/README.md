---
category:
  - JPA
tag:
  - ORM
  - Hibernate
  - JPA建模
date: 2023-03-01
timeline: true
---

如何使用Hibernate进行Java到数据库的映射。映射完后程序员只需针对Java的对象进行操作就可以实现增删改查。因此如何用Hibernate建模是一个值得深入学习的内容，它主要影响的就是create
table xxx (...)。当然也会影响到增删改查。

<!-- more -->

# 1. 领域模型（Domain Model）

领域顾名思义，它指的是我们实际业务中一的一块业务也就是一个领域。对这个领域建模可能会有好几个相关联的类，他们都属于同一个领域。所以领域模型是比较范的概念，一般来说一个领域模型里面包含一个及以上的实体类（Entity），每个实体类都对应着数据库的一张表。

领域模型是Hibernate的核心，Hibernate的所有功能都是围绕着领域模型。Hibernate提供了许多的注解方便我们来建立领域模型。

## 1.1 Hibernate类型

Hibernate类型的主要功能是联系Java中的对象和数据库中的记录，并且可以将Java对象与数据库的记录互相转换。

我们刚刚说了Hibernate需要在Entity类和数据库表直接做映射，而最直接的一个问题就是数据库中的类型如何与实体类中属性类型相对应。实体类里面可能存在枚举属性，如何映射到数据库？字符串类型如何映射到VARCHAR,CHAR？BigDecimal如何映射到Decimal?

搞清楚Hibernate一共有多少种类型是我们领域建模的最关键的点。

***简单的领域建模例子***

可以看到这个领域内有两张表，那意味着我们有两个实体类。

```sql
-- 联系方式
create table Contact
(
    id      integer not null,
    first   varchar(255),
    last    varchar(255),
    middle  varchar(255),
    notes   varchar(255),
    starred boolean not null,
    website varchar(255),
    primary key (id)
)
-- 地址
create table Address
(
    id         integer not null,
    province   varchar(20),
    city       varchar(20),
    district   varchar(20),
    details    varchar(20),
    contact_id integer not null,
    primary key (id)
)
```

先建立地址实体类，映射到Address表。

```java
@Entity(name = "Address")
@Data
public class Address {

  @Id
  private Long id;

  // @Basic可加可不加。用来标识该字段是基本类型
  private String province;

  private String city;

  private String district;

  private String details;
}
```

再建立联系实体类，在这个类里面关联地址实体类。

同时观察发现 `fitst`, `middle`,`last`都是属于名字这一概念，所以我们可以再创建一个类把这三个字段包装起来，使得语义清晰。

```java
@Entity(name = "Contact")
@Data
public class Contact {

  @Id
  private Integer id;

  // 表明该字段为嵌套类型
  @Embedded
  private Name name;

  private String notes;

  private URL website;

  private boolean starred;

  @OneToOne
  @JoinColumn(name = "address_id")
  private Address address;
}

// 表明该类为嵌套类型
@Embeddable
@Data
class Name {

  // 这边属性名称和表的字段名称不一样，需要手动指定。
  @Column(name = "first")
  private String firstName;
  @Column(name = "middle")
  private String middleName;
  @Column(name = "last")
  private String lastName;
}
```

上述的领域模型可以发现以下这些Hibernate类型

1. 基本类型：`boolean`（Java基础类型）
2. 基本类型 ：`Integer`（Java基础类型包装类）
3. 基本类型：`String`（Java字符串）
4. 嵌套类型：`Name`（Java简单对象（POJO）类，没有实际的表与之相关联）
5. 实体类型：`Address`（Java简单对象（POJO）类，有实际的表与之相关联）

上面的这些Hibernate类型又分为两大类 `值类型`和 `实体类型`

### 1.1.1 值类型(Value Type)

值类型是那些和实体类紧密关联，描述了实体状态的字段。

这些Hibernate类型都属于值类型：

- 基本类型，详细看 1.2。
- 嵌套类型，Java简单对象（POJO）类，没有实际的表与之相关联。需要依附某个实体类型。

  这个类里面又有一些基本类型，如上面的Contact中的Name字段。
- 集合类型，虽然前面没提到，但是偶尔也会用到。

### 1.1.2 实体类型（Entity Type）

实体类型描述了Java简单对象（POJO）类与数据库之间的映射关系。通过 `@Entity`来标识。

当实体作为属性存在在另一个实体对象时，他们只是存在联系，却各自维护自己的状态。如上面的Contact中的address属性。他们是两个实体，却又存在联系。他们各自维护自己的修改和删除。

实体类和Java简单对象（POJO）类最大的区别那就是实体类是由对应的数据库表，而普通java类型没有。

## 1.2 基本类型

与基本类型搭配使用的注解：

> @Basic，@Column，@Id，@Enumerated，@Convert（自定义映射规则）

低频次：

> @Type（自定义hibernate类型），@Lob（二进制数据），@Nationalized（国际化字符串），@Formula（计算字段），@ColumnTransformer（自定义列转化）

下面的表格列出了Java中的哪些类型属于Hibernate的基础类型。

你可以通过 `@Basic`来指定属性类型为基本类型。也可以不添加该注解，上面的领域建模例子就没添加。

| 类别                          | 类型                                             |
|-----------------------------|------------------------------------------------|
| java基本类型                    | boolean, int, double等                          |
| java基本类型包装类                 | Boolean, Integer, Double等                      |
| 字符串                         | String                                         |
| 数字类型                        | BigInteger, BigDecimal                         |
| Java8 date/time (java.time) | LocalDate, LocalTime, LocalDateTime, Instant 等 |
| 不建议使用的date/time(java.util)  | Date 和 Calendar                                |
| 不建议使用的date/time(java.sql)   | Date, Time, Timestamp                          |
| byte数组和char数组               | byte[] 或者 Byte[], char[] 或者Character[]         |
| java 枚举类型                   | 任意的 enum                                       |
| 可序列化的类型                     | 任意实现 java.io.Serializable的类                    |

下面详细介绍上述表格中的部分类型。

### 1.2.1 枚举类型

```java
public enum AddressType {
  LAND_LINE,
  MOBILE;
}
```

***@Enumerated(ORDINAL)***

```java
@Entity(name = "Address")
public static class Address {

  @Id
  private Long id;

  @Column(name = "Address_number")
  private String number;

  @Enumerated(EnumType.ORDINAL)
  @Column(name = "Address_type")
  private AddressType type;
}
```

当我们插入Java对象到数据库时，hibernate生成下面的sql语句。
可以看见 `AddressType.MOBILE` 映射到 `1`。@Enumerated(EnumType.ORDINAL)
指定枚举到数据库的映射规则是按顺序。MOBILE在AddressType中的顺序是1，所以就得到了1。

```java
Address Address=new Address();
Address.setId(1L);
Address.setNumber("123-456-78990");
Address.setType(AddressType.MOBILE);
entityManager.persist(Address)
```

```sql
INSERT INTO Address (Address_number, Address_type, id)
VALUES ('123-456-78990', 1, 1)
```

***@Enumerated(STRING)***

还有一种枚举映射规则是把枚举值变成字符串。

在属性上加上 `@Enumerated(STRING)`

```java
@Enumerated(EnumType.STRING)
@Column(name = "Address_type")
private AddressType type;
```

插入上面的例子到数据库，会生成下面的sql语句

```sql
INSERT INTO Address (Address_number, Address_type, id)
VALUES ('123-456-78990', 'MOBILE', 1)
```

`AddressType.MOBILE`变成了 `'MOBILE'`字符串。

### 1.2.2 Boolean

默认情况下，Java的Boolean映射到数据库的类型是 `BIT`、`TINYINT`。

Hibernate还提供了下面三种内置映射规则

```java
// 把boolean映射成字符 `Y`, `N`
@Basic
@Convert(converter = org.hibernate.type.YesNoConverter.class)
boolean convertedYesNo;

// 把boolean映射成字符 `T`, `F`

@Basic
@Convert(converter = org.hibernate.type.TrueFalseConverter.class)
boolean convertedTrueFalse;

// 把boolean映射成 0，1。（默认就是这个）
@Basic
@Convert(converter = org.hibernate.type.NumericBooleanConverter.class)
boolean convertedNumeric;
```

### 1.2.3 Date/Time

在SQL里面定义了三个标准的日期类型

1. DATE

   存储日历时间，年月日。
2. TIME

   存储小时，分钟，秒
3. TIMESTAMP

   存储DATE和TIME并且还有毫秒，即年月日小时分钟秒毫秒。

***@Temporal***

因为上面三种类型是数据库中的标准类型，如果我们在Java中使用的是 `java.util.Date`
来标识时间，Hibernate不知道应该将 `java.util.Date`映射到三种数据库时间类型中的哪一种。因此我们需要使用 `@Temporal`
来显示的指定映射到哪一个类型。

*映射java.util.Date 到 DATE*

```java
@Temporal(TemporalType.DATE)
private Date timestamp;
```

*映射java.util.Date 到 TIME*

```java
@Temporal(TemporalType.TIME)
private Date timestamp;
```

*映射java.util.Date 到 TIMESTAMP*

```java
@Temporal(TemporalType.TIMESTAMP)
private Date timestamp;
```

同样，如果你使用的是 `java.util.Calendar`，也需要指定映射到哪一种时间类型。

***映射 Java 8 Date/Time***

前面我们提到了在Java中使用 `java.util.Calendar`或者 `java.util.Date`来标识时间时应该如何映射。

如果我们使用的是Java8新增的Date/Time就不需要去指定映射规则了。因为Java8的Date/Time和数据库的三种日期格式刚刚好对应，映射规则如下：

1. DATE

   `java.time.LocalDate`
2. TIME

   `java.time.LocalTime`, `java.time.OffsetTime`
3. TIMESTAMP

   `java.time.Instant`, `java.time.LocalDateTime`, `java.time.OffsetDateTime`, `java.time.ZonedDateTime`

如果我们使用 `LocalDateTime`来标识日期，那将被自动映射到 `TIMESTAMP`。不需要添加 `@Temporal`。使用上述的其他类型同理。

```java
private LocalDateTime timestamp;
```

### 1.2.4 自定义映射规则

```java
public enum UserType {
  User(1, "个人"),
  ENTERPRISE(2, "企业");
  private final Integer code;
  private final String name;

  UserType(Integer code, String name) {
    this.code = code;
    this.name = name;
  }

  public Integer getCode() {
    return code;
  }

  public String getName() {
    return name;
  }

  public static UserType nameOf(String name) {
    return Arrays.stream(UserType.values()).filter(userType -> userType.getName().equals(name))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("枚举不存在"));
  }
}
```

```java
@Entity(name = "user")
@Data
@Accessors(chain = true)
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "id", nullable = false)
  private Long id;

  private String name;

  private LocalDateTime createTime;

  private UserType userType;
}
```

用户拥有用户类型，如果我们希望用户类型这个属性在数据库存储的是 `UserType`的name,例如 `个人`，`企业`这样的字符串，
那我们就需要自定义映射规则。

***@Convert***

编写 `Converter`类，定义两种类型之间的映射规则。我们这边是 `UserType`与 `String`的映射规则。

```java
public class UserTypeConverter implements AttributeConverter<UserType, String> {

  @Override
  public String convertToDatabaseColumn(UserType attribute) {
    return attribute.getName();
  }

  @Override
  public UserType convertToEntityAttribute(String dbData) {
    return UserType.nameOf(dbData);
  }
}
```

在需要映射的字段上添加上 `@Convert`

```java
@Convert(converter = UserTypeConverter.class)
private UserType userType;
```

*测试案例*

```java
User user = new User()
.setName("起凡")
.setCreateTime(LocalDateTime.now())
.setUserType(UserType.User);
// 将UserType.User 转成 字符串
// insert into user (create_time, name, user_type) values (2022-12-04 11:38:46, '起凡', '个人')
userRepository.save(user);

userRepository.findUserByNameIs("起凡")
.ifPresent(res-> {
// 在数据库从字符串变成 UserType.User。
   log.info(res.getUserType()
   .getCode()
   .toString());
// 结果是：1。
});
```

## 1.3 嵌套类型

在前面的领域建模中，我们使用到了值类型中的嵌套类型。嵌套类型一般是对几个实体类都公用的属性进行包装方便复用，或者是几个属性属于同一个概念把它们放到一个类里面使得语义清晰。

> 嵌套类型需要 `@Embeddable`和 `@Embedded`搭配使用
>
> `@Embeddable`表明类本身是一个嵌套类型。
>
> `@Embedded`在实体类中的属性上面标识该属性的类型是嵌套类型。

*简单的嵌套类型案例*

```java
@Entity(name = "Book")
public static class Book {

  @Id
  @GeneratedValue
  private Long id;

  private String title;

  private String author;

  private Publisher publisher;
}

@Embeddable
public static class Publisher {

  @Column(name = "publisher_name")
  private String name;

  @Column(name = "publisher_country")
  private String country;

}
```

```sql
create table Book
(
    id                bigint not null,
    author            varchar(255),
    publisher_country varchar(255),
    publisher_name    varchar(255),
    title             varchar(255),
    primary key (id)
)
```

Publisher嵌套类是Book的一部分。生成sql语句时，可以看见Book表中也有 `publisher_country` `publisher_name`
，而不是再生成一个Publisher表。

## 1.4 实体类型

Hibernate里面实体类有下面几个要求

- 实体类上需要添加 `@Entity`注解
- 实体类必须有一个public或者protected的无参构造器
- 接口和枚举不能成为实体类
- 实体类不能是final，里面的映射字段也不能是final。
- 实体类可以是 抽象类（abstract），实体类可以继承抽象类实体。
- 实体类的每个映射字段都需要有getter/setter

### 1.4.1 映射实体类

定义一个实体类第一件事就是添加 `@Entity(name="选填，默认和类名相同")`
。默认情况实体类的名字和你数据库的表名相同,如果你想指定表名可以使用 `@Table(name="xxx")`。
确定好映射的表名后，你需要确定[主键](#_1-5-主键))并且在主键字段上用 `@Id`
标识，如果是多个主键请参考[组合组件](#_1-5-2-组合主键)。
最后将类中的属性映射到表中的字段，根据属性的类型选择合适的[值类型](#_1-1-1-值类型-value-type)

```java
// 总结，首先查找是否存在@Table(name="Book_1")，若存在则映射到Book_1表。
// 其次，@Entity(name="Book_2")，若@Entity有指定实体类名称，则映射到Book_2表
// 最后，@Entity，若@Entity没有指定名称，则默认映射到类名即Book表。
@Entity
public class Book {

  @Id
  private Long id;

  private String title;

  private String author;

  //Getters and setters are omitted for brevity
}
```

## 1.5 主键

### 1.5.1 简单主键

**@ID**

每个实体类都需要有一个@Id注解来标识注解，或者实体类的父类是 `mapped superclass`且也有@id。

> @Id只能作用在基础类型或者基础类型的包装类 *java.lang.String*; *java.util.Date*; *java.sql.Date*;
> *java.math.BigDecimal*;

**@GeneratedValue**

GeneratedValue提供了生成主键的规范，只能作用于有 `@Id`标识的属性（类型是基本类型）。当插入实体类到数据库时会自动根据策略填充实体类的主键。

GenerationType定义了3种主键生成类型。

```
public enum GenerationType { TABLE, SEQUENCE, IDENTITY, AUTO };
```

1. TABLE

   为每张表生成一张额外的表来记录主键的生成。
2. SEQUENCE

   主键自增（Mysql支持），部分数据库不支持。
3. IDENTITY

   为插入的每条记录生成一个唯一的标识id，数据库层面支持（Oracle，SQL Server），部分数据库不支持（Mysql）。

### 1.5.2 组合主键

*简单的组合主键例子*

```java
@Entity
public class Employee {

  @Id
  long empId;
  String empName;
  // ...
}
```

```java
public class DependentId {

  String name; // 和 Dependent中@Id String name 相对于。必须同类型且同名。
  long emp; // Dependent 中的 emp名字相同。Dependent中的emp用@ManyToOne注解，这边的emp类型必须和Employee的id同类型。 
}

@Entity
// 使用@组合id
@IdClass(DependentId.class)
public class Dependent {

  // 和 DependentId中的name相匹配
  @Id
  String name;

  // 和 DependentId中的emp相匹配
  @Id
  @ManyToOne
  Employee emp;

  // ...
}
```

## 1.6 关联

[GitHub链接](https://github.com/qifan777/JPA-Hibernate-SpringDataJPA)

基本概念：

- 父实体（parent）- 关系反方（inverse（mapped） side）
- 子实体（child）- 关系拥有方（owning side）

:::tip 重点
父实体可以将创建/删除/更新等操作级联触发给子实体。反之则不行。
:::

如何判断父实体和子实体呢？答：通过关系的拥有方来判断。
如何判断谁是关系的拥有方呢？答：通过外键来判断。
如：User拥有多个Address，Address对应一个User。很明显外键user_id是在Address中，那Address就是关系的拥有方，所以它是子实体。关系的反方显然就是User，所以它是父实体。

### @ManyToOne

多对一是最常见的关系，`@ManyToOne`直接映射到数据库的外键，它建立起了子实体和父实体之间的多对一关联。

*@ManyToOne*案例

```java
@Entity
@Accessors(chain = true)
@Table(name = "USER")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class User extends BaseEntity {

  private String nickname;

  private String avatar;

  @Convert(converter = GenderTypeConverter.class)
  private GenderType gender;
}
```

```java
@Entity
@Accessors(chain = true)
@Table(name = "ADDRESS")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Address extends BaseEntity {

  // 门牌号
  private String houseNumber;
  // 地址详情
  private String details;
  // 街道/区
  private String district;
  // 城市
  private String city;
  // 省份
  private String province;
  // 维度
  private Double latitude;
  // 经度
  private Double longitude;
  // 手机号
  private String AddressNumber;
  // 姓名
  private String realName;
  // 地址创建人
  @ManyToOne
  private User user;

}


```

新增Address，需要关已有的User。

```java
  @Test
  public void manyToOneTest() {
    Address address = new Address().setProvince("河南省").setCity("南阳市").setDistrict("方城县")
        .setDetails("友谊路")
        .setHouseNumber("976")
        .setAddressNumber("+86 13686863075")
        .setRealName("罗富财");
    Address address2 = new Address().setProvince("陕西省").setCity("汉中市").setDistrict("城固县")
        .setDetails("丹景山路")
        .setHouseNumber("29")
        .setAddressNumber("+86 13686863075")
        .setRealName("罗富财");
    User user = entityManager.find(User.class, "1");
    address.setUser(user);
    address2.setUser(user);
    entityManager.persist(address);
    entityManager.persist(address2);
  }
```

::: tip

```java
@ManyToOne
private User user;
```

这里的user映射到数据库的user_id（外键），当插入address到数据库时Hibernate会从user对象中获得id值。
:::

### @OneToMany

之前说了User可以关联多个Address。可以使用 `@OneToMany`来管理所有的子实体。 在使用 `@OneToMany`时有两种情况：

- 第一种情况是子实体有 `@ManyToOne`此时建立起的联系bidirectional（双向）.
- 第二种情况是子实体没有 `@ManyToOne`，这种情况 `@OneToMany`建立起的关联是unidirectional（单向）。（建议不要使用这种关联）

需要注意的是，外键只在 `@ManyToOne`的一方，`@OneToMany`的一方不存在外键。

*Bidirectional `@OneToMany`例子*

Bidirectional `@OneToMany` 顾名思义它需要同时存在 `owning side`（子实体@ManyToOne）和 `inverse（mappedBy） side`
（父实体OneToMany）这样才能达成双向关系。

::: tip

```java
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
```

- mappedBy：的意思是子实体通过user属性关联到父实体，这样就可以知道子实体的外键字段是什么。正如我们手写sql一样，如果需要查询User拥有的Address显然需要知道Address里面的外键是什么。

```sql
select * from user t1 left join address t2 on t1.id=t2.user_id --外键 user_id
```

- cascade：CascadeType.ALL就是代表级联触发所有的操作。在关联中只有父实体可以级联更新/删除/创建子实体，反之不行。
- orphanRemoval：的意思是当减少addresses数组后，保存到数据库数据库也会删除掉子实体。参考下面的案例就理解了。

:::

```java
@Entity
@Accessors(chain = true)
@Table(name = "USER")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class User extends BaseEntity {

  // 忽略...

  @OneToMany(mappedBy = "user",cascade = CascadeType.ALL,orphanRemoval = true)
  @ToString.Exclude
  public List<Address> addresses;
}


```

```java
  @Test
  public void oneToMany() {
    deleteAddress();
    User user = entityManager.find(User.class, "1");
    address.setUser(user);
    address2.setUser(user);
    // 增加列表
    user.getAddresses().add(address);
    user.getAddresses().add(address2);
    // 保存user到数据库时会级联创建列表内的address。
    entityManager.persist(user);
  }

  @Test
  public void oneToManyRemove() {
    User user = entityManager.find(User.class, "1");
    List<Address> addresses = user.getAddresses();
    log.info("用户地址数量：{}", addresses);
    // 减少列表
    addresses.remove(0);
    // 保存到数据库时，列表内减少的address会被自动删除。
    entityManager.persist(user);
    user = entityManager.find(User.class, "1");
    addresses = user.getAddresses();
    log.info("用户地址数量：{}", addresses);
  }
```

### @OneToOne

在使用 `@OneToOne`同样有 bidirectional 和 unidirectional 两种情况。

*Unidirectional `@OneToOne`*

下面的User关联了UserPhonePassword，在User并没有 `@OneToOne`。在UserPhonePassword里面 `@OneToOne`映射到了外键id，这种就属于单向关系。

在一对一的关联中，外键放在哪一边比较合适是新手比较少思考的问题。在这个例子里面我的推荐是放在UserPhonePassword，因为UserPhonePassword无法脱离User而存在，所以它适合作为子实体，User做为父实体。

```java
// 忽略其他注解...
@Table(name = "USER_PHONE_PASSWORD")
@Entity
public class UserPhonePassword extends BaseEntity {

  @OneToOne
  // 将user.id映射到this.id
  @MapsId
  // id既是主键又是外键
  @JoinColumn(name = "id")
  @ToString.Exclude
  private User user;
  // 逻辑主键，会建立唯一索引
  @NaturalId
  private String phoneNumber;
  private String password;
}

```

```java
  @Test
  public void oneToOneUnidirectional() {
    User user = new User().setNickname("起凡");
    user.setGender(GenderType.FEMALE);
    entityManager.persist(user);
    UserPhonePassword userPhonePassword = new UserPhonePassword();
    // 单向关联
    userPhonePassword.setUser(user);
    userPhonePassword.setPhoneNumber("13676417778");
    userPhonePassword.setPassword("123456");
    entityManager.persist(userPhonePassword);
  }
```

*Bidirectional @OneToOne*

如果你需要在`User`中显示`UserPhonePassword`那这个时候就需要双向的`@OneToOne`。

在User中新增`@OneToOne`如下。

```java
// 忽略其他注解...
@Entity
@Table(name = "USER")
public class User extends BaseEntity {

  // 忽略其他属性...
  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
  @ToString.Exclude
  private UserPhonePassword phonePassword;

}
```

```java
  @Test
  public void oneToOneBidirectional() {
    User user = new User().setNickname("起凡2");
    user.setGender(GenderType.FEMALE);

    UserPhonePassword userPhonePassword = new UserPhonePassword();
    userPhonePassword.setPhoneNumber("13676417718");
    userPhonePassword.setPassword("123456");

    // 双向联系，彼此依赖
    userPhonePassword.setUser(user);
    user.setPhonePassword(userPhonePassword);

    // 由于父实体User中配置了CascadeType.ALL，在创建User时会级联创建PhonePassword。反之则不行
    entityManager.persist(user);
  }
```

### @ManyToMany

首先不推荐使用@ManyToMany，使用 **@OneToMany+中间表** 实现多对多关联是比较灵活且高效的方式。
如果要使用@ManyToMany推荐使用双向关联。

@JoinTable和@JoinColumn是同一种意思，只有关系的拥有方可以使用，声明是哪一方发起的关联。虽然多对多关联中并没有关系的主动方这一说，但是在JPA里面还是需要从逻辑上定义一个关系的主动方和反方。

::: warning
@ManyToMany中关系的拥有方是父亲实体，与之前的其他关联不一样。这也是我为什么不推荐使用@ManyToMany的原因之一，只有关系的父实体可以操作关系。使用@OneToMany+中间表可以实现两边都是父亲实体，这样双方都能增加减少关联。
:::

```java
// 忽略其他注解...
@Entity
@Table(name = "USER")
public class User extends BaseEntity {
  // 忽略其他字段...
  @JoinTable(name = "USER_ROLE", joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "role_id"))
  @ManyToMany
  @ToString.Exclude
  private Set<Role> roles;
}
// 忽略其他注解...
@Entity
@Table(name = "ROLE")
public class Role extends BaseEntity {

  @Column(nullable = false, length = 20, unique = true)
  @Size(min = 1, max = 20, message = "角色名称不能为空")
  private String name;
  // 关系的反方需要填写mappedBy
  @ManyToMany(mappedBy = "roles")
  @ToString.Exclude
  private Set<User> users;
}
```

```java
  /**
   * 注意：@ManyToMany比较特殊，关系的拥有方是父实体。 为用户关联所有角色
   */
  @Test
  public void manyToManySave() {
    List<Role> roleList = entityManager.createQuery("select r from Role  r", Role.class)
        .getResultList();
    User user = entityManager.find(User.class, "1");
    user.getRoles().addAll(roleList);
    entityManager.persist(user);
  }

  /**
   * 从用户关联的角色删除一个角色
   */
  @Test
  public void manyToManyRemove() {
    User user = entityManager.find(User.class, "1");
    List<Role> roles = user.getRoles().stream().toList();
    user.getRoles().remove(roles.get(0));
    entityManager.persist(user);
  }
```

### @OneToMany+中间表

```java
// 忽略其他注解...
@Entity
@Table(name = "ROLE")
public class Role extends BaseEntity {

  // 忽略其他字段...
  @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, orphanRemoval = true)
  @ToString.Exclude
  private Set<RoleMenuRel> menus;

}
// 忽略其他注解...
@Entity
@Table(name = "ROLE_MENU")
public class RoleMenu extends BaseEntity {
  @ManyToOne
  private Menu menu;
  @ManyToOne
  private Role role;
}
// 忽略其他注解...
@Entity
@Table(name = "MENU")
@DynamicInsert
public class Menu extends BaseEntity {
  @Column(length = 20, nullable = false, unique = true)
  private String name;
  @Column
  @ColumnDefault("0")
  private String parentId;
  @Column
  @ColumnDefault("0")
  private Integer orderNum;
  // 路由路径
  private String path;
  @Convert(converter = MenuTypeConverter.class)
  @Column(nullable = false)
  private MenuType menuType;
  @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL, orphanRemoval = true)
  @Exclude
  private List<RoleMenu> roles;
}
```

```java
  @Test
  public void manyToManyByMiddle() {
    List<Menu> menuList = entityManager.createQuery("select m from Menu m", Menu.class)
        .getResultList();
    Role role = entityManager.find(Role.class, "1");
    for (Menu menu : menuList) {
      entityManager.persist(new RoleMenu().setMenu(menu).setRole(role));
    }
  }

  @Test
  public void manyToManyByMiddleQuery() {
    Role role = entityManager.find(Role.class, "1");
    log.info("角色：{}拥有的菜单数量：{}", role.getName(), role.getMenus().size());
  }
```
