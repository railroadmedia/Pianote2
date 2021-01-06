'use strict';

import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

var React = require('react-native');

const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;
const factorHorizontal = Dimensions.get('window').width / 375;
const factorVertical = Dimensions.get('window').height / 812;
const factorRatio = (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2;

var { StyleSheet } = React;

module.exports = StyleSheet.create({
  methodContainer: {
    flex: 1, 
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    alignSelf: 'stretch'
  },
  modalHeaderText: {
    fontFamily: 'OpenSans-ExtraBold',
    textAlign: 'center',
    fontSize: 18 * factorRatio,
  }, 
  modalCancelButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: 12 * factorRatio,
  }, 
  modalButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: 15 * factorRatio,
  }, 
  modalBodyText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: 15 * factorRatio,
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
