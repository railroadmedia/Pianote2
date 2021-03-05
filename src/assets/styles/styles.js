'use strict';

import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

var React = require('react-native');

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

var { StyleSheet } = React;

module.exports = StyleSheet.create({
  modalContainer: {
    // simple container for modals
    margin: 0,
    flex: 1
  },
  heightButtons: {
    // the height of buttons like start / more info on lessons
    height: DeviceInfo.isTablet() ? 45 : 35
  },
  activityIndicator: {
    // style for putting on spinners
    padding: 20
  },
  buttonText: {
    color: 'white',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: DeviceInfo.isTablet() ? 12 * factor : 14 * factor
  },
  searchContainer: {
    marginTop: height * 0.04,
    flexDirection: 'row',
    paddingLeft: 5
  },
  searchBox: {
    flex: 1,
    backgroundColor: '#f3f6f6',
    borderRadius: 60 * factor,
    flexDirection: 'row'
  },
  recentSearches: {
    marginTop: height * 0.02,
    flexDirection: 'row',
    marginBottom: 10 * factor,
    justifyContent: 'space-between'
  },
  searchText: {
    flex: 0.9,
    color: 'grey',
    paddingVertical: 12.5 * factor,
    justifyContent: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16 * factor
  },
  mainContainer: {
    backgroundColor: '#00101d',
    flex: 1
  },
  methodContainer: {
    flex: 1,
    backgroundColor: 'black'
  },
  packsContainer: {
    flex: 1,
    backgroundColor: '#081826'
  },
  childHeaderText: {
    // used on search, see all, downloads,
    fontSize: DeviceInfo.isTablet() ? 28 : 20,
    color: 'white',
    fontFamily: 'OpenSans-ExtraBold',
    alignSelf: 'center',
    textAlign: 'center'
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#081826',
    padding: 10
  },
  filterHeader: {
    fontSize: (DeviceInfo.isTablet() ? 12 : 18) * factor,
    marginVertical: 12.5 * factor,
    textAlign: 'left',
    fontFamily: 'RobotoCondensed-Bold',
    color: '#445f73',
    paddingLeft: 5
  },
  container: {
    flex: 1,
    alignSelf: 'stretch'
  },
  tabRightContainerText: {
    // container used for my list in progress & on settings
    paddingLeft: DeviceInfo.isTablet() ? 10 : 5,
    fontSize: DeviceInfo.isTablet() ? 24 : 20,
    textAlign: 'left',
    fontFamily: 'RobotoCondensed-Bold',
    color: '#445f73'
  },
  tabRightContainer: {
    // container used for my list in progress & on settings
    width: '100%',
    borderTopWidth: 0.5,
    paddingVertical: 10,
    borderTopColor: '#445f73',
    borderBottomWidth: 0.5,
    borderBottomColor: '#445f73',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentPageHeader: {
    paddingLeft: 10,
    fontSize: (DeviceInfo.isTablet() ? 22 : 30) * factor,
    color: 'white',
    fontFamily: 'OpenSans-ExtraBold'
  },
  modalHeaderText: {
    fontFamily: 'OpenSans-ExtraBold',
    textAlign: 'center',
    fontSize: (DeviceInfo.isTablet() ? 12.5 : 18) * factor
  },
  modalCancelButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: 12 * factor
  },
  modalButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: (DeviceInfo.isTablet() ? 10 : 15) * factor
  },
  modalBodyText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: (DeviceInfo.isTablet() ? 12 : 16) * factor
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  redButton: {
    zIndex: 5,
    backgroundColor: '#fb1b2f',
    borderRadius: 200
  },
  innerRedButton: {
    width: DeviceInfo.isTablet() ? width * 0.15 : width * 0.225,
    height: DeviceInfo.isTablet() ? width * 0.15 : width * 0.225
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: height * 0.175,
    width: width
  }
});
