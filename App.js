import 'react-native-gesture-handler';
import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Text, Linking, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';
import AppNavigator, { reset } from './AppNavigator';

import { cardsReducer } from './src/catalogue/index';
import commonService from './src/services/common.service';

const store = createStore(combineReducers({ ...cardsReducer }));

export default class App extends React.Component {
  constructor(props) {
    Text.defaultProps = {};
    Text.defaultProps.maxFontSizeMultiplier = 1;
    super(props);
    if (DeviceInfo.isTablet()) Orientation.unlockAllOrientations();
    else Orientation.lockToPortrait();
    global.notifNavigation = false;
  }

  componentDidMount() {
    Linking.getInitialURL()
      .then(ev => {
        if (ev) this.handleOpenURL({ url: ev });
      })
      .catch(_ => {});
    Linking.addEventListener('url', this.handleOpenURL);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = async ({ url }) => {
    if (url) {
      if (url.includes('/reset-password')) {
        let resetKey = url.split('token=')[1].split('&email')[0];
        let email = url.split('email=')[1];
        await AsyncStorage.multiSet([
          ['resetKey', resetKey],
          ['email', email]
        ]);
      } else {
        commonService.urlToOpen = url;
      }
      reset('LOADPAGE');
    }
  };

  render() {
    return (
      <Provider store={store}>
        <StatusBar barStyle='light-content' />
        <AppNavigator />
      </Provider>
    );
  }
}
