import { AppRegistry, Platform, LogBox } from 'react-native';
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
    data: {
      commentId,
      mobile_app_url,
      image,
      type,
      uri,
      threadTitle,
      threadId
    },
    finish,
    userInteraction,
    title,
    message,
    id
  }) {
    let email = await AsyncStorage.getItem('email');

    if (token || email) {
      // if logged in with token
      if (isiOS || (!isiOS && userInteraction)) {
        if (type.includes('aggregated')) {
          global.loadedFromNotification = true;
          navigate('PROFILE');
        } else if (type === 'deeplink') {
          commonService.urlToOpen = uri;
          navigationService.decideWhereToRedirect();
        } else if (type.includes('lesson')) {
          global.notifNavigation = true;

          navigate('VIEWLESSON', {
            commentId,
            url: mobile_app_url
          });
        } else if (type.includes('forum')) {
          global.notifNavigation = true;

          navigate('LOADPAGE', {
            postId: parseInt(commentId),
            threadId: parseInt(threadId),
            threadTitle
          });
        }
      } else {
        showNotification({
          notification: { body: message, title },
          data: { commentId, mobile_app_url, image, type, uri, threadTitle },
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
LogBox.ignoreAllLogs(true);
global.token = '';
global.onTablet = DeviceInfo.isTablet();
global.loadedFromNotification = false;
global.isiOS = Platform.OS === 'ios';
global.isPackOnly = false;
isDark = false;
global.fallbackThumb =
  'https://dmmior4id2ysr.cloudfront.net/assets/images/pianote_fallback_thumb.jpg';
global.backButtonSize = DeviceInfo.isTablet() ? 30 : 22.5;
global.colors = {
  mainBackground: '#00101d',
  secondBackground: '#445f73',
  thirdBackground: '#081826',
  notificationColor: '#002038',
  pianoteRed: '#fb1b2f',
  pianoteGrey: '#6e777a'
};
global.sizing = {
  descriptionText: onTablet ? 16 : 12,
  infoButtonSize: onTablet ? 22.5 : 17.5,
  myListButtonSize: onTablet ? 28 : 22,
  titleViewLesson: onTablet ? 24 : 18,
  videoTitleText: onTablet ? 16 : 14,
  verticalListTitleSmall: onTablet ? 18 : 14
};
