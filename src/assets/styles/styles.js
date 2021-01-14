'use strict';

import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

var React = require('react-native');

const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;
const factorHorizontal = Dimensions.get('window').width / 375;
const factorVertical = Dimensions.get('window').height / 812;
const factorRatio =
  (Dimensions.get('window').height / 812 +
    Dimensions.get('window').width / 375) /
  2;

var { StyleSheet } = React;

module.exports = StyleSheet.create({
  modalContainer: {
    margin: 0,
    flex: 1
  },
  buttonText: {
    color: 'white',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: 14 * factorRatio
  },
  searchContainer: {
    marginTop: fullHeight * 0.04,
    flexDirection: 'row',
    paddingLeft: 15
  },
  searchBox: {
    flex: 1,
    backgroundColor: '#f3f6f6',
    borderRadius: 60 * factorHorizontal,
    flexDirection: 'row'
  },
  recentSearches: {
    marginTop: fullHeight * 0.02,
    flexDirection: 'row',
    marginBottom: 10 * factorRatio,
    justifyContent: 'space-between'
  },
  cancelSearch: {
    textAlign: 'center',
    fontSize: 12 * factorRatio,
    color: '#fb1b2f',
    fontFamily: 'OpenSans-Bold'
  },
  searchText: {
    flex: 0.9,
    color: 'grey',
    marginTop: 12.5 * factorVertical,
    paddingBottom: 12.5 * factorVertical,
    justifyContent: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16 * factorRatio
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
    fontSize: 22 * factorRatio,
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
    padding: 15 * factorRatio
  },
  filterHeader: {
    fontSize: 18 * factorRatio,
    marginBottom: 12.5 * factorVertical,
    marginTop: 12.5 * factorVertical,
    textAlign: 'left',
    fontFamily: 'RobotoCondensed-Bold',
    color: '#445f73',
    paddingLeft: fullWidth * 0.035
  },
  container: {
    flex: 1,
    alignSelf: 'stretch'
  },
  settingsText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18 * factorRatio,
    color: '#445f73'
  },
  tabRightContainerText: {
    paddingLeft: 12 * factorHorizontal,
    fontSize: 20 * factorRatio,
    marginBottom: 5 * factorVertical,
    textAlign: 'left',
    fontFamily: 'RobotoCondensed-Bold',
    color: '#445f73',
    paddingVertical: 10 * factorVertical
  },
  tabRightContainer: {
    paddingRight: 20 * factorHorizontal,
    width: '100%',
    borderTopWidth: 0.25 * factorRatio,
    borderTopColor: '#445f73',
    borderBottomWidth: 0.25 * factorRatio,
    borderBottomColor: '#445f73',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentPageHeader: {
    paddingLeft: 15,
    fontSize: 30 * factorRatio,
    color: 'white',
    fontFamily: 'OpenSans-ExtraBold'
  },
  modalHeaderText: {
    fontFamily: 'OpenSans-ExtraBold',
    textAlign: 'center',
    fontSize: 18 * factorRatio
  },
  modalCancelButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: 12 * factorRatio
  },
  modalButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: 15 * factorRatio
  },
  modalBodyText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: 15 * factorRatio
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
