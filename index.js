/**
 * Index
 */
import {AppRegistry, Dimensions, StatusBar, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {configure} from '@musora/services';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
var PushNotification = require('react-native-push-notification');

import NavigationService from './src/services/navigation.service';
import {localNotification, notif} from './src/services/notification.service';

localNotification();
PushNotification.configure({
    requestPermissions: false,
    popInitialNotification: true,
    permissions: {alert: true, sound: true},
    onNotification: function ({data: {commentId, mobile_app_url}, finish}) {
        if (token)
            NavigationService.navigate('VIDEOPLAYER', {
                commentId,
                url: mobile_app_url,
            });
        else {
            notif.commentId = commentId;
            notif.lessonUrl = mobile_app_url;
        }
        finish(PushNotificationIOS?.FetchResult?.NoData);
    },
});

Orientation.lockToPortrait();
AppRegistry.registerComponent(appName, () => App);
console.disableYellowBox = true;

global.token = '';
global.isiOS = Platform.OS === 'ios';
global.styles = require('Pianote2/src/assets/styles/styles.js');
global.statusBarHeight = StatusBar.statusBarHeight || 24;
global.fullWidth = Dimensions.get('window').width;
global.fullHeight = Dimensions.get('window').height;
global.fullScreen = Dimensions.get('screen').height;
global.navHeight =
    Platform.OS == 'android' ? fullScreen - fullHeight - statusBarHeight : 0;
global.factorHorizontal = Dimensions.get('window').width / 375;
global.factorVertical = Dimensions.get('window').height / 812;
global.factorRatio =
    (Dimensions.get('window').height / 812 +
        Dimensions.get('window').width / 375) /
    2;
global.onTablet = DeviceInfo.isTablet();
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
};
global.serverLocation = 'staging.pianote.com';
global.isPackOnly = false;
global.versionNumber = '1.0.9';

configure({
    baseURL: 'https://staging.pianote.com',
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
});
