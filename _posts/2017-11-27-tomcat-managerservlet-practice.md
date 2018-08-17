---
layout: post
title: 通过 Tomcat 的 ManagerServlet 远程部署项目
categories: 运维
description: 之前在邮政实习时，Leader 让我阅读 Tomcat 的源代码，尝试自己实现远程部署项目的功能，于是便有了这此实践。
keywords: Tomcat, 远程部署
---


之前在邮政实习时，Leader 让我阅读 Tomcat 的源代码，尝试自己实现远程部署项目的功能，于是便有了这此实践。

在 Tomact 中有一个 Manager 应用程序，它是用来管理已经部署的 web 应用程序，在这个应用程序中，ManagerServlet是他的主 Servlet，通过它我们可以获取 Tomcat 的部分指标，远程管理 Web 应用程序，不过这个功能会受到 Web 应用程序部署中安全约束的保护。

当你请求 ManagerServlet 时，它会检查 getPathInfo() 返回的值以及相关的查询参数，以确定被请求的操作。它支持以下操作和参数(从 servlet 路径开始):

| 请求路径 | 描述 |
| :-------- | :--------|
| /deploy?config={config-url} | 根据指定的 Path 部署并启动一个新的 Web 应用程序（详见源码） |
| /deploy?config={config-url}&war={war-url}/ | 根据指定的 Path 部署并启动一个新的 Web 应用程序（详见源码） |
| /deploy?path=/xxx&war={war-url} | 根据指定的 Path 部署并启动一个新的 Web 应用程序（详见源码） |
| /list | 列出所有 Web 应用程序的上下文路径。格式为 Path:Status:Sessions（活动会话数） |
| /reload?path=/xxx | 根据指定 Path 重新加载web应用 |
| /resources?type=xxxx | 枚举可用的全局 JNDI 资源，可以限制指定的 Java 类名 |
| /serverinfo | 显示系统信息和 JVM 信息 |
| /sessions | ~~此方法已过期~~ |
| /expire?path=/xxx | 列出 Path 路径下的 Web 应用的 Session 空闲时间信息 |
| /expire?path=/xxx&idle=mm | Expire sessions for the context path /xxx which were idle for at least mm minutes. |
| /sslConnectorCiphers | 显示当前 Connector 配置的 SSL/TLS 密码的诊断信息 |
| /start?path=/xx | 根据指定 Path 启动 Web 应用程序 |
| /stop?path=/xxx | 根据指定 Path 关闭 Web 应用程序 |
| /threaddump | Write a JVM thread dump |
| /undeploy?path=/xxx | 关闭并删除指定 Path 的 Web 应用程序，然后删除底层 WAR 文件或文档基目录。 |

我们可以通过 ManagerServlet 中 getPathInfo() 提供的操作，将自己的项目远程部署到服务器上，下面将贴出我的实践代码，在实践它之前你只需要引入 Httpclient 包和 Commons 包。

## 1 封装统一的远程请求管理类

封装此类用于方便 Client 请求 ManagerServlet：

``` java
import java.io.File;
import java.net.URL;
import java.net.URLEncoder;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.http.Header;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.Credentials;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.AuthCache;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.protocol.ClientContext;
import org.apache.http.impl.auth.BasicScheme;
import org.apache.http.impl.client.BasicAuthCache;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.PoolingClientConnectionManager;
import org.apache.http.protocol.BasicHttpContext;

public class TomcatManager {
    private static final String MANAGER_CHARSET = "UTF-8";
    private String username;
    private URL url;
    private String password;
    private String charset;
    private boolean verbose;
    private DefaultHttpClient httpClient;
    private BasicHttpContext localContext;

    /** constructor */
    public TomcatManager(URL url, String username) {
        this(url, username, "");
    }
    public TomcatManager(URL url, String username, String password) {
        this(url, username, password, "ISO-8859-1");
    }
    public TomcatManager(URL url, String username, String password, String charset) {
        this(url, username, password, charset, true);
    }
    public TomcatManager(URL url, String username, String password, String charset, boolean verbose) {
        this.url = url;
        this.username = username;
        this.password = password;
        this.charset = charset;
        this.verbose = verbose;
        
        // 创建网络请求相关的配置
        PoolingClientConnectionManager poolingClientConnectionManager = new PoolingClientConnectionManager();
        poolingClientConnectionManager.setMaxTotal(5);
        this.httpClient = new DefaultHttpClient(poolingClientConnectionManager);

        if (StringUtils.isNotEmpty(username)) {
            Credentials creds = new UsernamePasswordCredentials(username, password);

            String host = url.getHost();
            int port = url.getPort() > -1 ? url.getPort() : AuthScope.ANY_PORT;
            httpClient.getCredentialsProvider().setCredentials(new AuthScope(host, port), creds);

            AuthCache authCache = new BasicAuthCache();
            BasicScheme basicAuth = new BasicScheme();
            HttpHost targetHost = new HttpHost(url.getHost(), url.getPort(), url.getProtocol());
            authCache.put(targetHost, basicAuth);

            localContext = new BasicHttpContext();
            localContext.setAttribute(ClientContext.AUTH_CACHE, authCache);
        }
    }

    /** 根据指定的 path 部署并启动一个新的应用程序 */
    public TomcatManagerResponse deploy(String path, File war, boolean update) throws Exception {
        StringBuilder buffer = new StringBuilder("/deploy");
        buffer.append("?path=").append(URLEncoder.encode(path, charset));
        if (war != null) {
            buffer.append("&war=").append(URLEncoder.encode(war.toString(), charset));
        }
        if (update) {
            buffer.append("&update=true");
        }
        return invoke(buffer.toString());
    }

    /** 获取所有已部署的 web 应用程序的上下文路径。格式为 path:status:sessions (活动会话数) */
    public TomcatManagerResponse list() throws Exception {
        StringBuilder buffer = new StringBuilder("/list");
        return invoke(buffer.toString());
    }

    /** 获取系统信息和 JVM 信息 */
    public TomcatManagerResponse serverinfo() throws Exception {
        StringBuilder buffer = new StringBuilder("/serverinfo");
        return invoke(buffer.toString());
    }

    /** 真正发送请求的方法 */
    private TomcatManagerResponse invoke(String path) throws Exception {
        HttpRequestBase httpRequestBase = new HttpGet(url + path);
        HttpResponse response = httpClient.execute(httpRequestBase, localContext);

        int statusCode = response.getStatusLine().getStatusCode();
        switch (statusCode) {
            case HttpStatus.SC_OK: // 200
            case HttpStatus.SC_CREATED: // 201
            case HttpStatus.SC_ACCEPTED: // 202
                break;
            case HttpStatus.SC_MOVED_PERMANENTLY: // 301
            case HttpStatus.SC_MOVED_TEMPORARILY: // 302
            case HttpStatus.SC_SEE_OTHER: // 303
            String redirectUrl = getRedirectUrl(response);
            this.url = new URL(redirectUrl);
            return invoke(path);
        }

        return new TomcatManagerResponse().setStatusCode(response.getStatusLine().getStatusCode())
                .setReasonPhrase(response.getStatusLine().getReasonPhrase())
                .setHttpResponseBody(IOUtils.toString(response.getEntity().getContent()));
    }
    
    /** 提取重定向 URL  */
    protected String getRedirectUrl(HttpResponse response) {
        Header locationHeader = response.getFirstHeader("Location");
        String locationField = locationHeader.getValue();
        // is it a relative Location or a full ?
        return locationField.startsWith("http") ? locationField : url.toString() + '/' + locationField;
    }
}
```

## 2 封装响应结果集

``` java
@Data
public class TomcatManagerResponse {
    private int statusCode;
    private String reasonPhrase;
    private String httpResponseBody;
}
```

## 3 测试远程部署

在测试之前请先在配置文件放通下面用户权限：

``` xml
<role rolename="admin-gui"/>
<role rolename="admin-script"/>
<role rolename="manager-gui"/>
<role rolename="manager-script"/>
<role rolename="manager-jmx"/>
<role rolename="manager-status"/>
<user username="sqdyy" password="123456" roles="manager-gui,manager-script,manager-jmx,manager-status,admin-script,admin-gui"/>
```

下面是测试成功远程部署war包的代码：

``` java
import static org.testng.AssertJUnit.assertEquals;
import java.io.File;
import java.net.URL;
import org.testng.annotations.Test;

public class TestTomcatManager {

    @Test
    public void testDeploy() throws Exception {
        TomcatManager tm = new TomcatManager(new URL("http://localhost:8080/manager/text"), "sqdyy", "123456");
        File war = new File("E:\\tomcat\\simple-war-project-1.0-SNAPSHOT.war");
        TomcatManagerResponse response = tm.deploy("/simple-war-project-1.0-SNAPSHOT", war, true);
        System.out.println(response.getHttpResponseBody());
        assertEquals(200, response.getStatusCode());
        
        // output:
        // OK - Deployed application at context path /simple-war-project-1.0-SNAPSHOT
    }

    @Test
    public void testList() throws Exception {
        TomcatManager tm = new TomcatManager(new URL("http://localhost:8080/manager/text"), "sqdyy", "123456");
        TomcatManagerResponse response = tm.list();
        System.out.println(response.getHttpResponseBody());
        assertEquals(200, response.getStatusCode());
        
        // output:
        // OK - Listed applications for virtual host localhost
        // /:running:0:ROOT
        // /simple-war-project-1.0-SNAPSHOT:running:0:simple-war-project-1.0-SNAPSHOT
        // /examples:running:0:examples
        // /host-manager:running:0:host-manager
        // /manager:running:0:manager
        // /docs:running:0:docs
    }

    @Test
    public void testServerinfo() throws Exception {
        TomcatManager tm = new TomcatManager(new URL("http://localhost:8080/manager/text"), "sqdyy", "123456");
        TomcatManagerResponse response = tm.serverinfo();
        System.out.println(response.getHttpResponseBody());
        assertEquals(200, response.getStatusCode());
        
        // output:
        // OK - Server info
        // Tomcat Version: Apache Tomcat/7.0.82
        // OS Name: Windows 10
        // OS Version: 10.0
        // OS Architecture: amd64
        // JVM Version: 1.8.0_144-b01
        // JVM Vendor: Oracle Corporation
    }
}
```

## 4 参考资料

[ManagerServlet 源码地址](http://svn.apache.org/repos/asf/tomcat/tc7.0.x/trunk/java/org/apache/catalina/manager/ManagerServlet.java)