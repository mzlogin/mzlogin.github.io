---
layout: post
title: 如何让 Spring Security 「少管闲事」
categories: [Java]
description: 记两种让 Spring Security「少干点活」的方法。
keywords: Spring Security, Java, Spring
---

记两种让 Spring Security「少管闲事」的方法。

## 遇到问题

一个应用对外提供 Rest 接口，接口的访问认证通过 Spring Security OAuth2 控制，token 形式为 JWT。因为一些原因，某一特定路径前缀（假设为 `/custom/`）的接口需要使用另外一种自定义的认证方式，token 是一串无规则的随机字符串。两种认证方式的 token 都是在 Headers 里传递，形式都是 `Authorization: bearer xxx`。

所以当外部请求这个应用的接口时，情况示意如下：

![](/images/posts/java/spring-security-traffic.png)

这时，问题出现了。

我通过 `WebSecurityConfigurerAdapter` 配置 Spring Security 将 `/custom/` 前缀的请求直接放行：

```java
httpSecurity.authorizeRequests().regexMatchers("^(?!/custom/).*$").permitAll();
```

但请求 `/custom/` 前缀的接口仍然被拦截，报了如下错误：

```json
{
  "error": "invalid_token",
  "error_description": "Cannot convert access token to JSON"
}
```

## 分析问题

从错误提示首先可以通过检查排除掉 `CustomWebFilter` 的嫌疑，自定义认证方式的 token 不是 JSON 格式，它里面自然也不然尝试去将其转换成 JSON。

那推测问题出在 Spring Security 「多管闲事」，拦截了不该拦截的请求上。

经过一番面向搜索编程和源码调试，找到抛出以上错误信息的位置是在 `JwtAccessTokenConverter.decode` 方法里：

```java
protected Map<String, Object> decode(String token) {
    try {
        // 下面这行会抛出异常
        Jwt jwt = JwtHelper.decodeAndVerify(token, verifier);
        // ... some code here
    }
    catch (Exception e) {
        throw new InvalidTokenException("Cannot convert access token to JSON", e);
    }
}
```

调用堆栈如下：

![](/images/posts/java/spring-security-callstack.png)

从调用的上下文可以看出（高亮那一行），执行逻辑在一个名为 `OAuth2AuthenticationProcessingFilter` 的 Filter 里，会尝试从请求中提取 Bearer Token，然后做一些处理（此处是 JWT 转换和校验等）。这个 Filter 是 `ResourceServerSecurityConfigurer.configure` 中初始化的，我们的应用同时也是作为一个 Spring Security OAuth2 Resource Server，从类名可以看出是对此的配置。

## 解决问题

找到了问题所在之后，经过自己的思考和同事间的讨论，得出了两种可行的解决方案。

### 方案一：让特定的请求跳过 OAuth2AuthenticationProcessingFilter

这个方案的思路是通过 AOP，在 `OAuth2AuthenticationProcessingFilter.doFilter` 方法执行前做个判断

1. 如果请求路径是以 `/custom/` 开头，就跳过该 Filter 继续往后执行；
2. 如果请求路径非 `/custom/` 开头，正常执行。

关键代码示意：

```java
@Aspect
@Component
public class AuthorizationHeaderAspect {
    @Pointcut("execution(* org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationProcessingFilter.doFilter(..))")
    public void securityOauth2DoFilter() {}

    @Around("securityOauth2DoFilter()")
    public void skipNotCustom(ProceedingJoinPoint joinPoint) throws Throwable {
        Object[] args = joinPoint.getArgs();
        if (args == null || args.length != 3 || !(args[0] instanceof HttpServletRequest && args[1] instanceof javax.servlet.ServletResponse && args[2] instanceof FilterChain)) {
            joinPoint.proceed();
            return;
        }
        HttpServletRequest request = (HttpServletRequest) args[0];
        if (request.getRequestURI().startsWith("/custom/")) {
            joinPoint.proceed();
        } else {
            ((FilterChain) args[2]).doFilter((ServletRequest) args[0], (ServletResponse) args[1]);
        }
    }
}
```

### 方案二：调整 Filter 顺序 

如果能让请求先到达我们自定义的 Filter，请求路径以 `/custom/` 开头的，处理完自定义 token 校验等逻辑，然后将 `Authorization` Header 去掉（在 `OAuth2AuthenticationProcessingFilter.doFilter` 中，如果取不到 Bearer Token，不会抛异常），其它请求直接放行，也是一个可以达成目标的思路。

但现状是自定义的 Filter 默认是在 `OAuth2AuthenticationProcessingFilter` 后执行的，如何实现它们的执行顺序调整呢？

在我们前面找到的 `OAuth2AuthenticationProcessingFilter` 注册的地方，也就是 `ResourceServerSecurityConfigurer.configure` 方法里，我们可以看到 Filter 是通过以下这种写法添加的：

```java
@Override
public void configure(HttpSecurity http) throws Exception {
    // ... some code here
    http
        .authorizeRequests().expressionHandler(expressionHandler)
    .and()
        .addFilterBefore(resourcesServerFilter, AbstractPreAuthenticatedProcessingFilter.class)
        .exceptionHandling()
            .accessDeniedHandler(accessDeniedHandler)
            .authenticationEntryPoint(authenticationEntryPoint);
}
```

核心方法是 `HttpSecurity.addFilterBefore`，说起 `HttpSecurity`，我们有印象啊……前面通过 `WebSecurityConfigurerAdapter` 来配置请求放行时入参是它，能否在那个时机将自定义 Filter 注册到 `OAuth2AuthenticationProcessingFilter` 之前呢？

我们将前面配置放行规则处的代码修改如下：

```java
// ...
httpSecurity.authorizeRequests().registry.regexMatchers("^(?!/custom/).*$").permitAll()
        .and()
        .addFilterAfter(new CustomWebFilter(), X509AuthenticationFilter.class);
// ...
```

**注：** CustomWebFilter 改为直接 new 出来的，手动添加到 Security Filter Chain，不再自动注入到其它 Filter Chain。

为什么是将自定义 Filter 添加到 `X509AuthenticationFilter.class` 之后呢？可以参考 spring-security-config 包的 `FilterComparator` 里预置的 Filter 顺序来做决定，从前面的代码可知 `OAuth2AuthenticationProcessingFilter` 是添加到 `AbstractPreAuthenticatedProcessingFilter.class` 之前的，而在 `FilterComparator` 预置的顺序里，`X509AuthenticationFilter.class` 是在 `AbstractPreAuthenticatedProcessingFilter.class` 之前的，我们这样添加就足以确保自定义 Filter 在 `OAuth2AuthenticationProcessingFilter` 之前。

做了以上修改，自定义 Filter 已经在我们预期的位置了，那么我们在这个 Filter 里面，对请求路径以 `/custom/` 开头的做必要处理，然后清空 `Authorization` Header 即可，关键代码示意如下：

```java
@Override
public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
    HttpServletRequest request = (HttpServletRequest) servletRequest;
    if (request.getServletPath().startsWith("/custom/")) {
        // do something here
        // ...
        final String authorizationHeader = "Authorization";
        HttpServletRequestWrapper requestWrapper = new HttpServletRequestWrapper((HttpServletRequest) servletRequest) {
            @Override
            public String getHeader(String name) {
                if (authorizationHeader.equalsIgnoreCase(name)) {
                    return null;
                }
                return super.getHeader(name);
            }

            @Override
            public Enumeration<String> getHeaders(String name) {
                if (authorizationHeader.equalsIgnoreCase(name)) {
                    return new Vector<String>().elements();
                }
                return super.getHeaders(name);
            }
        };
        filterChain.doFilter(requestWrapper, servletResponse);
    } else {
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
```

## 小结

经过尝试，两种方案都能满足需求，项目里最终使用了方案一，相信也还有其它的思路可以解决问题。

经过这一过程，也暴露出了对 Spring Security 的理解不够的问题，后续需要抽空做一些更深入的学习。

## 参考

- <https://www.cnblogs.com/alalazy/p/13179608.html>