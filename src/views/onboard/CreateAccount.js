import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import Back from '../../assets/img/svgs/back';
import CheckEmail from '../../modals/CheckEmail.js';
import GradientFeature from '../../components/GradientFeature.js';
import { NetworkContext } from '../../context/NetworkProvider.js';
import CreateAccountStepCounter from './CreateAccountStepCounter';
import Orientation from 'react-native-orientation-locker';
import { navigate } from '../../../AppNavigator';
import { isEmailUnique } from '../../services/UserDataAuth';

const onTablet = global.onTablet;

export default class CreateAccount extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    if (onTablet) Orientation.unlockAllOrientations();
    else Orientation.lockToPortrait();
    this.state = {
      showCheckEmail: false,
      showValidateEmail: false,
      email: '',
      scrollViewContentFlex: { flex: 1 }
    };
  }

  verifyEmail = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    if (this.state.email.length > 0) {
      let email = encodeURIComponent(this.state.email);
      let response = await isEmailUnique(email);
      if (response?.exists) {
        this.setState({ showCheckEmail: true });
      } else if (
        response?.errors?.email === 'The email must be a valid email address.'
      ) {
        this.setState({ showValidateEmail: true });
      } else {
        navigate('CREATEACCOUNT2', {
          email: this.state.email,
          purchase: this.props.route?.params?.purchase
        });
      }
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
          >
            <TouchableOpacity
              onPress={() => navigate('LOGINCREDENTIALS')}
              style={localStyles.createAccountContainer}
            >
              <Back
                width={backButtonSize}
                height={backButtonSize}
                fill={'white'}
              />
              <Text
                style={[styles.modalHeaderText, localStyles.createAccountText]}
              >
                Create Account
              </Text>
            </TouchableOpacity>
            <ScrollView
              style={{ flex: 1 }}
              keyboardShouldPersistTaps='handled'
              contentInsetAdjustmentBehavior='never'
              contentContainerStyle={this.state.scrollViewContentFlex}
            >
              <View style={localStyles.emailContainer}>
                <View id='placeholder' />
                <View style={{ justifyContent: 'center' }}>
                  <Text style={localStyles.emailText}>What's your email?</Text>
                  <TextInput
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    onBlur={() =>
                      this.setState({ scrollViewContentFlex: { flex: 1 } })
                    }
                    onFocus={() =>
                      this.setState({
                        scrollViewContentFlex: {}
                      })
                    }
                    keyboardAppearance={'dark'}
                    placeholderTextColor={'grey'}
                    placeholder={'Email Address'}
                    keyboardType={
                      Platform.OS === 'android'
                        ? 'visible-password'
                        : 'email-address'
                    }
                    onChangeText={email => this.setState({ email })}
                    style={localStyles.textInput}
                  />

                  <TouchableOpacity
                    onPress={() => this.verifyEmail()}
                    style={[
                      styles.centerContent,
                      localStyles.verifyContainer,
                      {
                        width: onTablet ? '30%' : '50%',
                        marginTop: 15,
                        backgroundColor:
                          this.state.email.length > 0
                            ? '#fb1b2f'
                            : 'transparent'
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalButtonText,
                        {
                          color:
                            this.state.email.length > 0 ? 'white' : '#fb1b2f',
                          fontFamily: 'RobotoCondensed-Bold',
                          fontSize: onTablet ? 20 : 14,
                          textAlign: 'center',
                          padding: 10
                        }
                      ]}
                    >
                      NEXT
                    </Text>
                  </TouchableOpacity>
                </View>
                <CreateAccountStepCounter step={1} />
              </View>
            </ScrollView>

            <CheckEmail
              isVisible={this.state.showCheckEmail}
              hideCheckEmail={() =>
                this.setState({
                  showCheckEmail: false
                })
              }
            />

            <Modal
              visible={this.state.showValidateEmail}
              transparent={true}
              style={[styles.centerContent, localStyles.modalContainer]}
              animation={'slideInUp'}
              animationInTiming={350}
              animationOutTiming={350}
              coverScreen={true}
              hasBackdrop={true}
              onBackButtonPress={() =>
                this.setState({ showValidateEmail: false })
              }
            >
              <TouchableOpacity
                style={[styles.container, styles.centerContent]}
                onPress={() => this.setState({ showValidateEmail: false })}
              >
                <View style={[styles.container, styles.centerContent]}>
                  <View style={localStyles.containerModal}>
                    <Text style={[styles.modalHeaderText, localStyles.title]}>
                      The email must be a valid {'\n'}email address.
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ showValidateEmail: false })
                      }
                      style={localStyles.tryAgain}
                    >
                      <Text
                        style={[
                          styles.modalCancelButtonText,
                          localStyles.tryAgainText
                        ]}
                      >
                        TRY AGAIN
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </FastImage>
    );
  }
}

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)'
  },
  createAccountContainer: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  emailContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 20
  },
  emailText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: onTablet ? 24 : 16,
    textAlign: 'left',
    color: 'white',
    paddingLeft: 15
  },
  createAccountText: {
    color: 'white',
    fontSize: onTablet ? 36 : 24
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 20,
    height: 200,
    width: '80%'
  },
  textInput: {
    padding: 15,
    marginTop: 14,
    color: 'black',
    borderRadius: 100,
    marginHorizontal: 15,
    fontSize: onTablet ? 20 : 14,
    backgroundColor: 'white',
    fontFamily: 'OpenSans-Regular'
  },
  verifyContainer: {
    marginBottom: 20,
    borderWidth: 2,
    borderRadius: 50,
    alignSelf: 'center',
    borderColor: '#fb1b2f'
  },
  containerModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingBottom: 5,
    paddingTop: 20,
    backgroundColor: 'white'
  },
  title: {
    paddingHorizontal: 20,
    marginBottom: 10
  },
  loginContainer: {
    borderRadius: 45,
    backgroundColor: '#fb1b2f',
    marginHorizontal: 20,
    marginVertical: 5
  },
  loginText: {
    color: 'white',
    paddingVertical: 10
  },
  tryAgain: {
    paddingHorizontal: 20,
    marginVertical: 10
  },
  tryAgainText: {
    color: '#fb1b2f'
  }
});
