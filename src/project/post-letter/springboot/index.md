



## 技术栈

- `sa-token` 权限认证框架
- `mybati-plus`
- `springboot`
- `mysql`
- `redis`
- `rabbitmq`

## 项目运行

### 环境要求

redis，mysql5.7以上，rabbitmq3.8（需要启动延迟消息插件）

建议rabbitmq通过以下命令安装，不要手动安装

```shell
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=root -e RABBITMQ_DEFAULT_PASS=123456 -v rabbitmq-data:/var/lib/rabbitmq circleci/rabbitmq-delayed:3.8.9-management-38
```

### 环境配置

#### 1. 修改数据库密码

修改admin/src/main/resources/application-dev.yml

#### 2. 配置阿里云oss

修改admin/src/main/resources/application.yml

要改成你自己的阿里云oss
最终格式如下：

```yaml
oss:
  endpoint: https://oss-cn-beijing.aliyuncs.com
  accessKeyId: LTAI5t6DcTaSUFLSX6YwBGxx
  accessKeySecret: eiUTDvGwCg11GR118njEXjIoSX2fi9
  bucketName: letter-post
```

#### 3. 配置微信支付信息和小程序信息

修改admin/src/main/resources/application-dev.yml

需要在微信支付后台生成的配置信息如下：

`apiclient_key`, `apiclient_cert.pem`, `apiclient_cert.p12`,`api-key3`

最终格式如下，

```yaml
wechat:
  api-key: ""
  app-id: "wxe6cas450d2dff083"
  app-secret: "69f493f6dec2a6agc5ebh1l37821919d"
  mch-id: "1619421445"
  key-path: "apiclient_key.pem"
  cert-path: "apiclient_cert.pem"
  cert-p12-path: "apiclient_cert.p12"
  api-key3: "kklcklaxjiijjjkjkjlkjsuhauy4abcd"
  platform-cert-path: "wx_cert.pem"
  notify-url: "https://www.jarcheng.top/test-api/order/notify"
```

### 运行步骤

1. 导入doc目录下的sql到mysql
2. 启动redis，mysql，rabbitmq
3. 启动AdminApplication

