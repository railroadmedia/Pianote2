import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import FastImage from 'react-native-fast-image';
import DeviceInfo from 'react-native-device-info';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { navigate } from '../../../AppNavigator';

export default class MembershipExpired extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.route?.params?.email,
      password: props.route?.params?.password
    };
  }

  componentDidMount() {
    if (!this.state.email)
      AsyncStorage.multiGet(['email', 'password']).then(r =>
        this.setState({
          email: r[0][1],
          password: r[1][1]
        })
      );
  }

  render() {
    return (
      <FastImage
        style={{ flex: 1 }}
        resizeMode={FastImage.resizeMode.cover}
        source={require('Pianote2/src/assets/img/imgs/lisa-foundations.png')}
      >
        <LinearGradient
          style={localStyles.linearStyle}
          colors={['transparent', 'black']}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={localStyles.container}>
            <View style={localStyles.pianoteContainer}>
              <Pianote fill={'#fb1b2f'} />
            </View>
            <View>
              <Text style={localStyles.title}>
                Your Membership {'\n'} Has Expired
              </Text>
              <Text style={localStyles.description}>
                Your account no longer has access to Pianote. Click the button
                below to renew your membership - or, if you believe this is an
                error, please contact support@pianote.com
              </Text>
              {this.state.email ? (
                <TouchableOpacity
                  style={localStyles.buttonContainer}
                  onPress={() =>
                    navigate('NEWMEMBERSHIP', {
                      data: {
                        type: 'EXPIRED',
                        email: this.props.route?.params?.email,
                        password: this.props.route?.params?.password,
                        token: this.props.route?.params?.token
                      }
                    })
                  }
                >
                  <Text style={localStyles.buttonText}>RENEW MEMBERSHIP</Text>
                </TouchableOpacity>
              ) : (
                <ActivityIndicator
                  size='large'
                  animating={true}
                  color={colors.pianoteRed}
                  style={{}}
                />
              )}
            </View>
          </View>
        </SafeAreaView>
      </FastImage>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: '5%',
    justifyContent: 'space-between'
  },
  linearStyle: {
    bottom: 0,
    position: 'absolute',
    justifyContent: 'flex-end',
    width: '100%',
    height: '70%'
  },
  buttonText: {
    fontSize: DeviceInfo.isTablet() ? 24 : 16,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'RobotoCondensed-Bold',
    paddingVertical: 10
  },
  pianoteContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    width: DeviceInfo.isTablet() ? '20%' : '30%',
    aspectRatio: 177 / 53 //svg's viewbox viewBox="0 0 177 53"
  },
  title: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: DeviceInfo.isTablet() ? 32 : 24,
    padding: 10,
    textAlign: 'center',
    color: 'white'
  },
  description: {
    fontFamily: 'OpenSans-Regular',
    fontSize: DeviceInfo.isTablet() ? 22 : 16,
    paddingBottom: 25,
    paddingHorizontal: 10,
    textAlign: 'center',
    color: 'white'
  },
  buttonContainer: {
    borderRadius: 60,
    backgroundColor: '#fb1b2f',
    justifyContent: 'center',
    marginHorizontal: '5%',
    marginTop: 10
  }
});
