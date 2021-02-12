/**
 * Index
 */
import {
  AppRegistry,
  Dimensions,
  StatusBar,
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

global.token = ''
global.onTablet = DeviceInfo.isTablet();
global.loadedFromNotification = false;
global.isiOS = Platform.OS === 'ios';
global.styles = require('Pianote2/src/assets/styles/styles.js');
global.statusBarHeight = StatusBar.statusBarHeight || 24;
global.fullWidth = Dimensions.get('window').width;
global.fullHeight = Dimensions.get('window').height;
global.factorHorizontal = Dimensions.get('window').width / 375;
global.factorVertical = Dimensions.get('window').height / 812;
global.factorRatio = (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2;
global.isNotch = DeviceInfo.hasNotch();
global.navPxFromTop = isNotch
  ? 30 * factorRatio
  : onTablet
  ? -5 * factorVertical
  : Platform.OS == 'android'
  ? 0 * factorRatio
  : 10 * factorRatio;
global.colors = {
  mainBackground: '#00101d',
  secondBackground: '#445f73',
  thirdBackground: '#081826',
  notificationColor: '#002038',
  pianoteRed: '#fb1b2f',
  pianoteGrey: '#4C5253'
};
global.maxLevel = {
  lessons: null,
  packs: null,
  studentFocus: null
};
global.isConnected = true;
global.serverLocation = 'https://staging.pianote.com';
global.isPackOnly = false;
global.versionNumber = '1.0.11';
global.fallbackThumb =
  'https://dmmior4id2ysr.cloudfront.net/assets/images/pianote_fallback_thumb.jpg';

configure({
  baseURL: 'https://www.pianote.com',
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: 'application/json'
});
