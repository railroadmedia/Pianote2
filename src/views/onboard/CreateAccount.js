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
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';

import Back from '../../assets/img/svgs/back';
import CheckEmail from '../../modals/CheckEmail.js';
import GradientFeature from '../../components/GradientFeature.js';
import commonService from '../../services/common.service.js';
import { NetworkContext } from '../../context/NetworkProvider.js';
import CreateAccountStepCounter from './CreateAccountStepCounter';
import Orientation from 'react-native-orientation-locker';

export default class CreateAccount extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    if (onTablet) Orientation.unlockAllOrientations();
    else Orientation.lockToPortrait();
    this.state = {
      showCheckEmail: false,
      email: '',
      scrollViewContentFlex: { flex: 1 }
    };
  }

  verifyEmail = () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    if (this.state.email.length > 0) {
      fetch(
        `${commonService.rootUrl}/usora/is-email-unique?email=${this.state.email}`
      )
        .then(response => response.json())
        .then(response => {
          console.log(response);
          if (response?.exists) {
            this.setState({ showCheckEmail: true });
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
              style={{
                padding: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Back width={25} height={25} fill={'white'} />
              <Text style={[styles.modalHeaderText, {color: 'white', fontSize: 24*factorRatio}]}>
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
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                  marginBottom: 20 * factorRatio
                }}
              >
                <View id='placeholder' />
                <View style={{ justifyContent: 'center' }}>
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 20 * factorRatio,
                      fontWeight: '600',
                      textAlign: 'left',
                      color: 'white',
                      paddingLeft: 15
                    }}
                  >
                    What's your email?
                  </Text>
                  <TextInput
                    autoCorrect={false}
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
                    style={{
                      padding: 15*factorRatio,
                      marginVertical: 15*factorRatio,
                      color: 'black',
                      fontSize: 15*factorRatio,
                      borderRadius: 100,
                      marginHorizontal: 15,
                      backgroundColor: 'white',
                      fontFamily: 'OpenSans-Regular'
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => this.verifyEmail()}
                    style={[
                      styles.centerContent,
                      {
                        marginBottom: 20 * factorRatio,
                        borderWidth: 2,
                        borderRadius: 50,
                        alignSelf: 'center',
                        borderColor: '#fb1b2f',
                        width: onTablet ? '30%' : '50%',
                        backgroundColor:
                          this.state.email.length > 0
                            ? '#fb1b2f'
                            : 'transparent'
                      }
                    ]}
                  >
                    <Text
                      style={[styles.modalButtonText, {
                        padding: 15,
                        color: this.state.email.length > 0 ? 'white' : '#fb1b2f'
                      }]}
                    >
                      NEXT
                    </Text>
                  </TouchableOpacity>
                </View>
                <CreateAccountStepCounter step={1} />
              </View>
            </ScrollView>
            <Modal
              key={'checkEmailModal'}
              isVisible={this.state.showCheckEmail}
              style={[
                styles.centerContent,
                {
                  margin: 0,
                  height: '100%',
                  width: '100%'
                }
              ]}d
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
          </KeyboardAvoidingView>
        </SafeAreaView>
      </FastImage>
    );
  }
}
