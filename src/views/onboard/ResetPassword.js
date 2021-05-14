import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import PasswordMatch from '../../modals/PasswordMatch';
import { SafeAreaView } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import GradientFeature from '../../components/GradientFeature.js';
import PasswordHidden from '../../assets/img/svgs/passwordHidden.svg';
import Back from '../../assets/img/svgs/back';
import PasswordVisible from '../../assets/img/svgs/passwordVisible.svg';
import CustomModal from '../../modals/CustomModal';
import { changePassword } from '../../services/UserDataAuth';
import { NetworkContext } from '../../context/NetworkProvider';
import { navigate } from '../../../AppNavigator';

export default class ResetPassword extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showConfirmPassword: true,
      showPassword: true,
      password: '',
      confirmPassword: '',
      scrollViewContentFlex: { flex: 1 }
    };
  }

  savePassword = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    if (
      this.state.password === this.state.confirmPassword &&
      this.state.password.length > 7
    ) {
      const { email, resetKey } = this.props.route?.params;
      let res = await changePassword(
        email.replace('%40', '@'),
        this.state.password,
        resetKey
      );
      await AsyncStorage.removeItem('resetKey');
      if (res.success) {
        if (res.token) {
          token = res.token;
          await AsyncStorage.multiSet([
            ['email', email],
            ['password', this.state.password]
          ]);
        }
        this.alert.toggle(res.title, res.message);
      } else {
        this.alert.toggle('Something went wrong.', res.message);
      }
    }
  };

  render() {
    return (
      <FastImage
        style={{ flex: 1 }}
        resizeMode={FastImage.resizeMode.cover}
        source={require('../../assets/img/imgs/backgroundHands.png')}
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
              style={{
                padding: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Back
                width={backButtonSize}
                height={backButtonSize}
                fill={'white'}
              />
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                  fontSize: onTablet ? 36 : 24,
                  color: 'white'
                }}
              >
                Reset Password
              </Text>
              <View />
            </TouchableOpacity>
            <ScrollView
              style={{ flex: 1 }}
              keyboardShouldPersistTaps='handled'
              contentInsetAdjustmentBehavior='never'
              contentContainerStyle={this.state.scrollViewContentFlex}
            >
              <View
                style={{
                  flex: 1,
                  marginTop: 40,
                  justifyContent: 'center'
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Bold',
                    fontSize: onTablet ? 24 : 16,
                    textAlign: 'left',
                    color: 'white',
                    paddingLeft: 15
                  }}
                >
                  Create a new password
                </Text>

                <View
                  key={'pass'}
                  style={{
                    marginBottom: 20,
                    borderRadius: 100,
                    marginVertical: 10,
                    marginHorizontal: 15,
                    justifyContent: 'center',
                    backgroundColor: 'white'
                  }}
                >
                  <TextInput
                    autoCorrect={false}
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
                    multiline={false}
                    keyboardAppearance={'dark'}
                    placeholderTextColor={'grey'}
                    placeholder={'Password'}
                    keyboardType={
                      Platform.OS === 'android' ? 'default' : 'email-address'
                    }
                    secureTextEntry={true}
                    onChangeText={password => this.setState({ password })}
                    style={{
                      fontSize: onTablet ? 20 : 14,
                      padding: 15,
                      color: 'black',
                      marginRight: 45,
                      fontFamily: 'OpenSans-Regular'
                    }}
                  />
                  {!this.state.showPassword && (
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          showPassword: true
                        })
                      }
                      style={{
                        left: 0,
                        right: 50,
                        padding: 15,
                        height: '100%',
                        borderRadius: 100,
                        position: 'absolute',
                        backgroundColor: 'white'
                      }}
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
                    style={{
                      right: 0,
                      padding: 15,
                      height: '100%',
                      aspectRatio: 1,
                      position: 'absolute'
                    }}
                  >
                    {this.state.showPassword ? (
                      <PasswordHidden />
                    ) : (
                      <PasswordVisible />
                    )}
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Bold',
                    fontSize: onTablet ? 24 : 16,
                    textAlign: 'left',
                    color: 'white',
                    paddingLeft: 15
                  }}
                >
                  Confirm password
                </Text>
                <View
                  key={'confirm_pass'}
                  style={{
                    borderRadius: 100,
                    marginVertical: 10,
                    marginHorizontal: 15,
                    justifyContent: 'center',
                    backgroundColor: 'white'
                  }}
                >
                  <TextInput
                    autoCorrect={false}
                    multiline={false}
                    keyboardAppearance={'dark'}
                    placeholderTextColor={'grey'}
                    placeholder={'Confirm Password'}
                    keyboardType={
                      Platform.OS === 'android' ? 'default' : 'email-address'
                    }
                    secureTextEntry={true}
                    onChangeText={confirmPassword =>
                      this.setState({ confirmPassword })
                    }
                    style={{
                      fontSize: onTablet ? 20 : 14,
                      padding: 15,
                      color: 'black',
                      marginRight: 45,
                      fontFamily: 'OpenSans-Regular'
                    }}
                  />
                  {!this.state.showConfirmPassword && (
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          showConfirmPassword: true
                        })
                      }
                      style={{
                        left: 0,
                        right: 50,
                        padding: 15,
                        height: '100%',
                        borderRadius: 100,
                        position: 'absolute',
                        backgroundColor: 'white'
                      }}
                    >
                      <Text>{this.state.confirmPassword}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        showConfirmPassword: !this.state.showConfirmPassword
                      });
                    }}
                    style={{
                      right: 0,
                      padding: 15,
                      height: '100%',
                      aspectRatio: 1,
                      position: 'absolute'
                    }}
                  >
                    {this.state.showConfirmPassword ? (
                      <PasswordHidden />
                    ) : (
                      <PasswordVisible />
                    )}
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    textAlign: 'left',
                    fontSize: onTablet ? 18 : 14,
                    color: 'white',
                    paddingLeft: 15,
                    marginBottom: 40
                  }}
                >
                  Use at least 8 characters
                </Text>

                <TouchableOpacity
                  underlayColor={'transparent'}
                  onPress={() => this.savePassword()}
                  style={[
                    styles.centerContent,
                    {
                      borderWidth: 2,
                      borderRadius: 50,
                      alignSelf: 'center',
                      borderColor: '#fb1b2f',
                      width: onTablet ? '30%' : '50%',
                      backgroundColor:
                        this.state.password.length > 0 &&
                        this.state.confirmPassword.length > 0 &&
                        this.state.password === this.state.confirmPassword
                          ? '#fb1b2f'
                          : 'transparent'
                    }
                  ]}
                >
                  <Text
                    style={{
                      padding: 15,
                      fontSize: onTablet ? 20 : 14,
                      fontFamily: 'RobotoCondensed-Bold',
                      color:
                        this.state.password.length > 0 &&
                        this.state.confirmPassword.length > 0 &&
                        this.state.password === this.state.confirmPassword
                          ? 'white'
                          : '#fb1b2f'
                    }}
                  >
                    RESET PASSWORD
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <Modal
            isVisible={this.state.showPasswordMatch}
            style={[styles.centerContent, styles.modalContainer]}
            animation={'slideInUp'}
            animationInTiming={450}
            animationOutTiming={450}
            coverScreen={true}
            hasBackdrop={true}
            onBackButtonPress={() =>
              this.setState({ showPasswordMatch: false })
            }
          >
            <PasswordMatch
              hidePasswordMatch={() => {
                this.setState({
                  showPasswordMatch: false
                });
              }}
            />
          </Modal>
          <CustomModal
            ref={ref => {
              this.alert = ref;
            }}
            additionalBtn={
              <TouchableOpacity
                style={{
                  backgroundColor: colors.pianoteRed,
                  borderRadius: 25,
                  height: 50,
                  marginTop: 10,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={() => {
                  this.alert.toggle();
                  navigate({
                    routeName: 'LOGINCREDENTIALS'
                  });
                }}
              >
                <Text
                  style={{
                    padding: 15,
                    fontSize: 15,
                    color: '#ffffff'
                  }}
                >
                  LOG IN
                </Text>
              </TouchableOpacity>
            }
          />
        </SafeAreaView>
      </FastImage>
    );
  }
}
