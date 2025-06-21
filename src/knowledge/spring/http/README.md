---
sidebar: heading
category:
  - IDEA技巧
tag:
  - HTTP
  - SpringBoot
  - SpringMVC
date: 2021-10-01
timeline: true
---

利用Idea的HttpClient向SpringBoot发起各种请求参数。后端使用`@RequestParam`，`@ModelAttribute`，`@PathVariable`，`@RequestBody`，`@RequestPart`去接收。

<!-- more -->

# HTTP各种参数发送

## 1. spring mvc 中的参数接受之 GET 请求

Get 请求是没有 body 的，参数都是放在 url 上面。
根据在 url 参数格式不同，一共有下面这几种

1. Path Variable
2. Query
3. Matrix Variable（不常用）

## 1.1 path variable

### 1.1.1 使用 `@PathVariable`

```
GET http://localhost:7720/user/find/123/起凡
                                    \ /
                                这里的"123"和"起凡"是参数
```

这种传参格式就如同名字一样"路径变量"，参数在路径上。

针对这种传参方式后端可以这么接受。

```java
    // 在路径中用id占位，代表这个地方将会是参数
    @GetMapping("find/{id}/{username}")
    // 方法上面通过占位名称得到参数
    public R<Boolean> pathVariable(@PathVariable String id, @PathVariable String username) {
        log.info(id);
        log.info(username);
        return R.ok(true);
    }
```

## 1.2 query 传参

### 1.2.1 使用 `@RequestParam`

```
###
GET http://localhost:7720/user/find?username=起凡&password=123456

```

在路径的最后用 "?" 隔开要传输的参数。 通过 "&" 分割多个 `key=value`

```java
    @GetMapping("find")
    // 通过key接受参数
    public R<Boolean> get(@RequestParam String username, @RequestParam String password) {
        log.info(username);
        log.info(password);
        return R.ok(true);
    }
```

### 1.2.2 使用 `@ModelAttribute`

如果现在需要做一个用户搜索功能，前端会传 pageNum（页数）, pageSize（每页大小）, keyword（关键词），startTime（创建日期）。

```
GET http://localhost:7720/user/search?pageNum=1&pageSize=10
&keyword=起凡&startTime=Fri Apr 29 2022 21:16:50
```

使用 `@RequestParam`，我们需要在接口上接受四个参数，这样会显得接口过于庞大，不雅观。

```java
    @GetMapping("search")
    public R<Boolean> search(@RequestParam Integer pageSize, @RequestParam Integer pageNum, @RequestParam String keyword, @RequestParam Date startTime) {

        return R.ok(true);
    }
```

改造一下，我们可以创建一个 SearchDto

```java
@Data
public class SearchDto {
    Integer pageNum;
    Integer pageSize;
    String keyword;
    Date startTime;
}
```

通过 `@ModelAttribute` 就可以接受多个 query 参数

```java
    @GetMapping("search")
    public R<Boolean> search(@ModelAttribute SearchDto searchDto) {
        log.info(searchDto.toString());
        return R.ok(true);
    }
```

### 1.2.3 使用 `@ModelAttribute` 和 `@RequestParam`

刚刚我们做的是用户搜索功能，现在假设我们需要做文章搜索功能。文章搜索的过滤条件比用户搜索多了一个 category（文章类别）。

```
GET http://localhost:7720/article/search?pageNum=1&pageSize=10
&keyword=spring boot&startTime=Fri Apr 29 2022 21:16:50&category=科技
```

这时我们可以再创建一个 ArticleSearchDto 然后继承 SearchDto

```java
@Data
public class ArticleSearchDto extends SearchDto{
    String category;
}
```

然后在文章搜索接口上接受 ArticleSearchDto

```java
    @GetMapping("search")
    public R<Boolean> search(@ModelAttribute ArticleSearchDto searchDto) {
        log.info(searchDto.toString());
        return R.ok(true);
    }
```

但是这样真的方便吗？因为多出一个字段就要再建立一个类，是不是有点麻烦了。我们完全可以把`@ModelAttribute` 和 `@RequestParam`
结合起来使用

```java
    @GetMapping("search")
    // @RequestParam 获取新增的过滤条件
    public R<Boolean> search(@ModelAttribute SearchDto searchDto, @RequestParam String category) {
        log.info(searchDto.toString());
        log.info(category);
        return R.ok(true);
    }
```

## 2. spring mvc 中的参数接受之 POST 请求

POST 请求的参数可以放在 url 上，也可以放在 body 种。
POST 请求的 body 格式大概可以分为两种，

1. 一种是只能传输一个对象
2. 一种是可以传输多个对象。

application/json，application/x-www-form-urlencoded 属于第一种

multipart/form-data 属于第二种。

## 2.1 application/x-www-form-urlencoded 传参

### 2.1.1 `@RequestParam` 和 `@ModelAttribute`

通过上面的例子可以知道，`@RequestParam` 和 `@ModelAttribute`可以获取 query 里面的参数。

实际上这两个注解还可以获取 application/x-www-form-urlencoded 里面的参数。

之前是通过 get 请求进行文章搜索。现在改造一下，前端通过 post 请求进行文章搜索。

```
POST http://localhost:7720/article/search?author=起凡&pageSize=10
Content-Type: application/x-www-form-urlencoded

pageNum=1&keyword=spring boot&startTime=Fri Apr 29 2022 21:16:50&category=科技
```

我特意把 author 和 pageSize 放在 query 里面，看看 springboot 是否能接受到参数。

```java
    @PostMapping("search")
    public R<Boolean> search(@ModelAttribute SearchDto searchDto, @RequestParam String category, @RequestParam String author) {
        log.info(searchDto.toString());
        log.info("category = " + category);
        log.info("author = " + author);
        return R.ok(true);
    }
```

输出结果

```
SearchDto(pageNum=1, pageSize=10, keyword=spring boot, startTime=Fri Apr 29 21:16:50 CST 2022)
category = 科技
author = 起凡
```

结果分析：

1. pageSize 和 pageNum 分别在 query 和 form 里面，但是依然被 `@ModelAttribute` 正确绑定到 SearchDto 的 pageSize 和
   pageNum 属性上。
2. category 和 author 分别在 query 和 form 里面， 但是依然被 `@RequestParam` 正确的获取到。

## 2.2 application/json 传参

### 2.2.1 `@RequestBody` 和 `@RequestParam`

还是上面的文章搜索功能，但是这次前端会把搜索条件用 json 格式发送

```
###
POST http://localhost:7720/article/search?category=科技
Content-Type: application/json
jctoken: bef84c6b-e160-4590-82a9-191f0c8a17fa

{
  "pageNum": 1,
  "pageSize": 10,
  "startTime": "2022-04-29T22:52:00",
  "keyword": "spring boot"
}
```

后台接收

```java
    @PostMapping("search")
    // 通过@RequestParam获取query中的额外参数
    public R<Boolean> search(@RequestBody SearchDto searchDto, @RequestParam String category) {
        log.info(searchDto.toString());
        log.info("category = " + category);
        return R.ok();
    }
```

因为文章搜索多出了 category 这个参数，后端的 SearchDto 中没有这个属性，如果放在 json 里面 `@RequestBody` 就无法接收这个参数。所以把
category 放在 query 中然后通过 `@RequestParam` 接收。

`@RequestBody` 还可以接收嵌套的 json对象，只需要后端创建相应的类就可以了

## 2.3 multipart/form-data

这种格式的 body 有许多 part，每个 part 通过一个分隔符分割。
body 格式如下

```python
## boundary 参数告诉请求接受者，要使用 "aBoundaryString" 对 body 进行分割。
Content-Type: multipart/form-data; boundary=aBoundaryString

## 发送请求时，使用 "aBoundaryString" 进行分割，
## 这个分隔符一定要和上面规定的一样
--aBoundaryString
## name是每一部分的名称，后端可以通过@RequestParam("myFile") 获取到这个部分
Content-Disposition: form-data; name="myFile"; filename="img.jpg"
## 二进制数据的格式是什么
Content-Type: image/jpeg

(二进制数据)
--aBoundaryString
## name是每一部分的名称，后端可以通过@RequestParam("text") 获取到这个部分
Content-Disposition: form-data; name="text"

(二进制文本数据，可以是json，xml，文本)
--aBoundaryString
(more subparts)
## 结尾分割符 需要在末尾加上 "--"
--aBoundaryString--
```

### 2.3.1 `@RequestParam` 单个接受文件

现在前端想要上传一张图片，图片的名称为 123.png，接受参数为 file。

```python
POST http://localhost:7720/test/upload1
Content-Type: multipart/form-data; boundary=起凡分隔符

--起凡分隔符
Content-Disposition: form-data; name="file"; filename="123.png"
Content-Type: image/png

(文件数据)
--起凡分隔符--
```

后端接收

```java
    @PostMapping("upload1")
    public R<Boolean> upload(@RequestParam("file") MultipartFile multipartFile) {
        log.info(multipartFile.getOriginalFilename());
        return R.ok(true);
    }
```

### 2.3.2 `@RequestParam` 接受多个文件

前端现在想批量上传文件，后端应该如何接受呢？

因为文件的数量是不固定的，并且 name
参数也是未知的，后端不能像上面那样以这种方式接收 ` @RequestParam("file1")`，`@RequestParam("file2")` ...

```python
POST http://localhost:7720/test/upload2
Content-Type: multipart/form-data; boundary=起凡分隔符

--起凡分隔符
## name 随机取值
Content-Disposition: form-data; name="asdasdas"; filename="123.png"
Content-Type: image/png

(二进制数据)
--起凡分隔符
## name 随机取值
Content-Disposition: form-data; name="asdasdasssdasdsada"; filename="mytext.txt"
Content-Type: text/plain

(二进制数据)
--起凡分隔符--
```

后端接收

```java
    @PostMapping("upload2")
    public R<Boolean> upload2(@RequestParam Map<String, MultipartFile> multipartFileMap) {
        multipartFileMap.forEach((name, file) -> {
            log.info("name = " + name);
            log.info("filename = " + file.getOriginalFilename());
        });
        return R.ok(true);
    }
```

输出结果

```
name = asdasdas
filename = 123.png
-----------------------
name = asdasdasssdasdsada
filename = mytext.txt
-----------------------
```

分析结果：

后端通一个 map 把前端传过来的参数封装起来，map 的 key 是 name，map 的 value 是文件内容

### 2.3.3 `@RequestPart` 接收 json 和文件

假设前端想要发送一张图片，并且要附上这张图片的描述信息，那后端应该如何接收？

```python
POST http://localhost:7720/test/upload3
Content-Type: multipart/form-data; boundary=起凡分隔符

--起凡分隔符
Content-Disposition: form-data; name="file"; filename="123.png"
Content-Type: image/png

(二进制数据)
--起凡分隔符
Content-Disposition: form-data; name="meta-data";
Content-Type: application/json;

{
  "createTime": "2022-04-29T10:52:00",
  "location" : "福建省 泉州市 华侨大学"
}
--起凡分隔符--
```

后端接收

```java
@Data
public class FileMetaData {
    Date createTime;
    String location;
}

```

```java
    @PostMapping("upload3")
    public R<Boolean> upload3(@RequestPart("file") MultipartFile multipartFile, @RequestPart("meta-data") FileMetaData fileMetaData) {
        log.info("filename = " + multipartFile.getOriginalFilename());
        log.info(fileMetaData.toString());
        return R.ok(true);
    }
```

输出结果

```
filename = 123.png
FileMetaData(createTime=Fri Apr 29 18:52:00 CST 2022, location=福建省 泉州市 华侨大学)
```

结果分析：

1. meta-data 对应的 part 是 json 格式，`@RequestPart` 自动把它变成 FileMetaData。

2. file 对应的 part 是文件，`@RequestPart` 自动把它变成 MultipartFile
