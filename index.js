/**
 * Index
 */
import {
  AppRegistry,
  Dimensions,
  Platform,
  Linking,
  LogBox
} from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import DeviceInfo from 'react-native-device-info';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

import {
  localNotification,
  notif,
  showNotification
} from './src/services/notification.service';
import AsyncStorage from '@react-native-community/async-storage';
import { navigate, reset } from './AppNavigator';
import navigationService from './src/services/navigation.service';
import commonService from './src/services/common.service';

PushNotification.configure({
  onRegister: () => {},
  requestPermissions: false,
  popInitialNotification: true,
  permissions: { alert: true, sound: true },
  onNotification: async function ({
    data: { commentId, mobile_app_url, image, type, uri },
    finish,
    userInteraction,
    foreground,
    title,
    message,
    id
  }) {
    let isLoggedIn = await AsyncStorage.getItem('loggedIn');
    if (type.includes('forum') && userInteraction) {
      // if the type is forum, link to website forums
      if (foreground) {
        Linking.openURL(uri);
      } else {
        await AsyncStorage.setItem('forumUrl', uri);
      }
    }

    if (token || isLoggedIn) {
      // if logged in with token
      if ((isiOS || (!isiOS && userInteraction)) && !type.includes('forum')) {
        if (type.includes('aggregated')) {
          global.loadedFromNotification = true;
          navigate('PROFILE');
        } else if (type === 'deeplink') {
          commonService.urlToOpen = uri;
          navigationService.decideWhereToRedirect();
        } else if (commentId || mobile_app_url) {
          global.notifNavigation = true;

          navigate('VIDEOPLAYER', {
            commentId,
            url: mobile_app_url
          });
        }
      } else {
        showNotification({
          notification: { body: message, title },
          data: { commentId, mobile_app_url, image, type, uri },
          messageId: id
        });
      }
    } else {
      notif.commentId = commentId;
      notif.lessonUrl = mobile_app_url;
    }

    if (isiOS) {
      finish(PushNotificationIOS?.FetchResult?.NoData);
    } else {
      finish();
    }
  }
});
PushNotification.createChannel({
  channelId: 'pianote-app-channel',
  channelName: 'pianote-app-channel',
  channelDescription: 'Pianote app channel'
});
localNotification();

AppRegistry.registerComponent(appName, () => App);
LogBox.ignoreLogs(['Require cycle:', 'Remote debugger']);
LogBox.ignoreAllLogs(true)
global.fullWidth = Dimensions.get('window').width;
global.fullHeight = Dimensions.get('window').height;
global.token = '';
global.onTablet = DeviceInfo.isTablet();
global.loadedFromNotification = false;
global.isiOS = Platform.OS === 'ios';
global.styles = require('Pianote2/src/assets/styles/styles.js');
global.isConnected = true;
global.isPackOnly = false;
global.paddingInset = 10;
global.fallbackThumb =
  'https://dmmior4id2ysr.cloudfront.net/assets/images/pianote_fallback_thumb.jpg';
(global.backButtonSize = DeviceInfo.isTablet() ? 30 : 22.5),
  (global.colors = {
    mainBackground: '#00101d',
    secondBackground: '#445f73',
    thirdBackground: '#081826',
    notificationColor: '#002038',
    pianoteRed: '#fb1b2f',
    pianoteGrey: '#6e777a'
  });
global.sizing = {
  descriptionText: onTablet ? 16 : 12,
  infoButtonSize: onTablet ? 22.5 : 17.5,
  myListButtonSize: onTablet ? 28 : 22,
  titleVideoPlayer: onTablet ? 24 : 18,
  videoTitleText: onTablet ? 16 : 14,
  verticalListTitleSmall: onTablet ? 18 : 14
};
