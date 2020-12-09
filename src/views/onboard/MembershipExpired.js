/**
 * MembershipExpired
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';

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
          style={{
            bottom: 0,
            position: 'absolute',
            justifyContent: 'flex-end',
            width: '100%',
            height: '70%'
          }}
          colors={['transparent', colors.mainBackground]}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              paddingVertical: '5%',
              justifyContent: 'space-between'
            }}
          >
            <View
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                width: onTablet ? '30%' : '50%',
                aspectRatio: 177 / 53 //svg's viewbox viewBox="0 0 177 53"
              }}
            >
              <Pianote fill={'#fb1b2f'} />
            </View>
            <View>
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                  fontSize: 30 * factorRatio,
                  paddingHorizontal: 15,
                  textAlign: 'center',
                  color: 'white'
                }}
              >
                Your Membership {'\n'} Has Expired
              </Text>
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 18 * factorRatio,
                  padding: 15,
                  textAlign: 'center',
                  color: 'white'
                }}
              >
                Your account no longer has access to Pianote. Click the button
                below to renew your membership - or, if you believe this is an
                error, please contact support@pianote.com
              </Text>

              <TouchableOpacity
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
                style={{
                  borderRadius: 60,
                  backgroundColor: '#fb1b2f',
                  justifyContent: 'center',
                  marginHorizontal: '5%'
                }}
              >
                <Text
                  style={{
                    fontSize: 18 * factorRatio,
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: 'RobotoCondensed-Bold',
                    paddingVertical: 10
                  }}
                >
                  RENEW MEMBERSHIP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </FastImage>
    );
  }
}
