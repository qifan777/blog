---
order: 5
---
# 图片理解

## 模型配置

选择支持图片理解的模型

```yml
    dash-scope:
      api-key: xxx
      chat:
        options:
          model: qwen-vl-max-latest
          # 图片理解需要开启  multi-model
          multi-model: true
```

## 图片上传

### 依赖引用

我自己封装了一下阿里云、腾讯云、本地nginx的OSS上传starter

```xml
<dependency>
    <groupId>io.github.qifan777</groupId>
    <artifactId>spring-boot-starter-oss</artifactId>
</dependency>

```

### OSS配置

```yml
oss:
  provider: ali_yun
  # 阿里云oss配置
  ali-yun:
    access-key-id: xxx
    access-key-secret: xxx
    endpoint: oss-cn-qingdao.aliyuncs.com
    bucket-name: my-community
  # 腾讯云oss配置
  tencent:
    bucket: wechat-aaa
    secret-id: xxx
    secret-key: xxx
    region: ap-beijing
```

### 图片上传Controller

接收前端图片，返回url

```java
@RestController
@RequestMapping("oss")
@AllArgsConstructor
public class OSSController {
    private final OSSService ossService;

    @PostMapping("upload")
    public String upload(@RequestParam MultipartFile file) {
        return ossService.upload(file);
    }
}
```

### 前端上传

使用`image-upload`组件，可以快速上传图片

```html
<image-upload class="image" :size="40" v-model="message.image"></image-upload>
```

## 发送媒体（图片）消息

请参考[发送消息](./basic/chat.md)，在用户发送消息时，判断是否有图片，如果有，则添加到`medias`中。

```js
  // 图片/语音
  const medias: AiMessage['medias'] = []
  if (message.image) {
    medias.push({ type: 'image', data: message.image })
  }
```

SpringAI的`UserMessage`支持发送媒体对象，因此只需将接收的`medias`添加的`UserMessage`即可。

```java
    public void toPrompt(ChatClient.PromptUserSpec promptUserSpec, AiMessageInput input) {
        // AiMessageInput转成Message
        Message message = AiMessageChatMemory.toSpringAiMessage(input.toEntity());
        if (!CollectionUtils.isEmpty(message.getMedia())) {
            // 用户发送的图片/语言
            Media[] medias = new Media[message.getMedia().size()];
            promptUserSpec.media(message.getMedia().toArray(medias));
        }
        // 用户发送的文本
        promptUserSpec.text(message.getContent());
    }

```
