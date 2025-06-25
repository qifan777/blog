---
order: 9
---
# MCP

![ =x500](./images/mcp.png)

MCP协议由上图所示的三个部分组成

- MCP Server
- MCP Client
- Transport Layer

MCP Server提供了多个工具， MCP Client可以通过Transport Layer（SSE协议、命令行调用等）调用MCP Server提供的工具。

## 手动使用MCP

如果不考虑AI，我们可以自己尝试手动发起MCP Client连接并调用MCP Server提供的工具。

### 安装MCP Server

选一个自己喜欢的GitHub开源[MCP Server](https://github.com/modelcontextprotocol/servers),
下面以[mcp-playwright（操控浏览器的相关工具）](https://github.com/executeautomation/mcp-playwright)为例子讲解如何使用MCP
Client调用MCP Server提供的工具。

1. 安装node.js
2. `npm install -g @executeautomation/playwright-mcp-server`，相当于把软件安装到本地后续通过`npx`即可调用MCP Server.

注意：有些是MCP Server是用python写的，需要用uvx或者docker

### MCP Client创建

1. 引入依赖
    ```xml
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-starter-mcp-client</artifactId>
    </dependency>
    ```
   
2. 阅读mcp-playwright的README文档, 从配置文件中获取MCP Server的参数
    ```json
    {
      "mcpServers": {
        "playwright": {
          "command": "npx",
          "args": ["-y", "@executeautomation/playwright-mcp-server"]
        }
      }
    }
    ```
3. 创建MCP Client并调用工具

   由于该MCP Server是命令行调用，因此需要使用`StdioClientTransport`，参数参考上面的json。

   由于在windows下`npx`找不到命令，需要改成`npx.cmd`

   mcp-playwright支持哪些工具可以查看[工具列表](https://executeautomation.github.io/mcp-playwright/docs/playwright-web/Supported-Tools)
   ```java
   @Slf4j
   public class MCPTest {
     @Test
     public void test() {
        ServerParameters parameters = ServerParameters
                // windows需要加后缀.cmd 其他系统不需要
                .builder("npx.cmd")
                .args("-y", "@executeautomation/playwright-mcp-server")
                .build();
        // 命令行调用协议
        StdioClientTransport transport = new StdioClientTransport(parameters);
        // 创建MCP客户端
        McpSyncClient client = McpClient.sync(transport).build();
        // 初始化MCP客户端
        client.initialize();
        // 查看MCP Sever提供的工具列表
        log.info("tools: {}", client.listTools());
        // 打开网站
        client.callTool(new McpSchema.CallToolRequest("playwright_navigate", Map.of("url", "https://www.jarcheng.top")));
        // 截图
        client.callTool(new McpSchema.CallToolRequest("playwright_screenshot", Map.of("savePang", true,
                "downloadsDir", "C:\\Users\\a1507\\Desktop")));
     }
   }
   ```
   
## AI使用MCP

要知道MCP本质上还是属于`tool call`，只需要将MCP Server提供的工具转为SpringAI的`ToolCalback`剩下的就和之前讲的`tool call`一样。


```java
@Slf4j
@SpringBootTest
public class MCPTest {
    @Autowired
    ChatModel chatModel;

    @Test
    public void test2() {
        ServerParameters parameters = ServerParameters
                // windows需要加后缀.cmd 其他系统不需要
                .builder("npx.cmd")
                .args("-y", "@executeautomation/playwright-mcp-server")
                .build();
        // 命令行调用协议
        StdioClientTransport transport = new StdioClientTransport(parameters);
        // 创建MCP客户端
        McpSyncClient client = McpClient.sync(transport).build();
        // 初始化MCP客户端
        client.initialize();
        // 关键步骤，把MCP Server提供的工具转为SpringAI的ToolCallback
        List<ToolCallback> toolCallbacks = McpToolUtils.getToolCallbacksFromSyncClients(client);
        String content = ChatClient.create(chatModel)
                .prompt()
                .user("打开https://www.jarcheng.top 并截图保存到C:\\Users\\a1507\\Desktop")
                .toolCallbacks(toolCallbacks)
                .call()
                .content();
        log.info("content: {}", content);
    }
}
```

## 自动创建MCP Client

Spring AI支持读取MCP Server的json配置文件自动创建MCP Client。

1. 创建MCP Server的json配置文件，并放在classpath下，名称为`mcp-server.json`
    ```json
    {
      "mcpServers": {
        "playwright": {
          "command": "npx",
          "args": ["-y", "@executeautomation/playwright-mcp-server"]
        }
      }
    }
    ```
2. `application.yml`配置
   ```yaml
   spring:
     ai:
       mcp:
         client:
           stdio:
             servers-configuration: classpath:mcp-servers.json
   ```
3. 注入MCP Client并使用

   ```java
   @Slf4j
   @SpringBootTest
   public class MCPTest {
       @Autowired
       private List<McpSyncClient> mcpSyncClients;
       @Autowired
       ChatModel chatModel;
       
       @Test
       public void test3() {
           List<ToolCallback> toolCallbacks = McpToolUtils.getToolCallbacksFromSyncClients(mcpSyncClients);
           String content = ChatClient.create(chatModel)
                   .prompt()
                   .user("打开https://www.jarcheng.top 并截图保存到C:\\Users\\a1507\\Desktop")
                   .toolCallbacks(toolCallbacks)
                   .call()
                   .content();
           log.info("content: {}", content);
       }
   }
   ```