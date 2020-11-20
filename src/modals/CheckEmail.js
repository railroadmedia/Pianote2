/**
 * CheckEmail
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';

class CheckEmail extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <View
        key={'container'}
        style={{
          height: fullHeight,
          width: fullWidth,
          backgroundColor: 'transparent'
        }}
      >
        <View
          key={'buffTop'}
          style={{
            height: '32.5%'
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.hideCheckEmail()}
            style={{
              height: '100%',
              width: '100%'
            }}
          ></TouchableOpacity>
        </View>
        <View
          key={'content'}
          style={{
            height: onTablet ? fullHeight * 0.4 : fullHeight * 0.36,
            width: '100%',
            flexDirection: 'row'
          }}
        >
          <View key={'buffLeft'} style={{ width: '5%' }}>
            <TouchableOpacity
              onPress={() => this.props.hideCheckEmail()}
              style={{
                height: '100%',
                width: '100%'
              }}
            ></TouchableOpacity>
          </View>
          <View
            key={'content'}
            style={{
              height: '100%',
              width: '90%',
              backgroundColor: '#f7f7f7',
              borderRadius: 15 * factorRatio
            }}
          >
            <View key={'buffer'} style={{ height: fullHeight * 0.035 }} />
            <View key={'emailTaken'} style={styles.centerContent}>
              <Text
                style={{
                  fontSize: 22 * factorRatio,
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                This email is already {'\n'} connected to an account.
              </Text>
            </View>
            <View style={{ height: fullHeight * 0.035 }} />
            <View key={'toUseThis'}>
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 16 * factorRatio,
                  textAlign: 'center'
                }}
              >
                Do you want to log in instead?
              </Text>
              <View style={{ flex: 1 }} />
            </View>
            <View style={{ height: fullHeight * 0.035 }} />
            <View key={'buttons'}>
              <View
                key={'LOGIN'}
                style={{
                  height: fullHeight * 0.07,
                  flexDirection: 'row'
                }}
              >
                <View style={{ width: '5%' }} />
                <View
                  style={{
                    height: '100%',
                    width: '90%'
                  }}
                >
                  <View style={{ flex: 1 }} />
                  <View
                    style={{
                      height: '80%',
                      width: '100%',
                      borderRadius: 45 * factorRatio,
                      backgroundColor: '#fb1b2f'
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('LOGINCREDENTIALS'),
                          this.props.hideCheckEmail();
                      }}
                      style={{
                        height: '100%',
                        width: '100%'
                      }}
                    >
                      <View style={{ flex: 1 }} />
                      <Text
                        style={{
                          fontFamily: 'OpenSans-Regular',
                          fontSize: 17 * factorRatio,
                          fontWeight: '700',
                          textAlign: 'center',
                          color: 'white'
                        }}
                      >
                        LOG IN
                      </Text>
                      <View style={{ flex: 1 }} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ width: '5%' }} />
              </View>
              <View style={{ flex: 0.15 }} />
              <View
                key={'SIGNUP'}
                style={{
                  height: fullHeight * 0.07,
                  flexDirection: 'row'
                }}
              >
                <View style={{ width: '15%' }} />
                <View
                  style={{
                    height: '100%',
                    width: '70%'
                  }}
                >
                  <View style={{ flex: 1 }} />
                  <View
                    style={{
                      height: '80%',
                      width: '100%',
                      borderRadius: 45 * factorRatio
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.props.hideCheckEmail();
                      }}
                      style={{
                        height: '100%',
                        width: '100%'
                      }}
                    >
                      <View style={{ flex: 1 }} />
                      <Text
                        style={{
                          fontFamily: 'OpenSans-Regular',
                          fontSize: 17 * factorRatio,
                          fontWeight: '700',
                          color: '#fb1b2f',
                          textAlign: 'center'
                        }}
                      >
                        TRY AGAIN
                      </Text>
                      <View style={{ flex: 1 }} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1 }} />
                </View>
                <View style={{ width: '15%' }} />
              </View>
            </View>
          </View>
          <View key={'buffRight'} style={{ width: '5%' }}>
            <TouchableOpacity
              onPress={() => this.props.hideCheckEmail()}
              style={{
                height: '100%',
                width: '100%'
              }}
            ></TouchableOpacity>
          </View>
        </View>
        <View key={'buffBottom'} style={{ height: '27.5%' }}>
          <TouchableOpacity
            onPress={() => this.props.hideCheckEmail()}
            style={{
              height: '100%',
              width: '100%'
            }}
          ></TouchableOpacity>
        </View>
      </View>
    );
  };
}

export default withNavigation(CheckEmail);
