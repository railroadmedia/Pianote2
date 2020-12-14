/**
 * NewMembership
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  Dimensions,
  PixelRatio,
  StyleSheet
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-navigation';
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener
} from 'react-native-iap';

import { signUp, restorePurchase } from '../../services/UserDataAuth';
import CustomModal from '../../modals/CustomModal';
import Loading from '../../components/Loading';
import CreateAccountStepCounter from './CreateAccountStepCounter';

let purchaseErrorSubscription = null;
let purchaseUpdateSubscription = null;

const skus = Platform.select({
  android: ['pianote_app_1_month_member', 'pianote_app_1_year_member'],
  ios: ['pianote_app_1_month_membership', 'pianote_app_1_year_membership']
});

const benefits = [
  'Pay nothing for 7 days.',
  'Award-winning piano lessons & more.',
  'Access to the Pianote Experience app.',
  'Access to the Pianote Experience website.',
  'Cancel anytime through the App Store.'
];

let isTablet = false;
const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const fontIndex = width / 50;

export default class NewMembership extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    Orientation.lockToPortrait();
    isTablet = DeviceInfo.isTablet();
    this.state = {
      newUser: this.props.navigation.state.params.data.type,
      email: this.props.navigation.state.params.data.email,
      password: this.props.navigation.state.params.data.password,
      token: this.props.navigation.state.params.data.token
    };
  }

  async componentDidMount() {
    try {
      await RNIap.initConnection();
    } catch (e) {}
    purchaseUpdateSubscription = purchaseUpdatedListener(this.pulCallback);
    purchaseErrorSubscription = purchaseErrorListener(e => {
      Alert.alert('Something went wrong', e.message, [{ text: 'OK' }], {
        cancelable: false
      });
    });
    try {
      this.loadingRef.toggleLoading(true);
      const subscriptions = await RNIap.getSubscriptions(skus);
      this.loadingRef.toggleLoading(false);
    } catch (e) {}
  }

  startPlan = async plan => {
    try {
      await RNIap.requestSubscription(plan, false);
    } catch (e) {}
  };

  pulCallback = async purchase => {
    let { transactionReceipt } = purchase;
    if (transactionReceipt) {
      let response = await signUp(
        this.state.email,
        this.state.password,
        purchase,
        this.state.token
      );

      if (response.meta) {
        try {
          await AsyncStorage.multiSet([
            ['loggedIn', 'true'],
            ['email', this.state.email],
            ['password', this.state.password]
          ]);
        } catch (e) {}
        try {
          await RNIap.finishTransaction(purchase, false);
          if (this.state.newUser === 'SIGNUP') {
            this.props.navigation.navigate('CREATEACCOUNT3', {
              data: {
                email: this.state.email,
                password: this.state.password,
                plan: ''
              }
            });
          } else {
            this.props.navigation.navigate('LESSONS');
          }
        } catch (e) {}
      } else {
        let { title, detail } = response.errors[0];
        Alert.alert(title, detail, [{ text: 'OK' }], {
          cancelable: false
        });
      }
    }
  };

  restorePurchases = async () => {
    try {
      await RNIap.initConnection();
    } catch (e) {
      return this.customModal?.toggle(
        'Connection to app store refused',
        'Please try again later.'
      );
    }
    this.loadingRef?.toggleLoading();
    try {
      const purchases = await RNIap.getAvailablePurchases();
      if (!purchases.length) {
        this.loadingRef?.toggleLoading();
        return this.customModal?.toggle(
          'No purchases',
          'There are no active purchases for this account.'
        );
      }
      let reducedPurchase = '';
      if (isiOS) {
        reducedPurchase = purchases;
      } else {
        reducedPurchase = purchases.map(m => {
          return {
            purchase_token: m.purchaseToken,
            package_name: 'com.pianote2',
            product_id: m.productId
          };
        });
      }
      let resp = await restorePurchase(reducedPurchase);
      this.loadingRef?.toggleLoading();
      if (resp)
        if (resp.shouldCreateAccount)
          this.props.navigation.navigate('CREATEACCOUNT');
        else if (resp.shouldLogin)
          this.props.navigation.navigate('LOGINCREDENTIALS', {
            email: resp.email
          });
    } catch (err) {
      this.loadingRef?.toggleLoading();
      this.customModal?.toggle(
        'Something went wrong',
        'Something went wrong.\nPlease try Again later.'
      );
    }
  };

  render() {
    return (
      <>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: colors.pianoteRed }}
          forceInset={{
            top: 'always',
            bottom: 'always'
          }}
        >
          <View style={{ flex: 1 }}>
            <StatusBar
              backgroundColor={colors.pianoteRed}
              barStyle='light-content'
            />
            <TouchableOpacity
              style={{ position: 'absolute', left: 15, padding: 5 }}
              onPress={() => {
                if (isTablet) Orientation.unlockAllOrientations();
                this.props.navigation.state.params.type == 'SIGNUP'
                  ? this.props.navigation.goBack()
                  : this.props.navigation.navigate('LOGINCREDENTIALS');
              }}
            >
              <EntypoIcon
                name={'chevron-thin-left'}
                size={25 * factorRatio}
                color={'white'}
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                marginTop: 5,
                marginHorizontal: '10%',
                zIndex: 1,
                justifyContent: 'space-evenly'
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 3 * fontIndex,
                  fontFamily: 'OpenSans-Bold',
                  textAlign: 'center'
                }}
              >
                Start Your 7-Day {'\n'} FREE Trial Today
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: isTablet ? 1.5 * fontIndex : 2 * fontIndex,
                  fontFamily: 'OpenSans',
                  textAlign: 'center'
                }}
              >
                {`Your first 7 days are on us. Choose the\nplan that will start after your trial ends.`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                zIndex: 1
              }}
            >
              <View
                style={[
                  styles.planContainer,
                  {
                    marginLeft: isTablet ? '15%' : '3%',
                    marginRight: 5
                  }
                ]}
              >
                <View style={styles.planHeader}>
                  <Text style={styles.planTitle}>MONTHLY PLAN</Text>
                  <Text style={styles.planSubtitle}>
                    If you prefer flexibility.
                  </Text>
                </View>
                <View style={styles.planBody}>
                  <View
                    style={{
                      paddingVertical:
                        windowDim.height * PixelRatio.get() < 900 ? 5 : 10
                    }}
                  >
                    <View
                      style={{ flexDirection: 'row', alignItems: 'flex-end' }}
                    >
                      <Text style={styles.planPrice}>$29.99</Text>
                      <Text style={styles.planSubtitle}>/mo</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.planBtn}
                    onPress={() => this.startPlan(skus[0])}
                  >
                    <Text style={styles.planBtnText}>
                      {`START YOUR\n7-DAY FREE TRIAL`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={[
                  styles.planContainer,
                  {
                    marginLeft: 5,
                    marginRight: isTablet ? '15%' : '3%'
                  }
                ]}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'black',
                    height: isTablet ? 30 : 20,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'OpenSans-Semibold',
                      fontSize: isTablet ? 12 : 10,
                      color: '#ffffff'
                    }}
                  >
                    SAVE 45% VS MONTHLY.
                  </Text>
                </View>
                <View style={styles.planHeader}>
                  <Text style={styles.planTitle}>ANNUAL PLAN</Text>
                  <Text style={styles.planSubtitle}>
                    If you're commited to improving.
                  </Text>
                </View>
                <View style={styles.planBody}>
                  <View
                    style={{
                      paddingVertical:
                        windowDim.height * PixelRatio.get() < 900 ? 5 : 10
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end'
                      }}
                    >
                      <Text style={styles.planPrice}>$199.99</Text>
                      <Text style={styles.planSubtitle}>/yr</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.planBtn}
                    onPress={() => this.startPlan(skus[1])}
                  >
                    <Text style={styles.planBtnText}>
                      {`START YOUR\n7-DAY FREE TRIAL`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {this.state.newUser == 'SIGNUP' && (
              <View
                style={{
                  zIndex: 5,
                  marginTop: '3%',
                  marginHorizontal: isTablet ? '15%' : '3%'
                }}
              >
                <CreateAccountStepCounter step={3} />
              </View>
            )}
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                marginTop: 5
              }}
            >
              {benefits.map((benefit, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <AntIcon
                    name={'check'}
                    size={isTablet ? 1.3 * fontIndex : 2 * fontIndex}
                    color={'white'}
                  />

                  <Text
                    style={{
                      color: '#ffffff',
                      fontFamily: 'OpenSans',
                      fontSize: isTablet ? 1.3 * fontIndex : 1.5 * fontIndex,
                      marginLeft: 5
                    }}
                  >
                    {benefit}
                  </Text>
                </View>
              ))}
              <TouchableOpacity
                onPress={() => {
                  this.state.newUser == 'SIGNUP'
                    ? this.props.navigation.navigate('LOGINCREDENTIALS')
                    : this.restorePurchases();
                }}
                style={{ paddingTop: 20 }}
              >
                <Text
                  style={[
                    styles.underlineText,
                    { fontSize: isTablet ? 1.2 * fontIndex : 1.3 * fontIndex }
                  ]}
                >
                  {this.state.newUser == 'SIGNUP'
                    ? 'Already A Member? Log In.'
                    : 'Restore purchases'}
                </Text>
              </TouchableOpacity>
              {this.state.newUser == 'SIGNUP' && (
                <TouchableOpacity
                  style={{
                    paddingTop: 5,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('TERMS');
                  }}
                >
                  <Text
                    style={[
                      styles.underlineText,
                      { fontSize: isTablet ? 1.2 * fontIndex : 1.3 * fontIndex }
                    ]}
                  >
                    Terms - Privacy
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                zIndex: 0,
                backgroundColor: '#191b1c',
                position: 'absolute',
                alignSelf: 'center',
                height: height,
                borderRadius: height / 4,
                aspectRatio: 1,
                top: '50%'
              }}
            ></View>
          </View>
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
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  planContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    flex: 1
  },
  planHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#e5e8e8',
    borderBottomWidth: 1,
    padding: windowDim.height * PixelRatio.get() < 900 ? 5 : 10
  },
  planBody: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  planTitle: {
    fontFamily: 'RobotoCondensed-Bold',
    color: '#000000',
    fontSize: 2.2 * fontIndex,
    textAlign: 'center'
  },
  planSubtitle: {
    fontFamily: 'OpenSans',
    color: '#000000',
    fontSize: fontIndex,
    textAlign: 'center',
    marginBottom: isTablet ? 15 : 5
  },
  planPrice: {
    fontFamily: 'OpenSans-Bold',
    color: '#000000',
    fontSize: 3 * fontIndex
  },
  planBtn: {
    backgroundColor: '#fb1b2f',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isTablet ? 30 : 15,
    marginTop: isTablet ? 30 : 0,
    width: '80%'
  },
  planBtnText: {
    color: '#ffffff',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: isTablet ? 16 : 12,
    textAlign: 'center',
    padding: isTablet ? 16 : 5
  },
  underlineText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    textDecorationLine: 'underline'
  }
});
