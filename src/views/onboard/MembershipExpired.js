/**
 * MembershipExpired
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import LinearGradient from 'react-native-linear-gradient';

export default class MembershipExpired extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View key={'MembershipExpiredSignup'} style={{ flex: 1 }}>
        <View
          key={'pianote1'}
          style={{
            position: 'absolute',
            top:
              (Platform.OS === 'ios' && fullHeight > 811) || onTablet
                ? fullHeight * 0.03
                : fullHeight * 0.02,
            zIndex: 2,
            alignSelf: 'center'
          }}
        >
          <Pianote
            height={75 * factorRatio}
            width={125 * factorRatio}
            fill={'#fb1b2f'}
          />
        </View>

        <FastImage
          style={{ flex: 1 }}
          source={require('Pianote2/src/assets/img/imgs/lisa-foundations.png')}
          resizeMode={FastImage.resizeMode.cover}
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
          <View
            key={'content1'}
            style={{
              position: 'absolute',
              bottom: fullHeight * 0.165,
              width: fullWidth,
              zIndex: 3
            }}
          >
            <View style={{ flex: 1 }} />
            <Text
              style={{
                fontFamily: 'OpenSans-Bold',
                fontSize: 30 * factorRatio,
                paddingLeft: fullWidth * 0.15,
                paddingRight: fullWidth * 0.15,
                textAlign: 'center',
                color: 'white'
              }}
            >
              Your Membership {'\n'} Has Expired
            </Text>
            <View style={{ height: 25 * factorVertical }} />
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 18 * factorRatio,
                paddingLeft: fullWidth * 0.06,
                paddingRight: fullWidth * 0.06,
                textAlign: 'center',
                color: 'white'
              }}
            >
              Your account no longer has access to Pianote. Click the button
              below to renew your membership - or, if you believe this is an
              error, please contact support@pianote.com
            </Text>
          </View>
          <View
            key={'content1b'}
            style={{
              position: 'absolute',
              bottom: fullHeight * 0.055,
              width: fullWidth,
              zIndex: 3
            }}
          >
            <View
              key={'buttons'}
              style={{
                height: fullHeight * 0.075,
                flexDirection: 'row',
                paddingLeft: fullWidth * 0.02,
                paddingRight: fullWidth * 0.02
              }}
            >
              <View
                style={[
                  styles.centerContent,
                  {
                    flex: 1
                  }
                ]}
              >
                <View
                  style={{
                    height: '80%',
                    width: '95%',
                    borderRadius: 60,
                    backgroundColor: '#fb1b2f'
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('NEWMEMBERSHIP', {
                        data: {
                          type: 'EXPIRED',
                          email: this.props.navigation.state.params?.email,
                          password: this.props.navigation.state.params
                            ?.password,
                          token: this.props.navigation.state.params?.token
                        }
                      });
                    }}
                    style={{
                      height: '100%',
                      width: '100%',
                      justifyContent: 'center'
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18 * factorRatio,
                        textAlign: 'center',
                        color: 'white',
                        fontFamily: 'RobotoCondensed-Bold'
                      }}
                    >
                      RENEW MEMBERSHIP
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </FastImage>
      </View>
    );
  }
}
