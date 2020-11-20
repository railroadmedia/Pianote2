'use strict';

import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

var React = require('react-native');

const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;

var { StyleSheet } = React;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch'
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  fullScreenPortrait: {
    height: global.fullHeight,
    width: global.fullWidth
  },
  redButton: {
    zIndex: 5,
    width: DeviceInfo.isTablet() ? fullWidth * 0.15 : fullWidth * 0.225,
    height: DeviceInfo.isTablet() ? fullWidth * 0.15 : fullWidth * 0.225,
    backgroundColor: '#fb1b2f',
    borderRadius: 200
  },
  innerRedButton: {
    width: DeviceInfo.isTablet() ? fullWidth * 0.15 : fullWidth * 0.225,
    height: DeviceInfo.isTablet() ? fullWidth * 0.15 : fullWidth * 0.225
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: fullHeight * 0.175,
    width: fullWidth
  }
});
