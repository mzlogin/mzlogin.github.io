---
layout: wiki
title: Intent
cate1: Android
cate2: Components
description: Intent
keywords: Android
---

## Intent 匹配

### 使用 PackageManager 返回能接受特定 Intent 的组件

* [queryIntentActivities()](https://developer.android.com/reference/android/content/pm/PackageManager.html#queryIntentActivities(android.content.Intent, int\))

* [queryIntentServices()](https://developer.android.com/reference/android/content/pm/PackageManager.html#queryIntentServices(android.content.Intent, int\))

* [queryBroadcastReceivers()](https://developer.android.com/reference/android/content/pm/PackageManager.html#queryBroadcastReceivers(android.content.Intent, int\))

### 判断是否有 Activity 能处理 Intent

* [Intent.resolveActivity()](https://developer.android.com/reference/android/content/Intent.html#resolveActivity(android.content.pm.PackageManager\))

* [Intent.resolveActivityInfo()](https://developer.android.com/reference/android/content/Intent.html#resolveActivityInfo(android.content.pm.PackageManager, int\))

### 强制使用应用选择器

```java
Intent sendIntent = new Intent(Intent.ACTION_SEND);
...

// Always use string resources for UI text.
// This says something like "Share this photo with"
String title = getResources().getString(R.string.chooser_title);
// Create intent to show the chooser dialog
Intent chooser = Intent.createChooser(sendIntent, title);

// Verify the original intent will resolve to at least one activity
if (sendIntent.resolveActivity(getPackageManager()) != null) {
    startActivity(chooser);
}
```

### 点击链接启动其它应用

通过 Intent 实现，需要其它应用注册了对应的 intent-filter，包括 action、category 及 data（schema、host、pathPrefix）和 mimeType 等。

### 打开系统设置界面

android.provider.Settings类提供android系统各个页面的跳转常量，比如打开“开发者选项”页面：

```java
startActivity(new Intent(Settings.ACTION_APPLICATION_DEVELOPMENT_SETTINGS));
```

Action 列表（有可能需要配合包名类名打开）：

| Action                                  | 功能                                                       | 原文                                                                                                                     |
|-----------------------------------------|------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| ACTION_ACCESSIBILITY_SETTINGS           | 辅助功能模块的显示设置。                                   | Activity Action: Show settings for accessibility modules.                                                                |
| ACTION_ADD_ACCOUNT                      | 显示屏幕上创建一个新帐户添加帐户。                         | Activity Action: Show add account screen for creating a new account.                                                     |
| ACTION_AIRPLANE_MODE_SETTINGS           | 显示设置，以允许进入/退出飞行模式。                        | Activity Action: Show settings to allow entering/exiting airplane mode.                                                  |
| ACTION_APN_SETTINGS                     | 显示设置，以允许配 置的APN。                               | Activity Action: Show settings to allow configuration of APNs.                                                           |
| ACTION_APPLICATION_DETAILS_SETTINGS     | 有关特定应用程序的详细信息的显示屏幕。                     | Activity Action: Show screen of details about a particular application.                                                  |
| ACTION_APPLICATION_DEVELOPMENT_SETTINGS | 显示设置，以允许应用程序开发相关的设置配置                 | Activity Action: Show settings to allow configuration of application development-related settings.                       |
| ACTION_APPLICATION_SETTINGS             | 显示设置，以允许应用程序相关的设置配置                     | Activity Action: Show settings to allow configuration of application-related settings.                                   |
| ACTION_BLUETOOTH_SETTINGS               | 显示设置，以允许蓝牙配置                                   | Activity Action: Show settings to allow configuration of Bluetooth.                                                      |
| ACTION_DATA_ROAMING_SETTINGS            | 选择of2G/3G显示设置                                        | Activity Action: Show settings for selection of2G/3G.                                                                    |
| ACTION_DATE_SETTINGS                    | 显示日期和时间设置，以允许配 置                            | Activity Action: Show settings to allow configuration of date and time.                                                  |
| ACTION_DEVICE_INFO_SETTINGS             | 显示一般的设备信息设置（序列号，软件版本，电话号码，等）   | Activity Action: Show general device information settings (serial number, software version, phone number, etc.).         |
| ACTION_DISPLAY_SETTINGS                 | 显示设置，以允许配 置显示                                  | Activity Action: Show settings to allow configuration of display.                                                        |
| ACTION_INPUT_METHOD_SETTINGS            | 特别配置的输入方法，允许用户启用输入法的显示设置           | Activity Action: Show settings to configure input methods, in particular allowing the user to enable input methods.      |
| ACTION_INPUT_METHOD_SUBTYPE_SETTINGS    | 显示设置来启用/禁用输入法亚型                              | Activity Action: Show settings to enable/disable input method subtypes.                                                  |
| ACTION_INTERNAL_STORAGE_SETTINGS        | 内部存储的显示设置                                         | Activity Action: Show settings for internal storage.                                                                     |
| ACTION_LOCALE_SETTINGS                  | 显示设置，以允许配 置的语言环境                            | Activity Action: Show settings to allow configuration of locale.                                                         |
| ACTION_LOCATION_SOURCE_SETTINGS         | 显示设置，以允许当前位置源的配置                           | Activity Action: Show settings to allow configuration of current location sources.                                       |
| ACTION_MANAGE_ALL_APPLICATIONS_SETTINGS | 显示设置来管理所有的应用程序                               | Activity Action: Show settings to manage all applications.                                                               |
| ACTION_MANAGE_APPLICATIONS_SETTINGS     | 显示设置来管理安装的应用程序                               | Activity Action: Show settings to manage installed applications.                                                         |
| ACTION_MEMORY_CARD_SETTINGS             | 显示设置为存储卡存储                                       | Activity Action: Show settings for memory card storage.                                                                  |
| ACTION_NETWORK_OPERATOR_SETTINGS        | 选择网络运营商的显示设置                                   | Activity Action: Show settings for selecting the network operator.                                                       |
| ACTION_PRIVACY_SETTINGS                 | 显示设置，以允许配 置隐私选项                              | Activity Action: Show settings to allow configuration of privacy options.                                                |
| ACTION_QUICK_LAUNCH_SETTINGS            | 显示设置，以允许快速启动快捷键的配置                       | Activity Action: Show settings to allow configuration of quick launch shortcuts.                                         |
| ACTION_SEARCH_SETTINGS                  | 全局搜索显示设置                                           | Activity Action: Show settings for global search.                                                                        |
| ACTION_SECURITY_SETTINGS                | 显示设置，以允许配 置的安全性和位置隐私                    | Activity Action: Show settings to allow configuration of security and location privacy.                                  |
| ACTION_SETTINGS                         | 显示系统设置                                               | Activity Action: Show system settings.                                                                                   |
| ACTION_SOUND_SETTINGS                   | 显示设置，以允许配 置声音和音量                            | Activity Action: Show settings to allow configuration of sound and volume.                                               |
| ACTION_SYNC_SETTINGS                    | 显示设置，以允许配 置同步设置                              | Activity Action: Show settings to allow configuration of sync settings.                                                  |
| ACTION_USER_DICTIONARY_SETTINGS         | 显示设置来管理用户输入字典                                 | Activity Action: Show settings to manage the user input dictionary.                                                      |
| ACTION_WIFI_IP_SETTINGS                 | 显示设置，以允许配 置一个静态IP地址的Wi – Fi               | Activity Action: Show settings to allow configuration of a static IP address for Wi-Fi.                                  |
| ACTION_WIFI_SETTINGS                    | 显示设置，以允许Wi – Fi配置                                | Activity Action: Show settings to allow configuration of Wi-Fi.                                                          |
| ACTION_WIRELESS_SETTINGS                | 显示设置，以允许配 置，如Wi – Fi，蓝牙和移动网络的无线控制 | Activity Action: Show settings to allow configuration of wireless controls such as Wi-Fi, Bluetooth and Mobile networks. |
| AUTHORITY                               |                                                            |                                                                                                                          |
| EXTRA_AUTHORITIES                       | 在推出活动的基础上给予的权力限制可选项。                   | Activity Extra: Limit available options in launched activity based on the given authority.                               |
| EXTRA_INPUT_METHOD_ID                   |                                                            |                                                                                                                          |

## 参考

* [Intent 和 Intent 过滤器](https://developer.android.com/guide/components/intents-filters.html)
* [android 打开系统设置界面](http://bgj.iteye.com/blog/1995430)
