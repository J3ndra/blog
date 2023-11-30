---
title: How to create notification in Flutter using Flutter Local Notification
author: Junianto Endra kartika
pubDatetime: 2023-11-28T22:42:51Z
postSlug: how-to-create-notification-in-flutter-using-flutter-local-notification
featured: true
ogImage: https://i.ibb.co/9cnFwYB/flutter-local-notification-og.png
tags:
  - Dart
  - Flutter
description:
  Create notification for Flutter using flutter_local_notifications
---

## Table of contents

In this post, I want to share my experience creating notification in flutter using [flutter_local_notifications](https://pub.dev/packages/flutter_local_notifications).

## SETUP

1. Create new flutter project
   
   ```bash
   flutter create -e flutter_notification --platforms android,ios
   ```

2. After creating the project, add [flutter_local_notifications](https://pub.dev/packages/flutter_local_notifications) dependencies.
   
   ```bash
   flutter pub add flutter_timezone
   flutter pub add flutter_local_notifications
   ```

3. Android device setup
   1. In `android/build.gradle`, make sure `com.android.tools.build:gradle` version is `7.3.1`. If not, you just can change the version
   2. In `android/app/build.gradle`, add code below inside `compileOptions`

      ```bash
      coreLibraryDesugaringEnabled true
      ```

      And then add code below inside `defaultConfig`

      ```bash
      ...
      multiDexEnabled true
      ```

      And last, add code below inside `dependencies`

      ```bash
      implementation 'androidx.window:window:1.0.0'
      implementation 'androidx.window:window-java:1.0.0'
      coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:1.2.2'
      ```
  
   3. Add permission in `android/app/src/main/AndroidManifest.xml` inside `manifest`

      ```xml
      <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
      <uses-permission android:name="android.permission.VIBRATE" />
      <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
      <uses-permission android:name="android.permission.USE_EXACT_ALARM" />
      <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
      ```

      And then add **receiver** inside `application` under the `meta-data`

      ```xml
      <receiver android:exported="false"
          android:name="com.dexterous.flutterlocalnotifications.ScheduledNotificationReceiver" />
      <receiver android:exported="false"
          android:name="com.dexterous.flutterlocalnotifications.ScheduledNotificationBootReceiver">
          <intent-filter>
              <action android:name="android.intent.action.BOOT_COMPLETED" />
              <action android:name="android.intent.action.MY_PACKAGE_REPLACED" />
              <action android:name="android.intent.action.QUICKBOOT_POWERON" />
              <action android:name="com.htc.intent.action.QUICKBOOT_POWERON" />
          </intent-filter>
      </receiver>
      ```

4. For IOS Setup, go to `ios/Runner/AppDelegate.swift` and then add

   ```swift
   FlutterLocalNotificationsPlugin.setPluginRegistrantCallback { (registry) in
      GeneratedPluginRegistrant.register(with: registry)
   }

   if #available(iOS 10.0, *) {
      UNUserNotificationCenter.current().delegate = self as UNUserNotificationCenterDelegate
   }
   ```

   > [Example](https://github.com/MaikuB/flutter_local_notifications/blob/master/flutter_local_notifications/example/ios/Runner/AppDelegate.swift)

5. Try to run to see if the setup is succeed.

## Now, It's time to code!

1. Add this icon to `android/app/src/main/res/drawable` and move the icon inside `drawable` folder.
   ![App Icon](@assets/images/flutter_local_notification/app_icon.png)
   > Or you can download it from [here](https://www.pngwing.com/en/free-png-aaxil/download).

2. Open `main.dart` and replace it with
   ```dart
   void main() {
      runApp(const MainApp());
   }

   class MainApp extends StatelessWidget {
      const MainApp({super.key});

      @override
      Widget build(BuildContext context) {
         return MaterialApp(
            debugShowCheckedModeBanner: false,
            home: Scaffold(
               appBar: AppBar(
                  title: const Text('Notification Demo'),
               ),
               body: Center(
                  child: Column(
                     mainAxisAlignment: MainAxisAlignment.center,
                     children: [
                        ElevatedButton(
                           onPressed: () {
                              NotificationService().showNotification(
                              title: 'Notification Demo',
                              body: 'This is a notification demo',
                              );
                           },
                           child: const Text('Show Notification'),
                        ),
                        ElevatedButton(
                           onPressed: () {
                              NotificationService().showNotification(
                              title: 'Notification Demo',
                              body: 'This is a notification demo',
                              payload: 'This is a notification demo',
                              );
                           },
                           child: const Text('Show Notification with Payload'),
                        ),
                        ElevatedButton(
                           onPressed: () {
                              NotificationService().showScheduledNotification(
                              title: 'Notification Demo',
                              body: 'This is a scheduled notification demo',
                              );
                           },
                           child: const Text('Show Notification with Schedule Notification'),
                        ),
                     ],
                  ),
               ),
            ),
         );
      }
   }
   ```
   > This code will add three button to test our notification to work properly. Now, try to `hot reload` or run the code.

   ![Example One](@assets/images/flutter_local_notification/photo_6285324230266568455_y.jpg)

3. Now, create new file called `notification_service.dart` to put our services to enable nofication

   ```dart
   import 'package:flutter/foundation.dart';
   import 'package:flutter_local_notifications/flutter_local_notifications.dart';
   import 'package:flutter_timezone/flutter_timezone.dart';
   import 'package:timezone/timezone.dart' as tz;
   import 'package:timezone/data/latest.dart' as tz;

   class NotificationService {
      final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
            FlutterLocalNotificationsPlugin();

      Future<void> initNotification() async {
         await _configureLocalTimeZone();

         AndroidInitializationSettings initializationSettingsAndroid =
            const AndroidInitializationSettings('app_icon');

         var initializationSettingsIOS = DarwinInitializationSettings(
            requestAlertPermission: true,
            requestBadgePermission: true,
            requestSoundPermission: true,
            onDidReceiveLocalNotification: (
            int? id,
            String? title,
            String? body,
            String? payload,
            ) async {},
         );

         var initializationSettings = InitializationSettings(
            android: initializationSettingsAndroid,
            iOS: initializationSettingsIOS,
         );

         await flutterLocalNotificationsPlugin.initialize(initializationSettings,
            onDidReceiveNotificationResponse:
                  (NotificationResponse response) async {
            if (kDebugMode) {
            print('onDidReceiveNotificationResponse: $response');
            }
         });

         await flutterLocalNotificationsPlugin
            .resolvePlatformSpecificImplementation<
                  AndroidFlutterLocalNotificationsPlugin>()
            ?.requestNotificationsPermission();
      }

      Future<void> _configureLocalTimeZone() async {
         tz.initializeTimeZones();
         final String timeZoneName = await FlutterTimezone.getLocalTimezone();
         tz.setLocalLocation(tz.getLocation(timeZoneName));
      }

      notificationDetails() {
         return const NotificationDetails(
            android: AndroidNotificationDetails(
               'flutter_channel', // Change this to your channel id
               'Flutter Notification', // Change this to your channel name
               importance: Importance.max,
               priority: Priority.high,
            ),
            iOS: DarwinNotificationDetails());
      }

      Future showScheduledNotification({
         int id = 0,
         required String title,
         required String body,
      }) async {
         flutterLocalNotificationsPlugin.zonedSchedule(
            id,
            title,
            body,
            tz.TZDateTime.now(tz.local).add(const Duration(seconds: 3)),
            notificationDetails(),
            androidScheduleMode: AndroidScheduleMode.exact,
            uiLocalNotificationDateInterpretation:
               UILocalNotificationDateInterpretation.absoluteTime,
         );
      }

      Future showNotification({
         int id = 0,
         String? title,
         String? body,
         String? payload,
      }) async {
         return flutterLocalNotificationsPlugin.show(
            id, title, body, notificationDetails());
      }
   }

   ```
   Let's breakdown the code

   ```dart
   final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();
   ```
   > This code is used for create an instance of the `FlutterLocalNotificationsPlugin` and named `flutterLocalNotificationsPlugin` so we can call the instance directly.


   ```dart
   Future<void> initNotification()
   ```
   > This will be our function to call `initNotification` to start initialization for notification.

   ```dart
   await _configureLocalTimeZone();
   ...
   Future<void> _configureLocalTimeZone() async {
      tz.initializeTimeZones();
      final String timeZoneName = await FlutterTimezone.getLocalTimezone();
      tz.setLocalLocation(tz.getLocation(timeZoneName));
   }
   ```
   > We will need to configure our local time zone to able to work with scheduled notification. So we need to `initializeTimeZones` and `setLocalLocation` to our local time zone.

   ```dart
   AndroidInitializationSettings initializationSettingsAndroid =
        const AndroidInitializationSettings('app_icon');
   ```
   > This will create an instance of `AndroidInitializationSettings` and will set the Android Notification default icon to be `app_icon`. The icon that we already insert it before.

   ```dart
   var initializationSettingsIOS = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
      onDidReceiveLocalNotification: (
         int? id,
         String? title,
         String? body,
         String? payload,
      ) async {},
   );
   ```
   > Instance of `DarwinInitializationSettings` is used for IOS devices, it specifies app permission like alert, badge and sound to able to used it. `onDidReceiveLocalNotification` is used to handling received local notifications on IOS.

   > Sadly I don't have IOS devices so I can't test it on IOS devices.

   ```dart
   var initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
      iOS: initializationSettingsIOS,
   );
   ```
   > Instance of `InitializationSettings` will initialize setting for IOS and Android
   

   ```dart
   await flutterLocalNotificationsPlugin.initialize(initializationSettings,
         onDidReceiveNotificationResponse:
            (NotificationResponse response) async {
      if (kDebugMode) {
         print('onDidReceiveNotificationResponse: $response');
      }
   });
   ```
   > `flutterLocalNotificationsPlugin` will initialized with `InitializationSettings`

   ```dart
   await flutterLocalNotificationsPlugin
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.requestNotificationsPermission();
   ```
   > This code will request any permission that available in Android and IOS to enalbe notification

   ```dart
   notificationDetails() {
      return const NotificationDetails(
         android: AndroidNotificationDetails(
            'flutter_channel', // Change this to your channel id
            'Flutter Notification', // Change this to your channel name
            importance: Importance.max,
            priority: Priority.high,
         ),
         iOS: DarwinNotificationDetails());
   }
   ```
   > This will be our function for detail of notification

   ```dart
   Future showScheduledNotification({
      int id = 0,
      required String title,
      required String body,
   }) async {
      flutterLocalNotificationsPlugin.zonedSchedule(
         id,
         title,
         body,
         tz.TZDateTime.now(tz.local).add(const Duration(seconds: 3)),
         notificationDetails(),
         androidScheduleMode: AndroidScheduleMode.exact,
         uiLocalNotificationDateInterpretation:
            UILocalNotificationDateInterpretation.absoluteTime,
      );
   }

   Future showNotification({
      int id = 0,
      String? title,
      String? body,
      String? payload,
   }) async {
      return flutterLocalNotificationsPlugin.show(
         id, title, body, notificationDetails());
   }
   ```
   > This will be our function to display the notification when we press the button

3. Change `void main` in `main.dart` to
   ```dart
   void main() async {
      WidgetsFlutterBinding.ensureInitialized();

      await NotificationService().initNotification();
      
      runApp(const MainApp());
   }
   ```
   > Don't forget to import the package

## Example

![Request Permission](@assets/images/flutter_local_notification/photo_6285324230266568464_y.jpg)

![Example](@assets/images/flutter_local_notification/example.gif)

## Conclusion

This is how I setup and try to write notification code service in Flutter to be able to run in Android Devices. I don't have any IOS devices in my environment so I'm sorry if my code didn't work well in IOS.

Thank you for your time to read my post! See you next time 👋