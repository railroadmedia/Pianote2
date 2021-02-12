import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';
import { Text, Linking, StatusBar, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';

import AppNavigator from './AppNavigator';

import NavigationService from './src/services/navigation.service';

import NetworkProvider from './src/context/NetworkProvider';

import packsReducer from './src/redux/PacksCacheReducer';
import songsReducer from './src/redux/SongsCacheReducer';
import myListReducer from './src/redux/MyListCacheReducer';
import coursesReducer from './src/redux/CoursesCacheReducer';
import lessonsReducer from './src/redux/LessonsCacheReducer';
import podcastsReducer from './src/redux/PodcastsCacheReducer';
import quickTipsReducer from './src/redux/QuickTipsCacheReducer';
import studentFocusReducer from './src/redux/StudentFocusCacheReducer';

const store = createStore(
  combineReducers({
    ...packsReducer,
    ...songsReducer,
    ...myListReducer,
    ...lessonsReducer,
    ...coursesReducer,
    ...podcastsReducer,
    ...quickTipsReducer,
    ...studentFocusReducer
  })
);
export default class App extends React.Component {
  constructor(props) {
    Text.defaultProps = {};
    Text.defaultProps.maxFontSizeMultiplier = 1;
    super(props);
    this._onOrientationDidChange = this._onOrientationDidChange.bind(this);
    if (DeviceInfo.isTablet()) Orientation.unlockAllOrientations();
    else Orientation.lockToPortrait();
  }

  componentWillMount = () => Orientation.addOrientationListener(this._onOrientationDidChange);

  _onOrientationDidChange = () => {
    global.fullWidth = Dimensions.get('window').width;
    global.fullHeight = Dimensions.get('window').height;
    global.fullScreen = Dimensions.get('screen').height;
    global.navHeight = Platform.OS == 'android' ? fullScreen - fullHeight - statusBarHeight : 0;
    global.factorHorizontal = Dimensions.get('window').width / 375;
    global.factorVertical = Dimensions.get('window').height / 812;
    global.factorRatio = (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2;
    this.forceUpdate()
  }

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
