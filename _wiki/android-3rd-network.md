---
layout: wiki
title: 网络请求
cate1: Android
cate2:
description: 网络请求
keywords: Android
---

## Volley

> Volley is not suitable for large download or streaming operations, since Volley holds all responses in memory during parsing. For large download operations, consider using an alternative like DownloadManager.

## Retrofit

### 打印日志

Retrofit 默认并没有将 request 和 response 的情况在 logcat 里打印出来，这不利于调试。打印日志需要使用到 OkHttp 的 LoggingInterceptor，关于 Interceptor 可以参见 OkHttp 的 [Wiki](https://github.com/square/okhttp/wiki/Interceptors)。

示例代码：

app/build.gradle

```groovy
...
dependencies {
    ...
    implementation 'com.squareup.okhttp3:logging-interceptor:3.9.1'
}
```

```java
HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor(new HttpLoggingInterceptor.Logger() {
    @Override
    public void log(String message) {
        LogUtils.d("retrofit", message);
    }
});
loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

OkHttpClient client = new OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .build();

Retrofit retrofit = new Retrofit.Builder()
        .client(client)
        .baseUrl(Constants.HTTP_BASE_URL)
        .addConverterFactory(ScalarsConverterFactory.create())
        .addConverterFactory(GsonConverterFactory.create())
        .build();
```

LogginInterceptor 有 NONE、BASIC、HEADERS 和 BODY 四种 Level，按需求设置。

### 遇到错误 Case 1

```
android.util.MalformedJsonException: Use JsonReader.setLenient(true) to accept malformed JSON at line 1 column 1 path $
```

一般是由于返回的 Json 串里有没用引号包围的字段名，比如 `{name: "Jack"}`。

方案有二：

1. 修改服务端返回内容，确保该现象不会再发生；

2. 修改客户端，让 GsonConverter 能够兼容处理这种情况，比如修改之前的代码是：

    ```java
    Retrofit retrofit = new Retrofit.Builder()
        .client(client)
        .baseUrl(Constants.HTTP_BASE_URL)
        .addConverterFactory(ScalarsConverterFactory.create())
        .addConverterFactory(GsonConverterFactory.create())
        .build();
    ```

    修改之后：

    ```java
    Retrofit retrofit = new Retrofit.Builder()
        .client(client)
        .baseUrl(Constants.HTTP_BASE_URL)
        .addConverterFactory(ScalarsConverterFactory.create())
        .addConverterFactory(GsonConverterFactory.create(new GsonBuilder().setLenient().create()))
        .build();
    ```

## 参考

* [Transmitting Network Data Using Volley](https://developer.android.com/training/volley/index.html)
