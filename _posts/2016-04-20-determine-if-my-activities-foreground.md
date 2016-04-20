---
layout: post
title: 判断前台 Activity 是否属于本进程
categories: Android
description: 一种判断前台 Activity 是否属于本进程的方法。
keywords: Android, Activity, Foreground
---

本文记录的是一种判断当前激活的 Activity 是否属于本进程的方法。

**约定：文中表述说一个 Activity 处于激活状态是指它是屏幕上当前展示的 Activity，且没有被 Dialog 覆盖。**

## 原理

Activity 的生命周期由 Android 系统维护，所以使用一个 Activity 的生命周期方法 `onResume` 与 `onPause` 来记录它的激活状态是可靠的。

同理，因为前台 Activity 只有一个，所以判断前台 Activity 是否属于本进程只需要判断本进程是否有 Activity 处于激活状态即可。

## 实现

顺着这个思路，直接想到的方案就是去给代码里所有的 Activity 实现一个共同基类，然后在基类里的 `onResume` 和 `onPause` 方法去更新一个全局计数器了。

这固然可行，但遇到有些不能继承共同基类的情况，比如继承自 ListActivity 和 ExpandableListActivity 等 Activity 的子类的，就得重复去在具体 Activity 里的对应方法里添加代码了，一旦有一个 Activity 忘了添加，这个机制就失效了，所以并不优雅。

幸好 Android 在 API Level 14 的时候新加入了 `android.app.Application.ActivityLifecycleCallbacks` 接口，它会在 Activity 生命周期事件发生时产生回调：

```java
public interface ActivityLifecycleCallbacks {
    void onActivityCreated(Activity activity, Bundle savedInstanceState);
    void onActivityStarted(Activity activity);
    void onActivityResumed(Activity activity);
    void onActivityPaused(Activity activity);
    void onActivityStopped(Activity activity);
    void onActivitySaveInstanceState(Activity activity, Bundle outState);
    void onActivityDestroyed(Activity activity);
}
```

这真是救星。

那么优雅的实现方案：

```java
public class MyApplication extends Application {
    private static boolean hasActivityActivate = false;

    @Override
    public void onCreate() {
        super.onCreate();
        registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacks() {
            @Override
            public void onActivityCreated(Activity activity, Bundle savedInstanceState) {

            }

            @Override
            public void onActivityStarted(Activity activity) {

            }

            @Override
            public void onActivityResumed(Activity activity) {
                hasActivityActivate = true;
            }

            @Override
            public void onActivityPaused(Activity activity) {
                hasActivityActivate = false;
            }

            @Override
            public void onActivityStopped(Activity activity) {

            }

            @Override
            public void onActivitySaveInstanceState(Activity activity, Bundle outState) {

            }

            @Override
            public void onActivityDestroyed(Activity activity) {

            }
        });
    }

    public static boolean hasActivityActivate() {
        return hasActivityActivate;
    }
}
```

然后在需要的时候调用 `MyApplication.hasActivityActivate()` 就行了。

当然别忘了在 AndroidManifest.xml 里声明指定你的 Application 类名：

```xml
...
<application
    android:name=".MyApplication"
    ....
```

## 后话

本文记录的只是判断当前进程是否有 Activity 处于激活状态的方法，判断当前应用、其它应用的前后台情况有多种方法，它们的优缺点、适用场景在以下 GitHub 仓库有详细列举，有需求的同学可以参考：

<https://github.com/wenmingvs/AndroidProcess>

## 参考

* [wenmingvs/AndroidProcess](https://github.com/wenmingvs/AndroidProcess)
* [Checking if an Android application is running in the background](http://stackoverflow.com/questions/3667022/checking-if-an-android-application-is-running-in-the-background/5862048#5862048)
