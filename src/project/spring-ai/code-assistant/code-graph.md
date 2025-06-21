---
order: 2
---
# 代码图谱构建

我主要对代码中的类引用关系（`imports`），类中拥有的方法关系（`owns`），方法中调用的方法关系（`uses`），三种关系进行构建

## 实体设计

类节点

```java
@Node
@Data
@Accessors(chain = true)
public class ClassNode {
    @Id
    private String id;
    private String name;
    private String content;
    // 类中的方法
    @Relationship(direction = Relationship.Direction.OUTGOING, type = "OWNS")
    private List<MethodNode> ownsMethodNodes;
    // 类中导入的其他类
    @Relationship(direction = Relationship.Direction.OUTGOING, type = "IMPORTS")
    private List<ClassNode> importNodes;
}
```

方法节点

```java
@Node
@Data
@Accessors(chain = true)
public class MethodNode {
    @Id
    private String id;
    private String name;
    private String comment;
    private String content;
    // 方法中调用了其他方法
    @Relationship(direction = Relationship.Direction.OUTGOING, type = "USES")
    private List<MethodNode> usesMethodNodes;
}
```

## mybatis sql构建

一个mybatis的mapper接口会在mapper xml中对应一个sql语句，所有我们先解析出所有的mapper xml中的sql语句并存入`mapperSqlMap`，方便后续解析使用。

```java
    private final Map<String, String> mapperSqlMap = new HashMap<>();
    /**
     * 将mapper中的sql语句提取出来，并和sql语句对应的方法名对应起来
     *
     * @param nodeList  select/delete/update标签
     * @param namespace mapper的namespace
     */
    @SneakyThrows
    private void extractSqlFromStatement(NodeList nodeList, String namespace) {
        TransformerFactory tf = TransformerFactory.newInstance();
        Transformer transformer = tf.newTransformer();
        transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
        for (int i = 0; i < nodeList.getLength(); i++) {
            StringWriter writer = new StringWriter();
            transformer.transform(new DOMSource(nodeList.item(i)), new StreamResult(writer));
            String output = writer.getBuffer().toString().replaceAll("\n|\r", "");
            mapperSqlMap.put(namespace + "#" + nodeList.item(i).getAttributes().getNamedItem("id").getNodeValue(), output);
        }
    }
```

## java类声明获取

一个java文件中可能包含了多个类，因此首先需要扫描项目下的所有java文件，解析出其中的类和接口定义。

```java
    private final Map<String, ClassOrInterfaceDeclaration> classDeclarationMap = new HashMap<>();
    @SneakyThrows
    public BuildContext buildGraph() {
        // 忽略...
        // 遍历src/main/java中的所有java文件
        try (Stream<Path> pathStream = Files.walk(getJavaSourcePath())) {
            pathStream.filter(path -> path.toFile().isFile())
                    // 得到java文件的类声明
                    .flatMap(path -> getClassDeclarations(path).stream())
                    // 过滤掉匿名内部类
                    .filter(declaration -> declaration.getFullyQualifiedName().isPresent())
                    // 存入map
                    .forEach(declaration -> classDeclarationMap.put(declaration.getFullyQualifiedName().get(), declaration));
        }
        // 忽略...
    }
```

## 类节点构建

在类声明的获取基础之上可以构建类节点，在类声明中可以获取到类引入了哪些节点，类中声明了哪些方法，这也是为什么第一步需要使用`javaparser`获取类声明的原因。

```java
    @SneakyThrows
    public BuildContext buildGraph() {
    // 忽略...
            // 遍历类声明构建类节点
            classDeclarationMap.values().forEach(this::buildClassNode);
    // 忽略...
    }

    /**
     * 递归构建类节点
     *
     * @param declaration 类或者接口声明
     * @return 类节点
     */
    @SneakyThrows
    private Optional<ClassNode> buildClassNode(ClassOrInterfaceDeclaration declaration) {
        // 用classNodeMap缓存，避免重复构建
        if (classNodeMap.containsKey(declaration.getNameAsString())) {
            return Optional.of(classNodeMap.get(declaration.getNameAsString()));
        }
        return declaration
                .getFullyQualifiedName()
                .map(qualifiedClasName -> {
                    // 类节点的基本信息
                    ClassNode classNode = new ClassNode().setId(qualifiedClasName)
                            .setName(declaration.getNameAsString())
                            .setContent(declaration.toString());
                    // 缓存类节点
                    classNodeMap.put(qualifiedClasName, classNode);
                    List<ClassNode> importClassNodes = declaration
                            .findAll(ImportDeclaration.class)
                            .stream()
                            // 递归构建类节点
                            .map(importDeclaration -> Optional.ofNullable(classDeclarationMap.get(importDeclaration.getNameAsString()))
                                    .flatMap(this::buildClassNode))
                            .filter(Optional::isPresent)
                            .map(Optional::get)
                            .toList();
                    classNode.setImportNodes(importClassNodes);
                    return classNode;
                });
    }
```

## 方法节点构建

```java
    /**
     * 构建java方法关系图谱，包含类节点和类方法节点，类和类之间的引用关系，类和方法之间的归属关系，方法和方法之间的调用关系
     *
     * @return 构建好的类节点和类方法节点
     */
    @SneakyThrows
    public BuildContext buildGraph() {
        try (Stream<Path> pathStream = Files.walk(getJavaSourcePath())) {
            // 忽略...
            // 获取类节点，为每个类节点构建方法
            classNodeMap
                    .values()
                    .forEach(classNode -> {
                        // 取出类节点对应是类声明
                        ClassOrInterfaceDeclaration classOrInterfaceDeclaration = classDeclarationMap.get(classNode.getId());
                        // 通过类声明获取中类中定义了哪些方法
                        List<MethodDeclaration> methodDeclarations = classOrInterfaceDeclaration.findAll(MethodDeclaration.class);
                        // 把这些方法声明构建成方法节点
                        List<MethodNode> ownsMethodNodes = methodDeclarations
                                .stream()
                                .map(methodDeclaration -> buildMethodNode(methodDeclaration.getNameAsString(), classNode.getId(), methodDeclarations))
                                .filter(Optional::isPresent)
                                .map(Optional::get)
                                .toList();
                        classNode.setOwnsMethodNodes(ownsMethodNodes);
                    });
            // 忽略...
        }
    }

    /**
     * 递归构建方法节点
     *
     * @param methodName   方法名称，如login
     * @param className    方法所在的全限定类名，如io.qifan.xxx.UserService
     * @param declarations 类中的所有方法，如login、logout等
     * @return 方法节点
     */
    @SneakyThrows
    private Optional<MethodNode> buildMethodNode(String methodName, String className, List<MethodDeclaration> declarations) {
        String methodId = className + "#" + methodName;
        // 用methodNodeMap缓存，避免重复构建
        if (methodNodeMap.containsKey(methodId)) {
            return Optional.of(methodNodeMap.get(methodId));
        }
        return declarations.stream()
                .filter(methodDeclaration -> methodDeclaration.getNameAsString().equals(methodName))
                .findFirst()
                .map(methodDeclaration -> {
                    // 获取方法内容，如果是mapper接口则获取方法对应的sql
                    String content = methodDeclaration.findAll(AnnotationExpr.class)
                            .stream()
                            .filter(a -> a.getMetaModel().getQualifiedClassName().equals("org.apache.ibatis.annotations.Mapper"))
                            .findAny()
                            .map(annotationExpr -> mapperSqlMap.get(methodId))
                            .orElse(methodDeclaration.toString());
                    MethodNode methodNode = new MethodNode()
                            .setId(methodId)
                            .setName(methodDeclaration.getNameAsString())
                            .setContent(content)
                            .setComment(methodDeclaration.getComment().map(Comment::getContent).orElse(""));
                    // 缓存方法节点
                    methodNodeMap.put(methodNode.getId(), methodNode);
                    // 递归构建方法调用关系
                    List<MethodNode> usesMethodNodes = methodDeclaration
                            .findAll(MethodCallExpr.class)
                            .stream()
                            .map(this::buildMethodNodeFromMethodCall)
                            .filter(Optional::isPresent)
                            .map(Optional::get)
                            .toList();
                    methodNode.setUsesMethodNodes(usesMethodNodes);
                    return methodNode;
                });
    }
```
