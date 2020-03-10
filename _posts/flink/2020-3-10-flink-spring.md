---
layout: post
title: flink整合spring boot
categories: flink
description: flink整合spring boot中遇到的采坑点
keywords: flink，spring boot
---

spring boot整合flink，flink版本1.9，spring boot版本2.2.5。第一次用flink1.3的时候可能也是思路没对，没成功，这次看了一篇博客，[Spring Boot整合Flink](https://blog.csdn.net/javajxz008/article/details/94656679),里面的整体思路还是不错的但是还有有一些问题。

原博主意识到整合过程中的一个问题是flink流无法访问spring容器中的类，从而导致空指针异常，解决思路是在流中进行spring bean的初始化以获得ApplicationContext，进而使用其getBean方法获取类实例。但描述并不够详细。

首先我们想到的方法肯定是利用

```java
@Component
public class ApplicationContextUtil implements ApplicationContextAware, Serializable {
    private static final long serialVersionUID = -6454872090519042646L;
    private static ApplicationContext applicationContext = null;
 
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        if (ApplicationContextUtil.applicationContext == null) {
            ApplicationContextUtil.applicationContext = applicationContext;
        }
    }
 
    public static ApplicationContext getApplicationContext() {
        return applicationContext;
    }
 
    //通过name获取 Bean.
    public static Object getBean(String name) {
        return getApplicationContext().getBean(name);
    }
 
    //通过class获取Bean.
    public static <T> T getBean(Class<T> clazz) {
        return getApplicationContext().getBean(clazz);
    }
 
    //通过name,以及Clazz返回指定的Bean
    public static <T> T getBean(String name, Class<T> clazz) {
        return getApplicationContext().getBean(name, clazz);
    }
}
```

来获得spring boot环境，在本地测试使用的确也没问题，因为本地测试时，flink的jobmanager和taskmanager都运行在同一个本地jvm里面，所以可以获得到spring boot环境，即，线下代码这么写是可以的

``` java
public void open(Configuration parameters) throws Exception {
        logger.info("test environment: async function for mysql java open ...");
        super.open(parameters);
        ApplicationContextUtil contextUtil = new ApplicationContextUtil();
        ruleDao = contextUtil.getBean(RuleDao.class);
        logger.info("ruleDao:" + ruleDao.toString());
    }
```

但是这种方法放到线上却不行，因为通过调试会发现，在往flink集群提交任务时，其实是在jobmanager上生成了spring boot环境，然后将job提交任务到taskmanager上去执行，由于是flink集群必然是多节点部署的，在taskmanager上并没有启动sring boot环境，因此报错。原博主提出解决办法，在flink任务中直接新建spring boot环境，代码：

``` java
public void open(Configuration parameters) throws Exception {
        logger.info("produce environment : async function for mysql java open ...");
        super.open(parameters);
        SpringApplication application = new SpringApplication(AsyncFunctionForRule.class);
        application.setBannerMode(Banner.Mode.OFF);
        ApplicationContext context = application.run(new String[]{});
        ruleDao = context.getBean(RuleDao.class);
        logger.info("ruleDao:" + ruleDao.toString());
    }
```

并且要注意在上面这种线上使用的时候，class的头上要加上@EnableAutoConfiguration，@EntityScan("com.free4inno.RealTimeCommon.entity")， @EnableJpaRepositories(basePackages = "com.free4inno.RealTimeCommon.dao")注解

但是这样造成的问题是，taskManager上第一个提交的任务新建springboot环境后，占用了8080端口，后面的其他任务再去这个taskManager上提交任务的时候，会重复创建spring boot环境，然后又悲惨的发现8080端口已经被占用，最终导致抱错

因此，正确的思路应该是，判断taskManager上是否有springboot环境，如果没有，新建spring boot环境，如果有，获得之前的spring boot context,代码：

``` java
@Override
    public void open(Configuration parameters) throws Exception {
        logger.info("Online and offline environment: async function for mysql java open ...");
        super.open(parameters);
        ApplicationContextUtil contextUtil = new ApplicationContextUtil();
        ApplicationContext applicationContext = contextUtil.getApplicationContext();
        String judge = applicationContext + "";
        logger.info("ApplicationContext judge : "+judge);
        if(judge.equals("null")){
            logger.info("*******Didn't detect environment. Initial now!**********");
            SpringApplication application = new SpringApplication(AsyncFunctionForRule.class);
            application.setBannerMode(Banner.Mode.OFF);
            ApplicationContext context = application.run(new String[]{});
            ApplicationContextUtil.setOwnApplicationContext(context);
            ruleDao = context.getBean(RuleDao.class);
        }else {
            logger.info("*******environment has been establish before!**********");
            ruleDao = contextUtil.getBean(RuleDao.class);
        }
        logger.info("ruleDao:" + ruleDao.toString());
    }
```


