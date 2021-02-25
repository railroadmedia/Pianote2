/**
 * Index
 */
import {
  AppRegistry,
  Dimensions,
  Platform,
  Linking
} from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { configure } from '@musora/services';
import DeviceInfo from 'react-native-device-info';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
var PushNotification = require('react-native-push-notification');

import NavigationService from './src/services/navigation.service';
import {
  localNotification,
  notif,
  showNotification
} from './src/services/notification.service';
import AsyncStorage from '@react-native-community/async-storage';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

localNotification();
PushNotification.configure({
  onRegister: function () {
    PushNotification.createChannel({
      channelId: 'pianote-app-chanel',
      channelName: 'pianote-app-chanel'
    });
  },
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
          await NavigationService.navigate('PROFILE');
        } else {
          NavigationService.navigate('VIDEOPLAYER', {
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

AppRegistry.registerComponent(appName, () => App);
console.disableYellowBox = true;
global.fullWidth = Dimensions.get('window').width;
global.fullHeight = Dimensions.get('window').height;
global.token = '';
global.onTablet = DeviceInfo.isTablet();
global.loadedFromNotification = false; 
global.isiOS = Platform.OS === 'ios';
global.styles = require('Pianote2/src/assets/styles/styles.js');
global.isConnected = true;
global.isPackOnly = false;
global.paddingInset = (DeviceInfo.isTablet ? 10 : 5) 
global.fallbackThumb = 'https://dmmior4id2ysr.cloudfront.net/assets/images/pianote_fallback_thumb.jpg';
global.backButtonSize = (DeviceInfo.isTablet() ? 17.5 : 25) * factor, 
global.colors = {
  mainBackground: '#00101d',
  secondBackground: '#445f73',
  thirdBackground: '#081826',
  notificationColor: '#002038',
  pianoteRed: '#fb1b2f',
  pianoteGrey: '#6e777a'
};

configure({
  baseURL: 'https://www.pianote.com',
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: 'application/json'
});
