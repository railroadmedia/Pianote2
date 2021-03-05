/**
 * CreateAccount
 */
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';

import Back from '../../assets/img/svgs/back';
import CheckEmail from '../../modals/CheckEmail.js';
import ValidateEmail from '../../modals/ValidateEmail.js';
import GradientFeature from '../../components/GradientFeature.js';
import commonService from '../../services/common.service.js';
import { NetworkContext } from '../../context/NetworkProvider.js';
import CreateAccountStepCounter from './CreateAccountStepCounter';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';

export default class CreateAccount extends React.Component {
  static navigationOptions = { header: null };
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

  verifyEmail = () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    if (this.state.email.length > 0) {
      let email = encodeURIComponent(this.state.email);
      fetch(`${commonService.rootUrl}/usora/api/is-email-unique?email=${email}`)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          if (response?.exists) {
            this.setState({ showCheckEmail: true });
          } else if (
            response?.errors?.email ==
            'The email must be a valid email address.'
          ) {
            this.setState({ showValidateEmail: true });
          } else {
            this.props.navigation.navigate('CREATEACCOUNT2', {
              email: this.state.email,
              purchase: this.props.navigation.state.params?.purchase
            });
          }
        })
        .catch(error => {
          console.log('API Error: ', error);
        });
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
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('LOGINCREDENTIALS')}
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
              <View />
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
                      this.setState({
                        scrollViewContentFlex: { flex: 1 }
                      })
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
                      Platform.OS == 'android'
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
            <Modal
              isVisible={this.state.showCheckEmail}
              style={[
                styles.centerContent,
                styles.modalContainer
              ]}
              animation={'slideInUp'}
              animationInTiming={350}
              animationOutTiming={350}
              coverScreen={true}
              hasBackdrop={true}
            >
              <CheckEmail
                hideCheckEmail={() => {
                  this.setState({
                    showCheckEmail: false
                  });
                }}
              />
            </Modal>
            <Modal
              isVisible={this.state.showValidateEmail}
              style={[
                styles.centerContent,
                styles.modalContainer
              ]}
              animation={'slideInUp'}
              animationInTiming={350}
              animationOutTiming={350}
              coverScreen={true}
              hasBackdrop={true}
            >
              <ValidateEmail
                hideValidateEmail={() => {
                  this.setState({
                    showValidateEmail: false
                  });
                }}
              />
            </Modal>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </FastImage>
    );
  }
}

const localStyles = StyleSheet.create({
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
    fontSize: DeviceInfo.isTablet() ? 24 : 16,
    textAlign: 'left',
    color: 'white',
    paddingLeft: 15
  },
  createAccountText: {
    color: 'white',
    fontSize: DeviceInfo.isTablet() ? 36 : 24
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
    fontSize: DeviceInfo.isTablet() ? 20 : 14,
    backgroundColor: 'white',
    fontFamily: 'OpenSans-Regular'
  },
  verifyContainer: {
    marginBottom: 20,
    borderWidth: 2,
    borderRadius: 50,
    alignSelf: 'center',
    borderColor: '#fb1b2f'
  }
});
