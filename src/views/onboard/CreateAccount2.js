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
  Alert,
  ScrollView,
  StyleSheet,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-community/async-storage';

import PasswordMatch from '../../modals/PasswordMatch';
import Back from '../../assets/img/svgs/back';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import PasswordHidden from 'Pianote2/src/assets/img/svgs/passwordHidden.svg';
import PasswordVisible from 'Pianote2/src/assets/img/svgs/passwordVisible.svg';
import { signUp, getUserData } from '../../services/UserDataAuth';
import { NetworkContext } from '../../context/NetworkProvider';
import CreateAccountStepCounter from './CreateAccountStepCounter';

export default class CreateAccount extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showConfirmPassword: true,
      showPassword: true,
      password: '',
      confirmPassword: '',
      email: this.props.navigation.state.params.email,
      scrollViewContentFlex: { flex: 1 }
    };
  }

  savePassword = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    if (this.state.password == this.state.confirmPassword) {
      if (this.state.password.length > 7) {
        if (this.props.navigation.state.params?.purchase) {
          let response = await signUp(
            this.state.email,
            this.state.password,
            this.props.navigation.state.params?.purchase
          );
          console.log(response);
          if (response.meta) {
            try {
              await AsyncStorage.multiSet([
                ['loggedIn', 'true'],
                ['email', this.state.email],
                ['password', this.state.password]
              ]);
            } catch (e) {}

            let userData = await getUserData();
            console.log(userData);
            let currentDate = new Date().getTime() / 1000;
            let userExpDate =
              new Date(userData.expirationDate).getTime() / 1000;
            console.log(currentDate, userExpDate);
            if (userData.isLifetime || currentDate < userExpDate) {
              this.props.navigation.navigate('CREATEACCOUNT3', {
                data: {
                  email: this.state.email,
                  password: this.state.password
                }
              });
            } else {
              this.props.navigation.navigate('MEMBERSHIPEXPIRED', {
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
          this.props.navigation.navigate('NEWMEMBERSHIP', {
            data: {
              type: 'SIGNUP',
              email: this.state.email,
              password: this.state.password
            }
          });
        }
      }
    } else {
      this.setState({ showPasswordMatch: true });
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
              onPress={() => this.props.navigation.goBack()}
              style={localStyles.createAccountContainer}
            >
              <Back width={25} height={25} fill={'white'} />
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
                    keyboardType={
                      Platform.OS == 'android' ? 'default' : 'email-address'
                    }
                    secureTextEntry={true}
                    onChangeText={password => this.setState({ password })}
                    style={localStyles.textinput}
                  />
                  {!this.state.showPassword && (
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          showPassword: true
                        })
                      }
                      style={localStyles.showPassword}
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
                <Text style={localStyles.createPasswordText}>
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
                    keyboardType={
                      Platform.OS == 'android' ? 'default' : 'email-address'
                    }
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
                <Text style={localStyles.characters}>
                  Use at least 8 characters
                </Text>

                <TouchableOpacity
                  onPress={() => this.savePassword()}
                  style={[
                    styles.centerContent,
                    localStyles.savePass,
                    {
                      width: onTablet ? '30%' : '50%',
                      backgroundColor:
                        this.state.password.length > 0 &&
                        this.state.confirmPassword.length > 0 &&
                        this.state.password == this.state.confirmPassword
                          ? '#fb1b2f'
                          : 'transparent'
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      {
                        padding: 15,
                        color:
                          this.state.password.length > 0 &&
                          this.state.confirmPassword.length > 0 &&
                          this.state.password == this.state.confirmPassword
                            ? 'white'
                            : '#fb1b2f'
                      }
                    ]}
                  >
                    NEXT
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginBottom: 40 }}>
                <CreateAccountStepCounter step={2} />
              </View>
            </ScrollView>
            <Modal
              key={'passwordMatch'}
              isVisible={this.state.showPasswordMatch}
              style={[
                styles.centerContent,
                {
                  margin: 0,
                  height: '100%',
                  width: '100%'
                }
              ]}
              animation={'slideInUp'}
              animationInTiming={450}
              animationOutTiming={450}
              coverScreen={true}
              hasBackdrop={true}
            >
              <PasswordMatch
                hidePasswordMatch={() => {
                  this.setState({
                    showPasswordMatch: false
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
  createAccountText: {
    color: 'white',
    fontSize:
      (24 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
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
  createPasswordContainer: {
    flex: 1,
    marginTop: 40,
    justifyContent: 'center'
  },
  createPasswordText: {
    fontFamily: 'OpenSans-Bold',
    fontSize:
      (19 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    textAlign: 'left',
    color: 'white',
    paddingLeft: 15
  },
  passInput: {
    marginBottom: 20,
    borderRadius: 100,
    marginVertical: 10,
    marginHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  textinput: {
    marginVertical:
      (15 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    color: 'black',
    fontSize:
      (15 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    borderRadius: 100,
    marginHorizontal: 15,
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
    fontSize:
      (14 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    color: 'white',
    paddingLeft: 15,
    marginBottom: 40
  },
  savePass: {
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 50,
    alignSelf: 'center',
    borderColor: '#fb1b2f'
  }
});
