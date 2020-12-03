import React from 'react';
import { Linking, Platform, StatusBar, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';

import AppNavigator from './AppNavigator';

import NavigationService from './src/services/navigation.service';

import NetworkProvider from './src/context/NetworkProvider';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    if (DeviceInfo.isTablet()) Orientation.unlockAllOrientations();
    else Orientation.lockToPortrait();
  }

  componentDidMount() {
    Linking.getInitialURL()
      .then(ev => {
        if (ev) this.handleOpenURL({ url: ev });
      })
      .catch(error => console.log(error));
    Linking.addEventListener('url', this.handleOpenURL);
    Orientation.addDeviceOrientationListener(this.orientationListener);
  }

  componentWillUnmount() {
    Orientation.removeDeviceOrientationListener(this.orientationListener);
  }

  orientationListener = o => {
    if (o === 'UNKNOWN') return;
    fullWidth = Dimensions.get('window').width;
    fullHeight = Dimensions.get('window').height;
    console.log(fullWidth, fullHeight);
    fullScreen = Dimensions.get('screen').height;
    navHeight =
      Platform.OS == 'android' ? fullScreen - fullHeight - statusBarHeight : 0;
    factorHorizontal = Dimensions.get('window').width / 375;
    factorVertical = Dimensions.get('window').height / 812;
    factorRatio =
      (Dimensions.get('window').height / 812 +
        Dimensions.get('window').width / 375) /
      2;
  };

  handleOpenURL = async ({ url }) => {
    if (url?.includes('pianote.com/reset-password')) {
      let resetKey = url.substring(
        url.indexOf('token=') + 6,
        url.indexOf('&email')
      );
      let email = url.substring(url.indexOf('email=') + 6, url.length);
      await AsyncStorage.multiSet([
        ['resetKey', resetKey],
        ['email', email]
      ]);
    }
  };

  render() {
    return (
      <NetworkProvider>
        <StatusBar barStyle='light-content' />
        <AppNavigator
          ref={navigatorRef =>
            NavigationService.setTopLevelNavigator(navigatorRef)
          }
        />
      </NetworkProvider>
    );
  }
}
