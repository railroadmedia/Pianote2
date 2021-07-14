/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import "Orientation.h"
#import <React/RCTBridge.h>
#import <RNHomeIndicator.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"
#import <GoogleCast/GoogleCast.h>

#import "Intercom/intercom.h"
#import <Firebase.h>
#import <RNBackgroundDownloader.h>

#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import <React/RCTLinkingManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = self;
  
  GCKCastOptions* options = [[GCKCastOptions alloc] initWithReceiverApplicationID:kGCKDefaultMediaReceiverApplicationID];
  options.physicalVolumeButtonsWillControlDeviceVolume = YES;
  [GCKCastContext setSharedInstanceWithOptions:options];
  
  if ([FIRApp defaultApp] == nil) {
      [FIRApp configure];
    }
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Pianote2"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  //  prod
   [Intercom setApiKey:@"ios_sdk-d1fb51d50c6c5bb5b0660caf26ffd2346bcc2c1a" forAppId:@"utp2z7ew"];
  //  staging
  // [Intercom setApiKey:@"ios_sdk-0e9598840ab9fbb085fe155be38c4161693e7ff9" forAppId:@"x2x1waf3"];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [HomeIndicatorViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [RNSplashScreen show];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)application:(UIApplication *)application handleEventsForBackgroundURLSession:(NSString *)identifier completionHandler:(void (^)(void))completionHandler
{
  [RNBackgroundDownloader setCompletionHandlerWithIdentifier:identifier completionHandler:completionHandler];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}


@end
