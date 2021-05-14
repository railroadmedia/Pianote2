import 'react-native-gesture-handler';
import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Text, Linking, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Orientation from 'react-native-orientation-locker';
import AppNavigator, { reset } from './AppNavigator';

import packsReducer from './src/redux/PacksCacheReducer';
import songsReducer from './src/redux/SongsCacheReducer';
import myListReducer from './src/redux/MyListCacheReducer';
import coursesReducer from './src/redux/CoursesCacheReducer';
import lessonsReducer from './src/redux/LessonsCacheReducer';
import podcastsReducer from './src/redux/PodcastsCacheReducer';
import quickTipsReducer from './src/redux/QuickTipsCacheReducer';
import studentFocusReducer from './src/redux/StudentFocusCacheReducer';
import commonService from './src/services/common.service';

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
    if (onTablet) Orientation.unlockAllOrientations();
    else Orientation.lockToPortrait();
    global.notifNavigation = false;
  }

  componentDidMount() {
    Linking.getInitialURL()
      .then(ev => {
        if (ev) this.handleOpenURL({ url: ev });
      })
      .catch(error => console.log(error));
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
