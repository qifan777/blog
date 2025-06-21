---
title: Spring AOP
sidebar: heading
category:
  - Spring
tag:
  - AOP
date: 2021-08-01
timeline: true
---

# 1. aop

面向切面编程（aop），是对传统面向对象编程（oop）的一种补充。
oop的最小单位是类（class），aop的最小单位是切面（aspect）。切面可以在不改变原来代码的情况下，对某些类进行功能加强。比如：spring事务管理，仅仅只要在需要事务的方法上加上@Transactional就可以得到加强。

## 1.1 aop概念

- `Aspect`：在spring里面，一个切面相当于一个类带上`@Aspect`注解。在这个切面里面写你想增强哪些类，以及增强的内容。
- `Join point`：连接点就是代表具体要增强的方法，比如方法A加上了@Transactional，那么方法A在事务切面眼中就是一个连接点。
- `Advice`: advice代表的是增强，在上面那个例子中，方法A需要事务增强，那么这个`事务`
  就是advice了。通过在连接点执行前后将增强分为前置（before），后置（after），环绕（around）增强。所以说可以把增强（advice）理解为拦截器（interceptor）。
- `Pointcut`：切入点就像正则表达式，它匹配了一组连接点。advice就是作用在Pointcut匹配的一组Join point上。
- `Target object`：目标对象是指被一个或者多个切面增强的对象，又称`增强对象`。这些对象是通过动态代理实现的，所以说本质上是代理对象。
- `AOP proxy`：spring为了实现aop，使用了jdk动态代理和cglib代理来创建增强对象。

## 1.2 编写切面

现在编写一个打印请求参数例子来理解aop的一些概念

依赖

```xml

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-aop</artifactId>
</dependency>
<dependency>
<groupId>org.projectlombok</groupId>
<artifactId>lombok</artifactId>
</dependency>
```

### 1.2.1 声明切面（Aspect）

```java
import org.aspectj.lang.annotation.Aspect;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
@Aspect
@Slf4j
@Component
public class LogAspect {
    
}
```

### 1.2.2 声明切入点（Pointcut）

#### 创建LogApi注解

在需要增强的方法（Join point）上添加这个注解

```java
import java.lang.annotation.*;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface LogApi {
}
```

#### 定义Pointcut表达式

这个表达式匹配了带有LogApi注解的方法

```java
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;


@Aspect
@Slf4j
@Component
public class LogAspect {

    @Pointcut("@annotation(logApi)")
    private void needLog(LogApi logApi) {
    }


}
```

### 1.2.3 声明增强（Advice）

日志信息类

```java
@Data
public class LogInfo {
    private Long id;
    private String serviceId;
    private String serverIp;
    private String serverHost;
    private String env;
    private String remoteIp;
    private String userAgent;
    private String requestUri;
    private String method;
    private String methodClass;
    private String methodName;
    private String params;
    private String time;
}

```

这边以around advice为例子

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

@Aspect
@Slf4j
@Component
public class LogAspect {
    @Autowired
    HttpServletRequest request;
    @Autowired
    ObjectMapper objectMapper;

    // 匹配带有 @LogApi注解的join point
    @Pointcut("@annotation(logApi)")
    private void needLog(LogApi logApi) {
    }

    // 在needLog（pointcut）匹配的join point执行前后做以下操作
    @Around("needLog(logApi)")
    public Object doLog(ProceedingJoinPoint joinPoint, LogApi logApi) throws Throwable {
        long beginTime = System.currentTimeMillis();
        
        // 上面是 join point 执行前
        Object result = joinPoint.proceed();
        // 下面是 join point 执行后
        
        long time = System.currentTimeMillis() - beginTime;
        LogInfo logInfo = new LogInfo();
        logInfo.setTime(String.valueOf(time));
        // 记录类名
        logInfo.setMethodClass(joinPoint.getTarget().getClass().getName());
        // 记录方法名
        logInfo.setMethodName(joinPoint.getSignature().getName());
        // 记录ip
        logInfo.setRemoteIp(request.getRemoteAddr());
        // 记录用户设备
        logInfo.setUserAgent(request.getHeader("user-agent"));
        // 记录请求路径
        logInfo.setRequestUri(request.getRequestURI());
        // 记录请求方法
        logInfo.setMethod(request.getMethod());
        try {
            // 记录请求参数
            logInfo.setParams(objectMapper.writeValueAsString(request.getParameterMap()));
        } catch (JsonProcessingException e) {
            log.warn("请求参数记录失败");
        }
        log.info(logInfo.toString());
        return result;
    }

}
```

## 1.3 测试

### 1.3.1 编写 controler

在 hello 方法上添加 @LogApi

```java
@RestController
public class UserController {
    @LogApi
    @GetMapping("hello")
    public String hello(@RequestParam("name") String name) {
        return "hello " + name;
    }
}

``` 

### 1.3.2 测试结果

发送请求

```
http://localhost:8080/hello?name=起凡
```

查看控制台输出

```
LogInfo(id=null, serviceId=null, serverIp=null, serverHost=null, env=null, remoteIp=0:0:0:0:0:0:0:1, userAgent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36 Edg/103.0.1264.62, requestUri=/hello, method=GET, methodClass=com.example.springaop.controller.UserController, methodName=hello, params={"name":["起凡"]}, time=0)

```