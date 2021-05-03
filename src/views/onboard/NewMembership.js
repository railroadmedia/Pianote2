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
import Back from 'Pianote2/src/assets/img/svgs/back.svg';
import AntIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import Orientation from 'react-native-orientation-locker';
import { SafeAreaView } from 'react-navigation';
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener
} from 'react-native-iap';
import { signUp, restorePurchase } from '../../services/UserDataAuth';
import CustomModal from '../../modals/CustomModal';
import Loading from '../../components/Loading';
import CreateAccountStepCounter from './CreateAccountStepCounter';
import { goBack, navigate } from '../../../AppNavigator';

let purchaseErrorSubscription = null;
let purchaseUpdateSubscription = null;

const skus = Platform.select({
  android: ['pianote_app_1_year_2021', 'pianote_app_1_month_2021'],
  ios: [
    'pianote_app_1_month_membership_2021',
    'pianote_app_1_year_membership_2021'
  ]
});

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const fontIndex = width / 50;

export default class NewMembership extends React.Component {
  constructor(props) {
    super(props);
    Orientation.lockToPortrait();
    this.state = {
      newUser: props.route?.params?.data.type,
      email: props.route?.params?.data.email,
      password: props.route?.params?.data.password,
      token: props.route?.params?.data.token,
      isExpired: false,
      benefits: [
        'Pay nothing for 7 days.',
        'Award-winning piano lessons & more.',
        'Access to the Pianote Experience app.',
        'Access to the Pianote Experience website.',
        'Cancel anytime through the App Store.'
      ]
    };
  }

  async componentDidMount() {
    try {
      await RNIap.initConnection();
    } catch (e) {}
    purchaseUpdateSubscription = purchaseUpdatedListener(this.pulCallback);
    purchaseErrorSubscription = purchaseErrorListener(e => {
      this.loadingRef?.toggleLoading(false);
      Alert.alert('Something went wrong', e.message, [{ text: 'OK' }], {
        cancelable: false
      });
    });
    try {
      this.loadingRef?.toggleLoading(true);
      const subscriptions = (await RNIap.getSubscriptions(skus)).sort((a, b) =>
        parseFloat(a.price) > parseFloat(b.price) ? 1 : -1
      );
      this.loadingRef?.toggleLoading();
      this.setState({ subscriptions });
    } catch (e) {}
  }

  startPlan = async plan => {
    this.selectedPlan = {
      price: plan.price,
      currency: plan.currency
    };
    this.loadingRef?.toggleLoading();
    try {
      await RNIap.requestSubscription(plan.productId, false);
    } catch (e) {}
  };

  pulCallback = async purchase => {
    let { transactionReceipt } = purchase;
    if (transactionReceipt) {
      let response = await signUp(
        this.state.email,
        this.state.password,
        purchase,
        this.state.token,
        this.selectedPlan
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
          // finish transaction
          await RNIap.finishTransaction(purchase, false);
          // if new user no pack only then create account
          if (this.state.newUser === 'SIGNUP' && !global.isPackOnly) {
            navigate('CREATEACCOUNT3', {
              data: {
                email: this.state.email,
                password: this.state.password,
                plan: ''
              }
            });
          } else {
            navigate('LOADPAGE');
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
        if (resp.shouldCreateAccount) navigate('CREATEACCOUNT');
        else if (resp.shouldLogin)
          navigate('LOGINCREDENTIALS', {
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
    let { subscriptions } = this.state;
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
                if (onTablet) Orientation.unlockAllOrientations();
                this.props.route?.params?.type == 'SIGNUP' || global.isPackOnly
                  ? goBack()
                  : navigate('LOGINCREDENTIALS');
              }}
            >
              <Back
                width={backButtonSize}
                height={backButtonSize}
                fill={'white'}
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
                {`${
                  this.state.newUser == 'EXPIRED'
                    ? 'Start your new\n membership TODAY'
                    : 'Start your 7-Day \n FREE Trial Today'
                }`}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: onTablet ? 1.5 * fontIndex : 2.2 * fontIndex,
                  fontFamily: 'OpenSans',
                  textAlign: 'center'
                }}
              >
                {`${
                  this.state.newUser == 'EXPIRED'
                    ? 'Choose the perfect plan that matches your learning style.'
                    : `Your first 7 days are on us. Choose the\nplan that will start after your trial ends.`
                }`}
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
                    marginLeft: onTablet ? '10%' : '3%',
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
                    {subscriptions && (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-end',
                          paddingHorizontal: 10
                        }}
                      >
                        <Text style={styles.planPrice}>
                          {subscriptions?.[0]?.localizedPrice}
                        </Text>
                        {!!subscriptions[0]?.localizedPrice && (
                          <Text style={styles.planSubtitle}>/mo</Text>
                        )}
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.planBtn}
                    onPress={() => this.startPlan(subscriptions[0])}
                  >
                    <Text style={styles.planBtnText}>
                      {`START YOUR\n${
                        this.state.newUser == 'EXPIRED'
                          ? 'MEMBERSHIP'
                          : '7-DAY FREE TRIAL'
                      }`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={[
                  styles.planContainer,
                  {
                    marginLeft: 5,
                    marginRight: onTablet ? '10%' : '3%'
                  }
                ]}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'black',
                    height: onTablet ? 30 : 20,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'OpenSans-Semibold',
                      fontSize: onTablet ? 12 : 10,
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
                    {subscriptions && (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-end',
                          paddingHorizontal: 10
                        }}
                      >
                        <Text style={styles.planPrice}>
                          {subscriptions?.[1]?.localizedPrice}
                        </Text>
                        {!!subscriptions[1]?.localizedPrice && (
                          <Text style={styles.planSubtitle}>/yr</Text>
                        )}
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.planBtn}
                    onPress={() => this.startPlan(subscriptions[1])}
                  >
                    <Text style={styles.planBtnText}>
                      {`START YOUR\n${
                        this.state.newUser == 'EXPIRED'
                          ? 'MEMBERSHIP'
                          : '7-DAY FREE TRIAL'
                      }`}
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
                  marginHorizontal: onTablet ? '15%' : '3%'
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
              {this.state.benefits.map((benefit, i) => {
                if (!this.state.newUser == 'EXPIRED' || i > 0) {
                  return (
                    <View>
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
                          size={onTablet ? 1.3 * fontIndex : 2 * fontIndex}
                          color={'white'}
                        />
                        <Text
                          style={{
                            color: '#ffffff',
                            fontFamily: 'OpenSans',
                            fontSize: onTablet
                              ? 1.3 * fontIndex
                              : 1.65 * fontIndex,
                            marginLeft: 5
                          }}
                        >
                          {benefit}
                        </Text>
                      </View>
                    </View>
                  );
                }
              })}
              <TouchableOpacity
                onPress={() => {
                  this.state.newUser == 'SIGNUP'
                    ? navigate('LOGINCREDENTIALS')
                    : this.restorePurchases();
                }}
                style={{ paddingTop: 20 }}
              >
                <Text
                  style={[
                    styles.underlineText,
                    { fontSize: onTablet ? 1.2 * fontIndex : 1.5 * fontIndex }
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
                  onPress={() => navigate('TERMS')}
                >
                  <Text
                    style={[
                      styles.underlineText,
                      { fontSize: onTablet ? 1.2 * fontIndex : 1.3 * fontIndex }
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
                borderRadius: onTablet ? 0 : height / 4,
                aspectRatio: 1,
                top: '50%'
              }}
            />
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
    marginBottom: global.onTablet ? 15 : 5
  },
  planPrice: {
    fontFamily: 'OpenSans-Bold',
    color: '#000000',
    fontSize: global.onTablet ? 2 * fontIndex : 3 * fontIndex
  },
  planBtn: {
    backgroundColor: '#fb1b2f',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: global.onTablet ? 30 : 15,
    marginTop: global.onTablet ? 30 : 0,
    width: '80%'
  },
  planBtnText: {
    color: '#ffffff',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: global.onTablet ? 16 : 12,
    textAlign: 'center',
    padding: global.onTablet ? 16 : 5
  },
  underlineText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'OpenSans',
    textAlign: 'center',
    textDecorationLine: 'underline'
  }
});
