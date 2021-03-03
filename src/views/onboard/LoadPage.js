/**
 * LoadPage
 */
import React from 'react';
import { Linking, View, Dimensions, Platform } from 'react-native';

import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { Download_V2 } from 'RNDownload';
import { bindActionCreators } from 'redux';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions, StackActions } from 'react-navigation';

import { getToken, getUserData } from '../../services/UserDataAuth';
import { notif, updateFcmToken } from '../../services/notification.service';

import { cachePacks } from '../../redux/PacksCacheActions';
import { cacheSongs } from '../../redux/SongsCacheActions';
import { cacheMyList } from '../../redux/MyListCacheActions';
import { cacheCourses } from '../../redux/CoursesCacheActions';
import { cacheLessons } from '../../redux/LessonsCacheActions';
import { cachePodcasts } from '../../redux/PodcastsCacheActions';
import { cacheQuickTips } from '../../redux/QuickTipsCacheActions';
import { cacheStudentFocus } from '../../redux/StudentFocusCacheActions';

import Pianote from '../../assets/img/svgs/pianote';

import NoConnection from '../../modals/NoConnection';

import { NetworkContext } from '../../context/NetworkProvider';
import RNFetchBlob from 'rn-fetch-blob';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width < windowDim.height ? windowDim.height : windowDim.width;
const factorHorizontal =
  windowDim.width < windowDim.height ? width / 375 : height / 812;
const factorVertical =
  windowDim.width < windowDim.height ? height / 812 : width / 375;

const cache = [
  'cachePacks',
  'cacheSongs',
  'cacheMyList',
  'cacheLessons',
  'cacheCourses',
  'cachePodcasts',
  'cacheQuickTips',
  'cacheStudentFocus'
];
class LoadPage extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    Download_V2.resumeAll().then(async () => {
      this.loadCache();
      await SplashScreen.hide();

      let data = (
        await AsyncStorage.multiGet([
          'loggedIn',
          'resetKey',
          'email',
          'password',
          'forumUrl'
        ])
      ).reduce((i, j) => {
        i[j[0]] = j[1] === 'true' ? true : j[1] === 'false' ? false : j[1];
        i[j[0]] = j[1] === 'undefined' ? undefined : j[1];
        return i;
      }, {});

      const { email, resetKey, password, loggedIn, forumUrl } = data;

      if (!this.context.isConnected) {
        if (loggedIn && !global.loadedFromNotification) {
          return this.props.navigation.navigate('DOWNLOADS');
        } else {
          return this.props.navigation.navigate('LOGIN');
        }
        // if no connection and logged in
      } else if (!loggedIn && !global.loadedFromNotification) {
        // if not logged in
        return this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'LOGIN'
              })
            ]
          })
        );
      } else {
        // get token
        const res = await getToken(email, password);
        if (res == 500) {
          this.setState({ showNoConnection: true });
        } else if (res.success) {
          updateFcmToken();
          await AsyncStorage.multiSet([['loggedIn', 'true']]);
          let userData = await getUserData();
          let { lessonUrl, commentId } = notif;

          if (lessonUrl && commentId) {
            // if lesson or comment notification go to video
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: 'VIDEOPLAYER',
                    params: {
                      url: lessonUrl,
                      commentId
                    }
                  })
                ]
              })
            );
          } else if (global.loadedFromNotification) {
            // if going to profile page
            await this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: 'PROFILE'
                  })
                ]
              })
            );
          } else if (resetKey) {
            // go to reset pass
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: 'RESETPASSWORD'
                  })
                ]
              })
            );
          } else {
            if (forumUrl) {
              // if user got a forum related notification
              Linking.openURL(forumUrl);
              await AsyncStorage.removeItem('forumUrl');
            }
            // if member then check membership type
            if (userData.isPackOlyOwner) {
              // if pack only, set global variable to true & go to packs
              global.isPackOnly = userData.isPackOlyOwner;
              global.expirationDate = userData.expirationDate;
              await this.props.navigation.dispatch(
                StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({
                      routeName: 'PACKS'
                    })
                  ]
                })
              );
            } else if (userData.isLifetime || userData.isMember) {
              // is logged in with valid membership go to lessons
              if (!global.notifNavigation)
                await this.props.navigation.dispatch(
                  StackActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({
                        routeName: 'LESSONS'
                      })
                    ]
                  })
                );
            } else {
              // membership expired, go to membership expired
              this.props.navigation.navigate('MEMBERSHIPEXPIRED', {
                email: this.state.email,
                password: this.state.password,
                token: res.token
              });
            }
          }
        } else if (!res.success || loggedIn == false || loggedIn == 'false') {
          // is not logged in
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'LOGIN'
                })
              ]
            })
          );
        }
      }
    });
  }

  loadCache = () => {
    let { dirs } = RNFetchBlob.fs;
    cache.map(c =>
      RNFetchBlob.fs
        .readFile(`${dirs.LibraryDir || dirs.DocumentDir}/${c}`, 'utf8')
        .then(stream => this.props[c]?.(JSON.parse(stream)))
        .catch(() => {})
    );
  };

  async handleNoConnection() {
    let isLoggedIn = await AsyncStorage.getItem('loggedIn');
    if (isLoggedIn == 'true') {
      return this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'DOWNLOADS' })]
        })
      );
    } else {
      return this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'LOGINCREDENTIALS' })
          ]
        })
      );
    }
  }

  render() {
    return (
      <View
        style={[
          styles.centerContent,
          {
            flex: 1,
            alignSelf: 'stretch'
          }
        ]}
      >
        <View
          key={'loadPage'}
          style={[
            styles.centerContent,
            {
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              zIndex: 4,
              elevation: Platform.OS == 'android' ? 4 : 0,
              backgroundColor: 'black'
            }
          ]}
        >
          <Pianote
            height={
              77.5 *
              (windowDim.width < windowDim.height
                ? factorVertical
                : factorHorizontal)
            }
            width={
              190 *
              (windowDim.width < windowDim.height
                ? factorHorizontal
                : factorVertical)
            }
            fill={'#fb1b2f'}
          />
        </View>
        <Modal
          key={'NoConnection'}
          isVisible={this.state.showNoConnection}
          style={[
            styles.centerContent,
            {
              margin: 0,
              height: '100%',
              width: '100%'
            }
          ]}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={true}
        >
          <NoConnection
            hideNoConnection={() => {
              this.setState({ showNoConnection: false }),
                this.handleNoConnection();
            }}
          />
        </Modal>
      </View>
    );
  }
}
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      cachePacks,
      cacheSongs,
      cacheMyList,
      cacheLessons,
      cacheCourses,
      cachePodcasts,
      cacheQuickTips,
      cacheStudentFocus
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(LoadPage);
