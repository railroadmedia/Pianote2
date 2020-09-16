/**
 * GetRestarted
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

export default class GetRestarted extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.centerContent}>
        <View
          key={'welcomeToPianote'}
          style={{
            height: fullHeight,
            width: fullWidth
          }}
        >
          <View
            style={[
              styles.centerContent,
              {
                flex: 0.53,
                alignSelf: 'stretch'
              }
            ]}
          >
            <View
              style={[
                styles.centerContent,
                {
                  position: 'absolute',
                  left: '10%',
                  height: '68%',
                  width: '80%',
                  zIndex: 2
                }
              ]}
            >
              <View
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  backgroundColor: 'white',
                  borderRadius: 15 * factorRatio,
                  flexDirection: 'row',
                  zIndex: 5
                }}
              >
                <View style={{ flex: 1 }}>
                  <FastImage
                    style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: 15 * factorRatio
                    }}
                    source={require('Pianote2/src/assets/img/imgs/onboarding-welcome-back.png')}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 0.47,
              backgroundColor: 'white',
              alignSelf: 'stretch'
            }}
          >
            <Text
              style={{
                fontFamily: 'OpenSans',
                fontSize: 18 * factorRatio,
                textAlign: 'center'
              }}
            >
              Welcome to the Pianote app!
            </Text>
            <View style={{ height: 20 * factorVertical }} />
            <Text
              style={{
                fontFamily: 'OpenSans',
                fontSize: 18 * factorRatio,
                textAlign: 'center'
              }}
            >
              We're so glad you decided to give us{'\n'}another chance. Pick up
              where you{'\n'}left off or you can start exploring!
            </Text>
            <View style={{ height: 155 * factorVertical }} />
            <View
              key={'skip'}
              style={{
                width: fullWidth,
                height: '13.5%',
                alignItems: 'center',
                flexDirection: 'row',
                borderRadius: 30 * factorRatio
              }}
            >
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('WELCOMEBACK');
                }}
                style={[
                  styles.centerContent,
                  {
                    width: '85%',
                    height: '100%',
                    borderRadius: 30 * factorRatio,
                    backgroundColor: '#fb1b2f',
                    zIndex: 5
                  }
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'RobotoCondensed-Bold',
                    fontSize: 18 * factorRatio,
                    color: 'white'
                  }}
                >
                  GET STARTED
                </Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
