/**
 * Index
 */
import { AppRegistry, Dimensions } from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { configure } from '@musora/services';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

Orientation.lockToPortrait();
AppRegistry.registerComponent(appName, () => App);
console.disableYellowBox = true;

global.styles = require('Pianote2/src/assets/styles/styles.js');
global.fullWidth = Dimensions.get('window').width
global.fullHeight = Dimensions.get('window').height
global.factorHorizontal = Dimensions.get('window').width/375
global.factorVertical = Dimensions.get('window').height/812
global.factorRatio = (Dimensions.get('window').height/812 + Dimensions.get('window').width/375)/2
global.isTablet = DeviceInfo.isTablet()
global.hasNotch = DeviceInfo.hasNotch()

configure({
    'baseURL': 'https://staging.musora.com',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
})

/**
    'baseURL': 'https://staging.musora.com',
    'baseURL': 'https://staging.pianote.com',
 */