/**
 * forgotPassword
 */
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Animated,
  TouchableHighlight,
  Platform,
  Linking
} from 'react-native';
import FastImage from 'react-native-fast-image';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import { forgotPass } from '../../services/UserDataAuth';
import CustomModal from '../../modals/CustomModal';
import Loading from '../../components/Loading';
import { openInbox } from 'react-native-email-link';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NetworkContext } from '../../context/NetworkProvider';

var showListener =
  Platform.OS == 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
var hideListener =
  Platform.OS == 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

export default class ForgotPassword extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.forgotPassword - this.forgotPassword.bind(this);
    this.state = {
      email: '',
      pianoteYdelta: new Animated.Value(0),
      forgotYdelta: new Animated.Value(fullHeight * 0.075),
      secureTextEntry: true
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      showListener,
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      hideListener,
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = async () => {
    if (Platform.OS == 'ios') {
      Animated.parallel([
        Animated.timing(this.state.forgotYdelta, {
          toValue: fullHeight * 0.375,
          duration: 250
        }),
        Animated.timing(this.state.pianoteYdelta, {
          toValue: fullHeight * 0.15,
          duration: 250
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(this.state.forgotYdelta, {
          toValue: fullHeight * 0.375,
          duration: 250
        }),
        Animated.timing(this.state.pianoteYdelta, {
          toValue: fullHeight * 0.2,
          duration: 250
        })
      ]).start();
    }
  };

  _keyboardDidHide = async () => {
    Animated.parallel([
      Animated.timing(this.state.forgotYdelta, {
        toValue: fullHeight * 0.075,
        duration: 250
      }),
      Animated.timing(this.state.pianoteYdelta, {
        toValue: 0,
        duration: 250
      })
    ]).start();
  };

  forgotPassword = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    this.loadingRef.toggleLoading();
    this.textInput.clear();
    const response = await forgotPass(this.state.email);

    console.log(response);
    this.loadingRef.toggleLoading();
    if (response.success) {
      this.alertSuccess.toggle(
        'Please check your email',
        'Follow the instructions sent to your email address to reset your password.'
      );
    } else {
      this.alertError.toggle(
        'Invalid email address.',
        'There is no user registered with that email address.'
      );
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView
        scrollEnabled={false}
        keyboardShouldPersistTaps='handled'
      >
        <View style={{ height: fullHeight }}>
          <GradientFeature
            color={'dark'}
            opacity={0.5}
            height={'100%'}
            borderRadius={0}
          />
          <Animated.View
            key={'forgotpassword'}
            style={{
              position: 'absolute',
              bottom: this.state.forgotYdelta,
              width: fullWidth,
              zIndex: 4,
              elevation: Platform.OS === 'android' ? 4 : 0
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('LOGINCREDENTIALS');
              }}
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 16 * factorRatio,
                  color: 'grey',
                  textAlign: 'center',
                  textDecorationLine: 'underline'
                }}
              >
                Already a member? Log in.
              </Text>
            </TouchableOpacity>
            <View style={{ height: 7.5 * factorVertical }} />
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('CREATEACCOUNT');
              }}
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 16 * factorRatio,
                  color: 'grey',
                  textAlign: 'center',
                  textDecorationLine: 'underline'
                }}
              >
                Not a member?
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <FastImage
            style={{
              height: fullHeight,
              width: fullWidth,
              alignSelf: 'stretch'
            }}
            source={require('Pianote2/src/assets/img/imgs/backgroundHands.png')}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View
            key={'goBackIcon'}
            style={[
              styles.centerContent,
              {
                position: 'absolute',
                left: 15 * factorHorizontal,
                top: 40 * factorVertical,
                height: 50 * factorRatio,
                width: 50 * factorRatio,
                zIndex: 5,
                elevation: Platform.OS === 'android' ? 5 : 0
              }
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('LOGINCREDENTIALS');
              }}
              style={{
                height: '100%',
                width: '100%'
              }}
            >
              <EntypoIcon
                name={'chevron-thin-left'}
                size={25 * factorRatio}
                color={'white'}
              />
            </TouchableOpacity>
          </View>

          <Animated.View
            key={'items'}
            style={{
              position: 'absolute',
              bottom: this.state.pianoteYdelta,
              height: fullHeight,
              width: fullWidth,
              zIndex: 3,
              elevation: Platform.OS === 'android' ? 3 : 0
            }}
          >
            <View
              key={'container'}
              style={{
                height: fullHeight,
                width: fullWidth,
                alignItems: 'center'
              }}
            >
              <View style={{ flex: 0.425 }} />
              <Pianote
                height={90 * factorRatio}
                width={190 * factorRatio}
                fill={'#fb1b2f'}
              />
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 24 * factorRatio,
                  textAlign: 'center',
                  color: 'white'
                }}
              >
                The Ultimate Online {'\n'} Piano Lessons Experience.
              </Text>
              <View style={{ height: 30 * factorVertical }} />
              <View
                key={'email'}
                style={{
                  height: fullHeight * 0.06,
                  width: fullWidth * 0.9,
                  borderRadius: 50 * factorRatio,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  paddingLeft: 20 * factorHorizontal
                }}
              >
                <TextInput
                  ref={ref => {
                    this.textInput = ref;
                  }}
                  autoCorrect={false}
                  keyboardAppearance={'dark'}
                  placeholderTextColor={'grey'}
                  placeholder={'Email Address'}
                  onChangeText={email => this.setState({ email })}
                  style={{
                    color: 'black',
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 18 * factorRatio
                  }}
                />
              </View>
              <View style={{ height: 30 * factorVertical }} />
              <View
                key={'login'}
                style={{
                  height: fullHeight * 0.06,
                  width: fullWidth * 0.65,
                  borderRadius: 50 * factorRatio,
                  borderColor: '#fb1b2f',
                  backgroundColor:
                    this.state.email.length > 0 ? '#fb1b2f' : 'transparent',
                  borderWidth: 2
                }}
              >
                <TouchableHighlight
                  underlayColor={'transparent'}
                  onPress={() => {
                    this.forgotPassword();
                  }}
                  style={[
                    styles.centerContent,
                    {
                      height: '100%',
                      width: '100%',
                      flexDirection: 'row'
                    }
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 18 * factorRatio,
                      fontFamily: 'RobotoCondensed-Bold',
                      color: this.state.email.length > 0 ? 'white' : '#fb1b2f'
                    }}
                  >
                    RESET PASSWORD
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </Animated.View>
          <Loading
            ref={ref => {
              this.loadingRef = ref;
            }}
          />
          <CustomModal
            ref={ref => {
              this.alertSuccess = ref;
            }}
            additionalBtn={
              <TouchableOpacity
                style={{
                  backgroundColor: colors.pianoteRed,
                  borderRadius: 25,
                  marginTop: 10,
                  height: 50,
                  justifyContent: 'center',
                  alignSelf: 'center'
                }}
                onPress={() => {
                  this.alertSuccess.toggle();
                  openInbox();
                  this.props.navigation.navigate('LOGINCREDENTIALS');
                }}
              >
                <Text
                  style={{
                    paddingHorizontal: 15,
                    fontSize: 15,
                    color: '#ffffff'
                  }}
                >
                  GO TO EMAIL
                </Text>
              </TouchableOpacity>
            }
          />
          <CustomModal
            ref={ref => {
              this.alertError = ref;
            }}
            additionalBtn={
              <TouchableOpacity
                onPress={() => {
                  this.alertError.toggle();
                  Linking.openURL('mailto:support@pianote.com');
                }}
                style={{ marginTop: 20, alignSelf: 'center' }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'OpenSans-Regular',
                    color: colors.pianoteRed
                  }}
                >
                  Still can't log in? Contact support.
                </Text>
              </TouchableOpacity>
            }
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
