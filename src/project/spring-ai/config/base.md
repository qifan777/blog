---
order: 1
---
# 通用配置

## 依赖清单导入

spring-ai-bom是spring-ai官方的依赖统一管理。

1. 版本号

    ```xml
        <spring-ai.version>1.0.0-M2</spring-ai.version>
    ```

2. 依赖

    ```xml
        <dependencyManagement>
            <dependencies>
                <dependency>
                    <groupId>org.springframework.ai</groupId>
                    <artifactId>spring-ai-bom</artifactId>
                    <version>${spring-ai.version}</version>
                    <type>pom</type>
                    <scope>import</scope>
                </dependency>
            </dependencies>
        </dependencyManagement>
    ```

## 仓库配置

```xml
    <repositories>
        <repository>
            <id>central</id>
            <url>https://repo.maven.apache.org/maven2/</url>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
            <releases>
                <enabled>true</enabled>
            </releases>
        </repository>
        <repository>
            <id>spring-milestones</id>
            <name>Spring Milestones</name>
            <url>https://repo.spring.io/milestone</url>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>
        <repository>
            <id>spring-snapshots</id>
            <name>Spring Snapshots</name>
            <url>https://repo.spring.io/snapshot</url>
            <releases>
                <enabled>false</enabled>
            </releases>
        </repository>
    </repositories>

```

## AI厂商配置

[阿里灵积](./dash-scope.md)。
[百度千帆](./qian-fan.md)
[智谱清言](./zhi-pu.md)
[kimi](./kimi.md)
