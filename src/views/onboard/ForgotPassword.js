/**
 * forgotPassword
 */
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Linking,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import DeviceInfo from 'react-native-device-info';
import Back from '../../assets/img/svgs/back';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import { forgotPass } from '../../services/UserDataAuth';
import CustomModal from '../../modals/CustomModal';
import Loading from '../../components/Loading';
import { openInbox } from 'react-native-email-link';
import { NetworkContext } from '../../context/NetworkProvider';

export default class ForgotPassword extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.forgotPassword - this.forgotPassword.bind(this);
    this.state = {
      email: '',
      secureTextEntry: true
    };
  }

  forgotPassword = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    this.loadingRef.toggleLoading();
    this.textInput.clear();
    const response = await forgotPass(this.state.email);
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
              contentContainerStyle={{ flex: 1 }}
            >
              <View style={localStyles.pianoteContainer}>
                <View style={localStyles.pianoteInnerContainer}>
                  <Pianote fill={'#fb1b2f'} />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 20 * factorRatio,
                      color: 'white',
                      paddingTop: 15,
                      alignSelf: 'center',
                      textAlign: 'center',
                      fontFamily: 'OpenSans-Regular',
                      width: onTablet ? '50%' : '50%'
                    }}
                  >
                    The Ultimate Online
                  </Text>
                  <Text
                    style={{
                      fontSize: 20 * factorRatio,
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
                    styles.centerContent,
                    {
                      borderWidth: 2,
                      borderRadius: 50,
                      alignSelf: 'center',
                      borderColor: '#fb1b2f',
                      width: onTablet ? '30%' : '50%',
                      backgroundColor:
                        this.state.email.length > 0 ? '#fb1b2f' : 'transparent'
                    }
                  ]}
                >
                  <Text
                    style={{
                      padding: 15,
                      fontFamily: 'RobotoCondensed-Bold',
                      color: this.state.email.length > 0 ? 'white' : '#fb1b2f'
                    }}
                  >
                    RESET PASSWORD
                  </Text>
                </TouchableHighlight>
              </View>
              <View style={{ marginBottom: 20 * factorRatio }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('LOGINCREDENTIALS');
                  }}
                >
                  <Text style={localStyles.greyText}>
                    Already a member? Log in.
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('CREATEACCOUNT');
                  }}
                >
                  <Text style={localStyles.greyText}>Not a member?</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ padding: 15, position: 'absolute' }}
            >
              <Back width={25} height={25} fill={'white'} />
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
          </KeyboardAvoidingView>
        </SafeAreaView>
      </FastImage>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius:
      (15 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    margin:
      (20 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
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
    marginVertical: 20,
    color: 'black',
    borderRadius: 100,
    marginHorizontal: 15,
    backgroundColor: 'white',
    fontFamily: 'OpenSans-Regular'
  },
  greyText: {
    fontFamily: 'OpenSans-Regular',
    fontSize:
      (15 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
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
  }
});
