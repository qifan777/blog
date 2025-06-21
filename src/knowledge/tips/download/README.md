---
title: SpringBoot+Axios文件下载
---

@slidestart

<!-- slide1 -->
<!-- # SpringBoot+Axios文件下载 -->

<!-- ![文件下载](/assets/images/knowledge/tips/download/image.png) -->
```java
  @SneakyThrows
  public ResponseEntity<byte[]> download() {
    try (FileInputStream fileInputStream = new FileInputStream(
        "C:\\Users\\a1507\\Desktop\\远程开发.png")) {
      byte[] bytes = fileInputStream.readAllBytes();
      return ResponseEntity.ok(bytes);
    }
  }
```

```ts
import axios from 'axios'
axios.get('/mall-api/download', { responseType: 'blob' }).then((res) => {
  const url = window.URL.createObjectURL(res.data)
  const link = document.createElement('a')
  link.href = url
  link.download = 'test.jpg' // 设置文件名
  document.body.appendChild(link) // 一定要添加到DOM中
  // 触发点击下载
  link.click()
  // 下载完成后清理
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
})
```

---

后端返回二进制流
--

<!-- slide2 -->
1. `@SneakyThrows` 不想处理的异常可以使用`@SneakyThrows`，它可以让你不使用`throws`也能抛出异常

```java [1]
  @SneakyThrows
  public ResponseEntity<byte[]> download() {
    try (FileInputStream fileInputStream = new FileInputStream(
        "C:\\Users\\a1507\\Desktop\\远程开发.png")) {
      byte[] bytes = fileInputStream.readAllBytes();
      return ResponseEntity.ok(bytes);
    }
  }
```

--

2. `byte[]` 返回文件的二进制数组

```java [2]
  @SneakyThrows
  public byte[] download() {
    try (FileInputStream fileInputStream = new FileInputStream(
        "C:\\Users\\a1507\\Desktop\\远程开发.png")) {
      byte[] bytes = fileInputStream.readAllBytes();
      return bytes;
    }
  }
```

--

3. `try-with-resources`在传统的 try-catch-finally 结构中，通常需要在 finally 块中手动关闭这些资源以避免资源泄露。 而使用 try-with-resources 结构后，编译器会在 try 语句块结束时自动调用资源对象的 close() 方法来释放资源。

```java [3-4]
  @SneakyThrows
  public byte[] download() {
    try (FileInputStream fileInputStream = new FileInputStream(
        "C:\\Users\\a1507\\Desktop\\远程开发.png")) {
      byte[] bytes = fileInputStream.readAllBytes();
      return bytes;
    }
  }
```

--

4. FileInputStream读取文件，读取二进制数组。

```java [5]
  @SneakyThrows
  public byte[] download() {
    try (FileInputStream fileInputStream = new FileInputStream(
        "C:\\Users\\a1507\\Desktop\\远程开发.png")) {
      byte[] bytes = fileInputStream.readAllBytes();
      return bytes;
    }
  }
```

<!-- slide3 -->

---

前端获取二进制流并下载
--

1. 由于后端返回的是二进制流，需要指定`responseType: 'blob'`，否则axios会解析成`string`。

```ts [2]
import axios from 'axios'
axios.get('/mall-api/download', { responseType: 'blob' }).then((res) => {
  const url = window.URL.createObjectURL(res.data)
  const link = document.createElement('a')
  link.href = url
  link.download = 'test.jpg' // 设置文件名
  document.body.appendChild(link) // 一定要添加到DOM中
  // 触发点击下载
  link.click()
  // 下载完成后清理
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
})
```

--

2. 将blog转成url并赋值给`<a href="url"/>`标签的href属性

```ts [3-5]
import axios from 'axios'
axios.get('/mall-api/download', { responseType: 'blob' }).then((res) => {
  const url = window.URL.createObjectURL(res.data)
  const link = document.createElement('a')
  link.href = url
  link.download = 'test.jpg' // 设置文件名
  document.body.appendChild(link) // 一定要添加到DOM中
  // 触发点击下载
  link.click()
  // 下载完成后清理
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
})
```

--

3. 设置文件名并将`<a/>`标签添加到页面(dom)中

```ts [6-7]
import axios from 'axios'
axios.get('/mall-api/download', { responseType: 'blob' }).then((res) => {
  const url = window.URL.createObjectURL(res.data)
  const link = document.createElement('a')
  link.href = url
  link.download = 'test.jpg' // 设置文件名
  document.body.appendChild(link) // 一定要添加到DOM中
  // 触发点击下载
  link.click()
  // 下载完成后清理
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
})
```

--

4. 最后模拟鼠标点击`<a/>`标签下载文件，并删除

```ts [8-11]
import axios from 'axios'
axios.get('/mall-api/download', { responseType: 'blob' }).then((res) => {
  const url = window.URL.createObjectURL(res.data)
  const link = document.createElement('a')
  link.href = url
  link.download = 'test.jpg' // 设置文件名
  document.body.appendChild(link) // 一定要添加到DOM中
  link.click()   // 触发点击下载
  // 下载完成后清理
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
})
```
<!-- slide3 -->
@slideend
