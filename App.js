import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';
import { Linking, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import AppNavigator from './AppNavigator';

import NavigationService from './src/services/navigation.service';

import NetworkProvider from './src/context/NetworkProvider';

import packsReducer from './src/redux/PacksCacheReducer';
import myListReducer from './src/redux/MyListCacheReducer';
import lessonsReducer from './src/redux/LessonsCacheReducer';

const store = createStore(
  combineReducers({ ...packsReducer, ...myListReducer, ...lessonsReducer })
);
export default class App extends React.Component {
  componentDidMount() {
    Linking.getInitialURL()
      .then(ev => {
        if (ev) this.handleOpenURL({ url: ev });
      })
      .catch(error => console.log(error));
    Linking.addEventListener('url', this.handleOpenURL);
  }

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
      <Provider store={store}>
        <NetworkProvider>
          <StatusBar barStyle='light-content' />
          <AppNavigator
            ref={navigatorRef =>
              NavigationService.setTopLevelNavigator(navigatorRef)
            }
          />
        </NetworkProvider>
      </Provider>
    );
  }
}
