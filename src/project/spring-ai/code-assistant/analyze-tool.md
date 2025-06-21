---
order: 3
---
# 代码分析工具

我原来的版本是和`GitLab`做集成，从`GitLab`上拉取代码，分析提交。但是考虑到国内调用`GitHub`不方便，需要配代理我删除了分析提交的部分。不过不影响核心的代码评审逻辑的学习。

当用户提问:

```txt
请你帮我分析一下这个文件：src/main/java/io/github/qifan777/knowledge/user/UserController.java
```

Agent会触发代码评审工具，从构建好的代码关系图谱中获取调用链，给AI去评审分析。

## 工具定义

描述好工具的用途，工具能接受的参数，然后实现apply方法体，由于这个工具主要提供一个重定向功能，所以实现比较简单。

```java
@Description("评审分析给定的java文件")
@Service
@AllArgsConstructor
@Slf4j
public class AnalyzeFunction implements Function<AnalyzeFunction.Request, String> {

    public record Request(@JsonProperty(required = true)
                          @JsonPropertyDescription("java文件路径如：src/main/java/xxx.java") String path) {
    }
    
    @SneakyThrows
    @Override
    public String apply(Request request) {
        return "请在下面的网页链接查看评审结果：http://localhost:5177/#/analyze?path=" + request.path;
    }
}
```

## 文件分析

首先解析文件，得到所有的方法，然后再遍历方法分析每个方法的调用链

```java
    /**
     * 创建一个结果分析流，另起一个线程开启解析java文件，获取主类中的所有方法，然后分析方法调用得到分析结果，推流到前端。
     *
     * @param filePath java文件路径 如：io.qifan.github777.UserController.java
     * @return Flux<AnalyzeResult> 结果分析流
     */
    @SneakyThrows
    public Flux<AnalyzeResult> analyze(String filePath) {
        log.info("正在评审文件：{}", filePath);
        return Flux.create(fluxSink -> executor.execute(() -> {
            JavaParserUtils.parse(Path.of(properties.getProject().getProjectPath(), filePath))
                    .getResult()
                    .map(compilationUnit -> compilationUnit.findAll(ClassOrInterfaceDeclaration.class))
                    // 只分析主类, 可能java文件中一个类都没有，因此返回的是一个Optional。如果不使用FlatMap，会直接返回一个Optional<Optional<ClassOrInterfaceDeclaration>>，
                    // 因此需要使用flatMap，是的返回结果变成Optional<ClassOrInterfaceDeclaration>
                    .flatMap(classOrInterfaceDeclarations -> classOrInterfaceDeclarations.stream().findFirst())
                    // 由于类可能是匿名内部类，这边过滤一下。下面可以直接使用get()。当然实际上这个地方的主类类名肯定是存在的，但是为了写法严谨我还是判断了一下
                    .filter(classOrInterfaceDeclaration -> classOrInterfaceDeclaration.getFullyQualifiedName().isPresent())
                    // 获取到类名，并遍历所有方法
                    .map(classOrInterfaceDeclaration -> {
                        String fullyQualifiedName = classOrInterfaceDeclaration
                                .getFullyQualifiedName().get();
                        return classOrInterfaceDeclaration
                                .getMethods()
                                .stream()
                                .map(methodDeclaration -> fullyQualifiedName + "#" + methodDeclaration.getNameAsString())
                                .toList();
                    })
                    .ifPresentOrElse(methodIds -> {
                        methodIds.forEach(methodId -> {
                            analyzeMethod(methodId).doOnNext(fluxSink::next).blockLast();
                        });
                    }, () -> {
                        // 如果没有主类（Class Or Interface），则直接分析整个文件，或者不是Java文件（Mapper.xml）
                        fluxSink.next(analyzeFile(filePath));
                    });
            // 完成
            fluxSink.complete();
        }));
    }
```

分析方法

```java
    public Flux<AnalyzeResult> analyzeMethod(String methodId) {
        // 从代码的关系图谱中查询待分析方法调用了哪些方法
        List<MethodNode> childMethods = codeGraphService.findChildMethods(methodId);
        String prompt = new PromptTemplate("""
                请你根据{methodId}的调用链评审代码，并给出你的改进建议，并且附带修改后的代码片段，用中文回答。
                {methodChains}
                """)
                .createMessage(Map.of("methodChains", childMethods
                                .stream()
                                .map(MethodNode::getContent)
                                .distinct()
                                .collect(Collectors.joining("\n")),
                        "methodId", methodId))
                .getContent();
        log.info("评审方法: {}", prompt);
        String content = childMethods.stream().filter(m -> m.getId().equals(methodId)).findFirst().orElseThrow().getContent();
        return chatModel.stream(prompt).map(response -> new AnalyzeResult(methodId, response, methodId.split("#")[0], content));
    }
```
