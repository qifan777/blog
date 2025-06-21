# 后端基础

## BaseEntity

实体类的通用字段，创建时会填写id，采用的是uuid生成策略。

```java
@MappedSuperclass
public interface BaseEntity extends BaseDateTime {
    @Id
    @GeneratedValue(generatorType = UUIDIdGenerator.class)
    String id();

    @ManyToOne
    @OnDissociate(DissociateAction.SET_NULL)
    User editor();

    @ManyToOne
    @OnDissociate(DissociateAction.SET_NULL)
    User creator();
}
```
### 拦截器

分别在创建时和更新时填充`creator`和`editor`。

```java
@Component
@AllArgsConstructor
public class BaseEntityDraftInterceptor implements DraftInterceptor<BaseEntityDraft> {


    @Override
    public void beforeSave(@NotNull BaseEntityDraft draft, boolean isNew) {
        if (!ImmutableObjects.isLoaded(draft, BaseEntityProps.EDITOR)) {
            draft.applyEditor(user -> {
                user.setId(StpUtil.getLoginIdAsString());
            });
        }
        if (isNew) {

            if (!ImmutableObjects.isLoaded(draft, BaseEntityProps.CREATOR)) {
                draft.applyCreator(user -> {
                    user.setId(StpUtil.getLoginIdAsString());
                });
            }
        }
    }
}
```