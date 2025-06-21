---
category:
  - SpringMVC
date: 2024-02-26
timeline: true
---

# API(Controller层)

## @Controller

在SpringMVC中 Controller层可以提供WEB服务，返回视图结果（ViewResult）、JSON、重定向等，通常用来渲染完整的HTML页面或者片段。

## @RestController

针对专门提供JSON的WEB服务，可以使用SpringMVC提供的RESTful风格的Controller即@RestController，也就是人们常说的API。

## @RequestMapping(GetMapping/PostMapping/PutMapping/DeleteMapping等)

既可以应用在类级别也可以应用在方法级别

- 在类级别上代表的是所有方法的路径都加上前缀。
- 在方法级别上用于映射HTTP请求到相应的处理方法上。
- 可以指定请求的路径、HTTP方法（GET, POST等）、以及请求参数约束等。

## @RequestParam

`@RequestParam` 注解在 Spring MVC 及 Spring Boot 应用程序中主要用于从不同的HTTP请求方法（GET、POST等）的请求参数中获取参数值。具体来说，它可以：

1. **从URL查询字符串** 中获取参数，对于GET请求尤其常见，例如：

   ```text
   GET /api/users?name=John&age=30
   ```

   在后端控制器方法中可以通过 `@RequestParam("name") String name` 来获取 "John"。

2. **从POST表单数据** 中获取参数，特别是当Content-Type设置为`application/x-www-form-urlencoded`时：

   ```text
   POST /api/users
   Content-Type: application/x-www-form-urlencoded
   name=John&age=30
   ```

3. 对于 `multipart/form-data` 类型的请求，虽然通常用于文件上传，但也包含非文件字段，这些字段也可以通过 `@RequestParam` 获取。

因此，`@RequestParam` 主要作用于标准HTTP请求中的查询字符串或编码为 `x-www-form-urlencoded` 格式的请求主体内容。而对于JSON或者其他复杂格式的数据，通常需要使用 `@RequestBody` 注解来处理。

## @RequestBody

Spring会利用HttpMessageConverter接口实现类（如MappingJackson2HttpMessageConverter）将HTTP请求体中的JSON或XML数据转换为Java对象，并将其注入到标记了@RequestBody的方法参数中。

```java
@PostMapping("/users")
public User createUser(@RequestBody User user) {
    // 将HTTP请求体中的JSON或XML数据反序列化为User对象
    // 然后在此处对User对象进行业务逻辑处理...
}
```

## @Validate 和 @Valid
