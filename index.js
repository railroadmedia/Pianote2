/**
 * Index
 */
import {AppRegistry, Dimensions, StatusBar, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {configure} from '@musora/services';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

Orientation.lockToPortrait();
AppRegistry.registerComponent(appName, () => App);
console.disableYellowBox = true;

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

configure({
    baseURL: 'https://app-staging.pianote.com',
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
});
