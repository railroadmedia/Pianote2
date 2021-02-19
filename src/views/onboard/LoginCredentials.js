/**
 * LoginCredentials
 */
import React from 'react';
import {
  View,
  Text,
  Keyboard,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  StyleSheet
} from 'react-native';

import RNIap from 'react-native-iap';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions, StackActions } from 'react-navigation';
import Orientation from 'react-native-orientation-locker';

import Back from '../../assets/img/svgs/back';
import Pianote from '../../assets/img/svgs/pianote';
import PasswordHidden from '../../assets/img/svgs/passwordHidden.svg';
import PasswordVisible from '../../assets/img/svgs/passwordVisible.svg';

import { updateFcmToken } from '../../services/notification.service';
import {
  getToken,
  getUserData,
  restorePurchase
} from '../../services/UserDataAuth.js';

import Loading from '../../components/Loading.js';
import GradientFeature from '../../components/GradientFeature';

import CustomModal from '../../modals/CustomModal.js';
import PasswordEmailMatch from '../../modals/PasswordEmailMatch.js';
import { NetworkContext } from '../../context/NetworkProvider';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

export default class LoginCredentials extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    if (onTablet) Orientation.unlockAllOrientations();
    else Orientation.lockToPortrait();
    this.state = {
      email: props?.navigation?.state?.params?.email || '',
      password: '',
      secureTextEntry: true,
      showPasswordEmailMatch: false,
      showNoConnection: false,
      loginErrorMessage: '',
      scrollViewContentFlex: { flex: 1 }
    };
  }

  getPurchases = async () => {
    if (!this.context.isConnected) {
      this.context.showNoConnectionAlert();
    }
    try {
      await RNIap.initConnection();
    } catch (error) {
      return;
    }
    try {
      const purchases = await RNIap[
        isiOS ? 'getAvailablePurchases' : 'getPurchaseHistory'
      ]();
      if (purchases.length) {
        if (isiOS)
          return {
            receipt: purchases[0].transactionReceipt
          };
        return {
          purchases: purchases.map(m => {
            return {
              purchase_token: m.purchaseToken,
              package_name: 'com.pianote2',
              product_id: m.productId
            };
          })
        };
      }
    } catch (error) {}
  };

  login = async () => {
    if (!this.context.isConnected) {
      this.context.showNoConnectionAlert();
    }

    Keyboard.dismiss();
    this.loadingRef?.toggleLoading(true);
    const response = await getToken(
      this.state.email,
      this.state.password,
      await this.getPurchases()
    );

    if (response.success) {
      // store user data
      updateFcmToken();
      await AsyncStorage.multiSet([
        ['loggedIn', 'true'],
        ['email', this.state.email],
        ['password', this.state.password]
      ]);

      // checkmembership status
      let userData = await getUserData();
      if (userData.isPackOlyOwner) {
        // if pack only, make global & go to packs
        global.isPackOnly = userData.isPackOlyOwner;
        global.expirationDate = userData.expirationDate;
        await this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'PACKS' })]
          })
        );
      } else if (userData.isLifetime || userData.isMember) {
        // is logged in with valid membership
        await this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'LESSONS' })]
          })
        );
      } else {
        // membership expired
        this.props.navigation.navigate('MEMBERSHIPEXPIRED', {
          email: this.state.email,
          password: this.state.password,
          token: response.token
        });
      }
    } else {
      this.setState({
        showPasswordEmailMatch: true,
        loginErrorMessage: response.message
      });
    }
    this.loadingRef?.toggleLoading(false);
  };

  restorePurchases = async () => {
    try {
      await RNIap.initConnection();
    } catch (e) {
      return this.customModal.toggle(
        'Connection to app store refused',
        'Please try again later.'
      );
    }
    this.loadingRef?.toggleLoading();
    try {
      const purchases = await RNIap.getAvailablePurchases();
      if (!purchases.length) {
        this.loadingRef?.toggleLoading();
        return this.customModal.toggle(
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
      let resp = restorePurchase(reducedPurchase);
      if (this.loadingRef) this.loadingRef?.toggleLoading();
      if (resp) {
        if (resp.shouldCreateAccount) {
          this.props.navigation.navigate('CREATEACCOUNT');
        } else if (resp.shouldLogin) {
          this.setState({ email: resp.email });
        }
      }
    } catch (err) {
      this.loadingRef?.toggleLoading();
      this.customModal.toggle(
        'Something went wrong',
        'Something went wrong.\nPlease try Again later.'
      );
    }
  };

  render() {
    return (
      <FastImage
        style={{ flex: 1 }}
        resizeMode={FastImage.resizeMode.cover}
        source={require('Pianote2/src/assets/img/imgs/backgroundHands.png')}
      >
        <GradientFeature
          zIndex={0}
          opacity={0.5}
          elevation={0}
          color={'dark'}
          height={'100%'}
          borderRadius={0}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={`${isiOS ? 'padding' : ''}`}
          >
            <ScrollView
              style={{ flex: 1 }}
              keyboardShouldPersistTaps='handled'
              contentInsetAdjustmentBehavior='never'
              contentContainerStyle={this.state.scrollViewContentFlex}
            >
              <View style={localStyles.scrollContainer}>
                <View style={localStyles.pianoteInnerContainer}>
                  <Pianote fill={'#fb1b2f'} />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 20 * factor,
                      color: 'white',
                      paddingTop: 15,
                      alignSelf: 'center',
                      textAlign: 'center',
                      fontFamily: 'OpenSans-Regular',
                      width: '50%'
                    }}
                  >
                    The Ultimate Online
                  </Text>
                  <Text
                    style={{
                      fontSize: 20 * factor,
                      color: 'white',
                      alignSelf: 'center',
                      textAlign: 'center',
                      fontFamily: 'OpenSans-Regular',
                      width: `${(25 * (onTablet ? 50 : 50)) / 19}%` //25=second row chars, 50=width % of first row (same as pianote svg), 19=first row chars
                    }}
                  >
                    Piano Lessons Experience.
                  </Text>
                </View>
                <TextInput
                  onBlur={() =>
                    this.setState({
                      scrollViewContentFlex: { flex: 1 }
                    })
                  }
                  onFocus={() =>
                    this.setState({
                      scrollViewContentFlex: {}
                    })
                  }
                  autoCorrect={false}
                  value={this.state.email}
                  autoCapitalize={false}
                  keyboardAppearance={'dark'}
                  placeholderTextColor={'grey'}
                  placeholder={'Email Address'}
                  keyboardType={'email-address'}
                  onChangeText={email => this.setState({ email })}
                  style={localStyles.email}
                />
                <View style={localStyles.textInputContainer}>
                  <TextInput
                    autoCapitalize={false}
                    onBlur={() =>
                      this.setState({
                        scrollViewContentFlex: {
                          flex: 1
                        }
                      })
                    }
                    onFocus={() =>
                      this.setState({
                        scrollViewContentFlex: {}
                      })
                    }
                    autoCorrect={false}
                    keyboardAppearance={'dark'}
                    placeholderTextColor={'grey'}
                    placeholder={'Password'}
                    secureTextEntry={true}
                    onChangeText={password => this.setState({ password })}
                    style={localStyles.textInputPassword}
                  />
                  {!this.state.secureTextEntry && (
                    <TouchableOpacity
                      style={localStyles.passwordContainer}
                      onPress={() =>
                        this.setState({
                          secureTextEntry: true
                        })
                      }
                    >
                      <Text>{this.state.password}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        secureTextEntry: !this.state.secureTextEntry
                      })
                    }
                    style={{
                      right: 0,
                      padding: 15,
                      height: '100%',
                      aspectRatio: 1,
                      position: 'absolute'
                    }}
                  >
                    {this.state.secureTextEntry ? (
                      <PasswordHidden />
                    ) : (
                      <PasswordVisible />
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  underlayColor={'transparent'}
                  onPress={() => {
                    this.state.password.length > 0 &&
                    this.state.email.length > 0
                      ? this.login()
                      : null;
                  }}
                  style={[
                    styles.centerContent,
                    {
                      borderWidth: 2,
                      borderRadius: 50,
                      alignSelf: 'center',
                      borderColor: '#fb1b2f',
                      width: onTablet ? '30%' : '50%',
                      backgroundColor:
                        this.state.email.length > 0 &&
                        this.state.password.length > 0
                          ? '#fb1b2f'
                          : 'transparent'
                    }
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 18 * factor,
                      padding: 10,
                      fontFamily: 'RobotoCondensed-Bold',
                      color:
                        this.state.email.length > 0 &&
                        this.state.password.length > 0
                          ? 'white'
                          : '#fb1b2f'
                    }}
                  >
                    LOG IN
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ padding: 10 }}>
                <Text
                  style={localStyles.greyText}
                  onPress={() => {
                    this.props.navigation.navigate('FORGOTPASSWORD');
                  }}
                >
                  Forgot your password?
                </Text>
                <Text
                  style={localStyles.greyText}
                  onPress={() => {
                    this.props.navigation.navigate('SUPPORTSIGNUP');
                  }}
                >
                  Can't log in? Contact support.
                </Text>
              </View>
            </ScrollView>
            <TouchableOpacity
              onPress={() => {
                Orientation.lockToPortrait();
                this.props.navigation.goBack();
              }}
              style={{
                padding: 15,
                position: 'absolute'
              }}
            >
              <Back width={25} height={25} fill={'white'} />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </SafeAreaView>
        <Loading
          ref={ref => {
            this.loadingRef = ref;
          }}
        />
        <Modal
          key={'passwords'}
          isVisible={this.state.showPasswordEmailMatch}
          style={{
            margin: 0,
            flex: 1
          }}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={true}
        >
          <PasswordEmailMatch
            errorMessage={this.state.loginErrorMessage}
            hidePasswordEmailMatch={() => {
              this.setState({ showPasswordEmailMatch: false });
            }}
          />
        </Modal>
        <CustomModal
          ref={ref => {
            this.customModal = ref;
          }}
        />
      </FastImage>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15 * factor,
    margin: 20 * factor,
    height: 200,
    width: '80%'
  },
  pianoteContainer: {
    flex: 1,
    marginTop: 40,
    justifyContent: 'center'
  },
  pianoteInnerContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    width: DeviceInfo.isTablet() ? '30%' : '50%',
    aspectRatio: 177 / 53
  },
  email: {
    padding: 15,
    marginTop: 40,
    color: 'black',
    borderRadius: 100,
    marginHorizontal: 15,
    fontSize: (DeviceInfo.isTablet() ? 14 : 16) * factor,
    backgroundColor: 'white',
    fontFamily: 'OpenSans-Regular'
  },
  greyText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: (DeviceInfo.isTablet() ? 12 : 14) * factor,
    color: 'grey',
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  passwordContainer: {
    left: 0,
    right: 50,
    padding: 15,
    height: '100%',
    borderRadius: 100,
    position: 'absolute',
    backgroundColor: 'white'
  },
  goToEmailContainer: {
    backgroundColor: '#fb1b2f',
    borderRadius: 25,
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  scrollContainer: {
    flex: 1,
    marginTop: 40,
    justifyContent: 'center'
  },
  textInputContainer: {
    marginBottom: 40,
    borderRadius: 100,
    marginVertical: 10,
    marginHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  textInputPassword: {
    padding: 15,
    color: 'black',
    marginRight: 45,
    fontSize: (DeviceInfo.isTablet() ? 14 : 16) * factor,
    fontFamily: 'OpenSans-Regular'
  }
});
