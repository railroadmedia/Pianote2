import React from 'react';
import { Linking, View, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Download_V2 } from 'RNDownload';
import { bindActionCreators } from 'redux';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
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
import { NetworkContext } from '../../context/NetworkProvider';
import RNFetchBlob from 'rn-fetch-blob';
import commonService from '../../services/common.service';
import navigationService from '../../services/navigation.service';
import { navigate, reset } from '../../../AppNavigator';
import { setLoggedInUser } from '../../redux/UserActions';

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
  async componentDidMount() {
    Download_V2.resumeAll()?.then(async () => {
      this.loadCache();
      await SplashScreen.hide();
      let data = (
        await AsyncStorage.multiGet([
          'loggedIn',
          'resetKey',
          'email',
          'password'
        ])
      ).reduce((i, j) => {
        i[j[0]] = j[1] === 'true' ? true : j[1] === 'false' ? false : j[1];
        i[j[0]] = j[1] === 'undefined' ? undefined : j[1];
        return i;
      }, {});
      await AsyncStorage.removeItem('resetKey');
      const { email, resetKey, password } = data;

      if (!this.context.isConnected) {
        if (email && !global.loadedFromNotification)
          return navigate('DOWNLOADS');
        else return navigate('LOGIN');
      } else if (!email && !global.loadedFromNotification) {
        if (resetKey) return reset('RESETPASSWORD', { resetKey, email });
        return reset('LOGIN');
      } else {
        const res = await getToken(email, password);
        if (res === 500) return this.context.showNoConnectionAlert();
        else if (res.success) {
          updateFcmToken();
          let userData = await getUserData();
          this.props.setLoggedInUser(userData);
          let { lessonUrl, commentId } = notif;
          if (commonService.urlToOpen) {
            return navigationService.decideWhereToRedirect();
          } else if (lessonUrl && commentId) {
            reset('VIEWLESSON', { url: lessonUrl, commentId });
          } else if (global.loadedFromNotification) {
            reset('PROFILE');
          } else if (resetKey) {
            reset('RESETPASSWORD', { resetKey, email });
          } else {
            let { params: { postId, threadTitle } = {} } = this.props.route;
            if (postId) {
              reset('LESSONS');
              navigate('FORUM', {
                NetworkContext,
                tryCall: commonService.tryCall.bind(commonService),
                rootUrl: commonService.rootUrl,
                isDark: true,
                appColor: colors.pianoteRed,
                user: this.props.user,
                postId,
                threadTitle
              });
            }
            if (userData.isPackOlyOwner) {
              global.isPackOnly = userData.isPackOlyOwner;
              global.expirationDate = userData.expirationDate;
              if (!global.notifNavigation) reset('PACKS');
            } else if (userData.isLifetime || userData.isMember) {
              if (!global.notifNavigation) reset('LESSONS');
            } else {
              navigate('MEMBERSHIPEXPIRED', {
                email: this.state.email,
                password: this.state.password,
                token: res.token
              });
            }
          }
        } else if (!res.success || !email) {
          if (resetKey) return reset('RESETPASSWORD', { resetKey, email });
          return reset('LOGIN');
        }
      }
    });
  }

  loadCache = () => {
    let { dirs } = RNFetchBlob.fs;
    cache.map(c => {
      RNFetchBlob.fs
        .readFile(`${dirs.LibraryDir || dirs.DocumentDir}/${c}`, 'utf8')
        .then(stream => this.props[c]?.(JSON.parse(stream)))
        .catch(() => {});
    });
  };

  async handleNoConnection() {
    let email = await AsyncStorage.getItem('email');
    if (email) return reset('DOWNLOADS');
    else reset('LOGINCREDENTIALS');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerInner}>
          <Pianote
            height={styles.height}
            width={styles.width}
            fill={colors.pianoteRed}
          />
        </View>
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
      cacheStudentFocus,
      setLoggedInUser: user => dispatch(setLoggedInUser(user))
    },
    dispatch
  );

const mapStateToProps = state => ({
  user: state.userState?.user
});

const styles = StyleSheet.create({
  container: { flex: 1, alignSelf: 'stretch' },
  containerInner: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 4,
    elevation: 4,
    backgroundColor: 'black'
  },
  height:
    77.5 *
    (windowDim.width < windowDim.height ? factorVertical : factorHorizontal),
  width:
    190 *
    (windowDim.width < windowDim.height ? factorHorizontal : factorVertical)
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadPage);
