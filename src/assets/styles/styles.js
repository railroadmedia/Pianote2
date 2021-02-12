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
    margin: 0,
    flex: 1
  },
  buttonText: {
    color: 'white',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: DeviceInfo.isTablet() ? 12 * factor : 14 * factor
  },
  searchContainer: {
    marginTop: height * 0.04,
    flexDirection: 'row',
    paddingLeft: 15
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
  cancelSearch: {
    textAlign: 'center',
    fontSize: 12 * factor,
    color: '#fb1b2f',
    fontFamily: 'OpenSans-Bold'
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
    fontSize: 22 * factor,
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
    padding: 15 * factor
  },
  filterHeader: {
    fontSize: 18 * factor,
    marginBottom: 12.5 * factor,
    marginTop: 12.5 * factor,
    textAlign: 'left',
    fontFamily: 'RobotoCondensed-Bold',
    color: '#445f73',
    paddingLeft: width * 0.035
  },
  container: {
    flex: 1,
    alignSelf: 'stretch'
  },
  settingsText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: DeviceInfo.isTablet() ? 14 * factor : 18 * factor,
    color: '#445f73'
  },
  tabRightContainerText: {
    paddingLeft: 10 * factor,
    fontSize: DeviceInfo.isTablet() ? 26 : 20 * factor,
    marginBottom: 5 * factor,
    textAlign: 'left',
    fontFamily: 'RobotoCondensed-Bold',
    color: '#445f73',
    paddingVertical: 10 * factor
  },
  tabRightContainer: {
    paddingRight: 10 * factor,
    width: '100%',
    borderTopWidth: 0.5 * factor,
    borderTopColor: '#445f73',
    borderBottomWidth: 0.5 * factor,
    borderBottomColor: '#445f73',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentPageHeader: {
    paddingLeft: 10 * factor,
    fontSize: 30 * factor,
    color: 'white',
    fontFamily: 'OpenSans-ExtraBold'
  },
  modalHeaderText: {
    fontFamily: 'OpenSans-ExtraBold',
    textAlign: 'center',
    fontSize: 18 * factor
  },
  modalCancelButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: 12 * factor
  },
  modalButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: 15 * factor
  },
  modalBodyText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: 15 * factor
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
