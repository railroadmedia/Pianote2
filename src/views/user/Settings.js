import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  StatusBar,
  StyleSheet,
  Linking
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNIap from 'react-native-iap';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import Intercom from 'react-native-intercom';
import Icon from '../../assets/icons.js';
import Back from '../../assets/img/svgs/back.svg';
import NavigationBar from '../../components/NavigationBar.js';
import Loading from '../../components/Loading.js';
import CustomModal from '../../modals/CustomModal.js';
import { logOut, restorePurchase } from '../../services/UserDataAuth.js';
import { SafeAreaView } from 'react-navigation';
import { NetworkContext } from '../../context/NetworkProvider.js';
import commonService from '../../services/common.service.js';
import { cacheAndWriteCourses } from '../../redux/CoursesCacheActions';
import { cacheAndWriteLessons } from '../../redux/LessonsCacheActions';
import { cacheAndWriteMyList } from '../../redux/MyListCacheActions';
import { cacheAndWritePacks } from '../../redux/PacksCacheActions';
import { cacheAndWritePodcasts } from '../../redux/PodcastsCacheActions';
import { cacheAndWriteQuickTips } from '../../redux/QuickTipsCacheActions';
import { cacheAndWriteSongs } from '../../redux/SongsCacheActions';
import { cacheAndWriteStudentFocus } from '../../redux/StudentFocusCacheActions';
import { goBack, navigate, reset } from '../../../AppNavigator.js';
import { setLoggedInUser } from '../../redux/UserActions.js';

const isTablet = DeviceInfo.isTablet();
let localStyles;

class Settings extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    localStyles = setStyles(this.props.theme === 'light', colors.pianoteRed);

    this.state = {
      showLogOut: false
    };
  }

  manageSubscriptions = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let { isAppleAppSubscriber, isGoogleAppSubscriber } = this.props.user;
    if (isiOS) {
      if (isAppleAppSubscriber) {
        Alert.alert(
          'Manage Subscription',
          'You have an Apple App Store subscription that can only be managed through the Apple I.D. used to purchase it.',
          [
            {
              text: 'View Subscriptions',
              onPress: () =>
                Linking.openURL(
                  'itms-apps://apps.apple.com/account/subscriptions'
                )
            }
          ],
          {
            cancelable: false
          }
        );
      } else {
        Alert.alert(
          'Manage Subscription',
          'Sorry! You can only manage your Apple App Store based subscriptions here.',
          [{ text: 'Got it!' }],
          {
            cancelable: false
          }
        );
      }
    } else {
      if (isGoogleAppSubscriber) {
        Alert.alert(
          'Manage Subscription',
          'You have a Google Play subscription that can only be managed through the Google Account used to purchase it.',
          [
            {
              text: 'View Subscriptions',
              onPress: () =>
                Linking.openURL(
                  'https://play.google.com/store/account/subscriptions'
                )
            }
          ],
          {
            cancelable: false
          }
        );
      } else {
        Alert.alert(
          'Manage Subscription',
          'You can only manage Google Play subscriptions here. Please sign in to Pianote on your original subscription platform to manage your settings.',
          [{ text: 'Got it!' }],
          {
            cancelable: false
          }
        );
      }
    }
  };

  restorePurchase = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.loadingRef?.toggleLoading();
    try {
      await RNIap.initConnection();
    } catch (e) {
      this.loadingRef?.toggleLoading();
      return this.customModal.toggle(
        'Connection to app store refused',
        'Please try again later.'
      );
    }
    try {
      let purchases = await RNIap.getPurchaseHistory();
      if (!purchases.length) {
        this.loadingRef?.toggleLoading();
        return this.restoreSuccessfull.toggle(
          'Restore',
          'All purchases restored'
        );
      }
      if (!isiOS) {
        purchases = purchases.map(m => {
          return {
            purchase_token: m.purchaseToken,
            package_name: 'com.pianote2',
            product_id: m.productId
          };
        });
      }
      let restoreResponse = await restorePurchase(purchases);
      this.loadingRef?.toggleLoading();
      if (restoreResponse.title && restoreResponse.message)
        return this.customModal.toggle(
          restoreResponse.title,
          restoreResponse.message
        );
      if (restoreResponse.email) {
        this.loadingRef?.toggleLoading();
        await logOut();
        this.props.setLoggedInUser({});
        this.loadingRef?.toggleLoading();
        navigate('LOGINCREDENTIALS', {
          email: restoreResponse.email
        });

        return Alert.alert(
          'Restore',
          `This ${
            isiOS ? 'Apple' : 'Google'
          } account is already linked to another Pianote account. Please login with that account.`,
          [{ text: 'OK' }],
          { cancelable: false }
        );
      } else if (restoreResponse.token) {
        reset('LESSONS');
      } else if (restoreResponse.shouldCreateAccount) navigate('CREATEACCOUNT');
    } catch (err) {
      this.loadingRef?.toggleLoading();
      this.customModal.toggle(
        'Something went wrong',
        'Please try Again later.'
      );
    }
  };

  logOut = () => {
    [
      'cacheAndWriteCourses',
      'cacheAndWriteLessons',
      'cacheAndWriteMyList',
      'cacheAndWritePacks',
      'cacheAndWritePodcasts',
      'cacheAndWriteQuickTips',
      'cacheAndWriteSongs',
      'cacheAndWriteStudentFocus'
    ].map(redux => this.props[redux]({}));
    logOut();
    this.props.setLoggedInUser({});
    Intercom.logout();
    AsyncStorage.clear();
    reset('LOGIN');
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar
          backgroundColor={colors.mainBackground}
          barStyle={'light-content'}
        />
        <View style={localStyles.header}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => goBack()}>
            <Back
              width={backButtonSize}
              height={backButtonSize}
              fill={colors.secondBackground}
            />
          </TouchableOpacity>

          <Text
            style={[styles.childHeaderText, { color: colors.secondBackground }]}
          >
            Settings
          </Text>
          <View style={{ flex: 1 }} />
        </View>

        <ScrollView style={styles.mainContainer}>
          {[
            {
              nav: () => navigate('PROFILESETTINGS'),
              title: 'Profile Settings',
              icon: (
                <Icon.Feather
                  name={'user'}
                  size={onTablet ? 30 : 20}
                  color={colors.pianoteRed}
                />
              )
            },
            {
              nav: () => navigate('NOTIFICATIONSETTINGS'),
              title: 'Notification Settings',
              icon: (
                <Icon.Ionicons
                  name={'ios-notifications-outline'}
                  color={colors.pianoteRed}
                  size={onTablet ? 35 : 27.5}
                />
              )
            },
            {
              nav: this.manageSubscriptions,
              title: 'Manage Subscriptions',
              icon: (
                <Icon.AntDesign
                  name={'folder1'}
                  size={onTablet ? 30 : 20}
                  color={colors.pianoteRed}
                />
              )
            },
            {
              nav: this.restorePurchase,
              title: 'Restore Purchases',
              icon: (
                <Icon.AntDesign
                  name={'creditcard'}
                  size={onTablet ? 30 : 20}
                  color={colors.pianoteRed}
                />
              )
            },
            {
              nav: () => navigate('SUPPORT'),
              title: 'Support',
              icon: (
                <Icon.FontAwesome
                  name={'support'}
                  size={onTablet ? 30 : 20}
                  color={colors.pianoteRed}
                />
              )
            },
            {
              nav: () => navigate('TERMS'),
              title: 'Terms of Use',
              icon: (
                <Icon.AntDesign
                  name={'form'}
                  size={onTablet ? 30 : 20}
                  color={colors.pianoteRed}
                />
              )
            },
            {
              nav: () => navigate('PRIVACYPOLICY'),
              title: 'Privacy Policy',
              icon: (
                <Icon.FontAwesome
                  name={'shield'}
                  color={colors.pianoteRed}
                  size={onTablet ? 32.5 : 22.5}
                />
              )
            },
            {
              nav: () => this.setState({ showLogOut: true }),
              title: 'Log Out',
              icon: (
                <Icon.AntDesign
                  name={'poweroff'}
                  color={colors.pianoteRed}
                  size={onTablet ? 30 : 20}
                />
              )
            }
          ].map(item => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.centerContent,
                localStyles.container,
                {
                  borderTopWidth: 1,
                  borderTopColor: '#445f73'
                }
              ]}
              onPress={item.nav}
            >
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={[styles.centerContent, { width: onTablet ? 70 : 50 }]}
                >
                  {item.icon}
                </View>
                <Text style={localStyles.settingsText}>{item.title}</Text>
              </View>
              <Icon.AntDesign
                name={'right'}
                size={onTablet ? 30 : 20}
                color={colors.secondBackground}
              />
            </TouchableOpacity>
          ))}
          <Text style={[localStyles.settingsText, localStyles.appText]}>
            APP VERSION {DeviceInfo.getVersion()}
          </Text>
          {commonService.rootUrl.includes('staging') && (
            <Text style={localStyles.buildText}>
              BUILD NUMBER {DeviceInfo.getBuildNumber()}
            </Text>
          )}
        </ScrollView>
        <Modal
          isVisible={this.state.showLogOut}
          style={[styles.centerContent, styles.modalContainer]}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={true}
          onBackButtonPress={() => this.setState({ showLogOut: false })}
        >
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={() => this.setState({ showLogOut: false })}
          >
            <View style={[styles.centerContent, styles.container]}>
              <View style={localStyles.container2}>
                <Text style={[styles.modalHeaderText, localStyles.title]}>
                  Log Out
                </Text>
                <Text style={[styles.modalBodyText, localStyles.description]}>
                  Are you sure that you want to log out?
                </Text>
                <TouchableOpacity
                  style={[styles.centerContent, localStyles.logoutText]}
                  onPress={() => this.logOut()}
                >
                  <Text style={[styles.modalButtonText, localStyles.logout]}>
                    LOG OUT
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.centerContent, localStyles.cancelContainter]}
                  onPress={() => this.setState({ showLogOut: false })}
                >
                  <Text
                    style={[styles.modalCancelButtonText, localStyles.cancel]}
                  >
                    CANCEL
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Loading
          ref={ref => {
            this.loadingRef = ref;
          }}
        />
        <CustomModal
          ref={ref => {
            this.customModal = ref;
          }}
        />
        <CustomModal
          ref={r => (this.restoreSuccessfull = r)}
          additionalBtn={
            <TouchableOpacity
              onPress={() => this.restoreSuccessfull.toggle()}
              style={{
                borderRadius: 50,
                backgroundColor: colors.pianoteRed
              }}
            >
              <Text
                style={{
                  paddingVertical: 10,
                  marginHorizontal: onTablet ? 50 : 75,
                  fontSize: 15,
                  color: '#ffffff',
                  textAlign: 'center',
                  fontFamily: 'OpenSans-Bold'
                }}
              >
                OK
              </Text>
            </TouchableOpacity>
          }
          onClose={() => this.loadingRef?.toggleLoading(false)}
        />
        <NavigationBar currentPage={'PROFILE'} pad={true} />
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      cacheAndWriteCourses,
      cacheAndWriteLessons,
      cacheAndWriteMyList,
      cacheAndWritePacks,
      cacheAndWritePodcasts,
      cacheAndWriteQuickTips,
      cacheAndWriteSongs,
      cacheAndWriteStudentFocus,
      setLoggedInUser: user => dispatch(setLoggedInUser(user))
    },
    dispatch
  );

const mapStateToProps = state => ({
  user: state.userState.user
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

const setStyles = (isLight, appColor) =>
  StyleSheet.create({
    container: {
      height: isTablet ? 70 : 50,
      width: '100%',
      borderBottomColor: isLight ? '#97AABE' : '#445f73',
      borderBottomWidth: 1,
      flexDirection: 'row',
      paddingRight: 10,
      justifyContent: 'space-between'
    },
    container2: {
      backgroundColor: 'white',
      borderRadius: 15,
      margin: 20
    },
    title: {
      marginTop: 20,
      paddingHorizontal: 20
    },
    description: {
      paddingHorizontal: 30,
      marginTop: 10,
      marginBottom: 5,
      fontSize: isTablet ? 18 : 14
    },
    logoutText: {
      backgroundColor: appColor,
      borderRadius: 40,
      marginVertical: 15,
      marginHorizontal: 30,
      fontFamily: 'OpenSans-Bold',
      height: isTablet ? 40 : 30,
      textAlign: 'center'
    },
    logout: {
      color: 'white',
      fontSize: isTablet ? 18 : 14
    },
    cancelContainter: {
      paddingHorizontal: 20,
      marginBottom: 15
    },
    cancel: {
      color: 'grey',
      fontSize: isTablet ? 16 : 12
    },
    settingsText: {
      fontFamily: 'OpenSans-Regular',
      fontSize: isTablet ? 20 : 16,
      color: isLight ? '#97AABE' : '#445f73'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15
    },
    appText: {
      marginTop: 10,
      textAlign: 'center',
      fontSize: isTablet ? 18 : 12
    },
    buildText: {
      fontFamily: 'OpenSans-Regular',
      textAlign: 'center',
      color: isLight ? '#97AABE' : '#445f73',
      marginTop: 10,
      fontSize: isTablet ? 18 : 12
    }
  });
