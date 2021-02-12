/**
 * Settings
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  StatusBar,
  StyleSheet,
  Dimensions,
  Linking
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNIap from 'react-native-iap';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LogOut from '../../modals/LogOut.js';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Back from 'Pianote2/src/assets/img/svgs/back.svg';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import { getUserData } from 'Pianote2/src/services/UserDataAuth.js';
import Loading from '../../components/Loading.js';
import CustomModal from '../../modals/CustomModal.js';
import { logOut, restorePurchase } from '../../services/UserDataAuth.js';
import {
  NavigationActions,
  SafeAreaView,
  StackActions
} from 'react-navigation';
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

const windowDim = Dimensions.get('window');
const width = windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height = windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

class Settings extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showLogOut: false
    };
  }

  manageSubscriptions = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    const userData = await getUserData();
    let { isAppleAppSubscriber, isGoogleAppSubscriber } = userData;
    if (Platform.OS === 'ios') {
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
      if (Platform.OS === 'android') {
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
        this.loadingRef?.toggleLoading();
        this.props.navigation.navigate('LOGINCREDENTIALS', {
          email: restoreResponse.email
        });

        return Alert.alert(
          'Restore',
          `This ${
            Platform.OS === 'ios' ? 'Apple' : 'Google'
          } account is already linked to another Pianote account. Please login with that account.`,
          [{ text: 'OK' }],
          { cancelable: false }
        );
      } else if (restoreResponse.token) {
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'LESSONS'
              })
            ]
          })
        );
      } else if (restoreResponse.shouldCreateAccount)
        this.props.navigation.navigate('CREATEACCOUNT');
    } catch (err) {
      this.loadingRef?.toggleLoading();
      this.customModal.toggle(
        'Something went wrong',
        'Please try Again later.'
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar
          backgroundColor={colors.mainBackground}
          barStyle={'light-content'}
        />
        <View style={localStyles.header}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Back
              width={(onTablet ? 17.5 : 25) * factor}
              height={(onTablet ? 17.5 : 25) * factor}
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
          <TouchableOpacity
            style={[
              styles.centerContent,
              localStyles.container,
              {
                borderTopWidth: 0.5 * factor,
                borderTopColor: '#445f73'
              }
            ]}
            onPress={() => {
              this.props.navigation.navigate('PROFILESETTINGS');
            }}
          >
            <View
              style={[styles.centerContent, { width: 60 * factor }]}
            >
              <FeatherIcon
                name={'user'}
                size={(onTablet ? 22.5 : 25) * factor}
                color={colors.pianoteRed}
              />
            </View>
            <Text style={styles.settingsText}>Profile Settings</Text>
            <View style={{ flex: 1 }} />
            <AntIcon
              name={'right'}
              size={(onTablet ? 20 : 25) * factor}
              color={colors.secondBackground}
            />
          </TouchableOpacity>
          <TouchableOpacity
            key={'notificationSettings'}
            onPress={() => {
              this.props.navigation.navigate('NOTIFICATIONSETTINGS');
            }}
            style={[styles.centerContent, localStyles.container]}
          >
            <View
              style={[styles.centerContent, { width: 60 * factor }]}
            >
              <IonIcon
                name={'ios-notifications-outline'}
                color={colors.pianoteRed}
                size={(onTablet ? 27 : 35) * factor}
              />
            </View>
            <Text style={styles.settingsText}>Notification Settings</Text>
            <View style={{ flex: 1 }} />
            <AntIcon
              name={'right'}
              size={(onTablet ? 20 : 25) * factor}
              color={colors.secondBackground}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.centerContent, localStyles.container]}
            onPress={this.manageSubscriptions}
          >
            <View
              style={[styles.centerContent, { width: 60 * factor }]}
            >
              <AntIcon
                name={'folder1'}
                size={(onTablet ? 20 : 25) * factor}
                color={colors.pianoteRed}
              />
            </View>
            <Text style={styles.settingsText}>Manage Subscriptions</Text>
            <View style={{ flex: 1 }} />
            <AntIcon
              name={'right'}
              size={(onTablet ? 20 : 25) * factor}
              color={colors.secondBackground}
            />
          </TouchableOpacity>

          <TouchableOpacity
            key={'restorePurchase'}
            onPress={this.restorePurchase}
            style={[styles.centerContent, localStyles.container]}
          >
            <View
              style={[styles.centerContent, { width: 60 * factor }]}
            >
              <AntIcon
                name={'creditcard'}
                size={(onTablet ? 20 : 25) * factor}
                color={colors.pianoteRed}
              />
            </View>
            <Text style={styles.settingsText}>Restore Purchases</Text>
            <View style={{ flex: 1 }} />
            <AntIcon
              name={'right'}
              size={(onTablet ? 20 : 25) * factor}
              color={colors.secondBackground}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.centerContent, localStyles.container]}
            onPress={() => {
              this.props.navigation.navigate('SUPPORT');
            }}
          >
            <View
              style={[styles.centerContent, { width: 60 * factor }]}
            >
              <FontIcon
                name={'support'}
                size={(onTablet ? 20 : 25) * factor}
                color={colors.pianoteRed}
              />
            </View>
            <Text style={styles.settingsText}>Support</Text>
            <View style={{ flex: 1 }} />
            <AntIcon
              name={'right'}
              size={(onTablet ? 20 : 25) * factor}
              color={colors.secondBackground}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.centerContent, localStyles.container]}
            onPress={() => {
              this.props.navigation.navigate('TERMS');
            }}
          >
            <View
              style={[styles.centerContent, { width: 60 * factor }]}
            >
              <AntIcon
                name={'form'}
                size={(onTablet ? 20 : 25) * factor}
                color={colors.pianoteRed}
              />
            </View>
            <Text style={styles.settingsText}>Terms of Use</Text>
            <View style={{ flex: 1 }} />
            <AntIcon
              name={'right'}
              size={(onTablet ? 20 : 25) * factor}
              color={colors.secondBackground}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.centerContent, localStyles.container]}
            onPress={() => {
              this.props.navigation.navigate('PRIVACYPOLICY');
            }}
          >
            <View
              style={[styles.centerContent, { width: 60 * factor }]}
            >
              <FontIcon
                name={'shield'}
                color={colors.pianoteRed}
                size={(onTablet ? 21.5 : 27.5) * factor}
              />
            </View>
            <Text style={styles.settingsText}>Privacy Policy</Text>
            <View style={{ flex: 1 }} />
            <AntIcon
              name={'right'}
              size={(onTablet ? 20 : 25) * factor}
              color={colors.secondBackground}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.centerContent, localStyles.container]}
            onPress={() => {
              this.setState({ showLogOut: true });
            }}
          >
            <View
              style={[styles.centerContent, { width: 60 * factor }]}
            >
              <AntIcon
                name={'poweroff'}
                color={colors.pianoteRed}
                size={(onTablet ? 18 : 23.5) * factor}
              />
            </View>
            <Text style={styles.settingsText}>Log Out</Text>
            <View style={{ flex: 1 }} />
            <AntIcon
              name={'right'}
              size={(onTablet ? 20 : 25) * factor}
              color={colors.secondBackground}
            />
          </TouchableOpacity>
          <Text style={[styles.settingsText, localStyles.appText]}>
            APP VERSION {DeviceInfo.getVersion()}
          </Text>
          {commonService.rootUrl.includes('staging') && (
            <Text style={localStyles.buildText}>
              BUILD NUMBER {DeviceInfo.getBuildNumber()}
            </Text>
          )}
        </ScrollView>

        <Modal
          key={'logout'}
          isVisible={this.state.showLogOut}
          style={[
            styles.centerContent,
            {
              margin: 0,
              flex: 1
            }
          ]}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={true}
        >
          <LogOut
            onLogout={() =>
              [
                'cacheAndWriteCourses',
                'cacheAndWriteLessons',
                'cacheAndWriteMyList',
                'cacheAndWritePacks',
                'cacheAndWritePodcasts',
                'cacheAndWriteQuickTips',
                'cacheAndWriteSongs',
                'cacheAndWriteStudentFocus'
              ].map(redux => this.props[redux]({}))
            }
            hideLogOut={() => {
              this.setState({ showLogOut: false });
            }}
          />
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
                marginTop: 10,
                borderRadius: 50,
                backgroundColor: colors.pianoteRed
              }}
            >
              <Text
                style={{
                  paddingVertical: 10 * factor,
                  marginHorizontal: (onTablet ? 50 : 75) * factor,
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
          onClose={() => {
            if (this.loadingRef) this.loadingRef.toggleLoading(false);
          }}
        />
        <NavigationBar currentPage={'PROFILE'} pad={true} />
      </SafeAreaView>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    height: (DeviceInfo.isTablet() ? 40 : 50) * factor,
    width: '100%',
    borderBottomColor: '#445f73',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingRight: 15
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15
  },
  appText: {
    marginTop: 10 * factor,
    textAlign: 'center',
    fontSize: DeviceInfo.isTablet() ? 18 : (12 * factor)
  },
  buildText: {
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    color: '#445f73',
    marginTop: 10 * factor,
    fontSize: DeviceInfo.isTablet() ? 18 : (12 * factor)
  }
});
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
      cacheAndWriteStudentFocus
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(Settings);
