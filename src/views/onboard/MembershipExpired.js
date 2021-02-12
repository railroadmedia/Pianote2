/**
 * MembershipExpired
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image';
import DeviceInfo from 'react-native-device-info';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

export default class MembershipExpired extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
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

              <TouchableOpacity
                style={localStyles.buttonContainer}
                onPress={() => {
                  this.props.navigation.navigate('NEWMEMBERSHIP', {
                    data: {
                      type: 'EXPIRED',
                      email: this.props.navigation.state.params?.email,
                      password: this.props.navigation.state.params?.password,
                      token: this.props.navigation.state.params?.token
                    }
                  });
                }}
              >
                <Text style={localStyles.buttonText}>RENEW MEMBERSHIP</Text>
              </TouchableOpacity>
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
    fontSize: 18 * factor,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'RobotoCondensed-Bold',
    paddingVertical: 10
  },
  pianoteContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    width: DeviceInfo.isTablet() ? '30%' : '50%',
    aspectRatio: 177 / 53 //svg's viewbox viewBox="0 0 177 53"
  },
  title: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: (DeviceInfo.isTablet() ? 25 : 30) * factor,
    paddingHorizontal: 15,
    textAlign: 'center',
    color: 'white'
  },
  description: {
    fontFamily: 'OpenSans-Regular',
    fontSize: (DeviceInfo.isTablet() ? 14 : 18) * factor,
    padding: 15 * factor,
    textAlign: 'center',
    color: 'white'
  },
  buttonContainer: {
    borderRadius: 60,
    backgroundColor: '#fb1b2f',
    justifyContent: 'center',
    marginHorizontal: '5%',
    marginTop: 10 * factor
  }
});
// borderRadius: 15 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
