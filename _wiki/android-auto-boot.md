---
layout: wiki
title: 开机自启动
cate1: Android
cate2:
description: 开机自启动
keywords: Android
---

## 使用广播实现

AndroidManifest.xml

```xml
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<application
    ... />
    <receiver android:name=".receiver.AutoBootReceiver">
        <intent-filter>
            <action android:name="android.intent.action.BOOT_COMPLETED" />
        </intent-filter>
    </receiver>
</application>
```

AutoBootReceiver.java

```java
public class AutoBootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (TextUtils.isEmpty(action)) {
            return;
        }

        if (Intent.ACTION_BOOT_COMPLETED.equals(action)) {
            LogUtils.i("receive boot_completed broadcast");
            Intent i = new Intent(context, InitializeActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(i);
        }
    }
}
```
