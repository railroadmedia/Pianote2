import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Linking,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import Back from '../../assets/img/svgs/back';
import Pianote from '../../assets/img/svgs/pianote.svg';
import GradientFeature from '../../../src/components/GradientFeature.js';
import { forgotPass } from '../../services/UserDataAuth';
import CustomModal from '../../modals/CustomModal';
import Loading from '../../components/Loading';
import { openInbox } from 'react-native-email-link';
import { NetworkContext } from '../../context/NetworkProvider';
import { goBack, navigate } from '../../../AppNavigator';

const isTablet = global.onTablet;
const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width < windowDim.height ? windowDim.height : windowDim.width;
const verticalRatio =
  windowDim.width < windowDim.height ? height / 812 : width / 375;

export default class ForgotPassword extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.forgotPassword - this.forgotPassword.bind(this);
    this.state = { email: '' };
  }

  forgotPassword = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.loadingRef?.toggleLoading();
    this.textInput.clear();
    const response = await forgotPass(this.state.email);
    this.loadingRef?.toggleLoading();
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
      <FastImage
        style={{ flex: 1 }}
        resizeMode={FastImage.resizeMode.cover}
        source={require('../../../src/assets/img/imgs/backgroundHands.png')}
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
            keyboardVerticalOffset={Platform.select({
              ios: () => (onTablet ? 0 : -75 * verticalRatio),
              android: () => 0
            })()}
          >
            <ScrollView
              style={{ flex: 1 }}
              keyboardShouldPersistTaps='handled'
              contentInsetAdjustmentBehavior='never'
              contentContainerStyle={{ flex: 1 }}
            >
              <View style={localStyles.pianoteContainer}>
                <View style={localStyles.pianoteInnerContainer}>
                  <Pianote fill={colors.pianoteRed} />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: onTablet ? 30 : 20,
                      color: 'white',
                      paddingTop: 15,
                      alignSelf: 'center',
                      textAlign: 'center',
                      fontFamily: 'OpenSans-Regular',
                      width: '100%'
                    }}
                  >
                    The Ultimate Online
                  </Text>
                  <Text
                    style={{
                      fontSize: onTablet ? 30 : 20,
                      color: 'white',
                      alignSelf: 'center',
                      textAlign: 'center',
                      fontFamily: 'OpenSans-Regular',
                      width: `100%`
                    }}
                  >
                    Piano Lessons Experience.
                  </Text>
                </View>
                <TextInput
                  ref={ref => {
                    this.textInput = ref;
                  }}
                  autoCorrect={false}
                  keyboardAppearance={'dark'}
                  placeholderTextColor={'grey'}
                  placeholder={'Email Address'}
                  onChangeText={email => this.setState({ email })}
                  style={localStyles.email}
                />
                <TouchableHighlight
                  underlayColor={'transparent'}
                  onPress={() => {
                    this.forgotPassword();
                  }}
                  style={[
                    localStyles.centerContent,
                    {
                      borderWidth: 2,
                      borderRadius: 50,
                      alignSelf: 'center',
                      borderColor: colors.pianoteRed,
                      width: onTablet ? '30%' : '50%',
                      backgroundColor:
                        this.state.email.length > 0
                          ? colors.pianoteRed
                          : 'transparent'
                    }
                  ]}
                >
                  <Text
                    style={{
                      padding: 10,
                      fontSize: onTablet ? 20 : 14,
                      fontFamily: 'RobotoCondensed-Bold',
                      color:
                        this.state.email.length > 0
                          ? 'white'
                          : colors.pianoteRed
                    }}
                  >
                    RESET PASSWORD
                  </Text>
                </TouchableHighlight>
              </View>
              <View style={{ padding: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    navigate('LOGINCREDENTIALS');
                  }}
                >
                  <Text style={localStyles.greyText}>
                    Already a member? Log in.
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigate('CREATEACCOUNT');
                  }}
                >
                  <Text style={localStyles.greyText}>Not a member?</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <TouchableOpacity
              onPress={() => goBack()}
              style={{ padding: 15, position: 'absolute' }}
            >
              <Back
                width={backButtonSize}
                height={backButtonSize}
                fill={'white'}
              />
            </TouchableOpacity>
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
                  style={localStyles.goToEmailContainer}
                  onPress={() => {
                    this.alertSuccess.toggle();
                    openInbox();
                    navigate('LOGINCREDENTIALS');
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
          </KeyboardAvoidingView>
        </SafeAreaView>
      </FastImage>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 20,
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
    width: isTablet ? '30%' : '50%',
    aspectRatio: 177 / 53
  },
  email: {
    padding: 15,
    marginVertical: 20,
    color: 'black',
    borderRadius: 100,
    fontSize: isTablet ? 20 : 14,
    marginHorizontal: 15,
    backgroundColor: 'white',
    fontFamily: 'OpenSans-Regular'
  },
  greyText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: isTablet ? 16 : 12,
    color: 'grey',
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  goToEmailContainer: {
    backgroundColor: '#fb1b2f',
    borderRadius: 25,
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  }
});
