import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-community/async-storage';
import Back from '../../assets/img/svgs/back';
import GradientFeature from '../../components/GradientFeature';
import PasswordHidden from '../../assets/img/svgs/passwordHidden.svg';
import PasswordVisible from '../../assets/img/svgs/passwordVisible.svg';
import { signUp, getUserData } from '../../services/UserDataAuth';
import { NetworkContext } from '../../context/NetworkProvider';
import CreateAccountStepCounter from './CreateAccountStepCounter';
import { goBack, navigate } from '../../../AppNavigator';

const onTablet = global.onTablet;

export default class CreateAccount extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showConfirmPassword: true,
      showPassword: true,
      password: '',
      confirmPassword: '',
      email: props.route?.params?.email,
      scrollViewContentFlex: { flex: 1 }
    };
  }

  savePassword = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    if (this.state.password === this.state.confirmPassword) {
      if (this.state.password.length > 7) {
        if (this.props.route?.params?.purchase) {
          let response = await signUp(
            this.state.email,
            this.state.password,
            this.props.route?.params?.purchase,
            null,
            this.props.route?.params?.purchase
          );
          console.log(response);
          if (response.meta) {
            await AsyncStorage.multiSet([
              ['email', encodeURIComponent(this.state.email)],
              ['password', encodeURIComponent(this.state.password)]
            ]);

            let userData = await getUserData();
            let currentDate = new Date().getTime() / 1000;
            let userExpDate =
              new Date(userData.expirationDate).getTime() / 1000;
            console.log(currentDate, userExpDate);
            if (userData.isLifetime || currentDate < userExpDate) {
              navigate('CREATEACCOUNT3', {
                data: {
                  email: this.state.email,
                  password: this.state.password
                }
              });
            } else {
              navigate('MEMBERSHIPEXPIRED', {
                email: this.state.email,
                password: this.state.password
              });
            }
          } else {
            let { title, detail } = response.errors[0];
            Alert.alert(title, detail, [{ text: 'OK' }], {
              cancelable: false
            });
          }
        } else {
          navigate('NEWMEMBERSHIP', {
            data: {
              type: 'SIGNUP',
              email: this.state.email,
              password: this.state.password
            }
          });
        }
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
              onPress={() => goBack()}
              style={localStyles.createAccountContainer}
            >
              <Back
                width={backButtonSize}
                height={backButtonSize}
                fill={'white'}
              />
            </TouchableOpacity>
            <Text
              style={[
                localStyles.modalHeaderText,
                localStyles.createAccountText
              ]}
            >
              Create Account
            </Text>
            <View />

            <ScrollView
              style={{ flex: 1, marginBottom: 40 }}
              keyboardShouldPersistTaps='handled'
              contentInsetAdjustmentBehavior='never'
              contentContainerStyle={this.state.scrollViewContentFlex}
            >
              <View style={localStyles.createPasswordContainer}>
                <Text style={localStyles.createPasswordText}>
                  Create a password
                </Text>
                <View style={localStyles.passInput}>
                  <TextInput
                    autoCorrect={false}
                    onBlur={() =>
                      this.setState({ scrollViewContentFlex: { flex: 1 } })
                    }
                    onFocus={() => this.setState({ scrollViewContentFlex: {} })}
                    multiline={false}
                    keyboardAppearance={'dark'}
                    placeholderTextColor={'grey'}
                    placeholder={'Password'}
                    keyboardType={isiOS ? 'email-address' : 'default'}
                    secureTextEntry={true}
                    onChangeText={password => this.setState({ password })}
                    style={localStyles.textinput}
                  />
                  {!this.state.showPassword && (
                    <TouchableOpacity
                      style={localStyles.showPassword}
                      onPress={() =>
                        this.setState({
                          showPassword: true
                        })
                      }
                    >
                      <Text>{this.state.password}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        showPassword: !this.state.showPassword
                      });
                    }}
                    style={localStyles.passwordVisible}
                  >
                    {this.state.showPassword ? (
                      <PasswordHidden />
                    ) : (
                      <PasswordVisible />
                    )}
                  </TouchableOpacity>
                </View>
                <Text
                  style={[localStyles.createPasswordText, { marginTop: 25 }]}
                >
                  Confirm password
                </Text>
                <View style={localStyles.passInput}>
                  <TextInput
                    style={localStyles.textinput}
                    autoCorrect={false}
                    onBlur={() =>
                      this.setState({ scrollViewContentFlex: { flex: 1 } })
                    }
                    onFocus={() => this.setState({ scrollViewContentFlex: {} })}
                    multiline={false}
                    keyboardAppearance={'dark'}
                    placeholderTextColor={'grey'}
                    placeholder={'Confirm Password'}
                    keyboardType={isiOS ? 'email-address' : 'default'}
                    secureTextEntry={true}
                    onChangeText={confirmPassword =>
                      this.setState({ confirmPassword })
                    }
                  />
                  {!this.state.showConfirmPassword && (
                    <TouchableOpacity
                      style={localStyles.showPassword}
                      onPress={() =>
                        this.setState({
                          showConfirmPassword: true
                        })
                      }
                    >
                      <Text>{this.state.confirmPassword}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={localStyles.passwordVisible}
                    onPress={() => {
                      this.setState({
                        showConfirmPassword: !this.state.showConfirmPassword
                      });
                    }}
                  >
                    {this.state.showConfirmPassword ? (
                      <PasswordHidden />
                    ) : (
                      <PasswordVisible />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={[localStyles.characters, { marginTop: 10 }]}>
                  Use at least 8 characters
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.password === this.state.confirmPassword) {
                      this.savePassword();
                    }
                  }}
                  style={[
                    localStyles.centerContent,
                    localStyles.savePass,
                    {
                      width: onTablet ? '30%' : '50%',
                      borderColor: colors.pianoteRed,
                      backgroundColor:
                        this.state.password.length > 0 &&
                        this.state.confirmPassword.length > 0 &&
                        this.state.password === this.state.confirmPassword
                          ? colors.pianoteRed
                          : 'transparent'
                    }
                  ]}
                >
                  <Text
                    style={[
                      localStyles.modalButtonText,
                      {
                        color:
                          this.state.password.length > 0 &&
                          this.state.confirmPassword.length > 0 &&
                          this.state.password === this.state.confirmPassword
                            ? 'white'
                            : colors.pianoteRed,
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
              <CreateAccountStepCounter step={2} />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </FastImage>
    );
  }
}

const localStyles = StyleSheet.create({
  createAccountContainer: {
    position: 'absolute',
    left: 15,
    padding: 5,
    alignItems: 'center'
  },
  createAccountText: {
    color: 'white',
    fontSize: onTablet ? 36 : 24,
    alignSelf: 'center'
  },
  createPasswordContainer: {
    flex: 1,
    marginTop: 40,
    justifyContent: 'center'
  },
  createPasswordText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: onTablet ? 24 : 16,
    textAlign: 'left',
    color: 'white',
    paddingLeft: 15
  },
  passInput: {
    borderRadius: 100,
    marginTop: 7.5,
    marginHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  textinput: {
    paddingVertical: 15,
    color: 'black',
    borderRadius: 100,
    marginHorizontal: 15,
    fontSize: onTablet ? 20 : 14,
    backgroundColor: 'white',
    fontFamily: 'OpenSans-Regular'
  },
  showPassword: {
    left: 0,
    right: 50,
    padding: 15,
    height: '100%',
    borderRadius: 100,
    position: 'absolute',
    backgroundColor: 'white'
  },
  passwordVisible: {
    right: 0,
    padding: 15,
    height: '100%',
    aspectRatio: 1,
    position: 'absolute'
  },
  characters: {
    fontFamily: 'OpenSans-Regular',
    textAlign: 'left',
    fontSize: onTablet ? 18 : 14,
    color: 'white',
    paddingLeft: 15,
    marginBottom: 40
  },
  savePass: {
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 50,
    alignSelf: 'center'
  },
  modalHeaderText: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    fontSize: onTablet ? 24 : 18
  },
  modalCancelButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: onTablet ? 16 : 12
  },
  modalButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: onTablet ? 16 : 12
  },
  modalBodyText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: onTablet ? 16 : 12
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  container: {
    flex: 1,
    alignSelf: 'stretch'
  }
});
